import MonthInput from '@/components/form/month-input';
import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';

export default function DueDate() {
    return (
        <TablePage
            headTitle="Due Date Report"
            title="Laporan Jatuh Tempo"
            i18nTitle="due-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Laporan Jatuh Tempo', active: true, i18n: 'due-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <div className="card-title mb-0">
                        <h4 className="mb-1" data-i18n="due-report">Laporan Jatuh Tempo</h4>
                        <h6 className="mb-0"><span data-i18n="due-report-desc">Laporan Polis Nasabah yang Jatuh Tempo.</span></h6>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <MonthInput
                                id="due-month"
                                label="Month"
                                className="form-control-sm input-rounded"
                                style={{ width: '150px' }}
                            />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="due-agent"
                                label="Agent"
                                className="form-control-sm agentSelector input-rounded"
                                style={{ width: '200px' }}
                            />
                        </div>
                    </div>
                </div>
            }
        >
            <table 
                id="table-duedate" 
                className="display nowrap table table-hover table-striped table-bordered"
                data-toggle="table" 
                data-page-size="5" 
                data-page-list="[5,10, 25, 50, 100]" 
                data-url=""
                data-query-params="getDuedateList" 
                data-response-handler="showDuedateList" 
                data-show-export="true" 
                data-export-data-type="all" 
                data-export-footer="true" 
                data-export-types="['xlsx']"
                data-toolbar="#due-report-toolbar" 
                cellSpacing="0" 
                width="100%"
            >
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
        </TablePage>
    );
}