# Dashboard KPI Specifications

## KPI Overview

This document provides detailed specifications for each KPI (Key Performance Indicator) to be displayed on the insurance portal dashboard.

---

## 1. New Policies This Month vs Last Month

### Purpose
Track policy acquisition trends by comparing current month performance against the previous month.

### Data Source
- **Model**: `Policy` (table: `cases`)
- **Key Field**: `entry_date`

### Calculation Logic
```php
// Current month
$thisMonth = Policy::whereYear('entry_date', now()->year)
    ->whereMonth('entry_date', now()->month)
    ->count();

// Previous month
$lastMonth = Policy::whereYear('entry_date', now()->subMonth()->year)
    ->whereMonth('entry_date', now()->subMonth()->month)
    ->count();

// Calculate change
$change = $thisMonth - $lastMonth;
$percentageChange = $lastMonth > 0 
    ? round(($change / $lastMonth) * 100, 2) 
    : ($thisMonth > 0 ? 100 : 0);
```

### Display Format
```
New Policies
45 policies
↑ 7 (+18.42%) vs last month
```

### Edge Cases
- **No policies last month**: Show 100% increase if current month has policies, 0% if both are zero
- **Negative change**: Display with down arrow (↓) and red color
- **Zero change**: Display "No change" with neutral color

---

## 2. Premium Collected This Month

### Purpose
Show total premium payments received in the current month.

### Data Source
- **Model**: `Receipt` (table: `receipts`)
- **Key Fields**: `paid_date`, `paid_amount`

### Calculation Logic
```php
$premiumCollected = Receipt::whereYear('paid_date', now()->year)
    ->whereMonth('paid_date', now()->month)
    ->whereNotNull('paid_date')
    ->sum('paid_amount');
```

### Display Format
```
Premium Collected
Rp 125,000,000
This month
```

### Additional Metrics (Optional)
- Compare with last month's collection
- Show payment method breakdown
- Display top paying agents

### Edge Cases
- **No payments**: Display "Rp 0"
- **Null paid_date**: Exclude from calculation (unpaid receipts)

---

## 3. MDRT-Tracking Agents

### Purpose
Display agents who are on track to achieve MDRT (Million Dollar Round Table) status.

### Data Source
- **Service**: `ProductionService::dashboard()`
- **Models**: `Agent`, `Policy`, `Contest`
- **Key Metric**: FYP (First Year Premium)

### Calculation Logic
```php
// Reuse existing ProductionService logic
$productionData = $this->productionService->dashboard();
$mdrtStats = $productionData['mdrt_stats'];
$mdrtAgents = $productionData['mdrt'];

// Count agents with current MDRT level
$mdrtCount = collect($mdrtStats)->sum('agent_no');
```

### Display Format
```
MDRT Agents
12 agents
Tracking for 2026
```

### Breakdown by Level
- **MDRT**: Minimum FYP threshold
- **COT** (Court of the Table): 3x MDRT
- **TOT** (Top of the Table): 6x MDRT

### Edge Cases
- **No MDRT agents**: Display "0 agents"
- **Multiple levels**: Show count per level in tooltip/detail view

---

## 4. Active Claims

### Purpose
Monitor claims that require attention or processing.

### Data Source
- **Model**: `Claim` (table: `claims`)
- **Key Field**: `status`

### Calculation Logic
```php
$activeClaims = Claim::whereIn('status', ['pending', 'approved'])
    ->count();

// Breakdown
$pendingClaims = Claim::where('status', 'pending')->count();
$approvedClaims = Claim::where('status', 'approved')->count();
```

### Display Format
```
Active Claims
8 claims
5 pending, 3 approved
```

### Status Definitions
- **pending**: Awaiting review
- **approved**: Approved but not yet paid
- **rejected**: Not counted as active
- **paid**: Not counted as active

### Edge Cases
- **No active claims**: Display "0 claims"
- **Old pending claims**: Consider highlighting claims older than 30 days

---

## 5. Expiring Policies in 30 Days

### Purpose
Alert about policies that will expire soon, enabling proactive renewal outreach.

### Data Source
- **Model**: `Policy` (table: `cases`)
- **Key Fields**: `start_date`, `insure_period` (in years)

