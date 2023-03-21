import { HIN_DashboardsServiceProxy } from './../../../../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit, OnDestroy, Input, ViewChild, ViewEncapsulation, Optional, Inject } from '@angular/core';
import { API_BASE_URL, DRReportServiceProxy, DRReportServiceServiceProxy, DRLookUpServiceProxy, DRViewerServiceProxy, DRFilterServiceProxy, DrDynamicFieldServiceProxy, DRColumnServiceProxy, DRChartServiceProxy, FParameter, DashboardCustomizationServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { WidgetComponentBase } from '../widget-component-base';
import { isNullOrUndefined } from 'util';
import { DxDataGridComponent, DxFormComponent, DxTreeViewComponent, DxChartComponent, DxPieChartComponent } from 'devextreme-angular';
import { FormatService } from '@app/main/dynamic-report/viewer/formatService';
import { ActivatedRoute } from '@angular/router';

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
    selector: 'app-widget-datagrid-chart-views',
    templateUrl: './widget-datagrid-chart-views.component.html',
    styleUrls: ['./widget-datagrid-chart-views.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [FormatService],
})
export class WidgetDatagridChartViewsComponent extends WidgetComponentBase implements OnInit, OnDestroy {
    @Input() public widgetId: any;

    @ViewChild('data', { static: true }) data: DxDataGridComponent;
    @ViewChild('form', { static: true }) form: DxFormComponent;
    @ViewChild(DxTreeViewComponent, { static: true }) treview: DxTreeViewComponent;
    @ViewChild('barchart', { static: true }) barchart: DxChartComponent;
    @ViewChild('piechart', {static: true}) piechart: DxPieChartComponent;

    constructor(
        injector: Injector,
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
        private _dashboardCustomizationServiceProxy: HIN_DashboardsServiceProxy,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        super(injector);
        this.baseUrl = baseUrl ? baseUrl : "";
    }
    private baseUrl: string;
    currentReport: any;
    formId: any;
    listItem: any;
    sqlContent: any;
    reportName: any;
    formData: any = [];
    column: any;
    dataSourceTest3: any = [];
    pageSize: any = 50;
    pageIndex: any = 0;
    paramTest: any = [];
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
    seriesField: any;
    ArgumentField: any;
    ValueField: any;
    barChartDataSource: any = [];
    columnLink = [];

    size = { width: 500, height: 500 }
    curentreportid: any;

    formCol: any = 4;
    test = false;
    existForm = false;
    resolveOverlappingTypes = ["shift", "hide", "none"];

    //style
    tableVisibility: any = "hidden";
    tableDisplay: any = "none";
    barChartVisibility: any = "hidden";
    barChartDisplay: any = "none";
    pieChartVisibility: any = "hidden";
    pieChartDisplay: any = "none";

    ngOnInit() {
        const self = this;
        this.create_grid();
        this.data.visible = false;
        self._dashboardCustomizationServiceProxy.getConfigDetailWidgetsById(this.widgetId).subscribe((res: any) => {
            if (res.data.length > 0) {
                // var code = "TKTTXLVBD";
                //var code = "testpiechart";
                var data = res.data;
                //
                var code = data.find(item => item["Key"] == "ReportCode").Value;
                self.reportService.getIdByCode(code).subscribe((data: any) => {
                    self.currentReport = data.data[0].id;
                    self.reportService.getById(self.currentReport).subscribe((res: any) => {
                        self.sqlContent = res.data.c.sqlContent;
                        self.reportName = res.data.c.name;
                        self.isDynamicCol = res.data.c.isDynamicColumn;
                        self.typeget = res.data.c.typeGetColumn;
                        self.formId = res.data.c.formID;
                        self.isColumnAutoWidth = res.isColumnAutoWidth;
                        self.displayType = res.data.c.displayType;
                        this.data.visible = true;
                        //this.popup.visible = false;
                        this.loadFormitems();
                        self.loadTemplateUrl(res.data.c);
                        if (!this.existForm) {
                            this.viewreport();
                        }
                    });
                });
            }
        });
    }

    create_grid() {
        $("#dx-grid").dxDataGrid({

        });
    }

    onExporting(e) {
        // Handler of the "exporting" event
        
        // this.parseHtmlContent()
        e.cancel = true;
        $("#dx-grid").dxDataGrid("instance").exportToExcel(false);
    };

    loadTemplateUrl(res) {
        this.loadTemplate(res);
    }

    loadTemplate(res) {
        // xlsxParser.loadAjaxTemplate("abc.xlsx");
        const self = this;
        var blob = null;

        $.ajax({
            url: self.baseUrl + "/ExportFile/DRGetTemplateFile?reportID=" + res.id,
            method: 'GET',
            xhrFields: {
                responseType: 'blob',

            },
            success: function (data) {
                self.loadTemplateFile(res.excel, data);
            }
        });
    }

