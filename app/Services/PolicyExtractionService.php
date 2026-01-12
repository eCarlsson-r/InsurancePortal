<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use HelgeSverre\Extractor\Facades\Text;
use Smalot\PdfParser\Parser;
use App\Services\Traits\PolicySanitizer;
use Illuminate\Support\Facades\Cache;

class PolicyExtractionService {
    use PolicySanitizer;
    
    private function mapAiResponseToDatabase(array $aiData): array
    {
        $map = [
            // Group 1: Customer Basic & ID
            'policy_holder_full_name'      => 'customer.name',
            'policy_holder_gender'         => 'customer.gender',
            'policy_holder_ktp_nik_number' => 'customer.identity_number',
            'policy_holder_mobile_phone'   => 'customer.mobile',
            'policy_holder_email_address'  => 'customer.email',
            'policy_holder_birth_date'     => 'customer.birth_date',
            'policy_holder_city_of_birth'  => 'customer.birth_place',
            'policy_holder_religion'       => 'customer.religion',
            'policy_holder_marital_status' => 'customer.marital',
            'policy_holder_current_profession' => 'customer.profession',

            // Group 2: Customer Address
            'policy_holder_home_address_street' => 'customer.home_address',
            'policy_holder_home_postal_code'    => 'customer.home_postal',
            'policy_holder_home_city'           => 'customer.home_city',
            'policy_holder_work_office_address' => 'customer.work_address',
            'policy_holder_work_postal_code'    => 'customer.work_postal',
            'policy_holder_work_city'           => 'customer.work_city',

            // Group 3: Insured Details
            'insured_person_full_name'      => 'insured.name',
            'insured_person_city_of_birth'  => 'insured.birth_place',
            'insured_person_birth_date'     => 'insured.birth_date',
            'insured_person_gender'         => 'insured.gender',
            'insured_person_marital_status' => 'insured.marital',
            'insured_person_current_profession' => 'insured.profession',
            'insured_person_home_address'   => 'insured.home_address',
            'insured_person_home_postal'    => 'insured.home_postal',
            'insured_person_home_city'      => 'insured.home_city',

            // Group 4: Policy & Finance
            'insurance_policy_number'       => 'policy_no',
            'policy_start_effective_date'   => 'start_date',
            'total_sum_assured_benefit_amount' => 'base_insure',
            'total_premium_amount_to_pay'   => 'premium',
            'premium_payment_frequency'     => 'pay_method',
            'currency_code'      => 'currency_id',
            'insurance_coverage_period_years' => 'insure_period',
            'premium_paying_period_years'   => 'pay_period'
        ];

        $mappedData = [];
        foreach ($aiData as $aiKey => $value) {
            $dbKey = $map[$aiKey] ?? $aiKey;
            if (str_contains($dbKey, ".")) {
                $objectKey = explode(".", $dbKey);
                $mappedData[$objectKey[0]][$objectKey[1]] = $this->sanitizeValue($dbKey, $value);
            } else {
                $mappedData[$dbKey] = $this->sanitizeValue($dbKey, $value);
            }

            if ($aiKey === 'distribution_header') {
                $mappedData['id'] = explode(" : ", $value[1]["value"])[1];
                unset($mappedData['distribution_header']);
            }

            if ($aiKey === 'signature_info') {
                $mappedData['entry_date'] = $this->cleanSignatureDate(array_values($value)[0]);
                unset($mappedData['signature_info']);
            }

            if ($aiKey === 'insured_relationship') {
                $policyHolder = strtoupper($mappedData['policy_holder_full_name'] ?? '');
                $insured = strtoupper($mappedData['insured_person_full_name'] ?? '');

                // If names are identical or insured is 'SDA', relationship is always Self (1)
                if ($policyHolder === $insured || $insured === 'SDA' || str_contains($insured, 'SAMA DENGAN')) {
                    $mappedData['holder_insured_relationship'] = "1";
                }

                $mappedData['holder_insured_relationship'] = $this->cleanRelationship($value);
            }
        }

        return $mappedData;
    }

