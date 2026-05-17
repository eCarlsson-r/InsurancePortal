import DateInput from '@/components/form/date-input';
import SelectInput from '@/components/form/select-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import TextareaInput from '@/components/form/textarea-input';
import Pagination from '@/components/pagination';
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
import { useTranslation } from 'react-i18next';
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
    filters,
}: ReceiptProps) {
    const { t } = useTranslation();
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
        paid_amount: 0,
        currency_rate: 1,
        pay_method: '1',
        description: '',
        policy: {
            agent_id: '',
            product_id: '',
            holder_id: '',
        },
    });

    const isEdit = !!data.id;

    const handleDelete = (receiptId: number | undefined) => {
        if (confirm(t('receipt.confirm_delete'))) {
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
            headTitle={t('receipt.title')}
            title={t('receipt.title')}
            breadcrumbs={[
                { label: t('common.master'), href: 'javascript:void(0)', i18n: 'master' },
                { label: t('receipt.title'), active: true, i18n: 'receipt' },
            ]}
            tableTitle={t('receipt.list_title')}
            tableToolbar={
                <input
                    type="text"
                    className="form-control form-control-sm float-end"
                    placeholder={t('receipt.search_placeholder')}
                    style={{ width: '200px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            }
            pagination={<Pagination links={receipts.links} />}
            tableContent={
                <Table hover striped bordered responsive>
                    <thead>
                        <tr>
                            <th>{t('receipt.pay_date')}</th>
                            <th>{t('receipt.paid_date')}</th>
                            <th>{t('receipt.policy_number')}</th>
                            <th>{t('policy.premium')}</th>
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
                                    <td>
                                        {new Date(
                                            receipt.pay_date,
                                        ).toDateString()}
                                    </td>
                                    <td>
                                        {new Date(
                                            receipt.paid_date,
                                        ).toDateString()}
                                    </td>
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
                                            title={t('common.delete')}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    {t('receipt.no_receipts_found')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            }
            formTitle={isEdit ? t('receipt.edit_title') : t('receipt.create_title')}
            formSubtitle={t('receipt.form_subtitle')}
            formOnSubmit={handleSubmit}
            formContent={
                <>
                    <TextInput
                        id="policy_code"
                        label={t('receipt.policy_number')}
                        value={data.policy?.policy_no}
                        onChange={(e) =>
                            setData('policy', {
                                ...data.policy,
                                policy_no: e.target.value,
                            })
                        }
                        row
                    />
                    <SelectInput
                        id="product_id"
                        label={t('common.product')}
                        value={data.policy?.product_id}
                        onChange={(value) =>
                            setData('policy', {
                                ...data.policy,
                                product_id: value.toString(),
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
                        label={t('policy.policyHolder')}
                        value={data.policy?.holder_id}
                        onChange={(value) =>
                            setData('policy', {
                                ...data.policy,
                                holder_id: value.toString(),
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
                        label={t('common.agent')}
                        value={data.policy?.agent_id}
                        onChange={(value) =>
                            setData('agent_id', value.toString())
                        }
                        options={agents.map((a) => ({
                            value: a.id || '',
                            label: a.name,
                        }))}
                        row
                    />
                    <DateInput
                        id="pay_date"
                        label={t('receipt.due_date')}
                        value={data.pay_date ? data.pay_date.split('T')[0] : ''}
                        onChange={(e) => setData('pay_date', e.target.value)}
                        row
                    />
                    <DateInput
                        id="paid_date"
                        label={t('receipt.payment_date')}
                        value={
                            data.paid_date ? data.paid_date.split('T')[0] : ''
                        }
                        onChange={(e) => setData('paid_date', e.target.value)}
                        row
                    />
                    <TextInput
                        id="premium"
                        label={t('policy.premium')}
                        type="number"
                        value={data.premium}
                        onChange={(e) =>
                            setData('premium', parseFloat(e.target.value))
                        }
                        row
                    />
                    <TextInput
                        id="currency_rate"
                        label={t('receipt.exchange_rate')}
                        type="number"
                        value={data.currency_rate}
                        onChange={(e) =>
                            setData('currency_rate', parseFloat(e.target.value))
                        }
                        row
                    />
                    <SelectInput
                        id="pay_method"
                        label={t('policy.paymentMethod')}
                        value={data.pay_method}
                        onChange={(value) =>
                            setData('pay_method', value.toString())
                        }
                        options={[
                            { value: '1', label: t('policy.annual') },
                            { value: '2', label: t('policy.semiAnnual') },
                            { value: '4', label: t('policy.quarterly') },
                            { value: '12', label: t('policy.monthly') },
                            { value: '0', label: t('policy.single') },
                        ]}
                        row
                    />
                    <TextareaInput
                        id="description"
                        label={t('common.description')}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        row
                    />
                    <div className="text-end">
                        <SubmitButton processing={processing}>
                            {isEdit ? t('common.update') : t('common.save')}
                        </SubmitButton>
                    </div>
                </>
            }
        />
    );
}
