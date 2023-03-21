import { Component, Injector, ViewEncapsulation, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, PriorityDto, TextBookDto, DynamicFieldsServiceProxy, DocumentHandlingDetailDto, HandlingUser, DocumentHandlingDetailsServiceProxy, DocumentHandlingsServiceProxy, Comm_booksServiceProxy, ListDVXL, OrgLevelsServiceProxy, PublishOrgsServiceProxy, CreateOrEditPublishOrgDto, CreateOrEditODocDto, ODocsServiceProxy, LabelDto, GetUserInRoleDto, LinkedDocumentsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';
import { DxFormComponent, DxSwitchComponent, DxDateBoxComponent, DxSelectBoxComponent, DxTreeViewComponent } from 'devextreme-angular';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { DxiGroupComponent, DxoPopupComponent } from 'devextreme-angular/ui/nested';
import { Location } from '@angular/common';
import $ from 'jquery';
import { SearchResponseDocumentModalComponent } from './search-response-document/search';
import { Observable } from 'rxjs';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
// import { DocumentHaveNumberExistsComponent } from './documentHaveNumberExists.component';
// import { CreatePublisherComponent } from './createPublisher.component';
declare const exportHTML: any;

@Component({
    templateUrl: './view-outcomming-document.html',
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe] ,
    animations: [appModuleAnimation()]

})
export class ViewOutcommingDocumentComponent extends AppComponentBase implements OnInit{
    @ViewChild('documentForm', {static: true}) documentForm: DxFormComponent;
    @ViewChild('publisherForm', { static: false }) publisherForm: DxFormComponent;
    @ViewChild('anotherInfo', { static: false}) anotherInfo: DxiGroupComponent;
    @ViewChild('content',{ static: true })  content: ElementRef;
    @ViewChild('hanXyLy', { static: true}) hanXyLy: DxDateBoxComponent;
    @ViewChild('incommingDateField', { static: true}) incommingDateField: DxDateBoxComponent;
    @ViewChild('deadlineDateBox', { static: true}) deadlineDateBox: DxDateBoxComponent;
    // @Input('editDocumentId') editDocumentId: number;
    @ViewChild('publisherSelect', { static: true }) publisherSelect: DxSelectBoxComponent;
    @ViewChild('treeView', { static: true }) treeView: DxTreeViewComponent;
    @ViewChild('treeViewDisplay', { static: true }) treeViewDisplay: DxTreeViewComponent;
    @ViewChild('searchResponseDocumentModal', { static: true }) searchResponseDocumentModal: SearchResponseDocumentModalComponent;

    documentData: CreateOrEditODocDto = new CreateOrEditODocDto();
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
    myDate = new Date();
    currentTime :any ;
    link = '';
    error = true;
    endDate:any;
    incommingDate :any;
    isSetData = false;
    numberOfDaysByDocType = 0;
    listReceive: HandlingUser[] = [];
    dataSource = [];
    //lưu index của đơn vị chủ trì
    previousMainHandlingIndex: number;
    //lưu id của đơn vị chủ trì
    previousMainHandlingId: number;
    old_DVXL = [];
    // loại sổ văn bản
    dataBook = [
        { id: 1, name: 'Sổ thường'  },
        { id: 2, name: 'Sổ mật' },
    ];
    data_range = [];
    data_position = [];
    selectedRows = [];
    data_publisher = [];
    data_commBook = [];
    // cấp gửi
    data_groupAuthor = ['CATP', 'Phòng ban', 'Đội', 'Tổ'];
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
    currentDate = new Date();
    nameArr: any[]= [];
    dataDisplay = [];
    tepDinhKemSave = '';
    switchValue = false;
    data_DVXL:any
    textBookOptions: TextBookDto[] = [];
    userId: number;
    signal = "";
    publisherVal: any;
    show = false ;
    chkAutomaticValue = true;
    incommingNumberDisabled = true;
    processingDate: Date;
    bookVal: any;
    secretVal: any;
    priorityVal: any;
    label: Observable<LabelDto>;
    labelDto: LabelDto[] = [];
    receiverPopupVisible = false;
    selectedReceivers = [
        {id: 1, displayName: 'Đơn vị trung ương'}
    ];
    data_receiver = [
        {id: 1, displayName: 'Đơn vị trung ương', selected: true},
        {id: 2, displayName: 'Thành ủy'},
        {id: 3, displayName: 'Ủy ban nhân dân thành phố'},
        {id: 4, displayName: 'Ban tuyên giáo thành ủy'},
    ]
    leaderType = [
        {id: 1, name: 'Ban Giám Đốc CATP'}, {id: 2, name: 'Chỉ huy Phòng'}
    ];
    //danh sách thành viên trong phòng
    editorList
    leaderTypeVal: number;
    chi_huy: GetUserInRoleDto[] = [];
    nguoi_ky = [];
    maDuThaoOptions: any;
    linkedDocOptions: any;
    rangeVal: any;
    selectedResponseDocs = [];
    leaderIdVal: any;
    listDocLink = '';
    documentId: any;
    listDocLinkPrevious = '';
    linkDocumentVal = '';
    currentUser:any;
    constructor(
        injector: Injector,
        private router: Router,
        protected activeRoute: ActivatedRoute,
        private datePipe: DatePipe,
        private _documentTypeAppService: DocumentTypesServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _documentHandlingAppService :DocumentHandlingsServiceProxy,
        // private _priorityAppService: PrioritiesServiceProxy,
        private _dynamicFieldService: DynamicFieldsServiceProxy,
        private _documentHandlingDetailAppService: DocumentHandlingDetailsServiceProxy,
        private _appNavigationService: AppNavigationService,
        private _oDocsServiceProxy: ODocsServiceProxy,
        private _linkedDocumentsProxy: LinkedDocumentsServiceProxy,
        private _activeRoute: ActivatedRoute,
        private _location: Location    ) {
        super(injector);
        this.userId = this.appSession.userId;
        this.uploadUrl = AppConsts.fileServerUrl  + '/fileupload/Upload_file?userId=' + this.userId ;
        this.leaderTypeVal = this.leaderType[0].id;
        this.bookVal = 7;
    }

