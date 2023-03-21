import { OrgLevelsServiceProxy, PublishOrgsServiceProxy, Comm_booksServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { Component, Injector, ViewEncapsulation, ViewChild, SecurityContext, Input, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Paginator } from 'primeng/components/paginator/paginator';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentServiceProxy, DynamicFieldsServiceProxy, HistoryUploadsServiceProxy, HandlingUser, DocumentHandlingDetailsServiceProxy, CreateOrEditIdoc_starDto, Idoc_starsServiceProxy, GetDocInputForSearchDto, DocumentTypesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { EventEmitter } from 'events';
import { HttpClient } from '@angular/common/http';
// import { TransferHandleModalComponent } from '../transfer-handle/transfer-handle-modal';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { DatePipe, formatDate, Location } from '@angular/common';
import $ from 'jquery';
import { DxFormComponent, DxDataGridComponent, DxButtonComponent, DxSwitchComponent, DxNumberBoxComponent, DxDateBoxComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DxiGroupComponent, DxoPopupComponent } from 'devextreme-angular/ui/nested';
import { AppSessionService } from '@shared/common/session/app-session.service';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
declare const exportHTML: any;

@Component({
    selector: 'search-document',
    templateUrl: './search-document.component.html',

    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe] ,
    animations: [appModuleAnimation()]

})
export class SearchDocumentComponent extends AppComponentBase {
    @ViewChild('documentForm', { static: true }) documentForm: DxFormComponent;
    @ViewChild('gridContainer', { static: true }) gridContainer: DxDataGridComponent;
    // @ViewChild('fromDate', { static: true}) fromDate: DxDateBoxComponent;
    // @ViewChild('toDate', { static: true}) toDate: DxDateBoxComponent;

    documentSearchData: GetDocInputForSearchDto = new GetDocInputForSearchDto();
    data_publisher = [];
    publisherValue: any;

    dataBook = [];

    initialData: any = {};
    history_Upload: any;
    popupVisible = false;
    link = '';
    saving = false;
    userID : any;
    fromDateVal: Date;
    toDateVal: Date;
    currentDate: Date;
    data_secretLevel = [];
    data_priority = [];
    documentTypeOptions = [];
    fromDateOptions: any;
    toDateOptions: any;
    summaryOptions: any;
    orgLevelOptions: any;
    data_publisher_Initial: any;
    numberOfRecords: number;
    totalCount:number;
    publishOrgDataSource: DataSource;
    constructor(
        injector: Injector,
        private router: Router,
        private _documentAppService: DocumentServiceProxy,
        private _dynamicFieldService: DynamicFieldsServiceProxy,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private ultility: UtilityService,
        private _appSessionService: AppSessionService,
        private _idocStarServiceProxy: Idoc_starsServiceProxy,
        private _documentTypeAppService: DocumentTypesServiceProxy,
        private _orgLevelAppService: OrgLevelsServiceProxy,
        private _publishOrgAppService: PublishOrgsServiceProxy,
        private _commBookAppService: Comm_booksServiceProxy
    ){
        super(injector);
        this.toDateVal = new Date();
        // this.fromDateVal = this.addDays(this.toDateVal, -7);
        this.fromDateVal = new Date('31/12/' + (new Date()).getFullYear());
        this.currentDate = new Date();

        this.documentSearchData.fromDate = moment('01-01-' + (new Date()).getFullYear());
        // this.documentSearchData.fromDate = moment('31-12-' + (new Date()).getFullYear());
        this.documentSearchData.toDate = moment();
        this.documentSearchData.fromDate = moment(this.documentSearchData.fromDate).set({hour: 0, minute: 0, second: 0, millisecond: 0});
        this.documentSearchData.toDate = moment(this.documentSearchData.toDate).set({hour: 23, minute: 59, second: 59, millisecond: 0});



        const self = this;

        debugger

        this.initialData = new CustomStore({
            key: "id",
            load: function (loadOptions: any) {

                self.documentSearchData.skip = loadOptions["skip"];
                self.documentSearchData.take = loadOptions["take"];

                return self._documentAppService.postListSearchDocumentLazyLoading(self.documentSearchData).toPromise().then((res) => {

                    self.totalCount = res.totalCount;
                    self.numberOfRecords = res.totalCount;
                    return {
                        data: res.data,
                        totalCount: res.totalCount,
                        summary: undefined,
                        groupCount: undefined
                    }

                });
            }
        });
    }

