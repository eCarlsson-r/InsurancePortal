import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { router } from '@inertiajs/react';
import { Table } from 'react-bootstrap';

interface Customer {
    id: string;
    name: string;
    birth_date: string;
    age: number;
    religion: string;
    address: string;
}

export default function Religion({ religion, customers }: { religion: string; customers: Customer[] }) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get('/reports/religion', {
            religion: e.target.value,
        });
    };

    return (
        <TablePage
            headTitle="Religion"
            title="Agama Pemegang Polis"
            i18nTitle="religion-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Agama Pemegang Polis', active: true, i18n: 'religion-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="customer-religion-report">
                        Daftar Pemegang Polis berdasarkan Agama
                    </h4>
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="religion" className="mb-0" data-i18n="customer-religion">
                            Agama
                        </label>
                        <div style={{ width: '150px' }}>
                            <SelectInput
                                id="religion"
                                value={religion}
                                onChange={handleChange}
                                options={[
                                    { value: '1', label: 'Budha' },
                                    { value: '2', label: 'Kristen' },
                                    { value: '3', label: 'Islam' },
                                    { value: '4', label: 'Hindu' },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            }
        >
            <Table hover striped bordered>
                <thead>
                    <tr>
                        <th data-i18n="name">Nama</th>
                        <th data-i18n="birth-date">Tanggal Lahir</th>
                        <th data-i18n="age">Umur</th>
                        <th data-i18n="home-address">Alamat Rumah</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length > 0 ? (
                        customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.name}</td>
                                <td>{new Date(customer.birth_date).toDateString()}</td>
                                <td>{customer.age}</td>
                                <td>{customer.address}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center text-muted py-4">
                                No customer found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </TablePage>
    );
}