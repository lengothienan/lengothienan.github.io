import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, PriorityDto, TextBookDto, DynamicFieldsServiceProxy, HandlingUser, DocumentHandlingsServiceProxy, Comm_booksServiceProxy, PublishOrgsServiceProxy, GetUserInRoleDto, ODocsServiceProxy, ListDVXL, OrgLevelsServiceProxy, CreateDocumentDto, UserExtentionServiceProxy, UserExtenTionDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
// import { TransferHandleModalComponent } from '../transfer-handle/transfer-handle-modal';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import $ from 'jquery';
import { DxTabPanelComponent, DxFormComponent, DxTreeViewComponent, DxDropDownBoxComponent } from 'devextreme-angular';
import { Location } from '@angular/common';
import { CreatePublisherComponent } from '@app/main/documentHelper/createPublisher.component';
import { finalize } from 'rxjs/operators';
import { DocumentHaveNumberExistsComponent } from '../../create-document/documentHaveNumberExists.component';
import { isNullOrUndefined } from 'util';
import { findIndex, trim } from 'lodash';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';

@Component({
    templateUrl: './create-Document.component.html',
    styleUrls: ['./create-Document.component.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
    animations: [appModuleAnimation()]

})
//thêm vb mới hoàn toàn của văn thư phòng 
export class CreateDocumentDenPhongComponent extends AppComponentBase implements OnInit {
    @ViewChild('documentHaveNumberExists', { static: true }) documentHaveNumberExists: DocumentHaveNumberExistsComponent;
    @ViewChild('documentForm', { static: true }) documentForm: DxFormComponent;
    @ViewChild('tabPanel', { static: true }) tabPanel: DxTabPanelComponent;
    @ViewChild('createPublisher', { static: true }) createPublisher: CreatePublisherComponent;
    @ViewChild(DxTreeViewComponent, { static: false }) treeView;
    @ViewChild('publisherSelect', {static: true}) publisherSelect: DxDropDownBoxComponent;
    treeDataSource: any;
    treeBoxValue: string;

    documentData: CreateDocumentDto = new CreateDocumentDto();
    documentId: number;
    documentTypeOptions: DocumentTypeDto[] = [];
    priorityOptions: PriorityDto[] = [];
    nextNumber: string;
    missingNumber: string;
    validationGroup: any;
    publisherPopupVisible_report = false;
    uploadUrl: string;
    handlers: DocumentsDto[] = [];
    myDate = new Date();
    currentTime: any;
    link = '';
    currentId: any;
    incommingDate: any;
    moduleId: any;
    dynamicFields: any;
    dynamicValue: any;
    numberOfDaysByDocType = 0;
    listReceive: HandlingUser[] = [];
    dataSource = [];
    //lưu index của đơn vị chủ trì
    previousMainHandlingId: number;
    previousUserMainHandlingId: number;
    old_DVXL = [];
    dataBook = [
        // { id: 1, name: 'Sổ thường'  },
        // { id: 2, name: 'Sổ mật' },
    ];
    // lĩnh vực
    // data_range = [{key: 'An ninh', value: 1}, {key: 'Kinh tế', value: 2}, {key: 'Xã hội', value: 3}];
    data_range = [];
    data_position = [];
    selectedRows = [];
    data_publisher = [];
    incommDateOptions: any;
    data_commBook = [];
    data_department = [];
    data_secretLevel = [];
    data_priority = [];
    leaderDepartmentName: any;
    captain_department = [];
    director_list = [];
    historyUpload: any;
    rootUrl: string;
    deadLineDate: Date;
    value: any[] = [];
    num: any[] = [];
    active = false;
    DWObject: WebTwain;
    currentDate = new Date();
    previousDate = new Date();
    directorName: any;
    nameArr: any[] = [];
    dataDisplay = [];
    tepDinhKemSave = '';
    switchValue = false;
    data_DVXL: any
    date: Date;
    textBookOptions: TextBookDto[] = [];
    userId: number;
    signal = "";
    publisherVal: any;
    chkAutomaticValue = true;
    processingDate: Date;
    printRptVisible = false;
    bookVal: any;
    documentTypeIdVal: any;
    secretVal: any;
    priorityVal: any;
    rangeVal: any;
    positionVal: any;
    printUrl = '';
    // isVisible = true;
    incommingNumberDisabled = true;
    bookOptions: any;
    dataBookDepartment = [];
    currentSyntax = "";
    oldNumber = "";
    currentNumberInBook: string;
    isNumberDisabled = false;
    numberOptions: any;
    chkAutomaticNumberValue = false;
    soKyHieu: string;
    loaiDV = [

        {
            type: 2, name: 'Danh sách đội trong phòng', dataSource: [
            ]
        }
    ];
    selectedItem: any;
    chi_huy: GetUserInRoleDto[] = [];
    listDVXL_selected: ListDVXL[] = [];
    orgLevel: any;
    orgLevelVal: any;
    data_publisher_Initial = [];
    userInOrg: GetUserInRoleDto[] = [];
    phoPhong: GetUserInRoleDto[];
    truongPhong: GetUserInRoleDto[];
    truongPhongVal: number;
    phoPhongVal: number;
    tpComment = '';
    ppComment = '';
    tpDate = new Date();
    ppDate = new Date();
    saving = false;
    confirmPopUpText: any;
    confirmPopUpVisible = false;
    linkedDocumentOptions: any;
    isDuplex: any = false;
    scanTypes = [
        { value: 2, display: "Scan 2 mặt (bằng tay)" },
        { value: 3, display: "Scan 2 mặt" }
    ];
    scanType: any = 1;
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
        private _dynamicFieldService: DynamicFieldsServiceProxy,
        private _location: Location,
        private _commBookService: Comm_booksServiceProxy,
        private _oDocsServiceProxy: ODocsServiceProxy,
        private _orgLevelAppService: OrgLevelsServiceProxy,
        private _publishOrgAppService: PublishOrgsServiceProxy,
        private _userExtentionServiceProxy: UserExtentionServiceProxy
    ) {
        super(injector);
        this.userId = this.appSession.userId;
        this.uploadUrl = AppConsts.fileServerUrl + '/FileUpload/Upload_file?userId=' + this.userId;
        this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetWordFile?documentId=';

        this._documentTypeAppService.getAllDocumentType().subscribe(result => {
            this.signal = result[0].signal;
            this.documentTypeOptions = result;
        });

        this.link = this.router.url;
        this.processingDate = new Date();

        this._commBookService.getAllCommBookInDepartment("1", this.appSession.organizationUnitId).subscribe(res => {
            this.dataBook = res;
            if (res.length > 0) {
                this.documentData.bookDV = this.dataBook[0].id;
            }

        });

        // this._publishOrgService.getAllPublishOrg().subscribe((res)=>{
        //     this.data_publisher = res;
        //     console.log(this.data_department)
        // });

        this.previousDate = new Date(this.previousDate.setDate(this.currentDate.getDate() - 1));
    }

    getUserInOrg() {
        this._oDocsServiceProxy.getUserInRoleByOrg(this.appSession.organizationUnitId, '').subscribe((res) => {
            this.truongPhong = res.filter(x => x.roleCode == 'TP' || x.roleCode == 'TCAH' || x.roleCode == 'TCAQ');
            this.phoPhong = res.filter(x => x.roleCode == 'PTP' || x.roleCode == 'PP' || x.roleCode == 'PCAH' || x.roleCode == 'PCAQ');
        });
    }

    showPublisherPopup() {
        //this.publisherPopupVisible = true;
        this.createPublisher.show();
    }

    //get đội trong phòng
    getTeamInOrg() {
        this._documentAppService.getListDepartment(this.appSession.organizationUnitId).subscribe(res => {
            this.data_department = res;
            this.data_department.forEach(x => {
                x["mainHandling"] = false;
                x["coHandling"] = false;
                //this.loaiDV[1].dataSource.push(x);
            });
        });
    }

    chkAutomatic(e: any) {
        this.incommingNumberDisabled = !this.incommingNumberDisabled;
        if (e.value == true) { // nút tự động được chọn
            this.getIncommingNumber(this.documentData.bookDV);
        }
    }

    getIncommingNumber(soVB: number) {
        this._documentAppService.getNextIncommingNumber(soVB).subscribe(res => {
            this.nextNumber = res;
        });
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
                this.missingNumber = "Các số đi bị khuyết: " + res.slice(0,102) +"...";
                this.missingNumberSource.push(res);
            }
        });
    }
    showMissingNumberPopup(){
        this.missingNumberVisible = true;
    }

    changeBookDV(e:any) {
        this.currentBookInMissingNumberPopup = this.dataBook.filter(x=> x.id == e.value)[0]
        if (this.incommingNumberDisabled == true) {
            this.getIncommingNumber(this.documentData.bookDV);
        }
        this.getMissingIncomingNumber(this.documentData.bookDV);
        this.changeSecretLevelByBook();
    }

    back() {
        this._location.back();
    }

    transformDate(date) {
        return this.datePipe.transform(date, 'dd/MM/yyyy'); //whatever format you need.
    }

    ngOnInit() {
        this.getUserInOrg();
        this.initIncommDateOptions();
        this.getOrgLevel();
        this.getPublishOrg();
        this.initNumberOptions();
        this.initLinkedDocumentOptions();
        this.getIncommingNumber(this.documentData.bookDV);
        // this.getUserInDept();
        this.getTeamInOrg();


        this._dynamicFieldService.getDynamicFieldByModuleId(22, this.documentId).subscribe(result => {
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
            this.data_range = result[3].dataSource;
            this.data_position = result[4].dataSource;
            this.changeSecretLevelByBook();
        });

    }
    changeSecretLevelByBook(){
        let bookType = this.dataBook.find(x => x.id == this.documentData.bookDV);
        if (bookType) {
            let secretLevelVal;
            if (bookType.bookType == 1) {//sổ thường
                secretLevelVal = this.data_secretLevel.find(x => trim(x.value) == trim('Thường'));
            } else if (bookType.bookType == 2) {//sổ mật
                secretLevelVal = this.data_secretLevel.find(x => trim(x.value) == trim('Mật'));
            }
            this.secretVal = secretLevelVal.key;
        }
    }
    //get cấp gửi
    getOrgLevel() {
        this._orgLevelAppService.getAllOrgLevel().subscribe((res) => {
            // this.orgLevel = res.filter(x => x.type == null);
            this.orgLevel = res;
            this.documentData.orgLevelId = this.orgLevel.filter(e => e.code == "DVTTCATP")[0].id;
        });
    }

    orgLevelChange() {
        
        if (this.data_publisher_Initial.length > 0) {
            // this.data_publisher = this.data_publisher_Initial.filter(x => x.publishOrg.orgLevelId == this.documentData.orgLevelId);
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
        // this._publishOrgAppService.getAllPublishOrg().subscribe((res) => {
        // fix bug: chỉ lấy nơi gửi dùng chung và theo đơn vị thêm mới nơi gửi, không lấy all
        this._publishOrgAppService.getPublishOrgByUserLogin(this.appSession.organizationUnitId).subscribe((res) => {
            if (res.isSucceeded) {
                this.data_publisher_Initial = res.data;
                this.orgLevelChange();
            }
        });
    }

    save() {
        debugger
        this.setListDVXL();
        
        let result = this.documentForm.instance.validate();
        //this.setListDVXL();
        if (!this.checkPCXL()) {
            this.message.warn('Vui lòng chọn Đội chủ trì ');
            return;
        }
        if (result.isValid) {
            this._documentAppService.checkIfCondititionExists(this.documentData.number, this.documentData.orgLevelId, this.documentData.publisher, this.documentData.publishDate).subscribe(res => {
                if (res) {
                    this.confirmPopUpText = this.l('NumberExistsDoYouWantToForceSaving{0}', this.documentData.number);
                    this.confirmPopUpVisible = true;
                }
                else {
                    if (this.listDVXL_selected.filter(x => x.unitId !== null).length < 1)
                        this.saving = true;
                        
                    this.documentData.incommingNumberDV = this.nextNumber;
                    this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
                    this.documentData.incommingDateDV = moment(this.documentData.incommingDateDV).utc(true);
                    this.documentData.isActive = true;
                    this.documentData.status = false;
                    this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave : null;
                    this.documentData.unitId = this.appSession.organizationUnitId;
                    this.documentData.listDVXL = this.listDVXL_selected;
                    this.documentData.secretLevel = this.documentData.secretLevel != null ? this.documentData.secretLevel : -1;
                    this.documentData.priority = this.documentData.priority != null ? this.documentData.priority : -1;
                    this.documentData.documentTypeId = this.documentTypeIdVal;
                    if (this.documentData.deadline != null) {
                        this.documentData.deadline = moment(this.documentData.deadline).utc(true).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
                    }

                    this._documentAppService.createDocumentByDept(this.chkAutomaticValue, this.documentData)
                        .pipe(finalize(() => {
                            this.saving = false;
                        }))
                        .subscribe((ids) => {
                            if (ids != '') {
                                console.log(this.documentData.listDVXL);
                                this.notify.success('Thêm mới thành công');
                                if (this.checkDVXL(this.documentData.listDVXL)) {
                                    let a = ids.split(';');
                                    this._documentAppService.capNhatChiDaoPhong(parseInt(a[0]), parseInt(a[1]), this.documentData.bookDV, this.documentData.incommingNumberDV, this.documentData.incommingDateDV, this.documentData.listDVXL).subscribe();
                                    this.router.navigate(['/app/main/qlvb/vb-phong/da-trinh']);
                                }else{
                                    this.router.navigate(['/app/main/qlvb/vb-phong/chua-trinh']);
                                }
                            } else {
                                this.message.warn('Số đến bị trùng!');
                            }
                        }, err => {
                            this.message.warn(err.message);
                        });
                }
            });

        }
    }

    checkPCXL() {
        debugger
        let hasCoHandling = false;
        let hasMainHandling = false;
        for (let data of this.data_department) {
            if (data.coHandling == true) {
                hasCoHandling = true;
                break;
            }
        }
        if (hasCoHandling) {
            for (let data of this.data_department) {
                if (data.mainHandling == true) {
                    hasMainHandling = true;
                    break;
                }
            }
        }
        if ((hasMainHandling && hasCoHandling) || (!hasMainHandling && !hasCoHandling))
            return true;
        return false;
    }

    checkDVXL(dsDVXL) {
        console.log(dsDVXL);
        let isCoChiDao = dsDVXL.findIndex(x => x.userId > 0 && x.processRecomend != null && x.processRecomend != '' && (x.typeHandling == 1 || x.typeHandling == 0));
        let isCoDoiXL = dsDVXL.findIndex(x => x.unitId > 0 && x.typeHandling == 1);
        if (isCoChiDao != -1 && isCoDoiXL != -1) {
            return true;
        }
        return false;
    }

    setListDVXL() {
        this.listDVXL_selected.length = 0;

        if (this.truongPhongVal) {
            let dvxl = new ListDVXL();
            dvxl.userId = this.truongPhongVal;
            dvxl.typeHandling = 1;
            dvxl.processRecomend = this.tpComment;
            dvxl.dateHandle = moment(this.tpDate);
            this.listDVXL_selected.push(dvxl);
        }

        if (this.phoPhongVal) {
            let dvxl = new ListDVXL();
            dvxl.userId = this.phoPhongVal;
            dvxl.typeHandling = 0;
            dvxl.processRecomend = this.ppComment;
            dvxl.dateHandle = moment(this.ppDate);
            this.listDVXL_selected.push(dvxl);
        }

        this.data_department.forEach(receiver => {
            if (receiver["mainHandling"] == true || receiver["coHandling"] == true) {
                let dvxl = new ListDVXL();
                dvxl.userId = receiver.userId;
                dvxl.unitId = receiver.id;
                dvxl.dateHandle = moment(new Date());
                if (receiver["mainHandling"] == true) {
                    dvxl.typeHandling = 1;
                }
                else if (receiver["coHandling"] == true) {
                    dvxl.typeHandling = 0;
                }
                this.listDVXL_selected.push(dvxl);
            }
        });
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

    deleteFile(e: any) {
        // this.selectedRows.splice(this.selectedRows.indexOf(e.row.data.tepDinhKem), 1);
         this.selectedRows.splice(this.selectedRows.findIndex(x=>x.tepDinhKem===e.data.tepDinhKem), 1);
        this.tepDinhKemSave = this.selectedRows.map(x => { return x.tepDinhKem.toString() }).join(';');

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
        })


    }


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

    initBookOptions() {
        const self = this;
        this.bookOptions = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                    const promise = new Promise((resolve, reject) => {
                        self._commBookService.getAllCommBook().subscribe(result => {
                            self.dataBookDepartment = result;
                            self.documentData.book = result[0].id;
                            resolve(result);

                            //this.documentData.book = result[0].id
                        }, err => {
                            reject(err);
                        });

                    });
                    return promise;
                }
            },
            readOnly: false,
            valueExpr: 'id',
            displayExpr: 'name',
            searchEnabled: true,
            searchExpr: 'name',
            onValueChanged: function (e) {
                let curBook = self.dataBookDepartment.find(x => x.id == e.value);
                self.currentSyntax = curBook.syntax;
                if (self.currentSyntax.includes("{currentValue}")) {
                    let x = self.dataBookDepartment.find(x => x.id == e.previousValue);
                    if (x) {
                        self.oldNumber = (parseInt(x.currentValue) + 1).toString();
                    }
                    else {
                        self.oldNumber = "{currentValue}";
                    }
                    self.currentNumberInBook = (parseInt(curBook.currentValue) + 1).toString();
                }
            }
        }
    }

    initNumberOptions() {
        const self = this;
        this.numberOptions = {
            readOnly: false,
            onValueChanged: function (e) {
                self.isNumberDisabled = !self.isNumberDisabled;
                if (e.value == true) { // nút tự động được chọn
                    //let curBook = self.dataBookDepartment.find(x => x.id == self.documentData.bookInDept);
                    //self.currentSyntax = curBook.syntax;
                    if (self.currentSyntax.includes("{currentValue}")) {
                        self.soKyHieu = self.currentSyntax.replace("{currentValue}", self.currentNumberInBook);
                    }
                    if (self.currentSyntax.includes("{documentType}")) {
                        if (!self.documentData.documentTypeId) {
                            self.chkAutomaticNumberValue = false;
                            self.notify.warn("Chọn Loại VB");
                            self.soKyHieu = "";
                            return;
                        }
                        let selectedDocType = self.documentTypeOptions.find(x => x.id == self.documentData.documentTypeId).signal;
                        self.soKyHieu = self.soKyHieu.replace("{documentType}", selectedDocType);
                    }
                    if (self.currentSyntax.includes("{range}")) { // lĩnh vực
                        if (!self.documentData.range) {
                            self.chkAutomaticNumberValue = false;
                            self.notify.warn("Chọn Lĩnh vực");
                            self.soKyHieu = "";
                            return;
                        }

                        self.soKyHieu = self.soKyHieu.replace("{range}", self.data_range.find(x => x.key == self.documentData.range).value);
                    }
                    if (self.currentSyntax.includes("{publisher}")) {
                        self.soKyHieu = self.soKyHieu.replace("{publisher}", self.publisherVal);

                        // self.soKyHieu = self.soKyHieu.replace("{publisher}", self.data_department.find(x => x.id == self.documentData.publisher).shortentCode);
                    }

                }
                //self.documentData.numberInDept = self.soKyHieu;
            }
        };
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

            }
        };
    }
    linkedDocumentDatasource:any=[];
    linkedDocumentDatasource1:any=[];
    //khởi tạo linkedDocumentOptions cho văn bản liên kết
    initLinkedDocumentOptions() {
        console.log(this.appSession.organizationUnitId)
        // const self = this;
        // this.linkedDocumentOptions = {
        //     showClearButton: true,
        //     displayExpr: 'Number',
        //     valueExpr: 'Id',
        //     searchEnabled: true,
        //     searchExpr: ['Number'],
        //     dataSource: {
        //         loadMode: 'raw',
        //         load: function () {
        //             const promise = new Promise((resolve, reject) => {
        //                 self._documentAppService.getListODocForLinkedDocument(self.appSession.organizationUnitId).subscribe(result => {
        //                     console.log(result)
        //                     resolve(result);
        //                 }, err => {
        //                     reject(err);
        //                 });
        //             });
        //             return promise;
        //         }
        //     }
        // }
        // this._documentAppService.getListODocForLinkedDocument(this.appSession.organizationUnitId).subscribe(result => {
        //     this.linkedDocumentDatasource1 = result;
        //     this.linkedDocumentDatasource = result;
        // })
    }

    onYesConfirmPopUp() {
        this.setListDVXL();
        let result = this.documentForm.instance.validate();
        //this.setListDVXL();
        if (result.isValid) {
            if (this.listDVXL_selected.filter(x => x.unitId !== null).length < 1)
                this.saving = true;
            
            this.documentData.incommingNumberDV = this.nextNumber;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.incommingDateDV = moment(this.documentData.incommingDateDV).utc(true);
            this.documentData.incommingDate = this.documentData.incommingDateDV;
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave : null;
            this.documentData.unitId = this.appSession.organizationUnitId;
            this.documentData.listDVXL = this.listDVXL_selected;
            this.documentData.secretLevel = this.documentData.secretLevel != null ? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null ? this.documentData.priority : -1;
            if (this.documentData.deadline != null) {
                this.documentData.deadline = moment(this.documentData.deadline).utc(true).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            }

            this._documentAppService.createDocumentByDept(this.chkAutomaticValue, this.documentData)
                .pipe(finalize(() => {
                    this.saving = false;

                }))
                .subscribe((ids) => {
                    if (ids != '') {
                        this.notify.success('Thêm mới thành công');
                        if (this.documentData.listDVXL.findIndex(x => x.userId > 0 && x.processRecomend !== null && x.typeHandling == 1) > -1 && this.documentData.listDVXL.findIndex(x => x.unitId > 0 && x.typeHandling == 1) > -1) {
                            let a = ids.split(';');
                            this._documentAppService.capNhatChiDaoPhong(parseInt(a[0]), parseInt(a[1]), this.documentData.bookDV, this.documentData.incommingNumberDV, this.documentData.incommingDateDV, this.documentData.listDVXL).subscribe();

                        }
                        this.router.navigate(['/app/main/qlvb/vb-phong/chua-trinh']);
                    }
                    else {
                        this.message.warn('Số đến bị trùng!');
                    }
                });
        }
    }

    onCancelConfirmPopUp() {
        this.documentData.number = '';
        this.documentForm.instance.getEditor("number").focus();
        this.confirmPopUpVisible = false;
    }

    onViewConfirmPopUp() {
        this.documentHaveNumberExists.Number = this.documentData.number;
        this.documentHaveNumberExists.OrgLevelId = this.documentData.orgLevelId;
        this.documentHaveNumberExists.Publisher = this.documentData.publisher;
        this.documentHaveNumberExists.PublishDate = this.documentData.publishDate;
        this.documentHaveNumberExists.loadDataWithConditition();
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
    syncTreeViewSelection() {
        if (!this.treeView) return;

        if (!this.treeBoxValue) {
            this.treeView.instance.unselectAll();
        } else {
            this.treeView.instance.selectItem(this.treeBoxValue);
        }
    }

    treeView_itemSelectionChanged(e) {
        this.documentData.publisher = e.node.key;
        // this.linkedDocumentDatasource = this.linkedDocumentDatasource1.filter(ele => ele.ReceicerIds != null && ele.ReceicerIds.includes(this.documentData.publisher.toString()));
        
        this.publisherSelect.instance.close();
    }

    blockScrollTreeView(e) {
        const that = this;
        e.component.selectItem(that.treeBoxValue);
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
