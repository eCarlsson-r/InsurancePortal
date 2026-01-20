import MonthInput from '@/components/form/month-input';
import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';

export default function Program() {
    return (
        <TablePage
            headTitle="Program Report"
            title="Laporan Program Financing"
            i18nTitle="program-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Laporan Program Financing', active: true, i18n: 'program-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="agent-program-report">
                        Laporan Program Agen
                    </h4>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <MonthInput
                                id="program-month"
                                label="Month"
                                className="form-control-sm"
                                style={{ width: '150px' }}
                            />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="program-agency"
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
                id="table-fnprogram"
                className="display nowrap table table-hover table-striped table-bordered"
                data-row-style="programRowFormatter"
                data-toggle="table"
                data-url=""
                data-query-params="getprogramList"
                data-response-handler="showprogramList"
                data-group-by="true"
                data-group-by-field="agent-leader"
                data-group-by-show-toggle-icon="true"
                data-group-by-toggle="true"
                data-group-by-formatter="leader"
                data-show-export="true"
                data-export-types="['xlsx']"
                data-toolbar="#rprogram-toolbar"
                cellSpacing="0"
                width="100%"
            >
                <thead>
                    <tr>
                        <th data-field="agent-name">Nama Agen</th>
                        <th data-field="start-month">Starting Month</th>
                        <th data-field="program">Program</th>
                        <th data-field="month">Month Period</th>
                        <th data-field="mtd-target" data-formatter="programIDRFormatter">Target MTD</th>
                        <th data-field="mtd-achieved" data-formatter="programIDRFormatter">Pencapaian MTD</th>
                        <th data-field="mtd-gap" data-formatter="programIDRFormatter">Kurang MTD</th>
                        <th data-field="ytd-target" data-formatter="programIDRFormatter">Target YTD</th>
                        <th data-field="ytd-achieved" data-formatter="programIDRFormatter">Pencapaian YTD</th>
                        <th data-field="ytd-gap" data-formatter="programIDRFormatter">Kurang YTD</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </TablePage>
    );
}