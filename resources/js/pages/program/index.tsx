import Pagination from '@/components/pagination';
import TablePage from '@/layouts/TablePage';
import { programSchema } from '@/schemas/models';
import { Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface ProgramProps {
    programs: {
        data: z.infer<typeof programSchema>[];
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

export default function Program({ programs, filters }: ProgramProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleSearch = useCallback(() => {
        router.get(
            '/master/program',
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

    const handleRowClick = (programId: number | undefined) => {
        if (programId) router.get(`/master/program/${programId}/edit`);
    };

    const handleDelete = (programId: number | undefined) => {
        if (programId && confirm('Are you sure you want to delete this program?')) {
            router.delete(`/master/program/${programId}`);
        }
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
                <div className="d-flex align-items-center">
                    <Link
                        href="/master/program/create"
                        className="btn btn-primary me-3"
                    >
                        <i className="fa fa-file me-2"></i>
                        <span data-i18n="new-program">Program Baru</span>
                    </Link>
                    <div className="ms-auto d-flex gap-2">
                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cari program..."
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
            pagination={<Pagination links={programs.links} />}
        >
            <div className="table-responsive">
                <Table hover striped bordered className="vertical-middle">
                    <thead>
                        <tr>
                            <th data-i18n="program-name">Nama Program</th>
                            <th style={{ width: '200px' }} data-i18n="agent-level">Jabatan Agen</th>
                            <th style={{ width: '200px' }} data-i18n="min-allowance">Allowance Minimal</th>
                            <th style={{ width: '200px' }} data-i18n="max-allowance">Allowance Maksimal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.data.length > 0 ? (
                            programs.data.map((program) => (
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
                                    <td className="text-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(program.id);
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
                                <td colSpan={5} className="text-center text-muted py-4">
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
