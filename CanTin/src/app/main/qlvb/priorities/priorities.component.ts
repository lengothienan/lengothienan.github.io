import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrioritiesServiceProxy, PriorityDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditPriorityModalComponent } from './create-or-edit-priority-modal.component';
import { ViewPriorityModalComponent } from './view-priority-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './priorities.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PrioritiesComponent extends AppComponentBase {

    @ViewChild('createOrEditPriorityModal', { static: true }) createOrEditPriorityModal: CreateOrEditPriorityModalComponent;
    @ViewChild('viewPriorityModalComponent', { static: true }) viewPriorityModal: ViewPriorityModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    advancedFiltersAreShown = false;
    filterText = '';
    keyFilter = '';
    maxValueFilter : number;
		maxValueFilterEmpty : number;
		minValueFilter : number;
		minValueFilterEmpty : number;




    constructor(
        injector: Injector,
        private _prioritiesServiceProxy: PrioritiesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    getPriorities(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._prioritiesServiceProxy.getAll(
            this.filterText,
            this.keyFilter,
            this.maxValueFilter == null ? this.maxValueFilterEmpty: this.maxValueFilter,
            this.minValueFilter == null ? this.minValueFilterEmpty: this.minValueFilter,
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

    createPriority(): void {
        this.createOrEditPriorityModal.show();
    }

    deletePriority(priority: PriorityDto): void {
        this.message.confirm(
            '', this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._prioritiesServiceProxy.delete(priority.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
}
