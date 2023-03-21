import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordProcessingsServiceProxy, WordProcessingDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditWordProcessingModalComponent } from './create-or-edit-wordProcessing-modal.component';
import { ViewWordProcessingModalComponent } from './view-wordProcessing-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './wordProcessings.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class WordProcessingsComponent extends AppComponentBase {

    @ViewChild('createOrEditWordProcessingModal', { static: true }) createOrEditWordProcessingModal: CreateOrEditWordProcessingModalComponent;
    @ViewChild('viewWordProcessingModalComponent', { static: true }) viewWordProcessingModal: ViewWordProcessingModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    receivePlaceFilter = '';
    nameFilter = '';
    contentFilter = '';
    statusFilter = '';
    commentFilter = '';
    maxKeyWordIdFilter : number;
		maxKeyWordIdFilterEmpty : number;
		minKeyWordIdFilter : number;
		minKeyWordIdFilterEmpty : number;




    constructor(
        injector: Injector,
        private _wordProcessingsServiceProxy: WordProcessingsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getWordProcessings(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._wordProcessingsServiceProxy.getAll(
            this.filterText,
            this.receivePlaceFilter,
            this.nameFilter,
            this.contentFilter,
            this.statusFilter,
            this.commentFilter,
            this.maxKeyWordIdFilter == null ? this.maxKeyWordIdFilterEmpty: this.maxKeyWordIdFilter,
            this.minKeyWordIdFilter == null ? this.minKeyWordIdFilterEmpty: this.minKeyWordIdFilter,
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

    createWordProcessing(): void {
        this.createOrEditWordProcessingModal.show();
    }

    // deleteWordProcessing(wordProcessing: WordProcessingDto): void {
    //     this.message.confirm(
    //         '',
    //         (isConfirmed) => {
    //             if (isConfirmed) {
    //                 this._wordProcessingsServiceProxy.delete(wordProcessing.id)
    //                     .subscribe(() => {
    //                         this.reloadPage();
    //                         this.notify.success(this.l('SuccessfullyDeleted'));
    //                     });
    //             }
    //         }
    //     );
    // }

    exportToExcel(): void {
        this._wordProcessingsServiceProxy.getWordProcessingsToExcel(
        this.filterText,
            this.receivePlaceFilter,
            this.nameFilter,
            this.contentFilter,
            this.statusFilter,
            this.commentFilter,
            this.maxKeyWordIdFilter == null ? this.maxKeyWordIdFilterEmpty: this.maxKeyWordIdFilter,
            this.minKeyWordIdFilter == null ? this.minKeyWordIdFilterEmpty: this.minKeyWordIdFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
