import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function Generation() {
    return (
        <TemplateLayout>
            <Head title="Generation Report" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="generation-report">Laporan Generasi</h3> </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="report">Laporan</a></li>
                            <li className="breadcrumb-item active" data-i18n="generation-report">Laporan generation Financing</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div id="generation-toolbar" className="form-inline">
                                    <div className="col-sm-8 form-group">
                                        <h4 className="card-title" data-i18n="agent-generation-report">Laporan generation Agen</h4>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <label className="col-sm-4" for="generation-month" data-i18n="month">Month</label>
                                        <input type="month" id="generation-month" className="col-sm-8 form-control"/>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table id="table-generation" className="display nowrap table table-hover table-striped table-bordered" data-row-style="generationRowFormatter"
                                        data-toggle="table" data-url="" data-query-params="getGenerationList" data-response-handler="showGenerationList" 
                                        data-show-export="true" data-export-types="['xlsx']"
                                        data-toolbar="#generation-toolbar" cellspacing="0" width="100%">
                                        <thead><tr>
                                            <th data-field="agency-name">Nama Agency</th>
                                            <th data-field="agency-premium" data-formatter="generationIDRFormatter">Agency WAPE</th>
                                            <th data-field="generation-wape" data-formatter="generationIDRFormatter">Gen. WAPE</th>
                                            <th data-field="agency-policy">Agency Policy</th>
                                            <th data-field="generation-policy">Gen. Policy</th>
                                            <th data-field="agency-manpower">Agency Manpower</th>
                                            <th data-field="generation-manpower">Gen. Manpower</th>
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