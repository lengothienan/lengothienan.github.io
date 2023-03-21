import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkAssignsServiceProxy, WorkAssignDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditWorkAssignModalComponent } from './create-or-edit-workAssign-modal.component';
import { ViewWorkAssignModalComponent } from './view-workAssign-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './workAssigns.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class WorkAssignsComponent extends AppComponentBase {

    @ViewChild('createOrEditWorkAssignModal', { static: true }) createOrEditWorkAssignModal: CreateOrEditWorkAssignModalComponent;
    @ViewChild('viewWorkAssignModalComponent', { static: true }) viewWorkAssignModal: ViewWorkAssignModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    maxStartDateFilter : moment.Moment;
		minStartDateFilter : moment.Moment;
    maxEndDateFilter : moment.Moment;
		minEndDateFilter : moment.Moment;
    assigneeFilter = '';
    maxProgressFilter : number;
		maxProgressFilterEmpty : number;
		minProgressFilter : number;
		minProgressFilterEmpty : number;
    statusFilter = '';
    descriptionFilter = '';
    actionFilter = '';




    constructor(
        injector: Injector,
        private _workAssignsServiceProxy: WorkAssignsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getWorkAssigns(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._workAssignsServiceProxy.getAll(
            this.filterText,
            this.nameFilter,
            this.maxStartDateFilter,
            this.minStartDateFilter,
            this.maxEndDateFilter,
            this.minEndDateFilter,
            this.assigneeFilter,
            this.maxProgressFilter == null ? this.maxProgressFilterEmpty: this.maxProgressFilter,
            this.minProgressFilter == null ? this.minProgressFilterEmpty: this.minProgressFilter,
            this.statusFilter,
            this.descriptionFilter,
            this.actionFilter,
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

    createWorkAssign(): void {
        this.createOrEditWorkAssignModal.show();
    }

    // deleteWorkAssign(workAssign: WorkAssignDto): void {
    //     this.message.confirm(
    //         '',
    //         (isConfirmed) => {
    //             if (isConfirmed) {
    //                 this._workAssignsServiceProxy.delete(workAssign.id)
    //                     .subscribe(() => {
    //                         this.reloadPage();
    //                         this.notify.success(this.l('SuccessfullyDeleted'));
    //                     });
    //             }
    //         }
    //     );
    // }

    exportToExcel(): void {
        this._workAssignsServiceProxy.getWorkAssignsToExcel(
        this.filterText,
            this.nameFilter,
            this.maxStartDateFilter,
            this.minStartDateFilter,
            this.maxEndDateFilter,
            this.minEndDateFilter,
            this.assigneeFilter,
            this.maxProgressFilter == null ? this.maxProgressFilterEmpty: this.maxProgressFilter,
            this.minProgressFilter == null ? this.minProgressFilterEmpty: this.minProgressFilter,
            this.statusFilter,
            this.descriptionFilter,
            this.actionFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
