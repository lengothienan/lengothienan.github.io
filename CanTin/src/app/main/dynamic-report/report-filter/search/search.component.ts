import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import {
    Router, ActivatedRoute,
} from '@angular/router';

import { DxDataGridComponent, DxFormComponent, DxTreeViewComponent } from 'devextreme-angular';
import { reject, async } from 'q';
import { isNullOrUndefined } from 'util';
import CustomStore from 'devextreme/data/custom_store';
import { DRFilterServiceProxy, DRReportServiceProxy, DRColumnServiceProxy, DRViewerServiceProxy, DRReportServiceServiceProxy, FParameter, DRLookUpServiceProxy, DRChartServiceProxy, DRChartDto } from '@shared/service-proxies/service-proxies';
import { resolve } from 'dns';




@Component({
    selector: 'appc-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    encapsulation: ViewEncapsulation.None
})


export class ReportFilterComponent implements OnInit {
    @ViewChild('reportDg', { static: false }) reportDg: DxDataGridComponent;
    @ViewChild('data2table', { static: false }) data2table: DxDataGridComponent;
    @ViewChild('form', { static: false }) form: DxFormComponent;

    //@ViewChild(DxTreeViewComponent) treeView;
    tabs = [{ "title": "Cấu hình tiêu chí", "template": "templ1", index: 1 },
    { "title": "Cấu hình cột báo cáo", "template": "templ2", index: 2 },
    { "title": "Kiểm tra Sql", "template": "templ3", index: 3 },
    { "title": "Cấu hình chart", "template": "templ4", index: 4 }];
    treeBoxValue: string[];
    treeView: any;
    currentReportId: any;
    currentTab: number;
    dataSourceTab1: any;
    dataSourceTab2: any;
    columnItems: any = [];
    dataSourceTest3: any;
    dataTemp = [];
    listColumnSave: any;
    _drService: any = [];

    isEdit = false;
    listItem: any = [];
    sqlContent: any;
    parentOptions: any;
    dataSource: any;
    //key: any;
    //modalAdd: any;
    reportName: any;
    formData: any = [];
    paramTest: any = [];
    pageSize: any = 20;
    pageIndex: any = 0;
    listParentCode: any = [];
    curentControlData: any;
    templateChartData: DRChartDto;
    visible: boolean = false;
    tbTestVisible3: boolean = false;
    textAlignment = [
        {
            key: "center",
            display: 'Center'
        }, {
            key: "left",
            display: 'Left'
        },
        {
            key: "right",
            display: 'Right'
        }
    ];

    _dataType = [{
        key: 'string',
        display: 'String'
    }, {
        key: 'long',
        display: 'Long'
    }, {
        key: 'int',
        display: 'Int'
    }, {
        key: 'float',
        display: 'Float'
    }, {
        key: 'date',
        display: 'Date'
    }, {
        key: 'link',
        display: 'Link'
    }, {
        key: 'attachment',
        display: 'Attachment'
    }, {
        key: 'combobox',
        display: 'ComboBox'
    }]

    groupSortdata = [{
        key: 'asc',
        display: 'Tăng dần'
    }, {
        key: 'desc',
        display: 'Giảm dần'
    }]

    groupLevelSortData: any = []

    groupLeveldata = [{
        key: -1,
        display: 'không'
    }, {
        key: 0,
        display: 1
    },
    {
        key: 1,
        display: 2
    },
    {
        key: 2,
        display: 3
    },
    {
        key: 3,
        display: 4
    },
    {
        key: 4,
        display: 5
    }]


    validationRuleDataSource: any = [];

    constructor(
        private ReportService: DRReportServiceProxy,
        private router: Router, private activeRoute: ActivatedRoute,
        private reportFilterService: DRFilterServiceProxy,
        private reportColumnService: DRColumnServiceProxy,
        private reportViewerService: DRViewerServiceProxy,
        private reportServiceService: DRReportServiceServiceProxy,
        private reportLookupService: DRLookUpServiceProxy,
        private chartService: DRChartServiceProxy,
    ) {
        this.initDataSourceTab1();
    }

