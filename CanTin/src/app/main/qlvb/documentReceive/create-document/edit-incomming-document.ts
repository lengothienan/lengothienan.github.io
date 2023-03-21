import { Component, Injector, ViewEncapsulation, ViewChild, ElementRef, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, PriorityDto, DynamicFieldsServiceProxy, DocumentHandlingDetailDto, HandlingUser, DocumentHandlingDetailsServiceProxy, DocumentHandlingsServiceProxy, Comm_booksServiceProxy, ListDVXL, OrgLevelsServiceProxy, PublishOrgsServiceProxy, UserExtenTionDto, UserExtentionServiceProxy, CA_DocumentHandlingUserServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';
import { DxFormComponent, DxSwitchComponent, DxDateBoxComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { DxiGroupComponent, DxoPopupComponent } from 'devextreme-angular/ui/nested';
import { Location } from '@angular/common';
import $ from 'jquery';
import { DocumentHaveNumberExistsComponent } from './documentHaveNumberExists.component';
import { CreatePublisherComponent } from '@app/main/documentHelper/createPublisher.component';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'editIncommingDocument',
    templateUrl: './edit-incomming-document.html',
    styleUrls: ['./create-new-incomming-document.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe] ,
    animations: [appModuleAnimation()]

})
export class EditIncommingDocumentComponent extends AppComponentBase implements OnInit{
    @ViewChild('documentHaveNumberExists', { static: true }) documentHaveNumberExists: DocumentHaveNumberExistsComponent;
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
    @ViewChild('createPublisher', { static: true}) createPublisher: CreatePublisherComponent;
    documentData: DocumentsDto = new DocumentsDto();
    documentTypeOptions: DocumentTypeDto[] = [];
    popupVisible = false;
    priorityOptions: PriorityDto[] = [];
    saving = false;
    uploadUrl: string;
    currentTime :any ;
    link = '';
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
    data_department = [];
    data_secretLevel = [];
    data_priority = [];
    captain_department = [];
    director_list = [];
    rootUrl : string ;
    deadLineDate: Date;
    value: any[] = [];
    num: any[] = [];
    active = false;
    currentDate = new Date();
    dataDisplay = [];
    tepDinhKemSave = '';
    switchValue = false;
    documentId: number;
    data_DVXL:any
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
    incommingDateVal: Date;
    dataBook = [];
    data_publisher_Initial: any;
    orgLevel: any;
    orgLevelVal: any;
    //id cấp gửi, khi tạo mới nơi gửi
    orgLevelCreate: any;
    //lưu số ký hiệu lấy từ db, nếu biến này thay đổi, mới check trùng
    numberInDb: any;
    confirmPopUpText: any;
    confirmPopUpVisible = false;
    onClickSaveAndCreateNew: boolean;
    incommDateOptions: any;
    numberOfDaysOptions: any;
    deadlineOptions: any;
    isDuplex:any = false;
    scanTypes = [
        {value: 2, display: "Scan 2 mặt (bằng tay)"},
        {value: 3, display: "Scan 2 mặt"}
    ];
    scanType: any = 1;

    handlingUserIdDataSource: any = [];
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
        private _location: Location,
        private _orgLevelAppService: OrgLevelsServiceProxy,
        private _publishOrgAppService: PublishOrgsServiceProxy,
        private _commBookAppService: Comm_booksServiceProxy,
        private _userExtentionServiceProxy: UserExtentionServiceProxy,
        private _documentHandlingUserService: CA_DocumentHandlingUserServiceProxy
    ) {
        super(injector);
        this.getPublishOrg();
        this.getCommBook();
        this.getOrgLevel();
        this.userId = this.appSession.userId;
        this.uploadUrl = AppConsts.fileServerUrl + '/fileupload/Upload_file?userId=' + this.userId ;
        this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetWordFile?documentId=';
        this._documentTypeAppService.getAllDocumentType().subscribe(result => {
            this.signal = result[0].signal;
            this.documentTypeOptions = result;
        });
        this._documentHandlingAppService.getLeaderList_PGD().subscribe(res =>{
            // this.director_list = res.filter(e => e.organizationUnitId == 50);
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

        // this._commBookService.getAllComm_BookByOrg(this.appSession.organizationUnitId).subscribe(res => {
        //     this.dataBook = res;
        //     console.log(this.dataBook);
        // });

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

    //get cấp gửi
    getOrgLevel(){
        this._orgLevelAppService.getAllOrgLevel().subscribe((res)=>{
            this.orgLevel = res;
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

        })
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

    // get sổ VB
    getCommBook(){
        this._commBookAppService.getAllCommBookInDepartment("1", this.appSession.selfOrganizationUnitId).subscribe(res => {
            this.dataBook = res;
            // this.documentData.book = res[0].id;
        })
    }

    ngOnInit(){
        this.initIncommDateOptions();
        this.initHandlingUserIdOptions();


        // this.initDeadlineOptions();
        const self = this;
        const Id = this._activeRoute.snapshot.paramMap.get('id');

        if(Id != null){
            this.documentId = Number.parseInt(Id);
            this._documentAppService.getDocumentEditByDocumentId(this.documentId).subscribe((result) => {
               
                if(result.leaderDepartmentId)
                self._documentHandlingAppService.get_DVXL_ForDocument(result.id, result.unitId).subscribe((res) => {
                    self.old_DVXL = res;

                    self.old_DVXL.forEach((ele) => {
                        let index = self.data_department.findIndex(x => x.id == ele.OrganizationId);
                        if(ele.TypeHandling == 1){
                            self.data_department[index]["mainHandling"] = true;
                            self.data_department[index]["coHandling"] = false;
                            self.previousMainHandlingId = this.data_department[index].id;
                        }
                        else if(ele.TypeHandling == 0) {
                            self.data_department[index]["mainHandling"] = false;
                            self.data_department[index]["coHandling"] = true;
                        }
                        else {
                            self.data_department[index]["mainHandling"] = false;
                            self.data_department[index]["coHandling"] = false;
                        }
                    });
                });
                self.documentData = result;
                console.log(result);
                self.numberInDb = result.number;
                self.incommingDateVal = result.incommingDate.toDate();

                self.deadLineDate = result.deadline != null? result.deadline.toDate() : null;
                self.signal = result.number;
                
                self.numberOfDaysByDocType = result.numberOfDays;
                if(result.attachment!==null && result.attachment!== undefined ){
                    result.attachment.split(';').forEach(e => {
                        self.selectedRows.push({tepDinhKem: e});
                    });
                }
                self.publisherVal = result.publisher.toString();

                self.bookVal = result.book;
                self.secretVal = result.secretLevel != null ? result.secretLevel.toString(): null;
                self.rangeVal = result.range != null ? result.range.toString() : null;
                self.positionVal = result.position != null ? result.position.toString() : null;
                self.priorityVal = result.priority != null ? result.priority.toString(): null;
                this.initDeadlineOptions();
                //self.orgLevelChange();
                //this.incommingDateVal = result.incommingDate.toDate();
                if(self.documentData.leaderDepartmentId == 0){
                    self.switchValue = true;
                }
                if(result.documentTypeId != null || result.secretLevel != null || result.priority != null || result.range != null || result.signer != null || result.position != null){

                }
                this.tepDinhKemSave = this.selectedRows.map(x => x.tepDinhKem.toString()).join(';')
            });
            this._dynamicFieldService.getDynamicFieldByModuleId(22, this.documentId).subscribe(result => {
                //this.data_publisher = result[0].dataSource;
                this.data_secretLevel = result[1].dataSource;
                this.data_priority = result[2].dataSource;
                this.data_range = result[3].dataSource;
                this.data_position = result[4].dataSource;
            });

            this.currentUser = abp.session.userId;
     
            
            this._documentAppService.updateSeenStatus(this.documentId,this.currentUser).subscribe()
        }
        // this._documentAppService.getListPhongBanCATP().subscribe(res =>{
        //     this.data_department = res;
        //     console.log(this.data_department);

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
        if(!this.isDirty)
            return;
        this.data_department.forEach(receiver => {
            if(receiver.mainHandling == true || receiver.coHandling == true){
                let dvxl = new ListDVXL();
                dvxl.unitId = receiver.id;
                if(receiver.mainHandling == true){

                    dvxl.typeHandling = 1;

                }
                else if(receiver.coHandling == true){
                    dvxl.typeHandling = 0;
                }
                this.listDVXL_selected.push(dvxl);
                this.json = JSON.stringify(this.listDVXL_selected);
            }

        });
    }

    onYesConfirmPopUp(){
        this.confirmPopUpVisible = false;
        if(this.onClickSaveAndCreateNew){
            this.saveAndCreateNew();
        }
        else{
            this.save();
        }
    }

    onCancelConfirmPopUp(){
        this.documentData.number = '';
        this.documentForm.instance.getEditor("number").focus();
        this.confirmPopUpVisible = false;
    }

    buttonSaveClick(){
        this.onClickSaveAndCreateNew = false;
        //nếu số ký hiệu rỗng hoặc không thay đổi thì k cần check
        if((this.numberInDb == this.documentData.number)||!this.documentData.number ){
            this.save();
        }
        else{
            this._documentAppService.checkIfNumberExists(this.documentData.number).subscribe(res => {
                if(res){
                    this.confirmPopUpText = this.l('NumberExistsDoYouWantToForceSaving{0}', this.documentData.number);
                    this.confirmPopUpVisible = true;
                }
                else{
                    this.save();
                }
            });
        }
    }

    buttonSaveAndCreateNewClick(){
        this.onClickSaveAndCreateNew = true;
        //nếu số ký hiệu rỗng hoặc không thay đổi thì k cần check
        if(!this.documentData.number || (this.numberInDb == this.documentData.number)){
            this.saveAndCreateNew();
        }
        else{
            this._documentAppService.checkIfNumberExists(this.documentData.number).subscribe(res => {
                if(res){
                    this.confirmPopUpText = this.l('NumberExistsDoYouWantToForceSaving{0}', this.documentData.number);
                    this.confirmPopUpVisible = true;
                }
                else{
                    this.saveAndCreateNew();
                }
            });
        }
    }

    save(): void {
        let result = this.documentForm.instance.validate();
        this.setListDVXL();
        if(result.isValid){
            this.saving = true;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.incommingDate = moment(this.documentData.incommingDate).utc(true);
            // if(this.documentData.numberOfDays != null && this.documentData.deadline != null){
            //     this.documentData.deadline = moment(this.documentData.deadline).utc(true);
            // }
            // if(this.documentData.deadline == null){
            //     this.documentData.numberOfDays = null;
            // }
             if(this.numberOfDaysByDocType != null && this.deadLineDate != null){
                this.documentData.deadline = moment(this.deadLineDate).utc(true);
                this.documentData.numberOfDays=this.numberOfDaysByDocType;
            }
            if(this.deadLineDate == null){
                this.documentData.numberOfDays = null;
            }
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
            // this.documentData.unitId = this.appSession.organizationUnitId;
            this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;

            this._documentAppService.updateDocument(this.json, this.documentData)
                .pipe(finalize(() => { this.saving = false;}))
                .subscribe(() => {
                    this.notify.success('Sửa thành công');
                    this.router.navigate(['/app/main/qlvb/executeLabelSQL/6']);
                });
        }
    }

    saveAndTransfer(){
        let result = this.documentForm.instance.validate();
        this.setListDVXL();
        if(result.isValid){
            this.saving = true;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.incommingDate = moment(this.documentData.incommingDate).utc(true);
            if(this.documentData.numberOfDays != null){
                this.documentData.deadline = moment(this.documentData.deadline).utc(true);
            }
            // this.documentData.deadline = moment(this.documentData.deadline);
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.book = this.bookVal;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
            // this.documentData.unitId = this.appSession.organizationUnitId;
            //this.documentData.publisher = parseInt(this.publisherVal);
            this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;

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
            this.documentData.incommingDate = moment(this.documentData.incommingDate).utc(true);
            // if(this.documentData.numberOfDays != null && this.documentData.deadline != null){
            //     this.documentData.deadline = moment(this.documentData.deadline).utc(true);
            // }
            // if(this.documentData.deadline == null){
            //     this.documentData.numberOfDays = null;
            // }
            if(this.numberOfDaysByDocType != null && this.deadLineDate != null){
                this.documentData.deadline = moment(this.deadLineDate).utc(true);
                this.documentData.numberOfDays=this.numberOfDaysByDocType;
            }
            if(this.deadLineDate == null){
                this.documentData.numberOfDays = null;
            }
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.book = this.bookVal;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
            // this.documentData.unitId = this.appSession.organizationUnitId;
            this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;

            // this.documentData.publisher = parseInt(this.publisherVal);
            // if(this.documentData.id > 0){
                this._documentAppService.updateDocument(this.json, this.documentData)
                    .pipe(finalize(() => { this.saving = false;}))
                    .subscribe(() => {
                        this.notify.success('Sửa thành công');
                        // this.saveHandlingDetail(this.documentData.id, handlingId);
                        that.resetForm();
                    });
            //     // this.router.navigate(['/app/main/qlvb/executeLabelSQL/']);
            // }
            // console.log(this.data_department);
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
        this.createPublisher.show();
    }

    toggleGroupForm(){

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
            url: this.printUrl,
            method: 'POST',
            xhrFields: {
                responseType: 'blob',
            },
            data: {
                documentId: this.documentId,
                roleId: this.appSession.roleId
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
    
    numberOfDaysChanged(e: any){
        if(this.numberOfDaysByDocType == null){
            this.deadLineDate = null;
        }
        else{
        this.deadLineDate = this.addDays(moment(this.documentData.incommingDate).format('YYYY-MM-DD'), e.value);
        }
    }
    incommingDateChanged(e: any){
        if(this.documentData.numberOfDays !== null && e.value !== null) {
            this.deadLineDate = this.addDays(moment(e.value).format('YYYY-MM-DD'), this.documentData.numberOfDays);
           
        } else{
            this.deadLineDate = null;
        }

    }
    deadLineDateChanged(e:any){
        // if(this.documentData.incommingDate !== null && e.value !== null && this.aminusDays(moment(e.value).format('YYYY-MM-DD'),moment(this.documentData.incommingDate).format('YYYY-MM-DD'))) {
        //     this.numberOfDaysByDocType=this.aminusDays(moment(e.value).format('YYYY-MM-DD'),moment(this.documentData.incommingDate).format('YYYY-MM-DD'));
           
        // } else{
        //     this.numberOfDaysByDocType = null;
        // }
    }

    endDateVal: Date;
    // numberOfDaysValueChanged(data: any){
    //     // var previousValue = data.previousValue;
    //     // var newValue = data.value;
    //     let da = this.transformDate(this.documentData.incommingDate);
    //     this.documentData.numberOfDays = data.value;
    //     // console.log(new Date(this.documentData.incommingDate))
    //     // this.hanXyLy.value =
    //     this.endDateVal = this.addDays(da, data.value);
    //     this.documentData.endDate = moment(this.endDateVal);
    //     // this.hanXyLy.value = date;
    // }

    addDays(val,days: number){
        var date = new Date(val);
        date.setDate(date.getDate()+ days);
        return date;
    }
    aminusDays(val1,val2){
        var date1 = new Date(val1);
        var date2 = new Date(val2);
        console.log(val1,val2);
        var minus= date1.getDate()- date2.getDate();
        return minus;
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

    switchValueChanged(){
        this.initNumberOfDaysOptions();
        this.initDeadlineOptions();
    }

    initIncommDateOptions(){
        const that = this;
        this.incommDateOptions = {
            showClearButton: true,
            displayFormat: 'dd/MM/yyyy',
            format: 'dd/MM/yyyy',
            min: new Date(2000, 0, 1),
            max: that.currentDate,
            invalidDateMessage: '',
            onValueChanged: function(e){
                if(that.documentData.numberOfDays !== null && e.value !== null) {
                    that.documentData.deadline = moment(that.addDays(e.value, that.documentData.numberOfDays));
                }
            }
        };
    }

    initNumberOfDaysOptions(){
        const that = this;
        this.numberOfDaysOptions = {
            value: (!this.switchValue)? 15: null,
            showClearButton: true,
            disabled: this.switchValue,
            onValueChanged: function(e){
                if(that.documentData.numberOfDays == null){
                    that.documentData.deadline = null;
                }
                else{
                    that.documentData.deadline = moment(that.addDays(moment(that.documentData.incommingDate).format('YYYY-MM-DD'), e.value));
                }
            }
        }
    }

    initDeadlineOptions(){
        const that = this;
        var temp = null;
        if (!this.switchValue) {
            if (that.documentData.deadline != null) { 
                temp = moment(that.documentData.deadline).format('YYYY-MM-DD');
            }
        } 
        
        this.deadlineOptions = {
            displayFormat: 'dd/MM/yyyy',
            format: 'dd/MM/yyyy',
            disabled: this.switchValue,
            value: temp,
            showClearButton: true,
            onValueChanged: function(e){
                if(that.documentData.numberOfDays !== null && e.value !== null){
                    that.documentData.incommingDate = moment(that.addDays(e.value, -that.documentData.numberOfDays));
                }
                if(e.value !== null && that.documentData.incommingDate !== null){
                    that.documentData.numberOfDays = moment(e.value).diff(that.documentData.incommingDate, 'days');
                }
            }
        }
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

    initHandlingUserIdOptions(){

        this._documentHandlingUserService.getAll().subscribe(res => {
            this.handlingUserIdDataSource = res.data;
        });
    }
}
