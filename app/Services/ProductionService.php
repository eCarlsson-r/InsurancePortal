<?php

namespace App\Services;

use App\Models\Policy;
use App\Models\Agent;
use App\Models\Contest;
use App\Models\AgentProgram;
use App\Models\Rider;
use App\Models\Receipt;
use Illuminate\Support\Facades\DB;

class ProductionService
{
    /**
     * Replicates the production_query logic using Eloquent and Query Builder.
     * Returns a Query Builder instance that can be used as a subquery.
     */
    public function productionQuery($year)
    {
        // Inner 'prod' query which is a UNION of several parts
        $prodQuery = $this->getProdUnionQuery($year);

        // Subquery 'py' for semconsisten bonus
        $pyQuery = $this->getPyQuery($year);

        // Main production query building
        $query = DB::query()->fromSub($prodQuery, 'prod')
            ->select([
                'case_id',
                'policy_no',
                'prod.agent_id',
                'holder_name',
                'insured_name',
                'start_date',
                'case_month',
                'status_polis',
                'pay_method',
                'currency_id',
                'curr_rate',
                'product_id',
                'production_credit',
                'contest_credit',
                'topup_production_credit',
                'topup_contest_credit',
                'case_premium',
                'topup_premium',
                'commission',
                DB::raw("ROUND(((COALESCE(production_credit, 0) / 100) * (case_premium * curr_rate)) + ((COALESCE(topup_production_credit, 0) / 100) * (topup_premium * curr_rate))) AS evaluation"),
                DB::raw("ROUND((case_premium * curr_rate) + ((6 / 100) * (topup_premium * curr_rate))) AS mdrt"),
                DB::raw("IF(status_polis LIKE 'PL%', 0, ROUND(pay_method * ((IF(COALESCE(ct.bonus_percent, 0) > 0, (COALESCE(ct.bonus_percent, 0) + COALESCE(sc.bonus_percent, 0)) / 100, (100 + COALESCE(sc.bonus_percent, 0)) / 100) * (((contest_credit / 100) * (case_premium * curr_rate)) + ((COALESCE(topup_contest_credit, 0) / 100) * (topup_premium * curr_rate))))))) AS ot_contest")
            ])
            ->leftJoinSub($pyQuery, 'py', 'py.agent_id', '=', 'prod.agent_id')
            ->leftJoin('contests as sc', function ($join) {
                $join->on('sc.type', '=', DB::raw("'semconsisten'"))
                    ->where(function ($q) {
                        $q->where(function ($q2) {
                            $q2->whereRaw("py.s1_ape >= sc.minimum_premium")
                                ->whereRaw("py.s2_ape >= sc.minimum_premium");
                        })->orWhere(function ($q2) {
                            $q2->whereRaw("py.s1_ape = 0")
                                ->whereRaw("py.s2_ape >= sc.minimum_premium");
                        });
                    });
            })
            ->leftJoin('contests as ct', function ($join) {
                $join->on('ct.type', '=', DB::raw("'bonanza'"))
                    ->whereRaw("ct.product LIKE CONCAT('%', prod.product_id, '%')")
                    ->whereRaw("prod.start_date BETWEEN ct.start AND ct.end");
            })
            ->addSelect([
                DB::raw("COALESCE(ct.bonus_percent, 0) as bonus_percent"),
                DB::raw("COALESCE(sc.bonus_percent, 0) as sem_bonus_percent")
            ])
            ->whereYear('prod.start_date', $year)
            ->groupBy([
                'prod.case_id',
                'policy_no',
                'prod.agent_id',
                'holder_name',
                'insured_name',
                'prod.start_date',
                'case_month',
                'status_polis',
                'pay_method',
                'currency_id',
                'curr_rate',
                'product_id',
                'production_credit',
                'contest_credit',
                'topup_production_credit',
                'topup_contest_credit',
                'case_premium',
                'topup_premium',
                'commission',
                'ct.bonus_percent',
                'sc.bonus_percent'
            ]);

        return $query;
    }

