import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CachingServiceProxy, WebLogServiceProxy, AuditLogServiceProxy, HistoryUploadDto, HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CreateOrEditIdoc_starDto, DynamicActionsServiceProxy, DocumentHandlingDetailDto, DocumentHandlingsServiceProxy, DocumentsDto, DocumentHandlingDetailsServiceProxy, UserServiceProxy, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy, DirectorOpinionDto, ListDVXL, ApproveDocumentDto } from '@shared/service-proxies/service-proxies';
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
declare const exportHTML: any;

@Component({
    templateUrl: './danh-sach-theo-bch-doi.html',
    styleUrls: ['./danh-sach-theo-bch-doi.less'],
    animations: [appModuleAnimation()]
})
export class VanBanTheoBCHComponent extends AppComponentBase implements OnInit {
    @Input() actionID: string;
    @ViewChild(DxDataGridComponent, { static: true }) gridContainer: DxDataGridComponent;
    @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;
    // @ViewChild('createNewIncommingDocument', { static: false }) createNewIncommingDocument: CreateNewIncommingDocumentComponent;
    @ViewChild('gridContainer113', { static: true }) gridContainer113: DxDataGridComponent;
    @ViewChild("BGDSelectBox", { static: false }) BGDSelectBox: DxSelectBoxComponent;
    @ViewChild('buttonUI', { static: true}) buttonUI: ButtonUIComponent;

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
        this.uploadUrl = AppConsts.fileServerUrl  + '/FileUpload/Upload_file?userId=' + this.userId ;
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
        // this.getListDepartment();

        // this._documentHandlingAppService.getLeaderList_PGD().subscribe(res  =>{
        //     this.director_list = res;
        //     for(var i = 0, len = this.director_list.length; i < len; i++){
        //         this.director_list[i]["nameWithPosition"] = (this.director_list[i]["position"] != null? (this.director_list[i]["position"] + " - ") : "") + this.director_list[i]["fullName"];
        //     }
        // });

