import Pagination from '@/components/pagination';
import SelectInput from '@/components/form/select-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import TableFormPage from '@/layouts/TableFormPage';
import { productCommissionSchema, productSchema } from '@/schemas/models';
import { router, useForm } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
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
        credits: []
    });

    const isEdit = !!data.id;

    const handleDelete = (productCode: string | undefined) => {
        if (confirm('Are you sure you want to delete this product?')) {
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
            headTitle="Product"
            title="Produk"
            i18nTitle="product"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: 'Produk', active: true, i18n: 'product' },
            ]}
            tableTitle="Daftar Produk"
            tableI18nTitle="product-list"
            tableToolbar={
                <input
                    type="text"
                    className="form-control form-control-sm float-end"
                    placeholder="Cari produk..."
                    style={{ width: '200px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            }
            pagination={<Pagination links={products.links} />}
            tableContent={
                <Table hover striped bordered>
                    <thead>
                        <tr>
                            <th className="col-8" data-i18n="product-name">
                                Nama Produk
                            </th>
                            <th className="col-3" data-i18n="product-type">
                                Jenis Produk
                            </th>
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
                                            title="Delete"
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center">
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            }
            formTitle={isEdit ? 'Sunting Produk' : 'Tambah Produk'}
            formI18nTitle="edit-product"
            formSubtitle="Masukkan informasi produk asuransi."
            formI18nSubtitle="edit-product-inst"
            formOnSubmit={handleSubmit}
            formContent={
                <>
                    <TextInput
                        id="product-name"
                        label="Nama Produk"
                        value={data.name || ''}
                        onChange={(e) => setData('name', e.target.value)}
                        row
                    />
                    <SelectInput
                        id="product-type"
                        label="Jenis Produk"
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
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
                        <label className="col-sm-3" data-i18n="commission">
                            Komisi
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
                                        <th data-i18n="year">Tahun</th>
                                        <th data-i18n="commission-rate">
                                            Komisi (%)
                                        </th>
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
                                                        value={comm.commission_rate}
                                                        onChange={(e) =>
                                                            handleCommissionChange(
                                                                idx, 'commission_rate',
                                                                parseFloat(e.target.value)
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
                        <SubmitButton processing={processing} onClick={handleSubmit}>
                            {isEdit ? 'Perbarui' : 'Simpan'}
                        </SubmitButton>
                    </div>
                </>
            }
        />
    );
}
