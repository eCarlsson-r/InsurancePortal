import DateInput from '@/components/form/date-input';
import SelectInput from '@/components/form/select-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import TextareaInput from '@/components/form/textarea-input';
import FormPage from '@/layouts/FormPage';
import { customerSchema } from '@/schemas/models';
import { useForm } from '@inertiajs/react';
import { Accordion } from 'react-bootstrap';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

export default function CustomerForm({
    customer,
}: {
    customer?: z.infer<typeof customerSchema> | null;
}) {
    const { t } = useTranslation();
    const isEdit = !!customer;

    // Initial form state with safe defaults
    const { data, setData, post, put, processing } = useForm<
        z.infer<typeof customerSchema>
    >(
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
                  description: '',
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
            headTitle={isEdit ? t('customer.edit_title') : t('customer.create_title')}
            title={t('customer.title')}
            i18nTitle="customer"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: t('customer.title'), active: true, i18n: 'customer' },
            ]}
            headerActions={
                <SubmitButton processing={processing} onClick={handleSubmit}>
                    {isEdit ? t('common.update') : t('common.save')}
                </SubmitButton>
            }
        >
            <div className="row">
                <div className="col-md-6">
                    <Accordion defaultActiveKey="0" className="mb-4">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>{t('customer.personal_data')}</Accordion.Header>
                            <Accordion.Body>
                                <TextInput
                                    id="name"
                                    label={t('customer.full_name')}
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
                                    options={[
                                        { value: 1, label: t('common.male') },
                                        { value: 2, label: t('common.female') },
                                    ]}
                                    row
                                />

                                <div className="row form-group mb-3">
                                    <label className="col-sm-3 col-form-label">
                                        {t('customer.place_date_birth')}
                                    </label>
                                    <div className="col-sm-9 d-flex gap-2">
                                        <input
                                            type="text"
                                            placeholder={t('customer.place')}
                                            value={data.birth_place}
                                            onChange={(e) =>
                                                setData(
                                                    'birth_place',
                                                    e.target.value,
                                                )
                                            }
                                            className="form-control flex-grow-1"
                                        />
                                        <DateInput
                                            id="birth_date"
                                            value={data.birth_date}
                                            onChange={(e) =>
                                                setData(
                                                    'birth_date',
                                                    e.target.value,
                                                )
                                            }
                                            style={{ width: 'auto' }}
                                        />
                                    </div>
                                </div>

                                <SelectInput
                                    id="marital"
                                    label={t('customer.marital_status')}
                                    value={data.marital}
                                    onChange={(value) =>
                                        setData('religion', Number(value))
                                    }
                                    options={[
                                        { value: 1, label: 'Single' },
                                        { value: 2, label: t('common.married') },
                                        { value: 3, label: t('common.widowed') },
                                        { value: 4, label: t('common.divorced') },
                                    ]}
                                    row
                                />

                                <SelectInput
                                    id="religion"
                                    label={t('customer.religion')}
                                    value={data.religion}
                                    onChange={(value) =>
                                        setData('religion', Number(value))
                                    }
                                    options={[
                                        { value: 0, label: '' },
                                        { value: 1, label: t('religion.buddhist') },
                                        { value: 2, label: t('religion.christian') },
                                        { value: 3, label: t('religion.islam') },
                                        { value: 4, label: t('religion.hindu') },
                                    ]}
                                    row
                                />

                                <TextInput
                                    id="identity"
                                    label={t('customer.identity_number')}
                                    value={data.identity}
                                    onChange={(e) =>
                                        setData('identity', e.target.value)
                                    }
                                    row
                                />

                                <TextInput
                                    id="profession"
                                    label={t('customer.occupation')}
                                    value={data.profession}
                                    onChange={(e) =>
                                        setData('profession', e.target.value)
                                    }
                                    row
                                />

                                <TextareaInput
                                    id="description"
                                    label={t('common.description')}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
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
                            <Accordion.Header>{t('customer.contact_info')}</Accordion.Header>
                            <Accordion.Body>
                                <TextInput
                                    id="mobile"
                                    label={t('common.mobile_number')}
                                    value={data.mobile}
                                    onChange={(e) =>
                                        setData('mobile', e.target.value)
                                    }
                                    row
                                />

                                <TextInput
                                    id="email"
                                    label={t('common.email_address')}
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    row
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1" className="mb-3">
                            <Accordion.Header>{t('customer.home_address')}</Accordion.Header>
                            <Accordion.Body>
                                <TextInput
                                    id="home_address"
                                    label={t('common.home_address')}
                                    value={data.home_address}
                                    onChange={(e) =>
                                        setData('home_address', e.target.value)
                                    }
                                    row
                                />
                                <TextInput
                                    id="home_postal"
                                    label={t('common.postal_code')}
                                    value={data.home_postal}
                                    onChange={(e) =>
                                        setData('home_postal', e.target.value)
                                    }
                                    row
                                />
                                <TextInput
                                    id="home_city"
                                    label={t('common.city')}
                                    value={data.home_city}
                                    onChange={(e) =>
                                        setData('home_city', e.target.value)
                                    }
                                    row
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>{t('common.office_address')}</Accordion.Header>
                            <Accordion.Body>
                                <TextInput
                                    id="work_address"
                                    label={t('common.office_address')}
                                    value={data.work_address}
                                    onChange={(e) =>
                                        setData('work_address', e.target.value)
                                    }
                                    row
                                />
                                <TextInput
                                    id="work_postal"
                                    label={t('common.postal_code')}
                                    value={data.work_postal}
                                    onChange={(e) =>
                                        setData('work_postal', e.target.value)
                                    }
                                    row
                                />
                                <TextInput
                                    id="work_city"
                                    label={t('common.city')}
                                    value={data.work_city}
                                    onChange={(e) =>
                                        setData('work_city', e.target.value)
                                    }
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
