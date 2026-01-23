import MonthInput from '@/components/form/month-input';
import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { agencySchema } from '@/schemas/models';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

type BonusData = {
    name: string,
    mtd_ape: number,
    mtd_bonus: number,
    mtd_gap: number,
    std_ape: number,
    std_bonus: number,
    std_gap: number,
    ytd_ape: number,
    ytd_bonus: number,
    ytd_gap: number
};

export default function BonusGap(props:{data: BonusData[], agencies: z.infer<typeof agencySchema>[], month:string, agency:string}) {
    const [month, setMonth] = useState(props.month);
    const [agency, setAgency] = useState(props.agency);
    return (
        <TablePage
            headTitle="Bonus Gap Report"
            title="Laporan Bonus"
            i18nTitle="bonus-gap-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Laporan Bonus', active: true, i18n: 'bonus-gap-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="agent-bonusgap-report">
                        Laporan Pencapaian Bonus Agen
                    </h4>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <MonthInput
                                id="bonusgap-month"
                                label="Bulan"
                                min="2022-01"
                                style={{ width: '200px' }}
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                            />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="bonusgap-agency"
                                label="Agency"
                                style={{ width: '250px' }}
                                options={[
                                    { value: '', label: 'Pilih Agency' },
                                    ...props.agencies.map((ag) => ({
                                        value: ag.id || 0,
                                        label: ag.name,
                                    })),
                                ]}
                                value={agency}
                                onChange={(value) => {setAgency(value.toString())}}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (month && agency) router.visit(`/reports/bonusgap?month=${month}&agency=${agency}`);
                            }}
                        >
                            Cari
                        </button>
                    </div>
                </div>
            }
        >
            <Table hover striped bordered>
                <thead>
                    <tr>
                        <th className="col-3" rowSpan={2}>Nama Agen</th>
                        <th colSpan={3}>Production Bonus</th>
                        <th colSpan={3}>Half Year Bonus</th>
                        <th colSpan={3}>Year End Bonus</th>
                    </tr>
                    <tr>
                        <th>Pencapaian</th>
                        <th>Bonus (%)</th>
                        <th>Kekurangan</th>
                        <th>Pencapaian</th>
                        <th>Bonus (%)</th>
                        <th>Kekurangan</th>
                        <th>Pencapaian</th>
                        <th>Bonus (%)</th>
                        <th>Kekurangan</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (props.data.length > 0) ? (props.data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{Number(item.mtd_ape).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    }
                                )}</td>
                                <td>{item.mtd_bonus}%</td>
                                <td>{Number(item.mtd_gap).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    }
                                )}</td>
                                <td>{Number(item.std_ape).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    },
                                )}</td>
                                <td>{item.std_bonus}%</td>
                                <td>{Number(item.std_gap).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    }
                                )}</td>
                                <td>{Number(item.ytd_ape).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    },
                                )}</td>
                                <td>{item.ytd_bonus}%</td>
                                <td>{Number(item.ytd_gap).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    }
                                )}</td>
                            </tr>
                        ))) : (<tr><td colSpan={10} className="text-center">Tidak ada data</td></tr>)
                    }
                </tbody>
            </Table>
        </TablePage>
    );
}
