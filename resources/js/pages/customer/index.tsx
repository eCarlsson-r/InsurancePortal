import Pagination from '@/components/pagination';
import TablePage from '@/layouts/TablePage';
import { customerSchema } from '@/schemas/models';
import { Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface CustomerProps {
    customers: {
        data: z.infer<typeof customerSchema>[];
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

export default function Customer({ customers, filters }: CustomerProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleDelete = (customerId: string | undefined) => {
        if (customerId && confirm('Are you sure you want to delete this customer?')) {
            router.delete(`/master/customer/${customerId}`);
        }
    };

    const handleRowClick = (customerId: string | undefined) => {
        if (customerId) router.get(`/master/customer/${customerId}/edit`);
    };

    const handleSearch = useCallback(() => {
        router.get(
            '/master/customer',
            { search: searchQuery },
            { preserveState: true, replace: true }
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

    return (
        <TablePage
            headTitle="Nasabah"
            title="Daftar Nasabah"
            i18nTitle="customer"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: 'Nasabah', active: true, i18n: 'customer' },
            ]}
            toolbar={
                <div className="d-flex flex-wrap gap-2 align-items-center w-100">
                    <Link
                        href="/master/customer/create"
                        className="btn btn-primary"
                    >
                        <i className="fa fa-user me-2"></i>
                        <span data-i18n="new-customer">Pemegang Polis Baru</span>
                    </Link>
                    <div className="ms-auto d-flex gap-2">
                        <div className="input-group" style={{ maxWidth: '300px' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cari nasabah..."
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
        >
            <div className="table-responsive">
                <Table hover striped bordered className="vertical-middle">
                    <thead>
                        <tr>
                            <th data-i18n="customer-name">Nama</th>
                            <th style={{ width: '150px' }} data-i18n="id-number">No. Identitas</th>
                            <th style={{ width: '150px' }} data-i18n="birth-date">Tgl. Lahir</th>
                            <th style={{ width: '150px' }} data-i18n="birth-place">Tempat Lahir</th>
                            <th style={{ width: '100px' }} data-i18n="status">Status</th>
                            <th style={{ width: '100px' }} data-i18n="religion">Agama</th>
                            <th style={{ width: '150px' }} data-i18n="mobile-number">Nomor Ponsel</th>
                            <th style={{ width: '50px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.data.length > 0 ? (
                            customers.data.map((customer) => (
                                <tr key={customer.id} onClick={() => handleRowClick(customer.id)} className="cursor-pointer">
                                    <td>{customer.name}</td>
                                    <td>{customer.identity}</td>
                                    <td>
                                        {customer.birth_date ? new Date(customer.birth_date).toLocaleDateString() : '-'}
                                    </td>
                                    <td>{customer.birth_place}</td>
                                    <td>
                                        {customer.marital === 1 ? 'Single' : 
                                         customer.marital === 2 ? 'Kawin' :
                                         customer.marital === 3 ? 'Duda/Janda' :
                                         customer.marital === 4 ? 'Cerai' : customer.marital}
                                    </td>
                                    <td>
                                        {customer.religion === 1 ? 'Buddha' : 
                                         customer.religion === 2 ? 'Kristen' :
                                         customer.religion === 3 ? 'Islam' :
                                         customer.religion === 4 ? 'Hindu' : customer.religion}
                                    </td>
                                    <td onClick={() => handleRowClick(customer.id)}>{customer.mobile}</td>
                                    <td className="text-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(customer.id);
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
                                <td colSpan={8} className="text-center text-muted py-4">
                                    No customers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            <Pagination links={customers.links} />
        </TablePage>
    );
}
