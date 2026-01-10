import TemplateLayout from "@/layouts/TemplateLayout";
import { Head, Link, router } from "@inertiajs/react";
import { FormEvent, useState } from "react";
import { Table } from "react-bootstrap";
import UploadOcrModal from "@/components/upload-ocr-modal";

interface PolicyData {
    "case-code": string;
    "policy-no": string;
    "customer-name": string;
    "insured-name": string;
    "case-product": string;
    "case-agent": string;
    "case-premium": number;
    "topup-premium": number;
    "case-base-insure": number;
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
                                <form onSubmit={handleSearch} id="case-toolbar" className="row card-title toolbar form-inline input-group mb-4">
                                    <h4 className="col-md-2 col-6" data-i18n="case-list">Daftar SP / Polis</h4>
                                    <button 
                                        type="button" 
                                        onClick={handleCreateNew}
                                        id="createCase" 
                                        className="col-md-2 col-6 btn btn-primary"
                                    >
                                        <i className="fa fa-file"></i> <span data-i18n="new-case">SP / Polis Baru</span>
                                    </button>
                                    <p className="col-sm-1">&#8194;</p>
                                    <label className="input-group-text">Nasabah / No. Polis / No. SP : </label>
                                    <input 
                                        type="text" 
                                        name="q" 
                                        id="case-query" 
                                        className="col-sm-10 col-md-5 form-control" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button id="case-search" type="submit" className="btn btn-primary">
                                        <i className="fa fa-search"></i>
                                    </button>
                                </form>

                                <div className="table-responsive">
                                    <Table hover striped bordered>
                                        <thead>
                                            <tr>
                                                <th className="col-1">Actions</th>
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
                                                    <tr key={policy["case-code"]}>
                                                        <td>
                                                            <button 
                                                                onClick={() => handleUpload(policy["case-code"])}
                                                                className="btn btn-sm btn-primary me-1"
                                                                title="Upload"
                                                            >
                                                                <i className="la la-upload"></i>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(policy["case-code"])}
                                                                className="btn btn-sm btn-danger"
                                                                title="Delete"
                                                            >
                                                                <i className="la la-ban"></i>
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <Link href={`/sales/policy/${policy["case-code"]}/edit`}>
                                                                {policy["case-code"]}
                                                            </Link>
                                                        </td>
                                                        <td>{policy["policy-no"]}</td>
                                                        <td>{policy["customer-name"]}</td>
                                                        <td>{policy["insured-name"]}</td>
                                                        <td>{policy["case-product"]}</td>
                                                        <td>{policy["case-agent"]}</td>
                                                        <td>{formatCurrency(policy["case-premium"])}</td>
                                                        <td>{formatCurrency(policy["topup-premium"])}</td>
                                                        <td>{formatCurrency(policy["case-base-insure"])}</td>
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