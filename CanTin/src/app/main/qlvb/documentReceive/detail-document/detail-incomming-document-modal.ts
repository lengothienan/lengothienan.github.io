import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';

// import {  } from '@shared/service-proxies/service-proxies';
// import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
// import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { DocumentsDto } from '@shared/service-proxies/service-proxies';

@Component({
    selector: 'detailIncommingDocumentModal',
    templateUrl: './detail-incomming-document-modal.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]

})
export class DetailIncommingDocumentModalComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    documentData: DocumentsDto;
    selectedRows: any;

    constructor(
        injector: Injector,
        private router: Router,
        // private _notifyService: NotifyService,
        // private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
    }


    addRecevie()
    {
        this.router.navigate(['/app/main/qlvb/receive/receive-modal']);
    }
    addMove() {
        this.router.navigate(['/app/main/qlvb/transfer-handle/transfer-handle-modal']);
    }
    addNew() {
        this.router.navigate(['/app/main/qlvb/transfer-handle/transfer-handle-modal']);
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

    selectionChangedHandler(){
        
    }

    viewRow(e: any){

    }

    editRow(e: any){

    }

    deleteRow(e: any){

    }
}