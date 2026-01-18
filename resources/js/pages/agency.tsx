import SelectInput from '@/components/form/select-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import TableFormPage from '@/layouts/TableFormPage';
import { agencySchema, agentSchema } from '@/schemas/models';
import { router, useForm } from '@inertiajs/react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface AgencyProps {
    agencies: z.infer<typeof agencySchema>[];
    agents: z.infer<typeof agentSchema>[];
}

export default function Agency({ agencies = [], agents = [] }: AgencyProps) {
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
                        {agencies.length > 0 ? (
                            agencies.map((agency) => (
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
                        value={data.leader}
                        onChange={(e) => setData('leader', e.target.value)}
                        options={agencies.map((agency) => ({
                            value: agency.id || '', // Assuming leader is name or ID string
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
