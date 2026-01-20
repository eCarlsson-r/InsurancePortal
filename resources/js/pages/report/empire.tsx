import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';

export default function EmpireClubReport() {
    return (
        <TablePage
            headTitle="Empire Club Report"
            title="Laporan Empire Club"
            i18nTitle="empire-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Laporan Empire Club', active: true, i18n: 'empire-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="empire-club-report">
                        Laporan Pencapaian Empire Club
                    </h4>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="empire-year"
                                label="Year"
                                className="form-control-sm year-selector"
                                style={{ width: '100px' }}
                            />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="empire-agency"
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
                id="table-empire"
                className="display nowrap table table-hover table-striped table-bordered"
                data-row-style="empireRowFormatter"
                data-toggle="table"
                data-url=""
                data-query-params="getEmpireList"
                data-response-handler="showFnempireList"
                data-fixed-columns="true"
                data-fixed-number="1"
                data-group-by="true"
                data-group-by-field="position"
                data-group-by-toggle="true"
                data-group-by-formatter="empireGrouping"
                data-show-export="true"
                data-export-types="['xlsx']"
                data-toolbar="#empire-toolbar"
                cellSpacing="0"
                width="100%"
            >
                <thead>
                    <tr>
                        <th data-field="agent-name">Nama Agen</th>
                        <th data-field="current-ape" data-formatter="empireIDRFormatter">APE terkumpul</th>
                        <th data-field="current-cases">Cases terkumpul</th>
                        <th data-field="current-trip">Tiket tercapai</th>
                        <th data-field="next-trip">Tiket selanjutnya</th>
                        <th data-field="ape-gap" data-formatter="empireIDRFormatter">Kurang APE</th>
                        <th data-field="cases-gap">Kurang Cases</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </TablePage>
    );
}