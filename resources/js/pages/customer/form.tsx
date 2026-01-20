import SelectInput from '@/components/form/select-input';
import TextareaInput from '@/components/form/textarea-input';
import TextInput from '@/components/form/text-input';
import SubmitButton from '@/components/form/submit-button';
import DateInput from '@/components/form/date-input';
import FormPage from '@/layouts/FormPage';
import { customerSchema } from '@/schemas/models';
import { useForm } from '@inertiajs/react';
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
                identity: '',
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
        <FormPage
            headTitle={isEdit ? 'Sunting Nasabah' : 'Tambah Nasabah'}
            title="Nasabah"
            i18nTitle="customer"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: 'Nasabah', active: true, i18n: 'customer' },
            ]}
            headerActions={
                <SubmitButton 
                    processing={processing}
                    onClick={handleSubmit}
                >
                    {isEdit ? 'Perbarui' : 'Simpan'}
                </SubmitButton>
            }
        >
            <div className="row">
                <div className="col-md-6">
                    <Accordion defaultActiveKey="0" className="mb-4">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Data Pribadi</Accordion.Header>
                            <Accordion.Body>
                                <TextInput
                                    id="name"
                                    label="Nama Lengkap"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    row
                                />

                                <SelectInput
                                    id="gender"
                                    label="Jenis Kelamin"
                                    value={data.gender}
                                    onChange={(e) => setData('gender', parseInt(e.target.value))}
                                    options={[
                                        { value: 1, label: 'Pria' },
                                        { value: 2, label: 'Wanita' },
                                    ]}
                                    row
                                />

                                <div className="row form-group mb-3">
                                    <label className="col-sm-3 col-form-label">Tempat & Tgl Lahir</label>
                                    <div className="col-sm-9 d-flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Tempat"
                                            value={data.birth_place} 
                                            onChange={(e) => setData('birth_place', e.target.value)} 
                                            className="form-control flex-grow-1"
                                        />
                                        <DateInput
                                            id="birth_date"
                                            value={data.birth_date} 
                                            onChange={(e) => setData('birth_date', e.target.value)} 
                                            style={{ width: 'auto' }}
                                        />
                                    </div>
                                </div>

                                <SelectInput
                                    id="marital"
                                    label="Status"
                                    value={data.marital}
                                    onChange={(e) => setData('marital', parseInt(e.target.value))}
                                    options={[
                                        { value: 1, label: 'Single' },
                                        { value: 2, label: 'Kawin' },
                                        { value: 3, label: 'Duda/Janda' },
                                        { value: 4, label: 'Cerai' },
                                    ]}
                                    row
                                />

                                <SelectInput
                                    id="religion"
                                    label="Agama"
                                    value={data.religion}
                                    onChange={(e) => setData('religion', parseInt(e.target.value))}
                                    options={[
                                        { value: 0, label: '' },
                                        { value: 1, label: 'Budha' },
                                        { value: 2, label: 'Kristen' },
                                        { value: 3, label: 'Islam' },
                                        { value: 4, label: 'Hindu' },
                                    ]}
                                    row
                                />

                                <TextInput
                                    id="identity"
                                    label="Nomor Identitas"
                                    value={data.identity}
                                    onChange={(e) => setData('identity', e.target.value)}
                                    row
                                />

                                <TextInput
                                    id="profession"
                                    label="Pekerjaan"
                                    value={data.profession}
                                    onChange={(e) => setData('profession', e.target.value)}
                                    row
                                />

                                <TextareaInput
                                    id="description"
                                    label="Keterangan"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    row
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
                <div className="col-md-6">
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0" className="mb-3">
                            <Accordion.Header>Kontak Nasabah</Accordion.Header>
                            <Accordion.Body>
                                <TextInput
                                    id="mobile"
                                    label="Nomor Ponsel"
                                    value={data.mobile}
                                    onChange={(e) => setData('mobile', e.target.value)}
                                    row
                                />

                                <TextInput
                                    id="email"
                                    label="Alamat e-Mail"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    row
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="mb-3">
                            <Accordion.Header>Alamat Rumah</Accordion.Header>
                            <Accordion.Body>
                                <TextInput
                                    id="home_address"
                                    label="Alamat Rumah"
                                    value={data.home_address}
                                    onChange={(e) => setData('home_address', e.target.value)}
                                    row
                                />
                                <TextInput
                                    id="home_postal"
                                    label="Kode Pos"
                                    value={data.home_postal}
                                    onChange={(e) => setData('home_postal', e.target.value)}
                                    row
                                />
                                <TextInput
                                    id="home_city"
                                    label="Kota"
                                    value={data.home_city}
                                    onChange={(e) => setData('home_city', e.target.value)}
                                    row
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Alamat Kantor</Accordion.Header>
                            <Accordion.Body>
                                <TextInput
                                    id="work_address"
                                    label="Alamat Kantor"
                                    value={data.work_address}
                                    onChange={(e) => setData('work_address', e.target.value)}
                                    row
                                />
                                <TextInput
                                    id="work_postal"
                                    label="Kode Pos"
                                    value={data.work_postal}
                                    onChange={(e) => setData('work_postal', e.target.value)}
                                    row
                                />
                                <TextInput
                                    id="work_city"
                                    label="Kota"
                                    value={data.work_city}
                                    onChange={(e) => setData('work_city', e.target.value)}
                                    row
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>
        </FormPage>
    );
}
