import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface KPIData {
    kpis: {
        new_policies: {
            this_month: number;
            last_month: number;
            change: number;
            percentage_change: number;
        };
        premium_collected: {
            amount: number;
            formatted: string;
        };
        mdrt_agents: {
            count: number;
            stats: any[];
        };
        active_claims: {
            count: number;
            pending: number;
            approved: number;
        };
        expiring_policies: {
            count: number;
            list: any[];
        };
        birthdays: {
            count: number;
            list: any[];
        };
    };
    empire_stats: {
        agent_no: string;
        current_trip: string;
    }[];
    mdrt_stats: {
        agent_no: string;
        current_level: string;
    }[];
    empire_club: {
        agent_no: string;
        status: string;
        wape: string;
        cases: string;
        gap_wape: string;
        gap_cases: string;
    }[];
    mdrt: {
        agent_no: string;
        status: string;
        fyp: string;
        gap_fyp: string;
    }[];
}

export default function Dashboard({ kpis, empire_stats, mdrt_stats, empire_club, mdrt }: KPIData) {
    const { t } = useTranslation();
    
    return (
        <TemplateLayout>
            <Head title="Dashboard" />

            <div className="container-fluid">
                {/* KPI Cards Section */}
                <div className="row mb-4">
                    {/* New Policies Card */}
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div className="widget-stat card bg-primary">
                            <div className="card-body p-4">
                                <div className="media">
                                    <span className="mr-3">
                                        <i className="la la-file-text" style={{ fontSize: '36px' }}></i>
                                    </span>
                                    <div className="media-body text-white">
                                        <p className="mb-1">New Policies This Month</p>
                                        <h3 className="text-white mb-0">{kpis.new_policies.this_month}</h3>
                                        <small>
                                            Last month: {kpis.new_policies.last_month}
                                            {kpis.new_policies.change !== 0 && (
                                                <span className={`ml-2 badge ${kpis.new_policies.change > 0 ? 'badge-success' : 'badge-danger'}`}>
                                                    {kpis.new_policies.change > 0 ? '+' : ''}{kpis.new_policies.change}
                                                    ({kpis.new_policies.percentage_change > 0 ? '+' : ''}{kpis.new_policies.percentage_change}%)
                                                </span>
                                            )}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Premium Collected Card */}
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div className="widget-stat card bg-success">
                            <div className="card-body p-4">
                                <div className="media">
                                    <span className="mr-3">
                                        <i className="la la-money" style={{ fontSize: '36px' }}></i>
                                    </span>
                                    <div className="media-body text-white">
                                        <p className="mb-1">Premium Collected</p>
                                        <h3 className="text-white mb-0">{kpis.premium_collected.formatted}</h3>
                                        <small>This month</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MDRT Agents Card */}
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div className="widget-stat card bg-info">
                            <div className="card-body p-4">
                                <div className="media">
                                    <span className="mr-3">
                                        <i className="la la-users" style={{ fontSize: '36px' }}></i>
                                    </span>
                                    <div className="media-body text-white">
                                        <p className="mb-1">MDRT-Tracking Agents</p>
                                        <h3 className="text-white mb-0">{kpis.mdrt_agents.count}</h3>
                                        <small>Active agents on track</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Claims Card */}
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div className="widget-stat card bg-warning">
                            <div className="card-body p-4">
                                <div className="media">
                                    <span className="mr-3">
                                        <i className="la la-clipboard-list" style={{ fontSize: '36px' }}></i>
                                    </span>
                                    <div className="media-body text-white">
                                        <p className="mb-1">Active Claims</p>
                                        <h3 className="text-white mb-0">{kpis.active_claims.count}</h3>
                                        <small>
                                            Pending: {kpis.active_claims.pending} | Approved: {kpis.active_claims.approved}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expiring Policies Card */}
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div className="widget-stat card bg-danger">
                            <div className="card-body p-4">
                                <div className="media">
                                    <span className="mr-3">
                                        <i className="la la-calendar-times" style={{ fontSize: '36px' }}></i>
                                    </span>
                                    <div className="media-body text-white">
                                        <p className="mb-1">Expiring in 30 Days</p>
                                        <h3 className="text-white mb-0">{kpis.expiring_policies.count}</h3>
                                        <small>Policies requiring renewal</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Birthdays Card */}
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12">
                        <div className="widget-stat card bg-secondary">
                            <div className="card-body p-4">
                                <div className="media">
                                    <span className="mr-3">
                                        <i className="la la-birthday-cake" style={{ fontSize: '36px' }}></i>
                                    </span>
                                    <div className="media-body text-white">
                                        <p className="mb-1">Birthdays This Week</p>
                                        <h3 className="text-white mb-0">{kpis.birthdays.count}</h3>
                                        <small>Customer birthdays</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Existing Empire and MDRT Stats */}
                <div className="infobox-container">
                    <div className="row">
                        {empire_stats.length > 0 &&
                            empire_stats.map((stats, index) => (
                                <div key={index} className="col-xl-3 col-xxl-3 col-lg-3 col-md-6 col-sm-6">
                                    <div className="widget-stat card">
                                        <div className="card-body">
                                            <div className="media ai-icon">
                                                <span className="mr-3">
                                                    <h2 className="mb-0">
                                                        {stats['agent_no']}
                                                    </h2>
                                                </span>
                                                <div className="media-body">
                                                    <p className="mb-1">
                                                        {t('dashboard.agents_achieved')}
                                                    </p>
                                                    <h4 className="mb-0">
                                                        {stats['current_trip']}
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        {mdrt_stats.length > 0 &&
                            mdrt_stats.map((stats, index) => (
                                <div key={index} className="col-xl-3 col-xxl-3 col-lg-3 col-md-6 col-sm-6">
                                    <div className="widget-stat card">
                                        <div className="card-body">
                                            <div className="media ai-icon">
                                                <span className="mr-3">
                                                    <h2 className="mb-0">
                                                        {stats['agent_no']}
                                                    </h2>
                                                </span>
                                                <div className="media-body">
                                                    <p className="mb-1">
                                                        {t('dashboard.agents_reached')}
                                                    </p>
                                                    <h4 className="mb-0">
                                                        {stats['current_level']}
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Existing Tables */}
                <div className="row">
                    <div className="col-xl-6 col-xxl-6 col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Empire Club</h4>
                            </div>
                            <div className="card-body">
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Agent</th>
                                            <th>Status</th>
                                            <th>WAPE</th>
                                            <th>Cases</th>
                                            <th>Gap WAPE</th>
                                            <th>Gap Cases</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {empire_club.length > 0 ? (
                                            empire_club.map((club, index) => (
                                                <tr key={index}>
                                                    <td>{club.agent_no}</td>
                                                    <td>{club.status}</td>
                                                    <td>{club.wape}</td>
                                                    <td>{club.cases}</td>
                                                    <td>{club.gap_wape}</td>
                                                    <td>{club.gap_cases}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6}>No Data</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-6 col-xxl-6 col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">MDRT</h4>
                            </div>
                            <div className="card-body">
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Agent</th>
                                            <th>Status</th>
                                            <th>FYP</th>
                                            <th>Gap FYP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mdrt.length > 0 ? (
                                            mdrt.map((mdrtItem, index) => (
                                                <tr key={index}>
                                                    <td>{mdrtItem.agent_no}</td>
                                                    <td>{mdrtItem.status}</td>
                                                    <td>{mdrtItem.fyp}</td>
                                                    <td>{mdrtItem.gap_fyp}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4}>No Data</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TemplateLayout>
    );
}
