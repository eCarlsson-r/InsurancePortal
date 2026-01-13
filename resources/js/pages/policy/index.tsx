import TemplateLayout from "@/layouts/TemplateLayout";
import { Head, Link, router } from "@inertiajs/react";
import { FormEvent, useState } from "react";
import { Form, Table, InputGroup } from "react-bootstrap";
import UploadOcrModal from "@/components/upload-ocr-modal";

interface PolicyData {
    "id": string;
    "policy_no": string;
    "customer": {"name": string};
    "insured": {"name": string};
    "product": {"name": string};
    "agent": {"name": string};
    "premium": number;
    "topup_premium": number;
    "base_insure": number;
}

interface PolicyProps {
    policies: PolicyData[];
    query?: string;
}

export default function Policy({ policies = [], query = "" }: PolicyProps) {
    const [searchQuery, setSearchQuery] = useState(query);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get('/sales/policy', { q: searchQuery }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

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

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <TemplateLayout>
            <Head title="SP / Polis" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="case">SP / Polis</h3>
                    </div>
                    <div className="col-6 p-md-0 justify-content-end mt-2 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item" data-i18n="sales">Penjualan</li>
                            <li className="breadcrumb-item active" data-i18n="case">SP / Polis</li>
                        </ol>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <Form onSubmit={handleSearch}>
                                    <InputGroup className="row card-title toolbar form-inline mb-4">
                                        <h4 className="col-md-2 col-6" data-i18n="case-list">Daftar SP / Polis</h4>
                                        <button
                                            type="button"
                                            onClick={handleCreateNew}
                                            id="createCase"
                                            className="col-md-2 col-6 btn btn-primary"
                                        >
                                            <i className="fa fa-file"></i> <span data-i18n="new-case">SP / Polis Baru</span>
                                        </button>
                                        <p className="col-md-1 hidden-sm-down">&#8194;</p>
                                        <InputGroup.Text className="col-3">Nasabah / No. Polis / No. SP : </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            name="q"
                                            id="case-query"
                                            className="col-8 col-md-5"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button id="case-search" type="submit" className="btn btn-primary col-1">
                                            <i className="fa fa-search"></i>
                                        </button>
                                    </InputGroup>
                                </Form>

                                <div className="table-responsive">
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
                                            {policies.length > 0 ? (
                                                policies.map((policy) => (
                                                    <tr key={policy["id"]}>
                                                        <td>
                                                            <button
                                                                onClick={() => handleUpload(policy["id"])}
                                                                className="btn btn-sm btn-primary me-1"
                                                                title="Upload"
                                                            >
                                                                <i className="la la-upload"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(policy["id"])}
                                                                className="btn btn-sm btn-danger"
                                                                title="Delete"
                                                            >
                                                                <i className="la la-ban"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <Link href={`/sales/policy/${policy["id"]}/edit`}>
                                                                {policy["id"]}
                                                            </Link>
                                                        </td>
                                                        <td>{policy.policy_no}</td>
                                                        <td>{policy.customer.name}</td>
                                                        <td>{policy.insured.name}</td>
                                                        <td>{policy.product.name}</td>
                                                        <td>{policy.agent.name}</td>
                                                        <td>{formatCurrency(policy.premium)}</td>
                                                        <td>{formatCurrency(policy.topup_premium)}</td>
                                                        <td>{formatCurrency(policy.base_insure)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={10} className="text-center text-muted py-4">
                                                        No policies found. {searchQuery && `Try adjusting your search query.`}
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

            <UploadOcrModal show={isModalOpen} onHide={() => setIsModalOpen(false)} />
        </TemplateLayout>
    );
}
