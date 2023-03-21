import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkDetailsServiceProxy, WorkDetailDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditWorkDetailModalComponent } from './create-or-edit-workDetail-modal.component';
import { ViewWorkDetailModalComponent } from './view-workDetail-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './workDetails.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class WorkDetailsComponent extends AppComponentBase {

    @ViewChild('createOrEditWorkDetailModal', { static: true }) createOrEditWorkDetailModal: CreateOrEditWorkDetailModalComponent;
    @ViewChild('viewWorkDetailModalComponent', { static: true }) viewWorkDetailModal: ViewWorkDetailModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    maxWorkAssignIdFilter : number;
		maxWorkAssignIdFilterEmpty : number;
		minWorkAssignIdFilter : number;
		minWorkAssignIdFilterEmpty : number;
    maxDonePersentageFilter : number;
		maxDonePersentageFilterEmpty : number;
		minDonePersentageFilter : number;
		minDonePersentageFilterEmpty : number;
    maxDateFilter : moment.Moment;
		minDateFilter : moment.Moment;
    nameIDFilter = '';
    descriptionFilter = '';
    repplyFilter = '';
    attachmentFilter = '';




    constructor(
        injector: Injector,
        private _workDetailsServiceProxy: WorkDetailsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getWorkDetails(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._workDetailsServiceProxy.getAll(
            this.filterText,
            this.maxWorkAssignIdFilter == null ? this.maxWorkAssignIdFilterEmpty: this.maxWorkAssignIdFilter,
            this.minWorkAssignIdFilter == null ? this.minWorkAssignIdFilterEmpty: this.minWorkAssignIdFilter,
            this.maxDonePersentageFilter == null ? this.maxDonePersentageFilterEmpty: this.maxDonePersentageFilter,
            this.minDonePersentageFilter == null ? this.minDonePersentageFilterEmpty: this.minDonePersentageFilter,
            this.maxDateFilter,
            this.minDateFilter,
            this.nameIDFilter,
            this.descriptionFilter,
            this.repplyFilter,
            this.attachmentFilter,
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

    createWorkDetail(): void {
        this.createOrEditWorkDetailModal.show();
    }

    // deleteWorkDetail(workDetail: WorkDetailDto): void {
    //     this.message.confirm(
    //         '',
    //         (isConfirmed) => {
    //             if (isConfirmed) {
    //                 this._workDetailsServiceProxy.delete(workDetail.id)
    //                     .subscribe(() => {
    //                         this.reloadPage();
    //                         this.notify.success(this.l('SuccessfullyDeleted'));
    //                     });
    //             }
    //         }
    //     );
    // }

    exportToExcel(): void {
        this._workDetailsServiceProxy.getWorkDetailsToExcel(
        this.filterText,
            this.maxWorkAssignIdFilter == null ? this.maxWorkAssignIdFilterEmpty: this.maxWorkAssignIdFilter,
            this.minWorkAssignIdFilter == null ? this.minWorkAssignIdFilterEmpty: this.minWorkAssignIdFilter,
            this.maxDonePersentageFilter == null ? this.maxDonePersentageFilterEmpty: this.maxDonePersentageFilter,
            this.minDonePersentageFilter == null ? this.minDonePersentageFilterEmpty: this.minDonePersentageFilter,
            this.maxDateFilter,
            this.minDateFilter,
            this.nameIDFilter,
            this.descriptionFilter,
            this.repplyFilter,
            this.attachmentFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
