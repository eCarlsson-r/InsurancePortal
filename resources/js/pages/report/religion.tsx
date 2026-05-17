import SelectInput from '@/components/form/select-input';
import TablePage from '@/layouts/TablePage';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap';

interface Customer {
    id: string;
    name: string;
    birth_date: string;
    age: number;
    religion: string;
    address: string;
}

export default function Religion({
    religion,
    customers,
}: {
    religion: string;
    customers: Customer[];
}) {
    const { t } = useTranslation();
    const handleChange = (value: string | number) => {
        router.get('/reports/religion', {
            religion: value,
        });
    };

    return (
        <TablePage
            headTitle={t('report.religion-report')}
            title={t('report.customer-religion-report')}
            i18nTitle="religion-report"
            breadcrumbs={[
                {
                    label: t('common.reports'),
                    href: 'javascript:void(0)',
                    i18n: 'report',
                },
                {
                    label: t('report.customer-religion-report'),
                    active: true,
                    i18n: 'religion-report',
                },
            ]}
            toolbar={
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 w-100">
                    <h4 className="card-title mb-0">
                        {t('report.customer-religion-report')}
                    </h4>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <label htmlFor="religion" className="mb-0">
                            {t('customer.religion')}
                        </label>
                        <div style={{ width: '150px' }}>
                            <SelectInput
                                id="religion"
                                value={religion}
                                placeholder={t('customer.religion_placeholder')}
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
            <Table hover striped bordered responsive>
                <thead>
                    <tr>
                        <th>{t('common.name')}</th>
                        <th>{t('customer.birth_date')}</th>
                        <th>{t('common.age')}</th>
                        <th>{t('common.home_address')}</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length > 0 ? (
                        customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.name}</td>
                                <td>
                                    {new Date(
                                        customer.birth_date,
                                    ).toDateString()}
                                </td>
                                <td>{customer.age}</td>
                                <td>{customer.address}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={5}
                                className="text-center text-muted py-4"
                            >
                                {t('customer.no_customers_found')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </TablePage>
    );
}
