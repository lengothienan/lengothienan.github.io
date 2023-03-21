import { Component, OnInit, ViewChild, IterableDiffers, ElementRef, Inject, Optional, OnChanges, Input, SimpleChanges } from '@angular/core';
import {
    Router, ActivatedRoute,
} from '@angular/router';
import { DxDataGridComponent, DxPopupComponent, DxFormComponent, DxTreeViewComponent, DxChartComponent, DxPieChartComponent, DxTooltipComponent, DxTreeListComponent } from 'devextreme-angular';
import { isNullOrUndefined } from 'util';
import { delay } from 'q';
import { DRReportServiceProxy, DRReportServiceServiceProxy, DRLookUpServiceProxy, DRViewerServiceProxy, DRFilterServiceProxy, DrDynamicFieldServiceProxy, FParameter, DRColumnServiceProxy, DRChartServiceProxy } from '@shared/service-proxies/service-proxies';
import { FormatService } from './formatService';
// import $ from jQuery;
// declare var $:JQueryStatic;
import {
    API_BASE_URL,
} from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { stringify } from 'querystring';
import { HttpClient } from '@angular/common/http';
import { DxoItemTextFormatComponent } from 'devextreme-angular/ui/nested';
import { WidgetSimpleItemPercentCircleComponent } from '@app/shared/common/customizable-dashboard/widgets/widget-simple-item-percent-circle/widget-simple-item-percent-circle.component';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import moment from 'moment'
import { isNumeric } from 'jquery';

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

@Component({
    selector: 'report-viewer',
    templateUrl: './viewer-component.html',
    styleUrls: ['./viewer-component.scss'],
    providers: [FormatService],
    //encapsulation: ViewEncapsulation.None
})
export class ReportViewComponent implements OnInit {
    @Input() reportCode: any = undefined;
    //@Input() isFirstRun: any = undefined;
    @ViewChild('data', { static: true }) data: DxDataGridComponent;
    //@ViewChild(DxPopupComponent) popup: DxPopupComponent;
    @ViewChild('form', { static: true }) form: DxFormComponent;
    @ViewChild('barchart', { static: true }) barchart: DxChartComponent;
    @ViewChild('linechart', { static: true }) linechart: DxChartComponent;
    @ViewChild('stackedchart', { static: true }) stackedchart: DxChartComponent;
    @ViewChild('piechart', { static: true }) piechart: DxPieChartComponent;
    @ViewChild(DxTreeViewComponent, { static: true }) treview: DxTreeViewComponent;
    @ViewChild('gridFormConfig', { static: true }) gridFormConfig: DxDataGridComponent;
    @ViewChild('treeList', { static: false }) treeList: DxTreeListComponent;

    constructor(
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
        private http: HttpClient,
 
        //private formColumnService: ColumnServiceProxy,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        this.baseUrl = baseUrl ? baseUrl : "";
    }
    private baseUrl: string;

    iconClass: any = "fa fa-eye";
    disabled_btn_search: any = false;

    currentReport: any;
    formId: any;
    listItem: any;
    sqlContent: any;
    reportName: any;
    formData: any = [];
    column: any;
    export_column: any;
    dataSourceTest3: any = [];
    pageSize: any = 50;
    pageIndex: any = 0;
    pageSizeTreeList: any = 50;
    pageIndexTreeList: any = 0;
    paramTest: any = [];
    paramTestDefault: any = [];
    sumary: any = {};

