import TemplateLayout from '@/layouts/TemplateLayout';
import { programSchema } from '@/schemas/models';
import { Head, Link, router } from '@inertiajs/react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface ProgramProps {
    programs: z.infer<typeof programSchema>[];
}

export default function Program({ programs = [] }: ProgramProps) {
    const handleRowClick = (programId: number | undefined) => {
        if (programId) router.get(`/master/program/${programId}/edit`);
    };

    return (
        <TemplateLayout>
            <Head title="Program" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3
                            className="text-primary d-inline"
                            data-i18n="program"
                        >
                            Program
                        </h3>{' '}
                    </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="javascript:void(0)" data-i18n="master">
                                    Master
                                </a>
                            </li>
                            <li
                                className="breadcrumb-item active"
                                data-i18n="program"
                            >
                                Program
                            </li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <div
                                    id="program-toolbar"
                                    className="card-title toolbar form-inline"
                                >
                                    <h4 data-i18n="program-list">
                                        Daftar Program
                                    </h4>
                                    &emsp;
                                    <Link
                                        href="/master/program/create"
                                        className="btn btn-primary"
                                    >
                                        <i className="fa fa-file"></i>{' '}
                                        <span data-i18n="new-program">
                                            Program Baru
                                        </span>
                                    </Link>
                                </div>
                                <div className="table-responsive">
                                    <Table hover striped bordered>
                                        <thead>
                                            <tr>
                                                <th className="col-sm-3">
                                                    Nama Program
                                                </th>
                                                <th
                                                    className="col-sm-2"
                                                    data-formatter="LevelFormatter"
                                                >
                                                    Jabatan Agen
                                                </th>
                                                <th
                                                    className="col-sm-2"
                                                    data-formatter="programIDRFormatter"
                                                >
                                                    Allowance Minimal
                                                </th>
                                                <th
                                                    className="col-sm-2"
                                                    data-formatter="programIDRFormatter"
                                                >
                                                    Allowance Maksimal
                                                </th>
                                                <th
                                                    className="col-sm-1"
                                                    data-formatter="programActionFormatter"
                                                    data-events="programActionHandler"
                                                ></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {programs.length > 0 ? (
                                                programs.map((program) => (
                                                    <tr key={program.id} onClick={() => handleRowClick(program.id)}>
                                                        <td>{program.name}</td>
                                                        <td>
                                                            {program.position}
                                                        </td>
                                                        <td>
                                                            {program.min_allowance.toLocaleString(
                                                                'id-ID',
                                                                {
                                                                    style: 'currency',
                                                                    currency: 'IDR',
                                                                },
                                                            )}
                                                        </td>
                                                        <td>
                                                            {program.max_allowance.toLocaleString(
                                                                'id-ID',
                                                                {
                                                                    style: 'currency',
                                                                    currency: 'IDR',
                                                                },
                                                            )}
                                                        </td>
                                                        <td>

                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="text-center text-muted py-4"
                                                    >
                                                        No programs found.
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
