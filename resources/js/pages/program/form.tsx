import TemplateLayout from '@/layouts/TemplateLayout';
import { programSchema, programTargetSchema } from '@/schemas/models';
import { Head, useForm } from '@inertiajs/react';
import { Accordion, Table } from 'react-bootstrap';
import { z } from 'zod';

export default function ProgramForm({
    program,
}: {
    program?: z.infer<typeof programSchema> | null;
}) {
    const isEdit = !!program;

    // Initial form state with safe defaults
    const { data, setData, post, put, processing } = useForm<
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
        const newTargets = [...data.targets];
        newTargets.splice(index, 1);
        setData('targets', newTargets);
    };

    return (
        <TemplateLayout>
            <Head
                title={isEdit ? 'Sunting Data Program' : 'Input Data Program'}
            />
            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3
                            className="text-primary d-inline"
                            data-i18n="program-input"
                        >
                            Program
                        </h3>
                        &emsp;
                        <button
                            className="btn btn-primary pull-right"
                            onClick={handleSubmit}
                            disabled={processing}
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
                                data-i18n="program-input"
                            >
                                Program
                            </li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <Accordion defaultActiveKey="0" className="mb-3">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    Data Program
                                </Accordion.Header>
                                <Accordion.Body>
                                    <input
                                        id="program-code"
                                        className="d-none"
                                    />
                                    <div className="row form-group">
                                        <label className="col-sm-4">
                                            Nama Program
                                        </label>
                                        <input
                                            type="text"
                                            className="col-sm-8 form-control"
                                            value={program?.name}
                                        />
                                    </div>
                                    <div className="row form-group">
                                        <label className="col-sm-4">
                                            Program untuk Jabatan
                                        </label>
                                        <select
                                            className="col-sm-8 form-control selectpicker"
                                            value={program?.position}
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
                                    </div>
                                    <div className="row form-group">
                                        <label className="col-sm-4">
                                            Allowance
                                        </label>
                                        <div className="col-sm-8 px-0 input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={program?.min_allowance}
                                            />
                                            <div className="input-group-addon">
                                                <span className="input-group-text">
                                                    {' '}
                                                    s/d{' '}
                                                </span>
                                            </div>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={program?.max_allowance}
                                            />
                                        </div>
                                    </div>
                                    <div className="row form-group">
                                        <label className="col-sm-4">
                                            Durasi Program
                                        </label>
                                        <input
                                            type="number"
                                            className="col-sm-8 form-control"
                                            value={program?.duration}
                                        />
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>

                    <div className="col-md-6">
                        <Accordion defaultActiveKey="1" className="mb-3">
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    Target Program
                                </Accordion.Header>
                                <Accordion.Body>
                                    <button
                                        onClick={addTarget}
                                        className="btn btn-primary d-inline float-right"
                                        type="button"
                                    >
                                        <i className="fa fa-plus"></i>
                                    </button>
                                    <p className="clearfix"></p>
                                    <div className="basic-form">
                                        <div className="row form-group">
                                            <div className="col-sm-12">
                                                <Table>
                                                    <thead>
                                                        <th>Bulan</th>
                                                        <th>FYP</th>
                                                        <th>Case</th>
                                                        <th>Allowance</th>
                                                        <th></th>
                                                    </thead>
                                                    <tbody>
                                                        {program &&
                                                            program.targets &&
                                                            program.targets.map(
                                                                (
                                                                    target: z.infer<
                                                                        typeof programTargetSchema
                                                                    >,
                                                                ) => (
                                                                    <tr key={target.id}>
                                                                        <td>{target.month}</td>
                                                                        <td>
                                                                            {target.fyp_month.toLocaleString(
                                                                                'id-ID',
                                                                                {
                                                                                    style: 'currency',
                                                                                    currency: 'IDR',
                                                                                },
                                                                            )}
                                                                        </td>
                                                                        <td>{target.case_month}</td>
                                                                        <td>
                                                                            {target.allowance.toLocaleString(
                                                                                'id-ID',
                                                                                {
                                                                                    style: 'currency',
                                                                                    currency: 'IDR',
                                                                                },
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            <button
                                                                                onClick={() =>
                                                                                    removeTarget(
                                                                                        program.targets.indexOf(
                                                                                            target,
                                                                                        ),
                                                                                    )
                                                                                }
                                                                                className="btn btn-danger btn-sm"
                                                                                type="button"
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
            </div>
        </TemplateLayout>
    );
}
