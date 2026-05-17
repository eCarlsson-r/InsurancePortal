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
    name: string;
    current_ape: number;
    current_cases: number;
    current_trip: number;
    next_trip: number;
    ape_gap: number;
    cases_gap: number;
};

export default function EmpireClubReport({
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
            'Nama Agen': item.name,
            'APE terkumpul': item.current_ape,
            'Cases terkumpul': item.current_cases,
            'Tiket tercapai': item.current_trip,
            'Tiket selanjutnya': item.next_trip,
            'Kurang APE': item.ape_gap,
            'Kurang Cases': item.cases_gap,
        }));

        exportTableToExcel(exportData, {
            fileName: 'Empire-Club-Report',
            sheetName: 'Empire Club Report',
            currencyColumns: ['B', 'F'], // APE terkumpul and Kurang APE columns
        });
    };

    return (
        <TablePage
            headTitle={t('report.empire-club')}
            title={t('report.empire-club-report')}
            i18nTitle="empire-club"
            breadcrumbs={[
                {
                    label: t('common.reports'),
                    href: 'javascript:void(0)',
                    i18n: 'report',
                },
                {
                    label: t('report.empire-club-report'),
                    active: true,
                    i18n: 'empire-club',
                },
            ]}
            toolbar={
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 w-100">
                    <h4 className="card-title mb-0">
                        {t('report.agent-empire-report')}
                    </h4>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="empire-year"
                                label={t('common.year')}
                                style={{ width: '150px' }}
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
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="empire-agency"
                                label={t('agency.title')}
                                style={{ width: '300px' }}
                                placeholder={t('agency.select_agency')}
                                options={[
                                    ...agencies.map((agency) => ({
                                        value: agency.id || 0,
                                        label: agency.name,
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
                                        `/reports/empire?year=${year}&agency=${agency}`,
                                    );
                            }}
                        >
                            Cari
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
                        <th
                            data-field="current-ape"
                            data-formatter="empireIDRFormatter"
                        >
                            APE terkumpul
                        </th>
                        <th data-field="current-cases">Cases terkumpul</th>
                        <th data-field="current-trip">Tiket tercapai</th>
                        <th data-field="next-trip">Tiket selanjutnya</th>
                        <th
                            data-field="ape-gap"
                            data-formatter="empireIDRFormatter"
                        >
                            Kurang APE
                        </th>
                        <th data-field="cases-gap">Kurang Cases</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>
                                    {Number(item.current_ape).toLocaleString(
                                        'id-ID',
                                        {
                                            style: 'currency',
                                            currency: 'IDR',
                                        },
                                    )}
                                </td>
                                <td>{item.current_cases}</td>
                                <td>{item.current_trip}</td>
                                <td>{item.next_trip}</td>
                                <td>
                                    {Number(item.ape_gap).toLocaleString(
                                        'id-ID',
                                        {
                                            style: 'currency',
                                            currency: 'IDR',
                                        },
                                    )}
                                </td>
                                <td>{item.cases_gap}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="text-center">
                                Tidak ada data
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </TablePage>
    );
}
