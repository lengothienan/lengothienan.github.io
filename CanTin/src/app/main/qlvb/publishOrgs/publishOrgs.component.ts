import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublishOrgsServiceProxy, PublishOrgDto, GetPublishOrgForViewDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditPublishOrgModalComponent } from './create-or-edit-publishOrg-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './publishOrgs.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class PublishOrgsComponent extends AppComponentBase implements OnInit{

    @ViewChild('createOrEditPublishOrgModal', { static: true }) createOrEditPublishOrgModal: CreateOrEditPublishOrgModalComponent;

    advancedFiltersAreShown = false;
    filterText = '';
    codeFilter = '';
    nameFilter = '';
    isActiveFilter = -1;
    tableResult: GetPublishOrgForViewDto[] = [];



    constructor(
        injector: Injector,
        private _publishOrgsServiceProxy: PublishOrgsServiceProxy,
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
        this._publishOrgsServiceProxy.getAllPublishOrg().subscribe(res => {
            this.tableResult = res;
            console.log(res);
        });
    }

    createPublishOrg(): void {
        this.createOrEditPublishOrgModal.show();
    }

    deletePublishOrg(publishOrg: PublishOrgDto): void {
        this.message.confirm(
            '',this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._publishOrgsServiceProxy.delete(publishOrg.id)
                        .subscribe(() => {
                            this.notify.success(this.l('SuccessfullyDeleted'));
                            this.loadData();
                        });
                }
            }
        );
    }

    // exportToExcel(): void {
    //     this._publishOrgsServiceProxy.getPublishOrgsToExcel(
    //     this.filterText,
    //         this.codeFilter,
    //         this.nameFilter,
    //         this.isActiveFilter,
    //         this.maxOrgLevelIdFilter == null ? this.maxOrgLevelIdFilterEmpty: this.maxOrgLevelIdFilter,
    //         this.minOrgLevelIdFilter == null ? this.minOrgLevelIdFilterEmpty: this.minOrgLevelIdFilter,
    //     )
    //     .subscribe(result => {
    //         this._fileDownloadService.downloadTempFile(result);
    //      });
    // }
}
