import { Component, Injector, ViewEncapsulation, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import {DocumentForViewDto, DocumentsDto, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, PriorityDto, TextBookDto, DynamicFieldsServiceProxy, DocumentHandlingDetailDto, HandlingUser, DocumentHandlingDetailsServiceProxy, DocumentHandlingsServiceProxy, Comm_booksServiceProxy, ListDVXL, GetUserInRoleDto, OrgLevelsServiceProxy, PublishOrgsServiceProxy, ODocsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';
import { DxFormComponent, DxSwitchComponent, DxDateBoxComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { DxiGroupComponent, DxoPopupComponent } from 'devextreme-angular/ui/nested';
import { Location } from '@angular/common';
import $ from 'jquery';
declare const exportHTML: any;

@Component({ 
    selector: 'xemVBDenPhong',
    templateUrl: './xem-vb-doi-phoi-hop.component.html',
    // styleUrls: ['./create-Document.component.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
    animations: [appModuleAnimation()]

})
export class ViewDocumentDenDoiPhoiHopComponent extends AppComponentBase implements OnInit{

    @ViewChild('documentForm', {static: true}) documentForm: DxFormComponent;
    @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;
    @ViewChild('publisherForm', { static: false }) publisherForm: DxFormComponent;
    @ViewChild('switchMoreInfo', { static: true} ) switchMoreInfo: DxSwitchComponent;
    @ViewChild('anotherInfo', { static: false}) anotherInfo: DxiGroupComponent;
    @ViewChild('content',{ static: true })  content: ElementRef;
    @ViewChild('hanXyLy', { static: true}) hanXyLy: DxDateBoxComponent;
    @ViewChild('incommingDateField', { static: true}) incommingDateField: DxDateBoxComponent;
    @ViewChild('popup', {static: false}) popup: DxoPopupComponent;
    @ViewChild('publisherSelect', { static: true }) publisherSelect: DxSelectBoxComponent;
    documentData: DocumentForViewDto = new DocumentForViewDto();
    pageHeader = "Thêm mới văn bản đến";
    editDocumentId = 0;
    publisherData: any;
    publisherPopupVisible = false;
    documentTypeOptions: DocumentTypeDto[] = [];
    popupVisible = false;
    priorityOptions: PriorityDto[] = [];
    saving = false;
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
    //lưu id của đơn vị chủ trì
    previousMainHandlingId: number;
    old_DVXL = [];
    //dataBook = [];
    data_range = [];
    data_position = [];
    selectedRows = [];
    data_publisher = [];
    data_commBook = [];
    _i:any;
    data_department = [];
    _id: number;
    data_secretLevel = [];
    data_priority = [];
    leaderDepartmentName: any ;
    captain_department = [];
    director_list = [];
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
    documentId: number;
    data_DVXL:any
    date: Date;
    userId: number;
    signal = "";
    publisherVal: any;
    processingDate: Date;
    bookVal: any;
    isReadOnly = false;
    secretVal: any;
    priorityVal: any;
    rangeVal: any;
    positionVal: any;
    printUrl = '';
    listDVXL_selected: ListDVXL[] = [];
    editDocumentDto: DocumentsDto = new DocumentsDto;
    isDirty = false; // có thay đổi ĐVXL
    incommingDateVal = new Date();
    dataBook = [];
    orgLevel: any = [];
    orgLevelVal: any;
    data_publisher_Initial = [];
    phoPhong: GetUserInRoleDto[];
    truongPhong: GetUserInRoleDto[];
    truongPhongVal: number;
    phoPhongVal: number;
    truongPhongObj: any;
    phoPhongObj: any;
    tpComment = '';
    ppComment = '';

    doiTruong: GetUserInRoleDto[];
    doiTruongVal: number;
    doiTruongObj: any;
    dtComment = '';

    doiPho: GetUserInRoleDto[];
    doiPhoVal: number;
    doiPhoObj: any;
    dpComment = '';
    incommingNumberDisabled = true;
    chkAutomaticValue = true;
    incommDateOptions: any;
    code = ''; //nếu code = catp thì sẽ ẩn 1 số field và k load dữ liệu
    disabled = true;
    chiDaoGD = '';
    tpDate: Date;
    ppDate: Date;
    dtDate: Date;
    dpDate: Date;
    catp = false;
    tpDisabled = false;
    cbcs = [];
    currentUser:any;
    constructor(
        injector: Injector,
        private router: Router,
        protected _activeRoute: ActivatedRoute,
        private datePipe: DatePipe,
        private ultility: UtilityService,
        private _activatedRoute: ActivatedRoute,
        private _documentTypeAppService: DocumentTypesServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _documentHandlingAppService :DocumentHandlingsServiceProxy,
        private _dynamicFieldService: DynamicFieldsServiceProxy,
        private _documentHandlingDetailAppService: DocumentHandlingDetailsServiceProxy,
        private _location: Location,
        private _orgLevelAppService: OrgLevelsServiceProxy,
        private _publishOrgAppService: PublishOrgsServiceProxy,
        private _oDocsServiceProxy: ODocsServiceProxy,
        private _commBookService: Comm_booksServiceProxy
    ) {
        super(injector);
        this.userId = this.appSession.userId;
        this.uploadUrl = AppConsts.fileServerUrl  + '/fileupload/Upload_file?userId=' + this.userId ;
        this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetWordFile?documentId=';
        this._documentTypeAppService.getAllDocumentType().subscribe(result => {
            this.signal = result[0].signal;
            this.documentTypeOptions = result;
        });
        this._commBookService.getAllComm_BookByOrg(this.appSession.organizationUnitId).subscribe(res => {
            this.dataBook = res;
        });
        this.link = this.router.url;
        this.processingDate = new Date();
    }

    getUserInOrg(){
        this._oDocsServiceProxy.getUserInRoleByOrg(this.appSession.organizationUnitId, '').subscribe((res)=>{
            this.truongPhong = res.filter(x => x.roleCode == 'TP');
            this.phoPhong = res.filter(x => x.roleCode == 'PP');
            this.doiTruong = res.filter(x => x.roleCode == 'DT');
            this.doiPho = res.filter(x => x.roleCode == 'PDT');
            // this.cbcs = res.filter(x => x.roleCode == 'CB');
            this.data_department = res.filter(x => x.roleCode == 'CB' && x.organizationUnitId == this.appSession.selfOrganizationUnitId);
            this.data_department.forEach(x => {
                x['mainHandling'] = false;
                x['coHandling'] = false;
            });
        });
    }

    back(){
        this._location.back();
    }

    TruongPhongPhoPhong:any;
    DocumentHandlingDetailId:any;
    ngOnInit(){
        this.getUserInOrg();
        const Id = this._activeRoute.snapshot.paramMap.get('id');
        const that = this;
        this.DocumentHandlingDetailId = this._activeRoute.snapshot.paramMap.get('iddochandlingdetail');
        if(Id != null){
            this.documentId = Number.parseInt(Id);
            this._documentAppService.getDocumentForViewPhoiHopDoi(this.DocumentHandlingDetailId,this.documentId).subscribe((result) => {
              this.documentData=result
                this.getOrgLevel();
                this.getPublishOrg();
                this._documentHandlingAppService.get_DVXL_ForDocument_Doi_Phoi_Hop(this.DocumentHandlingDetailId).subscribe((res) => {
                    this.old_DVXL = res;
                    this.TruongPhongPhoPhong = res.filter(x => x['ParentHandlingId'] != this.DocumentHandlingDetailId)[0];
                    this.phoPhongVal = this.TruongPhongPhoPhong['PTPUserId'];   
                    this.ppComment = this.TruongPhongPhoPhong['PTPProcessingRecommended'];
                    this.ppDate = new Date(this.TruongPhongPhoPhong['PTPProcessingDate']);
                    this.truongPhongVal = this.TruongPhongPhoPhong['TPUserId'];
                    this.tpComment = this.TruongPhongPhoPhong['TPProcessingRecommended'];
                    this.tpDate = new Date(this.TruongPhongPhoPhong['TPProcessingDate']);
                    this.dtComment=this.TruongPhongPhoPhong['dtComment'];
                    this.dtDate=this.TruongPhongPhoPhong['dtDate'];
                    this.doiTruongVal=this.TruongPhongPhoPhong['dtUser'];
                    this.dpDate=this.TruongPhongPhoPhong['dpDate'];
                    this.dpComment=this.TruongPhongPhoPhong['dpComment'];
                    this.doiPhoVal=this.TruongPhongPhoPhong['dpUser'];
                    that.cbcs = res.filter(x => x['ParentHandlingId'] == this.DocumentHandlingDetailId && x['Id']!=0);
                    that.cbcs.forEach(x => {
                        let temp = that.data_department.findIndex(y => y.userId == x['Id']);
                        that.data_department[temp]['mainHandling'] = x['TypeHandling'];
                        that.data_department[temp]['coHandling'] = !x['TypeHandling'];
                    });
                    that.data_department.sort(function(a, b) {
                        if(a['mainHandling'] == a['mainHandling'] && a['mainHandling'] == true){
                            return b['coHandling'] - a['coHandling'];
                        }
                        return b['mainHandling'] > a['mainHandling'] ? 1: -1;
                    });
                });
            //     this.signal = result.number;
                if(result.attachment){
                    this.num = result.attachment.split(';');
                    this.num.forEach((ele)=>{
                        this.selectedRows.push({tepDinhKem: ele});
                    });
                }

                this.bookVal = result.book;
                this.secretVal = result.secretLevel != null ? result.secretLevel.toString(): null;
                this.rangeVal = result.range != null ? result.range.toString() : null;
                this.positionVal = result.position != null ? result.position.toString() : null;
                this.priorityVal = result.priority != null ? result.priority.toString(): null;

                if(result.documentTypeId != null || result.secretLevel != null || result.priority != null || result.range != null || result.signer != null || result.position != null){
                    this.switchValue = true;
                }
            //     this.tepDinhKemSave = this.selectedRows.map(x => x.tepDinhKem.toString()).join(';')
            // });
            this._dynamicFieldService.getDynamicFieldByModuleId(22, this.documentId).subscribe(result => {
                this.data_secretLevel = result[1].dataSource;
                this.data_priority = result[2].dataSource;
                this.data_range = result[3].dataSource;
                this.data_position = result[4].dataSource;
            });
            });
        }
    }

    //get cấp gửi
    getOrgLevel(){
        this._orgLevelAppService.getAllOrgLevel().subscribe((res)=>{
            this.orgLevel = (this.documentData.unitId == 0) ? res : res.filter(x => x.type == null);
        });
    }

    orgLevelChange(){
        if(this.data_publisher_Initial.length > 0){
            this.data_publisher = this.data_publisher_Initial.filter(x => x.publishOrg.orgLevelId == this.documentData.orgLevelId);
        }
    }

    //get nơi gửi
    getPublishOrg(){
        this._publishOrgAppService.getAllPublishOrg().subscribe((res)=>{
            this.data_publisher_Initial = res;
            this.orgLevelChange();
        });
    }

    newSelectedDVXL: ListDVXL[] = [];

   

   

    switchMoreInfoValueChanged(e: any){
        if(e.value == true){
            this.switchValue = true;
            this.anotherInfo.instance.visible = true;
        }
        else{
            this.switchValue = false;
            this.anotherInfo.instance.visible = false;
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
    json = '';
   
    
    

   

    
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
                this.dataSource.findIndex(x => x.userId == el);
                let index = this.dataSource.findIndex(x => x.userId == el);
                this.dataSource[index]["mainHandling"] = false;
                this.dataSource[index]["coHandling"] = false;
                this.listReceive.splice(this.listReceive.findIndex(element => element.userId == el), 1);
                // this.listVal.splice(this.listVal.findIndex(x => x == el), 1);
            });
        }
    }

    showPublisherPopup(){
        this.publisherPopupVisible = true;
    }

   

    clearState(items, currentId) {
        for (var i = 0; i < items.length; i++) {
            if (currentId == items[i].id) {
                items[i].mainHandling = true;
                continue;
            }
            items[i].mainHandling = false;
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
        });

      }




    endDateVal: Date;

    addDays(val,days: number){
        var date = new Date(val);
        date.setDate(date.getDate()+ days);
        return date;
    }

    onCheckBoxChanged(e, cell)
    {
        let index = this.data_department.findIndex(x => x.id == cell.data.id);
        this.isDirty = true;
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

    initIncommDateOptions(){
        const that = this;
        this.incommDateOptions = {
            showClearButton: true,
            displayFormat: 'dd/MM/yyyy',
            format: 'dd/MM/yyyy',
            value: that.currentDate,
            min: new Date(2000, 0, 1),
            max: that.currentDate,
            onValueChanged: function(e){


            }
        };
    }

    blockBodyScrollGrid(e) {
        //debugger
        const that = this;
        let id = e.element[0].id;
        $("#" + id).on("mouseenter", function(e) {
            // disable scrolling
            $('body').bind('mousewheel touchmove', that.lockScroll);
        });
        $("#" + id).on("mouseleave", function(e) {
            // enable scrolling
            $('body').unbind('mousewheel touchmove', that.lockScroll);
        });
    }

    // lock window scrolling
    lockScroll(e) {
        e.preventDefault();
    }
}