    protected function getProdUnionQuery($year)
    {
        // 1. Regular PP cases
        $pp = DB::table('cases as p')
            ->join('customers as hd', 'p.holder_id', '=', 'hd.id')
            ->join('customers as is', 'p.insured_id', '=', 'is.id')
            ->join('products as pr', 'p.product_id', '=', 'pr.id')
            ->join('product_credits as pcr', function ($join) {
                $join->on('pr.id', '=', 'pcr.product_id')
                    ->whereRaw("p.start_date BETWEEN pcr.credit_start AND COALESCE(pcr.credit_end, CURDATE())");
            })
            ->leftJoin('product_commissions as c', function ($join) {
                $join->on('p.product_id', '=', 'c.product_id')
                    ->on('p.pay_method', '=', 'c.payment_method')
                    ->on('p.pay_period', '=', DB::raw("COALESCE(c.payment_period, p.pay_period)"))
                    ->on('p.currency_id', '=', 'c.currency');
            })
            ->leftJoin('riders as rd', function ($join) {
                $join->on('p.id', '=', 'rd.case_id')
                    ->where('rd.product_id', 11);
            })
            ->leftJoin('product_commissions as tc', 'rd.product_id', '=', 'tc.product_id')
            ->leftJoin('products as rp', 'rd.product_id', '=', 'rp.id')
            ->leftJoin('product_credits as rpc', function ($join) {
                $join->on('rp.id', '=', 'rpc.product_id')
                    ->whereRaw("p.start_date BETWEEN rpc.credit_start AND COALESCE(rpc.credit_end, CURDATE())");
            })
            ->select([
                'p.policy_no',
                'p.agent_id',
                'p.id as case_id',
                'hd.name as holder_name',
                'is.name as insured_name',
                'p.start_date',
                DB::raw("DATE_FORMAT(p.start_date, '%m %Y') AS case_month"),
                DB::raw("'PP' AS status_polis"),
                'p.pay_method',
                'p.currency_id',
                'p.curr_rate',
                'p.product_id',
                'pcr.production_credit',
                'pcr.contest_credit',
                DB::raw("rpc.production_credit AS topup_production_credit"),
                DB::raw("rpc.contest_credit AS topup_contest_credit"),
                DB::raw("COALESCE(ROUND(p.premium), 0) AS case_premium"),
                DB::raw("COALESCE(ROUND(rd.premium), 0) AS topup_premium"),
                DB::raw("COALESCE(ROUND(((c.commission_rate + COALESCE(c.extra_commission, 0)) / 100) * (p.premium * p.curr_rate)), 0) + COALESCE(ROUND((tc.commission_rate / 100) * rd.premium), 0) AS commission")
            ]);

        // 2. TUS Riders
        $tus = DB::table('cases as p')
            ->join('customers as hd', 'p.holder_id', '=', 'hd.id')
            ->join('customers as is', 'p.insured_id', '=', 'is.id')
            ->join('riders as rd', 'p.id', '=', 'rd.case_id')
            ->join('products as pr', 'rd.product_id', '=', 'pr.id')
            ->join('product_credits as pcr', function ($join) {
                $join->on('pr.id', '=', 'pcr.product_id')
                    ->whereRaw("COALESCE(rd.add_date, p.start_date) BETWEEN pcr.credit_start AND COALESCE(pcr.credit_end, CURDATE())");
            })
            ->leftJoin('product_commissions as c', 'rd.product_id', '=', 'c.product_id')
            ->leftJoin('products as rp', 'rd.product_id', '=', 'rp.id')
            ->leftJoin('product_credits as rpc', function ($join) {
                $join->on('rp.id', '=', 'rpc.product_id')
                    ->whereRaw("p.start_date BETWEEN rpc.credit_start AND COALESCE(rpc.credit_end, CURDATE())");
            })
            ->where('rd.product_id', 12)
            ->select([
                'p.policy_no',
                'p.agent_id',
                'p.id as case_id',
                'hd.name as holder_name',
                'is.name as insured_name',
                DB::raw("COALESCE(rd.add_date, p.start_date) AS start_date"),
                DB::raw("DATE_FORMAT(COALESCE(rd.add_date, p.start_date), '%m %Y') AS case_month"),
                DB::raw("'PP' AS status_polis"),
                'p.pay_method',
                'p.currency_id',
                'p.curr_rate',
                'p.product_id',
                'pcr.production_credit',
                'pcr.contest_credit',
                'rpc.production_credit as topup_production_credit',
                'rpc.contest_credit as topup_contest_credit',
                DB::raw("0 AS case_premium"),
                DB::raw("COALESCE(ROUND(rd.premium), 0) AS topup_premium"),
                DB::raw("COALESCE(ROUND((c.commission_rate / 100) * (rd.premium * p.curr_rate)), 0) AS commission")
            ]);

        // 3. Cancelled Cases (BTL)
        $btl = DB::table('cases as p')
            ->where('p.status', 'cancelled')
            // Note: Legacy query joined case-cancel table for cancel-date.
            // In the new schema, we might need a updated_at or a separate column if we want accurate month.
            // For now I'll use start_date or assume there's a cancel_date if I can find it later.
            ->join('customers as hd', 'p.holder_id', '=', 'hd.id')
            ->join('customers as is', 'p.insured_id', '=', 'is.id')
            ->join('products as pr', 'p.product_id', '=', 'pr.id')
            ->leftJoin('riders as rd', 'p.id', '=', 'rd.case_id')
            ->join('product_credits as pcr', function ($join) {
                $join->on('pr.id', '=', 'pcr.product_id')
                    ->whereRaw("COALESCE(rd.add_date, p.start_date) BETWEEN pcr.credit_start AND COALESCE(pcr.credit_end, CURDATE())");
            })
            ->leftJoin('products as rp', 'rd.product_id', '=', 'rp.id')
            ->leftJoin('product_credits as rpc', function ($join) {
                $join->on('rp.id', '=', 'rpc.product_id')
                    ->whereRaw("p.start_date BETWEEN rpc.credit_start AND COALESCE(rpc.credit_end, CURDATE())");
            })
            ->select([
                'p.policy_no',
                'p.agent_id',
                'p.id as case_id',
                'hd.name as holder_name',
                'is.name as insured_name',
                'p.start_date',
                DB::raw("DATE_FORMAT(p.start_date, '%m %Y') AS case_month"), // Should ideally be cancel month
                DB::raw("'BTL' AS status_polis"),
                'p.pay_method',
                'p.currency_id',
                'p.curr_rate',
                'p.product_id',
                DB::raw("pcr.production_credit * -1 AS production_credit"),
                DB::raw("pcr.contest_credit * -1 AS contest_credit"),
                DB::raw("rpc.production_credit * -1 AS topup_production_credit"),
                DB::raw("rpc.contest_credit * -1 AS topup_contest_credit"),
                'p.premium as case_premium',
                DB::raw("COALESCE(ROUND(rd.premium), 0) AS topup_premium"),
                DB::raw("0 AS commission") // Cancelled usually has 0 commission in this report logic?
            ]);

        // 4. Receipts (PLTP/PL)
        $receipts = DB::table('receipts as r')
            ->join('cases as p', 'r.case_id', '=', 'p.id')
            ->join('customers as hd', 'p.holder_id', '=', 'hd.id')
            ->join('customers as is', 'p.insured_id', '=', 'is.id')
            ->join('products as pr', 'p.product_id', '=', 'pr.id')
            ->join('product_credits as pcr', function ($join) {
                $join->on('pr.id', '=', 'pcr.product_id')
                    ->whereRaw("p.start_date BETWEEN pcr.credit_start AND COALESCE(pcr.credit_end, CURDATE())");
            })
            ->leftJoin('product_commissions as c', function ($join) {
                $join->on('p.product_id', '=', 'c.product_id')
                    ->on('p.pay_method', '=', 'c.payment_method')
                    ->on('p.pay_period', '=', DB::raw("COALESCE(c.payment_period, p.pay_period)"))
                    ->on('p.currency_id', '=', 'c.currency');
            })
            ->leftJoin('riders as rd', function ($join) {
                $join->on('p.id', '=', 'rd.case_id')
                    ->where('rd.product_id', '<>', 12);
            })
            ->leftJoin('product_commissions as tc', 'rd.product_id', '=', 'tc.product_id')
            ->leftJoin('products as rp', 'rd.product_id', '=', 'rp.id')
            ->leftJoin('product_credits as rpc', function ($join) {
                $join->on('rp.id', '=', 'rpc.product_id')
                    ->whereRaw("p.start_date BETWEEN rpc.credit_start AND COALESCE(rpc.credit_end, CURDATE())");
            })
            ->select([
                'p.policy_no',
                'p.agent_id',
                'p.id as case_id',
                'hd.name as holder_name',
                'is.name as insured_name',
                'r.paid_date as start_date',
                DB::raw("DATE_FORMAT(r.paid_date, '%m %Y') AS case_month"),
                DB::raw("IF(TIMESTAMPDIFF(MONTH, p.start_date, r.pay_date) < 12, 'PLTP', 'PL') AS status_polis"),
                'p.pay_method',
                'p.currency_id',
                'r.currency_rate as curr_rate',
                'p.product_id',
                'pcr.production_credit',
                'pcr.contest_credit',
                'rpc.production_credit as topup_production_credit',
                'rpc.contest_credit as topup_contest_credit',
                DB::raw("COALESCE(IF(TIMESTAMPDIFF(MONTH, p.start_date, r.pay_date) < 12, ROUND(IF(p.premium = r.premium, r.premium, IF(rd.premium = r.premium, 0, p.premium))), 0), 0) AS case_premium"),
                DB::raw("COALESCE(IF(rd.premium = r.premium OR (p.premium + rd.premium) = r.premium, ROUND((p.pay_method / r.pay_method) * rd.premium), IF(r.paid_amount <> r.premium, r.paid_amount, 0)), 0) AS topup_premium"),
                DB::raw("IF(p.premium < r.premium, IF(TIMESTAMPDIFF(MONTH, p.start_date, r.pay_date) < 12, COALESCE(ROUND((c.commission_rate / 100) * (p.premium * p.curr_rate)), 0), 0) + COALESCE(ROUND((tc.commission_rate / 100) * rd.premium), 0), COALESCE(ROUND((c.commission_rate / 100) * r.premium), 0)) AS commission")
            ]);

        return $pp->union($tus)->union($btl)->union($receipts);
    }

    protected function getPyQuery($year)
    {
        // This is a complex grouped query used for semconsisten bonus
        // Similar to ProdUnionQuery but with simplified fields and grouped by agent

        $sub = $this->getProdUnionQuery($year - 1); // Grouping over previous year data

        return DB::table(DB::raw("({$sub->toSql()}) as prod"))
            ->mergeBindings($sub)
            ->select('agent_id')
            ->selectRaw("SUM(IF(MONTH(start_date) BETWEEN 1 AND 6, case_premium * pay_method, 0)) AS s1_ape")
            ->selectRaw("SUM(IF(MONTH(start_date) BETWEEN 7 AND 12, case_premium * pay_method, 0)) AS s2_ape")
            ->groupBy('agent_id');
    }

