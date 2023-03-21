import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrgLevelsServiceProxy, OrgLevelDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditOrgLevelModalComponent } from './create-or-edit-orgLevel-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './orgLevels.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class OrgLevelsComponent extends AppComponentBase implements OnInit{

    @ViewChild('createOrEditOrgLevelModal', { static: true }) createOrEditOrgLevelModal: CreateOrEditOrgLevelModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    codeFilter = '';
    nameFilter = '';
    isActiveFilter = -1;
    tableResult: OrgLevelDto[] = [];



    constructor(
        injector: Injector,
        private _orgLevelsServiceProxy: OrgLevelsServiceProxy,
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
        this._orgLevelsServiceProxy.getAllOrgLevel().subscribe(res => {
            console.log(res);
            this.tableResult = res;
        });
    }

    // getOrgLevels(event?: LazyLoadEvent) {
    //     if (this.primengTableHelper.shouldResetPaging(event)) {
    //         this.paginator.changePage(0);
    //         return;
    //     }

    //     this.primengTableHelper.showLoadingIndicator();

    //     this._orgLevelsServiceProxy.getAll(
    //         this.filterText,
    //         this.codeFilter,
    //         this.nameFilter,
    //         this.isActiveFilter,
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

    createOrgLevel(): void {
        this.createOrEditOrgLevelModal.show();
    }

    deleteOrgLevel(orgLevel: OrgLevelDto): void {
        this.message.confirm(
            '',this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._orgLevelsServiceProxy.delete(orgLevel.id)
                        .subscribe(() => {
                            //this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                            this.loadData()
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._orgLevelsServiceProxy.getOrgLevelsToExcel(
        this.filterText,
            this.codeFilter,
            this.nameFilter,
            this.isActiveFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
