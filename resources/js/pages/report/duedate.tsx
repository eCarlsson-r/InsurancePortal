import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function DueDate() {
    return (
        <TemplateLayout>
            <Head title="Due Date Report" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="due-report">Laporan Jatuh Tempo</h3> </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="report">Laporan</a></li>
                            <li className="breadcrumb-item active" data-i18n="due-report">Laporan Jatuh Tempo</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div id="due-report-toolbar" className="form-inline">
                                    <div className="col-sm-4 card-title">
                                        <h4 data-i18n="due-report">Laporan Jatuh Tempo</h4>
                                        <h6><span data-i18n="due-report-desc">Laporan Polis Nasabah yang Jatuh Tempo.</span></h6>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <label className="col-sm-4" for="due-month" data-i18n="month">Month</label>
                                        <input type="month" id="due-month" className="col-sm-8 form-control input-rounded"/>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <label className="col-sm-4" for="due-agent" data-i18n="agent">Agent</label>
                                        <select id="due-agent" data-live-search="true" className="col-sm-8 form-control agentSelector"></select>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table id="table-duedate" className="display nowrap table table-hover table-striped table-bordered"
                                        data-toggle="table" data-page-size="5" data-page-list="[5,10, 25, 50, 100]" data-url=""
                                        data-query-params="getDuedateList" data-response-handler="showDuedateList" data-show-export="true" 
                                        data-export-data-type="all" data-export-footer="true" data-export-types="['xlsx']"
                                        data-toolbar="#due-report-toolbar" cellspacing="0" width="100%">
                                        <thead>
                                            <tr>
                                                <th className="col-1" data-field="receipt-policy">No. Polis</th>
                                                <th className="col-2" data-field="customer-name">Pemegang Polis</th>
                                                <th className="col-2" data-field="insured-name">Tertanggung</th>
                                                <th className="col-1" data-field="insured-birthdate" data-formatter="duedateDateFormatter">Tgl. Lahir Tertanggung</th>
                                                <th className="col-1" data-field="case-product" data-formatter="productFormat">Produk</th>
                                                <th className="col-1" data-field="receipt-pay-date" data-formatter="duedateDateFormatter">Jatuh Tempo</th>
                                                <th className="col-1" data-field="receipt-premium" data-formatter="duedateIDRFormatter">Premi</th>
                                                <th className="col-1" data-field="receipt-pay-method" data-formatter="caraBayarFormatter">Cara Bayar</th>
                                                <th className="col-2" data-field="customer-address">Alamat Penagihan</th>
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