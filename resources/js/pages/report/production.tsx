import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function Production() {
    return (
        <TemplateLayout>
            <Head title="Production Report" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="production-report">Laporan Komisi</h3> </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="report">Laporan</a></li>
                            <li className="breadcrumb-item active" data-i18n="production-report">Laporan Komisi</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div id="production-toolbar" className="form-inline">
                                    <div className="col-sm-5 form-group">
                                        <h4 className="card-title" data-i18n="agent-production-report">Laporan Produksi Agen</h4>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <label className="col-sm-4" for="production-agent" data-i18n="agent">Agent</label>
                                        <select id="production-agent" data-live-search="true" className="col-sm-8 form-control agentSelector"></select>
                                    </div>
                                    <div className="col-sm-3 form-group">
                                        <label className="col-sm-4" for="production-year" data-i18n="year">Month</label>
                                        <select id="production-year" className="col-sm-8 form-control year-selector"></select>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table id="table-production" className="display nowrap table table-hover table-striped table-bordered"
                                        data-toggle="table" data-url="" data-query-params="getProductionList" data-response-handler="showProductionList"
                                        data-show-footer="true" data-group-by="true" data-group-by-field="case_month"
                                        data-group-by-formatter="prodMonthFormatter" data-group-by-toggle="true" data-show-export="true"
                                        data-export-data-type="all" data-export-footer="true" data-export-types="['xlsx']" data-toolbar="#production-toolbar" cellspacing="0" width="100%">
                                        <thead>
                                        <tr>
                                            <th className="col-1" data-field="policy-no"></th>
                                            <th className="col-2" data-field="agent" data-formatter="agentFormat"></th>
                                            <th className="col-2" data-field="customer-name"></th>
                                            <th className="col-2" data-field="insured-name"></th>
                                            <th className="col-1" data-field="case-start-date"></th>
                                            <th className="col-2" data-field="case-product" data-formatter="productFormat"></th>
                                            <th className="col-1" data-field="status-polis"></th>
                                            <th className="col-1" data-field="case-pay-method" data-formatter="caraBayarFormatter" data-footer-formatter="totalTextFormatter"></th>
                                            <th className="col-1" data-field="case_premium" data-formatter="currencyFormat" data-footer-formatter="productionTotalFormatter"></th>
                                            <th className="col-1" data-field="topup_premium" data-formatter="currencyFormat" data-footer-formatter="productionTotalFormatter"></th>
                                            <th className="col-1" data-field="commision" data-footer-formatter="totalFormatter" data-formatter="productionIDRFormatter"></th>
                                            <th className="col-1" data-field="evaluation" data-footer-formatter="totalFormatter" data-formatter="productionIDRFormatter"></th>
                                            <th className="col-1" data-field="ot-contest" data-footer-formatter="totalFormatter" data-formatter="productionIDRFormatter"></th>
                                            <th className="col-1" data-field="mdrt" data-footer-formatter="totalFormatter" data-formatter="productionIDRFormatter"></th>
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