import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { agentSchema } from '@/schemas/models';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface ProductionRecord {
    id: string; 
    agent_name: string; 
    holder_name: string;
    insured_name: string;
    sp: string; 
    fyp:number; 
    topup: number; 
    ape: number; 
    contest_ape: number; 
    total_commission: number;
};

export default function Production({data, agents, prod_agent, prod_year}: {data: ProductionRecord[], agents: z.infer<typeof agentSchema>[], prod_agent: string, prod_year: string}) {
    const [year, setYear] = useState(prod_year || '');
    const [agent, setAgent] = useState(prod_agent || '');
    
    return (
        <TablePage
            headTitle="Production Report"
            title="Laporan Produksi"
            i18nTitle="production-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Laporan Produksi', active: true, i18n: 'production-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="agent-production-report">
                        Laporan Produksi Agen
                    </h4>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="prod-agent"
                                label="Agen"
                                style={{ width: '200px' }}
                                options={[
                                    { value: '', label: 'Pilih Agen' },
                                    ...agents.map((agent) => ({
                                        value: agent.id || 0,
                                        label: agent.name,
                                    })),
                                ]}
                                value={agent}
                                onChange={(e) => {setAgent(e.target.value)}}
                            />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="prod-year"
                                label="Year"
                                style={{ width: '200px' }}
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
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                if (year && agent) router.visit(`/reports/production?year=${year}&agent=${agent}`);
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
                        <th>Nomor Polis</th>
                        <th>Nama Agen</th>
                        <th>Nama Pemegang Polis</th>
                        <th>Nama Tertanggung</th>
                        <th>FYP</th>
                        <th>Topup</th>
                        <th>APE</th>
                        <th>Contest</th>
                        <th>Komisi</th>
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
                                <td>{Number(item.fyp).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    },
                                )}</td>
                                <td>{Number(item.topup).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    },
                                )}</td>
                                <td>{Number(item.ape).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    },
                                )}</td>
                                <td>{Number(item.contest_ape).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    },
                                )}</td>
                                <td>{Number(item.total_commission).toLocaleString(
                                    'id-ID',
                                    {
                                        style: 'currency',
                                        currency: 'IDR',
                                    },
                                )}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={9} className="text-center">Data Tidak Ditemukan</td></tr>
                    )}
                </tbody>
            </Table>
        </TablePage>
    );
}