import TemplateLayout from '@/layouts/TemplateLayout';
import { agentSchema, customerSchema, productSchema, receiptSchema } from '@/schemas/models';
import { Head, router, useForm } from '@inertiajs/react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface ReceiptProps {
    receipts: z.infer<typeof receiptSchema>[];
    products: z.infer<typeof productSchema>[];
    customers: z.infer<typeof customerSchema>[];
    agents: z.infer<typeof agentSchema>[];
}

export default function Receipt({ receipts = [], products = [], customers = [], agents = [] }: ReceiptProps) {
    // Initial form state with safe defaults
    const { data, setData, post, put } = useForm<z.infer<typeof receiptSchema>>(
        {
            policy_code: '',
            agent_id: null,
            premium: 0,
            currency_rate: 1,
            pay_method: 1,
            pay_date: '',
            paid_date: '',
            paid_amount: 0,
            description: ''
        }
    );
    const isEdit = !!data.id;

    const handleDelete = (receiptCode: string) => {
        if (confirm('Are you sure you want to delete this receipt?')) {
            router.delete(`/master/receipt/${receiptCode}`);
        }
    };

    const handleSubmit = () => {
        if (isEdit) {
            put(`/master/receipt/${data.id}`);
        } else {
            post('/master/receipt');
        }
    };

    return (
        <TemplateLayout>
            <Head title="Receipt" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="receipt">Kwitansi</h3>
                    </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="sales">Penjualan</a></li>
                            <li className="breadcrumb-item active" data-i18n="receipt">Kwitansi</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div id="receipt-toolbar" className="toolbar card-title">
                                    <h4 data-i18n="receipt-list">Daftar Kwitansi</h4>
                                    <h6 className="input-group">
                                        <label className="input-group-text">No. Polis : </label>
                                        <input type="text" id="nopolis" className="form-control"/>
                                        <button id="receipt-search" type="button" className="btn btn-primary">
                                            <i className="fa fa-search"></i>
                                        </button>
                                    </h6>

                                </div>
                                <div className="table-responsive">
                                    <Table hover striped bordered>
                                        <thead>
                                        <tr>
                                            <th className="col-1" data-field="receipt-policy">No. Polis</th>
                                            <th className="col-3" data-field="receipt-holder">Pemegang Polis</th>
                                            <th className="col-3" data-field="receipt-product">Jenis Asuransi</th>
                                            <th className="col-1" data-field="receipt-pay-date">Jatuh Tempo</th>
                                            <th className="col-1" data-field="receipt-paid-date">Tgl. Bayar</th>
                                            <th className="col-1" data-field="receipt-premium" data-formatter="receiptIDRFormatter">Premi</th>
                                            <th className="col-1" data-field="receipt-paid-amount" data-formatter="receiptIDRFormatter">Jumlah Bayar</th>
                                            <th className="col-1" data-formatter="receiptActionFormatter" data-events="receiptActionHandler"></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {receipts.map((rcpt) => (
                                            <tr key={rcpt.id} onClick={() => setData(rcpt)}>
                                                <td>{rcpt.policy_code}</td>
                                                <td>{rcpt.policy?.customer?.name}</td>
                                                <td>{rcpt.policy?.product?.name}</td>
                                                <td>{rcpt.pay_date}</td>
                                                <td>{rcpt.paid_date}</td>
                                                <td>{rcpt.premium.toLocaleString()}</td>
                                                <td>{rcpt.paid_amount.toLocaleString()}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(rcpt.policy_code)}
                                                        data-i18n="delete"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <form id="receipt-form">
                                    <div className="row card-title">
                                        <div className="col-9">
                                            <h4 data-i18n="edit-receipt">Buat Kwitansi</h4>
                                            <h6 data-i18n="edit-receipt-inst">Masukkan informasi pembayaran yang diterima Agen.</h6>
                                        </div>
                                        <div className="col-3">
                                            <button className="btn btn-primary pull-right" onClick={handleSubmit} data-i18n="submit-btn">Perbarui</button>
                                        </div>
                                    </div>
                                    <div className="basic-form">
                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="policy-no">No. Polis</label>
                                            <div className="col-sm-9">
                                                <input type="text" value={data.policy_code} className="form-control"/>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="product">Kwitansi</label>
                                            <div className="col-sm-9">
                                                <select value={data.policy?.product_id} className="form-control productSelector">
                                                    {products.map((product) => (
                                                        <option key={product.id} value={product.id}>{product.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="payment-method">Cara Bayar</label>
                                            <div className="col-sm-9">
                                                <select value={data.pay_method} onChange={e=>setData('pay_method', parseInt(e.target.value))} className="form-control">
                                                    <option value="1" data-i18n="tahunan">Tahunan</option>
                                                    <option value="2" data-i18n="semester">Enam Bulanan</option>
                                                    <option value="4" data-i18n="triwulan">Tiga Bulanan</option>
                                                    <option value="12" data-i18n="bulanan">Bulanan</option>
                                                    <option value="0" data-i18n="sekaligus">Sekaligus</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="customer">Nasabah</label>
                                            <div className="col-sm-9">
                                                <select value={data.policy?.holder_id} className="form-control">
                                                    {
                                                        customers.map((customer) => (
                                                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="agent">Agent</label>
                                            <div className="col-sm-9">
                                                <select value={data.policy?.agent_id} className="form-control" data-live-search="true">
                                                    {
                                                        agents.map((agent) => (
                                                            <option key={agent.id} value={agent.id}>{agent.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="payable-date">Jatuh Tempo</label>
                                            <div className="col-sm-9">
                                                <input type="date" value={data.pay_date} onChange={(e) => setData('pay_date', e.target.value)} className="form-control"/>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="premium">Jatuh Tempo</label>
                                            <div className="col-sm-9 input-group">
                                                <input type="number" value={data.premium} onChange={(e) => setData('premium', Number(e.target.value))} className="col-7 form-control"/>
                                                <div className="input-group-addon">
                                                    <label className="input-group-text">x</label>
                                                </div>
                                                <input type="number" id="receipt-curr-rate" className="col-4 form-control" value={data.currency_rate} onChange={(e) => setData('currency_rate', Number(e.target.value))}/>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="pay-amount">Jumlah Bayar</label>
                                            <div className="col-sm-9">
                                                <input type="number" value={data.paid_amount} onChange={(e) => setData('paid_amount', Number(e.target.value))} className="form-control"/>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="pay-date">Tanggal Bayar</label>
                                            <div className="col-sm-9">
                                                <input type="date" value={data.paid_date} onChange={(e) => setData('paid_date', e.target.value)} className="form-control"/>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="description">Description</label>
                                            <div className="col-sm-9">
                                                <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} className="form-control"></textarea>
                                            </div>
                                        </div>
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
