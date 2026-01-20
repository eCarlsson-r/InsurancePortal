import Pagination from '@/components/pagination';
import UploadOcrModal from '@/components/upload-ocr-modal';
import TablePage from '@/layouts/TablePage';
import {router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { InputGroup, Table } from 'react-bootstrap';

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
    const [searchQuery, setSearchQuery] = useState(filters.q || '');
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleUpload = (caseCode: string) => {
        console.log('Upload for case:', caseCode);
    };

    const handleDelete = (caseCode: string) => {
        if (confirm('Are you sure you want to delete this policy?')) {
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
            headTitle="SP / Polis"
            title="Daftar SP / Polis"
            i18nTitle="case"
            breadcrumbs={[
                { label: 'Penjualan', i18n: 'sales' },
                { label: 'SP / Polis', active: true, i18n: 'case' },
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
                        <span data-i18n="new-case">SP / Polis Baru</span>
                    </button>
                    <div className="ms-auto d-flex gap-2">
                        <InputGroup>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cari Nasabah / No. Polis / No. SP"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button className="btn btn-primary" type="button" onClick={handleSearch}>
                                <i className="fa fa-search"></i>
                            </button>
                        </InputGroup>
                    </div>
                </div>
            }
            pagination={<Pagination links={policies.links} />}
        >
            <Table hover striped bordered>
                <thead>
                    <tr>
                        <th className="col-1"></th>
                        <th className="col-1">No. SP</th>
                        <th className="col-1">No. Polis</th>
                        <th className="col-2">Nama Pemegang Polis</th>
                        <th className="col-2">Nama Tertanggung</th>
                        <th className="col-2">Produk</th>
                        <th className="col-1">Agent</th>
                        <th className="col-1">Premi Dasar</th>
                        <th className="col-1">Premi Topup</th>
                        <th className="col-1">UP Dasar</th>
                    </tr>
                </thead>
                <tbody>
                    {policies.data.length > 0 ? (
                        policies.data.map((policy) => (
                            <tr
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
                                        title="Upload"
                                    >
                                        <i className="la la-upload"></i>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(policy.id);
                                        }}
                                        className="btn btn-sm btn-danger"
                                        title="Delete"
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
                                <td>{formatCurrency(policy.topup_premium || 0)}</td>
                                <td>{formatCurrency(policy.base_insure)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={10} className="text-center text-muted py-4">
                                No policies found.{' '}
                                {searchQuery && `Try adjusting your search query.`}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <UploadOcrModal
                show={isModalOpen}
                onHide={() => setIsModalOpen(false)}
            />
        </TablePage>
    );
}
