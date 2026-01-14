import TemplateLayout from "@/layouts/TemplateLayout";
import { Table } from "react-bootstrap";
import { Head, router, useForm } from "@inertiajs/react";
import { productCommissionSchema, productSchema } from "@/schemas/models";
import { z } from "zod";
import { useState } from "react";

interface ProductProps {
    products: z.infer<typeof productSchema>[];
}

export default function Product({ products = [] }: ProductProps) {
    const [product, setProduct] = useState<z.infer<typeof productSchema> | null>(null);

    const isEdit = !!product;

    // Initial form state with safe defaults
    const { data, setData, post, put } = useForm<z.infer<typeof productSchema>>(isEdit && product ? product : {
        name: '',
        type: '',
        commissions: [],
        credits: []
    });

    const handleDelete = (productCode: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(`/master/product/${productCode}`);
        }
    };

    const handleSubmit = () => {
        if (isEdit) {
            put(`/master/product/${product.id}`);
        } else {
            post("/master/product");
        }
    };

    return (
        <TemplateLayout>
            <Head title="Product" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="product">Produk</h3>
                    </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="master">Master</a></li>
                            <li className="breadcrumb-item active" data-i18n="product">Produk</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div id="product-toolbar" className="toolbar card-title">
                                    <h4 data-i18n="product-list">Daftar Produk</h4>
                                </div>
                                <div className="table-responsive">
                                    <Table hover striped bordered>
                                        <thead>
                                        <tr>
                                            <th className="col-xs-3" data-field="product-name">Nama Produk</th>
                                            <th className="col-xs-2" data-field="product-type" data-formatter="productTypeFormatter">Jenis Produk</th>
                                            <th className="col-xs-1" data-formatter="productActionFormatter" data-events="productActionHandler"></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                products.length > 0 ? (
                                                    products.map((product) => (
                                                        <tr key={product.id} onClick={() => setProduct(product)}>
                                                            <td>{product.name}</td>
                                                            <td>
                                                                {(() => {
                                                                    switch (product.type) {
                                                                        case "1":
                                                                            return 'Term';
                                                                        case "2":
                                                                            return 'Whole Life';
                                                                        case "3":
                                                                            return 'Endowment';
                                                                        case "4":
                                                                            return 'Unit Link';
                                                                        case "5":
                                                                            return 'Rider';
                                                                        default:
                                                                            return 'Unknown';
                                                                    }
                                                                })()}
                                                            </td>
                                                            <td>
                                                                <button
                                                                    onClick={() => handleDelete(product.id?.toString() || '')}
                                                                    className="btn btn-sm btn-danger"
                                                                    title="Delete"
                                                                >
                                                                    <i className="la la-ban"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={4} className="text-center text-muted py-4">
                                                            No products found.
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <form id="product-form">
                                    <div className="row card-title">
                                        <div className="col-md-9 col-sm-10 col-8">
                                            <h4 data-i18n="edit-product">Sunting Komisi</h4>
                                            <h6 data-i18n="edit-product-inst">Masukkan informasi komisi yang diterima Agen.</h6>
                                        </div>
                                        <div className="col-md-3 col-sm-2 col-4">
                                            <button className="btn btn-primary pull-right" onClick={handleSubmit} data-i18n="submit-btn">Perbarui</button>
                                        </div>
                                    </div>
                                    <div className="basic-form">
                                        <div className="row form-group">
                                            <label className="col-sm-3">Nama Produk</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" value={data.name || ''} onChange={e => setData('name', e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className="row form-group">
                                            <label className="col-sm-3" htmlFor="product-type" data-i18n="product-type">Jenis Produk</label>
                                            <div className="col-sm-9">
                                                <select className="form-control selectpicker" value={data.type} onChange={e => setData('type', e.target.value)}>
                                                    <option value="1" data-i18n="term">Term</option>
                                                    <option value="2" data-i18n="whole-life">Whole Life</option>
                                                    <option value="3" data-i18n="endowment">Endowment</option>
                                                    <option value="4" data-i18n="unit-link">Unit Link</option>
                                                    <option value="5" data-i18n="rider">Rider</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row form-group">
                                            <label className="col-sm-3" htmlFor="producion-credit" data-i18n="production-credit">Rate Produksi</label>
                                            <div className="col-sm-9">
                                                <input type="number" id="production-credit" min="0" max="100" value={(data.credits)?data.credits[0].production_credit:100} className="form-control"/>
                                            </div>
                                        </div>
                                        <div className="row form-group">
                                            <label className="col-sm-3" htmlFor="contest-credit" data-i18n="contest-credit">Rate Kontes</label>
                                            <div className="col-sm-9">
                                                <input type="number" id="contest-credit" min="0" max="100" value={(data.credits)?data.credits[0].contest_credit:100} className="form-control"/>
                                            </div>
                                        </div>


                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="product-commision">Komisi Produk</label>
                                            <div className="col-sm-9">
                                                <button id="new-commision" className="btn btn-primary d-inline float-right" type="button">
                                                    <i className="fa fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <table id="table-prodcomm" data-toggle="table">
                                            <thead><tr>
                                                <th>Cara Bayar</th>
                                                <th>Cara Bayar</th>
                                                <th>Tahun</th>
                                                <th>Tahun</th>
                                                <th>Komisi (%)</th>
                                            </tr></thead>
                                            <tbody>
                                                {
                                                    data.commissions && data.commissions.length > 0 ? (
                                                        data.commissions.map((commission: z.infer<typeof productCommissionSchema>, index: number) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    {(() => {
                                                                        switch (commission.payment_method) {
                                                                            case 1:
                                                                                return 'Tahunan';
                                                                            case 2:
                                                                                return 'Semester';
                                                                            case 3:
                                                                                return 'Triwulan';
                                                                            case 4:
                                                                                return 'Bulanan';
                                                                            case 5:
                                                                                return 'Sekaligus';
                                                                            default:
                                                                                return 'Unknown';
                                                                        }
                                                                    })()}
                                                                </td>
                                                                <td>
                                                                    {(() => {
                                                                        switch (commission.currency) {
                                                                            case 1:
                                                                                return 'Rupiah';
                                                                            case 2:
                                                                                return 'Dollar';
                                                                            default:
                                                                                return 'Unknown';
                                                                        }
                                                                    })()}
                                                                </td>
                                                                <td>{commission.year}</td>
                                                                <td>{commission.payment_period}</td>
                                                                <td>{commission.commission_rate}</td>
                                                                <td>{commission.extra_commission}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={5} className="text-center text-muted py-4">
                                                                No commissions found.
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TemplateLayout>
    );
}
