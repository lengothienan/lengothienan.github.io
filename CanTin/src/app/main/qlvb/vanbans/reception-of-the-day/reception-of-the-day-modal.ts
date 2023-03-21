import { Component, Injector, ViewEncapsulation, ViewChild, EventEmitter, Output } from '@angular/core';
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
import { DocumentsDto } from '@shared/service-proxies/service-proxies';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';
import { AppConsts } from '@shared/AppConsts';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxFileManagerModule, DxPopupModule } from 'devextreme-angular';
import { BrowserModule } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { DxTextBoxModule, DxFileUploaderModule, DxButtonModule } from 'devextreme-angular';
import { from } from 'rxjs';
import * as $ from 'jquery';



@Component({
    selector: 'receptionOfTheDayModal',
    templateUrl: './reception-of-the-day-modal.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]

})
export class ReceptionOfTheDayModalComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    documentData: DocumentsDto;
    dataGrid: any;
    selectedRows: number[];

    constructor(
        injector: Injector,
        private router : Router,
        // private _notifyService: NotifyService,
        // private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
    }

    addMoveVanbanInProcess()
    {
        this.router.navigate(['/app/main/qlvb/vanban-InProcess']); 
    }
    return()
    {
        this.router.navigate(['/app/main/qlvb/vanbans']);  
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

    find(){

    }

    selectionChangedHandler(e: any){

    }

    viewRow(e: any){

    }

    editRow(e: any){

    }

    deleteRow(e: any){
        
    }
}