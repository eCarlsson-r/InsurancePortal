import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function BonusGap() {
    return (
        <TemplateLayout>
            <Head title="Bonus Gap Report" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="bonus-gap-report">Laporan Komisi</h3> </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="report">Laporan</a></li>
                            <li className="breadcrumb-item active" data-i18n="bonus-gap-report">Laporan Komisi</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div id="bonusgap-toolbar" className="form-inline">
                                    <div className="col-sm-4 form-group">
                                        <h4 className="card-title" data-i18n="agent-bonusgap-report">Laporan Produksi Agen</h4>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <label className="col-sm-4" for="bonusgap-month" data-i18n="month">Bulan</label>
                                        <input type="month" id="bonusgap-month" className="col-sm-8 form-control" min="2022-01"/>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <label className="col-sm-4" for="bonusgap-agency" data-i18n="agency">agency</label>
                                        <select id="bonusgap-agency" className="col-sm-8 form-control agencySelector"></select>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table id="table-bonusgap" className="display nowrap table table-hover table-striped table-bordered" 
                                        data-toggle="table" data-pagination="true" data-page-size="10" data-page-list="[10, 25, 50, 100]"
                                        data-url="" data-query-params="getBonusgapList" data-response-handler="showBonusgapList"
                                        data-group-by="true" data-group-by-field="agent-leader" data-group-by-toggle="true" data-group-by-formatter="leader"
                                        data-show-export="true" data-export-data-type="all" data-export-footer="true" data-export-types="['xlsx']" data-toolbar="#bonusgap-toolbar" cellspacing="0" width="100%">
                                        <thead>
                                            <tr>
                                                <th className="col-3" rowspan="2" data-field="agent-name">Nama Agen</th>
                                                <th colspan="3">Production Bonus</th>
                                                <th colspan="3">Half Year Bonus</th>
                                                <th colspan="3">Year End Bonus</th>
                                            </tr>
                                            <tr>
                                                <th data-field="mtd-ape" data-formatter="bonusgapIDRFormatter">Pencapaian</th>
                                                <th data-field="present-spb">Bonus (%)</th>
                                                <th data-field="spb-gap" data-formatter="bonusgapIDRFormatter">Kekurangan</th>
                                                <th data-field="std-ape" data-formatter="bonusgapIDRFormatter">Pencapaian</th>
                                                <th data-field="present-hyb">Bonus (%)</th>
                                                <th data-field="hyb-gap" data-formatter="bonusgapIDRFormatter">Kekurangan</th>
                                                <th data-field="ytd-ape" data-formatter="bonusgapIDRFormatter">Pencapaian</th>
                                                <th data-field="present-yeb">Bonus (%)</th>
                                                <th data-field="yeb-gap" data-formatter="bonusgapIDRFormatter">Kekurangan</th>
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