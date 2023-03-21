import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CreateOrEditIdoc_starDto, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { DxDataGridComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { AppConsts } from '@shared/AppConsts';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import $ from 'jquery';

@Component({
    templateUrl: './da-phan-cong-xu-ly-phong.component.html',
    styleUrls: ['./da-phan-cong-xu-ly-phong.component.less'],
    animations: [appModuleAnimation()]
})
export class DaPhanCongXuLyPhongComponent extends AppComponentBase implements OnInit {
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

    loaiDV = [
        { type: 1, name: 'Danh sách Phó phòng', dataSource: [
            {
                fullName: 'Nguyễn Văn A',
                id: 1,
                mainHandling: false,
                coHandling: false
            },
            {
                fullName: 'Nguyễn Văn B',
                id: 2,
                mainHandling: false,
                coHandling: false
            },
            {
                fullName: 'Nguyễn Văn C',
                id: 3,
                mainHandling: false,
                coHandling: false
            }
        ]},
        { type: 2, name: 'Danh sách đội trong phòng', dataSource: [
            {
                fullName: 'Đội 1',
                id: 1,
                mainHandling: false,
                coHandling: false
            },
            {
                fullName: 'Đội 2',
                id: 2,
                mainHandling: false,
                coHandling: false
            },
            {
                fullName: 'Đội 3',
                id: 3,
                mainHandling: false,
                coHandling: false
            }
        ]}
    ];
   
    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private router: Router,
        private _dynamicGridServiceProxy: DynamicGridHelperServiceProxy,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _idocStarServiceProxy: Idoc_starsServiceProxy,
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
        
        this._documentAppService.getListHandledDocumentForOrganization(this.appSession.organizationUnitId).subscribe(res => {
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

    viewProcess(event: any) {
        this.router.navigate(['/app/main/qlvb/quytrinhxuly/' + event.data.Id]);
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
        console.log(e);
        this.router.navigate(['/app/main/qlvb/xem-vb-den-phong/' + e.Id]);
    }

    popUpClass(){
        return 'popUpClass';
    }

    transferTeam(){
        this.popup_Visible = true;
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

    phancongXL(){
        this.popup_Visible = true;
    }
}