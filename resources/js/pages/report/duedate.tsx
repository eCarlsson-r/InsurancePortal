import MonthInput from '@/components/form/month-input';
import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { agentSchema } from '@/schemas/models';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

export default function DueDate(props: {
    data: ReceiptData[];
    agents: z.infer<typeof agentSchema>[];
    month: string;
    agent: string;
}) {
    const { t } = useTranslation();
    const [month, setMonth] = useState(props.month);
    const [agent, setAgent] = useState(props.agent);
    return (
        <TablePage
            headTitle={t('report.due-report')}
            title={t('report.due-report')}
            i18nTitle="due-report"
            breadcrumbs={[
                {
                    label: t('common.reports'),
                    href: 'javascript:void(0)',
                    i18n: 'report',
                },
                {
                    label: t('report.due-report'),
                    active: true,
                    i18n: 'due-report',
                },
            ]}
            toolbar={
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 w-100">
                    <div className="card-title mb-0">
                        <h4 className="mb-1">
                            {t('report.due-report')}
                        </h4>
                        <h6 className="mb-0">
                            {t('report.due-report-desc')}
                        </h6>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <MonthInput
                                id="due-month"
                                label={t('common.month')}
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
                                label={t('common.agent')}
                                style={{ width: '200px' }}
                                placeholder={t('common.select_agent')}
                                value={agent}
                                options={props.agents.map((agent) => ({
                                    value: agent.id || '',
                                    label: agent.name,
                                }))}
                                onChange={(value) => {
                                    setAgent(value.toString());
                                }}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (month && agent)
                                    router.visit(
                                        `/reports/duedate?month=${month}&agent=${agent}`,
                                    );
                            }}
                        >
                            Cari
                        </button>
                    </div>
                </div>
            }
        >
            <Table hover striped bordered responsive>
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
                    {props.data.length > 0 ? (
                        props.data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.receipt_policy}</td>
                                <td>{item.customer_name}</td>
                                <td>{item.insured_name}</td>
                                <td>
                                    {new Date(
                                        item.insured_birthdate,
                                    ).toDateString()}
                                </td>
                                <td>{item.case_product}</td>
                                <td>
                                    {new Date(
                                        item.receipt_pay_date,
                                    ).toDateString()}
                                </td>
                                <td>
                                    {Number(
                                        item.receipt_premium,
                                    ).toLocaleString('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                    })}
                                </td>
                                <td>
                                    {item.receipt_pay_method === '1'
                                        ? 'Tahunan'
                                        : item.receipt_pay_method === '2'
                                          ? 'Enam Bulanan'
                                          : item.receipt_pay_method === '4'
                                            ? 'Tiga Bulanan'
                                            : item.receipt_pay_method === '12'
                                              ? 'Bulanan'
                                              : item.receipt_pay_method === '0'
                                                ? 'Sekaligus'
                                                : item.receipt_pay_method}
                                </td>
                                <td>{item.customer_address}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9} className="text-center">
                                Tidak ada data
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </TablePage>
    );
}
