import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import {GetDocInputForSearchDto, HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CreateOrEditIdoc_starDto, DocumentHandlingsServiceProxy, DocumentHandlingDetailsServiceProxy, UserServiceProxy, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy, ListDVXL, GetUserInRoleDto, ODocsServiceProxy, ApproveDocumentDto, CapNhatInputDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DxDataGridComponent, DxSelectBoxComponent, DxTabPanelComponent } from 'devextreme-angular';
import { SqlConfigHelperService } from '@shared/utils/sql-config-helper.service';
import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { AppConsts } from '@shared/AppConsts';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import $ from 'jquery';
import { YKienChiDaoTeamComponent } from '@app/main/documentHelper/yKienChiDaoTeam.component';
import * as moment from 'moment';
@Component({
    templateUrl: './chua-phan-xu-ly-doi-truong.component.html',
    styleUrls: ['./chua-phan-xu-ly-doi-truong.component.less'],
    animations: [appModuleAnimation()]
})
export class ChuaPhanXuLyDoiTruongComponent extends AppComponentBase implements OnInit {
    @Input() actionID: string;
    // @Output() lbId = new EventEmitter<number>();
    @ViewChild(DxDataGridComponent, { static: false }) gridContainer: DxDataGridComponent;
    // @ViewChild('transferHandleModal', { static: true }) transferHandleModal: TransferHandleModalComponent;
    @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;
    // @ViewChild('createNewIncommingDocument', { static: false }) createNewIncommingDocument: CreateNewIncommingDocumentComponent;
    @ViewChild('gridContainer113', { static: true }) gridContainer113: DxDataGridComponent;
    @ViewChild("BGDSelectBox", { static: false }) BGDSelectBox: DxSelectBoxComponent;
    @ViewChild('buttonUI', { static: true}) buttonUI: ButtonUIComponent;
    @ViewChild('tabPanel', { static: true }) tabPanel: DxTabPanelComponent;
    @ViewChild('yKienChiDaoTeam', { static: false}) yKienChiDao: YKienChiDaoTeamComponent;
    totalCount: number = 0;
    saving = false;
    rawSql: string;
    user_ID: any;
    userID: any;
    header: string;
    selectionChangedBySelectbox: boolean;
    prefix = '';
    dataRowDetail = {processRecommend: ''};
    initialData: any;
    selectedID:any;
    labelId: number;
    now: Date = new Date();
    historyPopupVisible = false;
    popup_Visible = false; // popup trình BGĐ
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
    currentDate: Date;
    selectedDirector: any;
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
    processRecommend = '';

    loaiDV = [
        { type: 1, name: 'Danh sách Cán bộ Chiến sĩ thuộc đội', dataSource: [

        ]},
        { type: 2, name: 'Danh sách Đội phó', dataSource: [

        ]}
    ];


    chi_huy: GetUserInRoleDto[] = [];
    previousUserMainHandlingId: number;
    listDVXL_selected: ListDVXL[] = [];
    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private router: Router,
        private _dynamicGridServiceProxy: DynamicGridHelperServiceProxy,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _idocStarServiceProxy: Idoc_starsServiceProxy,
        private _oDocsServiceProxy: ODocsServiceProxy,
        private _utility: UtilityService,
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

