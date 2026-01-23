import MonthInput from '@/components/form/month-input';
import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { agencySchema } from '@/schemas/models';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';
import { exportTableToExcel } from '@/utils/exportToExcel';

type ProgramData = {
    name: string;
    start_month: string;
    program: string;
    month: string;
    mtd_target: number;
    mtd_achieved: number;
    mtd_gap: number;
    ytd_target: number;
    ytd_achieved: number;
    ytd_gap: number;
};
export default function Program({data, agencies, report_month, report_agency}: {
    data: ProgramData[];
    agencies: z.infer<typeof agencySchema>[];
    report_month: string | null;
    report_agency: string | null;
}) {
    const [month, setMonth] = useState(report_month || '');
    const [agency, setAgency] = useState(report_agency || '');

    const exportToExcel = () => {
        const exportData = data.map(item => ({
            'Nama Agen': item.name,
            'Starting Month': item.start_month,
            'Program': item.program,
            'Month Period': item.month,
            'Target MTD': item.mtd_target,
            'Pencapaian MTD': item.mtd_achieved,
            'Kurang MTD': item.mtd_gap,
            'Target YTD': item.ytd_target,
            'Pencapaian YTD': item.ytd_achieved,
            'Kurang YTD': item.ytd_gap,
        }));

        exportTableToExcel(exportData, {
            fileName: 'Program-Report',
            sheetName: 'Program Report',
            currencyColumns: ['E', 'F', 'G', 'H', 'I', 'J'],
        });
    };

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
                                style={{ width: '200px' }}
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="program-agency"
                                label="Agency"
                                style={{ width: '300px' }}
                                value={agency}
                                onChange={(value) => setAgency(value.toString())}
                                options={agencies.map((agency) => ({
                                    value: agency.id?.toString() || '',
                                    label: agency.name,
                                }))}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (month && agency) router.visit(`/reports/financing?report_month=${month}&report_agency=${agency}`);
                            }}
                        >
                            Cari
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={exportToExcel}
                            disabled={data.length === 0}
                        >
                            Ekspor ke Excel
                        </button>
                    </div>
                </div>
            }
        >
            <Table hover striped bordered>
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
                <tbody>
                    {(data.length > 0)?(data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.start_month}</td>
                            <td>{item.program}</td>
                            <td>{item.month}</td>
                            <td>{Number(item.mtd_target).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                            <td>{Number(item.mtd_achieved).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                            <td>{Number(item.mtd_gap).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                            <td>{Number(item.ytd_target).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                            <td>{Number(item.ytd_achieved).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                            <td>{Number(item.ytd_gap).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                        </tr>
                    ))):(
                        <tr>
                            <td colSpan={10} className="text-center">No data available</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </TablePage>
    );
}
