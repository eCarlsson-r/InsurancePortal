import CheckboxInput from '@/components/form/checkbox-input';
import DateInput from '@/components/form/date-input';
import SelectInput from '@/components/form/select-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import TextareaInput from '@/components/form/textarea-input';
import UploadOcrModal from '@/components/upload-ocr-modal';
import FormPage from '@/layouts/FormPage';
import {
    agentSchema,
    fundSchema,
    policySchema,
    productSchema,
} from '@/schemas/models';
import { Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Accordion, InputGroup, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export default function PolicyForm({
    extracted,
    fileUrl,
    policy,
    agents,
    products,
    funds,
}: {
    extracted: z.infer<typeof policySchema>;
    fileUrl: string;
    policy: z.infer<typeof policySchema>;
    agents: z.infer<typeof agentSchema>[];
    products: z.infer<typeof productSchema>[];
    funds: z.infer<typeof fundSchema>[];
}) {
    const { t } = useTranslation();
    const isEdit = !!policy;

    // Initial form state with safe defaults
    const { data, setData, post, put, processing, errors } = useForm<
        z.infer<typeof policySchema>
    >(
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
                  currency_rate: 1.0,
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
                      description: '',
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
                      description: '',
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
                    holder_insured_relationship: '1',
                }));
            }
        }
    }, [data.is_insure_holder, data.holder, data.insured, setData]);

    const handleSubmit = () => {
        console.info('Submit policy : ', isEdit);
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
            headTitle={isEdit ? t('policy.editPolicy') : t('policy.createPolicy')}
            title={isEdit ? t('policy.editPolicy') : t('policy.createPolicy')}
            breadcrumbs={[
                { label: 'Penjualan', i18n: 'sales' },
                { label: 'SP / Polis', href: '/sales', i18n: 'case' },
                { label: isEdit ? t('common.edit') : t('common.create'), active: true },
            ]}
        >
            <form id="case-form" onSubmit={handleSubmit}>
                <div className="row">
                    {/* PDF Preview Sidebar (Sticky) */}
                    <div className="col-lg-6">
                        {data.files && data.files.length > 0 && (
                            <Accordion
                                defaultActiveKey={
                                    data.files[0].id?.toString() || ''
                                }
                            >
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
                        {fileUrl && (
                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>{t('policy.policy')}</Accordion.Header>
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
                                <Accordion.Header>{t('policy.policyData')}</Accordion.Header>
                                <Accordion.Body>
                                    <TextInput
                                        id="case_no"
                                        label={t('policy.caseNumber')}
                                        value={data.case_code}
                                        onChange={(event) =>
                                            setData(
                                                'case_code',
                                                event.target.value,
                                            )
                                        }
                                        error={errors.id}
                                        row
                                    />

                                    <SelectInput
                                        id="agent_id"
                                        label={t('common.agent')}
                                        value={data.agent_id}
                                        onChange={(value) =>
                                            setData(
                                                'agent_id',
                                                value.toString(),
                                            )
                                        }
                                        error={errors.agent_id}
                                        options={agents.map((agent) => ({
                                            value: agent.id || '',
                                            label: agent.name,
                                        }))}
                                        row
                                    />

                                    <DateInput
                                        id="entry_date"
                                        label={t('policy.entryDate')}
                                        value={
                                            typeof data.entry_date === 'string'
                                                ? data.entry_date
                                                : data.entry_date
                                                      .toISOString()
                                                      .split('T')[0]
                                        }
                                        onChange={(event) =>
                                            setData(
                                                'entry_date',
                                                new Date(event.target.value),
                                            )
                                        }
                                        error={errors.entry_date}
                                        row
                                    />

                                    <SelectInput
                                        id="bill_at"
                                        label={t('policy.billAt')}
                                        value={data.bill_at}
                                        onChange={(value) =>
                                            setData('bill_at', Number(value))
                                        }
                                        error={errors.bill_at}
                                        options={[
                                            { value: 1, label: t('common.home') },
                                            { value: 2, label: t('common.office') },
                                        ]}
                                        row
                                    />

                                    <CheckboxInput
                                        id="insure-holder"
                                        label={t('policy.sameAsInsured')}
                                        checked={data.is_insure_holder}
                                        onChange={(event) =>
                                            setData(
                                                'is_insure_holder',
                                                event.target.checked,
                                            )
                                        }
                                    />
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Section 2: Pemegang Polis */}
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    {t('policy.policyHolderData')}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <TextInput
                                        id="holder_name"
                                        label={t('customer.fullName')}
                                        value={data.holder.name}
                                        onChange={(event) =>
                                            setData(
                                                'holder.name',
                                                event.target.value.toString(),
                                            )
                                        }
                                        row
                                    />

                                    <SelectInput
                                        id="holder_gender"
                                        label={t('customer.gender')}
                                        value={data.holder.gender}
                                        onChange={(value) =>
                                            setData(
                                                'holder.gender',
                                                Number(value),
                                            )
                                        }
                                        options={[
                                            { value: 1, label: t('customer.male') },
                                            { value: 2, label: t('customer.female') },
                                        ]}
                                        row
                                    />

                                    <div className="mb-3 row form-group">
                                        <label className="col-sm-3 col-form-label">
                                            {t('customer.birthPlaceDate')}
                                        </label>
                                        <InputGroup className="col-sm-9">
                                            <TextInput
                                                id="holder_birth_place"
                                                placeholder={t('customer.birthPlace')}
                                                value={data.holder.birth_place}
                                                onChange={(event) =>
                                                    setData('holder', {
                                                        ...data.holder,
                                                        birth_place:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                            <DateInput
                                                id="holder_birth_date"
                                                value={data.holder.birth_date}
                                                onChange={(event) =>
                                                    setData('holder', {
                                                        ...data.holder,
                                                        birth_date:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                        </InputGroup>
                                    </div>

                                    <SelectInput
                                        id="holder_marital"
                                        label={t('customer.maritalStatus')}
                                        value={data.holder.marital}
                                        onChange={(value) =>
                                            setData('holder', {
                                                ...data.holder,
                                                marital: Number(value),
                                            })
                                        }
                                        options={[
                                            { value: 1, label: t('customer.single') },
                                            { value: 2, label: t('customer.married') },
                                            { value: 3, label: t('customer.widowed') },
                                            { value: 4, label: t('customer.divorced') },
                                        ]}
                                        row
                                    />

                                    <SelectInput
                                        id="holder_religion"
                                        label={t('customer.religion')}
                                        value={data.holder.religion}
                                        onChange={(value) =>
                                            setData('holder', {
                                                ...data.holder,
                                                religion: Number(value),
                                            })
                                        }
                                        options={[
                                            { value: 0, label: '' },
                                            { value: 1, label: t('customer.buddhist') },
                                            { value: 2, label: t('customer.christian') },
                                            { value: 3, label: t('customer.muslim') },
                                            { value: 4, label: t('customer.hindu') },
                                        ]}
                                        row
                                    />

                                    <TextInput
                                        id="holder_identity_number"
                                        label={t('customer.identityNumber')}
                                        value={data.holder.identity}
                                        onChange={(event) =>
                                            setData('holder', {
                                                ...data.holder,
                                                identity: event.target.value,
                                            })
                                        }
                                        row
                                    />

                                    <TextInput
                                        id="holder_profession"
                                        label={t('customer.profession')}
                                        value={data.holder.profession}
                                        onChange={(event) =>
                                            setData('holder', {
                                                ...data.holder,
                                                profession: event.target.value,
                                            })
                                        }
                                        row
                                    />

                                    <TextInput
                                        id="holder_mobile"
                                        label={t('customer.mobileNumber')}
                                        value={data.holder.mobile}
                                        onChange={(event) =>
                                            setData('holder', {
                                                ...data.holder,
                                                mobile: event.target.value,
                                            })
                                        }
                                        row
                                    />

                                    <TextInput
                                        id="holder_email"
                                        label={t('customer.email')}
                                        type="email"
                                        value={data.holder.email}
                                        onChange={(event) =>
                                            setData('holder', {
                                                ...data.holder,
                                                email: event.target.value,
                                            })
                                        }
                                        row
                                    />

                                    <TextInput
                                        id="holder_home_address"
                                        label={t('customer.homeAddress')}
                                        value={data.holder.home_address}
                                        onChange={(event) =>
                                            setData('holder', {
                                                ...data.holder,
                                                home_address:
                                                    event.target.value,
                                            })
                                        }
                                        row
                                    />

                                    <div className="mb-3 row form-group">
                                        <label className="col-sm-3 col-form-label">
                                            {t('customer.postalCity')}
                                        </label>
                                        <div className="col-sm-9 d-flex gap-2">
                                            <TextInput
                                                id="holder_home_postal"
                                                placeholder={t('customer.postalCode')}
                                                style={{ maxWidth: '100px' }}
                                                value={data.holder.home_postal}
                                                onChange={(event) =>
                                                    setData('holder', {
                                                        ...data.holder,
                                                        home_postal:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                            <TextInput
                                                id="holder_home_city"
                                                placeholder={t('customer.city')}
                                                value={data.holder.home_city}
                                                onChange={(event) =>
                                                    setData('holder', {
                                                        ...data.holder,
                                                        home_city:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>

                                    <TextInput
                                        id="holder_work_address"
                                        label={t('customer.officeAddress')}
                                        value={data.holder.work_address}
                                        onChange={(event) =>
                                            setData('holder', {
                                                ...data.holder,
                                                work_address:
                                                    event.target.value,
                                            })
                                        }
                                        row
                                    />

                                    <div className="mb-3 row form-group">
                                        <label className="col-sm-3 col-form-label">
                                            {t('customer.postalCity')}
                                        </label>
                                        <div className="col-sm-9 d-flex gap-2">
                                            <TextInput
                                                id="holder_work_postal"
                                                placeholder={t('customer.postalCode')}
                                                style={{ maxWidth: '100px' }}
                                                value={data.holder.work_postal}
                                                onChange={(event) =>
                                                    setData('holder', {
                                                        ...data.holder,
                                                        work_postal:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                            <TextInput
                                                id="holder_work_city"
                                                placeholder={t('customer.city')}
                                                value={data.holder.work_city}
                                                onChange={(event) =>
                                                    setData('holder', {
                                                        ...data.holder,
                                                        work_city:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Section 3: Tertanggung */}
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>
                                    {t('policy.insuredData')}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <TextInput
                                        id="insured_name"
                                        label={t('customer.fullName')}
                                        value={data.insured.name}
                                        onChange={(event) =>
                                            setData('insured', {
                                                ...data.insured,
                                                name: event.target.value,
                                            })
                                        }
                                        disabled={data.is_insure_holder}
                                        row
                                    />

                                    <SelectInput
                                        id="insured_gender"
                                        label={t('customer.gender')}
                                        value={data.insured.gender}
                                        onChange={(value) =>
                                            setData('insured', {
                                                ...data.insured,
                                                gender: Number(value),
                                            })
                                        }
                                        disabled={data.is_insure_holder}
                                        options={[
                                            { value: 1, label: t('customer.male') },
                                            { value: 2, label: t('customer.female') },
                                        ]}
                                        row
                                    />

                                    <div className="mb-3 row form-group">
                                        <label className="col-sm-3 col-form-label">
                                            {t('customer.birthPlaceDate')}
                                        </label>
                                        <div className="col-sm-9 d-flex gap-2">
                                            <TextInput
                                                id="insured_birth_place"
                                                placeholder={t('customer.birthPlace')}
                                                value={data.insured.birth_place}
                                                onChange={(event) =>
                                                    setData('insured', {
                                                        ...data.insured,
                                                        birth_place:
                                                            event.target.value,
                                                    })
                                                }
                                                disabled={data.is_insure_holder}
                                            />
                                            <DateInput
                                                id="insured_birth_date"
                                                value={data.insured.birth_date}
                                                onChange={(event) =>
                                                    setData('insured', {
                                                        ...data.insured,
                                                        birth_date:
                                                            event.target.value,
                                                    })
                                                }
                                                disabled={data.is_insure_holder}
                                            />
                                        </div>
                                    </div>

                                    <SelectInput
                                        id="insured_marital"
                                        label={t('customer.maritalStatus')}
                                        value={data.insured.marital}
                                        onChange={(value) =>
                                            setData('insured', {
                                                ...data.insured,
                                                marital: Number(value),
                                            })
                                        }
                                        disabled={data.is_insure_holder}
                                        options={[
                                            { value: 1, label: t('customer.single') },
                                            { value: 2, label: t('customer.married') },
                                            { value: 3, label: t('customer.widowed') },
                                            { value: 4, label: t('customer.divorced') },
                                        ]}
                                        row
                                    />

                                    <SelectInput
                                        id="holder_insured_relationship"
                                        label={t('policy.relationship')}
                                        value={data.holder_insured_relationship}
                                        onChange={(value) =>
                                            setData(
                                                'holder_insured_relationship',
                                                value.toString(),
                                            )
                                        }
                                        disabled={data.is_insure_holder}
                                        options={[
                                            {
                                                value: '1',
                                                label: t('policy.self'),
                                            },
                                            {
                                                value: '2',
                                                label: t('policy.spouse'),
                                            },
                                            { value: '3', label: t('policy.child') },
                                            { value: '4', label: t('policy.parent') },
                                            { value: '5', label: t('common.other') },
                                        ]}
                                        row
                                    />

                                    <TextInput
                                        id="insured_profession"
                                        label={t('customer.profession')}
                                        value={data.insured.profession}
                                        onChange={(event) =>
                                            setData('insured', {
                                                ...data.insured,
                                                profession: event.target.value,
                                            })
                                        }
                                        disabled={data.is_insure_holder}
                                        row
                                    />

                                    <TextInput
                                        id="insured_home_address"
                                        label={t('customer.homeAddress')}
                                        value={data.insured.home_address}
                                        onChange={(event) =>
                                            setData('insured', {
                                                ...data.insured,
                                                home_address:
                                                    event.target.value,
                                            })
                                        }
                                        disabled={data.is_insure_holder}
                                        row
                                    />

                                    <div className="mb-3 row form-group">
                                        <label className="col-sm-3 col-form-label">
                                            {t('customer.postalCity')}
                                        </label>
                                        <div className="col-sm-9 d-flex gap-2">
                                            <TextInput
                                                id="insured_home_postal"
                                                placeholder={t('customer.postalCode')}
                                                style={{ maxWidth: '100px' }}
                                                value={data.insured.home_postal}
                                                onChange={(event) =>
                                                    setData('insured', {
                                                        ...data.insured,
                                                        home_postal:
                                                            event.target.value,
                                                    })
                                                }
                                                disabled={data.is_insure_holder}
                                            />
                                            <TextInput
                                                id="insured_home_city"
                                                placeholder={t('customer.city')}
                                                value={data.insured.home_city}
                                                onChange={(event) =>
                                                    setData('insured', {
                                                        ...data.insured,
                                                        home_city:
                                                            event.target.value,
                                                    })
                                                }
                                                disabled={data.is_insure_holder}
                                            />
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Section 4: Data Asuransi */}
                            <Accordion.Item eventKey="3">
                                <Accordion.Header>
                                    {t('policy.insuranceData')}
                                </Accordion.Header>
                                <Accordion.Body>
                                    <TextInput
                                        id="policy_no"
                                        label={t('policy.policyNumber')}
                                        value={data.policy_no}
                                        onChange={(event) =>
                                            setData(
                                                'policy_no',
                                                event.target.value,
                                            )
                                        }
                                        row
                                    />

                                    <SelectInput
                                        id="product_id"
                                        label={t('common.product')}
                                        value={data.product_id}
                                        onChange={(value) =>
                                            setData(
                                                'product_id',
                                                value.toString(),
                                            )
                                        }
                                        options={products.map((product) => ({
                                            value: product.id || '',
                                            label: product.name,
                                        }))}
                                        row
                                    />

                                    <SelectInput
                                        id="currency_id"
                                        label={t('policy.currency')}
                                        value={data.currency_id}
                                        onChange={(value) =>
                                            setData(
                                                'currency_id',
                                                Number(value),
                                            )
                                        }
                                        options={[
                                            { value: 1, label: t('policy.rupiah') },
                                            { value: 2, label: t('policy.dollar') },
                                        ]}
                                        row
                                    />

                                    <div className="mb-3 row form-group">
                                        <label className="col-sm-3 col-form-label">
                                            {t('policy.basePremium')}
                                        </label>
                                        <InputGroup className="col-sm-9">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={data.premium}
                                                onChange={(event) =>
                                                    setData(
                                                        'premium',
                                                        Number(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                            />
                                            <InputGroup.Text>x</InputGroup.Text>
                                            <input
                                                type="number"
                                                className="form-control"
                                                style={{ maxWidth: '100px' }}
                                                value={data.currency_rate}
                                                onChange={(event) =>
                                                    setData(
                                                        'currency_rate',
                                                        Number(
                                                            event.target.value,
                                                        ),
                                                    )
                                                }
                                            />
                                        </InputGroup>
                                    </div>

                                    <SelectInput
                                        id="pay_method"
                                        label={t('policy.paymentMethod')}
                                        value={data.pay_method}
                                        onChange={(value) =>
                                            setData('pay_method', Number(value))
                                        }
                                        options={[
                                            { value: 1, label: t('policy.annual') },
                                            { value: 2, label: t('policy.semiAnnual') },
                                            { value: 4, label: t('policy.quarterly') },
                                            { value: 12, label: t('policy.monthly') },
                                            { value: 0, label: t('policy.single') },
                                        ]}
                                        row
                                    />

                                    <TextInput
                                        id="base_insure"
                                        label={t('policy.baseCoverage')}
                                        type="number"
                                        value={data.base_insure}
                                        onChange={(event) =>
                                            setData(
                                                'base_insure',
                                                Number(event.target.value),
                                            )
                                        }
                                        row
                                    />

                                    {/* Investments Table */}
                                    <div className="mb-3 mt-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0">
                                                {t('policy.investmentOptions')}
                                            </h6>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-primary"
                                                onClick={addInvestment}
                                            >
                                                <i className="fa fa-plus me-1"></i>
                                                {t('common.add')}
                                            </button>
                                        </div>
                                        <Table bordered responsive>
                                            <thead>
                                                <tr>
                                                    <th>{t('policy.investmentType')}</th>
                                                    <th
                                                        style={{
                                                            width: '100px',
                                                        }}
                                                    >
                                                        Percent
                                                    </th>
                                                    <th
                                                        style={{
                                                            width: '40px',
                                                        }}
                                                    ></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.investments &&
                                                data.investments.length > 0 ? (
                                                    data.investments.map(
                                                        (item, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <SelectInput
                                                                        id={`investment_fund_${index}`}
                                                                        value={
                                                                            item.fund_id
                                                                        }
                                                                        onChange={(
                                                                            value,
                                                                        ) => {
                                                                            const newInvestments =
                                                                                [
                                                                                    ...data.investments,
                                                                                ];
                                                                            newInvestments[
                                                                                index
                                                                            ].fund_id =
                                                                                Number(
                                                                                    value,
                                                                                );
                                                                            setData(
                                                                                'investments',
                                                                                newInvestments,
                                                                            );
                                                                        }}
                                                                        options={[
                                                                            {
                                                                                value: 0,
                                                                                label: t('policy.selectFund'),
                                                                            },
                                                                            ...funds.map(
                                                                                (
                                                                                    fund,
                                                                                ) => ({
                                                                                    value:
                                                                                        fund.id ||
                                                                                        0,
                                                                                    label: fund.name,
                                                                                }),
                                                                            ),
                                                                        ]}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <TextInput
                                                                        id={`investment_allocation_${index}`}
                                                                        type="number"
                                                                        value={
                                                                            item.allocation
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) => {
                                                                            const newInvestments =
                                                                                [
                                                                                    ...data.investments,
                                                                                ];
                                                                            newInvestments[
                                                                                index
                                                                            ].allocation =
                                                                                parseFloat(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                );
                                                                            setData(
                                                                                'investments',
                                                                                newInvestments,
                                                                            );
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td className="text-center">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-link btn-sm text-danger p-0"
                                                                        onClick={() =>
                                                                            removeInvestment(
                                                                                index,
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="fa fa-trash"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={3}
                                                            className="text-center text-muted py-2"
                                                        >
                                                            {t('policy.noInvestments')}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>

                                    {/* Riders Table */}
                                    <div className="mb-3 mt-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0">
                                                {t('policy.additionalInsurance')}
                                            </h6>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-primary"
                                                onClick={addRider}
                                            >
                                                <i className="fa fa-plus me-1"></i>
                                                {t('common.add')}
                                            </button>
                                        </div>
                                        <div className="table-responsive">
                                            <Table
                                                bordered
                                                style={{ minWidth: '600px' }}
                                            >
                                                <thead>
                                                    <tr>
                                                        <th>{t('policy.rider')}</th>
                                                        <th>{t('policy.riderCoverage')}</th>
                                                        <th>{t('policy.premium')}</th>
                                                        <th>{t('policy.insurancePeriod')}</th>
                                                        <th>{t('policy.paymentPeriod')}</th>
                                                        <th
                                                            style={{
                                                                width: '40px',
                                                            }}
                                                        ></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.riders &&
                                                    data.riders.length > 0 ? (
                                                        data.riders.map(
                                                            (item, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <SelectInput
                                                                            id={`rider_product_${index}`}
                                                                            value={
                                                                                item.product_id
                                                                            }
                                                                            onChange={(
                                                                                value,
                                                                            ) => {
                                                                                const newRiders =
                                                                                    [
                                                                                        ...data.riders,
                                                                                    ];
                                                                                newRiders[
                                                                                    index
                                                                                ].product_id =
                                                                                    value.toString();
                                                                                setData(
                                                                                    'riders',
                                                                                    newRiders,
                                                                                );
                                                                            }}
                                                                            options={[
                                                                                {
                                                                                    value: '',
                                                                                    label: t('policy.selectRider'),
                                                                                },
                                                                                ...products
                                                                                    .filter(
                                                                                        (
                                                                                            p,
                                                                                        ) =>
                                                                                            p.type ===
                                                                                            '5',
                                                                                    )
                                                                                    .map(
                                                                                        (
                                                                                            product,
                                                                                        ) => ({
                                                                                            value:
                                                                                                product.id ||
                                                                                                '',
                                                                                            label: product.name,
                                                                                        }),
                                                                                    ),
                                                                            ]}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <TextInput
                                                                            id={`rider_insure_amount_${index}`}
                                                                            type="number"
                                                                            value={
                                                                                item.insure_amount
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                const newRiders =
                                                                                    [
                                                                                        ...data.riders,
                                                                                    ];
                                                                                newRiders[
                                                                                    index
                                                                                ].insure_amount =
                                                                                    Number(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    );
                                                                                setData(
                                                                                    'riders',
                                                                                    newRiders,
                                                                                );
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <TextInput
                                                                            id={`rider_premium_${index}`}
                                                                            type="number"
                                                                            value={
                                                                                item.premium
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                const newRiders =
                                                                                    [
                                                                                        ...data.riders,
                                                                                    ];
                                                                                newRiders[
                                                                                    index
                                                                                ].premium =
                                                                                    Number(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    );
                                                                                setData(
                                                                                    'riders',
                                                                                    newRiders,
                                                                                );
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <TextInput
                                                                            id={`rider_insure_period_${index}`}
                                                                            type="number"
                                                                            value={
                                                                                item.insure_period
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                const newRiders =
                                                                                    [
                                                                                        ...data.riders,
                                                                                    ];
                                                                                newRiders[
                                                                                    index
                                                                                ].insure_period =
                                                                                    Number(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    );
                                                                                setData(
                                                                                    'riders',
                                                                                    newRiders,
                                                                                );
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <TextInput
                                                                            id={`rider_pay_period_${index}`}
                                                                            type="number"
                                                                            value={
                                                                                item.pay_period
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) => {
                                                                                const newRiders =
                                                                                    [
                                                                                        ...data.riders,
                                                                                    ];
                                                                                newRiders[
                                                                                    index
                                                                                ].pay_period =
                                                                                    Number(
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    );
                                                                                setData(
                                                                                    'riders',
                                                                                    newRiders,
                                                                                );
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-link btn-sm text-danger p-0"
                                                                            onClick={() =>
                                                                                removeRider(
                                                                                    index,
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="fa fa-trash"></i>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan={6}
                                                                className="text-center text-muted py-2"
                                                            >
                                                                {t('policy.noRiders')}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>

                                    <TextareaInput
                                        id="description"
                                        label={t('common.description')}
                                        value={data.description}
                                        onChange={(event) =>
                                            setData(
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                        row
                                    />
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>

                        <div className="card-footer d-flex gap-2 bg-transparent border-0 px-0">
                            <SubmitButton
                                processing={processing}
                                onClick={handleSubmit}
                            >
                                <i className="fa fa-save me-2"></i>
                                {isEdit ? t('common.update') : t('common.save')}
                            </SubmitButton>
                            <Link href="/sales" className="btn btn-secondary">
                                {t('common.cancel')}
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
