import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <TemplateLayout>
            <Head title="Dashboard" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="daily-commision-report">Laporan Komisi Harian</h3> </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="report">Laporan</a></li>
                            <li className="breadcrumb-item active" data-i18n="daily-commision-report">Laporan Komisi Harian</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div id="daily-report-toolbar" className="form-inline">
                                    <div className="col-sm-7 card-title form-group">
                                        <h4 data-i18n="daily-commision-report">Laporan Komisi Harian</h4>
                                        <h6 data-i18n="daily-commision-report-desc">Laporan Komisi dari SP setiap harinya.</h6>
                                    </div>
                                    <div className="col-sm-5 form-group">
                                        <label className="col-sm-4" htmlFor="daily-date" data-i18n="date">Month</label>
                                        <input type="date" id="daily-date" className="col-sm-8 form-control input-rounded"/>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table id="table-dailycom" className="display nowrap table table-hover table-striped table-bordered"
                                        data-toggle="table" data-page-size="5" data-page-list="[5,10, 25, 50, 100]" data-url=""
                                        data-query-params="getDailycomList" data-response-handler="showDailycomList"
                                        data-toolbar="#daily-report-toolbar" cellSpacing={0} width="100%">
                                        <thead>
                                        <tr>
                                            <th data-field="case-entry-date">Tgl.</th>
                                            <th data-field="agent-name">Agen</th>
                                            <th data-field="case-code">No. SP</th>
                                            <th data-field="case_first_premium" data-formatter="currencyFormat">Premi Pertama</th>
                                            <th data-field="case_continue_premium" data-formatter="currencyFormat">PLTP</th>
                                            <th data-field="case-start-date">Mulai Asuransi</th>
                                            <th data-field="product-name">Produk</th>
                                            <th data-field="commision" data-formatter="dailycomIDRFormatter">Komisi</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        </tbody>
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