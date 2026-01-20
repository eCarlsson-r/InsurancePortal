import MonthInput from '@/components/form/month-input';
import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';

export default function BonusGap() {
    return (
        <TablePage
            headTitle="Bonus Gap Report"
            title="Laporan Komisi"
            i18nTitle="bonus-gap-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Laporan Komisi', active: true, i18n: 'bonus-gap-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="agent-bonusgap-report">
                        Laporan Produksi Agen
                    </h4>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <MonthInput
                                id="bonusgap-month"
                                label="Bulan"
                                min="2022-01"
                                className="form-control-sm"
                                style={{ width: '150px' }}
                            />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="bonusgap-agency"
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
                id="table-bonusgap"
                className="display nowrap table table-hover table-striped table-bordered"
                data-toggle="table"
                data-pagination="true"
                data-page-size="10"
                data-page-list="[10, 25, 50, 100]"
                data-url=""
                data-query-params="getBonusgapList"
                data-response-handler="showBonusgapList"
                data-group-by="true"
                data-group-by-field="agent-leader"
                data-group-by-toggle="true"
                data-group-by-formatter="leader"
                data-show-export="true"
                data-export-data-type="all"
                data-export-footer="true"
                data-export-types="['xlsx']"
                data-toolbar="#bonusgap-toolbar"
                cellSpacing="0"
                width="100%"
            >
                <thead>
                    <tr>
                        <th className="col-3" rowSpan={2} data-field="agent-name">Nama Agen</th>
                        <th colSpan={3}>Production Bonus</th>
                        <th colSpan={3}>Half Year Bonus</th>
                        <th colSpan={3}>Year End Bonus</th>
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
        </TablePage>
    );
}