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
import { DocumentsDto, Memorize_KeywordsesServiceProxy, Memorize_KeywordsDto, MemorizeKeywordsServiceProxy, MemorizeKeywordDto } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxFileManagerModule, DxPopupModule } from 'devextreme-angular';
import { BrowserModule } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { DxTextBoxModule, DxFileUploaderModule, DxButtonModule } from 'devextreme-angular';
import { from } from 'rxjs';
import * as $ from 'jquery';
import { DxTreeListModule } from 'devextreme-angular';

import { Employee, Service } from './app.service';
import { finalize } from 'rxjs/operators';
import { ModalDirective } from 'ngx-bootstrap';



@Component({
    selector: 'createEditMemorize_KeywordsesModal',
    templateUrl: './create-edit-memorize_Keywordses-modal.html',
    encapsulation: ViewEncapsulation.None,
    providers: [Service],
    animations: [appModuleAnimation()]

})

export class CreateEditMemorize_KeywordsesModal extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() id = new EventEmitter<number>();
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    memorizeKeyword : MemorizeKeywordDto = new MemorizeKeywordDto;
    active = false;
    saving = false;
    
 
    constructor(
        injector: Injector,
        private activatedRoute: ActivatedRoute,
        private _memorizeKeywordsesServiceProxy: MemorizeKeywordsServiceProxy,
    ) {
        super(injector);
    }

   
   

    ngOnInit() {
        
    };
 
   
    show(): void {
        this.active = true;
        this.modal.show();
    }

    save(): void {
        this.saving = true;

        this._memorizeKeywordsesServiceProxy.createOrEdit(this.memorizeKeyword)
        .pipe(finalize(() => { this.saving = false;}))
        .subscribe((result) => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.id.emit(result);
            this.modalSave.emit(null);
        });
}







close(): void {

    this.active = false;
    this.modal.hide();
}
  }
  