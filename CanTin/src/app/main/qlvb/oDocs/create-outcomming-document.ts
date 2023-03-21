import { CreateOrEditLinkedDocumentDto, UserExtentionServiceProxy, UserExtenTionDto } from './../../../../shared/service-proxies/service-proxies';
import { ModalDirective } from 'ngx-bootstrap';
import { Component, Injector, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, GroupReceiverServiceProxy, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, PriorityDto, TextBookDto, DynamicFieldsServiceProxy, HandlingUser, DocumentHandlingDetailsServiceProxy, DocumentHandlingsServiceProxy, LabelDto, PublishOrgsServiceProxy, ODocsServiceProxy, CreateOrEditODocDto, GetUserInRoleDto, LinkedDocumentsServiceProxy, ReceiverDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';
import { DxFormComponent, DxDateBoxComponent, DxSelectBoxComponent, DxTreeViewComponent, DxTagBoxComponent } from 'devextreme-angular';
import { DxiGroupComponent } from 'devextreme-angular/ui/nested';
import { Location } from '@angular/common';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { Observable } from 'rxjs';
import { SearchResponseDocumentModalComponent } from './search-response-document/search';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { CreatePublisherComponent } from '@app/main/documentHelper/createPublisher.component';
import { CreateReceiverComponent } from 'app/main/documentHelper/createReceiver.component';

import { isNullOrUndefined } from 'util';
import { GroupReceiverComponent } from '../group-receiver/group-receiver.component';

@Component({
    selector: 'createOutcommingDocument',
    templateUrl: './create-outcomming-document.html',

    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe] ,
    animations: [appModuleAnimation()]

})
export class CreateOutcommingDocumentComponent extends AppComponentBase {
    @ViewChild('documentForm', {static: true}) documentForm: DxFormComponent;
    @ViewChild('publisherForm', { static: false }) publisherForm: DxFormComponent;
    @ViewChild('anotherInfo', { static: false}) anotherInfo: DxiGroupComponent;
    @ViewChild('content', { static: true })  content: ElementRef;
    @ViewChild('hanXyLy', { static: true}) hanXyLy: DxDateBoxComponent;
    @ViewChild('incommingDateField', { static: true}) incommingDateField: DxDateBoxComponent;
    @ViewChild('deadlineDateBox', { static: true}) deadlineDateBox: DxDateBoxComponent;
    // @Input('editDocumentId') editDocumentId: number;
    // @ViewChild('publisherSelect', { static: true }) publisherSelect: DxSelectBoxComponent;
    @ViewChild('orgLevelTagBox', { static: true}) orgLevelTagBox: DxTagBoxComponent;
    @ViewChild('publishOrgTagBox', { static: true}) publishOrgTagBox: DxTagBoxComponent;
    @ViewChild('treeView', { static: true }) treeView: DxTreeViewComponent;
    @ViewChild('treeViewDisplay', { static: true }) treeViewDisplay: DxTreeViewComponent;
    @ViewChild('searchResponseDocumentModal', { static: true }) searchResponseDocumentModal: SearchResponseDocumentModalComponent;
    @ViewChild('createReceiver', { static: true}) createReceiver: CreateReceiverComponent;
    @ViewChild('linkedDocTagBox', { static: true }) linkedDocTagBox: DxTagBoxComponent;
    @ViewChild('groupReceiver', { static: true }) groupReceiver: GroupReceiverComponent;
    @ViewChild('groupReceiverTagBox', { static: true }) groupReceiverTagBox: DxTagBoxComponent;

