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
import { DocumentsDto, VanbansServiceProxy, TextBooksServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';

@Component({
    selector: 'viewMemorize_KeywordsModal',
    templateUrl: './view-memorize_Keywords-modal.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]

})
export class ViewMemorize_KeywordsModal extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;


    viewvanban: any;
    public _id: number;
    a = AppConsts.remoteServiceBaseUrl;
    textbooks: any ;
    constructor(
        injector: Injector,
        private activatedRoute: ActivatedRoute,
        protected activeRoute: ActivatedRoute,
        private router: Router,
        private _textBooksServiceProxy: TextBooksServiceProxy,

        // private _notifyService: NotifyService,
        // private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
      this.viewvanban = {};
    }
    // reloadPage(): void {
    //     this.paginator.changePage(this.paginator.getPage());
    // }

    // addMoveDocumentReceive()
    // {
    //     this.router.navigate(['/app/main/qlvb/create-new-incomming-document']);
    // }
    // addRecevie()
    // {
    //     this.router.navigate(['/app/main/qlvb/receive/receive-modal']);
    // }
    // addMove() {
    //     this.router.navigate(['/app/main/qlvb/transfer-handle/transfer-handle-modal']);
    // }
    // addNew() {
    //     this.router.navigate(['/app/main/qlvb/transfer-handle/transfer-handle-modal']);
    // }
    show(documentId?: number): void {

        
    }
    ngOnInit(): void {
        this.activeRoute.params.subscribe(params => {
            this._id = params['id'];
        this._textBooksServiceProxy.getTextBookForView( this._id).subscribe((res) => {
            this.viewvanban = res.textBook;
              console.log( this.viewvanban)
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