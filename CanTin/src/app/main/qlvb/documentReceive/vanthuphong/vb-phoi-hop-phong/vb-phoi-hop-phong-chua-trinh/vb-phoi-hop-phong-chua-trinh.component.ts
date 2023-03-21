import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetDocInputForSearchDto, HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CreateOrEditIdoc_starDto, DocumentHandlingDetailDto, DocumentHandlingsServiceProxy, DocumentHandlingDetailsServiceProxy, UserServiceProxy, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy, DirectorOpinionDto, ListDVXL, ApproveDocumentDto, CapNhatChiDaoDto, CapNhatInputDto, Comm_booksServiceProxy, PrintReportToLeaderDto } from '@shared/service-proxies/service-proxies';
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
//import { CreateNewIncommingDocumentComponent } from '../documentReceive/create-document/create-new-incomming-document';
import $ from 'jquery';
import { YKienChiDaoComponent } from '@app/main/documentHelper/yKienChiDao.component';
import notify from 'devextreme/ui/notify';
import { YKienChiDaoPhoiHopComponent } from '@app/main/documentHelper/yKienChiDaoPhoiHop.component';
import { ThrowStmt } from '@angular/compiler';


@Component({
    selector: 'app-vb-phoi-hop-phong-chua-trinh',
    templateUrl: './vb-phoi-hop-phong-chua-trinh.component.html',
    styleUrls: ['./vb-phoi-hop-phong-chua-trinh.component.css'],
    animations: [appModuleAnimation()]
})
export class VbPhoiHopPhongChuaTrinhComponent extends AppComponentBase implements OnInit {

    @Input() actionID: string;
    // @Output() lbId = new EventEmitter<number>();
    @ViewChild(DxDataGridComponent, { static: true }) gridContainer: DxDataGridComponent;
    // @ViewChild('transferHandleModal', { static: true }) transferHandleModal: TransferHandleModalComponent;
    @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;
    // @ViewChild('createNewIncommingDocument', { static: false }) createNewIncommingDocument: CreateNewIncommingDocumentComponent;
    @ViewChild('gridContainer113', { static: true }) gridContainer113: DxDataGridComponent;
    @ViewChild("BGDSelectBox", { static: false }) BGDSelectBox: DxSelectBoxComponent;
    @ViewChild('buttonUI', { static: true }) buttonUI: ButtonUIComponent;
    @ViewChild('yKienChiDaoPhoiHop', { static: false }) yKienChiDao: YKienChiDaoPhoiHopComponent;
    @ViewChild('formReport', { static: false }) formReport: DxFormComponent;
    @ViewChild('selectBoxDoi', { static: true }) selectBoxDoi: DxSelectBoxComponent;
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
    selectedID: any;
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
    capNhatDto: CapNhatChiDaoDto;
    popup_FilePhieuTrinh = false;
    dataFilePhieuTrinh: any = {};
    CHPhong = [];
    DSDoi = [];
    CHDoi1 = [];
    isAutomatic = true;
    chkAutomaticValue = false;
    dataBook = [];
    daVaoSo = false;
    isChooseBook = true;
    isDisableTextBox: any;
    constructor(
        injector: Injector,
        private ultility: UtilityService,

        private _appSessionService: AppSessionService,
        private router: Router,
        private _dynamicGridServiceProxy: DynamicGridHelperServiceProxy,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _idocStarServiceProxy: Idoc_starsServiceProxy,
        private _documentHandlingAppService: DocumentHandlingsServiceProxy,
        private _commBookService: Comm_booksServiceProxy,
        private _dynamicFieldService: DynamicFieldsServiceProxy) {
        super(injector);

        this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetInCommReportForLeader';

        this.link = this.router.url;
        this.user_ID = this._appSessionService.userId;
        this.allMode = 'allPages';
        this.checkBoxesMode = 'onClick';
        this.currentDate = new Date();
    }

