import TablePage from '@/layouts/TablePage';

export default function MDRTReport() {
    return (
        <TablePage
            headTitle="MDRT Report"
            title="Laporan MDRT Internasional"
            i18nTitle="mdrt-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Laporan MDRT Internasional', active: true, i18n: 'mdrt-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="mdrt-international-report">
                        Laporan Pencapaian MDRT Internasional
                    </h4>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <label htmlFor="mdrt-year" className="mb-0" data-i18n="year">Year</label>
                            <select id="mdrt-year" className="form-control form-control-sm year-selector" style={{ width: '100px' }}></select>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <label htmlFor="mdrt-agency" className="mb-0" data-i18n="agency">Agency</label>
                            <select id="mdrt-agency" className="form-control form-control-sm agencySelector" style={{ width: '150px' }}></select>
                        </div>
                    </div>
                </div>
            }
        >
            <table
                id="table-mdrt"
                className="display nowrap table table-hover table-striped table-bordered"
                data-row-style="mdrtRowFormatter"
                data-toggle="table"
                data-url=""
                data-query-params="getMdrtList"
                data-response-handler="showMdrtList"
                data-fixed-columns="true"
                data-fixed-number="1"
                data-show-export="true"
                data-export-types="['xlsx']"
                data-toolbar="#mdrt-toolbar"
                cellSpacing="0"
                width="100%"
            >
                <thead>
                    <tr>
                        <th data-field="agent-name">Nama Agen</th>
                        <th data-field="current-fyp" data-formatter="mdrtIDRFormatter">FYP terkumpul</th>
                        <th data-field="current-level">Level tercapai</th>
                        <th data-field="next-level">Level selanjutnya</th>
                        <th data-field="fyp-gap" data-formatter="mdrtIDRFormatter">FYP kurang</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </TablePage>
    );
}