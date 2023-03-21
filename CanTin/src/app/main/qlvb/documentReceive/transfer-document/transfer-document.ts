import { Component, Injector, ViewEncapsulation, ViewChild, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DocumentsDto, SqlConfigDetailsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxFileManagerModule, DxPopupModule, DxDataGridComponent, DxTreeListComponent } from 'devextreme-angular';
import { BrowserModule } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { DxTextBoxModule, DxFileUploaderModule, DxButtonModule } from 'devextreme-angular';
import { from } from 'rxjs';
import * as $ from 'jquery';
import { Service, Task, Employee, Priority } from './app.service';
import { finalize } from 'rxjs/operators';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { AppMenu } from '@app/shared/layout/nav/app-menu';
import { DocumentHandlingsServiceProxy, DocumentHandlingDto  } from '@shared/service-proxies/service-proxies';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { SqlConfigHelperService } from '@shared/utils/sql-config-helper.service';



@Component({
     selector: 'transferDocumentModal',
    templateUrl: './transfer-document.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./style.css'],
    providers: [Service],
    animations: [appModuleAnimation()],
    styles: [
        `
          .greenClass { background-color: green }
          .redClass { color: red }
        `
      ]

})
export class TransferDocumentComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
    @ViewChild('treeList', { static: true}) treeList: DxTreeListComponent;
    @ViewChild('treeListVBDi', { static: true}) treeListVBDi: DxTreeListComponent;
    picture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    tasks: Task[];
    employees: Employee[];
    priorities: Priority[];
    statuses: string[];
    a = AppConsts.appBaseUrl;
    data_publisher = [];
    director_list = [];
    serviceproxy: string = 'DocumentHandlingsServiceProxy';
    menu: any;
    popupVisible = false;
    selectedRows: number[];
    selectionChangedBySelectbox: boolean;
    initialData = []; 
    dataSource: any = {};
    allMode: string;
    document_Handling : [];
    checkBoxesMode: string;
    prefix = '';
    _id : number ;
    data: any; 
    checkType = 1
    constructor(
        service: Service,
        injector: Injector,
        private router : Router,
        private _sqlConfigHelperService: SqlConfigHelperService,
        private _sqlConfigDetailsService: SqlConfigDetailsServiceProxy,
        private _appNavigationService: AppNavigationService,
        private activeRoute: ActivatedRoute,
        private _documentHandlingsServiceProxy: DocumentHandlingsServiceProxy,
        private _activatedRoute: ActivatedRoute
    ) {
        super(injector);
     
        this.allMode = 'allPages';
        this.checkBoxesMode = 'onClick';
        this.selectedRows = [];
    
        this.statuses = [
          "Chưa bắt đầu",
          "Đợi quyền",
          "Đang xử lý",
          "Hoãn lại",
          "Hoàn thành"
        ];
    }
    getCompletionText(cellInfo) {
        return cellInfo.valueText + "%";
      }
    ngOnInit() {
        if(this.activeRoute.url['_value'][1].path=="quytrinhxuly"){
            this.checkType=0
        }else{
            this.checkType=1;
        }
        this.getProcesDxTable();
    }

    getserviceproxy(message: string)
    {
        this.serviceproxy = message; 
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

    choxuly()
    {
        this.router.navigate(['/app/main/qlvb/choxuly']);
    }

    selectionChangedHandler() {
        if(!this.selectionChangedBySelectbox) {
            this.prefix=null;
        }
        this.selectionChangedBySelectbox=false;
    }
    getSelectedRowKeys () {
        return this.dataGrid.instance.getSelectedRowKeys();
    }
    getSelectedRowsData () {
     this.dataGrid.instance.getSelectedRowsData();  
    }
    quytrinhxulyvbden:any;
    quytrinhxulyvbdi:any;
    getProcesDxTable() {
        this.activeRoute.params.subscribe(params => {
            this._id = params['id'];
        });
        if(this.checkType==1){
            this._documentHandlingsServiceProxy.getListOutDocumentHandingByDocumentId(this._id).subscribe(result => {    
                // this.treeListVBDi.dataSource = result;  
                this.quytrinhxulyvbdi=result;
                console.log(this.quytrinhxulyvbdi)
        });
        }else{
            this._documentHandlingsServiceProxy.getListDocumentHandingByDocumentIdVer2(this._id).subscribe(result => {
                // this.treeList.dataSource = result;
                this.quytrinhxulyvbden=result;
                console.log(this.quytrinhxulyvbden)
            });             
        }
    }

    getDisplayExpr(item) {
        if(!item) {
            return "";
        }
        return   item.name  + " , " + item.job + " ," + item.date + ", " + item.status;
    }
    save(): void {
            // this.saving = true;

			
            // this._sqlConfigDetailsServiceProxy.createOrEdit(this.sqlConfigDetail)
            //  .pipe(finalize(() => { this.saving = false;}))
            //  .subscribe(() => {
            //     this.notify.info(this.l('SavedSuccessfully'));
            //     this.close();
            //     this.modalSave.emit(null);
            //  });

            
    }
}