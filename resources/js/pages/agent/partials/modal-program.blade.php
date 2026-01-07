<div class="modal" id="agent-program-modal" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="defaultModalLabel">Tambah Program Agent</h4>
            </div>
            <div class="modal-body">
                <form id="agentProgram">
                    <div class="row form-group">
                        <label class="col-sm-3" for="program-start" data-i18n="program-start">Mulai Program</label>
                        <div class="col-sm-9">
                            <input type="date" id="program-start" class="form-control"/>
                        </div>
                        
                    </div>
                    <div class="row form-group">
                        <label class="col-sm-3" for="agent-position" data-i18n="position">Program</label>
                        <div class="col-sm-9">
                            <select id="agent-position" class="form-control selectpicker">
                                <option value="FC">Financial Consultant</option>
                                <option value="BP*">Business Partner Bintang 1</option>
                                <option value="BP**">Business Partner Bintang 2</option>
                                <option value="BP***">Business Partner Bintang 3</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="row form-group">
                        <label class="col-sm-3" for="agent-leader" data-i18n="agent-leader">Perekruit</label>
                        <div class="col-sm-9">
                            <select id="agent-leader" class="form-control agentSelector" data-live-search="true"></select>
                        </div>
                    </div>

                    <div class="row form-group">
                        <label class="col-sm-3" for="agent-program" data-i18n="program">Program</label>
                        <div class="col-sm-9">
                            <select id="agent-program" class="form-control programSelector"></select>
                        </div>
                    </div>
                    <div class="row form-group">
                        <label class="col-sm-3" for="agent-allowance" data-i18n="allowance">Allowance</label>
                        <div class="col-sm-9">
                            <input type="number" id="agent-allowance" class="form-control"/>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button id="modifyProgram" type="button" class="btn btn-link waves-effect" data-i18n="action">action</button>
                <button id="cancelProgram" type="button" class="btn btn-link waves-effect" data-i18n="cancel">cancel</button>
            </div>
        </div>
    </div>
</div>