    ReportOptions: any;
    listParentCode: any = [];
    curentControlData: any;
    isDynamicCol: any;
    typeget: any;
    isColumnAutoWidth: any;
    visible: any = false;
    displayType: any;  // =0 table =1 form =2 biểu đồ cột(barchart) =3 biểu đồ tròn(piechart)
    pieChartDataSource: any = [];
    lineChartDataSource: any = [];
    stackedChartDataSource: any = [];
    seriesField: any;
    ArgumentField: any;
    ValueField: any;
    barChartDataSource: any = [];
    taskBoardDataSource: any = [];
    columnLink = [];
    size = { width: 500, height: 500 }
    curentreportid: any;
    code: any;
    formColCount: any = 2;
    formColSpan: any = 2;
    test = false;
    //style
    tableVisibility: any = "hidden";
    tableDisplay: any = "none";
    barChartVisibility: any = "hidden";
    barChartDisplay: any = "none";
    pieChartVisibility: any = "hidden";
    pieChartDisplay: any = "none";
    lineChartDisplay: any = "none";
    lineChartVisibility: any = "hidden";
    stakedChartDisplay: any = "none";
    stakedChartVisibility: any = "hidden";
    taskBoardDisplay: any = "none";
    taskBoardVisibility: any = "hidden";
    //queryParam
    link_param: any = [];
    query_params: any;
    Init_query_params: any = [];
    disableSearch: any = false;
    isLoadPanelVisible: any = false;
    captchaCode: any = "";
    customizeTooltip1(arg: any) {
        return {
            text: arg.valueText
        };
    }
    form_labelLocation: any = window.outerWidth < 600 ? "top" : "top";

    columnHidingEnabled: any = false;

