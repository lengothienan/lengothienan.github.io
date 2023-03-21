import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import {
    CachingServiceProxy, WebLogServiceProxy, AuditLogServiceProxy, HistoryUploadDto, HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CreateOrEditIdoc_starDto, DynamicActionsServiceProxy, DocumentHandlingDetailDto, DocumentHandlingsServiceProxy, DocumentsDto, DocumentHandlingDetailsServiceProxy, UserServiceProxy, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy, DirectorOpinionDto, ListDVXL, ApproveDocumentDto, UserExtentionServiceProxy, UserExtenTionDto,
    // Notification_TemplateServiceProxy
} from '@shared/service-proxies/service-proxies';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import { finalize, takeUntil } from 'rxjs/operators';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DxDataGridComponent, DxSelectBoxComponent, DxFormComponent } from 'devextreme-angular';
import { SqlConfigHelperService } from '@shared/utils/sql-config-helper.service';
import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { AppConsts } from '@shared/AppConsts';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import moment from 'moment';
import { CreateNewIncommingDocumentComponent } from '../documentReceive/create-document/create-new-incomming-document';
import { formatDate } from '@angular/common';
import { templateJitUrl } from '@angular/compiler';
import $ from 'jquery';
import { isNullOrUndefined } from 'util';
import CustomStore from 'devextreme/data/custom_store';
import { HttpParams } from '@angular/common/http';
import { NotificationShare } from '@app/shared/notification/notification-share.component';
import DevExpress from 'devextreme';
import { isEmpty } from 'lodash';
declare const exportHTML: any;

@Component({
    templateUrl: './executeLabelSQL_LL.component.html',
    styleUrls: ['./executeLabelSQL_LL.component.less'],
    animations: [appModuleAnimation()]
})
export class ExecuteLabelSQL_LLComponent extends AppComponentBase implements OnInit {
    @Input() actionID: string;
    // @Output() lbId = new EventEmitter<number>();
    @ViewChild(DxDataGridComponent, { static: true }) gridContainer: DxDataGridComponent;
    // @ViewChild('transferHandleModal', { static: true }) transferHandleModal: TransferHandleModalComponent;
    @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;
    @ViewChild('createNewIncommingDocument', { static: false }) createNewIncommingDocument: CreateNewIncommingDocumentComponent;
    @ViewChild('gridContainer113', { static: true }) gridContainer113: DxDataGridComponent;
    @ViewChild("BGDSelectBox", { static: false }) BGDSelectBox: DxSelectBoxComponent;
    @ViewChild('buttonUI', { static: true }) buttonUI: ButtonUIComponent;
    @ViewChild('dataBookSelectBox', { static: false }) dataBookSelectBox: DxSelectBoxComponent;
    @ViewChild('monthSelectBox', { static: false }) monthSelectBox: DxSelectBoxComponent;

    totalCount: number = 0;
    saving = false;
    rawSql: string;
    user_ID: any;
    userID: any;
    header: string;
    selectionChangedBySelectbox: boolean;
    prefix = '';
    dataRowDetail: any;
    initialData: any = {};
    selectedID: any;
    labelId: number;
    now: Date = new Date();
    historyPopupVisible = false;
    popup_Visible = false; // popup trình BGĐ
    popup_Visible_detail = false; // popup Cập nhật KQGQ
    labelYKCD: string = "Ý kiến chỉ đạo của BGĐ";
    toggleStared = false;
    history_Upload = [];
    rootUrl = '';
    selectedRows = [];
    selectedRowsData: any[] = [];
    data_Row: string;
    link = '';
    selectedItems: any[] = [];
    parameters: any;
    num: number[] = [];
    directions: any;
    director_list = [];
    sub_director_list = [];
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
    currentTime: any;
    selectedRowsFile = [];
    dataBook = [{ id: 0, name: 'Tất cả' }, { id: 1, name: 'Sổ thường' }, { id: 2, name: 'Sổ mật' }];
    month = [
        { id: 0, name: 'Tất cả' },
        { id: 1, name: 'Tháng 1' },
        { id: 2, name: 'Tháng 2' },
        { id: 3, name: 'Tháng 3' },
        { id: 4, name: 'Tháng 4' },
        { id: 5, name: 'Tháng 5' },
        { id: 6, name: 'Tháng 6' },
        { id: 7, name: 'Tháng 7' },
        { id: 8, name: 'Tháng 8' },
        { id: 9, name: 'Tháng 9' },
        { id: 10, name: 'Tháng 10' },
        { id: 11, name: 'Tháng 11' },
        { id: 12, name: 'Tháng 12' }
    ];

