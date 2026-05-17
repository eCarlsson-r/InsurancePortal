import MonthInput from '@/components/form/month-input';
import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { agencySchema } from '@/schemas/models';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

type BonusData = {
    name: string;
    mtd_ape: number;
    mtd_bonus: number;
    mtd_gap: number;
    std_ape: number;
    std_bonus: number;
    std_gap: number;
    ytd_ape: number;
    ytd_bonus: number;
    ytd_gap: number;
};

export default function BonusGap(props: {
    data: BonusData[];
    agencies: z.infer<typeof agencySchema>[];
    month: string;
    agency: string;
}) {
    const { t } = useTranslation();
    const [month, setMonth] = useState(props.month);
    const [agency, setAgency] = useState(props.agency);
    return (
        <TablePage
            headTitle={t('report.bonus-gap-report')}
            title={t('report.bonus_report')}
            i18nTitle="bonus-gap-report"
            breadcrumbs={[
                {
                    label: t('common.reports'),
                    href: 'javascript:void(0)',
                    i18n: 'report',
                },
                {
                    label: t('report.bonus_report'),
                    active: true,
                    i18n: 'bonus-gap-report',
                },
            ]}
            toolbar={
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 w-100">
                    <h4 className="card-title mb-0">
                        {t('report.agent-bonus-report')}
                    </h4>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <div className="d-flex align-items-center gap-2">
                            <MonthInput
                                id="bonusgap-month"
                                label={t('common.month')}
                                min="2022-01"
                                style={{ width: '200px' }}
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="bonusgap-agency"
                                label={t('agency.title')}
                                placeholder={t('agency.select_agency')}
                                style={{ width: '250px' }}
                                options={[
                                    ...props.agencies.map((ag) => ({
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
                                if (month && agency)
                                    router.visit(
                                        `/reports/bonusgap?month=${month}&agency=${agency}`,
                                    );
                            }}
                        >
                            {t('common.search')}
                        </button>
                    </div>
                </div>
            }
        >
            <Table hover striped bordered responsive>
                <thead>
                    <tr>
                        <th className="col-3" rowSpan={2}>
                            {t('agent.name')}
                        </th>
                        <th colSpan={3}>{t('report.production-bonus')}</th>
                        <th colSpan={3}>{t('report.half-year-bonus')}</th>
                        <th colSpan={3}>{t('report.year-end-bonus')}</th>
                    </tr>
                    <tr>
                        <th>{t('report.achievement')}</th>
                        <th>{t('contest.bonus_percent')}</th>
                        <th>{t('report.shortage')}</th>
                        <th>{t('report.achievement')}</th>
                        <th>{t('contest.bonus_percent')}</th>
                        <th>{t('report.shortage')}</th>
                        <th>{t('report.achievement')}</th>
                        <th>{t('contest.bonus_percent')}</th>
                        <th>{t('report.shortage')}</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data.length > 0 ? (
                        props.data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>
                                    {Number(item.mtd_ape).toLocaleString(
                                        'id-ID',
                                        {
                                            style: 'currency',
                                            currency: 'IDR',
                                        },
                                    )}
                                </td>
                                <td>{item.mtd_bonus}%</td>
                                <td>
                                    {Number(item.mtd_gap).toLocaleString(
                                        'id-ID',
                                        {
                                            style: 'currency',
                                            currency: 'IDR',
                                        },
                                    )}
                                </td>
                                <td>
                                    {Number(item.std_ape).toLocaleString(
                                        'id-ID',
                                        {
                                            style: 'currency',
                                            currency: 'IDR',
                                        },
                                    )}
                                </td>
                                <td>{item.std_bonus}%</td>
                                <td>
                                    {Number(item.std_gap).toLocaleString(
                                        'id-ID',
                                        {
                                            style: 'currency',
                                            currency: 'IDR',
                                        },
                                    )}
                                </td>
                                <td>
                                    {Number(item.ytd_ape).toLocaleString(
                                        'id-ID',
                                        {
                                            style: 'currency',
                                            currency: 'IDR',
                                        },
                                    )}
                                </td>
                                <td>{item.ytd_bonus}%</td>
                                <td>
                                    {Number(item.ytd_gap).toLocaleString(
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
                            <td colSpan={10} className="text-center">
                                {t('common.no_data')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </TablePage>
    );
}