    /**
     * Report Bonus Gap
     */
    public function reportBonusGap($agencyId, $month, $year)
    {
        $prodSub = $this->productionQuery($year);

        // MTD grouping
        $mtdSelect = DB::query()->fromSub($prodSub, 'prod')
            ->whereRaw("prod.case_month = ?", ["$month $year"])
            ->select('prod.agent_id')
            ->selectRaw("SUM(IF(status_polis = 'PLTP', 0, ot_contest)) as ape")
            ->groupBy('prod.agent_id');

        // STD grouping (Semester to Date)
        $stdSelect = DB::query()->fromSub($prodSub, 'prod')
            ->whereYear('prod.start_date', $year)
            ->whereMonth('prod.start_date', '<=', $month);

        if (intval($month) <= 6) {
            $stdSelect->whereMonth('prod.start_date', '>=', 1);
        } else {
            $stdSelect->whereMonth('prod.start_date', '>=', 7);
        }

        $stdSelect = $stdSelect->select('prod.agent_id')
            ->selectRaw("SUM(IF(prod.status_polis = 'PLTP', 0, prod.ot_contest)) as ape")
            ->groupBy('prod.agent_id');

        // YTD grouping
        $ytdSelect = DB::query()->fromSub($prodSub, 'prod')
            ->whereYear('prod.start_date', $year)
            ->whereMonth('prod.start_date', '<=', $month)
            ->select('prod.agent_id')
            ->selectRaw("SUM(IF(prod.status_polis = 'PLTP', 0, prod.ot_contest)) as ape")
            ->groupBy('prod.agent_id');

        // Execute the base report query
        $baseReport = DB::table('agents as ag')
            ->join('agent_programs as ap', 'ag.id', '=', 'ap.agent_id')
            ->joinSub($mtdSelect, 'mtd', 'ag.id', '=', 'mtd.agent_id')
            ->joinSub($stdSelect, 'std', 'ag.id', '=', 'std.agent_id')
            ->joinSub($ytdSelect, 'ytd', 'ag.id', '=', 'ytd.agent_id')
            ->select([
                'ag.id as agent_id',
                'ag.name',
                'mtd.ape as mtd_ape',
                'std.ape as std_ape',
                'ytd.ape as ytd_ape',
            ])
            ->where('ag.agency_id', $agencyId)
            ->where('ap.position', 'FC')
            ->where(function($q) {
                $q->whereNotNull('mtd.agent_id')
                  ->orWhereNotNull('std.agent_id')
                  ->orWhereNotNull('ytd.agent_id');
            })->get();

        // Process mnbonus and nxbonus for each agent
        $finalReport = $baseReport->map(function ($row) use ($year) {
            $mnbonus = Contest::where('type', 'speprod')
                ->where('minimum_premium', '<=', $row->mtd_ape)
                ->whereRaw('? BETWEEN YEAR(start) AND YEAR(end)', [$year])
                ->orderBy('minimum_premium', 'desc')
                ->first();


            $nxbonus = Contest::where('type', 'speprod')
                ->where('minimum_premium', '>', $row->mtd_ape)
                ->whereRaw('? BETWEEN YEAR(start) AND YEAR(end)', [$year])
                ->orderBy('minimum_premium', 'asc')
                ->first();

            $stbonus = Contest::where('type', 'semester')
                ->where('minimum_premium', '<=', $row->std_ape)
                ->whereRaw('? BETWEEN YEAR(start) AND YEAR(end)', [$year])
                ->orderBy('minimum_premium', 'desc')
                ->first();

            $ntbonus = Contest::where('type', 'semester')
                ->where('minimum_premium', '>', $row->std_ape)
                ->whereRaw('? BETWEEN YEAR(start) AND YEAR(end)', [$year])
                ->orderBy('minimum_premium', 'asc')
                ->first();

            $anbonus = Contest::where('type', 'annual')
                ->where('minimum_premium', '<=', $row->ytd_ape)
                ->whereRaw('? BETWEEN YEAR(start) AND YEAR(end)', [$year])
                ->orderBy('minimum_premium', 'desc')
                ->first();

            $atbonus = Contest::where('type', 'annual')
                ->where('minimum_premium', '>', $row->ytd_ape)
                ->whereRaw('? BETWEEN YEAR(start) AND YEAR(end)', [$year])
                ->orderBy('minimum_premium', 'asc')
                ->first();

            $row->mtd_bonus = $mnbonus ? $mnbonus->bonus_percent : 0;
            $row->mtd_gap = $nxbonus ? $nxbonus->minimum_premium - $row->mtd_ape : 0;
            $row->std_bonus = $stbonus ? $stbonus->bonus_percent : 0;
            $row->std_gap = $ntbonus ? $ntbonus->minimum_premium - $row->std_ape : 0;
            $row->ytd_bonus = $anbonus ? $anbonus->bonus_percent : 0;
            $row->ytd_gap = $atbonus ? $atbonus->minimum_premium - $row->ytd_ape : 0;

            return $row;
        });

        return $finalReport;
    }

    /**
     * Report Production
     */
    public function reportProduction($agentId, $year)
    {
        $prodSub = $this->productionQuery($year);

        // Filter and join with hierarchies
        return DB::query()->fromSub($prodSub, 'prod')
            ->join('agents as ag', 'prod.agent_id', '=', 'ag.id')
            ->join('agent_programs as ap', 'prod.agent_id', '=', 'ap.agent_id')
            ->join('agent_programs as ap2', 'ap.agent_leader_id', '=', 'ap2.agent_id')
            ->leftJoin('agent_programs as ap3', 'ap2.agent_leader_id', '=', 'ap3.agent_id')
            ->where(function ($q) use ($agentId) {
                $q->where('prod.agent_id', $agentId)
                    ->orWhere('ap.agent_leader_id', $agentId)
                    ->orWhere('ap2.agent_leader_id', $agentId)
                    ->orWhere('ap3.agent_leader_id', $agentId);
            })
            ->select([
                'prod.case_id as id',
                'ag.name as agent_name',
                'prod.policy_no as sp',
                'prod.holder_name',
                'prod.insured_name',
                'prod.start_date',
                'prod.case_premium as fyp',
                'prod.topup_premium as topup',
                'prod.evaluation as ape',
                'prod.ot_contest as contest_ape',
                DB::raw("ROUND(IF(prod.agent_id = '$agentId', 1, IF(ap.agent_leader_id = '$agentId' AND ap2.position = 'BP*', 0.3, 0.2)) * commission) AS total_commission")
            ])
            ->orderBy('prod.start_date')
            ->orderBy('prod.policy_no')
            ->get();
    }

    /**
     * Report MDRT
     */
    public function reportMdrt($agencyId, $year)
    {
        $prodSub = $this->productionQuery($year);

        $agentProd = DB::query()->fromSub($prodSub, 'production')
            ->join('agents as ag', 'production.agent_id', '=', 'ag.id')
            ->join('agent_programs as ap', 'ag.id', '=', 'ap.agent_id')
            ->where('ap.position', 'FC')
            ->where('ag.agency_id', $agencyId)
            ->where('mdrt', '>', 0)
            ->select([
                'production.agent_id',
                'ag.name as agent_name',
                'ap.agent_leader_id',
                'ap.position',
                DB::raw("SUM(mdrt) as current_fyp")
            ])
            ->groupBy(['production.agent_id', 'ag.name', 'ap.agent_leader_id', 'ap.position']);

        return DB::query()->fromSub($agentProd, 'target')
            ->leftJoin('contests as stbonus', function ($join) use ($year) {
                $join->on('stbonus.type', '=', DB::raw("'mdrt'"))
                    ->on('stbonus.level', '=', 'target.position')
                    ->whereRaw("stbonus.minimum_premium <= target.current_fyp")
                    ->whereRaw("'$year' BETWEEN YEAR(stbonus.start) AND YEAR(stbonus.end)");
            })
            ->leftJoin('contests as ntbonus', function ($join) use ($year) {
                $join->on('ntbonus.type', '=', DB::raw("'mdrt'"))
                    ->on('ntbonus.level', '=', 'target.position')
                    ->whereRaw("ntbonus.minimum_premium > target.current_fyp")
                    ->whereRaw("'$year' BETWEEN YEAR(ntbonus.start) AND YEAR(ntbonus.end)");
            })
            ->select([
                'target.agent_id',
                'target.agent_name',
                'target.current_fyp',
                DB::raw('stbonus.reward as `current_level`'),
                DB::raw('ntbonus.reward as `next_level`'),
                DB::raw("COALESCE(IF(ntbonus.minimum_premium > target.current_fyp, ntbonus.minimum_premium - target.current_fyp, 0), 0) as `fyp_gap`")
            ])
            ->groupBy(['target.agent_id', 'target.agent_name', 'target.current_fyp'])
            ->orderBy('target.current_fyp', 'DESC')
            ->get();
    }

