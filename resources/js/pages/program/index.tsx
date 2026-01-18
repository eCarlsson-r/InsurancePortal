import TablePage from '@/layouts/TablePage';
import { programSchema } from '@/schemas/models';
import { Link, router } from '@inertiajs/react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface ProgramProps {
    programs: z.infer<typeof programSchema>[];
}

export default function Program({ programs = [] }: ProgramProps) {
    const handleRowClick = (programId: number | undefined) => {
        if (programId) router.get(`/master/program/${programId}/edit`);
    };

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        });
    };

    return (
        <TablePage
            headTitle="Program"
            title="Daftar Program"
            i18nTitle="program"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: 'Program', active: true, i18n: 'program' },
            ]}
            toolbar={
                <Link
                    href="/master/program/create"
                    className="btn btn-primary"
                >
                    <i className="fa fa-file me-2"></i>
                    <span data-i18n="new-program">Program Baru</span>
                </Link>
            }
        >
            <div className="table-responsive">
                <Table hover striped bordered className="vertical-middle">
                    <thead>
                        <tr>
                            <th data-i18n="program-name">Nama Program</th>
                            <th style={{ width: '200px' }} data-i18n="agent-level">Jabatan Agen</th>
                            <th style={{ width: '200px' }} data-i18n="min-allowance">Allowance Minimal</th>
                            <th style={{ width: '200px' }} data-i18n="max-allowance">Allowance Maksimal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.length > 0 ? (
                            programs.map((program) => (
                                <tr 
                                    key={program.id} 
                                    onClick={() => handleRowClick(program.id)}
                                    className="cursor-pointer"
                                >
                                    <td>{program.name}</td>
                                    <td>
                                        {program.position === 'FC' ? 'Financial Consultant' : 
                                         program.position === 'BP*' ? 'Business Partner *' :
                                         program.position === 'BP**' ? 'Business Partner **' :
                                         program.position === 'BP***' ? 'Business Partner ***' : program.position}
                                    </td>
                                    <td className="text-end">
                                        {formatCurrency(program.min_allowance)}
                                    </td>
                                    <td className="text-end">
                                        {formatCurrency(program.max_allowance)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center text-muted py-4">
                                    No programs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </TablePage>
    );
}
