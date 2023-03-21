import { DataVm, DocumentServiceProxy, FParameter } from './../../../../../shared/service-proxies/service-proxies';

import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    Inject,
    Optional,
    ViewEncapsulation, ViewContainerRef, ComponentRef, ComponentFactoryResolver, ComponentFactory, OnChanges, SimpleChanges, Input, ViewChildren, Injector, ChangeDetectorRef

} from '@angular/core';
import {
    Router, ActivatedRoute,
} from '@angular/router';
import { DxDataGridComponent, DxPopupComponent, DxFormComponent, DxTreeViewComponent, DxChartComponent, DxGanttComponent, DxTreeListComponent } from 'devextreme-angular';
import { isNullOrUndefined } from 'util';
import { DRReportServiceProxy, DRReportServiceServiceProxy, DRLookUpServiceProxy, DRViewerServiceProxy, DRFilterServiceProxy, DrDynamicFieldServiceProxy, DRColumnServiceProxy, DRChartServiceProxy, DRViewerUtilityServiceProxy } from '@shared/service-proxies/service-proxies';
import { FormatService } from './formatService';
import {
    API_BASE_URL,
} from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { ViewerUtilityConfigurationService } from './viewer-utility-configuration.service';
// import { KetQuaCongTacPhongComponent } from '@app/main/qlkh-cv/popup/ket-qua-cong-tac-phong/ket-qua-cong-tac-phong.component';
// import { ChiTietPhanCongNVComponent } from '@app/main/qlkh-cv/popup/chi-tiet-phan-cong-nv/chi-tiet-phan-cong-nv.component';
// import { KetQuaCongTacDoiComponent } from './../../qlkh-cv/popup/ket-qua-cong-tac-doi/ket-qua-cong-tac-doi.component';
// import { BaoCaoKetQuaComponent } from './../../qlkh-cv/popup/bao-cao-ket-qua/bao-cao-ket-qua.component';
import Popup from "devextreme/ui/popup";
// import { SocketOne } from 'root.module';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
// import { HinChartComponent } from '@app/charts/hin-chart/hin-chart.component';
import { AppComponentBase } from '@shared/common/app-component-base';
import Swal from 'sweetalert2';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import moment from 'moment'
import { isNumeric } from 'jquery';
// import { isNumeric } from 'rxjs/util/isNumeric';

export interface IColumn {
    alignment: string;
    allowEditing: boolean;
    caption: string;
    columns: IColumn[];
    dataField: string;
    dataType: string;
    fixed: boolean;
    format: any;
    visible: boolean;
    width: string;
    parentId: string;
    id: string;
    isParent: any;
    cellTemplate: any;
    groupIndex: any;
    minWidth: any;
}

export class DxColumn implements IColumn {
    alignment: string;
    allowEditing: boolean;
    caption: string;
    columns: DxColumn[];
    cellTemplate: any;
    dataField: string;
    dataType: string;
    fixed: boolean;
    format: any;
    visible: boolean;
    width: string;
    parentId: string;
    id: string;
    isParent: any;
    groupIndex: any;
    minWidth: any;
    editorOptions: any;
    validationRules: any[];
    sortOrder: any;
    orderId: any;
    parentCode: any;
    encodeHtml: any;
}

export class Chart {
    code: any;
    name: string;
}

@Component({
    selector: 'report-viewer-utility',
    templateUrl: './viewer-utility-component.html',
    styleUrls: ['./viewer-utility-component.scss'],
    providers: [FormatService],
    //encapsulation: ViewEncapsulation.None
})
export class ReportViewUtilityComponent extends AppComponentBase implements OnInit {
    @Input() reportCode: any = undefined;
    @Input() labelActionCode: any = undefined;
    @Input() reportUtilityId: any = undefined;

    @ViewChild('data', { static: true }) data: DxDataGridComponent;
    @ViewChild('treeList', { static: false }) treeList: DxTreeListComponent;
    @ViewChild('gridFormConfig', { static: false }) gridFormConfig: DxDataGridComponent;
    @ViewChild('gantt', { static: false }) gantt: DxGanttComponent;
    // @ViewChild('ganttContextMenu', { static: true }) ganttContextMenu: DxGanttConTextMenuComponent;
    @ViewChild('popup', { static: true }) popup: DxPopupComponent;
    //@ViewChild(DxPopupComponent) popup: DxPopupComponent;
    @ViewChild('form', { static: true }) form: DxFormComponent;
    @ViewChild('barchart', { static: true }) barchart: DxChartComponent;
    @ViewChild(DxTreeViewComponent, { static: true }) treeview: DxTreeViewComponent;
    @ViewChild('formPopup', { static: true }) formPopup: DxFormComponent;
    // @ViewChildren('hinChart') hinChart: HinChartComponent;
    utilityId: any;

    constructor(
        injector: Injector,
        private router: Router,
        private reportService: DRReportServiceProxy,
        private serviceService: DRReportServiceServiceProxy,
        private lookupService: DRLookUpServiceProxy,
        private viewerService: DRViewerServiceProxy,
        private filterService: DRFilterServiceProxy,
        private dynamicFieldService: DrDynamicFieldServiceProxy,
        private columnService: DRColumnServiceProxy,
        public formatService: FormatService,
        private activeRouter: ActivatedRoute,
        private chartService: DRChartServiceProxy,
        private _viewUtilityService: DRViewerUtilityServiceProxy,
        private _componentViewConfigurationService: ViewerUtilityConfigurationService,
        private _documentAppService: DocumentServiceProxy,
        private http: HttpClient,
        private ref: ChangeDetectorRef,
        // private socket: SocketOne,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(injector);
        const self = this;
        this.baseUrl = baseUrl ? baseUrl : "";
        this.router.events.subscribe((val) => {
            self.findGetParameter();
        });
        this.isTreeBoxOpened = false;
    }

    dynamicForm: any = {
        "id": 0,
        "name": "NEW FORM",
        "code": "NEWFORM",
        "latestVersion": 0,
        "formVersionId": 0,
        "tableName": null,
        "datasourceId": 0,
        "options": "{\"colCount\":2,\"readOnly\":false,\"labelLocation\":\"top\"}",
        "templateFile": [],
        "formData": {},
        "formFields": [],
        "deleteFormFields": [],
        "isDelete": false,
        "isActive": true,
        "title": "NEW FORM"
    };
    iconClass: any = "fa fa-eye";
    disabled_btn_search: any = false;

    totalCount: number = 0;
    code: any;
    private baseUrl: string;

    currentReport: any;
    formId: any;
    listItem:any[];
    sqlContent: any;
    reportName: any;
    formData: any = {};
    formDataLocalStorage: any = [];
    column: any;
    export_column: any;
    export_column_default: any;
    dataSourceTest3: any = [];
    pageSize: any = 50;
    pageIndex: any = 0;
    pageSizeTreeList: any = 50;
    pageIndexTreeList: any = 0;
    paramTest: any = [];
    sumary: any = {};
    treeBoxValue: any;
    dataBoxValue: any;
    ReportOptions: any;
    listParentCode: any = [];
    listChildCode: any = [];
    curentControlData: any;
    isDynamicCol: any;
    typeget: any;
    isColumnAutoWidth: any;
    visible: any = false;
    displayType: any;  // =0 table =1 form =2 biểu đồ cột(barchart) =3 biểu đồ tròn(piechart)
    pieChartDataSource: any = [];
    seriesField: any;
    ArgumentField: any;
    ValueField: any;
    barChartDataSource: any = [];
    displayMode: any;   //Kiểu hiển thị argument label chart
    rotationAngle: any; //Độ nghiêng của trục argument label chart
    columnLink = [];
    isTreeBoxOpened: boolean;
    isDataGridBoxOpened: boolean;
    size = { width: 500, height: 500 }
    curentreportid: any;

    formColCount: any = 2;
    formColSpan: any = 2;
    test = false;
    isPreview = false;
    isClickedImport: boolean = false;
    //style
    tableVisibility: any = "hidden";
    tableDisplay: any = "none";
    barChartVisibility: any = "hidden";
    barChartDisplay: any = "none";
    pieChartVisibility: any = "hidden";
    pieChartDisplay: any = "none";
    hinChartVisibility: any = "hidden";
    hinChartDisplay: any = "none";
    ganttChartVisibility: any = "hidden";
    ganttChartDisplay: any = "none";
    treeListVisibility: any = "hidden";
    treeListDisplay: any = "none";
    //Danh sách tham số button Action
    LabelCode: any;
    _label_Action: any;
    actions: any = [];
    actions2: any = [];
    actions3: any = [];
    action_button: any = {
        pause: false,
        delete: false,
        cancel: false,
        reopen: false,
        view: false,
        edit: false,
        results: false,
        processing_process: false,
        update_results: false,
        file_manager: false,
        assignment_duties: false,
        gantt_chart: false,
        team_results: false,
        trips_report: false,
        edit_team: false,
        view_team: false,
        update_results_team: false,
        create: false,
        confirm: false,
        config: false
    };

    isExportWord: any = true;
    show_search: any = false;
    popupVisible: any = false;
    popupImgVisible: any = false;
    popupListVisible: any = false;
    popupHeight = 700;
    popupWidth = 1000;
    popupFormHeight = 700;
    popupFormWidth = 1000;
    popupFormVisible: any = false;
    popupListHeight = 700;
    popupListWidth = 1000;
    popupImgHeight = 700;
    popupImgWidth = 1000;
    popupVisibleConfirm: any = false;
    click_One: any = false;
    popupVisibleImport: any = false;
    popupVisibleAttachment: any = false;

    attachmentList: any = []
    importFile: any = [];
    selectedFileList: any = [];
    importFileList: any = [];
    componentPopup: any = {
        component: null,
        inputs: {

        },
        outputs: {

        }
    }
    urlImportFile: any;
    fileTypeAccept: any = [];
    uploadedFileName: any;
    charts: Chart[] = [{
        code: 'bar',
        name: 'Biểu đồ cột'
    }, {
        code: 'pie',
        name: 'Biểu đồ tròn'
    }, {
        code: 'doughnut',
        name: 'Biểu đồ donut'
    }, {
        code: 'radar',
        name: 'Biểu đồ nhện'
    }, {
        code: 'polarArea',
        name: 'Biểu đồ vùng cực'
    }, {
        code: 'line',
        name: 'Biểu đồ đường'
    }]

