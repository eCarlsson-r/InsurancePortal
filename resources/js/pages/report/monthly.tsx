import MonthInput from '@/components/form/month-input';
import TablePage from '@/layouts/TablePage';
import { router } from '@inertiajs/react';
import { Table } from 'react-bootstrap';
import { exportTableToExcel } from '@/utils/exportToExcel';
import { useState } from 'react';

type MonthlyData = {
    id: string,
    official_number: string,
    name: string,
    allowance: number,
    commission: number,
    production_bonus: number,
    recruit_bonus: number,
    overriding: number,
    total_amount: number
};

export default function Monthly({ data, month }: { data: MonthlyData[]; month: string }) {
    const [selectedMonth, setSelectedMonth] = useState(month);
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMonth(e.target.value);
        router.get('/reports/monthly', {
            month: e.target.value,
        });
    };

    const exportToExcel = () => {
        const exportData = data.map(item => ({
            'Kode Agen': item.official_number,
            'Nama Agen': item.name,
            'Komisi': item.commission,
            'Production Bonus': item.production_bonus,
            'Overriding': item.overriding,
            'Bonus Rekrut': item.recruit_bonus,
            'Allowance': item.allowance,
            'Total Komisi': item.total_amount
        }));

        exportTableToExcel(exportData, {
            fileName: 'Monthly-Income-Report',
            sheetName: 'Income List Bulanan',
            currencyColumns: ['C', 'D', 'E', 'F', 'G'], // APE terkumpul and Kurang APE columns
        });
    };

    return (
        <TablePage
            headTitle="Income List Bulanan"
            title="Income List Bulanan"
            i18nTitle="monthly-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Income List Bulanan', active: true, i18n: 'monthly-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="customer-religion-report">
                        Income List per Bulan
                    </h4>
                    <div className="d-flex align-items-center gap-2">
                        <MonthInput
                            id="monthly-month"
                            label="Year"
                            style={{ width: '200px' }}
                            value={selectedMonth}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        className="btn btn-success"
                        onClick={exportToExcel}
                        disabled={data.length === 0}
                    >
                        Ekspor ke Excel
                    </button>
                </div>
            }
        >
            <Table hover striped bordered>
                <thead>
                    <tr>
                        <th>Kode Agen</th>
                        <th>Nama Agen</th>
                        <th>Komisi</th>
                        <th>Production Bonus</th>
                        <th>Overriding</th>
                        <th>Bonus Rekrut</th>
                        <th>Allowance</th>
                        <th>Total Komisi</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((record) => (
                            <tr key={record.id}>
                                <td>{record.official_number}</td>
                                <td>{record.name}</td>
                                <td>{formatCurrency(record.commission)}</td>
                                <td>{formatCurrency(record.production_bonus)}</td>
                                <td>{formatCurrency(record.overriding)}</td>
                                <td>{formatCurrency(record.recruit_bonus)}</td>
                                <td>{formatCurrency(record.allowance)}</td>
                                <td>{formatCurrency(record.total_amount)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="text-center text-muted py-4">
                                No agent found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </TablePage>
    );
}
