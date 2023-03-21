import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comm_booksServiceProxy, Comm_bookDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditComm_bookModalComponent } from './create-or-edit-comm_book-modal.component';
import { ViewComm_bookModalComponent } from './view-comm_book-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';

@Component({
    templateUrl: './comm_books.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class Comm_booksComponent extends AppComponentBase {

    @ViewChild('createOrEditComm_bookModal', { static: true }) createOrEditComm_bookModal: CreateOrEditComm_bookModalComponent;
    @ViewChild('viewComm_bookModalComponent', { static: true }) viewcomm_bookModal: ViewComm_bookModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    maxBookNumFilter : number;
		maxBookNumFilterEmpty : number;
		minBookNumFilter : number;
		minBookNumFilterEmpty : number;
    typeFilter = '';
    maxFromDateFilter : moment.Moment;
		minFromDateFilter : moment.Moment;
    maxToDateFilter : moment.Moment;
		minToDateFilter : moment.Moment;
    fromValueFilter = '';
    toValueFilter = '';
    currentValueFilter = '';
    contentFilter = '';
    isPrivateFilter = -1;
    codeFilter = '';
    maxVersionFilter : number;
		maxVersionFilterEmpty : number;
		minVersionFilter : number;
		minVersionFilterEmpty : number;
    maxSyntaxIdFilter : number;
		maxSyntaxIdFilterEmpty : number;
		minSyntaxIdFilter : number;
		minSyntaxIdFilterEmpty : number;
    maxCopyNumFilter : number;
		maxCopyNumFilterEmpty : number;
		minCopyNumFilter : number;
		minCopyNumFilterEmpty : number;
    maxOrgIdFilter : number;
		maxOrgIdFilterEmpty : number;
		minOrgIdFilter : number;
		minOrgIdFilterEmpty : number;
    isActiveFilter = -1;
    initialData = [];



    constructor(
        injector: Injector,
        private _comm_booksServiceProxy: Comm_booksServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
        console.log(this.appSession.organizationUnitId)
    }

    getComm_books(event?: LazyLoadEvent) {
        this._comm_booksServiceProxy.getAllCommBook().subscribe(result => {
            this.initialData = result;
            //console.log(result);
        });
    }

    ngOnInit(){
        this.getComm_books();
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createComm_book(): void {
        this.createOrEditComm_bookModal.show();
    }

    deleteComm_book(comm_book: Comm_bookDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._comm_booksServiceProxy.delete(comm_book.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
}
