import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HardDatasourcesServiceProxy, HardDatasourceDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditHardDatasourceModalComponent } from './create-or-edit-hardDatasource-modal.component';
import { ViewHardDatasourceModalComponent } from './view-hardDatasource-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
    templateUrl: './hardForDynamicDatasources.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class HardForDynamicDatasourcesComponent extends AppComponentBase implements OnInit{

    @ViewChild('createOrEditHardDatasourceModal', { static: true }) createOrEditHardDatasourceModal: CreateOrEditHardDatasourceModalComponent;
    @ViewChild('viewHardDatasourceModalComponent', { static: true }) viewHardDatasourceModal: ViewHardDatasourceModalComponent;
    @ViewChild('gridContainer', { static: true }) gridContainer: DxDataGridComponent;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
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
    labelId: number;
    dataSource = [];
    header = '';

    constructor(
        injector: Injector,
        private _hardDatasourcesServiceProxy: HardDatasourcesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }
    ngOnInit(): void {
        this._activatedRoute.params.subscribe(params => {           
            this.labelId = parseInt(params['id']);
            this._hardDatasourcesServiceProxy.getDynamicFieldName(this.labelId).subscribe((res)=>{
                this.header = res;
            });
            this._hardDatasourcesServiceProxy.getAllByDynamicDatasource(this.labelId).subscribe((res)=>{
                this.dataSource = res;
            });
        });
    }

    getHardDatasources(){
        this._hardDatasourcesServiceProxy.getAllByDynamicDatasource(this.labelId).subscribe((res)=>{
            this.dataSource = res;
        });
    }

    onRowUpdated(e: any){
        console.log(e);
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createHardDatasource(): void {
        this.createOrEditHardDatasourceModal.show(null, this.labelId);
    }

    deleteHardDatasource(hardDatasource: HardDatasourceDto): void {
        this.message.confirm(
            '',this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._hardDatasourcesServiceProxy.delete(hardDatasource.id)
                        .subscribe(() => {
                            this.getHardDatasources();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._hardDatasourcesServiceProxy.getHardDatasourcesToExcel(
        this.filterText,
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
