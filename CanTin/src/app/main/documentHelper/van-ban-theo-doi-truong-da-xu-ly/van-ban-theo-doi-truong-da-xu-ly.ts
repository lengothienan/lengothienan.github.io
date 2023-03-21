import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, DocumentHandlingsServiceProxy, DynamicFieldsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { Router, NavigationEnd } from '@angular/router';
import { DxDataGridComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { AppConsts } from '@shared/AppConsts';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
// import { CreateNewIncommingDocumentComponent } from '../documentReceive/create-document/create-new-incomming-document';

@Component({
    
    templateUrl: './van-ban-theo-doi-truong-da-xu-ly.html',
    styleUrls: ['./van-ban-theo-doi-truong-da-xu-ly.less'],
    animations: [appModuleAnimation()]
})
export class VanBanTheoDoiTruongDaXuLyComponent extends AppComponentBase implements OnInit {
    @Input() actionID: string;
    @ViewChild(DxDataGridComponent, { static: true }) gridContainer: DxDataGridComponent;

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

    toggleStared = false;
    history_Upload = [];

    link = '';
    allMode: string;
    checkBoxesMode: string;

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
    historyPopupVisible = false;
    popup_Visible = false; // popup trình BGĐ
    popup_Visible_detail = false; // popup Cập nhật KQGQ
    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private router: Router,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private _documentAppService: DocumentServiceProxy) {
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
    }

    ngOnInit() {
        this.loadData();
    }

    loadData(){
        this._documentAppService.getDanhSachVBDoiTruongDaXuLy(this.appSession.selfOrganizationUnitId).subscribe(result => {
            this.initialData = result;
            this.totalCount = this.initialData.length;
        });
    }

    view(e: any){

        if(e.ParentHandlingDetailId>0){
            this.router.navigate(['/app/main/qlvb/them-vb-doi-phoi-hop/view/' + e.Id+'/'+e.ParentHandlingDetailId]);
        }else{
            this.router.navigate(['/app/main/qlvb/xem-vb-den-doi/' + e.Id]);
        }
    }

    viewProcess(event: any) {
        this.router.navigate(['/app/main/qlvb/quytrinhxuly/' + event.data.Id]);
    }

    // Lịch sử xử lý văn bản
    showListHistory(event: any) {
        this._historyUploadsServiceProxy.getList(event.data.Id).subscribe(res => {
            this.history_Upload = res;
        });
        this.historyPopupVisible = true;
    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        },);
    }
}
