<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use HelgeSverre\Extractor\Facades\Text;
use Smalot\PdfParser\Parser;
use App\Services\OllamaService;
use Illuminate\Support\Facades\Cache;

class PolicyExtractionService {
    private function mapAiResponseToDatabase(array $aiData): array
    {
        $map = [
            // Group 1: Customer Basic & ID
            'policy_holder_full_name'      => 'customer_name',
            'policy_holder_gender'         => 'customer_gender',
            'policy_holder_ktp_nik_number' => 'customer_identity',
            'policy_holder_mobile_phone'   => 'customer_mobile',
            'policy_holder_email_address'  => 'customer_email',
            'policy_holder_birth_date'     => 'customer_birthdate',
            'policy_holder_city_of_birth'  => 'customer_birthplace',
            'policy_holder_religion'       => 'customer_religion',
            'policy_holder_marital_status' => 'customer_marital',
            'policy_holder_current_profession' => 'customer_profession',

            // Group 2: Customer Address
            'policy_holder_home_address_street' => 'customer_homeaddress',
            'policy_holder_home_postal_code'    => 'customer_homepostal',
            'policy_holder_home_city'           => 'customer_homecity',
            'policy_holder_work_office_address' => 'customer_workaddress',
            'policy_holder_work_postal_code'    => 'customer_workpostal',
            'policy_holder_work_city'           => 'customer_workcity',

            // Group 3: Insured Details
            'insured_person_full_name'      => 'insured_name',
            'insured_person_city_of_birth'  => 'insured_birthplace',
            'insured_person_birth_date'     => 'insured_birthdate',
            'insured_person_gender'         => 'insured_gender',
            'insured_person_marital_status' => 'insured_marital',
            'insured_person_current_profession' => 'insured_profession',
            'insured_person_home_address'   => 'insured_homeaddress',
            'insured_person_home_postal'    => 'insured_homepostal',
            'insured_person_home_city'      => 'insured_homecity',

            // Group 4: Policy & Finance
            'insurance_policy_number'       => 'policy_no',
            'application_form_number'         => 'case_code',
            'policy_start_effective_date'   => 'case_start_date',
            'total_sum_assured_benefit_amount' => 'case_base_insure',
            'total_premium_amount_to_pay'   => 'case_premium',
            'premium_payment_frequency'     => 'case_pay_method',
            'currency_code'      => 'case_currency',
            'insurance_coverage_period_years' => 'case_insure_period',
            'premium_paying_period_years'   => 'case_pay_period',
        ];

        $mappedData = [];
        foreach ($aiData as $aiKey => $value) {
            $dbKey = $map[$aiKey] ?? $aiKey;
            
            // Clean up the value
            $mappedData[$dbKey] = $this->sanitizeValue($dbKey, $value);
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
                'fields' => "application_form_number, policy_holder_full_name, policy_holder_gender, policy_holder_ktp_nik_number, ".
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
                            "insured_person_home_address, insured_person_home_postal, insured_person_home_city"
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

    private function sanitizeValue(string $key, $value)
    {
        if (is_null($value) || $value === "null" || $value === "") return null;

        if (str_contains($key, 'gender')) {
            $val = strtoupper($value);
            if (str_contains($val, 'LAKI') || str_contains($val, 'PRIA') || $val === 'L') return '1';
            if (str_contains($val, 'PEREMPUAN') || str_contains($val, 'WANITA') || str_contains($val, 'IBU') || $val === 'P') return '2';
        }

        if (str_contains($key, 'religion')) {
            $val = strtoupper($value);
            if (str_contains($val, 'BUDHA') || $val === 'B') return '1';
            if (str_contains($val, 'KRISTEN') || $val === 'K') return '2';
            if (str_contains($val, 'ISLAM') || $val === 'I') return '3';
            if (str_contains($val, 'HINDU') || $val === 'H') return '4';
        }

        if (str_contains($key, 'marital')) {
            $val = strtoupper($value);
            if (str_contains($val, 'BELUM MENIKAH') || $val === 'B') return '1';
            if (str_contains($val, 'MENIKAH') || $val === 'M') return '2';
            if (str_contains($val, 'JANDA') || $val === 'J') return '3';
            if (str_contains($val, 'DUDA') || $val === 'D') return '4';
        }

        if ($key === 'case_currency') {
            $val = strtoupper((string)$value);
            
            // Explicitly check for IDR/Rupiah keywords
            if (preg_match('/(RP|IDR|RUPIAH|1)/i', $val)) {
                return "1";
            }
            
            // Explicitly check for USD/Dollar keywords
            if (preg_match('/(USD|\$|DOLLAR|2)/i', $val)) {
                return "2";
            }

            // Default to Rupiah for Indonesian Context
            return "1";
        }

        // 2. Clean Money/Numbers (remove Rp, dots, commas for database)
        if (in_array($key, ['case_base_insure', 'case_premium'])) {
            $val = (string)$value;

            // 1. Remove the decimal part if it's .00 or ,00
            // We look for the last separator (either dot or comma)
            $lastDot = strrpos($val, '.');
            $lastComma = strrpos($val, ',');
            $lastSeparator = max($lastDot, $lastComma);

            if ($lastSeparator !== false) {
                $decimalPart = substr($val, $lastSeparator + 1);
                
                // If the part after the separator is "00", "0", or empty
                // We truncate the string to exclude the decimal
                if (in_array($decimalPart, ['00', '0', ''])) {
                    $val = substr($val, 0, $lastSeparator);
                }
            }

            // 2. Now safely remove all non-numeric characters ($, Rp, commas, dots)
            $cleanNumber = preg_replace('/[^0-9]/', '', $val);
            
            return (int) $cleanNumber;
        }

        // 3. Clean Dates (ensure YYYY-MM-DD)
        if (str_contains($key, 'date') || str_contains($key, 'birthdate')) {
            try {
                return \Carbon\Carbon::parse($value)->format('Y-m-d');
            } catch (\Exception $e) {
                return $value; // Return original if parse fails
            }
        }

        return $value;
    }
}