    // form filter config
    popupConfigVisible: any = false;
    saveFormConfigOptions: any = {};
    closePopupConfigOptions: any = {};
    formGroupConfigs = [];

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
    export_column_default: any;
    treeListVisibility: any = "hidden";
    treeListDisplay: any = "none";
    expanded: boolean;
    totalCount: number = 0;
    captchaBoxDataField = '';
    show_search = false;
    @Input() currentTab: any = undefined;
    @Input() indexchange: any = undefined;
    @Input() tabs: any;
    ngOnChanges(changes: SimpleChanges) {
        const self = this;
        if (changes.indexchange.currentValue != changes.indexchange.previousValue && changes.indexchange.previousValue != undefined && this.currentTab === this.tabs) {
            self.viewreport();
            console.log("index: " + this.indexchange);
            console.log("tabcurrent: " + this.currentTab);
            console.log("tabtab: " + this.tabs);
        }
    }
    ngOnInit() {
        if (window.outerWidth < 500) this.columnHidingEnabled = true;

        window.onresize = () => {
            if (window.outerWidth < 600) this.form_labelLocation = "top";
            else
                this.form_labelLocation = "left";
        };

        const self = this;
        this.findGetParameter()
        this.create_grid();
        //this.popup.visible = true;
        this.data.visible = false;
        debugger
        this.activeRouter.params.subscribe(param => {
            self.reportService.getIdByCode(self.reportCode != undefined ? self.reportCode : param.code).subscribe(async (data: any) => {
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
                    this.data.visible = true;
                    self.expanded = res.data.c.isAutoCollapse;
                    if (res.data.c.colCount != undefined && res.data.c.colSpan != undefined) {
                        self.formColCount = res.data.c.colCount;
                        self.formColSpan = res.data.c.colSpan;
                    }

                    //this.popup.visible = false;
                    await this.loadFormitems();
                    self.loadTemplateUrl(res.data.c);
                    if (!self.disableSearch) self.viewreport();
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
        // setTimeout(() => {
        //     this.createCaptcha();
        // }, 2000);
    }

    // ngOnChanges() {
    //     const self = this;
    //     this.create_grid();
    //     //this.popup.visible = true;
    //     this.data.visible = false;

    //     this.activeRouter.params.subscribe(param => {
    //         self.reportService.getIdByCode(self.reportCode != undefined? self.reportCode : param.code).subscribe(async (data: any) => {
    //             console.log(data)
    //             self.currentReport = data.data[0].id;
    //             self.disableSearch = data.data[0].disableSearch;

    //             await self.reportService.getById(self.currentReport).subscribe((res: any) => {
    //                 self.sqlContent = res.data.c.sqlContent;
    //                 self.reportName = res.data.c.name;
    //                 self.isDynamicCol = res.data.c.isDynamicColumn;
    //                 self.typeget = res.data.c.typeGetColumn;
    //                 self.formId = res.data.c.formID;
    //                 self.isColumnAutoWidth = res.isColumnAutoWidth;
    //                 self.displayType = res.data.c.displayType;
    //                 this.data.visible = true;
    //                 //this.popup.visible = false;
    //                 this.loadFormitems();
    //                 self.loadTemplateUrl(res.data.c);
    //                 if(!self.disableSearch) self.viewreport();
    //             });
    //         });
    //     })
    // }

    create_grid() {

        $("#dx-grid").dxDataGrid({

        });
        $("#dx-tree-list").dxTreeList({

        })
    }

    async onExporting(e) {
        const self = this;
        // const promise = new Promise((resolve, reject) => {
        //     resolve(self.viewreport());
        // });
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
                // topLeftCell: { row: 1, column: 1 },
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
                                    //&& (node.parentNode.nodeName === "P" || node.parentNode.nodeName === "DIV")
                                    // if (node.previousSibling === null && (node.parentNode.nodeName === "P" || node.parentNode.nodeName === "DIV")) {
                                    //     config = { text: "\n" + node.nodeValue }; // <p>, <div>
                                    // } else {
                                    //      config = { text: node.nodeValue };
                                    // }
                                    const fontStyles = _getStylesByParenNodeNames(node);
                                    console.log(ColumnName,1)
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
            url: AppConsts.remoteServiceBaseUrl + "/ExportFile/DRGetTemplateFile?reportID=" + res.id,
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

    async onContentReady(e) {
        if (this.listItem != null && this.listItem != undefined) {


            for (let i = 0; i < this.listItem.length; i++) {
                if (this.listItem[i].cssClass != undefined) {
                    let t: any = document.getElementsByClassName(this.listItem[i].cssClass)[0].getElementsByClassName("dx-layout-manager")[0];
                    let x: any = document.getElementsByClassName(this.listItem[i].cssClass)[0].getElementsByClassName("dx-form-group-content")[0];
                    x.style.paddingTop = "5px";
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
                        switchedOffText: "Hiện",
                        switchedOnText: "Ẩn",
                        // offText: "Hiện",
                        // onText: "Ẩn",
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
                        swoff.style.fontWeight = "800"
                        t.style.display = "unset";
                    } else {
                        let d: any = document.getElementById(this.listItem[i].name).getElementsByClassName("dx-switch-inner")[0]
                        swon.style.color = "#337ab7";
                        swoff.style.color = "#337ab7";
                        swon.style.fontWeight = "800";
                        swoff.style.fontWeight = "800"
                        d.style.marginLeft = "calc(-100% + 40px)";
                        t.style.display = "none";
                    }
                }

                if (document.getElementById('captcha') != null) {
                    this.createCaptcha();
                }
            }
            if (document.getElementById('captcha') != null) {
                this.createCaptcha();
            }
        }
    }


    switchChange(e: any) {
        for (var i = 0; i < this.listItem.length; i++) {
            let d: any = document.getElementById(this.listItem[i].name).getElementsByClassName("dx-switch-inner")[0]
            // console.log(e)
            if (e == false) {
                d.style.marginLeft = "calc(-100% + 40px)";
            }
        }

    }

    async loadFormitems() {
        const self = this;
        self.listItem = [];
        self.listParentCode = [];
        self.paramTest = [];
        self.formData = {};
        await self.loadDefaultfilter();
        this.filterService.getFiltersByReportId(self.currentReport).subscribe(async (res: any) => {
            // reset group item
            self.formGroupConfigs = [];
            if (res.data.length > 0) {
                self.show_search = true;
            }
            //group item
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
                group_obj['order'] = group_element.orderid;
                group_obj['cssClass'] = group_element.code;
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
                            obj['colSpan'] = element.colSpan;
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
                                            self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res1: any) => {
                                                resolve(res1.data);
                                            });
                                        });

                                        return promise;
                                    },
                                    group: element.groupField,
                                },
                                displayExpr: res_1.colDisplay,
                                valueExpr: res_1.colValue,
                                showClearButton: true,
                                searchEnabled: true,
                                width: element.width + "%",
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
                                            self.serviceService.executeServiceWithParam(code.myid, self.currentReport, list_param).subscribe(async (res: any) => {
                                                // await self.form.items.forEach(item => {
                                                //     if (item["dataField"] == self.curentControlData.child) {
                                                //         //item["editorOptions"].dataSource = res;
                                                //         const x = self.form.instance.itemOption(self.curentControlData.child);
                                                //         const editorOption = x.editorOptions;
                                                //         editorOption.dataSource = res.data;
                                                //         self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                //         self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                //     }
                                                // })

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
                                                            self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                        }
                                                    }
                                                })
                                            });
                                        }

                                    });
                                }
                            }
                            //child
                            group_obj['items'].push(obj);
                            group_obj['items'].sort(function (a, b) { return a.order - b.order });
                        }
                        else {
                            let res_2: any = self.getAllLookUpDetail(element.lookupId);
                            var obj = {};
                            obj['label'] = { text: element.reportFilterName };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = element.colSpan;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            obj['name'] = element.code;
                            obj['editorOptions'] = {
                                dataSource: res_2,
                                displayExpr: 'name',
                                valueExpr: 'code',
                                showClearButton: true,
                                width: element.width + "%",
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
                    // tag box
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

                        //get service data if dataType == false
                        if (element.dataType == 'False' || element.dataType == false) {
                            let res__1: any = await self.getServiceById(element.serviceId);
                            if (self.formData[element.code] != undefined) {
                                var value = self.formData[element.code].split(',').map(Number).filter(Boolean)
                            }
                            var obj = {};
                            obj['label'] = { text: element.reportFilterName };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = element.colSpan;
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
                                            self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res1: any) => {
                                                resolve(res1.data);
                                            });
                                        });

                                        return promise;
                                    }
                                },
                                displayExpr: res__1.colDisplay,
                                valueExpr: res__1.colValue,
                                value: value,
                                showClearButton: true,
                                width: element.width + "%",
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
                                                            self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                        }
                                                    }
                                                })
                                            });
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
                            obj['colSpan'] = element.colSpan;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            obj['name'] = element.code;
                            obj['editorOptions'] = {
                                dataSource: res__2,
                                displayExpr: 'name',
                                valueExpr: 'code',
                                showClearButton: true,
                                width: element.width + "%",
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
                    // end tag box
                    else {
                        if (element.controlType == 'dxDropDownBox') {
                            self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                                self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {
                                    var obj = {};
                                    obj['label'] = { text: element.reportFilterName };
                                    obj['dataField'] = element.code;
                                    obj['colSpan'] = element.colSpan;
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
                                        dataSource: res2.data,
                                        displayExpr: res.colDisplay,
                                        valueExpr: res.colValue,
                                        placeholder: "Select a value...",
                                        showClearButton: true,
                                        width: element.width + "%",
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

                            })

                        } else if (element.controlType == 'dxDateBox') {
                            var obj = {};
                            obj['label'] = { text: element.reportFilterName };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = element.colSpan;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            obj['editorOptions'] = {
                                placeholder: "Chọn ngày...",
                                type: 'date',
                                dateSerializationFormat: "yyyy-MM-dd", // định dạng kiểu date truyền xuống
                                displayFormat: 'dd/MM/yyyy',
                                width: element.width + "%",
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
                        }
                        else if (element.controlType == 'treeviewMultiple') {
                            self.serviceService.getById(element.serviceId).subscribe((res: any) => {
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

                            })
                        }
                        else {

                            var obj = {};
                            obj['label'] = { text: element.reportFilterName };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = element.colSpan;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            obj['value'] = "";
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
            res.data.forEach(async element => {

                if (element.groupId != null) return;
                if (element.controlType == 'group') return;

                var data = {
                    id: null,
                    name: null,
                    code: null,
                    value: null,
                };
                var parentCode;
                var paramTestItem = new Object();
                paramTestItem['Varible'] = element.code;
                paramTestItem['Value'] = null;
                var a = self.paramTest.findIndex(x => x.Varible == element.code);
                if (a == -1) self.paramTest.push(paramTestItem);


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
                            obj['colSpan'] = element.colSpan;
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
                            data.name = element.code;
                            data.code = !self.isNullOrUndefined(parentCode) ? parentCode : null;
                            data.value = !self.isNullOrUndefined(self.formData[parentCode]) ? self.formData[parentCode] : null;
                            if (data.id != null && data.name != null && data.code != null && data.value != null) {
                                console.log("load value parent " + element.id);
                                var param = new FParameter();
                                param.value = data.value;
                                param.varible = data.code;
                                self.curentControlData = new Object();
                                self.curentControlData['name'] = data.code;
                                self.curentControlData['value'] = data.value;
                                self.curentControlData['child'] = data.name;

                                var list_param = [];
                                list_param.push(param);
                                list_param = list_param.concat(self.Init_query_params);
                                self.serviceService.executeServiceWithParam(data.id, self.currentReport, list_param).subscribe(async (res: any) => {
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
                                                self.formData[self.curentControlData.name] = self.curentControlData.value;
                                            }
                                        }
                                    })
                                });
                            }

                            obj['editorOptions'] = {
                                dataSource: {
                                    loadMode: 'raw',
                                    load: function () {
                                        const promise = new Promise((resolve, reject) => {
                                            self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res1: any) => {
                                                resolve(res1.data);
                                            });
                                        });

                                        return promise;
                                    },
                                    group: element.groupField,
                                },
                                displayExpr: res.colDisplay,
                                valueExpr: res.colValue,
                                showClearButton: true,
                                width: element.width + "%",
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
                                                            self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                        }
                                                    }
                                                })
                                            });
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
                            obj['colSpan'] = element.colSpan;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            obj['name'] = element.code;
                            obj['editorOptions'] = {
                                dataSource: res,
                                displayExpr: 'name',
                                valueExpr: 'code',
                                showClearButton: true,
                                width: element.width + "%",
                                searchEnabled: true,
                            }
                            if (element.required == true || element.required == 'True') {
                                obj['validationRules'] = [{
                                    type: "required",
                                    message: "Không được để trống mục này."
                                }];
                            }
                            //child
                            self.listItem.push(obj);
                            self.listItem.sort(function (a, b) { return a.order - b.order });
                        });

                    }
                }
                // captchaBox
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

                // tag box
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

                    //get service data if dataType == false
                    if (element.dataType == 'False' || element.dataType == false) {
                        await self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                            if (self.formData[element.code] != undefined) {
                                var value = self.formData[element.code].split(',').map(Number).filter(Boolean)
                            }
                            var obj = {};
                            obj['label'] = { text: element.reportFilterName };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = element.colSpan;
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
                                            self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res1: any) => {
                                                resolve(res1.data);
                                            });
                                        });

                                        return promise;
                                    }
                                },
                                displayExpr: res.colDisplay,
                                valueExpr: res.colValue,
                                value: value,
                                width: element.width + "%",
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
                                                            self.formData[self.curentControlData.name] = self.curentControlData.value;
                                                        }
                                                    }
                                                })
                                            });
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
                            obj['colSpan'] = element.colSpan;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            obj['name'] = element.code;
                            obj['editorOptions'] = {
                                dataSource: res,
                                displayExpr: 'name',
                                valueExpr: 'code',
                                width: element.width + "%",
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
                // end tag box
                else {
                    if (element.controlType == 'dxDropDownBox') {
                        self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                            self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {
                                var obj = {};
                                obj['label'] = { text: element.reportFilterName };
                                obj['dataField'] = element.code;
                                obj['colSpan'] = element.colSpan;
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
                                    dataSource: res2.data,
                                    displayExpr: res.colDisplay,
                                    valueExpr: res.colValue,
                                    placeholder: "Select a value...",
                                    showClearButton: true,
                                    width: element.width + "%",
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

                        })

                    } else if (element.controlType == 'dxDateBox') {
                        var obj = {};
                        obj['label'] = { text: element.reportFilterName };
                        obj['dataField'] = element.code;
                        obj['colSpan'] = element.colSpan;
                        obj['order'] = element.orderid;
                        obj['editorType'] = element.controlType;
                        obj['editorOptions'] = {
                            placeholder: "Chọn ngày...",
                            type: 'date',
                            width: element.width + "%",
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
                    }
                    else if (element.controlType == 'treeviewMultiple') {
                        self.serviceService.getById(element.serviceId).subscribe((res: any) => {
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

                        })
                    }
                    else {

                        var obj = {};
                        obj['label'] = { text: element.reportFilterName };
                        obj['dataField'] = element.code;
                        obj['colSpan'] = element.colSpan;
                        obj['order'] = element.orderid;
                        obj['editorType'] = element.controlType;
                        obj['value'] = "";
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

            });
        })
    }

    recursive_formItem(items: any[], colSpan) {
        const self = this;
        let formItems: any[] = [];
        let formGroupItems: any[] = [];
        //group item
        items.forEach(element => {

            if (element.controlType == 'group')
                var group_obj = {};
            group_obj['caption'] = { text: element.reportFilterName };
            group_obj['colSpan'] = colSpan;
            group_obj['order'] = element.orderid;
            group_obj['itemType'] = element.controlType;
            group_obj['items'] = [];

            items.forEach(element => {

            });

            formItems.push(group_obj);
        });

        // order
        formItems.sort(function (a, b) { return a.order - b.order });

        return formItems;
    }


    async viewreport() {
        const self = this;

        // await self.reportService.getById(self.currentReport).subscribe((res: any) => {
        //     self.loadTemplateUrl(res.data.c);
        // });
        if (self.paramTestDefault.length != 0 && self.paramTest.length == 0) self.paramTest = self.paramTestDefault;
        this.isLoadPanelVisible = true;
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
                    //self.findIndex(element, self.paramTest, index);
                }
            })
        }
        if (self.displayType == 0) {

            self.tableVisibility = "visible";
            self.tableDisplay = "inline-block"
            self.barChartDisplay = "none"
            self.barChartVisibility = "hidden"
            self.pieChartDisplay = "none"
            self.pieChartVisibility = "hidden"
            self.taskBoardDisplay = "none"
            self.taskBoardVisibility = "hiđen"

            self.createColumn();
            self.dataSourceTest3 = {
                load: function () {
                    const promise = new Promise((resolve, reject) => {

                        self.iconClass = "fa fa-spinner fa-spin";
                        self.disabled_btn_search = true;

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
                                resolve(res.data);
                                $("#dx-grid").dxDataGrid("option", "dataSource", res.data);
                                self.parseHtmlContent();
                                self.totalCount = res.data.length;
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

            self.tableVisibility = "hidden"
            self.tableDisplay = "none"
            self.barChartDisplay = "none"
            self.barChartVisibility = "hidden"
            self.pieChartDisplay = "inline-block"
            self.pieChartVisibility = "visible"
            self.lineChartDisplay = "none"
            self.lineChartVisibility = "hidden"
            self.stakedChartDisplay = "none";
            self.stakedChartVisibility = "hidden";
            self.taskBoardDisplay = "none"
            self.taskBoardVisibility = "hiđen"

            self.chartService.getByReportID(self.currentReport).subscribe((res1: any) => {
                self.ArgumentField = res1.argumentField;
                self.ValueField = res1.valueField;
                self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res2: any) => {
                    self.pieChartDataSource = res2.data;
                    if (this.piechart && this.piechart.instance) {
                        this.piechart.instance.refresh();
                    };
                });
            })
        } else if (self.displayType == 2) {


            self.tableVisibility = "hidden"
            self.tableDisplay = "none"
            self.barChartDisplay = "inline-block"
            self.barChartVisibility = "visible"
            self.pieChartDisplay = "none"
            self.pieChartVisibility = "hidden"
            self.lineChartDisplay = "none"
            self.lineChartVisibility = "hidden"
            self.stakedChartDisplay = "none";
            self.stakedChartVisibility = "hidden";
            self.taskBoardDisplay = "none"
            self.taskBoardVisibility = "hiđen"


            // $('#table').css("display", "none");
            // $('#table').css("visibility", "hidden");
            // $('#barChart').css("display", "inline-block");
            // $('#barChart').css("visibility", "visible");
            // $('#pieChart').css("display", "none");
            // $('#pieChar').css("visibility", "hidden");

            self.chartService.getByReportID(self.currentReport).subscribe((res1: any) => {
                self.ArgumentField = res1.argumentField;
                self.ValueField = res1.valueField;
                self.seriesField = res1.seriesField;
                self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res2: any) => {
                    self.barChartDataSource = res2.data;
                    if (this.barchart && this.barchart.instance) {
                        this.barchart.instance.refresh();
                    };
                });
            })
        } else if (self.displayType == 8) {


            self.tableVisibility = "hidden"
            self.tableDisplay = "none"
            self.barChartDisplay = "none"
            self.barChartVisibility = "hidden"
            self.pieChartDisplay = "none"
            self.pieChartVisibility = "hidden"
            self.lineChartDisplay = "none"
            self.lineChartVisibility = "hidden"
            self.stakedChartDisplay = "inline-block";
            self.stakedChartVisibility = "visible";
            self.taskBoardDisplay = "none"
            self.taskBoardVisibility = "hiđen"


            // $('#table').css("display", "none");
            // $('#table').css("visibility", "hidden");
            // $('#barChart').css("display", "inline-block");
            // $('#barChart').css("visibility", "visible");
            // $('#pieChart').css("display", "none");
            // $('#pieChar').css("visibility", "hidden");

            self.chartService.getByReportID(self.currentReport).subscribe((res1: any) => {
                self.ArgumentField = res1.argumentField;
                self.ValueField = res1.valueField;
                self.seriesField = res1.seriesField;
                self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res2: any) => {
                    self.stackedChartDataSource = res2.data;
                    if (this.stackedchart && this.stackedchart.instance) {
                        this.stackedchart.instance.refresh();
                    };
                });
            })
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
            self.taskBoardDisplay = "none";
            self.taskBoardVisibility = "hidden";

            self.createColumn();
            self.dataSourceTest3 = {
                load: function () {
                    const promise = new Promise((resolve, reject) => {

                        self.iconClass = "fa fa-spinner fa-spin";
                        self.disabled_btn_search = true;

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
                                resolve(res.data);

                                $("#dx-tree-list").dxTreeList("option", "dataSource", res.data);
                                self.parseHtmlTreeListContent();
                                self.totalCount = res.data.length;
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
            };
        }
        else if (self.displayType == 9) {


            self.tableVisibility = "hidden"
            self.tableDisplay = "none"
            self.barChartDisplay = "none"
            self.barChartVisibility = "hidden"
            self.pieChartDisplay = "none"
            self.pieChartVisibility = "hidden"
            self.lineChartDisplay = "inline-block"
            self.lineChartVisibility = "visible"
            self.stakedChartDisplay = "none";
            self.stakedChartVisibility = "hidden";
            self.taskBoardDisplay = "none"
            self.taskBoardVisibility = "hiđen"


            // $('#table').css("display", "none");
            // $('#table').css("visibility", "hidden");
            // $('#barChart').css("display", "inline-block");
            // $('#barChart').css("visibility", "visible");
            // $('#pieChart').css("display", "none");
            // $('#pieChar').css("visibility", "hidden");

            self.chartService.getByReportID(self.currentReport).subscribe((res1: any) => {
                self.ArgumentField = res1.argumentField;
                self.ValueField = res1.valueField;
                self.seriesField = res1.seriesField;
                self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res2: any) => {
                    self.lineChartDataSource = res2.data;

                    if (this.linechart && this.linechart.instance) {
                        this.linechart.instance.refresh();
                    };
                });
            })
        };

        if (this.data && this.data.instance) {
            this.data.instance.refresh();
        };

        this.formData[this.captchaBoxDataField] = ''

    }
    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    back() {
        this.formData = [];
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
                    self.buttonStatusExportVisible = true;
                }
                else {
                    self.columnService.getColumn(self.currentReport, self.sqlContent).subscribe((res1: any) => {
                        self.formatColumn(res1.data);
                        self.buttonStatusExportVisible = true;
                    })
                }

            })
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
                col['caption'] = res[i].name;
                col['dataField'] = res[i].code;
                col['orderId'] = res[i].colNum;
                col['fixed'] = res[i].isFreePane;
                col['visible'] = res[i].visible;
                if (res[i].sortByColumn != null && res[i].sortByColumn != '') {
                    let sortType = res.find(x => x.code == res[i].sortByColumn).groupSort
                    col['sortOrder'] = sortType;
                    col['allowSorting'] = sortType != '' && sortType != undefined ? true : false;
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
                                //c_col.dataType = "string";
                            };
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
                        //col.dataType = "string";
                    };
                    //self.data.instance.addColumn(col);
                    if (res[i].isExport == true || res[i].isExport == 'True') {
                        exp_col = col;
                        exp_cols.push(exp_col);
                    }
                }

                cols.push(col);
            }
        }

        cols.sort(function (a, b) { return a.orderId - b.orderId });
        exp_cols.sort(function (a, b) { return a.orderId - b.orderId });

        self.column = cols;
        self.export_column = exp_cols;

        $("#dx-grid").dxDataGrid("option", "columns", cols);
        $("#dx-tree-list").dxTreeList("option", "columns", cols)
        $("#dx-grid").dxDataGrid("option", "summary", this.sumary);
        //self.data.instance.option("columns",cols)
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

    treeView_itemSelectionChanged(e, arg) {
        var value = arg.component.getSelectedNodesKeys();
        e.component.option("value", value);
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
        return tmp.textContent || tmp.innerText;
        //  || html;
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

    // parseHtmlContentForExport() {
    //     debugger
    //     let data = $("#dx-grid").dxDataGrid("instance").option("dataSource");
    //     let dataClones = [];

    //     const self = this;

    //     for (var i = 0; i < data.length; i++) {

    //         let dataClone = {};

    //         jQuery.each(data[i], function (j, val) {
    //             dataClone[j] = self.stripHtml(val);
    //         });

    //         dataClones.push(dataClone);

    //     }

    //     // $("#dx-grid").dxDataGrid("instance").option("dataSource", dataClones);
    //     self.data.instance.option("dataSource", dataClones)
    //     console.log(self.data.instance.option("dataSource", dataClones))
    // }


    findGetParameter() {
        const self = this;
        var parameters = window.location.search.substr(1);
        var tmp = [];
        if (parameters != "") {
            parameters.split("&").forEach(function (item) {
                tmp = item.split("=");
                var paramTestItem = new Object();
                paramTestItem['Varible'] = tmp[0];
                paramTestItem['Value'] = decodeURIComponent(tmp[1]);
                self.Init_query_params.push(paramTestItem);
            });
        }
    }

    async loadDefaultfilter() {
        const self = this;
        self.paramTestDefault = [];
        let promise = new Promise((resolve, reject) => {
            self.viewerService.postDefaultFilterData(self.currentReport, self.Init_query_params).subscribe((res: any) => {
                if (res.isSucceeded) {
                    if (res.data != null) self.formData = res.data[0];
                    if (self.formData != null || self.formData != undefined) {
                        var listkey = Object.keys(self.formData);
                        listkey.forEach(element => {
                            self.paramTestDefault.push({ Varible: element, Value: null });
                        })
                    }

                    resolve(res.data);
                } else {
                    abp.notify.error(res.Message, "Có lỗi ở cấu hình filter mặc định", { "position": "top-end" });
                    reject(res.Message);
                }
            });
        });

        return promise;


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

    linkDownLoadTemplate: any = '';
    downloadTemplate() {
        const self = this;
        // if (this.linkDownLoadTemplate == '') {
        if (self.Init_query_params.length > 0) {
            self.Init_query_params.forEach(element => {
                if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
                    self.paramTest.push({ Varible: element.Varible, Value: element.Value });
                }
            });
        }
        self.http.post(AppConsts.remoteServiceBaseUrl + '/api/services/app/DRViewer/EditorTemplateAsyncc?object_id=' + self.currentReport, self.paramTest).subscribe(res => {
            if (res['result']['isSucceeded']) {
                self.linkDownLoadTemplate = res['result']['data'];
                var link = AppConsts.remoteServiceBaseUrl + "/" + self.linkDownLoadTemplate;
                window.open(link, '_blank');
            } else {
                abp.notify.error(res['result']['message'], undefined, { "position": "top-end" });
            }
        })
        // } else {
        //     var link = AppConsts.importServerUrl + "/" + this.linkDownLoadTemplate;
        //     window.open(link, '_blank');
        // }
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

    }
    validateCaptcha = () => this.code;


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
    onToolbarPreparing = async (e) => {
        const self = this;
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        }, {
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
}

