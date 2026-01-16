import SelectInput from '@/components/form/select-input';
import TextareaInput from '@/components/form/textarea-input';
import TextInput from '@/components/form/text-input';
import TemplateLayout from '@/layouts/TemplateLayout';
import {
    agencySchema,
    agentProgramSchema,
    agentSchema,
    programSchema,
} from '@/schemas/models';
import { Head, useForm } from '@inertiajs/react';
import { Accordion, Table } from 'react-bootstrap';
import { z } from 'zod';

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
        <TemplateLayout>
            <Head title={isEdit ? 'Sunting Data SP' : 'Input Data SP'} />
            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="input">
                            Agen
                        </h3>
                        &emsp;
                        <button
                            type="submit"
                            className="btn btn-primary pull-right"
                            disabled={processing}
                            onClick={handleSubmit}
                        >
                            Perbarui
                        </button>
                    </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="javascript:void(0)" data-i18n="master">
                                    Master
                                </a>
                            </li>
                            <li
                                className="breadcrumb-item active"
                                data-i18n="input"
                            >
                                Agen
                            </li>
                        </ol>
                    </div>
                </div>
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
                                    >
                                        <option value="1" data-i18n="male">Pria</option>
                                        <option value="2" data-i18n="female">Wanita</option>
                                    </SelectInput>

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
                                            <input
                                                type="date"
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
                                    >
                                        <option value="1" data-i18n="single">Single</option>
                                        <option value="2" data-i18n="married">Kawin</option>
                                    </SelectInput>

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
                                            <div className="input-group">
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
                                                <span
                                                    className="input-group-text"
                                                    data-i18n="people"
                                                >
                                                    orang
                                                </span>
                                            </div>
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
                                    <TextInput
                                        id="apply_date"
                                        label="Tanggal Pengisian"
                                        type="date"
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
                                    >
                                        <option value="">Pilih Agency</option>
                                        {agencies.map((agency: z.infer<typeof agencySchema>) => (
                                            <option key={agency.id} value={agency.id}>
                                                {agency.name}
                                            </option>
                                        ))}
                                    </SelectInput>

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

                                    <TextInput
                                        id="due_date"
                                        label="Jatuh Tempo"
                                        type="date"
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
                                    >
                                        <option value="">Pilih Perekruit</option>
                                        {agents.map((recruiter: z.infer<typeof agentSchema>) => (
                                            <option key={recruiter.id} value={recruiter.id}>
                                                {recruiter.name}
                                            </option>
                                        ))}
                                    </SelectInput>
                                    <div className="row form-group">
                                        <label
                                            className="col-sm-3"
                                            data-i18n="agent_level"
                                        >
                                            Program Allowance
                                        </label>
                                        <div className="col-sm-9">
                                            <button
                                                id="program-launcher"
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={addProgram}
                                            >
                                                <i className="fa fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row form-group">
                                        <div className="col-sm-12">
                                            <Table>
                                                <thead>
                                                    <tr>
                                                        <th
                                                            className="col-xs-2"
                                                            data-field="program-start"
                                                        >
                                                            Mulai Program
                                                        </th>
                                                        <th
                                                            className="col-xs-2"
                                                            data-field="position"
                                                            data-formatter="LevelFormatter"
                                                        >
                                                            Jabatan
                                                        </th>
                                                        <th
                                                            className="col-xs-2"
                                                            data-field="leader"
                                                            data-formatter="LeaderFormatter"
                                                        >
                                                            Leader Langsung
                                                        </th>
                                                        <th
                                                            className="col-xs-3"
                                                            data-field="program"
                                                        >
                                                            Program
                                                        </th>
                                                        <th
                                                            className="col-xs-3"
                                                            data-field="allowance"
                                                            data-formatter="agentprogramIDRFormatter"
                                                        >
                                                            Allowance
                                                        </th>
                                                        <th
                                                            className="col-xs-1"
                                                            data-field="agentprogram-code"
                                                            data-formatter="agentprogramActionFormatter"
                                                            data-events="agentprogramActionHandler"
                                                        ></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.programs &&
                                                        data.programs.map(
                                                            (
                                                                program: z.infer<
                                                                    typeof agentProgramSchema
                                                                >,
                                                                idx: number,
                                                            ) => (
                                                                <tr key={idx}>
                                                                    <td>
                                                                        <input
                                                                            type="date"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                program.program_start
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                const newPrograms =
                                                                                    [
                                                                                        ...data.programs,
                                                                                    ];
                                                                                newPrograms[
                                                                                    idx
                                                                                ] =
                                                                                    {
                                                                                        ...newPrograms[
                                                                                            idx
                                                                                        ],
                                                                                        program_start:
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                    };
                                                                                setData(
                                                                                    'programs',
                                                                                    newPrograms,
                                                                                );
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <select
                                                                            className="form-control"
                                                                            value={program.position}
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                const newPrograms = [...data.programs];
                                                                                newPrograms[idx] = {
                                                                                    ...newPrograms[idx],
                                                                                    position: e.target.value,
                                                                                };
                                                                                setData('programs', newPrograms);
                                                                            }}
                                                                        >
                                                                            <option value="FC">
                                                                                Financial Consultant
                                                                            </option>
                                                                            <option value="BP*">
                                                                                Business Partner Bintang 1
                                                                            </option>
                                                                            <option value="BP**">
                                                                                Business Partner Bintang 2
                                                                            </option>
                                                                            <option value="BP***">
                                                                                Business Partner Bintang 3
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                    <td>
                                                                        <select
                                                                            className="form-control"
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
                                                                            {agents.map((agent: z.infer<typeof agentSchema>, idx: number) => (
                                                                                <option key={idx} value={agent.id}>{agent.name}</option>
                                                                            ))}
                                                                        </select>
                                                                    </td>
                                                                    <td>
                                                                        <select
                                                                            className="form-control"
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
                                                                            {programs.map(
                                                                                (
                                                                                    program: z.infer<typeof programSchema>,
                                                                                    idx: number,
                                                                                ) => (
                                                                                    <option
                                                                                        key={idx}
                                                                                        value={program.id}
                                                                                    >
                                                                                        {program.name}
                                                                                    </option>
                                                                                ),
                                                                            )}
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
                                                                                    allowance:
                                                                                        e.target.value === ''
                                                                                            ? null
                                                                                            : parseInt(e.target.value, 10)
                                                                                };
                                                                                setData('programs', newPrograms);
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            onClick={() =>
                                                                                removeProgram(
                                                                                    idx,
                                                                                )
                                                                            }
                                                                            className="btn btn-sm btn-danger"
                                                                            title="Delete"
                                                                        >
                                                                            <i className="la la-ban"></i>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                </tbody>
                                            </Table>
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