import MonthInput from '@/components/form/month-input';
import TablePage from '@/layouts/TablePage';
import { exportTableToExcel } from '@/utils/exportToExcel';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Table } from 'react-bootstrap';

type MonthlyData = {
    id: string;
    official_number: string;
    name: string;
    allowance: number;
    commission: number;
    production_bonus: number;
    recruit_bonus: number;
    overriding: number;
    total_amount: number;
};

export default function Monthly({
    data,
    report_month,
}: {
    data: MonthlyData[];
    report_month: string;
}) {
    const { t } = useTranslation();
    const [month, setMonth] = useState(report_month);
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMonth(e.target.value);
        router.get('/reports/monthly', {
            report_month: e.target.value,
        });
    };

    const exportToExcel = () => {
        const exportData = data.map((item) => ({
            'Kode Agen': item.official_number,
            'Nama Agen': item.name,
            Komisi: item.commission,
            'Production Bonus': item.production_bonus,
            Overriding: item.overriding,
            'Bonus Rekrut': item.recruit_bonus,
            Allowance: item.allowance,
            'Total Komisi': item.total_amount,
        }));

        exportTableToExcel(exportData, {
            fileName: 'Monthly-Income-Report',
            sheetName: 'Income List Bulanan',
            currencyColumns: ['C', 'D', 'E', 'F', 'G'], // APE terkumpul and Kurang APE columns
        });
    };

    return (
        <TablePage
            headTitle={t('report.monthly-report')}
            title={t('report.monthly-report')}
            i18nTitle="monthly-report"
            breadcrumbs={[
                {
                    label: t('common.reports'),
                    href: 'javascript:void(0)',
                    i18n: 'report',
                },
                {
                    label: t('report.monthly-report'),
                    active: true,
                    i18n: 'monthly-report',
                },
            ]}
            toolbar={
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 w-100">
                    <h4 className="card-title mb-0">
                        {t('report.agent_monthly_report')}
                    </h4>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <MonthInput
                            id="monthly-month"
                            label={t('common.year')}
                            style={{ width: '200px' }}
                            value={month}
                            onChange={handleChange}
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
                        <th>{t('report.production_bonus')}</th>
                        <th>{t('report.overriding')}</th>
                        <th>{t('report.recruit_bonus')}</th>
                        <th>{t('report.allowance')}</th>
                        <th>{t('report.total_commission')}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((record) => (
                            <tr key={record.id}>
                                <td>{record.official_number}</td>
                                <td>{record.name}</td>
                                <td>{formatCurrency(record.commission)}</td>
                                <td>
                                    {formatCurrency(record.production_bonus)}
                                </td>
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
