import { ODocsServiceProxy, CreateOrEditLinkedDocumentDto, CreateOrEditODocDto, ReceiverDto, PublishOrgsServiceProxy } from '@shared/service-proxies/service-proxies';
// import { DataSource } from 'devextreme/data/data_source';
import { Comm_bookDto } from './../../../../../shared/service-proxies/service-proxies';
import { Component, Injector, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RoutesRecognized } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, PriorityDto, TextBookDto, SessionServiceProxy, DynamicFieldsServiceProxy, HistoryUploadsServiceProxy, DocumentHandlingDetailDto, HandlingUser, DocumentHandlingDetailsServiceProxy, DocumentHandlingsServiceProxy, OrganizationUnitServiceProxy, Comm_booksServiceProxy, LabelDto, ListDVXL, CreateDocumentDto } from '@shared/service-proxies/service-proxies';
import { finalize, filter, pairwise } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
// import { TransferHandleModalComponent } from '../transfer-handle/transfer-handle-modal';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';
import { DxFormComponent, DxDateBoxComponent, DxSelectBoxComponent, DxTextBoxComponent, DxTreeViewComponent, DxTagBoxComponent } from 'devextreme-angular';
import { DxiGroupComponent, DxoPopupComponent } from 'devextreme-angular/ui/nested';
import { Location } from '@angular/common';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { Observable } from 'rxjs';
import * as $ from 'jquery';
import { SearchResponseDocumentModalComponent } from '../../oDocs/search-response-document/search';
import { CreateReceiverComponent } from 'app/main/documentHelper/createReceiver.component';
// import { ReportDocumentModalComponent } from '../../report_document/report-document-modal';
//import * as jsPDF from 'jspdf';
declare const exportHTML: any;