### Calculation Logic
```php
$today = now();
$thirtyDaysFromNow = now()->addDays(30);

$expiringPolicies = Policy::whereRaw(
    'DATE_ADD(start_date, INTERVAL insure_period YEAR) BETWEEN ? AND ?',
    [$today, $thirtyDaysFromNow]
)->count();

// Optional: Get list for detail view
$expiringList = Policy::whereRaw(
    'DATE_ADD(start_date, INTERVAL insure_period YEAR) BETWEEN ? AND ?',
    [$today, $thirtyDaysFromNow]
)
->with(['holder', 'agent'])
->orderByRaw('DATE_ADD(start_date, INTERVAL insure_period YEAR)')
->limit(10)
->get();
```

### Display Format
```
Expiring Soon
15 policies
Next 30 days
```

### Additional Information
- Show earliest expiring policy date
- Link to detailed list with customer names
- Enable quick renewal action

### Edge Cases
- **No expiring policies**: Display "0 policies"
- **Already expired**: Exclude from count (separate KPI if needed)
- **Null start_date**: Exclude from calculation

---

## 6. Birthdays This Week

### Purpose
Identify customers with birthdays in the current week for relationship building and marketing.

### Data Source
- **Model**: `Customer` (table: `customers`)
- **Key Field**: `birth_date`
- **Scope**: Customers who are policy holders OR insured persons

### Calculation Logic
```php
$startOfWeek = now()->startOfWeek(); // Monday
$endOfWeek = now()->endOfWeek();     // Sunday

// Get customers with birthdays this week who have policies
$birthdays = Customer::whereRaw(
    'DATE_FORMAT(birth_date, "%m-%d") BETWEEN ? AND ?',
    [
        $startOfWeek->format('m-d'),
        $endOfWeek->format('m-d')
    ]
)
->where(function($query) {
    $query->whereHas('policiesAsHolder')
          ->orWhereHas('policiesAsInsured');
})
->with(['policiesAsHolder', 'policiesAsInsured'])
->get();

$birthdayCount = $birthdays->count();
```

### Display Format
```
Birthdays This Week
6 customers
Mon - Sun
```

### Detail View
```
John Doe - May 18 (Monday)
Jane Smith - May 20 (Wednesday)
...
```

### Edge Cases
- **No birthdays**: Display "0 customers"
- **Null birth_date**: Exclude from calculation
- **Year-end week**: Handle week spanning two years correctly
- **Duplicate customers**: Count unique customers only (if both holder and insured)

### Additional Features
- Send automated birthday greetings
- Offer birthday promotions
- Track birthday contact history

---

## Implementation Priority

1. **High Priority** (Core KPIs):
   - New Policies This Month vs Last Month
   - Premium Collected This Month
   - Active Claims

2. **Medium Priority** (Important but can use existing data):
   - MDRT-Tracking Agents (reuses ProductionService)
   - Expiring Policies in 30 Days

3. **Low Priority** (Nice to have):
   - Birthdays This Week

---

## Performance Targets

- **Query Execution**: < 500ms per KPI
- **Total Dashboard Load**: < 2 seconds
- **Cache Duration**: 5 minutes for production data
- **Real-time Updates**: Claims and new policies (no cache)

---

## Data Refresh Strategy

### Real-time KPIs (No Cache)
- Active Claims
- New Policies (today's count)

### Cached KPIs (5-minute cache)
- Premium Collected
- MDRT Agents
- Expiring Policies
- Birthdays

### Cache Key Format
```php
$cacheKey = "dashboard_kpi_{$kpiName}_" . now()->format('YmdHi');
```

---

## Testing Checklist

### Unit Tests
- [ ] New policies calculation with various date ranges
- [ ] Premium collection with null paid_dates
- [ ] Active claims status filtering
- [ ] Expiring policies date calculation
- [ ] Birthday week calculation across year boundaries

### Integration Tests
- [ ] Full dashboard response structure
- [ ] Data accuracy against database
- [ ] Performance with large datasets

### Edge Case Tests
- [ ] Empty database
- [ ] Single record
- [ ] Boundary dates (month/year transitions)
- [ ] Null values in key fields

---

## Future Enhancements

1. **Trend Analysis**: Show 3-month or 6-month trends
2. **Drill-down**: Click KPI to see detailed breakdown
3. **Alerts**: Notify when KPIs cross thresholds
4. **Export**: Download KPI data as PDF/Excel
5. **Comparison**: Compare with same period last year
6. **Goals**: Set and track KPI targets
7. **Filters**: Filter by agency, agent, product type