import { Component, Injector, ViewEncapsulation, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, PriorityDto, TextBookDto, DynamicFieldsServiceProxy, DocumentHandlingDetailDto, HandlingUser, DocumentHandlingDetailsServiceProxy, DocumentHandlingsServiceProxy, Comm_booksServiceProxy, ListDVXL, GetUserInRoleDto, OrgLevelsServiceProxy, PublishOrgsServiceProxy, ODocsServiceProxy } from '@shared/service-proxies/service-proxies';
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
    templateUrl: './xem-vb-den-doi.html',
    // styleUrls: ['./create-Document.component.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
    animations: [appModuleAnimation()]

})
export class ViewDocumentDenDoiComponent extends AppComponentBase implements OnInit{

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

    transformDate(date) {
        return this.datePipe.transform(date, 'dd/MM/yyyy'); //whatever format you need.
    }

     resetForm(){
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/app/main/qlvb/create-new-incomming-document']);
    }


    // getTeamInOrg(){
    //     this._documentAppService.getListDepartment(this.appSession.organizationUnitId).subscribe(res =>{
    //         this.data_department = res;
    //         this.data_department.forEach(x => {
    //             x["mainHandling"] = false;
    //             x["coHandling"] = false;
    //         });
    //     });
    // }

    ngOnInit(){

        // this.getTeamInOrg();
        this.getUserInOrg();
        const Id = this._activeRoute.snapshot.paramMap.get('id');
        const that = this;
        this.code = this._activeRoute.snapshot.paramMap.get('code');
        if(Id != null){
            this.documentId = Number.parseInt(Id);
            this._documentAppService.getDocumentEditByDocumentId(this.documentId).subscribe((result) => {
                this.documentData = result;
                console.log(this.documentData)
                if(this.documentData.unitId == 0){
                    this.catp = true;
                    // this.yKienBGD = this.documentData.approvingRecommended ? this.yKienBGD + this.documentData.directorName + ': ' + this.documentData.approvingRecommended : this.yKienBGD + this.documentData.directorName;
                }
                this.getOrgLevel();
                this.getPublishOrg();
                that._documentHandlingAppService.get_DVXL_ForDocument_Dept(result.id).subscribe((res) => {
                    that.old_DVXL = res;
                    that.truongPhongObj = res.filter(x => x['TypeHandling'] == 1 && x['OrganizationId'] == 0 && x['HandlingType'] == 4)[0];
                    if(that.truongPhongObj){
                        that.truongPhongVal = this.truongPhongObj['Id'];
                        that.tpComment = this.truongPhongObj['ProcessingRecommended'];
                        that.tpDate = new Date(this.truongPhongObj['DateHandle']);
                        that.tpDisabled = true;
                    }
                    that.phoPhongObj = res.filter(x => x['TypeHandling'] == 0 && x['OrganizationId'] == 0 && x['HandlingType'] == 4)[0];
                    if(that.phoPhongObj){
                        that.phoPhongVal = that.phoPhongObj['Id'];
                        that.ppComment = that.phoPhongObj['ProcessingRecommended'];
                        that.ppDate = new Date(that.phoPhongObj['DateHandle']);
                    }

                    that.doiTruongObj = res.filter(x => x['TypeHandling'] == 1 && x['OrganizationId'] == 0 && x['HandlingType'] == 5)[0];
                    if(that.doiTruongObj){
                        that.doiTruongVal = that.doiTruongObj['Id'];
                        that.dtComment = that.doiTruongObj['ProcessingRecommended'];
                        that.dtDate = new Date(that.doiTruongObj['DateHandle']);
                    }
                    that.doiPhoObj = res.filter(x => x['TypeHandling'] == 0 && x['OrganizationId'] == 0 && x['HandlingType'] == 5)[0];
                    if(that.doiPhoObj){
                        that.doiPhoVal = that.doiPhoObj['Id'];
                        that.dpComment = that.doiPhoObj['ProcessingRecommended'];
                        that.dpDate = new Date(that.doiPhoObj['DateHandle']);
                    };
                    that.cbcs = res.filter(x => x['OrganizationId'] > 0 &&  x['HandlingType'] == 5 );

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

                //this.deadLineDate = result.deadline != null? result.deadline.toDate() : null;
                this.signal = result.number;
                //this.numberOfDaysByDocType = result.numberOfDays;
                if(result.attachment){
                    this.num = result.attachment.split(';');
                    this.num.forEach((ele)=>{
                        this.selectedRows.push({tepDinhKem: ele});
                    });
                }
                //this.publisherVal = result.publisher.toString();

                this.bookVal = result.book;
                //this.nextNumber = result.incommingNumber;
                this.secretVal = result.secretLevel != null ? result.secretLevel.toString(): null;
                this.rangeVal = result.range != null ? result.range.toString() : null;
                this.positionVal = result.position != null ? result.position.toString() : null;
                this.priorityVal = result.priority != null ? result.priority.toString(): null;

                //this.incommingDateVal = result.incommingDate.toDate();

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

     
            this._documentAppService.updateSeenStatus(this.documentId,this.currentUser).subscribe()
        }
    }

    //get cấp gửi
    getOrgLevel(){
        this._orgLevelAppService.getAllOrgLevel().subscribe((res)=>{
            this.orgLevel = (this.documentData.unitId == 0) ? res : res.filter(x => x.type == null);
            //this.documentData.orgLevelId = this.orgLevel[0].id;
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
    onCheckBoxBoSungChanged(e, cell) {
        let index = this.data_department.findIndex(x => x.id == cell.data.id);
        //kiểm tra cột vừa thao tác là main hay co
        if (e.value == true) {
            let dvxl = new ListDVXL();
            dvxl.unitId = this.data_department[index].id;
            dvxl.typeHandling = 0;
            dvxl.dateHandle = moment(new Date()).utc(true);
            this.newSelectedDVXL.push(dvxl);
        }
        else{
            this.newSelectedDVXL.splice(this.newSelectedDVXL.findIndex(x => x.unitId == cell.data.id),1);
        }
    }

    chkAutomatic(e: any){
        this.incommingNumberDisabled = e.value;
        if(e.value == true){ // nút tự động được chọn
            this.getIncommingNumber(this.documentData.bookDV);
        }
    }

    getIncommingNumber(soVB: number) {
        this._documentAppService.getNextIncommingNumber(soVB).subscribe(res => {
            this.nextNumber = res;
            this.documentData.incommingNumberDV = this.nextNumber;
        });
    }

    changeBookDV(){
        if(this.incommingNumberDisabled == true){
            this.getIncommingNumber(this.documentData.bookDV)
        }
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

        if(this.truongPhongVal && !this.tpDisabled){
            let dvxl = new ListDVXL();
            dvxl.userId = this.truongPhongVal;
            dvxl.typeHandling = 1;
            dvxl.processRecomend = this.tpComment;
            dvxl.dateHandle = (this.tpDate != null) ? moment(this.tpDate).utc(true) : moment(new Date()).utc(true);
            this.listDVXL_selected.push(dvxl);
        }

        if(this.phoPhongVal){
            let dvxl = new ListDVXL();
            dvxl.userId = this.phoPhongVal;
            dvxl.typeHandling = 0;
            dvxl.processRecomend = this.ppComment;
            dvxl.dateHandle = (this.ppDate != null) ? moment(this.ppDate).utc(true) : moment(new Date()).utc(true);
            this.listDVXL_selected.push(dvxl);
        }

        this.listDVXL_selected = this.listDVXL_selected.concat(this.newSelectedDVXL);
        this.documentData.listDVXLs = this.listDVXL_selected;
    }

    save(): void {
        let result = this.documentForm.instance.validate();
        // if(this.isDirty || this.disabled){
            this.setListDVXL();
        // }

        if(result.isValid){
            this.saving = true;
            //this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);

            // this.documentData.deadline = moment(this.documentData.deadline);
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.book = this.bookVal;
            this.documentData.incommingDateDV = moment(this.documentData.incommingDateDV).utc(true);
            //this.documentData.numberOfDays = this.numberOfDaysByDocType;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
            this.documentData.unitId = this.appSession.organizationUnitId;
            this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;

            if(this.catp){
                this._documentAppService.createHandlingDetailVBPhong(this.documentData)
                .pipe(finalize(() => { this.saving = false;}))
                .subscribe(() => {
                    this.notify.success('Sửa thành công');
                    this.router.navigate(['/app/main/qlvb/danh-sach-da-co-chi-dao']);
                });
            }
            else{
                this._documentAppService.updateDocAndCreateHandlingDetailVBPhong(this.documentData)
                    .pipe(finalize(() => { this.saving = false;}))
                    .subscribe(() => {
                        this.notify.success('Sửa thành công');
                        this.router.navigate(['/app/main/qlvb/vb-phong/da-trinh']);

                    });
            }
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
        // this.data_publisher.push({ id: this.data_publisher.length,  name: this.publisherData["name"] });
        // console.log(this.publisherForm.formData.publisherName);
        this._dynamicFieldService.createFieldForPublisher(this.publisherForm.formData.publisherName).subscribe((res) => {
            this.publisherPopupVisible = false;
            // $('#publisherSelect').dxSelectBox('instance').repaint();
            this.data_publisher = res;
            this.publisherSelect.instance.repaint();
            this.resetForm();
        })

        // this.publisherSelect.
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

    bookSelectionChange(e: any){
        this.getIncommingNumber(e.value);
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

    blockBodyScrollGrid(e) {
        //debugger
        const that = this;
        let id = e.element[0].id;
        $("#" + id).on("mouseenter", function(e) {
            // disable scrolling
            console.log('aaa')
            $('body').bind('mousewheel touchmove', that.lockScroll);
        });
        $("#" + id).on("mouseleave", function(e) {
            // enable scrolling
            console.log('bbb')
            $('body').unbind('mousewheel touchmove', that.lockScroll);
        });
    }

    // lock window scrolling
    lockScroll(e) {
        e.preventDefault();
    }
}