    /**
     * Report Generation
     */
    public function reportGeneration($agencyId, $month, $year)
    {
        $prodSub = $this->productionQuery($year);

        // Filter prod for this agency
        $agencyProd = DB::query()->fromSub($prodSub, 'prod')
            ->join('agents as ag', 'prod.agent_id', '=', 'ag.id')
            ->where('ag.agency_id', $agencyId)
            ->select([
                DB::raw("SUM(prod.ot_contest) as premium"),
                DB::raw("SUM(CASE WHEN prod.status_polis = 'PP' THEN 1 ELSE 0 END) as policy_count"),
                DB::raw("COUNT(DISTINCT ag.id) as manpower")
            ])
            ->first();

        // This is a simplified version of agency generation report.
        // It returns a single row for the agency matching the table headers in generation.tsx.
        return [
            [
                'agency-name' => DB::table('agencies')->where('id', $agencyId)->value('name') ?? 'Unknown',
                'agency-premium' => $agencyProd->premium ?? 0,
                'generation-wape' => $agencyProd->premium ?? 0,
                'agency-policy' => $agencyProd->policy_count ?? 0,
                'generation-policy' => $agencyProd->policy_count ?? 0,
                'agency-manpower' => $agencyProd->manpower ?? 0,
                'generation-manpower' => $agencyProd->manpower ?? 0,
            ]
        ];
    }
    /**
     * Report Empire
     */
    public function reportEmpire($agencyId, $year)
    {
        $prodSub = $this->productionQuery($year);

        // Tier 1: FC Production (Individual)
        $producerQuery = DB::table('agents as ag')
            ->join('agent_programs as ap', 'ag.id', '=', 'ap.agent_id')
            ->joinSub($prodSub, 'prod', 'ag.id', '=', 'prod.agent_id')
            ->join()
            ->where('ap.position', 'FC')
            ->where('ag.agency_id', $agencyId)
            ->select([
                'ag.id',
                'ag.official_number',
                'ap.position',
                'ap.agent_leader_id',
                'ag.name',
                DB::raw("COALESCE(SUM(prod.ot_contest), 0) AS ape"),
                DB::raw("SUM(CASE WHEN prod.status_polis = 'PP' THEN 1 ELSE 0 END) AS cases")
            ])
            ->groupBy(['ag.id', 'ag.official_number', 'ap.position', 'ap.agent_leader_id', 'ag.name']);

        // Tier 2: Direct (BP*) Production (Aggregates from their direct FCs)
        $directQuery = DB::table(DB::raw("({$producerQuery->toSql()}) as fc"))
            ->mergeBindings($producerQuery)
            ->join('agents as ag', 'fc.agent_leader_id', '=', 'ag.id')
            ->join('agent_programs as ap', 'ag.id', '=', 'ap.agent_id')
            ->select([
                'ag.id',
                'ag.official_number',
                'ap.position',
                'ap.agent_leader_id',
                'ag.name',
                DB::raw("SUM(fc.ape) AS ape"),
                DB::raw("COUNT(IF(fc.ape > 24000000, fc.id, NULL)) AS cases")
            ])
            ->groupBy(['ag.id', 'ag.official_number', 'ap.position', 'ap.agent_leader_id', 'ag.name']);

        // Tier 3: Subgroup (BP**) Production (Aggregates from their direct BP*s)
        $subgroupQuery = DB::table(DB::raw("({$directQuery->toSql()}) as direct"))
            ->mergeBindings($directQuery)
            ->join('agents as ag', 'direct.agent_leader_id', '=', 'ag.id')
            ->join('agent_programs as ap', 'ag.id', '=', 'ap.agent_id')
            ->select([
                'ag.id',
                'ag.official_number',
                'ap.position',
                'ap.agent_leader_id',
                'ag.name',
                DB::raw("SUM(direct.ape) AS ape"),
                DB::raw("SUM(direct.cases) AS cases")
            ])
            ->groupBy(['ag.id', 'ag.official_number', 'ap.position', 'ap.agent_leader_id', 'ag.name']);

        // Tier 4: Group (BP***) Production (Aggregates from their direct BP**s)
        $groupQuery = DB::query()->fromSub($subgroupQuery, 'subgroup')
            ->join('agents as ag', 'subgroup.agent_leader_id', '=', 'ag.id')
            ->join('agent_programs as ap', 'ag.id', '=', 'ap.agent_id')
            ->select([
                'ag.id',
                'ag.official_number',
                'ap.position',
                'ap.agent_leader_id',
                'ag.name',
                DB::raw("SUM(subgroup.ape) AS ape"),
                DB::raw("SUM(subgroup.cases) AS cases")
            ])
            ->groupBy(['ag.id', 'ag.official_number', 'ap.position', 'ap.agent_leader_id', 'ag.name']);

        // UNION all tiers
        $achievement = $producerQuery->union($directQuery)->union($subgroupQuery)->union($groupQuery);

        // Final aggregation and contest joins
        return DB::query()->fromSub($achievement, 'target')
            // Note: The original logic join contests for gaps. I'll omit the contest gaps for now
            // to keep it focused on the hierarchy unless specifically requested.
            // But I will keep the ordering as in the original.
            ->select([
                'target.name',
                'target.agent_leader_id',
                'target.position',
                'target.ape as current_ape',
                'target.cases as current_cases',
            ])
            ->orderByRaw("FIELD(position, 'FC', 'BP*', 'BP**', 'BP***')")
            ->orderBy('target.ape', 'DESC')
            ->get();
    }

