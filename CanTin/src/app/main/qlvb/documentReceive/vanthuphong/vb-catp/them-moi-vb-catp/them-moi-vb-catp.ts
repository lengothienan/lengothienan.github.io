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
import {formatDate} from '@angular/common';
import $ from 'jquery';
import { DxTabPanelComponent, DxFormComponent } from 'devextreme-angular';
import { Location } from '@angular/common';
import { CreatePublisherComponent } from '@app/main/documentHelper/createPublisher.component';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './them-moi-vb-catp.html',
    styleUrls: ['./them-moi-vb-catp.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
    animations: [appModuleAnimation()]

})
//thêm vb mới hoàn toàn của văn thư phòng
export class TiepNhanTuCATPComponent extends AppComponentBase implements OnInit{
    @ViewChild('documentForm', {static: true}) documentForm: DxFormComponent;
    @ViewChild('tabPanel', { static: true }) tabPanel: DxTabPanelComponent;
    @ViewChild('createPublisher', { static: true}) createPublisher: CreatePublisherComponent;
    documentData: CreateDocumentDto = new CreateDocumentDto();
    documentId: number;
    documentTypeOptions: DocumentTypeDto[] = [];
    priorityOptions: PriorityDto[] = [];
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
    //lưu index của đơn vị chủ trì
    previousMainHandlingId: number;
    previousUserMainHandlingId: number;
    old_DVXL = [];
    dataBook = [
        { id: 1, name: 'Sổ thường'  },
        { id: 2, name: 'Sổ mật' },
    ];

