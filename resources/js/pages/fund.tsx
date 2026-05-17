import SelectInput from '@/components/form/select-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import Pagination from '@/components/pagination';
import TableFormPage from '@/layouts/TableFormPage';
import { fundSchema } from '@/schemas/models';
import { router, useForm } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

interface FundProps {
    funds: {
        data: z.infer<typeof fundSchema>[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    filters: {
        search: string | null;
    };
}

export default function Fund({ funds, filters }: FundProps) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleSearch = useCallback(() => {
        router.get(
            '/master/fund',
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

    // Initial form state with safe defaults
    const { data, setData, post, put, processing } = useForm<
        z.infer<typeof fundSchema>
    >({
        id: undefined,
        name: '',
        currency: 1,
    });

    const isEdit = !!data.id;

    const handleDelete = (fundCode: number | undefined) => {
        if (confirm(t('fund.confirm_delete'))) {
            router.delete(`/master/fund/${fundCode}`);
        }
    };

    const handleSubmit = () => {
        if (isEdit) {
            put(`/master/fund/${data.id}`);
        } else {
            post('/master/fund');
        }
    };

    return (
        <TableFormPage
            headTitle={t('fund.title')}
            title={t('fund.title')}
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: t('fund.title'), active: true, i18n: 'fund' },
            ]}
            tableTitle={t('fund.list_title')}
            tableToolbar={
                <input
                    type="text"
                    className="form-control form-control-sm float-end"
                    placeholder={t('fund.search_placeholder')}
                    style={{ width: '200px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            }
            pagination={<Pagination links={funds.links} />}
            tableContent={
                <Table hover striped bordered responsive>
                    <thead>
                        <tr>
                            <th className="col-8">{t('fund.fund_name')}</th>
                            <th className="col-3">{t('fund.currency')}</th>
                            <th className="col-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {funds.data.length > 0 ? (
                            funds.data.map((fund) => (
                                <tr key={fund.id} onClick={() => setData(fund)}>
                                    <td>{fund.name}</td>
                                    <td>
                                        {fund.currency === 1
                                            ? t('fund.rupiah')
                                            : t('fund.dollar')}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(fund.id);
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
                                <td colSpan={3} className="text-center">
                                    {t('fund.no_data')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            }
            formTitle={isEdit ? t('fund.edit_title') : t('fund.create_title')}
            formSubtitle={t('fund.form_subtitle')}
            formOnSubmit={handleSubmit}
            formContent={
                <>
                    <TextInput
                        id="fund-name"
                        label={t('fund.fund_name')}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        row
                    />
                    <SelectInput
                        id="fund-currency"
                        label={t('fund.currency')}
                        value={data.currency}
                        onChange={(value) => setData('currency', Number(value))}
                        options={[
                            { value: '1', label: t('fund.rupiah') },
                            { value: '2', label: t('fund.dollar') },
                        ]}
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
