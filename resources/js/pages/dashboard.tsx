import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <TemplateLayout>
            <Head title="Dashboard" />

            <div className="container-fluid">
                <div className="infobox-container">
                    {/*
                    var homeHTML = '<div class="row">';
            response["empire-stats"].forEach(function(stats) {
                var statsBox = '<div class="col-xl-3 col-xxl-3 col-lg-3 col-md-6 col-sm-6">';
                statsBox += '<div class="widget-stat card"><div class="card-body"><div class="media ai-icon">';
                statsBox += '<span class="mr-3"><h2 class="mb-0">'+stats["agent-no"]+'</h2></span>';
                statsBox += '<div class="media-body"><p class="mb-1">agen mendapatkan</p>';
                statsBox += '<h4 class="mb-0">'+stats["current-trip"]+'</h4>';
                statsBox += '</div></div></div></div></div>';
                homeHTML += statsBox;
            });

            response["mdrt-stats"].forEach(function(stats) {
                var statsBox = '<div class="col-xl-4 col-xxl-4 col-lg-4 col-md-4 col-sm-4">';
                statsBox += '<div class="widget-stat card"><div class="card-body"><div class="media ai-icon">';
                statsBox += '<span class="mr-3"><h2 class="mb-0">'+stats["agent-no"]+'</h2></span>';
                statsBox += '<div class="media-body"><p class="mb-1">agen mencapai</p>';
                statsBox += '<h4 class="mb-0">'+stats["current-level"]+'</h4>';
                statsBox += '</div></div></div></div></div>';
                homeHTML += statsBox;
            });
            homeHTML += '</div>';
                     */}
                </div>
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

