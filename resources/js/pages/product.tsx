import SelectInput from '@/components/form/select-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import Pagination from '@/components/pagination';
import TableFormPage from '@/layouts/TableFormPage';
import { productCommissionSchema, productSchema } from '@/schemas/models';
import { router, useForm } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface ProductProps {
    products: {
        data: z.infer<typeof productSchema>[];
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

export default function Product({ products, filters }: ProductProps) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleSearch = useCallback(() => {
        router.get(
            '/master/product',
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
        z.infer<typeof productSchema>
    >({
        id: undefined,
        name: '',
        type: '1',
        commissions: [],
        credits: [],
    });

    const isEdit = !!data.id;

    const handleDelete = (productCode: string | undefined) => {
        if (confirm(t('product.confirm_delete'))) {
            router.delete(`/master/product/${productCode}`);
        }
    };

    const handleSubmit = () => {
        if (isEdit) {
            put(`/master/product/${data.id}`);
        } else {
            post('/master/product');
        }
    };

    const handleCommissionChange = (
        index: number,
        field: keyof z.infer<typeof productCommissionSchema>,
        value: unknown,
    ) => {
        const newCommissions = [...(data.commissions || [])];
        newCommissions[index] = { ...newCommissions[index], [field]: value };
        setData('commissions', newCommissions);
    };

    const addCommission = () => {
        const newCommissions = [
            ...(data.commissions || []),
            { year: (data.commissions?.length || 0) + 1, commission_rate: 0 },
        ];
        setData('commissions', newCommissions);
    };

    const removeCommission = (index: number) => {
        const newCommissions = [...(data.commissions || [])];
        newCommissions.splice(index, 1);
        setData('commissions', newCommissions);
    };

    return (
        <TableFormPage
            headTitle={t('product.title')}
            title={t('product.title')}
            breadcrumbs={[
                { label: t('common.master'), href: 'javascript:void(0)', i18n: 'master' },
                { label: t('product.title'), active: true, i18n: 'product' },
            ]}
            tableTitle={t('product.list_title')}
            tableToolbar={
                <input
                    type="text"
                    className="form-control form-control-sm float-end"
                    placeholder={t('product.search_placeholder')}
                    style={{ width: '200px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            }
            pagination={<Pagination links={products.links} />}
            tableContent={
                <Table hover striped bordered responsive>
                    <thead>
                        <tr>
                            <th className="col-8">{t('product.product_name')}</th>
                            <th className="col-3">{t('product.product_type')}</th>
                            <th className="col-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.data.length > 0 ? (
                            products.data.map((product) => (
                                <tr
                                    key={product.id}
                                    onClick={() => setData(product)}
                                >
                                    <td>{product.name}</td>
                                    <td>
                                        {product.type === '1'
                                            ? 'Term'
                                            : product.type === '2'
                                              ? 'Whole Life'
                                              : product.type === '3'
                                                ? 'Endowment'
                                                : product.type === '4'
                                                  ? 'Unit Link'
                                                  : 'Rider'}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(product.id);
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
                                    {t('product.no_products_found')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            }
            formTitle={isEdit ? t('product.edit_title') : t('product.create_title')}
            formSubtitle={t('product.form_subtitle')}
            formOnSubmit={handleSubmit}
            formContent={
                <>
                    <TextInput
                        id="product-name"
                        label={t('product.product_name')}
                        value={data.name || ''}
                        onChange={(e) => setData('name', e.target.value)}
                        row
                    />
                    <SelectInput
                        id="product-type"
                        label={t('product.product_type')}
                        value={data.type}
                        onChange={(value) => setData('type', value.toString())}
                        options={[
                            { value: '1', label: 'Term' },
                            { value: '2', label: 'Whole Life' },
                            { value: '3', label: 'Endowment' },
                            { value: '4', label: 'Unit Link' },
                            { value: '5', label: 'Rider' },
                        ]}
                        row
                    />

                    <div className="row form-group mb-3">
                        <label className="col-sm-3">
                            {t('product.commission')}
                        </label>
                        <div className="col-sm-9 text-end">
                            <button
                                id="commission-launcher"
                                className="btn btn-primary"
                                type="button"
                                onClick={addCommission}
                            >
                                <i className="fa fa-plus"></i>
                            </button>
                        </div>
                    </div>

                    <div className="row form-group">
                        <div className="col-sm-12">
                            <Table size="sm">
                                <thead>
                                    <tr>
                                        <th>{t('product.year')}</th>
                                        <th>{t('product.commission_rate')}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.commissions &&
                                        data.commissions.map((comm, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        value={comm.year}
                                                        onChange={(e) =>
                                                            handleCommissionChange(
                                                                idx,
                                                                'year',
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        value={
                                                            comm.commission_rate
                                                        }
                                                        onChange={(e) =>
                                                            handleCommissionChange(
                                                                idx,
                                                                'commission_rate',
                                                                parseFloat(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() =>
                                                            removeCommission(
                                                                idx,
                                                            )
                                                        }
                                                    >
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>

                    <div className="text-end">
                        <SubmitButton
                            processing={processing}
                            onClick={handleSubmit}
                        >
                            {isEdit ? t('common.update') : t('common.save')}
                        </SubmitButton>
                    </div>
                </>
            }
        />
    );
}
