import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <TemplateLayout>
            <Head title="Dashboard" />

            <div className="container-fluid"> 
                <div className="row page-titles mx-0">
                    <div className="col-sm-6 p-md-0">
                        <h3 className="text-primary d-inline" data-i18n="birthday-report">Ulang Tahun Nasabah</h3> </div>
                    <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="javascript:void(0)" data-i18n="report">Laporan</a></li>
                            <li className="breadcrumb-item active" data-i18n="birthday-report">Ulang Tahun Nasabah</li>
                        </ol>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <div id="birthday-toolbar" className="form-inline">
                                    <div className="col-sm-4 form-group">
                                        <h4 className="card-title" data-i18n="customer-birthday-report">Daftar Ulang Tahun Nasabah</h4>
                                    </div>
                                    <div className="col-sm-4 form-group">
                                        <label className="col-sm-4" htmlFor="birthday-month" data-i18n="month">Bulan</label>
                                        <select id="birthday-month" className="col-sm-8 form-control">
                                            <option value=""></option>
                                            <option value="1" data-i18n="january"></option>
                                            <option value="2" data-i18n="february"></option>
                                            <option value="3" data-i18n="march"></option>
                                            <option value="4" data-i18n="april"></option>
                                            <option value="5" data-i18n="may"></option>
                                            <option value="6" data-i18n="june"></option>
                                            <option value="7" data-i18n="july"></option>
                                            <option value="8" data-i18n="august"></option>
                                            <option value="9" data-i18n="september"></option>
                                            <option value="10" data-i18n="october"></option>
                                            <option value="11" data-i18n="november"></option>
                                            <option value="12" data-i18n="december"></option>
                                        </select>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table id="table-birthday" className="display nowrap table table-hover table-striped table-bordered"
                                        data-toggle="table" data-url="" data-query-params="getBirthdayList" data-response-handler="showBirthdayList"
                                        data-toolbar="#birthday-toolbar" cellSpacing={0} width="100%">
                                        <thead><tr>
                                            <th data-field="customer-name">Nama</th>
                                            <th data-field="customer-birthdate" data-formatter="birthdayFullDateFormatter">Tanggal Lahir</th>
                                            <th data-field="customer-age">Umur</th>
                                            <th data-field="customer-religion" data-formatter="customerReligionFormatter">Agama</th>
                                            <th data-field="customer-address">Alamat Rumah</th>
                                        </tr></thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TemplateLayout>
    );
}