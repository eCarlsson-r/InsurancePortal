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
    Route::get('/', [AgencyController::class, 'dashboard'])->name('dashboard');

    Route::prefix('master')->name('master.')->group(function () {
        Route::controller(CustomerController::class)->group(function() {
            Route::get('customer', 'index')->name('customer.index');
            Route::get('customer/create', 'create')->name('customer.create');
            Route::get('customer/{customer}/edit', 'edit')->name('customer.edit');
            Route::post('customer', 'store')->name('customer.store');
            Route::put('customer/{customer}', 'update')->name('customer.update');
            Route::delete('customer/{customer}', 'destroy')->name('customer.destroy');
        });

        Route::controller(AgentController::class)->group(function() {
            Route::get('agent', 'index')->name('agent.index');
            Route::get('agent/create', 'create')->name('agent.create');
            Route::get('agent/{agent}/edit', 'edit')->name('agent.edit');
            Route::post('agent', 'store')->name('agent.store');
            Route::put('agent/{agent}', 'update')->name('agent.update');
            Route::delete('agent/{agent}', 'destroy')->name('agent.destroy');
        });

        Route::controller(ProgramController::class)->group(function() {
            Route::get('program', 'index')->name('program.index');
            Route::get('program/create', 'create')->name('program.create');
            Route::get('program/{program}/edit', 'edit')->name('program.edit');
            Route::post('program', 'store')->name('program.store');
            Route::put('program/{program}', 'update')->name('program.update');
            Route::delete('program/{program}', 'destroy')->name('program.destroy');
            Route::delete('target/{target}', 'remove_target')->name('program.target.destroy');
        });

        Route::controller(AgencyController::class)->group(function() {
            Route::get('agency', 'index')->name('agency.index');
            Route::post('agency', 'store')->name('agency.store');
            Route::put('agency/{agency}', 'update')->name('agency.update');
            Route::delete('agency/{agency}', 'destroy')->name('agency.destroy');
        });

        Route::controller(ProductController::class)->group(function() {
            Route::get('product', 'index')->name('product.index');
            Route::post('product', 'store')->name('product.store');
            Route::put('product/{product}', 'update')->name('product.update');
            Route::delete('product/{product}', 'destroy')->name('product.destroy');
        });

        Route::controller(FundController::class)->group(function() {
            Route::get('fund', 'index')->name('fund.index');
            Route::post('fund', 'store')->name('fund.store');
            Route::put('fund/{fund}', 'update')->name('fund.update');
            Route::delete('fund/{fund}', 'destroy')->name('fund.destroy');
        });

        Route::controller(ContestController::class)->group(function() {
            Route::get('contest', 'index')->name('contest.index');
            Route::post('contest', 'store')->name('contest.store');
            Route::put('contest/{contest}', 'update')->name('contest.update');
            Route::delete('contest/{contest}', 'destroy')->name('contest.destroy');
        });
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

        Route::controller(ReceiptController::class)->group(function() {
            Route::get('receipt', 'index')->name('receipt.index');
            Route::post('receipt', 'store')->name('receipt.store');
            Route::put('receipt/{receipt}', 'update')->name('receipt.update');
            Route::delete('receipt/{receipt}', 'destroy')->name('receipt.destroy');
        });
    });

    Route::prefix('reports')->name('reports.')->group(function () {
        Route::controller(CustomerController::class)->group(function() {
            Route::get('birthday', 'report_birthday')->name('birthday');
            Route::get('religion', 'report_religion')->name('religion');
        });

        Route::controller(PolicyController::class)->group(function() {
            Route::get('production', 'report_production')->name('production');
            Route::get('generation', 'report_generation')->name('generation');
            Route::get('mdrt', 'report_mdrt')->name('mdrt');
            Route::get('empire', 'report_empire')->name('empire');
            Route::get('bonusgap', 'report_bonus_gap')->name('bonusgap');
        });

        Route::controller(AgentController::class)->group(function() {
            Route::get('monthly', 'report_monthly')->name('monthly');
            Route::get('semester', 'report_semester')->name('semester');
            Route::get('annual', 'report_annual')->name('annual');
        });

        Route::get('duedate', [ReceiptController::class, 'report_due_date'])->name('duedate');
        Route::get('financing', [ProgramController::class, 'report_program'])->name('program');
    });

    Route::get('/extraction-status/{id}', function ($id) {
        $status = Cache::get("extraction_status_{$id}", 'Memulai pembacaan...');

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
            'status' => explode('(', $status)[0],
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
