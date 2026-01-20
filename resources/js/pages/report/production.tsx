import MonthInput from '@/components/form/month-input';
import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';

export default function Production() {
    return (
        <TablePage
            headTitle="Production Report"
            title="Laporan Produksi"
            i18nTitle="production-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Laporan Produksi', active: true, i18n: 'production-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="agent-production-report">
                        Laporan Produksi Agen
                    </h4>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <MonthInput
                                id="prod-month"
                                label="Month"
                                className="form-control-sm"
                                style={{ width: '150px' }}
                            />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="prod-agency"
                                label="Agency"
                                className="form-control-sm agencySelector"
                                style={{ width: '150px' }}
                            />
                        </div>
                    </div>
                </div>
            }
        >
            <table
                id="table-production"
                className="display nowrap table table-hover table-striped table-bordered"
                data-toggle="table"
                data-url=""
                data-query-params="getProductionList"
                data-response-handler="showProductionList"
                data-show-export="true"
                data-export-types="['xlsx']"
                data-toolbar="#production-toolbar"
                cellSpacing={0}
                width="100%"
            >
                <thead>
                    <tr>
                        <th data-field="agent-name">Nama Agen</th>
                        <th data-field="case-count">SP</th>
                        <th data-field="case-premium" data-formatter="productionIDRFormatter">FYP</th>
                        <th data-field="topup-premium" data-formatter="productionIDRFormatter">Topup</th>
                        <th data-field="case-ape" data-formatter="productionIDRFormatter">APE</th>
                        <th data-field="contest-ape" data-formatter="productionIDRFormatter">Contest</th>
                        <th data-field="total-commission" data-formatter="productionIDRFormatter">Komisi</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </TablePage>
    );
}