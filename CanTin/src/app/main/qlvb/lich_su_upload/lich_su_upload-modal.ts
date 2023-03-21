import { Component, Injector, ViewEncapsulation, ViewChild, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoryUploadsServiceProxy, HistoryUploadDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { SqlConfigHelperService } from '@shared/utils/sql-config-helper.service';
import DataSource from 'devextreme/data/data_source';
import { DxDataGridComponent } from 'devextreme-angular';
import { ModalDirective } from 'ngx-bootstrap';



@Component({
    selector: 'lich_su_uploadModal',
    templateUrl: './lich_su_upload-modal.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]

})
export class Lich_su_uploadModalComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    advancedFiltersAreShown = false;
    filterText = '';
    fileFilter = '';
    maxVersionFilter : number;
		maxVersionFilterEmpty : number;
		minVersionFilter : number;
		minVersionFilterEmpty : number;
    maxdocumentIDFilter : number;
		maxdocumentIDFilterEmpty : number;
		mindocumentIDFilter : number;
		mindocumentIDFilterEmpty : number;

        columnItems: any = [];

        dataSource: any = {};
        data = [];
        customDataSource: DataSource;
        allMode: string;
        checkBoxesMode: string;
        prefix = '';
        selectedRows: number[];
        selectionChangedBySelectbox: boolean;
        textBook :HistoryUploadDto = new HistoryUploadDto;
        columnBuilder = [];
        columnConfig = [];
        columns: any;
        initialData = [];


    constructor(
        injector: Injector,
        private _sqlConfigHelperService: SqlConfigHelperService,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
        this.allMode = 'allPages';
        this.checkBoxesMode = 'onClick';
        this.selectedRows = [];
    }

    getHistoryUploadDxTable() {
        this._historyUploadsServiceProxy.getAllHistoryUploads().subscribe(result => {
           
            this.initialData = result.listHistoryUploads;
            this.dataGrid.dataSource = this.initialData;
            console.log(this.dataGrid.dataSource)
            
            this.dataGrid.columns = this._sqlConfigHelperService.generateColumns(result.listColumnConfigHistoryUploads, true);
        });
    }
    selectionChangedHandler() {
        if(!this.selectionChangedBySelectbox) {
            this.prefix=null;
        }
        // console.log(this.dataGrid.instance.getSelectedRowKeys().subscribe(result => {
        //     this.vanban= result.listVanBan;
 
        this.selectionChangedBySelectbox=false;
    }
 
    filterSelected(event) {
        this.selectionChangedBySelectbox = true;
 
        let prefix = event.value;
 
        if(!prefix)
            return;
        else if(prefix === "All")
            this.selectedRows = this.dataSource.store.map(employee => employee.ID);
        else {
            this.selectedRows = this.dataSource.store.filter(employe => employe.Prefix === prefix).map(employee => employee.ID);
        }
 
        this.prefix = prefix;
     }
 

    ngOnInit(): void {
        this.getHistoryUploadDxTable();
        //this.getConfigColumn();
    }
    getSelectedRowKeys () {
        return this.dataGrid.instance.getSelectedRowKeys();
    }
    getSelectedRowsData () {
        return this.dataGrid.instance.getSelectedRowsData();
    }
 
    getHistoryUploads(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._historyUploadsServiceProxy.getAll(
            this.filterText,
            this.fileFilter,
            this.maxVersionFilter == null ? this.maxVersionFilterEmpty: this.maxVersionFilter,
            this.minVersionFilter == null ? this.minVersionFilterEmpty: this.minVersionFilter,
            this.maxdocumentIDFilter == null ? this.maxdocumentIDFilterEmpty: this.maxdocumentIDFilter,
            this.mindocumentIDFilter == null ? this.mindocumentIDFilterEmpty: this.mindocumentIDFilter,
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


    deleteHistoryUpload(historyUpload: HistoryUploadDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._historyUploadsServiceProxy.delete(historyUpload.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    addNewVanBan(){

    }
    addMoveGiaoViec(){

    }
    deleteVanban(){

    }
    scanDocument(){

    }

    getTextBooks(){
        
    }
}
