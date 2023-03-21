import { ActionButtonServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    Inject,
    Optional,

} from '@angular/core';
import {
    Router, ActivatedRoute,
} from '@angular/router';
import { DxDataGridComponent, DxPopupComponent, DxFormComponent, DxTreeViewComponent, DxChartComponent } from 'devextreme-angular';
import { isNullOrUndefined } from 'util';
import { delay } from 'q';
import { DRReportServiceProxy, DRReportServiceServiceProxy, DRLookUpServiceProxy, DRViewerServiceProxy, DRFilterServiceProxy, DrDynamicFieldServiceProxy, FParameter, DRColumnServiceProxy, DRChartServiceProxy, PlanServiceProxy } from '@shared/service-proxies/service-proxies';
import { FormatService } from './formatService';

import {
    API_BASE_URL,
} from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { stringify } from 'querystring';
import { KetQuaCongTacPhongComponent } from '@app/main/qlkh-cv/popup/ket-qua-cong-tac-phong/ket-qua-cong-tac-phong.component';
import { ChiTietPhanCongNVComponent } from '@app/main/qlkh-cv/popup/chi-tiet-phan-cong-nv/chi-tiet-phan-cong-nv.component';
import { KetQuaCongTacDoiComponent } from './../../qlkh-cv/popup/ket-qua-cong-tac-doi/ket-qua-cong-tac-doi.component';
import { BaoCaoKetQuaComponent } from './../../qlkh-cv/popup/bao-cao-ket-qua/bao-cao-ket-qua.component';

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
    selector: 'report-viewer-plan',
    templateUrl: './viewer-plan-component.html',
    styleUrls: ['./viewer-plan-component.scss'],
    providers: [FormatService],
    //encapsulation: ViewEncapsulation.None
})
export class ReportViewPlanComponent implements OnInit {
    @ViewChild('data', { static: true }) data: DxDataGridComponent;
    //@ViewChild(DxPopupComponent) popup: DxPopupComponent;
    @ViewChild('form', { static: true }) form: DxFormComponent;
    @ViewChild('barchart', { static: true }) barchart: DxChartComponent;
    @ViewChild(DxTreeViewComponent, { static: true }) treview: DxTreeViewComponent;
    @ViewChild('ketQuaCongTacPhong', { static: false }) ketQuaCongTacPhong: KetQuaCongTacPhongComponent;
    @ViewChild('chiTietPhanCongNV', { static: false }) chiTietPhanCongNV: ChiTietPhanCongNVComponent;
    @ViewChild('baoCaoKetQua', { static: false }) baoCaoKetQua: BaoCaoKetQuaComponent;
    @ViewChild('ketQuaCongTacDoi', { static: false }) ketQuaCongTacDoi: KetQuaCongTacDoiComponent;

    constructor(
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
        private _actionButtonService: ActionButtonServiceProxy,
        private _planServiceProxy: PlanServiceProxy,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        this.baseUrl = baseUrl ? baseUrl : "";
    }
    totalCount: number = 0;

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

    //style
    tableVisibility: any = "hidden";
    tableDisplay: any = "none";
    barChartVisibility: any = "hidden";
    barChartDisplay: any = "none";
    pieChartVisibility: any = "hidden";
    pieChartDisplay: any = "none";