    timkiem: any = {}

    listUserMapPhongBan: any[] = [];

    data = [];

    isDuplex: any = false;
    scanTypes = [
        { value: 2, display: "Scan 2 mặt (bằng tay)" },
        { value: 3, display: "Scan 2 mặt" }
    ];
    scanType: any = 1;
    isGD = false;
    PGD: any[] = [];
    mainDirectorId: number = 10800;

    outdate: boolean = false;

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
        private _documentHandlingAppService: DocumentHandlingsServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _dynamicFieldService: DynamicFieldsServiceProxy,
        private _userExtentionServiceProxy: UserExtentionServiceProxy,
        // private notification_templateService: Notification_TemplateServiceProxy,
        // private _notificationShare: NotificationShare
    ) {
        super(injector);
        this.userId = this.appSession.userId;
        this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetWordFile?documentId=';
        this.uploadUrl = AppConsts.fileServerUrl + '/fileupload/Upload_file?userId=' + this.userId;
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

        this.currentDate = new Date();

        this._dynamicFieldService.getDynamicFieldByModuleId(22, 0).subscribe(result => {
            this.data_publisher = result[0].dataSource;
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
            // this.data_range = result[3].dataSource;
            // this.data_position = result[4].dataSource;
        });

        const self = this;

        this.initialData = new CustomStore({
            key: "Id",
            load: function (loadOptions: any) {

                return self._dynamicGridServiceProxy.getAllDataAndColumnConfigLazyLoadingByLabelId(self.labelId, self.outdate, loadOptions["skip"], loadOptions["take"], JSON.stringify(self.timkiem)).toPromise().then((result) => {

                    self.header = result.getDataAndColumnConfig.title;
                    if (result.dynamicActionDto != null || result.dynamicActionDto != undefined) {
                        self.num = result.dynamicActionDto.cellTemplate.split(',').map(x => { return parseInt(x); }).sort((a, b) => { return a - b; });
                    }
                    self.data = result.getDataAndColumnConfig.listData;

                    self.totalCount = result.getDataAndColumnConfig.totalCount;

                    return {
                        data: result.getDataAndColumnConfig.listData,
                        totalCount: result.getDataAndColumnConfig.totalCount,
                        summary: undefined,
                        groupCount: undefined
                    }
                });
            }
        });

        // giá trị mặc định
        this.timkiem.noidung = '';
        if(this.labelId == 85){
            this.timkiem.month = 0;
            this.timkiem.dataBook = 0;
        }
    }

    ngOnInit() {
        this.getListDepartment();
        this._documentHandlingAppService.getLeaderList_PGD().subscribe(res => {
            this.director_list = res;
            for (var i = 0, len = this.director_list.length; i < len; i++) {
                this.director_list[i]["nameWithPosition"] = (this.director_list[i]["position"] != null ? (this.director_list[i]["position"] + " - ") : "") + this.director_list[i]["fullName"];
            }
            this.director_list.forEach(pgd => {
                if (pgd.roleName.trim() != 'Giám đốc') {
                    this.sub_director_list.push(pgd);
                }
            });
        });
        // sub_director_list
        this._documentHandlingAppService.getLeaderList_PB().subscribe(res => {
            this.captain_department = res;
        })
        this._activatedRoute.params.subscribe(params => {
            this.labelId = parseInt(params['id']);
            if (params['outdate'] == 'outdate') {
                this.getVanbanDxTable(this.labelId, true);
            }
            else {
                this.getVanbanDxTable(this.labelId);
            }
        });

        this._documentAppService.getListUserMapPhongBanCATP().subscribe(res => {
            this.listUserMapPhongBan = res;
        });
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
                if (this.selectedRowsData.length > 1) {
                    this.submit_to_the_director();
                }
                else {
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
                if (this.selectedRowsData.length > 1) {
                    this.approve_Multiple_Func();
                }

                else {
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
        console.log(this.saving);
        this.processingResult = new DocumentHandlingDetailDto();
        this.currentDate = new Date();
        this.dataRowDetail = e.data;
        if (this.labelId == 84) {
            debugger
            if (this.dataRowDetail.Attachment != null && this.dataRowDetail.Attachment != undefined && this.dataRowDetail.Attachment != '') {
                let tepDinhKemTmp = this.dataRowDetail.Attachment.split(";");
                tepDinhKemTmp.forEach(tdk => {
                    this.selectedRowsFile.push({ tepDinhKem: tdk });
                });
            }
            this.popup_Visible_detail = true;
            if (this.dataRowDetail.HandlingUserId == 10080) {//Giam doc
                this.labelYKCD = "Ý kiến chỉ đạo của GĐ";
                this.isGD = true;
            } else {
                this.labelYKCD = "Ý kiến chỉ đạo của BGĐ";
                this.isGD = false;
            }

            this.data_DVXL.forEach(x => {
                x["mainHandling"] = false;
                x["coHandling"] = false;
            });
            this._documentHandlingAppService.get_DVXL_ForDocument(this.selectedRowsData[0].Id, this.selectedRowsData[0].UnitId).subscribe((res) => {
                debugger
                this.old_DVXL = res;
                this.old_DVXL.forEach((ele) => {
                    let index = this.data_DVXL.findIndex(x => x.id == ele.OrganizationId);
                    switch (ele.TypeHandling) {
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
                    // if(res.Attachment)
                    // this.selectedRowsFile
                });
            });
        }
        else if (this.labelId != 6 && this.labelId != 85) {
            let temp = [];
            temp = this.data_DVXL.map(function (x) { return { ...x } });
            this._documentHandlingAppService.get_DVXL_ForDocument(this.selectedRowsData[0].Id, this.selectedRowsData[0].UnitId).subscribe((res) => {
                this.old_DVXL = res;
                this.old_DVXL.forEach((ele) => {
                    let index = temp.findIndex(x => x.id == ele.OrganizationId);
                    switch (ele.TypeHandling) {
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
                // this.gridContainer113.instance.repaint();
            });
            this.popup_Visible_detail_XL = true;
        }
    }
    // thay doi BGD // trình BGĐ
    change_director() {
        this.spinnerService.show();
        this._documentAppService.submitToDirector(this.selectedRowsData[0].Id, parseInt(this.selectedDirector))
            .pipe(finalize(() => { this.spinnerService.hide(); }))
            .subscribe(() => {
                this.notify.success('Văn bản đã trình BGĐ!');
                this.popup_Visible = false;
                this.router.navigate(['/app/main/qlvb/executeLabelSQL/84']);
            })
    }

    popUpClass() {
        return "popUpClass";
    }

    update_ykien() {
        let isMainHanling = false; //văn bản đã có đội chủ trì
        this.spinnerService.show();
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();

        debugger

        if (this.selectedRowsData.length == 0) {
            return;
        }

        else {
            this.saving = true;
            var dvxl = new DirectorOpinionDto();
            dvxl.processingRecommended = this.dataRowDetail.ApprovingRecommended;
            dvxl.mainDirectorId = this.mainDirectorId;
            dvxl.directorId = this.dataRowDetail.DirectorId;
            dvxl.subProcessingRecommended = this.dataRowDetail.SubApprovingRecommended;
            //;
            //dvxl.fileChiDao = this.uploadedFileChiDao.map(x => x.name).join(';');
            dvxl.fileChiDao = this.tepDinhKemSave;
            dvxl.listDVXLs = [];
            for (var i = 0, len = this.data_DVXL.length; i < len; i++) {
                if (this.data_DVXL[i].mainHandling == true) {
                    var temp = new ListDVXL();
                    temp.unitId = this.data_DVXL[i].id;
                    temp.typeHandling = 1;
                    dvxl.listDVXLs.push(temp);
                    // this._documentHandlingDetailServiceProxy.createOrEdit(record).subscribe(()=>{});

                    isMainHanling = true;
                }
                else if (this.data_DVXL[i].coHandling == true) {
                    var temp = new ListDVXL();
                    temp.unitId = this.data_DVXL[i].id;
                    temp.typeHandling = 0;
                    dvxl.listDVXLs.push(temp);
                }
            }

            // check chưa chọn đơn vị chủ trì
            // if(dvxl.listDVXLs.findIndex(e => e.typeHandling == 1) == -1 ) {
            //     this.notify.warn("Chưa chọn đơn vị chủ trì", "Chú ý");
            //     return;
            // }

            if (dvxl.listDVXLs.length > 0 && isMainHanling) {//có đơn vị xử lý thì chuyển xuống đã duyệt
                this._documentAppService.changeOpinionOfDirector(this.dataRowDetail.HandlingId, dvxl)
                    .pipe(finalize(() => {
                        this.saving = false;
                        this.spinnerService.hide();
                    }))
                    .subscribe(() => {
                        this.popup_Visible_detail = false;
                        this.gridContainer.instance.refresh();
                        this.router.navigate(['/app/main/qlvb/executeLabelSQL/6']);
                    });
            } else {//nếu không có thì chỉ update các trường dưới DB
                this._documentAppService.changeOpinionOfDirectorNew(this.dataRowDetail.HandlingId, dvxl)
                    .pipe(finalize(() => {
                        this.saving = false;
                        this.spinnerService.hide();
                    })).subscribe(() => {
                        this.popup_Visible_detail = false;
                        this.gridContainer.instance.refresh();
                        this.router.navigate(['/app/main/qlvb/executeLabelSQL/84']);
                    });
            }

            // this._documentAppService.changeOpinionOfDirector(this.dataRowDetail.HandlingId, dvxl)
            //     .pipe(finalize(() => {
            //         this.saving = false;
            //         this.spinnerService.hide();
            //     }))
            //     .subscribe(() => {
            //         this.popup_Visible_detail = false;
            //         this.gridContainer.instance.repaint();
            //         this.router.navigate(['/app/main/qlvb/executeLabelSQL/6']);
            //         // console.log(this.dataRowDetail);

            //         // // gửi thông báo
            //         // debugger
            //         // this.sendNotification();

            //         // setTimeout(() => {
            //         //     this.router.navigate(['/app/main/qlvb/executeLabelSQL/6']);
            //         // }, 1000)

            //     });

        }
    }

    // trình BGĐ
    trinhBGD() {
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            this.message.error("Chưa chọn văn bản");
            return;
        }
        else {

            this.selectedDirector = this.selectedRowsData[0].DirectorId;
            // mặc định chọn giám đốc
            // this.selectedDirector = this.director_list.filter(e => e.organizationUnitId == 8)[0].userId;
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
        else if (this.selectedRowsData.length > 1) {
            let input = [];
            for (var i = 0; i < this.selectedRowsData.length; i++) {
                input.push(this.selectedRowsData[i].Id);
            }
            this._documentAppService.multipleSubmitToDirector(input)
                .pipe(finalize(() => { this.spinnerService.hide(); }))
                .subscribe(() => {
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
        this.router.navigate(['/app/main/qlvb/incomming-document/edit/' + e.data.Id]);
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
                        this.gridContainer.instance.refresh();
                        this.notify.success('Xóa thành công!');
                    }, (err) => {
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
        for (var i = 0, len = this.selectedRowsData.length; i < length; i++) {
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
        switch (this.labelId) {
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
    //     this._dynamicAction.getLabelData(this.labelId).subscribe(res => {
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
        const self = this;

        self.labelId = labelId;
        self.outdate = outdate;

        // self.gridContainer.instance.refresh();

    }

    search(){
        const self = this;
        self.gridContainer.instance.refresh();
    }

    clear(){
        const self = this;

        self.timkiem.noidung = '';
        if(self.labelId == 85){
            self.timkiem.month = 0;
            self.timkiem.dataBook = 0;
        }

        self.gridContainer.instance.refresh();
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

    showFileChiDao(e: any) {
        // this.rootUrl = AppConsts.remoteServiceBaseUrl;
        // this.link = this.rootUrl + "/" + e.FileChiDao;
        // window.open(this.link, '_blank');.
        this.selectedRowsFileChiDao = e.FileChiDao.split(';').map(x => { return { fileName: x } });
        this.popup_FileChiDao = true;
    }

    showFileChiDaoDetail(e) {
        this.rootUrl = AppConsts.fileServerUrl;
        this.link = this.rootUrl + "/" + e.data.fileName;
        window.open(this.link, '_blank');
    }

    saveToBook() {

    }

    // Lịch sử xử lý văn bản
    showListHistory(event: any) {
        // this._historyUploadsServiceProxy.getList(event).subscribe(res => {
        //     this.history_Upload = res;
        // });
        debugger

        this.dataDisplay = [];
        let rowIndex = this.gridContainer.instance.getRowIndexByKey(event);

        let row = this.gridContainer.instance.getVisibleRows()[rowIndex].data;
        if (row != undefined && row.Attachment != null && row.Attachment != "") {
            row.Attachment.split(";").forEach(f => {
                this.dataDisplay.push({ "tepDinhKem": f });
            });
            this.uploadedFileChiDao = [];
            this.history_Upload = this.history_Upload.concat(this.dataDisplay);
        }
        this.historyPopupVisible = true;
    }

    showListFile(event: any) {
        this.history_Upload.splice(0, this.history_Upload.length);
        this._documentAppService.getDocumentEditByDocumentId(event).subscribe((result) => {
            if (result.attachment) {
                var num = result.attachment.split(';');
                num.forEach((ele) => {
                    this.history_Upload.push({ file: ele });
                });

            }
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

    approveDocument() {
        if (this.selectedRowsData.length == 0) {
            this.message.warn('Vui lòng chọn văn bản cần duyệt');
            return;
        }
        this.spinnerService.show();
        this._documentAppService.approveDocument(this.selectedRowsData[0].Id, this.selectedRowsData[0].HandlingId)
            .pipe(finalize(() => {
                document.getElementById('TopMenu2').click();
                this.spinnerService.hide();
            }))
            .subscribe(() => {
                // this.gridContainer.instance.repaint();
                // this.gridContainer.instance.refresh();
                this.notify.info('Đã duyệt thành công!');
                this.router.navigate(['/app/main/qlvb/executeLabelSQL/6']);
            });
    };
    dataFileChiDaoDetail: any;
    selectedRowsFileChiDao = [];
    popup_FileChiDao = false;
    // duyệt nhiều VB
    approve_Multiple_Func() {
        if (this.selectedRowsData.length == 0) {
            this.message.warn('Vui lòng chọn văn bản cần duyệt');
            return;
        }
        this.spinnerService.show();
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            return;
        }
        let arr = [];
        for (var i = 0, len = this.selectedRowsData.length; i < len; i++) {
            let newDto = new ApproveDocumentDto();
            newDto.documentId = this.selectedRowsData[i].Id;
            newDto.documentHandlingId = this.selectedRowsData[i].HandlingId;
            arr.push(newDto);
        }
        this._documentAppService.multiApproveDocument(arr)
            .pipe(finalize(() => {
                document.getElementById('TopMenu2').click();
                this.spinnerService.hide();
            }))
            .subscribe(() => {
                this.notify.info('Đã duyệt thành công!');
                this.router.navigate(['/app/main/qlvb/executeLabelSQL/85']);
            });

        // this.selectedRowsData.forEach(x => {


        // });
    }

    onCheckBoxChanged(e, cell) {
        let index = this.data_DVXL.findIndex(x => x.id == cell.data.id);
        //kiểm tra cột vừa thao tác là main hay co
        switch (cell.column.dataField) {
            case 'mainHandling':
                //kiểm tra có đvxl chính chưa, nếu có rồi thì bỏ chọn cái trước
                console.log(this.previousMainHandlingId);
                if (this.previousMainHandlingId >= 0) {
                    let temp = this.data_DVXL.findIndex(x => x.id == this.previousMainHandlingId);
                    this.data_DVXL[temp]["mainHandling"] = false;
                }

                if (this.data_DVXL[index]["coHandling"] == true) {
                    this.data_DVXL[index]["coHandling"] = false;
                }

                this.data_DVXL[index]["mainHandling"] = e.value;

                //giữ id của đơn vị đang nắm chủ trì
                this.previousMainHandlingId = cell.data.id;
                break;
            case 'coHandling':
                if (this.data_DVXL[index]["mainHandling"] == true) {
                    this.data_DVXL[index]["mainHandling"] = false;
                }

                this.data_DVXL[index]["coHandling"] = e.value;
        }
        console.log(this.data_DVXL)
    }
    processingResult: DocumentHandlingDetailDto;
    update_KQGQ() {
        this.spinnerService.show();
        this.saving = true;
        this._documentAppService.update_KQGQ(this.selectedRowsData[0].Id, this.selectedRowsData[0].HandlingId,
            this.processingResult.processingRecommended, moment(this.processingResult.processingDate))
            .pipe(finalize(() => {
                this.getVanbanDxTable(this.labelId);
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
            data: {
                documentId: data.Id,
                roleId: this.appSession.roleId
            },
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

    onRowPrepared(e: any) {

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
        console.log(e);
        this.router.navigate(['/app/main/qlvb/incomming-document/edit/extra/' + e.Id])
    }

    // chuyển bổ sung
    transferExtra(e: any) {
        this.dataRowDetail = e.data;
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
                if (ele.TypeHandling == 1) {
                    this.data_DVXL[index]["mainHandling"] = true;
                    this.data_DVXL[index]["coHandling"] = false;
                    this.data_DVXL[index]["disabledCT"] = true;
                    this.data_DVXL[index]["disabledPHXL"] = true;
                    this.previousMainHandlingId = this.data_DVXL[index].id;
                }
                else if (ele.TypeHandling == 0) {
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
    chuyenBoSung() {
        console.log(this.newSelectedDVXL)
        let json = JSON.stringify(this.newSelectedDVXL);
        console.log(this.dataRowDetail);
        this.selectedRowsData[0].ApprovingRecommended = this.dataRowDetail.ApprovingRecommended;
        ;
        this._documentAppService.extraTransfer(this.selectedRowsData[0].HandlingId, json, this.selectedRowsData[0]).subscribe(() => {
            this.notify.info("Chuyển bổ sung thành công!");
            this.popup_chuyenBoSung = false;
        });
    }
    newSelectedDVXL = [];
    onCheckBoxBoSungChanged(e, cell) {
        let index = this.data_DVXL.findIndex(x => x.id == cell.data.id);
        //kiểm tra cột vừa thao tác là main hay co
        if (cell.column.dataField == 'coHandling') {
            let dvxl = new ListDVXL();
            dvxl.unitId = this.data_DVXL[index].id;
            dvxl.typeHandling = 0;
            this.newSelectedDVXL.push(dvxl);
        }
    }

    onDisposingChuyenBoSung(e: any) {
        this.data_DVXL.forEach(x => {
            x["mainHandling"] = false;
            x["coHandling"] = false;
            x["disabledCT"] = false;
            x["disabledPHXL"] = false;
        });
    }

    deleteFile(e: any) {
        this.selectedRowsFile.splice(e.rowIndex, 1);
        this.tepDinhKemSave = this.selectedRowsFile.map(x => { return x.tepDinhKem.toString() }).join(';');

        $.ajax({
            url: AppConsts.fileServerUrl + `/fileUpload/Delete_file?documentName=${e.data.tepDinhKem}`,
            type: "delete",
            contentType: "application/json",
            success: (res) => {
                this._documentAppService.deleteDocumentFileInServer(e.data.tepDinhKem, 0).subscribe(() => { });
            },
            error: (err) => {

            }
        });
    }

    setFullNameFile(e: any) {
        if (e.value.length == 0) return;

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

    close_fileChiDaoPopUp() {
        this.popup_FileChiDao = false;
    }

    popup_ScanDocument = false;

    open_popup_Scan() {
        this.popup_ScanDocument = true;
    }

    onValueChanged_book(e: any) {
        // let month = this.monthSelectBox.instance.option("value");
        // let dataSource = [...this.data];
        // if (e.value == 0 && (month == 0 || month == null)) {
        //     this.initialData = dataSource;
        // } else if (e.value != 0 && month == 0) {
        //     this.initialData = dataSource.filter(x => (x.Book == e.value));
        // } else if (e.value == 0 && month != 0) {
        //     this.initialData = dataSource.filter(x => (x.month == month));
        // } else {
        //     this.initialData = dataSource.filter(x => (x.Book == e.value && x.month == month));
        // }
        // this.totalCount = this.initialData.length;
        const self = this;
        self.gridContainer.instance.refresh();
    }

    onValueChanged_month(e: any) {
        // let book = this.dataBookSelectBox.instance.option("value");
        // let dataSource = [...this.data];
        // if (e.value == 0 && book == 0) {
        //     this.initialData = dataSource;
        // } else if (e.value != 0 && (book == 0 || book == null)) {
        //     this.initialData = dataSource.filter(x => x.month == e.value);
        // } else if (e.value == 0 && book != 0) {
        //     this.initialData = dataSource.filter(x => x.Book == e.book);
        // } else {
        //     this.initialData = dataSource.filter(x => (x.month == e.value && x.Book == book));
        // }
        // this.totalCount = this.initialData.length;
        const self = this;
        self.gridContainer.instance.refresh();
    }

    onToolbarPreparing(e) {
        debugger
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        });
    }

    sendNotification() {
        // debugger

        // let unit: any = this.listUserMapPhongBan.find(e => e.Id == this.previousMainHandlingId);

        // // lấy thông tin template bằng code (redmine)
        // this.notification_templateService.getNotificationTemplateByCode("YKIENCHIDAO").subscribe(res => {
        //     // tạo thông báo winform
        //     this._notificationShare.createNotification(res.data.id, [unit.userId], [4], {}, AppConsts.appBaseUrl + "/app/main/qlvb/executeLabelSQL/6");
        // });
    }
    onScanTypeChanged(e: any) {
        if (e.value == 3) {
            this.isDuplex = true;
        }
    }

    scan() {
        const self = this;
        self.spinnerService.show();
        var scanFileName = "_Phieu_trinh_" + Date.now() + ".pdf";

        self._userExtentionServiceProxy.getByUser().subscribe((res) => {

            if (!isNullOrUndefined(res.id)) {
                var data = {
                    "DisplayName": scanFileName,
                    "DoMainAppPath": formatDate(self.currentDate, 'dd-MM-yyyy', 'en-US'),
                    "DeviceName": res.scanName,
                    "IsDuplex": self.isDuplex,
                    "ScanType": self.scanType
                };
                self.scanRequest(data, scanFileName)
            }
            else {
                var data2 = {
                    "DisplayName": scanFileName,
                    "DoMainAppPath": formatDate(self.currentDate, 'dd-MM-yyyy', 'en-US'),
                    "DeviceName": '',
                    "IsDuplex": self.isDuplex,
                    "ScanType": self.scanType
                };
                self.scanRequest(data2, scanFileName)
            }

        })

    }

    scanRequest(data, scanFileName) {
        const self = this;
        $.ajax({
            url: 'http://localhost:9001/ScanService/scan',
            data: JSON.stringify(data),
            contentType: 'application/json',
            method: 'POST',
            success: function (result) {
                // cập nhật thông tin lên table

                self.dataDisplay.length = 0;
                const cValue = formatDate(self.currentDate, 'dd-MM-yyyy', 'en-US');
                self.currentTime = new Date().getHours() + "-" + new Date().getMinutes();
                let listFileName = [];

                self.dataDisplay.push({ tepDinhKem: cValue + "/" + scanFileName });
                listFileName.push(scanFileName);

                self.selectedRows = self.selectedRows.concat(self.dataDisplay);

                //cập nhật lại thông tin máy in cho user
                self.tepDinhKemSave = listFileName.join(';');
                if (result["ExistDevice"] == "false" || result["ExistDevice"] == false) {
                    var postData = new UserExtenTionDto();
                    postData.scanName = result["DeviceName"];
                    self._userExtentionServiceProxy.createOrEdit(postData).subscribe(() => {

                    })
                }
                self.spinnerService.hide();

            },
            error: function (data) {
            }
        });
    }
}
