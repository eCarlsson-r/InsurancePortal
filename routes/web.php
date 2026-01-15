<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\FundController;
use App\Http\Controllers\AgencyController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ContestController;
use Illuminate\Support\Facades\Cache;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('master')->name('master.')->group(function () {
        Route::get('customer', [CustomerController::class, 'index'])->name('customer.index');
        Route::get('agent', [AgentController::class, 'index'])->name('agent.index');
        Route::get('agent/create', [AgentController::class, 'create'])->name('agent.create');
        Route::get('agent/{agent}/edit', [AgentController::class, 'edit'])->name('agent.edit');
        Route::get('program', [ProgramController::class, 'index'])->name('program.index');
        Route::get('program/create', [ProgramController::class, 'create'])->name('program.create');
        Route::get('program/{program}/edit', [ProgramController::class, 'edit'])->name('program.edit');
        Route::get('product', [ProductController::class, 'index'])->name('product.index');
        Route::get('fund', [FundController::class, 'index'])->name('fund.index');
        Route::get('agency', [AgencyController::class, 'index'])->name('agency.index');
        Route::get('contest', [ContestController::class, 'index'])->name('contest.index');
    });

    Route::prefix('sales')->name('sales.')->group(function () {
        Route::get('policy', [PolicyController::class, 'index'])->name('policy.index');
        Route::post('policy/process-ocr', [PolicyController::class, 'processOcr'])->name('policy.process-ocr');
        Route::get('policy/create', [PolicyController::class, 'create'])->name('policy.create');
        Route::get('policy/{policy}/edit', [PolicyController::class, 'edit'])->name('policy.edit');
        Route::get('receipt', [ReceiptController::class, 'index'])->name('receipt.index');
    });

    Route::get('/extraction-status/{id}', function ($id) {
        $status = Cache::get("extraction_status_{$id}", 'Initializing...');

        // Determine progress percentage for the UI
        if (str_contains($status, '(')) {
            $percentage = explode('(', $status)[1];
            $percentage = explode(')', $percentage)[0];
            $percentage = intval(explode('%', $percentage)[0]);
        } else if ($status == "Completed") {
            $percentage = 100;
        } else {
            $percentage = 0;
        }

        return response()->json([
            'status' => $status,
            'percentage' => $percentage,
            'is_finished' => ($percentage === 100)
        ]);
    });

    Route::get('/ocr/view-file/{ocrId}', function ($ocrId) {
        $cache = Cache::get("ocr_result_{$ocrId}");
        if (!$cache || !isset($cache['file_path'])) abort(404);

        // Return the file from private storage
        return Storage::disk('local')->response($cache['file_path']);
    })->name('ocr.view-file');
});