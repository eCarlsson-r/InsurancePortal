import FormField from '@/components/form/form-field';
import SelectInput from '@/components/form/select-input';
import SubmitButton from '@/components/form/submit-button';
import TextInput from '@/components/form/text-input';
import FormPage from '@/layouts/FormPage';
import { programSchema } from '@/schemas/models';
import { router, useForm } from '@inertiajs/react';
import { Accordion, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export default function ProgramForm({
    program,
}: {
    program?: z.infer<typeof programSchema> | null;
}) {
    const { t } = useTranslation();
    const isEdit = !!program;

    // Initial form state with safe defaults
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
    } = useForm<z.infer<typeof programSchema>>(
        isEdit && program
            ? program
            : {
                  name: '',
                  position: '',
                  min_allowance: 0,
                  max_allowance: 0,
                  duration: 0,
                  direct_calculation: 0,
                  indirect_calculation: 0,
                  targets: [],
              },
    );

    const handleSubmit = () => {
        if (isEdit) {
            put(`/master/program/${program.id}`);
        } else {
            post('/master/program');
        }
    };

    // Helper to add program row
    const addTarget = () => {
        setData('targets', [
            ...data.targets,
            {
                program_id: program?.id || 0,
                allowance: 0,
                month: 0,
                case_month: 0,
                fyp_month: 0,
            },
        ]);
    };

    const removeTarget = (index: number) => {
        if (data.targets[index].id) {
            if (confirm(t('program.confirm_delete'))) {
                destroy(`/master/target/${data.targets[index].id}`, {
                    onSuccess: () => {
                        // Redirects back to the current page, triggering a re-fetch of props
                        router.visit(window.location.href, {
                            preserveState: false,
                        });
                        // Or simply: router.get(window.location.href);
                    },
                    onError: (errors) => {
                        console.log('Error deleting item:', errors);
                    },
                });
            }
        } else {
            setData(
                'targets',
                data.targets.filter((_, i) => i !== index),
            );
        }
    };

    return (
        <FormPage
            headTitle={isEdit ? t('program.edit_title') : t('program.create_title')}
            title={t('program.title')}
            i18nTitle="program"
            breadcrumbs={[
                { label: t('common.master'), href: 'javascript:void(0)', i18n: 'master' },
                { label: t('program.title'), active: true, i18n: 'program' },
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
                            <Accordion.Header>{t('program.program_data')}</Accordion.Header>
                            <Accordion.Body>
                                <TextInput
                                    id="name"
                                    label={t('program.program_name')}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    row
                                />

                                <SelectInput
                                    id="position"
                                    label={t('program.position')}
                                    value={data.position}
                                    onChange={(value) =>
                                        setData('position', value.toString())
                                    }
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
                                    row
                                />

                                <FormField
                                    id="allowance"
                                    label="Allowance"
                                    row
                                    className="mb-3"
                                >
                                    <div className="d-flex gap-2 align-items-center">
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={data.min_allowance}
                                            onChange={(e) =>
                                                setData(
                                                    'min_allowance',
                                                    parseFloat(e.target.value),
                                                )
                                            }
                                            placeholder={t('common.minimum')}
                                        />
                                        <span className="text-muted">s/d</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={data.max_allowance}
                                            onChange={(e) =>
                                                setData(
                                                    'max_allowance',
                                                    parseFloat(e.target.value),
                                                )
                                            }
                                            placeholder={t('common.maximum')}
                                        />
                                    </div>
                                </FormField>

                                <TextInput
                                    id="duration"
                                    label="Durasi (Bulan)"
                                    type="number"
                                    value={data.duration}
                                    onChange={(e) =>
                                        setData(
                                            'duration',
                                            parseInt(e.target.value),
                                        )
                                    }
                                    row
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>

                <div className="col-md-6">
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>{t('program.program_targets')}</Accordion.Header>
                            <Accordion.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0">{t('program.target_list')}</h6>
                                    <button
                                        onClick={addTarget}
                                        className="btn btn-sm btn-primary"
                                        type="button"
                                    >
                                        <i className="fa fa-plus me-1"></i>
                                        {t('common.add')}
                                    </button>
                                </div>
                                <div className="table-responsive">
                                    <Table bordered responsive>
                                        <thead>
                                            <tr>
                                                <th style={{ width: '80px' }}>
                                                    Bulan
                                                </th>
                                                <th>FYP</th>
                                                <th style={{ width: '80px' }}>
                                                    Case
                                                </th>
                                                <th>Allowance</th>
                                                <th
                                                    style={{ width: '40px' }}
                                                ></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.targets &&
                                            data.targets.length > 0 ? (
                                                data.targets.map(
                                                    (target, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <TextInput
                                                                    id={`target-month-${index}`}
                                                                    type="number"
                                                                    parentClassName="mb-1 mt-1"
                                                                    className="form-control-sm text-center"
                                                                    value={
                                                                        target.month
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const newTargets =
                                                                            [
                                                                                ...data.targets,
                                                                            ];
                                                                        newTargets[
                                                                            index
                                                                        ].month =
                                                                            parseInt(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            );
                                                                        setData(
                                                                            'targets',
                                                                            newTargets,
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <TextInput
                                                                    id={`target-fyp-${index}`}
                                                                    type="number"
                                                                    className="form-control-sm"
                                                                    parentClassName="mb-1 mt-1"
                                                                    value={
                                                                        target.fyp_month
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const newTargets =
                                                                            [
                                                                                ...data.targets,
                                                                            ];
                                                                        newTargets[
                                                                            index
                                                                        ].fyp_month =
                                                                            parseFloat(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            );
                                                                        setData(
                                                                            'targets',
                                                                            newTargets,
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <TextInput
                                                                    id={`target-case-${index}`}
                                                                    type="number"
                                                                    parentClassName="mb-1 mt-1"
                                                                    className="form-control-sm text-center"
                                                                    value={
                                                                        target.case_month
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const newTargets =
                                                                            [
                                                                                ...data.targets,
                                                                            ];
                                                                        newTargets[
                                                                            index
                                                                        ].case_month =
                                                                            parseInt(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            );
                                                                        setData(
                                                                            'targets',
                                                                            newTargets,
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <TextInput
                                                                    id={`target-allowance-${index}`}
                                                                    type="number"
                                                                    className="form-control-sm"
                                                                    parentClassName="mb-1 mt-1"
                                                                    value={
                                                                        target.allowance
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) => {
                                                                        const newTargets =
                                                                            [
                                                                                ...data.targets,
                                                                            ];
                                                                        newTargets[
                                                                            index
                                                                        ].allowance =
                                                                            parseFloat(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            );
                                                                        setData(
                                                                            'targets',
                                                                            newTargets,
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className="text-center">
                                                                <button
                                                                    onClick={() =>
                                                                        removeTarget(
                                                                            index,
                                                                        )
                                                                    }
                                                                    className="btn btn-link btn-sm text-danger p-0"
                                                                    type="button"
                                                                    title={t('common.delete')}
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
                                                        colSpan={5}
                                                        className="text-center text-muted py-2"
                                                    >
                                                        Belum ada target.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>
        </FormPage>
    );
}
