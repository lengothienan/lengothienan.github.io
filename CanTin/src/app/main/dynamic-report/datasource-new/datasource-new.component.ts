import { Component, OnInit, EventEmitter, Output, ViewChild, Injector, Input, Inject, Optional } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ModalDirective } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppComponentBase } from '@shared/common/app-component-base';
import {  API_BASE_URL,DRDataSourceServiceProxy, OrgLevelsServiceProxy, CreateOrEditOrgLevelDto, HardDatasourceGroupsServiceProxy, CreateOrEditHardDatasourceGroupDto, Comm_booksServiceProxy, Comm_Book_SyntaxesServiceProxy, CreateOrEditComm_bookDto, PermissionDto, MenusServiceProxy, MenuDto, CreateOrEditMenuDto, DRDataSourceDto } from '@shared/service-proxies/service-proxies';
import { DxFormComponent } from 'devextreme-angular';
// import { ViewerUtilityConfigurationService } from '../dynamic-report/viewer/viewer-utility/viewer-utility-configuration.service';
import DevExpress from 'devextreme';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
// import { HardDatasourceGroupsComponent } from '../qlvb/hardDatasourceGroups/hardDatasourceGroups.component';
import moment from 'moment';

import { isNullOrUndefined } from 'util';

@Component({
    selector: 'datasource-new',
    templateUrl: './datasource-new.component.html'
})

export class DatasourceNewComponent extends AppComponentBase {

    @ViewChild('detailForm', {static: true}) detailForm: DxFormComponent;
    
    Name: any = "";
    labelActionData:any;
    labelActionId: number;
    sqlTypeOptions: any;
    
    editCheck = false;
    ReadOnly = false;
    saveBtnVisible = true;
    currentUserId = this.appSession.userId;
    currentDate = moment(new Date).endOf('day');
    actionTypeOption: any;
    valueOption:any = {
        editorType:"dxTextBox",
        readOnly: this.ReadOnly
    };
    comeBackLinkOption:any;

    private baseUrl: string;
    fromUngroupedData: DevExpress.data.DataSource;
    permissionOptions: PermissionDto[];

    constructor(
        injector: Injector,
        private _activatedRoute: ActivatedRoute,
        private router: Router,
        private configReportService: DRDataSourceServiceProxy,
        
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(injector);
        this.baseUrl = baseUrl ? baseUrl : "";
        this.loadSqlTypeOptions();//init cbb sql type
    }

    ngOnInit(){
        const self = this;
        // var stage = window.localStorage.getItem('PLANACTION')
        var Id = this._activatedRoute.snapshot.params['id'];

        this._activatedRoute.params.subscribe((para) => {
            const Id = para['id'];    
            if (Id != 'null' && Id != "") {
                this.labelActionId = parseInt(Id);
                this.Name = "Xem chi tiết ";
                this.ReadOnly = true;
                this.saveBtnVisible = false;   
                this.editCheck = true;
                //get data
                this.configReportService.getByID(Id).subscribe((res : any)=>{
                    debugger
                    self.labelActionData = res;
                });
            }else{
                this.Name = "Thêm mới ";
                this.editCheck = false;
                this.labelActionData = {}
                
            }
        })
    }
    

    save(): void {
        const self = this;
        let result = this.detailForm.instance.validate();
        if (result.isValid){
            var data = new DRDataSourceDto();
            data.name = this.labelActionData.name;
            data.code = this.labelActionData.code;
            data.sqlType = this.labelActionData.sqlType;
            
            if (this.editCheck) {//update
                data.lastModifierUserId = this.currentUserId;
                data.lastModificationTime = this.currentDate;
                this.configReportService.updateDataSource(this.labelActionId, data).subscribe((res: any) => {
                    var id = res;
                    if (!isNullOrUndefined(id)) {
                        abp.notify.success("Thành công.");
                    } else {
                        abp.notify.error("Thất bại");
                    }
                });
            } else {//addnew
                data.creatorUserId = this.currentUserId;
                data.creationTime = this.currentDate;
                this.configReportService.createDataSource(data).subscribe((res: any) => {
                    var id = res;
                    if (!isNullOrUndefined(id)) {
                        abp.notify.success("Thành công.");
                    } else {
                        abp.notify.error("Thất bại");
                    }
                });
            }
            this.back();
        }
        
    }
    //begin: load sql type
    sqlType = [{
        'value': 'SQL',

    }, {
        'value': 'MySql',

    }];
    loadSqlTypeOptions() {
        const self = this;
        this.sqlTypeOptions = {
            dataSource: self.sqlType,
            valueExpr: 'value',
            displayExpr: 'value',
            showClearButton: true
        }
    }
    //end: load sql type
    back(): void{
        this.router.navigateByUrl('/app/main/dynamicreport/report/viewer-utility/DPR_DATASOURCE/DATASOURCE'); 
    }

    
}
