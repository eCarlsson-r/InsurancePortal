import TemplateLayout from "@/layouts/TemplateLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import UploadOcrModal from "@/components/upload-ocr-modal";

interface ExtractedData {
    case_code?: string;
    holder_name?: string;
    insured_name?: string;
    investments?: Array<{ fund_name: string; allocation_percent: string | number }>;
    rider?: Array<{ fund_name: string; allocation_percent: string | number; [key: string]: any }>;
    [key: string]: any;
}

interface PolicyFormProps {
    extracted?: { data?: ExtractedData } | ExtractedData | null;
    policy?: any;
}

export default function PolicyForm({ extracted, policy }: PolicyFormProps) {
    const isEdit = !!policy;
    
    // Normalize extracted data safely
    let initialData: ExtractedData = {};
    if (extracted) {
        if ('data' in extracted && extracted.data) {
            initialData = extracted.data as ExtractedData;
        } else {
            initialData = extracted as ExtractedData;
        }
    }

    // Initial form state with safe defaults
    const { data, setData, post, put, processing, errors } = useForm({
        // SP / Polis data
        case_code: policy?.["case_code"] || initialData.case_code || "",
        case_agent: policy?.["case_agent"] || initialData.case_agent || "",
        case_subagent: policy?.["case_subagent"] || initialData.case_subagent || "",
        case_entry_date: policy?.["case_entry_date"] || initialData.case_entry_date || "",
        case_customer: policy?.["case_customer"] || initialData.case_customer || "",
        case_tagih: policy?.["case_tagih"] || initialData.case_tagih || "1",
        insure_holder: policy?.["insure_holder"] || initialData.insure_holder || false,
        
        // Tertanggung
        insured_name: policy?.["insured_name"] || initialData.insured_name || initialData.holder_name || "",
        insured_gender: policy?.["insured_gender"] || initialData.insured_gender || "1",
        insured_birthplace: policy?.["insured_birthplace"] || initialData.insured_birthplace || "",
        insured_birthdate: policy?.["insured_birthdate"] || initialData.insured_birthdate || "",
        insured_marital: policy?.["insured_marital"] || initialData.insured_marital || "1",
        case_relation: policy?.["case_relation"] || initialData.case_relation || "",
        insured_profession: policy?.["insured_profession"] || initialData.insured_profession || "",
        insured_homeaddress: policy?.["insured_homeaddress"] || initialData.insured_homeaddress || "",
        insured_homepostal: policy?.["insured_homepostal"] || initialData.insured_homepostal || "",
        insured_homecity: policy?.["insured_homecity"] || initialData.insured_homecity || "",

        // Data Asuransi
        policy_no: policy?.["policy_no"] || initialData.policy_no || "",
        case_product: policy?.["case_product"] || initialData.case_product || "",
        case_currency: policy?.["case_currency"] || initialData.case_currency || "1",
        case_premium: policy?.["case_premium"] || initialData.case_premium || 0,
        case_curr_rate: policy?.["case_curr_rate"] || initialData.case_curr_rate || 1.00,
        case_pay_method: policy?.["case_pay_method"] || initialData.case_pay_method || "1",
        case_base_insure: policy?.["case_base_insure"] || initialData.case_base_insure || 0,
        
        // Investments & Riders
        investments: policy?.investments || initialData.investments || [],
        riders: policy?.riders || initialData.rider || [],
        
        case_description: policy?.["case_description"] || "",
    });

    const [ocrModalOpen, setOcrModalOpen] = useState(false);

    // Effect to sync holder name if checkbox is checked
    useEffect(() => {
        if (data.insure_holder) {
            // Logic to copy holder data to insured data could be added here
            // validation or copy logic if needed specific to this app
        }
    }, [data.insure_holder]);


    const handleSubmit = () => {
        if (isEdit) {
            put(route("sales.policy.update", policy.id));
        } else {
            post(route("sales.policy.store"));
        }
    };

    // Helper to add investment row
    const addInvestment = () => {
        setData('investments', [...data.investments, { fund_name: '', allocation_percent: '' }]);
    };

    // Helper to add rider row
    const addRider = () => {
        // @ts-ignore
        setData('riders', [...data.riders, { fund_name: '', allocation_percent: '', rider_insure: '', rider_premium: '' }]);
    };

    return (
        <TemplateLayout>
            <Head title={isEdit ? "Sunting Data SP" : "Input Data SP"} />
            
            <div className="row page-titles ">
                    <div className="col-12 p-md-0 d-sm-flex align-items-center justify-content-between">
                        <h2 className="text-black font-w600">{isEdit ? "Sunting Data SP" : "Input Data SP"}</h2>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active"><a href="#">Form</a></li>
                        </ol>
                    </div>
            </div>

            <form id="case-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                
                {/* Section 1: Data SP */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <h4 className="mb-4">Data SP</h4>
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
                        <label className="col-sm-3 col-form-label" data-i18n="customer">Nasabah</label>
                        <div className="col-sm-9">
                                <select 
                                className="form-control" 
                                value={data.case_customer}
                                onChange={e => setData("case_customer", e.target.value)}
                            >
                                    <option value="">Pilih Nasabah</option>
                            </select>
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
                </div>

                {/* Section 2: Tertanggung */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <h4 className="mb-4">Tertanggung</h4>
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
                            <input 
                                type="text" 
                                className="form-control"
                                value={data.case_relation}
                                onChange={e => setData("case_relation", e.target.value)}
                            />
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
                </div>

                {/* Section 3: Data Asuransi */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                    <h4 className="mb-4">Data Asuransi</h4>
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
                                    {data.investments.map((inv: any, idx: number) => (
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
                                    {data.riders.map((rider: any, idx: number) => (
                                            <tr key={idx}>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    className="form-control form-control-sm"
                                                    value={rider.fund_name || rider.name}
                                                    placeholder="Nama Rider"
                                                    onChange={e => {
                                                        const newRiders = [...data.riders];
                                                        newRiders[idx] = { ...newRiders[idx], fund_name: e.target.value };
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
                </div>

                <div className="d-flex justify-content-end p-4 bg-white rounded-lg shadow-sm">
                    <button type="submit" className="btn btn-primary" disabled={processing}>
                        <i className="fa fa-save me-2"></i>
                        {isEdit ? 'Perbaharui' : 'Simpan'}
                    </button>
                </div>

            </form>
            
            <UploadOcrModal show={ocrModalOpen} onHide={() => setOcrModalOpen(false)} />
        </TemplateLayout>
    );
}