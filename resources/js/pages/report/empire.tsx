import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { agencySchema } from '@/schemas/models';
import { Table } from 'react-bootstrap';
import { useState } from 'react';
import { z } from 'zod';
import { router } from '@inertiajs/react';

type ReportData = {
    name: string;
    current_ape: number;
    current_cases: number;
    current_trip: number;
    next_trip: number;
    ape_gap: number;
    cases_gap: number;
};

export default function EmpireClubReport({data, agencies, prod_agency, prod_year}: {data: ReportData[], agencies: z.infer<typeof agencySchema>[], prod_agency: string, prod_year: string}) {
    const [year, setYear] = useState(prod_year || '');
    const [agency, setAgency] = useState(prod_agency || '');

    return (
        <TablePage
            headTitle="Laporan Empire Club"
            title="Laporan Empire Club"
            i18nTitle="empire-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Laporan Empire Club', active: true, i18n: 'empire-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="empire-club-report">
                        Laporan Pencapaian Empire Club
                    </h4>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="empire-year"
                                label="Year"
                                style={{ width: '100px' }}
                                value={year}
                                onChange={(e) => {setYear(e.target.value)}}
                                options={[
                                    { value: '', label: 'Pilih Tahun' },
                                    ...Array.from({ length: 10 }, (_, i) => ({
                                        value: (new Date().getFullYear() - i).toString(),
                                        label: (new Date().getFullYear() - i).toString(),
                                    })),
                                ]}
                            />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="empire-agency"
                                label="Agency"
                                style={{ width: '300px' }}
                                options={[
                                    { value: '', label: 'Pilih Agency' },
                                    ...agencies.map((agency) => ({
                                        value: agency.id || 0,
                                        label: agency.name,
                                    })),
                                ]}
                                value={agency}
                                onChange={(e) => {setAgency(e.target.value)}}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (year && agency) router.visit(`/reports/empire?year=${year}&agency=${agency}`);
                            }}
                        >
                            Filter
                        </button>
                    </div>
                </div>
            }
        >
            <Table hover striped bordered>
                <thead>
                    <tr>
                        <th data-field="agent-name">Nama Agen</th>
                        <th data-field="current-ape" data-formatter="empireIDRFormatter">APE terkumpul</th>
                        <th data-field="current-cases">Cases terkumpul</th>
                        <th data-field="current-trip">Tiket tercapai</th>
                        <th data-field="next-trip">Tiket selanjutnya</th>
                        <th data-field="ape-gap" data-formatter="empireIDRFormatter">Kurang APE</th>
                        <th data-field="cases-gap">Kurang Cases</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (data.length > 0) ? data?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{Number(item.current_ape).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    }
                                )}</td>
                                <td>{item.current_cases}</td>
                                <td>{item.current_trip}</td>
                                <td>{item.next_trip}</td>
                                <td>{Number(item.ape_gap).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    }
                                )}</td>
                                <td>{item.cases_gap}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className="text-center">Tidak ada data</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </TablePage>
    );
}
