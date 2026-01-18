import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function MDRTReport() {
    return (
        <TemplateLayout>
            <Head title="Laporan Komisi Harian" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="mdrt-report">Laporan MDRT Internasional</h3> </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="report">Laporan</a></li>
                            <li className="breadcrumb-item active" data-i18n="mdrt-report">Laporan MDRT Internasional</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div id="mdrt-toolbar" className="form-inline">
                                    <div className="col-sm-4 form-group">
                                        <h4 className="card-title" data-i18n="mdrt-international-report">Laporan Pencapaian MDRT Internasional</h4>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <label className="col-sm-4" for="mdrt-year" data-i18n="year">Year</label>
                                        <select id="mdrt-year" className="col-sm-8 form-control year-selector"></select>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <label className="col-sm-4" for="mdrt-agency" data-i18n="agency">Agency</label>
                                        <select id="mdrt-agency" className="col-sm-8 form-control agencySelector"></select>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table id="table-mdrt" className="display nowrap table table-hover table-striped table-bordered" data-row-style="mdrtRowFormatter"
                                        data-toggle="table" data-url="" data-query-params="getMdrtList" data-response-handler="showMdrtList" data-fixed-columns="true" data-fixed-number="1"
                                        data-show-export="true" data-export-types="['xlsx']"
                                        data-toolbar="#mdrt-toolbar" cellspacing="0" width="100%">
                                        <thead><tr>
                                            <th data-field="agent-name">Nama Agen</th>
                                            <th data-field="current-fyp" data-formatter="mdrtIDRFormatter">FYP terkumpul</th>
                                            <th data-field="current-level">Level tercapai</th>
                                            <th data-field="next-level">Level selanjutnya</th>
                                            <th data-field="fyp-gap" data-formatter="mdrtIDRFormatter">FYP kurang</th>
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