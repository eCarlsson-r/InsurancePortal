import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { router } from "@inertiajs/react";
import { Table } from 'react-bootstrap';

interface Customer {
    id: string;
    name: string;
    birth_date: string;
    age: number;
    religion: string;
    address: string;
}

export default function Birthday({ month, customers }: { month: string; customers: Customer[] }) {
    const handleChange = (value: string | number) => {
        router.get('/reports/birthday', {
            month: value,
        });
    };

    return (
        <TablePage
            headTitle="Birthday"
            title="Ulang Tahun Nasabah"
            i18nTitle="birthday-report"
            breadcrumbs={[
                { label: 'Laporan', href: 'javascript:void(0)', i18n: 'report' },
                { label: 'Ulang Tahun Nasabah', active: true, i18n: 'birthday-report' },
            ]}
            toolbar={
                <div className="d-flex align-items-center justify-content-between w-100">
                    <h4 className="card-title mb-0" data-i18n="customer-birthday-report">
                        Daftar Ulang Tahun Nasabah
                    </h4>
                    <div className="d-flex align-items-center gap-2">
                        <label htmlFor="birthday-month" className="mb-0" data-i18n="month">
                            Bulan
                        </label>
                        <div style={{ width: '150px' }}>
                            <SelectInput
                                id="birthday-month"
                                value={month}
                                onChange={handleChange}
                                options={[
                                    { value: '1', label: 'January' },
                                    { value: '2', label: 'February' },
                                    { value: '3', label: 'March' },
                                    { value: '4', label: 'April' },
                                    { value: '5', label: 'May' },
                                    { value: '6', label: 'June' },
                                    { value: '7', label: 'July' },
                                    { value: '8', label: 'August' },
                                    { value: '9', label: 'September' },
                                    { value: '10', label: 'October' },
                                    { value: '11', label: 'November' },
                                    { value: '12', label: 'December' },
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
                        <th data-i18n="religion">Agama</th>
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
                                <td>{customer.religion === '1' ? 'Buddha' :
                                         customer.religion === '2' ? 'Kristen' :
                                         customer.religion === '3' ? 'Islam' :
                                         customer.religion === '4' ? 'Hindu' : customer.religion}</td>
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
