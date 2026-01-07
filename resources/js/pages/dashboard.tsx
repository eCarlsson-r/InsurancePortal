import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';
import { ProgressBar, Table } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

import BarChart from '@/components/dashboard/BarChart';
import ChartPie from '@/components/dashboard/ChartPie';
import CustomerFeedback from '@/components/dashboard/CustomerFeedback';
import LineChart2 from '@/components/dashboard/LineChart2';
import TestimonialSlider from '@/components/dashboard/TestimonialSlider';
import Timeline from '@/components/dashboard/Timeline';
import TodoList from '@/components/dashboard/TodoList';
import UsaMap from '@/components/dashboard/UsaMap';

export default function Dashboard() {
    return (
        <TemplateLayout>
            <Head title="Dashboard" />
            
            <div className="row page-titles mx-0">
                <div className="col-sm-6 p-md-0">
                    <div className="welcome-text">
                        <h4>Hi, welcome back!</h4>
                        <p className="mb-0">RichKingdom - Admin Dashboard Overview</p>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-3 col-sm-6">
                    <div className="card">
                        <div className="stat-widget-two card-body">
                            <div className="stat-content">
                                <div className="stat-text">Today Expenses </div>
                                <div className="stat-digit"> <i className="fa fa-usd"></i>8,500</div>
                            </div>
                            <ProgressBar variant="success" now={80} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-sm-6">
                    <div className="card">
                        <div className="stat-widget-two card-body">
                            <div className="stat-content">
                                <div className="stat-text">Income Detail</div>
                                <div className="stat-digit"> <i className="fa fa-usd"></i>7,800</div>
                            </div>
                            <ProgressBar variant="primary" now={75} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-sm-6">
                    <div className="card">
                        <div className="stat-widget-two card-body">
                            <div className="stat-content">
                                <div className="stat-text">Task Completed</div>
                                <div className="stat-digit"> <i className="fa fa-usd"></i> 500</div>
                            </div>
                            <ProgressBar variant="warning" now={50} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-sm-6">
                    <div className="card">
                        <div className="stat-widget-two card-body">
                            <div className="stat-content">
                                <div className="stat-text">System Alerts</div>
                                <div className="stat-digit"> <i className="fa fa-usd"></i>650</div>
                            </div>
                            <ProgressBar variant="danger" now={65} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-8 col-lg-8 col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Sales Overview</h4>
                        </div>
                        <div className="card-body">
                            <BarChart />
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 col-lg-4 col-md-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <div className="m-t-10">
                                <h4 className="card-title">Customer Feedback</h4>
                                <h2 className="mt-3">385,749</h2>
                            </div>
                            <div className="widget-card-circle mt-5 mb-5 mx-auto" style={{ width: "100px" }}>
                                <CustomerFeedback />
                            </div>
                            <ul className="widget-line-list m-b-15 d-flex list-unstyled justify-content-center">
                                <li className="border-right pr-3 mr-3 text-center">92% <br /><span className="text-success"><i
                                    className="ti-hand-point-up"></i> Positive</span></li>
                                <li className="text-center">8% <br /><span className="text-danger"><i
                                    className="ti-hand-point-down"></i> Negative</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Project Progress</h4>
                        </div>
                        <div className="card-body">
                            <div className="current-progress">
                                <div className="progress-content py-2">
                                    <div className="row align-items-center">
                                        <div className="col-lg-4">
                                            <div className="progress-text">Website</div>
                                        </div>
                                        <div className="col-lg-8">
                                            <ProgressBar variant="primary" now={40} label={`${40}%`} />
                                        </div>
                                    </div>
                                </div>
                                <div className="progress-content py-2">
                                    <div className="row align-items-center">
                                        <div className="col-lg-4">
                                            <div className="progress-text">Android</div>
                                        </div>
                                        <div className="col-lg-8">
                                            <ProgressBar variant="success" now={70} label={`${70}%`} />
                                        </div>
                                    </div>
                                </div>
                                <div className="progress-content py-2">
                                    <div className="row align-items-center">
                                        <div className="col-lg-4">
                                            <div className="progress-text">iOS</div>
                                        </div>
                                        <div className="col-lg-8">
                                            <ProgressBar variant="warning" now={85} label={`${85}%`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-body py-5 text-center">
                            <TestimonialSlider />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Earnings</h4>
                        </div>
                        <div className="card-body">
                            <LineChart2 />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-6 col-sm-6">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Regional Traffic</h4>
                        </div>
                        <div className="card-body">
                            <div style={{ height: '300px' }}>
                                <UsaMap />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-sm-6">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">New Orders</h4>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1, 2, 3, 1, 2].map((id, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <div className="round-img">
                                                        <img width="35" src={`/images/avatar/${id}.png`} alt="" className="rounded-circle" />
                                                    </div>
                                                </td>
                                                <td>Lew Shawon</td>
                                                <td><span>Product-{id}</span></td>
                                                <td><span>{idx + 10} pcs</span></td>
                                                <td><span className={`badge badge-${idx % 2 === 0 ? 'success' : 'warning'}`}>{idx % 2 === 0 ? 'Done' : 'Pending'}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-6 col-xl-4 col-xxl-6 col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Timeline</h4>
                        </div>
                        <div className="card-body">
                            <PerfectScrollbar style={{ height: "380px" }}>
                                <Timeline />
                            </PerfectScrollbar>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-xxl-6 col-lg-6 col-md-6 col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Todo List</h4>
                        </div>
                        <div className="card-body">
                            <TodoList />
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-md-12 col-xxl-6 col-xl-4 col-lg-6">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Product Distribution</h4>
                        </div>
                        <div className="card-body">
                            <ChartPie />
                        </div>
                    </div>
                </div>

                <div className="col-xl-12 col-xxl-6 col-lg-6 col-md-12">
                    <div className="row">
                        <div className="col-xl-3 col-lg-6 col-sm-6 col-xxl-6 col-md-6">
                            <div className="card">
                                <div className="social-graph-wrapper widget-facebook bg-facebook text-white text-center p-4">
                                    <span className="s-icon"><i className="fa fa-facebook fa-2x"></i></span>
                                </div>
                                <div className="row text-center p-3">
                                    <div className="col-6 border-right">
                                        <h4 className="m-1">89 k</h4>
                                        <p className="m-0 text-muted">Friends</p>
                                    </div>
                                    <div className="col-6">
                                        <h4 className="m-1">119 k</h4>
                                        <p className="m-0 text-muted">Followers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-sm-6 col-xxl-6 col-md-6">
                            <div className="card">
                                <div className="social-graph-wrapper widget-linkedin bg-linkedin text-white text-center p-4">
                                    <span className="s-icon"><i className="fa fa-linkedin fa-2x"></i></span>
                                </div>
                                <div className="row text-center p-3">
                                    <div className="col-6 border-right">
                                        <h4 className="m-1">45 k</h4>
                                        <p className="m-0 text-muted">Friends</p>
                                    </div>
                                    <div className="col-6">
                                        <h4 className="m-1">67 k</h4>
                                        <p className="m-0 text-muted">Followers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-sm-6 col-xxl-6 col-md-6">
                            <div className="card">
                                <div className="social-graph-wrapper widget-googleplus bg-googleplus text-white text-center p-4">
                                    <span className="s-icon"><i className="fa fa-google-plus fa-2x"></i></span>
                                </div>
                                <div className="row text-center p-3">
                                    <div className="col-6 border-right">
                                        <h4 className="m-1">12 k</h4>
                                        <p className="m-0 text-muted">Friends</p>
                                    </div>
                                    <div className="col-6">
                                        <h4 className="m-1">15 k</h4>
                                        <p className="m-0 text-muted">Followers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-sm-6 col-xxl-6 col-md-6">
                            <div className="card">
                                <div className="social-graph-wrapper widget-twitter bg-twitter text-white text-center p-4">
                                    <span className="s-icon"><i className="fa fa-twitter fa-2x"></i></span>
                                </div>
                                <div className="row text-center p-3">
                                    <div className="col-6 border-right">
                                        <h4 className="m-1">89 k</h4>
                                        <p className="m-0 text-muted">Friends</p>
                                    </div>
                                    <div className="col-6">
                                        <h4 className="m-1">119 k</h4>
                                        <p className="m-0 text-muted">Followers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TemplateLayout>
    );
}

