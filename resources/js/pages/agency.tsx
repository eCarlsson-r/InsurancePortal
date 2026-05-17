import SelectInput from '@/components/form/select-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import Pagination from '@/components/pagination';
import TableFormPage from '@/layouts/TableFormPage';
import { agencySchema, agentSchema } from '@/schemas/models';
import { router, useForm } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
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

export default function Agency({
    agencies,
    agents = [],
    filters,
}: AgencyProps) {
    const { t } = useTranslation();
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
        if (confirm(t('agency.confirm_delete'))) {
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
            headTitle={t('agency.title')}
            title={t('agency.title')}
            breadcrumbs={[
                { label: t('common.master'), href: 'javascript:void(0)', i18n: 'master' },
                { label: t('agency.title'), active: true, i18n: 'agency' },
            ]}
            tableTitle={t('agency.list_title')}
            tableToolbar={
                <input
                    type="text"
                    className="form-control form-control-sm float-end"
                    placeholder={t('agency.search_placeholder')}
                    style={{ width: '200px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            }
            pagination={<Pagination links={agencies.links} />}
            tableContent={
                <Table hover striped bordered responsive>
                    <thead>
                        <tr>
                            <th className="col-8">{t('agency.agency_name')}</th>
                            <th className="col-3">{t('agency.city')}</th>
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
                                    {t('agency.no_agencies_found')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            }
            formTitle={isEdit ? t('agency.edit_title') : t('agency.create_title')}
            formSubtitle={t('agency.form_subtitle')}
            formOnSubmit={handleSubmit}
            formContent={
                <>
                    <TextInput
                        id="name"
                        label={t('agency.agency_name')}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        row
                    />

                    <TextInput
                        id="city"
                        label={t('agency.agency_city')}
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                        row
                    />

                    <SelectInput
                        id="director"
                        label={t('agency.agency_director')}
                        value={data.director}
                        onChange={(value) =>
                            setData('director', value.toString())
                        }
                        options={agents.map((agent) => ({
                            value: agent.id || '',
                            label: agent.name,
                        }))}
                        row
                    />

                    <SelectInput
                        id="leader"
                        label={t('agency.parent_agency')}
                        value={data.leader || ''}
                        onChange={(value) =>
                            setData('leader', value.toString())
                        }
                        options={agencies.data.map((agency) => ({
                            value: agency.id || '',
                            label: agency.name,
                        }))}
                        row
                    />
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
