import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeywordDetailsServiceProxy, KeywordDetailDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditKeywordDetailModalComponent } from './create-or-edit-keywordDetail-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './keywordDetails.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class KeywordDetailsComponent extends AppComponentBase {

    @ViewChild('createOrEditKeywordDetailModal', { static: true }) createOrEditKeywordDetailModal: CreateOrEditKeywordDetailModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    maxKeywordIdFilter : number;
		maxKeywordIdFilterEmpty : number;
		minKeywordIdFilter : number;
		minKeywordIdFilterEmpty : number;
    isLeaderFilter = -1;
    fullNameFilter = '';
    mainHandlingFilter = -1;
    coHandlingFilter = -1;
    toKnowFilter = -1;
    isActiveFilter = -1;
    maxOrderFilter : number;
		maxOrderFilterEmpty : number;
		minOrderFilter : number;
		minOrderFilterEmpty : number;
    userIdFilter: number;



    constructor(
        injector: Injector,
        private _keywordDetailsServiceProxy: KeywordDetailsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getKeywordDetails(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._keywordDetailsServiceProxy.getAll(
            this.filterText,
            this.maxKeywordIdFilter == null ? this.maxKeywordIdFilterEmpty: this.maxKeywordIdFilter,
            this.minKeywordIdFilter == null ? this.minKeywordIdFilterEmpty: this.minKeywordIdFilter,
            this.isLeaderFilter,
            this.fullNameFilter,
            this.mainHandlingFilter,
            this.coHandlingFilter,
            this.toKnowFilter,
            this.isActiveFilter,
            this.maxOrderFilter == null ? this.maxOrderFilterEmpty: this.maxOrderFilter,
            this.minOrderFilter == null ? this.minOrderFilterEmpty: this.minOrderFilter,
            this.userIdFilter,
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

    createKeywordDetail(): void {
        this.createOrEditKeywordDetailModal.show();
    }

    deleteKeywordDetail(keywordDetail: KeywordDetailDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._keywordDetailsServiceProxy.delete(keywordDetail.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
}