    treeDataSource: any;
    treeBoxValue: string[];

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
    currentTime: any ;
    link = '';
    error = true;
    endDate: any;
    incommingDate: any;
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
    // dataBook = [
    //     { id: 1, name: 'Sổ thường'  },
    //     { id: 2, name: 'Sổ mật' },
    // ];
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
    rootUrl: string ;
    deadLineDate: Date;
    value: any[] = [];
    currentDate = new Date();
    nameArr: any[] = [];
    dataDisplay = [];
    tepDinhKemSave = '';
    switchValue = false;
    data_DVXL: any;
    textBookOptions: TextBookDto[] = [];
    userId: number;
    signal = '';
    publisherVal: any;
    show = false ;
    chkAutomaticValue = true;
    incommingNumberDisabled = true;
    bookVal: any;
    secretVal: any;
    priorityVal: any;
    label: Observable<LabelDto>;
    labelDto: LabelDto[] = [];
    receiverPopupVisible = false;
    selectedReceivers :any = [];
    displayReceiverList :any = [];
    maDuThaoChkBoxOptions: any;
    listSelectedReceivers = [];
    quantityDocPublishVal: number = 1;
    piecesOfPaperVal: number = 1;
    orgLevelSource = [];
    data_receiver = [];
    leaderType = [
        {id: 1, name: 'Ban Giám Đốc CATP'}, {id: 2, name: 'Chỉ huy Phòng'}
    ];
    //danh sách thành viên trong phòng
    editorList: any;
    leaderTypeVal: number;
    chi_huy: GetUserInRoleDto[] = [];
    nguoi_ky = [];
    maDuThaoOptions: any;
    linkedDocOptions: any;

    selectedResponseDocs = [];
    leaderIdVal: any;
    listDocLink = '';
    linkDocumentVal = '';
    popup_publishType = false;
    publishPlaceList = [
        {id: 1, name: 'Chuyển cho VT CATP' }, {id: 2, name: 'Chuyển cho VT Phòng' }
    ];
    publishPlaceListVal = 1; //mặc định chuyển VT CATP
    // editorIdOptions: any;

    selectedLinkedDocuments = [];
    selectedOrgLevels = [];
    publishOrgSource = [];
    isValidForm = false;
    isDuplex:any= false;
    scanTypes = [
        {value: 2, display: "Scan 2 mặt (bằng tay)"},
        {value: 3, display: "Scan 2 mặt"}
    ];
    scanType: any = 1;
    groupReceiverSource = [];
    groupReceiverVal:any;
    typeGroup:any = 1;
    constructor(
        injector: Injector,
        private router: Router,
        protected activeRoute: ActivatedRoute,
        private datePipe: DatePipe,
        private _documentTypeAppService: DocumentTypesServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _documentHandlingAppService: DocumentHandlingsServiceProxy,
        // private _priorityAppService: PrioritiesServiceProxy,
        private _dynamicFieldService: DynamicFieldsServiceProxy,
        private _oDocsServiceProxy: ODocsServiceProxy,
        private _linkedDocumentsProxy: LinkedDocumentsServiceProxy,
        private _publishOrgAppService: PublishOrgsServiceProxy,
        private _userExtentionServiceProxy: UserExtentionServiceProxy,
        private _groupReceiverServiceProxy: GroupReceiverServiceProxy,
        private _utilityService: UtilityService,
        private _location: Location    ) {
        super(injector);
        this.userId = this.appSession.userId;
        this.uploadUrl = AppConsts.fileServerUrl  + '/fileupload/Upload_file?userId=' + this.userId ;
        this.leaderTypeVal = this.leaderType[0].id;
        this.bookVal = 7;
    }

    getLeaderInDept() {
        this._oDocsServiceProxy.getLeaderInDepartment(this.appSession.organizationUnitId).subscribe(res => {
            this.chi_huy = res;
            for (let i = 0, len = this.chi_huy.length; i < len; i++) {
                this.chi_huy[i]['nameWithPosition'] = this.chi_huy[i]['position'] + ' - ' + this.chi_huy[i]['fullName'];
            }
        });
    }

    getUserInDept() {

    }

    radio_nguoi_ky() {
        // console.log(this.leaderTypeVal)
        if (this.leaderTypeVal === 1) {
            this.nguoi_ky =  this.captain_department;
        } else if (this.leaderTypeVal === 2) {
            this.nguoi_ky = this.chi_huy;
        }
        // console.log(e);
    }

    registerEvents(): void {
        abp.event.on('app.labelSignalR.label', (message) => {
            console.log('không vô luôn');
            //this._appSessionService.init();
            console.log(message);
        });
    }

    back() {
        this._location.back();
    }

    transformDate(date) {
        return this.datePipe.transform(date, 'dd/MM/yyyy'); //whatever format you need.
    }

