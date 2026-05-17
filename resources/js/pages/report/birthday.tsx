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

export default function Birthday({
    month,
    customers,
}: {
    month: string;
    customers: Customer[];
}) {
    const { t } = useTranslation();

    const handleChange = (value: string | number) => {
        router.get('/reports/birthday', {
            month: value,
        });
    };

    return (
        <TablePage
            headTitle={t('report.birthday-report')}
            title={t('report.customer-birthday-report')}
            i18nTitle="birthday-report"
            breadcrumbs={[
                {
                    label: t('common.reports'),
                    href: 'javascript:void(0)',
                    i18n: 'report',
                },
                {
                    label: t('report.customer-birthday-report'),
                    active: true,
                    i18n: 'birthday-report',
                },
            ]}
            toolbar={
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 w-100">
                    <h4 className="card-title mb-0">
                        {t('report.customer-birthday-report')}
                    </h4>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <label
                            htmlFor="birthday-month"
                            className="mb-0"
                        >
                            {t('common.month')}
                        </label>
                        <div style={{ width: '150px' }}>
                            <SelectInput
                                id="birthday-month"
                                value={month}
                                onChange={handleChange}
                                placeholder={t('common.select_month')}
                                options={[
                                    { value: '1', label: t('months.january') },
                                    { value: '2', label: t('months.february') },
                                    { value: '3', label: t('months.march') },
                                    { value: '4', label: t('months.april') },
                                    { value: '5', label: t('months.may') },
                                    { value: '6', label: t('months.june') },
                                    { value: '7', label: t('months.july') },
                                    { value: '8', label: t('months.august') },
                                    { value: '9', label: t('months.september') },
                                    { value: '10', label: t('months.october') },
                                    { value: '11', label: t('months.november') },
                                    { value: '12', label: t('months.december') },
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
                        <th>{t('customer.religion')}</th>
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
                                <td>
                                    {customer.religion === '1'
                                        ? 'Buddha'
                                        : customer.religion === '2'
                                          ? 'Kristen'
                                          : customer.religion === '3'
                                            ? 'Islam'
                                            : customer.religion === '4'
                                              ? 'Hindu'
                                              : customer.religion}
                                </td>
                                <td>{customer.address}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={5}
                                className="text-center text-muted py-4"
                            >
                                No customer found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </TablePage>
    );
}
