import TemplateLayout from "@/layouts/TemplateLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import UploadOcrModal from "@/components/upload-ocr-modal";
import { Accordion, Card } from "react-bootstrap";
import { policySchema } from "@/schemas/models";
import { z } from "zod";
import { investmentSchema, riderSchema } from "@/schemas/models";


export default function PolicyForm({extracted, fileUrl, policy}: {extracted: z.infer<typeof policySchema>, fileUrl: string, policy: z.infer<typeof policySchema>}) {
    const isEdit = !!policy;

    // Initial form state with safe defaults
    const { data, setData, post, put, processing, errors } = useForm(isEdit ? policy : extracted || {
        // SP / Polis data
        id: '',
        agent_id: "",
        entry_date: "",
        bill_at: "1",
        is_insure_holder: false,
        holder_insured_relationship: "",

        // Pemegang Polis
        customer: {
            name: "",
            gender: "1",
            birth_place: "",
            birth_date: "",
            marital: "1",
            religion: "0",
            identity: "",
            profession: "",
            mobile: "",
            email: "",
            home_address: "",
            home_postal: "",
            home_city: "",
            work_address: "",
            work_postal: "",
            work_city: ""
        },

        // Tertanggung
        insured: {
            name: "",
            gender: "1",
            birth_place: "",
            birth_date: "",
            marital: "1",
            profession: "",
            home_address: "",
            home_postal: "",
            home_city: "",
        },

        // Data Asuransi
        policy_no: "",
        product_id: "",
        currency_id: "1",
        premium: 0,
        curr_rate: 1.00,
        pay_method: "1",
        base_insure: 0,
        
        // Investments & Riders
        investments: [],
        riders: [],
        
        description: ""
    });

    const [ocrModalOpen, setOcrModalOpen] = useState(false);

    // Effect to sync holder name if checkbox is checked
    useEffect(() => {
        if (data.is_insure_holder) {
            // Use the (key, value) syntax for cleaner nested updates
            setData('insured', {
                ...data.insured, // Keep existing fields like 'relationship'
                name: data.holder.name,
                gender: data.holder.gender,
                birth_place: data.holder.birth_place,
                birth_date: data.holder.birth_date,
                marital: data.holder.marital,
                profession: data.holder.profession,
                home_address: data.holder.home_address,
                home_postal: data.holder.home_postal,
                home_city: data.holder.home_city
            });

            setData('holder_insured_relationship', "1");
        }
    }, [
        data.is_insure_holder, data.insured,
        data.holder, // Add this so changes to customer sync live to insured
        setData
    ]);


    const handleSubmit = () => {
        if (isEdit) {
            put(`/sales/policy/${policy.id}`);
        } else {
            post("/sales/policy");
        }
    };

    // Helper to add investment row
    const addInvestment = () => {
        setData('investments', [...data.investments, { fund_id: 0, allocation: 0 }]);
    };

    // Helper to add rider row
    const addRider = () => {
        setData('riders', [...data.riders, { product_id: 0, insure_amount: 0, premium: 0, insure_period: 0, pay_period: 0 }]);
    };

    return (
        <TemplateLayout>
            <Head title={isEdit ? "Sunting Data SP" : "Input Data SP"} />
            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-6 p-md-0">
                        <h3 className="text-primary d-inline">{isEdit ? "Sunting Data SP" : "Input Data SP"}</h3>
                        <button type="submit" className="btn btn-primary pull-right" disabled={processing}>
                            <i className="fa fa-save me-2"></i>
                            {isEdit ? 'Perbaharui' : 'Simpan'}
                        </button>
                    </div>
                    <div className="col-6 p-md-0 justify-content-end mt-2 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item" data-i18n="sales">Penjualan</li>
                            <li className="breadcrumb-item">
                                <Link href="/sales" data-i18n="case">SP / Polis</Link>
                            </li>
                            <li className="breadcrumb-item active">{isEdit ? "Sunting Data SP" : "Input Data SP"}</li>
                        </ol>
                    </div>
                </div>

                <div className="row">
                    {/* PDF Preview Sidebar (Sticky) */}
                    <div className="col-lg-6 d-none d-lg-block">
                        <div style={{ position: 'sticky', top: '20px' }}>
                            {fileUrl && (
                                <Accordion className="mb-4">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header as={Card.Header}>
                                            Polis
                                        </Accordion.Header>
                                        <Accordion.Body className="p-0">
                                            <iframe src={`${fileUrl}#page=3&toolbar=0&navpanes=0`} width="100%" height="600px" />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            )}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="col-lg-6">
                        <form id="case-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            {/* Section 1: Data SP */}
                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        Data SP
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="case-code">No. SP</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data.id}
                                                    onChange={e => setData("id", e.target.value)}
                                                />
                                                {errors.id && <div className="text-danger small">{errors.id}</div>}
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="agent">Agen</label>
                                            <div className="col-sm-9">
                                                <select 
                                                    className="form-control" 
                                                    value={data.agent_id}
                                                    onChange={e => setData("agent_id", parseInt(e.target.value))}
                                                >
                                                    <option value="">Pilih Agen</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="case-entry-date">Tanggal SP Masuk</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="date" 
                                                    className="form-control" 
                                                    value={data.entry_date.toISOString().split("T")[0]}
                                                    onChange={e => setData("entry_date", new Date(e.target.value))}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="tagih">Tagih</label>
                                            <div className="col-sm-9">
                                                <select 
                                                    className="form-control"
                                                    value={data.bill_at}
                                                    onChange={e => setData("bill_at", parseInt(e.target.value))}
                                                >
                                                    <option value="1" data-i18n="[label]home">Rumah</option>
                                                    <option value="2" data-i18n="[label]work">Kantor</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <div className="col-12 input-group">
                                                <div className="input-group-prepend">
                                                    <div className="input-group-text">
                                                        <input 
                                                            type="checkbox" 
                                                            id="insure-holder"
                                                            checked={data.is_insure_holder}
                                                            onChange={e => setData("is_insure_holder", e.target.checked)}
                                                        />
                                                    </div>
                                                </div>
                                                <label className="form-control" htmlFor="insure-holder">
                                                    Data pemegang polis sama dengan data tertanggung.
                                                </label>
                                            </div>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>

                                {/* Section 2: Pemegang Polis */}
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>
                                        Data Pemegang Polis
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="complete-name">Nama Lengkap</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data.holder.name}
                                                    onChange={e => setData("holder.name", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="gender">Jenis Kelamin</label>
                                            <div className="col-sm-9">
                                                <select 
                                                    className="form-control"
                                                    value={data.holder.gender}
                                                    onChange={e => setData("holder.gender", parseInt(e.target.value))}
                                                >
                                                    <option value="1" data-i18n="male">Pria</option>
                                                    <option value="2" data-i18n="female">Wanita</option>
                                                </select>  
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="place_date_birth">Tempat dan Tanggal Lahir</label>
                                            <div className="col-sm-9 input-group">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    placeholder="Tempat"
                                                    value={data.holder.birth_place}
                                                    onChange={e => setData("holder.birth_place", e.target.value)}
                                                />
                                                <input 
                                                    type="date" 
                                                    className="form-control"
                                                    value={data.holder.birth_date.toISOString().split("T")[0]}
                                                    onChange={e => setData("holder.birth_date", new Date(e.target.value))}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="customer-marital">Status</label>
                                            <div className="col-sm-9">
                                                <select 
                                                    className="form-control"
                                                    value={data.holder.marital}
                                                    onChange={e => setData("holder.marital", parseInt(e.target.value))}
                                                >
                                                    <option value="1" data-i18n="single">Single</option>
                                                    <option value="2" data-i18n="married">Kawin</option>
                                                    <option value="3" data-i18n="widow">Duda/Janda</option>
                                                    <option value="4" data-i18n="divorce">Cerai</option>
                                                </select> 
                                            </div> 
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="customer-religion">Agama</label>
                                            <div className="col-sm-9">
                                                <select 
                                                    className="form-control"
                                                    value={data.holder.religion}
                                                    onChange={e => setData("holder.religion", parseInt(e.target.value))}
                                                >
                                                    <option value="0" label=""></option>
                                                    <option value="1" data-i18n="buddhism">Budha</option>
                                                    <option value="2" data-i18n="christian">Kristen</option>
                                                    <option value="3" data-i18n="muslim">Islam</option>
                                                    <option value="4" data-i18n="hindu">Hindu</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="customer-identity">Nomor Identitas</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data.holder.identity_number}
                                                    onChange={e => setData("holder.identity_number", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="profession">Pekerjaan</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data.holder.profession}
                                                    onChange={e => setData("holder.profession", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="mobile-number">Nomor Ponsel</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text"
                                                    className="form-control"
                                                    value={data.holder.mobile}
                                                    onChange={e => setData("holder.mobile", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="email-address">Alamat e-Mail</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="email" 
                                                    className="form-control"
                                                    value={data.holder.email}
                                                    onChange={e => setData("holder.email", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="home-address">Alamat Rumah</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={data.holder.home_address}
                                                    onChange={e => setData("holder.home_address", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="postal-code">Kode Pos / Kota</label>
                                            <div className="col-sm-9 d-flex gap-2">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Kode Pos" style={{maxWidth: '100px'}}
                                                    value={data.holder.home_postal}
                                                    onChange={e => setData("holder.home_postal", e.target.value)}
                                                />
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Kota"
                                                    value={data.holder.home_city}
                                                    onChange={e => setData("holder.home_city", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="work-address">Alamat Kantor</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={data.holder.work_address}
                                                    onChange={e => setData("holder.work_address", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="postal-code">Kode Pos / Kota</label>
                                            <div className="col-sm-9 d-flex gap-2">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Kode Pos" style={{maxWidth: '100px'}}
                                                    value={data.holder.work_postal}
                                                    onChange={e => setData("holder.work_postal", e.target.value)}
                                                />
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Kota"
                                                    value={data.holder.work_city}
                                                    onChange={e => setData("holder.work_city", e.target.value)}
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
                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="complete-name">Nama Lengkap</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data.insured.name}
                                                    onChange={e => setData("insured.name", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="gender">Jenis Kelamin</label>
                                            <div className="col-sm-9">
                                                <select 
                                                    className="form-control"
                                                    value={data.insured.gender}
                                                    onChange={e => setData("insured.gender", parseInt(e.target.value))}
                                                >
                                                    <option value="1" data-i18n="male">Pria</option>
                                                    <option value="2" data-i18n="female">Wanita</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="place-date-birth">Tempat & Tgl Lahir</label>
                                            <div className="col-sm-9 d-flex gap-2">
                                                <input 
                                                    type="text" 
                                                    className="form-control" placeholder="Tempat"
                                                    value={data.insured.birth_place}
                                                    onChange={e => setData("insured.birth_place", e.target.value)}
                                                />
                                                <input 
                                                    type="date" 
                                                    className="form-control"
                                                    value={data.insured.birth_date.toISOString().split("T")[0]}
                                                    onChange={e => setData("insured.birth_date", new Date(e.target.value))}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="marital-status">Status</label>
                                            <div className="col-sm-9">
                                                    <select 
                                                    className="form-control"
                                                    value={data.insured.marital}
                                                    onChange={e => setData("insured.marital", parseInt(e.target.value))}
                                                >
                                                    <option value="1" data-i18n="single">Single</option>
                                                    <option value="2" data-i18n="married">Kawin</option>
                                                    <option value="3" data-i18n="widow">Duda/Janda</option>
                                                    <option value="4" data-i18n="divorce">Cerai</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label">Hubungan</label>
                                            <div className="col-sm-9">
                                                <select 
                                                    className="form-control"
                                                    value={data.holder_insured_relationship} // e.g., "4"
                                                    onChange={e => setData("holder_insured_relationship", e.target.value)}
                                                >
                                                    <option value="1">Diri Sendiri</option>
                                                    <option value="2">Suami / Istri</option>
                                                    <option value="3">Anak</option>
                                                    <option value="4">Orang Tua</option>
                                                    <option value="5">Lainnya</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="profession">Pekerjaan</label>
                                            <div className="col-sm-9">
                                                    <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data.insured.profession}
                                                    onChange={e => setData("insured.profession", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="home-address">Alamat Rumah</label>
                                            <div className="col-sm-9">
                                                    <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data.insured.home_address}
                                                    onChange={e => setData("insured.home_address", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    
                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="postal-code">Kode Pos / Kota</label>
                                            <div className="col-sm-9 d-flex gap-2">
                                                <input 
                                                    type="text" 
                                                    className="form-control" placeholder="Kode Pos" style={{maxWidth: '100px'}}
                                                    value={data.insured.home_postal}
                                                    onChange={e => setData("insured.home_postal", e.target.value)}
                                                />
                                                <input 
                                                    type="text" 
                                                    className="form-control" placeholder="Kota"
                                                    value={data.insured.home_city}
                                                    onChange={e => setData("insured.home_city", e.target.value)}
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
                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="policy-no">No. Polis</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data.policy_no}
                                                    onChange={e => setData("policy_no", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="product">Produk</label>
                                            <div className="col-sm-9">
                                                    <select 
                                                    className="form-control" 
                                                    value={data.product_id}
                                                    onChange={e => setData("product_id", parseInt(e.target.value))}
                                                >
                                                        <option value="">Pilih Produk</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="case-currency">Mata Uang</label>
                                            <div className="col-sm-9">
                                                <select 
                                                    className="form-control" 
                                                    value={data.currency_id}
                                                    onChange={e => setData("currency_id", parseInt(e.target.value))}
                                                >
                                                        <option value="1" label="Rupiah">Rupiah</option>
                                                        <option value="2" label="Dollar">Dollar</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="case-premium">Premi Dasar</label>
                                            <div className="col-sm-9 input-group">
                                                <input 
                                                    type="number" 
                                                    className="form-control"
                                                    value={data.premium}
                                                    onChange={e => setData("premium", Number(e.target.value))}
                                                />
                                                <span className="input-group-text">x</span>
                                                    <input 
                                                    type="number" 
                                                    className="form-control" style={{maxWidth: '100px'}}
                                                    value={data.curr_rate}
                                                    onChange={e => setData("curr_rate", Number(e.target.value))}
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="case-pay-method">Cara Bayar</label>
                                            <div className="col-sm-9">
                                                <select 
                                                    className="form-control" 
                                                    value={data.pay_method}
                                                    onChange={e => setData("pay_method", parseInt(e.target.value))}
                                                >
                                                    <option value="1" data-i18n="tahunan">Tahunan</option>
                                                    <option value="2" data-i18n="semester">Enam Bulanan</option>
                                                    <option value="4" data-i18n="triwulan">Tiga Bulanan</option>
                                                    <option value="12" data-i18n="bulanan">Bulanan</option>
                                                    <option value="0" data-i18n="sekaligus">Sekaligus</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="case-base-insure">U.P. Dasar</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="number" 
                                                    className="form-control"
                                                    value={data.base_insure}
                                                    onChange={e => setData("base_insure", Number(e.target.value))}
                                                />
                                            </div>
                                        </div>

                                        {/* Investments Table */}
                                        <div className="mb-3 row form-group">
                                            <label className="col-5 col-form-label fw-bold" data-i18n="investments">Pilihan Investasi</label>
                                            <div className="col-7 text-end">
                                                <button type="button" className="btn btn-sm btn-primary" onClick={addInvestment}>
                                                    <i className="fa fa-plus"></i>
                                                </button>
                                            </div>
                                            <div className="col-12 mt-2">
                                                <table className="table table-bordered table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th data-i18n="fund-name">Jenis Investasi</th>
                                                            <th data-i18n="allocation">Percent</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.investments.map((inv: z.infer<typeof investmentSchema>, idx: number) => (
                                                            <tr key={idx}>
                                                                <td>
                                                                    <select 
                                                                        className="form-control form-control-sm"
                                                                        value={inv.fund_id} 
                                                                        onChange={e => {
                                                                            const newInv = [...data.investments];
                                                                            newInv[idx] = { ...newInv[idx], fund_id: parseInt(e.target.value) };
                                                                            setData('investments', newInv);
                                                                        }}
                                                                    ></select>
                                                                </td>
                                                                <td>
                                                                    <input 
                                                                        type="text" 
                                                                        className="form-control form-control-sm"
                                                                        value={inv.allocation}
                                                                        onChange={e => {
                                                                            const newInv = [...data.investments];
                                                                            newInv[idx] = { ...newInv[idx], allocation: parseInt(e.target.value) };
                                                                            setData('investments', newInv);
                                                                        }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {data.investments.length === 0 && (
                                                            <tr><td colSpan={2} className="text-center text-muted">Belum ada investasi</td></tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Riders Table */}
                                        <div className="mb-3 row form-group">
                                            <label className="col-5 col-form-label fw-bold" data-i18n="riders">Asuransi Tambahan</label>
                                            <div className="col-7 text-end">
                                                <button type="button" className="btn btn-sm btn-primary" onClick={addRider}>
                                                    <i className="fa fa-plus"></i>
                                                </button>
                                            </div>
                                            <div className="col-12 mt-2">
                                                <table className="table table-bordered table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Asuransi Tambahan</th>
                                                            <th>U.P. Rider</th>
                                                            <th>Premi Rider</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.riders.map((rider: z.infer<typeof riderSchema>, idx: number) => (
                                                                <tr key={idx}>
                                                                <td>
                                                                    <select 
                                                                        className="form-control form-control-sm"
                                                                        value={rider.product_id}
                                                                        onChange={e => {
                                                                            const newRiders = [...data.riders];
                                                                            newRiders[idx] = { ...newRiders[idx], product_id: parseInt(e.target.value) };
                                                                            setData('riders', newRiders);
                                                                        }}
                                                                    ></select>
                                                                </td>
                                                                <td>
                                                                    <input 
                                                                        type="number" 
                                                                        className="form-control form-control-sm"
                                                                        value={rider.insure_amount}
                                                                        placeholder="U.P."
                                                                        onChange={e => {
                                                                            const newRiders = [...data.riders];
                                                                            newRiders[idx] = { ...newRiders[idx], insure_amount: parseInt(e.target.value) };
                                                                            setData('riders', newRiders);
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input 
                                                                        type="number" 
                                                                        className="form-control form-control-sm"
                                                                        value={rider.premium}
                                                                        placeholder="Premi"
                                                                        onChange={e => {
                                                                            const newRiders = [...data.riders];
                                                                            newRiders[idx] = { ...newRiders[idx], premium: parseInt(e.target.value) };
                                                                            setData('riders', newRiders);
                                                                        }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {data.riders.length === 0 && (
                                                            <tr><td colSpan={3} className="text-center text-muted">Belum ada rider</td></tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="mb-3 row form-group">
                                            <label className="col-sm-3 col-form-label" data-i18n="description">Keterangan</label>
                                            <div className="col-sm-9">
                                                <textarea 
                                                    className="form-control" 
                                                    rows={4}
                                                    value={data.description}
                                                    onChange={e => setData("description", e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </form>
                    </div>
                </div>
            </div>
            <UploadOcrModal show={ocrModalOpen} onHide={() => setOcrModalOpen(false)} />
        </TemplateLayout>
    );
}