import Pagination from '@/components/pagination';
import UploadModal from '@/components/upload-modal';
import TablePage from '@/layouts/TablePage';
import { agentSchema } from '@/schemas/models';
import { Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { InputGroup, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface AgentProps {
    agents: {
        data: z.infer<typeof agentSchema>[];
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

export default function Agent({ agents, filters }: AgentProps) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [fileModalOpen, setFileModalOpen] = useState(false);
    const [documentId, setDocumentId] = useState('');

    const handleSearch = useCallback(() => {
        router.get(
            '/master/agent',
            { search: searchQuery },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [searchQuery]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery !== (filters.search || '')) {
                handleSearch();
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, filters.search, handleSearch]);

    const handleUpload = (agentId: string) => {
        setFileModalOpen(true);
        setDocumentId(agentId);
    };

    const handleDelete = (agentId: string | undefined) => {
        if (agentId && confirm(t('agent.confirmDelete'))) {
            router.delete(`/master/agent/${agentId}`);
        }
    };

    const handleRowClick = (agentId: string | undefined) => {
        if (agentId) router.get(`/master/agent/${agentId}/edit`);
    };

    return (
        <TablePage
            headTitle={t('agent.title')}
            title={t('agent.list_title')}
            i18nTitle="agent"
            breadcrumbs={[
                { label: t('common.master'), href: 'javascript:void(0)', i18n: 'master' },
                { label: t('agent.title'), active: true, i18n: 'agent' },
            ]}
            toolbar={
                <div className="d-flex align-items-center">
                    <Link
                        href="/master/agent/create"
                        className="btn btn-primary me-3"
                    >
                        <i className="fa fa-user me-2"></i>
                        <span>{t('agent.new_agent')}</span>
                    </Link>
                    <div className="ms-auto d-flex gap-2">
                        <InputGroup>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('agent.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={handleSearch}
                            >
                                <i className="fa fa-search"></i>
                            </button>
                        </InputGroup>
                    </div>
                </div>
            }
            pagination={<Pagination links={agents.links} />}
        >
            <Table
                hover
                striped
                bordered
                responsive
                className="vertical-middle"
            >
                <thead>
                    <tr>
                        <th style={{ width: '120px' }}>
                            {t('agent.agent_code')}
                        </th>
                        <th>{t('agent.agent_name')}</th>
                        <th style={{ width: '150px' }}>
                            {t('agent.position')}
                        </th>
                        <th>{t('common.email_address')}</th>
                        <th
                            style={{ width: '150px' }}
                        >
                            {t('customer.birth_date')}
                        </th>
                        <th style={{ width: '150px' }}>
                            {t('common.mobile_number')}
                        </th>
                        <th style={{ width: '50px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {agents.data.length > 0 ? (
                        agents.data.map((agent) => (
                            <tr
                                key={agent.id}
                                className="cursor-pointer"
                                onClick={() => handleRowClick(agent.id)}
                            >
                                <td>{agent.official_number}</td>
                                <td>{agent.name}</td>
                                <td>
                                    {agent.programs && agent.programs.length > 0
                                        ? agent.programs[0].position
                                        : '-'}
                                </td>
                                <td>{agent.email}</td>
                                <td>
                                    {agent.birth_date
                                        ? new Date(
                                              agent.birth_date,
                                          ).toLocaleDateString()
                                        : '-'}
                                </td>
                                <td>{agent.mobile}</td>
                                <td className="text-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpload(agent.id || '');
                                        }}
                                        className="btn btn-sm btn-primary me-1"
                                        title={t('common.upload')}
                                    >
                                        <i className="la la-upload"></i>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(agent.id);
                                        }}
                                        className="btn btn-sm btn-danger"
                                        title={t('common.delete')}
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={7}
                                className="text-center text-muted py-4"
                            >
                                {t('agent.noAgentsFound')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <UploadModal
                show={fileModalOpen}
                onHide={() => setFileModalOpen(false)}
                documentId={documentId}
                documentPurpose="agent"
            />
        </TablePage>
    );
}