    resetForm() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        // this.router.navigate(['/app/main/qlvb/create-new-incomming-document']);
    }

    addItem(newItem: string): void {
        this.documentData.attachment += newItem ;
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnInit() {
        //this.registerEvents();
        this.initMaDuThaoOptions();
        this.initMaDuThaoChkBoxOptions();
        this.getGroupReceiver()
        if (this._utilityService.selectedDocumentData != null && this._utilityService.selectedDocumentData != undefined) {
            let linkedDocument = this._utilityService.selectedDocumentData;
            let temp = new CreateOrEditLinkedDocumentDto();
            temp.linkedDocId = linkedDocument["Id"];
            temp.linkedDocNumber = linkedDocument["Number"];
            let arr = [];
            if(linkedDocument["Number"] != null){
                arr.push({ id: linkedDocument["Id"], number: linkedDocument["Number"] });
            }

            this.selectedResponseDocs = arr;
            this.selectedLinkedDocuments = [];
            this.selectedLinkedDocuments.push(linkedDocument["Id"]);
            this.documentData.linkedDocumentList = [];
            this.documentData.linkedDocumentList.push(temp);

            debugger

            this.selectedOrgLevels.push(linkedDocument.OrgLevelId);
            this.displayReceiverList.push(linkedDocument.Publisher);

            this._utilityService.selectedDocumentData = null;
        }
        else {
            this.selectedResponseDocs = [];
        }
        // this.initLinkedDocOptions();
        // this.initEditorIdOptions();
        this._documentTypeAppService.getAllDocumentType().subscribe(result => {
            this.signal = result[0].signal;
            this.documentTypeOptions = result;
        });
        this.link = this.router.url;
        this._documentAppService.getListPhongBanCATP().subscribe(res => {
            this.data_department = res;
        });
        this.getIncommingNumber();
        this.getPublishOrg();
        this._dynamicFieldService.getDynamicFieldByModuleId(22, this.editDocumentId).subscribe(result => {
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
            this.data_range = result[3].dataSource;
            this.data_position = result[4].dataSource;
            this.secretVal = result[1].dataSource[0].key;
            this.priorityVal = result[2].dataSource[0].key;
        });
        this.getLeaderInDept();
        this._documentHandlingAppService.getLeaderList_PGD().subscribe(res => {
            this.director_list = res;
            for (let i = 0, len = this.director_list.length; i < len; i++) {
                this.director_list[i]['nameWithPosition'] = this.director_list[i]['position'] + ' - ' + this.director_list[i]['fullName'];
            }
        });
        this._documentHandlingAppService.getLeaderList_PB().subscribe(res => {
            this.captain_department = res;
            for (let i = 0, len = this.captain_department.length; i < len; i++) {
                this.captain_department[i]['nameWithPosition'] = this.captain_department[i]['position'] + ' - ' + this.captain_department[i]['fullName'];
            }
            // this.radio_nguoi_ky();
        });
        // this._oDocsServiceProxy.getListReceiver().subscribe(res => {
        //     this.data_receiver = res;
        // });
        this._oDocsServiceProxy.getListOrgLevels().subscribe(res => {
            this.orgLevelSource = res;
        });


        this.initForm();
    }

    orgLevelValueChanged(e: any) {
        this.publishOrgSource = [];
        this.selectedOrgLevels.forEach(x => {
            Array.prototype.push.apply(this.publishOrgSource, this.data_receiver.filter(a => a.orgLevelId === x));
        });

        // this.data_receiver.forEach(e => {

        // });

        // this.publishOrgTagBox.dataSource = this.publishOrgSource;
    }

    linkedDocKeyUp(event: any) {
        this.delay(function() {
            this._oDocsServiceProxy.searchLinkedDocument().subscribe(res => {

            });
        }, 500);
    }

    getGroupReceiver() {
        this._groupReceiverServiceProxy.getGroupReceiverByOrgId(this.appSession.organizationUnitId, this.typeGroup).subscribe(res => {
            this.groupReceiverSource = res.data;
        })
    }

    delay(callback, ms) {
        let timer: NodeJS.Timeout;
        return function() {
            let context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function() {
                callback.apply(context, args);
            }, ms || 0);
        };
    }

    onLinkedDocInput(event: any) {
        console.log(event);
    }

    getIncommingNumber() {
        this._oDocsServiceProxy.getDraftNumberOfCommBook(this.appSession.organizationUnitId).subscribe(res => {
        });
    }

    switchMoreInfoValueChanged(e: any) {
        if (e.value === true) {
            this.switchValue = true;
            this.anotherInfo.instance.visible = true;
        } else {
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


    showDetail(e: any) {
        this.rootUrl = AppConsts.fileServerUrl ;
        this.link = this.rootUrl + '/' + e.row.data.tepDinhKem;

        window.open(this.link, '_blank');
    }

    checkIncommingNumber(): Promise<any> {
        const promise = new Promise((resolve) => {
            const self = this;
            if (this.chkAutomaticValue) { // trường hợp tự động
                this.getIncommingNumber(); // gọi lại hàm lấy số = CurrentValue + 1
                self.error = false;
                resolve(self.error);
            } else {
                this._documentAppService.isNumberInBookExisted(this.bookVal, this.nextNumber).subscribe(result => {
                    if (!result) { // chưa tồn tại => lấy số này luôn
                        self.error = false;
                    }
                    resolve(self.error);
                });
            }
        });
        return promise;
    }

    chkAutomatic(e: any) {
        this.incommingNumberDisabled = !this.incommingNumberDisabled;
        if (e.value === true) { // nút tự động được chọn
            this.getIncommingNumber();
        }
    }

    save(): void {
        let result = this.documentForm.instance.validate();
        const self = this;
        if (result.isValid) {
            this.saving = true;
            this.saveReceiveList();
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.orgEditor = this.appSession.organizationUnitId;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave : null;
            this.documentData.leaderType = this.leaderTypeVal;
            this.documentData.secretLevel = this.documentData.secretLevel != null ? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null ? this.documentData.priority : -1;
            this.documentData.range = this.documentData.range != null ? this.documentData.range : -1;
            this.documentData.linkedDocumentList = [];
            if(this.selectedOrgLevels.length>0) {
                this.documentData.orgLevels = this.selectedOrgLevels.join(';');
            }
            
            this.selectedLinkedDocuments.forEach(x => {
                let selectedItem = this.selectedResponseDocs.find(a => a.id === x);
                let temp = new CreateOrEditLinkedDocumentDto();
                temp.linkedDocId = selectedItem.id;
                temp.linkedDocNumber = selectedItem.number;
                this.documentData.linkedDocumentList.push(temp);
            });
            this.groupReceiverTagBox.instance.option("selectedItems").forEach(x => {
                let groupReceiverList: any = x.PublishOrgId.split(";")
                let groupOrgLevelList: any = x.OrgLevelId.split(";")
                groupOrgLevelList.forEach(o => {
                    if(this.selectedOrgLevels.length>0){
                        let checkExistedOrgLevel = this.selectedOrgLevels.find(x => x == parseInt(o, 10))
                        if (!checkExistedOrgLevel) {
                            this.selectedOrgLevels.push(this.documentData.orgLevels);
                            this.documentData.orgLevels = this.documentData.orgLevels + ";" + o;
                        }
                    }else{
                        this.selectedOrgLevels.push(o);
                        this.documentData.orgLevels = o;
                    }
                })
                groupReceiverList.forEach(y => {
                    let checkExistedReceiver = this.documentData.receiverId.find(x => x.id == parseInt(y, 10))
                    if (!checkExistedReceiver) {
                        let item = new ReceiverDto();
                        item.id = parseInt(y, 10);
                        this.documentData.receiverId.push(item);
                    }

                })
            })
            this.documentData.quantityDocumentPublish = this.quantityDocPublishVal;
            this.documentData.piecesOfPaper = this.piecesOfPaperVal;
            // this.publishOrgTagBox.instance.option('selectedItems').forEach(x => {
            //     let item = new ReceiverDto();
            //     item.id = x.id;
            //     item.name = x.name;
            //     item.isLocal = x.isLocal;
            //     this.documentData.receiverId.push(item);
            // });
            this._oDocsServiceProxy.oDocSaveAndTransferToCATP(this.documentData)
            .pipe(finalize(() => { this.saving = false; this.popup_publishType = false; }))
            .subscribe(() => {

                

                self.notify.success("Đã thêm mới và chuyển VT CATP");
                self.documentForm.instance.resetValues();
                self.initForm();
                self.selectedRows = [];
                self.resetForm();
                self.selectedOrgLevels = [];
                self.displayReceiverList = [];
                self.groupReceiverVal = [];
                self.selectedRows.length=0
                // this.router.navigate(['/app/main/qlvb/danh-sach-vb-chuyen-catp-phat-hanh']);
            });
            // this._oDocsServiceProxy.createDraftODoc(this.documentData)
            //  .pipe(finalize(() => { this.saving = false; this.popup_publishType = false; }))
            //  .subscribe(() => {
            //     this.notify.info(this.l('SavedSuccessfully'));
            //     this.router.navigate(['/app/main/qlvb/danh-sach-vb-du-thao']);
            //  });
        }
    }



    showPublishType() {
        let result = this.documentForm.instance.validate();
        if (result.isValid) {
            this.popup_publishType = true;
        }
    }

    onRowUpdating(e: any) {
        let mainHandling = e.newData['mainHandling'];
        let coHandling = e.newData['coHandling'];
        let oldData = this.data_department.find(x => x.id === e.key.id);
        // var oldData = this.data_department.find(x => x.organizationId == e.key.organizationId);

        if (oldData.mainHandling === false && mainHandling === true) {
            oldData.mainHandling = true;
            oldData.coHandling = false;
        } else if (oldData.coHandling === false && coHandling === true) {
            oldData.mainHandling = false;
            oldData.coHandling = true;
        }
    }

    onRowUpdated(e: any) {
        let flag = true;
        if (this.listReceive.length > 0) {
            this.listReceive.every(function(element) {
                if (element.userId !== e.data.userId && flag) {
                    flag = true;
                    return true;
                } else {
                    flag = false;
                    return false;
                }
            });
            if (flag) {
                this.listReceive.push(e.data);
                // this.listVal.push(e.data.userId);
            }
        } else {
            this.listReceive.push(e.data);
            // this.listVal.push(e.data.userId);
        }
    }

    arr_diff (a1, a2) {

        let a = [], diff = [];

        for (let i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }

        for (let i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }

        // tslint:disable-next-line:forin
        for (let k in a) {
            diff.push(k);
        }

        return diff;
    }

    onValueChanged(e: any) {
        // this.receiverSelected = this.tagBox.value;
        if (e.value.length < e.previousValue.length) {
            this.arr_diff(e.value, e.previousValue).forEach(el => {
                this.dataSource.findIndex(x => x.userId === el);
                let index = this.dataSource.findIndex(x => x.userId === el);
                this.dataSource[index]['mainHandling'] = false;
                this.dataSource[index]['coHandling'] = false;
                this.listReceive.splice(this.listReceive.findIndex(element => element.userId === el), 1);
                // this.listVal.splice(this.listVal.findIndex(x => x == el), 1);
            });
        }
    }

    showPublisherPopup() {
        //this.publisherPopupVisible = true;
        this.createReceiver.show();
    }

    getPublishOrg() {
        this._publishOrgAppService.getPublishOrgByUserLogin(this.appSession.organizationUnitId).subscribe((res) => {
            this.data_receiver = res.data;
            this.orgLevelValueChanged(null);
        });
    }

    changeIncommingDate(e: any) {
        if (this.numberOfDaysByDocType == null) {
            this.deadLineDate = null;
        } else {
            this.deadLineDate = this.addDays(e.value, this.numberOfDaysByDocType);
        }
        // this.documentData.endDate = this.deadLineDate.;
    }

    addDays(val, days: number) {
        let date = new Date(val);
        date.setDate(date.getDate() + days);
        return date;
    }

    showSearchPopUp() {
        this.treeView.dataSource = [];
        this.treeView.dataSource = this.data_receiver;
        this.receiverPopupVisible = true;
    }
    onSelectionChanged(e: any) {
        const that = this;
        this.selectedReceivers.length = 0;
        let list = this.treeView.instance.getNodes();
        list.forEach(item => {
            if (item.selected === true) {
                let arr = item['items'];
                arr.forEach(function(i, index, object) {
                    that.selectedReceivers.push(i);
                });
            } else if (item.expanded === true) {
                let arr = item['items'];
                arr.forEach(function(i, index, object) {
                    if (i.selected === true) {
                        that.selectedReceivers.push(i);
                    }
                });

            }
        });
    }

    saveReceiveList() {
        let arr = [];
        this.displayReceiverList.forEach(x => {
            var index =this.publishOrgSource.find(a=>a.id==x)
            let item = new ReceiverDto();
            item.id = x;
            item.isLocal = index.isLocal;
            item.name = index.name;
            //item.index = x.itemData.id;
            arr.push(item);
        })

        // this.selectedReceivers.forEach(x => {
        //     this.displayReceiverList.push(x.key);
        //     let item = new ReceiverDto();
        //     item.id = x.itemData.index;
        //     item.isLocal = x.itemData.isLocal;
        //     item.name = x.itemData.name;
        //     item.index = x.itemData.id;
        //     arr.push(item);
        // });
        this.documentData.receiverId = arr;
        this.receiverPopupVisible = false;
    }

    placeReceivesValueChanged(e: any) {
        const that = this;
        let arr = this.arr_diff(e.value, e.previousValue);
        arr.forEach(x => {
            let t = this.documentData.receiverId.findIndex(y => y.index === parseInt(x));
            let u = that.selectedReceivers.find(i => i.key === x);
            if (e.value.length < e.previousValue.length) {
                that.documentData.receiverId.splice(t, 1);
                that.selectedReceivers.splice(that.selectedReceivers.findIndex( z => z.id === u.id), 1);
            } else {
                let item = new ReceiverDto();
                item.id = u.itemData.index;
                item.isLocal = u.itemData.isLocal;
                item.name = u.itemData.name;
                item.index = u.itemData.id;
                that.documentData.receiverId.push(item);
            }
        });
        this.treeView.dataSource = [];
        let source = [...this.data_receiver];
        for (let i = 0, len = source.length; i < len; i++) {
            let arr = source[i];
            arr.items.forEach(x => {
                let temp = that.displayReceiverList.find(r => r === x.id);
                if (temp) {
                    x.selected = true;
                } else {
                    arr.selected = false;
                    x.selected = false;
                }
            });
        }
        this.treeView.dataSource = source;

    }

    closePopUp() {
        this.receiverPopupVisible = false;
    }

    selectReplyDocument() {
        this.searchResponseDocumentModal.show();
    }

    initMaDuThaoOptions() {
        const that = this;
        this.maDuThaoOptions = {
            disabled: that.incommingNumberDisabled
        };
    }

    initMaDuThaoChkBoxOptions() {
        const that = this;
        this.maDuThaoChkBoxOptions = {
            value: that.incommingNumberDisabled,
            onValueChanged: function(e) {
                that.incommingNumberDisabled = e.value;
                that.maDuThaoOptions = {
                    disabled: e.value
                };
                if (e.value === true) { // nút tự động được chọn
                    that.getIncommingNumber();
                }
            }
        };
    }

    getResponseDocuments(list: DocumentsDto[]) {
        //lưu id
        this.selectedResponseDocs.length = 0;
        this.selectedLinkedDocuments.length = 0;
        let listId = [];
        //lưu number
        let listNumber = [];
        if (list.length > 0) {
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

    }

    initForm() {
        this.documentData = new CreateOrEditODocDto();
        this.documentData.isNoneSubmit = false;
        this.documentData.orgEditor = this.appSession.organizationUnitId;
        // this.documentData.editorId = this.appSession.userId;
        this.leaderTypeVal = this.leaderType[0].id;
        this.currentDate = new Date();
    }
    scan() {
        const self = this;
        self.spinnerService.show();
        var scanFileName = "Van_Ban_Di_" + Date.now() + ".pdf";

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
    onScanTypeChanged(e: any){
        if(e.value == 3){
            this.isDuplex = true;
        }
    }
    syncTreeViewSelection(e) {
        var component = (e && e.component) || (this.treeView && this.treeView.instance);

        if (!component) return;

        if (!this.displayReceiverList) {
            component.unselectAll();
        }

        if (this.displayReceiverList) {
            this.displayReceiverList.forEach((function (value) {
                component.selectItem(value);
            }).bind(this));
        }
    }

    treeView_itemSelectionChanged(e){
        debugger
        this.displayReceiverList = e.component.getSelectedNodesKeys()
    }

    onOpenedTagBox(e: any) {
        e.component.content().find('.dx-list-select-all').css('display', 'none');
    }
    showGroupReceiver() {
        this.groupReceiver.show()
    }
}
