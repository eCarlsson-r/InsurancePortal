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
        Route::controller(CustomerController::class)->group(function() {
            Route::get('customer', 'index')->name('customer.index');
            Route::get('customer/create', 'create')->name('customer.create');
            Route::get('customer/{customer}/edit', 'edit')->name('customer.edit');
        });

        Route::controller(AgentController::class)->group(function() {
            Route::get('agent', 'index')->name('agent.index');
            Route::get('agent/create', 'create')->name('agent.create');
            Route::get('agent/{agent}/edit', 'edit')->name('agent.edit');
        });

        Route::controller(ProgramController::class)->group(function() {
            Route::get('program', 'index')->name('program.index');
            Route::get('program/create', 'create')->name('program.create');
            Route::get('program/{program}/edit', 'edit')->name('program.edit');
        });

        Route::controller(AgencyController::class)->group(function() {
            Route::get('agency', 'index')->name('agency.index');
            Route::post('agency', 'store')->name('agency.store');
            Route::put('agency/{agency}', 'update')->name('agency.update');
            Route::delete('agency/{agency}', 'destroy')->name('agency.destroy');
        });
        
        Route::get('product', [ProductController::class, 'index'])->name('product.index');
        Route::get('fund', [FundController::class, 'index'])->name('fund.index');
        Route::get('contest', [ContestController::class, 'index'])->name('contest.index');
    });

    Route::prefix('sales')->name('sales.')->group(function () {
        Route::controller(PolicyController::class)->group(function() {
            Route::get('policy', 'index')->name('policy.index');
            Route::post('policy', 'store')->name('policy.store');
            Route::post('policy/process-ocr', 'processOcr')->name('policy.process-ocr');
            Route::get('policy/create', 'create')->name('policy.create');
            Route::get('policy/{policy}/edit', 'edit')->name('policy.edit');
            Route::put('policy/{policy}', 'update')->name('policy.update');
            Route::get('policy/{policy}/cancel', 'cancel')->name('policy.cancel');
        });
        
        Route::get('receipt', [ReceiptController::class, 'index'])->name('receipt.index');
    });

    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('birthday', [CustomerController::class, 'report_birthday'])->name('birthday');
        Route::get('religion', [CustomerController::class, 'report_religion'])->name('religion');
        Route::get('due-date', [ReceiptController::class, 'report_due_date'])->name('due-date');
        Route::get('production', [PolicyController::class, 'report_production'])->name('production');
        Route::get('generation', [AgentController::class, 'report_generation'])->name('generation');
        Route::get('mdrt', [AgentController::class, 'report_mdrt'])->name('mdrt');
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