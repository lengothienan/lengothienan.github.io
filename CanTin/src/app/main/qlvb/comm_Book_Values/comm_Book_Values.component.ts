import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comm_Book_ValuesServiceProxy, Comm_Book_ValueDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditComm_Book_ValueModalComponent } from './create-or-edit-comm_Book_Value-modal.component';
import { ViewComm_Book_ValueModalComponent } from './view-comm_Book_Value-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './comm_Book_Values.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class Comm_Book_ValuesComponent extends AppComponentBase {

    @ViewChild('createOrEditComm_Book_ValueModal', { static: true }) createOrEditComm_Book_ValueModal: CreateOrEditComm_Book_ValueModalComponent;
    @ViewChild('viewComm_Book_ValueModalComponent', { static: true }) viewComm_Book_ValueModal: ViewComm_Book_ValueModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    maxCurrValueFilter : number;
		maxCurrValueFilterEmpty : number;
		minCurrValueFilter : number;
		minCurrValueFilterEmpty : number;
    maxFromValueFilter : number;
		maxFromValueFilterEmpty : number;
		minFromValueFilter : number;
		minFromValueFilterEmpty : number;
    toValueFilter = '';
    maxVersionFilter : number;
		maxVersionFilterEmpty : number;
		minVersionFilter : number;
		minVersionFilterEmpty : number;
    maxOrgIdFilter : number;
		maxOrgIdFilterEmpty : number;
		minOrgIdFilter : number;
		minOrgIdFilterEmpty : number;
    isActiveFilter = -1;




    constructor(
        injector: Injector,
        private _comm_Book_ValuesServiceProxy: Comm_Book_ValuesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getComm_Book_Values(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._comm_Book_ValuesServiceProxy.getAll(
            this.filterText,
            this.nameFilter,
            this.maxCurrValueFilter == null ? this.maxCurrValueFilterEmpty: this.maxCurrValueFilter,
            this.minCurrValueFilter == null ? this.minCurrValueFilterEmpty: this.minCurrValueFilter,
            this.maxFromValueFilter == null ? this.maxFromValueFilterEmpty: this.maxFromValueFilter,
            this.minFromValueFilter == null ? this.minFromValueFilterEmpty: this.minFromValueFilter,
            this.toValueFilter,
            this.maxVersionFilter == null ? this.maxVersionFilterEmpty: this.maxVersionFilter,
            this.minVersionFilter == null ? this.minVersionFilterEmpty: this.minVersionFilter,
            this.maxOrgIdFilter == null ? this.maxOrgIdFilterEmpty: this.maxOrgIdFilter,
            this.minOrgIdFilter == null ? this.minOrgIdFilterEmpty: this.minOrgIdFilter,
            this.isActiveFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createComm_Book_Value(): void {
        this.createOrEditComm_Book_ValueModal.show();
    }

    deleteComm_Book_Value(comm_Book_Value: Comm_Book_ValueDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._comm_Book_ValuesServiceProxy.delete(comm_Book_Value.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
}
