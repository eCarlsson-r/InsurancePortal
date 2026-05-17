import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { exportTableToExcel } from '@/utils/exportToExcel';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap';

type SemesterData = {
    id: string;
    name: string;
    january: number;
    february: number;
    march: number;
    april: number;
    may: number;
    june: number;
    s1: number;
    s1_bonus: number;
    july: number;
    august: number;
    september: number;
    october: number;
    november: number;
    december: number;
    s2: number;
    s2_bonus: number;
    total: number;
};

export default function Semester({
    data,
    year,
}: {
    data: SemesterData[];
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
        router.get('/reports/semester', {
            year: value,
        });
    };

    const exportToExcel = () => {
        const exportData = data.map((item) => ({
            'Nama Agen': item.name,
            Januari: item.january,
            Februari: item.february,
            Maret: item.march,
            April: item.april,
            Mei: item.may,
            Juni: item.june,
            'Total S1': item.s1,
            'Bonus S1': item.s1_bonus,
            Juli: item.july,
            Agustus: item.august,
            September: item.september,
            Oktober: item.october,
            November: item.november,
            Desember: item.december,
            'Total S2': item.s2,
            'Bonus S2': item.s2_bonus,
            'Total Bonus': item.total,
        }));

        exportTableToExcel(exportData, {
            fileName: 'Semester-Income-Report',
            sheetName: 'Income List Semester',
            currencyColumns: [
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
            ],
        });
    };

    return (
        <TablePage
            headTitle={t('report.semester-report')}
            title={t('report.semester-report')}
            i18nTitle="semester-report"
            breadcrumbs={[
                {
                    label: t('common.reports'),
                    href: 'javascript:void(0)',
                    i18n: 'report',
                },
                {
                    label: t('report.semester-report'),
                    active: true,
                    i18n: 'semester-report',
                },
            ]}
            toolbar={
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 w-100">
                    <h4 className="card-title mb-0">
                        {t('report.agent_semester_report')}
                    </h4>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <SelectInput
                            id="semester-year"
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
                        <th>{t('agent.agent_name')}</th>
                        <th>{t('months.january')}</th>
                        <th>{t('months.february')}</th>
                        <th>{t('months.march')}</th>
                        <th>{t('months.april')}</th>
                        <th>{t('months.may')}</th>
                        <th>{t('months.june')}</th>
                        <th>{t('report.total_s1')}</th>
                        <th>{t('report.s1_bonus')}</th>
                        <th>{t('months.july')}</th>
                        <th>{t('months.august')}</th>
                        <th>{t('months.september')}</th>
                        <th>{t('months.october')}</th>
                        <th>{t('months.november')}</th>
                        <th>{t('months.december')}</th>
                        <th>{t('report.total_s2')}</th>
                        <th>{t('report.s2_bonus')}</th>
                        <th>{t('report.total_bonus')}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((record) => (
                            <tr key={record.id}>
                                <td>{record.name}</td>
                                <td>{formatCurrency(record.january)}</td>
                                <td>{formatCurrency(record.february)}</td>
                                <td>{formatCurrency(record.march)}</td>
                                <td>{formatCurrency(record.april)}</td>
                                <td>{formatCurrency(record.may)}</td>
                                <td>{formatCurrency(record.june)}</td>
                                <td>{formatCurrency(record.s1)}</td>
                                <td>{formatCurrency(record.s1_bonus)}</td>
                                <td>{formatCurrency(record.july)}</td>
                                <td>{formatCurrency(record.august)}</td>
                                <td>{formatCurrency(record.september)}</td>
                                <td>{formatCurrency(record.october)}</td>
                                <td>{formatCurrency(record.november)}</td>
                                <td>{formatCurrency(record.december)}</td>
                                <td>{formatCurrency(record.s2)}</td>
                                <td>{formatCurrency(record.s2_bonus)}</td>
                                <td>{formatCurrency(record.total)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={18}
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