    ngOnInit() {
        this.toDateVal = new Date();
        this.fromDateVal = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate() - 14);
        this.getListDepartment();
        this.loadData();
        this._commBookService.getAllComm_BookByOrgAndType(this.appSession.organizationUnitId, "1").subscribe(res => {
            this.dataBook = res;
        });

    }

    loadData() {
        this.search();
        this._documentHandlingAppService.getLeaderList_PhongBan(this.appSession.organizationUnitId).subscribe(res => {
            this.CHPhong = res;
            for (var i = 0, len = this.CHPhong.length; i < len; i++) {
                this.CHPhong[i]["nameWithPosition"] = this.CHPhong[i]["fullName"] + " - " + this.CHPhong[i]["roleName"];
            }
        });
        this._documentHandlingAppService.getList_Doi(this.appSession.organizationUnitId).subscribe(res => {
            if (res.length > 0) {
                this.DSDoi = res;
            }
        });

    }
    async cap_nhat_chi_dao() {
        if (this.selectedRowsData.length == 0) {
            this.message.warn('Vui lòng chọn văn bản cần cập nhật chỉ đạo');
            return;
        }
        //this.spinnerService.show();
        let arr = [];
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        for (var i = 0, len = this.selectedRowsData.length; i < len; i++) {
            let newDto = new CapNhatInputDto();
            newDto.documentId = this.selectedRowsData[i].Id;
            newDto.documentHandlingId = this.selectedRowsData[i].HandlingId;
            newDto.attachment = this.selectedRowsData[i].Attachment;
            if (this.selectedRowsData[i].FileChiDao)
                newDto.attachment = newDto.attachment + ';' + this.selectedRowsData[i].FileChiDao;
            let publishDate = this.selectedRowsData[i].PublishDate.split('T').shift();
            newDto.kyHieuNoiGui = this.selectedRowsData[i].Number ? this.selectedRowsData[i].Number + '/' + publishDate : publishDate;
            newDto.documentHandlingDetailId = this.selectedRowsData[i].DocumentHandlingDetailId;
            await this._documentAppService.seenDocument(this.selectedRowsData[i].DocumentHandlingDetailId)         
            .toPromise().then(res=>{
                this.selectedRowsData[i].IsSeen=1;
            });
            arr.push(newDto); 
        }
        this.yKienChiDao.book = this.selectedRowsData[0].BookDV;
        this.yKienChiDao.incommingDate = this.selectedRowsData[0].IncommingDateDV;
        this.yKienChiDao.incommingNumberDV = this.selectedRowsData[0].IncommingNumberDV;
        this.yKienChiDao.ykienchidao = this.selectedRowsData[0].ApprovingRecommended;
        this.yKienChiDao.ykiendexuat_BCH_doi = this.selectedRowsData[0].ProcessingRecommendedDV;
        this.yKienChiDao.incommingNumber = arr.map(x => { return x.kyHieuNoiGui }).join(';');
        this.yKienChiDao.capNhatDto.listDocs = arr;
        this.yKienChiDao.show();
    }


    getListDepartment() {
        this._documentAppService.getListPhongBanCATP().subscribe(res => {
            this.data_DVXL = res;
            for (var i = 0, len = this.data_DVXL.length; i < len; i++) {
                this.data_DVXL[i]["mainHandling"] = false;
                this.data_DVXL[i]["coHandling"] = false;
            }
        });
    }

    popup_Visible_detail_XL = false;
    old_DVXL = [];
    data_DVXL_KQXL = [];

    // Xu ly khi double click vào datagrid ở màn hình Chưa duyệt
    onValueChanged(e) {
        this.selectedID = e.value;
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
        this._documentAppService.seenDocument(event.data.DocumentHandlingDetailId).subscribe(res=>{
        this.router.navigate(['/app/main/qlvb/quytrinhxuly/' + event.data.Id]);
        });
    }

    viewRow(event: any) {
        this._documentAppService.seenDocument(event.DocumentHandlingDetailId).subscribe(res=>{
        this.ultility.handlingId = event.HandlingId;
        this.router.navigate(['/app/main/qlvb/them-vb-phong-phoi-hop/view/' + event.Id + '/' + event.DocumentHandlingDetailId]);
        });
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
        this.rootUrl = AppConsts.fileServerUrl;
        this.link = this.rootUrl + "/" + e.row.data.file;
        window.open(this.link, '_blank');
    }

    processingResult: DocumentHandlingDetailDto;
    close_fileChiDaoPopUp() {
        this.popup_FileChiDao = false;
    }

    advanceFilterBtnClick() {
        this.hasAdvanceFilter = !this.hasAdvanceFilter;
        if (!this.hasAdvanceFilter) {
            $('advanceFilterDiv').css("display", "none");
        }
        else {
            $('advanceFilterDiv').css("display", "initial");
        }

    }

    popup_chuyenBoSung = false;
    // sửa bổ sung
    editExtra(e: any) {
        this.router.navigate(['/app/main/qlvb/incomming-document/edit/extra/' + e.Id])
    }

    // chuyển bổ sung
    newSelectedDVXL = [];
    onCheckBoxBoSungChanged(cell) {
        let index = this.data_DVXL.findIndex(x => x.id == cell.data.id);
        //kiểm tra cột vừa thao tác là main hay co
        if (cell.column.dataField == 'coHandling') {
            let dvxl = new ListDVXL();
            dvxl.unitId = this.data_DVXL[index].id;
            dvxl.typeHandling = 0;
            this.newSelectedDVXL.push(dvxl);
        }
    }

    // button download file chỉ đạo BGĐ
    showFileChiDaoDetail(e) {
        this.rootUrl = AppConsts.fileServerUrl;
        this.link = this.rootUrl + "/" + e.data.fileName;
        window.open(this.link, '_blank');
    }

    //cập nhật chỉ đạo BGĐ
    capNhatChiDaoBGD() {
        if (this.selectedRowsData.length > 0) {
            this.router.navigate(['/app/main/qlvb/them-vb-phong/edit/' + this.selectedRowsData[0].Id])
        }
    }

    // in phiếu trình
    getIncommingNumber(soVB) {
        this._documentAppService.getNextIncommingNumber(soVB).subscribe(res => {
            this.dataFilePhieuTrinh.incommingNumberDV = res;
        });
    }

    chkAutomatic(e: any) {

        if (e.value == true) { // nút tự động được chọn
            this.getIncommingNumber(this.dataFilePhieuTrinh.bookDV);
            this.isAutomatic = true;
        } else {
            this.isAutomatic = false;
        }
    }

    printReport() {
        this.selectedRowsData.forEach(ele => {
            let data = ele;
            if (data.IncommingNumberDV == null || data.ProcessingRecommendedDV == null) {
                let params = new PrintReportToLeaderDto();
                params.docId = Number.parseInt(data.DocumentHandlingDetailId);
                params.bookDV = this.dataFilePhieuTrinh.bookDV;
                params.incommingNumberDV = this.dataFilePhieuTrinh.incommingNumberDV;
                params.incommingDateDV = moment.utc(this.dataFilePhieuTrinh.incommingDateDV);
                params.processingRecommendedDV = this.dataFilePhieuTrinh.processingRecommendedDV;
                this._documentAppService.putDocumentIntoBookDVPhoiHop(params).subscribe(() => {
                    this.print(data);
                });
            }
            else {
                this.print(data);
            }
        })
    }

    print(data) {
        const that = this;
        let data1 = this.selectedRowsData.find(e => e.Id == data.Id);
        let leaderName = this.CHPhong.find(x => x["userId"] == this.dataFilePhieuTrinh.chPhong);
        let teamLeaderName = this.CHDoi1.find(x => x["userId"] == this.dataFilePhieuTrinh.chDoi1);
        this.dataFilePhieuTrinh.processingRecommendedDV = this.dataFilePhieuTrinh.processingRecommendedDV == null?"":this.dataFilePhieuTrinh.processingRecommendedDV;
        var url = this.printUrl;
        url = url.split(' ').join('%20');
        $.ajax({
            url: url,
            method: 'POST',
            xhrFields: {
                responseType: 'blob',
            },
            data: {
                documentId: data.Id,
                orgName: this.appSession.orgName,
                orgShortName: this.appSession.orgShortName,
                leaderName: leaderName["nameWithPosition"],
                processingRecommended: this.dataFilePhieuTrinh.processingRecommendedDV,
                position: leaderName['position'],
                team_position: teamLeaderName.position,
                role: teamLeaderName.roleName,
                teamLeaderName: teamLeaderName.fullName,
                bookDV: this.dataFilePhieuTrinh.bookDV,
                incommingDateDV: this.dataFilePhieuTrinh.incommingDateDV,
                incommingNumberDV: this.dataFilePhieuTrinh.incommingNumberDV,
                teamName: this.selectBoxDoi.instance.option('displayValue'),
                publisherName: data1['PublisherName'],
                doiChuTri: '',
                doiPhoiHop: '',
                orgId: that.appSession.organizationUnitId
            },
            success: function (data) {
                // update phieu trình
                debugger
                that._documentAppService.updatePhieuTrinhPhoiHop(data1.DocumentHandlingDetailId, that.dataFilePhieuTrinh.chPhong, that.selectBoxDoi.instance.option('value'), that.dataFilePhieuTrinh.chDoi1, that.dataFilePhieuTrinh.processingRecommendedDV).subscribe(res => {
                    if (res.code == "200") {
                       that.search();
                    } else {
                        that.notify.error(res.message);
                    }
                });

                let d = that.initialData.findIndex(x => x.Id == data1.Id);
                that.initialData[d]["BookDV"] = data1.BookDV;
                that.initialData[d]["IncommingDateDV"] = data1.IncommingDateDV;
                that.initialData[d]["IncommingNumberDV"] = data1.IncommingNumberDV;
                that.gridContainer.instance.refresh();
                var a = document.createElement('a');
                var url = window.URL.createObjectURL(data);
                a.href = url;
                var current = new Date();
                a.download = data1.IncommingNumberDV == null ? that.dataFilePhieuTrinh.incommingNumberDV : data1.IncommingNumberDV + '.doc';
                document.body.append(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

            },
            complete: function (e) {
                that.popup_FilePhieuTrinh = false;

            }
        });
        debugger
        console.log(that.dataFilePhieuTrinh.incommingNumberDV);
    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        },);
    }

    onRowPrepared(e: any) {
        e.rowElement.css({ height: 72 });
    }

    loadCHDoi(e) {
        if (e.value != undefined) {
            this._documentHandlingAppService.getListLeader_Doi(e.value).subscribe(res => {
                if (res.length > 0) {
                    this.CHDoi1 = res;
                    for (var i = 0, len = this.CHDoi1.length; i < len; i++) {
                        this.CHDoi1[i]["nameWithPosition"] = this.CHDoi1[i]["fullName"] + " - " + this.CHDoi1[i]["roleName"];
                    }
                }
            });
        }
    }

    chooseBookDV = async (e) => {
        if (this.daVaoSo == false) {
            if (e.value != null) {
                this.chkAutomaticValue = true;
                this.isChooseBook = false;
                if (this.chkAutomaticValue) this.getIncommingNumber(e.value)
                if (this.isAutomatic) {
                    this.isDisableTextBox = true;
                }
            } else {
                this.isChooseBook = true;
            }
        }
    }
    numberCellValue(rowData) {
        return rowData.Number;
    }
    numberDVCellValue(rowData) {
        return rowData.IncommingNumberDV;
    }

    onExporting(e) {
        e.component.beginUpdate();
        e.component.columnOption('bgd', 'visible', true);
        e.component.columnOption('number_incomingdatedv', 'visible', true);
        e.component.columnOption('number_publishdate', 'visible', true);
    }
    onExported(e) {
        e.component.columnOption('bgd', 'visible', false);
        e.component.columnOption('number_incomingdatedv', 'visible', false);
        e.component.columnOption('number_publishdate', 'visible', false);
        e.component.endUpdate();
    }
    initFormReport() {
        for (var member in this.dataFilePhieuTrinh) delete this.dataFilePhieuTrinh[member];
    }
    async printReport_popUp() {
        // this.formReport.instance.resetValues();
        this.initFormReport();
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length > 0) {

            for(var i = 0, len = this.selectedRowsData.length; i < len; i++){
                await this._documentAppService.seenDocument(this.selectedRowsData[i].DocumentHandlingDetailId)         
                .toPromise().then(res=>{
                     this.selectedRowsData[i].IsSeen=1;
                });
            }

            let docData = this.selectedRowsData[0];
            console.log(this.selectedRowsData)
            if (docData.IncommingNumberDV != null) {
                this.dataFilePhieuTrinh.bookDV = docData.BookDV;
                this.dataFilePhieuTrinh.incommingDateDV = docData.IncommingDateDV;
                this.dataFilePhieuTrinh.incommingNumberDV = docData.IncommingNumberDV;
                this.dataFilePhieuTrinh.processingRecommendedDV = docData.ProcessingRecommendedDV;
                this.daVaoSo = true;
            }
            else {
                this.dataFilePhieuTrinh.incommingDateDV = this.currentDate;
                this.daVaoSo = false;
            }
            console.log(docData.DocumentHandlingDetailId)
            // lấy thông tin phiếu trình
            this._documentAppService.getPhieuTrinhPhoiHop(docData.DocumentHandlingDetailId).subscribe(res => {
                if (res.code == "200") {

                    this.dataFilePhieuTrinh.chPhong = res.data.chPhongId;
                    this.selectBoxDoi.instance.option('value', res.data.doiPHId);
                    this.dataFilePhieuTrinh.chDoi1 = res.data.doiCTId;
                    this.dataFilePhieuTrinh.processingRecommendedDV = res.data.yKien;
                    this.popup_FilePhieuTrinh = true;
                } else {
                    this.notify.error(res.message);
                }
            });


        } else this.notify.warn("Chưa chọn văn bản để in phiếu trình.");

    }
    fromDateVal: Date = new Date();
    toDateVal: Date = new Date();
    publisherValue: any;
    fromDateOptions: any;
    toDateOptions: any;
    documentSearchData: GetDocInputForSearchDto = new GetDocInputForSearchDto();
    initFromDateOptions() {
        const self = this;
        this.fromDateOptions = {
            format: 'dd/MM/yyyy',
            displayFormat: 'dd/MM/yyyy',
            showClearButton: true,
            value: self.fromDateVal
        }
    }

    initToDateOptions() {
        const self = this;
        this.toDateOptions = {
            format: 'dd/MM/yyyy',
            displayFormat: 'dd/MM/yyyy',
            showClearButton: true,
            value: self.toDateVal
        }
    }
    search() {
        this.documentSearchData.fromDate = moment(this.fromDateVal).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        this.documentSearchData.toDate = moment(this.toDateVal).set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
        this._documentAppService.getListDocumentPhoiHopCATPChuaTrinh(this.documentSearchData.fromDate, this.documentSearchData.toDate, this.appSession.organizationUnitId).subscribe(res => {
            this.initialData = res;
            this.totalCount = this.initialData.length;
        });
    }

}
