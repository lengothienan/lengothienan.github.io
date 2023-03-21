import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReceiveUnitsServiceProxy, ReceiveUnitDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditReceiveUnitModalComponent } from './create-or-edit-receiveUnit-modal.component';
import { ViewReceiveUnitModalComponent } from './view-receiveUnit-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './receiveUnits.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ReceiveUnitsComponent extends AppComponentBase {

    @ViewChild('createOrEditReceiveUnitModal', { static: true }) createOrEditReceiveUnitModal: CreateOrEditReceiveUnitModalComponent;
    @ViewChild('viewReceiveUnitModalComponent', { static: true }) viewReceiveUnitModal: ViewReceiveUnitModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    positionFilter = '';
    isActiveFilter = -1;




    constructor(
        injector: Injector,
        private _receiveUnitsServiceProxy: ReceiveUnitsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getReceiveUnits(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._receiveUnitsServiceProxy.getAll(
            this.filterText,
            this.nameFilter,
            this.positionFilter,
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

    createReceiveUnit(): void {
        this.createOrEditReceiveUnitModal.show();
    }

    // deleteReceiveUnit(receiveUnit: ReceiveUnitDto): void {
    //     this.message.confirm(
    //         '',
    //         (isConfirmed) => {
    //             if (isConfirmed) {
    //                 this._receiveUnitsServiceProxy.delete(receiveUnit.id)
    //                     .subscribe(() => {
    //                         this.reloadPage();
    //                         this.notify.success(this.l('SuccessfullyDeleted'));
    //                     });
    //             }
    //         }
    //     );
    // }

    exportToExcel(): void {
        this._receiveUnitsServiceProxy.getReceiveUnitsToExcel(
        this.filterText,
            this.nameFilter,
            this.positionFilter,
            this.isActiveFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
