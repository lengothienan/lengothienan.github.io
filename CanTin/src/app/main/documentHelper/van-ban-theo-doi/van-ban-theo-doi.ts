import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CachingServiceProxy, WebLogServiceProxy, AuditLogServiceProxy, HistoryUploadDto, HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CreateOrEditIdoc_starDto, DynamicActionsServiceProxy, DocumentHandlingDetailDto, DocumentHandlingsServiceProxy, DocumentsDto, DocumentHandlingDetailsServiceProxy, UserServiceProxy, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy, DirectorOpinionDto, ListDVXL, ApproveDocumentDto, CapNhatDanhGiaDto } from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DxDataGridComponent, DxSelectBoxComponent, DxFormComponent } from 'devextreme-angular';
import { SqlConfigHelperService } from '@shared/utils/sql-config-helper.service';
import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { AppConsts } from '@shared/AppConsts';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import moment from 'moment';
// import { CreateNewIncommingDocumentComponent } from '../documentReceive/create-document/create-new-incomming-document';
import { formatDate } from '@angular/common';
import { templateJitUrl } from '@angular/compiler';
import $ from 'jquery';
import { isNullOrUndefined } from 'util';
declare const exportHTML: any;

@Component({
    templateUrl: './van-ban-theo-doi.html',
    styleUrls: ['./van-ban-theo-doi.less'],
    animations: [appModuleAnimation()]
})
export class VanBanTheoDoiComponent extends AppComponentBase implements OnInit {
    @Input() actionID: string;
    @ViewChild(DxDataGridComponent, { static: true }) gridContainer: DxDataGridComponent;
    @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;
    // @ViewChild('createNewIncommingDocument', { static: false }) createNewIncommingDocument: CreateNewIncommingDocumentComponent;
    @ViewChild('gridContainer113', { static: true }) gridContainer113: DxDataGridComponent;
    @ViewChild("BGDSelectBox", { static: false }) BGDSelectBox: DxSelectBoxComponent;
    @ViewChild('buttonUI', { static: true}) buttonUI: ButtonUIComponent;
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
    orgId: number;
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
    uploadUrl: string;
    userId: number;
    uploadedFileChiDao = [];
    dataDisplay = [];
    tepDinhKemSave = '';
    value: any[] = [];
    currentTime :any ;
    selectedRowsFile = [];

    ratePopupVisible:any =false;
    kqxlData:any = [{key: true,
        value: "Đã hoàn thành"
        },{key: false,
            value: "Tiếp tục xử lý"
        }];
    dgxlData:any = [{key: 1,
            value: "Hoàn thành xuất sắc"
            },{key: 2,
                value: "Hoàn thành tốt"
            },{key: 3,
                value: "Hoàn thành nhiệm vụ"
            }];

    rateDisable: any= true;
    ratingData: any;
    rate: any;
    status: any = 0;

    constructor(
        injector: Injector,
        private ultility: UtilityService,

        private _appSessionService: AppSessionService,
        private router: Router,
        private _sqlConfigHelperService: SqlConfigHelperService,
        private _dynamicGridServiceProxy: DynamicGridHelperServiceProxy,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _idocStarServiceProxy: Idoc_starsServiceProxy,
        private _documentHandlingDetailServiceProxy: DocumentHandlingDetailsServiceProxy,
        private _userServiceProxy: UserServiceProxy,
        private _documentHandlingAppService:DocumentHandlingsServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _dynamicFieldService: DynamicFieldsServiceProxy) {
        super(injector);
        this.userId = this.appSession.userId;
        this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetWordFile?documentId=';
        this.uploadUrl = AppConsts.fileServerUrl  + '/fileUpload/Upload_file?userId=' + this.userId ;
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

        this._dynamicFieldService.getDynamicFieldByModuleId(22, 0).subscribe(result => {
            this.data_publisher = result[0].dataSource;
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
        });
    }

