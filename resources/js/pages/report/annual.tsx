import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { exportTableToExcel } from '@/utils/exportToExcel';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap';

type AnnualData = {
    id: string;
    official_number: string;
    name: string;
    allowance: number;
    commission: number;
    recruit_bonus: number;
    overriding: number;
    annual_bonus: number;
    total_amount: number;
};

export default function Annual({
    data,
    year,
}: {
    data: AnnualData[];
    year: string;
}) {
    const { t } = useTranslation();

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
        const exportData = data.map((item) => ({
            'Kode Agen': item.official_number,
            'Nama Agen': item.name,
            Komisi: item.commission,
            'Bonus Tahunan': item.annual_bonus,
            Overriding: item.overriding,
            'Bonus Rekrut': item.recruit_bonus,
            Allowance: item.allowance,
            'Total Komisi': item.total_amount,
        }));

        exportTableToExcel(exportData, {
            fileName: 'Annual-Income-Report',
            sheetName: 'Income List Tahunan',
            currencyColumns: ['C', 'D', 'E', 'F', 'G'], // APE terkumpul and Kurang APE columns
        });
    };

    return (
        <TablePage
            headTitle={t('report.annual-report')}
            title={t('report.annual-report')}
            i18nTitle="annual-report"
            breadcrumbs={[
                {
                    label: t('common.reports'),
                    href: 'javascript:void(0)',
                    i18n: 'report',
                },
                {
                    label: t('report.annual-report'),
                    active: true,
                    i18n: 'annual-report',
                },
            ]}
            toolbar={
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 w-100">
                    <h4 className="card-title mb-0">
                        {t('report.agent_annual_report')}
                    </h4>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <SelectInput
                            id="annual-year"
                            label={t('common.year')}
                            style={{ width: '200px' }}
                            placeholder={t('common.select_year')}
                            value={year}
                            onChange={handleChange}
                            options={[
                                ...Array.from({ length: 10 }, (_, i) => ({
                                    value: (
                                        new Date().getFullYear() - i
                                    ).toString(),
                                    label: (
                                        new Date().getFullYear() - i
                                    ).toString(),
                                })),
                            ]}
                        />
                    </div>
                    <button
                        className="btn btn-success"
                        onClick={exportToExcel}
                        disabled={data.length === 0}
                    >
                        {t('common.export_excel')}
                    </button>
                </div>
            }
        >
            <Table hover striped bordered responsive>
                <thead>
                    <tr>
                        <th>{t('agent.agent_code')}</th>
                        <th>{t('agent.agent_name')}</th>
                        <th>{t('report.commission')}</th>
                        <th>{t('report.annual_bonus')}</th>
                        <th>{t('report.overriding')}</th>
                        <th>{t('report.recruit_bonus')}</th>
                        <th>{t('report.allowance')}</th>
                        <th>{t('report.total_amount')}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((record) => (
                            <tr key={record.id}>
                                <td>{record.official_number}</td>
                                <td>{record.name}</td>
                                <td>{formatCurrency(record.commission)}</td>
                                <td>{formatCurrency(record.annual_bonus)}</td>
                                <td>{formatCurrency(record.overriding)}</td>
                                <td>{formatCurrency(record.recruit_bonus)}</td>
                                <td>{formatCurrency(record.allowance)}</td>
                                <td>{formatCurrency(record.total_amount)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={8}
                                className="text-center text-muted py-4"
                            >
                                {t('agent.noAgentsFound')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </TablePage>
    );
}
