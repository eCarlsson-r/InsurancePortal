import TemplateLayout from '@/layouts/TemplateLayout';
import { fundSchema } from '@/schemas/models';
import { Head, router, useForm } from '@inertiajs/react';
import { Table } from 'react-bootstrap';
import { z } from 'zod';

interface FundProps {
    funds: z.infer<typeof fundSchema>[];
}

export default function Fund({ funds = [] }: FundProps) {
    // Initial form state with safe defaults
    const { data, setData, post, put } = useForm<z.infer<typeof fundSchema>>(
        {
            id: undefined,
            name: '',
            currency: '',
        }
    );

    const isEdit = !!data.id;

    const handleDelete = (fundCode: string) => {
        if (confirm('Are you sure you want to delete this fund?')) {
            router.delete(`/master/fund/${fundCode}`);
        }
    };

    const handleSubmit = () => {
        if (isEdit) {
            put(`/master/fund/${data.id}`);
        } else {
            post('/master/fund');
        }
    };

    return (
        <TemplateLayout>
            <Head title="Fund" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline">Jenis Dana</h3>
                    </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="master">Master</a></li>
                            <li className="breadcrumb-item active">Jenis Dana</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div id="fund-toolbar" className="toolbar card-title">
                                    <h4 data-i18n="fund-list">Daftar Jenis Dana</h4>
                                </div>
                                <div className="table-responsive">
                                    <Table hover striped bordered>
                                        <thead>
                                        <tr>
                                            <th>Nama Investasi</th>
                                            <th>Mata Uang</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {funds.length > 0 ? (funds.map((fund) => (
                                            <tr key={fund.id} onClick={() => setData(fund)}>
                                                <td>{fund.name}</td>
                                                <td>{fund.currency === '1' ? 'Rupiah' : 'Dollar'}</td>
                                                <td>
                                                    <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); handleDelete(fund.id!.toString()); }} data-i18n="delete-btn">Hapus</button>
                                                </td>
                                            </tr>
                                        ))) : (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="text-center text-muted py-4"
                                                >
                                                    No fund types found.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <form id="fund-form">
                                    <div className="row card-title">
                                        <div className="col-md-9 col-sm-10 col-8">
                                            <h4 data-i18n="edit-fund">Sunting Jenis Dana</h4>
                                            <h6 data-i18n="edit-fund-inst">Masukkan informasi jenis dana investasi.</h6>
                                        </div>
                                        <div className="col-md-3 col-sm-2 col-4">
                                            <button className="btn btn-primary pull-right" onClick={handleSubmit} data-i18n="submit-btn">Perbarui</button>
                                        </div>
                                    </div>
                                    <div className="basic-form">
                                        <div className="row form-group">
                                            <label className="col-sm-4" data-i18n="fund-name">Nama Jenis Dana</label>
                                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="col-sm-8 form-control"/>
                                        </div>
                                        <div className="row form-group">
                                            <label className="col-sm-4" data-i18n="fund-currency">Mata Uang</label>
                                            <select id="fund-currency" value={data.currency} onChange={(e) => setData('currency', e.target.value)} className="col-sm-8 form-control selectpicker">
                                                <option value="1" label="Rupiah">Rupiah</option>
                                                <option value="2" label="Dollar">Dollar</option>
                                            </select>
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
