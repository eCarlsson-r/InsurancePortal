import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { agencySchema } from '@/schemas/models';
import { Table } from 'react-bootstrap';
import { useState } from 'react';
import { z } from 'zod';
import { router } from '@inertiajs/react';

type ReportData = {
    agent_name: string;
    current_fyp: number;
    current_level: number;
    next_level: number;
    fyp_gap: number;
};

export default function MDRTReport({data, agencies, prod_agency, prod_year}: {data: ReportData[], agencies: z.infer<typeof agencySchema>[], prod_agency: string, prod_year: string}) {
    const [year, setYear] = useState(prod_year || '');
    const [agency, setAgency] = useState(prod_agency || '');

    return (
        <TablePage
            headTitle="MDRT Report"
            title="Laporan MDRT Internasional"
            i18nTitle="mdrt-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Laporan MDRT Internasional', active: true, i18n: 'mdrt-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="mdrt-international-report">
                        Laporan Pencapaian MDRT Internasional
                    </h4>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="mdrt-year"
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
                                id="mdrt-agency"
                                label="Agency"
                                style={{ width: '300px' }}
                                options={[
                                    { value: '', label: 'Pilih Agency' },
                                    ...agencies.map((ag) => ({
                                        value: ag.id || 0,
                                        label: ag.name,
                                    })),
                                ]}
                                value={agency}
                                onChange={(e) => {setAgency(e.target.value)}}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (year && agency) router.visit(`/reports/mdrt?year=${year}&agency=${agency}`);
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
                        <th>Nama Agen</th>
                        <th>FYP terkumpul</th>
                        <th>Level tercapai</th>
                        <th>Level selanjutnya</th>
                        <th>FYP kurang</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (data.length > 0) ? data?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.agent_name}</td>
                                <td>{Number(item.current_fyp).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    }
                                )}</td>
                                <td>{item.current_level}</td>
                                <td>{item.next_level}</td>
                                <td>{Number(item.fyp_gap).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    }
                                )}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center">Tidak ada data</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </TablePage>
    );
}
