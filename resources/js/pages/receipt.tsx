import Pagination from '@/components/pagination';
import SelectInput from '@/components/form/select-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import TextareaInput from '@/components/form/textarea-input';
import DateInput from '@/components/form/date-input';
import TableFormPage from '@/layouts/TableFormPage';
import {
    agentSchema,
    customerSchema,
    productSchema,
    receiptSchema,
} from '@/schemas/models';
import { router, useForm } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface ReceiptProps {
    receipts: {
        data: z.infer<typeof receiptSchema>[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    customers: z.infer<typeof customerSchema>[];
    products: z.infer<typeof productSchema>[];
    agents: z.infer<typeof agentSchema>[];
    filters: {
        search: string | null;
    };
}

export default function Receipt({
    receipts,
    customers = [],
    products = [],
    agents = [],
    filters
}: ReceiptProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleSearch = useCallback(() => {
        router.get(
            '/master/receipt',
            { search: searchQuery },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [searchQuery]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery !== (filters.search || '')) {
                handleSearch();
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, filters.search, handleSearch]);

    const { data, setData, post, put, processing } = useForm<
        z.infer<typeof receiptSchema>
    >({
        case_id: '',
        pay_date: '',
        paid_date: '',
        premium: 0,
        paid_amount : 0,
        currency_rate: 1,
        pay_method: '1',
        description: '',
        policy: {
            agent_id: '',
            product_id: '',
            holder_id: ''
        }
    });

    const isEdit = !!data.id;

    const handleDelete = (receiptId: number | undefined) => {
        if (confirm('Are you sure you want to delete this receipt?')) {
            router.delete(`/master/receipt/${receiptId}`);
        }
    };

    const handleSubmit = () => {
        if (isEdit) {
            put(`/master/receipt/${data.id}`);
        } else {
            post('/master/receipt');
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <TableFormPage
            headTitle="Receipt"
            title="Kwitansi"
            i18nTitle="receipt"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: 'Kwitansi', active: true, i18n: 'receipt' },
            ]}
            tableTitle="Daftar Kwitansi"
            tableI18nTitle="receipt-list"
            tableToolbar={
                <input
                    type="text"
                    className="form-control form-control-sm float-end"
                    placeholder="Cari kwitansi (No. SP)..."
                    style={{ width: '200px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            }
            pagination={<Pagination links={receipts.links} />}
            tableContent={
                <Table hover striped bordered>
                    <thead>
                        <tr>
                            <th data-i18n="pay-date">Tgl. Bayar</th>
                            <th data-i18n="paid-date">Tgl. Terima</th>
                            <th data-i18n="policy-no">No. SP / Polis</th>
                            <th data-i18n="premium">Premi</th>
                            <th className="col-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {receipts.data.length > 0 ? (
                            receipts.data.map((receipt) => (
                                <tr
                                    key={receipt.id}
                                    onClick={() => setData(receipt)}
                                >
                                    <td>{new Date(receipt.pay_date).toDateString()}</td>
                                    <td>{new Date(receipt.paid_date).toDateString()}</td>
                                    <td>{receipt.policy?.policy_no}</td>
                                    <td className="text-end">
                                        {formatCurrency(receipt.premium)}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(receipt.id);
                                            }}
                                            title="Delete"
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    No receipts found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            }
            formTitle={isEdit ? 'Sunting Kwitansi' : 'Tambah Kwitansi'}
            formI18nTitle="edit-receipt"
            formSubtitle="Masukkan informasi kwitansi pembayaran premi."
            formI18nSubtitle="edit-receipt-inst"
            formOnSubmit={handleSubmit}
            formContent={
                <>
                    <TextInput
                        id="policy_code"
                        label="No. SP / Polis"
                        value={data.policy?.policy_no}
                        onChange={(e) => setData('policy', {
                            ...data.policy,
                            policy_no: e.target.value,
                        })}
                        row
                    />
                    <SelectInput
                        id="product_id"
                        label="Produk"
                        value={data.policy?.product_id}
                        onChange={(e) =>
                            setData('policy', {
                                ...data.policy,
                                product_id: e.target.value,
                            })
                        }
                        options={products.map((p) => ({
                            value: p.id || '',
                            label: p.name,
                        }))}
                        row
                    />
                    <SelectInput
                        id="holder_id"
                        label="Pemegang Polis"
                        value={data.policy?.holder_id}
                        onChange={(e) =>
                            setData('policy', {
                                ...data.policy,
                                holder_id: e.target.value,
                            })
                        }
                        options={customers.map((c) => ({
                            value: c.id || '',
                            label: c.name,
                        }))}
                        row
                    />
                    <SelectInput
                        id="agent_id"
                        label="Agen"
                        value={data.policy?.agent_id}
                        onChange={(e) =>
                            setData('agent_id', e.target.value)
                        }
                        options={agents.map((a) => ({
                            value: a.id || '',
                            label: a.name,
                        }))}
                        row
                    />
                    <DateInput
                        id="pay_date"
                        label="Tanggal Jatuh Tempo"
                        value={data.pay_date ? data.pay_date.split('T')[0] : ''}
                        onChange={(e) => setData('pay_date', e.target.value)}
                        row
                    />
                    <DateInput
                        id="paid_date"
                        label="Tanggal Bayar"
                        value={data.paid_date ? data.paid_date.split('T')[0] : ''}
                        onChange={(e) => setData('paid_date', e.target.value)}
                        row
                    />
                    <TextInput
                        id="premium"
                        label="Premi"
                        type="number"
                        value={data.premium}
                        onChange={(e) =>
                            setData('premium', parseFloat(e.target.value))
                        }
                        row
                    />
                    <TextInput
                        id="currency_rate"
                        label="Kurs"
                        type="number"
                        value={data.currency_rate}
                        onChange={(e) =>
                            setData('currency_rate', parseFloat(e.target.value))
                        }
                        row
                    />
                    <SelectInput
                        id="pay_method"
                        label="Metode Bayar"
                        value={data.pay_method}
                        onChange={(e) => setData('pay_method', e.target.value)}
                        options={[
                            { value: '1', label: 'Transfer' },
                            { value: '2', label: 'Credit Card' },
                            { value: '3', label: 'Cash' },
                        ]}
                        row
                    />
                    <TextareaInput
                        id="description"
                        label="Keterangan"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        row
                    />
                    <div className="text-end">
                        <SubmitButton processing={processing}>
                            {isEdit ? 'Perbarui' : 'Simpan'}
                        </SubmitButton>
                    </div>
                </>
            }
        />
    );
}
