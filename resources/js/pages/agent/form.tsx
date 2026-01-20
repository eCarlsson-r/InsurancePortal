import SelectInput from '@/components/form/select-input';
import TextareaInput from '@/components/form/textarea-input';
import TextInput from '@/components/form/text-input';
import DateInput from '@/components/form/date-input';
import FormPage from '@/layouts/FormPage';
import {
    agencySchema,
    agentProgramSchema,
    agentSchema,
    programSchema,
} from '@/schemas/models';
import { useForm } from '@inertiajs/react';
import { Accordion, InputGroup, Table } from 'react-bootstrap';
import { z } from 'zod';
import SubmitButton from '@/components/form/submit-button';

type AgentFormData = Omit<
    z.infer<typeof agentSchema>,
    | 'agency_id'
    | 'gender'
    | 'status'
    | 'dependents'
    | 'recruiter_id'
    | 'programs'
> & {
    agency_id: number | '';
    gender: number | '';
    status: number | '';
    dependents: number | '';
    recruiter_id: number | '';
    programs: z.infer<typeof agentProgramSchema>[];
};

export default function AgentForm({
    fileUrl,
    agent,
    agencies,
    programs,
    agents,
}: {
    fileUrl: string;
    agent?: z.infer<typeof agentSchema> | null;
    agencies: z.infer<typeof agencySchema>[];
    programs: z.infer<typeof programSchema>[];
    agents: z.infer<typeof agentSchema>[];
}) {
    const isEdit = !!agent;

    // Initial form state with safe defaults
    const { data, setData, post, put, processing } = useForm<AgentFormData>(
        isEdit && agent
            ? agent
            : {
                  official_number: '',
                  apply_date: '',
                  apply_place: '',
                  agency_id: '',
                  name: '',
                  gender: '',
                  birth_place: '',
                  birth_date: '',
                  address: '',
                  religion: '',
                  identity_number: '',
                  tax_number: '',
                  city: '',
                  province: '',
                  postal_code: '',
                  education: '',
                  phone: '',
                  mobile: '',
                  email: '',
                  status: '',
                  spouse: '',
                  occupation: '',
                  dependents: '',
                  license: '',
                  due_date: '',
                  recruiter_id: '',
                  notes: '',
                  programs: [
                      {
                          program_start: '',
                          position: '',
                          agent_leader_id: null,
                          program_id: null,
                          allowance: null,
                      },
                  ],
              },
    );

    const handleSubmit = () => {
        if (isEdit) {
            put(`/master/agent/${agent.id}`);
        } else {
            post('/master/agent');
        }
    };

    // Helper to add program row
    const addProgram = () => {
        setData('programs', [
            ...data.programs,
            {
                program_start: '',
                position: '',
                agent_leader_id: null,
                program_id: null,
                allowance: null,
            },
        ]);
    };

    const removeProgram = (index: number) => {
        const newPrograms = [...data.programs];
        newPrograms.splice(index, 1);
        setData('programs', newPrograms);
    };

    return (
        <FormPage
            headTitle={isEdit ? 'Sunting Agen' : 'Tambah Agen'}
            title="Agen"
            i18nTitle="agent"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: 'Agen', active: true, i18n: 'agent' },
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
                    <div style={{ position: 'sticky', top: '20px' }}>
                        {fileUrl && (
                            <Accordion
                                defaultActiveKey="0"
                                className="mb-4"
                            >
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header as="h4">
                                        Berkas Keagenan
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <iframe
                                            src={`${fileUrl}#toolbar=0&navpanes=0`}
                                            width="100%"
                                            height="600px"
                                            style={{ border: 'none' }}
                                        />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        )}
                    </div>
                </div>
                <div className="col-md-6">
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header as="h4">
                                Data Pribadi
                            </Accordion.Header>

                            <Accordion.Body>
                                <TextInput
                                    id="name"
                                    label="Nama sesuai KTP"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    data-i18n="name-as-id"
                                    row
                                />

                                <SelectInput
                                    id="gender"
                                    label="Jenis Kelamin"
                                    value={data.gender}
                                    onChange={(e) =>
                                        setData('gender', e.target.value === '' ? '' : parseInt(e.target.value, 10))
                                    }
                                    data-i18n="gender"
                                    row
                                    options={[
                                        { value: 1, label: 'Pria', i18n: 'male' },
                                        { value: 2, label: 'Wanita', i18n: 'female' },
                                    ]}
                                />

                                <div className="row form-group mb-3">
                                    <label
                                        className="col-sm-3 col-form-label"
                                        data-i18n="place_date_birth"
                                    >
                                        Tempat dan Tanggal Lahir
                                    </label>
                                    <div className="col-sm-9 d-flex gap-2">
                                        <input
                                            type="text"
                                            className="form-control flex-grow-1"
                                            value={data.birth_place}
                                            onChange={(e) =>
                                                setData(
                                                    'birth_place',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <DateInput
                                            id="birth_date"
                                            className="form-control"
                                            style={{ width: 'auto' }}
                                            value={data.birth_date}
                                            onChange={(e) =>
                                                setData(
                                                    'birth_date',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <TextareaInput
                                    id="address"
                                    label="Alamat"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    data-i18n="address"
                                    rows={2}
                                    row
                                />

                                <TextInput
                                    id="religion"
                                    label="Agama"
                                    value={data.religion}
                                    onChange={(e) => setData('religion', e.target.value)}
                                    data-i18n="religion"
                                    row
                                />

                                <TextInput
                                    id="identity_number"
                                    label="No. KTP"
                                    value={data.identity_number}
                                    onChange={(e) => setData('identity_number', e.target.value)}
                                    data-i18n="id-number"
                                    row
                                />

                                <TextInput
                                    id="tax_number"
                                    label="NPWP"
                                    value={data.tax_number}
                                    onChange={(e) => setData('tax_number', e.target.value)}
                                    data-i18n="tax-number"
                                    row
                                />

                                <TextInput
                                    id="city"
                                    label="Kota Marketing"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    data-i18n="marketing-city"
                                    row
                                />

                                <TextInput
                                    id="province"
                                    label="Provinsi"
                                    value={data.province}
                                    onChange={(e) => setData('province', e.target.value)}
                                    data-i18n="province"
                                    row
                                />

                                <TextInput
                                    id="postal_code"
                                    label="Kode Pos"
                                    value={data.postal_code}
                                    onChange={(e) => setData('postal_code', e.target.value)}
                                    data-i18n="postal-code"
                                    row
                                />

                                <TextInput
                                    id="education"
                                    label="Pendidikan Terakhir"
                                    value={data.education}
                                    onChange={(e) => setData('education', e.target.value)}
                                    data-i18n="last-education"
                                    row
                                />

                                <TextInput
                                    id="phone"
                                    label="Nomor Telfon"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    data-i18n="phone-number"
                                    row
                                />

                                <TextInput
                                    id="mobile"
                                    label="Nomor Ponsel"
                                    type="tel"
                                    value={data.mobile}
                                    onChange={(e) => setData('mobile', e.target.value)}
                                    data-i18n="mobile-number"
                                    row
                                />

                                <TextInput
                                    id="email"
                                    label="Alamat e-Mail"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    data-i18n="email-address"
                                    row
                                />

                                <SelectInput
                                    id="status"
                                    label="Status"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData('status', e.target.value === '' ? '' : parseInt(e.target.value, 10))
                                    }
                                    data-i18n="status"
                                    row
                                    options={[
                                        { value: 1, label: 'Single', i18n: 'single' },
                                        { value: 2, label: 'Kawin', i18n: 'married' },
                                    ]}
                                />

                                <TextInput
                                    id="spouse"
                                    label="Nama Suami / Isteri"
                                    value={data.spouse}
                                    onChange={(e) => setData('spouse', e.target.value)}
                                    placeholder="Diisi bila menikah"
                                    data-i18n="spouse-name"
                                    row
                                />

                                <TextInput
                                    id="occupation"
                                    label="Pekerjaan"
                                    value={data.occupation}
                                    onChange={(e) => setData('occupation', e.target.value)}
                                    data-i18n="occupation"
                                    row
                                />

                                <div className="row form-group mb-3">
                                    <label
                                        className="col-sm-3 col-form-label"
                                        data-i18n="number-dependents"
                                    >
                                        Jumlah Tanggungan
                                    </label>
                                    <div className="col-sm-9">
                                        <InputGroup>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={data.dependents}
                                                onChange={(e) =>
                                                    setData(
                                                        'dependents',
                                                        e.target.value ===
                                                            ''
                                                            ? ''
                                                            : Number(
                                                                  e.target
                                                                      .value,
                                                              ),
                                                    )
                                                }
                                            />
                                            <InputGroup.Text> orang</InputGroup.Text>
                                        </InputGroup>
                                    </div>
                                </div>

                                <TextareaInput
                                    id="notes"
                                    label="Catatan"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    data-i18n="notes"
                                    rows={2}
                                    row
                                />
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header as="h4">
                                Status Agen
                            </Accordion.Header>
                            <Accordion.Body>
                                <DateInput
                                    id="apply_date"
                                    label="Tanggal Pengisian"
                                    value={data.apply_date}
                                    onChange={(e) => setData('apply_date', e.target.value)}
                                    data-i18n="apply-date"
                                    row
                                />

                                <TextInput
                                    id="apply_place"
                                    label="Tempat Pengisian"
                                    value={data.apply_place}
                                    onChange={(e) => setData('apply_place', e.target.value)}
                                    data-i18n="apply-place"
                                    row
                                />

                                <SelectInput
                                    id="agency_id"
                                    label="Agency / Regional"
                                    value={data.agency_id}
                                    onChange={(e) =>
                                        setData('agency_id', e.target.value === '' ? '' : parseInt(e.target.value, 10))
                                    }
                                    data-i18n="apply-agency"
                                    row
                                    options={[
                                        { value: '', label: 'Pilih Agency' },
                                        ...agencies.map((agency) => ({
                                            value: agency.id || 0,
                                            label: agency.name,
                                        })),
                                    ]}
                                />

                                <TextInput
                                    id="official_number"
                                    label="Kode Agen"
                                    value={data.official_number}
                                    onChange={(e) => setData('official_number', e.target.value)}
                                    data-i18n="official_number"
                                    placeholder="Kode Agen"
                                    row
                                />

                                <TextInput
                                    id="license"
                                    label="Nomor Lisensi"
                                    value={data.license}
                                    onChange={(e) => setData('license', e.target.value)}
                                    data-i18n="license"
                                    row
                                />

                                <DateInput
                                    id="due_date"
                                    label="Jatuh Tempo"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    data-i18n="payable-date"
                                    row
                                />

                                <SelectInput
                                    id="recruiter_id"
                                    label="Perekruit"
                                    value={data.recruiter_id}
                                    onChange={(e) =>
                                        setData('recruiter_id', e.target.value === '' ? '' : parseInt(e.target.value, 10))
                                    }
                                    data-i18n="recruiter"
                                    row
                                    options={[
                                        { value: '', label: 'Pilih Perekruit' },
                                        ...agents.map((recruiter) => ({
                                            value: recruiter.id || 0,
                                            label: recruiter.name,
                                        })),
                                    ]}
                                />
                                <div className="row form-group mt-4">
                                    <div className="col-12 d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="mb-0" data-i18n="agent_level">Program Allowance</h6>
                                        <button
                                            id="program-launcher"
                                            className="btn btn-sm btn-primary"
                                            type="button"
                                            onClick={addProgram}
                                        >
                                            <i className="fa fa-plus me-1"></i>
                                            Tambah
                                        </button>
                                    </div>
                                    <div className="col-12">
                                        <div className="table-responsive">
                                            <Table className="table-sm table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '130px' }} data-i18n="program-start">Mulai</th>
                                                        <th style={{ width: '150px' }} data-i18n="position">Jabatan</th>
                                                        <th data-i18n="leader">Leader Langsung</th>
                                                        <th data-i18n="program">Program</th>
                                                        <th style={{ width: '120px' }} data-i18n="allowance">Allowance</th>
                                                        <th style={{ width: '40px' }}></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.programs &&
                                                        data.programs.map(
                                                            (
                                                                program,
                                                                idx,
                                                            ) => (
                                                                <tr key={idx}>
                                                                    <td>
                                                                        <DateInput
                                                                            id={`program_start_${idx}`}
                                                                            className="form-control-sm"
                                                                            value={program.program_start}
                                                                            onChange={(e) => {
                                                                                const newPrograms = [...data.programs];
                                                                                newPrograms[idx] = {
                                                                                    ...newPrograms[idx],
                                                                                    program_start: e.target.value,
                                                                                };
                                                                                setData('programs', newPrograms);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <select
                                                                            className="form-control form-control-sm"
                                                                            value={program.position}
                                                                            onChange={(e) => {
                                                                                const newPrograms = [...data.programs];
                                                                                newPrograms[idx] = {
                                                                                    ...newPrograms[idx],
                                                                                    position: e.target.value,
                                                                                };
                                                                                setData('programs', newPrograms);
                                                                            }}
                                                                        >
                                                                            <option value="FC">Financial Consultant</option>
                                                                            <option value="BP*">Business Partner *</option>
                                                                            <option value="BP**">Business Partner **</option>
                                                                            <option value="BP***">Business Partner ***</option>
                                                                        </select>
                                                                    </td>
                                                                    <td>
                                                                        <select
                                                                            className="form-control form-control-sm"
                                                                            value={program.agent_leader_id || ''}
                                                                            onChange={(e) => {
                                                                                const newPrograms = [...data.programs];
                                                                                newPrograms[idx] = {
                                                                                    ...newPrograms[idx],
                                                                                    agent_leader_id: parseInt(e.target.value, 10),
                                                                                };
                                                                                setData('programs', newPrograms);
                                                                            }}
                                                                        >
                                                                            <option value="">Select Leader</option>
                                                                            {agents.map((agent) => (
                                                                                <option key={agent.id} value={agent.id}>{agent.name}</option>
                                                                            ))}
                                                                        </select>
                                                                    </td>
                                                                    <td>
                                                                        <select
                                                                            className="form-control form-control-sm"
                                                                            value={program.program_id ?? ''}
                                                                            onChange={(e) => {
                                                                                const newPrograms = [...data.programs];
                                                                                newPrograms[idx] = {
                                                                                    ...newPrograms[idx],
                                                                                    program_id: parseInt(e.target.value, 10),
                                                                                };
                                                                                setData('programs', newPrograms);
                                                                            }}
                                                                        >
                                                                            <option value="">Pilih Program</option>
                                                                            {programs.map((p) => (
                                                                                <option key={p.id} value={p.id}>{p.name}</option>
                                                                            ))}
                                                                        </select>
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control form-control-sm"
                                                                            value={program.allowance ?? ''}
                                                                            onChange={(e) => {
                                                                                const newPrograms = [...data.programs];
                                                                                newPrograms[idx] = {
                                                                                    ...newPrograms[idx],
                                                                                    allowance: e.target.value === '' ? null : parseInt(e.target.value, 10)
                                                                                };
                                                                                setData('programs', newPrograms);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <button
                                                                            onClick={() => removeProgram(idx)}
                                                                            className="btn btn-link btn-sm text-danger p-0"
                                                                            title="Delete"
                                                                        >
                                                                            <i className="fa fa-trash"></i>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>
        </FormPage>
    );
}