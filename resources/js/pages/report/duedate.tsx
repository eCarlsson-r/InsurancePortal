import MonthInput from '@/components/form/month-input';
import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { agentSchema } from '@/schemas/models';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

type ReceiptData = {
    receipt_policy: string;
    customer_name: string;
    insured_name: string;
    insured_birthdate: string;
    case_product: string;
    receipt_pay_date: string;
    receipt_premium: string;
    receipt_pay_method: string;
    customer_address: string;
};

export default function DueDate(props:{data: ReceiptData[], agents: z.infer<typeof agentSchema>[], month: string, agent: string}) {
    const [month, setMonth] = useState(props.month);
    const [agent, setAgent] = useState(props.agent);
    return (
        <TablePage
            headTitle="Due Date Report"
            title="Laporan Jatuh Tempo"
            i18nTitle="due-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Laporan Jatuh Tempo', active: true, i18n: 'due-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <div className="card-title mb-0">
                        <h4 className="mb-1" data-i18n="due-report">Laporan Jatuh Tempo</h4>
                        <h6 className="mb-0"><span data-i18n="due-report-desc">Laporan Polis Nasabah yang Jatuh Tempo.</span></h6>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <MonthInput
                                id="due-month"
                                label="Month"
                                style={{ width: '150px' }}
                                value={month}
                                onChange={(e) => {
                                    setMonth(e.target.value);
                                }}
                            />
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <SelectInput
                                id="due-agent"
                                label="Agent"
                                style={{ width: '200px' }}
                                value={agent}
                                options={props.agents.map((agent) => ({ value: agent.id || '', label: agent.name }))}
                                onChange={(e) => {
                                    setAgent(e.target.value);
                                }}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (month && agent) router.visit(`/reports/duedate?month=${month}&agent=${agent}`);
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
                        <th>No. Polis</th>
                        <th>Pemegang Polis</th>
                        <th>Tertanggung</th>
                        <th>Tgl. Lahir Tertanggung</th>
                        <th>Produk</th>
                        <th>Jatuh Tempo</th>
                        <th>Premi</th>
                        <th>Cara Bayar</th>
                        <th>Alamat Penagihan</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (props.data.length > 0) ? (props.data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.receipt_policy}</td>
                                <td>{item.customer_name}</td>
                                <td>{item.insured_name}</td>
                                <td>{item.insured_birthdate}</td>
                                <td>{item.case_product}</td>
                                <td>{item.receipt_pay_date}</td>
                                <td>{item.receipt_premium}</td>
                                <td>{item.receipt_pay_method}</td>
                                <td>{item.customer_address}</td>
                            </tr>
                        ))) : (<tr><td colSpan={9} className="text-center">Tidak ada data</td></tr>)
                    }
                </tbody>
            </Table>
        </TablePage>
    );
}