    dataBookDV = [];
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
    leaderDepartmentName: any ;
    captain_department = [];
    director_list = [];
    historyUpload: any ;
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
    data_DVXL:any
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
    // isVisible = true;
    incommingNumberDisabled = true;
    bookOptions: any;
    dataBookDepartment = [];
    currentSyntax = "";
    oldNumber = "";
    currentNumberInBook: string;
    isNumberDisabled= false;
    numberOptions: any;
    chkAutomaticNumberValue = false;
    soKyHieu: string;
    loaiDV = [

        { type: 2, name: 'Danh sách đội trong phòng', dataSource: [
            // {
            //     fullName: 'Đội 1',
            //     id: 1,
            //     mainHandling: false,
            //     coHandling: false
            // },
            // {
            //     fullName: 'Đội 2',
            //     id: 2,
            //     mainHandling: false,
            //     coHandling: false
            // },
            // {
            //     fullName: 'Đội 3',
            //     id: 3,
            //     mainHandling: false,
            //     coHandling: false
            // }
        ]}
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
    currentUser:any;
    constructor(
        injector: Injector,
        private router: Router,
        protected activeRoute: ActivatedRoute,
        private datePipe: DatePipe,
        private _documentTypeAppService: DocumentTypesServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _documentHandlingAppService :DocumentHandlingsServiceProxy,
        private _dynamicFieldService: DynamicFieldsServiceProxy,
        private _location: Location,
        private _commBookService: Comm_booksServiceProxy,
        private _oDocsServiceProxy: ODocsServiceProxy,
        private _orgLevelAppService: OrgLevelsServiceProxy,
        private _publishOrgAppService: PublishOrgsServiceProxy
    ) {
        super(injector);
        this.userId = this.appSession.userId;
        this.uploadUrl = AppConsts.fileServerUrl  + '/fileupload/Upload_file?userId=' + this.userId ;
        this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetWordFile?documentId=';

        this._documentTypeAppService.getAllDocumentType().subscribe(result => {
            this.signal = result[0].signal;
            this.documentTypeOptions = result;
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
        });
        this.link = this.router.url;
        this.processingDate = new Date();

        // this._publishOrgService.getAllPublishOrg().subscribe((res)=>{
        //     this.data_publisher = res;
        //     console.log(this.data_department)
        // });

    }

    getUserInOrg(){
        this._oDocsServiceProxy.getUserInRoleByOrg(this.appSession.organizationUnitId, '').subscribe((res)=>{
            this.truongPhong = res.filter(x => x.roleCode == 'TP');
            this.phoPhong = res.filter(x => x.roleCode == 'PP');
            console.log(this.phoPhong)
        });
    }

    showPublisherPopup(){
        //this.publisherPopupVisible = true;
        this.createPublisher.show();
    }

    //get đội trong phòng
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

    chkAutomatic(e: any){
        this.incommingNumberDisabled = !this.incommingNumberDisabled;
        if(e.value == true){ // nút tự động được chọn
            this.getIncommingNumber(this.documentData.book);
        }
    }

    getIncommingNumber(soVB: number) {
        this._documentAppService.getNextIncommingNumber(soVB).subscribe(res => {
            this.nextNumber = res;
            this.documentData.incommingNumber = this.nextNumber;
        });
    }


    back(){
        this._location.back();
    }

    transformDate(date) {
        return this.datePipe.transform(date, 'dd/MM/yyyy'); //whatever format you need.
    }

    ngOnInit(){
        const that = this;
        this.getUserInOrg();
        this.initIncommDateOptions();
        this.getOrgLevel();
        // this.getPublishOrg();
        this.initNumberOptions();
        this.getIncommingNumber(1);
        this.getTeamInOrg();
        this._dynamicFieldService.getDynamicFieldByModuleId(22, this.documentId).subscribe(result => {
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
            this.data_range = result[3].dataSource;
            this.data_position = result[4].dataSource;
        });
        const Id = this.activeRoute.snapshot.paramMap.get('id');

        if(Id != null){
            this.documentId = Number.parseInt(Id);
            this._documentAppService.getDocumentEditByDocumentId(this.documentId).subscribe((result) => {
                this._publishOrgAppService.getPublishOrgByOrgLevel(result.orgLevelId).subscribe(res => {
                    this.data_publisher = res;
                    console.log(res);
                    this.publisherVal = result.publisher;
                })
            });
            
            this.currentUser = abp.session.userId;
            console.log(this.currentUser)
     
            
            this._documentAppService.updateSeenStatus(this.documentId,this.currentUser).subscribe()
        }

        this._commBookService.getAllCommBookInDepartment("1", this.appSession.organizationUnitId).subscribe(result => {
            this.dataBookDV = result;
        })

    }

    onBookDVValueChanged(e){
        console.log(e);
    }

    //get cấp gửi
    getOrgLevel(){
        this._orgLevelAppService.getAllOrgLevel().subscribe((res)=>{
            this.orgLevel = res;
            this.documentData.orgLevelId = this.orgLevel[0].id;
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

    save(){
        this.setListDVXL();
        let result = this.documentForm.instance.validate();
        //this.setListDVXL();
        if(result.isValid){
            //this.saving = true;
            this.documentData.publishDate = moment(this.documentData.publishDate).utc(true);
            this.documentData.incommingDate = moment(this.documentData.incommingDate).utc(true);

            this.documentData.deadline = moment(this.documentData.deadline).utc(true);
            this.documentData.isActive = true;
            this.documentData.status = false;
            // this.documentData.incommingDate = moment(this.currentDate);
            // this.documentData.numberOfDays = this.numberOfDaysByDocType;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
            this.documentData.unitId = this.appSession.organizationUnitId;

            //this.documentData.publisher = this.publisherSelect.value;
            this.documentData.listDVXL = this.listDVXL_selected;
            this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;
            // if(this.deadLineDate != null){
            //     this.documentData.deadline = moment(this.deadLineDate).utc(true).set({hour: 0, minute: 0, second: 0, millisecond: 0});
            // }

            this._documentAppService.createDocumentByDept(this.chkAutomaticValue, this.documentData)
                .pipe(finalize(() => { //this.saving = false;
                }))
                .subscribe((ids) => {
                    if(ids != ''){
                        this.notify.success('Thêm mới thành công');

                        //this.router.navigate(['/app/main/qlvb/incomming-document/edit/'+ ids]);
                    }
                    else{
                        this.message.warn('Số đến bị trùng!');
                }
            });


        }
        console.log(this.documentData)
    }

    setListDVXL(){
        this.listDVXL_selected.length = 0;
        console.log(this.truongPhongVal, this.phoPhongVal)
        if(this.truongPhongVal){
            let dvxl = new ListDVXL();
            dvxl.userId = this.truongPhongVal;
            dvxl.typeHandling = 1;
            dvxl.processRecomend = this.tpComment;
            this.listDVXL_selected.push(dvxl);
        }

        if(this.phoPhongVal){
            let dvxl = new ListDVXL();
            dvxl.userId = this.phoPhongVal;
            dvxl.typeHandling = 0;
            dvxl.processRecomend = this.ppComment;
            this.listDVXL_selected.push(dvxl);
        }

        this.data_department.forEach(receiver => {
            if(receiver["mainHandling"] == true || receiver["coHandling"] == true){
                let dvxl = new ListDVXL();
                dvxl.userId = receiver.userId;
                dvxl.unitId = receiver.id;
                if(receiver["mainHandling"] == true){
                    dvxl.typeHandling = 1;
                }
                else if(receiver["coHandling"] == true){
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

    initBookOptions(){
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
            onValueChanged: function(e){
                let curBook = self.dataBookDepartment.find(x => x.id == e.value);
                self.currentSyntax = curBook.syntax;
                if(self.currentSyntax.includes("{currentValue}")){
                    let x = self.dataBookDepartment.find(x => x.id == e.previousValue);
                    if(x){
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
                if(e.value == true){ // nút tự động được chọn
                    //let curBook = self.dataBookDepartment.find(x => x.id == self.documentData.bookInDept);
                    //self.currentSyntax = curBook.syntax;
                    if(self.currentSyntax.includes("{currentValue}")){
                        self.soKyHieu = self.currentSyntax.replace("{currentValue}", self.currentNumberInBook);
                    }
                    if(self.currentSyntax.includes("{documentType}")){
                        if(!self.documentData.documentTypeId){
                            self.chkAutomaticNumberValue = false;
                            self.notify.warn("Chọn Loại VB");
                            self.soKyHieu = "";
                            return;
                        }
                        let selectedDocType = self.documentTypeOptions.find(x => x.id == self.documentData.documentTypeId).signal;
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
                        console.log(self.data_department.find(x => x.id == self.documentData.publisher));
                        self.soKyHieu = self.soKyHieu.replace("{publisher}", self.publisherVal);

                        // self.soKyHieu = self.soKyHieu.replace("{publisher}", self.data_department.find(x => x.id == self.documentData.publisher).shortentCode);
                    }

                }
                //self.documentData.numberInDept = self.soKyHieu;
            }
        };
    }

    initIncommDateOptions(){
        const that = this;
        this.incommDateOptions = {
            showClearButton: true,
            displayFormat: 'dd/MM/yyyy',
            format: 'dd/MM/yyyy',
            value: that.currentDate,
            onValueChanged: function(e){

                // if(that.documentData.numberOfDays == null)
                // {
                //     that.documentData.deadline = null;
                // }
                if(that.documentData.numberOfDays !== null && e.value !== null) {
                    //that.documentData.deadline = moment(that.addDays(e.value, that.documentData.numberOfDays));
                }
            }
        };
    }

}