    ngOnInit(){
        this.initFromDateOptions();
        this.initToDateOptions();
        this.initSummaryOptions();
        this.getPublishOrg();
        this.initOrgLevelOptions();
        this.getCommBook();
        // this.search();
        this._documentTypeAppService.getAllDocumentType().subscribe(result => {
            this.documentTypeOptions = result;
            // console.log(result);
        });
        this._dynamicFieldService.getDynamicFieldByModuleId(22, 0).subscribe(result => {
            // this.data_publisher = result[0].dataSource;
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
        });
        this.documentSearchData.fromDate = moment('01-01-' + (new Date()).getFullYear()).set({hour: 0, minute: 0, second: 0, millisecond: 0});
        this.documentSearchData.toDate = moment().set({hour: 23, minute: 59, second: 59, millisecond: 0});
    }

    getCommBook(){
        console.log(this.appSession.organizationUnitId, this.appSession.selfOrganizationUnitId);
        this._commBookAppService.getAllCommBookInDepartment("1", this.appSession.selfOrganizationUnitId).subscribe(res => {
            this.dataBook = res;
        });
    }

    addDays(val, days: number){
        var date = new Date(val);
        date.setDate(date.getDate()+ days);
        return date;
    }

    search(){
        if(this.documentSearchData.fromDate != null) this.documentSearchData.fromDate = moment(this.documentSearchData.fromDate).set({hour: 0, minute: 0, second: 0, millisecond: 0});
        if(this.documentSearchData.toDate != null) this.documentSearchData.toDate = moment(this.documentSearchData.toDate).set({hour: 23, minute: 59, second: 59, millisecond: 0});
        this.gridContainer.instance.refresh();
        // this._documentAppService.postListSearchDocument(this.documentSearchData).subscribe(res => {
        //     this.gridContainer.dataSource = res;
        //     this.totalCount = res.length;
        //     this.numberOfRecords = res.length;
        //     this.gridContainer.instance.repaint();
        //     this.gridContainer.instance.refresh();
        // });
    }

    getPublishOrg(){
        this._publishOrgAppService.getAllPublishOrg().subscribe((res)=>{
            this.data_publisher_Initial = res; })
    }

