<?php

namespace App\Jobs;

use App\Services\PolicyExtractionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Smalot\PdfParser\Parser;
use Illuminate\Support\Facades\Cache;

class ProcessPolicyOCR implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 600; // 10 minutes for safety on 8GB RAM

    public function __construct(
        protected string $filePath,
        protected string $ocrId
    ) {}


    public function getPageNavigation($pageOneText)
    {
        $navigation = [];
        $lines = explode("\n", strtoupper($pageOneText));
        $lastSectionName = null;

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;

            // 1. Check if line is a Section Name (starts with -)
            if (str_starts_with($line, '-')) {
                $lastSectionName = trim(ltrim($line, '- '));
                continue;
            }

            // 2. Check if line is just a Number
            if (is_numeric($line) && $lastSectionName !== null) {
                $navigation[] = [
                    'name' => $lastSectionName,
                    'start' => (int)$line
                ];
                $lastSectionName = null; // Reset for next pair
            }
        }
        
        return $navigation;
    }

    public function getSectionText($allPages, $navigation, $targetName)
    {
        $targetName = strtoupper($targetName);
        $text = "";

        foreach ($navigation as $index => $item) {
            if (str_contains($item['name'], $targetName)) {
                $startPage = $item['start'] - 1; // 0-based index
                
                // Determine end page: the start of the next item, or the end of the PDF
                $endPage = isset($navigation[$index + 1]) 
                    ? ($navigation[$index + 1]['start'] - 1) 
                    : count($allPages);

                // Extract only the pages in this range
                for ($i = $startPage; $i < $endPage; $i++) {
                    if (isset($allPages[$i])) {
                        $text .= $allPages[$i]->getText() . "\n";
                    }
                }
                break;
            }
        }
        return $text;
    }

    public function handle(PolicyExtractionService $service)
    {
        $parser = new Parser();
        $pdf = $parser->parseFile($this->filePath);
        $allPages = $pdf->getPages();

        // 1. Get the Map
        $nav = $this->getPageNavigation($allPages[0]->getText());

        // 2. Get the specific text blocks
        $summaryText = $this->getSectionText($allPages, $nav, 'IKHTISAR POLIS');
        $spajText    = $this->getSectionText($allPages, $nav, 'SPAJ');

        // 3. Clean the text to remove non-UTF8/Binary junk
        $summaryText = mb_convert_encoding($summaryText, 'UTF-8', 'UTF-8');
        $spajText    = mb_convert_encoding($spajText, 'UTF-8', 'UTF-8');

        // 3. Process with AI
        // Use $summaryText for Policy Header group
        // Use $spajText for Section I (PP) and Section IV (TU) groups
        $results = $service->extractFullPolicyData($summaryText, $spajText, $this->ocrId);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception)
    {
        Log::error("Job Failed [{$this->ocrId}]: " . $exception->getMessage());

        Cache::put("extraction_status_{$this->ocrId}", "Error: System Timeout. Please try again.", 600);
        
        // This flag tells your React onFinish logic that it's over, but failed.
        Cache::put("ocr_result_{$this->ocrId}", [
            'status' => 'failed',
            'error' => $exception->getMessage()
        ], 600);
    }
}