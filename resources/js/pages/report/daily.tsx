import DateInput from '@/components/form/date-input';
import TablePage from '@/layouts/TablePage';

export default function DailyReport() {
    return (
        <TablePage
            headTitle="Daily Commission Report"
            title="Laporan Komisi Harian"
            i18nTitle="daily-commision-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Laporan Komisi Harian', active: true, i18n: 'daily-commision-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <div>
                        <h4 className="card-title mb-1" data-i18n="daily-commision-report">Laporan Komisi Harian</h4>
                        <h6 className="mb-0" data-i18n="daily-commision-report-desc">Laporan Komisi dari SP setiap harinya.</h6>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <DateInput
                            id="daily-date"
                            label="Date"
                            className="form-control-sm input-rounded"
                            style={{ width: '150px' }}
                        />
                    </div>
                </div>
            }
        >
            <table
                id="table-dailycom"
                className="display nowrap table table-hover table-striped table-bordered"
                data-toggle="table"
                data-page-size="5"
                data-page-list="[5,10, 25, 50, 100]"
                data-url=""
                data-query-params="getDailycomList"
                data-response-handler="showDailycomList"
                data-toolbar="#daily-report-toolbar"
                cellSpacing={0}
                width="100%"
            >
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
                <tbody></tbody>
            </table>
        </TablePage>
    );
}