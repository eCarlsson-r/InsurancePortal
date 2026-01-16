import TemplateLayout from '@/layouts/TemplateLayout';
import { customerSchema } from '@/schemas/models';
import { Head, Link, router } from '@inertiajs/react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface CustomerProps {
    customers: z.infer<typeof customerSchema>[];
}

export default function Customer({ customers = [] }: CustomerProps) {
    const handleDelete = (customerCode: number | undefined) => {
        if (customerCode && confirm('Are you sure you want to delete this customer?')) {
            router.delete(`/master/customer/${customerCode}`);
        }
    };

    const handleRowClick = (customerId: number | undefined) => {
        if (customerId) router.get(`/master/customer/${customerId}/edit`);
    }

    return (
        <TemplateLayout>
            <Head title="Nasabah" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="customer">
                            Nasabah
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
                                data-i18n="customer"
                            >
                                Nasabah
                            </li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <div id="customer-toolbar" className="card-title toolbar form-inline input-group">
                                    <h4 className="col-sm-3" data-i18n="customer-list">Daftar Pemegang Polis</h4>
                                    <Link href="/master/customer/create" className="col-sm-3 btn btn-primary">
                                        <i className="fa fa-user"></i> <span data-i18n="new-customer">Pemegang Polis Baru</span>
                                    </Link>
                                    <p className="col-sm-1">&emsp;</p>
                                    <label className="input-group-text">Nasabah : </label>
                                    <input type="text" id="customer-query" className="col-sm-3 form-control" size={20}/>
                                    <button id="customer-search" type="button" className="col-sm-1 col-2 btn btn-primary">
                                        <i className="fa fa-search"></i>
                                    </button>
                                </div>
                                <div className="table-responsive">
                                    <Table hover striped bordered>
                                        <thead>
                                        <tr>
                                            <th className="col-sm-2">Nama</th>
                                            <th className="col-sm-2">No. Identitas</th>
                                            <th className="col-sm-2">Tgl. Lahir</th>
                                            <th className="col-sm-1">Tempat Lahir</th>
                                            <th className="col-sm-1">Status</th>
                                            <th className="col-sm-1">Agama</th>
                                            <th className="col-sm-2">Nomor Ponsel</th>
                                            <th className="col-sm-1"></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {customers.map((customer) => (
                                            <tr key={customer.id} onClick={() => handleRowClick(customer.id)} style={{ cursor: 'pointer' }}>
                                                <td>{customer.name}</td>
                                                <td>{customer.identity}</td>
                                                <td>{new Date(customer.birth_date).toLocaleDateString()}</td>
                                                <td>{customer.birth_place}</td>
                                                <td>{customer.marital}</td>
                                                <td>{customer.religion}</td>
                                                <td>{customer.mobile}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(customer.id);
                                                        }}
                                                    >
                                                        <i className="fa fa-trash"></i> Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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