    loadTemplateFile(template, blobFile) {
        const self = this;
        var fileName = template.split('/')[template.split('/').length - 1]
        var file = new File([blobFile], fileName);
        xlsxParser.parse(file).then(function (data) {
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

    loadFormitems() {
        const self = this;
        self.listItem = [];
        self.paramTest = [];
        this.filterService.getFiltersByReportId(self.currentReport).subscribe((res: any) => {
            var i = 0;
            if (res.data.length > 0)
                this.existForm = true;
            res.data.forEach(async element => {
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
                            obj['colSpan'] = 2;
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
                                            self.serviceService.executeService(element.id, self.currentReport, []).subscribe((res1: any) => {
                                                resolve(res1.data);
                                            });
                                        });
                                        return promise;
                                    }
                                },
                                displayExpr: res.colDisplay,
                                valueExpr: res.colValue,
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
                                            param.value = key.value;
                                            param.varible = code.parentCode;
                                            self.curentControlData = new Object();
                                            self.curentControlData['name'] = control;
                                            self.curentControlData['value'] = key.value;
                                            self.curentControlData['child'] = code.myCode
                                            var list_param = [];
                                            list_param.push(param);

                                            self.serviceService.executeServiceWithParam(code.myid, self.currentReport, list_param).subscribe(async (res: any) => {
                                                await self.form.items.forEach(item => {
                                                    if (item["dataField"] == self.curentControlData.child) {
                                                        //item["editorOptions"].dataSource = res;
                                                        const x = self.form.instance.itemOption(self.curentControlData.child);
                                                        const editorOption = x.editorOptions;
                                                        editorOption.dataSource = res.data;
                                                        self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                        self.formData[self.curentControlData.name] = self.curentControlData.value;
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
                            obj['colSpan'] = 2;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            obj['name'] = element.code;
                            obj['editorOptions'] = {
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
                            var obj = {};
                            obj['label'] = { text: element.reportFilterName };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = 2;
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
                                            self.serviceService.executeService(element.id, self.currentReport, []).subscribe((res1: any) => {
                                                resolve(res1.data);
                                            });
                                        });
                                        return promise;
                                    }
                                },
                                displayExpr: res.colDisplay,
                                valueExpr: res.colValue,
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

                                            self.serviceService.executeServiceWithParam(code.myid, self.currentReport, list_param).subscribe(async (res: any) => {
                                                await self.form.items.forEach(item => {
                                                    if (item["dataField"] == self.curentControlData.child) {
                                                        //item["editorOptions"].dataSource = res;
                                                        const x = self.form.instance.itemOption(self.curentControlData.child);
                                                        const editorOption = x.editorOptions;
                                                        editorOption.dataSource = res.data;
                                                        self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
                                                        self.formData[self.curentControlData.name] = self.curentControlData.value;
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
                            obj['colSpan'] = 2;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            obj['name'] = element.code;
                            obj['editorOptions'] = {
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
                // end tag box
                else {
                    if (element.controlType == 'dxDropDownBox') {
                        self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                            self.serviceService.executeService(element.id, self.currentReport, []).subscribe((res2: any) => {
                                var obj = {};
                                obj['label'] = { text: element.reportFilterName };
                                obj['dataField'] = element.code;
                                obj['colSpan'] = 2;
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
                        obj['colSpan'] = 2;
                        obj['order'] = element.orderid;
                        obj['editorType'] = element.controlType;
                        obj['editorOptions'] = {
                            placeholder: "Chọn ngày...",
                            type: 'date',
                            dateSerializationFormat: "yyyy-MM-dd", // định dạng kiểu date truyền xuống
                            displayFormat: 'dd/MM/yyyy',
                        }

                        if (element.required == true || element.required == 'True') {
                            obj['validationRules'] = [{
                                type: "required",
                                message: "Không được để trống mục này."
                            }];
                        }
                        self.listItem.push(obj);
                        self.listItem.sort(function (a, b) { return a.order - b.order });
                    } else {

                        var obj = {};
                        obj['label'] = { text: element.reportFilterName };
                        obj['dataField'] = element.code;
                        obj['colSpan'] = 2;
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
    async viewreport() {
        const self = this;
        if (!isNullOrUndefined(self.formData)) {
            var listkey = Object.keys(self.formData);
            listkey.forEach(element => {
                var index;
                index = self.paramTest.findIndex(x => x.Varible == element);
                if (!isNullOrUndefined(self.formData[element])) {
                    self.paramTest[index].Value = self.formData[element].toString();
                } else {
                    self.paramTest[index].Value = null;
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

            self.createColumn();
            self.dataSourceTest3 = {
                load: function () {
                    const promise = new Promise((resolve, reject) => {

                        self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res: any) => {
                            if (res.isSucceeded == true) {
                                resolve(res.data);
                                $("#dx-grid").dxDataGrid("option", "dataSource", res.data);
                                self.parseHtmlContent();
                                //abp.notify.success('Thành công!');
                            }
                            else {
                                //abp.notify.error('Lỗi');
                                resolve(res.data);
                            }
                        });
                    });
                    return promise;

                },
                byKey: function (key, extra) {
                    const promise = new Promise((resolve) => {

                        self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res: any) => {
                            if (res.isSucceeded == true) {
                                resolve(res.data);
                                //abp.notify.success('Thành công!');
                            }
                            else {
                                //abp.notify.error('Lỗi');
                                resolve(res.data);
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
        };
        if (this.data && this.data.instance) {
            this.data.instance.refresh();
        };
    }

    back() {
        this.formData = [];
    }
    createColumn() {
        const self = this;
        self.column = [];
        self.columnLink = [];
        self.sumary = {
            groupItems: [],
            totalItems: []
        }
        if (self.typeget == 1) {
            self.columnService.getByReportId(self.currentReport).subscribe((res: any) => {
                var cols = [];
                for (var i = 0; i < res.length; i++) {
                    var col = {};

                    if (res[i].isDisplay == true || res[i].isDisplay == 'True') {
                        col['caption'] = res[i].name;
                        col['sortOrder'] = res[i].groupSort;
                        col['dataField'] = res[i].code;
                        col['orderId'] = res[i].colNum;
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
                            console.log(col['dataType']);
                            console.log(col['dataField']);
                            self.columnLink.push(col['dataField']);
                            col["encodeHtml"] = false;
                        };

                        cols.push(col);

                    }
                }
                cols.sort(function (a, b) { return a.orderId - b.orderId });
                self.column = cols;

                $("#dx-grid").dxDataGrid("option", "columns", cols);
                $("#dx-grid").dxDataGrid("option", "summary", this.sumary);
            })
        }
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
}
