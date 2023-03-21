import { Component, Injector, ViewEncapsulation, ViewChild, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import {  } from '@shared/service-proxies/service-proxies';
// import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
// import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DocumentsDto, KeywordDetailsServiceProxy, MenusServiceProxy, DynamicActionsServiceProxy, RoleServiceProxy, DynamicActionDto } from '@shared/service-proxies/service-proxies';
// import RemoteFileProvider from 'devextreme/ui/file_manager/file_provider/remote';
import { AppConsts } from '@shared/AppConsts';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxFileManagerModule, DxPopupModule } from 'devextreme-angular';
import { BrowserModule } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { DxTextBoxModule, DxFileUploaderModule, DxButtonModule } from 'devextreme-angular';
import { from } from 'rxjs';
import * as $ from 'jquery';
import { parse } from 'path';



@Component({
    selector: 'buttonUI',
    templateUrl: './button-UI.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]

})
export class ButtonUIComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @Output() actionID: EventEmitter<string> = new EventEmitter<string>();

    StateService: string;
    documentData: DocumentsDto;
    dataGrid: any;
    labelId: any;
    selectedRows: number[];
    hasCreate = false;
    hasFinish = false;
    hasAssignWork = "";
    hasAddNew = false;
    hasSave = false;
    parameters: string;
    hasSaveAndTransfer = false;
    hasTransfer = "";
    data: DynamicActionDto;
    hasReport = false;
    hasDelete = false;
    hasSaveAndCreate = false;
    add_Transfer_Vice_Team = false;
    transfer_Vice_Team = false;
    transfer_Organize = false;
    add_Transfer_Team = false;
    add_Transfer_Deputy = false;
    submit_to_the_director = false;
    //
    submit_to_the_manager = false;

    transfer_Team = false;
    transfer_Deputy = false;
    hasReturn = false;
    add_Transfer_Department = false;
    add_Transfer_Vice_President = false;
    transfer_Department = false;
    transfer_Soldier_officer = false;
    transfer_Vice_President = false;
    additional_Transfer_Soldier_officer = false;
    draft_the_text_away = false;
    add_Transfer_Organize = false;
    approve_Multiple = false;
    report = false;
    saveVB = false;

   

    constructor(
        injector: Injector,
        private router: Router,
        // private _notifyService: NotifyService,
        // private _tokenAuth: TokenAuthServiceProxy,
        // private service: MenusServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _roleServiceProxy: RoleServiceProxy,
        private _dynamicAction: DynamicActionsServiceProxy
    ) {
        super(injector);
        this._activatedRoute.params.subscribe(params => {
            this.labelId = parseInt(params['id']);
                   
        });
       
        this._dynamicAction.getLabelData(this.labelId).subscribe(res => {
            this.labelId = res.labelId;
            this.data = res;
            this.hasCreate = res.hasCreate;
            this.hasSave = res.hasSave;
            this.hasTransfer = res.hasTransfer;
            this.hasSaveAndTransfer = res.hasSaveAndTransfer;
            this.hasReport = res.hasReport;
            this.hasFinish = res.hasFinish;
            this.hasDelete = res.hasDelete;
            this.hasSaveAndCreate = res.hasSaveAndCreate;
            this.hasAssignWork = res.hasAssignWork;
            this.submit_to_the_manager = res.submit_to_the_manager;
            this.hasReturn = res.hasReturn;
            this.transfer_Team = res.transfer_Team;
            this.transfer_Deputy = res.transfer_Deputy;
            this.add_Transfer_Department = res.add_Transfer_Department;
            this.add_Transfer_Vice_President = res.add_Transfer_Vice_President;
            this.transfer_Department = res.transfer_Department;
            this.transfer_Soldier_officer = res.transfer_Soldier_officer;
            this.transfer_Vice_President = res.transfer_Vice_President;
            this.additional_Transfer_Soldier_officer = res.additional_Transfer_Soldier_officer;
            this.draft_the_text_away = res.draft_the_text_away;
            this.submit_to_the_director = res.submit_to_the_director;
             this.add_Transfer_Deputy = res.add_Transfer_Deputy;
            this.saveVB = res.saveVB;
            this.add_Transfer_Team = res.add_Transfer_Team ;
            this.add_Transfer_Vice_Team = res.add_Transfer_Vice_Team;
            this.add_Transfer_Organize= res.add_Transfer_Organize;
            this.transfer_Organize = res.transfer_Organize;
            this.transfer_Vice_Team = res.transfer_Vice_Team;
            this.approve_Multiple = res.approve_Multiple;
            this.report = res.report;
        });
    }



    ngOnInit() {


        // this.labelId = this.stateService.data;
        // this._dynamicAction.getAllDynamicActionByLabelId( this.labelId ).subscribe(res => {
        //     this.data = res;
        //     this.labelId = res.labelId;
        //     console.log(this.data);
        // });
    }


    click(e: any) {
        console.log(e.element[0].id)
        this.actionID.emit(e.element[0].id)
    }
    click2(list: [])
    {
        // for(){
        //     this.service.createOrEdit(this.keywordDetail)
        //     .pipe(finalize(() => { this.saving = false;}))
        //     .subscribe(() => {
        //        this.notify.info(this.l('SavedSuccessfully'));
        //        this.close();
        //        this.modalSave.emit(null);
        //     });
        // }
        
        this.router.navigate(['/app/main/qlvb/vanban-InProcess']); 
    }
    click3()
    {
        this.router.navigate(['/app/main/qlvb/vanban-InProcess']); 
    }
    click4()
    {
        this.router.navigate(['/app/main/qlvb/vanban-InProcess']); 
    }


 
    show(documentId?: number): void {

        // if (!sqlConfigDetailId) {
        //     this.sqlConfigDetail = new CreateOrEditSqlConfigDetailDto();
        //     this.sqlConfigDetail.id = sqlConfigDetailId;

        //     this.active = true;
        //     this.modal.show();
        // } else {
        //     this._sqlConfigDetailsServiceProxy.getSqlConfigDetailForEdit(sqlConfigDetailId).subscribe(result => {
        //         this.sqlConfigDetail = result.sqlConfigDetail;


        //         this.active = true;
        //         this.modal.show();
        //     });
        // }
    }


    HasSaveAndTransfer(e: any) {
        console.log(e);
    }

    save(): void {
        // this.saving = true;


        // this._sqlConfigDetailsServiceProxy.createOrEdit(this.sqlConfigDetail)
        //  .pipe(finalize(() => { this.saving = false;}))
        //  .subscribe(() => {
        //     this.notify.info(this.l('SavedSuccessfully'));
        //     this.close();
        //     this.modalSave.emit(null);
        //  });


    }
}