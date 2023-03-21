import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CA_OutDocumentHandlingsServiceProxy, CA_OutDocumentHandlingDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditCA_OutDocumentHandlingModalComponent } from './create-or-edit-cA_OutDocumentHandling-modal.component';
import { ViewCA_OutDocumentHandlingModalComponent } from './view-cA_OutDocumentHandling-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './cA_OutDocumentHandlings.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class CA_OutDocumentHandlingsComponent extends AppComponentBase {

    @ViewChild('createOrEditCA_OutDocumentHandlingModal', { static: true }) createOrEditCA_OutDocumentHandlingModal: CreateOrEditCA_OutDocumentHandlingModalComponent;
    @ViewChild('viewCA_OutDocumentHandlingModalComponent', { static: true }) viewCA_OutDocumentHandlingModal: ViewCA_OutDocumentHandlingModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    maxHandlerFilter : number;
		maxHandlerFilterEmpty : number;
		minHandlerFilter : number;
		minHandlerFilterEmpty : number;
    isActiveFilter = -1;
    maxOrderFilter : number;
		maxOrderFilterEmpty : number;
		minOrderFilter : number;
		minOrderFilterEmpty : number;
    maxDateHandleFilter : moment.Moment;
		minDateHandleFilter : moment.Moment;
    isCurrFilter = -1;
    maxProcessingDateFilter : moment.Moment;
		minProcessingDateFilter : moment.Moment;
    processingRecommendedFilter = '';
    contentFilter = '';
    maxHandlingTypeFilter : number;
		maxHandlingTypeFilterEmpty : number;
		minHandlingTypeFilter : number;
		minHandlingTypeFilterEmpty : number;
    maxDocumentIdFilter : number;
		maxDocumentIdFilterEmpty : number;
		minDocumentIdFilter : number;
		minDocumentIdFilterEmpty : number;
    maxParentHandlingIdFilter : number;
		maxParentHandlingIdFilterEmpty : number;
		minParentHandlingIdFilter : number;
		minParentHandlingIdFilterEmpty : number;
    maxImpersonateUserIdFilter : number;
		maxImpersonateUserIdFilterEmpty : number;
		minImpersonateUserIdFilter : number;
		minImpersonateUserIdFilterEmpty : number;




    constructor(
        injector: Injector,
        private _cA_OutDocumentHandlingsServiceProxy: CA_OutDocumentHandlingsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getCA_OutDocumentHandlings(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._cA_OutDocumentHandlingsServiceProxy.getAll(
            this.filterText,
            this.maxHandlerFilter == null ? this.maxHandlerFilterEmpty: this.maxHandlerFilter,
            this.minHandlerFilter == null ? this.minHandlerFilterEmpty: this.minHandlerFilter,
            this.isActiveFilter,
            this.maxOrderFilter == null ? this.maxOrderFilterEmpty: this.maxOrderFilter,
            this.minOrderFilter == null ? this.minOrderFilterEmpty: this.minOrderFilter,
            this.maxDateHandleFilter,
            this.minDateHandleFilter,
            this.isCurrFilter,
            this.maxProcessingDateFilter,
            this.minProcessingDateFilter,
            this.processingRecommendedFilter,
            this.contentFilter,
            this.maxHandlingTypeFilter == null ? this.maxHandlingTypeFilterEmpty: this.maxHandlingTypeFilter,
            this.minHandlingTypeFilter == null ? this.minHandlingTypeFilterEmpty: this.minHandlingTypeFilter,
            this.maxDocumentIdFilter == null ? this.maxDocumentIdFilterEmpty: this.maxDocumentIdFilter,
            this.minDocumentIdFilter == null ? this.minDocumentIdFilterEmpty: this.minDocumentIdFilter,
            this.maxParentHandlingIdFilter == null ? this.maxParentHandlingIdFilterEmpty: this.maxParentHandlingIdFilter,
            this.minParentHandlingIdFilter == null ? this.minParentHandlingIdFilterEmpty: this.minParentHandlingIdFilter,
            this.maxImpersonateUserIdFilter == null ? this.maxImpersonateUserIdFilterEmpty: this.maxImpersonateUserIdFilter,
            this.minImpersonateUserIdFilter == null ? this.minImpersonateUserIdFilterEmpty: this.minImpersonateUserIdFilter,
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

    createCA_OutDocumentHandling(): void {
        this.createOrEditCA_OutDocumentHandlingModal.show();
    }

    deleteCA_OutDocumentHandling(cA_OutDocumentHandling: CA_OutDocumentHandlingDto): void {
        this.message.confirm(
            '',this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._cA_OutDocumentHandlingsServiceProxy.delete(cA_OutDocumentHandling.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._cA_OutDocumentHandlingsServiceProxy.getCA_OutDocumentHandlingsToExcel(
        this.filterText,
            this.maxHandlerFilter == null ? this.maxHandlerFilterEmpty: this.maxHandlerFilter,
            this.minHandlerFilter == null ? this.minHandlerFilterEmpty: this.minHandlerFilter,
            this.isActiveFilter,
            this.maxOrderFilter == null ? this.maxOrderFilterEmpty: this.maxOrderFilter,
            this.minOrderFilter == null ? this.minOrderFilterEmpty: this.minOrderFilter,
            this.maxDateHandleFilter,
            this.minDateHandleFilter,
            this.isCurrFilter,
            this.maxProcessingDateFilter,
            this.minProcessingDateFilter,
            this.processingRecommendedFilter,
            this.contentFilter,
            this.maxHandlingTypeFilter == null ? this.maxHandlingTypeFilterEmpty: this.maxHandlingTypeFilter,
            this.minHandlingTypeFilter == null ? this.minHandlingTypeFilterEmpty: this.minHandlingTypeFilter,
            this.maxDocumentIdFilter == null ? this.maxDocumentIdFilterEmpty: this.maxDocumentIdFilter,
            this.minDocumentIdFilter == null ? this.minDocumentIdFilterEmpty: this.minDocumentIdFilter,
            this.maxParentHandlingIdFilter == null ? this.maxParentHandlingIdFilterEmpty: this.maxParentHandlingIdFilter,
            this.minParentHandlingIdFilter == null ? this.minParentHandlingIdFilterEmpty: this.minParentHandlingIdFilter,
            this.maxImpersonateUserIdFilter == null ? this.maxImpersonateUserIdFilterEmpty: this.maxImpersonateUserIdFilter,
            this.minImpersonateUserIdFilter == null ? this.minImpersonateUserIdFilterEmpty: this.minImpersonateUserIdFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
