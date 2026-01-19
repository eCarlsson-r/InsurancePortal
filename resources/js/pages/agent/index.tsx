import Pagination from '@/components/pagination';
import TablePage from '@/layouts/TablePage';
import { agentSchema } from '@/schemas/models';
import { Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
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
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

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

    const handleDelete = (agentId: string | undefined) => {
        if (agentId && confirm('Are you sure you want to delete this agent?')) {
            router.delete(`/master/agent/${agentId}`);
        }
    };

    const handleRowClick = (agentId: string | undefined) => {
        if (agentId) router.get(`/master/agent/${agentId}/edit`);
    };

    return (
        <TablePage
            headTitle="Agen"
            title="Daftar Agen"
            i18nTitle="agent"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: 'Agen', active: true, i18n: 'agent' },
            ]}
            toolbar={
                <div className="d-flex align-items-center">
                    <Link
                        href="/master/agent/create"
                        className="btn btn-primary me-3"
                    >
                        <i className="fa fa-user me-2"></i>
                        <span data-i18n="new-agent">Agen Baru</span>
                    </Link>
                    <div className="ms-auto d-flex gap-2">
                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cari agen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button className="btn btn-primary" type="button" onClick={handleSearch}>
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            }
            pagination={<Pagination links={agents.links} />}
        >
            <div className="table-responsive">
                <Table hover striped bordered className="vertical-middle">
                    <thead>
                        <tr>
                            <th style={{ width: '120px' }} data-i18n="agent-number">Kode Agen</th>
                            <th data-i18n="agent-name">Nama Agen</th>
                            <th style={{ width: '150px' }} data-i18n="agent-level">Jabatan</th>
                            <th data-i18n="agent-email">Email</th>
                            <th style={{ width: '150px' }} data-i18n="agent-birth-date">Tanggal Lahir</th>
                            <th style={{ width: '150px' }} data-i18n="agent-mobile">Nomor Ponsel</th>
                            <th style={{ width: '50px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.data.length > 0 ? (
                            agents.data.map((agent) => (
                                <tr key={agent.id} className="cursor-pointer" onClick={() => handleRowClick(agent.id)}>
                                    <td>{agent.official_number}</td>
                                    <td>{agent.name}</td>
                                    <td>
                                        {agent.programs && agent.programs.length > 0 ? agent.programs[0].position : '-'}
                                    </td>
                                    <td>{agent.email}</td>
                                    <td>
                                        {agent.birth_date ? new Date(agent.birth_date).toLocaleDateString() : '-'}
                                    </td>
                                    <td>{agent.mobile}</td>
                                    <td className="text-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(agent.id);
                                            }}
                                            className="btn btn-sm btn-danger"
                                            title="Delete"
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center text-muted py-4">
                                    No agents found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </TablePage>
    );
}
