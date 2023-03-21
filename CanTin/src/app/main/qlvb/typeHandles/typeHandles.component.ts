import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TypeHandesServiceProxy, TypeHandeDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditTypeHandleModalComponent } from './create-or-edit-typeHandle-modal.component';
import { ViewTypeHandeModalComponent } from './view-typeHandle-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './typeHandles.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class TypeHandlesComponent extends AppComponentBase {

    @ViewChild('createOrEditTypeHandleModal', { static: true }) createOrEditTypeHandleModal: CreateOrEditTypeHandleModalComponent;
    @ViewChild('viewTypeHandleModalComponent', { static: true }) viewTypeHandleModal: ViewTypeHandeModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';




    constructor(
        injector: Injector,
        private _typeHandlesServiceProxy: TypeHandesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getTypeHandles(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._typeHandlesServiceProxy.getAll(
            this.filterText,
            this.nameFilter,
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

    createTypeHande(): void {
        this.createOrEditTypeHandleModal.show();
    }

    // deleteTypeHande(typeHande: TypeHandeDto): void {
    //     this.message.confirm(
    //         '',
    //         (isConfirmed) => {
    //             if (isConfirmed) {
    //                 this._typeHandesServiceProxy.delete(typeHande.id)
    //                     .subscribe(() => {
    //                         this.reloadPage();
    //                         this.notify.success(this.l('SuccessfullyDeleted'));
    //                     });
    //             }
    //         }
    //     );
    // }

    exportToExcel(): void {
        this._typeHandlesServiceProxy.getTypeHandesToExcel(
        this.filterText,
            this.nameFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
