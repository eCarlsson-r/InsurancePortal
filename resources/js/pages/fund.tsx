import SelectInput from '@/components/form/select-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import TableFormPage from '@/layouts/TableFormPage';
import { fundSchema } from '@/schemas/models';
import { router, useForm } from '@inertiajs/react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface FundProps {
    funds: z.infer<typeof fundSchema>[];
}

export default function Fund({ funds = [] }: FundProps) {
    // Initial form state with safe defaults
    const { data, setData, post, put, processing } = useForm<
        z.infer<typeof fundSchema>
    >({
        id: undefined,
        name: '',
        currency: '1',
    });

    const isEdit = !!data.id;

    const handleDelete = (fundCode: number | undefined) => {
        if (confirm('Are you sure you want to delete this fund?')) {
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
            headTitle="Fund"
            title="Jenis Dana"
            i18nTitle="fund"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: 'Jenis Dana', active: true, i18n: 'fund' },
            ]}
            tableTitle="Daftar Jenis Dana"
            tableI18nTitle="fund-list"
            tableContent={
                <Table hover striped bordered>
                    <thead>
                        <tr>
                            <th className="col-8" data-i18n="fund-name">
                                Nama Jenis Dana
                            </th>
                            <th className="col-3" data-i18n="fund-currency">
                                Mata Uang
                            </th>
                            <th className="col-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {funds.length > 0 ? (
                            funds.map((fund) => (
                                <tr key={fund.id} onClick={() => setData(fund)}>
                                    <td>{fund.name}</td>
                                    <td>
                                        {fund.currency === '1'
                                            ? 'Rupiah'
                                            : 'Dollar'}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(fund.id);
                                            }}
                                            data-i18n="delete"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            }
            formTitle={isEdit ? 'Sunting Jenis Dana' : 'Tambah Jenis Dana'}
            formI18nTitle="edit-fund"
            formSubtitle="Masukkan informasi jenis dana investasi."
            formI18nSubtitle="edit-fund-inst"
            formOnSubmit={handleSubmit}
            formContent={
                <>
                    <TextInput
                        id="fund-name"
                        label="Nama Jenis Dana"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        row
                    />
                    <SelectInput
                        id="fund-currency"
                        label="Mata Uang"
                        value={data.currency}
                        onChange={(e) => setData('currency', e.target.value)}
                        options={[
                            { value: '1', label: 'Rupiah' },
                            { value: '2', label: 'Dollar' },
                        ]}
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
