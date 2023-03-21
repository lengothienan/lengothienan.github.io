import { Component, Injector, ViewEncapsulation, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, PriorityDto, TextBookDto, DynamicFieldsServiceProxy, DocumentHandlingDetailDto, HandlingUser, DocumentHandlingDetailsServiceProxy, DocumentHandlingsServiceProxy, Comm_booksServiceProxy, ListDVXL, OrgLevelsServiceProxy, PublishOrgsServiceProxy, CreateOrEditPublishOrgDto, CreateOrEditODocDto, ODocsServiceProxy, LabelDto, GetUserInRoleDto, LinkedDocumentsServiceProxy, CreateOrEditLinkedDocumentDto, ReceiverDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';
import { DxFormComponent, DxSwitchComponent, DxDateBoxComponent, DxSelectBoxComponent, DxTreeViewComponent, DxTagBoxComponent } from 'devextreme-angular';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { DxiGroupComponent, DxoPopupComponent } from 'devextreme-angular/ui/nested';
import { Location } from '@angular/common';
import $ from 'jquery';
import { SearchResponseDocumentModalComponent } from './search-response-document/search';
import { Observable } from 'rxjs';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { CreatePublisherComponent } from '@app/main/documentHelper/createPublisher.component';
import { CreateReceiverComponent } from 'app/main/documentHelper/createReceiver.component';
// import { DocumentHaveNumberExistsComponent } from './documentHaveNumberExists.component';
// import { CreatePublisherComponent } from './createPublisher.component';
declare const exportHTML: any;

@Component({
    selector: 'editOutcommingDocument',
    templateUrl: './edit-outcomming-document.html',
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe] ,
    animations: [appModuleAnimation()]

})
export class EditOutcommingDocumentComponent extends AppComponentBase implements OnInit{
    @ViewChild('documentForm', {static: true}) documentForm: DxFormComponent;
    @ViewChild('publisherForm', { static: false }) publisherForm: DxFormComponent;
    @ViewChild('anotherInfo', { static: false}) anotherInfo: DxiGroupComponent;
    @ViewChild('content',{ static: true })  content: ElementRef;
    @ViewChild('hanXyLy', { static: true}) hanXyLy: DxDateBoxComponent;
    @ViewChild('incommingDateField', { static: true}) incommingDateField: DxDateBoxComponent;
    @ViewChild('deadlineDateBox', { static: true}) deadlineDateBox: DxDateBoxComponent;
    // @Input('editDocumentId') editDocumentId: number;
    @ViewChild('treeView', { static: true }) treeView: DxTreeViewComponent;
    @ViewChild('treeViewDisplay', { static: true }) treeViewDisplay: DxTreeViewComponent;
    @ViewChild('searchResponseDocumentModal', { static: true }) searchResponseDocumentModal: SearchResponseDocumentModalComponent;
    @ViewChild('createReceiver', { static: true}) createReceiver: CreateReceiverComponent;
    @ViewChild('orgLevelTagBox', { static: true}) orgLevelTagBox: DxTagBoxComponent;
    @ViewChild('publishOrgTagBox', { static: true}) publishOrgTagBox: DxTagBoxComponent;

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
    publisherVal = [];
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
    selectedReceivers = [];
    data_receiver = [];
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
    listReceivers = [];
    popup_publishType = false;
    publishPlaceList = [
        {id: 1, name: "Chuyển cho VT CATP"}, {id: 2, name:"Chuyển cho VT Phòng"}
    ];
    publishPlaceListVal = 1; //mặc định chuyển VT CATP

    selectedLinkedDocuments = [];
    arr: ReceiverDto[] = [];
    receiverList_Initial = [];
    num = [];
    selectedOrgLevels = [];
    orgLevelSource = [];
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
        this.documentData.isNoneSubmit = false;

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
        if(this.leaderTypeVal == 1){
            this.nguoi_ky =  this.captain_department;
        }
        else if(this.leaderTypeVal == 2){
            this.nguoi_ky = this.chi_huy;
        }
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
        const that = this;
        this._dynamicFieldService.getDynamicFieldByModuleId(22, this.editDocumentId).subscribe(result => {
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
            this.data_range = result[3].dataSource;
            this.data_position = result[4].dataSource;
        });