    ngOnInit() {
        const self = this;
        this.activeRoute.params.subscribe(param => {
            self.currentReportId = param.id;
            this.initDataSourceTab1();
            //this.onSelectTab(parseInt(param.tab));

        });
        self.ReportService.getById(self.currentReportId).subscribe((res: any) => {
            self.sqlContent = res.data.c.sqlContent;
            self.reportName = res.data.c.name;
            if (res.data.c.formID) {
                this.visible = false;
            } else {
                this.visible = true;
            }
        });

        self.reportServiceService.getByName('').subscribe(res => {
            self._drService = res;
        });

        // self.validationRuleDataSource = new CustomStore({
        //     key: "id",
        //     loadMode: "raw",
        //     byKey: (key) => {
        //         let promise = new Promise((reject, resolve) => {
        //             self.drValidationService.getByIds([key]).subscribe(res => {
        //                 resolve(res.data);
        //             }, err => {
        //                 reject(err);
        //             });
        //         });

        //         return promise;

        //     },
        //     load: (e) => {
        //         let promise = new Promise((resolve, reject) => {
        //             self.reportViewerService.getListValidation().subscribe(res => {
        //                 resolve(res);
        //             }, err => {
        //                 reject(err);
        //             });
        //         });

        //         return promise;
        //     }
        // });
    }

    add() {
        this.router.navigate(['/app/main/dynamicreport/report/addfilter/' + this.currentReportId + '/null']);
    }

    initDataSourceTab1() {

        const self = this;
        this.dataSourceTab1 = {
            load: function (loadOptions: any) {
                const promise = new Promise((resolve, reject) => {
                    self.reportFilterService.getFiltersByReportId(self.currentReportId).subscribe((res: any) => {
                        resolve(res);
                    });
                });
                return promise;
            },
            key: 'id'
        };
    }


    onSelectTab(e) {
        this.currentTab = e.addedItems[0].index;
        switch (this.currentTab) {
            case 1: this.loadtab1(); break;
            case 3: {

                this.loadtab3();
                break;
            }
            case 4: {
                this.chartService.getByReportID(this.currentReportId).subscribe((res: any) => {
                    this.templateChartData = res;
                })
            }
                break;
        }
    }

    detail(id) {
        this.router.navigate(['/app/main/dynamicreport/report/addfilter/' + this.currentReportId + '/' + id]);
    }

    loadtab1() {
        this.initDataSourceTab1();
    }
    loadtab3() {
        this.loadFormitems();
    }

    delete(id) {
        const self = this;
        abp.message.confirm(
            'Bạn có muốn xóa? ',
            'Xác nhận',
            isConfirmed => {
                if (isConfirmed) {
                    self.reportFilterService.filterDelete(id).subscribe(() => {
                        abp.notify.info('Deleted Successfully');
                        this.reportDg.instance.refresh();
                    });
                }
            }
        );
    }

    back() {
        this.router.navigate(['/app/main/dynamicreport/report/viewer-utility/DRP_REPORT/REPORT/']);
    }

    check() {
        const self = this;
        self.paramTest = [];

        self.reportColumnService.checkSQLWithParam(self.currentReportId, self.sqlContent).subscribe((res: any) => {
            if (res.isSucceeded == true) {
                abp.notify.success('Thành công');
            }
            else {
                abp.notify.error('Có lỗi xả ra!');
            }
        })

    }

