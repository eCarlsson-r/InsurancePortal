import SelectInput from '@/components/form/select-input';
import TextInput from '@/components/form/text-input';
import SubmitButton from '@/components/form/submit-button';
import FormPage from '@/layouts/FormPage';
import { programSchema } from '@/schemas/models';
import { router, useForm } from '@inertiajs/react';
import { Accordion, Table } from 'react-bootstrap';
import { z } from 'zod';

export default function ProgramForm({
    program,
}: {
    program?: z.infer<typeof programSchema> | null;
}) {
    const isEdit = !!program;

    // Initial form state with safe defaults
    const { data, setData, post, put, delete: destroy, processing } = useForm<
        z.infer<typeof programSchema>
    >(
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
            if (confirm('Are you sure you want to delete this?')) {
                destroy(`/master/target/${data.targets[index].id}`, {
                    onSuccess: () => {
                        // Redirects back to the current page, triggering a re-fetch of props
                        router.visit(window.location.href, { preserveState: false });
                        // Or simply: router.get(window.location.href);
                    },
                    onError: (errors) => {
                        console.log("Error deleting item:", errors);
                    },
                });
            }
        } else {
            setData('targets', data.targets.filter((_, i) => i !== index));
        }
    };

    return (
        <FormPage
            headTitle={isEdit ? 'Sunting Program' : 'Tambah Program'}
            title="Program"
            i18nTitle="program"
            breadcrumbs={[
                { label: 'Master', href: 'javascript:void(0)', i18n: 'master' },
                { label: 'Program', active: true, i18n: 'program' },
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
                    <Accordion defaultActiveKey="0" className="mb-4">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                Data Program
                            </Accordion.Header>
                            <Accordion.Body>
                                <TextInput
                                    id="name"
                                    label="Nama Program"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    row
                                />

                                <SelectInput
                                    id="position"
                                    label="Jabatan"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    options={[
                                        { value: 'FC', label: 'Financial Consultant' },
                                        { value: 'BP*', label: 'Business Partner *' },
                                        { value: 'BP**', label: 'Business Partner **' },
                                        { value: 'BP***', label: 'Business Partner ***' },
                                    ]}
                                    row
                                />

                                <div className="row form-group mb-3">
                                    <label className="col-sm-3 col-form-label">Allowance</label>
                                    <div className="col-sm-9 d-flex gap-2 align-items-center">
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={data.min_allowance}
                                            onChange={(e) => setData('min_allowance', parseFloat(e.target.value))}
                                            placeholder="Minimal"
                                        />
                                        <span className="text-muted">s/d</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={data.max_allowance}
                                            onChange={(e) => setData('max_allowance', parseFloat(e.target.value))}
                                            placeholder="Maksimal"
                                        />
                                    </div>
                                </div>

                                <TextInput
                                    id="duration"
                                    label="Durasi (Bulan)"
                                    type="number"
                                    value={data.duration}
                                    onChange={(e) => setData('duration', parseInt(e.target.value))}
                                    row
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>

                <div className="col-md-6">
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                Target Program
                            </Accordion.Header>
                            <Accordion.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0">Daftar Target</h6>
                                    <button
                                        onClick={addTarget}
                                        className="btn btn-sm btn-primary"
                                        type="button"
                                    >
                                        <i className="fa fa-plus me-1"></i>
                                        Tambah
                                    </button>
                                </div>
                                <div className="table-responsive">
                                    <Table className="table-sm table-bordered">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '80px' }}>Bulan</th>
                                                <th>FYP</th>
                                                <th style={{ width: '80px' }}>Case</th>
                                                <th>Allowance</th>
                                                <th style={{ width: '40px' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.targets && data.targets.length > 0 ? (
                                                data.targets.map((target, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm text-center"
                                                                value={target.month}
                                                                onChange={(value) => {
                                                                    const newTargets = [...data.targets];
                                                                    newTargets[index].month = parseInt(e.target.value);
                                                                    setData('targets', newTargets);
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                value={target.fyp_month}
                                                                onChange={(value) => {
                                                                    const newTargets = [...data.targets];
                                                                    newTargets[index].fyp_month = parseFloat(e.target.value);
                                                                    setData('targets', newTargets);
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm text-center"
                                                                value={target.case_month}
                                                                onChange={(value) => {
                                                                    const newTargets = [...data.targets];
                                                                    newTargets[index].case_month = parseInt(e.target.value);
                                                                    setData('targets', newTargets);
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                value={target.allowance}
                                                                onChange={(value) => {
                                                                    const newTargets = [...data.targets];
                                                                    newTargets[index].allowance = parseFloat(e.target.value);
                                                                    setData('targets', newTargets);
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="text-center">
                                                            <button
                                                                onClick={() => removeTarget(index)}
                                                                className="btn btn-link btn-sm text-danger p-0"
                                                                type="button"
                                                                title="Delete"
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center text-muted py-2">
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
