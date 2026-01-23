import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { exportTableToExcel } from '@/utils/exportToExcel';
import { router } from '@inertiajs/react';
import { Table } from 'react-bootstrap';

type AnnualData = {
    id: string,
    official_number: string,
    name: string,
    allowance: number,
    commision: number,
    recruit_bonus: number,
    overriding: number,
    annual_bonus: number,
    total_amount: number
};

export default function Annual({ data, year }: { data: AnnualData[]; year: string }) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handleChange = (value: string | number) => {
        router.get('/reports/annual', {
            year: value,
        });
    };

    const exportToExcel = () => {
        const exportData = data.map(item => ({
            'Kode Agen': item.official_number,
            'Nama Agen': item.name,
            'Komisi': item.commision,
            'Bonus Tahunan': item.annual_bonus,
            'Overriding': item.overriding,
            'Bonus Rekrut': item.recruit_bonus,
            'Allowance': item.allowance,
            'Total Komisi': item.total_amount
        }));

        exportTableToExcel(exportData, {
            fileName: 'Annual-Income-Report',
            sheetName: 'Income List Tahunan',
            currencyColumns: ['C', 'D', 'E', 'F', 'G'], // APE terkumpul and Kurang APE columns
        });
    };

    return (
        <TablePage
            headTitle="Income List Tahunan"
            title="Income List Tahunan"
            i18nTitle="annual-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Income List Tahunan', active: true, i18n: 'annual-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="customer-religion-report">
                        Income List Tahunan
                    </h4>
                    <div className="d-flex align-items-center gap-2">
                        <SelectInput
                            id="annual-year"
                            label="Year"
                            style={{ width: '200px' }}
                            placeholder="Pilih Tahun"
                            value={year}
                            onChange={handleChange}
                            options={[
                                ...Array.from({ length: 10 }, (_, i) => ({
                                    value: (new Date().getFullYear() - i).toString(),
                                    label: (new Date().getFullYear() - i).toString(),
                                })),
                            ]}
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
                        <th>Bonus Tahunan</th>
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
                                <td>{formatCurrency(record.commision)}</td>
                                <td>{formatCurrency(record.annual_bonus)}</td>
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
