import TemplateLayout from "@/layouts/TemplateLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import UploadOcrModal from "@/components/upload-ocr-modal";
import { Accordion, Card } from "react-bootstrap";


export default function PolicyForm({extracted, fileUrl, policy}: {extracted: unknown, fileUrl: string, policy: unknown}) {
    const isEdit = !!policy;

    // Initial form state with safe defaults
    const { data, setData, post, put, processing, errors } = useForm({
        // SP / Polis data
        case_code: policy?.["case_code"] || extracted.case_code || "",
        case_agent: policy?.["case_agent"] || extracted.case_agent || "",
        case_subagent: policy?.["case_subagent"] || extracted.case_subagent || "",
        case_entry_date: policy?.["case_entry_date"] || extracted.case_entry_date || "",
        case_tagih: policy?.["case_tagih"] || extracted.case_tagih || "1",
        insure_holder: policy?.["insure_holder"] || extracted.insure_holder || false,

        // Pemegang Polis
        customer_name: policy?.["customer_name"] || extracted.customer_name || "",
        customer_gender: policy?.["customer_gender"] || extracted.customer_gender || "1",
        customer_birthplace: policy?.["customer_birthplace"] || extracted.customer_birthplace || "",
        customer_birthdate: policy?.["customer_birthdate"] || extracted.customer_birthdate || "",
        customer_marital: policy?.["customer_marital"] || extracted.customer_marital || "1",
        customer_religion: policy?.["customer_religion"] || extracted.customer_religion || "0",
        customer_identity: policy?.["customer_identity"] || extracted.customer_identity || "",
        customer_profession: policy?.["customer_profession"] || extracted.customer_profession || "",
        customer_mobile: policy?.["customer_mobile"] || extracted.customer_mobile || "",
        customer_email: policy?.["customer_email"] || extracted.customer_email || "",
        customer_homeaddress: policy?.["customer_homeaddress"] || extracted.customer_homeaddress || "",
        customer_homepostal: policy?.["customer_homepostal"] || extracted.customer_homepostal || "",
        customer_homecity: policy?.["customer_homecity"] || extracted.customer_homecity || "",
        customer_workaddress: policy?.["customer_workaddress"] || extracted.customer_workaddress || "",
        customer_workpostal: policy?.["customer_workpostal"] || extracted.customer_workpostal || "",
        customer_workcity: policy?.["customer_workcity"] || extracted.customer_workcity || "",
        
        // Tertanggung
        insured_name: policy?.["insured_name"] || extracted.insured_name || extracted.customer_name || "",
        insured_gender: policy?.["insured_gender"] || extracted.insured_gender || "1",
        insured_birthplace: policy?.["insured_birthplace"] || extracted.insured_birthplace || "",
        insured_birthdate: policy?.["insured_birthdate"] || extracted.insured_birthdate || "",
        insured_marital: policy?.["insured_marital"] || extracted.insured_marital || "1",
        insured_relationship: policy?.["insured_relationship"] || extracted.insured_relationship || "",
        insured_profession: policy?.["insured_profession"] || extracted.insured_profession || "",
        insured_homeaddress: policy?.["insured_homeaddress"] || extracted.insured_homeaddress || "",
        insured_homepostal: policy?.["insured_homepostal"] || extracted.insured_homepostal || "",
        insured_homecity: policy?.["insured_homecity"] || extracted.insured_homecity || "",

        // Data Asuransi
        policy_no: policy?.["policy_no"] || extracted.policy_no || "",
        case_product: policy?.["case_product"] || extracted.case_product || "",
        case_currency: policy?.["case_currency"] || extracted.case_currency || "1",
        case_premium: policy?.["case_premium"] || extracted.case_premium || 0,
        case_curr_rate: policy?.["case_curr_rate"] || extracted.case_curr_rate || 1.00,
        case_pay_method: policy?.["case_pay_method"] || extracted.case_pay_method || "1",
        case_base_insure: policy?.["case_base_insure"] || extracted.case_base_insure || 0,
        
        // Investments & Riders
        investments: policy?.investments || extracted.investments || [],
        riders: policy?.riders || extracted.rider || [],
        
        case_description: policy?.["case_description"] || extracted.case_description || "",
    });

    const [ocrModalOpen, setOcrModalOpen] = useState(false);

    // Effect to sync holder name if checkbox is checked
    useEffect(() => {
        if (data.insure_holder) {
            setData((prev) => ({
                ...prev,
                insured_name: prev.customer_name,
                insured_gender: prev.customer_gender,
                insured_birthplace: prev.customer_birthplace,
                insured_birthdate: prev.customer_birthdate,
                insured_marital: prev.customer_marital,
                insured_profession: prev.customer_profession,
                insured_homeaddress: prev.customer_homeaddress,
                insured_homepostal: prev.customer_homepostal,
                insured_homecity: prev.customer_homecity,
                insured_workaddress: prev.customer_workaddress,
                insured_workpostal: prev.customer_workpostal,
                insured_workcity: prev.customer_workcity,
            }));
        }
    }, [data.insure_holder, setData]);


    const handleSubmit = () => {
        if (isEdit) {
            put(`/sales/policy/${policy.id}`);
        } else {
            post("/sales/policy");
        }
    };

    // Helper to add investment row
    const addInvestment = () => {
        setData('investments', [...data.investments, { fund_name: '', allocation_percent: '' }]);
    };

    // Helper to add rider row
    const addRider = () => {
        setData('riders', [...data.riders, { rider_name: '', rider_insure: '', rider_premium: '' }]);
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
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                            <h4>Polis</h4>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body className="p-0">
                                                <iframe src={`${fileUrl}#page=3&toolbar=0&navpanes=0`} width="100%" height="600px" />
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            )}
                        </div>
                    </div>

                    {/* Form */}
                    <div className="col-lg-6">
                        <form id="case-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            {/* Section 1: Data SP */}
                            <Accordion defaultActiveKey="0">
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="0">
                                        <h4>Data SP</h4>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="case-code">No. SP</label>
                                                <div className="col-sm-9">
                                                    <input 
                                                        type="text" 
                                                        className="form-control"
                                                        value={data.case_code}
                                                        onChange={e => setData("case_code", e.target.value)}
                                                    />
                                                    {errors.case_code && <div className="text-danger small">{errors.case_code}</div>}
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="agent">Agen</label>
                                                <div className="col-sm-9">
                                                    <select 
                                                        className="form-control" 
                                                        value={data.case_agent}
                                                        onChange={e => setData("case_agent", e.target.value)}
                                                    >
                                                        <option value="">Pilih Agen</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="subagent">Subagen</label>
                                                <div className="col-sm-9">
                                                    <select 
                                                        className="form-control" 
                                                        value={data.case_subagent}
                                                        onChange={e => setData("case_subagent", e.target.value)}
                                                    >
                                                            <option value="">Pilih Subagen</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="case-entry-date">Tanggal SP Masuk</label>
                                                <div className="col-sm-9">
                                                    <input 
                                                        type="date" 
                                                        className="form-control" 
                                                        value={data.case_entry_date}
                                                        onChange={e => setData("case_entry_date", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="tagih">Tagih</label>
                                                <div className="col-sm-9">
                                                    <select 
                                                        className="form-control"
                                                        value={data.case_tagih}
                                                        onChange={e => setData("case_tagih", e.target.value)}
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
                                                                checked={data.insure_holder}
                                                                onChange={e => setData("insure_holder", e.target.checked)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <label className="form-control" htmlFor="insure-holder">
                                                        Data pemegang polis sama dengan data tertanggung.
                                                    </label>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>

                                {/* Section 2: Pemegang Polis */}
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="1">
                                        <h4>Data Pemegang Polis</h4>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>
                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="complete-name">Nama Lengkap</label>
                                                <div className="col-sm-9">
                                                    <input 
                                                        type="text" 
                                                        className="form-control"
                                                        value={data.customer_name}
                                                        onChange={e => setData("customer_name", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="gender">Jenis Kelamin</label>
                                                <div className="col-sm-9">
                                                    <select 
                                                        className="form-control"
                                                        value={data.customer_gender}
                                                        onChange={e => setData("customer_gender", e.target.value)}
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
                                                        value={data.customer_birthplace}
                                                        onChange={e => setData("customer_birthplace", e.target.value)}
                                                    />
                                                    <input 
                                                        type="date" 
                                                        className="form-control"
                                                        value={data.customer_birthdate}
                                                        onChange={e => setData("customer_birthdate", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="customer-marital">Status</label>
                                                <div className="col-sm-9">
                                                    <select 
                                                        className="form-control"
                                                        value={data.customer_marital}
                                                        onChange={e => setData("customer_marital", e.target.value)}
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
                                                        value={data.customer_religion}
                                                        onChange={e => setData("customer_religion", e.target.value)}
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
                                                        value={data.customer_identity}
                                                        onChange={e => setData("customer_identity", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="profession">Pekerjaan</label>
                                                <div className="col-sm-9">
                                                    <input 
                                                        type="text" 
                                                        className="form-control"
                                                        value={data.customer_profession}
                                                        onChange={e => setData("customer_profession", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="mobile-number">Nomor Ponsel</label>
                                                <div className="col-sm-9">
                                                    <input 
                                                        type="text"
                                                        className="form-control"
                                                        value={data.customer_mobile}
                                                        onChange={e => setData("customer_mobile", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="email-address">Alamat e-Mail</label>
                                                <div className="col-sm-9">
                                                    <input 
                                                        type="email" 
                                                        className="form-control"
                                                        value={data.customer_email}
                                                        onChange={e => setData("customer_email", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="home-address">Alamat Rumah</label>
                                                <div className="col-sm-9">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={data.customer_homeaddress}
                                                        onChange={e => setData("customer_homeaddress", e.target.value)}
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
                                                        value={data.customer_homepostal}
                                                        onChange={e => setData("customer_homepostal", e.target.value)}
                                                    />
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        placeholder="Kota"
                                                        value={data.customer_homecity}
                                                        onChange={e => setData("customer_homecity", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="work-address">Alamat Kantor</label>
                                                <div className="col-sm-9">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={data.customer_workaddress}
                                                        onChange={e => setData("customer_workaddress", e.target.value)}
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
                                                        value={data.customer_workpostal}
                                                        onChange={e => setData("customer_workpostal", e.target.value)}
                                                    />
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        placeholder="Kota"
                                                        value={data.customer_workcity}
                                                        onChange={e => setData("customer_workcity", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>

                                {/* Section 3: Tertanggung */}
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="2">
                                        <h4>Data Tertanggung</h4>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body>
                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="complete-name">Nama Lengkap</label>
                                                <div className="col-sm-9">
                                                    <input 
                                                        type="text" 
                                                        className="form-control"
                                                        value={data.insured_name}
                                                        onChange={e => setData("insured_name", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="gender">Jenis Kelamin</label>
                                                <div className="col-sm-9">
                                                    <select 
                                                        className="form-control"
                                                        value={data.insured_gender}
                                                        onChange={e => setData("insured_gender", e.target.value)}
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
                                                        value={data.insured_birthplace}
                                                        onChange={e => setData("insured_birthplace", e.target.value)}
                                                    />
                                                    <input 
                                                        type="date" 
                                                        className="form-control"
                                                        value={data.insured_birthdate}
                                                        onChange={e => setData("insured_birthdate", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="marital-status">Status</label>
                                                <div className="col-sm-9">
                                                        <select 
                                                        className="form-control"
                                                        value={data.insured_marital}
                                                        onChange={e => setData("insured_marital", e.target.value)}
                                                    >
                                                        <option value="1" data-i18n="single">Single</option>
                                                        <option value="2" data-i18n="married">Kawin</option>
                                                        <option value="3" data-i18n="widow">Duda/Janda</option>
                                                        <option value="4" data-i18n="divorce">Cerai</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="relationship">Hubungan</label>
                                                <div className="col-sm-9">
                                                    <select 
                                                        className="form-control"
                                                        value={data.insured_relationship} // e.g., "4"
                                                        onChange={e => setData("insured_relationship", e.target.value)}
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
                                                        value={data.insured_profession}
                                                        onChange={e => setData("insured_profession", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="home-address">Alamat Rumah</label>
                                                <div className="col-sm-9">
                                                        <input 
                                                        type="text" 
                                                        className="form-control"
                                                        value={data.insured_homeaddress}
                                                        onChange={e => setData("insured_homeaddress", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        
                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="postal-code">Kode Pos / Kota</label>
                                                <div className="col-sm-9 d-flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" placeholder="Kode Pos" style={{maxWidth: '100px'}}
                                                        value={data.insured_homepostal}
                                                        onChange={e => setData("insured_homepostal", e.target.value)}
                                                    />
                                                    <input 
                                                        type="text" 
                                                        className="form-control" placeholder="Kota"
                                                        value={data.insured_homecity}
                                                        onChange={e => setData("insured_homecity", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>


                                {/* Section 4: Data Asuransi */}
                                <Card>
                                    <Accordion.Toggle as={Card.Header} eventKey="3">
                                        <h4>Data Asuransi</h4>
                                    </Accordion.Toggle>
                                    <Accordion.Collapse eventKey="3">
                                        <Card.Body>
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
                                                        value={data.case_product}
                                                        onChange={e => setData("case_product", e.target.value)}
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
                                                        value={data.case_currency}
                                                        onChange={e => setData("case_currency", e.target.value)}
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
                                                        value={data.case_premium}
                                                        onChange={e => setData("case_premium", Number(e.target.value))}
                                                    />
                                                    <span className="input-group-text">x</span>
                                                        <input 
                                                        type="number" 
                                                        className="form-control" style={{maxWidth: '100px'}}
                                                        value={data.case_curr_rate}
                                                        onChange={e => setData("case_curr_rate", Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 row form-group">
                                                <label className="col-sm-3 col-form-label" data-i18n="case-pay-method">Cara Bayar</label>
                                                <div className="col-sm-9">
                                                    <select 
                                                        className="form-control" 
                                                        value={data.case_pay_method}
                                                        onChange={e => setData("case_pay_method", e.target.value)}
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
                                                        value={data.case_base_insure}
                                                        onChange={e => setData("case_base_insure", Number(e.target.value))}
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
                                                            {data.investments.map((inv: unknown, idx: number) => (
                                                                <tr key={idx}>
                                                                    <td>
                                                                        <input 
                                                                            type="text" 
                                                                            className="form-control form-control-sm"
                                                                            value={inv.fund_name || inv.name} 
                                                                            onChange={e => {
                                                                                const newInv = [...data.investments];
                                                                                newInv[idx] = { ...newInv[idx], fund_name: e.target.value };
                                                                                setData('investments', newInv);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input 
                                                                            type="text" 
                                                                            className="form-control form-control-sm"
                                                                            value={inv.allocation_percent || inv.percent}
                                                                            onChange={e => {
                                                                                    const newInv = [...data.investments];
                                                                                newInv[idx] = { ...newInv[idx], allocation_percent: e.target.value };
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
                                                            {data.riders.map((rider: unknown, idx: number) => (
                                                                    <tr key={idx}>
                                                                    <td>
                                                                        <input 
                                                                            type="text" 
                                                                            className="form-control form-control-sm"
                                                                            value={rider.rider_name}
                                                                            placeholder="Nama Rider"
                                                                            onChange={e => {
                                                                                const newRiders = [...data.riders];
                                                                                newRiders[idx] = { ...newRiders[idx], rider_name: e.target.value };
                                                                                setData('riders', newRiders);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input 
                                                                            type="number" 
                                                                            className="form-control form-control-sm"
                                                                            value={rider.rider_insure}
                                                                            placeholder="U.P."
                                                                            onChange={e => {
                                                                                    const newRiders = [...data.riders];
                                                                                newRiders[idx] = { ...newRiders[idx], rider_insure: e.target.value };
                                                                                setData('riders', newRiders);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input 
                                                                            type="number" 
                                                                            className="form-control form-control-sm"
                                                                            value={rider.rider_premium}
                                                                            placeholder="Premi"
                                                                            onChange={e => {
                                                                                    const newRiders = [...data.riders];
                                                                                newRiders[idx] = { ...newRiders[idx], rider_premium: e.target.value };
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
                                                        value={data.case_description}
                                                        onChange={e => setData("case_description", e.target.value)}
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </form>
                    </div>
                </div>
            </div>
            <UploadOcrModal show={ocrModalOpen} onHide={() => setOcrModalOpen(false)} />
        </TemplateLayout>
    );
}