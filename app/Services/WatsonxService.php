<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

class WatsonxService
{
    protected Client $client;
    protected string $apiKey;
    protected string $projectId;
    protected string $url;
    protected string $modelId;

    public function __construct()
    {
        $this->apiKey = config('ai.providers.watsonx.api_key');
        $this->projectId = config('ai.providers.watsonx.project_id');
        $this->url = config('ai.providers.watsonx.url');
        $this->modelId = config('ai.providers.watsonx.model_id');

        $this->client = new Client([
            'base_uri' => $this->url,
            'timeout' => 30,
            'headers' => [
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ],
        ]);
    }

    /**
     * Generate a narrative text based on statistics and locale
     *
     * @param array $stats Array of statistics to generate narrative from
     * @param string $locale Locale string (e.g., 'en', 'id', 'en_US')
     * @return string Generated narrative text
     * @throws \Exception
     */
    public function generateNarrative(array $stats, string $locale = 'en'): string
    {
        try {
            // Get IBM Cloud IAM token
            $token = $this->getIAMToken();

            // Build the prompt based on stats and locale
            $prompt = $this->buildPrompt($stats, $locale);

            // Make the API request to watsonx.ai
            $response = $this->client->post('/ml/v1/text/generation?version=2023-05-29', [
                'headers' => [
                    'Authorization' => "Bearer {$token}",
                ],
                'json' => [
                    'model_id' => $this->modelId,
                    'input' => $prompt,
                    'parameters' => [
                        'decoding_method' => 'greedy',
                        'max_new_tokens' => 500,
                        'min_new_tokens' => 50,
                        'temperature' => 0.7,
                        'top_k' => 50,
                        'top_p' => 1,
                        'repetition_penalty' => 1.1,
                    ],
                    'project_id' => $this->projectId,
                ],
            ]);

            $body = json_decode($response->getBody()->getContents(), true);

            if (isset($body['results'][0]['generated_text'])) {
                return trim($body['results'][0]['generated_text']);
            }

            throw new \Exception('Invalid response format from watsonx.ai');

        } catch (GuzzleException $e) {
            Log::error('Watsonx API Error: ' . $e->getMessage(), [
                'stats' => $stats,
                'locale' => $locale,
            ]);
            throw new \Exception('Failed to generate narrative: ' . $e->getMessage());
        }
    }

    /**
     * Get IBM Cloud IAM token for authentication
     *
     * @return string IAM token
     * @throws \Exception
     */
    protected function getIAMToken(): string
    {
        try {
            $iamClient = new Client([
                'base_uri' => 'https://iam.cloud.ibm.com',
                'timeout' => 10,
            ]);

            $response = $iamClient->post('/identity/token', [
                'form_params' => [
                    'grant_type' => 'urn:ibm:params:oauth:grant-type:apikey',
                    'apikey' => $this->apiKey,
                ],
                'headers' => [
                    'Content-Type' => 'application/x-www-form-urlencoded',
                    'Accept' => 'application/json',
                ],
            ]);

            $body = json_decode($response->getBody()->getContents(), true);

            if (isset($body['access_token'])) {
                return $body['access_token'];
            }

            throw new \Exception('Failed to retrieve IAM token');

        } catch (GuzzleException $e) {
            Log::error('IAM Token Error: ' . $e->getMessage());
            throw new \Exception('Failed to authenticate with IBM Cloud: ' . $e->getMessage());
        }
    }

    /**
     * Build a prompt for narrative generation based on stats and locale
     *
     * @param array $stats Statistics data
     * @param string $locale Locale string
     * @return string Formatted prompt
     */
    protected function buildPrompt(array $stats, string $locale): string
    {
        // Determine language from locale
        $language = $this->getLanguageFromLocale($locale);

        // Format statistics into a readable string
        $statsText = $this->formatStats($stats);

        // Build the prompt
        $prompt = "You are a professional business analyst. Generate a concise, insightful narrative summary in {$language} based on the following statistics:\n\n";
        $prompt .= $statsText . "\n\n";
        $prompt .= "Provide a clear, professional narrative that highlights key insights, trends, and important observations. ";
        $prompt .= "Keep the tone professional and the language appropriate for business stakeholders.\n\n";
        $prompt .= "Narrative:";

        return $prompt;
    }

    /**
     * Get language name from locale code
     *
     * @param string $locale Locale code
     * @return string Language name
     */
    protected function getLanguageFromLocale(string $locale): string
    {
        $localeMap = [
            'en' => 'English',
            'en_US' => 'English',
            'en_GB' => 'English',
            'id' => 'Indonesian',
            'id_ID' => 'Indonesian',
            'es' => 'Spanish',
            'fr' => 'French',
            'de' => 'German',
            'ja' => 'Japanese',
            'zh' => 'Chinese',
            'zh_CN' => 'Chinese (Simplified)',
            'zh_TW' => 'Chinese (Traditional)',
        ];

        return $localeMap[$locale] ?? 'English';
    }

    /**
     * Format statistics array into readable text
     *
     * @param array $stats Statistics data
     * @return string Formatted statistics text
     */
    protected function formatStats(array $stats): string
    {
        $lines = [];

        foreach ($stats as $key => $value) {
            // Convert snake_case or camelCase to Title Case
            $label = ucwords(str_replace(['_', '-'], ' ', $key));

            // Format the value
            if (is_numeric($value)) {
                $formattedValue = number_format($value, 2);
            } elseif (is_bool($value)) {
                $formattedValue = $value ? 'Yes' : 'No';
            } elseif (is_array($value)) {
                $formattedValue = json_encode($value);
            } else {
                $formattedValue = (string) $value;
            }

            $lines[] = "- {$label}: {$formattedValue}";
        }

        return implode("\n", $lines);
    }
}

// Made with Bob
