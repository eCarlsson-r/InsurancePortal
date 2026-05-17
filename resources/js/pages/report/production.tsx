import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { agentSchema } from '@/schemas/models';
import { exportTableToExcel } from '@/utils/exportToExcel';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface ProductionRecord {
    id: string;
    agent_name: string;
    holder_name: string;
    insured_name: string;
    sp: string;
    fyp: number;
    topup: number;
    ape: number;
    contest_ape: number;
    total_commission: number;
}

export default function Production({
    data,
    agents,
    prod_agent,
    prod_year,
}: {
    data: ProductionRecord[];
    agents: z.infer<typeof agentSchema>[];
    prod_agent: string;
    prod_year: string;
}) {
    const { t } = useTranslation();
    const [year, setYear] = useState(prod_year || '');
    const [agent, setAgent] = useState(prod_agent || '');

    const exportToExcel = () => {
        const exportData = data.map((item) => ({
            'Nomor Polis': item.sp,
            'Nama Agen': item.agent_name,
            'Nama Pemegang Polis': item.holder_name,
            'Nama Tertanggung': item.insured_name,
            FYP: item.fyp,
            Topup: item.topup,
            APE: item.ape,
            Contest: item.contest_ape,
            Komisi: item.total_commission,
        }));

        exportTableToExcel(exportData, {
            fileName: 'Production-Report',
            sheetName: 'Production Report',
            currencyColumns: ['E', 'F', 'G', 'H', 'I'],
        });
    };

    const totalFYP = data.reduce((sum, item) => sum + Number(item.fyp), 0);
    const totalTopup = data.reduce((sum, item) => sum + Number(item.topup), 0);
    const totalAPE = data.reduce((sum, item) => sum + Number(item.ape), 0);
    const totalContestAPE = data.reduce(
        (sum, item) => sum + Number(item.contest_ape),
        0,
    );
    const totalCommission = data.reduce(
        (sum, item) => sum + Number(item.total_commission),
        0,
    );
    const newCases = data.reduce(
        (sum, item) => (Number(item.total_commission) > 0 ? sum + 1 : sum),
        0,
    );

    return (
        <TablePage
            headTitle={t('report.production-report')}
            title={t('report.production-report')}
            i18nTitle="production-report"
            breadcrumbs={[
                {
                    label: t('common.reports'),
                    href: 'javascript:void(0)',
                    i18n: 'report',
                },
                {
                    label: t('report.production-report'),
                    active: true,
                    i18n: 'production-report',
                },
            ]}
            toolbar={
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 w-100">
                    <h4 className="card-title mb-0">
                        {t('report.agent-production-report')}
                    </h4>
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="prod-agent"
                                label={t('common.agent')}
                                style={{ width: '200px' }}
                                placeholder={t('agent.select_agent')}
                                options={[
                                    ...agents.map((agent) => ({
                                        value: agent.id || 0,
                                        label: agent.name,
                                    })),
                                ]}
                                value={agent}
                                onChange={(value) => {
                                    setAgent(value.toString());
                                }}
                            />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="prod-year"
                                label={t('common.year')}
                                style={{ width: '200px' }}
                                value={year}
                                onChange={(value) => {
                                    setYear(value.toString());
                                }}
                                placeholder={t('common.select_year')}
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
                            className="btn btn-primary"
                            onClick={() => {
                                if (year && agent)
                                    router.visit(
                                        `/reports/production?year=${year}&agent=${agent}`,
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
                        <th>{t('policy.policy_number')}</th>
                        <th>{t('agent.agent_name')}</th>
                        <th>{t('policy.policyholder_name')}</th>
                        <th>{t('policy.insured_name')}</th>
                        <th>{t('dashboard.fyp')}</th>
                        <th>{t('policy.topup_premium')}</th>
                        <th>{t('dashboard.wape')}</th>
                        <th>{t('contest.title')}</th>
                        <th>{t('report.commission')}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.sp}</td>
                                <td>{item.agent_name}</td>
                                <td>{item.holder_name}</td>
                                <td>{item.insured_name}</td>
                                <td>
                                    {Number(item.fyp).toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                    })}
                                </td>
                                <td>
                                    {Number(item.topup).toLocaleString(
                                        'id-ID',
                                        {
                                            style: 'currency',
                                            currency: 'IDR',
                                        },
                                    )}
                                </td>
                                <td>
                                    {Number(item.ape).toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                    })}
                                </td>
                                <td>
                                    {Number(item.contest_ape).toLocaleString(
                                        'id-ID',
                                        {
                                            style: 'currency',
                                            currency: 'IDR',
                                        },
                                    )}
                                </td>
                                <td>
                                    {Number(
                                        item.total_commission,
                                    ).toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                    })}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9} className="text-center">
                                {t('common.no_data')}
                            </td>
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <th colSpan={4}>Total ({newCases} cases)</th>
                        <th>
                            {totalFYP.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            })}
                        </th>
                        <th>
                            {totalTopup.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            })}
                        </th>
                        <th>
                            {totalAPE.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            })}
                        </th>
                        <th>
                            {totalContestAPE.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            })}
                        </th>
                        <th>
                            {totalCommission.toLocaleString('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                            })}
                        </th>
                    </tr>
                </tfoot>
            </Table>
        </TablePage>
    );
}
