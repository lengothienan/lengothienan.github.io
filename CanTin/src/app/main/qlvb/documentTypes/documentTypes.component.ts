import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentTypesServiceProxy, DocumentTypeDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditDocumentTypeModalComponent } from './create-or-edit-documentType-modal.component';
import { ViewDocumentTypeModalComponent } from './view-documentType-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';

@Component({
    templateUrl: './documentTypes.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DocumentTypesComponent extends AppComponentBase implements OnInit {

    @ViewChild('createOrEditDocumentTypeModal', { static: true }) createOrEditDocumentTypeModal: CreateOrEditDocumentTypeModalComponent;
    @ViewChild('viewDocumentTypeModalComponent', { static: true }) viewDocumentTypeModal: ViewDocumentTypeModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('dynamicModule', { static: true}) dynamicModule: DynamicModuleComponent
    advancedFiltersAreShown = false;
    filterText = '';
    typeNameFilter = '';
    isActiveFilter = -1;
    signalFilter = '';
    // link = '';
    // parameters = 1;
    maxProcessingDays: number;
    minProcessingDays: number;

    constructor(
        injector: Injector,
        private _documentTypesServiceProxy: DocumentTypesServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private router: Router
    ) {
        super(injector);
        // this.link = this.router.url;
    }

    ngOnInit(){

        // this.dynamicModule.loadDynamicField(15, this.link);
    }

    getDocumentTypes(event?: LazyLoadEvent) {
    //     if (this.primengTableHelper.shouldResetPaging(event)) {
    //         this.paginator.changePage(0);
    //         return;
    //     }

    //     this.primengTableHelper.showLoadingIndicator();

        this._documentTypesServiceProxy.getAll(
            this.filterText,
            this.typeNameFilter,
            this.signalFilter,
            this.maxProcessingDays,
            this.minProcessingDays,
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

    createDocumentType(): void {
        this.createOrEditDocumentTypeModal.show();
    }

    deleteDocumentType(documentType: DocumentTypeDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._documentTypesServiceProxy.delete(documentType.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._documentTypesServiceProxy.getDocumentTypesToExcel(
        this.filterText,
            this.typeNameFilter,
            this.signalFilter,
            this.maxProcessingDays,
            this.minProcessingDays,
            this.isActiveFilter
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
}
