import Pagination from '@/components/pagination';
import UploadModal from '@/components/upload-modal';
import UploadOcrModal from '@/components/upload-ocr-modal';
import TablePage from '@/layouts/TablePage';
import { router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { InputGroup, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface PolicyData {
    id: string;
    case_code: string;
    policy_no: string;
    holder: { name: string };
    insured: { name: string };
    product: { name: string };
    agent: { name: string };
    premium: number;
    topup_premium: number;
    base_insure: number;
    files?: { id: string; name: string }[];
}

interface PolicyProps {
    policies: {
        data: PolicyData[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    filters: {
        q: string | null;
    };
}

export default function Policy({ policies, filters }: PolicyProps) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState(filters.q || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documentId, setDocumentId] = useState('');
    const [fileModalOpen, setFileModalOpen] = useState(false);

    const handleSearch = useCallback(() => {
        router.get(
            '/sales/policy',
            { q: searchQuery },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, [searchQuery]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery !== (filters.q || '')) {
                handleSearch();
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, filters.q, handleSearch]);

    const handleCreateNew = () => {
        setIsModalOpen(true);
    };

    const handleUpload = (policyId: string) => {
        setFileModalOpen(true);
        setDocumentId(policyId);
    };

    const handleDelete = (caseCode: string) => {
        if (confirm(t('policy.confirmDelete'))) {
            router.delete(`/sales/policy/${caseCode}`);
        }
    };

    const handleRowClick = (policyId: string) => {
        router.get(`/sales/policy/${policyId}/edit`);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <TablePage
            headTitle={t('policy.title')}
            title={t('policy.list_title')}
            i18nTitle="policy"
            breadcrumbs={[
                { label: t('common.sales'), i18n: 'sales' },
                { label: t('policy.title'), active: true, i18n: 'policy' },
            ]}
            toolbar={
                <div className="d-flex flex-wrap gap-2 align-items-center w-100">
                    <button
                        type="button"
                        onClick={handleCreateNew}
                        id="createCase"
                        className="btn btn-primary"
                    >
                        <i className="fa fa-file me-2"></i>
                        <span>{t('policy.new_policy')}</span>
                    </button>
                    <div className="ms-auto d-flex gap-2">
                        <InputGroup>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t('policy.search_placeholder')}
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
            pagination={<Pagination links={policies.links} />}
        >
            <Table hover striped bordered responsive>
                <thead>
                    <tr>
                        <th className="col-1"></th>
                        <th className="col-1">{t('policy.sp_number')}</th>
                        <th className="col-1">{t('policy.policy_number')}</th>
                        <th className="col-2">{t('policy.policyholder')}</th>
                        <th className="col-2">{t('policy.insured_name')}</th>
                        <th className="col-2">{t('common.product')}</th>
                        <th className="col-1">{t('common.agent')}</th>
                        <th className="col-1">{t('policy.base_premium')}</th>
                        <th className="col-1">{t('policy.topup_premium')}</th>
                        <th className="col-1">{t('policy.base_sum_insured')}</th>
                    </tr>
                </thead>
                <tbody>
                    {policies.data.length > 0 ? (
                        policies.data.map((policy) => (
                            <tr
                                className={
                                    policy.files && policy.files.length > 0
                                        ? 'fw-bold'
                                        : ''
                                }
                                key={policy.id}
                                onClick={() => handleRowClick(policy.id)}
                            >
                                <td>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpload(policy.id);
                                        }}
                                        className="btn btn-sm btn-primary me-1"
                                        title={t('common.upload')}
                                    >
                                        <i className="la la-upload"></i>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(policy.id);
                                        }}
                                        className="btn btn-sm btn-danger"
                                        title={t('common.delete')}
                                    >
                                        <i className="la la-ban"></i>
                                    </button>
                                </td>
                                <td>{policy.case_code}</td>
                                <td>{policy.policy_no}</td>
                                <td>{policy.holder.name}</td>
                                <td>{policy.insured.name}</td>
                                <td>{policy.product.name}</td>
                                <td>{policy.agent.name}</td>
                                <td>{formatCurrency(policy.premium)}</td>
                                <td>
                                    {formatCurrency(policy.topup_premium || 0)}
                                </td>
                                <td>{formatCurrency(policy.base_insure)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={10}
                                className="text-center text-muted py-4"
                            >
                                {t('policy.noPoliciesFound')}{' '}
                                {searchQuery &&
                                    t('common.tryAdjustingSearch')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <UploadOcrModal
                show={isModalOpen}
                onHide={() => setIsModalOpen(false)}
            />

            <UploadModal
                show={fileModalOpen}
                onHide={() => setFileModalOpen(false)}
                documentId={documentId}
                documentPurpose="case"
            />
        </TablePage>
    );
}
