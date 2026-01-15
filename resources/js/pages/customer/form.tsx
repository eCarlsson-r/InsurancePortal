import TemplateLayout from '@/layouts/TemplateLayout';
import { customerSchema } from '@/schemas/models';
import { Head, useForm } from '@inertiajs/react';
import { Accordion } from 'react-bootstrap';
import { z } from 'zod';

export default function CustomerForm({ customer }: { customer?: z.infer<typeof customerSchema> | null; }) {
    const isEdit = !!customer;

    // Initial form state with safe defaults
    const { data, setData, post, put, processing } = useForm<z.infer<typeof customerSchema>>(
        isEdit && customer
            ? customer
            : {
                name: '',
                gender: 0,
                identity_number: '',
                mobile: '',
                email: '',
                birth_date: '',
                birth_place: '',
                religion: 0,
                marital: 0,
                profession: '',
                home_address: '',
                home_postal: '',
                home_city: '',
                work_address: '',
                work_postal: '',
                work_city: '',
                description: ''
              },
    );

    const handleSubmit = () => {
        if (isEdit) {
            put(`/master/customer/${customer.id}`);
        } else {
            post('/master/customer');
        }
    };

    return (
        <TemplateLayout>
            <Head title={isEdit ? 'Sunting Data Nasabah' : 'Input Data Nasabah'} />
            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="customer-input">Nasabah</h3>&emsp;
                        <button className="btn btn-primary pull-right" onClick={handleSubmit} disabled={processing}>Perbarui</button>
                    </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="master">Master</a></li>
                            <li className="breadcrumb-item active" data-i18n="customer-input">Nasabah</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Data Pribadi</Accordion.Header>
                                <Accordion.Body>
                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="complete-name">Nama Lengkap</label>
                                        <div className="col-sm-9">
                                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="form-control"/>
                                        </div>
                                    </div>

                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="gender">Jenis Kelamin</label>
                                        <div className="col-sm-9">
                                            <select className="form-control selectpicker" value={data.gender} onChange={(e) => setData('gender', parseInt(e.target.value))} >
                                                <option value="1" data-i18n="male">Pria</option>
                                                <option value="2" data-i18n="female">Wanita</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="place_date_birth">Tempat dan Tanggal Lahir</label>
                                        <div className="col-sm-9 input-group">
                                            <input type="text" value={data.birth_place} onChange={(e) => setData('birth_place', e.target.value)} className="col-sm-7 form-control"/>
                                            <input type="date" value={data.birth_date} onChange={(e) => setData('birth_date', e.target.value)} className="col-sm-5 form-control"/>
                                        </div>
                                    </div>

                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="customer-marital">Status</label>
                                        <div className="col-sm-9">
                                            <select className="form-control selectpicker" value={data.marital} onChange={(e) => setData('marital', parseInt(e.target.value))}>
                                                <option value="1" data-i18n="single">Single</option>
                                                <option value="2" data-i18n="married">Kawin</option>
                                                <option value="3" data-i18n="widow">Duda/Janda</option>
                                                <option value="4" data-i18n="divorce">Cerai</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="customer-religion">Agama</label>
                                        <div className="col-sm-9">
                                            <select className="form-control selectpicker" value={data.religion} onChange={(e) => setData('religion', parseInt(e.target.value))}>
                                                <option value="0" label=""></option>
                                                <option value="1" data-i18n="buddhism">Budha</option>
                                                <option value="2" data-i18n="christian">Kristen</option>
                                                <option value="3" data-i18n="muslim">Islam</option>
                                                <option value="4" data-i18n="hindu">Hindu</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="customer-identity">Nomor Identitas</label>
                                        <div className="col-sm-9">
                                            <input type="text" value={data.identity_number} onChange={(e) => setData('identity_number', e.target.value)} className="form-control"/>
                                        </div>
                                    </div>

                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="profession">Pekerjaan</label>
                                        <div className="col-sm-9">
                                            <input type="text" value={data.profession} onChange={(e) => setData('profession', e.target.value)} className="form-control"/>
                                        </div>
                                    </div>

                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="description">Keterangan</label>
                                        <div className="col-sm-9">
                                            <textarea className="form-control" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} cols={60}></textarea>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                    <div className="col-md-6">
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Kontak Nasabah</Accordion.Header>
                                <Accordion.Body>
                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="mobile-number">Nomor Ponsel</label>
                                        <div className="col-sm-9">
                                            <input value={data.mobile} onChange={(e) => setData('mobile', e.target.value)} className="form-control"/>
                                        </div>
                                    </div>

                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="email-address">Alamat e-Mail</label>
                                        <div className="col-sm-9">
                                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="col-sm-9 form-control"/>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Alamat Rumah</Accordion.Header>
                                <Accordion.Body>
                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="home-address">Alamat Rumah</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" value={data.home_address} onChange={(e) => setData('home_address', e.target.value)} size={80} />
                                        </div>
                                    </div>
                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="postal-code">Kode Pos</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" value={data.home_postal} onChange={(e) => setData('home_postal', e.target.value)} size={5} />
                                        </div>
                                    </div>
                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="city">Kota</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="customer-homecity" value={data.home_city} onChange={(e) => setData('home_city', e.target.value)} size={20} />
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Alamat Kantor</Accordion.Header>
                                <Accordion.Body>
                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="work-address">Alamat Kantor</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" value={data.work_address} onChange={(e) => setData('work_address', e.target.value)} size={80} />
                                        </div>
                                    </div>
                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="postal-code">Kode Pos</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" value={data.work_postal} onChange={(e) => setData('work_postal', e.target.value)} size={5} />
                                        </div>
                                    </div>
                                    <div className="row form-group">
                                        <label className="col-sm-3" data-i18n="city">Kota</label>
                                        <div className="col-sm-9">
                                            <input type="text" className="form-control" id="customer-workcity" value={data.work_city} onChange={(e) => setData('work_city', e.target.value)} size={20} />
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </div>
            </div>
        </TemplateLayout>
    );
}