    getLeaderInDept(){
        this._oDocsServiceProxy.getLeaderInDepartment(this.appSession.organizationUnitId).subscribe(res => {
            this.chi_huy = res;
            for(var i = 0, len = this.chi_huy.length; i < len; i++){
                this.chi_huy[i]["nameWithPosition"] = this.chi_huy[i]["position"] + " - " + this.chi_huy[i]["fullName"];
            }
            // this.documentData.editorId = this.appSession.userId;
        });
    }

    getUserInDept(){
        this._oDocsServiceProxy.getUserInRoleByOrg(this.appSession.organizationUnitId, '').subscribe(res => {
            this.editorList = res;
            for(var i = 0, len = this.editorList.length; i < len; i++){
                if(this.editorList[i]["position"]){
                    this.editorList[i]["nameWithPosition"] = this.editorList[i]["position"] + " - " + this.editorList[i]["fullName"];
                }
                else{
                    this.editorList[i]["nameWithPosition"] = this.editorList[i]["fullName"];
                }
            }
        })
    }

    radio_nguoi_ky(){
        console.log(this.leaderTypeVal)
        if(this.leaderTypeVal == 1){
            this.nguoi_ky =  this.captain_department;
        }
        else if(this.leaderTypeVal == 2){
            this.nguoi_ky = this.chi_huy;
        }
        // console.log(e);
    }

    registerEvents(): void {
        const self = this;
        console.log("vô");
        abp.event.on('app.labelSignalR.label', (message) => {
            console.log("không vô luôn");
            //this._appSessionService.init();
            console.log(message);
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
        this._dynamicFieldService.getDynamicFieldByModuleId(22, this.editDocumentId).subscribe(result => {
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
            this.data_range = result[3].dataSource;
            this.data_position = result[4].dataSource;
            this.secretVal = result[1].dataSource[0].key;
            this.priorityVal = result[2].dataSource[0].key;
        });
        this.getLeaderInDept();
        //this.registerEvents();
        this.initMaDuThaoOptions();
        this.initLinkedDocOptions();
        this.getLeaderInDept();
        this.getUserInDept();
        this._documentTypeAppService.getAllDocumentType().subscribe(result => {
            this.signal = result[0].signal;
            this.documentTypeOptions = result;
        });

        this.link = this.router.url;
        this.processingDate = new Date();

        const Id = this._activeRoute.snapshot.paramMap.get('id');

        if(Id != null){
            this.documentId = Number.parseInt(Id);
            this._oDocsServiceProxy.getODocForEdit(this.documentId).subscribe((res)=>{
                this.documentData = res;
                this.leaderTypeVal = this.documentData.leaderType;
                this.leaderIdVal = this.documentData.leaderId;
                this.secretVal = this.documentData.secretLevel != null ? this.documentData.secretLevel.toString(): null;
                this.rangeVal = this.documentData.range != null ? this.documentData.range.toString() : null;
                this.priorityVal = this.documentData.priority != null ? this.documentData.priority.toString(): null;
                this.linkDocumentVal = this.documentData.linkedDocNumber;

            })

            this.currentUser = abp.session.userId;
            console.log(this.currentUser)
            this._oDocsServiceProxy.updateSeenStatus(this.documentId,this.currentUser).subscribe()
        }
        this._documentAppService.getListPhongBanCATP().subscribe(res =>{
            this.data_department = res;
        });
        // this.documentData.incommingDate = moment(this.currentDate);
        //this.documentData.book = 1;
        this.getIncommingNumber(7);

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
            this.radio_nguoi_ky();
        });
    }

