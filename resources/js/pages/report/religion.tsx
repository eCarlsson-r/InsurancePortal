import SelectInput from '@/components/form/select-input';
import TemplateLayout from '@/layouts/TemplateLayout';
import { Head, router } from '@inertiajs/react';
import { Table } from 'react-bootstrap';

export default function Religion({religion, customers}: {religion: string, customers: {id: string, name: string, birth_date: string, age: number, religion: string, address: string}[]}) {
    const handleChange = function(e: React.ChangeEvent<HTMLSelectElement>) {
        religion = e.target.value;
        router.get('/reports/religion', {
            religion: religion
        });
    }

    return (
        <TemplateLayout>
            <Head title="Religion" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="religion-report">Agama Pemegang Polis</h3> </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="report">Laporan</a></li>
                            <li className="breadcrumb-item active" data-i18n="religion-report">Agama Pemegang Polis</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div id="religion-toolbar" className="form-inline">
                                    <div className="col-sm-4 form-group">
                                        <h4 className="card-title" data-i18n="customer-religion-report">Daftar Pemegang Polis berdasarkan Agama</h4>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <label className="col-sm-4" htmlFor="religion" data-i18n="customer-religion">Agama</label>
                                        <SelectInput id="religion" value={religion} onChange={handleChange} options={[{value:"1", label:'Budha'}, {value:"2", label:'Kristen'}, {value:"3", label:'Islam'}, {value:"4", label:'Hindu'}]}/>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <Table hover striped bordered>
                                        <thead><tr>
                                            <th>Nama</th>
                                            <th>Tanggal Lahir</th>
                                            <th>Umur</th>
                                            <th>Agama</th>
                                            <th>Alamat Rumah</th>
                                        </tr></thead>
                                        <tbody>
                                            {customers.length > 0 ? (customers.map((customer) => (
                                                <tr key={customer.id}>
                                                    <td>{customer.name}</td>
                                                    <td>{new Date(customer.birth_date).toDateString()}</td>
                                                    <td>{customer.age}</td>
                                                    <td>{customer.religion}</td>
                                                    <td>{customer.address}</td>
                                                </tr>
                                            ))) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center text-muted py-4">
                                                        No customer found.
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