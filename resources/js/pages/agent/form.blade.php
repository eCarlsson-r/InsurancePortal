@extends('layout.default')

@section('content')
<form id="agent-form">
    <!-- Container fluid  -->
    <div class="container-fluid">
        <!-- Bread crumb -->
        <div class="row page-titles mx-0">
            <div class="col-sm-6 p-md-0">
                <h3 class="text-primary d-inline" data-i18n="agent-input">Agen</h3>&emsp;
                <button class="btn btn-primary pull-right" id="agent-submit" data-i18n="submit-btn">Perbarui</button>
            </div>
            <div class="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="javascript:void(0)" data-i18n="master">Master</a></li>
                    <li class="breadcrumb-item active" data-i18n="agent-input">Agen</li>
                </ol>
            </div>
        </div>
        <!-- End Bread crumb -->
        <!-- Start Page Content -->
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title" data-i18n="personal-data">Data Pribadi</h4>
                        <div class="basic-form">
                            <input id="agent-code" class="d-none"/>
                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-name" data-i18n="name-as-id">Nama sesuai KTP</label>
                                <div class="col-sm-9">
                                    <input type="text" id="agent-name" class="form-control" data-i18n="[placeholder]agent_name_inst"/>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-gender" data-i18n="gender">Jenis Kelamin</label>
                                <div class="col-sm-9">
                                    <select class="form-control selectpicker" id="agent-gender">
                                        <option value="1" data-i18n="male">Pria</option>
                                        <option value="2" data-i18n="female">Wanita</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-birth-place" data-i18n="place_date_birth">Tempat dan Tanggal Lahir</label>
                                <div class="col-sm-9 form-inline">
                                    <input type="text" id="agent-birth-place" class="form-control col-6"><input type="date" id="agent-birth-date" class="form-control col-6">
                                </div>
                            </div>
                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-address" data-i18n="address">Alamat</label>
                                <div class="col-sm-9">
                                    <textarea id="agent-address" rows="2" class="form-control"></textarea>
                                </div>
                            </div>
                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-religion" data-i18n="agent-religion">Agama</label>
                                <div class="col-sm-9">
                                    <input type="email" id="agent-religion" class="form-control"/>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-idno" data-i18n="id-number">No. KTP</label>
                                <div class="col-sm-9">
                                    <input type="text" id="agent-idno" class="form-control"/>
                                </div>
                            </div>
                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-taxno" data-i18n="tax-number">NPWP</label>
                                <div class="col-sm-9">
                                    <input type="text" id="agent-taxno" class="form-control"/>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-city" data-i18n="marketing-city">Kota Marketing</label>
                                <div class="col-sm-9">
                                    <input type="text" id="agent-city" class="form-control"/>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-province" data-i18n="province">Provinsi</label>
                                <div class="col-sm-9">
                                    <input type="text" id="agent-province" class="form-control"/>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-postal" data-i18n="postal-code">Kode Pos</label>
                                <div class="col-sm-9">
                                    <input type="text" id="agent-postal" class="form-control"/>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-education" data-i18n="last-education">Pendidikan Terakhir</label>
                                <div class="col-sm-9">
                                    <input type="text" id="agent-education" class="form-control"/>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-phone" data-i18n="phone-number">Nomor Telfon</label>
                                <div class="col-sm-9">
                                    <input type="phone" id="agent-phone" class="form-control"/>
                                </div>
                                
                            </div>
                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-mobile" data-i18n="mobile-number">Nomor Ponsel</label>
                                <div class="col-sm-9">
                                    <input type="mobile" id="agent-mobile" class="form-control"/>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-email" data-i18n="email-address">Alamat e-Mail</label>
                                <div class="col-sm-9">
                                    <input type="email" id="agent-email" class="form-control"/>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-status" data-i18n="agent-status">Status</label>
                                <div class="col-sm-9">
                                    <select class="form-control selectpicker" id="agent-status">
                                        <option value="1" data-i18n="single">Single</option>
                                        <option value="2" data-i18n="married">Kawin</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-spouse" data-i18n="spouse-name">Nama Suami / Isteri</label>
                                <div class="col-sm-9">
                                    <input type="text" id="agent-spouse" class="form-control" placeholder="Diisi bila menikah"/>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-occupation" data-i18n="occupation">Pekerjaan</label>
                                <div class="col-sm-9">
                                    <input type="text" id="agent-occupation" class="form-control"/>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-dependents" data-i18n="number-dependents">Jumlah Tanggungan</label>
                                <div class="col-sm-8 input-group">
                                    <input type="number" id="agent-dependents" class="form-control"/>
                                    <div class="input-group-append">
                                        <span class="input-group-text" data-i18n="people">orang</span>
                                    </div>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-notes" data-i18n="notes">Catatan</label>
                                <div class="col-sm-9">
                                    <textarea id="agent-notes" rows="2" class="form-control"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title" data-i18n="agent_status">Status Agen</h4>
                        <div class="basic-form">
                            <div class="row form-group">
                                <label class="col-sm-3" for="apply-date" data-i18n="apply-date">Tanggal Pengisian</label>
                                <div class="col-sm-9">
                                    <input type="date" id="apply-date" class="form-control"/>
                                </div>
                            </div>
                            <div class="row form-group">
                                <label class="col-sm-3" for="apply-place" data-i18n="apply-place">Tempat Pengisian</label>
                                <div class="col-sm-9">
                                    <input type="text" id="apply-place" class="form-control"/>
                                </div>
                            </div>
                            <div class="row form-group">
                                <label class="col-sm-3" for="apply-agency" data-i18n="apply-agency">Agency / Regional</label>
                                <div class="col-sm-9">
                                    <select id="apply-agency" class="form-control agencySelector"></select>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-number" data-i18n="agent-number">Kode Agen</label>
                                <div class="col-sm-9">
                                    <input type="text" id="agent-number" class="form-control" data-i18n="[placeholder]agent_code_inst"/>
                                </div>
                            </div>
                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-license" data-i18n="agent-license">Nomor Lisensi</label>
                                <div class="col-sm-9">
                                    <input type="text" id="agent-license" class="form-control"/>
                                </div>
                            </div>
                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-duedate" data-i18n="payable-date">Jatuh Tempo</label>
                                <div class="col-sm-9">
                                    <input type="date" id="agent-duedate" class="form-control"/>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" for="agent-recruiter" data-i18n="recruiter">Perekruit</label>
                                <div class="col-sm-9">
                                    <select id="agent-recruiter" class="form-control agentSelector" data-live-search="true"></select>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-sm-3" data-i18n="agent_level">Program Allowance</label>
                                <div class="col-sm-9">
                                    <button id="program-launcher" class="btn btn-primary" type="button" data-toggle="modal" data-target="#agent-program-modal">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col-sm-12">
                                    <table id="table-agentprogram" data-toggle="table">
                                        <thead>
                                            <tr>
                                                <th class="col-xs-2" data-field="program-start">Mulai Program</th>
                                                <th class="col-xs-2" data-field="position" data-formatter="LevelFormatter">Jabatan</th>
                                                <th class="col-xs-2" data-field="agent-leader" data-formatter="LeaderFormatter">Leader Langsung</th>
                                                <th class="col-xs-3" data-field="program">Program</th>
                                                <th class="col-xs-3" data-field="allowance" data-formatter="agentprogramIDRFormatter">Allowance</th>
                                                <th class="col-xs-1" data-field="agentprogram-code" data-formatter="agentprogramActionFormatter" data-events="agentprogramActionHandler"></th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-3" data-i18n="agent-files">Berkas Agen</label>
                                <div class="col-9">
                                    <table id="table-agentfiles" data-toggle="table" data-show-header="false">
                                        <thead>
                                            <tr>
                                                <th class="col-sm-11" data-field="file-name" data-formatter="fileFormatter" data-events="agentfilesActionHandler">Nama Berkas</th>
                                                <th class="col-sm-1" data-formatter="agentfilesActionFormatter" data-events="agentfilesActionHandler"></th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- End PAge Content -->
    </div>
</form>

@include('pages.agent.partials.modal-program')

@endsection
