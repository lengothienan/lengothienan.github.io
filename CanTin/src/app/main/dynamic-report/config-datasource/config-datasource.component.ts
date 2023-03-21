import { Component, OnInit, EventEmitter, Output, ViewChild, Injector, Input, Inject, Optional } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ModalDirective } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppComponentBase } from '@shared/common/app-component-base';
import {API_BASE_URL,  DRDataSourceServiceProxy, HardDatasourcesServiceProxy, OrgLevelsServiceProxy, CreateOrEditOrgLevelDto, HardDatasourceGroupsServiceProxy, CreateOrEditHardDatasourceGroupDto, Comm_booksServiceProxy, Comm_Book_SyntaxesServiceProxy, CreateOrEditComm_bookDto, PermissionDto, MenusServiceProxy, MenuDto, DRDataSourceDetailDto } from '@shared/service-proxies/service-proxies';
import { DxFormComponent } from 'devextreme-angular';
// import { ViewerUtilityConfigurationService } from '../dynamic-report/viewer/viewer-utility/viewer-utility-configuration.service';
import DevExpress from 'devextreme';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
// import { HardDatasourceGroupsComponent } from '../qlvb/hardDatasourceGroups/hardDatasourceGroups.component';
import moment from 'moment';

import { isNullOrUndefined } from 'util';

@Component({
    selector: 'config-datasource',
    templateUrl: './config-datasource.component.html'
})

export class ConfigDatasourceComponent extends AppComponentBase {

    @ViewChild('detailForm', {static: true}) detailForm: DxFormComponent;
    
    Name: any = "";
    labelActionData:DRDataSourceDetailDto;
    labelActionId: number;
    sqlTypeOptions: any;
    addDataDetail: DRDataSourceDetailDto;
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
    detailDataSource:DRDataSourceDetailDto;

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
    }

    ngOnInit(){
        const self = this;
        var Id = this._activatedRoute.snapshot.params['id'];

        this._activatedRoute.params.subscribe((para) => {
            const Id = para['id'];    
            if (Id != 'null' && Id != "") {
                this.labelActionId = parseInt(Id);
                this.Name = "Cấu hình ";
                this.editCheck = true;
                // this.labelActionData = {};
                //get data
                // this.configReportService.getDetailDataSource(Id).subscribe((res : any)=>{
                //     if (res) {
                //         self.labelActionData = res;
                //     }
                // });
                this.config(Id);
            }
        })
    }
    
    config(id: any) {
        const self = this;
        this.configReportService.getDetailDataSource(id).subscribe((res: any) => {
            self.addDataDetail = res;
        })
    }
    save(): void {debugger
        const self = this;
        let result = this.detailForm.instance.validate();
        if (result.isValid){
            self.configReportService.updateDataSourceDetail(self.addDataDetail).subscribe(() => {
                abp.notify.success("Thành công."); 
            });
            // var data = new DRDataSourceDetailDto();
            // data.host = this.labelActionData.host;
            // data.dbName = this.labelActionData.dbName;
            // data.user = this.labelActionData.user;
            // data.password = this.labelActionData.password;
            // data.configId = this.labelActionId;
            
            // if (this.editCheck) {//update
            //     data.lastModifierUserId = this.currentUserId;
            //     data.lastModificationTime = this.currentDate;
            //     this.configReportService.updateDataSourceDetail(data).subscribe((res: any) => {
            //         var id = res;
            //         if (!isNullOrUndefined(id)) {
            //             abp.notify.success("Thành công.");
            //         } else {
            //             abp.notify.error("Thất bại");
            //         }
            //     });
            // } 
            
            this.back();
        }
        
    }
    
    
    back(): void{
        this.router.navigateByUrl('/app/main/dynamicreport/report/viewer-utility/DPR_DATASOURCE/DATASOURCE'); 
    }

    
}
