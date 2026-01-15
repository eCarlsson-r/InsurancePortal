import TemplateLayout from '@/layouts/TemplateLayout';
import { agentSchema } from '@/schemas/models';
import { Head, Link, router } from '@inertiajs/react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface AgentProps {
    agents: z.infer<typeof agentSchema>[];
}

export default function Agent({ agents = [] }: AgentProps) {
    const handleDelete = (agentCode: string) => {
        if (confirm('Are you sure you want to delete this agent?')) {
            router.delete(`/master/agent/${agentCode}`);
        }
    };

    const handleRowClick = (agentId: number | undefined) => {
        if (agentId) router.get(`/master/agent/${agentId}/edit`);
    }

    return (
        <TemplateLayout>
            <Head title="Agen" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="agent">
                            Agen
                        </h3>{' '}
                    </div>
                    <div className="col-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="javascript:void(0)" data-i18n="master">
                                    Master
                                </a>
                            </li>
                            <li
                                className="breadcrumb-item active"
                                data-i18n="agent"
                            >
                                Agen
                            </li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <div
                                    id="agent-toolbar"
                                    className="card-title toolbar form-inline"
                                >
                                    <h4 data-i18n="agent-list">Daftar Agen</h4>
                                    &emsp;
                                    <Link
                                        href="/master/agent/create"
                                        className="btn btn-primary"
                                    >
                                        <i className="fa fa-user"></i>{' '}
                                        <span data-i18n="new-agent">
                                            Agen Baru
                                        </span>
                                    </Link>
                                </div>
                                <div className="table-responsive">
                                    <Table hover striped bordered>
                                        <thead>
                                            <tr>
                                                <th
                                                    className="col-sm-1"
                                                    data-sortable="true"
                                                    data-field="agent-number"
                                                >
                                                    Kode Agen
                                                </th>
                                                <th
                                                    className="col-sm-2"
                                                    data-field="agent-name"
                                                >
                                                    Nama Agen
                                                </th>
                                                <th
                                                    className="col-sm-1"
                                                    data-sortable="true"
                                                    data-field="agent-level"
                                                    data-formatter="LevelFormatter"
                                                >
                                                    Jabatan Agen
                                                </th>
                                                <th
                                                    className="col-sm-2"
                                                    data-field="agent-email"
                                                >
                                                    Email Agen
                                                </th>
                                                <th
                                                    className="col-sm-2"
                                                    data-sortable="true"
                                                    data-field="agent-birth-date"
                                                    data-formatter="agentFullDateFormatter"
                                                >
                                                    Tanggal Lahir
                                                </th>
                                                <th
                                                    className="col-sm-1"
                                                    data-sortable="true"
                                                    data-field="agent-mobile"
                                                >
                                                    Nomor Ponsel
                                                </th>
                                                <th
                                                    className="col-sm-1"
                                                    data-formatter="agentActionFormatter"
                                                    data-events="agentActionHandler"
                                                ></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {agents.length > 0 ? (
                                                agents.map((agent) => (
                                                    <tr key={agent.id} onClick={() => handleRowClick(agent.id)}>
                                                        <td>{agent.official_number}</td>
                                                        <td>{agent.name}</td>
                                                        <td>{agent.programs[0].position}</td>
                                                        <td>{agent.email}</td>
                                                        <td>
                                                            {new Date(
                                                                agent.birth_date,
                                                            ).toDateString()}
                                                        </td>
                                                        <td>{agent.mobile}</td>
                                                        <td>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        agent.id?.toString() ||
                                                                            '',
                                                                    )
                                                                }
                                                                className="btn btn-sm btn-danger"
                                                                title="Delete"
                                                            >
                                                                <i className="la la-ban"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={10}
                                                        className="text-center text-muted py-4"
                                                    >
                                                        No agents found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TemplateLayout>
    );
}