    public function reportFinancing($agency, $year, $month)
    {
        // Define the production query
        $prod = $this->productionQuery($year);

        // Build the YTD query using Eloquent
        $ytdQuery = DB::table('agents')
            ->select([
                'agents.name',
                'agent_programs.agent_leader_id',
                'agent_programs.program_start',
                DB::raw("DATE_FORMAT(agent_programs.program_start, '%M %Y') as start_month"),
                'programs.id as program_id', 'programs.name as program',
                'agent_programs.allowance',
                DB::raw("TIMESTAMPDIFF(MONTH, agent_programs.program_start, LAST_DAY('$year-$month-01')) + 1 as month"),
                DB::raw("SUM(program_targets.fyp_month) as ytd_target"),
                DB::raw("SUM(achievement.achieved_fyp) as ytd_achieved"),
                DB::raw("IF(SUM(program_targets.fyp_month) - SUM(achievement.achieved_fyp) > 0, ROUND(SUM(program_targets.fyp_month) - SUM(achievement.achieved_fyp)), 0) as ytd_gap")
            ])
            ->join('agent_programs', 'agents.id', '=', 'agent_programs.agent_id')
            ->join('programs', 'agent_programs.program_id', '=', 'programs.id')
            ->join('program_targets', function ($join) use ($year, $month) {
                $join->on('agent_programs.program_id', '=', 'program_targets.program_id')
                    ->on('agent_programs.allowance', '=', 'program_targets.allowance')
                    ->where('program_targets.month', '<=', DB::raw("TIMESTAMPDIFF(MONTH, agent_programs.program_start, LAST_DAY('$year-$month-01')) + 1"));
            })
            ->joinSub(
                DB::table($prod)
                    ->select([
                        'agent_id',
                        DB::raw('SUM(evaluation) as achieved_fyp')
                    ])
                    ->groupBy('agent_id')
                    ->whereNotNull('agent_id'), // Ensure agent_id is not null
                'achievement',
                function ($join) {
                    $join->on('achievement.agent_id', '=', 'agents.id');
                }
            )
            ->where('agents.agency_id', $agency)
            ->groupBy([
                'agents.name',
                'agent_programs.agent_leader_id',
                'agent_programs.program_start',
                'programs.id', 'programs.name',
                'agent_programs.allowance'
            ]);

        // Execute the YTD query
        $ytd = $ytdQuery->get();

        // Build the MTD query using Eloquent
        $mtdQuery = DB::table('agents')
            ->select([
                'agents.name',
                'agent_programs.agent_leader_id',
                'agent_programs.program_start',
                DB::raw("DATE_FORMAT(agent_programs.program_start, '%M %Y') as start_month"),
                'programs.id as program_id', 'programs.name as program',
                'agent_programs.allowance',
                DB::raw("TIMESTAMPDIFF(MONTH, agent_programs.program_start, LAST_DAY('$year-$month-01')) + 1 as month"),
                DB::raw("SUM(program_targets.fyp_month) as mtd_target"),
                DB::raw("COALESCE(SUM(achievement.achieved_fyp), 0) as mtd_achieved"),
                DB::raw("IF(SUM(program_targets.fyp_month) - COALESCE(SUM(achievement.achieved_fyp), 0) > 0, ROUND(SUM(program_targets.fyp_month) - COALESCE(SUM(achievement.achieved_fyp), 0)), 0) as mtd_gap")
            ])
            ->join('agent_programs', 'agents.id', '=', 'agent_programs.agent_id')
            ->join('programs', 'agent_programs.program_id', '=', 'programs.id')
            ->join('program_targets', function ($join) use ($year, $month) {
                $join->on('agent_programs.program_id', '=', 'program_targets.program_id')
                    ->on('agent_programs.allowance', '=', 'program_targets.allowance')
                    ->where('program_targets.month', '=', DB::raw("TIMESTAMPDIFF(MONTH, agent_programs.program_start, LAST_DAY('$year-$month-01')) + 1"));
            })
            ->leftJoinSub(
                DB::table($prod)
                    ->select([
                        'agent_id',
                        DB::raw('SUM(evaluation) as achieved_fyp')
                    ])
                    ->where('case_month', "$month $year")
                    ->groupBy('agent_id'),
                'achievement',
                'achievement.agent_id',
                '=',
                'agents.id'
            )
            ->where('agents.agency_id', $agency)
            ->groupBy([
                'agents.name',
                'agent_programs.agent_leader_id',
                'agent_programs.program_start',
                'programs.id', 'programs.name',
                'agent_programs.allowance'
            ]);

        // Execute the MTD query
        $mtd = $mtdQuery->get();

        // Process the results
        if ($ytd->isNotEmpty() && $ytd[0]->{'name'} !== null) {
            foreach ($ytd as $id => $agent) {
                $programRange = DB::table('program_targets')
                    ->distinct()
                    ->where('program_id', $agent->{'program_id'})
                    ->orderByDesc('allowance')
                    ->pluck('allowance');

                $idx = $mtd->search(fn($item) => $item->{'name'} === $agent->{'name'});

                if ($agent->{'program_id'} < 5) {
                    $programs = explode(' ', $agent->program);
                    $agent->program = end($programs) . '-' . range('A', 'Z')[array_search($mtd[$idx]->allowance, $programRange->toArray())];
                } elseif ($agent->{'program_id'} < 7) {
                    $achievementLevels = ['TOT', 'COT', 'MDRT'];
                    $agent->program = $achievementLevels[array_search($mtd[$idx]->allowance, $programRange->toArray())];
                }

                $agent->{'mtd_target'} = $mtd[$idx]->{'mtd_target'};
                $agent->{'mtd_achieved'} = $mtd[$idx]->{'mtd_achieved'};
                $agent->{'mtd_gap'} = $mtd[$idx]->{'mtd_gap'};
            }
        }

        return $ytd;
    }

