import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreDatasourcesServiceProxy, StoreDatasourceDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditStoreDatasourceModalComponent } from './create-or-edit-storeDatasource-modal.component';
import { ViewStoreDatasourceModalComponent } from './view-storeDatasource-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './storeDatasources.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class StoreDatasourcesComponent extends AppComponentBase implements OnInit{

    @ViewChild('createOrEditStoreDatasourceModal', { static: true }) createOrEditStoreDatasourceModal: CreateOrEditStoreDatasourceModalComponent;
    // @ViewChild('viewStoreDatasourceModalComponent', { static: true }) viewStoreDatasourceModal: ViewStoreDatasourceModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    nameStoreFilter = '';
    keyFilter = '';
    valueFilter = '';
    maxDynamicDatasourceIdFilter : number;
		maxDynamicDatasourceIdFilterEmpty : number;
		minDynamicDatasourceIdFilter : number;
		minDynamicDatasourceIdFilterEmpty : number;
    maxOrderFilter : number;
		maxOrderFilterEmpty : number;
		minOrderFilter : number;
		minOrderFilterEmpty : number;
    isActiveFilter = -1;
    tableResult: StoreDatasourceDto[] = [];



    constructor(
        injector: Injector,
        private _storeDatasourcesServiceProxy: StoreDatasourcesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(){
        this._storeDatasourcesServiceProxy.getAllStoreDatasource().subscribe(res => {
            this.tableResult = res;
        });
    }

    createStoreDatasource(): void {
        this.createOrEditStoreDatasourceModal.show();
    }

    deleteStoreDatasource(storeDatasource: StoreDatasourceDto): void {
        this.message.confirm(
            '',this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._storeDatasourcesServiceProxy.delete(storeDatasource.id)
                        .subscribe(() => {
                            this.loadData();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._storeDatasourcesServiceProxy.getStoreDatasourcesToExcel(
        this.filterText,
            this.nameStoreFilter,
            this.keyFilter,
            this.valueFilter,
            this.maxDynamicDatasourceIdFilter == null ? this.maxDynamicDatasourceIdFilterEmpty: this.maxDynamicDatasourceIdFilter,
            this.minDynamicDatasourceIdFilter == null ? this.minDynamicDatasourceIdFilterEmpty: this.minDynamicDatasourceIdFilter,
            this.maxOrderFilter == null ? this.maxOrderFilterEmpty: this.maxOrderFilter,
            this.minOrderFilter == null ? this.minOrderFilterEmpty: this.minOrderFilter,
            this.isActiveFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
