import { Component, Injector, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, PriorityDto, TextBookDto, SessionServiceProxy, DynamicFieldsServiceProxy, HistoryUploadsServiceProxy, DocumentHandlingDetailDto, HandlingUser, DocumentHandlingDetailsServiceProxy, DocumentHandlingsServiceProxy, OrganizationUnitServiceProxy, Comm_booksServiceProxy, LabelDto, ListDVXL, CreateDocumentDto, OrgLevelsServiceProxy, PublishOrgsServiceProxy, CreateOrEditPublishOrgDto, UserExtentionServiceProxy, UserExtenTionDto, CA_DocumentHandlingUserServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
// import { TransferHandleModalComponent } from '../transfer-handle/transfer-handle-modal';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { DxFormComponent, DxDateBoxComponent, DxNumberBoxComponent, DxSelectBoxComponent, DxSwitchComponent } from 'devextreme-angular';
import { DxiGroupComponent, DxoPopupComponent } from 'devextreme-angular/ui/nested';
import { Location } from '@angular/common';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { Observable } from 'rxjs';
import { DocumentHaveNumberExistsComponent } from './documentHaveNumberExists.component';
import { CreatePublisherComponent } from '@app/main/documentHelper/createPublisher.component';
import { isNullOrUndefined } from 'util';
import CustomStore from "devextreme/data/custom_store";
import ArrayStore from "devextreme/data/array_store";
import DataSource from 'devextreme/data/data_source';
// import { ReportDocumentModalComponent } from '../../report_document/report-document-modal';
//import * as jsPDF from 'jspdf';
declare const exportHTML: any;

@Component({
    selector: 'createNewIncommingDocument',
    templateUrl: './create-new-incomming-document.html',
    styleUrls: ['./create-new-incomming-document.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
    animations: [appModuleAnimation()]

})
export class CreateNewIncommingDocumentComponent extends AppComponentBase {
    @ViewChild('documentHaveNumberExists', { static: true }) documentHaveNumberExists: DocumentHaveNumberExistsComponent;
    @ViewChild('documentForm', { static: true }) documentForm: DxFormComponent;
    @ViewChild('publisherForm', { static: false }) publisherForm: DxFormComponent;
    @ViewChild('content', { static: true }) content: ElementRef;
    @ViewChild('hanXyLy', { static: true }) hanXyLy: DxDateBoxComponent;
    @ViewChild('incommingDateField', { static: true }) incommingDateField: DxDateBoxComponent;
    @ViewChild('deadlineDateBox', { static: true }) deadlineDateBox: DxDateBoxComponent;
    @ViewChild('createPublisher', { static: true }) createPublisher: CreatePublisherComponent;
    @ViewChild('publisherSelect', { static: true }) publisherSelect: DxSelectBoxComponent;
    @ViewChild('switch', { static: true }) switch: DxSwitchComponent;
    documentData: CreateDocumentDto = new CreateDocumentDto();
    editDocumentId = 0;
    publisherData: any;
    publisherPopupVisible = false;
    documentTypeOptions: DocumentTypeDto[] = [];
    popupVisible = false;
    saving = false;
    nextNumber: string;
    missingNumber: string;
    validationGroup: any;
    uploadUrl: string;
    currentTime: any;
    link = '';
    error = true;
    numberOfDaysByDocType = 0;
    listReceive: HandlingUser[] = [];
    dataSource = [];
    //lưu index của đơn vị chủ trì
    previousMainHandlingIndex: number;
    //lưu id của đơn vị chủ trì
    previousMainHandlingId: number;
    old_DVXL = [];
    // loại sổ văn bản
    dataBook = [];
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
    leaderDepartmentName: any;
    captain_department = [];
    director_list = [];
    rootUrl: string;
    deadLineDate: Date;
    value: any[] = [];
    currentDate = new Date();
    nameArr: any[] = [];
    dataDisplay = [];
    tepDinhKemSave = '';
    switchValue = false;
    data_DVXL: any
    textBookOptions: TextBookDto[] = [];
    userId: number;
    signal = "";
    publisherVal: any;
    show = false;
    chkAutomaticValue = true;
    chkSendToUnit = false;
    incommingNumberDisabled = true;
    processingDate: Date;
    secretVal: any;
    priorityVal: any;
    rangeVal: any;
    positionVal: any;
    // isVisible = true;
    label: Observable<LabelDto>;
    labelDto: LabelDto[] = [];
    listDVXL_selected: ListDVXL[] = [];
    data_publisher_Initial = [];
    orgLevel: any;
    orgLevelVal: any;
    //id cấp gửi, khi tạo mới nơi gửi
    orgLevelCreate: any;
    confirmPopUpText: any;
    confirmPopUpVisible = false;
    onClickSaveAndCreateNew: boolean;
    initialData: any;
    documentExistsVisible = false;
    incommDateOptions: any;
    numberOfDaysOptions: any;
    deadlineOptions: any;
    isDuplex: any = false;
    choseDisableCheck = false;
    scanTypes = [
        { value: 2, display: "Scan 2 mặt (bằng tay)" },
        { value: 3, display: "Scan 2 mặt" }
    ];
    scanType: any = 1;
    handlingUserIdDataSource: any = [];
    missingNumberVisible = false;
    missingNumberSource = [];
    currentBookInMissingNumberPopup: any;
    publishOrgDataSource: DataSource;
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
        private _documentHandlingDetailAppService: DocumentHandlingDetailsServiceProxy,
        private _appNavigationService: AppNavigationService,
        private _orgLevelAppService: OrgLevelsServiceProxy,
        private _publishOrgAppService: PublishOrgsServiceProxy,
        private _location: Location,
        private _commBookAppService: Comm_booksServiceProxy,
        private _userExtentionServiceProxy: UserExtentionServiceProxy,
        private _documentHandlingUserService: CA_DocumentHandlingUserServiceProxy) {
        super(injector);
        this.userId = this.appSession.userId;
        this.uploadUrl = AppConsts.fileServerUrl + '/fileUpload/Upload_file?userId=' + this.userId;
        this.documentData.book = 1;

    }

    // get sổ VB
    getCommBook() {
        this._commBookAppService.getAllCommBookInDepartment("1", this.appSession.selfOrganizationUnitId).subscribe(res => {
            this.dataBook = res;
            this.documentData.book = res[0].id;
            this.getIncommingNumber(res[0].id);
        });
    }

    //get cấp gửi
    getOrgLevel() {
        this._orgLevelAppService.getAllOrgLevel().subscribe((res) => {
            this.orgLevel = res;
            this.documentData.orgLevelId = this.orgLevel[0].id;
        });
    }

    orgLevelChange() {
        if (this.data_publisher_Initial.length > 0) {
            this.data_publisher = this.data_publisher_Initial.filter(x => x.orgLevelId == this.documentData.orgLevelId);

            this.publishOrgDataSource = new DataSource({
                store: new ArrayStore({
                    key: "id",
                    data: this.data_publisher
                }),
                paginate: true

            });
        
        }

    }

    //get nơi gửi
    getPublishOrg() {
        console.log(this.appSession.organizationUnitId)
        this._publishOrgAppService.getPublishOrgByUserLogin(this.appSession.organizationUnitId).subscribe((res) => {
            this.data_publisher_Initial = res.data;
            this.orgLevelChange();
        });
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

    back() {
        this._location.back();
    }

    transformDate(date) {
        return this.datePipe.transform(date, 'dd/MM/yyyy'); //whatever format you need.
    }

    resetForm() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/app/main/qlvb/create-new-incomming-document']);
    }

    addItem(newItem: string): void {
        this.documentData.attachment += newItem;
    }

    ngOnInit() {
        console.log("orgId " + this.appSession.organizationUnitId)
        console.log("selfOrg" + this.appSession.selfOrganizationUnitId);
        this.getCommBook();
        this.getOrgLevel();
        this.getPublishOrg();
        this.initIncommDateOptions();
        this.initDeadlineOptions();
        this.initHandlingUserIdOptions();
        //this.registerEvents();
        this._documentTypeAppService.getAllDocumentType().subscribe(result => {
            this.signal = result[0].signal;
            this.documentTypeOptions = result;
        });

        this.link = this.router.url;
        this.processingDate = new Date();
        this._documentAppService.getListPhongBanCATP().subscribe(res => {
            this.data_department = res;

            this.data_department.forEach(x => {
                x["mainHandling"] = false;
                x["coHandling"] = false;
            })
        });

        this.numberOfDaysByDocType = 15;
        this.deadLineDate = this.addDays(this.currentDate, 15);
        //this.documentData.orgLevelId = this.
        this.documentData.incommingDate = moment(this.currentDate);
        this.documentData.numberOfDays = 15;
        // this.getIncommingNumber(1);
        this._dynamicFieldService.getDynamicFieldByModuleId(22, this.editDocumentId).subscribe(result => {
            //this.data_publisher = result[0].dataSource;
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
            this.data_range = result[3].dataSource;
            this.data_position = result[4].dataSource;
            this.secretVal = result[1].dataSource[0].key;
            this.priorityVal = result[2].dataSource[0].key;
        });
        // this.data_department.forEach(x => {
        //     x["mainHandling"] = false;
        //     x["coHandling"] = false;
        // });

        this._documentHandlingAppService.getLeaderList_PGD().subscribe(res => {
            this.director_list = res;
            // this.director_list = res.filter(e => e.organizationUnitId == 50);
            //console.log(res);
            for (var i = 0, len = this.director_list.length; i < len; i++) {

                this.director_list[i]["nameWithPosition"] = this.director_list[i]["position"] + " - " + this.director_list[i]["fullName"];
            }
        });
        this._documentHandlingAppService.getLeaderList_PB().subscribe(res => {
            this.captain_department = res;
            for (var i = 0, len = this.captain_department.length; i < len; i++) {
                this.captain_department[i]["nameWithPosition"] = this.captain_department[i]["position"] + " - " + this.captain_department[i]["fullName"];
            }
        });
    }

    getIncommingNumber(soVB: number) {
        console.log("sổ VB: " + soVB);
        this._documentAppService.getNextIncommingNumber(soVB).subscribe(res => {
            this.nextNumber = res;
            console.log(res)
            this.documentData.incommingNumber = this.nextNumber;
        });
    }

    switchMoreInfoValueChanged(e: any) {
        if (e.value == true) {
            this.switchValue = true;
        }
        else {
            this.switchValue = false;
        }
    }

    setFullNameFile(e: any) {

        if (e.value.length == 0) return;

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

    deleteFile(e: any) {
        this.selectedRows.splice(this.selectedRows.findIndex(x => x.tepDinhKem === e.data.tepDinhKem), 1);
        // this.selectedRows.splice(this.selectedRows.indexOf(e.row.data.tepDinhKem), 1);
        this.tepDinhKemSave = this.selectedRows.map(x => { return x.tepDinhKem.toString() }).join(';');
        console.log(this.tepDinhKemSave)
        $.ajax({
            url: AppConsts.fileServerUrl + `/fileUpload/Delete_file?documentName=${e.data.tepDinhKem}`,
            type: "delete",
            contentType: "application/json",
            success: (res) => {
                this._documentAppService.deleteDocumentFileInServer(e.data.tepDinhKem, 0).subscribe(() => { });
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

    checkIncommingNumber(): Promise<any> {
        const promise = new Promise((resolve) => {
            const self = this;
            if (this.chkAutomaticValue) { // trường hợp tự động
                this.getIncommingNumber(1); // gọi lại hàm lấy số = CurrentValue + 1
                self.error = false;
                resolve(self.error);
            }
            else {
                this._documentAppService.isNumberInBookExisted(this.documentData.book, this.nextNumber).subscribe(result => {
                    if (!result) { // chưa tồn tại => lấy số này luôn
                        self.error = false;
                    }
                    resolve(self.error);
                })
            }
        });
        return promise;
    }

    chkAutomatic(e: any) {
        this.incommingNumberDisabled = !this.incommingNumberDisabled;
        if (e.value == true) { // nút tự động được chọn
            this.getIncommingNumber(this.documentData.book);
        }
    }

    changedSendToUnitVal(e: any) {

        if (e.value && this.chkSendToUnit) this.switchValue = false;
        this.chkSendToUnit = e.value;
    }


    onYesConfirmPopUp() {
        this.confirmPopUpVisible = false;
        if (this.onClickSaveAndCreateNew) {
            this.saveAndCreateNew();
        }
        else {
            this.save();
        }
    }

    onCancelConfirmPopUp() {
        this.documentData.number = '';
        this.documentForm.instance.getEditor("number").focus();
        this.confirmPopUpVisible = false;
    }

    onViewConfirmPopUp() {
        this.documentHaveNumberExists.Number = this.documentData.number;
        this.documentHaveNumberExists.loadData();
    }

    setListDVXL() {
        this.listDVXL_selected.length = 0;
        this.data_department.forEach(receiver => {
            if (receiver.mainHandling == true || receiver.coHandling == true) {
                let dvxl = new ListDVXL();
                dvxl.unitId = receiver.id;
                if (receiver.mainHandling == true) {

                    dvxl.typeHandling = 1;

                }
                else if (receiver.coHandling == true) {
                    dvxl.typeHandling = 0;
                }
                this.listDVXL_selected.push(dvxl);
            }

        });
    }

    buttonSaveClick() {
        this.onClickSaveAndCreateNew = false;
        if (!this.documentData.number) {
            this.save();
        }
        else {
            this._documentAppService.checkIfNumberExists(this.documentData.number).subscribe(res => {
                if (res) {
                    this.confirmPopUpText = this.l('NumberExistsDoYouWantToForceSaving{0}', this.documentData.number);
                    this.confirmPopUpVisible = true;

                    // this.message.confirm(
                    //     '',this.l('NumberExistsDoYouWantToForceSaving{0}', this.documentData.number),
                    //     (isConfirmed) => {
                    //         if (isConfirmed) {
                    //             this.save();
                    //         }
                    //         else{
                    //             this.documentData.number = '';
                    //             this.documentForm.instance.getEditor("number").focus();
                    //         }
                    // });
                }
                else {
                    this.save();
                }
            });
        }
    }

    buttonSaveAndCreateNewClick() {
        this.onClickSaveAndCreateNew = true;
        if (!this.documentData.number) {
            this.saveAndCreateNew();
        }
        else {
            this._documentAppService.checkIfNumberExists(this.documentData.number).subscribe(res => {
                if (res) {
                    this.confirmPopUpText = this.l('NumberExistsDoYouWantToForceSaving{0}', this.documentData.number);
                    this.confirmPopUpVisible = true;
                }
                else {
                    this.saveAndCreateNew();
                }
            });
        }
    }

    save(): void {
        let result = this.documentForm.instance.validate();
        this.setListDVXL();
        const that = this;
        if (result.isValid) {

            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.incommingDate = moment(this.documentData.incommingDate).utc(true);
            this.documentData.incommingNumber = this.nextNumber;
            // if(!this.switchValue){
            if (this.documentData.numberOfDays != null && this.documentData.deadline != null) {
                this.documentData.deadline = moment(this.documentData.deadline).utc(true);
            }
            if (this.documentData.deadline == null) {
                this.documentData.numberOfDays = null;
            }
            this.documentData.listDVXL = this.listDVXL_selected;

            // }
            // else {
            //     let gd = this.director_list.find(x => x["roleName"] == 'Giám đốc');
            //     this.documentData.directorId = gd.userId;
            //     // this.documentData.directorId =
            // }

            this.documentData.isActive = true;
            this.documentData.status = false;
            // this.documentData.incommingDate = moment(this.currentDate);
            // this.documentData.numberOfDays = this.numberOfDaysByDocType;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave : null;
            // this.documentData.unitId = this.appSession.organizationUnitId;
            this.documentData.publisher = this.publisherSelect.value;

            this.documentData.secretLevel = this.documentData.secretLevel != null ? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null ? this.documentData.priority : -1;
            // if(this.deadLineDate != null){
            //     this.documentData.deadline = moment(this.deadLineDate).utc(true).set({hour: 0, minute: 0, second: 0, millisecond: 0});
            // }
            this.documentData.isSendUnit = this.chkSendToUnit;
            let checkMainHandling: any = this.documentData.listDVXL.filter(x => x.typeHandling == 1)
            let checkCoHandling: any = this.documentData.listDVXL.filter(x => x.typeHandling == 0)
            if (checkMainHandling.length == 0 && checkCoHandling.length > 0) {
                this.message.warn('Cần phải có đơn vị chủ trì!');
                this.saving = false;
            } else {

                this._documentAppService.createDocument(that.chkAutomaticValue, this.documentData)
                    .pipe(finalize(() => { this.saving = false; }))
                    .subscribe((ids) => {
                        if (ids != '') {
                            this.notify.success('Thêm mới thành công');
                            // let arr = ids.split(',');
                            // let docId = parseInt(arr[0]);
                            // let handlingId = parseInt(arr[1]);
                            // that.saveHandlingDetail(docId, handlingId);
                            this.router.navigate(['app/main/qlvb/executeLabelSQL/6']);
                        }
                        else {
                            this.message.warn('Số đến bị trùng!');
                        }
                    });
                this.saving = true;
            }

        }
    }
    switchValueChanged(e: any) {

        if (e.value && this.chkSendToUnit) {
            this.chkSendToUnit = false;
        }
        this.initDeadlineOptions();
    }
    saveAndTransfer() {
        // this.checkIncommingNumber();
        let result = this.documentForm.instance.validate();
        this.setListDVXL();
        if (result.isValid) {
            this.saving = true;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.incommingDate = moment(this.documentData.incommingDate).utc(true);
            if (this.documentData.numberOfDays != null) {
                this.documentData.deadline = moment(this.documentData.deadline).utc(true);
            }
            this.documentData.isActive = true;
            this.documentData.status = false;
            // this.documentData.incommingDate = moment(this.currentDate);
            // this.documentData.numberOfDays = this.numberOfDaysByDocType;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave : null;
            // this.documentData.unitId = this.appSession.organizationUnitId;
            this.documentData.publisher = this.publisherSelect.value;
            this.documentData.listDVXL = this.listDVXL_selected;
            this.documentData.secretLevel = this.documentData.secretLevel != null ? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null ? this.documentData.priority : -1;
            this.documentData.isSendUnit = this.chkSendToUnit;
            let checkMainHandling: any = this.documentData.listDVXL.filter(x => x.typeHandling == 1)
            if (checkMainHandling.length == 0) {
                this.message.warn('Cần phải có đơn vị chủ trì!');
                this.saving = false;
            } else {
                this._documentAppService.createAndTransferDocument(this.chkAutomaticValue, this.documentData)
                    .pipe(finalize(() => { this.saving = false; }))
                    .subscribe((ids) => {
                        if (ids != '') {
                            this.notify.success('Thêm mới thành công');
                            // let arr = ids.split(',');
                            // let docId = parseInt(arr[0]);
                            // let handlingId = parseInt(arr[1]);
                            // this.saveHandlingDetail(docId, handlingId);
                            this.router.navigate(['/app/main/qlvb/executeLabelSQL/84']);
                        }
                        else {
                            this.message.warn('Số đến bị trùng!');
                        }
                    });
            }
        }
    }

    saveAndCreateNew() {
        // this.checkIncommingNumber();
        let result = this.documentForm.instance.validate();
        this.setListDVXL();
        const that = this;
        if (result.isValid) {
            this.saving = true;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.incommingDate = moment(this.documentData.incommingDate).utc(true);
            if (this.documentData.numberOfDays != null && this.documentData.deadline != null) {
                this.documentData.deadline = moment(this.documentData.deadline).utc(true);
            }
            if (this.documentData.deadline == null) {
                this.documentData.numberOfDays = null;
            }
            this.documentData.isActive = true;
            this.documentData.status = false;
            // this.documentData.incommingDate = moment(this.currentDate);
            // this.documentData.numberOfDays = this.numberOfDaysByDocType;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave : null;
            // this.documentData.unitId = this.appSession.organizationUnitId;
            this.documentData.publisher = this.publisherSelect.value;
            this.documentData.listDVXL = this.listDVXL_selected;
            this.documentData.secretLevel = this.documentData.secretLevel != null ? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null ? this.documentData.priority : -1;
            this.documentData.isSendUnit = this.chkSendToUnit;
            let checkMainHandling: any = this.documentData.listDVXL.filter(x => x.typeHandling == 1)
            let checkCoHandling: any = this.documentData.listDVXL.filter(x => x.typeHandling == 0)
            if (checkMainHandling.length == 0 && checkCoHandling.length > 0) {
                this.message.warn('Cần phải có đơn vị chủ trì!');
                this.saving = false;
            } else {
                this._documentAppService.createDocument(this.chkAutomaticValue, this.documentData)
                    .pipe(finalize(() => { this.saving = false; }))
                    .subscribe((ids) => {
                        if (ids != '') {
                            this.notify.success('Thêm mới thành công');
                            // let arr = ids.split(',');
                            // let docId = parseInt(arr[0]);
                            // let handlingId = parseInt(arr[1]);
                            // this.saveHandlingDetail(docId, handlingId);
                            that.resetForm();
                        }
                        else {
                            this.message.warn('Số đến bị trùng!');
                        }
                    });
            }
        }
    }



    onRowUpdating(e: any) {
        let mainHandling = e.newData["mainHandling"];
        let coHandling = e.newData["coHandling"];
        var oldData = this.data_department.find(x => x.id == e.key.id);
        // var oldData = this.data_department.find(x => x.organizationId == e.key.organizationId);

        if (oldData.mainHandling == false && mainHandling == true) {
            oldData.mainHandling = true;
            oldData.coHandling = false;
        }
        else if (oldData.coHandling == false && coHandling == true) {
            oldData.mainHandling = false;
            oldData.coHandling = true;
        }
    }

    onRowUpdated(e: any) {
        let flag = true;
        if (this.listReceive.length > 0) {
            this.listReceive.every(function (element) {
                if (element.userId != e.data.userId && flag) {
                    flag = true;
                    return true;
                }
                else {
                    flag = false;
                    return false;
                }
            });
            if (flag) {
                this.listReceive.push(e.data);
                // this.listVal.push(e.data.userId);
            }
        }
        else {
            this.listReceive.push(e.data);
            // this.listVal.push(e.data.userId);
        }
    }

    arr_diff(a1, a2) {

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

    onValueChanged(e: any) {
        // this.receiverSelected = this.tagBox.value;
        if (e.value.length < e.previousValue.length) {
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

    showPublisherPopup() {
        //this.publisherPopupVisible = true;
        this.createPublisher.show();
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

    bookSelectionChange(e: any) {
        this.currentBookInMissingNumberPopup = this.dataBook.filter(x => x.id == e.value)[0]
        this.getIncommingNumber(e.value);
        this.getMissingIncomingNumber(e.value);
    }

    getMissingIncomingNumber(soVB: number) {
        this.missingNumberSource = [];
        this._documentAppService.getMissingIncommingNumber(soVB).subscribe(res => {
            if (res.includes("ERROR")) {
                this.missingNumber = "Có lỗi trong quá trình xử lý, vui lòng liên hệ Admin để kiểm tra lại."
            }
            else if (res.length == 0) {
                this.missingNumber = "Không có số đến bị khuyết."
            }
            else {
                this.missingNumber = "Các số đi bị khuyết: " + res.slice(0, 102) + "...";
                this.missingNumberSource.push(res);
            }
        });
    }

    showMissingNumberPopup() {
        this.missingNumberVisible = true;
    }


    changeIncommingDate(e: any) {
        if (this.numberOfDaysByDocType == null) {
            this.deadLineDate = null;
        }
        else {
            this.deadLineDate = this.addDays(e.value, this.numberOfDaysByDocType);
        }
        // this.documentData.endDate = this.deadLineDate.;
    }

    numberOfDaysChanged(e: any) {
        //this.deadLineDate = this.addDays(moment(this.documentData.incommingDate).format('YYYY-MM-DD'), e.value);
        if (this.numberOfDaysByDocType == null) {
            this.deadLineDate = null;
        }
        else {
            this.deadLineDate = this.addDays(moment(this.documentData.incommingDate).format('YYYY-MM-DD'), e.value);
        }
    }

    addDays(val, days: number) {
        var date = new Date(val);
        date.setDate(date.getDate() + days);
        return date;
    }

    // Danh sách xử lý radio value changed
    onCheckBoxChanged(e, cell) {
        let index = this.data_department.findIndex(x => x.id == cell.data.id);
        //kiểm tra cột vừa thao tác là main hay co
        switch (cell.column.dataField) {
            case 'mainHandling':
                //kiểm tra có đvxl chính chưa, nếu có rồi thì bỏ chọn cái trước
                if (this.previousMainHandlingId >= 0) {
                    let temp = this.data_department.findIndex(x => x.id == this.previousMainHandlingId);
                    this.data_department[temp]["mainHandling"] = false;
                }

                if (this.data_department[index]["coHandling"] == true) {
                    this.data_department[index]["coHandling"] = false;
                }

                this.data_department[index]["mainHandling"] = e.value;

                //giữ id của đơn vị đang nắm chủ trì
                this.previousMainHandlingId = cell.data.id;
                break;
            case 'coHandling':
                if (this.data_department[index]["mainHandling"] == true) {
                    this.data_department[index]["mainHandling"] = false;
                }

                this.data_department[index]["coHandling"] = e.value;
        }
    }

    initIncommDateOptions() {
        const that = this;
        this.incommDateOptions = {
            showClearButton: true,
            displayFormat: 'dd/MM/yyyy',
            format: 'dd/MM/yyyy',
            value: that.currentDate,
            min: new Date(2000, 0, 1),
            max: that.currentDate,
            onValueChanged: function (e) {

                // if(that.documentData.numberOfDays == null)
                // {
                //     that.documentData.deadline = null;
                // }
                if (that.documentData.numberOfDays !== null && e.value !== null) {
                    that.documentData.deadline = moment(that.addDays(e.value, that.documentData.numberOfDays));
                }
            }
        };
    }
    changeNumberOfDaysOptions(e) {
        if (this.documentData.numberOfDays == null) {
            this.documentData.deadline = null;
        }
        else {
            this.documentData.deadline = moment(this.addDays(moment(this.documentData.incommingDate).format('YYYY-MM-DD'), e.value));
        }
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
    lockScroll(e) {
        e.preventDefault();
    }

    initDeadlineOptions() {
        const that = this;
        this.deadlineOptions = {
            displayFormat: 'dd/MM/yyyy',
            format: 'dd/MM/yyyy',
            value: null,
            showClearButton: true,
            disabled: this.switchValue,
            onValueChanged: function (e) {
                debugger
                if (that.documentData.numberOfDays !== null && e.value !== null) {
                    that.documentData.incommingDate = moment(that.addDays(e.value, -that.documentData.numberOfDays));
                }
                if (e.value !== null && that.documentData.incommingDate !== null) {
                    that.documentData.numberOfDays = moment(e.value).diff(that.documentData.incommingDate, 'days');
                }
            }
        }
    }

    onScanTypeChanged(e: any) {
        if (e.value == 3) {
            this.isDuplex = true;
        }
    }

    scan() {
        const self = this;
        self.spinnerService.show();
        var scanFileName = "Van_Ban_Den_" + Date.now() + ".pdf";

        self._userExtentionServiceProxy.getByUser().subscribe((res) => {

            if (!isNullOrUndefined(res.id)) {
                var data = {
                    "DisplayName": scanFileName,
                    "DoMainAppPath": formatDate(self.currentDate, 'dd-MM-yyyy', 'en-US'),
                    "DeviceName": res.scanName,
                    "IsDuplex": self.isDuplex,
                    "ScanType": self.scanType
                };
                self.scanRequest(data, scanFileName)
            }
            else {
                var data2 = {
                    "DisplayName": scanFileName,
                    "DoMainAppPath": formatDate(self.currentDate, 'dd-MM-yyyy', 'en-US'),
                    "DeviceName": '',
                    "IsDuplex": self.isDuplex,
                    "ScanType": self.scanType
                };
                self.scanRequest(data2, scanFileName)
            }

        })

    }

    scanRequest(data, scanFileName) {
        const self = this;
        $.ajax({
            url: 'http://localhost:9001/ScanService/scan',
            data: JSON.stringify(data),
            contentType: 'application/json',
            method: 'POST',
            success: function (result) {
                // cập nhật thông tin lên table

                self.dataDisplay.length = 0;
                const cValue = formatDate(self.currentDate, 'dd-MM-yyyy', 'en-US');
                self.currentTime = new Date().getHours() + "-" + new Date().getMinutes();
                let listFileName = [];

                self.dataDisplay.push({ tepDinhKem: cValue + "/" + scanFileName });
                listFileName.push(scanFileName);

                self.selectedRows = self.selectedRows.concat(self.dataDisplay);

                //cập nhật lại thông tin máy in cho user
                self.tepDinhKemSave = listFileName.join(';');
                if (result["ExistDevice"] == "false" || result["ExistDevice"] == false) {
                    var postData = new UserExtenTionDto();
                    postData.scanName = result["DeviceName"];
                    self._userExtentionServiceProxy.createOrEdit(postData).subscribe(() => {

                    })
                }
                self.spinnerService.hide();

            },
            error: function (data) {
            }
        });
    }

    initHandlingUserIdOptions() {

        this._documentHandlingUserService.getAll().subscribe(res => {
            this.handlingUserIdDataSource = res.data;
        });
    }


    isDisableCHPhong() {
        // Gửi Giám đốc
        if (this.switchValue && !this.chkSendToUnit) return true;
        // Gửi đơn vị
        if (!this.switchValue && this.chkSendToUnit) return true;
        // ko chọn
        if (!this.switchValue && !this.chkSendToUnit) return false;
    }

    isDisableCheckBGD() {
        // Gửi Giám đốc
        if (this.switchValue && !this.chkSendToUnit) return false;
        // Gửi đơn vị
        if (!this.switchValue && this.chkSendToUnit) return true;
        // ko chọn
        if (!this.switchValue && !this.chkSendToUnit) return false;
    }

}
