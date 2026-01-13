import TemplateLayout from "@/layouts/TemplateLayout";
import { Table } from "react-bootstrap";
import { Head } from "@inertiajs/react";
import { agencySchema, agentSchema } from "@/schemas/models";
import { z } from "zod";

interface AgencyProps {
    agencies: z.infer<typeof agencySchema>[];
    agents: z.infer<typeof agentSchema>[];
}

export default function Agency({ agencies = [], agents = [] }: AgencyProps) {
    return (
        <TemplateLayout>
            <Head title="Agency" />

            <div className="container-fluid">
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="agency">Agency</h3>
                    </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="master">Master</a></li>
                            <li className="breadcrumb-item active" data-i18n="agency">Agency</li>
                        </ol>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div id="agency-toolbar" className="toolbar card-title">
                                    <h4 data-i18n="agency-list">Daftar Agency</h4>
                                </div>
                                <div className="table-responsive">
                                    <Table hover striped bordered>
                                        <thead>
                                        <tr>
                                            <th className="col-xs-3" data-field="agency-name">Nama Agency</th>
                                            <th className="col-xs-2" data-field="agency-city">Kota Agency</th>
                                            <th className="col-xs-3" data-field="agency-director">Direktur Agency</th>
                                            <th className="col-xs-3" data-field="agency-leader" data-formatter="agencyLeaderFormat">Agency Atasan</th>
                                            <th className="col-xs-1" data-formatter="agencyActionFormatter" data-events="agencyActionHandler"></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {agencies.length > 0 ? (
                                                agencies.map((agency) => (
                                                    <tr key={agency.id}>
                                                        <td>{agency.name}</td>
                                                        <td>{agency.city}</td>
                                                        <td>{agency.director}</td>
                                                        <td>{agency.leader}</td>
                                                        <td></td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="text-center text-muted py-4">
                                                        No agencies found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <form id="agency-form">
                                    <div className="row card-title">
                                        <div className="col-md-9 col-sm-10 col-8">
                                            <h4 data-i18n="edit-agency">Sunting Agency</h4>
                                            <h6 data-i18n="edit-agency-inst">Masukkan informasi mengenai Agency.</h6>
                                        </div>
                                        <div className="col-md-3 col-sm-2 col-4">
                                            <button className="btn btn-primary pull-right" id="agency-submit" data-i18n="submit-btn">Perbarui</button>
                                        </div>
                                    </div>
                                    <div className="basic-form">
                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="agency-name">Nama Agency</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control"/>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="agency-city">Kota Agency</label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control"/>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="agency-director">Direktur Agency</label>
                                            <div className="col-sm-9">
                                                <select className="form-control">
                                                    {agents.map((agent) => (
                                                        <option key={agent.id} value={agent.id}>
                                                            {agent.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row form-group">
                                            <label className="col-sm-3" data-i18n="agency-leader">Agency Atasan</label>
                                            <div className="col-sm-9">
                                                <select className="form-control">
                                                    {agencies.map((agency) => (
                                                        <option key={agency.id} value={agency.id}>
                                                            {agency.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TemplateLayout>
    );
}