    ngOnInit() {
        this._activatedRoute.params.subscribe(params => {
            this.labelId = parseInt(params['id']);
            if (params['outdate'] == 'outdate') {
                this.getVanbanDxTable(this.labelId, true);
            }
            else {
                this.getVanbanDxTable(this.labelId);
            }
        });
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

    getActionID(event) {
        this.actionID = event;
        switch (this.actionID) {
            case 'hasReturn':
                this.return();
                break;
            case 'hasSaveAndTransfer':

                break;
            case 'hasReport':

                break;
            case 'additional_Transfer_Soldier_officer':
                this.has_Transfer_CBCS();
                break;
            case 'transfer_Soldier_officer':
                // chuyen CBCS
                this.has_Transfer_CBCS();
                break;
            case 'submit_to_the_director':
                if(this.selectedRowsData.length > 1){

                }
                else{

                }
                break;

            case 'submit_to_the_manager':
                // this.transfer_head_department(); // trình trưởng phòng
                break;
            // case 'hasDelete':
            //     this.inbaocao();
            //     break;

            case 'scan_file':
                this.popup_ScanDocument = true;
                break;
            default:
                break;
        }
    }


    popup_Visible_detail_XL = false;
    old_DVXL = [];
    data_DVXL_KQXL = [];

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
            dvxl.processingRecommended = this.dataRowDetail.ApprovingRecommended;
            //;
            //dvxl.fileChiDao = this.uploadedFileChiDao.map(x => x.name).join(';');
            dvxl.fileChiDao = this.tepDinhKemSave;
            // console.log(this.uploadedFileChiDao)
            // console.log(this.dataDisplay)
            // console.log(this.tepDinhKemSave)
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

    getVanbanDxTable(labelId: number, outdate = false) {
        this._documentAppService.getDanhSachTheoDoiDoi(labelId, outdate).subscribe(result => {
            this.header = result.title;
            this.initialData = result.listData;
            this.totalCount = this.initialData.length;
        });
    }

    viewProcess(event: any) {
        this.router.navigate(['/app/main/qlvb/quytrinhxuly/' + event.data.Id]);
    }

    viewRow(event: any) {
        // sessionStorage.setItem("readOnly", "true");
        this.router.navigate(['/app/main/qlvb/incomming-document/view/' + event.data.Id]);
    }

    showFileChiDao(e: any){
        // this.rootUrl = AppConsts.remoteServiceBaseUrl;
        // this.link = this.rootUrl + "/" + e.FileChiDao;
        // window.open(this.link, '_blank');.
        this.selectedRowsFileChiDao = e.FileChiDao.split(';').map(x => {return {fileName: x}});
        this.popup_FileChiDao = true;
    }

    showFileChiDaoDetail(e){
        this.rootUrl = AppConsts.fileServerUrl ;
        this.link = this.rootUrl + "/" + e.data.fileName;
        window.open(this.link, '_blank');
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

    dataFileChiDaoDetail:any;
    selectedRowsFileChiDao = [];
    popup_FileChiDao = false;
    // duyệt nhiều VB
    approve_Multiple_Func(){
        if(this.selectedRowsData.length == 0){
            this.message.warn('Vui lòng chọn văn bản cần duyệt');
            return;
        }
        this.spinnerService.show();
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            return;
        }
        let arr = [];
        for(var i = 0, len = this.selectedRowsData.length; i < len; i++){
            let newDto = new ApproveDocumentDto();
            newDto.documentId = this.selectedRowsData[i].Id;
            newDto.documentHandlingId = this.selectedRowsData[i].HandlingId;
            arr.push(newDto);
        }
        this._documentAppService.multiApproveDocument(arr)
            .pipe(finalize(() => { document.getElementById('TopMenu2').click();
                this.spinnerService.hide();
            }))
            .subscribe(() => {
                this.notify.info('Đã duyệt thành công!');
                this.router.navigate(['/app/main/qlvb/executeLabelSQL/85']);
        });

        // this.selectedRowsData.forEach(x => {


        // });
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
        console.log(this.data_DVXL)
    }
    processingResult: DocumentHandlingDetailDto;
    update_KQGQ(){
        this.spinnerService.show();
        this.saving = true;
        this._documentAppService.update_KQGQ(this.selectedRowsData[0].Id, this.selectedRowsData[0].HandlingId,
            this.processingResult.processingRecommended, moment(this.processingResult.processingDate))
            .pipe(finalize(() => {
                this.getVanbanDxTable(this.orgId);
                document.getElementById('TopMenu2').click();
                this.saving = false;
                this.spinnerService.hide();
            }))
            .subscribe(() => { });
        // this.processingResult.processingRecommended = this.dataRowDetail.processingRecommended;
        // this._documentAppService.changeStatusOfDocumentIntoTransfered(this.dataRowDetail.Id, "VBDDGQ").subscribe(() => {

        // });
        // this.initialData.splice(this.initialData.findIndex(x => x.Id == this.dataRowDetail.Id), 1);


        // this.gridContainer.instance.refresh();
        this.popup_Visible_detail_XL = false;

    }

    exportHTML(e: any, data: any) {
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

    deleteFile(e:any)
    {
        this.selectedRowsFile.splice(e.rowIndex, 1);
        this.tepDinhKemSave = this.selectedRowsFile.map(x => {return x.tepDinhKem.toString()}).join(';');

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

    view(e: any){
        this.router.navigate(['/app/main/qlvb/them-vb-phong/view/'+ e.Id]);
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
        this.uploadedFileChiDao = [];
        this.selectedRowsFile = this.selectedRowsFile.concat(this.dataDisplay);
        this.tepDinhKemSave = this.selectedRowsFile.map(x => x.tepDinhKem.toString()).join(';')
    }

    close_fileChiDaoPopUp(){
        this.popup_FileChiDao = false;
    }

    popup_ScanDocument = false;

    open_popup_Scan(){
        this.popup_ScanDocument = true;
    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        },);
    }

    cap_nhat_kqxl(data){


        this._documentAppService.getVanBanCapNhatXuLy(data).subscribe((p:any)=>{
            this.ratingData=p.data[0];
            this.rate= p.data[0].Rate;
            this.status= p.data[0].Status;
            this.ratePopupVisible=true;
        })
    }


    onKqxlValueChanged(e){
        if (e.value ==false)
        {
            this.rateDisable=true;
            this.rate=null;
        }else{
            this.rateDisable=false;
        }
    }

    updateRating = (): void => {

        var data = new CapNhatDanhGiaDto();
        data.docId= this.ratingData.Id;
        data.handlingDetailId =this.ratingData.HandlingDetailId;
        data.orgId = this.appSession.selfOrganizationUnitId;
        if (this.status==1 && isNullOrUndefined(this.rate)){
            abp.notify.error("Chưa đánh giá hoàn thành")
            this.return;
        }
        else{
            data.rate=this.rate;
            if (this.status==false)
                data.rate= null;
            data.status=this.status;
            data.processingRecommended= this.ratingData.ProcessingRecommended;
            this._documentAppService.updateDanhGiaPhong(data).subscribe(()=>{
                this.getVanbanDxTable(this.labelId);
                this.ratePopupVisible=false;
            })
        }
    };
}
