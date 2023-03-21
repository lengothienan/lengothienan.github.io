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
import { DxFormComponent, DxSwitchComponent, DxDateBoxComponent, DxSelectBoxComponent, DxDataGridComponent } from 'devextreme-angular';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { DxiGroupComponent, DxoPopupComponent } from 'devextreme-angular/ui/nested';
import { Location } from '@angular/common';
import $ from 'jquery';
import { isNullOrUndefined } from 'util';
declare const exportHTML: any;

@Component({
    selector: 'suaVBDenPhongExtraComponent',
    templateUrl: './sua-vb-phong-extra.component.html',
    styleUrls: ['./create-Document.component.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe] ,
    animations: [appModuleAnimation()]

})
export class EditDocumentDenPhongPHExtraComponent extends AppComponentBase implements OnInit{

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
    @ViewChild('gridContainerOrg', { static: true }) gridContainerOrg: DxDataGridComponent;
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
    orgLevelDisabled:any;
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
    secretVal: any;
    priorityVal: any;
    rangeVal: any;
    positionVal: any;
    printUrl = '';
    listDVXL_selected: ListDVXL[] = [];
    editDocumentDto: DocumentsDto = new DocumentsDto;
    isDirty = false; // có thay đổi ĐVXL
    incommingDateVal = new Date();
    dataBook = [
        { id: 1, name: 'Sổ thường'  },
        { id: 2, name: 'Sổ mật' },
    ];
    isDuplex:any = false;
    scanTypes = [
        {value: 2, display: "Scan 2 mặt (bằng tay)"},
        {value: 3, display: "Scan 2 mặt"}
    ];
    scanType: any = 1;

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
    disabled = true;
    chiDaoGD = '';
    tpDate: Date;
    ppDate: Date;
    catp = false;
    dvxl_canEdited = false;
	linkedDocumentOptions: any;
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
        this.uploadUrl = AppConsts.fileServerUrl  + '/fileUpload/Upload_file?userId=' + this.userId ;
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
            this.phoPhong = res.filter(x => x.roleCode == 'PP' || x.roleCode == 'PTP');
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

    addItem(newItem :string): void {
        this.documentData.attachment += newItem ;
    }

    ngOnInit(){
        const self = this;
        this.getOrgLevel();
        this.getTeamInOrg();
        this.getUserInOrg();
        const Id = this._activeRoute.snapshot.paramMap.get('id');
        this.code = this._activeRoute.snapshot.paramMap.get('code');
        if(Id != null){
            this.documentId = Number.parseInt(Id);
            // this._documentAppService.isEditAssigned(this.documentId).subscribe(res => {
            //     self.dvxl_canEdited = res;
            // });
            this._documentAppService.getDocumentEditByDocumentId(this.documentId).subscribe((result) => {
                self.documentData = result;
                console.log(result);

                self._documentHandlingAppService.get_DVXL_PH_ForDocument_Dept(result.id).subscribe((res) => {
                    self.old_DVXL = res;
                    let doi = res.filter(x => x['OrganizationId'] !== 0 && x['SubHandlingType'] == 4);
                    console.log(doi);
                    self.phoPhongObj = res.filter(x => x['TypeHandling'] == 0 && x['OrganizationId'] == 0)[0];
                    if(self.phoPhongObj){
                        self.phoPhongVal = self.phoPhongObj['Id'];
                        self.ppComment = self.phoPhongObj['ProcessingRecommended'];
                        self.ppDate = new Date(self.phoPhongObj['DateHandle']);
                    }
                    self.truongPhongObj = res.filter(x => x['TypeHandling'] == 1 && x['OrganizationId'] == 0)[0];
                    if(self.truongPhongObj){
                        self.truongPhongVal = self.truongPhongObj['Id'];
                        self.tpComment = self.truongPhongObj['ProcessingRecommended'];
                        self.tpDate = new Date(self.truongPhongObj['DateHandle']);
                    }
                    doi.forEach((ele) => {
                        let index = self.data_department.findIndex(x => x.id == ele.OrganizationId);
                        if (index != -1){
                            if(ele.TypeHandling == 1){
                                self.data_department.map(x => x["disabledCT"] = true);
                                self.data_department[index]["mainHandling"] = true;
                                self.data_department[index]["coHandling"] = false;
                                self.data_department[index]["disabledPHXL"] = true;
                                self.previousMainHandlingId = self.data_department[index].id;
                            }
                            else if(ele.TypeHandling == 0) {
                                self.data_department[index]["mainHandling"] = false;
                                self.data_department[index]["coHandling"] = true;
                                self.data_department[index]["disabledPHXL"] = true;
                            }
                            else {
                                self.data_department[index]["mainHandling"] = false;
                                self.data_department[index]["coHandling"] = false;
                            }
                        }
                    });
                });

                //this.deadLineDate = result.deadline != null? result.deadline.toDate() : null;
                self.signal = result.number;
                //this.numberOfDaysByDocType = result.numberOfDays;
                if(result.attachment){
                    self.num = result.attachment.split(';');
                    self.num.forEach((ele)=>{
                        self.selectedRows.push({tepDinhKem: ele});
                    });
                }
                if(result.fileChiDao){
                    let t = result.fileChiDao.split(';');
                    t.forEach(x => {
                        self.selectedRows.push( {tepDinhKem: x });
                    });
                }
                //this.publisherVal = result.publisher.toString();

                self.bookVal = result.book;
                //this.nextNumber = result.incommingNumber;
                self.secretVal = result.secretLevel != null ? result.secretLevel.toString(): null;
                self.rangeVal = result.range != null ? result.range.toString() : null;
                self.positionVal = result.position != null ? result.position.toString() : null;
                self.priorityVal = result.priority != null ? result.priority.toString(): null;

                //this.incommingDateVal = result.incommingDate.toDate();

                if(result.documentTypeId != null || result.secretLevel != null || result.priority != null || result.range != null || result.signer != null || result.position != null){
                    self.switchValue = true;
                }
                self.tepDinhKemSave = self.selectedRows.map(x => x.tepDinhKem.toString()).join(';')
            });
            self._dynamicFieldService.getDynamicFieldByModuleId(22, self.documentId).subscribe(result => {
                self.data_secretLevel = result[1].dataSource;
                self.data_priority = result[2].dataSource;
                self.data_range = result[3].dataSource;
                self.data_position = result[4].dataSource;
            });

            
            this.currentUser = abp.session.userId;
            console.log(this.currentUser)
     
            
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

    getTeamInOrg(){
        this._documentAppService.getListDepartment(this.appSession.organizationUnitId).subscribe(res =>{
            this.data_department = res;
            this.data_department.forEach(x => {
                x["mainHandling"] = false;
                x["coHandling"] = false;
                //this.loaiDV[1].dataSource.push(x);
            });
        });
    }

    onCheckBoxBoSungChanged(e, cell) {
        const self = this;
        let index = this.data_department.findIndex(x => x.id == cell.data.id);

        switch(cell.column.dataField){
            case 'mainHandling':
                //kiểm tra có đvxl chính chưa, nếu có rồi thì bỏ chọn cái trước
                if(self.previousMainHandlingId >= 0){
                    let temp = self.data_department.findIndex(x => x.id == self.previousMainHandlingId);
                    self.data_department[temp]["mainHandling"] = false;
                }

                if(self.data_department[index]["coHandling"] == true){
                    self.data_department[index]["coHandling"] = false;
                }

                self.data_department[index]["mainHandling"] = e.value;

                //giữ id của đơn vị đang nắm chủ trì
                self.previousMainHandlingId = cell.data.id;
                break;
            case 'coHandling':
                if(self.data_department[index]["mainHandling"] == true){
                    self.data_department[index]["mainHandling"] = false;
                }

                self.data_department[index]["coHandling"] = e.value;
                break;
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

        if(this.truongPhongVal){
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
        this.data_department.forEach(x => {
            let dvxl = new ListDVXL();
                dvxl.dateHandle = moment();
                dvxl.unitId = x.id;
            let idx = this.listDVXL_selected.findIndex(z => z.unitId == x.id);
            if(x.mainHandling == true){
                dvxl.typeHandling = 1;
                this.listDVXL_selected.push(dvxl);
            }
            else if(x.mainHandling == false) {
                if(idx >= 0){
                    this.listDVXL_selected.splice(idx, 1);
                }
            }
            if(x.coHandling == true){
                dvxl.typeHandling = 0;
                this.listDVXL_selected.push(dvxl);
            }
            else if(x.coHandling == false) {
                if(idx >= 0){
                    this.listDVXL_selected.splice(idx, 1);
                }
            }

        });
        console.log(this.listDVXL_selected)
        this.documentData.listDVXLs = this.listDVXL_selected;
    }

    save(): void {
        const self = this;
        let result = this.documentForm.instance.validate();
        // if(this.isDirty || this.disabled){
        this.setListDVXL();
        // }

        if(result.isValid){
            self.saving = true;
            self.documentData.isActive = true;
            self.documentData.status = false;
            self.documentData.book = self.bookVal;
            self.documentData.incommingDateDV = moment(self.documentData.incommingDateDV).utc(true);
            //this.documentData.numberOfDays = this.numberOfDaysByDocType;
            self.documentData.attachment = self.tepDinhKemSave !== '' ? self.tepDinhKemSave: '';
            self.documentData.unitId = self.appSession.organizationUnitId;
            self.documentData.secretLevel = self.documentData.secretLevel != null? self.documentData.secretLevel : -1;
            self.documentData.priority = self.documentData.priority != null? self.documentData.priority : -1;
            self._documentAppService.updateDocAndCreateHandlingDetailVBPhong(this.documentData)
                    .pipe(finalize(() => { self.saving = false;}))
                    .subscribe(() => {
                        self.notify.success('Sửa thành công');
                        // self.router.navigate(['/app/main/qlvb/vb-phong/da-trinh']);
                        window.history.back();

            });
        }
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

    blockScrollTreeView(e) {
        const that = this;
        //e.component.selectItem(that.treeBoxValue);
        $(".dx-treeview-item").on("mouseenter", function(e) {
            // disable scrolling
            $('body').bind('mousewheel touchmove', that.lockScroll);
        });
        $(".dx-treeview-item").on("mouseleave", function(e) {
            // enable scrolling
            $('body').unbind('mousewheel touchmove', that.lockScroll);
        }); 
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
