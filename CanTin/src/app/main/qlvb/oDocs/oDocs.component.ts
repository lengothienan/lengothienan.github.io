import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ODocsServiceProxy, ODocDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditODocModalComponent } from './create-or-edit-oDoc-modal.component';
import { ViewODocModalComponent } from './view-oDoc-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './oDocs.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ODocsComponent extends AppComponentBase {

    @ViewChild('createOrEditODocModal', { static: true }) createOrEditODocModal: CreateOrEditODocModalComponent;
    @ViewChild('viewODocModalComponent', { static: true }) viewODocModal: ViewODocModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    numberFilter = '';
    maxPublisherFilter : number;
		maxPublisherFilterEmpty : number;
		minPublisherFilter : number;
		minPublisherFilterEmpty : number;
    maxBookFilter : number;
		maxBookFilterEmpty : number;
		minBookFilter : number;
		minBookFilterEmpty : number;
    summaryFilter = '';
    incommingNumberFilter: number;
    maxPriorityFilter : number;
		maxPriorityFilterEmpty : number;
		minPriorityFilter : number;
		minPriorityFilterEmpty : number;
    maxIncommingDateFilter : moment.Moment;
		minIncommingDateFilter : moment.Moment;
    attachmentFilter = '';
    statusFilter = -1;
    isActiveFilter = -1;
    maxOrderFilter : number;
		maxOrderFilterEmpty : number;
		minOrderFilter : number;
		minOrderFilterEmpty : number;
    maxRangeFilter : number;
		maxRangeFilterEmpty : number;
		minRangeFilter : number;
		minRangeFilterEmpty : number;
    maxLinkedDocumentFilter : number;
		maxLinkedDocumentFilterEmpty : number;
		minLinkedDocumentFilter : number;
		minLinkedDocumentFilterEmpty : number;
    maxSecretLevelFilter : number;
		maxSecretLevelFilterEmpty : number;
		minSecretLevelFilter : number;
		minSecretLevelFilterEmpty : number;
    processingRecommendedFilter = '';
    maxPublishDateFilter : moment.Moment;
		minPublishDateFilter : moment.Moment;
    signerFilter = '';
    maxOrgEditorFilter : number;
		maxOrgEditorFilterEmpty : number;
		minOrgEditorFilter : number;
		minOrgEditorFilterEmpty : number;
    maxReceiverIdFilter : number;
		maxReceiverIdFilterEmpty : number;
		minReceiverIdFilter : number;
		minReceiverIdFilterEmpty : number;
    maxLeaderIdFilter : number;
		maxLeaderIdFilterEmpty : number;
		minLeaderIdFilter : number;
		minLeaderIdFilterEmpty : number;




    constructor(
        injector: Injector,
        private _oDocsServiceProxy: ODocsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    // getODocs(event?: LazyLoadEvent) {
    //     if (this.primengTableHelper.shouldResetPaging(event)) {
    //         this.paginator.changePage(0);
    //         return;
    //     }

    //     this.primengTableHelper.showLoadingIndicator();

    //     this._oDocsServiceProxy.getAll(
    //         this.filterText,
    //         this.numberFilter,
    //         this.maxPublisherFilter == null ? this.maxPublisherFilterEmpty: this.maxPublisherFilter,
    //         this.minPublisherFilter == null ? this.minPublisherFilterEmpty: this.minPublisherFilter,
    //         this.maxBookFilter == null ? this.maxBookFilterEmpty: this.maxBookFilter,
    //         this.minBookFilter == null ? this.minBookFilterEmpty: this.minBookFilter,
    //         this.summaryFilter,
    //         this.incommingNumberFilter,
    //         this.maxPriorityFilter == null ? this.maxPriorityFilterEmpty: this.maxPriorityFilter,
    //         this.minPriorityFilter == null ? this.minPriorityFilterEmpty: this.minPriorityFilter,
    //         this.maxIncommingDateFilter,
    //         this.minIncommingDateFilter,
    //         this.attachmentFilter,
    //         this.statusFilter,
    //         this.isActiveFilter,
    //         this.maxOrderFilter == null ? this.maxOrderFilterEmpty: this.maxOrderFilter,
    //         this.minOrderFilter == null ? this.minOrderFilterEmpty: this.minOrderFilter,
    //         this.maxRangeFilter == null ? this.maxRangeFilterEmpty: this.maxRangeFilter,
    //         this.minRangeFilter == null ? this.minRangeFilterEmpty: this.minRangeFilter,
    //         this.maxLinkedDocumentFilter == null ? this.maxLinkedDocumentFilterEmpty: this.maxLinkedDocumentFilter,
    //         this.minLinkedDocumentFilter == null ? this.minLinkedDocumentFilterEmpty: this.minLinkedDocumentFilter,
    //         this.maxSecretLevelFilter == null ? this.maxSecretLevelFilterEmpty: this.maxSecretLevelFilter,
    //         this.minSecretLevelFilter == null ? this.minSecretLevelFilterEmpty: this.minSecretLevelFilter,
    //         this.processingRecommendedFilter,
    //         this.maxPublishDateFilter,
    //         this.minPublishDateFilter,
    //         this.signerFilter,
    //         this.maxOrgEditorFilter == null ? this.maxOrgEditorFilterEmpty: this.maxOrgEditorFilter,
    //         this.minOrgEditorFilter == null ? this.minOrgEditorFilterEmpty: this.minOrgEditorFilter,
    //         this.maxReceiverIdFilter == null ? this.maxReceiverIdFilterEmpty: this.maxReceiverIdFilter,
    //         this.minReceiverIdFilter == null ? this.minReceiverIdFilterEmpty: this.minReceiverIdFilter,
    //         this.maxLeaderIdFilter == null ? this.maxLeaderIdFilterEmpty: this.maxLeaderIdFilter,
    //         this.minLeaderIdFilter == null ? this.minLeaderIdFilterEmpty: this.minLeaderIdFilter,
    //         this.draftNumberFilter,
    //         this.primengTableHelper.getSorting(this.dataTable),
    //         this.primengTableHelper.getSkipCount(this.paginator, event),
    //         this.primengTableHelper.getMaxResultCount(this.paginator, event)
    //     ).subscribe(result => {
    //         this.primengTableHelper.totalRecordsCount = result.totalCount;
    //         this.primengTableHelper.records = result.items;
    //         this.primengTableHelper.hideLoadingIndicator();
    //     });
    // }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createODoc(): void {
        this.createOrEditODocModal.show();
    }

    deleteODoc(oDoc: ODocDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._oDocsServiceProxy.delete(oDoc.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    // exportToExcel(): void {
    //     this._oDocsServiceProxy.getODocsToExcel(
    //     this.filterText,
    //         this.numberFilter,
    //         this.maxPublisherFilter == null ? this.maxPublisherFilterEmpty: this.maxPublisherFilter,
    //         this.minPublisherFilter == null ? this.minPublisherFilterEmpty: this.minPublisherFilter,
    //         this.maxBookFilter == null ? this.maxBookFilterEmpty: this.maxBookFilter,
    //         this.minBookFilter == null ? this.minBookFilterEmpty: this.minBookFilter,
    //         this.summaryFilter,
    //         this.incommingNumberFilter,
    //         this.maxPriorityFilter == null ? this.maxPriorityFilterEmpty: this.maxPriorityFilter,
    //         this.minPriorityFilter == null ? this.minPriorityFilterEmpty: this.minPriorityFilter,
    //         this.maxIncommingDateFilter,
    //         this.minIncommingDateFilter,
    //         this.attachmentFilter,
    //         this.statusFilter,
    //         this.isActiveFilter,
    //         this.maxOrderFilter == null ? this.maxOrderFilterEmpty: this.maxOrderFilter,
    //         this.minOrderFilter == null ? this.minOrderFilterEmpty: this.minOrderFilter,
    //         this.maxRangeFilter == null ? this.maxRangeFilterEmpty: this.maxRangeFilter,
    //         this.minRangeFilter == null ? this.minRangeFilterEmpty: this.minRangeFilter,
    //         this.maxLinkedDocumentFilter == null ? this.maxLinkedDocumentFilterEmpty: this.maxLinkedDocumentFilter,
    //         this.minLinkedDocumentFilter == null ? this.minLinkedDocumentFilterEmpty: this.minLinkedDocumentFilter,
    //         this.maxSecretLevelFilter == null ? this.maxSecretLevelFilterEmpty: this.maxSecretLevelFilter,
    //         this.minSecretLevelFilter == null ? this.minSecretLevelFilterEmpty: this.minSecretLevelFilter,
    //         this.processingRecommendedFilter,
    //         this.maxPublishDateFilter,
    //         this.minPublishDateFilter,
    //         this.signerFilter,
    //         this.maxOrgEditorFilter == null ? this.maxOrgEditorFilterEmpty: this.maxOrgEditorFilter,
    //         this.minOrgEditorFilter == null ? this.minOrgEditorFilterEmpty: this.minOrgEditorFilter,
    //         this.maxReceiverIdFilter == null ? this.maxReceiverIdFilterEmpty: this.maxReceiverIdFilter,
    //         this.minReceiverIdFilter == null ? this.minReceiverIdFilterEmpty: this.minReceiverIdFilter,
    //         this.maxLeaderIdFilter == null ? this.maxLeaderIdFilterEmpty: this.maxLeaderIdFilter,
    //         this.minLeaderIdFilter == null ? this.minLeaderIdFilterEmpty: this.minLeaderIdFilter,
    //         this.draftNumberFilter,
    //     )
    //     .subscribe(result => {
    //         this._fileDownloadService.downloadTempFile(result);
    //      });
    // }
}