    matChartData: any = [
        { data: [65, 59, 80, 81, 72, 53, 95], label: 'Iphone 8' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Iphone X' }
    ]
    //check get localstorage or not
    get_storage: any = false;
    chartData: any = [];
    chartLabels: any = [];
    chartType: string = 'pie'

    //queryParam
    link_param: any = [];
    query_params: any;
    Init_query_params: any = [];
    api_query_params: any;

    userId_query: any = undefined;

    disableSearch: any = false;
    disableHandleCollumn: any = false;

    appconst = AppConsts;
    banGDarr: any = [
        { Id: 1, Name: 'Phòng tài chính' },
        { Id: 2, Name: 'Phòng kế hoạch' },
        { Id: 3, Name: 'Giám đốc' }
    ];
    popupVisibleChuyen: boolean = false;

    isLoadPanelVisible: any = false;

    allowedPageSizes: any = [20, 50, 100];

    @ViewChild('tr', { static: true }) vc: Popup;

    form_labelLocation: any = window.outerWidth < 600 ? "top" : "top";

    columnHidingEnabled: any = false;

    // form filter config
    popupConfigVisible: any = false;
    saveFormConfigOptions: any = {};
    closePopupConfigOptions: any = {};
    importPopupConfigOptions: any = {};
    closeImportPopupConfigOptions: any = {};
    formGroupConfigs = [];
    filePathUpload: string;
    uploadUrl: string;
    columnExportDatasource = [];
    buttonStatusExportVisible: boolean = false;
    exportButtonOptions = [
        {
            "id": 1,
            "name": "Mặc định"
        },
        {
            "id": 2,
            "name": "Theo template"
        }
    ]
    isExportDefault: any = false;
    notChooseColumnToExport: boolean = true;
    ///
    ganttChartTaskDataSource: any = [];
    ganttChartDependencyDataSource: any = [];
    ganttChartResourceDataSource: any = [];
    ganttChartAssignmentDataSource: any = [];
    contextMenuItems: any = [];
    //
    isPopupConfirm: boolean = false;
    popupConfirmText: any;
    popupConfirmButton: any;
    popupConfirmTitle: any;
    isCheckSame: boolean = false;
    isChooseData: boolean;
    checkSameText: any;
    checkSameButton: any;
    startDateRange: Date;
    endDateRange: Date;
    paramDependency: any = [];
    paramAddTask: any = [];
    popupTaskDetailVisible = false;
    showit: boolean = false;
    _actionsbackup: any = [];
    //
    taskBoardDisplay: any = "none";
    taskBoardVisibility: any = "hidden";
    taskBoardDataSource: any = [];
    resourcesVal: any = [];
    query_paramsForm: any = [];
    successLoad: any = false;
    dataSourceOptions: any[] = [];
    qrdata: string = '';
    mapFileTemplate = new Map();
    items: string[] = [];
    sign_items: string[] = [];
    printUrl: string = '';
    actionExportFormOptions: any = [];
    formCode: string;
    templateCode: string;
    templateForm: any = [];
    isTopHidden: any;
    expanded: boolean;
    scaleTypeRange = { min: "hours", max: "days" };
    currentTime: Date;
    colorTask = "#7FFFD4";
    topTask: any;
    profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    captchaBoxDataField = ''
    checkSortByColumn = []
    filterIdLoadMultipleWay: number;
    columnData: any[];
    customButtonOptions: any;
    listTaskUpdate: any = [];
    onlyLoadOneTime = 0;
    filterList = []
    ngOnInit() {
        if (window.outerWidth < 500) this.columnHidingEnabled = true;

        window.onresize = () => {
            if (window.outerWidth < 600) this.form_labelLocation = "top";
            else
                this.form_labelLocation = "left";
        };

        const self = this;
        self.LabelCode = self.activeRouter.snapshot.params['labelCode'];
        self.code = self.activeRouter.snapshot.params['code'];
        this.findGetParameter();
        this.create_grid();

        //this.popup.visible = true;
        this.data.visible = false;
        self.activeRouter.params.subscribe(param => {
            self.resetData();
            self.code = param.code;
            if (param.utilityId != null || param.utilityId != undefined) {
                self.utilityId = param.utilityId;
            } else {
                self.utilityId = null;
            }
            if (self.reportCode != undefined) {
                self.LabelCode = self.labelActionCode;
                self.code = self.reportCode;
                self.utilityId = self.reportUtilityId;
            }
            window.localStorage.setItem('UTILITY_ID', self.utilityId);
            self.reportService.getIdByCode(self.code).subscribe(async (data: any) => {
                if (data.data.length > 0) {
                    self.isExportWord = data.data[0].isExportWord;
                }
                self.currentReport = data.data[0].id;
                self.disableSearch = data.data[0].disableSearch;

                await self.reportService.getById(self.currentReport).subscribe(async (res: any) => {
                    self.sqlContent = res.data.c.sqlContent;
                    self.reportName = res.data.c.name;
                    self.isDynamicCol = res.data.c.isDynamicColumn;
                    self.typeget = res.data.c.typeGetColumn;
                    self.formId = res.data.c.formID;
                    self.isColumnAutoWidth = res.isColumnAutoWidth;
                    self.displayType = res.data.c.displayType;
                    self.visible = res.data.c.visible;
                    self.data.visible = true;
                    self.expanded = res.data.c.isAutoCollapse;
                    if (res.data.c.colCount != undefined && res.data.c.colSpan != undefined) {
                        self.formColCount = res.data.c.colCount;
                        self.formColSpan = res.data.c.colSpan;
                    } else {
                        self.formColCount = 4;
                        self.formColSpan = 2;
                    }

                    if (res.data.c.disableHandleCollumn != undefined) {
                        self.disableHandleCollumn = res.data.c.disableHandleCollumn;
                    } else {
                        self.disableHandleCollumn = false;
                    }

                    if (res.data.c.allowedPageSizes != undefined && res.data.c.allowedPageSizes != "") {

                        self.allowedPageSizes = res.data.c.allowedPageSizes.split(",");
                        if (self.allowedPageSizes.length > 0) {
                            self.pageSize = Number(self.allowedPageSizes[0]);
                            self.pageSizeTreeList = Number(self.allowedPageSizes[0]);
                            self.allowedPageSizes.forEach(function (part, index, theArray) {
                                theArray[index] = Number(theArray[index]);;
                            });
                        }
                    } else {
                        self.allowedPageSizes = [20, 50, 100];
                        self.pageSize = 50;
                        self.pageSizeTreeList = 50
                    }

                    //this.popup.visible = false;
                    //self.formData = {};
                    //self.getLocalStorage();
                    self.loadFormitems();

                    self.loadTemplateUrl(res.data.c);
                    //self.viewreport();
                });
            });

        })


        this.saveFormConfigOptions = {
            type: 'success',
            text: 'Áp dụng',
            icon: 'save',
            onClick: ($event) => this.saveExportPopup($event)
        }

        this.closePopupConfigOptions = {
            type: 'normal',
            text: 'Đóng',
            icon: 'close',
            onClick: ($event) => this.closePopupConfig($event)
        }
        this.importPopupConfigOptions = {
            type: 'success',
            text: 'Import',
            icon: 'save',
            onClick: ($event) => this.openImportPopupConfig($event)
        }

        this.closeImportPopupConfigOptions = {
            type: 'normal',
            text: 'Đóng',
            icon: 'close',
            onClick: ($event) => this.closeImportPopupConfig($event)
        }

        this.actionExportFormOptions = {
            label: { text: 'test' },

        }
        self.customButtonOptions = {
            text: "Save",
            type: "default",
            onClick: () => self.saveGanttUpdated()
        };
        // console.log(self.get_storage)
        // if (self.get_storage) self.setLocalStorage();

    }

    filter_label_action(data: any, actiontemp: any) {
        const self = this;
        if ((data.__label_action == null || data.__label_action == undefined) && (data.__label_action_code == null || data.__label_action_code == undefined)) {
            return data.actions;
        } else if (data.__label_action != null || data.__label_action != undefined) {
            if (data.__label_action == '') data.__label_action = '[]'
            let _lc = JSON.parse(data.__label_action);

            if (data.actions.length == 0) {
                data.actions = actiontemp;
            }

            let list_action = [];
            data.actions.forEach(action => {
                _lc.forEach(active_action => {
                    if (action.ActionId == active_action) list_action.push(action);
                });
            });
            return list_action;

        } else if (data.__label_action_code != null || data.__label_action_code != undefined) {
            if (data.__label_action_code == '') data.__label_action_code = ''
            let _lc = data.__label_action_code.split(',')
            let list_action = [];
            data.actions.forEach(action => {
                _lc.forEach(active_action => {
                    if (action.Code == active_action) list_action.push(action);
                });
            });
            return list_action;
        }


    }

    create_grid() {

        $("#dx-grid").dxDataGrid({

        });
        $("#dx-tree-list").dxTreeList({

        })
        $("#dx-form").dxForm({

        });
    }

    onExporting(e) {
        const self = this;
        if (self.isExportDefault == false) {
            var exportTemplate = $("#dx-grid").dxDataGrid("option", "export");
            if (exportTemplate.template == null) return;

            // danh sach key cua defaultData
            var listkey = Object.keys(self.formData);

            for (var i = 0; i < exportTemplate.template.data.length; i++) {

                // Thêm filter value
                self.paramTest.forEach((e2) => {
                    exportTemplate.template.data[i] = exportTemplate.template.data[i].replace(":" + e2.Varible.toLowerCase(), e2.Value == null ? "" : e2.Value);
                });

                // Thêm default value
                listkey.forEach(val => {
                    exportTemplate.template.data[i] = exportTemplate.template.data[i].replace(":" + val.toLowerCase(), self.formData[val] == null ? "" : self.formData[val]);
                });
            };

            $("#dx-grid").dxDataGrid("option", "export", {
                template: exportTemplate,
                enabled: true,
                fileName: self.reportName
            });
            $("#dx-grid").dxDataGrid("option", "columns", self.export_column);
            $("#dx-grid").dxDataGrid("instance").exportToExcel(false);

            e.cancel = true;

        } else {
            const workbook = new Workbook();

            const worksheet = workbook.addWorksheet(self.reportName);

            self.data.instance.option('columns', self.export_column_default);
            exportDataGrid({
                component: e.component,
                worksheet,
                keepColumnWidths: true,
                //topLeftCell: { row: 1, column: 1 },
                customizeCell: (e) => {
                    var parser = new DOMParser();
                    var ColumnName = e.gridCell.column.name;
                    if (e.gridCell.rowType == "header") {
                        e.excelCell.style.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
                        e.excelCell.style.font = { name: 'Times New Roman', size: 11, color: { argb: 'FFFFFF' }, bold: true }
                        e.excelCell.style.border = { top: { style: 'thin', color: { argb: 'FFFFFF' } }, left: { style: 'thin', color: { argb: 'FFFFFF' } }, bottom: { style: 'thin', color: { argb: 'FFFFFF' } }, right: { style: 'thin', color: { argb: 'FFFFFF' } } }
                        e.excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4c75a3' } }
                    }
                    if (e.gridCell.rowType == "data") {
                        var temporalDivElement = document.createElement("div");
                        temporalDivElement.innerHTML = e.excelCell.value;
                        var parentNode = temporalDivElement;
                        e.excelCell.style.font = { name: 'Times New Roman', size: 11 }
                        if (isNumeric(e.gridCell.value) && ColumnName.toUpperCase() != 'STT') {
                            e.excelCell.style.alignment = { horizontal: "right", vertical: "bottom", wrapText: true };
                        } else {
                            if (moment(e.gridCell.value, "DD/MM/YYYY", true).isValid()) {
                                e.excelCell.style.alignment = { horizontal: "center", vertical: "bottom", wrapText: true };
                            } else {
                                e.excelCell.style.alignment = { horizontal: "bottom", vertical: "left", wrapText: true };
                            }


                        }
                        var reachTextArray = [];

                        const styleByNodeName = {
                            "B": "bold",
                            "STRONG": "bold",
                            "I": "italic",
                            "EM": "italic",
                            "U": "underline",
                            "A": "italic"
                        }

                        const _getParentNodeNames = (node) => {
                            var parentNodeNames = [];
                            const getParentNodeName = (node) => {
                                if (node.parentNode !== null) {
                                    parentNodeNames.push(node.nodeName);
                                    getParentNodeName(node.parentNode);
                                }
                            };

                            getParentNodeName(node);

                            return parentNodeNames;
                        }

                        const _getStylesByParenNodeNames = (node) => {
                            let font = {};
                            _getParentNodeNames(node).forEach((nodeName) => {
                                if (nodeName === "B" || nodeName === "STRONG" || nodeName === "I" || nodeName === "EM" || nodeName === "U" || nodeName === "A") {
                                    font[styleByNodeName[nodeName]] = true;
                                }
                            });
                            return font;
                        }

                        const inOrder = (nodes) => {
                            nodes.forEach((node) => {
                                if (node.nodeName === "#text") {
                                    var config;
                                    // console.log(node.nodeValue)
                                    //&& (node.parentNode.nodeName === "P" || node.parentNode.nodeName === "DIV")
                                    // if (node.previousSibling === null && (node.parentNode.nodeName === "P" || node.parentNode.nodeName === "DIV")) {
                                    //     config = { text: "\n" + node.nodeValue }; // <p>, <div>
                                    // } else {
                                    //      config = { text: node.nodeValue };
                                    // }
                                    const fontStyles = _getStylesByParenNodeNames(node);
                                    if (isNumeric(node.nodeValue) && ColumnName.toUpperCase() != 'STT') {
                                        // let configFmt = { maximumFractionDigits: 15 }
                                        // //var formated: any = new Intl.NumberFormat('vi-VN', configFmt).format(Number(node.nodeValue));
                                        // var formated: any = new Intl.NumberFormat('en-US', configFmt).format(Number(node.nodeValue));
                                        // config = { text: formated };
                                        config = { text: node.nodeValue };
                                    } else {
                                        config = { text: node.nodeValue };
                                    }
                                    config.font = fontStyles;
                                    reachTextArray.push(config);
                                } else {
                                    inOrder(node.childNodes);
                                }
                            });
                        };

                        if (parentNode) {
                            inOrder(parentNode.childNodes);
                            e.excelCell.value = { 'richText': reachTextArray };
                        }
                    }
                    if (e.gridCell.rowType === 'group') {

                        e.excelCell.style.alignment = { wrapText: false };
                    }
                }
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), self.reportName + ".xlsx");
                });
            });
            e.cancel = true;
        }


    };
    onExported(e) {
        this.data.instance.option('columns', this.column);
    }

    loadTemplateUrl(res) {
        this.loadTemplate(res);
    }


    loadTemplate(res) {
        // xlsxParser.loadAjaxTemplate("abc.xlsx");
        const self = this;
        var blob = null;

        $.ajax({
            url: AppConsts.fileServerUrl + "/ExportFile/DRGetTemplateFile?reportID=" + res.id,
            method: 'GET',
            xhrFields: {
                responseType: 'blob',
            },
            success: function (data) {
                // if (xhr.readyState === 4) {
                self.loadTemplateFile(res.excel, data);
                // }
            }
        });

    }

    loadTemplateFile(template, blobFile) {
        const self = this;
        var fileName = template.split('/')[template.split('/').length - 1]
        var file = new File([blobFile], fileName);
        xlsxParser.parse(file).then(function (data) {

            console.log("Import Template Excel Success !!!");

            $("#dx-grid").dxDataGrid("option", "export", {
                template: data,
                enabled: true,
                fileName: self.reportName
            });

        }, function (err) {
            console.log('error', err);
        });
    };

    onSubmit($event) {

    }

    async getServiceById(id: any) {
        const self = this;
        let promise = new Promise((resolve, reject) => {
            self.serviceService.getById(id).subscribe((rs: any) => {
                resolve(rs);
            }, err => reject(err));
        })
        return promise;
    }

    async getAllLookUpDetail(id: any) {
        const self = this;
        let promise = new Promise((resolve, reject) => {
            self.lookupService.getAllLookupDetail(id).subscribe((res: any) => {
                resolve(res);
            }, err => reject(err));
        });
    }

    onContentReadyFilter(e) {
        if (this.listItem != null && this.listItem != undefined)
            for (let i = 0; i < this.listItem.length; i++) {
                if (this.listItem[i].cssClass != undefined) {
                    let t: any = document.getElementsByClassName(this.listItem[i].cssClass)[0].getElementsByClassName("dx-layout-manager")[0];
                    let x: any = document.getElementsByClassName(this.listItem[i].cssClass)[0].getElementsByClassName("dx-form-group-content")[0];
                    x.style.paddingTop = "5px";
                    x.style.paddingBottom = "0";
                    x.style.marginTop = "0";
                    document.getElementsByClassName(this.listItem[i].cssClass)[0].getElementsByClassName("dx-form-group-caption")[0].innerHTML = " <span style='color: #4c75a3; font-weight: 700; font-size: 16px'><i class='fa fa-bars'></i> " + this.listItem[i].caption + "</span><div id='" + this.listItem[i].name + "' style='width:70px'> </div>";
                    $("#" + this.listItem[i].name + "").dxSwitch({
                        value: this.formGroupConfigs[i].visible,
                        visible: true,
                        validationStatus: "valid",
                        validationMessageMode: "auto",
                        focusStateEnabled: true,
                        hoverStateEnabled: true,
                        width: '45px',
                        elementAttr: {
                            style: "float: right;",

                        },
                        onValueChanged: async ($event) => {
                            if ($event.value == false) {
                                t.style.display = "none";

                                this.formData = []
                                await this.switchChange($event.value)
                            } else {
                                t.style.display = "unset";
                            }
                        },

                    })
                    let swon: any = document.getElementById(this.listItem[i].name).getElementsByClassName("dx-switch-on")[0]
                    let swoff: any = document.getElementById(this.listItem[i].name).getElementsByClassName("dx-switch-off")[0]
                    if (this.formGroupConfigs[i].visible == true) {
                        swon.style.color = "#337ab7";
                        swoff.style.color = "#337ab7";
                        swon.style.fontWeight = "800";
                        swoff.style.fontWeight = "800";
                        swoff.textContent = "Hiện";
                        swon.textContent = "Ẩn";
                        t.style.display = "unset";
                    } else {
                        let d: any = document.getElementById(this.listItem[i].name).getElementsByClassName("dx-switch-inner")[0]
                        swon.style.color = "#337ab7";
                        swoff.style.color = "#337ab7";
                        swon.style.fontWeight = "800";
                        swoff.style.fontWeight = "800";
                        swoff.textContent = "Hiện";
                        swon.textContent = "Ẩn";
                        d.style.marginLeft = "calc(-100% + 40px)";
                        t.style.display = "none";
                    }
                }

            }
        if (document.getElementById('captcha') != null) {
            this.createCaptcha();
        }

    }

    switchChange(e: any) {
        for (var i = 0; i < this.listItem.length; i++) {
            let d: any = document.getElementById(this.listItem[i].name).getElementsByClassName("dx-switch-inner")[0]
            if (e == false) {
                d.style.marginLeft = "calc(-100% + 40px)";
            }
        }

    }

    async loadFormitems() {
        const self = this;
        self.listItem = [];
        self.filterList = [];
        self.listParentCode = [];
        self.paramTest = [];
        self.formData = {};
        await self.loadDefaultfilter();
        self.filterService.getFiltersByReportId(self.currentReport).subscribe(async (res: any) => {
            if (res.data.length > 0) {
                self.show_search = true;
            }
            self.filterList = res.data;
            
            // reset group item
            self.formGroupConfigs = [];

            // group item
            for (const group_element of res.data) {

                if (group_element.controlType != 'group') continue;
                // popup config
                self.formGroupConfigs.push({
                    "code": group_element.code,
                    "name": group_element.reportFilterName,
                    "visible": !group_element.disable
                })

                var group_obj = {};
                group_obj['caption'] = group_element.reportFilterName;
                group_obj['name'] = group_element.code;
                group_obj['colSpan'] = group_element.colSpan;
                group_obj['colCount'] = group_element.colCount;
                group_obj['cssClass'] = group_element.code;
                group_obj['order'] = group_element.orderid;
                group_obj['itemType'] = group_element.controlType;
                //group_obj['visible'] = !group_element.disable // hide ; show
                group_obj['items'] = [];

                // child item
                for (const element of res.data) {

                    if (element.groupId != group_element.id) continue;

                    var data = {
                        id: null,
                        code: null,
                        value: null,
                    };
                    var parentCode;
                    var paramTestItem = new Object();
                    paramTestItem['Varible'] = element.code;
                    paramTestItem['Value'] = null;
                    self.paramTest.push(paramTestItem);

                    if (element.controlType == 'dxSelectBox') {
                        if (element.parentComboId != 0) {
                            res.data.forEach(temp => {
                                if (temp.id == element.parentComboId && temp.controlType == 'dxSelectBox') {
                                    parentCode = temp.code;
                                    var parentcodeItem = new Object();
                                    parentcodeItem['myid'] = element.id;
                                    parentcodeItem['myCode'] = element.code;
                                    parentcodeItem['parentCode'] = temp.code;
                                    self.listParentCode.push(parentcodeItem);
                                }
                            })
                        }

                        if (element.dataType == 'False' || element.dataType == false) {



                            let res_1: any = await self.getServiceById(element.serviceId);

                            var obj = {};
                            obj['label'] = { text: element.reportFilterName };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = self.formColSpan;
                            obj['name'] = element.code;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            if (element.required == true || element.required == 'True') {
                                obj['validationRules'] = [{
                                    type: "required",
                                    message: "Không được để trống mục này."
                                }];
                            }
                            data.id = element.id;
                            data.code = !self.isNullOrUndefined(parentCode) ? parentCode : null;
                            data.value = !self.isNullOrUndefined(self.formData[parentCode]) ? self.formData[parentCode] : null;
                            obj['editorOptions'] = {
                                dataSource: {
                                    loadMode: 'raw',
                                    load: function () {
                                        const promise = new Promise((resolve, reject) => {
                                            if (self.utilityId != null) {
                                                if (!!self.formData && self.formData.constructor === Object && Object.keys(self.formData).length === 0) {
                                                    self.serviceService.executeServiceByUtilityId(element.id, self.currentReport, self.utilityId, self.Init_query_params).subscribe((res1: any) => {
                                                        resolve(res1.data);
                                                    });
                                                } else {
                                                    self.serviceService.executeServiceWithParamByUtilityId(element.id, self.currentReport, self.utilityId, self.formDataLocalStorage.concat(self.Init_query_params)).subscribe(async (res2: any) => {
                                                        resolve(res2.data);
                                                    });
                                                }

                                            } else {
                                                if (!!self.formData && self.formData.constructor === Object && Object.keys(self.formData).length === 0) {
                                                    self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res1: any) => {
                                                        resolve(res1.data);
                                                    });
                                                } else {
                                                    self.serviceService.executeServiceWithParam(element.id, self.currentReport, self.formDataLocalStorage.concat(self.Init_query_params)).subscribe(async (res2: any) => {
                                                        resolve(res2.data);
                                                    });
                                                }

                                            }
                                        });

                                        return promise;
                                    },
                                    group: element.groupField,

                                },
                                width: element.width + "%",
                                displayExpr: res_1.colDisplay,
                                valueExpr: res_1.colValue,
                                showClearButton: true,
                                searchEnabled: true,
                                grouped: element.isGrouped,
                                onValueChanged: function (key) {
                                    var listkey = Object.keys(self.formData);
                                    var control;
                                    listkey.forEach(val => {
                                        if (self.formData[val] == key.value) {
                                            control = val;
                                        }
                                    });
                                    self.listParentCode.forEach(async code => {
                                        if (control == code.parentCode) {

                                            var param = new FParameter();
                                            param.value = key.value;
                                            param.varible = code.parentCode;
                                            self.curentControlData = new Object();
                                            self.curentControlData['name'] = control;
                                            self.curentControlData['value'] = key.value;
                                            self.curentControlData['child'] = code.myCode

                                            var list_param = [];
                                            list_param.push(param);
                                            list_param = list_param.concat(self.Init_query_params);


                                            if (self.utilityId != null && param.value != null) {
                                                self.serviceService.executeServiceWithParamByUtilityId(code.myid, self.currentReport, self.utilityId, list_param).subscribe(async (res: any) => {
                                                    await self.form.items.forEach(item => {
                                                        // Trường hợp groupItem
                                                        if (item["itemType"] == "group") {
                                                            item['items'].forEach(_item => {
                                                                if (_item["dataField"] == self.curentControlData.child) {
                                                                    //item["editorOptions"].dataSource = res;
                                                                    const x = self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`);
                                                                    const editorOption = x.editorOptions;
                                                                    editorOption.dataSource = res.data;
                                                                    self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`, 'editorOptions', editorOption);
                                                                    self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                }
                                                            });
                                                        } else {
                                                            if (item["dataField"] == self.curentControlData.child) {
                                                                //item["editorOptions"].dataSource = res;
                                                                const x = self.form.instance.itemOption(self.curentControlData.child);
                                                                const editorOption = x.editorOptions;
                                                                editorOption.dataSource = res.data;
                                                                self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                delete self.formData[self.curentControlData.child];
                                                                self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                            }
                                                        }
                                                    })
                                                });
                                            } else {
                                                self.serviceService.executeServiceWithParam(code.myid, self.currentReport, list_param).subscribe(async (res: any) => {
                                                    await self.form.items.forEach(item => {
                                                        // Trường hợp groupItem
                                                        if (item["itemType"] == "group") {
                                                            item['items'].forEach(_item => {
                                                                if (_item["dataField"] == self.curentControlData.child) {
                                                                    //item["editorOptions"].dataSource = res;
                                                                    const x = self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`);
                                                                    const editorOption = x.editorOptions;
                                                                    editorOption.dataSource = res.data;
                                                                    self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`, 'editorOptions', editorOption);
                                                                    self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                }
                                                            });
                                                        } else {
                                                            if (item["dataField"] == self.curentControlData.child) {
                                                                //item["editorOptions"].dataSource = res;
                                                                const x = self.form.instance.itemOption(self.curentControlData.child);
                                                                const editorOption = x.editorOptions;
                                                                editorOption.dataSource = res.data;
                                                                self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                delete self.formData[self.curentControlData.child];
                                                                self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                            }
                                                        }
                                                    })
                                                });
                                            }
                                        }

                                    });
                                }
                            }
                            //child
                            group_obj['items'].push(obj);
                            group_obj['items'].sort(function (a, b) { return a.order - b.order });
                        }
                        else {

                            let res_2 = await self.getAllLookUpDetail(element.lookupId);

                            var obj = {};
                            obj['label'] = { text: element.reportFilterName };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = self.formColSpan;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            obj['name'] = element.code;
                            obj['editorOptions'] = {
                                dataSource: res_2,
                                displayExpr: 'name',
                                valueExpr: 'code',
                                showClearButton: true,
                                searchEnabled: true,
                                width: element.width + "%",
                            }
                            if (element.required == true || element.required == 'True') {
                                obj['validationRules'] = [{
                                    type: "required",
                                    message: "Không được để trống mục này."
                                }];
                            }
                            //child
                            group_obj['items'].push(obj);
                            group_obj['items'].sort(function (a, b) { return a.order - b.order });

                        }
                    }

                    else if (element.controlType == 'captchaBox') {
                        var group = {};
                        if (element.colSpan == null) {
                            group['colSpan'] = 1;
                        } else {
                            group['colSpan'] = element.colSpan;
                        }

                        group['colCount'] = 2;
                        group['order'] = element.orderid;
                        group['itemType'] = 'group';
                        //group_obj['visible'] = !group_element.disable // hide ; show
                        group['items'] = [];

                        self.captchaBoxDataField = element.code
                        var obj = {};
                        obj['label'] = { text: element.reportFilterName };
                        obj['dataField'] = element.code;
                        obj['colSpan'] = element.colSpan;
                        obj['editorType'] = 'dxTextBox';
                        obj['value'] = "";
                        obj['editorOptions'] = {
                            onValueChanged: function (e) {
                                if (e.value != self.code) {
                                    self.createCaptcha();
                                    self.formData[element.code] = ''
                                }
                            }
                        }
                        obj['validationRules'] = [
                            {
                                type: "required",
                                message: "Mã xác thực không hợp lệ."
                            },
                            {
                                type: "compare",
                                ignoreEmptyValue: true,
                                comparisonTarget: self.validateCaptcha,
                                message: "Mã xác thực chưa chính xác!"
                            }];



                        var captcha_obj = {
                            colSpan: 1,
                            template: function () {
                                var t = $("<div style='justify-content: flex-start;display:flex'>");
                                $("<div id='captcha'>  </div>").appendTo(t);
                                $("<div>").dxButton({
                                    icon: "refresh",
                                    onClick: function () {
                                        self.createCaptcha();
                                    }
                                }).appendTo(t);
                                return t;
                            }

                        }
                        group['items'].push(obj);
                        group['items'].push(captcha_obj);
                        self.listItem.push(group);
                    
                        self.listItem.sort(function (a, b) { return a.order - b.order });
                    }
                    // tag box // update
                    else if (element.controlType == 'dxTagBox') {
                        //check child tagbox
                        if (element.parentComboId != 0) {
                            res.data.forEach(temp => {
                                if (temp.id == element.parentComboId && temp.controlType == 'dxTagBox') {
                                    parentCode = temp.code;
                                    var parentcodeItem = new Object();
                                    parentcodeItem['myid'] = element.id;
                                    parentcodeItem['myCode'] = element.code;
                                    parentcodeItem['parentCode'] = temp.code;
                                    self.listParentCode.push(parentcodeItem);
                                }
                            })
                        }

                        if (element.serviceId == null && element.lookupId == null) {
                            var obj = {};
                            obj['label'] = { text: element.reportFilterName };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = self.formColSpan;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            obj['name'] = element.code;
                            obj['editorOptions'] = {
                                width: element.width + "%",
                                searchEnabled: true,
                                acceptCustomValue: true,
                                noDataText: "",
                            }
                            if (element.required == true || element.required == 'True') {
                                obj['validationRules'] = [{
                                    type: "required",
                                    message: "Không được để trống mục này."
                                }];
                            }
                            //child
                            group_obj['items'].push(obj);
                            group_obj['items'].sort(function (a, b) { return a.order - b.order });
                        }
                        else {
                            //get service data if dataType == false
                            if (element.dataType == 'False' || element.dataType == false) {
                                let res__1: any = await self.getServiceById(element.serviceId)
                                if (self.formData[element.code] != undefined) {
                                    var value = self.formData[element.code].split(',').map(Number).filter(Boolean)
                                }

                                var obj = {};
                                obj['label'] = { text: element.reportFilterName };
                                obj['dataField'] = element.code;
                                obj['colSpan'] = self.formColSpan;
                                obj['name'] = element.code;
                                obj['order'] = element.orderid;
                                obj['editorType'] = element.controlType;
                                if (element.required == true || element.required == 'True') {
                                    obj['validationRules'] = [{
                                        type: "required",
                                        message: "Không được để trống mục này."
                                    }];
                                }
                                data.id = element.id;
                                data.code = !self.isNullOrUndefined(parentCode) ? parentCode : null;
                                data.value = !self.isNullOrUndefined(self.formData[parentCode]) ? self.formData[parentCode] : null;
                                obj['editorOptions'] = {
                                    dataSource: {
                                        loadMode: 'raw',
                                        load: function () {
                                            const promise = new Promise((resolve, reject) => {
                                                if (self.utilityId != null) {
                                                    self.serviceService.executeServiceByUtilityId(element.id, self.currentReport, self.utilityId, self.Init_query_params).subscribe((res1: any) => {

                                                        resolve(res1.data);
                                                    });
                                                } else {
                                                    self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res1: any) => {

                                                        resolve(res1.data);
                                                    });
                                                }
                                            });

                                            return promise;
                                        }
                                    },
                                    width: element.width + "%",
                                    displayExpr: res__1.colDisplay,
                                    valueExpr: res__1.colValue,
                                    value: value,
                                    showClearButton: true,
                                    searchEnabled: true,
                                    onValueChanged: function (key) {
                                        var listkey = Object.keys(self.formData);
                                        var control;
                                        listkey.forEach(val => {
                                            if (self.formData[val] == key.value) {
                                                control = val;
                                            }
                                        });

                                        self.listParentCode.forEach(async code => {
                                            if (control == code.parentCode) {

                                                var param = new FParameter();
                                                param.value = "" + key.value[0];
                                                for (var i = 1; i < key.value.length; i++) {
                                                    param.value += "," + key.value[i];
                                                }
                                                param.varible = code.parentCode;
                                                self.curentControlData = new Object();
                                                self.curentControlData['name'] = control;
                                                self.curentControlData['value'] = key.value;
                                                self.curentControlData['child'] = code.myCode

                                                var list_param = [];
                                                list_param.push(param);
                                                list_param = list_param.concat(self.Init_query_params);

                                                if (self.utilityId != null) {
                                                    self.serviceService.executeServiceWithParamByUtilityId(code.myid, self.currentReport, self.utilityId, list_param).subscribe(async (res: any) => {
                                                        await self.form.items.forEach(item => {
                                                            // Trường hợp groupItem
                                                            if (item["itemType"] == "group") {
                                                                item['items'].forEach(_item => {
                                                                    if (_item["dataField"] == self.curentControlData.child) {
                                                                        //item["editorOptions"].dataSource = res;
                                                                        const x = self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`);
                                                                        const editorOption = x.editorOptions;
                                                                        editorOption.dataSource = res.data;
                                                                        self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`, 'editorOptions', editorOption);
                                                                        self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                    }
                                                                });
                                                            } else {
                                                                if (item["dataField"] == self.curentControlData.child) {
                                                                    //item["editorOptions"].dataSource = res;
                                                                    const x = self.form.instance.itemOption(self.curentControlData.child);
                                                                    const editorOption = x.editorOptions;
                                                                    editorOption.dataSource = res.data;
                                                                    self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                    delete self.formData[self.curentControlData.child];
                                                                    self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                }
                                                            }
                                                        })
                                                    });
                                                } else {
                                                    self.serviceService.executeServiceWithParam(code.myid, self.currentReport, list_param).subscribe(async (res: any) => {
                                                        await self.form.items.forEach(item => {
                                                            // Trường hợp groupItem
                                                            if (item["itemType"] == "group") {
                                                                item['items'].forEach(_item => {
                                                                    if (_item["dataField"] == self.curentControlData.child) {
                                                                        //item["editorOptions"].dataSource = res;
                                                                        const x = self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`);
                                                                        const editorOption = x.editorOptions;
                                                                        editorOption.dataSource = res.data;
                                                                        self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`, 'editorOptions', editorOption);
                                                                        self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                    }
                                                                });
                                                            } else {
                                                                if (item["dataField"] == self.curentControlData.child) {
                                                                    //item["editorOptions"].dataSource = res;
                                                                    const x = self.form.instance.itemOption(self.curentControlData.child);
                                                                    const editorOption = x.editorOptions;
                                                                    editorOption.dataSource = res.data;
                                                                    self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                    delete self.formData[self.curentControlData.child];
                                                                    self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                }
                                                            }
                                                        })
                                                    });
                                                }
                                            }

                                        });

                                    }
                                }
                                //child
                                group_obj['items'].push(obj);
                                group_obj['items'].sort(function (a, b) { return a.order - b.order });
                            }
                            // get lookup data if datatype == true
                            else {
                                let res__2: any = await self.getAllLookUpDetail(element.lookupId)

                                var obj = {};
                                obj['label'] = { text: element.reportFilterName };
                                obj['dataField'] = element.code;
                                obj['colSpan'] = self.formColSpan;
                                obj['order'] = element.orderid;
                                obj['editorType'] = element.controlType;
                                obj['name'] = element.code;
                                obj['editorOptions'] = {
                                    width: element.width + "%",
                                    dataSource: res__2,
                                    displayExpr: 'name',
                                    valueExpr: 'code',
                                    showClearButton: true,
                                    searchEnabled: true,
                                }
                                if (element.required == true || element.required == 'True') {
                                    obj['validationRules'] = [{
                                        type: "required",
                                        message: "Không được để trống mục này."
                                    }];
                                }
                                //child
                                group_obj['items'].push(obj);
                                group_obj['items'].sort(function (a, b) { return a.order - b.order });
                            }
                        }
                    }
                    else {
                        if (element.controlType == 'dxDropDownBox') {
                            self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                                if (self.utilityId != null) {
                                    self.serviceService.executeServiceByUtilityId(element.id, self.currentReport, self.utilityId, self.Init_query_params).subscribe((res2: any) => {
                                        var obj = {};
                                        obj['label'] = { text: element.reportFilterName };
                                        obj['dataField'] = element.code;
                                        obj['colSpan'] = self.formColSpan;
                                        obj['order'] = element.orderid;
                                        obj['editorType'] = element.controlType;
                                        if (element.required == true || element.required == 'True') {
                                            obj['validationRules'] = [{
                                                type: "required",
                                                message: "Không được để trống mục này."
                                            }];
                                        }
                                        var fruits = ["Apples", "Oranges", "Lemons", "Pears", "Pineapples"];

                                        obj['editorOptions'] = {
                                            width: element.width + "%",
                                            dataSource: res2.data,
                                            displayExpr: res.colDisplay,
                                            valueExpr: res.colValue,
                                            placeholder: "Select a value...",
                                            showClearButton: true,
                                            searchEnabled: true,
                                            onValueChanged: function (e) {
                                                self.syncTreeViewSelection(e.component, e.value);
                                            },
                                            contentTemplate: function (e) {
                                                var value = e.component.option("value");
                                                var $tree = $('<div>').dxTreeView({
                                                    dataSource: e.component.option("dataSource"),
                                                    displayExpr: res.colDisplay,
                                                    dataStructure: "plain",
                                                    keyExpr: res.colValue,
                                                    parentIdExpr: res.colParent,
                                                    selectionMode: 'multiple',
                                                    selectByClick: true,
                                                    showCheckBoxesMode: "normal",
                                                    selectNodesRecursive: false,
                                                    onContentReady: function (arg) {
                                                        self.syncTreeViewSelection(arg.component, value);
                                                    },
                                                    onItemSelectionChanged: function (arg) {
                                                        self.treeView_itemSelectionChanged(e, arg)
                                                    }
                                                });
                                                return $tree;
                                            },
                                        }
                                        //child
                                        group_obj['items'].push(obj);
                                        group_obj['items'].sort(function (a, b) { return a.order - b.order });
                                    });
                                } else {
                                    self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {
                                        var obj = {};
                                        obj['label'] = { text: element.reportFilterName };
                                        obj['dataField'] = element.code;
                                        obj['colSpan'] = self.formColSpan;
                                        obj['order'] = element.orderid;
                                        obj['editorType'] = element.controlType;
                                        if (element.required == true || element.required == 'True') {
                                            obj['validationRules'] = [{
                                                type: "required",
                                                message: "Không được để trống mục này."
                                            }];
                                        }
                                        var fruits = ["Apples", "Oranges", "Lemons", "Pears", "Pineapples"];

                                        obj['editorOptions'] = {
                                            width: element.width + "%",
                                            dataSource: res2.data,
                                            displayExpr: res.colDisplay,
                                            valueExpr: res.colValue,
                                            placeholder: "Select a value...",
                                            showClearButton: true,
                                            searchEnabled: true,
                                            onValueChanged: function (e) {
                                                self.syncTreeViewSelection(e.component, e.value);
                                            },
                                            contentTemplate: function (e) {
                                                var value = e.component.option("value");
                                                var $tree = $('<div>').dxTreeView({
                                                    dataSource: e.component.option("dataSource"),
                                                    displayExpr: res.colDisplay,
                                                    dataStructure: "plain",
                                                    keyExpr: res.colValue,
                                                    parentIdExpr: res.colParent,
                                                    selectionMode: 'multiple',
                                                    selectByClick: true,
                                                    showCheckBoxesMode: "normal",
                                                    selectNodesRecursive: false,
                                                    onContentReady: function (arg) {
                                                        self.syncTreeViewSelection(arg.component, value);
                                                    },
                                                    onItemSelectionChanged: function (arg) {
                                                        self.treeView_itemSelectionChanged(e, arg)
                                                    }
                                                });
                                                return $tree;
                                            },
                                        }
                                        //child
                                        group_obj['items'].push(obj);
                                        group_obj['items'].sort(function (a, b) { return a.order - b.order });
                                    });
                                }
                            })

                        } else if (element.controlType == 'dxDateBox') {
                            var obj = {};
                            obj['label'] = { text: element.reportFilterName };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = self.formColSpan;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            obj['editorOptions'] = {
                                width: element.width + "%",
                                placeholder: "Chọn ngày...",
                                type: 'date',
                                dateSerializationFormat: "yyyy-MM-dd", // định dạng kiểu date truyền xuống
                                displayFormat: 'dd/MM/yyyy',
                                //value: (new Date()).toLocaleDateString(),
                            }

                            if (element.required == true || element.required == 'True') {
                                obj['validationRules'] = [{
                                    type: "required",
                                    message: "Không được để trống mục này."
                                }];
                            }
                            //child
                            group_obj['items'].push(obj);
                            group_obj['items'].sort(function (a, b) { return a.order - b.order });

                        } else if (element.controlType == 'treeView') {
                            self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                                if (self.utilityId != null) {
                                    self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {

                                        var obj = {};
                                        obj['label'] = { text: element.reportFilterName };
                                        obj['dataField'] = element.code;
                                        obj['colSpan'] = self.formColSpan;
                                        obj['order'] = element.orderid;
                                        obj['editorType'] = 'dxDropDownBox';
                                        if (element.required == true || element.required == 'True') {
                                            obj['validationRules'] = [{
                                                type: "required",
                                                message: "Không được để trống mục này."
                                            }];
                                        }

                                        obj['editorOptions'] = {
                                            value: this.treeBoxValue,
                                            dataSource: res2.data,
                                            displayExpr: res.colDisplay,
                                            valueExpr: res.colValue,
                                            parentIdExpr: res.colParent,
                                            dataStructure: "plain",
                                            placeholder: "Select...",
                                            showClearButton: true,
                                            searchEnabled: true,
                                            selectionMode: 'single',
                                            selectByClick: true,
                                            showCheckBoxesMode: "none",
                                            selectNodesRecursive: false,
                                            width: element.width + "%",
                                            onValueChanged: function (e) {
                                                self.syncTreeViewSelection(e.component, e.value);
                                            },
                                            onOptionChanged: function (e) {
                                                self.onTreeBoxOptionChanged(e);
                                            },
                                            contentTemplate: function (e) {
                                                var value = e.component.option("value");
                                                var $tree = $('<div>').dxTreeView({
                                                    dataSource: res2.data,
                                                    displayExpr: res.colDisplay,
                                                    dataStructure: "plain",
                                                    keyExpr: res.colValue,
                                                    parentIdExpr: res.colParent,
                                                    selectionMode: 'single',
                                                    selectByClick: true,

                                                    onContentReady: function (arg) {
                                                        self.syncTreeViewSelection(arg.component, value);
                                                    },
                                                    onItemSelectionChanged: function (arg) {
                                                        self.treeView_onItemSelectionChanged(e)
                                                    }
                                                });
                                                return $tree;
                                            },
                                        }

                                        //child
                                        group_obj['items'].push(obj);
                                        group_obj['items'].sort(function (a, b) { return a.order - b.order });
                                    });
                                } else {
                                    self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {
                                        var obj = {};
                                        obj['label'] = { text: element.reportFilterName };
                                        obj['dataField'] = 'id';
                                        obj['colSpan'] = self.formColSpan;
                                        obj['order'] = element.orderid;
                                        obj['editorType'] = 'dxDropDownBox';
                                        if (element.required == true || element.required == 'True') {
                                            obj['validationRules'] = [{
                                                type: "required",
                                                message: "Không được để trống mục này."
                                            }];
                                        }

                                        obj['editorOptions'] = {
                                            width: element.width + "%",
                                            dataSource: res2.data,
                                            displayExpr: res.colDisplay,
                                            valueExpr: res.colValue,
                                            parentIdExpr: res.colParent,
                                            dataStructure: "plain",
                                            placeholder: "Select...",
                                            showClearButton: true,
                                            searchEnabled: true,
                                            selectionMode: 'single',
                                            selectByClick: true,
                                            showCheckBoxesMode: "none",
                                            selectNodesRecursive: false,
                                            onValueChanged: function (e) {
                                                self.syncTreeViewSelection(e.component, e.value);
                                            },
                                            onOptionChanged: function (e) {
                                                self.onTreeBoxOptionChanged(e);
                                            },
                                            contentTemplate: function (e) {
                                                var value = e.component.option("value");
                                                var $tree = $('<div>').dxTreeView({
                                                    dataSource: res2.data,
                                                    displayExpr: res.colDisplay,
                                                    dataStructure: "plain",
                                                    keyExpr: res.colValue,
                                                    parentIdExpr: res.colParent,
                                                    selectionMode: 'single',
                                                    selectByClick: true,

                                                    onContentReady: function (arg) {
                                                        self.syncTreeViewSelection(arg.component, value);
                                                    },
                                                    onItemSelectionChanged: function (arg) {
                                                        self.treeView_itemSelectionChanged(e, arg)
                                                    }
                                                });
                                                return $tree;
                                            },
                                        }

                                        //child
                                        group_obj['items'].push(obj);
                                        group_obj['items'].sort(function (a, b) { return a.order - b.order });
                                    });
                                }
                            })
                        } else if (element.controlType == 'treeviewMultiple') {
                            self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                                if (self.utilityId != null) {
                                    self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {
                                        var obj = {};
                                        obj['label'] = { text: element.reportFilterName };
                                        obj['dataField'] = element.code;
                                        obj['colSpan'] = self.formColSpan;
                                        obj['order'] = element.orderid;
                                        obj['editorType'] = 'dxDropDownBox';
                                        if (element.required == true || element.required == 'True') {
                                            obj['validationRules'] = [{
                                                type: "required",
                                                message: "Không được để trống mục này."
                                            }];
                                        }
                                        var _valuedefault: any = [];
                                        console.log(typeof self.formData[element.code]);
                                        if (self.formData[element.code] != null || self.formData[element.code] != undefined) {
                                            if (!isNaN(self.formData[element.code])) {
                                                _valuedefault.push(Number(self.formData[element.code]))
                                            }
                                            else if (typeof self.formData[element.code] == 'object') {
                                                _valuedefault = self.formData[element.code];
                                            }
                                            else {
                                                var valuedefault = self.formData[element.code].split(",");
                                                valuedefault.forEach(e => {
                                                    if (!isNaN(e)) _valuedefault.push(Number(e));
                                                })
                                            }
                                        }
                                        obj['editorOptions'] = {
                                            value: _valuedefault,
                                            dataSource: res2.data,
                                            displayExpr: res.colDisplay,
                                            valueExpr: res.colValue,
                                            parentIdExpr: res.colParent,
                                            dataStructure: "plain",
                                            placeholder: "Select...",
                                            showClearButton: true,
                                            selectByClick: true,
                                            width: element.width + "%",
                                            onValueChanged: function (e) {
                                                self.syncTreeViewSelection(e.component, e.value);
                                            },
                                            // onOptionChanged: function (e) {
                                            //     self.onTreeBoxOptionChanged(e);
                                            // },
                                            contentTemplate: function (e) {
                                                var value = e.component.option("value");
                                                var $tree = $('<div>').dxTreeView({
                                                    dataSource: res2.data,
                                                    displayExpr: res.colDisplay,
                                                    dataStructure: "plain",
                                                    keyExpr: res.colValue,
                                                    searchEnabled: true,
                                                    parentIdExpr: res.colParent,
                                                    selectionMode: 'multiple',
                                                    showCheckBoxesMode: 'normal',
                                                    selectByClick: true,
                                                    searchExpr: [res.colDisplay],
                                                    onContentReady: function (arg) {
                                                        self.syncTreeViewMultipleSelection(arg.component, value);
                                                    },
                                                    onItemSelectionChanged: function (arg) {
                                                        self.treeViewMultiple_itemSelectionChanged(e, arg)
                                                    },
                                                });
                                                var treeView = $tree.dxTreeView('instance');

                                                e.component.on('valueChanged', (args) => {
                                                    const { value } = args;
                                                    self.syncTreeViewMultipleSelection(treeView, value);
                                                });

                                                return $tree;
                                            },
                                        }
                                        self.listItem.push(obj);
                                        self.listItem.sort(function (a, b) { return a.order - b.order });
                                    });
                                } else {
                                    self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {

                                        var obj = {};
                                        obj['label'] = { text: element.reportFilterName };
                                        obj['dataField'] = element.code;
                                        obj['colSpan'] = self.formColSpan;
                                        obj['order'] = element.orderid;
                                        obj['editorType'] = 'dxDropDownBox';
                                        if (element.required == true || element.required == 'True') {
                                            obj['validationRules'] = [{
                                                type: "required",
                                                message: "Không được để trống mục này."
                                            }];
                                        }
                                        var _valuedefault: any = [];
                                        console.log(typeof self.formData[element.code]);
                                        if (self.formData[element.code] != null || self.formData[element.code] != undefined) {
                                            if (!isNaN(self.formData[element.code])) {
                                                _valuedefault.push(Number(self.formData[element.code]))
                                            }
                                            else if (typeof self.formData[element.code] == 'object') {
                                                _valuedefault = self.formData[element.code];
                                            }
                                            else {
                                                var valuedefault = self.formData[element.code].split(",");
                                                valuedefault.forEach(e => {
                                                    if (!isNaN(e)) _valuedefault.push(Number(e));
                                                })
                                            }
                                        }
                                        obj['editorOptions'] = {
                                            value: _valuedefault,
                                            width: element.width + "%",
                                            dataSource: res2.data,
                                            displayExpr: res.colDisplay,
                                            valueExpr: res.colValue,
                                            placeholder: "Select....",
                                            showClearButton: true,
                                            // onValueChanged: function (e) {
                                            //     self.syncTreeViewMultipleSelection(e.component, e.value);
                                            // },
                                            contentTemplate: function (e) {
                                                var value = e.component.option("value");
                                                var $tree = $('<div>').dxTreeView({
                                                    dataSource: res2.data,
                                                    displayExpr: res.colDisplay,
                                                    dataStructure: "plain",
                                                    keyExpr: res.colValue,
                                                    parentIdExpr: res.colParent,
                                                    searchEnabled: true,
                                                    selectionMode: 'multiple',
                                                    showCheckBoxesMode: 'normal',
                                                    selectByClick: true,
                                                    onContentReady: function (arg) {
                                                        self.syncTreeViewMultipleSelection(arg.component, value);
                                                    },
                                                    onItemSelectionChanged: function (arg) {
                                                        self.treeViewMultiple_itemSelectionChanged(e, arg)

                                                    },
                                                });
                                                var treeView = $tree.dxTreeView('instance');

                                                e.component.on('valueChanged', (args) => {
                                                    const { value } = args;
                                                    self.syncTreeViewMultipleSelection(treeView, value);
                                                });

                                                return $tree;
                                            },

                                        }
                                        self.listItem.push(obj);
                                        self.listItem.sort(function (a, b) { return a.order - b.order });
                                    });
                                }
                            })
                        }
                        else {
                            var obj = {};
                            obj['label'] = { text: element.reportFilterName };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = self.formColSpan;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            obj['value'] = "";
                            obj['editorOptions'] = { width: element.width + "%" }
                            if (element.required == true || element.required == 'True') {
                                obj['validationRules'] = [{
                                    type: "required",
                                    message: "Không được để trống mục này."
                                }];
                            }
                            paramTestItem['Value'] = "";
                            //child
                            group_obj['items'].push(obj);
                            group_obj['items'].sort(function (a, b) { return a.order - b.order });
                        }
                    }
                };

                // add group
                self.listItem.push(group_obj);
                self.listItem.sort(function (a, b) { return a.order - b.order });
            };
            // none group item
            for (const element of res.data) {
                if (element.groupId != null) return;
                if (element.controlType == 'group') return;

                var data = {
                    id: null,
                    code: null,
                    value: null,
                };
                var parentCode;
                var paramTestItem = new Object();
                paramTestItem['Varible'] = element.code;
                paramTestItem['Value'] = null;
                self.paramTest.push(paramTestItem);

                if (element.controlType == 'dxSelectBox') {
                    if (element.parentComboId != 0) {
                        res.data.forEach(temp => {
                            if (temp.id == element.parentComboId && temp.controlType == 'dxSelectBox') {
                                parentCode = temp.code;
                                var parentcodeItem = new Object();
                                parentcodeItem['myid'] = element.id;
                                parentcodeItem['myCode'] = element.code;
                                parentcodeItem['parentCode'] = temp.code;
                                self.listParentCode.push(parentcodeItem);
                            }
                        })
                    }

                    if (element.dataType == 'False' || element.dataType == false) {
                        await self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                            var obj = {};
                            obj['label'] = { text: element.reportFilterName };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = self.formColSpan;
                            obj['name'] = element.code;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;

                            if (element.required == true || element.required == 'True') {
                                obj['validationRules'] = [{
                                    type: "required",
                                    message: "Không được để trống mục này."
                                }];
                            }
                            data.id = element.id;
                            data.code = !self.isNullOrUndefined(parentCode) ? parentCode : null;
                            data.value = !self.isNullOrUndefined(self.formData[parentCode]) ? self.formData[parentCode] : null;
                            obj['editorOptions'] = {
                                dataSource: {
                                    loadMode: 'raw',
                                    load: function () {
                                        const promise = new Promise((resolve, reject) => {
                                            if (self.utilityId != null) {
                                                if (!!self.formData && self.formData.constructor === Object && Object.keys(self.formData).length === 0) {
                                                    self.serviceService.executeServiceByUtilityId(element.id, self.currentReport, self.utilityId, self.Init_query_params).subscribe((res1: any) => {
                                                        resolve(res1.data);
                                                    });
                                                } else {
                                                    self.serviceService.executeServiceWithParamByUtilityId(element.id, self.currentReport, self.utilityId, self.formDataLocalStorage.concat(self.Init_query_params)).subscribe(async (res2: any) => {
                                                        resolve(res2.data);
                                                    });
                                                }

                                            } else {
                                                if (!!self.formData && self.formData.constructor === Object && Object.keys(self.formData).length === 0) {
                                                    self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res1: any) => {
                                                        resolve(res1.data);
                                                    });
                                                } else {
                                                    self.serviceService.executeServiceWithParam(element.id, self.currentReport, self.formDataLocalStorage.concat(self.Init_query_params)).subscribe(async (res2: any) => {
                                                        resolve(res2.data);
                                                    });
                                                }

                                            }
                                        });

                                        return promise;
                                    },
                                    group: element.groupField,

                                },
                                width: element.width + "%",
                                displayExpr: res.colDisplay,
                                valueExpr: res.colValue,
                                showClearButton: true,
                                searchEnabled: true,
                                grouped: element.isGrouped,
                                onValueChanged: function (key) {
                                    var listkey = Object.keys(self.formData);
                                    var control;
                                    listkey.forEach(val => {
                                        if (self.formData[val] == key.value) {
                                            control = val;
                                        }
                                    });
                                    self.listParentCode.forEach(async code => {
                                        if (control == code.parentCode) {

                                            var param = new FParameter();
                                            param.value = key.value;
                                            param.varible = code.parentCode;
                                            self.curentControlData = new Object();
                                            self.curentControlData['name'] = control;
                                            self.curentControlData['value'] = key.value;
                                            self.curentControlData['child'] = code.myCode

                                            var list_param = [];
                                            list_param.push(param);
                                            list_param = list_param.concat(self.Init_query_params);


                                            if (self.utilityId != null && param.value != null) {
                                                self.serviceService.executeServiceWithParamByUtilityId(code.myid, self.currentReport, self.utilityId, list_param).subscribe(async (res: any) => {
                                                    await self.form.items.forEach(item => {
                                                        // Trường hợp groupItem
                                                        if (item["itemType"] == "group") {
                                                            item['items'].forEach(_item => {
                                                                if (_item["dataField"] == self.curentControlData.child) {
                                                                    //item["editorOptions"].dataSource = res;
                                                                    const x = self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`);
                                                                    const editorOption = x.editorOptions;
                                                                    editorOption.dataSource = res.data;
                                                                    self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`, 'editorOptions', editorOption);
                                                                    self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                }
                                                            });
                                                        } else {
                                                            if (item["dataField"] == self.curentControlData.child) {
                                                                //item["editorOptions"].dataSource = res;
                                                                const x = self.form.instance.itemOption(self.curentControlData.child);
                                                                const editorOption = x.editorOptions;
                                                                editorOption.dataSource = res.data;
                                                                self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                delete self.formData[self.curentControlData.child];
                                                                self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                            }
                                                        }
                                                    })
                                                });
                                            } else {
                                                self.serviceService.executeServiceWithParam(code.myid, self.currentReport, list_param).subscribe(async (res: any) => {
                                                    await self.form.items.forEach(item => {
                                                        // Trường hợp groupItem
                                                        if (item["itemType"] == "group") {
                                                            item['items'].forEach(_item => {
                                                                if (_item["dataField"] == self.curentControlData.child) {
                                                                    //item["editorOptions"].dataSource = res;
                                                                    const x = self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`);
                                                                    const editorOption = x.editorOptions;
                                                                    editorOption.dataSource = res.data;
                                                                    self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`, 'editorOptions', editorOption);
                                                                    self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                }
                                                            });
                                                        } else {
                                                            if (item["dataField"] == self.curentControlData.child) {
                                                                //item["editorOptions"].dataSource = res;
                                                                const x = self.form.instance.itemOption(self.curentControlData.child);
                                                                const editorOption = x.editorOptions;
                                                                editorOption.dataSource = res.data;
                                                                self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                delete self.formData[self.curentControlData.child];
                                                                self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                            }
                                                        }
                                                    })
                                                });
                                            }
                                        }

                                    });
                                }
                            }
                            self.listItem.push(obj);
                            self.listItem.sort(function (a, b) { return a.order - b.order });
                        });
                    }
                    else {
                        await self.lookupService.getAllLookupDetail(element.lookupId).subscribe((res: any) => {
                            var obj = {};
                            obj['label'] = { text: element.reportFilterName };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = self.formColSpan;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            obj['name'] = element.code;
                            obj['editorOptions'] = {
                                dataSource: res,
                                displayExpr: 'name',
                                valueExpr: 'code',
                                showClearButton: true,
                                searchEnabled: true,
                                width: element.width + "%",

                            }
                            if (element.required == true || element.required == 'True') {
                                obj['validationRules'] = [{
                                    type: "required",
                                    message: "Không được để trống mục này."
                                }];
                            }
                            self.listItem.push(obj);
                            self.listItem.sort(function (a, b) { return a.order - b.order });
                        });

                    }
                }
                else if (element.controlType == 'captchaBox') {
                    var group = {};
                    if (element.colSpan == null) {
                        group['colSpan'] = 1;
                    } else {
                        group['colSpan'] = element.colSpan;
                    }

                    group['colCount'] = 2;
                    group['order'] = element.orderid;
                    group['itemType'] = 'group';
                    //group_obj['visible'] = !group_element.disable // hide ; show
                    group['items'] = [];

                    self.captchaBoxDataField = element.code
                    var obj = {};
                    obj['label'] = { text: element.reportFilterName };
                    obj['dataField'] = element.code;
                    obj['colSpan'] = element.colSpan;
                    obj['editorType'] = 'dxTextBox';
                    obj['value'] = "";
                    obj['editorOptions'] = {
                        onValueChanged: function (e) {
                            if (e.value != self.code) {
                                self.createCaptcha();
                                self.formData[element.code] = ''
                            }
                        }
                    }
                    obj['validationRules'] = [
                        {
                            type: "required",
                            message: "Mã xác thực không hợp lệ."
                        },
                        {
                            type: "compare",
                            ignoreEmptyValue: true,
                            comparisonTarget: self.validateCaptcha,
                            message: "Mã xác thực chưa chính xác!"
                        }];



                    var captcha_obj = {
                        colSpan: 1,
                        template: function () {
                            var t = $("<div style='justify-content: flex-start;display:flex'>");
                            $("<div id='captcha'>  </div>").appendTo(t);
                            $("<div>").dxButton({
                                icon: "refresh",
                                onClick: function () {
                                    self.createCaptcha();
                                }
                            }).appendTo(t);
                            return t;
                        }

                    }
                    group['items'].push(obj);
                    group['items'].push(captcha_obj);
                    self.listItem.push(group);
                    self.listItem.sort(function (a, b) { return a.order - b.order });
                }
                // tag box // update
                else if (element.controlType == 'dxTagBox') {
                    //check child tagbox

                    if (element.parentComboId != 0 && (element.isLoadMultipleWay == null || element.isLoadMultipleWay == false)) {
                        res.data.forEach(temp => {
                            if (temp.id == element.parentComboId && temp.controlType == 'dxTagBox') {
                                parentCode = temp.code;
                                var parentcodeItem = new Object();
                                parentcodeItem['myid'] = element.id;
                                parentcodeItem['myCode'] = element.code;
                                parentcodeItem['parentCode'] = temp.code;
                                self.listParentCode.push(parentcodeItem);
                            }
                        })
                    }
                    if (element.parentComboId != 0 && element.isLoadMultipleWay == true) {
                        res.data.forEach(temp => {
                            if (temp.id == element.parentComboId && temp.controlType == 'dxTagBox') {
                                parentCode = temp.code;
                                var parentcodeItem = new Object();
                                parentcodeItem['myid'] = element.id;
                                parentcodeItem['myCode'] = element.code;
                                parentcodeItem['parentCode'] = temp.code;
                                parentcodeItem['isLoadMultipleWayParent'] = temp.isLoadMultipleWay;
                                self.listParentCode.push(parentcodeItem);

                            }
                        })
                    }
                    if (element.serviceId == null && element.lookupId == null) {
                        var obj = {};
                        obj['label'] = { text: element.reportFilterName };
                        obj['dataField'] = element.code;
                        obj['colSpan'] = self.formColSpan;
                        obj['order'] = element.orderid;
                        obj['editorType'] = element.controlType;
                        obj['name'] = element.code;
                        obj['editorOptions'] = {
                            width: element.width + "%",
                            searchEnabled: true,
                            acceptCustomValue: true,
                            noDataText: "",
                        }
                        if (element.required == true || element.required == 'True') {
                            obj['validationRules'] = [{
                                type: "required",
                                message: "Không được để trống mục này."
                            }];
                        }
                        self.listItem.push(obj);
                        self.listItem.sort(function (a, b) { return a.order - b.order });
                    }
                    else {
                        //get service data if dataType == false
                        if (element.dataType == 'False' || element.dataType == false) {
                            await self.serviceService.getById(element.serviceId).subscribe((res: any) => {

                                if (self.formData[element.code] != undefined) {
                                    if (Array.isArray(self.formData[element.code]) == true) {
                                        var value = self.formData[element.code].map(Number).filter(Boolean)
                                    } else {
                                        var value = self.formData[element.code].split(",").map(Number).filter(Boolean)
                                    }

                                }
                                var obj = {};
                                
                                obj['label'] = { text: element.reportFilterName };
                                obj['dataField'] = element.code;
                                obj['colSpan'] = self.formColSpan;
                                obj['name'] = element.code;
                                obj['order'] = element.orderid;
                                obj['editorType'] = element.controlType;
                                if (element.required == true || element.required == 'True') {
                                    obj['validationRules'] = [{
                                        type: "required",
                                        message: "Không được để trống mục này."
                                    }];
                                }
                                data.id = element.id;
                                data.code = !self.isNullOrUndefined(parentCode) ? parentCode : null;
                                data.value = !self.isNullOrUndefined(self.formData[parentCode]) ? self.formData[parentCode] : null;
                                obj['editorOptions'] = {
                                    dataSource: {
                                        loadMode: 'raw',
                                        load: function () {
                                            const promise = new Promise((resolve, reject) => {
                                                if (self.utilityId != null) {

                                                    self.serviceService.executeServiceByUtilityId(element.id, self.currentReport, self.utilityId, self.Init_query_params).subscribe((res1: any) => {
                                                        resolve(res1.data);
                                                    });
                                                } else {
                                                    self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res1: any) => {
                                                        resolve(res1.data);
                                                    });
                                                }
                                            });

                                            return promise;
                                        }
                                    },
                                    width: element.width + "%",
                                    displayExpr: res.colDisplay,
                                    valueExpr: res.colValue,
                                    value: value,
                                    showClearButton: true,
                                    searchEnabled: true,
                                    onValueChanged: function (key) {
                                        if (key.value == undefined) {
                                            key.value = []
                                        }
                                        var listkey = Object.keys(self.formData);
                                        var control;
                                        listkey.forEach(val => {
                                            if (key.value.length > 0) {
                                                if (self.formData[val] == key.value) {
                                                    control = val;
                                                }
                                            }
                                        });
                                        self.listParentCode.forEach(async code => {
                                            if (control == code.parentCode) {

                                                var param = new FParameter();
                                                param.value = "" + key.value[0];
                                                for (var i = 1; i < key.value.length; i++) {
                                                    param.value += "," + key.value[i];
                                                }
                                                param.varible = code.parentCode;
                                                self.curentControlData = new Object();
                                                self.curentControlData['name'] = control;
                                                self.curentControlData['value'] = key.value.length > 0 ? key.value : [];
                                                self.curentControlData['child'] = code.myCode;
                                                self.curentControlData['isLoadMultipleWay'] = code.isLoadMultipleWayParent;
                                                var list_param = [];
                                                list_param.push(param);
                                                list_param = list_param.concat(self.Init_query_params);
                                                if (self.utilityId != null) {
                                                    self.serviceService.executeServiceWithParamByUtilityId(code.myid, self.currentReport, self.utilityId, list_param).subscribe(async (res: any) => {
                                                        await self.form.items.forEach(item => {
                                                            // Trường hợp groupItem
                                                            if (item["itemType"] == "group") {
                                                                item['items'].forEach(_item => {
                                                                    if (_item["dataField"] == self.curentControlData.child) {
                                                                        //item["editorOptions"].dataSource = res;
                                                                        const x = self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`);
                                                                        const editorOption = x.editorOptions;
                                                                        editorOption.dataSource = res.data;
                                                                        self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`, 'editorOptions', editorOption);
                                                                        self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                    }
                                                                });
                                                            } else {
                                                                if (item["dataField"] == self.curentControlData.child) {
                                                                    //item["editorOptions"].dataSource = res;
                                                                    const x = self.form.instance.itemOption(self.curentControlData.child);

                                                                    const editorOption = x.editorOptions;
                                                                    editorOption.dataSource = res.data;

                                                                    if (self.curentControlData.isLoadMultipleWay == false || self.curentControlData.isLoadMultipleWay == null) {
                                                                        self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                        delete self.formData[self.curentControlData.child];
                                                                        self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                    } else {
                                                                        const y = self.form.instance.itemOption(self.curentControlData.name);
                                                                        y.editorOptions.value = key.value;
                                                                        if (editorOption.value == undefined || editorOption.value.length == 0) {
                                                                            self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);

                                                                        }

                                                                    }
                                                                }
                                                            }
                                                        })
                                                    });
                                                } else {
                                                    self.serviceService.executeServiceWithParam(code.myid, self.currentReport, list_param).subscribe(async (res: any) => {
                                                        await self.form.items.forEach(item => {
                                                            // Trường hợp groupItem
                                                            if (item["itemType"] == "group") {
                                                                item['items'].forEach(_item => {
                                                                    if (_item["dataField"] == self.curentControlData.child) {
                                                                        //item["editorOptions"].dataSource = res;
                                                                        const x = self.form.instance.itemOption(self.curentControlData.child);
                                                                        const editorOption = x.editorOptions;
                                                                        editorOption.dataSource = res.data;
                                                                        self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                        self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                    }
                                                                });
                                                            } else {
                                                                if (item["dataField"] == self.curentControlData.child) {
                                                                    //item["editorOptions"].dataSource = res;
                                                                    const x = self.form.instance.itemOption(self.curentControlData.child);
                                                                    const y = self.form.instance.itemOption(self.curentControlData.name);
                                                                    const editorOption = x.editorOptions;
                                                                    editorOption.dataSource = res.data;
                                                                    if (self.curentControlData.isLoadMultipleWay == false || self.curentControlData.isLoadMultipleWay == null) {
                                                                        self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                        delete self.formData[self.curentControlData.child];
                                                                        self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                    } else {
                                                                        if (key.value.length > 0) y.editorOptions.value = key.value;
                                                                        if ((editorOption.value == undefined || editorOption.value.length == 0)) {
                                                                            if (key.value.length > 0) {
                                                                                editorOption.dataSource = res.data;
                                                                                self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                            }

                                                                        }
                                                                        else if ((y.editorOptions.value == undefined || y.editorOptions.value.length == 0) && editorOption.value.length > 0) {
                                                                            y.editorOptions.dataSource = res.data;
                                                                            self.form.instance.itemOption(self.curentControlData.name, 'editorOptions', y.editorOptions);
                                                                        }

                                                                    }
                                                                }
                                                            }
                                                        })
                                                    });
                                                }
                                            }

                                        });



                                    },
                                    onSelectionChanged: function (key) {
                                        var listkey = Object.keys(self.formData);
                                        var control;
                                        var valueDeleted: any = []
                                        var valueAdded: any = []

                                        listkey.forEach(val => {
                                            if (val != "") {
                                                if (key.removedItems.length > 0) {
                                                    let y = self.form.instance.itemOption(val)
                                                    if (y.editorOptions.value == undefined) y.editorOptions.value = []
                                                    if (y.editorType == "dxTagBox") {
                                                        for (let j = 0; j < key.removedItems.length; j++) {

                                                            for (let i = 0; i < y.editorOptions.value.length; i++) {

                                                                if (key.removedItems[j].Id == y.editorOptions.value[i]) {
                                                                    control = val
                                                                    y.editorOptions.value.splice(i, 1)
                                                                    valueDeleted = y.editorOptions.value
                                                                }

                                                            }
                                                        }

                                                    }

                                                }
                                                else if (key.addedItems.length > 0) {
                                                    let y = self.form.instance.itemOption(val)
                                                    if (y.editorType == "dxTagBox") {
                                                        for (let j = 0; j < key.addedItems.length; j++) {
                                                            for (let i = 0; i < valueAdded.length; i) {
                                                                if (valueAdded[i] != key.addedItems[j].Id) {
                                                                    valueAdded.push(key.addedItems[j].Id);
                                                                }
                                                            }

                                                        }

                                                    }
                                                }
                                            }

                                        });
                                        self.listParentCode.forEach(async code => {
                                            if (code.isLoadMultipleWayParent == true) {
                                                self.filterIdLoadMultipleWay = code.myid;
                                                if (control == code.parentCode) {
                                                    var param = new FParameter();

                                                    if (valueDeleted.length > 0) {
                                                        if (valueDeleted[0] == undefined) {
                                                            param.value = "";
                                                        } else {
                                                            param.value = "" + valueDeleted[0];
                                                        }
                                                        for (var i = 1; i < valueDeleted.length; i++) {
                                                            param.value += "," + valueDeleted[i];
                                                        }
                                                        param.varible = code.parentCode;
                                                    }
                                                    else if (valueDeleted.length == 0) {
                                                        let valueItem = self.form.instance.itemOption(code.myCode)

                                                        if (valueItem.editorOptions.value[0] == undefined) {
                                                            param.value = "";
                                                        } else {
                                                            param.value = "" + valueItem.editorOptions.value[0];
                                                        }
                                                        for (var i = 1; i < valueItem.editorOptions.value.length; i++) {
                                                            param.value += "," + valueItem.editorOptions.value[0];
                                                        }
                                                        if (valueItem.editorOptions.value.length == 0) {
                                                            self.filterIdLoadMultipleWay = code.myid
                                                            param.varible = code.parentCode;
                                                        } else {
                                                            self.filterIdLoadMultipleWay = self.listParentCode.find(x => x.parentCode == code.myCode).myid
                                                            param.varible = code.myCode;
                                                        }
                                                    }

                                                    if (valueAdded.length > 0) {
                                                        if (valueAdded[0] == undefined) {
                                                            param.value = "";
                                                        } else {
                                                            param.value = "" + valueAdded[0];
                                                        }
                                                        for (var i = 1; i < valueAdded.length; i++) {
                                                            param.value += "," + valueAdded[i];
                                                        }
                                                        param.varible = code.parentCode;
                                                    }

                                                    self.curentControlData = new Object();
                                                    self.curentControlData['name'] = control;
                                                    // self.curentControlData['value'] = valueDeleted.length>0?valueDeleted:valueAdded;
                                                    if (valueDeleted.length > 0) {
                                                        self.curentControlData['value'] = valueDeleted;
                                                    }
                                                    else if (valueAdded.length > 0) {
                                                        self.curentControlData['value'] = valueAdded;
                                                    }

                                                    else if (valueAdded.length == 0 && valueDeleted.length == 0) {
                                                        self.curentControlData['value'] == "";
                                                    }
                                                    self.curentControlData['child'] = code.myCode
                                                    self.curentControlData['isLoadMultipleWay'] = code.isLoadMultipleWayParent;
                                                    var list_param = [];
                                                    list_param.push(param);
                                                    list_param = list_param.concat(self.Init_query_params);
                                                    if (self.utilityId != null) {
                                                        self.serviceService.executeServiceWithParamByUtilityId(self.filterIdLoadMultipleWay, self.currentReport, self.utilityId, list_param).subscribe(async (res: any) => {
                                                            await self.form.items.forEach(item => {
                                                                // Trường hợp groupItem
                                                                if (item["itemType"] == "group") {
                                                                    item['items'].forEach(_item => {
                                                                        if (_item["dataField"] == self.curentControlData.child) {
                                                                            //item["editorOptions"].dataSource = res;
                                                                            const x = self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`);
                                                                            const editorOption = x.editorOptions;
                                                                            editorOption.dataSource = res.data;
                                                                            self.form.instance.itemOption(`${item["name"]}.${self.curentControlData.child}`, 'editorOptions', editorOption);
                                                                            self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                        }
                                                                    });
                                                                } else {
                                                                    if (item["dataField"] == self.curentControlData.child) {
                                                                        //item["editorOptions"].dataSource = res;
                                                                        const x = self.form.instance.itemOption(self.curentControlData.child);
                                                                        const y = self.form.instance.itemOption(self.curentControlData.name);
                                                                        const editorOption = x.editorOptions;

                                                                        if (self.curentControlData.isLoadMultipleWay == false || self.curentControlData.isLoadMultipleWay == null) {
                                                                            self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                            delete self.formData[self.curentControlData.child];
                                                                            self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                        } else {
                                                                            if (valueAdded.length > 0) y.editorOptions.value = valueAdded;
                                                                            if ((editorOption.value == undefined || editorOption.value.length == 0) && (y.editorOptions.value == undefined || y.editorOptions.value.length == 0)) {
                                                                                if (valueAdded.length > 0) {
                                                                                    editorOption.dataSource = res.data;
                                                                                    self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                                }

                                                                            }
                                                                            else if ((y.editorOptions.value == undefined || y.editorOptions.value.length == 0) && editorOption.value.length > 0) {
                                                                                y.editorOptions.dataSource = res.data;
                                                                                self.form.instance.itemOption(self.curentControlData.name, 'editorOptions', y.editorOptions);
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            })
                                                        });
                                                    } else {
                                                        self.serviceService.executeServiceWithParam(self.filterIdLoadMultipleWay, self.currentReport, list_param).subscribe(async (res: any) => {
                                                            await self.form.items.forEach(item => {
                                                                // Trường hợp groupItem
                                                                if (item["itemType"] == "group") {
                                                                    item['items'].forEach(_item => {
                                                                        if (_item["dataField"] == self.curentControlData.child) {
                                                                            //item["editorOptions"].dataSource = res;
                                                                            const x = self.form.instance.itemOption(self.curentControlData.child);
                                                                            const editorOption = x.editorOptions;
                                                                            editorOption.dataSource = res.data;
                                                                            self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                            self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                        }
                                                                    });
                                                                } else {
                                                                    if (item["dataField"] == self.curentControlData.child) {
                                                                        //item["editorOptions"].dataSource = res;
                                                                        //item["editorOptions"].dataSource = res;
                                                                        const x = self.form.instance.itemOption(self.curentControlData.child);
                                                                        const y = self.form.instance.itemOption(self.curentControlData.name);
                                                                        const editorOption = x.editorOptions;
                                                                        if (self.curentControlData.isLoadMultipleWay == false || self.curentControlData.isLoadMultipleWay == null) {
                                                                            self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                            delete self.formData[self.curentControlData.child];
                                                                            self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                                        } else {
                                                                            if (valueAdded.length > 0) y.editorOptions.value = valueAdded;
                                                                            if ((editorOption.value == undefined || editorOption.value.length == 0) && (y.editorOptions.value == undefined || y.editorOptions.value.length == 0)) {
                                                                                if (valueAdded.length > 0) {
                                                                                    editorOption.dataSource = res.data;
                                                                                    self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                                }
                                                                                if (valueDeleted.length == 0) {
                                                                                    editorOption.dataSource = res.data;
                                                                                    self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                                }

                                                                            }
                                                                            else if ((y.editorOptions.value == undefined || y.editorOptions.value.length == 0) && editorOption.value.length > 0) {
                                                                                y.editorOptions.dataSource = res.data;
                                                                                self.form.instance.itemOption(self.curentControlData.name, 'editorOptions', y.editorOptions);
                                                                            }
                                                                            else if ((y.editorOptions.value == undefined || y.editorOptions.value.length == 0) && editorOption.value.length == 0) {
                                                                                y.editorOptions.dataSource = res.data;
                                                                                self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                                            }

                                                                        }
                                                                    }
                                                                }
                                                            })
                                                        });
                                                    }
                                                }
                                            }


                                        });
                                    }
                                }
                                self.listItem.push(obj);
                                self.listItem.sort(function (a, b) { return a.order - b.order });
                            });
                        }
                        // get lookup data if datatype == true
                        else {
                            await self.lookupService.getAllLookupDetail(element.lookupId).subscribe((res: any) => {
                                var obj = {};
                                obj['label'] = { text: element.reportFilterName };
                                obj['dataField'] = element.code;
                                obj['colSpan'] = self.formColSpan;
                                obj['order'] = element.orderid;
                                obj['editorType'] = element.controlType;
                                obj['name'] = element.code;
                                obj['editorOptions'] = {
                                    width: element.width + "%",
                                    dataSource: res,
                                    displayExpr: 'name',
                                    valueExpr: 'code',
                                    showClearButton: true,
                                    searchEnabled: true,
                                }
                                if (element.required == true || element.required == 'True') {
                                    obj['validationRules'] = [{
                                        type: "required",
                                        message: "Không được để trống mục này."
                                    }];
                                }
                                self.listItem.push(obj);
                                self.listItem.sort(function (a, b) { return a.order - b.order });
                            });
                        }
                    }
                }
                else {
                    if (element.controlType == 'dxDropDownBox') {
                        self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                            if (self.utilityId != null) {
                                self.serviceService.executeServiceByUtilityId(element.id, self.currentReport, self.utilityId, self.Init_query_params).subscribe((res2: any) => {
                                    var obj = {};
                                    obj['label'] = { text: element.reportFilterName };
                                    obj['dataField'] = element.code;
                                    obj['colSpan'] = self.formColSpan;
                                    obj['order'] = element.orderid;
                                    obj['editorType'] = element.controlType;
                                    if (element.required == true || element.required == 'True') {
                                        obj['validationRules'] = [{
                                            type: "required",
                                            message: "Không được để trống mục này."
                                        }];
                                    }
                                    var fruits = ["Apples", "Oranges", "Lemons", "Pears", "Pineapples"];

                                    obj['editorOptions'] = {
                                        width: element.width + "%",
                                        dataSource: res2.data,
                                        displayExpr: res.colDisplay,
                                        valueExpr: res.colValue,
                                        placeholder: "Select a value...",
                                        showClearButton: true,
                                        searchEnabled: true,
                                        onValueChanged: function (e) {
                                            self.syncTreeViewSelection(e.component, e.value);
                                        },
                                        contentTemplate: function (e) {
                                            var value = e.component.option("value");
                                            var $tree = $('<div>').dxTreeView({
                                                dataSource: e.component.option("dataSource"),
                                                displayExpr: res.colDisplay,
                                                dataStructure: "plain",
                                                keyExpr: res.colValue,
                                                parentIdExpr: res.colParent,
                                                selectionMode: 'multiple',
                                                selectByClick: true,
                                                showCheckBoxesMode: "normal",
                                                selectNodesRecursive: false,
                                                onContentReady: function (arg) {
                                                    self.syncTreeViewSelection(arg.component, value);
                                                },
                                                onItemSelectionChanged: function (arg) {
                                                    self.treeView_itemSelectionChanged(e, arg)
                                                }
                                            });
                                            return $tree;
                                        },
                                    }
                                    self.listItem.push(obj);
                                    self.listItem.sort(function (a, b) { return a.order - b.order });
                                });
                            } else {
                                self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {
                                    var obj = {};
                                    obj['label'] = { text: element.reportFilterName };
                                    obj['dataField'] = element.code;
                                    obj['colSpan'] = self.formColSpan;
                                    obj['order'] = element.orderid;
                                    obj['editorType'] = element.controlType;
                                    if (element.required == true || element.required == 'True') {
                                        obj['validationRules'] = [{
                                            type: "required",
                                            message: "Không được để trống mục này."
                                        }];
                                    }
                                    var fruits = ["Apples", "Oranges", "Lemons", "Pears", "Pineapples"];

                                    obj['editorOptions'] = {
                                        width: element.width + "%",
                                        dataSource: res2.data,
                                        displayExpr: res.colDisplay,
                                        valueExpr: res.colValue,
                                        placeholder: "Select a value...",
                                        showClearButton: true,
                                        searchEnabled: true,
                                        onValueChanged: function (e) {
                                            self.syncTreeViewSelection(e.component, e.value);
                                        },
                                        contentTemplate: function (e) {
                                            var value = e.component.option("value");
                                            var $tree = $('<div>').dxTreeView({
                                                dataSource: e.component.option("dataSource"),
                                                displayExpr: res.colDisplay,
                                                dataStructure: "plain",
                                                keyExpr: res.colValue,
                                                parentIdExpr: res.colParent,
                                                selectionMode: 'multiple',
                                                selectByClick: true,
                                                showCheckBoxesMode: "normal",
                                                selectNodesRecursive: false,
                                                onContentReady: function (arg) {
                                                    self.syncTreeViewSelection(arg.component, value);
                                                },
                                                onItemSelectionChanged: function (arg) {
                                                    self.treeView_itemSelectionChanged(e, arg)
                                                }
                                            });
                                            return $tree;
                                        },
                                    }
                                    self.listItem.push(obj);
                                    self.listItem.sort(function (a, b) { return a.order - b.order });
                                });
                            }
                        })

                    } else if (element.controlType == 'dxDateBox') {
                        var obj = {};
                        obj['label'] = { text: element.reportFilterName };
                        obj['dataField'] = element.code;
                        obj['colSpan'] = self.formColSpan;
                        obj['order'] = element.orderid;
                        obj['editorType'] = element.controlType;
                        obj['editorOptions'] = {
                            width: element.width + "%",
                            placeholder: "Chọn ngày...",
                            type: 'date',
                            dateSerializationFormat: "yyyy-MM-dd", // định dạng kiểu date truyền xuống
                            displayFormat: 'dd/MM/yyyy',
                            //value: (new Date()).toLocaleDateString(),
                        }

                        if (element.required == true || element.required == 'True') {
                            obj['validationRules'] = [{
                                type: "required",
                                message: "Không được để trống mục này."
                            }];
                        }
                        self.listItem.push(obj);
                        self.listItem.sort(function (a, b) { return a.order - b.order });

                    } else if (element.controlType == 'treeView') {
                        self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                            if (self.utilityId != null) {
                                self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {
                                    var obj = {};
                                    obj['label'] = { text: element.reportFilterName };
                                    obj['dataField'] = element.code;
                                    obj['colSpan'] = self.formColSpan;
                                    obj['order'] = element.orderid;
                                    obj['editorType'] = 'dxDropDownBox';
                                    if (element.required == true || element.required == 'True') {
                                        obj['validationRules'] = [{
                                            type: "required",
                                            message: "Không được để trống mục này."
                                        }];
                                    }
                                    obj['editorOptions'] = {
                                        value: this.treeBoxValue,
                                        dataSource: res2.data,
                                        displayExpr: res.colDisplay,
                                        valueExpr: res.colValue,
                                        parentIdExpr: res.colParent,
                                        dataStructure: "plain",
                                        placeholder: "Select...",
                                        showClearButton: true,
                                        selectionMode: 'single',
                                        selectByClick: true,
                                        showCheckBoxesMode: "none",
                                        width: element.width + "%",
                                        onValueChanged: function (e) {
                                            self.syncTreeViewSelection(e.component, e.value);
                                        },
                                        onOptionChanged: function (e) {
                                            self.onTreeBoxOptionChanged(e);
                                        },
                                        contentTemplate: function (e) {
                                            var value = e.component.option("value");
                                            var $tree = $('<div>').dxTreeView({
                                                dataSource: res2.data,
                                                displayExpr: res.colDisplay,
                                                dataStructure: "plain",
                                                keyExpr: res.colValue,
                                                searchEnabled: true,
                                                parentIdExpr: res.colParent,
                                                selectionMode: 'single',
                                                selectByClick: true,
                                                searchExpr: [res.colDisplay],
                                                onContentReady: function (arg) {
                                                    self.syncTreeViewSelection(arg.component, value);
                                                },
                                                onItemSelectionChanged: function (arg) {
                                                    //self.treeView_onItemSelectionChanged(e)
                                                    self.treeView_itemSelectionChanged(e, arg)
                                                }
                                            });

                                            return $tree;
                                        },
                                    }
                                    self.listItem.push(obj);
                                    self.listItem.sort(function (a, b) { return a.order - b.order });
                                });
                            } else {
                                self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {

                                    var obj = {};
                                    obj['label'] = { text: element.reportFilterName };
                                    obj['dataField'] = element.code;
                                    obj['colSpan'] = self.formColSpan;
                                    obj['order'] = element.orderid;
                                    obj['editorType'] = 'dxDropDownBox';
                                    if (element.required == true || element.required == 'True') {
                                        obj['validationRules'] = [{
                                            type: "required",
                                            message: "Không được để trống mục này."
                                        }];
                                    }

                                    obj['editorOptions'] = {
                                        width: element.width + "%",
                                        dataSource: res2.data,
                                        displayExpr: res.colDisplay,
                                        valueExpr: res.colValue,
                                        placeholder: "Select...",
                                        showClearButton: true,

                                        onValueChanged: function (e) {
                                            self.syncTreeViewSelection(e.component, e.value);
                                        },
                                        onOptionChanged: function (e) {
                                            self.onTreeBoxOptionChanged(e);
                                        },
                                        contentTemplate: function (e) {
                                            var value = e.component.option("value");
                                            var $tree = $('<div>').dxTreeView({
                                                dataSource: res2.data,
                                                displayExpr: res.colDisplay,
                                                dataStructure: "plain",
                                                keyExpr: res.colValue,
                                                parentIdExpr: res.colParent,
                                                selectionMode: 'single',
                                                selectByClick: true,
                                                onContentReady: function (arg) {
                                                    self.syncTreeViewSelection(arg.component, value);
                                                },
                                                onItemSelectionChanged: function (arg) {
                                                    self.treeView_itemSelectionChanged(e, arg)
                                                }
                                            });
                                            return $tree;
                                        },

                                    }
                                    self.listItem.push(obj);
                                    self.listItem.sort(function (a, b) { return a.order - b.order });
                                });
                            }
                        })
                    }
                    else if (element.controlType == 'treeviewMultiple') {
                        self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                            if (self.utilityId != null) {
                                self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {
                                    var obj = {};
                                    obj['label'] = { text: element.reportFilterName };
                                    obj['dataField'] = element.code;
                                    obj['colSpan'] = self.formColSpan;
                                    obj['order'] = element.orderid;
                                    obj['editorType'] = 'dxDropDownBox';
                                    if (element.required == true || element.required == 'True') {
                                        obj['validationRules'] = [{
                                            type: "required",
                                            message: "Không được để trống mục này."
                                        }];
                                    }
                                    var _valuedefault: any = [];
                                    console.log(typeof self.formData[element.code]);
                                    if (self.formData[element.code] != null || self.formData[element.code] != undefined) {
                                        if (!isNaN(self.formData[element.code])) {
                                            _valuedefault.push(Number(self.formData[element.code]))
                                        }
                                        else if (typeof self.formData[element.code] == 'object') {
                                            _valuedefault = self.formData[element.code];
                                        }
                                        else {
                                            var valuedefault = self.formData[element.code].split(",");
                                            valuedefault.forEach(e => {
                                                if (!isNaN(e)) _valuedefault.push(Number(e));
                                            })
                                        }
                                    }
                                    obj['editorOptions'] = {
                                        value: _valuedefault,
                                        dataSource: res2.data,
                                        displayExpr: res.colDisplay,
                                        valueExpr: res.colValue,
                                        parentIdExpr: res.colParent,
                                        dataStructure: "plain",
                                        placeholder: "Select...",
                                        showClearButton: true,
                                        selectByClick: true,
                                        width: element.width + "%",
                                        onValueChanged: function (e) {
                                            self.syncTreeViewSelection(e.component, e.value);
                                        },
                                        // onOptionChanged: function (e) {
                                        //     self.onTreeBoxOptionChanged(e);
                                        // },
                                        contentTemplate: function (e) {
                                            var value = e.component.option("value");
                                            var $tree = $('<div>').dxTreeView({
                                                dataSource: res2.data,
                                                displayExpr: res.colDisplay,
                                                dataStructure: "plain",
                                                keyExpr: res.colValue,
                                                searchEnabled: true,
                                                parentIdExpr: res.colParent,
                                                selectionMode: 'multiple',
                                                showCheckBoxesMode: 'normal',
                                                selectByClick: true,
                                                searchExpr: [res.colDisplay],
                                                onContentReady: function (arg) {
                                                    self.syncTreeViewMultipleSelection(arg.component, value);
                                                },
                                                onItemSelectionChanged: function (arg) {
                                                    self.treeViewMultiple_itemSelectionChanged(e, arg)
                                                },
                                            });
                                            var treeView = $tree.dxTreeView('instance');

                                            e.component.on('valueChanged', (args) => {
                                                const { value } = args;
                                                self.syncTreeViewMultipleSelection(treeView, value);
                                            });

                                            return $tree;
                                        },
                                    }
                                    self.listItem.push(obj);
                                    self.listItem.sort(function (a, b) { return a.order - b.order });
                                });
                            } else {
                                self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {
                                    var obj = {};
                                    obj['label'] = { text: element.reportFilterName };
                                    obj['dataField'] = element.code;
                                    obj['colSpan'] = self.formColSpan;
                                    obj['order'] = element.orderid;
                                    obj['editorType'] = 'dxDropDownBox';
                                    if (element.required == true || element.required == 'True') {
                                        obj['validationRules'] = [{
                                            type: "required",
                                            message: "Không được để trống mục này."
                                        }];
                                    }
                                    var _valuedefault: any = [];
                                    console.log(typeof self.formData[element.code]);
                                    if (self.formData[element.code] != null || self.formData[element.code] != undefined) {
                                        if (!isNaN(self.formData[element.code])) {
                                            _valuedefault.push(Number(self.formData[element.code]))
                                        }
                                        else if (typeof self.formData[element.code] == 'object') {
                                            _valuedefault = self.formData[element.code];
                                        }
                                        else {
                                            var valuedefault = self.formData[element.code].split(",");
                                            valuedefault.forEach(e => {
                                                if (!isNaN(e)) _valuedefault.push(Number(e));
                                            })
                                        }
                                    }
                                    obj['editorOptions'] = {
                                        value: _valuedefault,
                                        width: element.width + "%",
                                        dataSource: res2.data,
                                        displayExpr: res.colDisplay,
                                        valueExpr: res.colValue,
                                        placeholder: "Select....",
                                        showClearButton: true,
                                        // onValueChanged: function (e) {
                                        //     self.syncTreeViewMultipleSelection(e.component, e.value);
                                        // },
                                        contentTemplate: function (e) {
                                            var value = e.component.option("value");
                                            var $tree = $('<div>').dxTreeView({
                                                dataSource: res2.data,
                                                displayExpr: res.colDisplay,
                                                dataStructure: "plain",
                                                keyExpr: res.colValue,
                                                searchEnabled: true,
                                                parentIdExpr: res.colParent,
                                                selectionMode: 'multiple',
                                                showCheckBoxesMode: 'normal',
                                                selectByClick: true,
                                                onContentReady: function (arg) {
                                                    self.syncTreeViewMultipleSelection(arg.component, value);
                                                },
                                                onItemSelectionChanged: function (arg) {
                                                    self.treeViewMultiple_itemSelectionChanged(e, arg)

                                                },
                                            });
                                            var treeView = $tree.dxTreeView('instance');

                                            e.component.on('valueChanged', (args) => {
                                                const { value } = args;
                                                self.syncTreeViewMultipleSelection(treeView, value);
                                            });

                                            return $tree;
                                        },

                                    }
                                    self.listItem.push(obj);
                                    self.listItem.sort(function (a, b) { return a.order - b.order });
                                });
                            }
                        })
                    }
                    // else if (element.controlType == 'dataGrid') {
                    //     self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                    //         if (self.utilityId != null) {
                    //             self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {
                    //                 var obj = {};
                    //                 obj['label'] = { text: element.reportFilterName };
                    //                 obj['dataField'] = element.code;
                    //                 obj['colSpan'] = self.formColSpan;
                    //                 obj['order'] = element.orderid;
                    //                 obj['editorType'] = 'dxDropDownBox';
                    //                 if (element.required == true || element.required == 'True') {
                    //                     obj['validationRules'] = [{
                    //                         type: "required",
                    //                         message: "Không được để trống mục này."
                    //                     }];
                    //                 }
                    //                 obj['editorOptions'] = {
                    //                     value: 1,
                    //                     valueExpr: res.colValue,
                    //                     deferRendering: false,
                    //                     placeholder: "Select a value...",
                    //                     displayExpr: res.colDisplay,
                    //                     // displayExpr(item) {
                    //                     //     return item && `${item.TenKho} <${item.DiaChi}>`;
                    //                     // },
                    //                     showClearButton: true,
                    //                     dataSource: res2.data,
                    //                     contentTemplate(e) {
                    //                         const value = e.component.option("value");
                    //                         const $grid = $('<div>').dxDataGrid({
                    //                             dataSource: res2.data,
                    //                             columns: ['TenKho', 'DiaChi'],
                    //                             hoverStateEnabled: true,
                    //                             paging: { enabled: true, pageSize: 10 },
                    //                             filterRow: { visible: true },
                    //                             scrolling: { mode: 'virtual' },
                    //                             selection: { mode: 'single' },
                    //                             selectedRowKeys: value,
                    //                             height: 330,
                    //                             onSelectionChanged(selectedItems) {
                    //                                 const keys = selectedItems.selectedRowKeys;
                    //                                 const hasSelection = keys.length;

                    //                                 e.component.option("value", keys[0]);
                    //                                 console.log("value", keys[0]);
                    //                             },
                    //                         });
                    //                         let dataGrid = $grid.dxDataGrid('instance');

                    //                         e.component.on('valueChanged', (args) => {
                    //                             dataGrid.selectRows(args.value, false);
                    //                             e.component.close();
                    //                         });

                    //                         return $grid;
                    //                     },
                    //                 }
                    //                 self.listItem.push(obj);
                    //                 self.listItem.sort(function (a, b) { return a.order - b.order });
                    //             });
                    //         } else {
                    //             self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {

                    //                 var obj = {};
                    //                 obj['label'] = { text: element.reportFilterName };
                    //                 obj['dataField'] = 'id';
                    //                 obj['colSpan'] = self.formColSpan;
                    //                 obj['order'] = element.orderid;
                    //                 obj['editorType'] = 'dxDropDownBox';
                    //                 if (element.required == true || element.required == 'True') {
                    //                     obj['validationRules'] = [{
                    //                         type: "required",
                    //                         message: "Không được để trống mục này."
                    //                     }];
                    //                 }

                    //                 obj['editorOptions'] = {
                    //                     value: this.dataBoxValue,
                    //                     width: element.width + "%",
                    //                     dataSource: res2.data,
                    //                     displayExpr: res.colDisplay,
                    //                     valueExpr: res.colValue,
                    //                     placeholder: "Select...",
                    //                     showClearButton: true,

                    //                     contentTemplate: function (e) {
                    //                         var value = e.component.option("value");
                    //                         var $grid = $('<div>').dxDataGrid({
                    //                             dataSource: res2.data,
                    //                             columns: "['MaKho','TenKho','DiaChi']",
                    //                             selection: "{ mode: 'multiple' }",
                    //                             hoverStateEnabled: "true",
                    //                             paging: "{ enabled: true, pageSize: 10 }",
                    //                             filterRow: "{ visible: true }",
                    //                             scrolling: "{ mode: 'virtual' }",
                    //                             height: "345"
                    //                         });
                    //                         console.log($grid)
                    //                         return $grid;
                    //                     },

                    //                 }
                    //                 self.listItem.push(obj);
                    //                 self.listItem.sort(function (a, b) { return a.order - b.order });
                    //             });
                    //         }
                    //     })
                    // }
                    else {
                        var obj = {};
                        obj['label'] = { text: element.reportFilterName };
                        obj['dataField'] = element.code;
                        obj['colSpan'] = self.formColSpan;
                        obj['order'] = element.orderid;
                        obj['editorType'] = element.controlType;
                        obj['value'] = "";
                        obj['editorOptions'] = { width: element.width + "%" }
                        if (element.required == true || element.required == 'True') {
                            obj['validationRules'] = [{
                                type: "required",
                                message: "Không được để trống mục này."
                            }];
                        }
                        paramTestItem['Value'] = "";
                        self.listItem.push(obj);
                        self.listItem.sort(function (a, b) { return a.order - b.order });
                    }
                }
            };
            
            if (!self.disableSearch) {
                self.viewreport();
            }
        })
       
    }

    async viewreport(isShowNotify: any = true) {
        const self = this;

        const promise = await new Promise((resolve, reject) => {
            this.click_One = false;

            this.isLoadPanelVisible = true;

            self.setLocalStorage();
            self.LabelCode = self.activeRouter.snapshot.params['labelCode'];
            if (self.labelActionCode != undefined) {
                self.LabelCode = self.labelActionCode;
            }

            let uID = 0;

            if (abp.session.userId != null && abp.session.userId != undefined) {
                uID = abp.session.userId;
            } else if (self.userId_query != undefined) {
                uID = self.userId_query;
            }

            self._viewUtilityService.getActionButtonByLabelCode(uID, self.LabelCode).subscribe((res: any) => {
                self._label_Action = res.data;
                self.actions = [];
                self.actions2 = [];
                self.actions3 = [];
                if (res.data.length > 0) {
                    res.data.forEach(item => {
                        if (item.Type == "SHOWCOMPONENT" && item.Value == "PREVIEW") {
                            if (item.Height != null && item.Height != 0 && item.Width != null && item.Width != 0) {
                                self.popupImgHeight = item.Height;
                                self.popupImgWidth = item.Width;
                            }
                            else {
                                self.popupImgHeight = 700;
                                self.popupImgWidth = 1000;
                            }
                        }
                        else if (item.Type == "SHOWCOMPONENT" && item.Value == "PREVIEW_LIST") {
                            if (item.Height != null && item.Height != 0 && item.Width != null && item.Width != 0) {
                                self.popupListHeight = item.Height;
                                self.popupListWidth = item.Width;
                            }
                            else {
                                self.popupListHeight = 700;
                                self.popupListWidth = 1000;
                            }
                        } else if (item.Type == "POPUPFORM") {
                            if (item.Height != null && item.Height != 0 && item.Width != null && item.Width != 0) {
                                self.popupFormHeight = item.Height;
                                self.popupFormWidth = item.Width;
                            }
                            else {
                                self.popupFormHeight = 700;
                                self.popupFormWidth = 1000;
                            }
                        } else if (item.Type == "SHOWCOMPONENT" && item.Value != "PREVIEW" && item.Value != "PREVIEW_LIST") {
                            if (item.Height != null && item.Height != 0 && item.Width != null && item.Width != 0) {
                                self.popupHeight = item.Height;
                                self.popupWidth = item.Width;
                            }
                            else {
                                self.popupHeight = 700;
                                self.popupWidth = 1000;
                            }
                        } else if (item.Type == "IMPORT") {
                            if (item.FileTypeAccept != null) self.fileTypeAccept = item.FileTypeAccept;
                            self.urlImportFile = item.UrlImportFile
                        } else if (item.IsPopupConfirm == true) {

                            self.isPopupConfirm = item.IsPopupConfirm;
                            self.popupConfirmTitle = item.ConfirmTitle;
                            self.popupConfirmText = item.ConfirmText;
                            self.popupConfirmButton = item.ConfirmButtonText;
                        } else if (item.IsCheckSamePopup == true) {
                            self.isCheckSame = item.IsCheckSamePopup;
                            self.checkSameText = item.CheckSamePopupText;
                            self.checkSameButton = item.CheckSamePopupButton;
                        }
                        self.onShowActionButton(item);
                    });
                    window.localStorage.setItem('actions', JSON.stringify(self.actions));
                }
            });
            $("#dx-form").dxForm("option", "formData", self.formData);
            if (!isNullOrUndefined(self.formData)) {
                var listkey = Object.keys(self.formData);
                listkey.forEach(element => {
                    var index;
                    index = self.paramTest.findIndex(x => x.Varible == element);
                    if (index != undefined && index != null && index >= 0) {
                        if (!isNullOrUndefined(self.formData[element])) {
                            self.paramTest[index].Value = self.formData[element].toString();
                        } else {
                            self.paramTest[index].Value = null;
                        }
                    }
                })
            }
            if (self.displayType == 0) {
                self.pieChartVisibility = "hidden"
                self.tableVisibility = "visible";
                self.tableDisplay = "inline-block"
                self.barChartDisplay = "none"
                self.barChartVisibility = "hidden"
                self.pieChartDisplay = "none"
                self.pieChartVisibility = "hidden"
                self.hinChartDisplay = "none"
                self.hinChartVisibility = "hidden"
                self.ganttChartDisplay = "none"
                self.ganttChartVisibility = "hidden"
                self.taskBoardDisplay = "none";
                self.taskBoardVisibility = "hidden";
                self.treeListDisplay = "none";
                self.treeListVisibility = "hidden";
                self.createColumn();

                self.dataSourceTest3 = {
                    loadMode: 'raw',
                    load: function () {
                        const promise = new Promise((resolve, reject) => {

                            self.iconClass = "fa fa-spinner fa-spin";
                            self.disabled_btn_search = true;

                            if (self.utilityId != null || self.utilityId != undefined) {
                                if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
                                    self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
                                }
                            }
                            if (self.Init_query_params.length > 0) {
                                self.Init_query_params.forEach(element => {
                                    if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                                        self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                                    }
                                });
                            }
                            self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res: any) => {

                                self.iconClass = "fa fa-eye";
                                self.disabled_btn_search = false;

                                if (res.isSucceeded == true) {

                                    res.data.forEach(element => {
                                        self.isTopHidden = element.isTopHidden != undefined ? element.isTopHidden : 0;
                                        element.actions = element.actions != undefined ? JSON.parse(element.actions) : self.actions;

                                        if (element.__label_action != null || element.__label_action != undefined) {
                                            self.onHiddenActionButton(element)
                                        }
                                        if (element.__label_action_code != null || element.__label_action_code != undefined) {
                                            self.onHiddenActionButton(element)
                                        }
                                    });

                                    resolve(res.data);
                                    self.totalCount = res.data.length;

                                    $("#dx-grid").dxDataGrid("option", "dataSource", res.data);
                                    self.parseHtmlContent();
                                    // self.sortByLocation()
                                    if (isShowNotify)
                                        abp.notify.success('Thành công!', undefined, { "position": "top-end" });

                                    self.isLoadPanelVisible = false;
                                }
                                else {
                                    abp.notify.error('Lỗi', undefined, { "position": "top-end" });
                                    resolve(res.data);
                                    self.isLoadPanelVisible = false;
                                }
                            }, (err) => {
                                self.iconClass = "fa fa-eye";
                                self.disabled_btn_search = false;
                            });
                        });
                        return promise;
                    },
                    byKey: function (key, extra) {
                        const promise = new Promise((resolve) => {
                            if (self.utilityId != null || self.utilityId != undefined) {
                                if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
                                    self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
                                }
                            }
                            if (self.Init_query_params.length > 0) {
                                self.Init_query_params.forEach(element => {
                                    if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                                        self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                                    }
                                });
                            }

                            self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res: any) => {
                                if (res.isSucceeded == true) {
                                    resolve(res.data);
                                    self.totalCount = res.data.length;
                                    if (isShowNotify)
                                        abp.notify.success('Thành công!', undefined, { "position": "top-end" });

                                    self.isLoadPanelVisible = false;
                                }
                                else {
                                    abp.notify.error('Lỗi', undefined, { "position": "top-end" });
                                    resolve(res.data);
                                    self.isLoadPanelVisible = false;
                                }
                            });
                        });
                        return promise;
                    }
                };
                if (this.data && this.data.instance) {
                    this.data.instance.refresh();
                };
            } else if (self.displayType == 3) {
                self.pieChartVisibility = "visible"
                self.tableVisibility = "hidden"
                self.tableDisplay = "none"
                self.barChartDisplay = "none"
                self.barChartVisibility = "hidden"
                self.pieChartDisplay = "inline-block"
                self.pieChartVisibility = "visible"
                self.hinChartDisplay = "none"
                self.hinChartVisibility = "hidden"
                self.ganttChartDisplay = "none"
                self.ganttChartVisibility = "hidden"
                self.taskBoardDisplay = "none";
                self.taskBoardVisibility = "hidden";
                self.treeListDisplay = "none";
                self.treeListVisibility = "hidden";
                self.chartService.getByReportID(self.currentReport).subscribe((res1: any) => {
                    self.ArgumentField = res1.argumentField;
                    self.ValueField = res1.valueField;
                    self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res2: any) => {
                        self.pieChartDataSource = res2.data;
                    });
                })
            } else if (self.displayType == 2) {

                self.tableVisibility = "hidden"
                self.tableDisplay = "none"
                self.barChartDisplay = "inline-block"
                self.barChartVisibility = "visible"
                self.pieChartDisplay = "none"
                self.pieChartVisibility = "hidden"
                self.hinChartDisplay = "none"
                self.hinChartVisibility = "hidden"
                self.ganttChartDisplay = "none"
                self.ganttChartVisibility = "hidden"
                self.taskBoardDisplay = "none";
                self.taskBoardVisibility = "hidden";
                self.treeListDisplay = "none";
                self.treeListVisibility = "hidden";
                self.chartService.getByReportID(self.currentReport).subscribe((res1: any) => {
                    self.ArgumentField = res1.argumentField;
                    self.ValueField = res1.valueField;
                    self.seriesField = res1.seriesField;
                    self.displayMode = res1.displayMode == undefined || res1.displayMode == null ? "rotate" : res1.displayMode;
                    self.rotationAngle = res1.rotationAngle == undefined || res1.rotationAngle == null ? -45 : res1.rotationAngle;
                    self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res2: any) => {
                        self.barChartDataSource = res2.data;
                    });
                })
            }
            else if (self.displayType == 12) {
                self.ganttChartDisplay = "inline-block"
                self.ganttChartVisibility = "visible"
                self.pieChartVisibility = "hidden"
                self.tableVisibility = "hidden";
                self.tableDisplay = "none"
                self.barChartDisplay = "none"
                self.barChartVisibility = "hidden"
                self.pieChartDisplay = "none"
                self.pieChartVisibility = "hidden"
                self.hinChartDisplay = "none"
                self.hinChartVisibility = "hidden"
                self.taskBoardDisplay = "none";
                self.taskBoardVisibility = "hidden";
                self.treeListDisplay = "none";
                self.treeListVisibility = "hidden";
                self.ganttChartConfig();


            } else if (self.displayType == 13) {
                self.treeListDisplay = "inline-block";
                self.treeListVisibility = "visible";
                self.pieChartVisibility = "hidden"
                self.tableVisibility = "hidden";
                self.tableDisplay = "none"
                self.barChartDisplay = "none"
                self.barChartVisibility = "hidden"
                self.pieChartDisplay = "none"
                self.pieChartVisibility = "hidden"
                self.hinChartDisplay = "none"
                self.hinChartVisibility = "hidden"
                self.taskBoardDisplay = "none";
                self.taskBoardVisibility = "hidden";
                self.ganttChartDisplay = "none"
                self.ganttChartVisibility = "hidden"
                self.createColumn();
                self.dataSourceTest3 = {
                    loadMode: 'raw',
                    load: function () {
                        const promise = new Promise((resolve, reject) => {

                            self.iconClass = "fa fa-spinner fa-spin";
                            self.disabled_btn_search = true;
                            if (self.utilityId != null || self.utilityId != undefined) {
                                if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
                                    self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
                                }
                            }
                            if (self.Init_query_params.length > 0) {
                                self.Init_query_params.forEach(element => {
                                    if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                                        self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                                    }
                                });
                            }
                            self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res: any) => {

                                self.iconClass = "fa fa-eye";
                                self.disabled_btn_search = false;

                                if (res.isSucceeded == true) {
                                    res.data.forEach(element => {
                                        self.isTopHidden = element.isTopHidden != undefined ? element.isTopHidden : 0;
                                        element.actions = element.actions != undefined ? JSON.parse(element.actions) : self.actions;

                                        if (element.__label_action != null || element.__label_action != undefined) {
                                            self.onHiddenActionButton(element)
                                        }
                                        if (element.__label_action_code != null || element.__label_action_code != undefined) {
                                            self.onHiddenActionButton(element)
                                        }
                                    });

                                    resolve(res.data);
                                    self.totalCount = res.data.length;

                                    $("#dx-tree-list").dxTreeList("option", "dataSource", res.data);
                                    self.parseHtmlTreeListContent();

                                    if (isShowNotify)
                                        abp.notify.success('Thành công!', undefined, { "position": "top-end" });

                                    self.isLoadPanelVisible = false;
                                }
                                else {
                                    abp.notify.error('Lỗi', undefined, { "position": "top-end" });
                                    resolve(res.data);
                                    self.isLoadPanelVisible = false;
                                }
                            }, (err) => {
                                self.iconClass = "fa fa-eye";
                                self.disabled_btn_search = false;
                            });
                        });
                        return promise;
                    },
                    byKey: function (key, extra) {
                        const promise = new Promise((resolve) => {
                            if (self.utilityId != null || self.utilityId != undefined) {
                                if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
                                    self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
                                }
                            }
                            if (self.Init_query_params.length > 0) {
                                self.Init_query_params.forEach(element => {
                                    if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                                        self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                                    }
                                });
                            }

                            self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res: any) => {
                                if (res.isSucceeded == true) {
                                    resolve(res.data);
                                    self.totalCount = res.data.length;
                                    if (isShowNotify)
                                        abp.notify.success('Thành công!', undefined, { "position": "top-end" });

                                    self.isLoadPanelVisible = false;
                                }
                                else {
                                    abp.notify.error('Lỗi', undefined, { "position": "top-end" });
                                    resolve(res.data);
                                    self.isLoadPanelVisible = false;
                                }
                            });
                        });
                        return promise;
                    }
                };
                if (this.treeList && this.treeList.instance) {
                    this.treeList.instance.refresh();
                    this.treeList.instance.clearSelection()
                };
            }
            else {
                self.tableVisibility = "hidden"
                self.tableDisplay = "none"
                self.barChartDisplay = "hidden"
                self.barChartVisibility = "none"
                self.pieChartDisplay = "none"
                self.pieChartVisibility = "hidden"
                self.hinChartDisplay = "inline-block"
                self.hinChartVisibility = "visible"
                self.ganttChartDisplay = "none"
                self.ganttChartVisibility = "hidden"
                self.taskBoardDisplay = "none";
                self.taskBoardVisibility = "hidden";
                if (self.displayType == 7) {//line chart
                    this.chartType = 'line';
                }
                if (self.displayType == 1) {//line chart
                    this.chartType = 'bar';
                }
                self.chartService.getByReportID(self.currentReport).subscribe((res1: any) => {
                    self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res2: any) => {
                        if (res2.isSucceeded && res2.data.length > 0) {
                            this.loadHinChart(self.displayType, res2.data);
                        }
                    });
                })
            }
            if (this.data && this.data.instance) {
                this.data.instance.refresh();
                this.data.instance.clearSelection()
            };

            if (this.gantt && this.gantt.instance) {

                this.gantt.instance.repaint();

            };
            this.formData[this.captchaBoxDataField] = ''
        });
        return promise;
    }

    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    sortByLocation() {
        const self = this;
        var obj = {}
        var array = []
        console.log(self.columnData)
        if (self.columnData != undefined) {
            console.log(self.columnData)
            for (let i = 0; i < self.columnData.length; i++) {
                if (self.columnData[i].sortByColumn != null) {
                    let code = self.columnData.find(x => x.code == self.columnData[i].sortByColumn)
                    console.log(code)
                    for (let j = 0; j < self.column.length; j++) {
                        console.log(self.column)
                        if (self.column[j].dataField == self.columnData[i].code) {

                            console.log(self.column[j])
                            console.log(array)
                            if (array.length == 0) {
                                array.push(self.column[j]);
                                $("#dx-grid").dxDataGrid("instance").columnOption(array[0].dataField, {
                                    sortOrder: 'desc',
                                    calculateSortValue: code.code


                                })
                            }
                            // else {
                            //     for(let y = 0; y<=array.length;y++) {


                            //         if(array[y].dataField != self.column[j]) {
                            //             array.push(self.column[j]);
                            //         }

                            //         $("#dx-grid").dxDataGrid("instance").columnOption(array[y].dataField, {
                            //             calculateSortValue: function(rowData) {
                            //                 console.log(rowData)
                            //             },
                            //             sortOrder: 'asc'
                            //         })
                            //         // array[y].calculateSortValue = code.code
                            //         // array[y].sortOrder = 'asc';

                            //     }
                            // }


                            self.column.splice(j, 1)
                            self.column.push(array[0])

                        }
                    }
                    // console.log($("#dx-grid").dxDataGrid("instance"))
                    // console.log($("#dx-grid").dxDataGrid("instance").option("dataSource"))
                    // $("#dx-grid").dxDataGrid({
                    //     columns: [
                    //         {
                    //             dataField: self.columnData[i].code,
                    //             calculateSortValue: "Id"
                    //         }
                    //     ]
                    // })
                }

            }
            $("#dx-grid").dxDataGrid("option", "columns", self.column)
            console.log($("#dx-grid").dxDataGrid("option"))
        }


    }

    back() {
        if (!this.click_One) {
            this.formData = {};
            this.pageSize = 50;
            this.pageIndex = 0;
            this.pageSizeTreeList = 50;
            this.pageIndexTreeList = 0;
            this.setLocalStorage();
            this.click_One = true;
        }
    }
    createColumn() {
        const self = this;
        self.column = [];
        self.export_column = [];
        self.columnLink = [];
        self.sumary = {
            groupItems: [],
            totalItems: []
        }
        if (self.utilityId != null || self.utilityId != undefined) {
            if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
                self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
            }
        }
        if (self.Init_query_params.length > 0) {
            self.Init_query_params.forEach(element => {
                if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                    self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                }
            });
        }

        if (self.typeget == 1) {
            self.columnService.postByReportId(self.currentReport, self.paramTest).subscribe((res: any) => {
                if (res.length > 0) {
                    self.formatColumn(res);
                    self.columnData = res;
                    self.buttonStatusExportVisible = true;
                }
                else {
                    self.columnService.getColumn(self.currentReport, self.sqlContent).subscribe((res1: any) => {

                        self.formatColumn(res1.data);
                        self.buttonStatusExportVisible = true;
                    })
                }
            });
        } else {
            if (self.typeget == 2) {
                this.loadColumns();
                this.loadColumns();
            }
            else {
                self.formId = self.formData.FormId;
                this.loadColumns();
            }
        }
        self.getColumnForCheckExport(self.currentReport);


    }

    formatColumn(res: any[]) {
        const self = this;
        var cols = [];
        var exp_cols = [];
        for (var i = 0; i < res.length; i++) {
            var col = {};
            var exp_col = {};

            if ((res[i].isDisplay == true || res[i].isDisplay == 'True') && (res[i].parentCode == undefined || res[i].parentCode == "")) {

                // STT
                if (window.outerWidth < 500 && res[i].name == "STT") continue;
                col['caption'] = res[i].name != undefined && res[i].name != '' ? res[i].name : res[i].code;
                col['dataField'] = res[i].code;
                col['orderId'] = res[i].colNum;
                col['fixed'] = res[i].isFreePane;
                col['visible'] = res[i].visible;
                if (res[i].sortByColumn != null && res[i].sortByColumn != '') {
                    let sortType = res.find(x => x.code == res[i].sortByColumn).groupSort
                    self.checkSortByColumn.push(res[i].sortByColumn)
                    col['sortOrder'] = sortType;
                    col['allowSorting'] = res[i].groupSort != '' && res[i].groupSort != undefined ? true : false;
                } else {
                    col['sortOrder'] = res[i].groupSort;
                    col['allowSorting'] = res[i].groupSort != '' && res[i].groupSort != undefined ? true : false;

                }
                if (res[i].isParent == true || res[i].isParent == 'True') {
                    var c_cols = [];
                    var exp_c_cols = [];
                    var child_col = res.filter(c => c.parentCode == res[i].code).sort((c1, c2) => c1.colNum - c2.colNum);
                    child_col.forEach(element => {
                        var c_col = {};
                        if (element.isDisplay == true || element.isDisplay == 'True') {
                            c_col['caption'] = element.name != undefined && element.name != '' ? element.name : element.code;
                            c_col['dataField'] = element.code;
                            c_col['orderId'] = element.colNum;
                            c_col['visible'] = element.visible;
                            if (element.sortByColumn != null && element.sortByColumn != '') {
                                let sortType = child_col.find(x => x.code == element.sortByColumn).groupSort
                                c_col['sortOrder'] = sortType;
                                c_col['allowSorting'] = sortType != '' && sortType != undefined ? true : false;
                            } else {
                                c_col['sortOrder'] = element.groupSort;
                                c_col['allowSorting'] = element.groupSort != '' && element.groupSort != undefined ? true : false;
                            }

                            if (element.width != 0 && !isNullOrUndefined(element.width) && element.width != '')
                                c_col['width'] = element.width;
                            if (!isNullOrUndefined(element.textAlign))
                                c_col['alignment'] = element.textAlign;
                            c_col['groupIndex'] = element.groupLevel;
                            if (element.type == 'int' || element.type == 'long')
                                c_col['dataType'] = 'number';
                            else
                                c_col['dataType'] = element.type;
                            c_col['format'] = element.format;
                            if (element.isSum == true || element.isSum == 'True') {
                                var sumitem = {};
                                sumitem['c_column'] = element.code;
                                sumitem['summaryType'] = 'sum';
                                sumitem['showInc_column'] = element.code;
                                sumitem['displayFormat'] = "Tổng: {0}";
                                sumitem['valueFormat'] = element.format;
                                self.sumary.totalItems.push(sumitem);
                                var groupSumitem = {};
                                groupSumitem['c_column'] = element.code;
                                groupSumitem['summaryType'] = 'sum';
                                groupSumitem['displayFormat'] = "Tổng: {0}";
                                groupSumitem['showInc_column'] = element.code;
                                groupSumitem['valueFormat'] = element.format;
                                self.sumary.groupItems.push(groupSumitem);
                            }

                            if (c_col['dataType'] == "link") {
                                self.columnLink.push(c_col['dataField']);
                                c_col["encodeHtml"] = false;
                            };

                            if (c_col['dataType'] == 'attachment') {
                                c_col['cellTemplate'] = "attachmentCellTemplate";
                            }
                            if (element.isExport == true || element.isExport == 'True') {
                                exp_c_cols.push(c_col);
                            }

                            c_cols.push(c_col);

                        }
                    });
                    exp_cols = exp_cols.concat(exp_c_cols)

                    col['columns'] = c_cols;
                }
                else {
                    if (res[i].width != 0 && !isNullOrUndefined(res[i].width) && res[i].width != '')
                        col['width'] = res[i].width;
                    if (!isNullOrUndefined(res[i].textAlign))
                        col['alignment'] = res[i].textAlign;
                    col['groupIndex'] = res[i].groupLevel;
                    if (res[i].type == 'int' || res[i].type == 'long')
                        col['dataType'] = 'number';
                    else
                        col['dataType'] = res[i].type;
                    col['format'] = res[i].format;
                    if (res[i].isSum == true || res[i].isSum == 'True') {
                        var sumitem = {};
                        sumitem['column'] = res[i].code;
                        sumitem['summaryType'] = 'sum';
                        sumitem['showInColumn'] = res[i].code;
                        sumitem['displayFormat'] = "Tổng: {0}";
                        sumitem['valueFormat'] = res[i].format;
                        self.sumary.totalItems.push(sumitem);
                        var groupSumitem = {};
                        groupSumitem['column'] = res[i].code;
                        groupSumitem['summaryType'] = 'sum';
                        groupSumitem['displayFormat'] = "Tổng: {0}";
                        groupSumitem['showInColumn'] = res[i].code;
                        groupSumitem['valueFormat'] = res[i].format;
                        self.sumary.groupItems.push(groupSumitem);
                    }

                    if (col['dataType'] == "link") {
                        self.columnLink.push(col['dataField']);
                        col["encodeHtml"] = false;
                    };

                    if (col['dataType'] == 'attachment') {
                        col['cellTemplate'] = "attachmentCellTemplate";
                    }
                    if (res[i].isExport == true || res[i].isExport == 'True') {
                        exp_col = col;
                        exp_cols.push(exp_col);
                    }
                }
                cols.push(col);

            }
        }

        if (!self.disableHandleCollumn) {
            var colXL = {};
            colXL['caption'] = "Xử lý";
            colXL['cellTemplate'] = "customTemplate";
            colXL['alignment'] = "center";
            colXL['width'] = "90px";
            colXL['orderId'] = 2;
            colXL['allowExporting'] = false;
            colXL['fixed'] = true;
            cols.push(colXL);
        }

        cols.sort(function (a, b) { return a.orderId - b.orderId });
        exp_cols.sort(function (a, b) { return a.orderId - b.orderId });
        self.column = cols;
        self.export_column = exp_cols;
        $("#dx-tree-list").dxTreeList("option", "columns", cols);
        $("#dx-grid").dxDataGrid("option", "columns", self.column);
        $("#dx-grid").dxDataGrid("option", "summary", this.sumary);
    }

    isNullOrUndefined(obj: any) {
        return typeof obj === "undefined" || obj === null;
    }

    syncTreeViewSelection(treeView: any, value: any) {
        const component = (treeView && treeView.component);
        if (!component) { return; }
        if (!value) {
            component.unselectAll();
            return;
        }

        value.forEach(function (key) {
            component.selectItem(value);
        });
    }
    syncTreeViewMultipleSelection(treeView: any, value: any) {
        if (!value) {
            treeView.unselectAll();
            return;
        }

        value.forEach(function (key) {
            treeView.selectItem(key);
        });
    }
    treeViewMultiple_itemSelectionChanged(e, arg) {
        var value = arg.component.getSelectedNodesKeys();
        e.component.option("value", value);

    }

    treeView_onItemSelectionChanged(e) {
        this.treeBoxValue = e.component.getSelectedNodesKeys();
    }

    treeView_itemSelectionChanged(e, arg) {
        var value = arg.component.getSelectedNodesKeys();
        e.component.option("value", value[0]);
    }
    onTreeBoxOptionChanged(e) {
        if (e.name === 'value') {
            this.isTreeBoxOpened = false;
            e.component.option("opened", this.isTreeBoxOpened);
        }
    }
    private flatColumnsToTree(columns: DxColumn[], parentId: any) {
        const results: DxColumn[] = [];

        columns.forEach(column => {
            if (column.parentId == parentId) {
                const children = this.flatColumnsToTree(columns, column.id);

                if (children.length) {
                    column.columns = children;
                }

                results.push(column);
            }
        });

        return results;
    }

    loadColumns() {
        if (this.formId) {
            // this.formColumnService.canEnterColumnByFormId(this.formId).subscribe(res => {
            //     // this.isColumnAutoWidth = form.isColumnAutoWidth;
            //     this.column = this.flatColumnsToTree(this.configColumns(res.data), '0');
            // });
        }
    }

    private configColumns(columns: any[]) {
        const results: DxColumn[] = [];

        columns.forEach(column => {
            const newColumn = new DxColumn();
            newColumn.dataField = `Col_${column.columnId}`;
            newColumn.caption = column.columnName;
            newColumn.visible = !(column.columnId === 105 || column.columnId === 107);
            newColumn.alignment = column.alignment;

            if (this.isColumnAutoWidth) {
                if (column.width) {
                    newColumn.minWidth = column.width;
                }

            } else {
                newColumn.fixed = column.isFixed == 'True';
                if (column.width) {
                    newColumn.width = column.width;
                }
            }
            if (column.dataType === 'number') {
                newColumn.format = this.formatService.formatNumber;
            }

            newColumn.allowEditing = column.isBalance === 'False' || column.isValue === 'True';
            newColumn.id = column.columnId;
            newColumn.parentId = column.parentId;
            newColumn.dataType = column.dataType;
            newColumn.isParent = column.isParent;



            if (column.orderId === '2' || column.orderId === 2) { // Section column
                newColumn.cellTemplate = (container, options) => {
                    const depth = parseInt(options.data.Depth, 10);
                    $(container).append($('<p style="padding-left: ' + (depth * 15) + 'px; margin-bottom: 0">' + options.value + '</p>'));
                };
            }

            newColumn.columns = [];

            results.push(newColumn);
        });

        return results;
    }

    stripHtml(html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || html;
    }

    parseHtmlContent() {
        let data = $("#dx-grid").dxDataGrid("instance").option("dataSource");

        let dataClones = [];

        const self = this;

        for (var i = 0; i < data.length; i++) {

            let dataClone = {};

            jQuery.each(data[i], function (j, val) {
                dataClone[j] = self.stripHtml(val);
            });

            dataClones.push(dataClone);

        }

        $("#dx-grid").dxDataGrid("instance").option("dataSource", dataClones);
    }

    parseHtmlTreeListContent() {
        let data = $("#dx-tree-list").dxTreeList("option", "dataSource");
        let dataClones = [];

        const self = this;

        for (var i = 0; i < data.length; i++) {

            let dataClone = {};

            jQuery.each(data[i], function (j, val) {
                dataClone[j] = self.stripHtml(val);
            });

            dataClones.push(dataClone);

        }

        // $("#dx-grid").dxDataGrid("instance").option("dataSource", dataClones);
        $("#dx-tree-list").dxTreeList("option", "dataSource", dataClones);
    }

    onToolbarPreparing = async (e) => {
        const self = this;

        e.toolbarOptions.items.unshift({

            location: 'before',
            template: 'totalGroupCount'
        }, {
            location: 'after',
            widget: 'dxButton',
            options: {
                icon: 'docxfile',
                visible: true,
                onClick: self.exportWordClick.bind(this)
            }
        }
            , {
                location: 'after',
                widget: 'dxDropDownButton',
                options: {
                    icon: 'xlsxfile',
                    visible: true,
                    items: self.exportButtonOptions,
                    keyExpr: "id",
                    displayExpr: "name",
                    dropDownOptions: { width: '120' },
                    onItemClick: (e) => {
                        if (e.itemData.id == 1) {
                            self.isExportDefault = true;
                            self.data.instance.option('export', {
                                fileName: self.reportName
                            })
                            if (self.notChooseColumnToExport == true) {
                                self.export_column_default = JSON.parse(JSON.stringify(self.column));
                            }
                            self.data.instance.option('columns', self.export_column_default);
                            self.data.instance.exportToExcel(false);
                        } else {

                            self.isExportDefault = false;
                            self.data.instance.exportToExcel(true);
                        }

                    }
                }
            }
        );
    }

    onToolbarPreparingTreeList = async (e) => {
        const self = this;
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        }
        );
    }



    exportWordClick() {
        const self = this;
        var blob = null;
        $.ajax({
            url: AppConsts.fileServerUrl + "/ExportFile/DRGetTemplateWordFile?reportID=" + self.currentReport,
            type: 'GET',
            contentType: "application/json",
            success: function (data) {
                self.http.post(AppConsts.fileServerUrl + '/api/services/app/DRViewer/ExportWord?id=' + self.currentReport + '&templatePathFile=' + data.result, self.paramTest).subscribe(res => {
                    if (res['result']['data'].length > 0) {
                        var rootUrl = AppConsts.fileServerUrl;
                        var link = rootUrl + res['result']['data']

                        window.open(link, '_blank');
                    }
                })
            }
        });

    }

    async onShowActionButton(item) {
        var self = this;
        // switch (item.IsTop) {
        //     case '1':
        //         self.action_button.create = true;
        //         self.actions2.push(item);
        //         break;
        //     default:
        //         self.actions.push(item);
        //         break;
        // }
        if (item.IsTop && item.IsGroup) {
            self.action_button.create = true;
            self.actions3.push(item);
        }
        else if (item.IsTop) {
            self.action_button.create = true;
            self.actions2.push(item);

        } else {
            self.actions.push(item);
            self._actionsbackup.push(item);
        }
        self.contextMenuItems = self.getContextMenuItems();
    }

    onHiddenActionButton(item) {
        const self = this;
        if (self.actions2.length > 0) {
            if (self.isTopHidden == 1) {
                if (item.__label_action == '' || item.__label_action_code == '') {
                    self.actions = []
                    return self.actions2 = [];
                } else if (item.__label_action != '') {
                    let itemParsed = JSON.parse(item.__label_action);
                    let list_action = [];
                    let list_action2 = [];
                    self.actions.forEach(action => {
                        itemParsed.forEach(active_action => {
                            if (action.ActionId == active_action || action.Code == active_action)
                                list_action.push(action);

                        });
                    });
                    self.actions = list_action;
                    ///IsTop
                    self.actions2.forEach(action => {
                        itemParsed.forEach(active_action => {
                            if (action.ActionId == active_action)
                                list_action2.push(action);

                        });
                    });
                    self.actions2 = list_action2;
                } else if (item.__label_action_code != '') {
                    let itemParsed = JSON.parse(item);
                    let list_action = [];
                    let list_action2 = [];
                    self.actions.forEach(action => {
                        itemParsed.forEach(active_action => {
                            if (action.ActionId == active_action || action.Code == active_action)
                                list_action.push(action);

                        });
                    });
                    self.actions = list_action;
                    ///IsTop
                    self.actions2.forEach(action => {
                        itemParsed.forEach(active_action => {
                            if (action.Code == active_action)
                                list_action2.push(action);

                        });
                    });
                    self.actions2 = list_action2;
                }

            }
        }

    }

    create(e: any, action: any = null) {
        var link = this._label_Action.filter(x => x.IsTop == true && x.Code == action)[0].Value;
        if (link != undefined && link != null) {
            link = this.settingLinkCreate(link, 'REDIRECT');
            if (link == "") {
                return;
            } else {
                if (this.query_params != undefined && this.query_params != "")
                    this.router.navigate([link], { queryParams: JSON.parse(this.query_params) });
                else {
                    if (link.charAt(link.length - 1) == "/")
                        this.router.navigate([link + 'null']);
                    else
                        this.router.navigate([link]);
                }
            }
            // if(this.utilityId != null && this.utilityId != undefined )
            //     link = link.replace("{UtilityId}", this.utilityId);
            // if (link.charAt(link.length - 1) == "/")
            //     this.router.navigate([link + 'null']);
            // else
            //     this.router.navigate([link]);
        }
        else
            abp.notify.error('Chưa cấu hình đường dẫn cho chức năng!', undefined, { "position": "top-end" });
    }

    clickBtnStore(e: any, action: any = null, dataSourceID: any) {
        var self = this;
        var items;
        if (action.IsChooseData == null || action.IsChooseData == true) {
            if (self.treeList.instance.getSelectedRowsData().length > 0) items = self.treeList.instance.getSelectedRowsData();
            if (self.data.instance.getSelectedRowsData().length > 0) items = self.data.instance.getSelectedRowsData();
            if (items.length > 0) {
                var ListID = "";
                items.forEach(element => {
                    ListID += element.Id;
                    ListID += ',';
                });
                ListID = ListID.slice(0, -1);
                // var storeName = this._label_Action.filter(x => x.Code == action)[0].Value;
                var storeName = action.Value;
                if (storeName != undefined && storeName != null) {
                    if (self.utilityId != null || self.utilityId != undefined) {
                        if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
                            self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
                        }
                    }
                    if (self.Init_query_params.length > 0) {
                        self.Init_query_params.forEach(element => {
                            if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                                self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                            }
                        });
                    }

                    this._viewUtilityService.actionWithListParamId(ListID, storeName, dataSourceID, self.userId_query, self.paramTest).subscribe((res: any) => {
                        if (res.code == "SUCCESS") {

                            if (res.data.length == 0) abp.notify.success("Thành công!", undefined, { "position": "top-end" });
                            else {
                                let position_notify = "bottom-end";
                                if (res.data[0].position != undefined) position_notify = res.data[0].position

                                if (res.data[0].code == "E_01") {
                                    this.notify.error(res.data[0].message, undefined, { "position": position_notify });
                                }
                                if (res.data[0].code == "U_01") {
                                    this.notify.warn(res.data[0].message, undefined, { "position": position_notify });
                                }
                                else {
                                    abp.notify.success("Thành công!", undefined, { "position": "top-end" });
                                }
                            }

                            this.viewreport(false);
                        }
                        else if (res.code == "ERROR") {
                            abp.notify.error("Có lỗi xảy ra khi thực hiện chức năng trên server.", undefined, { "position": "top-end" });
                            this.viewreport(false);
                        }
                    }, (err: any) => {
                        abp.notify.error(err.error.messages, undefined, { "position": "top-end" });
                        this.viewreport(false);
                    });
                }
                else
                    abp.notify.error('Chưa cấu hình store cho chức năng!', undefined, { "position": "top-end" });
            } else {
                abp.notify.error('Hãy chọn dòng dữ liệu', undefined, { "position": "top-end" });
            }
        } else if (action.IsChooseData == false) {
            var ListID = "";
            // var storeName = this._label_Action.filter(x => x.Code == action)[0].Value;
            var storeName = action.Value;
            if (storeName != undefined && storeName != null) {
                if (self.utilityId != null || self.utilityId != undefined) {
                    if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
                        self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
                    }
                }
                if (self.Init_query_params.length > 0) {
                    self.Init_query_params.forEach(element => {
                        if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                            self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                        }
                    });
                }

                this._viewUtilityService.actionWithListParamId(ListID, storeName, dataSourceID, self.userId_query, self.paramTest).subscribe((res: any) => {
                    if (res.code == "SUCCESS") {

                        if (res.data.length == 0) abp.notify.success("Thành công!", undefined, { "position": "top-end" });
                        else {
                            let position_notify = "bottom-end";
                            if (res.data[0].position != undefined) position_notify = res.data[0].position

                            if (res.data[0].code == "E_01") {
                                this.notify.error(res.data[0].message, undefined, { "position": position_notify });
                            }
                            if (res.data[0].code == "U_01") {
                                this.notify.warn(res.data[0].message, undefined, { "position": position_notify });
                            }
                            else {
                                abp.notify.success("Thành công!", undefined, { "position": "top-end" });
                            }
                        }

                        this.viewreport(false);
                    }
                    else if (res.code == "ERROR") {
                        abp.notify.error("Có lỗi xảy ra khi thực hiện chức năng trên server.", undefined, { "position": "top-end" });
                        this.viewreport(false);
                    }
                }, (err: any) => {
                    abp.notify.error(err.error.messages, undefined, { "position": "top-end" });
                    this.viewreport(false);
                });
            }
            else
                abp.notify.error('Chưa cấu hình store cho chức năng!', undefined, { "position": "top-end" });
        }


    }

    clickBtnStoreAndRedirect(e: any, action: any = null, dataSourceID: any) {
        var self = this;
        var items;
        if (action.IsChooseData == null || action.IsChooseData == true) {
            if (self.treeList.instance.getSelectedRowsData().length > 0) items = self.treeList.instance.getSelectedRowsData();
            if (self.data.instance.getSelectedRowsData().length > 0) items = self.data.instance.getSelectedRowsData();
            if (items.length > 0) {
                var ListID = "";
                items.forEach(element => {
                    ListID += element.Id;
                    ListID += ',';
                });
                ListID = ListID.slice(0, -1);
                // var storeName = this._label_Action.filter(x => x.Code == action)[0].Value;
                var storeName = action.Value;

                if (storeName != undefined && storeName != null) {
                    if (self.utilityId != null || self.utilityId != undefined) {
                        if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
                            self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
                        }
                    }
                    if (self.Init_query_params.length > 0) {
                        self.Init_query_params.forEach(element => {
                            if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                                self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                            }
                        });
                    }

                    this._viewUtilityService.actionWithListParamIdAndReturnOutput(ListID, storeName, dataSourceID, self.userId_query, self.paramTest).subscribe((res: any) => {
                        if (res.code == "SUCCESS") {
                            if (res.value == null) {
                                if (res.data.length == 0) abp.notify.success("Thành công!", undefined, { "position": "top-end" });
                                else {
                                    let position_notify = "bottom-end";
                                    if (res.data[0].position != undefined) position_notify = res.data[0].position

                                    if (res.data[0].code == "E_01") {
                                        this.notify.error(res.data[0].message, undefined, { "position": position_notify });
                                    }
                                    if (res.data[0].code == "U_01") {
                                        this.notify.warn(res.data[0].message, undefined, { "position": position_notify });
                                    }
                                    else {
                                        abp.notify.success("Thành công!", undefined, { "position": "top-end" });
                                    }
                                }

                                this.viewreport(false);
                            } else {
                                if (self.isPopupConfirm) {
                                    let popupConfirmTitle = self.popupConfirmTitle
                                    let popupConfirmText = self.popupConfirmText
                                    let popupConfirmButton = self.popupConfirmButton
                                    Swal.fire({
                                        title: '<h2>' + popupConfirmTitle + '</h2>',
                                        html: '<h3>' + popupConfirmText + '</h3>',
                                        showCancelButton: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        allowOutsideClick: false,
                                        confirmButtonText: popupConfirmButton,
                                        cancelButtonText: 'Đóng'
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            if (res.listParam == null) {
                                                if (window.location.pathname == res.value) {
                                                    self.viewreport(true)
                                                } else {
                                                    self.router.navigate([res.value]);
                                                }
                                            } else {
                                                let urlParam = JSON.parse(res.listParam)[0]

                                                self.router.navigate([res.value], { queryParams: urlParam });
                                            }
                                        }
                                    })
                                } else {
                                    if (res.listParam == null) {
                                        self.router.navigate([res.value]);
                                    } else {
                                        let urlParam = JSON.parse(res.listParam)[0]

                                        self.router.navigate([res.value], { queryParams: urlParam });
                                    }
                                }
                            }

                        }
                        else if (res.code == "ERROR") {
                            abp.notify.error("Có lỗi xảy ra khi thực hiện chức năng trên server.", undefined, { "position": "top-end" });
                            this.viewreport(false);
                        }
                    }, (err: any) => {
                        abp.notify.error(err.error.messages, undefined, { "position": "top-end" });
                        this.viewreport(false);
                    });
                }
                else
                    abp.notify.error('Chưa cấu hình store cho chức năng!', undefined, { "position": "top-end" });
            } else {
                abp.notify.error('Hãy chọn dòng dữ liệu', undefined, { "position": "top-end" });
            }
        } else if (action.IsChooseData == false) {
            var ListID = "";
            var storeName = action.Value;

            if (storeName != undefined && storeName != null) {
                if (self.utilityId != null || self.utilityId != undefined) {
                    if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
                        self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
                    }
                }
                if (self.Init_query_params.length > 0) {
                    self.Init_query_params.forEach(element => {
                        if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                            self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                        }
                    });
                }

                this._viewUtilityService.actionWithListParamIdAndReturnOutput(ListID, storeName, dataSourceID, self.userId_query, self.paramTest).subscribe((res: any) => {
                    if (res.code == "SUCCESS") {
                        if (res.value == null) {
                            if (res.data.length == 0) abp.notify.success("Thành công!", undefined, { "position": "top-end" });
                            else {
                                let position_notify = "bottom-end";
                                if (res.data[0].position != undefined) position_notify = res.data[0].position

                                if (res.data[0].code == "E_01") {
                                    this.notify.error(res.data[0].message, undefined, { "position": position_notify });
                                }
                                if (res.data[0].code == "U_01") {
                                    this.notify.warn(res.data[0].message, undefined, { "position": position_notify });
                                }
                                else {
                                    abp.notify.success("Thành công!", undefined, { "position": "top-end" });
                                }
                            }

                            this.viewreport(false);
                        } else {
                            if (self.isPopupConfirm) {
                                let popupConfirmTitle = self.popupConfirmTitle
                                let popupConfirmText = self.popupConfirmText
                                let popupConfirmButton = self.popupConfirmButton
                                Swal.fire({
                                    title: '<h2>' + popupConfirmTitle + '</h2>',
                                    html: '<h3>' + popupConfirmText + '</h3>',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    allowOutsideClick: false,
                                    confirmButtonText: popupConfirmButton,
                                    cancelButtonText: 'Đóng'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        if (res.listParam == null) {
                                            self.router.navigate([res.value]);
                                        } else {
                                            let urlParam = JSON.parse(res.listParam)[0]

                                            self.router.navigate([res.value], { queryParams: urlParam });
                                        }
                                    }
                                })
                            } else {
                                if (res.listParam == null) {
                                    self.router.navigate([res.value]);
                                } else {
                                    let urlParam = JSON.parse(res.listParam)[0]

                                    self.router.navigate([res.value], { queryParams: urlParam });
                                }
                            }
                        }

                    }
                    else if (res.code == "ERROR") {
                        abp.notify.error("Có lỗi xảy ra khi thực hiện chức năng trên server.", undefined, { "position": "top-end" });
                        this.viewreport(false);
                    }
                }, (err: any) => {
                    abp.notify.error(err.error.messages, undefined, { "position": "top-end" });
                    this.viewreport(false);
                });
            }

        }
    }

    execServiceActionWithParamId(id: number | undefined, storeName: string | undefined, dataSourceID: number | undefined, userId: number | undefined, paramTest: any[] | undefined) {

        this._viewUtilityService.actionWithParamId(id, storeName, dataSourceID, userId, paramTest).subscribe((res: any) => {
            if (res.code == "SUCCESS") {
                abp.notify.success("Thành công!", undefined, { "position": "top-end" });

                if (this.listTaskUpdate.length > 0) {
                    this.onlyLoadOneTime = this.onlyLoadOneTime + 1;
                    if (this.onlyLoadOneTime == this.listTaskUpdate.length) {
                        this.viewreport(false);
                    }
                } else {
                    this.viewreport(false);
                }


            }
            else if (res.code == "ERROR") {
                abp.notify.error("Có lỗi xảy ra khi thực hiện chức năng trên server.", undefined, { "position": "top-end" });
                this.viewreport(false);
            }
        }, (err: any) => {
            abp.notify.error(err.error.messages, undefined, { "position": "top-end" });
            this.viewreport(false);
        });
    }

    //Function redirect page với đường link đã cấu hình
    action_link(e: any, action: any = null) {
        let confirmTitle = JSON.parse(window.localStorage.getItem('actions')).filter(x => x.Code)[0].ConfirmTitle;
        let confirmText = JSON.parse(window.localStorage.getItem('actions')).filter(x => x.Code)[0].ConfirmText;
        let confirmButtonText = JSON.parse(window.localStorage.getItem('actions')).filter(x => x.Code)[0].ConfirmButtonText;
        if (JSON.parse(window.localStorage.getItem('actions')).filter(x => x.Code == action)[0].IsPopupConfirm == true) {
            Swal.fire({
                title: '<h2>' + confirmTitle + '</h2>',
                html: '<h3>' + confirmText + '</h3>',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                allowOutsideClick: false,
                confirmButtonText: confirmButtonText,
                cancelButtonText: 'Đóng'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.localStorage.setItem('UTILITY_ACTION', action);
                    var link = this._label_Action.filter(x => x.Code == action)[0].Value;
                    if (this.displayType == 12) {
                        let taskKey = this.ganttChartTaskDataSource.filter(x => x.id == e.key)
                        link = this.settingLink(link, taskKey, 'REDIRECT');
                    } else {
                        link = this.settingLink(link, e.data, 'REDIRECT');
                    }

                    if (link == "") {
                        return;
                    } else {
                        if (this.query_params != undefined && this.query_params != "")
                            this.router.navigate([link], { queryParams: JSON.parse(this.query_params) });
                        else {
                            this.router.navigate([link]);
                        }
                    }
                }
            })
        } else if (JSON.parse(window.localStorage.getItem('actions')).filter(x => x.Code)[0].IsPopupConfirm == false || JSON.parse(window.localStorage.getItem('actions')).filter(x => x.Code)[0].IsPopupConfirm == null) {
            window.localStorage.setItem('UTILITY_ACTION', action);
            var link = this._label_Action.filter(x => x.Code == action)[0].Value;
            if (this.displayType == 12) {
                if (e.key != undefined) {
                    let taskKey = this.ganttChartTaskDataSource.filter(x => x.id == e.key)[0]
                    link = this.settingLink(link, taskKey, 'REDIRECT');
                } else {
                    let taskKey = this.ganttChartTaskDataSource.filter(x => x.id == e.id)[0]
                    link = this.settingLink(link, taskKey, 'REDIRECT');
                }

            } else {
                link = this.settingLink(link, e.data, 'REDIRECT');
            }
            if (link == "") {
                return;
            } else {
                if (this.query_params != undefined && this.query_params != "")
                    this.router.navigate([link], { queryParams: JSON.parse(this.query_params) });
                else {
                    this.router.navigate([link]);
                }
            }
        }

        // if (link != undefined && link != null) {
        //     link = link.replace("{Id}", e.data.Id);
        //     if (e.data.Code != undefined)
        //         link = link.replace("{Code}", e.data.Code);
        //     if(this.utilityId != null && this.utilityId != undefined )
        //         link = link.replace("{UtilityId}", this.utilityId);
        //     this.router.navigate([link]);
        // }
        // else
        //     abp.notify.error('Chưa cấu hình đường dẫn cho chức năng!');
    }

    //Function redirect page với hyperlink đã cấu hình
    action_hyperlink(e: any, action: any = null) {
        window.localStorage.setItem('UTILITY_ACTION', action);
        var link = this._label_Action.filter(x => x.Code == action)[0].Value;
        if (link != undefined && link != null) {
            if (e.data != null && e.data != undefined) link = link.replace("{Id}", e.data.Id);
            //if (e.data.Code != undefined)
            //    link = link.replace("{Code}", e.data.Code);
            //this.router.navigate([link]);
            window.open(link);
        }
        else
            abp.notify.error('Chưa cấu hình đường dẫn cho chức năng!', undefined, { "position": "top-end" });
    }

    //Function thực hiện chức năng chỉ định với store đã cấu hình
    action_store(e: any, action: any = null, dataSourceID: any) {
        const self = this;
        var storeName = this._label_Action.filter(x => x.Code == action)[0].Value;
        if (storeName != undefined && storeName != null) {
            if (self.utilityId != null || self.utilityId != undefined) {
                if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
                    self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
                }
            }
            if (self.Init_query_params.length > 0) {
                self.Init_query_params.forEach(element => {
                    if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                        self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                    }
                });
            }
            if (this.displayType == 12) {
                switch (action) {

                    case 'CREATE':
                        if (e != 0) {
                            self.execServiceActionWithParamId(e, storeName, dataSourceID, this.userId_query, self.paramAddTask)
                        } else {
                            var id: number = 0
                            self.execServiceActionWithParamId(id, storeName, dataSourceID, this.userId_query, self.paramAddTask)
                        }
                        break;
                    case 'DELETE':
                        self.execServiceActionWithParamId(e.id, storeName, dataSourceID, this.userId_query, [])
                        break;
                    case 'DEPENDENCY':
                        self.execServiceActionWithParamId(0, storeName, dataSourceID, this.userId_query, self.paramDependency)
                        break;
                    case 'DELETE_DEPENDENCY':
                        self.execServiceActionWithParamId(e.id, storeName, dataSourceID, this.userId_query, self.paramDependency)
                        break;
                }

            } else {
                self.execServiceActionWithParamId(e.data.Id, storeName, dataSourceID, this.userId_query, self.paramTest)
            }

        }
        else
            abp.notify.error('Chưa cấu hình store cho chức năng!', undefined, { "position": "top-end" });
    }
    action_store_and_redirect(e: any, action: any = null, dataSourceID: any) {
        const self = this;
        window.localStorage.setItem('UTILITY_ACTION', action);
        var storeName = this._label_Action.filter(x => x.Code == action)[0].Value;
        if (storeName != undefined && storeName != null) {
            if (self.utilityId != null || self.utilityId != undefined) {
                if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
                    self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
                }
            }
            if (self.Init_query_params.length > 0) {
                self.Init_query_params.forEach(element => {
                    if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                        self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                    }
                });
            }

            this._viewUtilityService.actionWithParamIdAndReturnOutput(e.data.Id, storeName, dataSourceID, this.userId_query, self.paramTest).subscribe((res: any) => {

                if (res.code == "SUCCESS") {
                    if (res.value == null) {
                        abp.notify.success("Thành công!", undefined, { "position": "top-end" });

                        // if (storeName == 'CreateGroupChatForRemineTask') {
                        //     this.socket.emit("showChatChannelRedmine", "REDMINE_GROUP_00");
                        // }

                        this.viewreport(false);
                    } else {
                        if (self.isPopupConfirm) {
                            let popupConfirmTitle = self.popupConfirmTitle
                            let popupConfirmText = self.popupConfirmText
                            let popupConfirmButton = self.popupConfirmButton
                            Swal.fire({
                                title: '<h2>' + popupConfirmTitle + '</h2>',
                                html: '<h3>' + popupConfirmText + '</h3>',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                allowOutsideClick: false,
                                confirmButtonText: popupConfirmButton,
                                cancelButtonText: 'Đóng'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    if (res.listParam == null) {
                                        if (window.location.pathname == res.value) {
                                            self.viewreport(true)
                                        } else {
                                            self.router.navigate([res.value]);
                                        }

                                    } else {
                                        let urlParam = JSON.parse(res.listParam)[0]
                                        self.router.navigate([res.value], { queryParams: urlParam });
                                    }

                                }
                            })
                        } else {
                            if (res.listParam == null) {
                                self.router.navigate([res.value]);
                            } else {
                                let urlParam = JSON.parse(res.listParam)[0]
                                self.router.navigate([res.value], { queryParams: urlParam });
                            }
                        }
                    }

                }
                else if (res.code == "ERROR") {
                    abp.notify.error("Có lỗi xảy ra khi thực hiện chức năng trên server.", undefined, { "position": "top-end" });
                    this.viewreport(true);
                }
            }, (err: any) => {
                abp.notify.error(err.error.messages, undefined, { "position": "top-end" });
                this.viewreport(false);
            });
        }
        else
            abp.notify.error('Chưa cấu hình store cho chức năng!', undefined, { "position": "top-end" });
    }

    //Function thực hiện chức năng chỉ định với store đã cấu hình dành cho luồng copy văn bản
    action_store_filecopy(e: any, action: any = null, dataSourceID: any, type: any) {
        var storeName = this._label_Action.filter(x => x.Code == action)[0].Value;
        if (storeName != undefined && storeName != null) {
            // if (type == 1) {
            //     //action_store
            //     this.action_store(e, action, dataSourceID);
            //     //copy file and update path
            //     this._documentAppService.getDocumentEditByDocumentId_New(e.data.Id).subscribe((res: any) => {
            //         let listAtt = res.attachment.split(';');
            //         for (let i = 0; i < listAtt.length; i++) {
            //             this._documentAppService.copyFile(listAtt[i]).subscribe();
            //         }
            //     })
            // }
            // if (type == 2) {
            //     //action_store
            //     this.action_store(e, action, dataSourceID);
            //     //copy file and update path
            //     this._oDocServiceProxy.getODocForEdit(e.data.Id).subscribe((res: any) => {
            //         let listAtt = res.attachment.split(';');
            //         for (let i = 0; i < listAtt.length; i++) {
            //             this._documentAppService.copyFile(listAtt[i]).subscribe();
            //         }
            //     })
            //     // console.log('action_store_filecopy_odoc');
            // }


            // this._viewUtilityService.actionWithParamId(e.data.Id, storeName, dataSourceID).subscribe((res: any) => {
            //     if (res.code == "SUCCESS") {
            //         abp.notify.success("Thành công!");

            //         if(storeName == 'CreateGroupChatForRemineTask'){
            //             this.socket.emit("showChatChannelRedmine", "REDMINE_GROUP_00");
            //         }

            //         this.viewreport(false);
            //     }
            //     else if (res.code == "ERROR") {
            //         abp.notify.error("Có lỗi xảy ra khi thực hiện chức năng trên server.");
            //         this.viewreport(false);
            //     }
            // }, (err: any) => {
            //     abp.notify.error(err.error.messages);
            //     this.viewreport(false);
            // });
        }
        else
            abp.notify.error('Chưa cấu hình store cho chức năng!', undefined, { "position": "top-end" });
    }

    //Function hiển thị popup view với component đã cấu hình bởi action code
    action_show_component(e: any, actions: any = null) {

        var self = this;
        var componentView = null;
        if (this._componentViewConfigurationService.ComponentViewDefinitions.find(x => x.code == actions.Value)) {
            componentView = this._componentViewConfigurationService.ComponentViewDefinitions.find(x => x.code == actions.Value).component;
        }

        self.componentPopup = {
            component: componentView,
            inputs: e.data,
            outputs: {
                onHidePopup: (e) => this.hidePopup(e),
            }
        }

        if (actions.Value == "PREVIEW") {
            self.popupImgVisible = true;
            this.isPreview = true;

        } else {
            self.popupVisible = true;
            this.isPreview = false;
        }
    }



    action_call_api(e: any, action: any = null) {
        // Get method, api, param
        var action_value = this._label_Action.filter(x => x.Code == action)[0].Value;
        var obj = JSON.parse(action_value);
        var method = obj.method
        var link_api = obj.api;
        var form_data = obj.formdata;
        //Get query_string
        link_api = this.settingLinkCreate(link_api, 'API').toString();

        //Form_data
        form_data = this.addParamFormData(form_data, e.data);
        form_data = form_data.replaceAll('`', '"');

        //Execute API
        switch (method) {
            case "GET":
                let get_url_ = AppConsts.remoteServiceBaseUrl + link_api;
                get_url_ = get_url_.replace(/[?&]$/, "");
                get_url_ = get_url_.replace(/[^\x00-\x7F]/g, "");

                var params = {};
                if (this.api_query_params != undefined && this.api_query_params != "") {
                    params = JSON.parse(this.api_query_params);
                }

                let get_options_: any = {
                    params: new HttpParams({
                        fromObject: params
                    })
                };
                this.http.get(get_url_, get_options_).subscribe(res => {
                    if (res["isSucceeded"] != undefined) {
                        if (res["isSucceeded"]) {
                            abp.notify.success("Thành công", undefined, { "position": "top-end" });
                        } else {
                            abp.notify.error("Có lỗi xảy ra", undefined, { "position": "top-end" });
                        }
                    } else {
                        abp.notify.success("Thành công", undefined, { "position": "top-end" });
                    }
                }, error => {
                    abp.notify.error("Có lỗi xảy ra", undefined, { "position": "top-end" });
                });
                break;
            case "POST":
                let post_url_ = AppConsts.remoteServiceBaseUrl + link_api;
                post_url_ = post_url_.replace(/[?&]$/, "");
                post_url_ = post_url_.replace(/[^\x00-\x7F]/g, "");

                var params = {};
                if (this.api_query_params != undefined && this.api_query_params != "") {
                    params = JSON.parse(this.api_query_params);
                }

                let post_options_: any = {
                    params: new HttpParams({
                        fromObject: params
                    })
                };
                this.http.post(post_url_, JSON.parse(form_data), post_options_).subscribe(res => {
                    if (res["isSucceeded"] != undefined) {
                        if (res["isSucceeded"]) {
                            abp.notify.success("Thành công", undefined, { "position": "top-end" });
                        } else {
                            abp.notify.error("Có lỗi xảy ra", undefined, { "position": "top-end" });
                        }
                    } else {
                        abp.notify.success("Thành công", undefined, { "position": "top-end" });
                    }
                }, error => {
                    abp.notify.error("Có lỗi xảy ra", undefined, { "position": "top-end" });
                });
                break;
            case "DELETE":
                let delete_url_ = AppConsts.remoteServiceBaseUrl + link_api;
                delete_url_ = delete_url_.replace(/[?&]$/, "");
                delete_url_ = delete_url_.replace(/[^\x00-\x7F]/g, "");
                let delete_options_: any = {
                    params: new HttpParams({
                        fromObject: JSON.parse(this.api_query_params)
                    })
                };
                this.http.delete(delete_url_, delete_options_).subscribe(res => {
                    if (res["isSucceeded"] != undefined) {
                        if (res["isSucceeded"]) {
                            abp.notify.success("Thành công", undefined, { "position": "top-end" });
                        } else {
                            abp.notify.error("Có lỗi xảy ra", undefined, { "position": "top-end" });
                        }
                    } else {
                        abp.notify.success("Thành công", undefined, { "position": "top-end" });
                    }
                }, error => {
                    abp.notify.error("Có lỗi xảy ra", undefined, { "position": "top-end" });
                });
                break;
        }

    }

    action_import_file(e: any, action: any = null) {
        window.localStorage.setItem('UTILITY_ACTION', action);
        this.popupVisibleImport = true;
    }

    fnXN_KCL(e) {
        var self = this;
        var items;
        if (self.treeList.instance.getSelectedRowsData().length > 0) items = self.treeList.instance.getSelectedRowsData();
        if (self.data.instance.getSelectedRowsData().length > 0) items = self.data.instance.getSelectedRowsData();
        var listId = "";
        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            listId += element.PersonId;
            if (index < items.length - 1)
                listId += ";";
        }

        //Action event
    }

    hidePopup(e: any) {
        // this.popupVisible = false;
        if (this.isPreview) {
            this.popupImgVisible = false;
            this.popupListVisible = false;
        } else {
            this.popupVisible = false;
        }
    }

    clickBtnPopup(e: any, actions: any = null) {
        var self = this;
        var items;
        if (self.treeList.instance.getSelectedRowsData().length > 0) items = self.treeList.instance.getSelectedRowsData();
        if (self.data.instance.getSelectedRowsData().length > 0) items = self.data.instance.getSelectedRowsData();
        if (items.length > 0) {
            var ListID = "";
            items.forEach(element => {
                ListID += element.Id;
                ListID += ',';
            });
            ListID = ListID.slice(0, -1);

            var list = { 'id': '' };
            list.id = ListID;

            // var storeName = this._label_Action.filter(x => x.Code == action)[0].Value;
            var storeName = actions;


            var self = this;
            var componentView = null;
            if (this._componentViewConfigurationService.ComponentViewDefinitions.find(x => x.code == actions.Value)) {
                componentView = this._componentViewConfigurationService.ComponentViewDefinitions.find(x => x.code == actions.Value).component;
            }

            self.componentPopup = {
                component: componentView,
                inputs: list,
                outputs: {
                    onHidePopup: (e) => this.hidePopup(e),
                }
            }

            //self.popupVisible = true;

            if (actions.Value == "PREVIEW") {
                self.popupImgVisible = true;
                this.isPreview = true;

            } else if (actions.Value == "PREVIEW_LIST") {
                self.popupListVisible = true;
                this.isPreview = true;
            } else {
                self.popupVisible = true;
                this.isPreview = false;
            }
        } else {
            abp.notify.error('Hãy chọn dòng dữ liệu', undefined, { "position": "top-end" });
        }

    }

    onContentReady(e) {
        const self = this;

        if (self.get_storage) self.setLocalStorage();
    }

    onContentReadyTreeList(e) {
        const self = this;
        if (self.get_storage == true) self.setLocalStorage();
    }

    setLocalStorage() {
        const self = this;
        const paging = self.data.instance.option("paging");
        const pagingTreeList = self.treeList.instance.option("paging")
        let formData = self.formData;
        // lưu thông tin tìm kiếm
        sessionStorage.setItem(`VU_${this.code}`, JSON.stringify({
            "formData": formData,
            "pageIndex": paging.pageIndex,
            "pageSize": paging.pageSize,
        }));
    }


    getLocalStorage() {
        const self = this; 
        const data = sessionStorage.getItem(`VU_${self.code}`);
        self.formDataLocalStorage = [];
        if (!(data === null || data === undefined) && data != "") {
            let jData = JSON.parse(data);
            if (JSON.stringify(jData.formData) != JSON.stringify({})) {
                self.formData = jData.formData;
                var listkey = Object.keys(self.formData);
                
                listkey.forEach(async val => {
                    var param = new FParameter();
                    if(val != "") {
                        for(let i = 0; i < self.filterList.length; i++) {
                            if(self.filterList[i].code == val) {
                                param.value = self.formData[val];
                                param.varible = val;
                                self.formDataLocalStorage.push(param);
                            }
                        }    
                    }
                               
                });
            }
            if (self.displayType == 13) {
                self.pageSizeTreeList = jData.pageSize;
                self.pageIndexTreeList = jData.pageIndex;
            } else {
                self.pageSize = jData.pageSize;
                self.pageIndex = jData.pageIndex;
            }

        }
        self.get_storage = true;
    }


    attachment(e: any) {
        var listFile = e.split(";");
        if (listFile.length == 1) {
            var rootUrl = AppConsts.fileServerUrl;
            if (e.indexOf("/") == 0) {
                var link = rootUrl + e;
                window.open(link, '_blank');
            } else {
                var link = rootUrl + "/" + e;
                window.open(link, '_blank');
            }
        }
        else if (listFile.length > 1) {
            this.popupVisibleAttachment = true;
            this.attachmentList = [];
            listFile.forEach(f => {
                var fileName = f.split("/");
                this.attachmentList.push({ tepDinhKem: fileName[fileName.length - 1], link: f });
            });
        }

    }

    showDetail(e: any) {
        var rootUrl = AppConsts.fileServerUrl;
        if (e.indexOf("/") == 0) {
            var link = rootUrl + e;
            window.open(link, '_blank');
        } else {
            var link = rootUrl + "/" + e;
            window.open(link, '_blank');
        }
    }

    settingLink(link: any, data: any, type: any): String {

        var link_param = link.split(/[{}]/).filter(l => l != "" && link.indexOf('{' + l + '}') != -1);
        var link_split = link.split("?");
        this.variable_recordid = link_param;
        this.variable_params = link_split[1];
        var userid = function (text) { return text.toLowerCase() == "userid" && text; };
        //var query_param = link.split(/[()]/).filter(l => l != "" && link.indexOf('(' + l + ')') != -1 );
        var nullable = function (text) { return text.indexOf("-nullable") != -1 && text; };
        link_param.forEach(ele => {
            switch (ele) {
                case "UtilityId": {
                    if (this.utilityId != null && this.utilityId != undefined)
                        link = link.replace("{UtilityId}", this.utilityId);
                    break;
                }
                case userid(ele): {
                    if (abp.session.userId != null && abp.session.userId != undefined)
                        link = link.replace("{" + ele + "}", abp.session.userId);
                    break;
                }
                case nullable(ele): {
                    var variable = ele.substring(0, ele.indexOf("-nullable"));
                    if (data[variable] != undefined && data[variable] != null) {
                        link = link.replace("{" + ele + "}", data[variable]);
                    } else {
                        link = link.replace("{" + ele + "}", "null");
                    }
                    break;
                }
                default: {
                    if (data[ele] != undefined && data[ele] != null) {
                        link = link.replace("{" + ele + "}", data[ele]);
                    }
                    else if (this.Init_query_params.length > 0) {
                        var search_value = this.Init_query_params.find(q => q.Varible.toString() == ele);
                        if (search_value != undefined && search_value != null) {
                            link = link.replace("{" + ele + "}", search_value.Value);
                        }
                    }
                    else {
                        abp.notify.error("Dữ liệu không tồn tại trường " + ele + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
                        link = "";
                    }
                    break;
                }
            }
        });

        var query_param_obj = "";
        if (link_split.length == 2) {
            var query_string = link_split[1];
            if (query_string != "") {
                var query_param = query_string.split("&");
                query_param_obj = '{';
                query_param.forEach(p => {
                    if (p != "") {
                        var variable_value = p.split("=");
                        if (variable_value.length == 2) {
                            if (variable_value[0] != "" && variable_value[1] != "") {
                                var variable = variable_value[0];
                                var value = variable_value[1];
                                switch (value) {
                                    case "UtilityId": {
                                        if (this.utilityId != null && this.utilityId != undefined) {
                                            query_param_obj = query_param_obj + '"' + variable.toString() + '":' + '"' + this.utilityId.toString() + '"' + ',';
                                        } else {
                                            abp.notify.error("Dữ liệu không tồn tại trường " + value + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
                                            link = "";
                                        }
                                        break;
                                    }
                                    case userid(value): {
                                        if (abp.session.userId != null && abp.session.userId != undefined) {
                                            query_param_obj = query_param_obj + '"' + variable.toString() + '":' + '"' + abp.session.userId.toString() + '"' + ',';
                                        }
                                        else {
                                            abp.notify.error("Dữ liệu không tồn tại trường " + value + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
                                            link = "";
                                        }
                                        break;
                                    }
                                    default: {
                                        if (data[value] != undefined && data[value] != null) {
                                            query_param_obj = query_param_obj + '"' + variable.toString() + '":' + '"' + data[value].toString() + '"' + ',';
                                            this.query_paramsForm.push({ Varible: variable.toString(), Value: data[value].toString() })
                                        }
                                        else if (this.Init_query_params.length > 0) {
                                            var search_value = this.Init_query_params.find(q => q.Varible.toString() == value);
                                            if (search_value != undefined && search_value != null) {
                                                query_param_obj = query_param_obj + '"' + value.toString() + '":' + '"' + search_value.Value.toString() + '"' + ',';
                                            }
                                        }
                                        else {
                                            abp.notify.error("Dữ liệu không tồn tại trường " + value + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
                                            link = "";
                                        }
                                        break;
                                    }
                                }
                            } else {
                                abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
                                link = "";
                            }
                        } else {
                            abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
                            link = "";
                        }
                    } else {
                        abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
                        link = "";
                    }
                });

                query_param_obj = query_param_obj.substring(0, query_param_obj.length - 1) + '}';
                if (type == 'REDIRECT') {
                    this.query_params = query_param_obj;
                } else if (type == 'API') {
                    this.api_query_params = query_param_obj;
                }
                link = link.replace("?" + query_string, "");
            } else {
                abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
                link = "";
            }
        } else if (link_split.length > 2) {
            abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
            link = "";
        }

        return link;
    }

    settingLinkCreate(link: any, type: any): String {
        // load lại reportUtilityId
        if (this.utilityId == undefined && this.reportUtilityId != undefined) this.utilityId = this.reportUtilityId;

        var link_param = link.split(/[{}]/).filter(l => l != "" && link.indexOf('{' + l + '}') != -1);
        var link_split = link.split("?");
        var userid = function (text) { return text.toLowerCase() == "userid" && text; };
        if (link_param[1] == "listBenhAnId" || link_param[0] == "ListId") {
            if (this.data.instance.getSelectedRowKeys().length > 0 || this.treeList.instance.getSelectedRowKeys().length > 0) {
                var listid = this.getSelectedKey();
                var listid_split = listid.split(",");
            }
            else {
                abp.notify.error("Dữ liệu chưa được chọn");
                link = "";
            }
        }
        //var query_param = link.split(/[()]/).filter(l => l != "" && link.indexOf('(' + l + ')') != -1 );
        link_param.forEach(ele => {
            switch (ele) {
                case "UtilityId": {
                    if (this.utilityId != null && this.utilityId != undefined)
                        link = link.replace("{UtilityId}", this.utilityId);
                    break;
                }
                case userid(ele): {
                    if (abp.session.userId != null && abp.session.userId != undefined)
                        link = link.replace("{" + ele + "}", abp.session.userId);
                    break;
                }
                case "listBenhAnId": {
                    if (abp.session.userId != null && abp.session.userId != undefined)
                        link = link;
                    break;
                }
                case "ListId": {
                    if (abp.session.userId != null && abp.session.userId != undefined)
                        link = link.replace("{ListId}", listid);
                    break;
                }
                case "firstId": {
                    if (abp.session.userId != null && abp.session.userId != undefined)
                        link = link.replace("{firstId}", listid_split[0]);
                    break;
                }

                default: {
                    var search_value = this.Init_query_params.find(q => q.Varible.toString() == ele);
                    if (search_value != undefined && search_value != null) {
                        link = link.replace("{" + ele + "}", search_value.Value);
                    }
                    else {
                        abp.notify.error("Dữ liệu không tồn tại trường " + ele + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
                        link = "";
                    }
                    break;
                }
            }
        });

        var query_param_obj = "";
        if (link_split.length == 2) {
            var query_string = link_split[1];
            if (query_string != "") {
                var query_param = query_string.split("&");
                query_param_obj = '{';
                query_param.forEach(p => {
                    if (p != "") {
                        var variable_value = p.split("=");
                        if (variable_value.length == 2) {
                            if (variable_value[0] != "" && variable_value[1] != "") {
                                var variable = variable_value[0];
                                var value = variable_value[1];
                                if (Number.isInteger(value / 1)) {
                                    if (abp.session.userId != null && abp.session.userId != undefined) {
                                        query_param_obj = query_param_obj + '"' + variable.toString() + '":' + '"' + value + '"' + ',';
                                    }
                                    else {
                                        abp.notify.error("Dữ liệu không tồn tại trường " + value + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
                                        link = "";
                                    }
                                } else {
                                    switch (value) {
                                        case "UtilityId": {
                                            if (this.utilityId != null && this.utilityId != undefined) {
                                                query_param_obj = query_param_obj + '"' + variable.toString() + '":' + '"' + this.utilityId.toString() + '"' + ',';
                                            } else {
                                                abp.notify.error("Dữ liệu không tồn tại trường " + value + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
                                                link = "";
                                            }
                                            break;
                                        }
                                        case userid(value): {
                                            if (abp.session.userId != null && abp.session.userId != undefined) {
                                                query_param_obj = query_param_obj + '"' + variable.toString() + '":' + '"' + abp.session.userId.toString() + '"' + ',';
                                            }
                                            else {
                                                abp.notify.error("Dữ liệu không tồn tại trường " + value + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
                                                link = "";
                                            }
                                            break;
                                        }
                                        case "{listBenhAnId}": {
                                            if (abp.session.userId != null && abp.session.userId != undefined) {
                                                query_param_obj = query_param_obj + '"' + variable.toString() + '":' + '"' + listid + '"' + ',';
                                            }
                                            else {
                                                abp.notify.error("Dữ liệu không tồn tại trường " + value + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
                                                link = "";
                                            }
                                            break;
                                        }

                                        default: {
                                            var search_value = this.Init_query_params.find(q => q.Varible.toString() == value);
                                            if (search_value != undefined && search_value != null) {
                                                query_param_obj = query_param_obj + '"' + variable.toString() + '":' + '"' + search_value.Value.toString() + '"' + ',';
                                            }
                                            else {
                                                abp.notify.error("Dữ liệu không tồn tại trường " + value + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
                                                link = "";
                                            }
                                            break;
                                        }
                                    }
                                }

                            } else {
                                abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
                                link = "";
                            }
                        } else {
                            abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
                            link = "";
                        }
                    } else {
                        abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
                        link = "";
                    }
                });

                query_param_obj = query_param_obj.substring(0, query_param_obj.length - 1) + '}';
                if (type == 'REDIRECT') {
                    this.query_params = query_param_obj;
                } else if (type == 'API') {
                    this.api_query_params = query_param_obj;
                } else if (type == 'STOREANDREDIRECT') {
                    this.query_params = query_param_obj;
                }
                link = link.replace("?" + query_string, "");
            } else {
                abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
                link = "";
            }
        } else if (link_split.length > 2) {
            abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
            link = "";
        }

        return link;
    }

    loadHinChart(type: any, res: any) {
        let datasets = [];
        res.forEach(element => {
            datasets.push({
                data: element.value_1.split(','),
                label: element.key_1
            });
        });
        this.chartLabels = res[0].labels.split(',');
        this.chartData = datasets;
    }

    findGetParameter() {
        const self = this;
        var parameters = window.location.search.substr(1);
        self.Init_query_params = [];
        var tmp = [];
        if (parameters != "") {
            parameters.split("&").forEach(function (item) {
                tmp = item.split("=");
                var paramTestItem = new Object();
                paramTestItem['Varible'] = tmp[0];
                paramTestItem['Value'] = decodeURIComponent(tmp[1]);
                if (tmp[0].toString().toLowerCase() == "userid") {
                    self.userId_query = Number(decodeURIComponent(tmp[1]));
                }
                self.Init_query_params.push(paramTestItem);
            });
        }
    }

    addParamFormData(form_data: string, data: any): string {
        var list_param = form_data.split(/[<>]/).filter(l => l != "" && form_data.indexOf('<' + l + '>') != -1);
        var userid = function (text) { return text.toLowerCase() == "userid" && text; };
        list_param.forEach(ele => {
            switch (ele) {
                case "UtilityId": {
                    if (this.utilityId != null && this.utilityId != undefined)
                        form_data = form_data.replace("<UtilityId>", this.utilityId);
                    break;
                }
                case userid(ele): {
                    if (abp.session.userId != null && abp.session.userId != undefined)
                        form_data = form_data.replace("<" + ele + ">", abp.session.userId.toString());
                    break;
                }
                default: {
                    if (data != undefined) {
                        if (data[ele] != undefined && data[ele] != null) {
                            form_data = form_data.replace("<" + ele + ">", '"' + data[ele] + '"');
                        }
                    }
                    else if (this.Init_query_params.length > 0) {
                        var search_value = this.Init_query_params.find(q => q.Varible.toString() == ele);
                        if (search_value != undefined && search_value != null) {
                            form_data = form_data.replace("<" + ele + ">", '"' + search_value.Value + '"');
                        }
                    }
                    else {
                        abp.notify.error("Dữ liệu không tồn tại trường " + ele + " để hoàn thành chức năng!", undefined, { "position": "top-end" });
                        form_data = "{}";
                    }
                    break;
                }
            }
        });
        return form_data;
    }
    parse(d) {
        if (d.data.actions != undefined) {
            return JSON.parse(d.data.actions);
        } else {
            return JSON.parse(window.localStorage.getItem('actions'));
        }

    }
    // labelActionsMap(d) {
    //     if (d.data['StoredLabelAction'] != undefined) {
    //         let params = {};
    //         params['RecordId'] = d.data['Id'];
    //         params['LabelCode'] = this.LabelCode;
    //         this._redmineService.dataResultStore_Param(d.data['StoredLabelAction'], 0, undefined, params).subscribe((res: any) => {
    //             console.log(d);
    //             if (res.data.length > 0) {
    //                 d.actions = res.data;
    //             }
    //         });
    //     } else {
    //         return this.actions;
    //     }
    // }


    async loadDefaultfilter() {
        const self = this;
        let promise = new Promise((resolve, reject) => {
            self.viewerService.postDefaultFilterData(self.currentReport, self.Init_query_params).subscribe((res: any) => {
                if (res.isSucceeded) {
                    if (res.data != null) {
                        self.formData = res.data[0];
                    }  
                    self.getLocalStorage();
                    resolve(res.data);
                } else {
                    abp.notify.error(res.Message, "Có lỗi ở cấu hình filter mặc định", { "position": "top-end" });
                    reject(res.Message);
                }
            });
        });

        return promise;
    }

    async createCaptcha() {
        //clear the contents of captcha div first
        document.getElementById('captcha').innerHTML = "";
        var charsArray =
            "0123456789";
        var lengthOtp = 5;
        var captcha = [];
        for (var i = 0; i < lengthOtp; i++) {
            //below code will not allow Repetition of Characters
            var index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
            if (captcha.indexOf(charsArray[index]) == -1)
                captcha.push(charsArray[index]);
            else i--;
        }
        var canv = document.createElement("canvas");
        canv.id = "captcha";
        canv.width = 160;
        canv.height = 35;
        var ctx = canv.getContext("2d");
        ctx.font = "30px Georgia";
        ctx.strokeText(captcha.join(""), 0, 30);
        //storing captcha so that can validate you can save it somewhere else according to your specific requirements
        this.code = captcha.join("");
        document.getElementById("captcha").appendChild(canv); // adds the canvas to the body element

        this.formData.captcha = '';

    }
    validateCaptcha = () => this.code;


    action_call_api_export(e: any, action: any = null) {
        this.spinnerService.show();
        const self = this;
        if (self.utilityId != null || self.utilityId != undefined) {
            if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
                self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
            }
        }
        if (self.Init_query_params.length > 0) {
            self.Init_query_params.forEach(element => {
                if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                    self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                }
            });
        }
        this.http.post(AppConsts.fileServerUrl + '/ExportFile/DRGetExportFile?report_id=' + this.currentReport, self.paramTest, { responseType: 'blob' }).subscribe((response: any) => {
            let dataType = response.type;
            let binaryData = [];
            binaryData.push(response);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
            downloadLink.setAttribute('download', self.reportName);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            self.spinnerService.hide();
        }, error => {
            self.spinnerService.hide();
            abp.notify.error("", "Có lỗi xảy ra", { "position": "top-end" });
        })
    }

    openPopupConfig(e: any) {
        const self = this;
        self.popupConfigVisible = true;
        // this.gridFormConfig.instance.refresh();
    }

    saveFormConfig(e) {
        this.form.instance.beginUpdate();
        this.formGroupConfigs.forEach(formGroup => {
            this.form.instance.itemOption(formGroup.code, "visible", formGroup.visible);
        });
        this.form.instance.endUpdate();
        this.form.instance.resetValues();
        this.popupConfigVisible = false;
    }

    closePopupConfig(e) {
        this.popupConfigVisible = false;
    }

    openImportPopupConfig(e) {
        const that = this;
        if (e.event.type == 'dxclick') {
            this.isClickedImport = true;
            // this.patientImportService.patientImport(this.filePathUpload).subscribe(async res => {

            //     if(res.code == '201') {
            //         await this.notify.warn(this.l(res.message));
            //         this.popupVisibleImport = false;
            //         window.open(AppConsts.fileServerUrl + res.data);
            //         this.isClickedImport = false;
            //     } else if(res.code == 'S_01') {
            //         this.popupVisibleImport = false;
            //         this.notify.success(this.l(res.message));
            //         window.location.reload()
            //     } else if(res.code == 'E_02') {
            //         this.popupVisibleImport = false;
            //         this.notify.error(this.l(res.message));
            //     }

            // })
            // var url = "";
            // if (that.urlImportFile.includes("ImportHCDC")) {
            //     url = AppConsts.importServerUrl + "/api/services/app/PatientImport/HCDCImport?filePath=" + that.filePathUpload + "&userId=" + abp.session.userId;
            // }
            // else if (that.urlImportFile.includes("ImportF0")) {
            //     url = AppConsts.importServerUrl + "/api/services/app/PatientImport/PatientImport?filePath=" + that.filePathUpload + "&userId=" + abp.session.userId;
            // }

            // $.ajax({
            //     url: url,
            //     type: 'POST',
            //     contentType: "application/json",
            //     success: async function (data) {
            //         if (data.result.code == '201') {
            //             await that.notify.warn(that.l(data.result.message));
            //             that.popupVisibleImport = false;
            //             window.open(AppConsts.fileServerUrl + data.result.data);
            //             that.isClickedImport = false;
            //         } else if (data.result.code == 'S_01') {
            //             that.popupVisibleImport = false;
            //             that.notify.success(that.l(data.result.message));
            //             window.location.reload()
            //         } else if (data.result.code == 'E_02') {
            //             that.popupVisibleImport = false;
            //             that.notify.error(that.l(data.result.message));
            //         } else {
            //             that.popupVisibleImport = false;
            //             that.notify.error(that.l(data.result.message));
            //         }
            //     }
            // });
        }
    }
    closeImportPopupConfig(e) {
        this.popupVisibleImport = false;
        this.isClickedImport = false;
    }

    pointClick(e: any) {
        const point = e.target;
        if (point.isSelected()) {
            point.clearSelection();
        } else {
            point.select();
        }
    }

    uploadFile(e) {
        if (e.value != null) {
            this.uploadUrl = AppConsts.fileServerUrl + "/DemoUiComponents/UploadImportFile?pathFile=" + this.urlImportFile + "&userId=" + abp.session.userId;
            //this.uploadUrl = AppConsts.remoteServiceBaseUrl + "/DemoUiComponents/UploadImportFile?pathFile=" + this.urlImportFile + "&userId=" + abp.session.userId;
        }
    }

    onUploaded(e) {
        this.filePathUpload = e.request.responseText
    }

    resetData() {
        this.dataSourceTest3 = [];
        this.column = [];
        this.export_column = [];
        // this.export_column_default = [];
        this.columnLink = [];
        this.sumary = {
            groupItems: [],
            totalItems: []
        }
        this.tableVisibility = "hidden";
        this.tableDisplay = "none";
        this.treeListVisibility = "hidden";
        this.treeListDisplay = "none";
    }

    linkDownLoadTemplate: any = '';
    disabled_btn_export: any = false;
    iconExport: any = "fas fa-file-export";
    // downloadTemplatee() {
    //     try {
    //         const self = this;
    //         self.iconExport = "fa fa-spinner fa-spin";
    //         self.disabled_btn_export = true;
    //         // if (this.linkDownLoadTemplate == '') {
    //         if (self.utilityId != null || self.utilityId != undefined) {
    //             if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
    //                 self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
    //             }
    //         }
    //         if (self.Init_query_params.length > 0) {
    //             self.Init_query_params.forEach(element => {
    //                 if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
    //                     self.paramTest.push({ Varible: element.Varible, Value: element.Value });
    //                 }
    //             });
    //         }

    //         self.http.post(AppConsts.importServerUrl + '/api/services/app/DRViewer/EditorTemplateAsyncc?object_id=' + self.currentReport, self.paramTest).subscribe(res => {
    //             if (res['result']['isSucceeded']) {
    //                 self.linkDownLoadTemplate = res['result']['data'];
    //                 var link = AppConsts.fileServerUrl + "/" + self.linkDownLoadTemplate;


    //                 setTimeout(() => {
    //                     window.open(link, '_blank');

    //                     self.iconExport = "fas fa-file-export";
    //                     self.disabled_btn_export = false;
    //                 }, 10000);
    //             } else {
    //                 abp.notify.error(res['result']['message'], undefined, { "position": "top-end" });
    //                 self.iconExport = "fas fa-file-export";
    //                 self.disabled_btn_export = false;
    //             }
    //         })
    //         // } else {
    //         //     var link = AppConsts.importServerUrl + "/" + this.linkDownLoadTemplate;

    //         //     window.open(link, '_blank');
    //         // }
    //     }
    //     catch (e) {
    //         console.log(e);
    //     }
    // }
    selectedRowsData = [];
    selectedRowsKey = [];
    getSelectedKey() {
        const self = this;
        // this.selectedRowsKey;

        if (self.treeList.instance.getSelectedRowsData().length > 0) this.selectedRowsKey = this.treeList.instance.getSelectedRowKeys();
        if (self.data.instance.getSelectedRowsData().length > 0) this.selectedRowsKey = this.data.instance.getSelectedRowKeys();
        // ===== or when deferred selection is used =====
        var temp = "";
        var a = 0;
        this.selectedRowsKey.forEach(item => {
            item;
            temp = temp + item["Id"] + ",";
        });
        var result = temp.slice(0, Number(temp.length) - 1);
        return result;
    }

    getColumnForCheckExport(reportId: number) {
        const self = this;
        self.columnExportDatasource = [];
        self.columnService.getByReportIdByStore(reportId).subscribe((reponse: any) => {
            self.columnExportDatasource = reponse.data;
        })
    }
    saveExportPopup(e: any) {
        const self = this;
        self.export_column_default = []
        for (let i = 0; i < self.columnExportDatasource.length; i++) {
            if (self.columnExportDatasource[i].isExport == true && (self.columnExportDatasource[i].parentCode == undefined || self.columnExportDatasource[i].parentCode == "")) {
                let col = {}
                col['dataField'] = self.columnExportDatasource[i].code;
                col['caption'] = self.columnExportDatasource[i].name != undefined && self.columnExportDatasource[i].name != '' ? self.columnExportDatasource[i].name : self.columnExportDatasource[i].code;
                // col['sortOrder'] = self.columnExportDatasource[i].groupSort;
                col['orderId'] = self.columnExportDatasource[i].colNum;
                col['name'] = self.columnExportDatasource[i].code;
                col['width'] = self.columnExportDatasource[i].width;
                col['dataType'] = self.columnExportDatasource[i].dataType;
                col['groupIndex'] = self.columnExportDatasource[i].groupLevel;
                if (self.columnExportDatasource[i].sortByColumn != null && self.columnExportDatasource[i].sortByColumn != '') {
                    let sortType = self.columnExportDatasource.find(x => x.code == self.columnExportDatasource[i].sortByColumn).groupSort
                    col['sortOrder'] = sortType;
                    col['allowSorting'] = sortType != '' && sortType != undefined ? true : false;
                } else {
                    col['sortOrder'] = self.columnExportDatasource[i].groupSort;
                    col['allowSorting'] = self.columnExportDatasource[i].groupSort != '' && self.columnExportDatasource[i].groupSort != undefined ? true : false;
                }
                if (self.columnExportDatasource[i].isParent == true || self.columnExportDatasource[i].isParent == 'True') {

                    var c_cols = [];
                    var child_col = self.columnExportDatasource.filter(c => c.parentCode == self.columnExportDatasource[i].code).sort((c1, c2) => c1.colNum - c2.colNum);
                    child_col.forEach(element => {
                        var c_col = {};
                        if (element.isDisplay == true || element.isDisplay == 'True') {
                            c_col['caption'] = element.name;
                            c_col['dataField'] = element.code;
                            c_col['orderId'] = element.colNum;
                            c_col['visible'] = element.visible;
                            if (element.sortByColumn != null && element.sortByColumn != '') {
                                let sortType = child_col.find(x => x.code == element.sortByColumn).groupSort
                                c_col['sortOrder'] = sortType;
                                c_col['allowSorting'] = sortType != '' && sortType != undefined ? true : false;
                            } else {
                                c_col['sortOrder'] = element.groupSort;
                                c_col['allowSorting'] = element.groupSort != '' && element.groupSort != undefined ? true : false;
                            }
                            if (element.width != 0 && !isNullOrUndefined(element.width) && element.width != '')
                                c_col['width'] = element.width;
                            if (!isNullOrUndefined(element.textAlign))
                                c_col['alignment'] = element.textAlign;
                            c_col['groupIndex'] = element.groupLevel;
                            if (element.type == 'int' || element.type == 'long')
                                c_col['dataType'] = 'number';
                            else
                                c_col['dataType'] = element.type;
                            c_col['format'] = element.format;
                            if (element.isSum == true || element.isSum == 'True') {
                                var sumitem = {};
                                sumitem['c_column'] = element.code;
                                sumitem['summaryType'] = 'sum';
                                sumitem['showInc_column'] = element.code;
                                sumitem['displayFormat'] = "Tổng: {0}";
                                sumitem['valueFormat'] = element.format;
                                self.sumary.totalItems.push(sumitem);
                                var groupSumitem = {};
                                groupSumitem['c_column'] = element.code;
                                groupSumitem['summaryType'] = 'sum';
                                groupSumitem['displayFormat'] = "Tổng: {0}";
                                groupSumitem['showInc_column'] = element.code;
                                groupSumitem['valueFormat'] = element.format;
                                self.sumary.groupItems.push(groupSumitem);
                            }

                            if (c_col['dataType'] == "link") {
                                self.columnLink.push(c_col['dataField']);
                                c_col["encodeHtml"] = false;
                            };
                            c_cols.push(c_col);
                        }
                    });
                    col['columns'] = c_cols;
                }
                else {
                    if (self.columnExportDatasource[i].width != 0 && !isNullOrUndefined(self.columnExportDatasource[i].width) && self.columnExportDatasource[i].width != '')
                        col['width'] = self.columnExportDatasource[i].width;
                    if (!isNullOrUndefined(self.columnExportDatasource[i].textAlign))
                        col['alignment'] = self.columnExportDatasource[i].textAlign;
                    col['groupIndex'] = self.columnExportDatasource[i].groupLevel;
                    if (self.columnExportDatasource[i].type == 'int' || self.columnExportDatasource[i].type == 'long')
                        col['dataType'] = 'number';
                    else
                        col['dataType'] = self.columnExportDatasource[i].type;
                    col['format'] = self.columnExportDatasource[i].format;
                    if (self.columnExportDatasource[i].isSum == true || self.columnExportDatasource[i].isSum == 'True') {
                        var sumitem = {};
                        sumitem['column'] = self.columnExportDatasource[i].code;
                        sumitem['summaryType'] = 'sum';
                        sumitem['showInColumn'] = self.columnExportDatasource[i].code;
                        sumitem['displayFormat'] = "Tổng: {0}";
                        sumitem['valueFormat'] = self.columnExportDatasource[i].format;
                        self.sumary.totalItems.push(sumitem);
                        var groupSumitem = {};
                        groupSumitem['column'] = self.columnExportDatasource[i].code;
                        groupSumitem['summaryType'] = 'sum';
                        groupSumitem['displayFormat'] = "Tổng: {0}";
                        groupSumitem['showInColumn'] = self.columnExportDatasource[i].code;
                        groupSumitem['valueFormat'] = self.columnExportDatasource[i].format;
                        self.sumary.groupItems.push(groupSumitem);
                    }

                    if (col['dataType'] == "link") {
                        self.columnLink.push(col['dataField']);
                        col["encodeHtml"] = false;

                    };
                }
                self.export_column_default.push(col)
            }
        }
        self.notChooseColumnToExport = false;
        self.popupConfigVisible = false;
    }

    customTaskResources(e) {
        if (e.length > 0) {
            return e[0].text;
        } else {
            return 'Không có phân công'
        }
    }

    ganttChartConfig() {
        const self = this;
        self.iconClass = "fa fa-spinner fa-spin";
        self.disabled_btn_search = true;
        if (self.utilityId != null || self.utilityId != undefined) {
            if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
                self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
            }
        }
        if (self.Init_query_params.length > 0) {
            self.Init_query_params.forEach(element => {
                if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                    self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                }
            });
        }
        self.startDateRange = self.paramTest.find(x => x.Varible == 'fromdate').Value;
        self.endDateRange = self.paramTest.find(x => x.Varible == 'todate').Value;
        self.currentTime = new Date();
        self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res2: any) => {
            self.ganttChartTaskDataSource = JSON.parse(res2.data[0].task);
            self.ganttChartResourceDataSource = JSON.parse(res2.data[0].resource);
            self.ganttChartDependencyDataSource = JSON.parse(res2.data[0].dependency);
            self.ganttChartAssignmentDataSource = JSON.parse(res2.data[0].resourceAssignment);
            self.iconClass = "fa fa-eye";
            self.disabled_btn_search = false;
        });

    }

    onContentReadyGantt(e) {
        let t: any = document.getElementsByClassName('dx-gantt-view')[0].children[0];
        let d: any = document.getElementsByClassName('dx-gantt-treelist-wrapper')[0];
        let c: any = document.getElementsByClassName('dx-scrollable-wrapper');
        let k: any = document.getElementsByClassName('dx-splitter-initial');
        //  c.style.touchAction = 'pan-y';
        //    c.style.left = '450px'
        // c.style.width = '2500px'
        //   c.style.width = '150%'
        //   t.style.width = ''
        //   d.style.width = '500px'
        t.style.width = '1800px'
        //  k.style.width = '1800px'
    }

    onTaskEditRedirectToForm = async (e: any) => {
        const self = this;
        e.cancel = true;
        self.popupTaskDetailVisible = true;
        self.showTaskDetails(self.gantt.instance.getTaskData(e.key))
    }

    showTaskDetails(data) {
        const self = this;
        data['status'] = self.ganttChartTaskDataSource.find(x => x.id == data.id).status
        self.formPopup.instance.option({
            items: [{
                dataField: 'title',
                label: { text: 'Tên task' },
                editorOptions: {
                    disabled: true
                }
            },
            {
                dataField: 'start',
                label: { text: 'Ngày bắt đầu' },
                editorType: 'dxDateBox',
                editorOptions: {
                    format: 'dd/MM/YYYY',
                    disabled: true
                }

            },
            {
                dataField: 'end',
                label: { text: 'Ngày kết thúc' },
                editorType: 'dxDateBox',
                editorOptions: {
                    format: 'dd/MM/YYYY',
                    disabled: true
                }
            },
            {
                dataField: 'status',
                label: { text: 'Trạng thái' },
                editorType: 'dxTextBox',
                editorOptions: {
                    disabled: true
                }
            },
            {
                dataField: 'progress',
                label: { text: 'Tiến độ' },
                editorType: 'dxNumberBox',
                editorOptions: {
                    min: 0,
                    max: 100,
                    disabled: true
                }

            },
            {
                dataField: 'resources',
                label: { text: 'Người thực hiện' },
                editorType: 'dxTagBox',
                editorOptions: {
                    valueExpr: 'id',
                    displayExpr: 'text',
                    dataSource: self.ganttChartResourceDataSource,
                    value: self.resourcesVal,
                    disabled: true
                }

            }
            ]
        })
        var resources = self.gantt.instance.getTaskResources(data.id);
        data['resources'] = resources
        if (self.formPopup)
            self.formPopup.instance.option('formData', data);
    }

    onDependencyInserting(e) {
        if (e.values.type == 0) {
            this.paramDependency.push({ Varible: 'predecessorId', Value: e.values.predecessorId }, { Varible: 'successorId', Value: e.values.successorId }, { Varible: 'type', Value: e.values.type });
            this.actions.filter(item => {
                if (item.Code == 'DEPENDENCY') {
                    this.action_store(0, item.Code, item.DataSourceID)
                }
            })
        } else {
            this.gantt.instance.refresh();
            abp.notify.warn("Tính năng này chưa phát triển!", undefined, { "position": "top-end" });
        }
    }

    onDependencyInserted(e) {
        this.paramDependency = [];
    }
    onTaskUpdating(e) {
        const self = this;
        let dataUpdated = [];
        if (self.listTaskUpdate.length > 0) {
            for (let i = 0; i < self.listTaskUpdate.length; i++) {
                if (self.listTaskUpdate[i][0].Value == e.key) {
                    self.listTaskUpdate.splice(i, 1)
                }
            }
        }
        let startDateTime: Date = e.newValues.start != null ? e.newValues.start : e.values.start
        let startDate: any = self.formatDate(startDateTime);
        let endDateTime: Date = e.newValues.end != null ? e.newValues.end : e.values.end
        let endDate: any = self.formatDate(endDateTime);
        let progress: any = e.newValues.progress != null ? e.newValues.progress : e.values.progress

        dataUpdated.push({ Varible: 'id', Value: e.key }, { Varible: 'parentId', Value: e.parentId }, { Varible: 'start', Value: startDate }, { Varible: 'end', Value: endDate }, { Varible: 'progress', Value: progress });
        self.listTaskUpdate.push(dataUpdated)
    }

    saveGanttUpdated() {
        const self = this;
        let DataSourceID = self.actions.filter(x => x.Code == "CREATE")[0].DataSourceID
        for (let i = 0; i < self.listTaskUpdate.length; i++) {
            self.paramAddTask = []
            self.paramAddTask = self.listTaskUpdate[i];
            let id = self.listTaskUpdate[i][0].Value
            self.paramAddTask.splice(0, 1)
            self.action_store(id, 'CREATE', DataSourceID)
        }
    }

    formatDate(date: any) {
        let d = new Date(date)
        return moment(d).format('YYYY-MM-DD')
    }

    async onCustomCommandClick(e) {

        const self = this;
        self.paramAddTask = []
        var selectedRowKey = self.gantt.instance.option('selectedRowKey');
        var taskId = self.gantt.instance.getTaskData(selectedRowKey);

        self.actions.filter(async item => {
            if (e.name == 'CREATE' && item.Code == e.name) {
                if (self.paramTest.find(x => x.Varible == 'utilityId') != undefined) {
                    var projectId = self.paramTest.find(x => x.Varible == 'utilityId').Value;
                }
                if (self.paramTest.find(x => x.Varible == 'projectId') != undefined) {
                    var projectId = self.paramTest.find(x => x.Varible == 'projectId').Value;
                }
                if (taskId.parentId != null && self.paramTest.find(x => x.Varible == 'utilityId') == undefined && self.paramTest.find(x => x.Varible == 'projectId') == undefined) {
                    var projectId: any = await self.findProjectIdForGantt(taskId.parentId)
                }
                self.paramAddTask.push({ Varible: 'parentId', Value: taskId.parentId }, { Varible: 'start', Value: taskId.start }, { Varible: 'end', Value: taskId.end }, { Varible: 'projectId', Value: projectId });

                self.action_store(0, e.name, item.DataSourceID)
            } else if (e.name == 'EDIT' && item.Code == 'EDIT') {
                self.action_link(taskId, e.name)
            } else if (e.name == 'SUBTASK' && item.Code == 'CREATE') {
                if (self.paramTest.find(x => x.Varible == 'utilityId') != undefined) {
                    var projectId = self.paramTest.find(x => x.Varible == 'utilityId').Value;
                }
                if (self.paramTest.find(x => x.Varible == 'projectId') != undefined) {
                    var projectId = self.paramTest.find(x => x.Varible == 'projectId').Value;
                }
                if (taskId.parentId != null && self.paramTest.find(x => x.Varible == 'utilityId') == undefined && self.paramTest.find(x => x.Varible == 'projectId') == undefined) {
                    var projectId: any = await self.findProjectIdForGantt(taskId.parentId)
                }
                self.paramAddTask.push({ Varible: 'parentId', Value: taskId.id }, { Varible: 'start', Value: taskId.start }, { Varible: 'end', Value: taskId.end }, { Varible: 'projectId', Value: projectId });
                self.action_store(taskId, item.Code, item.DataSourceID);
            } else if (e.name == 'DELETE' && item.Code == e.name) {
                self.action_store(taskId, e.name, item.DataSourceID)
            } else if (e.name == 'DELETE_DEPENDENCY' && item.Code == e.name) {
                var taskDependency = self.ganttChartDependencyDataSource.find(x => x.predecessorId == taskId.id);
                if (taskDependency != undefined) {
                    self.action_store(taskDependency, e.name, item.DataSourceID)
                } else {
                    abp.notify.error("Không tìm thấy predecessorId", undefined, { "position": "top-end" });
                }
            }
        })
    }
    async findProjectIdForGantt(taskParentId) {
        const self = this;
        let promise = new Promise((resolve, reject) => {
            if (taskParentId.includes('pr')) {
                let projectClick = self.ganttChartTaskDataSource.find(pr => pr.Id == taskParentId).Id
                resolve(projectClick);
            } else {
                let parentId = self.ganttChartTaskDataSource.find(pr => pr.Id == taskParentId).parentId
                self.findProjectIdForGantt(parentId)
            }

        })
        return promise;
    }

    getContextMenuItems() {
        let contextArr: any = [];
        this.actions.filter(item => {
            if (item.Code != 'DEPENDENCY') {
                var itemContext = {}
                if (item.Code === 'CREATE') {
                    itemContext['icon'] = item.Icon;
                    itemContext['text'] = 'Thêm';
                    itemContext['items'] = [{
                        name: 'SUBTASK',
                        text: 'Sub task',
                        icon: 'copy'
                    },
                    {
                        icon: item.Icon,
                        name: item.Code,
                        text: item.ActionName
                    }]
                } else {
                    itemContext['icon'] = item.Icon;
                    itemContext['name'] = item.Code;
                    itemContext['text'] = item.ActionName;
                }

                return contextArr.push(itemContext);
            }

        })
        return contextArr
    }

    action_link_taskboard(e: any, action: any = null) {
        let confirmTitle = JSON.parse(window.localStorage.getItem('actions')).filter(x => x.Code)[0].ConfirmTitle;
        let confirmText = JSON.parse(window.localStorage.getItem('actions')).filter(x => x.Code)[0].ConfirmText;
        let confirmButtonText = JSON.parse(window.localStorage.getItem('actions')).filter(x => x.Code)[0].ConfirmButtonText;
        if (JSON.parse(window.localStorage.getItem('actions')).filter(x => x.Code == action)[0].IsPopupConfirm == true) {
            Swal.fire({
                title: '<h2>' + confirmTitle + '</h2>',
                html: '<h3>' + confirmText + '</h3>',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                allowOutsideClick: false,
                confirmButtonText: confirmButtonText,
                cancelButtonText: 'Đóng'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.localStorage.setItem('UTILITY_ACTION', action);
                    var link = this._label_Action.filter(x => x.Code == action)[0].Value;
                    if (this.displayType == 12) {
                        let taskKey = this.ganttChartTaskDataSource.filter(x => x.id == e.key)
                        link = this.settingLink(link, taskKey, 'REDIRECT');
                    } else {
                        link = this.settingLink(link, e, 'REDIRECT');
                    }

                    if (link == "") {
                        return;
                    } else {
                        if (this.query_params != undefined && this.query_params != "")
                            this.router.navigate([link], { queryParams: JSON.parse(this.query_params) });
                        else {
                            this.router.navigate([link]);
                        }
                    }
                }
            })
        } else if (JSON.parse(window.localStorage.getItem('actions')).filter(x => x.Code)[0].IsPopupConfirm == false || JSON.parse(window.localStorage.getItem('actions')).filter(x => x.Code)[0].IsPopupConfirm == null) {
            window.localStorage.setItem('UTILITY_ACTION', action);
            var link = this._label_Action.filter(x => x.Code == action)[0].Value;
            if (this.displayType == 12) {
                let taskKey = this.ganttChartTaskDataSource.filter(x => x.id == e.key)[0]
                link = this.settingLink(link, taskKey, 'REDIRECT');
            } else {
                link = this.settingLink(link, e, 'REDIRECT');
            }
            if (link == "") {
                return;
            } else {
                if (this.query_params != undefined && this.query_params != "")
                    this.router.navigate([link], { queryParams: JSON.parse(this.query_params) });
                else {
                    this.router.navigate([link]);
                }
            }
        }
    }

    action_store_taskboard(e: any, action: any = null, dataSourceID: any) {
        const self = this;
        var storeName = this._label_Action.filter(x => x.Code == action)[0].Value;
        if (storeName != undefined && storeName != null) {
            if (self.utilityId != null || self.utilityId != undefined) {
                if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
                    self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
                }
            }
            if (self.Init_query_params.length > 0) {
                self.Init_query_params.forEach(element => {
                    if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                        self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                    }
                });
            }
            this._viewUtilityService.actionWithParamId(e.id, storeName, dataSourceID, this.userId_query, self.paramTest).subscribe((res: any) => {
                if (res.code == "SUCCESS") {
                    abp.notify.success("Thành công!", undefined, { "position": "top-end" });

                    // if (storeName == 'CreateGroupChatForRemineTask') {
                    //     this.socket.emit("showChatChannelRedmine", "REDMINE_GROUP_00");
                    // }

                    this.viewreport(false);
                }
                else if (res.code == "ERROR") {
                    abp.notify.error("Có lỗi xảy ra khi thực hiện chức năng trên server.", undefined, { "position": "top-end" });
                    this.viewreport(false);
                }
            }, (err: any) => {
                abp.notify.error(err.error.messages, undefined, { "position": "top-end" });
                this.viewreport(false);
            });
        }
        else
            abp.notify.error('Chưa cấu hình store cho chức năng!', undefined, { "position": "top-end" });
    }
    // async drop(event: CdkDragDrop<string[]>, item: any) {
    //     const self = this;
    //     if (event.previousContainer === event.container) {
    //         moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    //     } else {
    //         if (event.container.disabled == false) {
    //             transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    //             this.taskboard.taskBoard_Update(Number(self.currentReport), event.previousContainer.id, event.container.id, event.item.data["id"]).subscribe(async (res: any) => {
    //                 if (res == "success") {
    //                     await console.log("success");
    //                 }
    //                 else {
    //                     await console.log("fail");
    //                 }
    //             });
    //         }
    //     }
    // }

    async settingActionExportForm(value: any) {
        let valueSplitComma = value.split(",")
        for (var i = 0; i < valueSplitComma.length; i++) {
            let valueSplitColon = valueSplitComma[i].split(":")
            if (valueSplitColon[0].trim() == 'FORMCODE') {
                this.formCode = valueSplitColon[1].trim()
            }
            if (valueSplitColon[0].trim() == 'TEMPLATECODE') {
                this.templateCode = valueSplitColon[1].trim();
            }
            if (valueSplitColon[0].trim() == 'LABELCODE') {
                this.labelcodepopup = valueSplitColon[1].trim();
            }
            if (valueSplitColon[0].trim() == 'LINK') {
                this.linkpopup = valueSplitColon[1].trim();
            }
        }

    }

    async clickExportForm(e: any, action: any) {
        const self = this;
        window.localStorage.setItem('UTILITY_ACTION', action.Code);
        let link = self.actions.filter(x => x.Type == 'LINK')[0].Value;
        self.settingLink(link, e.data, 'REDIRECT')
        self.settingActionExportForm(action.Value)
        // await self.getFormData(e, action);
        self.printUrl = AppConsts.remoteServiceBaseUrl;
        let templateFile = self.dynamicForm.templateFile[0]
        if (templateFile != null || templateFile != undefined) {

            let dataModel = {
                hinFormId: self.dynamicForm.id,
                fileName: templateFile.fileName,
                filePath: templateFile.filePath,
                fileType: templateFile.fileType,
                paramsArray: null,
                codeValue: this.qrdata
            };
            if (templateFile.fileType == 1 || templateFile.fileType == 2 || templateFile.fileType == 5) {//docx, doc, pdf
                self.printUrl += '/ExportFile/GetWordFileTemplate';
                dataModel.paramsArray = JSON.stringify(this.dynamicForm.formData);
            } else {//xlsx, xls
                self.printUrl += '/ExportFile/GetExcelFileTemplate';

                let params = [];

                let _formData = self.dynamicForm.formData;
                for (var key in _formData) {
                    if (_formData.hasOwnProperty(key)) {//check co key
                        let objectData = {
                            Variable: key,
                            Value: _formData[key]
                        }
                        params.push(objectData);
                    }
                }
                dataModel.paramsArray = JSON.stringify(params);
            }
            $.ajax({
                url: self.printUrl,
                method: 'POST',
                data: dataModel,
                xhrFields: {
                    responseType: 'blob'
                },
                success: async function (data) {

                    var a = document.createElement('a');
                    var url = window.URL.createObjectURL(data);
                    var fileType = '';
                    switch (data.type) {
                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            fileType = '.docx';
                            break;
                        case 'application/msword':
                            fileType = '.doc';
                            break;
                        case 'application/vnd.ms-excel':
                            fileType = '.xls';
                            break;
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            fileType = '.xlsx';
                            break;
                        case 'pdf':
                            fileType = '.pdf';
                            break;
                    }

                    a.href = url;
                    var current = new Date();
                    var fullTimeStr = current.getHours().toString() + current.getMinutes() + current.getSeconds()
                        + current.getDate() + (current.getMonth() + 1) + current.getFullYear();
                    a.download = templateFile.name + '_' + fullTimeStr + fileType;
                    document.body.append(a);
                    a.click();
                    a.remove();
                    await window.URL.revokeObjectURL(url);
                }
            });
        }
    }

    // async getFormData(e: any, action: any) {
    //     const self = this;
    //     let promise = new Promise((resolve, reject) => {

    //         self.formViewerService.getFormIdByFormCode(self.formCode).subscribe(result => {
    //             var endTime = performance.now()

    //             if (result.code == "NONE") {
    //                 self.notify.error("Không tìm thấy mã form", undefined, { "position": "bottom-end" });
    //             }
    //             else if (result.code == "FIND_ONE") {

    //                 if (result.data != undefined) {

    //                     if (e.data.Id == undefined) {

    //                         self.formViewerService.formViewerData(result.data, self.query_paramsForm).subscribe(res => {
    //                             if (res.isSucceeded) {
    //                                 self.successLoad = true;
    //                                 self.dynamicForm = res.data;
    //                                 self.dataSourceOptions = self.dynamicForm.services;
    //                                 if (res.data.formData[0] != undefined) {
    //                                     self.dynamicForm.formData = res.data.formData[0];
    //                                     // self.getLabelButton();
    //                                     self.formatFormData(res);
    //                                 } else {
    //                                     self.dynamicForm.formData = {};
    //                                 }
    //                                 if (res.data.templateFile.length > 0) {
    //                                     self.configExportFile(res.data.templateFile);
    //                                     $('#exportBtn').show();
    //                                 }

    //                                 resolve(self.dynamicForm)
    //                             }
    //                             else {
    //                                 self.notify.error(res.message);
    //                             }
    //                         });
    //                     } else {
    //                         self.formViewerService.formViewerDataByRecord(result.data, e.data.Id, self.query_paramsForm).subscribe(res => {
    //                             if (res.isSucceeded) {
    //                                 self.successLoad = true;
    //                                 self.dynamicForm = res.data;
    //                                 self.dataSourceOptions = self.dynamicForm.services;
    //                                 self.dynamicForm.formData = res.data.formData[0];
    //                                 self.qrdata = res.data.codeValue;
    //                                 const utilitAction = localStorage.getItem("UTILITY_ACTION");
    //                                 if (res.data.templateFile.length > 0) {
    //                                     self.configExportFile(res.data.templateFile);
    //                                     $('#exportBtn').show();
    //                                 }
    //                                 self.formatFormData(res);
    //                                 resolve(self.dynamicForm)
    //                             } else {
    //                                 self.notify.error(res.message);
    //                             }
    //                         });
    //                     }
    //                 }
    //             }
    //             else if (result.code == "FIND_MORE_THAN_ONE") {
    //                 self.notify.error("Mã form bị trùng lặp", undefined, { "position": "bottom-end" });
    //             }
    //             else if (result.code == "ERROR") {
    //                 self.notify.error(result.message, undefined, { "position": "bottom-end" });
    //             }
    //         })
    //     })
    //     return promise;

    // }

    configExportFile(templateFile) {
        this.items = [];
        this.sign_items = [];
        if (this.templateCode != null || this.templateCode != undefined) {
            let tmp = templateFile.find(x => x.code == this.templateCode)
            if (tmp.fileType == 1 || tmp.fileType == 2 || tmp.fileType == 5) {
                this.mapFileTemplate.set(tmp.name + " - doc", tmp);
                this.mapFileTemplate.set(tmp.name + " - ing", tmp);
                this.items.push(tmp.name + " - doc");
                this.items.push(tmp.name + " - pdf");
            } else if (tmp.fileType == 3 || tmp.fileType == 4) {
                this.mapFileTemplate.set(tmp.name + " - excel", tmp);
                this.items.push(tmp.name + " - excel");
            }

            if (tmp.fileType == 1 || tmp.fileType == 2 || tmp.fileType == 5) {
                this.sign_items.push(tmp.name + " - pdf");
            }
        } else {
            templateFile.forEach(tmp => {

                if (tmp.fileType == 1 || tmp.fileType == 2 || tmp.fileType == 5) {
                    this.mapFileTemplate.set(tmp.name + " - doc", tmp);
                    this.mapFileTemplate.set(tmp.name + " - pdf", tmp);
                    this.items.push(tmp.name + " - doc");
                    this.items.push(tmp.name + " - pdf");
                } else if (tmp.fileType == 3 || tmp.fileType == 4) {
                    this.mapFileTemplate.set(tmp.name + " - excel", tmp);
                    this.items.push(tmp.name + " - excel");
                }

                if (tmp.fileType == 1 || tmp.fileType == 2 || tmp.fileType == 5) {
                    this.sign_items.push(tmp.name + " - pdf");
                }
            });
        }

    }

    // formatFormData(res: any) {
    //     const self = this;
    //     var selectbox = self.dynamicForm.formFields.filter(e => e.fieldTypeCode == "SelectBox" || e.fieldTypeCode == "RadioGroup");
    //     if (selectbox.length != 0) {
    //         selectbox.forEach(e => {
    //             if (self.dynamicForm.formData[e.code] != undefined) {
    //                 if (!isNaN(Number(self.dynamicForm.formData[e.code])))
    //                     self.dynamicForm.formData[e.code] = Number(self.dynamicForm.formData[e.code]);
    //             }
    //         });
    //     }
    //     var tagbox = self.dynamicForm.formFields.filter(e => e.fieldTypeCode == "TagBox" || e.fieldTypeCode == "DropDownBox");
    //     if (tagbox.length != 0) {
    //         tagbox.forEach(e => {
    //             if (self.dynamicForm.formData[e.code] != undefined) {
    //                 var check = self.dynamicForm.formData[e.code].split(',');
    //                 if (check.length != 0) {
    //                     if (isNaN(check[0])) {
    //                         self.dynamicForm.formData[e.code] = self.dynamicForm.formData[e.code].split(',');
    //                     } else {
    //                         self.dynamicForm.formData[e.code] = self.dynamicForm.formData[e.code].split(',').map(Number).filter(Boolean);
    //                     }
    //                 }
    //             }
    //         });
    //     }
    //     self.dynamicForm.formFields.filter(e => e.fieldTypeCode == "FileUploader").forEach(e => {
    //         e.fileUpload = self.dynamicForm.formData[e.code];
    //     });
    // }
    // //xuất file word hàng loạt
    // iconWord: any = "save";
    // disabled_btn_exportWord: any = false;
    // async onMultipleItemClick(e, action) {
    //     if (this.data.instance.getSelectedRowKeys().length != 0 || this.treeList.instance.getSelectedRowKeys().length != 0) {
    //         const self = this;
    //         var listBenhAnId = this.getSelectedKey();
    //         self.iconWord = "fa fa-spinner fa-spin";
    //         self.disabled_btn_exportWord = true;
    //         var dataParamarray: any;
    //         self.settingActionExportForm(action.Value)
    //         // await this._viewUtilityService.getTemplateFormByCode(self.templateCode).toPromise().then(res => {
    //         //     if (res.code == 'SUCCESS') {
    //         //         self.templateForm = res.data;
    //         //     } else {
    //         //         self.notify.error("Không lấy được template", undefined, { "position": "bottom-end" });
    //         //     }
    //         // })
    //         this.printUrl = AppConsts.remoteServiceBaseUrl;
    //         let templateFile = {
    //             code: self.templateForm[0].code,
    //             fileName: self.templateForm[0].fileName,
    //             filePath: self.templateForm[0].filePath,
    //             fileType: self.templateForm[0].fileType,
    //             name: self.templateForm[0].name
    //         }
    //         if (templateFile != null || templateFile != undefined) {
    //             // let type = -1;
    //             // let fileType = templateFile.fileType.toString();
    //             // if (fileType == 'pdf') {
    //             //     type = 5;
    //             // } else {
    //             //     type = templateFile.fileType;
    //             // }
    //             let dataModel = {
    //                 fileName: templateFile.fileName,
    //                 filePath: templateFile.filePath,
    //                 fileType: templateFile.fileType,
    //                 paramsArray: null,
    //                 codeValue: this.qrdata
    //             };
    //             if (templateFile.fileType == 1 || templateFile.fileType == 2 || templateFile.fileType == 5) {//docx, doc, pdf
    //                 this.printUrl += '/ExportFile/GetMultipleWordFileTemplate';
    //                 dataParamarray = await self.viewerService.getDataExportMultipleWord(listBenhAnId).toPromise();
    //                 dataModel.paramsArray = JSON.stringify(dataParamarray);

    //             }
    //             $.ajax({
    //                 url: this.printUrl,
    //                 method: 'POST',
    //                 data: dataModel,
    //                 xhrFields: {
    //                     responseType: 'blob'
    //                 },
    //                 success: function (data) {

    //                     var a = document.createElement('a');
    //                     var url = window.URL.createObjectURL(data);
    //                     var fileType = '';
    //                     switch (data.type) {
    //                         case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    //                             fileType = '.docx';
    //                             break;
    //                         case 'application/msword':
    //                             fileType = '.doc';
    //                             break;
    //                         case 'application/vnd.ms-excel':
    //                             fileType = '.xls';
    //                             break;
    //                         case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    //                             fileType = '.xlsx';
    //                             break;
    //                         case 'pdf':
    //                             fileType = '.pdf';
    //                             break;
    //                     }

    //                     a.href = url;
    //                     var current = new Date();
    //                     var fullTimeStr = current.getHours().toString() + current.getMinutes() + current.getSeconds()
    //                         + current.getDate() + (current.getMonth() + 1) + current.getFullYear();
    //                     a.download = templateFile.name + '_' + fullTimeStr + fileType;
    //                     document.body.append(a);
    //                     a.click();
    //                     a.remove();
    //                     window.URL.revokeObjectURL(url);
    //                     self.iconWord = "save";
    //                     self.disabled_btn_exportWord = false;
    //                 }
    //             });
    //         }
    //     }
    //     else {
    //         this.notify.error("Chưa chọn dữ liệu", undefined, { "position": "bottom-end" });
    //     }
    // }
    async onMultipleDigitalsign(e: any, action: any) {
        if (this.data.instance.getSelectedRowKeys.length > 0) this.selectedRowsKey = this.data.instance.getSelectedRowKeys();
        if (this.treeList.instance.getSelectedRowKeys.length > 0) this.selectedRowsKey = this.treeList.instance.getSelectedRowKeys();
        if (this.selectedRowsKey.length != 0) {
            var temp = "";
            this.selectedRowsKey.forEach(item => {
                if (item["isKySo"] == null)
                    temp = temp + item["Id"] + ",";
            });
            var result = temp.slice(0, Number(temp.length) - 1);

            let dataModel = {
                data: null
            };
            if (temp == "" || temp == null) {
                this.notify.error("Các dữ liệu chọn đã ký số", undefined, { "position": "bottom-end" });
            }
            else {
                dataModel.data = this.selectedRowsKey[0];
                await this.digitalSign(dataModel, action, result);
            }
        }
        else {
            this.notify.error("Chưa chọn dữ liệu", undefined, { "position": "bottom-end" });
        }
    }

    async digitalSign(e: any, action: any, listiddigitalsign: any) {
        const self = this;

        self.spinnerService.show();

        let digitalSignUrl = "http://localhost:9001/PdfSignService/MultipleSign";

        window.localStorage.setItem('UTILITY_ACTION', action.Code);
        let link = self.actions.filter(x => x.Type == 'LINK')[0].Value;
        self.settingLink(link, e.data, 'REDIRECT')
        self.settingActionExportForm(action.Value)
        // await self.getFormData(e, action);
        self.printUrl = AppConsts.remoteServiceBaseUrl;
        let templateFile = self.dynamicForm.templateFile[0]


        if (templateFile != null || templateFile != undefined) {
            let type = -1;
            e.FileName = templateFile.code;

            let dataModel = {
                "Documents": [{
                    "Url": AppConsts.remoteServiceBaseUrl + "/ExportFile/GetWordFileTemplate",
                    "hinFormId": self.dynamicForm.id,
                    "fileName": templateFile.fileName,
                    "filePath": templateFile.filePath,
                    "fileType": 5,
                    "objectType": 'FORMDATAEMAIL',
                    "paramsArray": null,
                    "codeValue": this.qrdata,
                    "listidcheck": listiddigitalsign,
                    "formcode": this.formCode,
                    "templatecode": this.templateCode
                }]
            };
            await this.ajaxdigitalsign(digitalSignUrl, dataModel);
        }
    }
    ajaxdigitalsign(urldigitalsign: any, datadigital: any) {
        let promise = new Promise((resolve, reject) => {
            const self = this;
            $.ajax({
                url: urldigitalsign,
                method: 'POST',
                data: JSON.stringify(datadigital),
                contentType: "application/json",
                success: function (data) {



                    if (data.Code == "200") {
                        abp.notify.success('Đã kí thành công!', undefined, { "position": "top-end" });

                    } else {
                        this.notify.error(data.Message, undefined, { "position": "bottom-end" });
                    }
                    resolve(data);
                    self.spinnerService.hide();
                },
                error: (e) => {
                    console.error(e);
                    self.spinnerService.hide();
                    this.notify.error("Đã xảy ra lỗi", undefined, { "position": "bottom-end" });
                    reject(e);
                }
            });

        })
        return promise;

    }
    formidpopup: any;
    recordidpopup: any;
    labelcodepopup: any = null;
    linkpopup: any;
    variable_recordid: any[];
    variable_params: any;
    query_params_popup: any = [];
    dataid: any;
    view_only: any;
    async create_popup(e: any, actions: any = null) {
        const self = this;
        this.view_only = 1;
        self.popupFormVisible = true;
        self.settingActionExportForm(actions.Value)

        var link_split = this.linkpopup.split("?")
        if (link_split[1] != null || link_split[1] != undefined) var link_split2 = link_split[1].split("&");
        if (link_split2 != null || link_split2 != undefined) {
            link_split.forEach(temp => {
                let a = temp.split("=");
                var paramTestItem = new Object();
                paramTestItem['Varible'] = a[0];
                paramTestItem['Value'] = a[1];
                self.query_params_popup.push(paramTestItem);
            })
        }

    }
    ClosePopupForm(e) {
        this.popupFormVisible = e.popupFormVisible;
        if (e.Issuccess == true) {
            this.viewreport();
        }
    }
    async action_show_formpopup(e: any, actions: any = null) {
        var self = this;
        if (self.query_params_popup.length > 0) {
            self.query_params_popup.splice(0, self.query_params_popup.length);
        }

        window.localStorage.setItem('UTILITY_ACTION', actions.Code);
        var link = null;

        self.settingActionExportForm(actions.Value)
        link = this.linkpopup;

        //check viewonly
        if (link.indexOf("viewonly") == -1) this.view_only = 1;
        else this.view_only = 2;

        if (e.data == undefined || e.data == null) {
            self.settingLink(link, e, 'REDIRECT');
            this.dataid = e.id;
            this.recordidpopup = e[this.variable_recordid[0]];
        }
        else {
            self.settingLink(link, e.data, 'REDIRECT')
            this.dataid = e.data.Id;
            this.recordidpopup = e.data[this.variable_recordid[0]];
        }

        // await self.getFormDataForPopup(e, actions);
        self.popupFormVisible = true;

        this.formidpopup = self.dynamicForm.id;

        if (this.variable_params != undefined || this.variable_params != null) {
            var variable_params_split = this.variable_params.split("&");
            variable_params_split.forEach(temp => {
                let a = temp.split("=");
                var paramTestItem = new Object();
                paramTestItem['Varible'] = a[0];
                if (e.data == undefined || e.data == null) paramTestItem['Value'] = e[a[1]];
                else paramTestItem['Value'] = e.data[a[1]];
                self.query_params_popup.push(paramTestItem);
            })
        }

    }
    idx: any;
    show(e) {
        this.showit = true;
        this.idx = e;
    }
    hide(e) {
        this.showit = false;
        this.idx = e;
    }
    // async getFormDataForPopup(e: any, action: any) {
    //     const self = this;
    //     let promise = new Promise((resolve, reject) => {

    //         self.formViewerService.getFormIdByFormCode(self.formCode).subscribe(result => {
    //             var endTime = performance.now()

    //             if (result.code == "NONE") {
    //                 self.notify.error("Không tìm thấy mã form", undefined, { "position": "bottom-end" });
    //             }
    //             else if (result.code == "FIND_ONE") {

    //                 if (result.data != undefined) {
    //                     if (e.data == undefined || e.data == null) {
    //                         self.formViewerService.formViewerDataByRecord(result.data, e.id, self.query_paramsForm).subscribe(res => {
    //                             if (res.isSucceeded) {
    //                                 self.successLoad = true;
    //                                 self.dynamicForm = res.data;
    //                                 self.dataSourceOptions = self.dynamicForm.services;
    //                                 self.dynamicForm.formData = res.data.formData[0];
    //                                 self.qrdata = res.data.codeValue;
    //                                 const utilitAction = localStorage.getItem("UTILITY_ACTION");
    //                                 // if (res.data.templateFile.length > 0) {
    //                                 //     self.configExportFile(res.data.templateFile);
    //                                 //     $('#exportBtn').show();
    //                                 // }
    //                                 self.formatFormData(res);
    //                                 resolve(self.dynamicForm)
    //                             } else {
    //                                 self.notify.error(res.message);
    //                             }
    //                         });
    //                     }
    //                     else {
    //                         self.formViewerService.formViewerDataByRecord(result.data, e.data.Id, self.query_paramsForm).subscribe(res => {
    //                             if (res.isSucceeded) {
    //                                 self.successLoad = true;
    //                                 self.dynamicForm = res.data;
    //                                 self.dataSourceOptions = self.dynamicForm.services;
    //                                 self.dynamicForm.formData = res.data.formData[0];
    //                                 self.qrdata = res.data.codeValue;
    //                                 const utilitAction = localStorage.getItem("UTILITY_ACTION");
    //                                 // if (res.data.templateFile.length > 0) {
    //                                 //     self.configExportFile(res.data.templateFile);
    //                                 //     $('#exportBtn').show();
    //                                 // }
    //                                 self.formatFormData(res);
    //                                 resolve(self.dynamicForm)
    //                             } else {
    //                                 self.notify.error(res.message);
    //                             }
    //                         });
    //                     }
    //                 }
    //             }
    //             else if (result.code == "FIND_MORE_THAN_ONE") {
    //                 self.notify.error("Mã form bị trùng lặp", undefined, { "position": "bottom-end" });
    //             }
    //             else if (result.code == "ERROR") {
    //                 self.notify.error(result.message, undefined, { "position": "bottom-end" });
    //             }
    //         })
    //     })
    //     return promise;

    // }
    // importFileExcel(e: any, action) {
    //     const self = this;
    //     if (self.utilityId != null || self.utilityId != undefined) {
    //         if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
    //             self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
    //         }
    //     }
    //     if (self.Init_query_params.length > 0) {
    //         self.Init_query_params.forEach(element => {
    //             if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
    //                 self.paramTest.push({ Varible: element.Varible, Value: element.Value });
    //             }
    //         });
    //     }

    //     this.spinnerService.show();
    //     var url = AppConsts.importServerUrl + '/api/services/app/DRViewer/ImportFileExcel?reportId=' + self.currentReport + "&userId=" + abp.session.userId;;

    //     let dataModel = {
    //         query_param: JSON.stringify(self.paramTest),
    //         file: e.currentTarget.files[0],
    //         sqlinsert: action.Value,
    //         urlimportfile: action.UrlImportFile
    //     };

    //     var formData: FormData = new FormData();
    //     formData.append('query_param', JSON.stringify(self.paramTest));
    //     formData.append('file', e.currentTarget.files[0], e.currentTarget.files[0].name);
    //     formData.append('sqlinsert', action.Value);
    //     formData.append('urlimportfile', action.UrlImportFile);

    //     $.ajax({
    //         url: url,
    //         type: 'POST',
    //         data: formData,
    //         contentType: false,
    //         processData: false,
    //         dataType: 'json',
    //         success: async function (data) {
    //             if (data.result.code == '201') {
    //                 self.spinnerService.hide();
    //                 window.open(AppConsts.fileServerUrl + data.result.data, '_blank');
    //             } else if (data.result.code == '200') {
    //                 self.spinnerService.hide();
    //                 abp.notify.success(data.result.message, undefined, { "position": "top-end" });
    //                 self.viewreport();
    //             }
    //             else {
    //                 self.spinnerService.hide();
    //                 abp.notify.error(data.result.message, undefined, { "position": "top-end" });
    //             }
    //         }
    //     });
 
        // this.http.post(AppConsts.remoteServiceBaseUrl + '/api/services/app/DRViewer/ImportFileExcel?reportId=' + self.currentReport + '&InsertSQL=' + action.Value + '&JsonParam=' + JSON.stringify(self.paramTest), formData).subscribe((res: any) => {
        // this.http.post(AppConsts.remoteServiceBaseUrl + '/api/services/app/DRViewer/ImportFileExcel?reportId=' + self.currentReport, formData).subscribe((res: any) => {
        //     self.spinnerService.hide();
        //     if (res['result']['isSucceeded']) {
        //         abp.notify.success(res['result']['message'], undefined, { "position": "top-end" });
        //         setTimeout(() => {
        //             this.viewreport();
        //         }, 500);
        //         // self.data.instance.refresh();
        //     } else {
        //         abp.notify.error(res['result']['message'], undefined, { "position": "top-end" });
        //     }
        // }, (error: any) => {
        //     self.spinnerService.hide();
        //     abp.notify.error("Có lỗi xảy ra", undefined, { "position": "top-end" });
        // })
    //     e.target.value = '';
    // }
    actionForImport: any;
    selectFile(action) {
        let element: HTMLElement = document.querySelector('input[id="openFileGroup"]') as HTMLElement;
        this.actionForImport = action;
        element.click();
    }
}
