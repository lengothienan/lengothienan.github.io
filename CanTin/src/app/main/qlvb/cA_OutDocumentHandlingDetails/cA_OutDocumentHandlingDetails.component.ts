import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CA_OutDocumentHandlingDetailsServiceProxy, CA_OutDocumentHandlingDetailDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditCA_OutDocumentHandlingDetailModalComponent } from './create-or-edit-cA_OutDocumentHandlingDetail-modal.component';
import { ViewCA_OutDocumentHandlingDetailModalComponent } from './view-cA_OutDocumentHandlingDetail-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './cA_OutDocumentHandlingDetails.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class CA_OutDocumentHandlingDetailsComponent extends AppComponentBase {

    @ViewChild('createOrEditCA_OutDocumentHandlingDetailModal', { static: true }) createOrEditCA_OutDocumentHandlingDetailModal: CreateOrEditCA_OutDocumentHandlingDetailModalComponent;
    @ViewChild('viewCA_OutDocumentHandlingDetailModalComponent', { static: true }) viewCA_OutDocumentHandlingDetailModal: ViewCA_OutDocumentHandlingDetailModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    maxTypeFilter : number;
		maxTypeFilterEmpty : number;
		minTypeFilter : number;
		minTypeFilterEmpty : number;
    personalCommentFilter = '';
    maxDateHandleFilter : moment.Moment;
		minDateHandleFilter : moment.Moment;
    noteFilter = '';
    isCurrFilter = -1;
    maxProcessingDateFilter : moment.Moment;
		minProcessingDateFilter : moment.Moment;
    processingRecommendedFilter = '';
    maxTypeHandlingFilter : number;
		maxTypeHandlingFilterEmpty : number;
		minTypeHandlingFilter : number;
		minTypeHandlingFilterEmpty : number;
    maxDocumentHandlingIdFilter : number;
		maxDocumentHandlingIdFilterEmpty : number;
		minDocumentHandlingIdFilter : number;
		minDocumentHandlingIdFilterEmpty : number;
    maxUserIdFilter : number;
		maxUserIdFilterEmpty : number;
		minUserIdFilter : number;
		minUserIdFilterEmpty : number;
    maxUnitIdFilter : number;
		maxUnitIdFilterEmpty : number;
		minUnitIdFilter : number;
		minUnitIdFilterEmpty : number;
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
        private _cA_OutDocumentHandlingDetailsServiceProxy: CA_OutDocumentHandlingDetailsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getCA_OutDocumentHandlingDetails(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._cA_OutDocumentHandlingDetailsServiceProxy.getAll(
            this.filterText,
            this.maxTypeFilter == null ? this.maxTypeFilterEmpty: this.maxTypeFilter,
            this.minTypeFilter == null ? this.minTypeFilterEmpty: this.minTypeFilter,
            this.personalCommentFilter,
            this.maxDateHandleFilter,
            this.minDateHandleFilter,
            this.noteFilter,
            this.isCurrFilter,
            this.maxProcessingDateFilter,
            this.minProcessingDateFilter,
            this.processingRecommendedFilter,
            this.maxTypeHandlingFilter == null ? this.maxTypeHandlingFilterEmpty: this.maxTypeHandlingFilter,
            this.minTypeHandlingFilter == null ? this.minTypeHandlingFilterEmpty: this.minTypeHandlingFilter,
            this.maxDocumentHandlingIdFilter == null ? this.maxDocumentHandlingIdFilterEmpty: this.maxDocumentHandlingIdFilter,
            this.minDocumentHandlingIdFilter == null ? this.minDocumentHandlingIdFilterEmpty: this.minDocumentHandlingIdFilter,
            this.maxUserIdFilter == null ? this.maxUserIdFilterEmpty: this.maxUserIdFilter,
            this.minUserIdFilter == null ? this.minUserIdFilterEmpty: this.minUserIdFilter,
            this.maxUnitIdFilter == null ? this.maxUnitIdFilterEmpty: this.maxUnitIdFilter,
            this.minUnitIdFilter == null ? this.minUnitIdFilterEmpty: this.minUnitIdFilter,
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

    createCA_OutDocumentHandlingDetail(): void {
        this.createOrEditCA_OutDocumentHandlingDetailModal.show();
    }

    deleteCA_OutDocumentHandlingDetail(cA_OutDocumentHandlingDetail: CA_OutDocumentHandlingDetailDto): void {
        this.message.confirm(
            '',this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._cA_OutDocumentHandlingDetailsServiceProxy.delete(cA_OutDocumentHandlingDetail.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._cA_OutDocumentHandlingDetailsServiceProxy.getCA_OutDocumentHandlingDetailsToExcel(
        this.filterText,
            this.maxTypeFilter == null ? this.maxTypeFilterEmpty: this.maxTypeFilter,
            this.minTypeFilter == null ? this.minTypeFilterEmpty: this.minTypeFilter,
            this.personalCommentFilter,
            this.maxDateHandleFilter,
            this.minDateHandleFilter,
            this.noteFilter,
            this.isCurrFilter,
            this.maxProcessingDateFilter,
            this.minProcessingDateFilter,
            this.processingRecommendedFilter,
            this.maxTypeHandlingFilter == null ? this.maxTypeHandlingFilterEmpty: this.maxTypeHandlingFilter,
            this.minTypeHandlingFilter == null ? this.minTypeHandlingFilterEmpty: this.minTypeHandlingFilter,
            this.maxDocumentHandlingIdFilter == null ? this.maxDocumentHandlingIdFilterEmpty: this.maxDocumentHandlingIdFilter,
            this.minDocumentHandlingIdFilter == null ? this.minDocumentHandlingIdFilterEmpty: this.minDocumentHandlingIdFilter,
            this.maxUserIdFilter == null ? this.maxUserIdFilterEmpty: this.maxUserIdFilter,
            this.minUserIdFilter == null ? this.minUserIdFilterEmpty: this.minUserIdFilter,
            this.maxUnitIdFilter == null ? this.maxUnitIdFilterEmpty: this.maxUnitIdFilter,
            this.minUnitIdFilter == null ? this.minUnitIdFilterEmpty: this.minUnitIdFilter,
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
