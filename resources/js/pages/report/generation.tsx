import MonthInput from '@/components/form/month-input';
import TablePage from '@/layouts/TablePage';

export default function Generation() {
    return (
        <TablePage
            headTitle="Generation Report"
            title="Laporan Generasi"
            i18nTitle="generation-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Laporan Generasi', active: true, i18n: 'generation-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="agent-generation-report">
                        Laporan Generasi Agen
                    </h4>
                    <div className="d-flex align-items-center gap-2">
                        <MonthInput
                            id="generation-month"
                            label="Month"
                            className="form-control-sm"
                            style={{ width: '150px' }}
                        />
                    </div>
                </div>
            }
        >
            <table
                id="table-generation"
                className="display nowrap table table-hover table-striped table-bordered"
                data-row-style="generationRowFormatter"
                data-toggle="table"
                data-url=""
                data-query-params="getGenerationList"
                data-response-handler="showGenerationList"
                data-show-export="true"
                data-export-types="['xlsx']"
                data-toolbar="#generation-toolbar"
                cellSpacing="0"
                width="100%"
            >
                <thead>
                    <tr>
                        <th data-field="agency-name">Nama Agency</th>
                        <th data-field="agency-premium" data-formatter="generationIDRFormatter">Agency WAPE</th>
                        <th data-field="generation-wape" data-formatter="generationIDRFormatter">Gen. WAPE</th>
                        <th data-field="agency-policy">Agency Policy</th>
                        <th data-field="generation-policy">Gen. Policy</th>
                        <th data-field="agency-manpower">Agency Manpower</th>
                        <th data-field="generation-manpower">Gen. Manpower</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </TablePage>
    );
}