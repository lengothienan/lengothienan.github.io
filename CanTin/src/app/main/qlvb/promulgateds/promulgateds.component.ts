import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PromulgatedsServiceProxy, PromulgatedDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditPromulgatedModalComponent } from './create-or-edit-promulgated-modal.component';
import { ViewPromulgatedModalComponent } from './view-promulgated-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './promulgateds.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PromulgatedsComponent extends AppComponentBase {

    @ViewChild('createOrEditPromulgatedModal', { static: true }) createOrEditPromulgatedModal: CreateOrEditPromulgatedModalComponent;
    @ViewChild('viewPromulgatedModalComponent', { static: true }) viewPromulgatedModal: ViewPromulgatedModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    displayNameFilter = '';
    representativeFilter = '';
    leaderFilter = '';
    positionFilter = '';



    constructor(
        injector: Injector,
        private _promulgatedsServiceProxy: PromulgatedsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getPromulgateds(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._promulgatedsServiceProxy.getAll(
            this.filterText,
            this.nameFilter,
            this.displayNameFilter,
            this.representativeFilter,
            this.leaderFilter,
            this.positionFilter,
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

    createPromulgated(): void {
        this.createOrEditPromulgatedModal.show();
    }

    // deletePromulgated(promulgated: PromulgatedDto): void {
    //     this.message.confirm(
    //         '',
    //         (isConfirmed) => {
    //             if (isConfirmed) {
    //                 this._promulgatedsServiceProxy.delete(promulgated.id)
    //                     .subscribe(() => {
    //                         this.reloadPage();
    //                         this.notify.success(this.l('SuccessfullyDeleted'));
    //                     });
    //             }
    //         }
    //     );
    // }

    exportToExcel(): void {
        this._promulgatedsServiceProxy.getPromulgatedsToExcel(
        this.filterText,
            this.nameFilter,
            this.displayNameFilter,
            this.representativeFilter,
            this.leaderFilter,
            this.positionFilter
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
