# WatsonxService Usage Guide

## Overview

The `WatsonxService` class provides a wrapper around the watsonx.ai REST API using Guzzle HTTP client. It includes a `generateNarrative` method that accepts statistics data and a locale string to generate AI-powered narrative text.

## Configuration

### 1. Environment Variables

Add the following variables to your `.env` file:

```env
WATSONX_API_KEY=your_ibm_cloud_api_key
WATSONX_PROJECT_ID=your_watsonx_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-13b-chat-v2
```

### 2. Configuration File

The service is configured in `config/ai.php` under the `watsonx` provider:

```php
'watsonx' => [
    'driver' => 'watsonx',
    'api_key' => env('WATSONX_API_KEY'),
    'project_id' => env('WATSONX_PROJECT_ID'),
    'url' => env('WATSONX_URL', 'https://us-south.ml.cloud.ibm.com'),
    'model_id' => env('WATSONX_MODEL_ID', 'ibm/granite-13b-chat-v2'),
],
```

## Usage Examples

### Basic Usage

```php
use App\Services\WatsonxService;

$watsonx = new WatsonxService();

$stats = [
    'total_policies' => 1250,
    'active_claims' => 45,
    'total_premium' => 2500000.50,
    'average_claim_amount' => 15000.75,
    'customer_satisfaction' => 4.5,
];

$narrative = $watsonx->generateNarrative($stats, 'en');

echo $narrative;
```

### With Different Locales

```php
// English
$narrative = $watsonx->generateNarrative($stats, 'en');

// Indonesian
$narrative = $watsonx->generateNarrative($stats, 'id');

// Spanish
$narrative = $watsonx->generateNarrative($stats, 'es');
```

### In a Controller

```php
namespace App\Http\Controllers;

use App\Services\WatsonxService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected WatsonxService $watsonx;

    public function __construct(WatsonxService $watsonx)
    {
        $this->watsonx = $watsonx;
    }

    public function index(Request $request)
    {
        $stats = [
            'total_policies' => Policy::count(),
            'active_claims' => Claim::where('status', 'active')->count(),
            'total_premium' => Policy::sum('premium_amount'),
            'monthly_growth' => 12.5,
        ];

        $locale = $request->user()->locale ?? 'en';

        try {
            $narrative = $this->watsonx->generateNarrative($stats, $locale);
        } catch (\Exception $e) {
            $narrative = 'Unable to generate narrative at this time.';
            \Log::error('Narrative generation failed: ' . $e->getMessage());
        }

        return inertia('Dashboard', [
            'stats' => $stats,
            'narrative' => $narrative,
        ]);
    }
}
```

### Using Dependency Injection

Register the service in `AppServiceProvider` for easier dependency injection:

```php
// app/Providers/AppServiceProvider.php

public function register(): void
{
    $this->app->singleton(WatsonxService::class, function ($app) {
        return new WatsonxService();
    });
}
```

Then use it in your controllers:

```php
public function __construct(
    protected WatsonxService $watsonx
) {}
```

## Method Reference

### `generateNarrative(array $stats, string $locale = 'en'): string`

Generates a narrative text based on statistics and locale.

**Parameters:**
- `$stats` (array): Associative array of statistics to generate narrative from
- `$locale` (string): Locale code (default: 'en')

**Returns:**
- `string`: Generated narrative text

**Throws:**
- `\Exception`: If API request fails or authentication fails

**Supported Locales:**
- `en`, `en_US`, `en_GB` - English
- `id`, `id_ID` - Indonesian
- `es` - Spanish
- `fr` - French
- `de` - German
- `ja` - Japanese
- `zh`, `zh_CN`, `zh_TW` - Chinese

## Error Handling

The service includes comprehensive error handling:

```php
try {
    $narrative = $watsonx->generateNarrative($stats, 'en');
} catch (\Exception $e) {
    // Handle error
    \Log::error('Watsonx error: ' . $e->getMessage());
    $narrative = 'Default narrative text';
}
```

## Features

1. **IBM Cloud IAM Authentication**: Automatically handles token generation and refresh
2. **Flexible Statistics Input**: Accepts any array of key-value pairs
3. **Multi-language Support**: Generates narratives in multiple languages
4. **Automatic Formatting**: Converts statistics into readable format
5. **Error Logging**: Logs errors for debugging
6. **Configurable Model**: Can use different watsonx.ai models
7. **Timeout Handling**: 30-second timeout for API requests

## API Parameters

The service uses the following watsonx.ai generation parameters:

- `decoding_method`: greedy
- `max_new_tokens`: 500
- `min_new_tokens`: 50
- `temperature`: 0.7
- `top_k`: 50
- `top_p`: 1
- `repetition_penalty`: 1.1

These can be customized by modifying the `generateNarrative` method.

## Testing

To test the service, ensure you have valid IBM Cloud credentials:

```bash
php artisan tinker
```

```php
$watsonx = app(\App\Services\WatsonxService::class);
$stats = ['total_users' => 100, 'revenue' => 50000];
$narrative = $watsonx->generateNarrative($stats, 'en');
echo $narrative;
```

## Troubleshooting

### Authentication Errors
- Verify `WATSONX_API_KEY` is correct
- Check IBM Cloud API key permissions

### Connection Errors
- Verify `WATSONX_URL` is correct for your region
- Check network connectivity

### Invalid Response
- Verify `WATSONX_PROJECT_ID` is correct
- Check model availability in your project

## Additional Resources

- [IBM watsonx.ai Documentation](https://cloud.ibm.com/docs/watsonx)
- [watsonx.ai REST API Reference](https://cloud.ibm.com/apidocs/watsonx-ai)
- [IBM Cloud IAM Documentation](https://cloud.ibm.com/docs/account?topic=account-iamoverview)