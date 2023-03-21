import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, PriorityDto, TextBookDto, DynamicFieldsServiceProxy, HandlingUser, DocumentHandlingsServiceProxy, Comm_booksServiceProxy, PublishOrgsServiceProxy, GetUserInRoleDto, ODocsServiceProxy, ListDVXL, OrgLevelsServiceProxy, CreateDocumentDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
// import { TransferHandleModalComponent } from '../transfer-handle/transfer-handle-modal';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import $ from 'jquery';
import { DxTabPanelComponent, DxFormComponent, DxDataGridComponent } from 'devextreme-angular';
import { Location } from '@angular/common';
import { CreatePublisherComponent } from '@app/main/documentHelper/createPublisher.component';
import { finalize } from 'rxjs/operators';
import { DocumentHaveNumberExistsComponent } from '../../create-document/documentHaveNumberExists.component';

@Component({
    templateUrl: './create-Document.component.html',
    styleUrls: ['./create-Document.component.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
    animations: [appModuleAnimation()]

})
//thêm vb đến gửi nội bộ 
export class CreateDocumentLocalComponent extends AppComponentBase implements OnInit {
    @ViewChild('documentHaveNumberExists', { static: true }) documentHaveNumberExists: DocumentHaveNumberExistsComponent;
    @ViewChild('documentForm', { static: true }) documentForm: DxFormComponent;
    @ViewChild('tabPanel', { static: true }) tabPanel: DxTabPanelComponent;
    @ViewChild('createPublisher', { static: true }) createPublisher: CreatePublisherComponent;
    @ViewChild('gridContainerOrg', { static: true }) gridContainerOrg: DxDataGridComponent;

    documentData: CreateDocumentDto = new CreateDocumentDto();
    documentId: number;
    documentTypeOptions: DocumentTypeDto[] = [];
    priorityOptions: PriorityDto[] = []; 
    nextNumber: string;
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
    secretVal: any;
    priorityVal: any;
    rangeVal: any;
    positionVal: any;
    printUrl = '';
    incommingNumberDisabled = true;
    dataBookDepartment = [];
    currentSyntax = "";
    oldNumber = "";
    currentNumberInBook: string;
    isNumberDisabled = false;
    chkAutomaticNumberValue = false;
    soKyHieu: string;
    loaiDV = [

        {
            type: 2, name: 'Danh sách đội trong phòng', dataSource: [
            ]
        }
    ];

    doiPho: GetUserInRoleDto[];
    selectedItem: any;
    chi_huy: GetUserInRoleDto[] = [];
    listDVXL_selected: ListDVXL[] = [];
    orgLevel: any;
    orgLevelVal: any;
    data_publisher_Initial = [];
    userInOrg: GetUserInRoleDto[] = [];
    phoPhong: GetUserInRoleDto[];
    truongPhong: GetUserInRoleDto[];
    tpComment = '';
    ppComment = '';
    tpDate = new Date();
    ppDate = new Date();
    saving = false;
    confirmPopUpText: any;
    confirmPopUpVisible = false;
    doiTruong: GetUserInRoleDto[];
    doiTruongVal: number;
    doiTruongObj: any;
    dtComment = '';
    dtDate: Date;
    doiPhoVal: number;
    doiPhoObj: any;
    dpComment = '';
    dpDate: Date;

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
        private _publishOrgAppService: PublishOrgsServiceProxy
    ) {
        super(injector);
        this.userId = this.appSession.userId;
        this.uploadUrl = AppConsts.fileServerUrl  + '/fileupload/Upload_file?userId=' + this.userId;
        this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetWordFile?documentId=';

        this._documentTypeAppService.getAllDocumentType().subscribe(result => {
            this.signal = result[0].signal;
            this.documentTypeOptions = result;
        });

        this.link = this.router.url;
        this.processingDate = new Date();
        this._documentAppService.getListLocalOrganizationUnit(this.appSession.organizationUnitId, this.appSession.selfOrganizationUnitId).subscribe((res) => {
            this.data_publisher = res;
        });

    }


    ngOnInit() {
        this.getUserInOrg();
        this.initIncommDateOptions();
        this.getOrgLevel();

        this._dynamicFieldService.getDynamicFieldByModuleId(22, this.documentId).subscribe(result => {
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
            this.data_range = result[3].dataSource;
            this.data_position = result[4].dataSource;
        });

    }
    showPublisherPopup() {
        this.createPublisher.show();
    }

    getUserInOrg() {
        this._oDocsServiceProxy.getUserInRoleByOrg(this.appSession.organizationUnitId, '').subscribe((res) => {
            this.truongPhong = res.filter(x => x.roleCode == 'TP');
            this.phoPhong = res.filter(x => x.roleCode == 'PP');
            this.doiTruong = res.filter(x => x.roleCode == 'DT');
            this.doiPho = res.filter(x => x.roleCode == 'PDT');
            this.data_department = res.filter(x => x.roleCode == 'CB' && x.organizationUnitId ==this.appSession.selfOrganizationUnitId);
            this.data_department.forEach(x => {
                x['mainHandling'] = false;
                x['coHandling'] = false;
            });
        });
    }




    back() {
        this._location.back();
    }

    transformDate(date) {
        return this.datePipe.transform(date, 'dd/MM/yyyy'); //whatever format you need.
    }


    //get cấp gửi
    getOrgLevel() {
        this._orgLevelAppService.getAllOrgLevel_NotTPSBN().subscribe((res) => {
            this.orgLevel = res.filter(x => x.type == null);
            this.documentData.orgLevelId = this.orgLevel[0].id;
        });
    }

    //get nơi gửi

    save() {
        const self= this;
        this.setListDVXL();
        let result = this.documentForm.instance.validate();

        if (!this.checkPCXL()) {
            this.message.warn('Vui lòng chọn cán bộ chủ trì ');
            return;
        }

        if (result.isValid) {

            if (this.listDVXL_selected.filter(x => x.unitId !== null).length < 1)
                this.saving = true;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.incommingDateDV = moment(this.documentData.incommingDateDV).utc(true);
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.unitId = this.appSession.selfOrganizationUnitId;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave : null;
            this.documentData.listDVXL = this.listDVXL_selected;
            this.documentData.secretLevel = this.documentData.secretLevel != null ? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null ? this.documentData.priority : -1;
            debugger
            if (this.documentData.deadline != null) {
                this.documentData.deadline = moment(this.documentData.deadline).utc(true);
                //this.documentData.deadline = moment(this.documentData.deadline).utc(true).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
            }

            this._documentAppService.createDocumentByTeam(this.documentData)
                .pipe(finalize(() => {
                    this.saving = false;

                }))
                .subscribe((ids) => {
                    if (ids != '') {
                        this.notify.success('Thêm mới thành công');
                        if (self.documentData.listDVXL.findIndex(x => x.userId > 0 && x.processRecomend !== null && x.typeHandling == 1)
                            > -1 && self.documentData.listDVXL.findIndex(x => x.unitId > 0 && x.typeHandling == 1) > -1) {
                            let a = ids.split(';');
                            self._documentAppService.capNhatChiDaoDoi(parseInt(a[0]), parseInt(a[1]), self.documentData.listDVXL).subscribe(
                                ()=>{
                                    this.router.navigate(['/app/main/qlvb/van-ban-den-tu-cac-doi-da-xu-ly']);
                                }
                            );
                            this.router.navigate(['/app/main/qlvb/van-ban-den-tu-cac-doi-da-xu-ly']);
                        }

                        this.router.navigate(['/app/main/qlvb/van-ban-den-tu-cac-doi-chua-xu-ly']);


                    }
                    else {
                        this.message.warn('Số đến bị trùng!');
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

    setListDVXL() {

        this.listDVXL_selected.length = 0;

        if (this.doiTruongVal) {
            let dvxl = new ListDVXL();
            dvxl.userId = this.doiTruongVal;
            dvxl.typeHandling = 1;
            dvxl.processRecomend = this.dtComment;
            dvxl.dateHandle = moment(this.dtDate);
            this.listDVXL_selected.push(dvxl);
        }

        if (this.doiPhoVal) {
            let dvxl = new ListDVXL();
            dvxl.userId = this.doiPhoVal;
            dvxl.typeHandling = 0;
            dvxl.processRecomend = this.dpComment;
            dvxl.dateHandle = moment(this.dpDate);
            this.listDVXL_selected.push(dvxl);
        }

        this.data_department.forEach(receiver => {
            if (receiver["mainHandling"] == true || receiver["coHandling"] == true) {
                let dvxl = new ListDVXL();
                dvxl.userId = receiver.userId;
                dvxl.unitId = this.appSession.selfOrganizationUnitId;
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
        if (e.value.length < e.previousValue.length) {
            this.arr_diff(e.value, e.previousValue).forEach(el => {
                this.dataSource.findIndex(x => x.userId == el);
                let index = this.dataSource.findIndex(x => x.userId == el);
                this.dataSource[index]["mainHandling"] = false;
                this.dataSource[index]["coHandling"] = false;
                this.listReceive.splice(this.listReceive.findIndex(element => element.userId == el), 1);
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
        debugger
        let index = this.data_department.findIndex(x => x.userId == cell.data.userId);
        //kiểm tra cột vừa thao tác là main hay co
        switch (cell.column.dataField) {
            case 'mainHandling':
                //kiểm tra có đvxl chính chưa, nếu có rồi thì bỏ chọn cái trước
                if (this.previousMainHandlingId >= 0) {
                    let temp = this.data_department.findIndex(x => x.userId == this.previousMainHandlingId);
                    this.data_department[temp]["mainHandling"] = false;
                }

                if (this.data_department[index]["coHandling"] == true) {
                    this.data_department[index]["coHandling"] = false;
                }

                this.data_department[index]["mainHandling"] = e.value;

                //giữ id của đơn vị đang nắm chủ trì
                this.previousMainHandlingId = cell.data.userId;
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

            }
        };
    }



    onYesConfirmPopUp() {
        const self =this;
        this.setListDVXL();
        let result = this.documentForm.instance.validate();
        //this.setListDVXL();
        if (result.isValid) {
            if (this.listDVXL_selected.filter(x => x.unitId !== null).length < 1)
                this.saving = true;
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
                        if (self.documentData.listDVXL.findIndex(x => x.userId > 0 && x.processRecomend !== null && x.typeHandling == 1) > -1 && self.documentData.listDVXL.findIndex(x => x.unitId > 0 && x.typeHandling == 1) > -1) {
                            let a = ids.split(';');
                            self._documentAppService.capNhatChiDaoDoi(parseInt(a[0]), parseInt(a[1]), self.documentData.listDVXL).subscribe();
                        }
                        self.router.navigate(['/app/main/qlvb/vb-phong/chua-trinh']);
                    }
                    else {
                        self.message.warn('Số đến bị trùng!');
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

    newSelectedDVXL: ListDVXL[] = [];
    onCheckBoxMainChanged(e, cell) {
        const self=this;
        let index = this.data_department.findIndex(x => x.userId == cell.data.userId);
        this.data_department.forEach(receiver => {
            if (receiver["userId"]!=cell.data.userId)
                {
                    receiver["mainHandling"] =false ;
                    self.gridContainerOrg.instance.refresh();
                }
                else{
                    receiver["mainHandling"] =true ;
                    receiver["coHandling"] =false ;
                    self.gridContainerOrg.instance.refresh();
                }
        });
        this.newSelectedDVXL.splice(this.newSelectedDVXL.findIndex(x => x.userId == cell.data.userId), 1);
        if (e.value == true) {
            let dvxl = new ListDVXL();
            dvxl.userId = this.data_department[index].userId;
            dvxl.typeHandling = 1;
            dvxl.dateHandle = moment(new Date()).utc(true);
            this.newSelectedDVXL.push(dvxl);
        }
    }
    onCheckBoxCoChanged(e, cell) {
        const self=this;
        let index = this.data_department.findIndex(x => x.userId == cell.data.userId);
        this.data_department.forEach(receiver => {
            if (receiver["userId"]==cell.data.userId)
                {
                    receiver["mainHandling"] =false ;
                    receiver["coHandling"] =true ;
                    self.gridContainerOrg.instance.refresh();
                }

        });
        this.newSelectedDVXL.splice(this.newSelectedDVXL.findIndex(x => x.userId == cell.data.userId), 1);
        if (e.value == true) {
            let dvxl = new ListDVXL();
            dvxl.userId = this.data_department[index].userId;
            dvxl.typeHandling = 0;
            dvxl.dateHandle = moment(new Date()).utc(true);
            this.newSelectedDVXL.push(dvxl);
        }
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
