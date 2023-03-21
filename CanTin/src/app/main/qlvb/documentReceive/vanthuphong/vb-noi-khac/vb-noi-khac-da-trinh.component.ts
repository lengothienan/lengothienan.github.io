import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetDocInputForSearchDto,HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CreateOrEditIdoc_starDto, DocumentHandlingsServiceProxy, DynamicGridHelperServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { Router, NavigationEnd } from '@angular/router';
import { DxDataGridComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { AppConsts } from '@shared/AppConsts';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
//import { CreateNewIncommingDocumentComponent } from '../documentReceive/create-document/create-new-incomming-document';
import $ from 'jquery';
import { YKienChiDaoComponent } from '@app/main/documentHelper/yKienChiDao.component';
import CustomStore from 'devextreme/data/custom_store';
import moment from 'moment';
@Component({
    templateUrl: './vb-noi-khac-da-trinh.component.html',
    animations: [appModuleAnimation()]
})
export class VBNoiKhacDaTrinhComponent extends AppComponentBase implements OnInit {
    @Input() actionID: string;
    // @Output() lbId = new EventEmitter<number>();
    @ViewChild(DxDataGridComponent, { static: true }) gridContainer: DxDataGridComponent;
    // @ViewChild('transferHandleModal', { static: true }) transferHandleModal: TransferHandleModalComponent;
    @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;
    // @ViewChild('createNewIncommingDocument', { static: false }) createNewIncommingDocument: CreateNewIncommingDocumentComponent;
    @ViewChild('gridContainer113', { static: true }) gridContainer113: DxDataGridComponent;
    @ViewChild("BGDSelectBox", { static: false }) BGDSelectBox: DxSelectBoxComponent;
    @ViewChild('buttonUI', { static: true}) buttonUI: ButtonUIComponent;
    @ViewChild('yKienChiDao', { static: false}) yKienChiDao: YKienChiDaoComponent;
    totalCount: number = 0;
    saving = false;
    rawSql: string;
    user_ID: any;
    userID: any;
    initialData: any;
    initialData1: any;
    now: Date = new Date();
    historyPopupVisible = false;
    history_Upload = [];
    rootUrl = '';
    selectedRows = [];
    selectedRowsData: any[] = [];
    data_Row: string;
    link = '';
    allMode: string;
    directions: any;
    director_list = [];
    currentDate: Date;
    director: any;
    printUrl = '';
    hasAdvanceFilter = true;
    docId: number;

    data:any = [];
    params:any = {};
    searchText:string="";
    currentFilter:any;
    constructor(
        injector: Injector,
        private ultility: UtilityService,
        private _appSessionService: AppSessionService,
        private router: Router,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _idocStarServiceProxy: Idoc_starsServiceProxy) {
        super(injector);
        this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetWordFile?documentId=';
        this.router.routeReuseStrategy.shouldReuseRoute = function(){
            return false;
        }
         
        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
               // trick the Router into believing it's last link wasn't previously loaded
               this.router.navigated = false;
               // if you need to scroll back to top, here is the right place
               window.scrollTo(0, 0);
            }
        });
        //begin: lazy load datasource
        const self = this;
        self.params.UnitId = this.appSession.organizationUnitId;
        // self.lazyLoadData();
        // this.initialData = new CustomStore({
        //     key: "Id",
        //     load: function (loadOptions: any) {
        //         return self._documentAppService.getAllDocumentByStoredName_LazyLoad('GetAllDocumentHaveDirectedToUnit_LazyLoad', loadOptions["skip"], loadOptions["take"], self.searchText, JSON.stringify(self.params))
        //         .toPromise().then((result) => {
        //             self.data = result.getDataAndColumnConfig.listData;
        //             self.totalCount = result.getDataAndColumnConfig.totalCount;
        //             return {
        //                 data: result.getDataAndColumnConfig.listData,
        //                 totalCount: result.getDataAndColumnConfig.totalCount,
        //                 summary: undefined,
        //                 groupCount: undefined
        //             }
        //         });
        //     }
        // });
        //end

        this.link = this.router.url;
        this.user_ID = this._appSessionService.userId;
        this.currentDate = new Date();
    }
    ngOnInit() {
        this.toDateVal = new Date();
        this.fromDateVal = new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate()-14);
        this.loadData();
    }
    // lazyLoadData(){
    //     const self = this;
    //     self.initialData = new CustomStore({
    //         key: "Id",
    //         load: function (loadOptions: any) {
    //             return self._documentAppService.getAllDocumentByStoredName_LazyLoad('GetAllDocumentHaveDirectedToUnit_LazyLoad', loadOptions["skip"], loadOptions["take"], self.searchText, JSON.stringify(self.params))
    //             .toPromise().then((result) => {
    //                 self.data = result.getDataAndColumnConfig.listData;
    //                 self.totalCount = result.getDataAndColumnConfig.totalCount;
    //                 return {
    //                     data: result.getDataAndColumnConfig.listData,
    //                     totalCount: result.getDataAndColumnConfig.totalCount,
    //                     summary: undefined,
    //                     groupCount: undefined
    //                 }
    //             });
    //         }
    //     });
    // }

    async loadData(){
       this.search();
    }

    popUpClass()
    {
        return "popUpClass";
    }

    // funtion tra ve
    return() {
        window.history.go(-1); return false;
    }

    // funtion thêm mới
    create() {
        this.router.navigate(['/app/main/qlvb/create-new-incomming-document']);
    }
    // funtion chuyển

    viewProcess(event: any) {
        
        this.router.navigate(['/app/main/qlvb/quytrinhxuly/' + event.data.Id]);
    }

    viewRow(event: any) {
        // sessionStorage.setItem("readOnly", "true");
        this.router.navigate(['/app/main/qlvb/them-vb-phong/view/' + event.data.Id]);
    }

    // Lịch sử xử lý văn bản
    showListHistory(event: any) {
        this._historyUploadsServiceProxy.getList(event.data.Id).subscribe(res => {
            this.history_Upload = res;
        });
        this.historyPopupVisible = true;
    }

    getIndexById(id: number) {
        var curData = this.initialData;
        let index = curData.findIndex(x => x.Id == id);
        return index;
    }
    getSelectedRowKeys() {
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            return;
        }
        this.selectedRowsData.forEach(element => {
            this.selectedRows.push(element["Id"]);
        });
        this.ultility.selectedRows = this.selectedRows;
    }
    getSelectedRowsData() {
        console.log(this.initialData.instance.getSelectedRowsData())
        this.selectedRowsData = this.initialData.instance.getSelectedRowsData();
    }

    getdataRow(e: any) {
        this._historyUploadsServiceProxy.getList(e.data.id).subscribe(res => {
            this.history_Upload = res;
        });

    }

    // xem chi tiet file dinh kem
    showDetail(e: any) {
        this.rootUrl = AppConsts.fileServerUrl ;
        this.link = this.rootUrl + "/" + e.row.data.file;
        window.open(this.link, '_blank');

    }

    // gắn sao văn bản
    instaff(event: any) {
        let data: CreateOrEditIdoc_starDto = new CreateOrEditIdoc_starDto();
        data.userId = this._appSessionService.userId;
        data.documentId = event.data.Id;
        if (event.data.star == false) {
            this._idocStarServiceProxy.create_Star(data).pipe(finalize(() => { this.saving = true; }))
                .subscribe(() => {
                    // this.message.success('Gắn sao thành công');
                });
            event.data.star = true;
        }
        else {
            this._idocStarServiceProxy.starDelete(event.data.Id, this.user_ID).subscribe(() => {
                // this.message.success('Bỏ sao thành công');
            });
            event.data.star = false;
        }
    }



    exportHTML(data: any) {
        $.ajax({
            url: this.printUrl + data.Id,
            method: 'POST',
            xhrFields: {
                responseType: 'blob'
            },
            success: function (data) {
                console.log(data);
                var a = document.createElement('a');
                var url = window.URL.createObjectURL(data);
                a.href = url;
                var current = new Date();
                var fullTimeStr = current.getHours().toString() + current.getMinutes() + current.getSeconds()
                    + current.getDate() + (current.getMonth() + 1) + current.getFullYear();
                a.download = 'MauPhieuTrinh_' + fullTimeStr + '.doc';
                document.body.append(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }
        });

    }

    onRowPrepared(e: any){
        e.rowElement.css({height: 72});
    }

    advanceFilterBtnClick(){
        this.hasAdvanceFilter = !this.hasAdvanceFilter;
        if(!this.hasAdvanceFilter){
            $('advanceFilterDiv').css("display", "none");
        }
        else {
            $('advanceFilterDiv').css("display", "initial");
        }

    }

    popup_chuyenBoSung = false;
    // sửa bổ sung
    editExtra(e: any){
        console.log(e);
        this.router.navigate(['/app/main/qlvb/incomming-document/edit/extra/' + e.Id])
    }

    edit(e: any){
        this.router.navigate(['/app/main/qlvb/vb-phong/edit/' + e]);
    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        },);
    }
    onContentReady(e){
        this.totalCount = e.component.totalCount();
    }
    numberCellValue(rowData){
      
        return rowData.Number;
    }
    numberDVCellValue(rowData){
        return rowData.IncommingNumberDV;
    }

    onExporting(e){
        debugger
        e.component.beginUpdate();
        e.component.columnOption('Deadline', 'visible', true);
        e.component.columnOption('ProcessingExport', 'visible', true);
        e.component.columnOption('DVTHExport', 'visible', true);
        
    }
    onExported(e){  
        e.component.columnOption('Deadline', 'visible', false);
        e.component.columnOption('ProcessingExport', 'visible', false);
        e.component.columnOption('DVTHExport', 'visible', false);
        e.component.endUpdate();  
    }
    fromDateVal: Date= new Date();
    toDateVal: Date= new Date();
    publisherValue: any;
    fromDateOptions: any;
    toDateOptions: any;
    documentSearchData: GetDocInputForSearchDto = new GetDocInputForSearchDto();
    initFromDateOptions(){
        const self = this;
        this.fromDateOptions = {
            format: 'dd/MM/yyyy',
            displayFormat: 'dd/MM/yyyy',
            showClearButton: true,
            value: self.fromDateVal
        }
    }

    initToDateOptions(){
        const self = this;
        this.toDateOptions = {
            format: 'dd/MM/yyyy',
            displayFormat: 'dd/MM/yyyy',
            showClearButton: true,
            value: self.toDateVal
        }
    }
    search() {
        this.documentSearchData.fromDate = moment(this.fromDateVal).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        this.documentSearchData.toDate = moment(this.toDateVal).set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
        this._documentAppService.getAllDocumentHaveDirectedToUnit(this.documentSearchData.fromDate, this.documentSearchData.toDate, this.appSession.organizationUnitId).subscribe(res => {
            console.log(res)
            this.initialData = res;
            this.totalCount = this.initialData.length;
        });
    }
}
