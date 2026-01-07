@extends('layout.default')

@section('content')
<div class="container-fluid">
    <!-- Bread crumb -->
    <div class="row page-titles mx-0">
        <div class="col-6 p-md-0">
            <h3 class="text-primary d-inline" data-i18n="agent">Agen</h3> </div>
        <div class="col-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="javascript:void(0)" data-i18n="master">Master</a></li>
                <li class="breadcrumb-item active" data-i18n="agent">Agen</li>
            </ol>
        </div>
    </div>
    <!-- End Bread crumb -->
    <!-- Start Page Content -->
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div id="agent-toolbar" class="card-title toolbar form-inline">
                        <h4 data-i18n="agent-list">Daftar Agen</h4>&emsp;
                        <a href="{{ route('master.agent.create') }}" class="btn btn-primary">
                            <i class="fa fa-user"></i> <span data-i18n="new-agent">Agen Baru</span>
                        </a>
                    </div>
                    <div class="table-responsive">
                        <table id="table-agent" class="display nowrap table table-hover table-striped table-bordered" data-toolbar="#agent-toolbar"
                               data-toggle="table" data-pagination="true" data-page-size="5" data-page-list="[5,10, 25, 50, 100]" data-url="" data-search="true"
                               data-query-params="getAgentList" data-response-handler="showAgentList" data-row-style="rowStyle" cellspacing="0" width="100%">
                            <thead>
                            <tr>
                                <th class="col-sm-1" data-sortable="true" data-field="agent-number">Kode Agen</th>
                                <th class="col-sm-2" data-field="agent-name">Nama Agen</th>
                                <th class="col-sm-1" data-sortable="true" data-field="agent-level" data-formatter="LevelFormatter">Jabatan Agen</th>
                                <th class="col-sm-2" data-field="agent-email">Email Agen</th>
                                <th class="col-sm-2" data-sortable="true"  data-field="agent-birth-date" data-formatter="agentFullDateFormatter">Tanggal Lahir</th>
                                <th class="col-sm-1" data-sortable="true"  data-field="agent-mobile">Nomor Ponsel</th>
                                <th class="col-sm-1" data-formatter="agentActionFormatter" data-events="agentActionHandler"></th>
                            </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- End PAge Content -->
</div>
@endsection
