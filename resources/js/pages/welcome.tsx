import TemplateLayout from '@/layouts/TemplateLayout';
import { dashboard, login, register } from '@/wayfinder/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ProgressBar } from 'react-bootstrap';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <TemplateLayout>
            <Head title="Welcome to RichKingdom" />
            
            <div className="row page-titles mx-0">
                <div className="col-sm-6 p-md-0">
                    <div className="welcome-text">
                        <h4>Hi, welcome back!</h4>
                        <p className="mb-0">RichKingdom - Premium Laravel + React Dashboard</p>
                    </div>
                </div>
                <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                    {auth.user ? (
                         <Link href={dashboard()} className="btn btn-primary">Go to Dashboard</Link>
                    ) : (
                        <div className="d-flex gap-2">
                            <Link href={login()} className="btn btn-primary">Log in</Link>
                            {canRegister && <Link href={register()} className="btn btn-outline-primary">Register</Link>}
                        </div>
                    )}
                </div>
            </div>

            <div className="row">
                <div className="col-lg-3 col-sm-6">
                    <div className="card">
                        <div className="stat-widget-two card-body">
                            <div className="stat-content">
                                <div className="stat-text">System Users</div>
                                <div className="stat-digit"> <i className="fa fa-users text-primary mr-2"></i>1,250</div>
                            </div>
                            <ProgressBar variant="primary" now={85} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-sm-6">
                    <div className="card">
                        <div className="stat-widget-two card-body">
                            <div className="stat-content">
                                <div className="stat-text">Monthly Revenue</div>
                                <div className="stat-digit"> <i className="fa fa-usd text-success mr-2"></i>12,800</div>
                            </div>
                            <ProgressBar variant="success" now={75} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-sm-6">
                    <div className="card">
                        <div className="stat-widget-two card-body">
                            <div className="stat-content">
                                <div className="stat-text">Active Projects</div>
                                <div className="stat-digit"> <i className="fa fa-tasks text-warning mr-2"></i>45</div>
                            </div>
                            <ProgressBar variant="warning" now={50} />
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-sm-6">
                    <div className="card">
                        <div className="stat-widget-two card-body">
                            <div className="stat-content">
                                <div className="stat-text">Up-time</div>
                                <div className="stat-digit"> <i className="fa fa-server text-danger mr-2"></i>99.9%</div>
                            </div>
                            <ProgressBar variant="danger" now={99} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-xl-8 col-lg-8 col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">RichKingdom Features</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-4">
                                    <div className="d-flex align-items-center">
                                        <div className="icon-box bg-light-primary text-primary mr-3 p-3 rounded">
                                            <i className="fa fa-rocket fa-2x"></i>
                                        </div>
                                        <div>
                                            <h5>Lightning Fast</h5>
                                            <p className="mb-0 text-muted">Powered by Vite and Laravel for ultimate performance.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="d-flex align-items-center">
                                        <div className="icon-box bg-light-success text-success mr-3 p-3 rounded">
                                            <i className="fa fa-shield fa-2x"></i>
                                        </div>
                                        <div>
                                            <h5>Secure by Default</h5>
                                            <p className="mb-0 text-muted">Built-in authentication and data protection.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="d-flex align-items-center">
                                        <div className="icon-box bg-light-warning text-warning mr-3 p-3 rounded">
                                            <i className="fa fa-paint-brush fa-2x"></i>
                                        </div>
                                        <div>
                                            <h5>Premium UI</h5>
                                            <p className="mb-0 text-muted">Stunning MetroAdmin visuals for your app.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="d-flex align-items-center">
                                        <div className="icon-box bg-light-danger text-danger mr-3 p-3 rounded">
                                            <i className="fa fa-code fa-2x"></i>
                                        </div>
                                        <div>
                                            <h5>Clean Code</h5>
                                            <p className="mb-0 text-muted">TypeScript and modern React patterns.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4 col-lg-4 col-md-4">
                    <div className="card">
                        <div className="card-body text-center py-5">
                            <img src="/images/logo-full.png" alt="" className="img-fluid mb-4" style={{ maxWidth: '150px' }} />
                            <h4 className="card-title">Ready to Start?</h4>
                            <p className="text-muted px-3">Join thousands of users building amazing applications with RichKingdom.</p>
                            {!auth.user && (
                                <Link href={register()} className="btn btn-primary px-5 mt-3">Get Started Now</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </TemplateLayout>
    );
}
