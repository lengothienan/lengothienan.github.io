import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HardDatasourceGroupsServiceProxy, HardDatasourceGroupDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditHardDatasourceGroupModalComponent } from './create-or-edit-hardDatasourceGroup-modal.component';
import { ViewHardDatasourceGroupModalComponent } from './view-hardDatasourceGroup-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { CreateOrEditHardDatasourceModalComponent } from '../hardDatasources/create-or-edit-hardDatasource-modal.component';
import { DataHardDatasourceGroupModalComponent } from './data-hardDatasourceGroup-modal.component';

@Component({
    templateUrl: './hardDatasourceGroups.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class HardDatasourceGroupsComponent extends AppComponentBase implements OnInit{
    @ViewChild('dataHardDatasourceGroupModal', { static: false }) dataHardDatasourceGroupModal: DataHardDatasourceGroupModalComponent;
    @ViewChild('createOrEditHardDatasourceGroupModal', { static: true }) createOrEditHardDatasourceGroupModal: CreateOrEditHardDatasourceGroupModalComponent;
    // @ViewChild('viewHardDatasourceGroupModalComponent', { static: true }) viewHardDatasourceGroupModal: ViewHardDatasourceGroupModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    codeFilter = '';
    descriptionFilter = '';
    tableResult: HardDatasourceGroupDto[] = [];
    groupId: number;
    hardName: string = '';
    hardDescripton: string = '';
    constructor(
        injector: Injector,
        private _hardDatasourceGroupsServiceProxy: HardDatasourceGroupsServiceProxy,
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
        this._hardDatasourceGroupsServiceProxy.getAllHardDatasourceGroup().subscribe(res => {
            this.tableResult = res;
        });
    }

    // createHardDatasource(e: any): void {
    //     this.createOrEditHardDatasourceModal.show(null,e);
    // }

    viewData(e: any){
        this.dataHardDatasourceGroupModal.hardName = e.code;
        this.dataHardDatasourceGroupModal.hardDescription = e.description;
        this.dataHardDatasourceGroupModal.loadData(e.id);
    }

    getHardDatasourceGroups(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._hardDatasourceGroupsServiceProxy.getAll(
            this.filterText,
            this.codeFilter,
            this.descriptionFilter,
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

    createHardDatasourceGroup(): void {
        this.createOrEditHardDatasourceGroupModal.show();
    }

    deleteHardDatasourceGroup(hardDatasourceGroup: HardDatasourceGroupDto): void {
        this.message.confirm(
            '',this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._hardDatasourceGroupsServiceProxy.delete(hardDatasourceGroup.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._hardDatasourceGroupsServiceProxy.getHardDatasourceGroupsToExcel(
        this.filterText,
            this.codeFilter,
            this.descriptionFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
