import Pagination from '@/components/pagination';
import TablePage from '@/layouts/TablePage';
import { router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Badge, InputGroup, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface ClaimData {
    id: string;
    claim_number: string;
    policy: {
        policy_no: string;
        case_code: string;
        holder: { name: string };
        insured: { name: string };
    };
    claim_type: string;
    claim_date: string;
    claim_amount: number;
    approved_amount?: number;
    status: 'pending' | 'approved' | 'rejected' | 'paid';
    user: { name: string };
}

interface ClaimProps {
    claims: {
        data: ClaimData[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    filters: {
        q: string | null;
        status: string | null;
        claim_type: string | null;
    };
}

export default function ClaimIndex({ claims, filters }: ClaimProps) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState(filters.q || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [claimTypeFilter, setClaimTypeFilter] = useState(filters.claim_type || '');

    const handleSearch = useCallback(() => {
        router.get(
            '/sales/claim',
            {
                q: searchQuery || undefined,
                status: statusFilter || undefined,
                claim_type: claimTypeFilter || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [searchQuery, statusFilter, claimTypeFilter]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (
                searchQuery !== (filters.q || '') ||
                statusFilter !== (filters.status || '') ||
                claimTypeFilter !== (filters.claim_type || '')
            ) {
                handleSearch();
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, statusFilter, claimTypeFilter, filters, handleSearch]);

    const handleRowClick = (claimId: string) => {
        router.get(`/sales/claim/${claimId}`);
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { bg: 'warning', icon: 'la-clock', text: t('claim.pending') },
            approved: { bg: 'info', icon: 'la-check-circle', text: t('claim.approved') },
            rejected: { bg: 'danger', icon: 'la-times-circle', text: t('claim.rejected') },
            paid: { bg: 'success', icon: 'la-money-bill', text: t('claim.paid') },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

        return (
            <Badge bg={config.bg} className="d-flex align-items-center gap-1">
                <i className={`la ${config.icon}`}></i>
                {config.text}
            </Badge>
        );
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <TablePage
            headTitle={t('claim.title')}
            title={t('claim.list_title')}
            i18nTitle="claim"
            breadcrumbs={[
                { label: t('common.sales'), i18n: 'sales' },
                { label: t('claim.title'), active: true, i18n: 'claim' },
            ]}
            toolbar={
                <div className="d-flex flex-wrap gap-2 align-items-center w-100">
                    <div className="d-flex gap-2 flex-wrap flex-grow-1">
                        <select
                            className="form-select"
                            style={{ width: 'auto', minWidth: '150px' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">{t('claim.all_status')}</option>
                            <option value="pending">{t('claim.pending')}</option>
                            <option value="approved">{t('claim.approved')}</option>
                            <option value="rejected">{t('claim.rejected')}</option>
                            <option value="paid">{t('claim.paid')}</option>
                        </select>

                        <select
                            className="form-select"
                            style={{ width: 'auto', minWidth: '150px' }}
                            value={claimTypeFilter}
                            onChange={(e) => setClaimTypeFilter(e.target.value)}
                        >
                            <option value="">{t('claim.all_types')}</option>
                            <option value="death">{t('claim.death')}</option>
                            <option value="maturity">{t('claim.maturity')}</option>
                            <option value="surrender">{t('claim.surrender')}</option>
                            <option value="disability">{t('claim.disability')}</option>
                            <option value="critical_illness">{t('claim.critical_illness')}</option>
                            <option value="hospitalization">{t('claim.hospitalization')}</option>
                        </select>
                    </div>

                    <div className="ms-auto">
                        <InputGroup>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('claim.search_placeholder')}
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
            pagination={<Pagination links={claims.links} />}
        >
            <Table hover striped bordered responsive className="vertical-middle">
                <thead>
                    <tr>
                        <th style={{ width: '120px' }}>{t('claim.claim_number')}</th>
                        <th style={{ width: '120px' }}>{t('policy.policy_number')}</th>
                        <th>{t('policy.policyholder')}</th>
                        <th>{t('policy.insured')}</th>
                        <th style={{ width: '120px' }}>{t('claim.claim_type')}</th>
                        <th style={{ width: '100px' }}>{t('claim.claim_date')}</th>
                        <th style={{ width: '130px' }} className="text-end">
                            {t('claim.claim_amount')}
                        </th>
                        <th style={{ width: '130px' }} className="text-end">
                            {t('claim.approved_amount')}
                        </th>
                        <th style={{ width: '100px' }} className="text-center">
                            {t('common.status')}
                        </th>
                        <th style={{ width: '120px' }}>{t('claim.processed_by')}</th>
                    </tr>
                </thead>
                <tbody>
                    {claims.data.length > 0 ? (
                        claims.data.map((claim) => (
                            <tr
                                key={claim.id}
                                onClick={() => handleRowClick(claim.id)}
                                className="cursor-pointer"
                            >
                                <td>
                                    <strong>{claim.claim_number}</strong>
                                </td>
                                <td>{claim.policy.policy_no}</td>
                                <td>{claim.policy.holder.name}</td>
                                <td>{claim.policy.insured.name}</td>
                                <td>
                                    <span className="text-capitalize">
                                        {claim.claim_type.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td>{formatDate(claim.claim_date)}</td>
                                <td className="text-end">
                                    {formatCurrency(claim.claim_amount)}
                                </td>
                                <td className="text-end">
                                    {claim.approved_amount
                                        ? formatCurrency(claim.approved_amount)
                                        : '-'}
                                </td>
                                <td className="text-center">
                                    {getStatusBadge(claim.status)}
                                </td>
                                <td>{claim.user.name}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={10}
                                className="text-center text-muted py-4"
                            >
                                {t('claim.no_claims_found')}{' '}
                                {(searchQuery || statusFilter || claimTypeFilter) &&
                                    t('claim.try_adjusting_filters')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </TablePage>
    );
}

// Made with Bob
