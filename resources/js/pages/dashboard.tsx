import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';
import { ProgressBar } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

export default function Dashboard() {
    return (
        <TemplateLayout>
            <Head title="Dashboard" />
            
            <div className="container-fluid">
                <div className="infobox-container"></div>
                <div className="row">
                    <div className="col-xl-6 col-xxl-6 col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Empire Club</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table id="table-summaryEmpire" className="table vertical-middle table-responsive-md">
                                        <thead>
                                            <tr>
                                                <th scope="col">Agent</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">WAPE</th>
                                                <th scope="col">Cases</th>
                                                <th scope="col">Gap WAPE</th>
                                                <th scope="col">Gap Cases</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-6 col-xxl-6 col-lg-6">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">MDRT</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table id="table-summaryMDRT" className="table verticle-middle table-responsive-md">
                                        <thead>
                                            <tr>
                                                <th scope="col">Agent</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">FYP</th>
                                                <th scope="col">Gap FYP</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TemplateLayout>
    );
}

