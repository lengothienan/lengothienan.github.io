import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetDocInputForSearchDto,HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CreateOrEditIdoc_starDto, DocumentHandlingsServiceProxy, DocumentHandlingDetailsServiceProxy, UserServiceProxy, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy, ODocsServiceProxy, ListDVXL } from '@shared/service-proxies/service-proxies';
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
import $ from 'jquery';
import moment from 'moment';

@Component({
    templateUrl: './da-phan-xu-ly-doi-truong.component.html',
    styleUrls: ['./da-phan-xu-ly-doi-truong.component.less'],
    animations: [appModuleAnimation()]
})
export class DaPhanXuLyDoiTruongComponent extends AppComponentBase implements OnInit {
    @Input() actionID: string;
    // @Output() lbId = new EventEmitter<number>();
    @ViewChild(DxDataGridComponent, { static: false }) gridContainer: DxDataGridComponent;
    // @ViewChild('transferHandleModal', { static: true }) transferHandleModal: TransferHandleModalComponent;
    @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;
    // @ViewChild('createNewIncommingDocument', { static: false }) createNewIncommingDocument: CreateNewIncommingDocumentComponent;
    @ViewChild('gridContainerOrg', { static: true }) gridContainerOrg: DxDataGridComponent;
    @ViewChild("BGDSelectBox", { static: false }) BGDSelectBox: DxSelectBoxComponent;
    @ViewChild('buttonUI', { static: true }) buttonUI: ButtonUIComponent;
    totalCount: number = 0;
    saving = false;
    rawSql: string;
    user_ID: any;
    userID: any;
    header: string;
    dataRowDetail: any;
    initialData: any;
    selectedID: any;
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

    data_department_initial = [];
    editCBXLPopupVisible: any = false;
    listDVXL_selected: any = []
    docId: any;
    saveButton: any = false;
    doiTruong: any;
    doiPho: any;
    banChiHuy: any;
    formData: any = {};
    doiTruongVal: any;
    dtDate: any;
    dpDate: any;
    dtComment: any;
    pdtComment: any;

    doiTruongObj: any;

    doiPhoVal: number;
    doiPhoObj: any;
    dpComment = '';
    // message: any = '';
    message1: any = '';