@Component({
    selector: 'suavbdi',
    templateUrl: './sua-vb-di.component.html',
    styleUrls: ['./sua-vb-di.component.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe] ,
    animations: [appModuleAnimation()]

})
export class SuaVbDiComponent extends AppComponentBase {
    @ViewChild('documentForm', {static: true}) documentForm: DxFormComponent;
    @ViewChild('publisherForm', { static: false }) publisherForm: DxFormComponent;
    @ViewChild('anotherInfo', { static: false}) anotherInfo: DxiGroupComponent;
    @ViewChild('content',{ static: true })  content: ElementRef;
    @ViewChild('hanXyLy', { static: true}) hanXyLy: DxDateBoxComponent;
    @ViewChild('incommingDateField', { static: true}) incommingDateField: DxDateBoxComponent;
    @ViewChild('deadlineDateBox', { static: true}) deadlineDateBox: DxDateBoxComponent;
    // @Input('editDocumentId') editDocumentId: number;
    // @ViewChild('publisherSelect', { static: true }) publisherSelect: DxSelectBoxComponent;
    @ViewChild('bookSelect', { static: true}) bookSelect: DxSelectBoxComponent;
    @ViewChild('documentTypeSelect', { static: true}) documentTypeSelect: DxSelectBoxComponent;
    @ViewChild('maDuThaoTxtBx', { static: true}) maDuThaoTxtBx: DxTextBoxComponent;
    @ViewChild('treeView', { static: true }) treeView: DxTreeViewComponent;
    @ViewChild('searchResponseDocumentModal', { static: true }) searchResponseDocumentModal: SearchResponseDocumentModalComponent;
    @ViewChild('orgLevelTagBox', { static: true}) orgLevelTagBox: DxTagBoxComponent;
    @ViewChild('publishOrgTagBox', { static: true}) publishOrgTagBox: DxTagBoxComponent;
    @ViewChild('createReceiver', { static: true}) createReceiver: CreateReceiverComponent;
    @ViewChild('linkedDocTagBox', { static: true }) linkedDocTagBox: DxTagBoxComponent;

    documentData: CreateOrEditODocDto = new CreateOrEditODocDto();
    // editDocumentId = 0;
    publisherData: any;
    publisherPopupVisible = false;
    documentTypeDataSource: DocumentTypeDto[] = [];
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
    dataBook: Comm_bookDto[] = [];
    data_range = [];
    data_position = [];
    selectedRows = [];
    data_publisher = [];
    data_commBook = [];
    testStyle='{"color" : "red", "font-size": "30px"}';
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
    currentDate : Date;
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
    maDuThaoDisabled = true;
    isNumberDisabled = false;
    bookVal: any;
    secretVal: any;
    priorityVal: any;
    rangeVal: any;
    positionVal: any;
    // isVisible = true;
    label: Observable<LabelDto>;
    labelDto: LabelDto[] = [];
    listDVXL_selected: ListDVXL[] = [];
    receiverPopupVisible = false;
    // buttonVisible = false;
    data_receiver = [];
    selectedReceivers = [];
    currentSyntax: string;
    currentNumberInBook: string;
    currentNumber = "";
    oldNumber = "";
    soKyHieu: string;
    chkAutomaticNumberValue = false;
    oldDocType = "";
    currentDocType = "";
    selectedDocType = "";
    oldSelectedDocType = "";
    selectedBookVal: any;

    oldRangeVal = "";
    currentRangeVal = "";
    selectedRangeVal = "";
    documentTypeOptions: any;
    rangeOptions: any;
    draftNumBerOptions: any;
    isDraftNumberDisabled = false;
    draftNumBerChkBoxOptions: any;
    chi_huy = [];
    editorList: any;
    isReadOnlyForm = false;
    leaderType = [
        {id: 1, name: 'Ban Giám Đốc CATP'}, {id: 2, name: 'Chỉ huy Phòng'}
    ];
    leaderTypeVal: number;
    nguoi_ky = [];
    linkDocumentVal: any;
    linkedDocOptions: any;
    selectedResponseDocs = [];
    numberChBkValue = false;
    selectedLinkedDocuments = [];
    docId: number;
    arr: ReceiverDto[] = [];
    orgLevelSource = [];
    num = [];
    publishOrgSource = [];

    btnPrint:any=false;
    selectedOrgLevels = [];
    selectedDocumentData: any;
    header = "Sửa VB đi và cho số";
    isNotCATP = false;
    isNotEdited = false;
    selfOrg: number;
    releaseDateOptions: any;
    displayReceiverList = [];
    isCompetent:boolean = false;
    competentOfLeaderList = [
        {id: 0, name: 'Không có'}, {id: 1, name: 'Thừa lệnh, Thừa uỷ quyền'}
    ];
    numberOptions: any;
    bookOptions: any;
    currentUser:any;
    irector_list = [];

    editorTypeConpetent: any;
    editorOptionsConpetent: any;
    dataFieldConpetent: any;

    editorTypeSigner: any;
    editorOptionsSigner: any;
    dataFieldSigner: any;

    dataFieldLeaderCompetent: any;

    leaderCompetentVal:any;
    isDepartment = false;
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
        private _commBookServiceProxy: Comm_booksServiceProxy,
        private _oDocServiceProxy: ODocsServiceProxy,
        private _publishOrgServiceProxy: PublishOrgsServiceProxy,
        private utility: UtilityService,
        private _location: Location    ) {
        super(injector);
        this.userId = this.appSession.userId;
        const that = this;
        this.uploadUrl = AppConsts.fileServerUrl  + '/fileupload/Upload_file?userId=' + this.userId ;

        this.leaderTypeVal = this.leaderType[0].id;
        if(!this.appSession.isCATP){
            this.header = "Thêm mới VB gửi các đơn vị khác";
        }
        this.currentDate = new Date();
        this._commBookServiceProxy.getAllCommBookInDepartment("2", this.appSession.isCATP? this.appSession.selfOrganizationUnitId: this.appSession.organizationUnitId).subscribe(result => {
            console.log(result);
            this.dataBook = result;
            for(let i = 0, len = this.dataBook.length; i < len; i++){
                if(result[i].isDefault){
                    that.documentData.book = this.dataBook[i].id;
                    break;
                }
            }
        });
        this._dynamicFieldService.getDynamicFieldByModuleId(22, 0).subscribe(result => {
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
            this.data_range = result[3].dataSource;
            this.data_position = result[4].dataSource;
        });
        this._oDocServiceProxy.getListOrgLevels().subscribe(res => {
            this.orgLevelSource = res;
        });
    }

    registerEvents(): void {
        const self = this;
        abp.event.on('app.labelSignalR.label', (message) => {
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
        //this.registerEvents();
        const that = this;
        const Id = this.activeRoute.snapshot.paramMap.get('id');
        this.documentData.linkedDocumentList = [];
        this.selectedResponseDocs = [];
        this.initReleaseDateOptions();
        // this.documentData.releaseDate = moment();
        if(this.utility.selectedDocumentData != null && this.utility.selectedDocumentData != undefined){
            this.selectedDocumentData = this.utility.selectedDocumentData;
            if(this.selectedDocumentData.id > 0){
                this.docId = this.selectedDocumentData.id;
                this.documentData.documentTypeId = this.selectedDocumentData.documentTypeId;
                this.documentData.range = this.selectedDocumentData.range;
                this.documentData.priority = this.selectedDocumentData.priority;
                this.documentData.secretLevel = this.selectedDocumentData.secretLevel;
                this.documentData.summary = this.selectedDocumentData.summary;
                this.documentData.leaderId = this.selectedDocumentData.leaderId;
                this.documentData.processingRecommended = this.selectedDocumentData.processingRecommended;
                // this.documentData.releaseDate = moment();
                this.selectedOrgLevels.push(this.selectedDocumentData.orgLevels);
                this.displayReceiverList.push(this.selectedDocumentData.publisher);
            }
            else if(this.selectedDocumentData.Id > 0) {
                this.docId = this.selectedDocumentData.Id;
                this.documentData.id=this.selectedDocumentData.Id;
                this.documentData.documentTypeId = this.selectedDocumentData.DocumentTypeId;
                this.documentData.range = this.selectedDocumentData.Range;
                this.documentData.priority = this.selectedDocumentData.Priority;
                this.documentData.secretLevel = this.selectedDocumentData.SecretLevel;
                this.documentData.summary = this.selectedDocumentData.Summary;
                this.documentData.leaderId = this.selectedDocumentData.LeaderId;
                this.documentData.processingRecommended = this.selectedDocumentData.ProcessingRecommended;
                // this.documentData.releaseDate = this.selectedDocumentData.;
                this.selectedOrgLevels.push(this.selectedDocumentData.OrgLevels);
                this.displayReceiverList.push(this.selectedDocumentData.Publisher);
            }

            this.documentData.receiverId = [];
            this.displayReceiverList.length = 0;
            this._oDocServiceProxy.getReceiversByDocId(this.docId).subscribe(result => {
                result.forEach(x => {
                    that.displayReceiverList.push(x.ReceicerId);
                    let item = new ReceiverDto();
                    item.id = x.ReceicerId;
                    item.isLocal = x.IsLocal;
                    item.name = x.Name;
                    that.arr.push(item);

                });
                this.documentData.receiverId = that.arr;
            });
            if(this.selectedDocumentData.ReplyId != null && this.selectedDocumentData.ReplyId !== undefined){ // nếu có phúc đáp VB
                console.log(this.selectedDocumentData.ReplyId)
                this.selectedResponseDocs.push({id: this.selectedDocumentData.ReplyId, number: this.selectedDocumentData.ReplyNumber});
                this.selectedLinkedDocuments.push(this.selectedDocumentData.ReplyId);
                let temp = new CreateOrEditLinkedDocumentDto();
                temp.linkedDocId = this.selectedDocumentData.ReplyId;
                temp.linkedDocNumber = this.selectedDocumentData.ReplyNumber;
                this.documentData.linkedDocumentList.push(temp);
            }
            else if(this.selectedDocumentData.ReplyId == undefined){ // nếu từ CATP phúc đáp VB đến
                this.selectedResponseDocs.push({id: this.selectedDocumentData.id, number: this.selectedDocumentData.number});
                this.selectedLinkedDocuments.push(this.selectedDocumentData.id);
                let temp = new CreateOrEditLinkedDocumentDto();
                temp.linkedDocId = this.selectedDocumentData.id;
                temp.linkedDocNumber = this.selectedDocumentData.number;
                this.documentData.linkedDocumentList.push(temp);
            }
            this.documentData.orgEditor = this.selectedDocumentData.orgEditor;
            this.isNotEdited = true;
        }
        else {


            this.documentData.releaseDate = moment();
            if(this.appSession.isCATP){
                this.selfOrg = this.appSession.selfOrganizationUnitId;
            }
            else { // trường hợp phòng ban/ quận
                this.selfOrg = this.appSession.organizationUnitId;
                this.documentData.orgEditor = this.selfOrg;
                this.isNotEdited = true;
            }
        }
        this.initNumberOptions();
        this.initDocumentTypeOptions();
        this.getUserInDept();
        this.getLeaderInDept();
        this.getPublishOrg();

        if(Id != null && Id != undefined){
            this.docId = parseInt(Id);
            this.isReadOnlyForm = true;
            // this._oDocServiceProxy.getODocForEdit(this.docId).subscribe(res => {
            //     this.documentData = res;
            //     this.secretVal = res.secretLevel != null ? res.secretLevel.toString() : null;
            //     this.rangeVal = res.range != null ? res.range.toString() : null;
            //     this.priorityVal = res.priority != null ? res.priority.toString() : null;
            //     this.leaderTypeVal = this.documentData.leaderType;
            //     this.isReadOnlyForm = true;
            //     this.linkDocumentVal = that.documentData.linkedDocNumber;
            //     this.tepDinhKemSave = this.selectedRows.map(x => x.tepDinhKem.toString()).join(';');
            //     debugger
            //     //this.selectedOrgLevels= [1,2]//res.orgLevels.split(',').map(Number);
            //     console.log(res)
            //     // this.documentData.releaseDate = moment();
            //     if(res.attachment){
            //         this.num = res.attachment.split(';');
            //         this.num.forEach((ele)=>{
            //             this.selectedRows.push({tepDinhKem: ele});
            //             this.tepDinhKemSave = this.selectedRows.map(x => x.tepDinhKem.toString()).join(';');
            //         });
            //     }
            //     this.selectedOrgLevels = res.orgLevels.split(';');
            //     this.selectedOrgLevels.forEach(x => {
            //         Array.prototype.push.apply(this.publishOrgSource, this.data_receiver.filter(a => a.orgLevelId == x));
            //     });

            //     this._oDocServiceProxy.getUserInRoleByOrg(res.orgEditor, '').subscribe(res => {
            //         this.editorList = res;
            //         for(var i = 0, len = this.editorList.length; i < len; i++){
            //             if(this.editorList[i]["position"]){
            //                 this.editorList[i]["nameWithPosition"] = this.editorList[i]["position"] + " - " + this.editorList[i]["fullName"];
            //             }
            //             else{
            //                 this.editorList[i]["nameWithPosition"] = this.editorList[i]["fullName"];
            //             }
            //         }
            //     });

            // });
            this._oDocServiceProxy.getReceiversByDocId(this.docId).subscribe(result => {
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
            this._oDocServiceProxy.getListLinkedDocumentByODocId(this.docId).subscribe(result => {
                this.selectedResponseDocs = result.map(x => {return {id: x.linkedDocId, number: x.linkedDocNumber}});
                this.selectedLinkedDocuments = result.map(x => {return x.linkedDocId});
            });

            this.currentUser = abp.session.userId;
            this._oDocServiceProxy.updateSeenStatus(this.docId,this.currentUser).subscribe()
            this.leaderCompetentFunc()
        }
        else {
            this.leaderCompetentFunc()
            this.documentData.orgEditor = this.appSession.selfOrganizationUnitId;
            this.getUserInDept();
            this.documentData.releaseDate = moment();
        }

        this._documentHandlingAppService.getLeaderList_PB().subscribe(res => {
            this.captain_department = res;
            for(var i = 0, len = this.captain_department.length; i < len; i++){
                this.captain_department[i]["nameWithPosition"] = this.captain_department[i]["position"] + " - " + this.captain_department[i]["fullName"];
            }
        });

        this.link = this.router.url;

        this._documentAppService.getListDepartment(8).subscribe(res =>{
            this.data_department = res;
        });
        this._documentHandlingAppService.getLeaderList_PGD().subscribe(res => {
            this.director_list = res;
            // this.director_list = res.filter(e => e.organizationUnitId == 50);
            //console.log(res);
            for (var i = 0, len = this.director_list.length; i < len; i++) {

                this.director_list[i]["nameWithPosition"] = this.director_list[i]["position"] + " - " + this.director_list[i]["fullName"];
            }
        });
    }

    orgLevelValueChanged(){
        this.publishOrgTagBox.dataSource = [];
        this.publishOrgSource = [];
        this.selectedOrgLevels.forEach(x => {
            Array.prototype.push.apply(this.publishOrgSource, this.data_receiver.filter(a => a.orgLevelId == x));
        });
    }

    getPublishOrg(){
        this._publishOrgServiceProxy.getPublishOrgByUserLogin(this.appSession.organizationUnitId).subscribe((res)=>{
            this.data_receiver = res.data;
            this.orgLevelValueChanged();
        });
    }
    
    async getODocListForEdit() {
        const self = this;
        let promise = new Promise(function (resolve, reject) {
            self._oDocServiceProxy.getODocForEdit(self.docId).subscribe(res => {
                self.documentData = res;
                self.secretVal = res.secretLevel != null ? res.secretLevel.toString() : null;
                self.rangeVal = res.range != null ? res.range.toString() : null;
                self.priorityVal = res.priority != null ? res.priority.toString() : null;
                self.leaderTypeVal = self.documentData.leaderType;
                self.isReadOnlyForm = true;
                self.linkDocumentVal = self.documentData.linkedDocNumber;
                self.tepDinhKemSave = self.selectedRows.map(x => x.tepDinhKem.toString()).join(';');
                // this.documentData.releaseDate = moment();
                if(res.attachment){
                    self.num = res.attachment.split(';');
                    self.num.forEach((ele)=>{
                        self.selectedRows.push({tepDinhKem: ele});
                        self.tepDinhKemSave = self.selectedRows.map(x => x.tepDinhKem.toString()).join(';');
                    });
                }
                self.selectedOrgLevels = res.orgLevels.split(';');
                self.selectedOrgLevels.forEach(x => {
                    Array.prototype.push.apply(self.publishOrgSource, self.data_receiver.filter(a => a.orgLevelId == x));
                });

                self._oDocServiceProxy.getUserInRoleByOrg(res.orgEditor, '').subscribe(res => {
                    self.editorList = res;
                    for(var i = 0, len = self.editorList.length; i < len; i++){
                        if(self.editorList[i]["position"]){
                            self.editorList[i]["nameWithPosition"] = self.editorList[i]["position"] + " - " + self.editorList[i]["fullName"];
                        }
                        else{
                            self.editorList[i]["nameWithPosition"] = self.editorList[i]["fullName"];
                        }
                    }
                });
                resolve(self.documentData);
            });


        });
        return promise
    }

    async getBGDList() {
        const self = this;
        let promise = new Promise(function (resolve, reject) {
            self._documentHandlingAppService.getLeaderList_PGD().subscribe(res => {
                self.director_list = res;

                for (var i = 0, len = self.director_list.length; i < len; i++) {

                    self.director_list[i]["nameWithPosition"] = self.director_list[i]["position"] + " - " + self.director_list[i]["fullName"];
                }
                resolve(self.director_list);
            }
            );


        });
        return promise
    }

    async getRoleGroup(userId:any) {
        const self = this;
        let promise = new Promise(function (resolve, reject) {
            self._oDocServiceProxy.getRoleGroup(userId).subscribe(res => {
                
                resolve(res);
            }
            );


        });
        return promise
    }


    onContentReady = async (e) => {
        const Id = this.activeRoute.snapshot.paramMap.get('id');
        let d: any = document.getElementsByClassName("signer-catp");
        let t: any = document.getElementsByClassName("signer-not-catp");
        let k: any = document.getElementsByClassName("signer-catp-id");
        let l: any = document.getElementsByClassName("signer-not-catp-id");
        if (Id != null && Id != undefined) {
            d[0].style.display = "none";
            t[0].style.display = "none";
            let isCATP: any = this.appSession.isCATP
            await this.getBGDList();
            await this.getODocListForEdit()
            let roleGroup: any = await this.getRoleGroup(this.documentData.creatorUserId)
            let notCATP:any;   
            if (isCATP == false) {
                k[0].style.display = "none";
                l[0].style.display = "unset"

            } else {
                k[0].style.display = "unset";
                l[0].style.display = "none";
                
                if (roleGroup == 'CATP') {
                    notCATP = false;
                    await this.editorTypeSignerFunc(notCATP)
                    this.leaderCompetentVal = this.documentData.leaderId;
                } else if(roleGroup == 'PHONG'|| roleGroup == 'DOI') {
                    notCATP = true;
                    await this.editorTypeSignerFunc(notCATP);
                    this.leaderCompetentVal = "";
                    this.isDepartment = true;
                    await this.leaderCompetentFunc();

                }
            }
        } else {
            k[0].style.display = "none";
            l[0].style.display = "none";
            let isCATP: any = this.appSession.isCATP            
            await this.getBGDList();        
            if (isCATP == false) {

                d[0].style.display = "none";
                t[0].style.display = "unset"

            } else {
                d[0].style.display = "unset";
                t[0].style.display = "none"
            }
        }



    }

    editorTypeSignerFunc = async (e: any) => {
        const self = this;      

        if (e == false) {
            self.editorTypeSigner = "dxSelectBox"
            self.dataFieldSigner = "leaderNotCompetent"
            self.dataFieldLeaderCompetent="leaderId"

        } else {
            self.editorTypeSigner = "dxTextBox";
            self.dataFieldSigner = "leaderId"
            self.dataFieldLeaderCompetent=""
        }
    }

    async leaderCompetentFunc() {
        const self = this;
        self.dataFieldConpetent = "competentOfLeader"
        self.editorTypeConpetent = "dxSelectBox";
        self.editorOptionsConpetent = {
            dataSource: self.competentOfLeaderList,
            valueExpr: 'id',
            displayExpr: 'name',
            searchEnabled: true,
            value: self.documentData.competentOfLeader,
            disabled: self.isDepartment,
            onValueChanged: (e) => {

                if(e.previousValue!=null) {
                    if (e.value != 0) {
                        self.isCompetent = true;
                        self.documentData.leaderNotCompetent = null;
                    } else {
                        self.isCompetent = false;
                        self.documentData.leaderId = null;
                        self.leaderCompetentVal = null;
                    }
                }else{
                    if (e.value != 0) {
                        self.isCompetent = true;
                       
                    } else {
                        self.isCompetent = false;
                    }
                }               
            },
            placeholder: 'Không có',
            dropDownOptions: {
                minWidth: 400
            }
        }
    }


    initBookOptions(){
        const self = this;
        this.bookOptions = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                  const promise = new Promise((resolve, reject) => {
                    self._commBookServiceProxy.getAllCommBookInDepartment("2", this.appSession.organizationUnitId).subscribe(result => {
                        self.dataBook = result;
                        console.log(result);
                        for(let i = 0, len = self.dataBook.length; i < len; i++){
                            if(result[i].isDefault){
                                self.documentData.book = self.dataBook[i].id;
                                break;
                            }
                        }
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
            searchExpr: 'name',
            disabled: self.isReadOnlyForm,
            onValueChanged: function(e){
                let curBook = self.dataBook.find(x => x.id == e.value);
                self.currentSyntax = curBook["syntax"];
                self.currentNumberInBook = curBook["syntax"];
                if(self.currentSyntax.includes("{currentValue}") && self.numberChBkValue){
                    let x = self.dataBook.find(x => x.id == e.previousValue);
                    if(x){
                        self.oldNumber = (parseInt(x.currentValue) + 1).toString();
                    }
                    else {
                        self.oldNumber = "{currentValue}";
                    }
                    self.currentNumberInBook = (parseInt(curBook.currentValue) + 1).toString();
                    self.documentData.number = self.currentNumberInBook;
                }

                if(self.currentSyntax.includes("{documentType}") && self.numberChBkValue){
                    if(!self.documentData.documentTypeId){
                        self.chkAutomaticNumberValue = false;
                        self.notify.warn("Chọn Loại VB");
                        self.soKyHieu = "";
                        return;
                    }
                    let selectedDocType = self.documentTypeDataSource.find(x => x.id == self.documentData.documentTypeId).signal;
                    self.currentNumberInBook = self.currentNumberInBook.replace("{documentType}", selectedDocType);
                }

                if(self.currentSyntax.includes("{range}")){ // lĩnh vực
                    if(!self.documentData.range){
                        self.chkAutomaticNumberValue = false;
                        self.notify.warn("Chọn Lĩnh vực");
                        self.soKyHieu = "";
                        return;
                    }

                    self.currentNumberInBook = self.currentNumberInBook.replace("{range}", self.data_range.find(x => x.key == self.documentData.range).value);
                }

                if(self.currentSyntax.includes("{publisher}")){
                    self.currentNumberInBook = self.currentNumberInBook.replace("{publisher}", self.data_department.find(x => x.id == self.documentData.orgEditor).shortentCode);
                }
            }
        };
    }

    onComBookValueChanged(e){
        if(this.numberChBkValue){
            let curBook = this.dataBook.find(x => x.id == parseInt(e.value));
            this.currentSyntax = curBook["syntax"];
            this.currentNumberInBook = curBook["syntax"];
            if(this.currentSyntax.includes("{currentValue}")){
                let x = this.dataBook.find(x => x.id == e.previousValue);
                if(x){
                    this.oldNumber = (parseInt(x.currentValue) + 1).toString();
                }
                else {
                    this.oldNumber = "{currentValue}";
                }
                this.currentNumberInBook = (parseInt(curBook.currentValue) + 1).toString();
                this.documentData.number = this.currentNumberInBook;
            }

            if(this.currentSyntax.includes("{documentType}")){
                if(!this.documentData.documentTypeId){
                    this.chkAutomaticNumberValue = false;
                    this.notify.warn("Chọn Loại VB");
                    this.soKyHieu = "";
                    return;
                }
                let selectedDocType = this.documentTypeDataSource.find(x => x.id == this.documentData.documentTypeId).signal;
                console.log(selectedDocType);
                this.currentNumberInBook = this.currentNumberInBook.replace("{documentType}", selectedDocType);
            }

            //publisher : Phòng ban soạn

            if(this.currentSyntax.includes("{range}")){ // lĩnh vực
                if(!this.documentData.range){
                    this.chkAutomaticNumberValue = false;
                    this.notify.warn("Chọn Lĩnh vực");
                    this.soKyHieu = "";
                    return;
                }

                this.currentNumberInBook = this.currentNumberInBook.replace("{range}", this.data_range.find(x => x.key == this.documentData.range).value);
            }

            if(this.currentSyntax.includes("{publisher}")){
                this.currentNumberInBook = this.currentNumberInBook.replace("{publisher}", this.data_department.find(x => x.id == this.documentData.orgEditor).shortentCode);
            }
        }

    }

    initNumberOptions() {
        const self = this;
        this.numberOptions = {
            value: self.numberChBkValue,
            disabled: this.isReadOnlyForm,
            onValueChanged: function (e) {
                self.isNumberDisabled = !self.isNumberDisabled;
                if(e.value == true){ // nút tự động được chọn
                    let curBook = self.dataBook.find(x => x.id == self.documentData.book);
                    self.currentSyntax = curBook.syntax;
                    if(self.currentSyntax.includes("{currentValue}")){
                        self.soKyHieu = self.currentSyntax.replace("{currentValue}", (parseInt(curBook.currentValue) + 1).toString());
                    }
                    if(self.currentSyntax.includes("{documentType}")){
                        if(!self.documentData.documentTypeId){
                            self.chkAutomaticNumberValue = false;
                            self.notify.warn("Chọn Loại VB");
                            self.soKyHieu = "";
                            return;
                        }
                        let selectedDocType = self.documentTypeDataSource.find(x => x.id == self.documentData.documentTypeId).signal;
                        self.soKyHieu = self.soKyHieu.replace("{documentType}", selectedDocType);
                    }
                    if(self.currentSyntax.includes("{range}")){ // lĩnh vực
                        if(!self.documentData.range){
                            self.chkAutomaticNumberValue = false;
                            self.notify.warn("Chọn Lĩnh vực");
                            self.soKyHieu = "";
                            return;
                        }

                        self.soKyHieu = self.soKyHieu.replace("{range}", self.data_range.find(x => x.key == self.documentData.range).value);
                    }
                    if(self.currentSyntax.includes("{publisher}")){
                        self.soKyHieu = self.soKyHieu.replace("{publisher}", self.data_department.find(x => x.id == self.documentData.orgEditor).shortentCode);
                    }
                }
                self.documentData.number = self.soKyHieu;
            }
        };
    }

    initDocumentTypeOptions(){
        const self = this;
        this.documentTypeOptions = {
            valueExpr: 'id',
            displayExpr: 'typeName',
            searchEnabled: true,
            searchExpr: ['typeName', 'signal'],
            showClearButton: true,
            readOnly: self.isReadOnlyForm,
            dataSource: {
                loadMode: 'raw',
                load: function () {
                  const promise = new Promise((resolve, reject) => {
                    self._documentTypeAppService.getAllDocumentType().subscribe(result => {
                        self.signal = result[0].signal;
                        self.documentTypeDataSource = result;
                        resolve(result);
                    }, err => {
                        reject(err);
                    });
                  });
                  return promise;
                }
            }
        };
    }

    initRangeOptions(){
        const self = this;
        this.rangeOptions = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                    console.log(self.data_range)
                    return self.data_range;
                }
            },
            valueExpr: 'key',
            displayExpr: 'value',
            searchEnabled: true,
            searchExpr: 'value',
            showClearButton: true,
            readOnly: self.isReadOnlyForm
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
       
        if(this.isReadOnlyForm){
            //return;
        }
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

    chkAutomatic(e: any){
        this.maDuThaoDisabled = !this.maDuThaoDisabled;
        console.log(this.maDuThaoDisabled)
        $('#maDuThaoTxtBx').dxTextBox({ readOnly: this.maDuThaoDisabled });
        if(e.value == true){ // nút tự động được chọn
            // this.getIncommingNumber(this.bookVal);
        }
    }


    save(): void {
        let result = this.documentForm.instance.validate();
        const that = this;
        if(result.isValid){
            this.saving = true;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.isActive = true;
            this.documentData.status = false;

            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;

            this.documentData.leaderType = this.leaderTypeVal;
            this.documentData.secretLevel = this.secretVal != null? this.secretVal : -1;
            this.documentData.priority = this.priorityVal != null? this.priorityVal : -1;
            this.documentData.range = this.rangeVal != null? this.rangeVal : -1;
            this.documentData.linkedDocumentList = [];
                this.selectedLinkedDocuments.forEach(x => {
                    var selectedItem = this.selectedResponseDocs.find(a => a.id == x);
                    let temp = new CreateOrEditLinkedDocumentDto();
                    temp.linkedDocId = selectedItem.id;
                    temp.linkedDocNumber = selectedItem.number;
                    temp.type =1;
                    this.documentData.linkedDocumentList.push(temp);
            });
            this.documentData.orgLevels = this.selectedOrgLevels.join(';');
            this.documentData.receiverId = [];
            this.publishOrgTagBox.instance.option("selectedItems").forEach(x => {
                let item = new ReceiverDto();
                item.id = x.id;
                item.name = x.name;
                item.isLocal = x.isLocal;
                this.documentData.receiverId.push(item);
            });

            this.documentData.publishType = this.appSession.isCATP? 1: 2;
            if(this.appSession.isCATP == false){
                this._oDocServiceProxy.themMoiVaChoSo(this.documentData)
                .pipe(finalize(() => {
                    this.notify.info('Văn Bản đã được cho số thành công!');

                }))
                .subscribe(() => {
                    this.router.navigate(['/app/main/qlvb/danh-sach-vb-cua-dv-gui-dv-khac-da-cho-so']);
                });
            }
            else {
                this._oDocServiceProxy.oDocSaveAndPublish(this.documentData)
                .pipe(finalize(() => { this.saving = false;}))
                .subscribe(() => {
                    this.notify.info('Văn Bản đã được cho số thành công!');
                    this.router.navigate(['/app/main/qlvb/danh-sach-vb-da-phat-hanh-catp']);
                });
            }
            }
        }

    onRowUpdating(e: any){
        let mainHandling = e.newData["mainHandling"];
        let coHandling = e.newData["coHandling"];
        var oldData = this.data_department.find(x => x.id == e.key.id);

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
            }
        }
        else{
            this.listReceive.push(e.data);
        }
    }

    onOpenedTagBox(e: any){
        e.component.content().find('.dx-list-select-all').css('display', 'none');
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
        this.createReceiver.show();
    }

    savepublisher(){
        // this.data_publisher.push({ id: this.data_publisher.length,  name: this.publisherData["name"] });
        this._dynamicFieldService.createFieldForPublisher(this.publisherForm.formData.publisherName).subscribe((res) => {
            this.publisherPopupVisible = false;
            // $('#publisherSelect').dxSelectBox('instance').repaint();
            this.data_publisher = res;
            // this.publisherSelect.instance.repaint();
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
        }
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

    getUserInDept(){
        this._oDocServiceProxy.getUserInRoleByOrg(this.appSession.organizationUnitId, '').subscribe(res => {
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

    getLeaderInDept(){
        this._oDocServiceProxy.getLeaderInDepartment(this.appSession.organizationUnitId).subscribe(res => {
            this.chi_huy = res;
            for(var i = 0, len = this.chi_huy.length; i < len; i++){
                this.chi_huy[i]["nameWithPosition"] = this.chi_huy[i]["position"] + " - " + this.chi_huy[i]["fullName"];
            }
        });
    }
    reloadPage(){
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
    }

    showSearchPopUp(){
        this.treeView.dataSource = [];
        this.treeView.dataSource = this.data_receiver;
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

    radio_nguoi_ky(){
        if(this.leaderTypeVal == 1){
            this.nguoi_ky =  this.captain_department;
        }
        else if(this.leaderTypeVal == 2){
            this.nguoi_ky = this.chi_huy;
        }
    }

    placeReceivesValueChanged(e: any){
        const that = this;
        let arr = this.arr_diff(e.value, e.previousValue);
        arr.forEach(x => {
            let t = this.documentData.receiverId.findIndex(y => y.index == parseInt(x));
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
                that.documentData.receiverId.push(item);
            }
        })
        this.treeView.dataSource = [];
        let source = [...this.data_receiver];
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
            })
        }
        this.treeView.dataSource = source;

    }

    linkedDocValueChanged(e: any){
        // for(let i = 0, len = e.value.length)
        console.log(e);
    }

    getResponseDocuments(list: any){
        //lưu id
        let listId = [];
        this.selectedResponseDocs = [];
        this.selectedLinkedDocuments = [];
        this.documentData.linkedDocumentList = [];
        if(list.length > 0){
            this.selectedResponseDocs.push.apply(this.selectedResponseDocs, list);
            this.selectedResponseDocs.forEach(x => {
                listId.push(x.id);
                let temp = new CreateOrEditLinkedDocumentDto();
                temp.linkedDocId = x.id;
                // temp.linkedDocNumber = x.incommingNumber;
                temp.linkedDocNumber = x.number;
                this.selectedLinkedDocuments.push(x.id);
                this.documentData.linkedDocumentList.push(temp);
            });
        }
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

    saveReceiveList(){
        let arr = [];
        this.displayReceiverList.length = 0;
        this.selectedReceivers.forEach(x => {
            this.displayReceiverList.push(x.key)
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

    selectReplyDocument(){

        this.searchResponseDocumentModal.show();
    }
    initReleaseDateOptions(){
        this.releaseDateOptions = {
            displayFormat:'dd/MM/yyyy',
            showClearButton: true,
            min: new Date('2000-01-01'),
            max: this.currentDate
        }
    }
    scan(){
      this.spinnerService.show();
      $.ajax({
        url: 'localhost:5000/service',
        method: 'GET',
        success: function (data) {
            console.log('Đã in xong')
        }
    });
    }

    competentSelectionChange(e: any) {
       
        if(e.value != 0) {
            this.isCompetent = true;
            this.documentData.leaderNotCompetent=null;
        }else{
            this.isCompetent = false
        }
        e.value == 0?this.documentData.leaderId=null:this.documentData.leaderId;
    }
}
