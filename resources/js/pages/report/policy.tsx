import TablePage from '@/layouts/TablePage';

export default function PolicyReport() {
    return (
        <TablePage
            headTitle="Policy Report"
            title="Laporan Polis"
            i18nTitle="policy-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Laporan Polis', active: true, i18n: 'policy-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <div className="card-title mb-0">
                        <h4 className="mb-0" data-i18n="customer-policy-report">Laporan Polis Nasabah</h4>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="policy-customers" className="mb-0" data-i18n="customer">Pemegang Polis</label>
                        <div style={{ width: '300px' }}>
                            <select id="policy-customers" className="form-control form-control-sm customerSelector" multiple={true}></select>
                        </div>
                    </div>
                </div>
            }
        >
            <table
                id="table-policies"
                className="display nowrap table table-hover table-striped table-bordered"
                data-toggle="table"
                data-url=""
                data-query-params="getPoliciesList"
                data-response-handler="showPoliciesList"
                data-show-footer="true"
                data-show-export="true"
                data-export-data-type="all"
                data-export-footer="true"
                data-export-types="['xlsx']"
                data-toolbar="#policies-toolbar"
            >
                <thead>
                    <tr>
                        <th className="col-1" data-field="policy-no">No. Polis</th>
                        <th className="col-2" data-field="customer-name">Nama Nasabah</th>
                        <th className="col-2" data-field="insured-name">Nama Tertanggung</th>
                        <th className="col-1" data-field="case-start-date">Tgl. Mulai</th>
                        <th className="col-2" data-field="case-product" data-formatter="productFormat">Produk</th>
                        <th className="col-1" data-field="case-pay-method" data-formatter="caraBayarFormatter" data-footer-formatter="totalTextFormatter">Cara Bayar</th>
                        <th className="col-1" data-field="case_premium" data-formatter="currencyFormat" data-footer-formatter="productionTotalFormatter">Premi</th>
                        <th className="col-1" data-field="case-base-insure" data-formatter="currencyFormat" data-footer-formatter="productionTotalFormatter">Uang Pertanggungan</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </TablePage>
    );
}