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
import { TextBookDto, TextBooksServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';

@Component({
    selector: 'viewTextBookModal',
    templateUrl: './view-textBook-modal.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]

})
export class ViewTextBookModalComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    textBook :TextBookDto = new TextBookDto; 

    viewTextBook: any;
    _id:number ;
    a = AppConsts.remoteServiceBaseUrl;
    textbooks: any ;
    constructor(
        injector: Injector,
        private activatedRoute: ActivatedRoute,
        protected activeRoute: ActivatedRoute,
        private router: Router,
        private _textBooksServiceProxy: TextBooksServiceProxy,

    
        private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
      this.viewTextBook = {};
    }
    
    show(documentId?: number): void {

        
    }
    ngOnInit(): void {
        this.activeRoute.params.subscribe(params => {
            this._id = params['id'];
        this._textBooksServiceProxy.getTextBookForView( this._id).subscribe((res) => {
            this.viewTextBook = res.textBook;
              console.log( this.viewTextBook)

              console.log(this._id)
    })
     }); 
    };


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