    //Danh sách tham số button Action
    LabelCode: any;
    XN_KCL: boolean = false;
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
        update_results_team: false
    };

    show_search: any = false;
    ngOnInit() {
        const self = this;

        this.activeRouter.params.subscribe(param => {
            //self.LabelId = self.activeRouter.snapshot.queryParams['LabelId'];
            self.LabelCode = param.labelCode;
            this.create_grid();
            //this.popup.visible = true;
            this.data.visible = false;

            // self._actionButtonService.getActionButtonByLabelCode(self.LabelCode).subscribe((res: any) => {
            //     if (res.data.length > 0) {
            //         res.data.forEach(item => {
            //             self.onShowActionButton(item.Code);
            //         });

                    this.activeRouter.params.subscribe(param => {
                        self.reportService.getIdByCode(param.code).subscribe((data: any) => {
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
                                self.viewreport();
                            });
                        });
                    })
           //     }
            //});
        });

    }

    create_grid() {

        $("#dx-grid").dxDataGrid({

        });
        $("#dx-form").dxForm({

        });
    }

    onExporting(e) {
        const self = this;
        var exportTemplate = $("#dx-grid").dxDataGrid("option", "export");
        for (var element in exportTemplate.template.data) {
            self.paramTest.forEach((e2) => {
                element = element.replace(e2.Varible, e2.Value);
            });
        };

        $("#dx-grid").dxDataGrid("option", "export", {
            template: exportTemplate,
            enabled: true,
            fileName: self.reportName
        });

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

    loadFormitems() {
        const self = this;
        self.listItem = [];
        self.paramTest = [];
        this.filterService.getFiltersByReportId(self.currentReport).subscribe((res: any) => {
            var i = 0;
            if (res.data.length > 0) {
                self.show_search = true;
            }
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
                                            self.serviceService.executeService(element.id, self.currentReport, null).subscribe((res1: any) => {
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
                        obj['colSpan'] = 2;
                        obj['order'] = element.orderid;
                        obj['editorType'] = element.controlType;
                        obj['name'] = element.code;
                        obj['editorOptions'] = {
                            searchEnabled: false,
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
                                                self.serviceService.executeService(element.id, self.currentReport, null).subscribe((res1: any) => {
                                                    resolve(res1.data);
                                                });
                                            });

                                            return promise;
                                        }
                                    },
                                    displayExpr: res.colDisplay,
                                    valueExpr: res.colValue,
                                    showClearButton: true,
                                    searchEnabled: false,
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
                }
                else {
                    if (element.controlType == 'dxDropDownBox') {
                        self.serviceService.getById(element.serviceId).subscribe((res: any) => {
                            self.serviceService.executeService(element.id, self.currentReport, null).subscribe((res2: any) => {
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
        $("#dx-form").dxForm("option", "formData", self.formData);
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
                //self.findIndex(element, self.paramTest, index);

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

            self.createColumn();
            self.dataSourceTest3 = {
                loadMode: 'raw',
                load: function () {
                    const promise = new Promise((resolve, reject) => {
                        self._actionButtonService.getActionButtonByLabelCode(self.LabelCode).subscribe((res: any) => {
                            self.action_button = {
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
                                update_results_team: false
                            };
                            if (res.data.length > 0) {
                                res.data.forEach(item => {
                                    self.onShowActionButton(item.Code);
                                });
                            }

                            self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res: any) => {
                                if (res.isSucceeded == true) {
                                    resolve(res.data);
                                    console.log(res);
                                    self.totalCount = res.data.length;
    
                                    $("#dx-grid").dxDataGrid("option", "dataSource", res.data);
    
                                    self.parseHtmlContent();
                                    document.getElementsByClassName('dx-group-panel-message')[0].innerHTML = '';
    
                                    abp.notify.success('Thành công!');
                                }
                                else {
                                    abp.notify.error('Lỗi');
                                    resolve(res.data);
                                }
                            });
                        });
                    });
                    return promise;

                },
                byKey: function (key, extra) {
                    const promise = new Promise((resolve) => {

                        self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res: any) => {
                            if (res.isSucceeded == true) {
                                resolve(res.data);
                                self.totalCount = res.data.length;
                                document.getElementsByClassName('dx-group-panel-message')[0].innerHTML = '';
                                abp.notify.success('Thành công!');
                            }
                            else {
                                abp.notify.error('Lỗi');
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
            self.pieChartVisibility = "visible"
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
                });
            })
        };
        if (this.data && this.data.instance) {
            this.data.instance.refresh();
        };
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
                            //col.dataType = "string";
                        };
                        //self.data.instance.addColumn(col);

                        cols.push(col);

                    }
                }

                var colXL = {};
                colXL['caption'] = "Xử lý";
                colXL['cellTemplate'] = "customTemplate";
                colXL['alignment'] = "center";
                colXL['width'] = "90px";
                colXL['orderId'] = 2;
                cols.push(colXL);

                cols.sort(function (a, b) { return a.orderId - b.orderId });
                self.column = cols;

                $("#dx-grid").dxDataGrid("option", "columns", cols);
                $("#dx-grid").dxDataGrid("option", "summary", this.sumary);
                //self.data.instance.option("columns",cols)
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

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        });
    }

    onShowActionButton(code) {
        var self = this;
        switch (code) {
            case 'EDIT':
                self.action_button.edit = true;
                break;
            case 'RESULTS':
                self.action_button.results = true;
                break;
            case 'PAUSE':
                self.action_button.pause = true;
                break;
            case 'DELETE':
                self.action_button.delete = true;
                break;
            case 'CANCEL':
                self.action_button.cancel = true;
                break;
            case 'REOPEN':
                self.action_button.reopen = true;
                break;
            case 'VIEW':
                self.action_button.view = true;
                break;
            case 'UPDATE_RESULTS':
                self.action_button.update_results = true;
                break;
            case 'ASSIGNMENT_DUTIES':
                self.action_button.assignment_duties = true;
                break;
            case 'GANTT_CHART':
                self.action_button.gantt_chart = true;
                break;
            case 'TEAM_RESULTS':
                self.action_button.team_results = true;
                break;
            case 'TRIPS_REPORT':
                self.action_button.trips_report = true;
                break;
            case 'EDIT_TEAM':
                self.action_button.edit_team = true;
                break;
            case 'VIEW_TEAM':
                self.action_button.view_team = true;
                break;
            case 'UPDATE_RESULTS_TEAM':
                self.action_button.update_results_team = true;
                break;
            default:
                break;
        }
    }

    pause(e) {
        this._planServiceProxy
            .updateStatusPauseAndCancel(e.data.Id, 3)
            .subscribe((res: any) => {
                if (res.isSucceeded == true) {
                    abp.notify.success("Đã tạm ngưng.");
                    this.viewreport();
                } else {
                    abp.notify.error("Lỗi.");
                }
            });
    }

    delete(e) {
        this._planServiceProxy.deletePlan(e.data.Id).subscribe((res: any) => {
            if (res.isSucceeded == true) {
                abp.notify.success('Đã xoá.');
                this.viewreport();
            }
            else {
                abp.notify.error('Lỗi');
            }
        });
    }

    cancel(e) {
        this._planServiceProxy
            .updateStatusPauseAndCancel(e.data.Id, 4)
            .subscribe((res: any) => {
                if (res.isSucceeded == true) {
                    abp.notify.success("Đã hủy bỏ.");
                    this.viewreport();
                } else {
                    abp.notify.error("Lỗi.");
                }
            });
    }

    reopen(e) {
        this._planServiceProxy
            .updateStatusPauseAndCancel(e.data.Id, 1)
            .subscribe((res: any) => {
                if (res.isSucceeded == true) {
                    abp.notify.success("Đã mở lại.");
                    this.viewreport();
                } else {
                    abp.notify.error("Lỗi.");
                }
            });
    }

    view(e) {
        window.localStorage.setItem('PLANACTION', 'VIEW');
        this.router.navigate(['/app/main/kh/them-ke-hoach/' + e.data.Id]);
    }

    //Cập nhật đánh giá KQ
    update_results(e) {
        this.ketQuaCongTacPhong.planId = e.data.Id;
        this.ketQuaCongTacPhong.show();
    }

    //Cập nhật đánh giá KQ đội
    update_results_team(e: any) {
        this.ketQuaCongTacDoi.planId = e.data.Id;
        this.ketQuaCongTacDoi.show();
    }

    fnXN_KCL(e) {
        var self = this;
        var items = self.data.instance.getSelectedRowsData();
        var listId = "";
        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            listId += element.PersonId;
            if (index < items.length - 1)
                listId += ";";
        }

        //Action event
    }

    edit(e: any) {
        window.localStorage.setItem('PLANACTION', 'EDIT');
        this.router.navigate(['/app/main/kh/them-ke-hoach/' + e.data.Id]);
    }

    // kết quả thực hiện
    results(e: any) {
        this.ketQuaCongTacPhong.planId = e.data.Id;
        this.ketQuaCongTacPhong.show();
    }
    team_results(e: any) {
        this.ketQuaCongTacPhong.planId = e.data.Id;
        this.ketQuaCongTacPhong.show();
    }

    //Danh sách phân công nhiệm vụ
    assignment_duties(e: any) {
        this.chiTietPhanCongNV.planId = e.data.Id;
        this.chiTietPhanCongNV.show();
    }

    //Sơ đồ Gantt
    gantt_chart(e: any) {
        this.router.navigate(['/app/main/dynamicreport/report/viewer-gantt'], { queryParams: { planId: e.data.Id } });
    }

    //Báo cáo công tác
    trips_report(e: any) {
        this.baoCaoKetQua.planAssignId = e.data.PlanAssignId;
        this.baoCaoKetQua.show();
    }

    //Chỉnh sửa đội
    edit_team(e: any) {
        window.localStorage.setItem('PLANACTION', 'EDIT');
        this.router.navigate(['/app/main/kh/them-ke-hoach/' + e.data.Id]);
    }

    //Xem kế hoạch đội
    view_team(e: any) {
        window.localStorage.setItem('PLANACTION', 'VIEW');
        this.router.navigate(['/app/main/kh/them-ke-hoach/' + e.data.Id]);
    }

}

