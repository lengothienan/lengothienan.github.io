import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CreateOrEditIdoc_starDto, DocumentHandlingsServiceProxy, DocumentHandlingDetailsServiceProxy, UserServiceProxy, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy, DocumentTypesServiceProxy, ODocsServiceProxy, ODocStoreDto, ODocDto } from '@shared/service-proxies/service-proxies';
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

@Component({
    templateUrl: './danh-sach-vb-du-thao.component.html',
    styleUrls: ['./danh-sach-vb-du-thao.component.less'],
    animations: [appModuleAnimation()]
})
export class DanhSachVBDuThaoComponent extends AppComponentBase implements OnInit {
    @Input() actionID: string;
    // @Output() lbId = new EventEmitter<number>();
    @ViewChild(DxDataGridComponent, { static: false }) gridContainer: DxDataGridComponent;
    // @ViewChild('transferHandleModal', { static: true }) transferHandleModal: TransferHandleModalComponent;
    @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;
    // @ViewChild('createNewIncommingDocument', { static: false }) createNewIncommingDocument: CreateNewIncommingDocumentComponent;
    @ViewChild('gridContainer113', { static: true }) gridContainer113: DxDataGridComponent;
    @ViewChild("BGDSelectBox", { static: false }) BGDSelectBox: DxSelectBoxComponent;
    @ViewChild('buttonUI', { static: true}) buttonUI: ButtonUIComponent;
    @ViewChild('publishPlace', { static: true }) publishPlace: DxRadioGroupComponent;

    saving = false;
    rawSql: string;
    user_ID: any;
    userID: any;
    header: string;
    selectionChangedBySelectbox: boolean;
    prefix = '';
    dataRowDetail: any;
    initialData: ODocDto[] = [];
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
    captain_department = [
        { userId: 100, nameWithPosition: 'Thiếu tá - Nguyễn Văn A' },
        { userId: 101, nameWithPosition: 'Đại úy - Nguyễn Văn B' },
        { userId: 102, nameWithPosition: 'Đại úy - Nguyễn Văn C' }
    ];

    data_team = [
        {displayName: 'Đội 1', shortentCode: 'Đ1', mainHandling: false, coHandling: false, unitId: 1},
        {displayName: 'Đội 2', shortentCode: 'Đ2', mainHandling: false, coHandling: false, unitId: 2},
        {displayName: 'Đội 3', shortentCode: 'Đ3', mainHandling: false, coHandling: false, unitId: 3},
        {displayName: 'Đội 4', shortentCode: 'Đ4', mainHandling: false, coHandling: false, unitId: 4},
        {displayName: 'Đội 5', shortentCode: 'Đ5', mainHandling: false, coHandling: false, unitId: 5}

    ];

    data_subLeader = [
        {displayName: 'Đội phó 1', shortentCode: 'ĐP1', mainHandling: false, coHandling: false, unitId: 1},
        {displayName: 'Đội phó 2', shortentCode: 'ĐP2', mainHandling: false, coHandling: false, unitId: 2},
        {displayName: 'Đội phó 3', shortentCode: 'ĐP3', mainHandling: false, coHandling: false, unitId: 3},
        {displayName: 'Đội phó 4', shortentCode: 'ĐP4', mainHandling: false, coHandling: false, unitId: 4},
        {displayName: 'Đội phó 5', shortentCode: 'ĐP5', mainHandling: false, coHandling: false, unitId: 5}
    ];

    data_nest = [
        {displayName: 'Tổ 1', shortentCode: 'T1', mainHandling: false, coHandling: false, unitId: 1},
        {displayName: 'Tổ 2', shortentCode: 'T2', mainHandling: false, coHandling: false, unitId: 2},
        {displayName: 'Tổ 3', shortentCode: 'T3', mainHandling: false, coHandling: false, unitId: 3},
        {displayName: 'Tổ 4', shortentCode: 'T4', mainHandling: false, coHandling: false, unitId: 4},
        {displayName: 'Tổ 5', shortentCode: 'T5', mainHandling: false, coHandling: false, unitId: 5}
    ];

    typeHandleDocument = [
        "Lưu tham khảo", "Báo cáo", "Dự họp", "Phối hợp thực hiện", "Dự thảo văn bản đi"
    ];
    publishPlaceList = [
        {id: 1, name: "Chuyển cho VT CATP"}, {id: 2, name:"Chuyển cho VT Phòng"}
    ];
    publishPlaceListVal = 1; //mặc định chuyển VT CATP
    documentTypeOptions = [];
    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private router: Router,
        private _dynamicGridServiceProxy: DynamicGridHelperServiceProxy,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _idocStarServiceProxy: Idoc_starsServiceProxy,
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
    }

    ngOnInit() {
        this.getListDepartment();
        this.loadData();
    }

    loadData(){
        this._oDocsServiceProxy.getAllOdoc().subscribe(res => {
            console.log(res);
            this.initialData = res;
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
        this.router.navigate(['/app/main/qlvb/quytrinhxuly-vb-di/' + event.data.Id]);
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

    edit(id: any){
        this.router.navigate(['/app/main/qlvb/oDocs/edit/' + id]);
    }

    view(e: any){
        this.router.navigate(['/app/main/qlvb/view-document/' + e.data.Id]);
    }

    popUpClass(){
        return 'popUpClass';
    }

    handleDocument(){
        this.popup_handleDocument = true;
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
    choSo(){
        this.router.navigate(['/app/main/qlvb/them-moi-va-cho-so']);
    }

    trinhChiHuy(){
        if(this.selectedRowsData.length == 0){
            this.message.warn('Vui lòng chọn văn bản cần chuyển phát hành');
            return;
        }
        else {
            this.popup_Visible = true;
        }

    }

    deleteODoc(id: any): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._oDocsServiceProxy.delete(id)
                        .subscribe(() => {
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    chuyen_phat_hanh_popUp(){
        this.popup_Visible = true;
    }

    chuyen_phat_hanh(){
        // console.log(this.selectedRowsData);
        // this._oDocsServiceProxy.oDocTransferToVanThu(this.publishPlaceListVal, this.selectedRowsData.map(x => { return x.id })).subscribe(() => {
        //     this.popup_Visible = false;
        //     this.loadData();
        //     this.notify.success("Chuyển phát hành thành công!");
        // });
        // if(this.selectedRowsData.length == 0){
        //     this.message.warn('Vui lòng chọn văn bản cần chuyển phát hành');
        //     return;
        // }
        let input = [];
        this.selectedRowsData.forEach((ele)=>{
            input.push(ele['id']);
        });
        console.log(this.publishPlaceListVal);

        this._oDocsServiceProxy.oDocTransferToVanThu(this.publishPlaceListVal, input)
        .pipe(finalize(()=>{this.popup_Visible = false;}))
        .subscribe(()=>{
            this.loadData();
            this.notify.success('Chuyển Phát hành thành công');
        });
    }
}
