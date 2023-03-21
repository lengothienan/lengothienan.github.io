import { Component, Injector, ViewEncapsulation, ViewChild, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { AppConsts } from '@shared/AppConsts';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxFileManagerModule, DxPopupModule } from 'devextreme-angular';
import { BrowserModule } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { DxTextBoxModule, DxFileUploaderModule, DxButtonModule } from 'devextreme-angular';
import { from } from 'rxjs';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ModalDirective } from 'ngx-bootstrap';



@Component({
    selector: 'chuyenvanbanden',
    templateUrl: './chuyenvanbanden.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]

})
export class ChuyenvanbandenComponent extends AppComponentBase {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

   

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    documentData: DocumentsDto;
    dataGrid: any;
    selectedRows: number[];
    typeReceiveOptions: string[] = [];
    typeReceiveOptions1: string[] = [];
    active = false;
    saving = false;


    constructor(
        injector: Injector,
        private router: Router,
        // private _notifyService: NotifyService,
        // private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
    }


    ngOnInit(){
        const self = this;
        this.typeReceiveOptions = [
            "Chuyển đề xuất"
        ];
        this.typeReceiveOptions1 = [
            "Trạng thái xử lý văn bản", "Kết thúc xử lý văn bản"
        ];

     
    } 

    show(dynamicFieldId?: number): void {

       
    }

    save(): void {
            // this.saving = true;

			
            // this._dynamicFieldsServiceProxy.createOrEdit(this.dynamicField)
            //  .pipe(finalize(() => { this.saving = false;}))
            //  .subscribe(() => {
            //     this.notify.info(this.l('SavedSuccessfully'));
            //     this.close();
            //     this.modalSave.emit(null);
            //  });
    }
    close(): void {

        this.active = false;
        this.modal.hide();
    }
}
