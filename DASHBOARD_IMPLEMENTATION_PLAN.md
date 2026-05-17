# Dashboard KPI Implementation Plan

## Overview
Build a new `DashboardController` that returns KPI statistics for the insurance portal dashboard using Policy, Claim, Customer (Nasabah), and Receipt (Kwitansi) models.

## Current System Analysis

### Existing Models
- **Policy** (`cases` table): Stores insurance policies with `entry_date`, `start_date`, `insure_period`, `pay_period`, `premium`
- **Claim** (`claims` table): Stores claims with `status`, `claim_date`, `claim_amount`
- **Customer** (`customers` table): Stores customer data with `birth_date`, `name`
- **Receipt** (`receipts` table): Stores premium payments with `paid_date`, `paid_amount`, `case_id`
- **Agent** (`agents` table): Stores agent information

### Existing Dashboard
- Currently handled by `AgencyController::dashboard()` method
- Uses `ProductionService::dashboard()` for Empire Club and MDRT statistics
- Frontend: `resources/js/pages/dashboard.tsx`

## Required KPIs

### 1. New Policies This Month vs Last Month
**Data Source**: `Policy` model (`cases` table)
**Key Field**: `entry_date`
**Calculation**:
```php
$thisMonth = Policy::whereYear('entry_date', now()->year)
    ->whereMonth('entry_date', now()->month)
    ->count();

$lastMonth = Policy::whereYear('entry_date', now()->subMonth()->year)
    ->whereMonth('entry_date', now()->subMonth()->month)
    ->count();

$change = $thisMonth - $lastMonth;
$percentageChange = $lastMonth > 0 ? (($change / $lastMonth) * 100) : 0;
```

### 2. Premium Collected This Month
**Data Source**: `Receipt` model (`receipts` table)
**Key Fields**: `paid_date`, `paid_amount`
**Calculation**:
```php
$premiumCollected = Receipt::whereYear('paid_date', now()->year)
    ->whereMonth('paid_date', now()->month)
    ->sum('paid_amount');
```

### 3. MDRT-Tracking Agents
**Data Source**: Reuse existing `ProductionService::dashboard()` MDRT logic
**Key Fields**: Agent performance metrics from production query
**Calculation**: Extract MDRT stats from existing ProductionService
```php
$mdrtStats = $productionService->dashboard()['mdrt_stats'];
$mdrtAgents = $productionService->dashboard()['mdrt'];
```

### 4. Active Claims
**Data Source**: `Claim` model (`claims` table)
**Key Field**: `status`
**Calculation**:
```php
$activeClaims = Claim::whereIn('status', ['pending', 'approved'])
    ->count();
```

### 5. Expiring Policies in 30 Days
**Data Source**: `Policy` model (`cases` table)
**Key Fields**: `start_date`, `insure_period` (in years)
**Calculation**:
```php
$expiringPolicies = Policy::whereRaw(
    'DATE_ADD(start_date, INTERVAL insure_period YEAR) BETWEEN ? AND ?',
    [now(), now()->addDays(30)]
)->count();
```

### 6. Birthdays This Week
**Data Source**: `Customer` model (`customers` table)
**Key Field**: `birth_date`
**Scope**: Both policy holders and insured persons
**Calculation**:
```php
$startOfWeek = now()->startOfWeek();
$endOfWeek = now()->endOfWeek();

$birthdays = Customer::whereRaw(
    'DATE_FORMAT(birth_date, "%m-%d") BETWEEN ? AND ?',
    [
        $startOfWeek->format('m-d'),
        $endOfWeek->format('m-d')
    ]
)
->whereHas('policiesAsHolder')
->orWhereHas('policiesAsInsured')
->with(['policiesAsHolder', 'policiesAsInsured'])
->get();
```

## Implementation Structure

### Backend Components

#### 1. DashboardController
**Location**: `app/Http/Controllers/DashboardController.php`

**Methods**:
- `index()`: Main dashboard method returning all KPIs

**Dependencies**:
- `ProductionService` (for MDRT stats)
- Models: `Policy`, `Claim`, `Customer`, `Receipt`

#### 2. Update Customer Model
Add relationships for policies:
```php
public function policiesAsHolder()
{
    return $this->hasMany(Policy::class, 'holder_id');
}

public function policiesAsInsured()
{
    return $this->hasMany(Policy::class, 'insured_id');
}
```

### Frontend Components

#### Update dashboard.tsx
**Location**: `resources/js/pages/dashboard.tsx`

**New KPI Cards**:
1. New Policies Card (with comparison badge)
2. Premium Collected Card
3. MDRT Agents Card (keep existing)
4. Active Claims Card
5. Expiring Policies Card
6. Birthdays This Week Card

**Layout**: 
- Top row: 6 KPI cards (2 rows of 3 cards each)
- Bottom section: Existing Empire Club and MDRT tables

### Routes Update

**File**: `routes/web.php`

**Change**:
```php
// FROM:
Route::get('/dashboard', [AgencyController::class, 'dashboard'])->name('dashboard');

// TO:
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
```

## Data Structure

### Controller Response Format
```php
return Inertia::render('dashboard', [
    'kpis' => [
        'new_policies' => [
            'this_month' => 45,
            'last_month' => 38,
            'change' => 7,
            'percentage_change' => 18.42
        ],
        'premium_collected' => [
            'amount' => 125000000,
            'formatted' => 'Rp 125,000,000'
        ],
        'mdrt_agents' => [
            'count' => 12,
            'stats' => [...] // from ProductionService
        ],
        'active_claims' => [
            'count' => 8,
            'pending' => 5,
            'approved' => 3
        ],
        'expiring_policies' => [
            'count' => 15,
            'list' => [...] // optional: top 5 for quick view
        ],
        'birthdays' => [
            'count' => 6,
            'list' => [...] // customer names and dates
        ]
    ],
    // Keep existing data for Empire Club and MDRT tables
    'empire_club' => [...],
    'empire_stats' => [...],
    'mdrt' => [...],
    'mdrt_stats' => [...]
]);
```

## Implementation Steps

1. **Create DashboardController**
   - Generate controller file
   - Inject ProductionService dependency
   - Implement index() method with all KPI calculations

2. **Update Customer Model**
   - Add policy relationships

3. **Update Routes**
   - Point dashboard route to new controller

4. **Update Frontend**
   - Modify dashboard.tsx to display new KPI cards
   - Keep existing Empire Club and MDRT tables
   - Add proper formatting for currency and percentages

5. **Testing**
   - Verify all KPI calculations
   - Test with edge cases (no data, zero values)
   - Ensure existing functionality remains intact

## Performance Considerations

- Use eager loading for relationships
- Consider caching for expensive queries (MDRT calculations)
- Use database indexes on frequently queried fields:
  - `entry_date` on policies
  - `paid_date` on receipts
  - `status` on claims
  - `birth_date` on customers

## Migration Path

Since we're creating a new controller:
1. Old dashboard route can be kept temporarily for rollback
2. New controller doesn't break existing functionality
3. Frontend changes are additive (new KPI cards + existing tables)

## Success Criteria

- ✅ All 6 KPIs display correctly
- ✅ Existing Empire Club and MDRT tables still work
- ✅ Performance is acceptable (< 2 seconds load time)
- ✅ Data is accurate and matches database queries
- ✅ UI is responsive and user-friendly