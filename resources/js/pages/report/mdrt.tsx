import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { agencySchema } from '@/schemas/models';
import { exportTableToExcel } from '@/utils/exportToExcel';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

type ReportData = {
    agent_name: string;
    current_fyp: number;
    current_level: number;
    next_level: number;
    fyp_gap: number;
};

export default function MDRTReport({
    data,
    agencies,
    prod_agency,
    prod_year,
}: {
    data: ReportData[];
    agencies: z.infer<typeof agencySchema>[];
    prod_agency: string;
    prod_year: string;
}) {
    const { t } = useTranslation();
    const [year, setYear] = useState(prod_year || '');
    const [agency, setAgency] = useState(prod_agency || '');

    const exportToExcel = () => {
        const exportData = data.map((item) => ({
            'Nama Agen': item.agent_name,
            'FYP terkumpul': item.current_fyp,
            'Level tercapai': item.current_level,
            'Level selanjutnya': item.next_level,
            'FYP kurang': item.fyp_gap,
        }));

        exportTableToExcel(exportData, {
            fileName: 'MDRT-Report',
            sheetName: 'MDRT Report',
            currencyColumns: ['B', 'E'],
        });
    };

    return (
        <TablePage
            headTitle={t('report.mdrt-report')}
            title={t('report.mdrt-report')}
            i18nTitle="mdrt-report"
            breadcrumbs={[
                {
                    label: t('common.reports'),
                    href: 'javascript:void(0)',
                    i18n: 'report',
                },
                {
                    label: t('report.mdrt-report'),
                    active: true,
                    i18n: 'mdrt-report',
                },
            ]}
            toolbar={
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 w-100">
                    <h4 className="card-title mb-0">
                        {t('report.agent-mdrt-report')}
                    </h4>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="mdrt-year"
                                label={t('common.year')}
                                style={{ width: '100px' }}
                                value={year}
                                placeholder={t('common.select_year')}
                                onChange={(value) => {
                                    setYear(value.toString());
                                }}
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
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="mdrt-agency"
                                label={t('agency.title')}
                                style={{ width: '300px' }}
                                options={[
                                    { value: '', label: t('agency.select_agency') },
                                    ...agencies.map((ag) => ({
                                        value: ag.id || 0,
                                        label: ag.name,
                                    })),
                                ]}
                                value={agency}
                                onChange={(value) => {
                                    setAgency(value.toString());
                                }}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (year && agency)
                                    router.visit(
                                        `/reports/mdrt?year=${year}&agency=${agency}`,
                                    );
                            }}
                        >
                            {t('common.search')}
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={exportToExcel}
                            disabled={data.length === 0}
                        >
                            {t('common.export_excel')}
                        </button>
                    </div>
                </div>
            }
        >
            <Table hover striped bordered responsive>
                <thead>
                    <tr>
                        <th>{t('agent.agent_name')}</th>
                        <th>{t('report.fyp_collected')}</th>
                        <th>{t('report.achievement')}</th>
                        <th>{t('report.next_level')}</th>
                        <th>{t('report.shortage')}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.agent_name}</td>
                                <td>
                                    {Number(item.current_fyp).toLocaleString(
                                        'id-ID',
                                        {
                                            style: 'currency',
                                            currency: 'IDR',
                                        },
                                    )}
                                </td>
                                <td>{item.current_level}</td>
                                <td>{item.next_level}</td>
                                <td>
                                    {Number(item.fyp_gap).toLocaleString(
                                        'id-ID',
                                        {
                                            style: 'currency',
                                            currency: 'IDR',
                                        },
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center">
                                {t('common.no_data')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </TablePage>
    );
}