    initOrgLevelOptions(){
        const that = this;
        that.orgLevelOptions = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                  const promise = new Promise((resolve, reject) => {
                    that._orgLevelAppService.getAllOrgLevel().subscribe(result => {
                        console.log(result);
                        resolve(result);
                    }, err => {
                        reject(err);
                    });

                  });
                  return promise;
                }

            },
            valueExpr: 'id',
            displayExpr: 'name',
            searchEnabled: true,
            searchExpr: ['name'],
            showClearButton: true,
            onValueChanged: function(e){
                that.data_publisher = that.data_publisher_Initial.filter(x => x.publishOrg.orgLevelId == that.documentSearchData.orgLevel);
                that.publishOrgDataSource = new DataSource({
                    store: new ArrayStore({
                        key: "id",
                        data: that.data_publisher
                    }),
                    paginate: true
    
                });
            }
        }
    }

    initFromDateOptions(){
        const self = this;
        this.fromDateOptions = {
            format: 'dd/MM/yyyy',
            displayFormat: 'dd/MM/yyyy',
            // dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ss',
            showClearButton: true
        }
    }

    initToDateOptions(){
        const self = this;
        this.toDateOptions = {
            format: 'dd/MM/yyyy',
            displayFormat: 'dd/MM/yyyy',
            // dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ss',
            showClearButton: true
        }
    }

    initSummaryOptions(){
        const self = this;
        this.summaryOptions = {
            acceptCustomValue: true,
            searchEnabled: false,
            noDataText: ""
        }
    }

    viewProcess(event: any) {
        this.router.navigate(['/app/main/qlvb/quytrinhxuly/' + event.data.id]);
    }

    // xem lich su upload
    showListHistory(event: any) {
        this._historyUploadsServiceProxy.getList(event.data.id).subscribe(res => {
            this.history_Upload = res;
        });
        this.popupVisible = true;
    }

    // xem file dinh kem
    showDetail(e: any) {
        this.link = AppConsts.remoteServiceBaseUrl + "/" + e.row.data.file;
        window.open(this.link, '_blank');

    }

    // xem chi tiet VB
    viewRow(event: any) {
        this.router.navigate(['/app/main/qlvb/incomming-document/view/' + event.data.id]);
    }

    // gắn sao VB
    instaff(event: any) {
        console.log(event.data.id);
        let data: CreateOrEditIdoc_starDto = new CreateOrEditIdoc_starDto();
        data.userId = this._appSessionService.userId;
        data.documentId = event.data.id;
        if (event.data.star == false) {
            this._idocStarServiceProxy.create_Star(data).pipe(finalize(() => { this.saving = true; }))
                .subscribe(() => {
                    // this.message.success('Gắn sao thành công');
                });
            event.data.star = true;
        }
        else {
            this._idocStarServiceProxy.starDelete(event.data.id, this._appSessionService.userId).subscribe(() => {
                // this.message.success('Bỏ sao thành công');
            });
            event.data.star = false;
        }
    }

    // 02092020 - trieuvnh - In tra cuu VB
    print(){
        const self = this;
        var i = 0;
        this.documentSearchData.fromDate = moment(this.documentSearchData.fromDate).set({hour: 0, minute: 0, second: 0, millisecond: 0});
        this.documentSearchData.toDate = moment(this.documentSearchData.toDate).set({hour: 23, minute: 59, second: 59, millisecond: 0});

        var fromDate = this.documentSearchData.fromDate.format('YYYY-MM-DD');
        var toDate = this.documentSearchData.toDate.format('YYYY-MM-DD');
        var orgLevel = this.documentSearchData.orgLevel;
        var publisher = this.documentSearchData.publisher;
        var number = this.documentSearchData.number;
        var bookId = this.documentSearchData.bookId;
        var incommingNumber = this.documentSearchData.incommingNumber;
        var documentTypeId = this.documentSearchData.documentTypeId;
        var secretLevel = this.documentSearchData.secretLevel;
        var priority = this.documentSearchData.priority;
        var summary = this.documentSearchData.summary;

        $.ajax({
            url: AppConsts.remoteServiceBaseUrl + '/ExportFile/GetExcelFile_SearchDoc',
            method: 'POST',
            xhrFields: {
                responseType: 'blob'
            },
            data: {
                FromDate: fromDate,
                ToDate: toDate,
                OrgLevel: orgLevel, // cấp gửi
                Publisher: publisher, // nơi gửi
                Number: number, // số ký hiệu
                BookId: bookId, // số VB
                IncommingNumber: incommingNumber, // số đến
                DocumentTypeId: documentTypeId, // loại VB
                SecretLevel: secretLevel, // độ mật
                Priority: priority, // độ khẩn
                Summary: summary, // trich yeu
                UserId: self.appSession.userId
                // UserId: '63'

            },
            success: function (data) {
                debugger
                var a = document.createElement('a');
                var url = window.URL.createObjectURL(data);
                a.href = url;
                var current = new Date();
                var fullTimeStr = current.getHours().toString() + current.getMinutes() + current.getSeconds()
                    + '_' + current.getDate() + (current.getMonth() + 1) + current.getFullYear();
                a.download = 'TraCuuVB'+ '_' + fullTimeStr + '.xls';

                document.body.append(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }
        })
    }
    // trieuvnh
    //02102020 - viettq - chinh sua show so ket qua tim kiem
    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        },);
    }
    blockBodyScrollSelectBox(e) {
        //debugger
        const that = this;
        $(".dx-list-item-content").on("mouseenter", function(e) {
            // disable scrolling
            $('body').bind('mousewheel touchmove', that.lockScroll);
        });
        $(".dx-list-item-content").on("mouseleave", function(e) {
            // enable scrolling
            $('body').unbind('mousewheel touchmove', that.lockScroll);
        }); 
    }
    lockScroll(e) {
        e.preventDefault();
    }
}
