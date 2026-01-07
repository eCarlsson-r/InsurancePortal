<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class OllamaService
{
    protected $baseUrl = 'http://127.0.0.1:11434/api/generate';

    public function generate($model, $prompt)
    {
        return Http::timeout(300)->post($this->baseUrl, [
            'model' => $model,
            'prompt' => $prompt,
            'stream' => false,
            'format' => 'json', // THIS IS KEY: It forces JSON mode
            'options' => [
                'num_ctx' => 4096,     // Enough for your PDF sections
                'num_predict' => 1000, // Limit the response length
                'temperature' => 0     // Keep it consistent
            ]
        ])->json('response');
    }
}