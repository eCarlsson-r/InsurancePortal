import Pagination from '@/components/pagination';
import SelectInput from '@/components/form/select-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import TableFormPage from '@/layouts/TableFormPage';
import { agencySchema, agentSchema } from '@/schemas/models';
import { router, useForm } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface AgencyProps {
    agencies: {
        data: z.infer<typeof agencySchema>[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    agents: z.infer<typeof agentSchema>[];
    filters: {
        search: string | null;
    };
}

export default function Agency({ agencies, agents = [], filters }: AgencyProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleSearch = useCallback(() => {
        router.get(
            '/master/agency',
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
        z.infer<typeof agencySchema>
    >({
        id: undefined,
        name: '',
        city: '',
        director: '',
        leader: '',
    });

    const isEdit = !!data.id;

    const handleDelete = (agencyId: number | undefined) => {
        if (confirm('Are you sure you want to delete this agency?')) {
            router.delete(`/master/agency/${agencyId}`);
        }
    };

    const handleSubmit = () => {
        if (isEdit) {
            put(`/master/agency/${data.id}`);
        } else {
            post('/master/agency');
        }
    };

    return (
        <TableFormPage
            headTitle="Agency"
            title="Agency / Regional"
            i18nTitle="agency"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: 'Agency / Regional', active: true, i18n: 'agency' },
            ]}
            tableTitle="Daftar Agency / Regional"
            tableI18nTitle="agency-list"
            tableToolbar={
                <input
                    type="text"
                    className="form-control form-control-sm float-end"
                    placeholder="Cari agency..."
                    style={{ width: '200px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            }
            pagination={<Pagination links={agencies.links} />}
            tableContent={
                <Table hover striped bordered>
                    <thead>
                        <tr>
                            <th className="col-8" data-i18n="agency-name">
                                Agency / Regional
                            </th>
                            <th className="col-3" data-i18n="agency-city">
                                Kota
                            </th>
                            <th className="col-1"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {agencies.data.length > 0 ? (
                            agencies.data.map((agency) => (
                                <tr
                                    key={agency.id}
                                    onClick={() => setData(agency)}
                                >
                                    <td>{agency.name}</td>
                                    <td>{agency.city}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(agency.id);
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
                                    No agencies found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            }
            formTitle={isEdit ? 'Sunting Agency' : 'Tambah Agency'}
            formI18nTitle="edit-agency"
            formSubtitle="Masukkan informasi mengenai Agency."
            formI18nSubtitle="edit-agency-inst"
            formOnSubmit={handleSubmit}
            formContent={
                <>
                    <TextInput
                        id="name"
                        label="Nama Agency"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        row
                    />

                    <TextInput
                        id="city"
                        label="Kota Agency"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        row
                    />

                    <SelectInput
                        id="director"
                        label="Direktur Agency"
                        value={data.director}
                        onChange={(e) => setData('director', e.target.value)}
                        options={agents.map((agent) => ({
                            value: agent.id || '',
                            label: agent.name,
                        }))}
                        row
                    />

                    <SelectInput
                        id="leader"
                        label="Agency Atasan"
                        value={data.leader || ''}
                        onChange={(e) => setData('leader', e.target.value)}
                        options={agencies.data.map((agency) => ({
                            value: agency.id || '',
                            label: agency.name,
                        }))}
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
