import PageHeader from '@/components/layout/page-header';
import TablePage from '@/layouts/TablePage';
import { agentSchema } from '@/schemas/models';
import { Head, Link, router } from '@inertiajs/react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface AgentProps {
    agents: z.infer<typeof agentSchema>[];
}

export default function Agent({ agents = [] }: AgentProps) {
    const handleDelete = (agentId: number | undefined) => {
        if (agentId && confirm('Are you sure you want to delete this agent?')) {
            router.delete(`/master/agent/${agentId}`);
        }
    };

    const handleRowClick = (agentId: number | undefined) => {
        if (agentId) router.get(`/master/agent/${agentId}/edit`);
    };

    return (
        <TablePage
            headTitle="Agen"
            title="Agen"
            i18nTitle="agent"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: 'Agen', active: true, i18n: 'agent' },
            ]}
            tableTitle="Daftar Agen"
            toolbar={
                <Link
                    href="/master/agent/create"
                    className="btn btn-primary"
                >
                    <i className="fa fa-user me-2"></i>
                    <span data-i18n="new-agent">Agen Baru</span>
                </Link>
            }
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
                        {agents.length > 0 ? (
                            agents.map((agent) => (
                                <tr key={agent.id} className="cursor-pointer">
                                    <td onClick={() => handleRowClick(agent.id)}>{agent.official_number}</td>
                                    <td onClick={() => handleRowClick(agent.id)}>{agent.name}</td>
                                    <td onClick={() => handleRowClick(agent.id)}>
                                        {agent.programs && agent.programs.length > 0 ? agent.programs[0].position : '-'}
                                    </td>
                                    <td onClick={() => handleRowClick(agent.id)}>{agent.email}</td>
                                    <td onClick={() => handleRowClick(agent.id)}>
                                        {agent.birth_date ? new Date(agent.birth_date).toLocaleDateString() : '-'}
                                    </td>
                                    <td onClick={() => handleRowClick(agent.id)}>{agent.mobile}</td>
                                    <td className="text-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(agent.id);
                                            }}
                                            className="btn btn-sm btn-danger p-1"
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
