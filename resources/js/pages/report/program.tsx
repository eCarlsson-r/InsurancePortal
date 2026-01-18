import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function Program() {
    return (
        <TemplateLayout>
            <Head title="Program Report" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="program-report">Laporan Program Financing</h3> </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="report">Laporan</a></li>
                            <li className="breadcrumb-item active" data-i18n="program-report">Laporan Program Financing</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div id="rprogram-toolbar" className="form-inline">
                                    <div className="col-sm-4 form-group">
                                        <h4 className="card-title" data-i18n="agent-program-report">Laporan Program Agen</h4>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <label className="col-sm-4" for="program-month" data-i18n="month">Month</label>
                                        <input type="month" id="program-month" className="col-sm-8 form-control"/>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <label className="col-sm-4" for="program-agency" data-i18n="agency">Agency</label>
                                        <select id="program-agency" className="col-sm-8 form-control agencySelector"></select>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table id="table-fnprogram" className="display nowrap table table-hover table-striped table-bordered" data-row-style="programRowFormatter"
                                        data-toggle="table" data-url="" data-query-params="getprogramList" data-response-handler="showprogramList" 
                                        data-group-by="true" data-group-by-field="agent-leader" data-group-by-show-toggle-icon="true" data-group-by-toggle="true" 
                                        data-group-by-formatter="leader" data-show-export="true" data-export-types="['xlsx']"
                                        data-toolbar="#rprogram-toolbar" cellspacing="0" width="100%">
                                        <thead><tr>
                                            <th data-field="agent-name">Nama Agen</th>
                                            <th data-field="start-month">Starting Month</th>
                                            <th data-field="program">Program</th>
                                            <th data-field="month">Month Period</th>
                                            <th data-field="mtd-target" data-formatter="programIDRFormatter">Target MTD</th>
                                            <th data-field="mtd-achieved" data-formatter="programIDRFormatter">Pencapaian MTD</th>
                                            <th data-field="mtd-gap" data-formatter="programIDRFormatter">Kurang MTD</th>
                                            <th data-field="ytd-target" data-formatter="programIDRFormatter">Target YTD</th>
                                            <th data-field="ytd-achieved" data-formatter="programIDRFormatter">Pencapaian YTD</th>
                                            <th data-field="ytd-gap" data-formatter="programIDRFormatter">Kurang YTD</th>
                                        </tr></thead>
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