        // this._documentHandlingAppService.getLeaderList_PB().subscribe(res  => {
        //     this.captain_department = res;
        // })
        this._activatedRoute.params.subscribe(params => {
            this.labelId = parseInt(params['id']);
            this.getVanbanDxTable(this.labelId, false);
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
            case 'hasFinish':
                this.has_Finish();
                break;
            case 'transfer_Department':
                this.transfer_PB();
                break;
            case 'add_Transfer_Vice_President':
                this.transfer_PGD();
                break;
            case 'add_Transfer_Department':
                this.transfer_PB();
                break;
            case 'add_Transfer_Team':
                this.transfer_team();
                break;
            case 'hasSaveAndTransfer':

                break;
            case 'add_Transfer_Deputy':
                this.transfer_Deputy();
                break;
            case 'add_Transfer_Organize':
                // chuyen bo sung to
                this.has_Transfer_Nest()
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
            case 'transfer_Organize':
                // chuyển cho Tổ
                this.has_Transfer_Nest();
                break;

            case 'submit_to_the_director':
                if(this.selectedRowsData.length > 1){
                    this.submit_to_the_director();
                }
                else{
                    this.trinhBGD();
                }
                break;
            case 'hasAddNew':
                this.create();
                break;
            case 'transfer_Vice_President':
                this.transfer_PGD();
                break;
            case 'transfer_Department':
                this.transfer_department();
                break;

            case 'submit_to_the_manager':
                // this.transfer_head_department(); // trình trưởng phòng
                break;
            case 'transfer_Deputy':
                this.transfer_Deputy();
                break;
            case 'transfer_Team':
                this.transfer_team();
                break;
            // case 'hasDelete':
            //     this.inbaocao();
            //     break;
            case 'transfer_Vice_Team':
                this.has_Transfer_viceCaptain();
                break;
            case 'add_Transfer_Vice_Team':
                this.has_Transfer_viceCaptain();
                break;
            case 'approve_Multiple':
                if(this.selectedRowsData.length > 1)
                {
                    this.approve_Multiple_Func();
                }

                else{
                    this.approveDocument();
                }
                break;
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

    // Xu ly khi double click vào datagrid ở màn hình Chưa duyệt
    startEdit(e) {
        this.processingResult = new DocumentHandlingDetailDto();
        this.currentDate = new Date();
        this.dataRowDetail = e.data ;
        if(this.orgId == 84)
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
        else if(this.orgId != 6 && this.orgId != 85)
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

    // submit many documents to director // trình BGĐ
    submit_to_the_director() {
        this.spinnerService.show();
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            return;
        }
        else if (this.selectedRowsData.length > 1){
            let input = [];
            for(var i = 0; i < this.selectedRowsData.length; i++){
                input.push(this.selectedRowsData[i].Id);
            }
            this._documentAppService.multipleSubmitToDirector(input)
            .pipe(finalize(() => { this.spinnerService.hide(); }))
            .subscribe(()=>{
                this.notify.success('Trình thành công');
                this.router.navigate(['/app/main/qlvb/executeLabelSQL/84']);
            });
        }
        else {
            this._documentAppService.submitToDirector(this.selectedRowsData[i].Id, this.selectedRowsData[i].DirectorId)
            .pipe(finalize(() => { this.spinnerService.hide(); }))
            .subscribe(() => {
                this.notify.success('Trình thành công');
                this.router.navigate(['/app/main/qlvb/executeLabelSQL/84']);
            });


        }
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
                    }, (err)=>{
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
        for(var i = 0, len = this.selectedRowsData.length; i < length; i++){
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
    // funtion chuyển

    // chuyen cho TỔ
    has_Transfer_Nest() {
        this.router.navigate(['/app/main/qlvb/transfer-handle-nest']);
    }


    has_Transfer() {
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            return;
        }
        this.selectedRowsData.forEach(element => {
            this.selectedRows.push({ documentId: element["Id"], parentHandlingId: element["ParentHandlingId"] });
        });
        this.ultility.selectedRows = this.selectedRows;
        switch (this.orgId) {
            case 6:
                this.router.navigate(['/app/main/qlvb/transfer-handle-director']);
                break;
            case 7:
                this.popup_Visible = true;
                this.router.navigate(['/app/main/qlvb/transfer-handle-department']);
                break;
            case 37:
                this.router.navigate(['/app/main/qlvb/transfer-handle-team']);
                break;
            case 34:
                this.router.navigate(['/app/main/qlvb/transfer-handle-team']);
                break;
            default:
                break;
        }
    }

    transfer_PB() {
        this.ultility.selectedRows = [];
        this.getSelectedRowKeys();
        this.router.navigate(['/app/main/qlvb/transfer-deparment']);
    }
    transfer_PGD() {
        this.ultility.selectedRows = [];
        this.getSelectedRowKeys();
        this.router.navigate(['/app/main/qlvb/transfer-handle-director']);
    }
    transfer_PGD_cellTemplate(e: any) {
        this.ultility.selectedRows = [];
        let arr = [];
        arr.push(e.data.Id);
        this.ultility.selectedRows = arr;
        this.router.navigate(['/app/main/qlvb/transfer-handle-director']);
        // this.ultility.selectedRows =
        // this.router.navigate(['/app/main/qlvb/transfer-handle-director']);
    }

    transfer_head_department_cellTemplate(e: any) {
        this.ultility.selectedRows = [];
        this.getSelectedRowKeys();
        this.router.navigate(['/app/main/qlvb/transfer-handle-head-department']);
    }
    has_Transfer_viceCaptain() {
        this.router.navigate(['/app/main/qlvb/transfer-handle-vice-captain']);
    }

    transfer_Vice_Team() {
        this.ultility.selectedRows = [];
        this.getSelectedRowKeys();
        this.router.navigate(['/app/main/qlvb/transfer-handle-head-department']);
    }

    transfer_department() {
        this.ultility.selectedRows = [];
        this.getSelectedRowKeys();
        this.router.navigate(['/app/main/qlvb/transfer-handle-department']);
    }

    transfer_department_cellTemplate(e: any) {
        this.ultility.selectedRows = [];
        let arr = [];
        arr.push(e.data.Id);
        this.ultility.selectedRows = arr;

        this.router.navigate(['/app/main/qlvb/transfer-handle-department']);
    }

    transfer_Deputy() {
        this.ultility.selectedRows = [];
        this.getSelectedRowKeys();
        this.router.navigate(['/app/main/qlvb/transfer-handle-deputy']);
    }

    transfer_team() {
        this.ultility.selectedRows = [];
        this.getSelectedRowKeys();
        this.router.navigate(['/app/main/qlvb/transfer-handle-team']);
    }

    transfer_team_cellTemplate(e: any) {
        this.ultility.selectedRows = [];
        let arr = [];
        arr.push(e.data.Id);
        this.ultility.selectedRows = arr;
        this.router.navigate(['/app/main/qlvb/transfer-handle-team'])
    }

    // cell_template() {
    //     let numbers: any;
    //     this._dynamicAction.getLabelData(this.orgId).subscribe(res => {
    //         this.cell_TemplateData = res;

    //         numbers = this.cell_TemplateData.cellTemplate;
    //         this.num = numbers.split(',').map(x => { return parseInt(x); }).sort((a, b) => { return a - b; });
    //     });
    // }

    selectionChangedHandler() {
        if (!this.selectionChangedBySelectbox) {
            this.prefix = null;
        }

        this.selectionChangedBySelectbox = false;
    }
    columnFields: any[] = [];

    // onRowPrepared(e: any) {
    //     if(e.rowType == "data" && new Date(e.data.Deadline) < this.currentDate){
    //         e.rowElement.style.backgroundColor = 'red';
    //         e.rowElement.className = e.rowElement.className.replace("dx-row-alt", "");
    //     }
    // }
    getVanbanDxTable(labelId: number, outdate = false) {
        const that = this;
        console.log(labelId);
        this._documentAppService.getDanhSachTheoDoiDoi(labelId, outdate).subscribe(result => {
            console.log(result);
            this.header = result.title;
            this.initialData = result.listData;
        });
        // this._dynamicGridServiceProxy.getAllDataAndColumnConfigByLabelId2(orgId, outdate, type).subscribe(result => {
        //     let count = 0;
        //     that.header = result.getDataAndColumnConfig.title;
        //     if(result.dynamicActionDto != null || result.dynamicActionDto != undefined){
        //         that.num = result.dynamicActionDto.cellTemplate.split(',').map(x => { return parseInt(x); }).sort((a, b) => { return a - b; });
        //     }
        //     that.initialData = result.getDataAndColumnConfig.listData;
        //     for(var i = 0, len = that.initialData.length; i < len; i++){
        //         that.initialData[i]["stt"] = ++count;
        //         that.initialData[i]["star"] = that.initialData[i]["Star"] == 1? true: false;

        //     }
        //     that.gridContainer.instance.repaint();
        // });

    }

    viewProcess(event: any) {
        this.router.navigate(['/app/main/qlvb/quytrinhxuly/' + event.data.Id]);
    }

    filterSelected(event) {
        this.selectionChangedBySelectbox = true;

        let prefix = event.value;

        if (!prefix)
            return;
        else if (prefix === "All")
            this.selectedRows = this.initialData.store.map(employee => employee.Id);
        else {
            this.selectedRows = this.initialData.store.filter(employe => employe.Prefix === prefix).map(employee => employee.Id);
        }
        this.prefix = prefix;

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

    approveDocument(){
        if(this.selectedRowsData.length == 0){
            this.message.warn('Vui lòng chọn văn bản cần duyệt');
            return;
        }
        this.spinnerService.show();
        this._documentAppService.approveDocument(this.selectedRowsData[0].Id, this.selectedRowsData[0].HandlingId)
        .pipe(finalize(() => { document.getElementById('TopMenu2').click();
            this.spinnerService.hide();
        }))
        .subscribe(() => {
            // this.gridContainer.instance.repaint();
            // this.gridContainer.instance.refresh();
            this.notify.info('Đã duyệt thành công!');
            this.router.navigate(['/app/main/qlvb/executeLabelSQL/85']);
        });
    };
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

    onRowPrepared(e: any){

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
        this.selectedRowsData[0].ApprovingRecommended = this.dataRowDetail.ApprovingRecommended;
        this._documentAppService.extraTransfer(this.selectedRowsData[0].HandlingId, json, this.selectedRowsData[0]).subscribe(() => {
            this.notify.info("Chuyển bổ sung thành công!");
            this.popup_chuyenBoSung = false;
        });
    }
    newSelectedDVXL = [];
    onCheckBoxBoSungChanged(e, cell)
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
        if(e.ParentHandlingDetailId>0){
            this.router.navigate(['/app/main/qlvb/them-vb-doi-phoi-hop/view/' + e.Id+'/'+e.ParentHandlingDetailId]);
        }else{
            this.router.navigate(['/app/main/qlvb/them-vb-phong/view/' + e.Id]);
            // this.router.navigate(['/app/main/qlvb/xem-vb-den-doi/' + e.Id]);
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
}
