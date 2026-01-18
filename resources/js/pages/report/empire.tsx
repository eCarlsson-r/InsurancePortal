import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function EmpireClubReport() {
    return (
        <TemplateLayout>
            <Head title="Laporan Komisi Harian" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="empire-report">Laporan Empire Club</h3> </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="report">Laporan</a></li>
                            <li className="breadcrumb-item active" data-i18n="empire-report">Laporan Empire Club</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div id="empire-toolbar" className="form-inline">
                                    <div className="col-sm-4 form-group">
                                        <h4 className="card-title" data-i18n="empire-club-report">Laporan Pencapaian Empire Club</h4>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <label className="col-sm-4" for="empire-year" data-i18n="year">Year</label>
                                        <select id="empire-year" className="col-sm-8 form-control year-selector"></select>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <label className="col-sm-4" for="empire-agency" data-i18n="agency">Agency</label>
                                        <select id="empire-agency" className="col-sm-8 form-control agencySelector"></select>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table id="table-empire" className="display nowrap table table-hover table-striped table-bordered" data-row-style="empireRowFormatter"
                                        data-toggle="table" data-url="" data-query-params="getEmpireList" data-response-handler="showFnempireList" data-fixed-columns="true" data-fixed-number="1"
                                        data-group-by="true" data-group-by-field="position" data-group-by-toggle="true" data-group-by-formatter="empireGrouping" data-show-export="true" data-export-types="['xlsx']"
                                        data-toolbar="#empire-toolbar" cellspacing="0" width="100%">
                                        <thead><tr>
                                            <th data-field="agent-name">Nama Agen</th>
                                            <th data-field="current-ape" data-formatter="empireIDRFormatter">APE terkumpul</th>
                                            <th data-field="current-cases">Cases terkumpul</th>
                                            <th data-field="current-trip">Tiket tercapai</th>
                                            <th data-field="next-trip">Tiket selanjutnya</th>
                                            <th data-field="ape-gap" data-formatter="empireIDRFormatter">Kurang APE</th>
                                            <th data-field="cases-gap">Kurang Cases</th>
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