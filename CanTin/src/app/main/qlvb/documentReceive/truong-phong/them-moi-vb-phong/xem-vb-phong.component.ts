import { Component, Injector, ViewEncapsulation, ViewChild, SecurityContext, Input, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, ListResultDtoOfOrganizationUnitDto,PrioritiesServiceProxy, PriorityDto, CreateOrEditDocumentTypeDto, TextBookDto, TextBooksServiceProxy, SessionServiceProxy, DynamicFieldsServiceProxy, DynamicValueDto, HistoryUploadsServiceProxy, DocumentHandlingDetailDto, HandlingUser, DocumentHandlingDetailsServiceProxy, DocumentHandlingsServiceProxy, OrganizationUnitServiceProxy, Comm_booksServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { EventEmitter } from 'events';
import { HttpClient } from '@angular/common/http';
// import { TransferHandleModalComponent } from '../transfer-handle/transfer-handle-modal';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';
import $ from 'jquery';
import { DxFormComponent, DxDataGridComponent, DxButtonComponent, DxSwitchComponent, DxNumberBoxComponent, DxDateBoxComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { DomSanitizer } from '@angular/platform-browser';
// import { ReportDocumentModalComponent } from '../../report_document/report-document-modal';
import { DxiGroupComponent, DxoPopupComponent } from 'devextreme-angular/ui/nested';
import { Location } from '@angular/common';
// import { ReportDocumentModalComponent } from '../../report_document/report-dox`cument-modal';
//import * as jsPDF from 'jspdf';
declare const exportHTML: any;

@Component({
    selector: 'xemVBDenPhong',
    templateUrl: './xem-vb-phong.component.html',
    styleUrls: ['./them-moi-vb-phong.component.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
    animations: [appModuleAnimation()]

})
export class XemVBDenPhongComponent extends AppComponentBase implements OnInit{

    documentData: DocumentsDto = new DocumentsDto();
    documentId: number;
    documentTypeOptions: DocumentTypeDto[] = [];
    priorityOptions: PriorityDto[] = [];
    nextNumber: string;
    validationGroup: any;
    publisherPopupVisible_report = false;
    uploadUrl: string;
    handlers:DocumentsDto[] = [];
    myDate = new Date();
    currentTime :any ;
    link = '';
    currentId: any;
    incommingDate :any;
    moduleId: any;
    dynamicFields: any;
    dynamicValue: any;
    numberOfDaysByDocType = 0;
    listReceive: HandlingUser[] = [];
    dataSource = [];
    //lưu index của đơn vị chủ trì
    previousMainHandlingId: number;
    old_DVXL = [];
    dataBook = [
        { id: 1, name: 'Sổ thường'  },
        { id: 2, name: 'Sổ mật' },
    ];
     // lĩnh vực
    // data_range = [{key: 'An ninh', value: 1}, {key: 'Kinh tế', value: 2}, {key: 'Xã hội', value: 3}];
    data_range = [];
    data_position = [];
    selectedRows = [];
    data_publisher = [];

    data_commBook = [];
    data_department = [];
    data_secretLevel = [];
    data_priority = [];
    leaderDepartmentName: any ;
    captain_department = [];
    director_list = [];
    historyUpload: any ;
    rootUrl : string ;
    deadLineDate: Date;
    value: any[] = [];
    num: any[] = [];
    active = false;
    DWObject: WebTwain;
    currentDate = new Date();
    directorName: any;
    nameArr: any[]= [];
    dataDisplay = [];
    tepDinhKemSave = '';
    switchValue = false;
    data_DVXL:any
    date: Date;
    textBookOptions: TextBookDto[] = [];
    userId: number;
    signal = "";
    publisherVal: any;
    chkAutomaticValue = true;
    processingDate: Date;
    printRptVisible = false;
    bookVal: any;
    secretVal: any;
    priorityVal: any;
    rangeVal: any;
    positionVal: any;
    printUrl = '';
    // isVisible = true;
    currentUser:any;
    loaiDV = [
        { type: 1, name: 'Danh sách Phó phòng', dataSource: [
            {
                fullName: 'Nguyễn Văn A',
                id: 1,
                mainHandling: false,
                coHandling: false
            },
            {
                fullName: 'Nguyễn Văn B',
                id: 2,
                mainHandling: false,
                coHandling: false
            },
            {
                fullName: 'Nguyễn Văn C',
                id: 3,
                mainHandling: false,
                coHandling: false
            }
        ]},
        { type: 2, name: 'Danh sách đội trong phòng', dataSource: [
            {
                fullName: 'Đội 1',
                id: 1,
                mainHandling: false,
                coHandling: false
            },
            {
                fullName: 'Đội 2',
                id: 2,
                mainHandling: false,
                coHandling: false
            },
            {
                fullName: 'Đội 3',
                id: 3,
                mainHandling: false,
                coHandling: false
            }
        ]}
    ];

    constructor(
        injector: Injector,
        private router: Router,
        protected activeRoute: ActivatedRoute,
        private datePipe: DatePipe,
        private ultility: UtilityService,
        private _activatedRoute: ActivatedRoute,
        private _documentTypeAppService: DocumentTypesServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _documentHandlingAppService :DocumentHandlingsServiceProxy,
        private _dynamicFieldService: DynamicFieldsServiceProxy,
        private _location: Location,
        private _commBookService: Comm_booksServiceProxy
    ) {
        super(injector);
        this.userId = this.appSession.userId;
        this.uploadUrl = AppConsts.fileServerUrl + '/fileupload/Upload_file?userId=' + this.userId ;
        this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetWordFile?documentId=';
        // this._commBookService.getAllComm_BookByOrg(this.appSession.organizationUnitId).subscribe(result => {
        //     this.dataBook = result;
        // });
        this._documentTypeAppService.getAllDocumentType().subscribe(result => {
            this.signal = result[0].signal;
            this.documentTypeOptions = result;
        });
        this._documentHandlingAppService.getLeaderList_PGD().subscribe(res =>{
            this.director_list = res;
            for(var i = 0, len = this.director_list.length; i < len; i++){
                this.director_list[i]["nameWithPosition"] = this.director_list[i]["position"] + " - " + this.director_list[i]["fullName"];
            }
        });
        this._documentHandlingAppService.getLeaderList_PB().subscribe(res => {
            this.captain_department = res;
            for(var i = 0, len = this.captain_department.length; i < len; i++){
                this.captain_department[i]["nameWithPosition"] = this.captain_department[i]["position"] + " - " + this.captain_department[i]["fullName"];
            }
        });
        this.link = this.router.url;
        this.processingDate = new Date();
        this._documentAppService.getListPhongBanCATP().subscribe(res =>{
            this.data_department = res;
            this.data_department.forEach(x => {
                x["mainHandling"] = false;
                x["coHandling"] = false;
            })
        });
    }


    back(){
        this._location.back();
    }

    transformDate(date) {
        return this.datePipe.transform(date, 'dd/MM/yyyy'); //whatever format you need.
    }

    ngOnInit(){
        const Id = this._activatedRoute.snapshot.paramMap.get('id');
        if(Id != null){
            this.documentId = Number.parseInt(Id);
            this._documentAppService.getDocumentEditByDocumentId(this.documentId).subscribe((result) => {

                this._documentHandlingAppService.get_DVXL_ForDocument(result.id, result.unitId).subscribe((res) => {
                    this.old_DVXL = res;
                    this.old_DVXL.forEach((ele) => {
                        let index = this.data_department.findIndex(x => x.id == ele.OrganizationId);
                        if(ele.TypeHandling == 1){
                            this.data_department[index]["mainHandling"] = true;
                            this.data_department[index]["coHandling"] = false;
                        }
                        else if(ele.TypeHandling == 0) {
                            this.data_department[index]["mainHandling"] = false;
                            this.data_department[index]["coHandling"] = true;
                        }
                        else {
                            this.data_department[index]["mainHandling"] = false;
                            this.data_department[index]["coHandling"] = false;
                        }
                    });
                });
                console.log(result);
                this.documentData = result;
                this.signal = result.number;
                this.numberOfDaysByDocType = result.numberOfDays;
                this.printRptVisible = true;
                if(result.attachment){
                    this.num = result.attachment.split(';');
                    this.num.forEach((ele)=>{
                        this.selectedRows.push({tepDinhKem: ele});
                    });
                }

                this.publisherVal = result.publisher.toString();
                this.bookVal = result.book;
                this.nextNumber = result.incommingNumber;
                console.log(result);
                this.secretVal = result.secretLevel.toString();
                this.priorityVal = result.priority.toString();
                this.rangeVal = result.range ? result.range.toString() : null;
                console.log(result.deadline);
                this.positionVal = result.position ? result.position.toString() : null;

                if(result.documentTypeId != null || result.secretLevel != null || result.priority != null || result.range != null || result.signer != null || result.position != null){
                    this.switchValue = true;
                }
                this.tepDinhKemSave = this.selectedRows.map(x => x.tepDinhKem.toString()).join(';')
            });
            this._dynamicFieldService.getDynamicFieldByModuleId(22, this.documentId).subscribe(result => {
                this.data_publisher = result[0].dataSource;
                this.data_secretLevel = result[1].dataSource;
                this.data_priority = result[2].dataSource;
                this.data_range = result[3].dataSource;
                this.data_position = result[4].dataSource;
            });

            this.currentUser = abp.session.userId;
            console.log(this.currentUser)
     
            
            this._documentAppService.updateSeenStatus(this.documentId,this.currentUser).subscribe()
        }
    }

    setFullNameFile(e: any){
        if(e.value.length == 0) return;

        this.dataDisplay.length = 0;

        let files = [];

        let formData: any = new FormData();
        e.value.forEach(el => formData.append("files", el));
        $.ajax({
            url: this.uploadUrl,
            type: "POST",
            contentType: false,
            processData: false,
            async: false,
            data: formData,
            success: (res) => {
                files = res;
            },
            error: (err) => {
                this.notify.error("Upload file thất bại");
            }
        });

        files.forEach(f => {
            this.dataDisplay.push({ "tepDinhKem": f });
        });
        this.value = [];
        this.selectedRows = this.selectedRows.concat(this.dataDisplay);
        this.tepDinhKemSave = this.selectedRows.map(x => x.tepDinhKem.toString()).join(';')
    }

    urlExists(url) {
        return fetch(url, {mode: "no-cors"})
          .then(res => true)
          .catch(err => false)
      }
    showDetail(e:any)
    {
        this.rootUrl = AppConsts.fileServerUrl ;
        this.link = this.rootUrl + "/" + e.row.data.tepDinhKem;
        console.log(e.row.data.tepDinhKem.substring(e.row.data.tepDinhKem.indexOf("_")+1,e.row.data.tepDinhKem.length))
        this.urlExists(this.link).then(result => {
            if(result){
                window.open(this.link, '_blank');
            }else{
                var lenghtLink = e.row.data.tepDinhKem.length;
                const withoutLastChunk = e.row.data.tepDinhKem.substring(e.row.data.tepDinhKem.indexOf("_")+1,lenghtLink);
                this.link = this.rootUrl + "/" + withoutLastChunk;
                window.open(this.link, '_blank');
            }
        })
        
    }

    arr_diff (a1, a2) {

        var a = [], diff = [];

        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }

        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }

        for (var k in a) {
            diff.push(k);
        }

        return diff;
    }

    onValueChanged(e: any){
        // this.receiverSelected = this.tagBox.value;
        if(e.value.length < e.previousValue.length){
            this.arr_diff(e.value, e.previousValue).forEach(el => {
                let data = this.listReceive.find(x => x.userId == el);
                this.dataSource.findIndex(x => x.userId == el);
                let index = this.dataSource.findIndex(x => x.userId == el);
                this.dataSource[index]["mainHandling"] = false;
                this.dataSource[index]["coHandling"] = false;
                this.listReceive.splice(this.listReceive.findIndex(element => element.userId == el), 1);
                // this.listVal.splice(this.listVal.findIndex(x => x == el), 1);
            });
        }
    }

    exportHTML() {
        $.ajax({
            url: this.printUrl + this.documentId,
            method: 'POST',
            xhrFields: {
                responseType: 'blob'
            },
            success: function (data) {
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
        })


      }


    onCheckBoxChanged(e, cell)
    {
        let index = this.data_department.findIndex(x => x.id == cell.data.id);
        //kiểm tra cột vừa thao tác là main hay co
        switch(cell.column.dataField){
            case 'mainHandling':
                //kiểm tra có đvxl chính chưa, nếu có rồi thì bỏ chọn cái trước
                if(this.previousMainHandlingId >= 0){
                    let temp = this.data_department.findIndex(x => x.id == this.previousMainHandlingId);
                    this.data_department[temp]["mainHandling"] = false;
                }

                if(this.data_department[index]["coHandling"] == true){
                    this.data_department[index]["coHandling"] = false;
                }

                this.data_department[index]["mainHandling"] = e.value;

                //giữ id của đơn vị đang nắm chủ trì
                this.previousMainHandlingId = cell.data.id;
                break;
            case 'coHandling':
                if(this.data_department[index]["mainHandling"] == true){
                    this.data_department[index]["mainHandling"] = false;
                }

                this.data_department[index]["coHandling"] = e.value;
        }
    }



}
