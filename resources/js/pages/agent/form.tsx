import TemplateLayout from "@/layouts/TemplateLayout";
import { Head, useForm } from "@inertiajs/react";
import { Accordion, Card } from "react-bootstrap";


export default function AgentForm({ fileUrl, agent, agencies, programs, agents }: { fileUrl: string, agent: unknown, agencies: unknown[], programs: unknown[], agents: unknown[] }) {
    const isEdit = !!agent;

    // Initial form state with safe defaults
    const { data, setData, post, put, processing } = useForm({
        'agent-code': agent?.['agent-code'] || '',
        'agent-number': agent?.['agent-number'] || '',
        'apply-date': agent?.['apply-date'] || '',
        'apply-place': agent?.['apply-place'] || '',
        'apply-agency': agent?.['apply-agency'] || '',
        'agent-name': agent?.['agent-name'] || '',
        'agent-gender': agent?.['agent-gender'] || '1',
        'agent-birth-place': agent?.['agent-birth-place'] || '',
        'agent-birth-date': agent?.['agent-birth-date'] || '',
        'agent-address': agent?.['agent-address'] || '',
        'agent-religion': agent?.['agent-religion'] || '',
        'agent-idno': agent?.['agent-idno'] || '',
        'agent-taxno': agent?.['agent-taxno'] || '',
        'agent-city': agent?.['agent-city'] || '',
        'agent-province': agent?.['agent-province'] || '',
        'agent-postal': agent?.['agent-postal'] || '',
        'agent-education': agent?.['agent-education'] || '',
        'agent-phone': agent?.['agent-phone'] || '',
        'agent-mobile': agent?.['agent-mobile'] || '',
        'agent-email': agent?.['agent-email'] || '',
        'agent-status': agent?.['agent-status'] || '1',
        'agent-spouse': agent?.['agent-spouse'] || '',
        'agent-occupation': agent?.['agent-occupation'] || '',
        'agent-dependents': agent?.['agent-dependents'] || 0,
        'agent-license': agent?.['agent-license'] || '',
        'agent-duedate': agent?.['agent-duedate'] || '',
        'agent-recruiter': agent?.['agent-recruiter'] || '',
        'agent-notes': agent?.['agent-notes'] || '',
        
        programs: agent?.programs || [],
    });

    const handleSubmit = () => {
        if (isEdit) {
            put(`/master/agent/${agent.id}`);
        } else {
            post("/master/agent");
        }
    };

    // Helper to add program row
    const addProgram = () => {
        setData('programs', [...data.programs, { program_start: '', position: '', agent_leader: '', program: '', allowance: '' }]);
    };

    const removeProgram = (index: number) => {
        const newPrograms = [...data.programs];
        newPrograms.splice(index, 1);
        setData('programs', newPrograms);
    };

    return (
        <TemplateLayout>
            <Head title={isEdit ? "Sunting Data SP" : "Input Data SP"} />
            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="agent-input">Agen</h3>&emsp;
                        <button type="submit" className="btn btn-primary pull-right" disabled={processing} onClick={handleSubmit}>Perbarui</button>
                    </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="master">Master</a></li>
                            <li className="breadcrumb-item active" data-i18n="agent-input">Agen</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div style={{ position: 'sticky', top: '20px' }}>
                            {fileUrl && (
                                <Accordion className="mb-4">
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                            <h4>Berkas Keagenan</h4>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body className="p-0">
                                                <iframe src={`${fileUrl}#toolbar=0&navpanes=0`} width="100%" height="600px" />
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <Accordion>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="0">
                                    <h4 className="card-title" data-i18n="personal-data">Data Pribadi</h4>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="name-as-id">Nama sesuai KTP</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    value={data['agent-name']}
                                                    onChange={e => setData('agent-name', e.target.value)}
                                                    data-i18n="[placeholder]agent_name_inst"
                                                />
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="gender">Jenis Kelamin</label>
                                            <div className="col-sm-9">
                                                <select 
                                                    className="form-control" 
                                                    value={data['agent-gender']}
                                                    onChange={e => setData('agent-gender', e.target.value)}
                                                >
                                                    <option value="1" data-i18n="male">Pria</option>
                                                    <option value="2" data-i18n="female">Wanita</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="place_date_birth">Tempat dan Tanggal Lahir</label>
                                            <div className="col-sm-9 d-flex gap-2">
                                                <input 
                                                    type="text" 
                                                    className="form-control flex-grow-1"
                                                    value={data['agent-birth-place']}
                                                    onChange={e => setData('agent-birth-place', e.target.value)}
                                                />
                                                <input 
                                                    type="date" 
                                                    className="form-control"
                                                    style={{ width: 'auto' }}
                                                    value={data['agent-birth-date']}
                                                    onChange={e => setData('agent-birth-date', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="address">Alamat</label>
                                            <div className="col-sm-9">
                                                <textarea 
                                                    rows={2} 
                                                    className="form-control"
                                                    value={data['agent-address']}
                                                    onChange={e => setData('agent-address', e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="agent-religion">Agama</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data['agent-religion']}
                                                    onChange={e => setData('agent-religion', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="id-number">No. KTP</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data['agent-idno']}
                                                    onChange={e => setData('agent-idno', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="tax-number">NPWP</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data['agent-taxno']}
                                                    onChange={e => setData('agent-taxno', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="marketing-city">Kota Marketing</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data['agent-city']}
                                                    onChange={e => setData('agent-city', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="province">Provinsi</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data['agent-province']}
                                                    onChange={e => setData('agent-province', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="postal-code">Kode Pos</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data['agent-postal']}
                                                    onChange={e => setData('agent-postal', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="last-education">Pendidikan Terakhir</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data['agent-education']}
                                                    onChange={e => setData('agent-education', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="phone-number">Nomor Telfon</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="tel" 
                                                    className="form-control"
                                                    value={data['agent-phone']}
                                                    onChange={e => setData('agent-phone', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="mobile-number">Nomor Ponsel</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="tel" 
                                                    className="form-control"
                                                    value={data['agent-mobile']}
                                                    onChange={e => setData('agent-mobile', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="email-address">Alamat e-Mail</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="email" 
                                                    className="form-control"
                                                    value={data['agent-email']}
                                                    onChange={e => setData('agent-email', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="agent-status">Status</label>
                                            <div className="col-sm-9">
                                                <select 
                                                    className="form-control" 
                                                    value={data['agent-status']}
                                                    onChange={e => setData('agent-status', e.target.value)}
                                                >
                                                    <option value="1" data-i18n="single">Single</option>
                                                    <option value="2" data-i18n="married">Kawin</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="spouse-name">Nama Suami / Isteri</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Diisi bila menikah"
                                                    value={data['agent-spouse']}
                                                    onChange={e => setData('agent-spouse', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="occupation">Pekerjaan</label>
                                            <div className="col-sm-9">
                                                <input 
                                                    type="text" 
                                                    className="form-control"
                                                    value={data['agent-occupation']}
                                                    onChange={e => setData('agent-occupation', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="number-dependents">Jumlah Tanggungan</label>
                                            <div className="col-sm-9">
                                                <div className="input-group">
                                                    <input 
                                                        type="number" 
                                                        className="form-control"
                                                        value={data['agent-dependents']}
                                                        onChange={e => setData('agent-dependents', Number(e.target.value))}
                                                    />
                                                    <span className="input-group-text" data-i18n="people">orang</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row form-group mb-3">
                                            <label className="col-sm-3 col-form-label" data-i18n="notes">Catatan</label>
                                            <div className="col-sm-9">
                                                <textarea 
                                                    rows={2} 
                                                    className="form-control"
                                                    value={data['agent-notes']}
                                                    onChange={e => setData('agent-notes', e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>

                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="0">
                                    <h4 className="card-title" data-i18n="agent_status">Status Agen</h4>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        <div className="basic-form">
                                            <div className="row form-group mb-3">
                                                <label className="col-sm-3 col-form-label" data-i18n="apply-date">Tanggal Pengisian</label>
                                                <div className="col-sm-9">
                                                    <input 
                                                        type="date" 
                                                        className="form-control"
                                                        value={data['apply-date']}
                                                        onChange={e => setData('apply-date', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row form-group mb-3">
                                                <label className="col-sm-3 col-form-label" data-i18n="apply-place">Tempat Pengisian</label>
                                                <div className="col-sm-9">
                                                    <input 
                                                        type="text" 
                                                        className="form-control"
                                                        value={data['apply-place']}
                                                        onChange={e => setData('apply-place', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row form-group mb-3">
                                                <label className="col-sm-3 col-form-label" data-i18n="apply-agency">Agency / Regional</label>
                                                <div className="col-sm-9">
                                                    <select 
                                                        className="form-control"
                                                        value={data['apply-agency']}
                                                        onChange={e => setData('apply-agency', e.target.value)}
                                                    >
                                                        <option value="">Pilih Agency</option>
                                                        {agencies.map((agency: unknown) => (
                                                            <option key={agency['agency-code']} value={agency['agency-code']}>
                                                                {agency['agency-name']}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row form-group mb-3">
                                                <label className="col-sm-3 col-form-label" data-i18n="agent-number">Kode Agen</label>
                                                <div className="col-sm-9">
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={data['agent-number']}
                                                        onChange={e => setData('agent-number', e.target.value)}
                                                        data-i18n="[placeholder]agent_code_inst"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row form-group mb-3">
                                                <label className="col-sm-3 col-form-label" data-i18n="agent-license">Nomor Lisensi</label>
                                                <div className="col-sm-9">
                                                    <input 
                                                        type="text" 
                                                        className="form-control"
                                                        value={data['agent-license']}
                                                        onChange={e => setData('agent-license', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row form-group mb-3">
                                                <label className="col-sm-3 col-form-label" data-i18n="payable-date">Jatuh Tempo</label>
                                                <div className="col-sm-9">
                                                    <input 
                                                        type="date" 
                                                        className="form-control"
                                                        value={data['agent-duedate']}
                                                        onChange={e => setData('agent-duedate', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row form-group mb-3">
                                                <label className="col-sm-3 col-form-label" data-i18n="recruiter">Perekruit</label>
                                                <div className="col-sm-9">
                                                    <select 
                                                        className="form-control"
                                                        value={data['agent-recruiter']}
                                                        onChange={e => setData('agent-recruiter', e.target.value)}
                                                    >
                                                        <option value="">Pilih Perekruit</option>
                                                        {agents.map((recruiter: unknown) => (
                                                            <option key={recruiter.id} value={recruiter.id}>
                                                                {recruiter['agent-name']}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row form-group">
                                                <label className="col-sm-3" data-i18n="agent_level">Program Allowance</label>
                                                <div className="col-sm-9">
                                                    <button id="program-launcher" className="btn btn-primary" type="button" onClick={addProgram}>
                                                        <i className="fa fa-plus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="row form-group">
                                                <div className="col-sm-12">
                                                    <table id="table-agentprogram" data-toggle="table">
                                                        <thead>
                                                            <tr>
                                                                <th className="col-xs-2" data-field="program-start">Mulai Program</th>
                                                                <th className="col-xs-2" data-field="position" data-formatter="LevelFormatter">Jabatan</th>
                                                                <th className="col-xs-2" data-field="agent-leader" data-formatter="LeaderFormatter">Leader Langsung</th>
                                                                <th className="col-xs-3" data-field="program">Program</th>
                                                                <th className="col-xs-3" data-field="allowance" data-formatter="agentprogramIDRFormatter">Allowance</th>
                                                                <th className="col-xs-1" data-field="agentprogram-code" data-formatter="agentprogramActionFormatter" data-events="agentprogramActionHandler"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.programs.map((program: unknown, idx: number) => (
                                                                    <tr key={idx}>
                                                                    <td>
                                                                        <input 
                                                                            type="date" 
                                                                            className="form-control form-control-sm"
                                                                            value={program.program_start}
                                                                            onChange={e => {
                                                                                const newPrograms = [...data.programs];
                                                                                newPrograms[idx] = { ...newPrograms[idx], program_start: e.target.value };
                                                                                setData('programs', newPrograms);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <select 
                                                                            className="form-control"
                                                                            value={program.position}
                                                                            onChange={e => {
                                                                                const newPrograms = [...data.programs];
                                                                                newPrograms[idx] = { ...newPrograms[idx], position: e.target.value };
                                                                                setData('programs', newPrograms);
                                                                            }}
                                                                        >
                                                                            <option value="FC">Financial Consultant</option>
                                                                            <option value="BP*">Business Partner Bintang 1</option>
                                                                            <option value="BP**">Business Partner Bintang 2</option>
                                                                            <option value="BP***">Business Partner Bintang 3</option>
                                                                        </select>
                                                                    </td>
                                                                    <td>
                                                                        <select 
                                                                            className="form-control" 
                                                                            value={program.agent_leader} 
                                                                            onChange={e => {
                                                                                const newPrograms = [...data.programs];
                                                                                newPrograms[idx] = { ...newPrograms[idx], agent_leader: e.target.value };
                                                                                setData('programs', newPrograms);
                                                                            }}
                                                                        >
                                                                            <option value="">Select Leader</option>
                                                                            {agents.map((agent: unknown, idx: number) => (
                                                                                <option key={idx} value={agent.id}>{agent.name}</option>
                                                                            ))}
                                                                        </select>
                                                                    </td>
                                                                    <td>
                                                                        <select 
                                                                            className="form-control" 
                                                                            value={program.program} 
                                                                            onChange={e => {
                                                                                const newPrograms = [...data.programs];
                                                                                newPrograms[idx] = { ...newPrograms[idx], program: e.target.value };
                                                                                setData('programs', newPrograms);
                                                                            }}
                                                                        >
                                                                            {programs.map((program: unknown, idx: number) => (
                                                                                <option key={idx} value={program.id}>{program.name}</option>
                                                                            ))}
                                                                        </select>
                                                                    </td>
                                                                    <td>
                                                                        <input 
                                                                            type="number" 
                                                                            className="form-control form-control-sm"
                                                                            value={program.allowance}
                                                                            onChange={e => {
                                                                                const newPrograms = [...data.programs];
                                                                                newPrograms[idx] = { ...newPrograms[idx], allowance: e.target.value };
                                                                                setData('programs', newPrograms);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <button 
                                                                            onClick={() => removeProgram(idx)}
                                                                            className="btn btn-sm btn-danger"
                                                                            title="Delete"
                                                                        >
                                                                            <i className="la la-ban"></i>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </div>
                </div>
            </div>
        </TemplateLayout>
    );
}