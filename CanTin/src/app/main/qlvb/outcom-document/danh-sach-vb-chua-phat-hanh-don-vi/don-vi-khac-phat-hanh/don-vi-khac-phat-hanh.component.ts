import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CachingServiceProxy, WebLogServiceProxy, AuditLogServiceProxy, HistoryUploadDto, HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CreateOrEditIdoc_starDto, DynamicActionsServiceProxy, DocumentHandlingDetailDto, DocumentHandlingsServiceProxy, DocumentsDto, DocumentHandlingDetailsServiceProxy, UserServiceProxy, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy, DirectorOpinionDto, ListDVXL, ApproveDocumentDto, DocumentTypesServiceProxy, ODocsServiceProxy, ODocStoreDto, Comm_booksServiceProxy, Comm_bookDto } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DxDataGridComponent, DxSelectBoxComponent, DxFormComponent } from 'devextreme-angular';
import { SqlConfigHelperService } from '@shared/utils/sql-config-helper.service';
import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { AppConsts } from '@shared/AppConsts';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import moment from 'moment';
import { formatDate } from '@angular/common';
import { templateJitUrl } from '@angular/compiler';
import $ from 'jquery';
declare const exportHTML: any;

@Component({
    templateUrl: './don-vi-khac-phat-hanh.component.html',
    styleUrls: ['./don-vi-khac-phat-hanh.component.less'],
    animations: [appModuleAnimation()]
})
export class DanhSachVBChuaPhatHanhDonviGuiDonViKhacComponent extends AppComponentBase implements OnInit {

    initialData:any=[];
    documentSearchData:any = { book:null   }
    bookEditor:any;
    constructor(
        injector: Injector,
        private ultility: UtilityService,
        private router: Router,
        private _oDocsServiceProxy: ODocsServiceProxy,
        private _commBookServiceProxy:Comm_booksServiceProxy) {
        super(injector);
    }

    ngOnInit() {
        this.innitBookOption();
        this.search();
    }
    innitBookOption() {
        const self = this;
        this._commBookServiceProxy.getAllCommBookInDepartment("2", this.appSession.selfOrganizationUnitId).subscribe(result => {
            
            //fruits.unshift("Lemon", "Pineapple");
            var a = new Comm_bookDto();
            a.id=null;
            a.name = "Tất cả"
            result.unshift(a);
            var defaulValue;
            for (let i = 0, len = result.length; i < len; i++) {
                if (result[i].isDefault) {
                    defaulValue = result[i].id;
                    break;
                }
            }
            self.bookEditor = {
                dataSource: result,
                value: defaulValue,
                valueExpr: "id",
                displayExpr: "name",
                onValueChanged: function(e){
                    self.search()
                }
            }
            
        });
    }

    search(){
        this._oDocsServiceProxy.getAllNotPublishDocumentSendToOtherOrg(this.appSession.organizationUnitId,this.documentSearchData["book"] ==null?-1:this.documentSearchData["book"]).subscribe(res => {
            this.initialData = res.data;
        });
    }


    view(e: any){
        console.log(e)
        this.router.navigate(['/app/main/qlvb/xem-vb-da-cho-so/' + e]);
    }

    edit(e: any){
        this.router.navigate(['/app/main/qlvb/them-moi-va-cho-so/' + e])
    }

    numberCellValue(rowData){
        return rowData.Number;
    }
    onExporting(e){
        e.component.beginUpdate();
        e.component.columnOption('number_publishdate', 'visible', true);
    }
    onExported(e){  

        e.component.columnOption('number_publishdate', 'visible', false);
        e.component.endUpdate();  
    } 
   
}
