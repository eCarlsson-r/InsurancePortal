<?php

namespace App\Services\Traits;
use Illuminate\Support\Facades\Log;

trait PolicySanitizer
{
    private function sanitizeValue(string $key, $value)
    {
        if (is_null($value) || in_array($value, ["null", "", "undefined"])) return null;

        return match (true) {
            // 1. Currency (Map to your Select options)
            $key === 'case_currency' => $this->cleanCurrency($value),
            $key === 'case_pay_method' => $this->cleanPaymentMethod($value),

            // 2. Money (Handle decimals and separators)
            in_array($key, ['case_base_insure', 'case_premium', 'total_sum_assured']) => $this->cleanMoney($value),

            // 3. Phone Numbers (Convert +62 to 0)
            str_contains($key, 'mobile_phone') || $key === 'customer_mobile' => $this->cleanPhone($value),

            // 4. Genders (L/P or Male/Female to your DB IDs)
            str_contains($key, 'gender') => $this->cleanGender($value),
            str_contains($key, 'religion') => $this->cleanReligion($value),
            str_contains($key, 'marital') => $this->cleanMarital($value),

            // 5. Dates (Handle Indonesian textual months)
            str_contains($key, 'date') || str_contains($key, 'period') => $this->cleanDate($value),

            default => $value,
        };
    }

    private function cleanCurrency($value): string
    {
        $val = strtoupper((string)$value);
        if (preg_match('/(RP|IDR|RUPIAH|1)/i', $val)) return "1";
        if (preg_match('/(USD|\$|DOLLAR|2)/i', $val)) return "2";
        return "1"; // Default Indonesian Context
    }

    private function cleanMoney($value): int
    {
        $val = (string)$value;
        // Truncate decimals .00 or ,00
        $lastSeparator = max(strrpos($val, '.'), strrpos($val, ','));
        if ($lastSeparator !== false) {
            $decimalPart = substr($val, $lastSeparator + 1);
            if (in_array($decimalPart, ['00', '0', ''])) {
                $val = substr($val, 0, $lastSeparator);
            }
        }
        return (int) preg_replace('/[^0-9]/', '', $val);
    }

    private function cleanDate($value)
    {
        if (!$value) return null;

        // Remove common Indonesian noise like "Tgl:" or "Tanggal:"
        $val = preg_replace('/(Tgl|Tanggal|Date):/i', '', (string)$value);
        $val = trim($val);

        try {
            // 1. Handle common Indonesian textual months
            $months = [
                'Januari' => 'January', 'Februari' => 'February', 'Maret' => 'March',
                'Mei' => 'May', 'Juni' => 'June', 'Juli' => 'July', 'Agustus' => 'August',
                'Oktober' => 'October', 'Desember' => 'December'
            ];
            $val = str_ireplace(array_keys($months), array_values($months), $val);

            // 2. Parse using Carbon
            return \Carbon\Carbon::parse($val)->format('Y-m-d');
        } catch (\Exception $e) {
            // 3. Fallback: If AI gives 25/12/1990 (D/M/Y), Carbon might struggle.
            // We manually try to flip it.
            if (preg_match('/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/', $val, $matches)) {
                return "{$matches[3]}-{$matches[2]}-{$matches[1]}";
            }
            return null;
        }
    }

    private function cleanPhone($value): string
    {
        $clean = preg_replace('/[^0-9]/', '', (string)$value);
        if (str_starts_with($clean, '62')) {
            $clean = '0' . substr($clean, 2);
        }
        return str_starts_with($clean, '0') ? $clean : '0' . $clean;
    }

    private function cleanGender($value): string
    {
        $val = strtoupper((string)$value);
        // Assuming 1 = Male, 2 = Female based on common Indonesian DB patterns
        if (preg_match('/(PRIA|LAKI|MALE|L)/i', $val)) return "1";
        if (preg_match('/(WANITA|PEREMPUAN|FEMALE|P)/i', $val)) return "2";
        return $value;
    }

    private function cleanReligion($value): string
    {
        $val = strtoupper((string)$value);
        // Assuming 1 = Islam, 2 = Christian, 3 = Hindu, 4 = Buddhist, 5 = Other based on common Indonesian DB patterns
        if (preg_match('/(BUDDHA|BUDDHISM|BUDHA|4)/i', $val)) return "1";
        if (preg_match('/(KRISTEN|CHRISTIAN|CHRISTIANITY|2)/i', $val)) return "2";
        if (preg_match('/(ISLAM|ISLAMIS|ISLAMIC|ISLAM|1)/i', $val)) return "3";
        if (preg_match('/(HINDU|HINDUISM|HINDU|3)/i', $val)) return "4";
        return $value;
    }

    private function cleanRelationship($value): string
    {
        $val = strtoupper((string)$value);

        return match (true) {
            // Self / Diri Sendiri
            str_contains($val, 'DIRI') || str_contains($val, 'SAMA DENGAN') || $val === 'SDA' => "1",
            
            // Spouse / Pasangan
            str_contains($val, 'SUAMI') || str_contains($val, 'ISTRI') || str_contains($val, 'PASANGAN') => "2",
            
            // Child / Anak
            str_contains($val, 'ANAK') => "3",
            
            // Parent / Orang Tua
            str_contains($val, 'ORANG TUA') || str_contains($val, 'AYAH') || str_contains($val, 'IBU') || str_contains($val, 'KANDUNG') => "4",
            
            // Others
            str_contains($val, 'LAIN') || str_contains($val, 'SAUDARA') => "5",

            default => "5", // Fallback to 'Others'
        };
    }

    private function cleanMarital($value): string
    {
        $val = strtoupper((string)$value);
        // Assuming 1 = Single, 2 = Married, 3 = Widow, 4 = Divorced, 5 = Separated based on common Indonesian DB patterns
        if (preg_match('/(BELUM MENIKAH)/i', $val)) return "1";
        if (preg_match('/(MENIKAH)/i', $val)) return "2";
        if (preg_match('/(KAWIN)/i', $val)) return "2";
        if (preg_match('/(JANDA)/i', $val)) return "3";
        if (preg_match('/(DUDA)/i', $val)) return "4";
        return $value;
    }

    private function cleanPaymentMethod($value): string
    {
        $val = strtoupper((string)$value);
        if (preg_match('/(TAHUN)/i', $val)) return "1";
        if (preg_match('/(SEMESTER)/i', $val)) return "2";
        if (preg_match('/(TRIWULAN)/i', $val)) return "4";
        if (preg_match('/(BULAN)/i', $val)) return "12";
        if (preg_match('/(SEKALIGUS)/i', $val)) return "0";
        return $value;
    }

    private function cleanSignatureDate($value)
    {
        $val = (string)$value;

        // Regex to find a date pattern (DD-MM-YYYY or DD/MM/YYYY) 
        // within the string "Kota Medan 26-09-2025"
        if (preg_match('/(\d{1,2})[\-\/](\d{1,2})[\-\/](\d{4})/', $val, $matches)) {
            // Formulate into Y-m-d for your database
            return "{$matches[3]}-{$matches[2]}-{$matches[1]}";
        }

        // If it's just the date without the city, let the existing cleanDate handle it
        return $this->cleanDate($value);
    }
}