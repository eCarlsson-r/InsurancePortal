import Pagination from '@/components/pagination';
import SelectInput from '@/components/form/select-input';
import TextInput from '@/components/form/text-input';
import SubmitButton from '@/components/form/submit-button';
import DateInput from '@/components/form/date-input';
import TableFormPage from '@/layouts/TableFormPage';
import { contestSchema } from '@/schemas/models';
import { router, useForm } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface ContestProps {
    contests: {
        data: z.infer<typeof contestSchema>[];
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

export default function Contest({ contests, filters }: ContestProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleSearch = useCallback(() => {
        router.get(
            '/master/contest',
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

    const handleDelete = (contestId: number | undefined) => {
        if (confirm('Are you sure you want to delete this contest?')) {
            router.delete(`/master/contest/${contestId}`);
        }
    };

    // Initial form state with safe defaults
    const { data, setData, post, put, processing } = useForm<z.infer<typeof contestSchema>>({
        id: undefined,
        name: '',
        type: 'annual',
        start: '',
        end: '',
        product: '',
        level: '',
        minimum_commision: 0,
        minimum_premium: 0,
        minimum_policy: 0,
        bonus_percent: 0,
        bonus_amount: 0,
        reward: '',
    });

    const isEdit = !!data.id;

    const handleSubmit = () => {
        if (isEdit) {
            put(`/master/contest/${data?.id}`);
        } else {
            post('/master/contest');
        }
    };

    return (
        <TableFormPage
            headTitle="Contest"
            title="Kontes"
            i18nTitle="contest"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: 'Kontes', active: true, i18n: 'contest' },
            ]}
            tableTitle="Daftar Kontes"
            tableI18nTitle="contest-list"
            tableToolbar={
                <input
                    type="text"
                    className="form-control form-control-sm float-end"
                    placeholder="Cari kontes..."
                    style={{ width: '200px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            }
            pagination={<Pagination links={contests.links} />}
            tableContent={
                <Table hover striped bordered>
                    <thead>
                        <tr>
                            <th data-field="contest-name">Nama Kontes</th>
                            <th data-field="contest-start">Mulai Kontes</th>
                            <th data-field="contest-end">Selesai Kontes</th>
                            <th data-field="minimum-premium">Premi Minimal</th>
                            <th className="col-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {contests.data.length > 0 ? (
                            contests.data.map((contestItem) => (
                                <tr
                                    key={contestItem.id}
                                    onClick={() => setData(contestItem)}
                                >
                                    <td>{contestItem.name}</td>
                                    <td>
                                        {new Date(contestItem.start).toDateString()}
                                    </td>
                                    <td>
                                        {new Date(contestItem.end).toDateString()}
                                    </td>
                                    <td>
                                        {contestItem.minimum_premium.toLocaleString(
                                            'id-ID',
                                            {
                                                style: 'currency',
                                                currency: 'IDR',
                                            },
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(contestItem.id);
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
                                <td colSpan={5} className="text-center" data-i18n="no-contest">
                                    Tidak ada kontes
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            }
            formTitle={isEdit ? 'Sunting Kontes' : 'Tambah Kontes'}
            formI18nTitle="edit-contest"
            formSubtitle="Masukkan informasi kontes yang dikejar Agen."
            formI18nSubtitle="edit-contest-inst"
            formOnSubmit={handleSubmit}
            formContent={
                <>
                    <TextInput
                        id="name"
                        label="Nama Kontes"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        row
                    />
                    <SelectInput
                        id="type"
                        label="Jenis Kontes"
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                        options={[
                            { value: 'annual', label: 'Annual Bonus', i18n: 'annual-bonus' },
                            { value: 'quarter', label: 'Quarterly Bonus', i18n: 'quarter-bonus' },
                            { value: 'bonanza', label: 'Bonanza', i18n: 'bonanza' },
                            { value: 'contest', label: 'Contest', i18n: 'contest' },
                            { value: 'MDRT', label: 'MDRT', i18n: 'mdrt' },
                            { value: 'empire', label: 'Empire Club', i18n: 'empire-club' },
                        ]}
                        row
                    />
                    <DateInput
                        id="start"
                        label="Mulai Kontes"
                        value={data.start ? data.start.split('T')[0] : ''}
                        onChange={(e) => setData('start', e.target.value)}
                        row
                    />
                    <DateInput
                        id="end"
                        label="Selesai Kontes"
                        value={data.end ? data.end.split('T')[0] : ''}
                        onChange={(e) => setData('end', e.target.value)}
                        row
                    />
                    <TextInput
                        id="minimum_premium"
                        label="Minimal Premi"
                        type="number"
                        value={data.minimum_premium}
                        onChange={(e) => setData('minimum_premium', parseInt(e.target.value) || 0)}
                        row
                    />
                    <TextInput
                        id="bonus_percent"
                        label="Bonus %"
                        type="number"
                        value={data.bonus_percent}
                        onChange={(e) => setData('bonus_percent', parseInt(e.target.value) || 0)}
                        row
                    />
                    <TextInput
                        id="reward"
                        label="Hadiah"
                        value={data.reward}
                        onChange={(e) => setData('reward', e.target.value)}
                        row
                    />
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
