@extends('layout.default')

@section('content')
<!-- Container fluid  -->
<div class="container-fluid">
    <!-- Bread crumb -->
    <div class="row page-titles mx-0">
        <div class="col-sm-6 p-md-0">
            <h3 class="text-primary d-inline" data-i18n="case-input">SP / Polis</h3>&emsp;
                <button class="btn btn-primary pull-right" id="case-submit" data-i18n="submit-btn">Perbarui</button>
        </div>
        <div class="col-sm-6 p-md-0 justify-content-end mt-2 d-flex">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="javascript:void(0)" data-i18n="sales">Penjualan</a></li>
                <li class="breadcrumb-item active" data-i18n="case-input">SP / Polis</li>
            </ol>
        </div>
    </div>
    <!-- End Bread crumb -->
    <!-- Start Page Content -->
    <form id="case-form">
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h3>Berkas</h3>
                        @if (isset($files))
                        <div id="accordion-eleven" class="accordion accordion-rounded-stylish accordion-bordered">
                        @foreach ($files as $file)
                            <div class="accordion__item">
                                <div class="accordion__header accordion__header--primary" data-toggle="collapse" data-target="#rounded-stylish_collapse{{ $file->id }}">
                                    <span class="accordion__header--icon"></span>
                                    <span class="accordion__header--text">Sunting Data SP</span>
                                    <span class="accordion__header--indicator"></span>
                                </div>
                                <div id="rounded-stylish_collapse{{ $file->id }}" class="collapse accordion__body show" data-parent="#accordion-eleven">
                                    <div class="accordion__body--text">
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-code" data-i18n="case-code">No. SP</label>
                                            <div class="col-sm-9">
                                                <input id="case-code" class="form-control" value="{{ $extracted['case_code'] ?? '' }}"/>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-agent" data-i18n="agent">Agen</label>
                                            <div class="col-sm-9">
                                                <select id="case-agent" class="form-control agentSelector" data-live-search="true"></select>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-subagent" data-i18n="subagent">Subagen</label>
                                            <div class="col-sm-9">
                                                <select id="case-subagent" class="form-control subagentSelector" data-live-search="true"></select>
                                            </div>
                                        </div>
                                        
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-entry-date" data-i18n="case-entry-date">Tanggal SP Masuk</label>
                                            <div class="col-sm-9">
                                                <input type="date" id="case-entry-date" class="form-control"/>
                                            </div>
                                        </div>
                        
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="holder-name">Pemegang Polis</label>
                                            <div class="col-sm-9">
                                                <input type="text" id="holder-name" class="form-control" value="{{ $extracted['holder_name'] ?? '' }}"/>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="insured-name">Tertanggung</label>
                                            <div class="col-sm-9">
                                                <input type="text" id="insured-name" class="form-control" value="{{ $extracted['insured_name'] ?? '' }}"/>
                                            </div>
                                        </div>
                        
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-tagih" data-i18n="tagih">Tagih</label>
                                            <div class="col-sm-9">
                                                <select class="form-control selectpicker" id="case-tagih">
                                                    <option value="1" data-i18n="[label]home">Rumah</option>
                                                    <option value="2" data-i18n="[label]work">Kantor</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <div class="col-12 input-group">
                                                <div class="input-group-prepend">
                                                    <div class="input-group-text">
                                                        <input type="checkbox" id="insure-holder" 
                                                            {{ (isset($extracted) && $extracted['holder_name'] == $extracted['insured_name']) ? 'checked' : '' }}>
                                                    </div>
                                                </div>
                                                <label class="form-control" for="insure-holder">
                                                    Data pemegang polis sama dengan data tertanggung.
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                        </div>
                        @endif
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <div id="accordion-eleven" class="accordion accordion-rounded-stylish accordion-bordered">
                            <div class="accordion__item">
                                <div class="accordion__header accordion__header--primary" data-toggle="collapse" data-target="#rounded-stylish_collapseOne">
                                    <span class="accordion__header--icon"></span>
                                    <span class="accordion__header--text">Sunting Data SP</span>
                                    <span class="accordion__header--indicator"></span>
                                </div>
                                <div id="rounded-stylish_collapseOne" class="collapse accordion__body show" data-parent="#accordion-eleven">
                                    <div class="accordion__body--text">
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-code" data-i18n="case-code">No. SP</label>
                                            <div class="col-sm-9">
                                                <input id="case-code"  class="form-control"/>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-agent" data-i18n="agent">Agen</label>
                                            <div class="col-sm-9">
                                                <select id="case-agent" class="form-control agentSelector" data-live-search="true"></select>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-subagent" data-i18n="subagent">Subagen</label>
                                            <div class="col-sm-9">
                                                <select id="case-subagent" class="form-control subagentSelector" data-live-search="true"></select>
                                            </div>
                                        </div>
                                        
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-entry-date" data-i18n="case-entry-date">Tanggal SP Masuk</label>
                                            <div class="col-sm-9">
                                                <input type="date" id="case-entry-date" class="form-control"/>
                                            </div>
                                        </div>
                        
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-customer" data-i18n="customer">Nasabah</label>
                                            <div class="col-sm-9">
                                                <select id="case-customer" class="form-control customerSelector" data-live-search="true"></select>
                                            </div>
                                        </div>
                        
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-tagih" data-i18n="tagih">Tagih</label>
                                            <div class="col-sm-9">
                                                <select class="form-control selectpicker" id="case-tagih">
                                                    <option value="1" data-i18n="[label]home">Rumah</option>
                                                    <option value="2" data-i18n="[label]work">Kantor</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <div class="col-12 input-group">
                                                <div class="input-group-prepend">
                                                    <div class="input-group-text">
                                                        <input type="checkbox" id="insure-holder">
                                                    </div>
                                                </div>
                                                <label class="form-control" for="insure-holder">
                                                    Data pemegang polis sama dengan data tertanggung.
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="accordion__item">
                                <div class="accordion__header collapsed accordion__header--info" data-toggle="collapse" data-target="#rounded-stylish_collapseTwo">
                                    <span class="accordion__header--icon"></span>
                                    <span class="accordion__header--text">Tertanggung</span>
                                    <span class="accordion__header--indicator"></span>
                                </div>
                                <div id="rounded-stylish_collapseTwo" class="collapse accordion__body" data-parent="#accordion-eleven">
                                    <div class="accordion__body--text">
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="insured-name" data-i18n="complete-name">Nama Lengkap</label>
                                            <div class="col-sm-9">
                                                <input type="text" id="insured-name" class="form-control"/>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="insured-gender" data-i18n="gender">Jenis Kelamin</label>
                                            <div class="col-sm-9">
                                                <select class="form-control selectpicker" id="insured-gender">
                                                    <option value="1" data-i18n="male">Pria</option>
                                                    <option value="2" data-i18n="female">Wanita</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="insured-birthplace" data-i18n="place-date-birth">Tempat dan Tanggal Lahir</label>
                                            <div class="col-sm-9 input-group">
                                                <input type="text" id="insured-birthplace" class="col-6 form-control"/>
                                                <input type="date" id="insured-birthdate" class="col-6 form-control"/>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="insured-marital" data-i18n="marital-status">Status</label>
                                            <div class="col-sm-9">
                                                <select class="form-control selectpicker" id="insured-marital">
                                                    <option value="1" data-i18n="single">Single</option>
                                                    <option value="2" data-i18n="married">Kawin</option>
                                                    <option value="3" data-i18n="widow">Duda/Janda</option>
                                                    <option value="4" data-i18n="divorce">Cerai</option>
                                                </select>
                                            </div>  
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-relation" data-i18n="relationship">Hubungan</label>
                                            <div class="col-sm-9">
                                                <input class="form-control" type="text" name="hubungan" id="hubungan" value="" size="20">
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="insured-profession" data-i18n="profession">Pekerjaan</label>
                                            <div class="col-sm-9">
                                                <input type="text" id="insured-profession" class="form-control"/>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="insured-homeaddress" data-i18n="home-address">Alamat Rumah</label>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="insured-homeaddress" value="" size="80">
                                            </div>
                                        </div>
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="insured-homepostal" data-i18n="postal-code">Kode Pos</label>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="insured-homepostal" value="" size="5">
                                            </div>
                                        </div>
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="insured-homecity" data-i18n="city">Kota</label>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="insured-homecity" value="" size="20">
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="insured-workaddress" data-i18n="work-address">Alamat Kantor</label>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="insured-workaddress" value="" size="80">
                                            </div>
                                        </div>
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="insured-workpostal" data-i18n="postal-code">Kode Pos</label>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="insured-workpostal" value="" size="5">
                                            </div>
                                        </div>
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="insured-workcity" data-i18n="city">Kota</label>
                                            <div class="col-sm-9">
                                                <input type="text" class="form-control" id="insured-workcity" value="" size="20">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="accordion__item">
                                <div class="accordion__header collapsed accordion__header--success" data-toggle="collapse" data-target="#rounded-stylish_collapseThree">
                                    <span class="accordion__header--icon"></span>
                                    <span class="accordion__header--text">Data Asuransi</span>
                                    <span class="accordion__header--indicator"></span>
                                </div>
                                <div id="rounded-stylish_collapseThree" class="collapse accordion__body" data-parent="#accordion-eleven">
                                    <div class="accordion__body--text">
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="policy-no" data-i18n="policy-no">No. Polis</label>
                                            <div class="col-sm-9">
                                                <input id="policy-no"  class="form-control"/>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-product" data-i18n="product">Produk</label>
                                            <div class="col-sm-9">
                                                <select class="form-control productSelector" id="case-product" data-live-search="true"></select>
                                            </div>
                                        </div>
                                        
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-currency" data-i18n="case-currency">Mata Uang</label>
                                            <div class="col-sm-9">
                                                <select id="case-currency" class="form-control selectpicker">
                                                    <option value="1" label="Rupiah">Rupiah</option>
                                                    <option value="2" label="Dollar">Dollar</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-premium" data-i18n="case-premium">Premi Dasar</label>
                                            <div class="col-sm-9 input-group">
                                                <input type="number" id="case-premium" class="col-7 form-control"/>
                                                <div class="input-group-addon">
                                                    <label class="input-group-text" for="case-curr-rate">x</label>
                                                </div>
                                                <input type="number" id="case-curr-rate" class="col-4 form-control" value="1.00"/>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-pay-method" data-i18n="case-pay-method">Cara Bayar</label>
                                            <div class="col-sm-9">
                                                <select id="case-pay-method" class="form-control selectpicker">
                                                    <option value="1" data-i18n="tahunan">Tahunan</option>
                                                    <option value="2" data-i18n="semester">Enam Bulanan</option>
                                                    <option value="4" data-i18n="triwulan">Tiga Bulanan</option>
                                                    <option value="12" data-i18n="bulanan">Bulanan</option>
                                                    <option value="0" data-i18n="sekaligus">Sekaligus</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-base-insure" data-i18n="case-base-insure">U.P. Dasar</label>
                                            <div class="col-sm-9">
                                                <input type="number" class="form-control" id="case-base-insure" value="0" size="15">
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-start-date" data-i18n="case-start-date">Tanggal Mulai</label>
                                            <div class="col-sm-9">
                                                <input type="date" id="case-start-date" class="form-control"/>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-insure-period" data-i18n="case-insure-period">Masa Asuransi</label>
                                            <div class="col-sm-9">
                                                <div class="input-group">
                                                    <input type="number" id="case-insure-period" class="form-control" value="0" size="2">
                                                    <div class="input-group-append"><span class="input-group-text" data-i18n="year">tahun</span></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-pay-period" data-i18n="case-pay-period">Masa Bayar</label>
                                            <div class="col-sm-9">
                                                <div class="input-group">
                                                    <input type="number" class="form-control" id="case-pay-period" value="0" size="2">
                                                    <div class="input-group-append"><span class="input-group-text" data-i18n="year">tahun</span></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-5" data-i18n="investments">Pilihan Investasi</label>
                                            <button id="investment-launcher" class="btn btn-primary" type="button" data-toggle="modal" data-target="#case-investment-modal">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="row form-group">
                                            <div class="col-12">
                                                <table id="table-caseinvest" data-toggle="table" data-show-foooter="true">
                                                    <thead>
                                                        <tr>
                                                            <th class="col-xs-2" data-field="fund-name">Jenis Investasi</th>
                                                            <th class="col-xs-3" data-field="allocation" data-formatter="caseinvestPercentFormatter">Percent</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        @if(isset($extracted['investments']))
                                                            @foreach($extracted['investments'] as $inv)
                                                            <tr>
                                                                <td><input type="text" name="investments[][name]" class="form-control" value="{{ $inv['fund_name'] }}"></td>
                                                                <td><input type="text" name="investments[][percent]" class="form-control" value="{{ $inv['allocation_percent'] }}"></td>
                                                            </tr>
                                                            @endforeach
                                                        @endif
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-5" data-i18n="riders">Asuransi Tambahan</label>
                                            <button id="riders-launcher" class="btn btn-primary" type="button" data-toggle="modal" data-target="#case-rider-modal">
                                                <i class="fa fa-plus"></i>
                                            </button>
                                        </div>
                                        <div class="row form-group">
                                            <div class="col-12">
                                                <table id="table-caseriders" data-toggle="table" data-show-foooter="true">
                                                    <thead>
                                                        <tr>
                                                            <th class="col-xs-5" data-field="rider-product" data-formatter="productFormat">Asuransi Tambahan</th>
                                                            <th class="col-xs-2" data-field="rider-insure" data-formatter="caseridersIDRFormatter">U.P. Rider</th>
                                                            <th class="col-xs-2" data-field="rider-premium" data-formatter="caseridersIDRFormatter">Premi Rider</th>
                                                            <th class="col-xs-1" data-field="rider-insure-period">Masa Asuransi</th>
                                                            <th class="col-xs-1" data-field="rider-pay-period">Masa Bayar</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        @if(isset($extracted['rider']))
            @foreach($extracted['rider'] as $inv)
            <tr>
                <td><input type="text" name="investments[][name]" class="form-control" value="{{ $inv['fund_name'] }}"></td>
                <td><input type="text" name="investments[][percent]" class="form-control" value="{{ $inv['allocation_percent'] }}"></td>
            </tr>
            @endforeach
        @endif
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div class="row form-group">
                                            <label class="col-sm-3" for="case-description" data-i18n="description">Keterangan</label>
                                            <div class="col-sm-9">
                                                <textarea class="form-control" id="case-description" rows="4" cols="65"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>

@include('pages.policy.partials.modal-investment')
@include('pages.policy.partials.modal-rider')

@endsection