    getIncommingNumber(soVB: number) {
        console.log(soVB);
        this._documentAppService.getNextIncommingNumber(soVB).subscribe(res => {
            this.nextNumber = res;
            console.log(this.nextNumber)
            // this.documentData.incommingNumber = this.nextNumber;
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
                this._documentAppService.deleteDocumentFileInServer(e.data.tepDinhKem, 0).subscribe(() => {});
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

    isValidForm = false;

    checkIncommingNumber(): Promise<any>{
        const promise = new Promise((resolve)=>{
            const self = this;
            if(this.chkAutomaticValue){ // trường hợp tự động
                this.getIncommingNumber(7); // gọi lại hàm lấy số = CurrentValue + 1
                self.error = false;
                resolve(self.error);
            }
            else{
                this._documentAppService.isNumberInBookExisted(this.bookVal, this.nextNumber).subscribe(result => {
                    if(!result){ // chưa tồn tại => lấy số này luôn
                        self.error = false;
                    }
                    resolve(self.error);
                })
            }
        });
        return promise;
    }

    chkAutomatic(e: any){
        this.incommingNumberDisabled = !this.incommingNumberDisabled;
        if(e.value == true){ // nút tự động được chọn
            this.getIncommingNumber(this.bookVal);
        }
    }

    save(): void {
        console.log(this.documentData);
        console.log(this.listDocLink);
        let result = this.documentForm.instance.validate();
        const that = this;
        if(result.isValid){
            this.saving = true;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.isActive = true;
            this.documentData.status = false;
            //this.documentData.action = 1;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
            this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;
            // console.log(this.documentData);
            // console.log(this.documentData.linkedDocument, this.listDocLinkPrevious);
            // this._oDocsServiceProxy.createOrEdit(this.documentData)
            //  .pipe(finalize(() => { this.saving = false;}))
            //  .subscribe((res) => {
            // //  thêm hàm lưu các văn bản liên kết tại đây
            //     if(this.listDocLinkPrevious !== this.documentData.linkedDocument){
            //         this._linkedDocumentsProxy.createMultiLinkedDocument(this.listDocLink, this.documentId).subscribe();
            //     }

            //     this.notify.info(this.l('SavedSuccessfully'));
            //  });
        }
    }

    saveAndTransfer(){
        // this.checkIncommingNumber();
        let result = this.documentForm.instance.validate();
        // this.setListDVXL();
        if(result.isValid){
            this.saving = true;
            this.documentData.isActive = true;
            this.documentData.status = false;
            //this.documentData.action = 3;
            this.documentData.book = this.bookVal;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
            // this.documentData.listDVXL = this.listDVXL_selected;
            this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;

            this._oDocsServiceProxy.createOrEdit(this.documentData)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
             });
        }
    }

    saveAndCreateNew(){
        // this.checkIncommingNumber();
        let result = this.documentForm.instance.validate();
        // this.setListDVXL();
        const that = this;
        if(result.isValid){
            this.saving = true;
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.book = this.bookVal;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            //this.documentData.action = 1;


            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;

            this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;
            // this.documentData.listDVXL = this.listDVXL_selected;

            this._oDocsServiceProxy.createOrEdit(this.documentData)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
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

    getPublishOrg(){
        //this._publishOrgAppService.getAllPublishOrg().subscribe((res)=>{ this.data_publisher_Initial = res; })
    }

    bookSelectionChange(e: any){
        this.getIncommingNumber(e.value);
    }

    changeIncommingDate(e :any){
        if(this.numberOfDaysByDocType == null)
        {
            this.deadLineDate = null;
        }
        else {
            this.deadLineDate = this.addDays(e.value, this.numberOfDaysByDocType);
        }
        // this.documentData.endDate = this.deadLineDate.;
    }

    addDays(val,days: number){
        var date = new Date(val);
        date.setDate(date.getDate()+ days);
        return date;
    }

    // Danh sách xử lý radio value changed
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

    showSearchPopUp(){
        this.receiverPopupVisible = true;
    }
    onSelectionChanged(e: any){
        console.log(this.data_receiver)
        this.data_receiver.forEach(x => {
            if(x["selected"] == true && _.includes(this.selectedReceivers, {id: x.id, displayName: x.displayName}) == false){
                console.log(x);
                this.selectedReceivers.push({id: x.id, displayName: x.displayName});
            }
            else if(x["selected"] == false){
                this.selectedReceivers.slice(this.selectedReceivers.findIndex(a => a.id == x.id), 1);
            }
        });
        console.log(this.selectedReceivers);
    }
    selectReplyDocument(){
        this.searchResponseDocumentModal.show();
    }

    initMaDuThaoOptions(){
        const self = this;
        this.maDuThaoOptions = {
            rtlEnabled: true,
            value: self.chkAutomaticValue,
            onValueChanged: function(e){
                self.incommingNumberDisabled = !self.incommingNumberDisabled;
                if(e.value == true){ // nút tự động được chọn
                    self.getIncommingNumber(self.bookVal);
                }
            }
        }
    }

    getResponseDocuments(list: DocumentsDto[]){
        console.log(list);
        let a = [];
        this.selectedResponseDocs = list;

        list.forEach(x => {
            a.push(x.number);
        });

        // this.documentData.linkedDocument = a.join(';');
    }

    initLinkedDocOptions(){
        const that = this;
        this.linkedDocOptions = {
            acceptCustomValue: true,
            searchEnabled: false,
            noDataText: "",
            valueExpr: 'id',
            displayExpr: 'number',
            dataSource: that.selectedResponseDocs,
            onValueChanged: function(e){
                console.log(e);
            }
        }
    }
}
