import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CapNhatDanhGiaDto, CreateOrEditIdoc_starDto, DocumentHandlingsServiceProxy, DocumentHandlingDetailsServiceProxy, UserServiceProxy, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DxDataGridComponent, DxSelectBoxComponent, DxRadioGroupComponent } from 'devextreme-angular';
import { SqlConfigHelperService } from '@shared/utils/sql-config-helper.service';
import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { AppConsts } from '@shared/AppConsts';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import $ from 'jquery';
import moment from 'moment';
import { ThrowStmt } from '@angular/compiler';

@Component({
    templateUrl: './chua-xu-ly.component.html',
    styleUrls: ['./chua-xu-ly.component.less'],
    animations: [appModuleAnimation()]
})
export class ChuaXuLyComponent extends AppComponentBase implements OnInit {
    @Input() actionID: string;
    // @Output() lbId = new EventEmitter<number>();
    @ViewChild(DxDataGridComponent, { static: false }) gridContainer: DxDataGridComponent;
    // @ViewChild('transferHandleModal', { static: true }) transferHandleModal: TransferHandleModalComponent;
    @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;
    // @ViewChild('createNewIncommingDocument', { static: false }) createNewIncommingDocument: CreateNewIncommingDocumentComponent;
    @ViewChild('gridContainer113', { static: true }) gridContainer113: DxDataGridComponent;
    @ViewChild("BGDSelectBox", { static: false }) BGDSelectBox: DxSelectBoxComponent;
    @ViewChild('buttonUI', { static: true}) buttonUI: ButtonUIComponent;
    @ViewChild('loaiXuLyRadio', { static: true }) loaiXuLyRadio: DxRadioGroupComponent;
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
    popup_handleDocument = false;

    typeHandleDocument = [
        {key: 1, value: "Lưu tham khảo"}, 
        {key: 2, value: "Báo cáo"},
        {key: 3, value: "Dự họp"}
    ];
    selectedType: any;
   
    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private router: Router,
        private _dynamicGridServiceProxy: DynamicGridHelperServiceProxy,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _idocStarServiceProxy: Idoc_starsServiceProxy,
        private _utilityService :UtilityService,
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
        this.getListDepartment();

        this.loadData();
        this.selectedType = "Lưu tham khảo";
    }

    loadData(){
        this._documentAppService.getAllDocumentToPersonNotProcess(this.appSession.selfOrganizationUnitId).subscribe(res => {
            console.log(res);
            this.initialData = res;
            this.totalCount = this.initialData.length;
        })
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
            that.gridContainer.instance.repaint();
        });
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

    // xem chi tiet file dinh kem 
    showDetail(e: any) {
        this.rootUrl = AppConsts.fileServerUrl ;
        this.link = this.rootUrl + "/" + e.row.data.file;
        window.open(this.link, '_blank');

    }

    
    old_DVXL = [];
    data_DVXL_KQXL = [];

    // Xu ly khi double click vào datagrid ở màn hình Chưa duyệt
    
    edit(e: any){
        this.router.navigate(['/app/main/qlvb/so-den-theo-phong/' + e.data.Id]);
    }

    view(e: any){
        this._documentAppService.seenDocument(e.DocumentHandlingDetailId).subscribe(res=>{
           this.router.navigate(['/app/main/qlvb/xem-vb-den-doi/' + e.Id]);
        });
    }

    popUpClass(){
        return 'popUpClass';
    }

    transferTeam(){
        this.popup_Visible = true;
    }

    handleDocument(e:any){
        this._documentAppService.seenDocument(e.DocumentHandlingDetailId).subscribe(res=>{
            this.loadData();
            this.popup_handleDocument = true;
        });
    }

    duThao(e: any){
        this._documentAppService.seenDocument(e.DocumentHandlingDetailId).subscribe(res=>{
        // let dt = this.gridContainer.instance.getSelectedRowsData()[0];
        this._utilityService.selectedDocumentData = e;
        if(e.Book > 0){
            this.router.navigate(['/app/main/qlvb/them-moi-vb-thay-catp']);
        }
        else if(e.BookDV > 0){
            this.router.navigate(['/app/main/qlvb/them-moi-vb-thay-vtdv']);
        }
        else {
            this.router.navigate(['/app/main/qlvb/them-moi-vb-noi-bo']);
        }
        });
    }
    ratePopupVisible=false;
    ratingData: any;
    cap_nhat_kqxl(data) {
        this._documentAppService.seenDocument(data.DocumentHandlingDetailId).subscribe(res=>{
            this._documentAppService.getVanBanCapNhatTienDoXuLy(data.Id).subscribe((p: any) => {
                this.loadData();
                this.ratingData = p.data[0];
                this.ratePopupVisible = true;
            })
        });
    }
    updateRating = (): void => {
        this._documentAppService.capNhatTienDoXuLy(this.ratingData.HandlingDetailId,this.ratingData.ProgressNotes).subscribe(() => {
            this.ratePopupVisible = false;
            this.message.success("Cập nhật tiến độ thành công!!!");
        })
    };

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

    btnXuLy(){
        let documentData = this.gridContainer.instance.getSelectedRowsData()[0];

        this._documentAppService.handleDocument_CBCS(this.appSession.selfOrganizationUnitId, documentData.Id, documentData.HandlingId, this.selectedType, 
            this.dataRowDetail.ProcessingRecommended, moment(this.dataRowDetail.ProcessingDate).utc(true)).subscribe(res => {
                this.popup_handleDocument = false;
                this.router.navigate(['/app/main/qlvb/da-xu-ly']);
                this.notify.info("Xử lý thành công!");
        })
    }
    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        },);
    }
}