    createColumn() {
        const self = this;
        self.listColumnSave = [];
        self.columnItems = [];
        var rowcount = self.data2table.instance.totalCount();
        if (rowcount != 0) {
            self.data2table.instance.selectAll();
            self.data2table.dataSource = [];
        }
        this.dataSourceTab2 = {
            load: function (loadOptions: any) {
                const promise = new Promise((resolve, reject) => {
                    self.reportColumnService.getColumn(self.currentReportId, self.sqlContent).subscribe((res: any) => {
                        if (res.isSucceeded == true) {
                            if (self.isEdit == false) {
                                self.columnItems = res.data;
                                self.columnItems.forEach(e => {
                                    e.validationRule = JSON.parse(e.validationRule);
                                });
                                self.groupLevelSortData = self.columnItems;
                                // self.columnItems.validationRule = JSON.parse(self.columnItems.validationRule);
                                resolve(self.columnItems);
                            }
                            self.isEdit = false;
                        }
                        else {
                            abp.notify.error('Lỗi');
                        }
                    });
                });
                return promise;
            },
            key: 'code',
            update: function (key, values) {
                var index = self.data2table.instance.getRowIndexByKey(key);
                if (!isNullOrUndefined(values.isActive))
                    self.columnItems[index].isActive = values.isActive;
                if (!isNullOrUndefined(values.isDisplay))
                    self.columnItems[index].isDisplay = values.isDisplay;
                if (!isNullOrUndefined(values.isSum))
                    self.columnItems[index].isSum = values.isSum;
                if (!isNullOrUndefined(values.groupLevel))
                    self.columnItems[index].groupLevel = values.groupLevel;
                if (!isNullOrUndefined(values.width))
                    self.columnItems[index].width = values.width;
                if (!isNullOrUndefined(values.name))
                    self.columnItems[index].name = values.name;
                if (!isNullOrUndefined(values.groupSort))
                    self.columnItems[index].groupSort = values.groupSort;
                if (!isNullOrUndefined(values.type))
                    self.columnItems[index].type = values.type;
                // if(!isNullOrUndefined(values.serviceId))

                // service combobox
                self.columnItems[index].serviceId = values.serviceId;
                // validation
                self.columnItems[index].validationRule = values.validationRule;

                self.columnItems.forEach(e => {
                    if (self.isJsonArray(e.validationRule)) {
                        e.validationRule = JSON.stringify(e.validationRule);
                    }
                })

                if (!isNullOrUndefined(values.format))
                    self.columnItems[index].format = values.format;
                if (!isNullOrUndefined(values.colNum)) {
                    self.columnItems[index].colnum = values.colNum;
                }
                if (!isNullOrUndefined(values.textAlign)) {
                    self.columnItems[index].textAlign = values.textAlign;
                }
                if (!isNullOrUndefined(values.parentCode)) {
                    self.columnItems[index].parentCode = values.parentCode;
                }
                if (!isNullOrUndefined(values.isParent)) {
                    self.columnItems[index].isParent = values.isParent;
                }
                if (!isNullOrUndefined(values.isReadOnly)) {
                    self.columnItems[index].isReadOnly = values.isReadOnly;
                }
                if (!isNullOrUndefined(values.isExport)) {
                    self.columnItems[index].isExport = values.isExport;
                }
                if (!isNullOrUndefined(values.isFreePane)) {
                    self.columnItems[index].isFreePane = values.isFreePane;
                }
                if (!isNullOrUndefined(values.sortByColumn)) {
                    self.columnItems[index].sortByColumn = values.sortByColumn;
                }
                if (!isNullOrUndefined(values.visible)) {
                    self.columnItems[index].visible = values.visible;
                }




                self.isEdit = true;
            },
        }

    }

    isJsonArray(array) {
        let arrayConstructor = [].constructor;
        if (array === null || array === undefined) return false;
        if (array.constructor === arrayConstructor) return true;
        return false;
    }

    save() {
        const self = this;
        self.data2table.instance.saveEditData();
        self.columnItems.forEach(element => {
            delete element.id;
        });
        this.reportColumnService.listColumnByReportDelete(self.currentReportId).subscribe((res: any) => {
            this.reportColumnService.insert(self.columnItems).subscribe((res: any) => {
                if (res.isSucceeded == true) {
                    this.ReportService.updateSql(self.currentReportId, self.sqlContent).subscribe((res: any) => {
                        abp.notify.success('Thành công');
                        self.data2table.instance.refresh();
                    })
                }
                else {
                    abp.notify.error('Lỗi');
                }
            })
        });

    }

    findIndex(str: string, arr: any, returnValues) {
        var i = 0
        arr.forEach(element => {
            if (element.Varible == str)
                return returnValues = i;
            else
                i++;
        });
    }

