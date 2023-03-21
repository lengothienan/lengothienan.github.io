import { Component, Injector, ViewEncapsulation, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, PriorityDto, TextBookDto, DynamicFieldsServiceProxy, DocumentHandlingDetailDto, HandlingUser, DocumentHandlingDetailsServiceProxy, DocumentHandlingsServiceProxy, Comm_booksServiceProxy, ListDVXL, GetUserInRoleDto, OrgLevelsServiceProxy, PublishOrgsServiceProxy, ODocsServiceProxy, UserExtentionServiceProxy, UserExtenTionDto } from '@shared/service-proxies/service-proxies';
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
import { isNullOrUndefined } from 'util';
declare const exportHTML: any;

@Component({
    selector: 'suaVBDenPhongComponent',
    templateUrl: './sua-vb-phong.component.html',
    styleUrls: ['./create-Document.component.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe] ,
    animations: [appModuleAnimation()]

})
export class EditDocumentDenPhongComponent extends AppComponentBase implements OnInit{

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
    documentData: DocumentsDto = new DocumentsDto();
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
    uploadUrl2: string;
    uploadedFiles: any[] = [];
    link = '';
    parameters = 1;
    error = true;
    endDate:any;
    currentId: any;
    incommingDate :any;
    isSetData = false;
    dynamicData: any;
    objectID: any;
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
    textBookOptions: TextBookDto[] = [];
    userId: number;
    signal = "";
    publisherVal: any;
    processingDate: Date;
    bookVal: any;
    isReadOnly = false;
    documentTypeIdVal: any;
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
    orgLevel: any;
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
    incommingNumberDisabled = true;
    chkAutomaticValue = true;
    incommDateOptions: any;
    code = ''; //nếu code = catp thì sẽ ẩn 1 số field và k load dữ liệu
    disabled = false;
    chiDaoGD = '';
    tpDate: Date;
    ppDate: Date;
    linkedDocumentOptions: any;
    linkedDocumentData: any = [];
    isDuplex:any = false;
    scanTypes = [
        {value: 2, display: "Scan 2 mặt (bằng tay)"},
        {value: 3, display: "Scan 2 mặt"}
    ];
    scanType: any = 1;
    currentUser:any;
    constructor(
        injector: Injector,
        private router: Router,
        protected _activeRoute: ActivatedRoute,
        private datePipe: DatePipe,
        private _documentTypeAppService: DocumentTypesServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _documentHandlingAppService :DocumentHandlingsServiceProxy,
        private _dynamicFieldService: DynamicFieldsServiceProxy,
        private _documentHandlingDetailAppService: DocumentHandlingDetailsServiceProxy,
        private _location: Location,
        private _orgLevelAppService: OrgLevelsServiceProxy,
        private _publishOrgAppService: PublishOrgsServiceProxy,
        private _oDocsServiceProxy: ODocsServiceProxy,
        private _commBookService: Comm_booksServiceProxy,
        private _userExtentionServiceProxy: UserExtentionServiceProxy
    ) {
        super(injector);
        this.userId = this.appSession.userId;
        this.uploadUrl = AppConsts.fileServerUrl  + '/FileUpload/Upload_file?userId=' + this.userId ;
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
            this.truongPhong = res.filter(x => x.roleCode == 'TP' || x.roleCode == 'TCAH' || x.roleCode == 'TCAQ');
            this.phoPhong = res.filter(x => x.roleCode == 'PTP' || x.roleCode == 'PP' || x.roleCode == 'PCAH' || x.roleCode == 'PCAQ');
        });
    }

    initLinkedDocumentOptions(){

        const self = this;
        this.linkedDocumentOptions = {
            showClearButton: true,
            displayExpr: 'Number',
            valueExpr: 'Id',
            searchEnabled: true,
            searchExpr: ['Number'],
            // readOnly: true,
            dataSource: self.linkedDocumentData
            
            // {
            //     loadMode: 'raw',
            //     load: function () {
            //       const promise = new Promise((resolve, reject) => {
            //         // lấy danh sách văn bản liên kết

            //         self._documentAppService.getLinkedIncomingDocument(self.documentId).subscribe(res => {
            //             resolve(res.data);
            //         }, err => {
            //             reject(err);
            //         });
                    

            //         // self._documentAppService.getListODocForLinkedDocument(self.appSession.organizationUnitId).subscribe(result => {
            //         //     resolve(result);
            //         // }, err => {
            //         //     reject(err);
            //         // });
            //       });
            //       return promise;
            //     }
            // }
        }
    }

    back(){
        this._location.back();
    }

    transformDate(date) {
        return this.datePipe.transform(date, 'dd/MM/yyyy'); //whatever format you need.
    }

    resetForm(){
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/app/main/qlvb/create-new-incomming-document']);
    }

    addItem(newItem :string): void {
        this.documentData.attachment += newItem ;
    }

    ngOnInit(){
        const that = this;
        this.getOrgLevel();
        this.getPublishOrg();
        this.getTeamInOrg();
        this.getUserInOrg();
        this.initLinkedDocumentOptions();
        const Id = this._activeRoute.snapshot.paramMap.get('id');
        this.code = this._activeRoute.snapshot.paramMap.get('code');
        if(Id != null){
            this.documentId = Number.parseInt(Id);
            this._documentAppService.getDocumentEditByDocumentId(this.documentId).subscribe((result) => {
                debugger
                this.documentData = result;
                if(this.code == 'catp'){
                    this.disabled = true;
                }
                else{
                    this._documentHandlingAppService.get_DVXL_ForDocument_Dept(result.id).subscribe((res) => {
                        this.old_DVXL = res;

                        let doi = res.filter(x => x['OrganizationId'] !== 0);
                        this.phoPhongObj = res.filter(x => x['TypeHandling'] == 0 && x['OrganizationId'] == 0)[0];
                        if(this.phoPhongObj){
                            this.phoPhongVal = this.phoPhongObj['Id'];
                            this.ppComment = this.phoPhongObj['ProcessingRecommended'];
                            this.ppDate = new Date(this.phoPhongObj['DateHandle']);
                        }
                        this.truongPhongObj = res.filter(x => x['TypeHandling'] == 1 && x['OrganizationId'] == 0)[0];
                        if(this.truongPhongObj){
                            this.truongPhongVal = this.truongPhongObj['Id'];
                            this.tpComment = this.truongPhongObj['ProcessingRecommended'];
                            this.tpDate = new Date(this.truongPhongObj['DateHandle']);
                        }
                        doi.forEach((ele) => {
                            let index = this.data_department.findIndex(x => x.id == ele.OrganizationId);
                            if (index != -1){
                                if(ele.TypeHandling == 1){
                                    this.data_department[index]["mainHandling"] = true;
                                    this.data_department[index]["coHandling"] = false;
                                    this.previousMainHandlingId = this.data_department[index].id;
                                }
                                else if(ele.TypeHandling == 0) {
                                    this.data_department[index]["mainHandling"] = false;
                                    this.data_department[index]["coHandling"] = true;
                                }
                                else {
                                    this.data_department[index]["mainHandling"] = false;
                                    this.data_department[index]["coHandling"] = false;
                                }
                            }
                        });
                    });
                }


                this.signal = result.number;

                if(result.attachment){
                    that.num = result.attachment.split(';');
                    that.num.forEach((ele)=>{
                        that.selectedRows.push({tepDinhKem: ele});
                    });
                }
                if(result.fileChiDao){
                    let t = result.fileChiDao.split(';');
                    t.forEach(x => {
                        that.selectedRows.push( {tepDinhKem: x });
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
                this.tepDinhKemSave = this.selectedRows.map(x => x.tepDinhKem.toString()).join(';')
            });
            this._dynamicFieldService.getDynamicFieldByModuleId(22, this.documentId).subscribe(result => {
                this.data_secretLevel = result[1].dataSource;
                this.data_priority = result[2].dataSource;
                this.data_range = result[3].dataSource;
                this.data_position = result[4].dataSource;
            });

            
            this.currentUser = abp.session.userId;
            console.log(this.currentUser)
     
            
            this._documentAppService.updateSeenStatus(this.documentId,this.currentUser).subscribe()
            // lấy danh sách văn bản liên kết
            this._documentAppService.getLinkedIncomingDocument(this.documentId).subscribe(res => {
                this.linkedDocumentData = res.data;
                this.documentData.linkedDocument = res.data;
            }, err => {
                console.error(err);
            });
        }
        this._commBookService.getAllCommBookInDepartment("1", this.appSession.organizationUnitId).subscribe(res => {
            this.dataBook = res;
            // if (res.length > 0) {
            //     this.documentData.bookDV = this.dataBook[0].id;
            // }

        });
    }

    //get cấp gửi
    getOrgLevel(){
        this._orgLevelAppService.getAllOrgLevel().subscribe((res)=>{
             //this.orgLevel = res.filter(x => x.type == null);
             this.orgLevel = res;
        });
    }

    orgLevelChange(){
        if(this.data_publisher_Initial.length > 0){
            this.data_publisher = this.data_publisher_Initial.filter(x => x.orgLevelId == this.documentData.orgLevelId);
            console.log(this.data_publisher)
        }
    }

    //get nơi gửi
    getPublishOrg(){
        this._publishOrgAppService.getPublishOrgByUserLogin(this.appSession.organizationUnitId).subscribe((res)=>{
            this.data_publisher_Initial = res.data;
            this.orgLevelChange();
        });
    }

    getTeamInOrg(){
        this._documentAppService.getListDepartment(this.appSession.organizationUnitId).subscribe(res =>{
            this.data_department = res;
            this.data_department.forEach(x => {
                x["mainHandling"] = false;
                x["coHandling"] = false;

            });
        });
    }


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

    deleteFile(e:any)
    {
        // this.selectedRows.splice(this.selectedRows.indexOf(e.row.data.tepDinhKem), 1);
        this.selectedRows.splice(this.selectedRows.findIndex(x=>x.tepDinhKem===e.data.tepDinhKem), 1);
        this.tepDinhKemSave = this.selectedRows.map(x => {return x.tepDinhKem.toString()}).join(';');

        $.ajax({
            url: AppConsts.fileServerUrl  + `/fileUpload/Delete_file?documentName=${e.data.tepDinhKem}`,
            type: "delete",
            contentType: "application/json",
            success: (res) => {
                this._documentAppService.deleteDocumentFileInServer(e.data.tepDinhKem, this.documentId).subscribe(() => {});
            },
            error: (err) => {

            }
        });
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
    setListDVXL(){
        this.listDVXL_selected.length = 0;

        if(this.truongPhongVal){
            let dvxl = new ListDVXL();
            dvxl.userId = this.truongPhongVal;
            dvxl.typeHandling = 1;
            dvxl.processRecomend = this.tpComment;
            this.listDVXL_selected.push(dvxl);
        }

        if(this.phoPhongVal){
            let dvxl = new ListDVXL();
            dvxl.userId = this.phoPhongVal;
            dvxl.typeHandling = 0;
            dvxl.processRecomend = this.ppComment;
            this.listDVXL_selected.push(dvxl);
        }
        this.data_department.forEach(receiver => {
            if(receiver["mainHandling"] == true || receiver["coHandling"] == true){
                let dvxl = new ListDVXL();
                //dvxl.userId = receiver.userId;
                dvxl.unitId = receiver.id;
                if(receiver["mainHandling"] == true){
                    dvxl.typeHandling = 1;
                }
                else if(receiver["coHandling"] == true){
                    dvxl.typeHandling = 0;
                }
                this.listDVXL_selected.push(dvxl);
            }
        });
        this.documentData.listDVXLs = this.listDVXL_selected;
    }

    save(): void {
        debugger
        let result = this.documentForm.instance.validate();
        // if(this.isDirty || this.disabled){
            this.setListDVXL();
        // }


        if(result.isValid){
            this.saving = true;
            this.documentData.linkedDocument = null;
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.incommingDateDV = moment(this.incommingDateVal).utc(true);
            //this.documentData.numberOfDays = this.numberOfDaysByDocType;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
            this.documentData.unitId = this.appSession.organizationUnitId;
            // if(!this.documentData.listDVXLs || this.documentData.listDVXLs.filter(x => x.unitId > 0).length == 0){
            //     this.message.warn('Vui lòng chọn Đội chủ trì');
            //     return;
            // }
            this.documentData.documentTypeId = this.documentTypeIdVal;
            this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;
            this._documentAppService.editDocumentByDept(this.documentData)
            .pipe(finalize(() => {debugger; this.saving = false;}))
            .subscribe(() => {
                debugger
                this.notify.success('Sửa thành công');
                if (this.checkDVXL(this.documentData.listDVXLs)) {
                    this._documentAppService.capNhatChiDaoPhong(this.documentData.id, this.documentData.handlingId, this.documentData.bookDV, this.documentData.incommingNumberDV, this.documentData.incommingDateDV, this.documentData.listDVXLs).subscribe();
                    this.router.navigate(['/app/main/qlvb/vb-phong/da-trinh']);
                }else{
                    this.router.navigate(['app/main/qlvb/vb-phong/chua-trinh']);
                }
            });
        }
    }

    saveAndTransfer(){
        let result = this.documentForm.instance.validate();
        this.setListDVXL();
        if(result.isValid){
            this.saving = true;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            // this.documentData.deadline = moment(this.documentData.deadline);
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.book = this.bookVal;
            this.documentData.action = 3;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
            this.documentData.unitId = this.appSession.organizationUnitId;
            this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;
            if(this.deadLineDate != null){
                this.documentData.deadline = moment(this.deadLineDate).utc(true).set({hour: 0, minute: 0, second: 0, millisecond: 0});
            }
            else{
                this.documentData.deadline = null;
            }
            var json = JSON.stringify(this.listDVXL_selected);
            this._documentAppService.updateAndTransferDocument(this.json, this.documentData)
                .pipe(finalize(() => { this.saving = false;}))
                .subscribe(() => {
                    // this.saveHandlingDetail(this.documentData.id, handlingId);
                    this.notify.success('Sửa và trình thành công');
                    this.router.navigate(['/app/main/qlvb/executeLabelSQL/84']);
                });
        }
    }

    saveAndCreateNew(){
        let result = this.documentForm.instance.validate();
        this.setListDVXL();
        const that = this;
        if(result.isValid){
            this.saving = true;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.book = this.bookVal;
            this.documentData.incommingDate = moment(this.currentDate);
            this.documentData.numberOfDays = this.numberOfDaysByDocType;
            this.documentData.action = 1;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
            this.documentData.unitId = this.appSession.organizationUnitId;
            this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;
            if(this.deadLineDate != null){
                this.documentData.deadline = moment(this.deadLineDate).utc(true).set({hour: 0, minute: 0, second: 0, millisecond: 0});
            }
            else{
                this.documentData.deadline = null;
            }
            this.documentData.publisher = parseInt(this.publisherVal);
            // if(this.documentData.id > 0){
                this._documentAppService.updateDocument(this.json, this.documentData)
                    .pipe(finalize(() => { this.saving = false;}))
                    .subscribe(() => {
                        this.notify.success('Sửa thành công');
                        // this.saveHandlingDetail(this.documentData.id, handlingId);
                        that.resetForm();
                    });
        }
    }

    saveHandlingDetail(docId, handlingId){
        this.data_department.forEach(receiver => {
            let record = new DocumentHandlingDetailDto();
            // if(that.)
            if(receiver.mainHandling == true || receiver.coHandling == true){
                record.documentHandlingId = handlingId;
                record.type = this.documentData.documentTypeId;
                this.documentData.publishDate = moment(this.documentData.publishDate);
                // record.isHandled = false;
                record.isCurr = true;
                record.processingDate = moment(this.currentDate);
                record.processingRecommended = this.documentData.processingRecommended;
                if(receiver.mainHandling == true){
                    record.typeHandling = 1;
                }
                else if(receiver.coHandling == true){
                    record.typeHandling = 0;
                }
                // record.toKnow = data.toKnow;
                record.unitId = receiver.id;
                this._documentHandlingDetailAppService.createOrEdit(record).subscribe(()=>{});
            }

        });
        this._documentHandlingDetailAppService.markDocumentTransfered(docId).subscribe(() => {
            // this.documentForm.instance.resetValues();
        });
    }

    onRowUpdating(e: any){
        let mainHandling = e.newData["mainHandling"];
        let coHandling = e.newData["coHandling"];
        var oldData = this.data_department.find(x => x.id == e.key.id);
        // var oldData = this.data_department.find(x => x.organizationId == e.key.organizationId);

        if(oldData.mainHandling == false && mainHandling == true){
            oldData.mainHandling = true;
            oldData.coHandling = false;
        }
        else if(oldData.coHandling == false && coHandling == true){
            oldData.mainHandling = false;
            oldData.coHandling = true;
        }
    }

    onRowUpdated(e: any){
        let flag = true;
        if(this.listReceive.length > 0){
            this.listReceive.every(function(element) {
                if(element.userId != e.data.userId && flag){
                    flag = true;
                    return true;
                }
                else{
                    flag = false;
                    return false;
                }
            });
            if(flag){
                this.listReceive.push(e.data);
                // this.listVal.push(e.data.userId);
            }
        }
        else{
            this.listReceive.push(e.data);
            // this.listVal.push(e.data.userId);
        }
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

    toggleGroupForm(e: any){

    }

    savepublisher(){
        this._dynamicFieldService.createFieldForPublisher(this.publisherForm.formData.publisherName).subscribe((res) => {
            this.publisherPopupVisible = false;
            // $('#publisherSelect').dxSelectBox('instance').repaint();
            this.data_publisher = res;
            this.publisherSelect.instance.repaint();
            this.resetForm();
        })
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
                responseType: 'blob',

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


    changeIncommingDate(e :any){
        if(this.numberOfDaysByDocType == null)
        {
            this.deadLineDate = null;
        }
        else {
            this.deadLineDate = this.addDays(e.value, this.numberOfDaysByDocType);
        }
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
    onScanTypeChanged(e: any){
        if(e.value == 3){
            this.isDuplex = true;
        }
    }

    scan() {
        const self = this;
        self.spinnerService.show();
        var scanFileName = "Van_Ban_Den_" + Date.now() + ".pdf";

        self._userExtentionServiceProxy.getByUser().subscribe((res)=>{

            if (!isNullOrUndefined(res.id)){
                var data = {
                    "DisplayName": scanFileName,
                    "DoMainAppPath": formatDate(self.currentDate, 'dd-MM-yyyy', 'en-US'),
                    "DeviceName": res.scanName,
                    "IsDuplex": self.isDuplex,
                    "ScanType": self.scanType
                };
                self.scanRequest(data,scanFileName)
            }
            else
            {
                var data2 = {
                    "DisplayName": scanFileName,
                    "DoMainAppPath": formatDate(self.currentDate, 'dd-MM-yyyy', 'en-US'),
                    "DeviceName": '',
                    "IsDuplex": self.isDuplex,
                    "ScanType": self.scanType
                };
                self.scanRequest(data2,scanFileName)
            }

        })

    }

    scanRequest(data,scanFileName){
        const self = this;
        $.ajax({
            url: 'http://localhost:9001/ScanService/scan',
            data: JSON.stringify(data),
            contentType: 'application/json',
            method: 'POST',
            success: function (result) {
                // cập nhật thông tin lên table

                self.dataDisplay.length=0;
                const cValue = formatDate(self.currentDate, 'dd-MM-yyyy', 'en-US');
                self.currentTime = new Date().getHours() + "-" + new Date().getMinutes();
                let listFileName = [];

                self.dataDisplay.push({ tepDinhKem: cValue + "/" + scanFileName });
                listFileName.push(scanFileName);

                self.selectedRows = self.selectedRows.concat(self.dataDisplay);

                //cập nhật lại thông tin máy in cho user
                self.tepDinhKemSave = listFileName.join(';');
                if (result["ExistDevice"]=="false"|| result["ExistDevice"]==false){
                    var postData= new UserExtenTionDto();
                    postData.scanName=result["DeviceName"];
                    self._userExtentionServiceProxy.createOrEdit(postData).subscribe(()=>{

                    })
                }
                self.spinnerService.hide();

            },
            error: function(data){

            }
        });
    }
    checkDVXL(dsDVXL) {
        let isCoChiDao = dsDVXL.findIndex(x => x.userId > 0 && x.processRecomend != null && x.processRecomend != '' && (x.typeHandling == 1 || x.typeHandling == 0));
        let isCoDoiXL = dsDVXL.findIndex(x => x.unitId > 0 && x.typeHandling == 1);
        if (isCoChiDao != -1 && isCoDoiXL != -1) {
            return true;
        }
        return false;
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
    
  

    // lock window scrolling
    lockScroll(e) {
        e.preventDefault();
    }
}
