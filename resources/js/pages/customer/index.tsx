import Pagination from '@/components/pagination';
import TablePage from '@/layouts/TablePage';
import { customerSchema } from '@/schemas/models';
import { Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { InputGroup, Table } from 'react-bootstrap';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleDelete = (customerId: string | undefined) => {
        if (
            customerId &&
            confirm(t('customer.confirm_delete'))
        ) {
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
            { preserveState: true, replace: true },
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
            headTitle={t('customer.title')}
            title={t('customer.list_title')}
            i18nTitle="customer"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: t('customer.title'), active: true, i18n: 'customer' },
            ]}
            toolbar={
                <div className="d-flex flex-wrap gap-2 align-items-center w-100">
                    <Link
                        href="/master/customer/create"
                        className="btn btn-primary"
                    >
                        <i className="fa fa-user me-2"></i>
                        <span>{t('customer.new_customer')}</span>
                    </Link>
                    <div className="ms-auto d-flex gap-2">
                        <InputGroup>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('customer.search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={handleSearch}
                            >
                                <i className="fa fa-search"></i>
                            </button>
                        </InputGroup>
                    </div>
                </div>
            }
        >
            <div className="table-responsive">
                <Table
                    hover
                    striped
                    bordered
                    responsive
                    className="vertical-middle"
                >
                    <thead>
                        <tr>
                            <th>{t('common.name')}</th>
                            <th
                                style={{ width: '150px' }}
                            >
                                {t('customer.identity_number')}
                            </th>
                            <th
                                style={{ width: '150px' }}
                            >
                                {t('customer.birth_date')}
                            </th>
                            <th
                                style={{ width: '150px' }}
                            >
                                {t('customer.birth_place')}
                            </th>
                            <th style={{ width: '100px' }}>
                                {t('common.status')}
                            </th>
                            <th style={{ width: '100px' }}>
                                {t('customer.religion')}
                            </th>
                            <th
                                style={{ width: '150px' }}
                            >
                                {t('common.mobile_number')}
                            </th>
                            <th style={{ width: '50px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.data.length > 0 ? (
                            customers.data.map((customer) => (
                                <tr
                                    key={customer.id}
                                    onClick={() => handleRowClick(customer.id)}
                                    className="cursor-pointer"
                                >
                                    <td>{customer.name}</td>
                                    <td>{customer.identity}</td>
                                    <td>
                                        {customer.birth_date
                                            ? new Date(
                                                  customer.birth_date,
                                              ).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td>{customer.birth_place}</td>
                                    <td>
                                        {customer.marital === 1
                                            ? t('common.single')
                                            : customer.marital === 2
                                              ? t('common.married')
                                              : customer.marital === 3
                                                ? t('common.widowed')
                                                : customer.marital === 4
                                                  ? t('common.divorced')
                                                  : customer.marital}
                                    </td>
                                    <td>
                                        {customer.religion === 1
                                            ? t('religion.buddhist')
                                            : customer.religion === 2
                                              ? t('religion.christian')
                                              : customer.religion === 3
                                                ? t('religion.islam')
                                                : customer.religion === 4
                                                  ? t('religion.hindu')
                                                  : customer.religion}
                                    </td>
                                    <td
                                        onClick={() =>
                                            handleRowClick(customer.id)
                                        }
                                    >
                                        {customer.mobile}
                                    </td>
                                    <td className="text-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(customer.id);
                                            }}
                                            className="btn btn-sm btn-danger"
                                            title={t('common.delete')}
                                        >
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="text-center text-muted py-4"
                                >
                                    {t('customer.no_customers_found')}
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
