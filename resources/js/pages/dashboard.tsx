import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';
import { Table } from 'react-bootstrap';

export default function Dashboard({
    data,
}: {
    data: {
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
    };
}) {
    return (
        <TemplateLayout>
            <Head title="Dashboard" />

            <div className="container-fluid">
                <div className="infobox-container">
                    <div className="row">
                        {data.empire_stats.length > 0 &&
                            data.empire_stats.map((stats) => (
                                <div className="col-xl-3 col-xxl-3 col-lg-3 col-md-6 col-sm-6">
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
                                                        agen mendapatkan
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
                        {data.mdrt_stats.length > 0 &&
                            data.mdrt_stats.map((stats) => (
                                <div className="col-xl-3 col-xxl-3 col-lg-3 col-md-6 col-sm-6">
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
                                                        agen mencapai
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
                                        {data.empire_club.length > 0 ? (
                                            data.empire_club.map((club) => (
                                                <tr>
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
                                        {data.mdrt.length > 0 ? (
                                            data.mdrt.map((mdrt) => (
                                                <tr>
                                                    <td>{mdrt.agent_no}</td>
                                                    <td>{mdrt.status}</td>
                                                    <td>{mdrt.fyp}</td>
                                                    <td>{mdrt.gap_fyp}</td>
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
