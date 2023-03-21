import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    Inject,
    Optional,
    Input
} from '@angular/core';
import {
    Router, ActivatedRoute,
} from '@angular/router';
import { DxDataGridComponent, DxPopupComponent, DxFormComponent, DxTreeViewComponent } from 'devextreme-angular';
import { isNullOrUndefined } from 'util';
import { delay } from 'q';
import { FormatService } from '../viewer/formatService';
import { DRReportServiceProxy, DRReportServiceServiceProxy, DRLookUpServiceProxy, DRViewerServiceProxy, DRFilterServiceProxy, DrDynamicFieldServiceProxy, DRColumnServiceProxy, DRChartServiceProxy, FParameter, API_BASE_URL } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';

// import * as xlsxParser from 'xlsxParser';

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

}

@Component({
    selector: 'report-detail',
    templateUrl: './detail-component.html',
    styleUrls: ['./detail-component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [FormatService],
})
export class ReportDetailComponent implements OnInit {
    @Input() reportCode:any = undefined;
    
    @ViewChild('data', { static: true }) data: DxDataGridComponent;
    @ViewChild('form', { static: true }) form: DxFormComponent;
    @ViewChild(DxTreeViewComponent, { static: true }) treview: DxTreeViewComponent
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
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
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
    export_column: any;
    dataSourceTest3: any = [];
    pageSize: any = 20;
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
    export_template: any;
    columnLink = [];

    size = { width: 500, height: 500 }
    curentreportid: any;

    //style
    tableVisibility: any = "hidden";
    tableDisplay: any = "none";
    barChartVisibility: any = "hidden";
    barChartDisplay: any = "none";
    pieChartVisibility: any = "hidden";
    pieChartDisplay: any = "none";

    ngOnInit() {
        const self = this;
        this.data.visible = false;
        this.create_grid();
        this.activeRouter.params.subscribe(param => {
            self.reportService.getIdByCode(self.reportCode != undefined? self.reportCode : param.code).subscribe(async (data: any) => {
                console.log(data)
                self.currentReport = data.data[0].id;
                await self.reportService.getById(self.currentReport).subscribe((res: any) => {
                    self.sqlContent = res.data.c.sqlContent;
                    self.reportName = res.data.c.name;
                    self.isDynamicCol = res.data.c.isDynamicColumn;
                    self.typeget = res.data.c.typeGetColumn;
                    self.formId = res.data.c.formID;
                    self.isColumnAutoWidth = res.isColumnAutoWidth;
                    self.displayType = res.data.c.displayType;
                    this.data.visible = true;
                    //this.loadFormitems();

                    this.viewreport();

                    // load template file
                    self.loadTemplateUrl(res.data.c);
                });
            });
        })
    }

    create_grid() {
        $("#dx-grid").dxDataGrid({

        });
    }

    onExporting(e) {
        const self = this;
        var exportTemplate = $("#dx-grid").dxDataGrid("option", "export");
        if(exportTemplate.template == null) return;

        for (var i = 0 ; i < exportTemplate.template.data.length; i++) {
            self.paramTest.forEach((e2) => {
                exportTemplate.template.data[i] = exportTemplate.template.data[i].replace(":" + e2.Varible.toLowerCase(), e2.Value==null?"":e2.Value);
            });
        };

        $("#dx-grid").dxDataGrid("option", "export", {
            template: exportTemplate,
            enabled: true,
            fileName: self.reportName
        });
        
        $("#dx-grid").dxDataGrid("option", "columns", self.export_column);
        $("#dx-grid").dxDataGrid("instance").exportToExcel(false);
        //$("#dx-grid").dxDataGrid("option", "columns", self.column);

        e.cancel = true;
    };

    loadTemplateUrl(res) {
        this.loadTemplate(res);
    }

    loadTemplate(res) {
        // xlsxParser.loadAjaxTemplate("abc.xlsx");
        const self = this;
        var blob = null;


        $.ajax({
            url: AppConsts.fileServerUrl + "/ExportFile/DRGetTemplateFile?reportID="+res.id,
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
        var fileName = template.split('/')[template.split('/').length-1]
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

    loadFormitems() {
        const self = this;
        self.listItem = [];
        self.paramTest = [];
        this.filterService.getFiltersByReportId(self.currentReport).subscribe((res: any) => {
            res.forEach(async element => {
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
                if (element.controltype == 'dxSelectBox') {
                    // lấy danh sách parent của controll
                    if (element.parentComboId != 0) {
                        res.forEach(temp => {
                            if (temp.id == element.parentComboId && temp.controltype == 'dxSelectBox') {
                                parentCode = temp.code;
                                var parentcodeItem = new Object();
                                parentcodeItem['myid'] = element.id;
                                parentcodeItem['myCode'] = element.code;
                                parentcodeItem['parentCode'] = temp.code;
                                self.listParentCode.push(parentcodeItem);
                            }
                        })
                    }
                    //datatype =false - service =true - lookup
                    if (element.dataType == 'False' || element.dataType == false) {
                        await self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                            var obj = {};
                            obj['label'] = { text: element.reportfiltername };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = 2;
                            obj['name'] = element.code;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controltype;
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
                                        const promise = new Promise((resolve) => {
                                            self.serviceService.executeService(element.id, self.currentReport, []).subscribe((res: any) => {
                                                resolve(res);
                                            });
                                        });

                                        return promise;
                                    }
                                },
                                displayExpr: res.colDisplay,
                                valueExpr: res.colValue,
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
                                                        editorOption.dataSource = res;
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
                        await self.lookupService.getAllLookupDetail(element.id).subscribe((res: any) => {
                            var obj = {};
                            obj['label'] = { text: res[0].lookupname };
                            obj['dataField'] = element.code;
                            obj['colSpan'] = 2;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controltype;
                            obj['name'] = element.code;
                            obj['editorOptions'] = {
                                dataSource: res,
                                displayExpr: 'name',
                                valueExpr: 'code',

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
                else {
                    if (element.controltype == 'dxDropDownBox') {
                        self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                            self.serviceService.executeService(element.id, self.currentReport, []).subscribe((res2: any) => {
                                var obj = {};
                                obj['label'] = { text: element.reportfiltername };
                                obj['dataField'] = element.code;
                                obj['colSpan'] = 2;
                                obj['order'] = element.orderid;
                                obj['editorType'] = element.controltype;
                                if (element.required == true || element.required == 'True') {
                                    obj['validationRules'] = [{
                                        type: "required",
                                        message: "Không được để trống mục này."
                                    }];
                                }

                                obj['editorOptions'] = {
                                    dataSource: res2,
                                    displayExpr: res.colDisplay,
                                    valueExpr: res.colValue,
                                    placeholder: "Select a value...",
                                    searchEnable: 'true',
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

                    } else if (element.controltype == 'dxDateBox') {
                        var obj = {};
                        obj['label'] = { text: element.reportfiltername };
                        obj['dataField'] = element.code;
                        obj['colSpan'] = 2;
                        obj['order'] = element.orderid;
                        obj['editorType'] = element.controltype;
                        obj['editorOptions'] = {
                            placeholder: "Chọn ngày...",
                            type: 'date',
                            dateSerializationFormat: "yyyy-MM-dd", // định dạng kiểu date truyền xuống
                            displayFormat: 'dd/MM/yyyy',
                            value: new Date().toLocaleDateString(),
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
                        obj['label'] = { text: element.reportfiltername };
                        obj['dataField'] = element.code;
                        obj['colSpan'] = 2;
                        obj['order'] = element.orderid;
                        obj['editorType'] = element.controltype;
                        if (element.required == true || element.required == 'True') {
                            obj['validationRules'] = [{
                                type: "required",
                                message: "Không được để trống mục này."
                            }];
                        }
                        self.listItem.push(obj);
                        self.listItem.sort(function (a, b) { return a.order - b.order });
                    }

                }

            });

        })

    }
    async viewreport() {
        const self = this;
        // if (!isNullOrUndefined(self.formData)) {
        //     var listkey = Object.keys(self.formData);
        //     listkey.forEach(element => {
        //         var index;
        //         index = self.paramTest.findIndex(x => x.Varible == element);
        //         //self.findIndex(element, self.paramTest, index);
        //         self.paramTest[index].Value = self.formData[element].toString();
        //     })
        // }
        this.findGetParameter();

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
                                $("#dx-grid").dxDataGrid("option","dataSource", res.data);

                                self.parseHtmlContent();

                                abp.notify.success('Thành công!',undefined, { "position": "top-end"});
                            }
                            else {
                                abp.notify.error('Lỗi',undefined, { "position": "top-end"});
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
                                abp.notify.success('Thành công!',undefined, { "position": "top-end"});
                            }
                            else {
                                abp.notify.error('Lỗi',undefined, { "position": "top-end"});
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

            // load template
            console.log("load template!!!");
            //self.loadTemplate("cc.xlsx");

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
                });
            })
        };
        if (this.data && this.data.instance) {
            this.data.instance.refresh();
        };
    }
    async  delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    back() {
        window.history.back();
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
        if (self.typeget == 1) {
            self.columnService.getByReportId(self.currentReport).subscribe((res: any) => {
                if(res.length > 0){
                    self.formatColumn(res);
                }
                else{
                    self.columnService.getColumn(self.currentReport, self.sqlContent).subscribe((res1: any) => {
                        self.formatColumn(res1.data);
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
    }

    formatColumn(res:any[]){
        const self = this;
        var cols = [];
        var exp_cols = [];
        for (var i = 0; i < res.length; i++) {
            var col = {};
            var exp_col ={};

            if ((res[i].isDisplay == true || res[i].isDisplay == 'True') && (res[i].parentCode == undefined || res[i].parentCode == "")) {
                col['caption'] = res[i].name;
                col['sortOrder'] = res[i].groupSort;
                col['dataField'] = res[i].code;
                col['orderId'] = res[i].colNum;

                if(res[i].isParent == true || res[i].isParent == 'True'){
                    var c_cols = [];
                    var exp_c_cols = [];
                    var child_col = res.filter(c => c.parentCode == res[i].code).sort((c1,c2)=> c1.colNum - c2.colNum);
                    child_col.forEach(element => {
                        var c_col = {};
                        if (element.isDisplay == true || element.isDisplay == 'True'){
                        c_col['caption'] = element.name;
                        c_col['sortOrder'] = element.groupSort;
                        c_col['dataField'] = element.code;
                        c_col['orderId'] = element.colNum;
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
                            console.log(c_col['dataType']);
                            console.log(c_col['dataField']);
                            self.columnLink.push(c_col['dataField']);
                            c_col["encodeHtml"] = false;
                            //c_col.dataType = "string";
                        };
                        if(element.isExport == true || element.isExport == 'True'){
                            exp_c_cols.push(c_col);
                        }

                        c_cols.push(c_col);
                    }
                    });
                    exp_cols = exp_cols.concat(exp_c_cols)
                    col['columns'] = c_cols;
                }
                else{
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
                        //col.dataType = "string";
                    };
                    //self.data.instance.addColumn(col);
                    if(res[i].isExport == true || res[i].isExport == 'True'){
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

        $("#dx-grid").dxDataGrid("option","columns", cols);
        $("#dx-grid").dxDataGrid("option","summary", this.sumary);
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
            // this.configReportService.getCanEnterColumnByFormId(this.formId).subscribe(res => {
            //     // this.isColumnAutoWidth = form.isColumnAutoWidth;
            //     this.column = this.flatColumnsToTree(this.configColumns(res), '0');
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

    findGetParameter() {
        const self = this;
        var parameters = window.location.search.substr(1);
        var tmp = [];
        if(parameters != ""){
            parameters.split("&").forEach(function (item) {
                tmp = item.split("=");
                var paramTestItem = new Object();
                paramTestItem['Varible'] = tmp[0];
                paramTestItem['Value'] = decodeURIComponent(tmp[1]);
                self.paramTest.push(paramTestItem);
            });
        }
    }


    stripHtml(html)
    {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || html;
    }

    parseHtmlContent(){
        let data = $("#dx-grid").dxDataGrid("instance").option("dataSource");

        let dataClones = [];

        const self = this;

        for(var i = 0 ; i <data.length; i++){

            let dataClone = {};

            jQuery.each(data[i], function(j, val){
                dataClone[j] = self.stripHtml(val);
            });

            dataClones.push(dataClone);

        }

        $("#dx-grid").dxDataGrid("instance").option("dataSource", dataClones);
    }
}
