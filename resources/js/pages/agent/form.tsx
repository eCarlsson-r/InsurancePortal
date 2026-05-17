import DateInput from '@/components/form/date-input';
import SelectInput from '@/components/form/select-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import TextareaInput from '@/components/form/textarea-input';
import FormPage from '@/layouts/FormPage';
import {
    agencySchema,
    agentProgramSchema,
    agentSchema,
    programSchema,
} from '@/schemas/models';
import { useForm } from '@inertiajs/react';
import { Accordion, InputGroup, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
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
    agent,
    agencies,
    programs,
    agents,
}: {
    agent?: z.infer<typeof agentSchema> | null;
    agencies: z.infer<typeof agencySchema>[];
    programs: z.infer<typeof programSchema>[];
    agents: z.infer<typeof agentSchema>[];
}) {
    const { t } = useTranslation();
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
        console.info(data.programs);
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
            headTitle={isEdit ? t('agent.editAgent') : t('agent.createAgent')}
            title={t('common.agent')}
            i18nTitle="agent"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: 'Agen', active: true, i18n: 'agent' },
            ]}
            headerActions={
                <SubmitButton processing={processing} onClick={handleSubmit}>
                    {isEdit ? t('common.update') : t('common.save')}
                </SubmitButton>
            }
        >
            <div className="row">
                <div className="col-md-6">
                    <div style={{ position: 'sticky', top: '20px' }}>
                        {data.files && data.files.length > 0 && (
                            <Accordion>
                                {data.files?.map((file) => (
                                    <Accordion.Item
                                        eventKey={file.id?.toString() || ''}
                                    >
                                        <Accordion.Header>
                                            {file.name}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <iframe
                                                src={`${file.path}#toolbar=0&navpanes=0`}
                                                width="100%"
                                                height="600px"
                                                style={{ border: 'none' }}
                                            />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        )}
                    </div>
                </div>
                <div className="col-md-6">
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header as="h4">
                                {t('agent.personal_data')}
                            </Accordion.Header>

                            <Accordion.Body>
                                <TextInput
                                    id="name"
                                    label={t('agent.name_as_id')}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    row
                                />

                                <SelectInput
                                    id="gender"
                                    label={t('customer.gender')}
                                    value={data.gender}
                                    onChange={(value) =>
                                        setData('gender', Number(value))
                                    }
                                    row
                                    options={[
                                        {
                                            value: 1,
                                            label: t('customer.male'),
                                            i18n: 'male',
                                        },
                                        {
                                            value: 2,
                                            label: t('customer.female'),
                                            i18n: 'female',
                                        },
                                    ]}
                                />

                                <div className="row form-group mb-3">
                                    <label
                                        className="col-sm-3 col-form-label"
                                    >
                                        {t('customer.place_date_birth')}
                                    </label>
                                    <div className="col-sm-9 d-flex gap-2">
                                        <input
                                            type="text"
                                            className="form-control grow"
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
                                    label={t('customer.address')}
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    rows={2}
                                    row
                                />

                                <TextInput
                                    id="religion"
                                    label={t('customer.religion')}
                                    value={data.religion}
                                    onChange={(e) =>
                                        setData('religion', e.target.value)
                                    }
                                    row
                                />

                                <TextInput
                                    id="identity_number"
                                    label={t('agent.id_number')}
                                    value={data.identity_number}
                                    onChange={(e) =>
                                        setData(
                                            'identity_number',
                                            e.target.value,
                                        )
                                    }
                                    row
                                />

                                <TextInput
                                    id="tax_number"
                                    label={t('agent.tax_number')}
                                    value={data.tax_number}
                                    onChange={(e) =>
                                        setData('tax_number', e.target.value)
                                    }
                                    row
                                />

                                <TextInput
                                    id="city"
                                    label={t('agent.marketing_city')}
                                    value={data.city}
                                    onChange={(e) =>
                                        setData('city', e.target.value)
                                    }
                                    row
                                />

                                <TextInput
                                    id="province"
                                    label={t('common.province')}
                                    value={data.province}
                                    onChange={(e) =>
                                        setData('province', e.target.value)
                                    }
                                    row
                                />

                                <TextInput
                                    id="postal_code"
                                    label={t('common.postal_code')}
                                    value={data.postal_code}
                                    onChange={(e) =>
                                        setData('postal_code', e.target.value)
                                    }
                                    row
                                />

                                <TextInput
                                    id="education"
                                    label={t('agent.last_education')}
                                    value={data.education}
                                    onChange={(e) =>
                                        setData('education', e.target.value)
                                    }
                                    row
                                />

                                <TextInput
                                    id="phone"
                                    label={t('common.phone_number')}
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                    row
                                />

                                <TextInput
                                    id="mobile"
                                    label={t('customer.mobile_number')}
                                    type="tel"
                                    value={data.mobile}
                                    onChange={(e) =>
                                        setData('mobile', e.target.value)
                                    }
                                    row
                                />

                                <TextInput
                                    id="email"
                                    label={t('customer.email')}
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    row
                                />

                                <SelectInput
                                    id="status"
                                    label={t('customer.marital_status')}
                                    value={data.status}
                                    onChange={(value) =>
                                        setData('status', Number(value))
                                    }
                                    row
                                    options={[
                                        {
                                            value: 1,
                                            label: t('customer.single'),
                                            i18n: 'single',
                                        },
                                        {
                                            value: 2,
                                            label: t('customer.married'),
                                            i18n: 'married',
                                        },
                                    ]}
                                />

                                <TextInput
                                    id="spouse"
                                    label={t('agent.spouse_name')}
                                    value={data.spouse}
                                    onChange={(e) =>
                                        setData('spouse', e.target.value)
                                    }
                                    placeholder={t('agent.fillIfMarried')}
                                    row
                                />

                                <TextInput
                                    id="occupation"
                                    label={t('customer.occupation')}
                                    value={data.occupation}
                                    onChange={(e) =>
                                        setData('occupation', e.target.value)
                                    }
                                    row
                                />

                                <div className="row form-group mb-3">
                                    <label
                                        className="col-sm-3 col-form-label"
                                    >
                                        {t('agent.dependents_count')}
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
                                                        e.target.value === ''
                                                            ? ''
                                                            : Number(
                                                                  e.target
                                                                      .value,
                                                              ),
                                                    )
                                                }
                                            />
                                            <InputGroup.Text>
                                                {' '}
                                                {t('agent.people')}
                                            </InputGroup.Text>
                                        </InputGroup>
                                    </div>
                                </div>

                                <TextareaInput
                                    id="notes"
                                    label={t('common.notes')}
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    rows={2}
                                    row
                                />
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header as="h4">
                                {t('agent.agent_status')}
                            </Accordion.Header>
                            <Accordion.Body>
                                <DateInput
                                    id="apply_date"
                                    label={t('agent.apply_date')}
                                    value={data.apply_date}
                                    onChange={(e) =>
                                        setData('apply_date', e.target.value)
                                    }
                                    row
                                />

                                <TextInput
                                    id="apply_place"
                                    label={t('agent.apply_place')}
                                    value={data.apply_place}
                                    onChange={(e) =>
                                        setData('apply_place', e.target.value)
                                    }
                                    row
                                />

                                <SelectInput
                                    id="agency_id"
                                    label={t('agency.title')}
                                    value={data.agency_id}
                                    onChange={(value) =>
                                        setData('agency_id', Number(value))
                                    }
                                    row
                                    options={[
                                        ...agencies.map((agency) => ({
                                            value: agency.id || 0,
                                            label: agency.name,
                                        })),
                                    ]}
                                />

                                <TextInput
                                    id="official_number"
                                    label={t('agent.agentCode')}
                                    value={data.official_number}
                                    onChange={(e) =>
                                        setData(
                                            'official_number',
                                            e.target.value,
                                        )
                                    }
                                    placeholder={t('agent.agentCode')}
                                    row
                                />

                                <TextInput
                                    id="license"
                                    label={t('agent.license_number')}
                                    value={data.license}
                                    onChange={(e) =>
                                        setData('license', e.target.value)
                                    }
                                    row
                                />

                                <DateInput
                                    id="due_date"
                                    label={t('agent.due_date')}
                                    value={data.due_date}
                                    onChange={(e) =>
                                        setData('due_date', e.target.value)
                                    }
                                    row
                                />

                                <SelectInput
                                    id="recruiter_id"
                                    label={t('agent.recruiter')}
                                    value={data.recruiter_id}
                                    onChange={(value) =>
                                        setData('recruiter_id', Number(value))
                                    }
                                    row
                                    options={[
                                        ...agents.map((recruiter) => ({
                                            value: recruiter.id || 0,
                                            label: recruiter.name,
                                        })),
                                    ]}
                                />
                                <div className="row form-group mt-4">
                                    <div className="col-12 d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="mb-0">{t('agent.program_allowance')}</h6>
                                        <button
                                            id="program-launcher"
                                            className="btn btn-sm btn-primary"
                                            type="button"
                                            onClick={addProgram}
                                        >
                                            <i className="fa fa-plus me-1"></i>
                                            {t('common.add')}
                                        </button>
                                    </div>
                                    <div className="col-12">
                                        <div className="table-responsive">
                                            <Table
                                                responsive
                                                className="table-sm table-bordered"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th
                                                            style={{
                                                                width: '130px',
                                                            }}
                                                        >
                                                            {t('agent.start')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                width: '150px',
                                                            }}
                                                        >
                                                            {t('agent.position')}
                                                        </th>
                                                        <th>{t('agent.direct_leader')}</th>
                                                        <th>{t('agent.program')}</th>
                                                        <th
                                                            style={{
                                                                width: '120px',
                                                            }}
                                                        >
                                                            {t('agent.program_allowance')}
                                                        </th>
                                                        <th
                                                            style={{
                                                                width: '40px',
                                                            }}
                                                        ></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.programs &&
                                                        data.programs.map(
                                                            (program, idx) => (
                                                                <tr key={idx}>
                                                                    <td>
                                                                        <DateInput
                                                                            id={`program_start_${idx}`}
                                                                            className="form-control-sm"
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
                                                                        <SelectInput
                                                                            id={`program_position_${idx}`}
                                                                            className="form-control-sm"
                                                                            value={
                                                                                program.position
                                                                            }
                                                                            onChange={(
                                                                                value,
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
                                                                                        position:
                                                                                            value.toString(),
                                                                                    };
                                                                                setData(
                                                                                    'programs',
                                                                                    newPrograms,
                                                                                );
                                                                            }}
                                                                            options={[
                                                                                {
                                                                                    value: 'FC',
                                                                                    label: 'Financial Consultant',
                                                                                },
                                                                                {
                                                                                    value: 'BP*',
                                                                                    label: 'Business Partner *',
                                                                                },
                                                                                {
                                                                                    value: 'BP**',
                                                                                    label: 'Business Partner **',
                                                                                },
                                                                                {
                                                                                    value: 'BP***',
                                                                                    label: 'Business Partner ***',
                                                                                },
                                                                            ]}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <SelectInput
                                                                            id={`program_leader_${idx}`}
                                                                            className="form-control-sm"
                                                                            value={
                                                                                program.agent_leader_id ||
                                                                                ''
                                                                            }
                                                                            onChange={(
                                                                                value,
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
                                                                                        agent_leader_id:
                                                                                            value ===
                                                                                            ''
                                                                                                ? null
                                                                                                : parseInt(
                                                                                                      value.toString(),
                                                                                                      10,
                                                                                                  ),
                                                                                    };
                                                                                setData(
                                                                                    'programs',
                                                                                    newPrograms,
                                                                                );
                                                                            }}
                                                                            options={[
                                                                                {
                                                                                    value: '',
                                                                                    label: t('agent.selectLeader'),
                                                                                },
                                                                                ...agents.map(
                                                                                    (
                                                                                        agent,
                                                                                    ) => ({
                                                                                        value:
                                                                                            agent.id ||
                                                                                            0,
                                                                                        label: agent.name,
                                                                                    }),
                                                                                ),
                                                                            ]}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <SelectInput
                                                                            id={`program_program_${idx}`}
                                                                            className="form-control-sm"
                                                                            value={
                                                                                program.program_id ??
                                                                                ''
                                                                            }
                                                                            onChange={(
                                                                                value,
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
                                                                                        program_id:
                                                                                            value ===
                                                                                            ''
                                                                                                ? null
                                                                                                : parseInt(
                                                                                                      value.toString(),
                                                                                                      10,
                                                                                                  ),
                                                                                    };
                                                                                setData(
                                                                                    'programs',
                                                                                    newPrograms,
                                                                                );
                                                                            }}
                                                                            options={[
                                                                                {
                                                                                    value: '',
                                                                                    label: t('agent.selectProgram'),
                                                                                },
                                                                                ...programs.map(
                                                                                    (
                                                                                        p,
                                                                                    ) => ({
                                                                                        value:
                                                                                            p.id ||
                                                                                            0,
                                                                                        label: p.name,
                                                                                    }),
                                                                                ),
                                                                            ]}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                program.allowance ??
                                                                                ''
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
                                                                                        allowance:
                                                                                            e
                                                                                                .target
                                                                                                .value ===
                                                                                            ''
                                                                                                ? null
                                                                                                : parseInt(
                                                                                                      e
                                                                                                          .target
                                                                                                          .value,
                                                                                                      10,
                                                                                                  ),
                                                                                    };
                                                                                setData(
                                                                                    'programs',
                                                                                    newPrograms,
                                                                                );
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <button
                                                                            onClick={() =>
                                                                                removeProgram(
                                                                                    idx,
                                                                                )
                                                                            }
                                                                            className="btn btn-link btn-sm text-danger p-0"
                                                                            title={t('common.delete')}
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
