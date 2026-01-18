import TablePage from '@/layouts/TablePage';
import { customerSchema } from '@/schemas/models';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface CustomerProps {
    customers: z.infer<typeof customerSchema>[];
}

export default function Customer({ customers = [] }: CustomerProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = (customerId: number | undefined) => {
        if (customerId && confirm('Are you sure you want to delete this customer?')) {
            router.delete(`/master/customer/${customerId}`);
        }
    };

    const handleRowClick = (customerId: number | undefined) => {
        if (customerId) router.get(`/master/customer/${customerId}/edit`);
    };

    const filteredCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.identity.includes(searchQuery)
    );

    return (
        <TablePage
            headTitle="Nasabah"
            title="Nasabah"
            i18nTitle="customer"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: 'Nasabah', active: true, i18n: 'customer' },
            ]}
            tableTitle="Daftar Pemegang Polis"
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
                            />
                            <button className="btn btn-primary" type="button">
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
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="cursor-pointer">
                                    <td onClick={() => handleRowClick(customer.id)}>{customer.name}</td>
                                    <td onClick={() => handleRowClick(customer.id)}>{customer.identity}</td>
                                    <td onClick={() => handleRowClick(customer.id)}>
                                        {customer.birth_date ? new Date(customer.birth_date).toLocaleDateString() : '-'}
                                    </td>
                                    <td onClick={() => handleRowClick(customer.id)}>{customer.birth_place}</td>
                                    <td onClick={() => handleRowClick(customer.id)}>{customer.marital}</td>
                                    <td onClick={() => handleRowClick(customer.id)}>{customer.religion}</td>
                                    <td onClick={() => handleRowClick(customer.id)}>{customer.mobile}</td>
                                    <td className="text-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(customer.id);
                                            }}
                                            className="btn btn-sm btn-link text-danger p-0"
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
        </TablePage>
    );
}