        this.initMaDuThaoOptions();
        this.initLinkedDocOptions();
        this.getLeaderInDept();
        this.getUserInDept();
        this.getPublishOrg();
        // this._oDocsServiceProxy.getListReceiver().subscribe(res => {
        //     this.data_receiver = res;
        //     this.receiverList_Initial = res;
        //     console.log(this.data_receiver);
        // });
        this._oDocsServiceProxy.getListOrgLevels().subscribe(res => {
            this.orgLevelSource = res;
        })
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
                console.log(res);
                this.documentData = res;
                this.leaderTypeVal = this.documentData.leaderType;
                this.leaderIdVal = this.documentData.leaderId;
                this.secretVal = res.secretLevel != null ? res.secretLevel.toString() : null;
                this.rangeVal = res.range != null ? res.range.toString() : null;
                this.priorityVal = res.priority != null ? res.priority.toString() : null;
                if(res.attachment){
                    this.num = res.attachment.split(';');
                    this.num.forEach((ele)=>{
                        this.selectedRows.push({tepDinhKem: ele});
                        this.tepDinhKemSave = this.selectedRows.map(x => x.tepDinhKem.toString()).join(';');
                    });
                }
                this.selectedOrgLevels = res.orgLevels.split(';');
                this.selectedOrgLevels.forEach(x => {
                    Array.prototype.push.apply(this.publishOrgSource, this.data_receiver.filter(a => a.orgLevelId == x));
                });
            });

            this.currentUser = abp.session.userId;
            console.log(this.currentUser)
            this._oDocsServiceProxy.updateSeenStatus(this.documentId,this.currentUser).subscribe()
            this._oDocsServiceProxy.getReceiversByDocId(this.documentId).subscribe(result => {
                let i = 0;
                result.forEach(x => {
                    ++i;
                    that.selectedReceivers.push({ key: i, text: x.Name, itemData: {id: i, name: x.Name, index: x.ReceicerId, isLocal: x.IsLocal } });
                    that.displayReceiverList.push(x.ReceicerId);
                    let item = new ReceiverDto();
                    item.id = x.ReceicerId;
                    item.isLocal = x.IsLocal;
                    item.name = x.Name;
                    item.index = i;
                    that.arr.push(item);

                });
                this.documentData.receiverId = that.arr;
            });
            this._oDocsServiceProxy.getListLinkedDocumentByODocId(this.documentId).subscribe(result => {
                this.selectedResponseDocs = result.map(x => {return {id: x.linkedDocId, incommingNumber: x.linkedDocNumber}});
                this.selectedLinkedDocuments = result.map(x => {return x.linkedDocId});
            });
        }

        this._documentAppService.getListPhongBanCATP().subscribe(res =>{
            this.data_department = res;
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
            // this.radio_nguoi_ky();
        });
    }

    orgLevelValueChanged(e: any){
        this.publishOrgTagBox.dataSource = [];
        this.publishOrgSource = [];
        console.log(this.selectedOrgLevels);
        this.selectedOrgLevels.forEach(x => {
            Array.prototype.push.apply(this.publishOrgSource, this.data_receiver.filter(a => a.orgLevelId == x));
        });
        // this.publishOrgTagBox.dataSource = list;
        console.log(this.publishOrgSource);
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
                // this.getIncommingNumber(7); // gọi lại hàm lấy số = CurrentValue + 1
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
            // this.getIncommingNumber(this.bookVal);
        }
    }

    save(): void {
        let result = this.documentForm.instance.validate();
        const that = this;
        if(result.isValid){
            //this.saving = true;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.orgEditor = this.appSession.organizationUnitId;
            //this.documentData.action = 1;
            // this.documentData.draftNumber = this.nextNumber;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
            this.documentData.secretLevel = this.secretVal != null? this.secretVal : -1;
            this.documentData.priority = this.priorityVal != null? this.priorityVal : -1;
            this.documentData.range = this.rangeVal != null? this.rangeVal : -1;
            this.documentData.leaderType = this.leaderTypeVal;

            this.documentData.linkedDocumentList.length = 0;
            this.selectedLinkedDocuments.forEach(x => {
                var selectedItem = this.selectedResponseDocs.find(a => a.id == x);
                let temp = new CreateOrEditLinkedDocumentDto();
                temp.linkedDocId = selectedItem.id;
                temp.linkedDocNumber = selectedItem.incommingNumber;
                this.documentData.linkedDocumentList.push(temp);
            });
            this.documentData.orgLevels = this.selectedOrgLevels.join(';');
            this.documentData.receiverId = [];
            this.publishOrgTagBox.instance.option("selectedItems").forEach(x => {
                console.log(x);
                let item = new ReceiverDto();
                item.id = x.id;
                item.name = x.name;
                item.isLocal = x.isLocal;
                this.documentData.receiverId.push(item);
            });
            this._oDocsServiceProxy.updateDraftODoc(this.documentData)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.router.navigate(['/app/main/qlvb/danh-sach-vb-du-thao']);
            });
        }
    }

    saveAndTransfer(){
        this.saving = true;
        this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
        this.documentData.isActive = true;
        this.documentData.status = false;
        //this.documentData.action = 1;
        this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
        this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
        this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;
        this.documentData.range = this.rangeVal != null? this.rangeVal : -1;
        this.documentData.leaderType = this.leaderTypeVal;

        this._oDocsServiceProxy.updateDraftODoc(this.documentData)
            .pipe(finalize(() => { this.saving = false;}))
            .subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            });
            this._oDocsServiceProxy.oDocSaveAndTransferToCATP(this.documentId)
            .pipe(finalize(()=>{this.popup_publishType = false;}))
            .subscribe(()=>{
                this.message.success('Chuyển Phát hành thành công');
                this.router.navigate(['/app/main/qlvb/danh-sach-vb-cho-cho-so']);
            });

    }

    linkedDocValueChanged(e){
        this.selectedLinkedDocuments = [];
        this.selectedLinkedDocuments = e.value;
    }

    showPublishType(){
        let result = this.documentForm.instance.validate();
        if(result.isValid){
            this.popup_publishType = true;
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
        //this.publisherPopupVisible = true;
        this.createReceiver.show();
    }

    // savepublisher(){
    //     // this.data_publisher.push({ id: this.data_publisher.length,  name: this.publisherData["name"] });
    //     // console.log(this.publisherForm.formData.publisherName);
    //     this._dynamicFieldService.createFieldForPublisher(this.publisherForm.formData.publisherName).subscribe((res) => {
    //         this.publisherPopupVisible = false;
    //         // $('#publisherSelect').dxSelectBox('instance').repaint();
    //         this.data_publisher = res;
    //         this.publisherSelect.instance.repaint();
    //         this.resetForm();
    //     })

    //     // this.publisherSelect.
    // }
    publishOrgSource = [];
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
        this._oDocsServiceProxy.getListPublishOrgs().subscribe((res)=>{
            this.data_receiver = res;
            this.selectedOrgLevels.forEach(x => {
                Array.prototype.push.apply(this.publishOrgSource, this.data_receiver.filter(a => a.orgLevelId == x));
            });
        });
    }

    // bookSelectionChange(e: any){
    //     this.getIncommingNumber(e.value);
    // }

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
        this.treeView.dataSource = [];
        this.treeView.dataSource = this.receiverList_Initial;
        this.receiverPopupVisible = true;
    }
    onSelectionChanged(e: any){
        const that = this;
        this.selectedReceivers.length = 0;
        let list = this.treeView.instance.getNodes();
        list.forEach(item => {
            if(item.selected == true){
                let arr = item["items"];
                arr.forEach(function(i, index, object) {
                    that.selectedReceivers.push(i);
                });
            }
            else if(item.expanded == true){
                let arr = item["items"];
                arr.forEach(function(i, index, object) {
                    if(i.selected == true){
                        that.selectedReceivers.push(i);
                    }
                });

            }
        });
    }
    displayReceiverList = [];

    saveReceiveList(){
        let arr = [];
        this.displayReceiverList.length = 0;
        this.selectedReceivers.forEach(x => {
            this.displayReceiverList.push(x.key);
            let item = new ReceiverDto();
            item.id = x.itemData.index;
            item.isLocal = x.itemData.isLocal;
            item.name = x.itemData.name;
            item.index = x.itemData.id;
            arr.push(item);
        });
        this.documentData.receiverId = arr;
        this.receiverPopupVisible = false;
    }
    closePopUp(){
        this.receiverPopupVisible = false;
    }

    placeReceivesValueChanged(e: any){
        const that = this;
        let arr = this.arr_diff(e.value, e.previousValue);
        arr.forEach(x => {
            let t = that.arr.findIndex(y => y.index == x);
            let u = that.selectedReceivers.find(i => i.key == x);
            if(e.value.length < e.previousValue.length){
                that.documentData.receiverId.splice(t, 1);
                that.selectedReceivers.splice(that.selectedReceivers.findIndex( z => z.id == u.id), 1);
            }
            else {
                let item = new ReceiverDto();
                item.id = u.itemData.index;
                item.isLocal = u.itemData.isLocal;
                item.name = u.itemData.name;
                item.index = u.itemData.id;
                this.documentData.receiverId.push(item);
            }
        });
        this.treeView.dataSource = [];

        let source = [...this.receiverList_Initial];
        for(let i = 0, len = source.length; i < len; i++){
            let arr = source[i];
            arr.items.forEach(x => {
                let temp = that.displayReceiverList.find(r => r == x.id);
                if(temp){
                    x.selected = true;
                }
                else{
                    arr.selected = false;
                    x.selected = false;
                }
            });
        }
        console.log(source)
        this.treeView.dataSource = source;

    }

    selectReplyDocument(){
        this.searchResponseDocumentModal.show();
    }
    maDuThaoChkBoxOptions: any;
    initMaDuThaoOptions(){
        const self = this;
        this.maDuThaoOptions = {
            rtlEnabled: true,
            disabled: true,
            readOnly: true
        }
    }

    initMaDuThaoChkBoxOptions(){
        const that = this;
        this.maDuThaoChkBoxOptions = {
            value: true,
            readOnly: true
        }
    }

    getResponseDocuments(list: DocumentsDto[]){
        //lưu id
        this.selectedResponseDocs.length = 0;
        this.selectedLinkedDocuments.length = 0;
        let listId = [];
        //lưu number
        let listNumber = [];

        if(list.length > 0){
            this.documentData.linkedDocumentList = [];
            this.selectedResponseDocs = list;
            list.forEach(x => {
                listId.push(x.id);
                listNumber.push(x.incommingNumber);
                let temp = new CreateOrEditLinkedDocumentDto();
                temp.linkedDocId = x.id;
                temp.linkedDocNumber = x.incommingNumber;
                this.selectedLinkedDocuments.push(x.id);
                this.documentData.linkedDocumentList.push(temp);
            });
        }
        // this.linkDocumentVal = listNumber.join(';');
        // this.documentData.linkedDocument = listId.join(';');
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

    saveAndTransferToVT(){
        let result = this.documentForm.instance.validate();
        if(result.isValid){
            this.saving = true;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.orgEditor = this.appSession.organizationUnitId;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
            this.documentData.leaderType = this.leaderTypeVal;
            this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;
            this._oDocsServiceProxy.createAndTransferODoc(1, this.documentData)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {

                this.notify.info(this.l('SavedSuccessfully'));
                this.router.navigate(['/app/main/qlvb/danh-sach-vb-du-thao']);
            });
        }
    }
}