    constructor(
        injector: Injector,
        private _appSessionService: AppSessionService,
        private router: Router,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _idocStarServiceProxy: Idoc_starsServiceProxy,
        private _documentHandlingAppService: DocumentHandlingsServiceProxy,
        private _oDocsServiceProxy: ODocsServiceProxy,
        private _dynamicFieldService: DynamicFieldsServiceProxy) {
        super(injector);
        this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetWordFile?documentId=';
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
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
        this.toDateVal = new Date();
        this.fromDateVal = new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate()-14);
        this.loadData();

    }

    loadData() {
        this.search()
    }

    getListDepartment() {
        this._documentAppService.getListDepartment(this.appSession.organizationUnitId).subscribe(res => {
            this.data_DVXL = res;
            for (var i = 0, len = this.data_DVXL.length; i < len; i++) {
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
        this.rootUrl = AppConsts.fileServerUrl;
        this.link = this.rootUrl + "/" + e.row.data.file;
        window.open(this.link, '_blank');

    }

    tiepnhan(e: any) {
        console.log(e.data);
        this.router.navigate(['/app/main/qlvb/so-den-theo-phong/' + e.data.Id]);
    }

    old_DVXL = [];
    data_DVXL_KQXL = [];

    // Xu ly khi double click vào datagrid ở màn hình Chưa duyệt

    view(e: any) {
        this.router.navigate(['/app/main/qlvb/xem-vb-den-doi/' + e]);
    }

    edit(e: any) {
        this.router.navigate(['/app/main/qlvb/sua-vb-den-doi/' + e]);
    }

    trinhCHPhong() {
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
    popup_Visible_phanCong = false;
    phancongbosung() {
        this.popup_Visible_phanCong = true;
    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        });
    }

    onCheckBoxChanged(e, cell) {
        let index = this.data_department_initial.findIndex(x => x.userId == cell.data.userId);
        //kiểm tra cột vừa thao tác là main hay co
        switch (cell.column.dataField) {
            case 'mainHandling':
                //kiểm tra có đvxl chính chưa, nếu có rồi thì bỏ chọn cái trước

                let temp = this.data_department_initial.findIndex(x => x.mainHandling == true);
                if (temp != -1)
                    this.data_department_initial[temp]["mainHandling"] = false;

                this.data_department_initial[index]["coHandling"] = false;

                this.data_department_initial[index]["mainHandling"] = e.value;
                this.gridContainerOrg.instance.refresh();
                break;
            case 'coHandling':
                this.data_department_initial[index]["mainHandling"] = false;
                this.data_department_initial[index]["coHandling"] = e.value;
                this.gridContainerOrg.instance.refresh();
                break
        }
    }
    setResolved: any = [];
    getUserInOrg(d) {
        const self = this;
        this._oDocsServiceProxy.getUserInRoleByOrg(this.appSession.selfOrganizationUnitId, '').subscribe((res) => {
            this.doiTruong = res.filter(x => x.roleCode == 'DT');
            this.doiPho = res.filter(x => x.roleCode == 'PDT');
            this.banChiHuy = res.filter(x => x.roleCode == 'DT' || x.roleCode == 'PDT');
            this._documentHandlingAppService.get_DVXL_ForDocument_Dept(d).subscribe((res) => {
                this.doiTruongObj = res.filter(x => x['TypeHandling'] == 1 && x['OrganizationId'] == 0 && x['HandlingType'] == 5)[0];
                if (this.doiTruongObj) {
                    this.doiTruongVal = this.doiTruongObj['Id'];
                    this.dtComment = this.doiTruongObj['ProcessingRecommended'];
                    this.dtDate = new Date(this.doiTruongObj['DateHandle']);
                }
                this.doiPhoObj = res.filter(x => x['TypeHandling'] == 0 && x['OrganizationId'] == 0 && x['HandlingType'] == 5)[0];
                if (this.doiPhoObj) {
                    this.doiPhoVal = this.doiPhoObj['Id'];
                    this.dpComment = this.doiPhoObj['ProcessingRecommended'];
                    this.dpDate = new Date(this.doiPhoObj['DateHandle']);
                };
            })

            this._documentAppService.getHandLingDetailByHandlingType(d, 5).subscribe(res1 => {
                this.data_department_initial = res.filter(x => x.roleCode == 'CB');
                this.data_department_initial.forEach(x => {
                    x["mainHandling"] = false;
                    x["coHandling"] = false;
                });
                for (var i = 0; i < this.data_department_initial.length; i++) {
                    this.setResolved.push(false);
                }
                //this.listDVXL_selected=res1;
                res1.forEach(x => {
                    let index = self.data_department_initial.findIndex(p => p.userId == x.userId);
                    if (index != -1) {
                        this.setResolved[index] = x.isResolved;
                        if (x.typeHandling == 1) {
                            self.data_department_initial[index]["mainHandling"] = true;
                            self.data_department_initial[index]["coHandling"] = false;
                        } else {
                            self.data_department_initial[index]["mainHandling"] = false;
                            self.data_department_initial[index]["coHandling"] = true;
                        }
                    }
                });
                self.gridContainerOrg.instance.refresh();
                this._documentAppService.isEditAssigned(d).subscribe((res) => {
                    let index = this.data_department_initial.findIndex(p => p.mainHandling == true);
                    if (res == true) {
                        this.daxuly = false;
                    } else {
                        this.daxuly = true;
                        this.setResolved[index] = true;
                        // this.message.warn("VB này đã được xử lý hoàn tất hoặc đã có VB phúc đáp", "Không thể điều chỉnh phân công xử lý");
                        // this.notify.warn("VB này đã được xử lý hoàn tất hoặc đã có VB phúc đáp", "Không thể điều chỉnh phân công xử lý");
                    }
                });
            });
        });

    }
    daxuly: boolean = false;
    editDvxl(d) {
        this.docId = d;
        this.data_department_initial = [];
        this.listDVXL_selected = [];
        // this.message = '';
        this.doiTruongVal = null;
        this.dtComment = '';
        this.dtDate = new Date();
        this.doiPhoVal = null;
        this.dpComment = '';
        this.dpDate = new Date();
        this.message1 = '';//set thông báo lỗi về rỗng
        this.editCBXLPopupVisible = true;
        this.getUserInOrg(d);
        // this._documentAppService.isEditAssigned(d).subscribe((res) => {
        //     let index = this.data_department_initial.findIndex(p => p.coHandling == true);

        //     console.log(this.data_department_initial);
        //     if (res == true) {
        //         this.daxuly=false;
        //         this.setResolved[index]=true;
        //     } else {
        //         this.daxuly=true;
        //         // this.message.warn("VB này đã được xử lý hoàn tất hoặc đã có VB phúc đáp", "Không thể điều chỉnh phân công xử lý");
        //         // this.notify.warn("VB này đã được xử lý hoàn tất hoặc đã có VB phúc đáp", "Không thể điều chỉnh phân công xử lý");
        //     }
        // });
    }
    save() {

        if (this.doiTruongVal) {
            let dvxl = new ListDVXL();
            dvxl.userId = this.doiTruongVal;
            dvxl.typeHandling = 1;
            dvxl.processRecomend = this.dtComment;
            if (this.dtDate !== null) {
                dvxl.dateHandle = moment(this.dtDate);
            }
            this.listDVXL_selected.push(dvxl);
        }

        if (this.doiPhoVal) {
            let dvxl = new ListDVXL();
            dvxl.userId = this.doiPhoVal;
            dvxl.typeHandling = 0;
            dvxl.processRecomend = this.dpComment;
            if (this.dpDate !== null) {
                dvxl.dateHandle = moment(this.dpDate);
            }
            this.listDVXL_selected.push(dvxl);
        }

        this.data_department_initial.forEach(receiver => {
            if (receiver["coHandling"] == true) {
                let dvxl = new ListDVXL();
                dvxl.unitId = receiver.organizationUnitId;
                dvxl.userId = receiver.userId;
                dvxl.dateHandle = moment(new Date()).utc(true);
                dvxl.typeHandling = 0;
                dvxl.processRecomend = '';
                this.listDVXL_selected.push(dvxl);
            }
            if (receiver["mainHandling"] == true) {
                let dvxl = new ListDVXL();
                dvxl.unitId = receiver.organizationUnitId;
                dvxl.userId = receiver.userId;
                dvxl.dateHandle = moment(new Date()).utc(true);
                dvxl.typeHandling = 1;
                dvxl.processRecomend = '';
                this.listDVXL_selected.push(dvxl);
            }
        });
        debugger
        if (this.listDVXL_selected.length > 0) {
            if (this.listDVXL_selected.findIndex(p => p.typeHandling == 1 && p.unitId > 0 && p.userId > 0) >= 0) {
                this._documentAppService.updateDVXL(this.docId, this.listDVXL_selected).subscribe(res => {
                    this.notify.success("Đã cập nhật thành công")
                    this.editCBXLPopupVisible = false;
                    this.loadData();
                });
            }
            else {
                this.message1 = "Chưa phân công cán bộ chủ trì";
                // this.message.warn("Chưa phân công cán bộ chủ trì");
            }

        }

        else {
            // this.message.warn("Chưa chọn phân công cán bộ chiến sĩ");
            this.message1 = "Chưa chọn phân công cán bộ chiến sĩ";
        }

    }
    close() {
        this.editCBXLPopupVisible = false;
    }

    onExporting(e) {
        debugger
        e.component.beginUpdate();
        e.component.columnOption('number_incomingdatedv', 'visible', true);
        e.component.columnOption('IncommingNumberDV', 'visible', true);
        e.component.columnOption('bgd', 'visible', true);
        e.component.columnOption('bch_p', 'visible', true);
        e.component.columnOption('DoiPhoiHop', 'visible', true);
        e.component.columnOption('bch_doi', 'visible', true);
    }
    onExported(e) {
        e.component.columnOption("number_incomingdatedv", "visible", false);
        e.component.columnOption('IncommingNumberDV', 'visible', false);
        e.component.columnOption('bgd', 'visible', false);
        e.component.columnOption('bch_p', 'visible', false);
        e.component.columnOption('DoiPhoiHop', 'visible', false);
        e.component.columnOption('bch_doi', 'visible', false);
        e.component.endUpdate();
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
        this._documentAppService.getAllDocumentHaveDirectedToPerson(this.documentSearchData.fromDate, this.documentSearchData.toDate, this.appSession.selfOrganizationUnitId).subscribe(res => {
            this.initialData = res;
            this.totalCount = this.initialData.length;
        });
    }
}