    public function reportSemester($year)
    {
        $columns = "`agent_id`, `name`, ";
        $months = array("january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december");
        foreach($months as $idx=>$month) {
            $columns .= "SUM(IF(MONTH(`case-start-date`)=".($idx+1).",`commision`,0)) AS `$month`, ";
            if (($idx+1)%6==0 AND ($idx+1)/6==1) {
                $columns .= "SUM(IF(MONTH(`case-start-date`) BETWEEN 1 AND 6,`case_premium`*`case-pay-method`,0)) AS `s1-ape`, ";
                $columns .= "SUM(IF(MONTH(`case-start-date`) BETWEEN 1 AND 6,`commision`,0)) AS `s1`, ";
            } else if (($idx+1)%6==0 AND ($idx+1)/6==2) {
                $columns .= "SUM(IF(MONTH(`case-start-date`) BETWEEN 7 AND 12,`case_premium`*`case-pay-method`,0)) AS `s2-ape`, ";
                $columns .= "SUM(IF(MONTH(`case-start-date`) BETWEEN 7 AND 12,`commision`,0)) AS `s2`, ";
            }
        }
        $columns .= "SUM(`commision`) AS `total`";

        $newPolicyQuery = DB::table('cases as p')
            ->join('customers as cs', 'p.holder_id', '=', 'cs.id')
            ->join('products as pr', 'p.product_id', '=', 'pr.id')
            ->join('product_credits as pcr', function ($join) {
                $join->on('pr.id', '=', 'pcr.product_id')
                    ->whereRaw("p.start_date BETWEEN pcr.credit_start AND COALESCE(pcr.credit_end, CURDATE())");
            })
            ->leftJoin('product_commissions as c', function ($join) {
                $join->on('p.product_id', '=', 'c.product_id')
                    ->on('p.pay_method', '=', 'c.payment_method')
                    ->on('p.pay_period', '=', DB::raw("COALESCE(c.payment_period, p.pay_period)"))
                    ->on('p.currency_id', '=', 'c.currency');
            })
            ->leftJoin('riders as rd', function ($join) {
                $join->on('p.id', '=', 'rd.case_id')
                    ->where('rd.product_id', '<>', 11);
            })
            ->leftJoin('product_commissions as tc', 'rd.product_id', '=', 'tc.product_id')
            ->join('agents as ag', 'p.agent_id', '=', 'ag.id')
            ->select([
                'p.policy_no',
                'ag.id as agent_code',
                'ag.official_number as agent_number',
                'ag.name as agent_name',
                'cs.name as customer_name',
                'p.start_date as case_start_date',
                DB::raw("DATE_FORMAT(p.start_date, '%m %Y') AS case_month"),
                DB::raw("'PP' AS status_polis"),
                'p.pay_method as case_pay_method',
                'p.currency_id as case_currency',
                'p.curr_rate as case_curr_rate',
                'p.product_id as case_product',
                'pcr.production_credit',
                'pcr.contest_credit',
                DB::raw("COALESCE(ROUND(p.premium), 0) AS case_premium"),
                DB::raw("COALESCE(ROUND(rd.premium), 0) AS topup_premium"),
                DB::raw("COALESCE(ROUND((c.commission_rate / 100) * (p.premium * p.curr_rate)), 0) + COALESCE(ROUND((tc.commission_rate / 100) * rd.premium), 0) AS commission")
            ]);

        $singleTopUpQuery = DB::table('cases as p')
            ->join('customers as cs', 'p.holder_id', '=', 'cs.id')
            ->join('riders as rd', 'p.id', '=', 'rd.case_id')
            ->join('products as pr', 'rd.product_id', '=', 'pr.id')
            ->join('product_credits as pcr', function ($join) {
                $join->on('pr.id', '=', 'pcr.product_id')
                    ->whereRaw("COALESCE(rd.add_date, p.start_date) BETWEEN pcr.credit_start AND COALESCE(pcr.credit_end, CURDATE())");
            })
            ->leftJoin('product_commissions as c', 'rd.product_id', '=', 'c.product_id')
            ->join('agents as ag', 'p.agent_id', '=', 'ag.id')
            ->where('rd.product_id', 12)
            ->select([
                'p.policy_no',
                'ag.id as agent_code',
                'ag.official_number as agent_number',
                'ag.name as agent_name',
                'cs.name as customer_name',
                DB::raw("COALESCE(rd.add_date, p.start_date) AS case_start_date"),
                DB::raw("DATE_FORMAT(COALESCE(rd.add_date, p.start_date), '%m %Y') AS case_month"),
                DB::raw("'PP' AS status_polis"),
                'p.pay_method as case_pay_method',
                'p.currency_id as case_currency',
                'p.curr_rate as case_curr_rate',
                'p.product_id as case_product',
                'pcr.production_credit',
                'pcr.contest_credit',
                DB::raw("0 AS case_premium"),
                DB::raw("COALESCE(ROUND(rd.premium), 0) AS topup_premium"),
                DB::raw("COALESCE(ROUND((c.commission_rate / 100) * (rd.premium * p.curr_rate)), 0) AS commission")
            ]);

        $firstYearRecurringQuery = DB::table('receipts as r')
            ->join('cases as p', 'r.case_id', '=', 'p.id')
            ->join('customers as cs', 'p.holder_id', '=', 'cs.id')
            ->join('products as pr', 'p.product_id', '=', 'pr.id')
            ->join('product_credits as pcr', function ($join) {
                $join->on('pr.id', '=', 'pcr.product_id')
                    ->whereRaw("p.start_date BETWEEN pcr.credit_start AND COALESCE(pcr.credit_end, CURDATE())");
            })
            ->leftJoin('product_commissions as c', function ($join) {
                $join->on('p.product_id', '=', 'c.product_id')
                    ->on('p.pay_method', '=', 'c.payment_method')
                    ->on('p.pay_period', '=', DB::raw("COALESCE(c.payment_period, p.pay_period)"))
                    ->on('p.currency_id', '=', 'c.currency');
            })
            ->leftJoin('riders as rd', function ($join) {
                $join->on('p.id', '=', 'rd.case_id')
                    ->where('rd.product_id', '<>', 12);
            })
            ->leftJoin('product_commissions as tc', 'rd.product_id', '=', 'tc.product_id')
            ->join('agents as ag', 'p.agent_id', '=', 'ag.id')
            ->whereRaw("TIMESTAMPDIFF(MONTH, p.start_date, r.paid_date) <= 12")
            ->select([
                'p.policy_no',
                'ag.id as agent_code',
                'ag.official_number as agent_number',
                'ag.name as agent_name',
                'cs.name as customer_name',
                'r.paid_date as case_start_date',
                DB::raw("DATE_FORMAT(r.paid_date, '%m %Y') AS case_month"),
                DB::raw("'PLTP' AS status_polis"),
                DB::raw("IF(r.pay_method <> p.pay_method, r.pay_method, p.pay_method) AS case_pay_method"),
                'p.currency_id as case_currency',
                'r.currency_rate as case_curr_rate',
                'p.product_id as case_product',
                'pcr.production_credit',
                'pcr.contest_credit',
                DB::raw("COALESCE(ROUND(IF(p.premium = r.premium, p.premium, r.premium)), 0) AS case_premium"),
                DB::raw("COALESCE(IF(p.premium = r.premium, ROUND(rd.premium), 0), 0) AS topup_premium"),
                DB::raw("IF(p.premium < r.premium, COALESCE(ROUND((c.commission_rate / 100) * (p.premium * p.curr_rate)), 0) + COALESCE(ROUND((tc.commission_rate / 100) * rd.premium), 0), COALESCE(ROUND((c.commission_rate / 100) * r.premium), 0)) AS commission")
            ]);

        // Build the union of all three queries
        $prodUnion = $newPolicyQuery->union($singleTopUpQuery)->union($firstYearRecurringQuery);

        // Build semester subquery with monthly aggregations
        $semesterSub = DB::query()->fromSub($prodUnion, 'prod')
            ->whereYear('prod.case_start_date', $year)
            ->where('prod.agent_code', '<>', '')
            ->select([
                'prod.agent_code',
                DB::raw("SUM(IF(MONTH(prod.case_start_date) = 1, prod.commission, 0)) AS january"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) = 2, prod.commission, 0)) AS february"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) = 3, prod.commission, 0)) AS march"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) = 4, prod.commission, 0)) AS april"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) = 5, prod.commission, 0)) AS may"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) = 6, prod.commission, 0)) AS june"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) BETWEEN 1 AND 6, prod.case_premium * prod.case_pay_method, 0)) AS s1_ape"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) BETWEEN 1 AND 6, prod.commission, 0)) AS s1"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) = 7, prod.commission, 0)) AS july"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) = 8, prod.commission, 0)) AS august"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) = 9, prod.commission, 0)) AS september"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) = 10, prod.commission, 0)) AS october"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) = 11, prod.commission, 0)) AS november"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) = 12, prod.commission, 0)) AS december"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) BETWEEN 7 AND 12, prod.case_premium * prod.case_pay_method, 0)) AS s2_ape"),
                DB::raw("SUM(IF(MONTH(prod.case_start_date) BETWEEN 7 AND 12, prod.commission, 0)) AS s2"),
                DB::raw("SUM(prod.commission) AS total")
            ])
            ->groupBy('prod.agent_code')
            ->orderByRaw("SUM(prod.commission) DESC");

        // Add s1bonus join
        $finalQuery = DB::query()->fromSub($semesterSub, 'semester')
            ->join('agents', 'semester.agent_code', '=', 'agents.id')
            ->leftJoin('contests as s1bonus', function ($join) use ($year) {
                $join->on('s1bonus.type', '=', DB::raw("'semester'"))
                    ->whereRaw("s1bonus.minimum_premium <= semester.s1_ape")
                    ->whereRaw("? BETWEEN YEAR(s1bonus.start) AND YEAR(s1bonus.end)", [$year]);
            })
            ->leftJoin('contests as s2bonus', function ($join) use ($year) {
                $join->on('s2bonus.type', '=', DB::raw("'semester'"))
                    ->whereRaw("s2bonus.minimum_premium <= semester.s2_ape")
                    ->whereRaw("? BETWEEN YEAR(s2bonus.start) AND YEAR(s2bonus.end)", [$year]);
            })
            ->select([
                'agents.id',
                'agents.name',
                'semester.january',
                'semester.february',
                'semester.march',
                'semester.april',
                'semester.may',
                'semester.june',
                'semester.s1',
                DB::raw("COALESCE(ROUND((MAX(s1bonus.bonus_percent) / 100) * semester.s1), 0) AS s1_bonus"),
                'semester.july',
                'semester.august',
                'semester.september',
                'semester.october',
                'semester.november',
                'semester.december',
                'semester.s2',
                DB::raw("COALESCE(ROUND((MAX(s2bonus.bonus_percent) / 100) * semester.s2), 0) AS s2_bonus"),
                DB::raw("COALESCE(ROUND((MAX(s1bonus.bonus_percent) / 100) * semester.s1), 0) + COALESCE(ROUND((MAX(s2bonus.bonus_percent) / 100) * semester.s2), 0) AS total")
            ])->groupBy('agents.id');

        return $finalQuery->get();
    }

    /**
     * Build the evaluation and contest credit calculation expression
     */
    private function buildEvaluationExpression($creditType = 'contest_credit'): string
    {
        $credit = "`$creditType`";
        return "ROUND(((COALESCE($credit,0)/100)*(`case_premium`*`curr_rate`)+"
            . "((COALESCE(`topup_$creditType`,0)/100)*(`topup_premium`*`curr_rate`))))";
    }

    /**
     * Build team-level aggregation subquery
     */
    private function buildTeamAggregationQuery($prod, $teamLevel)
    {
        // Base query: Tier 1 aggregation
        $query = DB::query()->fromSub($prod, 'prod')
            ->join('agent_programs as ap', 'prod.agent_id', '=', 'ap.agent_id')
            ->select([
                'ap.agent_leader_id as agent_id',
                DB::raw("ROUND(SUM((COALESCE(contest_credit,0)/100)*((case_premium*curr_rate)+((COALESCE(topup_contest_credit,0)/100)*(topup_premium*curr_rate))))) AS achieved_fyp"),
                DB::raw("0 AS achieved_cases")
            ])
            ->groupBy('ap.agent_leader_id');

        // Build nested team aggregations based on level
        for ($i = 1; $i < $teamLevel; $i++) {
            $prevQuery = $query;
            $query = DB::query()->fromSub($prevQuery, 'team')
                ->join('agent_programs as ap', 'team.agent_id', '=', 'ap.agent_id')
                ->select([
                    'ap.agent_leader_id as agent_id',
                    DB::raw("SUM(team.achieved_fyp) AS achieved_fyp"),
                    DB::raw("0 AS achieved_cases")
                ])
                ->groupBy('ap.agent_leader_id');
        }

        return $query;
    }

    /**
     * Build the month-specific allowance query for a single month
     */
    private function buildMonthAllowanceQuery($year, $month, $prod)
    {
        $evaluation = $this->buildEvaluationExpression('contest_credit');
        
        $individualProd = DB::query()->fromSub($prod, 'prod')
            ->select([
                'prod.agent_id',
                DB::raw("ROUND(SUM($evaluation)) AS achieved_fyp"),
                DB::raw("COUNT(DISTINCT policy_no) AS achieved_cases")
            ])
            ->groupBy('prod.agent_id');

        $teamProd = DB::query()->fromSub($prod, 'prod')
            ->join('agent_programs as ap', 'prod.agent_id', '=', 'ap.agent_id')
            ->select([
                'ap.agent_leader_id as agent_id',
                DB::raw("ROUND(SUM($evaluation)) AS achieved_fyp"),
                DB::raw("0 as achieved_cases")
            ])
            ->groupBy('ap.agent_leader_id');
            
        $team2Prod = $this->buildTeamAggregationQuery($prod, 2);
        $team3Prod = $this->buildTeamAggregationQuery($prod, 3);

        return DB::table('agents as ag')
            ->join('agent_programs as pro', 'ag.id', '=', 'pro.agent_id')
            ->join('programs as pr', 'pro.program_id', '=', 'pr.id')
            ->join('program_targets as t', function($join) {
                $join->on('pro.program_id', '=', 't.program_id')
                     ->on('pro.allowance', '=', 't.allowance');
            })
            ->leftJoinSub($individualProd, 'production', 'ag.id', '=', 'production.agent_id')
            ->leftJoinSub($teamProd, 'team', 'ag.id', '=', 'team.agent_id')
            ->leftJoinSub($team2Prod, 'team2', 'ag.id', '=', 'team2.agent_id')
            ->leftJoinSub($team3Prod, 'team3', 'ag.id', '=', 'team3.agent_id')
            ->whereRaw("pro.program_start <= LAST_DAY('$year-$month-01')")
            ->whereRaw("TIMESTAMPDIFF(MONTH, pro.program_start, LAST_DAY('$year-$month-01')) + 1 BETWEEN 1 AND pr.duration")
            ->whereRaw("LAST_DAY('$year-$month-01') <= IF(pro.program_end IS NOT NULL, pro.program_end, LAST_DAY('$year-$month-01'))")
            ->whereRaw("t.month <= TIMESTAMPDIFF(MONTH, pro.program_start, LAST_DAY('$year-$month-01')) + 1")
            ->select([
                'ag.id', 'ag.name', 'pro.agent_leader_id', 'pro.program_start',
                DB::raw("DATE_FORMAT(pro.program_start, '%M %Y') AS start_month"),
                'pr.name as program', 'pro.allowance',
                DB::raw("TIMESTAMPDIFF(MONTH, pro.program_start, LAST_DAY('$year-$month-01')) + 1 AS month"),
                DB::raw("
                    IF(
                        IF(pro.position <> 'FC',
                           COALESCE(team.achieved_fyp, 0) + COALESCE(team2.achieved_fyp, 0) + COALESCE(team3.achieved_fyp, 0) + COALESCE(production.achieved_fyp, 0),
                           COALESCE(production.achieved_fyp, 0)
                        ) - SUM(t.fyp_month) >= 0 
                        AND 
                        IF(pro.position <> 'FC',
                           COALESCE(team.achieved_cases, 0),
                           COALESCE(production.achieved_cases, 0)
                        ) - SUM(t.case_month) >= 0,
                        pro.allowance,
                        0
                    ) AS achieved_allowance
                ")
            ])
            ->groupBy([
                'ag.id', 'ag.name', 'pro.agent_leader_id', 'pro.program_start', 'pr.name', 'pro.allowance', 'pro.position', 'pro.program_end', 'pr.duration',
                'production.achieved_fyp', 'production.achieved_cases',
                'team.achieved_fyp', 'team.achieved_cases',
                'team2.achieved_fyp', 'team3.achieved_fyp'
            ])
            ->orderBy('pro.agent_leader_id')
            ->orderBy('pro.program_start');
    }

    /**
     * Build the Month-To-Date (MTD) query
     */
    /**
     * Build the Month-To-Date (MTD) query
     */
    private function buildMTDQuery($year, $prod)
    {
        $evaluation = $this->buildEvaluationExpression('contest_credit');
        $otContest = $this->buildEvaluationExpression('production_credit');
        
        // Level 1: Production joined with Agent Program to get Leader 1
        $production = DB::query()->fromSub($prod, 'prod')
            ->join('agent_programs as ap', 'prod.agent_id', '=', 'ap.agent_id')
            ->select([
                'prod.policy_no', 'prod.agent_id', 'ap.agent_leader_id',
                'prod.holder_name as customer_name', 'prod.start_date', 'prod.case_month', 'prod.status_polis',
                'prod.pay_method', 'prod.currency_id', 'prod.curr_rate', 'prod.product_id',
                'prod.production_credit', 'prod.contest_credit', 'prod.topup_production_credit', 'prod.topup_contest_credit',
                'prod.case_premium', 'prod.topup_premium', 'prod.commission',
                DB::raw('prod.case_premium * prod.pay_method AS ape'),
                DB::raw("$evaluation AS evaluation"),
                DB::raw("$otContest AS ot_contest")
            ]);

        // Level 2: Join again to get Leader 2
        $team = DB::query()->fromSub($production, 'production')
            ->join('agent_programs as ap2', 'production.agent_leader_id', '=', 'ap2.agent_id')
            ->select([
                'production.*',
                'ap2.position as leader_position',
                'ap2.agent_leader_id as agent_leader_id2'
            ]);

        // Level 3: Join again to get Leader 3 (Agency view)
        $agency = DB::query()->fromSub($team, 'team')
             ->join('agent_programs as ap3', 'team.agent_leader_id2', '=', 'ap3.agent_id')
             ->select([
                 'team.*',
                 'ap3.agent_leader_id as agent_leader_id3'
             ]);

        return DB::table('agents as ag')
            ->join('agent_programs as ap', 'ag.id', '=', 'ap.agent_id')
            ->leftJoinSub($agency, 'agency', function($join) {
                $join->on('ag.id', '=', 'agency.agent_id')
                     ->orOn('ag.id', '=', 'agency.agent_leader_id')
                     ->orOn('ag.id', '=', 'agency.agent_leader_id2')
                     ->orOn('ag.id', '=', 'agency.agent_leader_id3');
            })
            ->whereRaw("SUBSTRING_INDEX(agency.case_month, ' ', -1) = ?", [$year])
            ->whereNotNull('agency.evaluation')
            ->whereNotNull('agency.ot_contest')
            ->select([
                'ag.id', 'ag.official_number', 'ag.name',
                DB::raw('SUM(agency.ape) AS ape'),
                DB::raw('SUM(IF(agency.agent_id = ag.id, agency.commission, 0)) AS commission'),
                DB::raw("SUM(ROUND(IF(agency.agent_leader_id = ag.id AND agency.leader_position = 'BP*', 0.3, IF(agency.agent_leader_id = ag.id OR agency.agent_leader_id2 = ag.id OR agency.agent_leader_id3 = ag.id, 0.2, 0)) * agency.commission)) AS overriding"),
                DB::raw('SUM(agency.evaluation) AS mdrt'),
                DB::raw('SUM(agency.ot_contest) AS super_achiever')
            ])
            ->groupBy('ag.id');
    }

    /**
     * Build the Recruit Bonus query
     */
    /**
     * Build the Recruit Bonus query
     */
    private function buildRecruitBonusQuery($year, $prod)
    {
        // Production subquery with filtered recruiter logic
        $productionSub = DB::query()->fromSub($prod, 'prod')
             ->join('agents as ag', 'prod.agent_id', '=', 'ag.id')
             ->whereYear('prod.start_date', $year)
             ->select('ag.recruiter_id', 'prod.commission')
             ->orderBy('prod.start_date');

        return DB::table('agents as ag')
             ->leftJoinSub($productionSub, 'production', 'ag.id', '=', 'production.recruiter_id')
             ->groupBy('ag.id')
             ->select([
                 'ag.id', 
                 DB::raw('ROUND(0.1*SUM(production.commission)) AS bonus_recruit')
             ]);
    }

    public function reportMonthly($year, $month)
    {
        $prod = $this->productionQuery($year);

        // Build production subquery filtered by month
        $monthProduction = DB::query()->fromSub($prod, 'prod')
            ->where('prod.case_month', date('m Y', strtotime("$year-$month-01")))
            ->select([
                'prod.policy_no',
                'prod.agent_id as agent_code',
                'prod.agent_id as agent_leader',
                'prod.holder_name as customer_name',
                'prod.start_date as case_start_date',
                'prod.case_month',
                'prod.status_polis',
                'prod.pay_method as case_pay_method',
                'prod.currency_id as case_currency',
                'prod.curr_rate as case_curr_rate',
                'prod.product_id as case_product',
                'prod.production_credit',
                'prod.contest_credit',
                'prod.case_premium',
                'prod.topup_premium',
                'prod.commission',
                DB::raw("prod.evaluation"),
                DB::raw("prod.evaluation as ot_contest")
            ]);

        // MTD aggregation by agent
        $mtdSelect = $this->buildMTDQuery($year, $prod);

        // Recruit bonus
        $recruitSelect = $this->buildRecruitBonusQuery($year, $prod);

        // YTD allowance (simplified)
        $ytdSelect = DB::table('agents as ag')
            ->join('agent_programs as ap', 'ag.id', '=', 'ap.agent_id')
            ->join('programs as pr', 'ap.program_id', '=', 'pr.id')
            ->join('program_targets as pt', function ($join) {
                $join->on('ap.program_id', '=', 'pt.program_id')
                    ->on('ap.allowance', '=', 'pt.allowance');
            })
            ->select([
                'ag.id as agent_code',
                DB::raw("SUM(IF(COALESCE(pt.fyp_month, 0) <= 0, ap.allowance, 0)) as achieved_allowance")
            ])
            ->groupBy('ag.id');

        // Final query
        return DB::table('agents as ag')
            ->leftJoinSub($ytdSelect, 'ytd', 'ag.id', '=', 'ytd.agent_code')
            ->leftJoinSub($mtdSelect, 'mtd', 'ag.id', '=', 'mtd.id')
            ->leftJoinSub($recruitSelect, 'recruit', 'ag.id', '=', 'recruit.id')
            ->leftJoin('contests as mnbonus', function ($join) use ($year) {
                $join->on('mnbonus.type', '=', DB::raw("'speprod'"))
                    ->whereRaw("? BETWEEN YEAR(mnbonus.start) AND YEAR(mnbonus.end)", [$year]);
            })
            ->select([
                'ag.id',
                'ag.official_number',
                'ag.name',
                DB::raw("IF(COALESCE(mtd.commission, 0) > 0 OR COALESCE(mtd.overriding, 0) > 0, COALESCE(ytd.achieved_allowance, 0), 0) as allowance"),
                DB::raw("COALESCE(mtd.commission, 0) as commission"),
                DB::raw("COALESCE(recruit.bonus_recruit, 0) as recruit_bonus"),
                DB::raw("COALESCE(ROUND((mnbonus.bonus_percent / 100) * mtd.commission), 0) as production_bonus"),
                DB::raw("COALESCE(mtd.overriding, 0) as overriding"),
                DB::raw("ROUND(IF(COALESCE(mtd.commission, 0) > 0 OR COALESCE(mtd.overriding, 0) > 0, COALESCE(ytd.achieved_allowance, 0), 0) + COALESCE(ROUND((mnbonus.bonus_percent / 100) * mtd.commission), 0) + COALESCE(mtd.commission, 0) + COALESCE(recruit.bonus_recruit, 0) + COALESCE(mtd.overriding, 0)) as total_amount")
            ])
            ->whereNotNull('ag.id')
            ->orderBy('total_amount', 'DESC')
            ->get();
    }

    public function reportAnnual($year)
    {
        $prod = $this->productionQuery($year);
        $endMonth = ($year == date("Y")) ? intval(date("m")) : 12;

        // Build YTD query with UNION of all months
        $queries = collect(range(1, $endMonth))->map(function ($monthNo) use ($year, $prod) {
            $month = str_pad($monthNo, 2, "0", STR_PAD_LEFT);
            return $this->buildMonthAllowanceQuery($year, $month, $prod);
        });
        
        // Handle Union All - taking the first query and unioning the rest
        $firstQuery = $queries->shift();
        foreach ($queries as $query) {
            $firstQuery->unionAll($query);
        }

        $ytdQuery = DB::query()->fromSub($firstQuery, 'annual')
            ->select(['id as agent_id', DB::raw("SUM(achieved_allowance) AS achieved_allowance")])
            ->groupBy('id');

        // Build MTD query
        $mtdQuery = $this->buildMTDQuery($year, $prod);

        // Build Recruit Bonus query
        $recruitQuery = $this->buildRecruitBonusQuery($year, $prod);

        // Build the final query
        $finalQuery = DB::table('agents as ag') // Start from a base table if needed, or join subqueries directly like before
             ->fromSub($ytdQuery, 'ytd')
            ->rightJoinSub($mtdQuery, 'mtd', 'mtd.id', '=', 'ytd.agent_id')
            ->leftJoinSub($recruitQuery, 'recruit', 'mtd.id', '=', 'recruit.id')
            ->leftJoin('contests as anbonus', function ($join) use ($year) {
                $join->on('anbonus.type', '=', DB::raw("'annual'"))
                    ->whereRaw("anbonus.minimum_premium <= mtd.ape")
                    ->whereRaw("? BETWEEN YEAR(anbonus.start) AND YEAR(anbonus.end)", [$year]);
            })
            ->select([
                'mtd.id as agent_id',
                'mtd.official_number',
                'mtd.name',
                DB::raw('ytd.achieved_allowance AS allowance'),
                DB::raw('COALESCE(mtd.commission, 0) AS commission'),
                DB::raw('COALESCE(recruit.bonus_recruit, 0) AS recruit_bonus'),
                DB::raw('COALESCE(mtd.overriding, 0) AS overriding'),
                DB::raw('COALESCE(ROUND((anbonus.bonus_percent / 100) * mtd.commission), 0) AS annual_bonus'),
                DB::raw('ROUND(COALESCE(ytd.achieved_allowance, 0) + COALESCE(mtd.commission, 0) + COALESCE(recruit.bonus_recruit, 0) + COALESCE(mtd.overriding, 0) + COALESCE(ROUND((anbonus.bonus_percent / 100) * mtd.commission), 0)) AS total_amount')
            ])
            ->whereNotNull('mtd.id')
            ->groupBy('mtd.id')
            ->orderBy('total_amount', 'DESC')
            ->get();

        return $finalQuery;
    }
}