        this._dynamicFieldService.getDynamicFieldByModuleId(22, 0).subscribe(result => {
            this.data_publisher = result[0].dataSource;
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
            // this.data_range = result[3].dataSource;
            // this.data_position = result[4].dataSource;
        });
    }

    ngOnInit() {
        this.toDateVal = new Date();
        this.fromDateVal = new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate()-14);
        this.loadData();
    }

    loadData(){

       this.search();
    }

    //cập nhật chỉ đạo
    async cap_nhat_chi_dao(e){    
        if(this.selectedRowsData.length == 0){
            this.message.warn('Vui lòng chọn văn bản cần cập nhật chỉ đạo');
            return;
        }
        //this.spinnerService.show();
        let arr = [];
        let dl = '';
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();

        for(var i = 0, len = this.selectedRowsData.length; i < len; i++){
            let newDto = new CapNhatInputDto();
            newDto.documentId = this.selectedRowsData[i].Id;
            newDto.documentHandlingId = this.selectedRowsData[i].HandlingId;
            console.log(this.selectedRowsData[i].PublishDate)
            //this.selectedRowsData[i].PublishDate.split('T').shift() là ngày nhưng bị sai định dạng
            let publishDate = moment(new Date(this.selectedRowsData[i].PublishDate.split('T').shift())).format('DD-MM-YYYY');
            //let publishDate = this.selectedRowsData[i].PublishDate.split('T').shift();
            newDto.kyHieuNoiGui = this.selectedRowsData[i].Number ? this.selectedRowsData[i].Number + '/' + publishDate : publishDate;
            if(i == 0){
                dl = this.selectedRowsData[i].Deadline ? this.selectedRowsData[i].Deadline.split('T').shift() : '';
                debugger
                this.yKienChiDao.oldChiDao = this.selectedRowsData[i].DirectorName ? this.yKienChiDao.oldChiDao + 'Đ/C ' + this.selectedRowsData[i].DirectorName : this.yKienChiDao.oldChiDao;
                this.yKienChiDao.oldChiDao = this.selectedRowsData[i].ApprovingRecommended ? this.yKienChiDao.oldChiDao + ': ' + this.selectedRowsData[i].ApprovingRecommended : this.yKienChiDao.oldChiDao;
            }
            await this._documentAppService.seenDocument(this.selectedRowsData[i].DocumentHandlingDetailId)         
            .toPromise().then(res=>{
                 this.selectedRowsData[i].IsSeen=1;
            });
           
            arr.push(newDto);
        }
        this.yKienChiDao.deadline = dl;
        this.yKienChiDao.incommingNumber = arr.map(x =>{ return x.kyHieuNoiGui }).join(';');
        this.yKienChiDao.capNhatDto.listDocs = arr;

       
        this.blockBodyScrollPopUp(e);
        this.yKienChiDao.show();
    }

    save(){
        if(this.selectedRowsData.length == 0){
            this.message.warn('Vui lòng chọn văn bản cần phân công');
            return;
        }
        else{
            //console.log(this.selectedRowsData)
            //console.log(this.selectedRowsData[0]["id"], this.selectedRowsData[0]["handlingId"], this.dataRowDetail.processRecommend, this.listDVXL_selected)
            this._documentAppService.transferDocumentToCanBo(this.selectedRowsData[0]["id"], this.selectedRowsData[0]["handlingId"], '', this.listDVXL_selected).subscribe(()=>{
                this.message.success('Phân công thành công');
                this.loadData();
                this.popup_Visible_phanCong = false;
            })
        }
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

    getUserInDept(){
        this._oDocsServiceProxy.getUserInRoleByOrg(this.appSession.organizationUnitId, 'CB').subscribe(res => {
            this.chi_huy = res;
            for(var i = 0, len = this.chi_huy.length; i < len; i++){
                if(this.chi_huy[i]["position"]){
                    this.chi_huy[i]["displayName"] = this.chi_huy[i]["position"] + " - " + this.chi_huy[i]["fullName"];
                }
                else{
                    this.chi_huy[i]["displayName"] = this.chi_huy[i]["fullName"];
                }
                this.chi_huy[i]["mainHandling"] = false;
                this.chi_huy[i]["coHandling"] = false;
            }
            this.loaiDV[0].dataSource = this.chi_huy;
            console.log(this.loaiDV)
        });
    }

    getVanbanDxTable(labelId: number) {
        const that = this;
        this._dynamicGridServiceProxy.getAllDataAndColumnConfigByLabelId(labelId, false).subscribe(result => {
            let count = 0;
            that.header = result.getDataAndColumnConfig.title;
            if(result.dynamicActionDto != null || result.dynamicActionDto != undefined){
                that.num = result.dynamicActionDto.cellTemplate.split(',').map(x => { return parseInt(x); }).sort((a, b) => { return a - b; });
            }
            that.initialData = result.getDataAndColumnConfig.listData;
            for(var i = 0, len = that.initialData.length; i < len; i++){
                that.initialData[i]["stt"] = ++count;
                that.initialData[i]["star"] = that.initialData[i]["Star"] == 1? true: false;

            }
            // that.initialData.forEach(record => {
            //     // console.log(record["Publisher"], record["DirectorId"], that.director_list);
            //     record["stt"] = ++count;
            //     // record["PublisherName"] = that.data_publisher.find(x => x.key == record["Publisher"]).value;
            //     // console.log(this.director_list.find(x => x["userId"] == record["DirectorId"]));
            //     // record["DirectorName"] = this.director_list.find(x => x.userId == record["DirectorId"]).fullName;
            //     that._idocStarServiceProxy.getNumberOfStar(record.Id, that.user_ID).subscribe(res => {
            //         record["star"] = res;
            //     });

            // });
            // this.cell_TemplateData = ;

            // that.gridContainer.columns = that._sqlConfigHelperService.generateColumns(result.getDataAndColumnConfig.listColumnConfig, true);

            // this.gridContainer.columns = this._sqlConfigHelperService.addColumnAtHead()
            // this.gridContainer.instance.addColumn({index: 1 , caption: "#", dataFieldKey: 'stt'});
            // that.gridContainer.columns.splice(1, 0, {
            //     caption: 'STT',
            //     cellTemplate: function(cellElement, cellInfo) {
            //         cellElement.text(cellInfo.row.rowIndex + 1)
            //     },
            //     alignment: 'center'
            // });
            that.gridContainer.instance.repaint();
        });
    }

    close(){
        this.popup_Visible = false;
        this.popup_Visible_phanCong = false;
    }

    viewProcess(event: any) {
        this._documentAppService.seenDocument(event.data.DocumentHandlingDetailId).subscribe(res=>{
        this.router.navigate(['/app/main/qlvb/quytrinhxuly/' + event.data.Id]);
        });
    }

    showListHistory(event: any) {
        this._historyUploadsServiceProxy.getList(event.data.Id).subscribe(res => {
            this.history_Upload = res;
        });
        this.historyPopupVisible = true;
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

    // xem chi tiet file dinh kem
    showDetail(e: any) {
        this.rootUrl = AppConsts.fileServerUrl ;
        this.link = this.rootUrl + "/" + e.row.data.file;
        window.open(this.link, '_blank');

    }

    tiepnhan(e: any){
        console.log(e.data);
        this.router.navigate(['/app/main/qlvb/so-den-theo-phong/' + e.data.Id]);
    }

    old_DVXL = [];
    data_DVXL_KQXL = [];
    popup_Visible_phanCong = false;

    // Xu ly khi double click vào datagrid ở màn hình Chưa duyệt

    edit(e: any){
        this.router.navigate(['/app/main/qlvb/so-den-theo-phong/' + e.data.Id]);
    }

    view(e: any){
        this._documentAppService.seenDocument(e.DocumentHandlingDetailId).subscribe(res=>{
        this._utility.handlingId = e.HandlingId;
        this.router.navigate(['/app/main/qlvb/them-vb-phong/view/' + e.Id]);
        });
    }

    chuyendoipho(){
        this.popup_Visible = true;
    }

    chuyento(){
        this.popup_Visible_phanCong = true;
    }

    popUpClass(){
        return 'popUpClass';
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

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        },);
    }

    onExporting(e){
        e.component.beginUpdate();
        e.component.columnOption('bch', 'visible', true);
        e.component.columnOption('bgd', 'visible', true);
        // e.component.columnOption('DoiPhoiHop', 'visible', true);
        e.component.columnOption('number_incomingdatedv', 'visible', true);
    }
    onExported(e){  
        e.component.columnOption("bch", "visible", false);  
        e.component.columnOption('bgd', 'visible', false);
        // e.component.columnOption('DoiPhoiHop', 'visible', false);
        e.component.columnOption('number_incomingdatedv', 'visible', false);
        e.component.endUpdate();  
    } 

    blockBodyScrollPopUp(e) {
        //debugger
        const that = this;
        $(".modal-content").on("mouseenter", function(e) {
            // disable scrolling
            $('body').bind('mousewheel touchmove', that.lockScroll);
        });
        $(".modal-content").on("mouseleave", function(e) {
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

    fromDateVal: Date= new Date();
    toDateVal: Date= new Date();
    publisherValue: any;
    fromDateOptions: any;
    toDateOptions: any;
    documentSearchData: GetDocInputForSearchDto = new GetDocInputForSearchDto();
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
    search() {
        this.documentSearchData.fromDate = moment(this.fromDateVal).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        this.documentSearchData.toDate = moment(this.toDateVal).set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
        this._documentAppService.getAllDocumentHaveDirectedToTeam(this.documentSearchData.fromDate, this.documentSearchData.toDate, this.appSession.selfOrganizationUnitId,4).subscribe(res => {
            this.initialData = res;
            this.totalCount = this.initialData.length;
        });
    }
}