    testSQL() {
        const self = this;

        this.dataSourceTest3 = {
            load: function (loadOptions: any) {
                const promise = new Promise((resolve, reject) => {
                    if (!isNullOrUndefined(self.formData)) {
                        var listkey = Object.keys(self.formData);
                        var i = 0;
                        listkey.forEach(element => {
                            var obj = {};
                            var index;
                            index = self.paramTest.findIndex(x => x.Varible == element);
                            self.paramTest[index].Value = self.formData[element].toString();
                            i++;
                        })
                    }
                    self.ReportService.updateSql(self.currentReportId, self.sqlContent).subscribe((res: any) => {
                        self.reportViewerService.postData(self.currentReportId, self.paramTest).subscribe((res: any) => {
                            if (res.isSucceeded == true) {
                                resolve(res.data);
                                abp.notify.success('Thành công!');
                                var key = Object.keys(res.data);
                                self.tbTestVisible3 = true;
                            }
                            else {
                                abp.notify.error('Lỗi');
                                resolve(res.data);
                            }
                        });
                    })

                });
                return promise;
            },

        }
    }
    updateSQL() {
        const self = this;
        this.ReportService.updateSql(self.currentReportId, self.sqlContent).subscribe((res: any) => {
            abp.notify.success('Thành công');
        })
    }

    onCreateColumnRowUpdated(e) {
        console.log(e);
    }

    onCreateColumnRowUpdating(e) {
        console.log(e);
    }

    loadFormitems() {
        const self = this;
        self.listItem = [];
        self.paramTest = [];
        this.reportFilterService.getFiltersByReportId(self.currentReportId).subscribe((res: any) => {
            var i = 0;
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
                        await self.reportServiceService.getById(element.serviceId).subscribe((res: any) => {
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
                                            self.reportServiceService.executeService(element.id, self.currentReportId, []).subscribe((res1: any) => {
                                                resolve(res1.data);
                                            });
                                        });

                                        return promise;
                                    }
                                },
                                displayExpr: res.colDisplay,
                                valueExpr: res.colValue,
                                showClearButton: true,
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
                                            self.curentControlData['child'] = code.myCode;

                                            var list_param = [];
                                            list_param.push(param);

                                            self.reportServiceService.executeServiceWithParam(code.myid, self.currentReportId, list_param).subscribe(async (res: any) => {
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
                        await self.reportLookupService.getAllLookupDetail(element.lookupId).subscribe((res: any) => {
                            var obj = {};
                            obj['label'] = element.reportFilterName;
                            obj['dataField'] = element.code;
                            obj['colSpan'] = 2;
                            obj['order'] = element.orderid;
                            obj['editorType'] = element.controlType;
                            obj['name'] = element.code;
                            obj['editorOptions'] = {
                                dataSource: res,
                                displayExpr: 'name',
                                valueExpr: 'code',
                                showClearButton: true

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
                    if (element.controlType == 'dxDropDownBox') {
                        self.reportServiceService.getById(element.serviceId).subscribe((res: any) => {
                            self.reportServiceService.executeService(element.id, self.currentReportId, []).subscribe((res2: any) => {
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

                    } else if (element.controlType == 'dxDateBox') {
                        var obj = {};
                        obj['label'] = element.reportFilterName;
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

    onContentReady_UnitGroup(e) { }
    onRowPrepared_UnitGroup(e) { }

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
    isNullOrUndefined(obj: any) {
        return typeof obj === "undefined" || obj === null;
    }

    // SaveChart() {
    //     if (this.templateChartData.id != null) {
    //         this.chartService.update(this.templateChartData).subscribe((res: any) => {
    //             abp.notify.success("Thành công");
    //         })
    //     } else {
    //         this.templateChartData.reportId = this.currentReportId;
    //         this.chartService.insert(this.templateChartData).subscribe((res: any) => {
    //             abp.notify.success("Thành công");
    //         })
    //     }
    // }

    ValidationRuleCellTemplate(container, options) {
        const noBreakSpace = '\u00A0';
        const text = (options.value || []).map((element) => options.column.lookup.calculateCellValue(element)).join(' | ');
        container.textContent = text || noBreakSpace;
        container.title = text;
    }
}
