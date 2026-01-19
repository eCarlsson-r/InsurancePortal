import CheckboxInput from '@/components/form/checkbox-input';
import SelectInput from '@/components/form/select-input';
import TextareaInput from '@/components/form/textarea-input';
import TextInput from '@/components/form/text-input';
import UploadOcrModal from '@/components/upload-ocr-modal';
import FormPage from '@/layouts/FormPage';
import { policySchema, agentSchema, productSchema, fundSchema } from '@/schemas/models';
import { Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { z } from 'zod';
import SubmitButton from '@/components/form/submit-button';

export default function PolicyForm({extracted, fileUrl, policy, agents, products, funds}: {
    extracted: z.infer<typeof policySchema>;
    fileUrl: string;
    policy: z.infer<typeof policySchema>;
    agents: z.infer<typeof agentSchema>[];
    products: z.infer<typeof productSchema>[];
    funds: z.infer<typeof fundSchema>[];
}) {
    const isEdit = !!policy;

    // Initial form state with safe defaults
    const { data, setData, post, put, processing, errors } = useForm<z.infer<typeof policySchema>>(
        isEdit
            ? policy
            : extracted || {
                  id: '',
                  agent_id: 0,
                  entry_date: new Date(),
                  bill_at: 1,
                  is_insure_holder: false,
                  holder_insured_relationship: '',
                  product_id: 0,
                  insure_period: 1,
                  pay_period: 1,
                  currency_id: 1,
                  curr_rate: 1.0,
                  start_date: new Date(),
                  base_insure: 0,
                  premium: 0,
                  pay_method: 1,
                  description: '',
                  policy_no: '',
                  holder: {
                      name: '',
                      gender: 1,
                      birth_place: '',
                      birth_date: '',
                      marital: 1,
                      religion: 0,
                      identity: '',
                      profession: '',
                      mobile: '',
                      email: '',
                      home_address: '',
                      home_postal: '',
                      home_city: '',
                      work_address: '',
                      work_postal: '',
                      work_city: '',
                      description: ''
                  },
                  insured: {
                      name: '',
                      gender: 1,
                      birth_place: '',
                      birth_date: '',
                      marital: 1,
                      religion: 1,
                      identity: '',
                      profession: '',
                      mobile: '',
                      email: '',
                      home_address: '',
                      home_postal: '',
                      home_city: '',
                      work_address: '',
                      work_postal: '',
                      work_city: '',
                      description: ''
                  },
                  investments: [],
                  riders: [],
              },
    );

    const [ocrModalOpen, setOcrModalOpen] = useState(false);

    // Effect to sync holder name if checkbox is checked
    useEffect(() => {
        if (data.is_insure_holder) {
            const syncData = {
                ...data.insured,
                name: data.holder.name,
                gender: data.holder.gender,
                birth_place: data.holder.birth_place,
                birth_date: data.holder.birth_date,
                marital: data.holder.marital,
                profession: data.holder.profession,
                home_address: data.holder.home_address,
                home_postal: data.holder.home_postal,
                home_city: data.holder.home_city,
            };
            
            // Check if object is different before setting to avoid loop
            if (JSON.stringify(syncData) !== JSON.stringify(data.insured)) {
                 setData((prev) => ({
                    ...prev,
                    insured: syncData,
                    holder_insured_relationship: '1'
                }));
            }
        }
    }, [data.is_insure_holder, data.holder, data.insured, setData]);

    const handleSubmit = () => {
        console.info("Submit policy : ", isEdit)
        if (isEdit) {
            put(`/sales/policy/${policy.id}`);
        } else {
            post('/sales/policy');
        }
    };

    const addInvestment = () => {
        setData('investments', [
            ...data.investments,
            { fund_id: 0, allocation: 0 },
        ]);
    };

    const removeInvestment = (index: number) => {
        const newInvestments = [...data.investments];
        newInvestments.splice(index, 1);
        setData('investments', newInvestments);
    };

    const addRider = () => {
        setData('riders', [
            ...data.riders,
            {
                product_id: '',
                insure_amount: 0,
                premium: 0,
                insure_period: 0,
                pay_period: 0,
            },
        ]);
    };

    const removeRider = (index: number) => {
        const newRiders = [...data.riders];
        newRiders.splice(index, 1);
        setData('riders', newRiders);
    };

    return (
        <FormPage
            headTitle={isEdit ? 'Sunting Data SP' : 'Input Data SP'}
            title={isEdit ? 'Sunting Data SP' : 'Input Data SP'}
            breadcrumbs={[
                { label: 'Penjualan', i18n: 'sales' },
                { label: 'SP / Polis', href: '/sales', i18n: 'case' },
                { label: isEdit ? 'Sunting' : 'Input', active: true },
            ]}
        >
            <form
                id="case-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div className="row">
                    {/* PDF Preview Sidebar (Sticky) */}
                    <div className="col-lg-6 d-none d-lg-block">
                        {fileUrl && (
                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Polis</Accordion.Header>
                                    <Accordion.Body>
                                        <iframe
                                            src={`${fileUrl}#page=3&toolbar=0&navpanes=0`}
                                            width="100%"
                                            height="600px"
                                            style={{ border: 'none' }}
                                        />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        )}
                    </div>

                    {/* Form */}
                    <div className="col-lg-6">
                        <Accordion defaultActiveKey="0" className="mb-3">
                            {/* Section 1: Data SP */}
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Data SP</Accordion.Header>
                                <Accordion.Body>
                                    <TextInput
                                        id="case_no"
                                        label="No. SP"
                                        value={data.case_code}
                                        onChange={(e) => setData('case_code', e.target.value)}
                                        error={errors.id}
                                        row
                                    />

                                    <SelectInput
                                        id="agent_id"
                                        label="Agen"
                                        value={data.agent_id}
                                        onChange={(e) => setData('agent_id', e.target.value)}
                                        error={errors.agent_id}
                                        options={agents.map((agent) => ({
                                            value: agent.id || '',
                                            label: agent.name,
                                        }))}
                                        row
                                    />

                                    <TextInput
                                        id="entry_date"
                                        label="Tanggal SP Masuk"
                                        type="date"
                                        value={
                                            typeof data.entry_date === 'string'
                                                ? data.entry_date
                                                : data.entry_date.toISOString().split('T')[0]
                                        }
                                        onChange={(e) => setData('entry_date', new Date(e.target.value))}
                                        error={errors.entry_date}
                                        row
                                    />

                                    <SelectInput
                                        id="bill_at"
                                        label="Tagih"
                                        value={data.bill_at}
                                        onChange={(e) => setData('bill_at', parseInt(e.target.value))}
                                        error={errors.bill_at}
                                        options={[
                                            { value: 1, label: 'Rumah' },
                                            { value: 2, label: 'Kantor' },
                                        ]}
                                        row
                                    />

                                    <CheckboxInput
                                        id="insure-holder"
                                        label="Data pemegang polis sama dengan data tertanggung."
                                        checked={data.is_insure_holder}
                                        onChange={(e) => setData('is_insure_holder', e.target.checked)}
                                    />
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Section 2: Pemegang Polis */}
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    Data Pemegang Polis
                                </Accordion.Header>
                                <Accordion.Body>
                                    <TextInput
                                        id="holder_name"
                                        label="Nama Lengkap"
                                        value={data.holder.name}
                                        onChange={(e) => setData('holder', { ...data.holder, name: e.target.value })}
                                        row
                                    />

                                    <SelectInput
                                        id="holder_gender"
                                        label="Jenis Kelamin"
                                        value={data.holder.gender}
                                        onChange={(e) => setData('holder', { ...data.holder, gender: parseInt(e.target.value) })}
                                        options={[
                                            { value: 1, label: 'Pria' },
                                            { value: 2, label: 'Wanita' },
                                        ]}
                                        row
                                    />

                                    <div className="mb-3 row form-group">
                                        <label className="col-sm-3 col-form-label">Tempat dan Tanggal Lahir</label>
                                        <div className="col-sm-9 input-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Tempat"
                                                value={data.holder.birth_place}
                                                onChange={(e) => setData('holder', { ...data.holder, birth_place: e.target.value })}
                                            />
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={data.holder.birth_date}
                                                onChange={(e) => setData('holder', { ...data.holder, birth_date: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <SelectInput
                                        id="holder_marital"
                                        label="Status"
                                        value={data.holder.marital}
                                        onChange={(e) => setData('holder', { ...data.holder, marital: parseInt(e.target.value) })}
                                        options={[
                                            { value: 1, label: 'Single' },
                                            { value: 2, label: 'Kawin' },
                                            { value: 3, label: 'Duda/Janda' },
                                            { value: 4, label: 'Cerai' },
                                        ]}
                                        row
                                    />

                                    <SelectInput
                                        id="holder_religion"
                                        label="Agama"
                                        value={data.holder.religion}
                                        onChange={(e) => setData('holder', { ...data.holder, religion: parseInt(e.target.value) })}
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
                                        id="holder_identity_number"
                                        label="Nomor Identitas"
                                        value={data.holder.identity}
                                        onChange={(e) => setData('holder', { ...data.holder, identity: e.target.value })}
                                        row
                                    />

                                    <TextInput
                                        id="holder_profession"
                                        label="Pekerjaan"
                                        value={data.holder.profession}
                                        onChange={(e) => setData('holder', { ...data.holder, profession: e.target.value })}
                                        row
                                    />

                                    <TextInput
                                        id="holder_mobile"
                                        label="Nomor Ponsel"
                                        value={data.holder.mobile}
                                        onChange={(e) => setData('holder', { ...data.holder, mobile: e.target.value })}
                                        row
                                    />

                                    <TextInput
                                        id="holder_email"
                                        label="Alamat e-Mail"
                                        type="email"
                                        value={data.holder.email}
                                        onChange={(e) => setData('holder', { ...data.holder, email: e.target.value })}
                                        row
                                    />

                                    <TextInput
                                        id="holder_home_address"
                                        label="Alamat Rumah"
                                        value={data.holder.home_address}
                                        onChange={(e) => setData('holder', { ...data.holder, home_address: e.target.value })}
                                        row
                                    />

                                    <div className="mb-3 row form-group">
                                        <label className="col-sm-3 col-form-label">Kode Pos / Kota</label>
                                        <div className="col-sm-9 d-flex gap-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Kode Pos"
                                                style={{ maxWidth: '100px' }}
                                                value={data.holder.home_postal}
                                                onChange={(e) => setData('holder', { ...data.holder, home_postal: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Kota"
                                                value={data.holder.home_city}
                                                onChange={(e) => setData('holder', { ...data.holder, home_city: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <TextInput
                                        id="holder_work_address"
                                        label="Alamat Kantor"
                                        value={data.holder.work_address}
                                        onChange={(e) => setData('holder', { ...data.holder, work_address: e.target.value })}
                                        row
                                    />

                                    <div className="mb-3 row form-group">
                                        <label className="col-sm-3 col-form-label">Kode Pos / Kota</label>
                                        <div className="col-sm-9 d-flex gap-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Kode Pos"
                                                style={{ maxWidth: '100px' }}
                                                value={data.holder.work_postal}
                                                onChange={(e) => setData('holder', { ...data.holder, work_postal: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Kota"
                                                value={data.holder.work_city}
                                                onChange={(e) => setData('holder', { ...data.holder, work_city: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Section 3: Tertanggung */}
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>
                                    Data Tertanggung
                                </Accordion.Header>
                                <Accordion.Body>
                                    <TextInput
                                        id="insured_name"
                                        label="Nama Lengkap"
                                        value={data.insured.name}
                                        onChange={(e) => setData('insured', { ...data.insured, name: e.target.value })}
                                        disabled={data.is_insure_holder}
                                        row
                                    />

                                    <SelectInput
                                        id="insured_gender"
                                        label="Jenis Kelamin"
                                        value={data.insured.gender}
                                        onChange={(e) => setData('insured', { ...data.insured, gender: parseInt(e.target.value) })}
                                        disabled={data.is_insure_holder}
                                        options={[
                                            { value: 1, label: 'Pria' },
                                            { value: 2, label: 'Wanita' },
                                        ]}
                                        row
                                    />

                                    <div className="mb-3 row form-group">
                                        <label className="col-sm-3 col-form-label">Tempat & Tgl Lahir</label>
                                        <div className="col-sm-9 d-flex gap-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Tempat"
                                                value={data.insured.birth_place}
                                                onChange={(e) => setData('insured', { ...data.insured, birth_place: e.target.value })}
                                                disabled={data.is_insure_holder}
                                            />
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={data.insured.birth_date}
                                                onChange={(e) => setData('insured', { ...data.insured, birth_date: e.target.value })}
                                                disabled={data.is_insure_holder}
                                            />
                                        </div>
                                    </div>

                                    <SelectInput
                                        id="insured_marital"
                                        label="Status"
                                        value={data.insured.marital}
                                        onChange={(e) => setData('insured', { ...data.insured, marital: parseInt(e.target.value) })}
                                        disabled={data.is_insure_holder}
                                        options={[
                                            { value: 1, label: 'Single' },
                                            { value: 2, label: 'Kawin' },
                                            { value: 3, label: 'Duda/Janda' },
                                            { value: 4, label: 'Cerai' },
                                        ]}
                                        row
                                    />

                                    <SelectInput
                                        id="holder_insured_relationship"
                                        label="Hubungan"
                                        value={data.holder_insured_relationship}
                                        onChange={(e) => setData('holder_insured_relationship', e.target.value)}
                                        disabled={data.is_insure_holder}
                                        options={[
                                            { value: '1', label: 'Diri Sendiri' },
                                            { value: '2', label: 'Suami / Istri' },
                                            { value: '3', label: 'Anak' },
                                            { value: '4', label: 'Orang Tua' },
                                            { value: '5', label: 'Lainnya' },
                                        ]}
                                        row
                                    />

                                    <TextInput
                                        id="insured_profession"
                                        label="Pekerjaan"
                                        value={data.insured.profession}
                                        onChange={(e) => setData('insured', { ...data.insured, profession: e.target.value })}
                                        disabled={data.is_insure_holder}
                                        row
                                    />

                                    <TextInput
                                        id="insured_home_address"
                                        label="Alamat Rumah"
                                        value={data.insured.home_address}
                                        onChange={(e) => setData('insured', { ...data.insured, home_address: e.target.value })}
                                        disabled={data.is_insure_holder}
                                        row
                                    />

                                    <div className="mb-3 row form-group">
                                        <label className="col-sm-3 col-form-label">Kode Pos / Kota</label>
                                        <div className="col-sm-9 d-flex gap-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Kode Pos"
                                                style={{ maxWidth: '100px' }}
                                                value={data.insured.home_postal}
                                                onChange={(e) => setData('insured', { ...data.insured, home_postal: e.target.value })}
                                                disabled={data.is_insure_holder}
                                            />
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Kota"
                                                value={data.insured.home_city}
                                                onChange={(e) => setData('insured', { ...data.insured, home_city: e.target.value })}
                                                disabled={data.is_insure_holder}
                                            />
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Section 4: Data Asuransi */}
                            <Accordion.Item eventKey="3">
                                <Accordion.Header>
                                    Data Asuransi
                                </Accordion.Header>
                                <Accordion.Body>
                                    <TextInput
                                        id="policy_no"
                                        label="No. Polis"
                                        value={data.policy_no}
                                        onChange={(e) => setData('policy_no', e.target.value)}
                                        row
                                    />

                                    <SelectInput
                                        id="product_id"
                                        label="Produk"
                                        value={data.product_id}
                                        onChange={(e) => setData('product_id', e.target.value)}
                                        options={
                                            products.map((product) => ({
                                                value: product.id || '',
                                                label: product.name,
                                            }))
                                        }
                                        row
                                    />

                                    <SelectInput
                                        id="currency_id"
                                        label="Mata Uang"
                                        value={data.currency_id}
                                        onChange={(e) => setData('currency_id', parseInt(e.target.value))}
                                        options={[
                                            { value: 1, label: 'Rupiah' },
                                            { value: 2, label: 'Dollar' },
                                        ]}
                                        row
                                    />

                                    <div className="mb-3 row form-group">
                                        <label className="col-sm-3 col-form-label">Premi Dasar</label>
                                        <div className="col-sm-9 input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={data.premium}
                                                onChange={(e) => setData('premium', Number(e.target.value))}
                                            />
                                            <span className="input-group-text">x</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                style={{ maxWidth: '100px' }}
                                                value={data.curr_rate}
                                                onChange={(e) => setData('curr_rate', Number(e.target.value))}
                                            />
                                        </div>
                                    </div>

                                    <SelectInput
                                        id="pay_method"
                                        label="Cara Bayar"
                                        value={data.pay_method}
                                        onChange={(e) => setData('pay_method', parseInt(e.target.value))}
                                        options={[
                                            { value: 1, label: 'Tahunan' },
                                            { value: 2, label: 'Enam Bulanan' },
                                            { value: 4, label: 'Tiga Bulanan' },
                                            { value: 12, label: 'Bulanan' },
                                            { value: 0, label: 'Sekaligus' },
                                        ]}
                                        row
                                    />

                                    <TextInput
                                        id="base_insure"
                                        label="U.P. Dasar"
                                        type="number"
                                        value={data.base_insure}
                                        onChange={(e) => setData('base_insure', Number(e.target.value))}
                                        row
                                    />

                                    {/* Investments Table */}
                                    <div className="mb-3 mt-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0">Pilihan Investasi</h6>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-primary"
                                                onClick={addInvestment}
                                            >
                                                <i className="fa fa-plus me-1"></i>
                                                Tambah
                                            </button>
                                        </div>
                                        <table className="table table-bordered table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Jenis Investasi</th>
                                                    <th style={{ width: '100px' }}>Percent</th>
                                                    <th style={{ width: '40px' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(data.investments && data.investments.length > 0) ? (data.investments.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <select
                                                                className="form-control form-control-sm"
                                                                value={item.fund_id}
                                                                onChange={(e) => {
                                                                    const newInvestments = [...data.investments];
                                                                    newInvestments[index].fund_id = parseInt(e.target.value);
                                                                    setData('investments', newInvestments);
                                                                }}
                                                            >
                                                                <option value="0">Pilih Fund</option>
                                                                {funds.map((fund) => (
                                                                    <option key={fund.id} value={fund.id}>
                                                                        {fund.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                value={item.allocation}
                                                                onChange={(e) => {
                                                                    const newInvestments = [...data.investments];
                                                                    newInvestments[index].allocation = parseFloat(e.target.value);
                                                                    setData('investments', newInvestments);
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <button
                                                                type="button"
                                                                className="btn btn-link btn-sm text-danger p-0"
                                                                onClick={() => removeInvestment(index)}
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))) : (
                                                    <tr>
                                                        <td colSpan={3} className="text-center text-muted py-2">
                                                            Belum ada investasi
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Riders Table */}
                                    <div className="mb-3 mt-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0">Asuransi Tambahan</h6>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-primary"
                                                onClick={addRider}
                                            >
                                                <i className="fa fa-plus me-1"></i>
                                                Tambah
                                            </button>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-sm" style={{ minWidth: '600px' }}>
                                                <thead>
                                                    <tr>
                                                        <th>Rider</th>
                                                        <th>U.P. Rider</th>
                                                        <th>Premi</th>
                                                        <th>Masa Asuransi</th>
                                                        <th>Masa Bayar</th>
                                                        <th style={{ width: '40px' }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(data.riders && data.riders.length > 0) ? (data.riders.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <select
                                                                    className="form-control form-control-sm"
                                                                    value={item.product_id}
                                                                    onChange={(e) => {
                                                                        const newRiders = [...data.riders];
                                                                        newRiders[index].product_id = e.target.value;
                                                                        setData('riders', newRiders);
                                                                    }}
                                                                >
                                                                    <option value="">Pilih Rider</option>
                                                                    {products.filter(p => p.type === "5").map((product) => (
                                                                        <option key={product.id} value={product.id}>
                                                                            {product.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm"
                                                                    value={item.insure_amount}
                                                                    onChange={(e) => {
                                                                        const newRiders = [...data.riders];
                                                                        newRiders[index].insure_amount = Number(e.target.value);
                                                                        setData('riders', newRiders);
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm"
                                                                    value={item.premium}
                                                                    onChange={(e) => {
                                                                        const newRiders = [...data.riders];
                                                                        newRiders[index].premium = Number(e.target.value);
                                                                        setData('riders', newRiders);
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm"
                                                                    value={item.insure_period}
                                                                    onChange={(e) => {
                                                                        const newRiders = [...data.riders];
                                                                        newRiders[index].insure_period = Number(e.target.value);
                                                                        setData('riders', newRiders);
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm"
                                                                    value={item.pay_period}
                                                                    onChange={(e) => {
                                                                        const newRiders = [...data.riders];
                                                                        newRiders[index].pay_period = Number(e.target.value);
                                                                        setData('riders', newRiders);
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className="text-center">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-link btn-sm text-danger p-0"
                                                                    onClick={() => removeRider(index)}
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))) : (
                                                        <tr>
                                                            <td colSpan={6} className="text-center text-muted py-2">
                                                                Belum ada rider
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <TextareaInput
                                        id="description"
                                        label="Keterangan"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        row
                                    />
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>

                        <div className="card-footer d-flex gap-2 bg-transparent border-0 px-0">
                            <SubmitButton processing={processing} onClick={handleSubmit}>
                                <i className="fa fa-save me-2"></i>
                                {isEdit ? 'Perbaharui' : 'Simpan'}
                            </SubmitButton>
                            <Link
                                href="/sales"
                                className="btn btn-secondary"
                            >
                                Batal
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
            <UploadOcrModal
                show={ocrModalOpen}
                onHide={() => setOcrModalOpen(false)}
            />
        </FormPage>
    );
}
