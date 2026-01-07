<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PolicyController;
use Illuminate\Support\Facades\Cache;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('master')->name('master.')->group(function () {
        Route::get('agency', function () {
            return Inertia::render('agency');
        })->name('agency.index');
        Route::get('agent', [AgentController::class, 'index'])->name('agent.index');
        Route::get('agent/create', [AgentController::class, 'create'])->name('agent.create');
        Route::get('agent/{agent}/edit', [AgentController::class, 'edit'])->name('agent.edit');
    });

    Route::prefix('sales')->name('sales.')->group(function () {
        Route::get('policy', [PolicyController::class, 'index'])->name('policy.index');
        Route::post('policy/process-ocr', [PolicyController::class, 'processOcr'])->name('policy.process-ocr');
        Route::get('policy/create', [PolicyController::class, 'create'])->name('policy.create');
        Route::get('policy/{policy}/edit', [PolicyController::class, 'edit'])->name('policy.edit');
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
});

require __DIR__.'/settings.php';
