import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function DueDate() {
    return (
        <TemplateLayout>
            <Head title="Due Date Report" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="policy-report">Laporan Polis</h3> </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="report">Laporan</a></li>
                            <li className="breadcrumb-item active" data-i18n="policy-report">Laporan Polis</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div id="policies-toolbar" className="form-inline">
                                    <div className="col-sm-5 form-group">
                                        <h4 className="card-title" data-i18n="customer-policy-report">Laporan Polis Nasabah</h4>
                                    </div>
                                    <div className="col-sm-7 form-group">
                                        <label className="col-sm-4" for="policy-customers" data-i18n="customer">Pemegang Polis</label>
                                        <select id="policy-customers" data-live-search="true" className="col-sm-8 form-control customerSelector" multiple="true"></select>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table id="table-policies" className="display nowrap table table-hover table-striped table-bordered"
                                        data-toggle="table" data-url="" data-query-params="getPoliciesList" data-response-handler="showPoliciesList" data-show-footer="true" 
                                        data-show-export="true" data-export-data-type="all" data-export-footer="true" data-export-types="['xlsx']" data-toolbar="#policies-toolbar">
                                        <thead>
                                        <tr>
                                            <th className="col-1" data-field="policy-no"></th>
                                            <th className="col-2" data-field="customer-name"></th>
                                            <th className="col-2" data-field="insured-name"></th>
                                            <th className="col-1" data-field="case-start-date"></th>
                                            <th className="col-2" data-field="case-product" data-formatter="productFormat"></th>
                                            <th className="col-1" data-field="case-pay-method" data-formatter="caraBayarFormatter" data-footer-formatter="totalTextFormatter"></th>
                                            <th className="col-1" data-field="case_premium" data-formatter="currencyFormat" data-footer-formatter="productionTotalFormatter"></th>
                                            <th className="col-1" data-field="case-base-insure" data-formatter="currencyFormat" data-footer-formatter="productionTotalFormatter"></th>
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