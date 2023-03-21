import { DxDataGridComponent } from 'devextreme-angular';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImpersonatesServiceProxy, ImpersonateDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditImpersonateModalComponent } from './create-or-edit-impersonate-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './impersonates.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class ImpersonatesComponent extends AppComponentBase {

    @ViewChild('createOrEditImpersonateModal', { static: true }) createOrEditImpersonateModal: CreateOrEditImpersonateModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('gridContainer', { static: true }) gridContainer: DxDataGridComponent;

    advancedFiltersAreShown = false;
    filterText = '';
    maxUserIdFilter : number;
		maxUserIdFilterEmpty : number;
		minUserIdFilter : number;
		minUserIdFilterEmpty : number;
    userNameFilter = '';
    maxImpersonateUserIdFilter : number;
		maxImpersonateUserIdFilterEmpty : number;
		minImpersonateUserIdFilter : number;
		minImpersonateUserIdFilterEmpty : number;
    impersonateUserNameFilter = '';
    maxStartDateFilter : moment.Moment;
		minStartDateFilter : moment.Moment;
    maxEndDateFilter : moment.Moment;
		minEndDateFilter : moment.Moment;
    isActiveFilter = -1;
    isDeletedFilter = -1;
    initialData = [];
    selectedRowsData: any;


    constructor(
        injector: Injector,
        private _impersonatesServiceProxy: ImpersonatesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getImpersonates(event?: LazyLoadEvent) {
        this._impersonatesServiceProxy.getAllForAdmin().subscribe(result => {
            this.initialData = result;
        });
    }

    ngOnInit(){
        this._impersonatesServiceProxy.getAllForAdmin().subscribe(result => {
            this.initialData = result;
            console.log(result);
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createImpersonate(): void {
        this.createOrEditImpersonateModal.show();
    }

    deleteImpersonate(impersonate: ImpersonateDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._impersonatesServiceProxy.delete(impersonate.id)
                        .subscribe(() => {
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
}
