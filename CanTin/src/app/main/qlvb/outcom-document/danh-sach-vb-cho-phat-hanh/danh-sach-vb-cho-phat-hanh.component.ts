import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CachingServiceProxy, WebLogServiceProxy, AuditLogServiceProxy, HistoryUploadDto, HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CreateOrEditIdoc_starDto, DynamicActionsServiceProxy, DocumentHandlingDetailDto, DocumentHandlingsServiceProxy, DocumentsDto, DocumentHandlingDetailsServiceProxy, UserServiceProxy, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy, DirectorOpinionDto, ListDVXL, ApproveDocumentDto, DocumentTypesServiceProxy, ODocsServiceProxy } from '@shared/service-proxies/service-proxies';
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
import { formatDate } from '@angular/common';
import { templateJitUrl } from '@angular/compiler';
import $ from 'jquery';
declare const exportHTML: any;

@Component({
    templateUrl: './danh-sach-vb-cho-phat-hanh.component.html',
    styleUrls: ['./danh-sach-vb-cho-phat-hanh.component.less'],
    animations: [appModuleAnimation()]
})
export class DanhSachVBChoPhatHanhComponent extends AppComponentBase implements OnInit {
    @Input() actionID: string;
    // @Output() lbId = new EventEmitter<number>();
    @ViewChild(DxDataGridComponent, { static: false }) gridContainer: DxDataGridComponent;
    // @ViewChild('transferHandleModal', { static: true }) transferHandleModal: TransferHandleModalComponent;
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
        "Lưu tham khảo", "Báo cáo", "Dự họp", "Phối hợp thực hiện", "Dự thảo văn bản đi"
    ];
    publishPopupVisible = false;
    
    data_receiver = [
        {id: 1, displayName: 'Đơn vị trung ương', mainHandling: false},
        {id: 2, displayName: 'Thành ủy', mainHandling: false},
        {id: 3, displayName: 'Ủy ban nhân dân thành phố', mainHandling: false},
        {id: 4, displayName: 'Ban tuyên giáo thành ủy', mainHandling: false},
    ];
    documentTypeOptions = [];
    constructor(
        injector: Injector,
        private ultility: UtilityService,

        private _appSessionService: AppSessionService,
        private router: Router,
        private _sqlConfigHelperService: SqlConfigHelperService,
        private _dynamicGridServiceProxy: DynamicGridHelperServiceProxy,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _documentServiceProxy: DocumentServiceProxy,
        private _idocStarServiceProxy: Idoc_starsServiceProxy,
        private _documentHandlingDetailServiceProxy: DocumentHandlingDetailsServiceProxy,
        private _userServiceProxy: UserServiceProxy,
        private _documentHandlingAppService:DocumentHandlingsServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _documentTypeAppService: DocumentTypesServiceProxy,
        private _oDocsServiceProxy: ODocsServiceProxy,
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
        
        // this._documentHandlingAppService.getLeaderList_PGD().subscribe(res  =>{
        //     this.director_list = res;
        //     for(var i = 0, len = this.director_list.length; i < len; i++){
        //         this.director_list[i]["nameWithPosition"] = (this.director_list[i]["position"] != null? (this.director_list[i]["position"] + " - ") : "") + this.director_list[i]["fullName"];
        //     }
        // });

        // this._documentHandlingAppService.getLeaderList_PB().subscribe(res  => {
        //     this.captain_department = res;
        // })
        // this._activatedRoute.params.subscribe(params => {
            
        //     this.labelId = parseInt(params['id']);
        //     this.getVanbanDxTable(this.labelId);
        // });
        this._oDocsServiceProxy.getAllODocWaitingPublishByCBCS(this.appSession.userId).subscribe(res => {
            console.log(res);
            this.initialData = res;
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

    viewProcess(event: any) {
        console.log(event)
        this.router.navigate(['/app/main/qlvb/quytrinhxuly-vb-di/' + event.data.id]);
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

    // Xu ly khi double click vào datagrid ở màn hình Chưa duyệt
    
    edit(e: any){
        this.router.navigate(['/app/main/qlvb/so-den-theo-phong/' + e.data.Id]);
    }

    view(e: any){
        this.router.navigate(['/app/main/qlvb/xem-vb-da-cho-so/' + e.data.id]);
    }

    popUpClass(){
        return 'popUpClass';
    }

    transferTeam(e: any, data: any){
        this.popup_Visible = true;
    }

    handleDocument(){
        this.popup_handleDocument = true;
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

    onCheckBoxChanged(e, cell)
    {
        let index = this.data_receiver.findIndex(x => x.id == cell.data.id);
        //kiểm tra cột vừa thao tác là main hay co
        switch(cell.column.dataField){
            case 'mainHandling':
                //kiểm tra có đvxl chính chưa, nếu có rồi thì bỏ chọn cái trước
                if(this.previousMainHandlingId >= 0){               
                    let temp = this.data_receiver.findIndex(x => x.id == this.previousMainHandlingId);
                    this.data_receiver[temp]["mainHandling"] = false;
                }
    
                this.data_receiver[index]["mainHandling"] = e.value;   

                //giữ id của đơn vị đang nắm chủ trì
                this.previousMainHandlingId = cell.data.id;
                break;
            
        }
    }
    
    publishDocument(e: any){
        console.log(e);
        this.publishPopupVisible = true;
    }

    receiverPopupVisible = false;
    selectedReceivers = [];

    back(){
        this.publishPopupVisible = false;
    }

    phatHanh(e: any){
        this.receiverPopupVisible = true;
    }

    onSelectionChanged(e: any){
        console.log(this.data_receiver)
        this.data_receiver.forEach(x => {
            if(x["selected"] == true && _.includes(this.selectedReceivers, {id: x.id, displayName: x.displayName}) == false){
                this.selectedReceivers.push({id: x.id, displayName: x.displayName});
            }
            else if(x["selected"] == false){
                this.selectedReceivers.slice(this.selectedReceivers.findIndex(a => a.id == x.id), 1);
            }
        });
        console.log(this.selectedReceivers);
    }
}