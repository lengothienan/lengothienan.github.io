import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicCategoryRowIndexesServiceProxy, DynamicCategoryRowIndexDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditDynamicCategoryRowIndexModalComponent } from './create-or-edit-dynamicCategoryRowIndex-modal.component';
import { ViewDynamicCategoryRowIndexModalComponent } from './view-dynamicCategoryRowIndex-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './dynamicCategoryRowIndexes.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DynamicCategoryRowIndexesComponent extends AppComponentBase {

    @ViewChild('createOrEditDynamicCategoryRowIndexModal', { static: true }) createOrEditDynamicCategoryRowIndexModal: CreateOrEditDynamicCategoryRowIndexModalComponent;
    @ViewChild('viewDynamicCategoryRowIndexModalComponent', { static: true }) viewDynamicCategoryRowIndexModal: ViewDynamicCategoryRowIndexModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    maxLabelIdFilter : number;
		maxLabelIdFilterEmpty : number;
		minLabelIdFilter : number;
		minLabelIdFilterEmpty : number;
    labelNameFilter = '';
    maxRowIndexFilter : number;
		maxRowIndexFilterEmpty : number;
		minRowIndexFilter : number;
		minRowIndexFilterEmpty : number;




    constructor(
        injector: Injector,
        private _dynamicCategoryRowIndexesServiceProxy: DynamicCategoryRowIndexesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getDynamicCategoryRowIndexes(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._dynamicCategoryRowIndexesServiceProxy.getAll(
            this.filterText,
            this.maxLabelIdFilter == null ? this.maxLabelIdFilterEmpty: this.maxLabelIdFilter,
            this.minLabelIdFilter == null ? this.minLabelIdFilterEmpty: this.minLabelIdFilter,
            this.labelNameFilter,
            this.maxRowIndexFilter == null ? this.maxRowIndexFilterEmpty: this.maxRowIndexFilter,
            this.minRowIndexFilter == null ? this.minRowIndexFilterEmpty: this.minRowIndexFilter,
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

    createDynamicCategoryRowIndex(): void {
        this.createOrEditDynamicCategoryRowIndexModal.show();
    }

    deleteDynamicCategoryRowIndex(dynamicCategoryRowIndex: DynamicCategoryRowIndexDto): void {
        this.message.confirm(
            '',this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._dynamicCategoryRowIndexesServiceProxy.delete(dynamicCategoryRowIndex.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._dynamicCategoryRowIndexesServiceProxy.getDynamicCategoryRowIndexesToExcel(
        this.filterText,
            this.maxLabelIdFilter == null ? this.maxLabelIdFilterEmpty: this.maxLabelIdFilter,
            this.minLabelIdFilter == null ? this.minLabelIdFilterEmpty: this.minLabelIdFilter,
            this.labelNameFilter,
            this.maxRowIndexFilter == null ? this.maxRowIndexFilterEmpty: this.maxRowIndexFilter,
            this.minRowIndexFilter == null ? this.minRowIndexFilterEmpty: this.minRowIndexFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
