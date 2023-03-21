import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comm_Book_SyntaxesServiceProxy, Comm_Book_SyntaxDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditComm_Book_SyntaxModalComponent } from './create-or-edit-comm_Book_Syntax-modal.component';
import { ViewComm_Book_SyntaxModalComponent } from './view-comm_Book_Syntax-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
// import * as moment from '@app/main/qlvb/comm_Book_Syntaxes/node_modules/moment';

@Component({
    templateUrl: './comm_Book_Syntaxes.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class Comm_Book_SyntaxesComponent extends AppComponentBase {

    @ViewChild('createOrEditComm_Book_SyntaxModal', { static: true }) createOrEditComm_Book_SyntaxModal: CreateOrEditComm_Book_SyntaxModalComponent;
    @ViewChild('viewComm_Book_SyntaxModalComponent', { static: true }) viewComm_Book_SyntaxModal: ViewComm_Book_SyntaxModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    syntaxFilter = '';
    maxVersionFilter : number;
		maxVersionFilterEmpty : number;
		minVersionFilter : number;
		minVersionFilterEmpty : number;
    maxOrgIdFilter : number;
		maxOrgIdFilterEmpty : number;
		minOrgIdFilter : number;
		minOrgIdFilterEmpty : number;
    isActiveFilter = -1;
    initialData = [];
    selectedRowsData = [];


    constructor(
        injector: Injector,
        private _comm_Book_SyntaxesServiceProxy: Comm_Book_SyntaxesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getComm_Book_Syntaxes(event?: LazyLoadEvent) {
        // if (this.primengTableHelper.shouldResetPaging(event)) {
        //     this.paginator.changePage(0);
        //     return;
        // }

        // this.primengTableHelper.showLoadingIndicator();

        // this._comm_Book_SyntaxesServiceProxy.getAll(
        //     this.filterText,
        //     this.syntaxFilter,
        //     this.maxVersionFilter == null ? this.maxVersionFilterEmpty: this.maxVersionFilter,
        //     this.minVersionFilter == null ? this.minVersionFilterEmpty: this.minVersionFilter,
        //     this.maxOrgIdFilter == null ? this.maxOrgIdFilterEmpty: this.maxOrgIdFilter,
        //     this.minOrgIdFilter == null ? this.minOrgIdFilterEmpty: this.minOrgIdFilter,
        //     this.isActiveFilter,
        //     this.primengTableHelper.getSorting(this.dataTable),
        //     this.primengTableHelper.getSkipCount(this.paginator, event),
        //     this.primengTableHelper.getMaxResultCount(this.paginator, event)
        // ).subscribe(result => {
        //     this.primengTableHelper.totalRecordsCount = result.totalCount;
        //     this.primengTableHelper.records = result.items;
        //     this.primengTableHelper.hideLoadingIndicator();
        // });
        this._comm_Book_SyntaxesServiceProxy.getAllCommBookSyntax().subscribe(res => {
            this.initialData = res;
            console.log(res);
        })
    }

    ngOnInit(){
        this.getComm_Book_Syntaxes();
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createComm_Book_Syntax(): void {
        console.log(this.selectedRowsData);
        this.createOrEditComm_Book_SyntaxModal.show();
    }

    deleteComm_Book_Syntax(comm_Book_Syntax: Comm_Book_SyntaxDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._comm_Book_SyntaxesServiceProxy.delete(comm_Book_Syntax.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
}