    public function extractFullPolicyData(string $summaryText, string $spajText, string $jobId): array
    {
        $finalData = [];
        
        // Group definitions with their designated data source
        $groups = [
            'policy_metadata' => [
                'source' => $summaryText,
                'fields' => "insurance_policy_number, total_sum_assured_benefit_amount, total_premium_amount_to_pay, ".
                            "policy_start_effective_date, premium_payment_frequency, currency_code (Must be 'IDR' if document mentions Rp, Rupiah, or IDR. Must be 'USD' if document mentions $, USD, or Dollar), ".
                            "insurance_coverage_period_years, premium_paying_period_years"
            ],
            'customer_info' => [
                'source' => $spajText,
                'fields' => "distribution_header (Extract the full text that looks like 'Agency No. : [number]' or 'Channel: [text] No. : [number]'), ".
                            "policy_holder_full_name, policy_holder_gender, policy_holder_ktp_nik_number, ".
                            "policy_holder_email_address, policy_holder_mobile_phone, ".
                            "policy_holder_city_of_birth, policy_holder_birth_date, policy_holder_religion, ".
                            "policy_holder_marital_status, policy_holder_current_profession, ".
                            "policy_holder_home_address_street, policy_holder_home_postal_code, policy_holder_home_city, ".
                            "policy_holder_work_office_address, policy_holder_work_postal_code, policy_holder_work_city"
            ],
            'insured_info' => [
                'source' => $spajText,
                'fields' => "insured_person_full_name, insured_person_gender, insured_person_birth_date, ".
                            "insured_person_city_of_birth, insured_person_marital_status, insured_person_current_profession, ".
                            "insured_person_home_address, insured_person_home_postal, insured_person_home_city, ".
                            "insured_relationship (Look for 'Hubungan'. If the Insured name is the same as Policy Holder or says 'SDA', return 'Self'. Otherwise return Spouse, Child, or Parent), ".
                            "signature_info (Look for 'Ditandatangani di' or 'Signed at'. Extract the city and the date that follows it, e.g., 'Kota Medan 26-09-2025')"
            ]
        ];

        $count = 0;
        foreach ($groups as $name => $config) {
            $percentage = round(($count / count($groups)) * 100);
            Cache::put("extraction_status_{$jobId}", "Sedang membaca {$name} ({$percentage}%)...", 600);

            if ($name === 'insured_info') {
                $sections = $this->getSectionsForAi($config['source']);
                $config['source'] = $sections['TU'] ?? $config['source']; // Focus only on Section IV (TU)
            }
            
            // Pass the specific source text for this group
            $result = $this->askOllamaForFields($config['source'], $config['fields']);
            
            // Map the descriptive AI names back to your DB keys
            $mappedResult = $this->mapAiResponseToDatabase($result);
            $finalData = array_merge($finalData, $mappedResult);

            // 1. Get existing cache to preserve file_path and other metadata
            $currentCache = Cache::get("ocr_result_{$jobId}", []);

            // 2. Put it back with merged data
            Cache::put("ocr_result_{$jobId}", [
                'status'    => 'processing',
                'file_path' => $currentCache['file_path'] ?? null, // PRESERVE THIS
                'file_name' => $currentCache['file_name'] ?? null,
                'data'      => $finalData
            ], 600);
            $count++;
        }

        $currentCache = Cache::get("ocr_result_{$jobId}", []);
        Cache::put("ocr_result_{$jobId}", [
            'status'    => 'completed',
            'file_path' => $currentCache['file_path'] ?? null,
            'data'      => $finalData
        ], 600);

        Cache::put("extraction_status_{$jobId}", "Completed", 600);
        return $finalData;
    }

    private function askOllamaForFields(string $text, string $fields): array
    {
        // 1. Shorten the text to only the first 3000 characters if it's a huge PDF
        $truncatedText = mb_substr($text, 0, 3000); 

        $response = Http::timeout(360)->post("http://localhost:11434/api/generate", [
            'model' => 'llama3.2:1b',
            'prompt' => "Context: {$truncatedText}\n\nTask: Extract {$fields} as JSON.",
            'stream' => false,
            'format' => 'json',
            'options' => [
                'num_ctx' => 2048, // Lower context = faster processing on weak CPUs
                'temperature' => 0,
                'num_thread' => 4,  // Adjust this based on your CPU cores
            ]
        ]);

        if ($response->successful()) {
            return json_decode($response->json('response'), true) ?? [];
        }

        return [];
    }

    public function getSectionsForAi($rawText)
    {
        $data = [];
        $rawText = strtoupper($rawText);
        // Matches POLIS ASURANSI JIWA or IKHTISAR POLIS
        if (preg_match('/(?:POLIS\s*ASURANSI\s*JIWA|IKHTISAR\s*POLIS)(.*?)I\.\s*DATA\s*CALON\s*PEMEGANG\s*POLIS/s', $rawText, $match)) {
            $data['HEADER'] = $match[1];
        }

        // Section I: PP
        if (preg_match('/I\.\s*DATA\s*CALON\s*PEMEGANG\s*POLIS(.*?)(?=II\.|III\.|IV\.|$)/s', $rawText, $match)) {
            $data['PP'] = $match[1];
        }

        // Section IV: TU
        if (preg_match('/IV\.\s*DATA\s*CALON\s*TERTANGGUNG\s*UTAMA(.*?)(?=V\.|VI\.|$)/s', $rawText, $match)) {
            $data['TU'] = $match[1];
        }

        // Section XIV: Date (Look for the very end)
        if (preg_match('/XIV\.\s*DEKLARASI(.*?)$/s', $rawText, $match)) {
            $data['DATE'] = substr($match[1], -1000); // Just the tail for the date
        }

        return $data;
    }
}