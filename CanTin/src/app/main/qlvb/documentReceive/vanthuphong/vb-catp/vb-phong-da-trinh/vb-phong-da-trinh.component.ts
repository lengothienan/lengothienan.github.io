import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import {GetDocInputForSearchDto, HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CreateOrEditIdoc_starDto, DocumentHandlingDetailDto, DocumentHandlingsServiceProxy, DocumentHandlingDetailsServiceProxy, UserServiceProxy, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy, DirectorOpinionDto, ListDVXL, ApproveDocumentDto, CapNhatInputDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DxDataGridComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { SqlConfigHelperService } from '@shared/utils/sql-config-helper.service';
import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { AppConsts } from '@shared/AppConsts';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import moment from 'moment';
//import { CreateNewIncommingDocumentComponent } from '../documentReceive/create-document/create-new-incomming-document';
import $ from 'jquery';
import { YKienChiDaoComponent } from '@app/main/documentHelper/yKienChiDao.component';
import { DxFormComponent, DxButtonComponent, DxSwitchComponent, DxNumberBoxComponent, DxDateBoxComponent } from 'devextreme-angular';
@Component({
    templateUrl: './vb-phong-da-trinh.component.html',
    styleUrls: ['./vb-phong-da-trinh.component.less'],
    animations: [appModuleAnimation()]
})
export class VBCATPDenPhongDaTrinh extends AppComponentBase implements OnInit {
    @Input() actionID: string;
    // @Output() lbId = new EventEmitter<number>();
    @ViewChild(DxDataGridComponent, { static: true }) gridContainer: DxDataGridComponent;
    // @ViewChild('transferHandleModal', { static: true }) transferHandleModal: TransferHandleModalComponent;
    @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;
    // @ViewChild('createNewIncommingDocument', { static: false }) createNewIncommingDocument: CreateNewIncommingDocumentComponent;
    @ViewChild('gridContainer113', { static: true }) gridContainer113: DxDataGridComponent;
    @ViewChild("BGDSelectBox", { static: false }) BGDSelectBox: DxSelectBoxComponent;
    @ViewChild('buttonUI', { static: true}) buttonUI: ButtonUIComponent;
    @ViewChild('yKienChiDao', { static: false}) yKienChiDao: YKienChiDaoComponent;
    documentSearchData: GetDocInputForSearchDto = new GetDocInputForSearchDto();
    totalCount: number = 0;
    saving = false;
    rawSql: string;
    user_ID: any;
    userID: any;
    header: string;
    selectionChangedBySelectbox: boolean;
    prefix = '';
    dataRowDetail: any;
    initialData: any;
    selectedID:any;
    labelId: number;
    now: Date = new Date();
    historyPopupVisible = false;
    popup_Visible = false; // popup trình BGĐ
    popup_Visible_detail = false; // popup Cập nhật KQGQ
    toggleStared = false;
    history_Upload = [];
    rootUrl = '';
    selectedRows = [];
    selectedRowsData: any[] = [];
    data_Row: string;
    link = '';
    allMode: string;
    checkBoxesMode: string;
    selectedItems: any[] = [];
    parameters: any;
    num: number[] = [];
    directions: any;
    director_list = [];
    selected: any; // directorId selected
    popup_Visible_bgd: false;
    currentDate: Date;
    selectedDirector: any;
    captain_department = [];
    numberOfDaysByDocType = 0;
    director: any;
    data_secretLevel = [];
    data_priority = [];
    data_DVXL = [];
    //đơn vi jxử lý của popup cập nhật kết quả giải quyết
    data_DVXL_CNKQGQ = [];
    getLeaderList_PGD = [];
    data_publisher = [];
    previousMainHandlingId: number;
    previousMainHandlingIndex: number;
    printUrl = '';
    hasAdvanceFilter = true;
    selectedRowsFileChiDao = [];
    popup_FileChiDao = false;
    dataFileChiDaoDetail: any;

    constructor(
        injector: Injector,
        private ultility: UtilityService,

        private _appSessionService: AppSessionService,
        private router: Router,
        private _dynamicGridServiceProxy: DynamicGridHelperServiceProxy,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _idocStarServiceProxy: Idoc_starsServiceProxy,
        private _documentHandlingAppService:DocumentHandlingsServiceProxy,
        private _dynamicFieldService: DynamicFieldsServiceProxy) {
        super(injector);
        this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetWordFile?documentId=';
        this.router.routeReuseStrategy.shouldReuseRoute = function(){
            return false;
         }

         this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
               // trick the Router into believing it's last link wasn't previously loaded
               this.router.navigated = false;
               // if you need to scroll back to top, here is the right place
               window.scrollTo(0, 0);
            }
        });


        this.link = this.router.url;
        this.user_ID = this._appSessionService.userId;
        this.allMode = 'allPages';
        this.checkBoxesMode = 'onClick';

        this.currentDate = new Date();


    }

    ngOnInit() {
        this.toDateVal = new Date();
        this.fromDateVal = new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate()-14);
        this.getListDepartment();
        this.initFromDateOptions();
        this.initToDateOptions();
        this.loadData();
    }
    fromDateVal: Date= new Date();
    toDateVal: Date= new Date();
    publisherValue: any;
    fromDateOptions: any;
    toDateOptions: any;
    initFromDateOptions(){
        const self = this;
        this.fromDateOptions = {
            format: 'dd/MM/yyyy',
            displayFormat: 'dd/MM/yyyy',
            showClearButton: true,
            value: self.fromDateVal
        }
    }

    initToDateOptions(){
        const self = this;
        this.toDateOptions = {
            format: 'dd/MM/yyyy',
            displayFormat: 'dd/MM/yyyy',
            showClearButton: true,
            value: self.toDateVal
        }
    }
    search(){
        this.documentSearchData.fromDate = moment(this.fromDateVal).set({hour: 0, minute: 0, second: 0, millisecond: 0});
        this.documentSearchData.toDate = moment(this.toDateVal).set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
        this._documentAppService.getListVBTuCATPDaCoChiDao(this.documentSearchData.fromDate, this.documentSearchData.toDate,this.appSession.organizationUnitId).subscribe(res => {
            this.initialData = res;
            this.totalCount = this.initialData.length;
        });
    }


    loadData(){
       this.search();
    }

    view(e: any){
        this.router.navigate(['/app/main/qlvb/them-vb-phong/view/' + e.Id]);
    }

    //cập nhật chỉ đạo
    cap_nhat_chi_dao(){
        if(this.selectedRowsData.length == 0){
            this.message.warn('Vui lòng chọn văn bản cần cập nhật chỉ đạo');
            return;
        }
        //this.spinnerService.show();
        let arr = [];
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        for(var i = 0, len = this.selectedRowsData.length; i < len; i++){
            let newDto = new CapNhatInputDto();
            newDto.documentId = this.selectedRowsData[i].Id;
            newDto.documentHandlingId = this.selectedRowsData[i].HandlingId;
            //console.log(this.selectedRowsData[i].IncommingNumber + '-' + this.selectedRowsData[i].PublisherName)
            newDto.kyHieuNoiGui = this.selectedRowsData[i].PublisherName? this.selectedRowsData[i].IncommingNumber + '-' + this.selectedRowsData[i].PublisherName : this.selectedRowsData[i].IncommingNumber;

            arr.push(newDto);
        }
        //this.yki
        this.yKienChiDao.docId = arr[0].documentId;
        this.yKienChiDao.documentHandlingId = arr[0].documentHandlingId;
        this.yKienChiDao.show();
    }


    getListDepartment(){
        this._documentAppService.getListPhongBanCATP().subscribe(res =>{
            this.data_DVXL = res;
            for(var i = 0, len = this.data_DVXL.length; i < len; i++){
                this.data_DVXL[i]["mainHandling"] = false;
                this.data_DVXL[i]["coHandling"] = false;
            }
        });
    }

    popup_Visible_detail_XL = false;
    old_DVXL = [];
    data_DVXL_KQXL = [];

    // Xu ly khi double click vào datagrid ở màn hình Chưa duyệt
    startEdit(e) {
        this.processingResult = new DocumentHandlingDetailDto();
        this.currentDate = new Date();
        this.dataRowDetail = e.data ;
        if(this.labelId == 84)
        {
            console.log("a");
            this.popup_Visible_detail = true;

            this.data_DVXL.forEach(x => {
                x["mainHandling"] = false;
                x["coHandling"] = false;
            });
            this._documentHandlingAppService.get_DVXL_ForDocument(this.selectedRowsData[0].Id, this.selectedRowsData[0].UnitId).subscribe((res) => {
                this.old_DVXL = res;
                this.old_DVXL.forEach((ele) => {
                    let index = this.data_DVXL.findIndex(x => x.id == ele.OrganizationId);
                    switch(ele.TypeHandling){
                        case 1:
                            this.data_DVXL[index]["mainHandling"] = true;
                            this.data_DVXL[index]["coHandling"] = false;
                            this.previousMainHandlingId = this.data_DVXL[index].id;
                            break;
                        case 0:
                            this.data_DVXL[index]["mainHandling"] = false;
                            this.data_DVXL[index]["coHandling"] = true;
                            break;
                        default:
                            this.data_DVXL[index]["mainHandling"] = false;
                            this.data_DVXL[index]["coHandling"] = false;

                    }

                });
                // this.gridContainer113.instance.repaint();
            });
            //   this.selectedRowsData[0].processingRecommended;
        }
        else if(this.labelId != 6 && this.labelId != 85)
        {
            let temp = [];
            temp = this.data_DVXL.map(function(x) { return {...x} });
            this._documentHandlingAppService.get_DVXL_ForDocument(this.selectedRowsData[0].Id, this.selectedRowsData[0].UnitId).subscribe((res) => {
                this.old_DVXL = res;
                this.old_DVXL.forEach((ele) => {
                    let index = temp.findIndex(x => x.id == ele.OrganizationId);
                    switch(ele.TypeHandling){
                        case 1:
                            temp[index]["mainHandling"] = true;
                            temp[index]["coHandling"] = false;
                            this.previousMainHandlingId = temp[index].id;
                            break;
                        case 0:
                            temp[index]["mainHandling"] = false;
                            temp[index]["coHandling"] = true;
                            break;
                        default:
                            temp[index]["mainHandling"] = false;
                            temp[index]["coHandling"] = false;
                            break;
                    }
                });
                this.data_DVXL_CNKQGQ = temp.filter(x => x.mainHandling || x.coHandling);
                console.log(this.data_DVXL_CNKQGQ);
                // this.gridContainer113.instance.repaint();
            });
            this.popup_Visible_detail_XL = true;

        }
    }

    onValueChanged (e) {
        // const newValue = e.value;
        this.selectedID =  e.value ;

        // Event handling commands go here
    }
    //Chuyen trang report
    inbaocao(e: any) {

        console.log(e)
        this.router.navigate(['/app/main/qlvb/report/' + e.data.Id]);
        this.historyPopupVisible = true;
    }

    // thay doi BGD // trình BGĐ
    change_director() {
        // this.selectedRowsData[0].DirectorId = this.BGDSelectBox.value;
        // this.selectedRowsData[0].Action = 3;
        //this.saving = true;
        this.spinnerService.show();
        this._documentAppService.submitToDirector(this.selectedRowsData[0].Id, parseInt(this.selectedDirector))
            //.pipe(finalize(() => { this.saving = false;}))
            .pipe(finalize(() => { this.spinnerService.hide();}))
            .subscribe(() => {
                // this.notify.success('Sửa thành công');
                this.popup_Visible = false;
                this.router.navigate(['/app/main/qlvb/executeLabelSQL/84']);
            })
    }

    popUpClass()
    {
        return "popUpClass";
    }

    update_ykien() {
        // return;
        this.spinnerService.show();
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            return;
        }

        else {
            this.saving = true;
            var dvxl = new DirectorOpinionDto();
            dvxl.processingRecommended = this.dataRowDetail.ProcessingRecommended;
            dvxl.listDVXLs = [];
            for(var i = 0, len = this.data_DVXL.length; i < len; i++){
                if(this.data_DVXL[i].mainHandling == true){
                    var temp = new ListDVXL();
                    temp.unitId = this.data_DVXL[i].id;
                    temp.typeHandling = 1;
                    dvxl.listDVXLs.push(temp);
                    // this._documentHandlingDetailServiceProxy.createOrEdit(record).subscribe(()=>{});
                }
                else if(this.data_DVXL[i].coHandling == true){
                    var temp = new ListDVXL();
                    temp.unitId = this.data_DVXL[i].id;
                    temp.typeHandling = 0;
                    dvxl.listDVXLs.push(temp);
                }
            }
            this._documentAppService.changeOpinionOfDirector(this.dataRowDetail.HandlingId, dvxl)
                .pipe(finalize(() => { this.saving = false;
                    this.spinnerService.hide();
                }))
                .subscribe(() => {
                    this.popup_Visible_detail = false;
                    this.gridContainer.instance.repaint();
                    this.router.navigate(['/app/main/qlvb/executeLabelSQL/85']);
                });

        }
    }

    trinhBGD() {
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            return;
        }
        else {
            this.selectedDirector = this.selectedRowsData[0].DirectorId;
        }

        this.popup_Visible = true;
    }

    onValueChangedTenant(data: any) {

        this.selected = data.selectedItem;
    }
    // funtion tra ve
    return() {
        window.history.go(-1); return false;
    }
    // chuyen  bo sung can bo chien si
    has_Transfer_Add_CBCS() {
        this.router.navigate(['/app/main/qlvb/transfer-handle-officer']);
    }
    // chuyen can bo chien si
    has_Transfer_CBCS() {
        this.router.navigate(['/app/main/qlvb/transfer-handle-officer']);
    }
    // Chỉnh sửa
    editRow(e: any) {
        this.router.navigate(['/app/main/qlvb/incomming-document/edit/'+e.data.Id]);
        //this.router.navigate(['/app/main/qlvb/create-new-incomming-document']);
        // this.router.navigate(['/app/main/qlvb/create-or-edit-new-incomming-document/'+e.data.Id]);
    }
    deleteRow(e: any) {
        this.message.confirm(
            'Bạn muốn xóa văn bản này? Hành động này không thể phục hồi!',
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._documentAppService.delete(e.data.Id).subscribe(() => {
                        this.initialData.splice(e.rowIndex, 1);
                        this.notify.success('Xóa thành công!');
                    }, ()=>{
                        this.notify.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
                    });
                }
            }
        );
    }
    // funtion kết thúc
    has_Finish() {
        if (this.selectedRowsData.length == 0) {
            return;
        }
        for(var i = 0; i < length; i++){
            this._documentAppService.delete(this.selectedRowsData[i].Id).subscribe(() => {
                this.notify.warn('Xóa thành công!');
            });
        }
        this.gridContainer.instance.repaint();
    }
    // funtion thêm mới
    create() {
        this.router.navigate(['/app/main/qlvb/create-new-incomming-document']);
    }

    selectionChangedHandler() {
        if (!this.selectionChangedBySelectbox) {
            this.prefix = null;
        }

        this.selectionChangedBySelectbox = false;
    }

    viewProcess(event: any) {
        this.router.navigate(['/app/main/qlvb/quytrinhxuly/' + event.data.Id]);
    }

    viewRow(event: any) {
        // sessionStorage.setItem("readOnly", "true");
        this.router.navigate(['/app/main/qlvb/incomming-document/view/' + event.data.Id]);
    }

    saveToBook() {

    }

    // Lịch sử xử lý văn bản
    showListHistory(event: any) {
        this._historyUploadsServiceProxy.getList(event.data.Id).subscribe(res => {
            this.history_Upload = res;
        });
        this.historyPopupVisible = true;
    }

    getIndexById(id: number) {
        var curData = this.initialData;
        let index = curData.findIndex(x => x.Id == id);
        return index;
    }
    getSelectedRowKeys() {
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            return;
        }
        this.selectedRowsData.forEach(element => {
            this.selectedRows.push(element["Id"]);
        });
        this.ultility.selectedRows = this.selectedRows;
    }
    getSelectedRowsData() {
        this.selectedRowsData = this.initialData.instance.getSelectedRowsData();
    }

    getdataRow(e: any) {
        this._historyUploadsServiceProxy.getList(e.data.id).subscribe(res => {
            this.history_Upload = res;
        });

    }

    // xem chi tiet file dinh kem
    showDetail(e: any) {
        this.rootUrl = AppConsts.fileServerUrl ;
        this.link = this.rootUrl + "/" + e.row.data.file;
        window.open(this.link, '_blank');

    }

    // gắn sao văn bản
    instaff(event: any) {
        let data: CreateOrEditIdoc_starDto = new CreateOrEditIdoc_starDto();
        data.userId = this._appSessionService.userId;
        data.documentId = event.data.Id;
        if (event.data.star == false) {
            this._idocStarServiceProxy.create_Star(data).pipe(finalize(() => { this.saving = true; }))
                .subscribe(() => {
                    // this.message.success('Gắn sao thành công');
                });
            event.data.star = true;
        }
        else {
            this._idocStarServiceProxy.starDelete(event.data.Id, this.user_ID).subscribe(() => {
                // this.message.success('Bỏ sao thành công');
            });
            event.data.star = false;
        }
    }

    onCheckBoxChanged(e, cell)
    {
        let index = this.data_DVXL.findIndex(x => x.id == cell.data.id);
        //kiểm tra cột vừa thao tác là main hay co
        switch(cell.column.dataField){
            case 'mainHandling':
                //kiểm tra có đvxl chính chưa, nếu có rồi thì bỏ chọn cái trước
                console.log(this.previousMainHandlingId);
                if(this.previousMainHandlingId >= 0){
                    let temp = this.data_DVXL.findIndex(x => x.id == this.previousMainHandlingId);
                    this.data_DVXL[temp]["mainHandling"] = false;
                }

                if(this.data_DVXL[index]["coHandling"] == true){
                    this.data_DVXL[index]["coHandling"] = false;
                }

                this.data_DVXL[index]["mainHandling"] = e.value;

                //giữ id của đơn vị đang nắm chủ trì
                this.previousMainHandlingId = cell.data.id;
                break;
            case 'coHandling':
                if(this.data_DVXL[index]["mainHandling"] == true){
                    this.data_DVXL[index]["mainHandling"] = false;
                }

                this.data_DVXL[index]["coHandling"] = e.value;
        }
    }
    processingResult: DocumentHandlingDetailDto;

    showFileChiDao(e: any){
        // this.rootUrl = AppConsts.remoteServiceBaseUrl;
        // this.link = this.rootUrl + "/" + e.FileChiDao;
        // window.open(this.link, '_blank');.
        this.selectedRowsFileChiDao = e.FileChiDao.split(';').map(x => {return {fileName: x}});
        this.popup_FileChiDao = true;
    }

    close_fileChiDaoPopUp(){
        this.popup_FileChiDao = false;
    }

    exportHTML(data: any) {
        $.ajax({
            url: this.printUrl + data.Id,
            method: 'POST',
            xhrFields: {
                responseType: 'blob'
            },
            success: function (data) {
                console.log(data);
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

    onRowPrepared(){

    }

    advanceFilterBtnClick(){
        this.hasAdvanceFilter = !this.hasAdvanceFilter;
        if(!this.hasAdvanceFilter){
            $('advanceFilterDiv').css("display", "none");
        }
        else {
            $('advanceFilterDiv').css("display", "initial");
        }

    }

    popup_chuyenBoSung = false;
    // sửa bổ sung
    editExtra(e: any){
        console.log(e);
        this.router.navigate(['/app/main/qlvb/incomming-document/edit/extra/' + e.Id])
    }

    // chuyển bổ sung
    transferExtra(e: any){
        this.dataRowDetail = e.data ;
        this.data_DVXL.forEach(x => {
            x["mainHandling"] = false;
            x["coHandling"] = false;
            x["disabledCT"] = true;
            x["disabledPHXL"] = false;
        });
        this._documentHandlingAppService.get_DVXL_ForDocument(this.selectedRowsData[0].Id, this.selectedRowsData[0].UnitId).subscribe((res) => {
            this.old_DVXL = res;
            this.old_DVXL.forEach((ele) => {
                let index = this.data_DVXL.findIndex(x => x.id == ele.OrganizationId);
                if(ele.TypeHandling == 1){
                    this.data_DVXL[index]["mainHandling"] = true;
                    this.data_DVXL[index]["coHandling"] = false;
                    this.data_DVXL[index]["disabledCT"] = true;
                    this.data_DVXL[index]["disabledPHXL"] = true;
                    this.previousMainHandlingId = this.data_DVXL[index].id;
                }
                else if(ele.TypeHandling == 0) {
                    this.data_DVXL[index]["mainHandling"] = false;
                    this.data_DVXL[index]["coHandling"] = true;
                    this.data_DVXL[index]["disabledCT"] = true;
                    this.data_DVXL[index]["disabledPHXL"] = true;
                }
                else {
                    this.data_DVXL[index]["mainHandling"] = false;
                    this.data_DVXL[index]["coHandling"] = false;
                    this.data_DVXL[index]["disabledCT"] = true;
                }
            });

        });
        this.popup_chuyenBoSung = true;
    }
    chuyenBoSung(){
        let json = JSON.stringify(this.newSelectedDVXL);
        this.selectedRowsData[0].ProcessingRecommended = this.dataRowDetail.ProcessingRecommended;
        this._documentAppService.extraTransfer(this.selectedRowsData[0].HandlingId, json, this.selectedRowsData[0]).subscribe(() => {
            this.notify.info("Chuyển bổ sung thành công!");
            this.popup_chuyenBoSung = false;
        });
    }
    newSelectedDVXL = [];
    onCheckBoxBoSungChanged(cell)
    {
        let index = this.data_DVXL.findIndex(x => x.id == cell.data.id);
        //kiểm tra cột vừa thao tác là main hay co
        if(cell.column.dataField == 'coHandling'){
            let dvxl = new ListDVXL();
            dvxl.unitId = this.data_DVXL[index].id;
            dvxl.typeHandling = 0;
            this.newSelectedDVXL.push(dvxl);
        }
    }

    onDisposingChuyenBoSung(e: any){
        console.log(e);
        this.data_DVXL.forEach(x => {
            x["mainHandling"] = false;
            x["coHandling"] = false;
            x["disabledCT"] = false;
            x["disabledPHXL"] = false;
        });
    }

    // button download file chỉ đạo BGĐ
    showFileChiDaoDetail(e){
        this.rootUrl = AppConsts.fileServerUrl ;
        this.link = this.rootUrl + "/" + e.data.fileName;
        window.open(this.link, '_blank');
    }

    //cập nhật chỉ đạo BGĐ
    capNhatChiDaoBGD(){
        if(this.selectedRowsData.length > 0){
            console.log(this.selectedRowsData[0]);
            this.router.navigate(['/app/main/qlvb/them-vb-phong/edit/'+ this.selectedRowsData[0].Id])
        }
    }
    capNhat(e: any){
        this.router.navigate(['/app/main/qlvb/them-vb-phong/edit/'+ e]);
    }

    edit(e: any){
        this.router.navigate(['/app/main/qlvb/vb-phong/edit/' + e]);
    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        },);
    }
    numberCellValue(rowData){
        return rowData.Number;
    }
    numberDVCellValue(rowData){
        return rowData.IncommingNumberDV;
    }
    onExporting(e){
        debugger
        e.component.beginUpdate();
        e.component.columnOption('Deadline', 'visible', true);
        e.component.columnOption('DirectorExport', 'visible', true);
        e.component.columnOption('ProcessingExport', 'visible', true);
        e.component.columnOption('DVTHExport', 'visible', true);
        
    }
    onExported(e){  
        e.component.columnOption('Deadline', 'visible', false);
        e.component.columnOption('DirectorExport', 'visible', false);
        e.component.columnOption('ProcessingExport', 'visible', false);
        e.component.columnOption('DVTHExport', 'visible', false);
        e.component.endUpdate();  
    }
}
