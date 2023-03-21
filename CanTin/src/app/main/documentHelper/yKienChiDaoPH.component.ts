import { Component, Injector, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DocumentServiceProxy, DocumentHandlingsServiceProxy, GetUserInRoleDto, ODocsServiceProxy, ListDVXL, ApproveDocumentDto, CapNhatChiDaoDto, Comm_booksServiceProxy, UserExtenTionDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DxFormComponent } from 'devextreme-angular';

import {  ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { AppConsts } from '@shared/AppConsts';
import { isNullOrUndefined } from 'util';
import { formatDate } from '@angular/common';


@Component({
    selector: 'yKienChiDaoPH',
    templateUrl: './yKienChiDaoPH.component.html',
    animations: [appModuleAnimation()]
})
//ý kiến chỉ đạo phối hợp cho vb đến phòng
export class YKienChiDaoPHComponent extends AppComponentBase implements OnInit{
    @ViewChild('yKienChiDaoModal', { static: false }) yKienChiDaoModal: ModalDirective;
    @ViewChild('formYKienChiDao', {static: false}) formYKienChiDao: DxFormComponent;

    @Output() saveSuccess = new EventEmitter<any>();
    @Output() listDVXL_Select = new EventEmitter<ListDVXL[]>();
    //@Input() docId: number;
    saving = false;
    data_department = [];
    data_department_initial = [];
    selectionChangedBySelectbox: boolean;
    phoPhong: GetUserInRoleDto[];
    truongPhong: GetUserInRoleDto[];
    truongPhongVal: number;
    phoPhongVal: number;
    truongPhongObj: any;
    phoPhongObj: any;
    tpComment = '';
    ppComment = '';
    tpDate: Date = new Date();
    ppDate: Date = new Date();
    //lưu id của đơn vị chủ trì
    previousMainHandlingId: number;
    old_DVXL = [];
    currentDate = new Date();
    isDirty = false; // có thay đổi ĐVXL
    listDVXL_selected: ListDVXL[] = [];
    formData: any ={};
    documentHandlingId: number;
    docId: number;
    incommingNumber = '';
    listDoc: ApproveDocumentDto[] = [];
    capNhatDto: CapNhatChiDaoDto = new CapNhatChiDaoDto();
    tpDateOptions: any;
    ptpDateOptions: any;
    currenDate: Date;
    disabled = false;
    incommDateOptions: any;
    incommingNumberDisabled = true;
    book: number = -1;
    incommingDate: Date;
    dataBook = [];
    chkAutomaticValue = true;
    nextNumber = '';
    incommingNumberDV = '';
    daVaoSo = false;
    isDuplex:any = false;
    scanTypes = [
        {value: 2, display: "Scan 2 mặt (bằng tay)"},
        {value: 3, display: "Scan 2 mặt"}
    ];
    selectedRows = [];
    scanType: any = 1;
    uploadUrl: string;
    userId: number;
    value: any[] = [];
    tepDinhKemSave = '';
    rootUrl : string ;
    link = '';
    dataDisplay = [];
    currentTime :any ;
    ykienchidao:any ='';

    private _userExtentionServiceProxy: any;
    constructor(
        injector: Injector,
        private _commBookService: Comm_booksServiceProxy,
        private _oDocsServiceProxy: ODocsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _documentHandlingAppService: DocumentHandlingsServiceProxy) {
        super(injector);
        this.userId = this.appSession.userId;
        this.uploadUrl = AppConsts.fileServerUrl  + '/fileupload/Upload_file?userId=' + this.userId ;
        this._commBookService.getAllComm_BookByOrgAndType(this.appSession.organizationUnitId, "1").subscribe(res => {
            this.dataBook = res;
            console.log(res)
            // if(res.length > 0){
            //     this.documentData.bookDV = this.dataBook[0].id;
            // }

        });

        this.currenDate = new Date();
    }

    ngOnInit(): void {
        this.initIncommDateOptions();
        this.getUserInOrg();
        this.getTeamInOrg();
        if (this.book==null || this.book==undefined)
            this.book=-1
    }

    show(){
        //this.getOrgLevel();
        this.selectedRows =[];
        if(this.incommingNumberDV !== '' && this.incommingNumberDV !== null && this.incommingNumberDV !== undefined){
            this.daVaoSo = true;
            this.incommingNumberDisabled = true;
            this.formData.incommingDateDV = moment(this.incommingDate);
            this.formData.bookDV = this.book;
            this.formData.incommingNumberDV = this.incommingNumberDV;


        }
        else{
            this.daVaoSo = false;
            this.formData.incommingDateDV = this.currentDate;
        }
        if(this.capNhatDto.listDocs[0].attachment){
            var num = this.capNhatDto.listDocs[0].attachment.split(';');
            num.forEach((ele)=>{
                this.selectedRows.push({tepDinhKem: ele});
            });
        }
        this.formData.processingRecommended =this.ykienchidao;

        this.yKienChiDaoModal.show();
        this.getInitial();
    }

    getTeamInOrg(){
        this._documentAppService.getListDepartment(this.appSession.organizationUnitId).subscribe(res =>{
            this.data_department_initial = res;
            this.data_department_initial.forEach(x => {
                x["mainHandling"] = false;
                x["coHandling"] = false;
                //this.loaiDV[1].dataSource.push(x);
            });
            this.data_department.length = 0;
            this.data_department = [].concat(this.data_department_initial);
        });
    }

    getUserInOrg(){
        this._oDocsServiceProxy.getUserInRoleByOrg(this.appSession.organizationUnitId, '').subscribe((res)=>{
            this.truongPhong = res.filter(x => x.roleCode == 'TP');
            this.phoPhong = res.filter(x => x.roleCode == 'PTP' || x.roleCode == 'PP');
        });
    }

    getInitial(){

        if(this.capNhatDto.listDocs.length == 1){
            this._documentHandlingAppService.get_DVXL_PH_ForDocument_Dept(this.capNhatDto.listDocs[0].documentId).subscribe((res) => {
                this.old_DVXL = res;
                let doi = res.filter(x => x['OrganizationId'] !== 0);
                this.phoPhongObj = res.filter(x => x['TypeHandling'] == 0 && x['OrganizationId'] == 0)[0];
                if(this.phoPhongObj){
                    this.phoPhongVal = this.phoPhongObj['Id'];
                    this.ppComment = this.phoPhongObj['ProcessingRecommended'];
                }
                this.truongPhongObj = res.filter(x => x['TypeHandling'] == 1 && x['OrganizationId'] == 0)[0];
                if(this.truongPhongObj){
                    this.truongPhongVal = this.truongPhongObj['Id'];
                    this.tpComment = this.truongPhongObj['ProcessingRecommended'];
                }
                doi.forEach((ele) => {
                    this.data_department.length = 0;
                    this.data_department = [].concat(this.data_department_initial);
                    let index = this.data_department.findIndex(x => x.id == ele.OrganizationId);
                    if(index > -1){
                        if(ele.TypeHandling == 1){
                            this.data_department[index]["mainHandling"] = true;
                            this.data_department[index]["coHandling"] = false;
                            this.previousMainHandlingId = this.data_department[index].id;
                        }
                        else if(ele.TypeHandling == 0) {
                            this.data_department[index]["mainHandling"] = false;
                            this.data_department[index]["coHandling"] = true;
                        }
                        else {
                            this.data_department[index]["mainHandling"] = false;
                            this.data_department[index]["coHandling"] = false;
                        }
                    }

                });
            });
        }
        else if(this.capNhatDto.listDocs.length > 1){
            this.data_department.length = 0;
            this.data_department = [].concat(this.data_department_initial);
        }
    }

    setListDVXL(){
        this.listDVXL_selected.length = 0;
        if(this.truongPhongVal){
            let dvxl = new ListDVXL();
            dvxl.userId = this.truongPhongVal;
            dvxl.typeHandling = 1;
            dvxl.processRecomend = this.tpComment;
            if(this.tpDate !== null){
                dvxl.dateHandle = moment(this.tpDate).utc(true);
            }else {
                dvxl.dateHandle = moment(new Date()).utc(true);
            }
            this.listDVXL_selected.push(dvxl);
        }

        if(this.phoPhongVal){
            let dvxl = new ListDVXL();
            dvxl.userId = this.phoPhongVal;
            dvxl.typeHandling = 0;
            dvxl.processRecomend = this.ppComment;
            if(this.ppDate !== null){
                dvxl.dateHandle = moment(this.ppDate).utc(true);
            }
            else {
                dvxl.dateHandle = moment(new Date()).utc(true);
            }
            this.listDVXL_selected.push(dvxl);
        }

        for(var i = 0, j = this.data_department.length; i < j; i++){
            if(this.data_department[i].mainHandling == true || this.data_department[i].coHandling == true){
                let dvxl = new ListDVXL();
                dvxl.unitId = this.data_department[i].id;
                dvxl.dateHandle = moment(new Date()).utc(true);
                if(this.data_department[i].mainHandling == true){
                    dvxl.typeHandling = 1;
                }
                else if(this.data_department[i].coHandling == true){
                    dvxl.typeHandling = 0;
                }
                this.listDVXL_selected.push(dvxl);
            }
        }

        this.capNhatDto.listDVXLs = this.listDVXL_selected;

    }

    initTpDateOptions(){
        const that = this;
        let x = new Date();
        this.tpDateOptions = {
            text: '',
            showClearButton: true,
            displayFormat: 'dd/MM/yyyy',
            format: 'dd/MM/yyyy',
            value: new Date(x.getDate(), x.getMonth(), x.getFullYear()),
            onValueChanged: function(e){

            }
        };
    }

    initPtpDateOptions(){
        const that = this;
        this.ptpDateOptions = {
            showClearButton: true,
            displayFormat: 'dd/MM/yyyy',
            format: 'dd/MM/yyyy',
            value: this.currenDate,
            onValueChanged: function(e){
            }
        };
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

    save(){

        if(!this.formYKienChiDao.instance.validate().isValid) return ;

        this.setListDVXL();
        if(!this.capNhatDto.listDVXLs || this.capNhatDto.listDVXLs.filter(x => x.unitId > 0).length == 0){
            this.message.warn('Vui lòng chọn Đội xử lý');
            return;
        }
        if(!this.checkDVXL(this.capNhatDto.listDVXLs)){
            this.message.warn('Vui lòng điền nội dung chỉ đạo ');
            return;
        }
        this.disabled = true;
        this.capNhatDto.bookDV = this.book;
        this.capNhatDto.incommingNumberDV = this.formData.incommingNumberDV;
        this.capNhatDto.incommingDateDV = moment(this.formData.incommingDateDV);
        this.capNhatDto.listDocs[0].attachment = this.selectedRows.map(x => x.tepDinhKem.toString()).join(';');
        this.capNhatDto.ykienchidao= this.formData.processingRecommended;
        debugger
        this._documentAppService.multipleCapNhatChiDaoPhongPH(this.appSession.organizationUnitId, this.capNhatDto)
        .pipe(finalize(() => {
            document.getElementById('TopMenu2').click();
            this.disabled = false;
            this.close();
        }))
        .subscribe(()=>{
            this.saveSuccess.emit(null);
            this.message.success('Cập nhật chỉ đạo thành công');
        })
    }

    checkDVXL(dsDVXL) {
        console.log(dsDVXL);
        let isCoChiDao = dsDVXL.findIndex(x => x.userId > 0 && x.processRecomend != null && x.processRecomend != '' && (x.typeHandling == 1 || x.typeHandling == 0));
        if (isCoChiDao != -1) {
            return true;
        }
        return false;
    }

    close(){
        this.yKienChiDaoModal.hide();
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
            disabled: this.daVaoSo,
            onValueChanged: function(e){

            }
        };
    }

    getIncommingNumber(soVB: number) {
        this._documentAppService.getNextIncommingNumber(soVB).subscribe(res => {
            this.formData.incommingNumberDV = res;
        });
    }

    changeBookDV(){
        debugger
        if(this.incommingNumberDV == '' || this.incommingNumberDV == null || this.incommingNumberDV == undefined){
            if (this.book!= null && this.book != undefined && this.book!=-1)
                this.getIncommingNumber(this.book);
        }
    }

    chkAutomatic(e: any){
        debugger
        this.incommingNumberDisabled = !this.incommingNumberDisabled;
        if(e.value == true){ // nút tự động được chọn
            if (this.book!= null && this.book != undefined && this.book!=-1)
                this.getIncommingNumber(this.book);
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
        this.selectedRows.splice(this.selectedRows.findIndex(x=>x.tepDinhKem===e.data.tepDinhKem), 1);
        // this.selectedRows.splice(this.selectedRows.indexOf(e.row.data.tepDinhKem), 1);
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
}
