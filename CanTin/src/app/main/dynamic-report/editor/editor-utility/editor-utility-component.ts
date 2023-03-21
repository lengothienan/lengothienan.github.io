
// import {
//     Component,
//     OnInit,
//     ViewChild,
//     ElementRef,
//     Inject,
//     Optional,
//     ViewEncapsulation, ViewContainerRef, ComponentRef, ComponentFactoryResolver, ComponentFactory, OnChanges, SimpleChanges, Input, ViewChildren, Injector

// } from '@angular/core';
// import {
//     Router, ActivatedRoute,
// } from '@angular/router';
// import { DxDataGridComponent, DxPopupComponent, DxFormComponent, DxTreeViewComponent, DxChartComponent, DxValidationGroupComponent } from 'devextreme-angular';
// import { isNullOrUndefined } from 'util';
// import { delay } from 'q';
// import { DRReportServiceProxy, DRReportServiceServiceProxy, DRLookUpServiceProxy, DRViewerServiceProxy, DRFilterServiceProxy, DrDynamicFieldServiceProxy, FParameter, DRColumnServiceProxy, DRChartServiceProxy, DRViewerUtilityServiceProxy, DocumentServiceProxy, ODocsServiceProxy, _DRValidationServiceProxy } from '@shared/service-proxies/service-proxies';
// import { FormatService } from './formatService';

// import {
//     API_BASE_URL,
// } from '@shared/service-proxies/service-proxies';
// import { AppConsts } from '@shared/AppConsts';
// import { stringify } from 'querystring';
// import { ViewerUtilityConfigurationService } from './editor-utility-configuration.service';
// // import { KetQuaCongTacPhongComponent } from '@app/main/qlkh-cv/popup/ket-qua-cong-tac-phong/ket-qua-cong-tac-phong.component';
// // import { ChiTietPhanCongNVComponent } from '@app/main/qlkh-cv/popup/chi-tiet-phan-cong-nv/chi-tiet-phan-cong-nv.component';
// // import { KetQuaCongTacDoiComponent } from './../../qlkh-cv/popup/ket-qua-cong-tac-doi/ket-qua-cong-tac-doi.component';
// // import { BaoCaoKetQuaComponent } from './../../qlkh-cv/popup/bao-cao-ket-qua/bao-cao-ket-qua.component';
// import Popup from "devextreme/ui/popup";
// // import { SocketOne } from 'root.module';
// import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// // import { HinChartComponent } from '@app/charts/hin-chart/hin-chart.component';
// import { AppComponentBase } from '@shared/common/app-component-base';
// import CustomStore from 'devextreme/data/custom_store';

// export interface IColumn {
//     alignment: string;
//     allowEditing: boolean;
//     caption: string;
//     columns: IColumn[];
//     dataField: string;
//     dataType: string;
//     fixed: boolean;
//     format: any;
//     visible: boolean;
//     width: string;
//     parentId: string;
//     id: string;
//     isParent: any;
//     cellTemplate: any;
//     groupIndex: any;
//     minWidth: any;
// }

// export class DxColumn implements IColumn {
//     alignment: string;
//     allowEditing: boolean;
//     caption: string;
//     columns: DxColumn[];
//     cellTemplate: any;
//     dataField: string;
//     dataType: string;
//     fixed: boolean;
//     format: any;
//     visible: boolean;
//     width: string;
//     parentId: string;
//     id: string;
//     isParent: any;
//     groupIndex: any;
//     minWidth: any;
//     editorOptions: any;
//     validationRules: any[];
//     sortOrder: any;
//     orderId: any;
//     parentCode: any;
//     encodeHtml: any;
// }

// export class Chart {
//     code: any;
//     name: string;
// }

// @Component({
//     selector: 'report-editor-utility',
//     templateUrl: './editor-utility-component.html',
//     styleUrls: ['./editor-utility-component.scss'],
//     providers: [FormatService],
//     //encapsulation: ViewEncapsulation.None
// })
// export class ReportEditUtilityComponent extends AppComponentBase implements OnInit {
//     @Input() reportCode: any = undefined;
//     @Input() labelActionCode: any = undefined;
//     @Input() reportUtilityId: any = undefined;

//     @ViewChild('data', { static: true }) data: DxDataGridComponent;
//     //@ViewChild(DxPopupComponent) popup: DxPopupComponent;
//     @ViewChild('form', { static: true }) form: DxFormComponent;
//     @ViewChild('barchart', { static: true }) barchart: DxChartComponent;
//     @ViewChild(DxTreeViewComponent, { static: true }) treeview: DxTreeViewComponent;
//     // @ViewChildren('hinChart') hinChart: HinChartComponent;
//     utilityId: any;

//     isShowNotify: any = false;

//     constructor(
//         injector: Injector,
//         private router: Router,
//         private reportService: DRReportServiceProxy,
//         private serviceService: DRReportServiceServiceProxy,
//         private lookupService: DRLookUpServiceProxy,
//         private viewerService: DRViewerServiceProxy,
//         private filterService: DRFilterServiceProxy,
//         private dynamicFieldService: DrDynamicFieldServiceProxy,
//         private columnService: DRColumnServiceProxy,
//         public formatService: FormatService,
//         private activeRouter: ActivatedRoute,
//         private chartService: DRChartServiceProxy,
//         private _viewUtilityService: DRViewerUtilityServiceProxy,
//         private _componentViewConfigurationService: ViewerUtilityConfigurationService,
//         private _documentAppService: DocumentServiceProxy,
//         private _oDocServiceProxy: ODocsServiceProxy,
//         private _drValidationService: _DRValidationServiceProxy,
//         private http: HttpClient,
//         // private socket: SocketOne,
//         @Optional() @Inject(API_BASE_URL) baseUrl?: string
//     ) {
//         super(injector);
//         const self = this;
//         this.baseUrl = baseUrl ? baseUrl : "";
//         this.router.events.subscribe((val) => {
//             self.findGetParameter();
//         });
//     }
//     totalCount: number = 0;
//     code: any;
//     private baseUrl: string;

//     iconClass: any = "fa fa-eye";
//     disabled_btn_search: any = false;

//     currentReport: any;
//     formId: any;
//     listItem: any;
//     sqlContent: any;
//     reportName: any;
//     formData: any = {};
//     formDataLocalStorage: any = [];
//     column: any;
//     export_column: any;
//     dataSourceTest3: any = [];
//     pageSize: any = 50;
//     pageIndex: any = 0;
//     paramTest: any = [];
//     sumary: any = {};
//     treeBoxValue: any;
//     ReportOptions: any;
//     listParentCode: any = [];
//     curentControlData: any;
//     isDynamicCol: any;
//     typeget: any;
//     isColumnAutoWidth: any;
//     visible: any = false;
//     displayType: any;  // =0 table =1 form =2 biểu đồ cột(barchart) =3 biểu đồ tròn(piechart)
//     pieChartDataSource: any = [];
//     seriesField: any;
//     ArgumentField: any;
//     ValueField: any;
//     barChartDataSource: any = [];
//     displayMode: any;   //Kiểu hiển thị argument label chart
//     rotationAngle: any; //Độ nghiêng của trục argument label chart
//     columnLink = [];

//     size = { width: 500, height: 500 }
//     curentreportid: any;

//     formCol: any = 4;
//     test = false;
//     isPreview = false;

//     //style
//     tableVisibility: any = "hidden";
//     tableDisplay: any = "none";
//     barChartVisibility: any = "hidden";
//     barChartDisplay: any = "none";
//     pieChartVisibility: any = "hidden";
//     pieChartDisplay: any = "none";
//     hinChartVisibility: any = "hidden";
//     hinChartDisplay: any = "none";

//     //Danh sách tham số button Action
//     LabelCode: any;
//     _label_Action: any;
//     actions: any = [];
//     actions2: any = [];
//     action_button: any = {
//         pause: false,
//         delete: false,
//         cancel: false,
//         reopen: false,
//         view: false,
//         edit: false,
//         results: false,
//         processing_process: false,
//         update_results: false,
//         file_manager: false,
//         assignment_duties: false,
//         gantt_chart: false,
//         team_results: false,
//         trips_report: false,
//         edit_team: false,
//         view_team: false,
//         update_results_team: false,
//         create: false,
//         confirm: false,
//         config: false
//     };

//     isExportWord: any = true;
//     show_search: any = false;
//     popupVisible: any = false;
//     popupImgVisible: any = false;
//     popupListVisible: any = false;
//     popupHeight = 700;
//     popupWidth = 1000;
//     popupListHeight = 700;
//     popupListWidth = 1000;
//     popupImgHeight = 700;
//     popupImgWidth = 1000;

//     click_One: any = false;

//     popupVisibleAttachment: any = false;

//     attachmentList: any = []


//     componentPopup: any = {
//         component: null,
//         inputs: {

//         },
//         outputs: {

//         }
//     }

//     charts: Chart[] = [{
//         code: 'bar',
//         name: 'Biểu đồ cột'
//     }, {
//         code: 'pie',
//         name: 'Biểu đồ tròn'
//     }, {
//         code: 'doughnut',
//         name: 'Biểu đồ donut'
//     }, {
//         code: 'radar',
//         name: 'Biểu đồ nhện'
//     }, {
//         code: 'polarArea',
//         name: 'Biểu đồ vùng cực'
//     }, {
//         code: 'line',
//         name: 'Biểu đồ đường'
//     }]

//     matChartData: any = [
//         { data: [65, 59, 80, 81, 72, 53, 95], label: 'Iphone 8' },
//         { data: [28, 48, 40, 19, 86, 27, 90], label: 'Iphone X' }
//     ]
//     //check get localstorage or not
//     get_storage: any = false;
//     chartData: any = [];
//     chartLabels: any = [];
//     chartType: string = 'pie'

//     //queryParam
//     link_param: any = [];
//     query_params: any;
//     Init_query_params: any = [];
//     api_query_params: any;

//     userId_query: any = undefined;

//     disableSearch: any = false;

//     isLoadPanelVisible: any = false;

//     linkDownLoadTemplate: any = '';

//     listDataChange: any = [];
//     // isFirstTime: any = true;
//     isCheckEditStatus: any = true;

//     @ViewChild('tr', { static: true }) vc: Popup;

//     ngOnInit() {
//         console.log(this.hinChart);
//         const self = this;
//         self.LabelCode = self.activeRouter.snapshot.params['labelCode'];
//         self.code = self.activeRouter.snapshot.params['code'];
//         this.findGetParameter();
//         this.create_grid();
//         //this.popup.visible = true;
//         this.data.visible = false;
//         this.activeRouter.params.subscribe(param => {
//             self.code = param.code;
//             if (param.utilityId != null || param.utilityId != undefined) {
//                 self.utilityId = param.utilityId;
//             } else {
//                 self.utilityId = null;
//             }
//             if (self.reportCode != undefined) {
//                 self.LabelCode = self.labelActionCode;
//                 self.code = self.reportCode;
//                 self.utilityId = self.reportUtilityId;
//             }
//             window.localStorage.setItem('UTILITY_ID', self.utilityId);
//             self.reportService.getIdByCode(self.code).subscribe(async (data: any) => {
//                 if (data.data.length > 0) {
//                     this.isExportWord = data.data[0].isExportWord;
//                 }
//                 self.currentReport = data.data[0].id;
//                 self.disableSearch = data.data[0].disableSearch;

//                 await self.reportService.getById(self.currentReport).subscribe(async (res: any) => {
//                     self.sqlContent = res.data.c.sqlContent;
//                     self.reportName = res.data.c.name;
//                     self.isDynamicCol = res.data.c.isDynamicColumn;
//                     self.typeget = res.data.c.typeGetColumn;
//                     self.formId = res.data.c.formID;
//                     self.isColumnAutoWidth = res.isColumnAutoWidth;
//                     self.displayType = res.data.c.displayType;
//                     self.data.visible = true;
//                     //this.popup.visible = false;
//                     self.formData = {};
//                     //self.getLocalStorage();
//                     self.loadFormitems();
//                     self.loadTemplateUrl(res.data.c);
//                     //self.viewreport();
//                 });
//             });

//         })
//     }

//     create_grid() {

//         $("#dx-grid").dxDataGrid({

//         });
//         $("#dx-form").dxForm({

//         });
//     }

//     onExporting(e) {

//         const self = this;
//         var exportTemplate = $("#dx-grid").dxDataGrid("option", "export");

//         if (exportTemplate.template == null) return;

//         for (var i = 0; i < exportTemplate.template.data.length; i++) {
//             self.paramTest.forEach((e2) => {
//                 exportTemplate.template.data[i] = exportTemplate.template.data[i].replace(":" + e2.Varible.toLowerCase(), e2.Value == null ? "" : e2.Value);
//             });
//         };

//         $("#dx-grid").dxDataGrid("option", "export", {
//             template: exportTemplate,
//             enabled: true,
//             fileName: self.reportName
//         });


//         $("#dx-grid").dxDataGrid("option", "columns", self.export_column);
//         $("#dx-grid").dxDataGrid("instance").exportToExcel(false);
//         //$("#dx-grid").dxDataGrid("option", "columns", self.column);

//         e.cancel = true;
//     };

//     loadTemplateUrl(res) {
//         this.loadTemplate(res);
//     }

//     loadTemplate(res) {
//         // xlsxParser.loadAjaxTemplate("abc.xlsx");
//         const self = this;
//         var blob = null;


//         $.ajax({
//             url: AppConsts.fileServerUrl + "/ExportFile/DRGetTemplateFile?reportID=" + res.id,
//             method: 'GET',
//             xhrFields: {
//                 responseType: 'blob',

//             },
//             success: function (data) {
//                 // if (xhr.readyState === 4) {
//                 self.loadTemplateFile(res.excel, data);
//                 // }
//             }
//         });

//     }

//     loadTemplateFile(template, blobFile) {
//         const self = this;
//         var fileName = template.split('/')[template.split('/').length - 1]
//         var file = new File([blobFile], fileName);
//         xlsxParser.parse(file).then(function (data) {

//             console.log("Import Template Excel Success !!!");

//             $("#dx-grid").dxDataGrid("option", "export", {
//                 template: data,
//                 enabled: true,
//                 fileName: self.reportName
//             });

//         }, function (err) {
//             console.log('error', err);
//         });
//     };

//     onSubmit($event) {

//     }

//     async loadFormitems() {
//         const self = this;
//         self.listItem = [];
//         self.listParentCode = [];
//         self.paramTest = [];
//         self.formData = {};
//         await self.loadDefaultfilter();
//         this.filterService.getFiltersByReportId(self.currentReport).subscribe((res: any) => {
//             var i = 0;
//             if (res.data.length > 0) {
//                 self.show_search = true;
//             }
//             res.data.forEach(async element => {
//                 var data = {
//                     id: null,
//                     code: null,
//                     value: null,
//                 };
//                 var parentCode;
//                 var paramTestItem = new Object();
//                 paramTestItem['Varible'] = element.code;
//                 paramTestItem['Value'] = null;
//                 self.paramTest.push(paramTestItem);


//                 if (element.controlType == 'dxSelectBox') {
//                     if (element.parentComboId != 0) {
//                         res.data.forEach(temp => {
//                             if (temp.id == element.parentComboId && temp.controlType == 'dxSelectBox') {
//                                 parentCode = temp.code;
//                                 var parentcodeItem = new Object();
//                                 parentcodeItem['myid'] = element.id;
//                                 parentcodeItem['myCode'] = element.code;
//                                 parentcodeItem['parentCode'] = temp.code;
//                                 self.listParentCode.push(parentcodeItem);
//                             }
//                         })
//                     }

//                     if (element.dataType == 'False' || element.dataType == false) {
//                         await self.serviceService.getById(element.serviceId).subscribe((res: any) => {
//                             var obj = {};
//                             obj['label'] = { text: element.reportFilterName };
//                             obj['dataField'] = element.code;
//                             obj['colSpan'] = 2;
//                             obj['name'] = element.code;
//                             obj['order'] = element.orderid;
//                             obj['editorType'] = element.controlType;
//                             if (element.required == true || element.required == 'True') {
//                                 obj['validationRules'] = [{
//                                     type: "required",
//                                     message: "Không được để trống mục này."
//                                 }];
//                             }
//                             data.id = element.id;
//                             data.code = !self.isNullOrUndefined(parentCode) ? parentCode : null;
//                             data.value = !self.isNullOrUndefined(self.formData[parentCode]) ? self.formData[parentCode] : null;
//                             obj['editorOptions'] = {
//                                 dataSource: {
//                                     loadMode: 'raw',
//                                     load: function () {
//                                         const promise = new Promise((resolve, reject) => {
//                                             if (self.utilityId != null) {
//                                                 if (!!self.formData && self.formData.constructor === Object && Object.keys(self.formData).length === 0) {
//                                                     self.serviceService.executeServiceByUtilityId(element.id, self.currentReport, self.utilityId, self.Init_query_params).subscribe((res1: any) => {
//                                                         resolve(res1.data);
//                                                     });
//                                                 } else {
//                                                     self.serviceService.executeServiceWithParamByUtilityId(element.id, self.currentReport, self.utilityId, self.formDataLocalStorage.concat(self.Init_query_params)).subscribe(async (res2: any) => {
//                                                         resolve(res2.data);
//                                                     });
//                                                 }

//                                             } else {
//                                                 if (!!self.formData && self.formData.constructor === Object && Object.keys(self.formData).length === 0) {
//                                                     self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res1: any) => {
//                                                         resolve(res1.data);
//                                                     });
//                                                 } else {
//                                                     self.serviceService.executeServiceWithParam(element.id, self.currentReport, self.formDataLocalStorage.concat(self.Init_query_params)).subscribe(async (res2: any) => {
//                                                         resolve(res2.data);
//                                                     });
//                                                 }

//                                             }

//                                         });

//                                         return promise;
//                                     }
//                                 },
//                                 displayExpr: res.colDisplay,
//                                 valueExpr: res.colValue,
//                                 showClearButton: true,
//                                 searchEnabled: true,
//                                 onValueChanged: function (key) {
//                                     var listkey = Object.keys(self.formData);
//                                     var control;
//                                     listkey.forEach(val => {
//                                         if (self.formData[val] == key.value) {
//                                             control = val;
//                                         }
//                                     });
//                                     self.listParentCode.forEach(async code => {
//                                         if (control == code.parentCode) {

//                                             var param = new FParameter();
//                                             param.value = key.value;
//                                             param.varible = code.parentCode;
//                                             self.curentControlData = new Object();
//                                             self.curentControlData['name'] = control;
//                                             self.curentControlData['value'] = key.value;
//                                             self.curentControlData['child'] = code.myCode

//                                             var list_param = [];
//                                             list_param.push(param);
//                                             list_param = list_param.concat(self.Init_query_params);

//                                             if (self.utilityId != null && param.value != null) {
//                                                 self.serviceService.executeServiceWithParamByUtilityId(code.myid, self.currentReport, self.utilityId, list_param).subscribe(async (res: any) => {
//                                                     await self.form.items.forEach(item => {
//                                                         if (item["dataField"] == self.curentControlData.child) {
//                                                             //item["editorOptions"].dataSource = res;
//                                                             const x = self.form.instance.itemOption(self.curentControlData.child);
//                                                             const editorOption = x.editorOptions;
//                                                             editorOption.dataSource = res.data;
//                                                             self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
//                                                             self.formData[self.curentControlData.name] = self.curentControlData.value;
//                                                         }
//                                                     })
//                                                 });
//                                             } else {
//                                                 self.serviceService.executeServiceWithParam(code.myid, self.currentReport, list_param).subscribe(async (res: any) => {
//                                                     await self.form.items.forEach(item => {
//                                                         if (item["dataField"] == self.curentControlData.child) {
//                                                             //item["editorOptions"].dataSource = res;
//                                                             const x = self.form.instance.itemOption(self.curentControlData.child);
//                                                             const editorOption = x.editorOptions;
//                                                             editorOption.dataSource = res.data;
//                                                             self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
//                                                             self.formData[self.curentControlData.name] = self.curentControlData.value;
//                                                         }
//                                                     })
//                                                 });
//                                             }
//                                         }

//                                     });
//                                 }
//                             }
//                             self.listItem.push(obj);
//                             self.listItem.sort(function (a, b) { return a.order - b.order });
//                         });
//                     }
//                     else {
//                         await self.lookupService.getAllLookupDetail(element.lookupId).subscribe((res: any) => {
//                             var obj = {};
//                             obj['label'] = { text: element.reportFilterName };
//                             obj['dataField'] = element.code;
//                             obj['colSpan'] = 2;
//                             obj['order'] = element.orderid;

//                             obj['editorType'] = element.controlType;
//                             obj['name'] = element.code;
//                             obj['editorOptions'] = {
//                                 dataSource: res,
//                                 displayExpr: 'name',
//                                 valueExpr: 'code',
//                                 showClearButton: true,
//                                 searchEnabled: true,
//                             }
//                             if (element.required == true || element.required == 'True') {
//                                 obj['validationRules'] = [{
//                                     type: "required",
//                                     message: "Không được để trống mục này."
//                                 }];
//                             }
//                             self.listItem.push(obj);
//                             self.listItem.sort(function (a, b) { return a.order - b.order });
//                         });

//                     }
//                 }
//                 // tag box // update
//                 else if (element.controlType == 'dxTagBox') {
//                     //check child tagbox
//                     if (element.parentComboId != 0) {
//                         res.data.forEach(temp => {
//                             if (temp.id == element.parentComboId && temp.controlType == 'dxTagBox') {
//                                 parentCode = temp.code;
//                                 var parentcodeItem = new Object();
//                                 parentcodeItem['myid'] = element.id;
//                                 parentcodeItem['myCode'] = element.code;
//                                 parentcodeItem['parentCode'] = temp.code;
//                                 self.listParentCode.push(parentcodeItem);
//                             }
//                         })
//                     }
//                     if (element.serviceId == null && element.lookupId == null) {
//                         var obj = {};
//                         obj['label'] = { text: element.reportFilterName };
//                         obj['dataField'] = element.code;
//                         obj['colSpan'] = 2;
//                         obj['order'] = element.orderid;
//                         obj['editorType'] = element.controlType;
//                         obj['name'] = element.code;
//                         obj['editorOptions'] = {
//                             searchEnabled: false,
//                             acceptCustomValue: true,
//                             noDataText: "",
//                         }
//                         if (element.required == true || element.required == 'True') {
//                             obj['validationRules'] = [{
//                                 type: "required",
//                                 message: "Không được để trống mục này."
//                             }];
//                         }
//                         self.listItem.push(obj);
//                         self.listItem.sort(function (a, b) { return a.order - b.order });
//                     }
//                     else {
//                         //get service data if dataType == false
//                         if (element.dataType == 'False' || element.dataType == false) {
//                             await self.serviceService.getById(element.serviceId).subscribe((res: any) => {
//                                 var obj = {};
//                                 obj['label'] = { text: element.reportFilterName };
//                                 obj['dataField'] = element.code;
//                                 obj['colSpan'] = 2;
//                                 obj['name'] = element.code;
//                                 obj['order'] = element.orderid;
//                                 obj['editorType'] = element.controlType;
//                                 if (element.required == true || element.required == 'True') {
//                                     obj['validationRules'] = [{
//                                         type: "required",
//                                         message: "Không được để trống mục này."
//                                     }];
//                                 }
//                                 data.id = element.id;
//                                 data.code = !self.isNullOrUndefined(parentCode) ? parentCode : null;
//                                 data.value = !self.isNullOrUndefined(self.formData[parentCode]) ? self.formData[parentCode] : null;
//                                 obj['editorOptions'] = {
//                                     dataSource: {
//                                         loadMode: 'raw',
//                                         load: function () {
//                                             const promise = new Promise((resolve, reject) => {
//                                                 if (self.utilityId != null) {
//                                                     self.serviceService.executeServiceByUtilityId(element.id, self.currentReport, self.utilityId, self.Init_query_params).subscribe((res1: any) => {
//                                                         resolve(res1.data);
//                                                     });
//                                                 } else {
//                                                     self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res1: any) => {
//                                                         resolve(res1.data);
//                                                     });
//                                                 }
//                                             });

//                                             return promise;
//                                         }
//                                     },
//                                     displayExpr: res.colDisplay,
//                                     valueExpr: res.colValue,
//                                     showClearButton: true,
//                                     searchEnabled: false,
//                                     onValueChanged: function (key) {
//                                         var listkey = Object.keys(self.formData);
//                                         var control;
//                                         listkey.forEach(val => {
//                                             if (self.formData[val] == key.value) {
//                                                 control = val;
//                                             }
//                                         });
//                                         self.listParentCode.forEach(async code => {
//                                             if (control == code.parentCode) {

//                                                 var param = new FParameter();
//                                                 param.value = "" + key.value[0];
//                                                 for (var i = 1; i < key.value.length; i++) {
//                                                     param.value += "," + key.value[i];
//                                                 }
//                                                 param.varible = code.parentCode;
//                                                 self.curentControlData = new Object();
//                                                 self.curentControlData['name'] = control;
//                                                 self.curentControlData['value'] = key.value;
//                                                 self.curentControlData['child'] = code.myCode

//                                                 var list_param = [];
//                                                 list_param.push(param);
//                                                 list_param = list_param.concat(self.Init_query_params);

//                                                 if (self.utilityId != null) {
//                                                     self.serviceService.executeServiceWithParamByUtilityId(code.myid, self.currentReport, self.utilityId, list_param).subscribe(async (res: any) => {
//                                                         await self.form.items.forEach(item => {
//                                                             if (item["dataField"] == self.curentControlData.child) {
//                                                                 //item["editorOptions"].dataSource = res;
//                                                                 const x = self.form.instance.itemOption(self.curentControlData.child);
//                                                                 const editorOption = x.editorOptions;
//                                                                 editorOption.dataSource = res.data;
//                                                                 self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
//                                                                 self.formData[self.curentControlData.name] = self.curentControlData.value;
//                                                             }
//                                                         })
//                                                     });
//                                                 } else {
//                                                     self.serviceService.executeServiceWithParam(code.myid, self.currentReport, list_param).subscribe(async (res: any) => {
//                                                         await self.form.items.forEach(item => {
//                                                             if (item["dataField"] == self.curentControlData.child) {
//                                                                 //item["editorOptions"].dataSource = res;
//                                                                 const x = self.form.instance.itemOption(self.curentControlData.child);
//                                                                 const editorOption = x.editorOptions;
//                                                                 editorOption.dataSource = res.data;
//                                                                 self.form.instance.itemOption(self.curentControlData.child, 'editorOptions', editorOption);
//                                                                 self.formData[self.curentControlData.name] = self.curentControlData.value;
//                                                             }
//                                                         })
//                                                     });
//                                                 }
//                                             }

//                                         });
//                                     }
//                                 }
//                                 self.listItem.push(obj);
//                                 self.listItem.sort(function (a, b) { return a.order - b.order });
//                             });
//                         }
//                         // get lookup data if datatype == true
//                         else {
//                             await self.lookupService.getAllLookupDetail(element.lookupId).subscribe((res: any) => {
//                                 var obj = {};
//                                 obj['label'] = { text: element.reportFilterName };
//                                 obj['dataField'] = element.code;
//                                 obj['colSpan'] = 2;
//                                 obj['order'] = element.orderid;
//                                 obj['editorType'] = element.controlType;
//                                 obj['name'] = element.code;
//                                 obj['editorOptions'] = {
//                                     dataSource: res,
//                                     displayExpr: 'name',
//                                     valueExpr: 'code',
//                                     showClearButton: true,
//                                     searchEnabled: true,
//                                 }
//                                 if (element.required == true || element.required == 'True') {
//                                     obj['validationRules'] = [{
//                                         type: "required",
//                                         message: "Không được để trống mục này."
//                                     }];
//                                 }
//                                 self.listItem.push(obj);
//                                 self.listItem.sort(function (a, b) { return a.order - b.order });
//                             });
//                         }
//                     }
//                 }
//                 else {
//                     if (element.controlType == 'dxDropDownBox') {
//                         self.serviceService.getById(element.serviceId).subscribe((res: any) => {
//                             if (self.utilityId != null) {
//                                 self.serviceService.executeServiceByUtilityId(element.id, self.currentReport, self.utilityId, self.Init_query_params).subscribe((res2: any) => {
//                                     var obj = {};
//                                     obj['label'] = { text: element.reportFilterName };
//                                     obj['dataField'] = element.code;
//                                     obj['colSpan'] = 2;
//                                     obj['order'] = element.orderid;
//                                     obj['editorType'] = element.controlType;
//                                     if (element.required == true || element.required == 'True') {
//                                         obj['validationRules'] = [{
//                                             type: "required",
//                                             message: "Không được để trống mục này."
//                                         }];
//                                     }
//                                     var fruits = ["Apples", "Oranges", "Lemons", "Pears", "Pineapples"];

//                                     obj['editorOptions'] = {
//                                         dataSource: res2.data,
//                                         displayExpr: res.colDisplay,
//                                         valueExpr: res.colValue,
//                                         placeholder: "Select a value...",
//                                         showClearButton: true,
//                                         searchEnabled: true,
//                                         onValueChanged: function (e) {
//                                             self.syncTreeViewSelection(e.component, e.value);
//                                         },
//                                         contentTemplate: function (e) {
//                                             var value = e.component.option("value");
//                                             var $tree = $('<div>').dxTreeView({
//                                                 dataSource: e.component.option("dataSource"),
//                                                 displayExpr: res.colDisplay,
//                                                 dataStructure: "plain",
//                                                 keyExpr: res.colValue,
//                                                 parentIdExpr: res.colParent,
//                                                 selectionMode: 'multiple',
//                                                 selectByClick: true,
//                                                 showCheckBoxesMode: "normal",
//                                                 selectNodesRecursive: false,
//                                                 onContentReady: function (arg) {
//                                                     self.syncTreeViewSelection(arg.component, value);
//                                                 },
//                                                 onItemSelectionChanged: function (arg) {
//                                                     self.treeView_itemSelectionChanged(e, arg)
//                                                 }
//                                             });
//                                             return $tree;
//                                         },
//                                     }
//                                     self.listItem.push(obj);
//                                     self.listItem.sort(function (a, b) { return a.order - b.order });
//                                 });
//                             } else {
//                                 self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {
//                                     var obj = {};
//                                     obj['label'] = { text: element.reportFilterName };
//                                     obj['dataField'] = element.code;
//                                     obj['colSpan'] = 2;
//                                     obj['order'] = element.orderid;
//                                     obj['editorType'] = element.controlType;
//                                     if (element.required == true || element.required == 'True') {
//                                         obj['validationRules'] = [{
//                                             type: "required",
//                                             message: "Không được để trống mục này."
//                                         }];
//                                     }
//                                     var fruits = ["Apples", "Oranges", "Lemons", "Pears", "Pineapples"];

//                                     obj['editorOptions'] = {
//                                         dataSource: res2.data,
//                                         displayExpr: res.colDisplay,
//                                         valueExpr: res.colValue,
//                                         placeholder: "Select a value...",
//                                         showClearButton: true,
//                                         searchEnabled: true,
//                                         onValueChanged: function (e) {
//                                             self.syncTreeViewSelection(e.component, e.value);
//                                         },
//                                         contentTemplate: function (e) {
//                                             var value = e.component.option("value");
//                                             var $tree = $('<div>').dxTreeView({
//                                                 dataSource: e.component.option("dataSource"),
//                                                 displayExpr: res.colDisplay,
//                                                 dataStructure: "plain",
//                                                 keyExpr: res.colValue,
//                                                 parentIdExpr: res.colParent,
//                                                 selectionMode: 'multiple',
//                                                 selectByClick: true,
//                                                 showCheckBoxesMode: "normal",
//                                                 selectNodesRecursive: false,
//                                                 onContentReady: function (arg) {
//                                                     self.syncTreeViewSelection(arg.component, value);
//                                                 },
//                                                 onItemSelectionChanged: function (arg) {
//                                                     self.treeView_itemSelectionChanged(e, arg)
//                                                 }
//                                             });
//                                             return $tree;
//                                         },
//                                     }
//                                     self.listItem.push(obj);
//                                     self.listItem.sort(function (a, b) { return a.order - b.order });
//                                 });
//                             }
//                         })

//                     } else if (element.controlType == 'dxDateBox') {
//                         var obj = {};
//                         obj['label'] = { text: element.reportFilterName };
//                         obj['dataField'] = element.code;
//                         obj['colSpan'] = 2;
//                         obj['order'] = element.orderid;
//                         obj['editorType'] = element.controlType;
//                         obj['editorOptions'] = {
//                             placeholder: "Chọn ngày...",
//                             type: 'date',
//                             dateSerializationFormat: "yyyy-MM-dd", // định dạng kiểu date truyền xuống
//                             displayFormat: 'dd/MM/yyyy',
//                             //value: (new Date()).toLocaleDateString(),
//                         }

//                         if (element.required == true || element.required == 'True') {
//                             obj['validationRules'] = [{
//                                 type: "required",
//                                 message: "Không được để trống mục này."
//                             }];
//                         }
//                         self.listItem.push(obj);
//                         self.listItem.sort(function (a, b) { return a.order - b.order });

//                     } else if (element.controlType == 'treeView') {
//                         self.serviceService.getById(element.serviceId).subscribe((res: any) => {

//                             if (self.utilityId != null) {
//                                 self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {
//                                     console.log(res2.data);

//                                     var obj = {};
//                                     obj['label'] = { text: element.reportFilterName };
//                                     obj['dataField'] = element.code;
//                                     obj['colSpan'] = 2;
//                                     obj['order'] = element.orderid;
//                                     obj['editorType'] = 'dxDropDownBox';
//                                     if (element.required == true || element.required == 'True') {
//                                         obj['validationRules'] = [{
//                                             type: "required",
//                                             message: "Không được để trống mục này."
//                                         }];
//                                     }

//                                     obj['editorOptions'] = {
//                                         value: this.treeBoxValue,
//                                         dataSource: res2.data,
//                                         displayExpr: res.colDisplay,
//                                         valueExpr: res.colValue,
//                                         parentIdExpr: res.colParent,
//                                         dataStructure: "plain",
//                                         placeholder: "Select...",
//                                         showClearButton: true,
//                                         searchEnabled: true,
//                                         selectionMode: 'single',
//                                         selectByClick: true,
//                                         showCheckBoxesMode: "none",
//                                         selectNodesRecursive: false,
//                                         onValueChanged: function (e) {
//                                             self.syncTreeViewSelection(e.component, e.value);
//                                         },
//                                         contentTemplate: function (e) {
//                                             var value = e.component.option("value");
//                                             var $tree = $('<div>').dxTreeView({
//                                                 dataSource: res2.data,
//                                                 displayExpr: res.colDisplay,
//                                                 dataStructure: "plain",
//                                                 keyExpr: res.colValue,
//                                                 parentIdExpr: res.colParent,
//                                                 selectionMode: 'single',
//                                                 selectByClick: true,

//                                                 onContentReady: function (arg) {
//                                                     self.syncTreeViewSelection(arg.component, value);
//                                                 },
//                                                 onItemSelectionChanged: function (arg) {
//                                                     self.treeView_onItemSelectionChanged(e)
//                                                 }
//                                             });
//                                             return $tree;
//                                         },
//                                     }

//                                     self.listItem.push(obj);
//                                     self.listItem.sort(function (a, b) { return a.order - b.order });
//                                 });
//                             } else {
//                                 self.serviceService.executeService(element.id, self.currentReport, self.Init_query_params).subscribe((res2: any) => {
//                                     console.log(res2.data);

//                                     var obj = {};
//                                     obj['label'] = { text: element.reportFilterName };
//                                     obj['dataField'] = 'id';
//                                     obj['colSpan'] = 2;
//                                     obj['order'] = element.orderid;
//                                     obj['editorType'] = 'dxDropDownBox';
//                                     if (element.required == true || element.required == 'True') {
//                                         obj['validationRules'] = [{
//                                             type: "required",
//                                             message: "Không được để trống mục này."
//                                         }];
//                                     }

//                                     obj['editorOptions'] = {
//                                         dataSource: res2.data,
//                                         displayExpr: res.colDisplay,
//                                         valueExpr: res.colValue,
//                                         parentIdExpr: res.colParent,
//                                         dataStructure: "plain",
//                                         placeholder: "Select...",
//                                         showClearButton: true,
//                                         searchEnabled: true,
//                                         selectionMode: 'single',
//                                         selectByClick: true,
//                                         showCheckBoxesMode: "none",
//                                         selectNodesRecursive: false,
//                                         onValueChanged: function (e) {
//                                             self.syncTreeViewSelection(e.component, e.value);
//                                         },
//                                         contentTemplate: function (e) {
//                                             var value = e.component.option("value");
//                                             var $tree = $('<div>').dxTreeView({
//                                                 dataSource: res2.data,
//                                                 displayExpr: res.colDisplay,
//                                                 dataStructure: "plain",
//                                                 keyExpr: res.colValue,
//                                                 parentIdExpr: res.colParent,
//                                                 selectionMode: 'single',
//                                                 selectByClick: true,

//                                                 onContentReady: function (arg) {
//                                                     self.syncTreeViewSelection(arg.component, value);
//                                                 },
//                                                 onItemSelectionChanged: function (arg) {
//                                                     self.treeView_itemSelectionChanged(e, arg)
//                                                 }
//                                             });
//                                             return $tree;
//                                         },
//                                     }

//                                     self.listItem.push(obj);
//                                     self.listItem.sort(function (a, b) { return a.order - b.order });
//                                 });
//                             }
//                         })
//                     } else {
//                         var obj = {};
//                         obj['label'] = { text: element.reportFilterName };
//                         obj['dataField'] = element.code;
//                         obj['colSpan'] = 2;
//                         obj['order'] = element.orderid;
//                         obj['editorType'] = element.controlType;
//                         obj['value'] = "";
//                         if (element.required == true || element.required == 'True') {
//                             obj['validationRules'] = [{
//                                 type: "required",
//                                 message: "Không được để trống mục này."
//                             }];
//                         }
//                         paramTestItem['Value'] = "";
//                         self.listItem.push(obj);
//                         self.listItem.sort(function (a, b) { return a.order - b.order });
//                     }
//                 }
//             });
//             if (!self.disableSearch) self.viewreport();
//         })
//     }

//     async viewreport(isShowNotify: any = true) {
//         const self = this;
//         this.isShowNotify = isShowNotify;
//         this.click_One = false;
//         self.isLoadPanelVisible = true;

//         self.setLocalStorage();

//         self.LabelCode = self.activeRouter.snapshot.params['labelCode'];
//         if (self.labelActionCode != undefined) {
//             self.LabelCode = self.labelActionCode;
//         }

//         let uID = 0;

//         if (abp.session.userId != null && abp.session.userId != undefined) {
//             uID = abp.session.userId;
//         } else if (self.userId_query != undefined) {
//             uID = self.userId_query;
//         }

//         //console.log(self.LabelCode);
//         self._viewUtilityService.getActionButtonByLabelCode(uID, self.LabelCode).subscribe((res: any) => {
//             self._label_Action = res.data;
//             // console.log(res.data);
//             self.actions = [];
//             self.actions2 = [];
//             if (res.data.length > 0) {
//                 res.data.forEach(item => {
//                     //console.log('item');
//                     //console.log(item);
//                     if (item.Type == "SHOWCOMPONENT" && item.Value == "PREVIEW") {
//                         if (item.Height != null && item.Height != 0 && item.Width != null && item.Width != 0) {
//                             self.popupImgHeight = item.Height;
//                             self.popupImgWidth = item.Width;
//                         }
//                         else {
//                             self.popupImgHeight = 700;
//                             self.popupImgWidth = 1000;
//                         }
//                     } else if (item.Type == "SHOWCOMPONENT" && item.Value == "PREVIEW_LIST") {
//                         if (item.Height != null && item.Height != 0 && item.Width != null && item.Width != 0) {
//                             self.popupListHeight = item.Height;
//                             self.popupListWidth = item.Width;
//                         }
//                         else {
//                             self.popupListHeight = 700;
//                             self.popupListWidth = 1000;
//                         }
//                     } else if (item.Type == "SHOWCOMPONENT" && item.Value != "PREVIEW" && item.Value != "PREVIEW_LIST") {
//                         if (item.Height != null && item.Height != 0 && item.Width != null && item.Width != 0) {
//                             self.popupHeight = item.Height;
//                             self.popupWidth = item.Width;
//                         }
//                         else {
//                             self.popupHeight = 700;
//                             self.popupWidth = 1000;
//                         }
//                     }
//                     self.onShowActionButton(item);
//                 });
//             }

//             // console.log('action');
//             // console.log(self.actions);
//             // console.log(self.actions2);
//         });

//         $("#dx-form").dxForm("option", "formData", self.formData);
//         if (!isNullOrUndefined(self.formData)) {
//             var listkey = Object.keys(self.formData);
//             listkey.forEach(element => {
//                 var index;
//                 index = self.paramTest.findIndex(x => x.Varible == element);
//                 if (index != undefined && index != null && index >= 0) {
//                     if (!isNullOrUndefined(self.formData[element])) {
//                         self.paramTest[index].Value = self.formData[element].toString();
//                     } else {
//                         self.paramTest[index].Value = null;
//                     }
//                 }
//             })
//         }
//         if (self.displayType == 0) {
//             self.pieChartVisibility = "hidden"
//             self.tableVisibility = "visible";
//             self.tableDisplay = "inline-block"
//             self.barChartDisplay = "none"
//             self.barChartVisibility = "hidden"
//             self.pieChartDisplay = "none"
//             self.pieChartVisibility = "hidden"
//             self.hinChartDisplay = "none"
//             self.hinChartVisibility = "hidden"

//             self.createColumn();

//             self.dataSourceTest3 = {
//                 loadMode: 'raw',
//                 load: function () {
//                     const promise = new Promise((resolve, reject) => {

//                         self.iconClass = "fa fa-spinner fa-spin";
//                         self.disabled_btn_search = true;

//                         if (self.utilityId != null || self.utilityId != undefined) {
//                             if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
//                                 self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
//                             }
//                         }
//                         if (self.Init_query_params.length > 0) {
//                             self.Init_query_params.forEach(element => {
//                                 if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
//                                     self.paramTest.push({ Varible: element.Varible, Value: element.Value });
//                                 }
//                             });
//                         }
//                         // console.log(self.currentReport);
//                         self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res: any) => {
//                             if (res.isSucceeded == true) {
//                                 resolve(res.data);
//                                 // console.log(res);
//                                 self.totalCount = res.data.length;

//                                 $("#dx-grid").dxDataGrid("option", "dataSource", res.data);

//                                 self.parseHtmlContent();

//                                 if (self.isShowNotify)
//                                     abp.notify.success('Thành công!', undefined, { "position": "top-end" });

//                                 self.isLoadPanelVisible = false;

//                                 self.isCheckEditStatus = true;
//                                 // load lại grid edit
//                                 self.setDataChange();
//                             }
//                             else {
//                                 abp.notify.error('Lỗi', undefined, { "position": "top-end" });
//                                 resolve(res.data);
//                                 self.isLoadPanelVisible = false;
//                             }

//                             self.iconClass = "fa fa-eye";
//                             self.disabled_btn_search = false;
//                         }, (err) => {
//                             self.iconClass = "fa fa-eye";
//                             self.disabled_btn_search = false;
//                         });
//                     });
//                     return promise;

//                 },
//                 byKey: function (key, extra) {
//                     const promise = new Promise((resolve) => {
//                         if (self.utilityId != null || self.utilityId != undefined) {
//                             if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
//                                 self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
//                             }
//                         }
//                         if (self.Init_query_params.length > 0) {
//                             self.Init_query_params.forEach(element => {
//                                 if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
//                                     self.paramTest.push({ Varible: element.Varible, Value: element.Value });
//                                 }
//                             });
//                         }

//                         self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res: any) => {
//                             if (res.isSucceeded == true) {
//                                 resolve(res.data);
//                                 self.totalCount = res.data.length;
//                                 if (self.isShowNotify)
//                                     abp.notify.success('Thành công!', undefined, { "position": "top-end" });
//                                 self.isLoadPanelVisible = false;
//                             }
//                             else {
//                                 abp.notify.error('Lỗi', undefined, { "position": "top-end" });
//                                 resolve(res.data);
//                                 self.isLoadPanelVisible = false;
//                             }
//                         });
//                     });
//                     return promise;
//                 },
//                 update: async (key, values) => {

//                     let d = Object.assign(key, values);

//                     delete d['__change'];

//                     const promise = new Promise((resolve, reject) => {
//                         self.viewerService.editData(self.currentReport, key.Id, d).subscribe(res => {
//                             if (res.code == "200") {
//                                 resolve(res.data);
//                                 this.notify.success("Cập nhật thành công.");
//                             } else {
//                                 reject(res.message);
//                                 this.notify.error(res.message);
//                             }

//                         }, err => {
//                             reject(err);
//                             this.notify.error("Đã xảy ra lỗi");
//                         });
//                     });
//                 }

//             };


//             // if (this.data && this.data.instance) {
//             //     this.data.instance.refresh();
//             // };

//         } else if (self.displayType == 3) {
//             self.pieChartVisibility = "visible"
//             self.tableVisibility = "hidden"
//             self.tableDisplay = "none"
//             self.barChartDisplay = "none"
//             self.barChartVisibility = "hidden"
//             self.pieChartDisplay = "inline-block"
//             self.pieChartVisibility = "visible"
//             self.hinChartDisplay = "none"
//             self.hinChartVisibility = "hidden"

//             self.chartService.getByReportID(self.currentReport).subscribe((res1: any) => {
//                 self.ArgumentField = res1.argumentField;
//                 self.ValueField = res1.valueField;
//                 self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res2: any) => {
//                     self.pieChartDataSource = res2.data;
//                 });
//             })
//         } else if (self.displayType == 2) {

//             self.tableVisibility = "hidden"
//             self.tableDisplay = "none"
//             self.barChartDisplay = "inline-block"
//             self.barChartVisibility = "visible"
//             self.pieChartDisplay = "none"
//             self.pieChartVisibility = "hidden"
//             self.hinChartDisplay = "none"
//             self.hinChartVisibility = "hidden"

//             self.chartService.getByReportID(self.currentReport).subscribe((res1: any) => {
//                 self.ArgumentField = res1.argumentField;
//                 self.ValueField = res1.valueField;
//                 self.seriesField = res1.seriesField;
//                 self.displayMode = res1.displayMode == undefined || res1.displayMode == null ? "rotate" : res1.displayMode;
//                 self.rotationAngle = res1.rotationAngle == undefined || res1.rotationAngle == null ? -45 : res1.rotationAngle;
//                 self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res2: any) => {
//                     self.barChartDataSource = res2.data;
//                 });
//             })
//         } else {
//             self.tableVisibility = "hidden"
//             self.tableDisplay = "none"
//             self.barChartDisplay = "hidden"
//             self.barChartVisibility = "none"
//             self.pieChartDisplay = "none"
//             self.pieChartVisibility = "hidden"
//             self.hinChartDisplay = "inline-block"
//             self.hinChartVisibility = "visible"
//             if (self.displayType == 7) {//line chart
//                 this.chartType = 'line';
//             }
//             if (self.displayType == 1) {//line chart
//                 this.chartType = 'bar';
//             }
//             self.chartService.getByReportID(self.currentReport).subscribe((res1: any) => {
//                 self.viewerService.postData(self.currentReport, self.paramTest).subscribe((res2: any) => {
//                     if (res2.isSucceeded && res2.data.length > 0) {
//                         this.loadHinChart(self.displayType, res2.data);
//                     }
//                 });
//             })
//         }
//         if (this.data && this.data.instance) {
//             this.data.instance.refresh();
//         };
//     }
//     async delay(ms: number) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     }

//     back() {
//         if (!this.click_One) {
//             this.formData = {};
//             this.pageSize = 50;
//             this.pageIndex = 0;
//             this.setLocalStorage();
//             this.click_One = true;
//         }
//     }
//     createColumn() {
//         const self = this;
//         self.column = [];
//         self.export_column = [];
//         self.columnLink = [];
//         self.sumary = {
//             groupItems: [],
//             totalItems: []
//         }
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
//         if (self.typeget == 1) {
//             self.columnService.postByReportId(self.currentReport, self.paramTest).subscribe((res: any) => {
//                 if (res.length > 0) {
//                     self.formatColumn(res);
//                 }
//                 else {
//                     self.columnService.getColumn(self.currentReport, self.sqlContent).subscribe((res1: any) => {
//                         self.formatColumn(res1.data);
//                     })
//                 }
//             })
//         } else {
//             if (self.typeget == 2) {
//                 this.loadColumns();
//                 this.loadColumns();
//             }
//             else {
//                 self.formId = self.formData.FormId;
//                 this.loadColumns();
//             }
//         }


//     }

//     async formatColumn(res: any[]) {
//         const self = this;
//         var cols = [];
//         var exp_cols = [];
//         for (var i = 0; i < res.length; i++) {
//             var col = {};
//             var exp_col = {};

//             if ((res[i].isDisplay == true || res[i].isDisplay == 'True') && (res[i].parentCode == undefined || res[i].parentCode == "")) {
//                 col['caption'] = res[i].name;
//                 col['sortOrder'] = res[i].groupSort;
//                 col['dataField'] = res[i].code;
//                 col['orderId'] = res[i].colNum;

//                 if (res[i].isParent == true || res[i].isParent == 'True') {
//                     var c_cols = [];
//                     var exp_c_cols = [];
//                     var child_col = res.filter(c => c.parentCode == res[i].code).sort((c1, c2) => c1.colNum - c2.colNum);
//                     child_col.forEach(element => {
//                         var c_col = {};
//                         if (element.isDisplay == true || element.isDisplay == 'True') {
//                             c_col['caption'] = element.name;
//                             c_col['sortOrder'] = element.groupSort;
//                             c_col['dataField'] = element.code;
//                             c_col['orderId'] = element.colNum;
//                             if (element.width != 0 && !isNullOrUndefined(element.width) && element.width != '')
//                                 c_col['width'] = element.width;
//                             if (!isNullOrUndefined(element.textAlign))
//                                 c_col['alignment'] = element.textAlign;
//                             c_col['groupIndex'] = element.groupLevel;
//                             if (element.type == 'int' || element.type == 'long')
//                                 c_col['dataType'] = 'number';
//                             else
//                                 c_col['dataType'] = element.type;
//                             c_col['format'] = element.format;
//                             if (element.isSum == true || element.isSum == 'True') {
//                                 var sumitem = {};
//                                 sumitem['c_column'] = element.code;
//                                 sumitem['summaryType'] = 'sum';
//                                 sumitem['showInc_column'] = element.code;
//                                 sumitem['displayFormat'] = "Tổng: {0}";
//                                 sumitem['valueFormat'] = element.format;
//                                 self.sumary.totalItems.push(sumitem);
//                                 var groupSumitem = {};
//                                 groupSumitem['c_column'] = element.code;
//                                 groupSumitem['summaryType'] = 'sum';
//                                 groupSumitem['displayFormat'] = "Tổng: {0}";
//                                 groupSumitem['showInc_column'] = element.code;
//                                 groupSumitem['valueFormat'] = element.format;
//                                 self.sumary.groupItems.push(groupSumitem);
//                             }
//                             if (element.isReadOnly == true || element.isReadOnly == 'True') {
//                                 c_col["allowEditing"] = false;
//                             }
//                             if (c_col['dataType'] == "link") {
//                                 self.columnLink.push(c_col['dataField']);
//                                 c_col["encodeHtml"] = false;
//                             };

//                             if (c_col['dataType'] == 'attachment') {
//                                 c_col['cellTemplate'] = "attachmentCellTemplate";
//                             }
//                             if (element.isExport == true || element.isExport == 'True') {
//                                 exp_c_cols.push(c_col);
//                             }

//                             c_cols.push(c_col);
//                         }
//                     });
//                     exp_cols = exp_cols.concat(exp_c_cols)
//                     col['columns'] = c_cols;
//                 }
//                 else {
//                     if (res[i].width != 0 && !isNullOrUndefined(res[i].width) && res[i].width != '')
//                         col['width'] = res[i].width;
//                     if (!isNullOrUndefined(res[i].textAlign))
//                         col['alignment'] = res[i].textAlign;
//                     col['groupIndex'] = res[i].groupLevel;
//                     if (res[i].type == 'int' || res[i].type == 'long')
//                         col['dataType'] = 'number';
//                     else
//                         col['dataType'] = res[i].type;
//                     col['format'] = res[i].format;
//                     if (res[i].isSum == true || res[i].isSum == 'True') {
//                         var sumitem = {};
//                         sumitem['column'] = res[i].code;
//                         sumitem['summaryType'] = 'sum';
//                         sumitem['showInColumn'] = res[i].code;
//                         sumitem['displayFormat'] = "Tổng: {0}";
//                         sumitem['valueFormat'] = res[i].format;
//                         self.sumary.totalItems.push(sumitem);
//                         var groupSumitem = {};
//                         groupSumitem['column'] = res[i].code;
//                         groupSumitem['summaryType'] = 'sum';
//                         groupSumitem['displayFormat'] = "Tổng: {0}";
//                         groupSumitem['showInColumn'] = res[i].code;
//                         groupSumitem['valueFormat'] = res[i].format;
//                         self.sumary.groupItems.push(groupSumitem);
//                     }
//                     if (res[i].isReadOnly == true || res[i].isReadOnly == 'True') {
//                         col["allowEditing"] = false;
//                     }
//                     if (col['dataType'] == "link") {
//                         self.columnLink.push(col['dataField']);
//                         col["encodeHtml"] = false;
//                     };

//                     if (col['dataType'] == 'attachment') {
//                         col['cellTemplate'] = "attachmentCellTemplate";
//                     }

//                     // combobox
//                     if (col['dataType'] == "combobox") {

//                         if (res[i].serviceId != null) {
//                             let service: any = await self.getDRService(res[i].serviceId);
//                             let serviceData: any = await self.getDRDataSource(service.code);

//                             col['lookup'] = {
//                                 dataSource: serviceData,
//                                 valueExpr: service.colValue,
//                                 displayExpr: service.colDisplay,
//                                 searchExpr: service.colDisplay
//                             }

//                             col['editorOptions'] = {
//                                 showClearButton: true
//                             };
//                         }
//                     }

//                     if (res[i].isExport == true || res[i].isExport == 'True') {
//                         exp_col = col;
//                         exp_cols.push(exp_col);
//                     }


//                     // validation
//                     let validationIds = JSON.parse(res[i].validationRule);

//                     // ràng buộc null
//                     if (validationIds == null) validationIds = [];

//                     let validations: any = await self.getValidationService(validationIds);
//                     let validationRules = [];

//                     // ràng buộc null
//                     if (validations == null) validations = [];

//                     validations.forEach(validation => {
//                         switch (validation.type) {
//                             case 1: // bắt buộc nhập
//                                 validationRules.push({
//                                     type: "required",
//                                     message: validation.message
//                                 });
//                                 break;
//                             case 2: //stringLength
//                                 validationRules.push({
//                                     type: "stringLength",
//                                     min: validation.min,
//                                     max: validation.max,
//                                     message: validation.message
//                                 });
//                                 break;
//                             case 3: // pattern
//                                 validationRules.push({
//                                     type: "pattern",
//                                     pattern: validation.pattern,
//                                     message: validation.message
//                                 });
//                                 break;
//                             case 4: // range
//                                 validationRules.push({
//                                     type: "range",
//                                     min: validation.min,
//                                     max: validation.max,
//                                     message: validation.message,
//                                     reevaluate: true
//                                 });
//                                 break;
//                         }
//                     });

//                     col['validationRules'] = validationRules;
//                 }

//                 cols.push(col);

//             }
//         }

//         // col ẩn để trigger lần đầu thay đổi grid
//         let _col = {};
//         _col = {
//             dataField: "__change",
//             caption: "",
//             allowEditing: true,
//             allowExporting: false,
//             orderId: 1000,
//             dataType: "number",
//             width: 0
//             // visible: false
//         }

//         cols.push(_col);

//         /*
//         var colXL = {};
//         colXL['caption'] = "Xử lý";
//         colXL['cellTemplate'] = "customTemplate";
//         colXL['alignment'] = "center";
//         colXL['width'] = "90px";
//         colXL['orderId'] = 2;
//         cols.push(colXL);
//         */

//         cols.sort(function (a, b) { return a.orderId - b.orderId });
//         exp_cols.sort(function (a, b) { return a.orderId - b.orderId });
//         self.column = cols;
//         self.export_column = exp_cols;

//         $("#dx-grid").dxDataGrid("option", "columns", cols);
//         $("#dx-grid").dxDataGrid("option", "summary", this.sumary);
//         $("#dx-grid").dxDataGrid("instance").refresh();

//     }

//     async getValidationService(ids: any[]) {
//         const self = this;
//         let promise = new Promise((resolve, reject) => {
//             self._drValidationService.getByIds(ids).subscribe(res => {
//                 resolve(res.data);
//             }, err => {
//                 reject(err);
//             })
//         });

//         return promise;
//     }

//     async getDRService(serviceId) {
//         const self = this;
//         let promise = new Promise((resolve, reject) => {
//             self.serviceService.getById(serviceId).subscribe(_res => {
//                 resolve(_res);
//             }, err => {
//                 reject(err);
//             });
//         });

//         return promise;
//     }

//     async getDRDataSource(serviceCode) {
//         const self = this;
//         let promise = new Promise((resolve, reject) => {
//             self.serviceService.executeServiceByCode(serviceCode, undefined).subscribe(_res => {
//                 resolve(_res.data);
//             }, err => {
//                 reject(err);
//             });
//         });

//         return promise;
//     }

//     isNullOrUndefined(obj: any) {
//         return typeof obj === "undefined" || obj === null;
//     }

//     syncTreeViewSelection(treeView: any, value: any) {
//         const component = (treeView && treeView.component);
//         if (!component) { return; }
//         if (!value) {
//             component.unselectAll();
//             return;
//         }

//         value.forEach(function (key) {
//             component.selectItem(value);
//         });
//     }

//     treeView_onItemSelectionChanged(e) {
//         this.treeBoxValue = e.component.getSelectedNodeKeys();
//     }

//     treeView_itemSelectionChanged(e, arg) {
//         var value = arg.component.getSelectedNodesKeys();
//         e.component.option("value", value);
//     }

//     private flatColumnsToTree(columns: DxColumn[], parentId: any) {
//         const results: DxColumn[] = [];

//         columns.forEach(column => {
//             if (column.parentId == parentId) {
//                 const children = this.flatColumnsToTree(columns, column.id);

//                 if (children.length) {
//                     column.columns = children;
//                 }

//                 results.push(column);
//             }
//         });

//         return results;
//     }

//     loadColumns() {
//         if (this.formId) {
//             // this.formColumnService.canEnterColumnByFormId(this.formId).subscribe(res => {
//             //     // this.isColumnAutoWidth = form.isColumnAutoWidth;
//             //     this.column = this.flatColumnsToTree(this.configColumns(res.data), '0');
//             // });
//         }
//     }

//     private configColumns(columns: any[]) {
//         const results: DxColumn[] = [];

//         columns.forEach(column => {
//             const newColumn = new DxColumn();
//             newColumn.dataField = `Col_${column.columnId}`;
//             newColumn.caption = column.columnName;
//             newColumn.visible = !(column.columnId === 105 || column.columnId === 107);
//             newColumn.alignment = column.alignment;

//             if (this.isColumnAutoWidth) {
//                 if (column.width) {
//                     newColumn.minWidth = column.width;
//                 }

//             } else {
//                 newColumn.fixed = column.isFixed == 'True';
//                 if (column.width) {
//                     newColumn.width = column.width;
//                 }
//             }
//             if (column.dataType === 'number') {
//                 newColumn.format = this.formatService.formatNumber;
//             }

//             newColumn.allowEditing = column.isBalance === 'False' || column.isValue === 'True';
//             newColumn.id = column.columnId;
//             newColumn.parentId = column.parentId;
//             newColumn.dataType = column.dataType;
//             newColumn.isParent = column.isParent;



//             if (column.orderId === '2' || column.orderId === 2) { // Section column
//                 newColumn.cellTemplate = (container, options) => {
//                     const depth = parseInt(options.data.Depth, 10);
//                     $(container).append($('<p style="padding-left: ' + (depth * 15) + 'px; margin-bottom: 0">' + options.value + '</p>'));
//                 };
//             }

//             newColumn.columns = [];

//             results.push(newColumn);
//         });

//         return results;
//     }

//     stripHtml(html) {
//         var tmp = document.createElement("DIV");
//         tmp.innerHTML = html;
//         return tmp.textContent || tmp.innerText || html;
//     }

//     parseHtmlContent() {
//         let data = $("#dx-grid").dxDataGrid("instance").option("dataSource");

//         let dataClones = [];

//         const self = this;

//         for (var i = 0; i < data.length; i++) {

//             let dataClone = {};

//             jQuery.each(data[i], function (j, val) {
//                 dataClone[j] = self.stripHtml(val);
//             });

//             dataClones.push(dataClone);

//         }

//         $("#dx-grid").dxDataGrid("instance").option("dataSource", dataClones);
//     }

//     onToolbarPreparing(e) {
//         e.toolbarOptions.items.unshift({
//             location: 'before',
//             template: 'totalGroupCount'
//         }, {
//             location: 'after',
//             widget: 'dxButton',
//             options: {
//                 icon: 'docxfile',
//                 visible: this.isExportWord,
//                 onClick: this.exportWordClick.bind(this)
//             }
//         });
//     }

//     exportWordClick() {
//         const self = this;
//         var blob = null;


//         $.ajax({
//             url: AppConsts.fileServerUrl + "/ExportFile/DRGetTemplateWordFile?reportID=" + self.currentReport,
//             type: 'GET',
//             contentType: "application/json",
//             success: function (data) {
//                 self.http.post(AppConsts.fileServerUrl + '/api/services/app/DRViewer/ExportWord?id=' + self.currentReport + '&templatePathFile=' + data.result, self.paramTest).subscribe(res => {
//                     if (res['result']['data'].length > 0) {
//                         var rootUrl = AppConsts.fileServerUrl;
//                         var link = rootUrl + res['result']['data']

//                         window.open(link, '_blank');
//                     }
//                 })
//             }
//         });

//     }

//     onShowActionButton(item) {
//         var self = this;
//         // switch (item.IsTop) {
//         //     case '1':
//         //         self.action_button.create = true;
//         //         self.actions2.push(item);
//         //         break;
//         //     default:
//         //         self.actions.push(item);
//         //         break;
//         // }
//         if (item.IsTop) {
//             self.action_button.create = true;
//             self.actions2.push(item);

//         } else {
//             self.actions.push(item);
//         }
//     }

//     create(e: any) {
//         var link = this._label_Action.filter(x => x.IsTop == true)[0].Value;
//         if (link != undefined && link != null) {
//             link = this.settingLinkCreate(link, 'REDIRECT');
//             if (link == "") {
//                 return;
//             } else {
//                 if (this.query_params != undefined && this.query_params != "")
//                     this.router.navigate([link], { queryParams: JSON.parse(this.query_params) });
//                 else {
//                     if (link.charAt(link.length - 1) == "/")
//                         this.router.navigate([link + 'null']);
//                     else
//                         this.router.navigate([link]);
//                 }
//             }
//             // if(this.utilityId != null && this.utilityId != undefined )
//             //     link = link.replace("{UtilityId}", this.utilityId);
//             // if (link.charAt(link.length - 1) == "/")
//             //     this.router.navigate([link + 'null']);
//             // else
//             //     this.router.navigate([link]);
//         }
//         else
//             abp.notify.error('Chưa cấu hình đường dẫn cho chức năng!', undefined, { "position": "top-end" });
//     }

//     clickBtnStore(e: any, action: any = null, dataSourceID: any) {
//         var self = this;
//         var items = self.data.instance.getSelectedRowsData();
//         console.log(items);
//         if (items.length > 0) {
//             var ListID = "";
//             items.forEach(element => {
//                 ListID += element.Id;
//                 ListID += ',';
//             });
//             ListID = ListID.slice(0, -1);
//             // var storeName = this._label_Action.filter(x => x.Code == action)[0].Value;
//             var storeName = action;

//             // console.log(ListID);
//             // console.log(storeName);
//             if (storeName != undefined && storeName != null) {
//                 if (self.utilityId != null || self.utilityId != undefined) {
//                     if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
//                         self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
//                     }
//                 }
//                 if (self.Init_query_params.length > 0) {
//                     self.Init_query_params.forEach(element => {
//                         if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
//                             self.paramTest.push({ Varible: element.Varible, Value: element.Value });
//                         }
//                     });
//                 }

//                 this._viewUtilityService.actionWithListParamId(ListID, storeName, dataSourceID, self.userId_query, self.paramTest).subscribe((res: any) => {
//                     if (res.code == "SUCCESS") {
//                         abp.notify.success("Thành công!", undefined, { "position": "top-end" });

//                         this.viewreport(false);
//                     }
//                     else if (res.code == "ERROR") {
//                         abp.notify.error("Có lỗi xảy ra khi thực hiện chức năng trên server.", undefined, { "position": "top-end" });
//                         this.viewreport(false);
//                     }
//                 }, (err: any) => {
//                     abp.notify.error(err.error.messages, undefined, { "position": "top-end" });
//                     this.viewreport(false);
//                 });
//             }
//             else
//                 abp.notify.error('Chưa cấu hình store cho chức năng!', undefined, { "position": "top-end" });
//         } else {
//             abp.notify.error('Hãy chọn dòng dữ liệu', undefined, { "position": "top-end" });
//         }

//     }

//     //Function redirect page với đường link đã cấu hình
//     action_link(e: any, action: any = null) {
//         window.localStorage.setItem('UTILITY_ACTION', action);
//         var link = this._label_Action.filter(x => x.Code == action)[0].Value;

//         link = this.settingLink(link, e.data, 'REDIRECT');
//         if (link == "") {
//             return;
//         } else {
//             if (this.query_params != undefined && this.query_params != "")
//                 this.router.navigate([link], { queryParams: JSON.parse(this.query_params) });
//             else {
//                 this.router.navigate([link]);
//             }
//         }

//         // if (link != undefined && link != null) {
//         //     link = link.replace("{Id}", e.data.Id);
//         //     if (e.data.Code != undefined)
//         //         link = link.replace("{Code}", e.data.Code);
//         //     if(this.utilityId != null && this.utilityId != undefined )
//         //         link = link.replace("{UtilityId}", this.utilityId);
//         //     this.router.navigate([link]);
//         // }
//         // else
//         //     abp.notify.error('Chưa cấu hình đường dẫn cho chức năng!');
//     }

//     //Function redirect page với hyperlink đã cấu hình
//     action_hyperlink(e: any, action: any = null) {
//         window.localStorage.setItem('UTILITY_ACTION', action);
//         var link = this._label_Action.filter(x => x.Code == action)[0].Value;
//         if (link != undefined && link != null) {
//             link = link.replace("{Id}", e.data.Id);
//             //if (e.data.Code != undefined)
//             //    link = link.replace("{Code}", e.data.Code);
//             //this.router.navigate([link]);
//             window.open(link);
//         }
//         else
//             abp.notify.error('Chưa cấu hình đường dẫn cho chức năng!', undefined, { "position": "top-end" });
//     }

//     //Function thực hiện chức năng chỉ định với store đã cấu hình
//     action_store(e: any, action: any = null, dataSourceID: any) {
//         const self = this;
//         var storeName = this._label_Action.filter(x => x.Code == action)[0].Value;
//         if (storeName != undefined && storeName != null) {
//             if (self.utilityId != null || self.utilityId != undefined) {
//                 if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
//                     self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
//                 }
//             }
//             if (self.Init_query_params.length > 0) {
//                 self.Init_query_params.forEach(element => {
//                     if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
//                         self.paramTest.push({ Varible: element.Varible, Value: element.Value });
//                     }
//                 });
//             }
//             this._viewUtilityService.actionWithParamId(e.data.Id, storeName, dataSourceID, this.userId_query, self.paramTest).subscribe((res: any) => {
//                 console.log(res);
//                 if (res.code == "SUCCESS") {
//                     abp.notify.success("Thành công!", undefined, { "position": "top-end" });

//                     // if(storeName == 'CreateGroupChatForRemineTask'){
//                     //     this.socket.emit("showChatChannelRedmine", "REDMINE_GROUP_00");
//                     // }

//                     this.viewreport(false);
//                 }
//                 else if (res.code == "ERROR") {
//                     abp.notify.error("Có lỗi xảy ra khi thực hiện chức năng trên server.", undefined, { "position": "top-end" });
//                     this.viewreport(false);
//                 }
//             }, (err: any) => {
//                 abp.notify.error(err.error.messages, undefined, { "position": "top-end" });
//                 this.viewreport(false);
//             });
//         }
//         else
//             abp.notify.error('Chưa cấu hình store cho chức năng!', undefined, { "position": "top-end" });
//     }

//     //Function thực hiện chức năng chỉ định với store đã cấu hình dành cho luồng copy văn bản
//     action_store_filecopy(e: any, action: any = null, dataSourceID: any, type: any) {
//         var storeName = this._label_Action.filter(x => x.Code == action)[0].Value;
//         if (storeName != undefined && storeName != null) {
//             if (type == 1) {
//                 //action_store
//                 this.action_store(e, action, dataSourceID);
//                 //copy file and update path
//                 this._documentAppService.getDocumentEditByDocumentId_New(e.data.Id).subscribe((res: any) => {
//                     let listAtt = res.attachment.split(';');
//                     for (let i = 0; i < listAtt.length; i++) {
//                         this._documentAppService.copyFile(listAtt[i]).subscribe();
//                     }
//                 })
//                 // console.log('action_store_filecopy_doc');
//             }
//             if (type == 2) {
//                 //action_store
//                 this.action_store(e, action, dataSourceID);
//                 //copy file and update path
//                 this._oDocServiceProxy.getODocForEdit(e.data.Id).subscribe((res: any) => {
//                     let listAtt = res.attachment.split(';');
//                     for (let i = 0; i < listAtt.length; i++) {
//                         this._documentAppService.copyFile(listAtt[i]).subscribe();
//                     }
//                 })
//                 // console.log('action_store_filecopy_odoc');
//             }


//             // this._viewUtilityService.actionWithParamId(e.data.Id, storeName, dataSourceID).subscribe((res: any) => {
//             //     if (res.code == "SUCCESS") {
//             //         abp.notify.success("Thành công!");

//             //         if(storeName == 'CreateGroupChatForRemineTask'){
//             //             this.socket.emit("showChatChannelRedmine", "REDMINE_GROUP_00");
//             //         }

//             //         this.viewreport(false);
//             //     }
//             //     else if (res.code == "ERROR") {
//             //         abp.notify.error("Có lỗi xảy ra khi thực hiện chức năng trên server.");
//             //         this.viewreport(false);
//             //     }
//             // }, (err: any) => {
//             //     abp.notify.error(err.error.messages);
//             //     this.viewreport(false);
//             // });
//         }
//         else
//             abp.notify.error('Chưa cấu hình store cho chức năng!', undefined, { "position": "top-end" });
//     }

//     //Function hiển thị popup view với component đã cấu hình bởi action code
//     action_show_component(e: any, actions: any = null) {

//         var self = this;
//         var componentView = null;
//         if (this._componentViewConfigurationService.ComponentViewDefinitions.find(x => x.code == actions.Value)) {
//             componentView = this._componentViewConfigurationService.ComponentViewDefinitions.find(x => x.code == actions.Value).component;
//         }


//         // console.log(e.data);
//         self.componentPopup = {
//             component: componentView,
//             inputs: e.data,
//             outputs: {
//                 onHidePopup: (e) => this.hidePopup(e),
//             }
//         }

//         //self.popupVisible = true;

//         if (actions.Value == "PREVIEW") {
//             self.popupImgVisible = true;
//             this.isPreview = true;

//         } else {
//             self.popupVisible = true;
//             this.isPreview = false;
//         }
//     }

//     action_call_api(e: any, action: any = null) {
//         // Get method, api, param
//         var action_value = this._label_Action.filter(x => x.Code == action)[0].Value;
//         var obj = JSON.parse(action_value);
//         var method = obj.method
//         var link_api = obj.api;
//         var form_data = obj.formdata;
//         //Get query_string
//         link_api = this.settingLinkCreate(link_api, 'API').toString();

//         //Form_data
//         form_data = this.addParamFormData(form_data, e.data);
//         form_data = form_data.replaceAll('`', '"');

//         //Execute API
//         switch (method) {
//             case "GET":
//                 let get_url_ = AppConsts.remoteServiceBaseUrl + link_api;
//                 get_url_ = get_url_.replace(/[?&]$/, "");
//                 get_url_ = get_url_.replace(/[^\x00-\x7F]/g, "");
//                 let get_options_: any = {
//                     params: new HttpParams({
//                         fromObject: JSON.parse(this.api_query_params)
//                     })
//                 };
//                 this.http.get(get_url_, get_options_).subscribe(res => {
//                     if (res["isSucceeded"] != undefined) {
//                         if (res["isSucceeded"]) {
//                             abp.notify.success("Thành công", undefined, { "position": "top-end" });
//                         } else {
//                             abp.notify.error("Có lỗi xảy ra", undefined, { "position": "top-end" });
//                         }
//                     } else {
//                         abp.notify.success("Thành công", undefined, { "position": "top-end" });
//                     }
//                 }, error => {
//                     abp.notify.error("Có lỗi xảy ra", undefined, { "position": "top-end" });
//                 });
//                 break;
//             case "POST":
//                 let post_url_ = AppConsts.remoteServiceBaseUrl + link_api;
//                 post_url_ = post_url_.replace(/[?&]$/, "");
//                 post_url_ = post_url_.replace(/[^\x00-\x7F]/g, "");

//                 var params = {};
//                 if (this.api_query_params != undefined && this.api_query_params != "") {
//                     params = JSON.parse(this.api_query_params);
//                 }

//                 let post_options_: any = {
//                     params: new HttpParams({
//                         fromObject: params
//                     })
//                 };
//                 this.http.post(post_url_, JSON.parse(form_data), post_options_).subscribe(res => {
//                     if (res["isSucceeded"] != undefined) {
//                         if (res["isSucceeded"]) {
//                             abp.notify.success("Thành công", undefined, { "position": "top-end" });
//                         } else {
//                             abp.notify.error("Có lỗi xảy ra", undefined, { "position": "top-end" });
//                         }
//                     } else {
//                         abp.notify.success("Thành công", undefined, { "position": "top-end" });
//                     }
//                 }, error => {
//                     abp.notify.error("Có lỗi xảy ra", undefined, { "position": "top-end" });
//                 });
//                 break;
//             case "DELETE":
//                 let delete_url_ = AppConsts.remoteServiceBaseUrl + link_api;
//                 delete_url_ = delete_url_.replace(/[?&]$/, "");
//                 delete_url_ = delete_url_.replace(/[^\x00-\x7F]/g, "");
//                 let delete_options_: any = {
//                     params: new HttpParams({
//                         fromObject: JSON.parse(this.api_query_params)
//                     })
//                 };
//                 this.http.delete(delete_url_, delete_options_).subscribe(res => {
//                     if (res["isSucceeded"] != undefined) {
//                         if (res["isSucceeded"]) {
//                             abp.notify.success("Thành công", undefined, { "position": "top-end" });
//                         } else {
//                             abp.notify.error("Có lỗi xảy ra", undefined, { "position": "top-end" });
//                         }
//                     } else {
//                         abp.notify.success("Thành công", undefined, { "position": "top-end" });
//                     }
//                 }, error => {
//                     abp.notify.error("Có lỗi xảy ra", undefined, { "position": "top-end" });
//                 });
//                 break;
//         }

//     }

//     fnXN_KCL(e) {
//         var self = this;
//         var items = self.data.instance.getSelectedRowsData();
//         var listId = "";
//         for (let index = 0; index < items.length; index++) {
//             const element = items[index];
//             listId += element.PersonId;
//             if (index < items.length - 1)
//                 listId += ";";
//         }

//         //Action event
//     }

//     hidePopup(e: any) {
//         // this.popupVisible = false;
//         if (this.isPreview) {
//             this.popupImgVisible = false;
//             this.popupListVisible = false;
//         } else {
//             this.popupVisible = false;
//         }
//     }

//     clickBtnPopup(e: any, actions: any = null) {
//         var self = this;
//         var items = self.data.instance.getSelectedRowsData();
//         if (items.length > 0) {
//             // console.log(items);
//             var ListID = "";
//             items.forEach(element => {
//                 ListID += element.Id;
//                 ListID += ',';
//             });
//             ListID = ListID.slice(0, -1);

//             var list = { 'id': '' };
//             list.id = ListID;

//             // var storeName = this._label_Action.filter(x => x.Code == action)[0].Value;
//             var storeName = actions;

//             // console.log(ListID);
//             // console.log(storeName);
//             // console.log(list);


//             var self = this;
//             var componentView = null;
//             if (this._componentViewConfigurationService.ComponentViewDefinitions.find(x => x.code == actions.Value)) {
//                 componentView = this._componentViewConfigurationService.ComponentViewDefinitions.find(x => x.code == actions.Value).component;
//             }


//             // console.log('items');
//             // console.log(items);
//             self.componentPopup = {
//                 component: componentView,
//                 inputs: list,
//                 outputs: {
//                     onHidePopup: (e) => this.hidePopup(e),
//                 }
//             }

//             //self.popupVisible = true;

//             if (actions.Value == "PREVIEW") {
//                 self.popupImgVisible = true;
//                 this.isPreview = true;

//             } else if (actions.Value == "PREVIEW_LIST") {
//                 self.popupListVisible = true;
//                 this.isPreview = true;
//             } else {
//                 self.popupVisible = true;
//                 this.isPreview = false;
//             }
//         } else {
//             abp.notify.error('Hãy chọn dòng dữ liệu', undefined, { "position": "top-end" });
//         }

//     }

//     onContentReady(e) {
//         const self = this;
//         if (self.get_storage) self.setLocalStorage();

//     }

//     setLocalStorage() {
//         const self = this;
//         const paging = self.data.instance.option("paging");
//         let formData = self.formData;
//         // lưu thông tin tìm kiếm
//         sessionStorage.setItem(`VU_${this.code}`, JSON.stringify({
//             "formData": formData,
//             "pageIndex": paging.pageIndex,
//             "pageSize": paging.pageSize
//         }));
//     }

//     getLocalStorage() {
//         const data = sessionStorage.getItem(`VU_${this.code}`);
//         this.formDataLocalStorage = [];
//         if (!(data === null || data === undefined) && data != "") {
//             let jData = JSON.parse(data);
//             if (JSON.stringify(jData.formData) != JSON.stringify({})) {
//                 this.formData = jData.formData;
//                 var listkey = Object.keys(this.formData);
//                 listkey.forEach(val => {
//                     var param = new FParameter();
//                     param.value = this.formData[val];
//                     param.varible = val;
//                     this.formDataLocalStorage.push(param);
//                 });
//             }
//             this.pageSize = jData.pageSize;
//             this.pageIndex = jData.pageIndex;
//         }
//         this.get_storage = true;
//     }

//     attachment(e: any) {
//         var listFile = e.split(";");
//         if (listFile.length == 1) {
//             var rootUrl = AppConsts.remoteServiceBaseUrl;
//             if (e.indexOf("/") == 0) {
//                 var link = rootUrl + e;
//                 window.open(link, '_blank');
//             } else {
//                 var link = rootUrl + "/" + e;
//                 window.open(link, '_blank');
//             }
//         }
//         else if (listFile.length > 1) {
//             this.popupVisibleAttachment = true;
//             this.attachmentList = [];
//             listFile.forEach(f => {
//                 var fileName = f.split("/");
//                 this.attachmentList.push({ tepDinhKem: fileName[fileName.length - 1], link: f });
//             });
//         }

//     }

//     showDetail(e: any) {
//         var rootUrl = AppConsts.remoteServiceBaseUrl;
//         if (e.indexOf("/") == 0) {
//             var link = rootUrl + e;
//             window.open(link, '_blank');
//         } else {
//             var link = rootUrl + "/" + e;
//             window.open(link, '_blank');
//         }
//     }

//     settingLink(link: any, data: any, type: any): String {
//         var link_param = link.split(/[{}]/).filter(l => l != "" && link.indexOf('{' + l + '}') != -1);
//         var link_split = link.split("?");
//         var userid = function (text) { return text.toLowerCase() == "userid" && text; };
//         //var query_param = link.split(/[()]/).filter(l => l != "" && link.indexOf('(' + l + ')') != -1 );
//         var nullable = function (text) { return text.indexOf("-nullable") != -1 && text; };
//         link_param.forEach(ele => {
//             switch (ele) {
//                 case "UtilityId": {
//                     if (this.utilityId != null && this.utilityId != undefined)
//                         link = link.replace("{UtilityId}", this.utilityId);
//                     break;
//                 }
//                 case userid(ele): {
//                     if (abp.session.userId != null && abp.session.userId != undefined)
//                         link = link.replace("{" + ele + "}", abp.session.userId);
//                     break;
//                 }
//                 case nullable(ele): {
//                     var variable = ele.substring(0, ele.indexOf("-nullable"));
//                     if (data[variable] != undefined && data[variable] != null) {
//                         link = link.replace("{" + ele + "}", data[variable]);
//                     } else {
//                         link = link.replace("{" + ele + "}", "null");
//                     }
//                     break;
//                 }
//                 default: {
//                     if (data[ele] != undefined && data[ele] != null) {
//                         link = link.replace("{" + ele + "}", data[ele]);
//                     }
//                     else if (this.Init_query_params.length > 0) {
//                         var search_value = this.Init_query_params.find(q => q.Varible.toString() == ele);
//                         if (search_value != undefined && search_value != null) {
//                             link = link.replace("{" + ele + "}", search_value.Value);
//                         }
//                     }
//                     else {
//                         abp.notify.error("Dữ liệu không tồn tại trường " + ele + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
//                         link = "";
//                     }
//                     break;
//                 }
//             }
//         });

//         var query_param_obj = "";
//         if (link_split.length == 2) {
//             var query_string = link_split[1];
//             if (query_string != "") {
//                 var query_param = query_string.split("&");
//                 query_param_obj = '{';
//                 query_param.forEach(p => {
//                     if (p != "") {
//                         var variable_value = p.split("=");
//                         if (variable_value.length == 2) {
//                             if (variable_value[0] != "" && variable_value[1] != "") {
//                                 var variable = variable_value[0];
//                                 var value = variable_value[1];
//                                 switch (value) {
//                                     case "UtilityId": {
//                                         if (this.utilityId != null && this.utilityId != undefined) {
//                                             query_param_obj = query_param_obj + '"' + variable.toString() + '":' + '"' + this.utilityId.toString() + '"' + ',';
//                                         } else {
//                                             abp.notify.error("Dữ liệu không tồn tại trường " + value + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
//                                             link = "";
//                                         }
//                                         break;
//                                     }
//                                     case userid(value): {
//                                         if (abp.session.userId != null && abp.session.userId != undefined) {
//                                             query_param_obj = query_param_obj + '"' + variable.toString() + '":' + '"' + abp.session.userId.toString() + '"' + ',';
//                                         }
//                                         else {
//                                             abp.notify.error("Dữ liệu không tồn tại trường " + value + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
//                                             link = "";
//                                         }
//                                         break;
//                                     }
//                                     default: {
//                                         if (data[value] != undefined && data[value] != null) {
//                                             query_param_obj = query_param_obj + '"' + variable.toString() + '":' + '"' + data[value].toString() + '"' + ',';
//                                         }
//                                         else if (this.Init_query_params.length > 0) {
//                                             var search_value = this.Init_query_params.find(q => q.Varible.toString() == value);
//                                             if (search_value != undefined && search_value != null) {
//                                                 query_param_obj = query_param_obj + '"' + value.toString() + '":' + '"' + search_value.Value.toString() + '"' + ',';
//                                             }
//                                         }
//                                         else {
//                                             abp.notify.error("Dữ liệu không tồn tại trường " + value + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
//                                             link = "";
//                                         }
//                                         break;
//                                     }
//                                 }
//                             } else {
//                                 abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
//                                 link = "";
//                             }
//                         } else {
//                             abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
//                             link = "";
//                         }
//                     } else {
//                         abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
//                         link = "";
//                     }
//                 });

//                 query_param_obj = query_param_obj.substring(0, query_param_obj.length - 1) + '}';
//                 if (type == 'REDIRECT') {
//                     this.query_params = query_param_obj;
//                 } else if (type == 'API') {
//                     this.api_query_params = query_param_obj;
//                 }
//                 link = link.replace("?" + query_string, "");
//             } else {
//                 abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
//                 link = "";
//             }
//         } else if (link_split.length > 2) {
//             abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
//             link = "";
//         }

//         return link;
//     }

//     settingLinkCreate(link: any, type: any): String {
//         var link_param = link.split(/[{}]/).filter(l => l != "" && link.indexOf('{' + l + '}') != -1);
//         var link_split = link.split("?");
//         var userid = function (text) { return text.toLowerCase() == "userid" && text; };
//         //var query_param = link.split(/[()]/).filter(l => l != "" && link.indexOf('(' + l + ')') != -1 );
//         link_param.forEach(ele => {
//             switch (ele) {
//                 case "UtilityId": {
//                     if (this.utilityId != null && this.utilityId != undefined)
//                         link = link.replace("{UtilityId}", this.utilityId);
//                     break;
//                 }
//                 case userid(ele): {
//                     if (abp.session.userId != null && abp.session.userId != undefined)
//                         link = link.replace("{" + ele + "}", abp.session.userId);
//                     break;
//                 }
//                 default: {
//                     var search_value = this.Init_query_params.find(q => q.Varible.toString() == ele);
//                     if (search_value != undefined && search_value != null) {
//                         link = link.replace("{" + ele + "}", search_value.Value);
//                     }
//                     else {
//                         abp.notify.error("Dữ liệu không tồn tại trường " + ele + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
//                         link = "";
//                     }
//                     break;
//                 }
//             }
//         });

//         var query_param_obj = "";
//         if (link_split.length == 2) {
//             var query_string = link_split[1];
//             if (query_string != "") {
//                 var query_param = query_string.split("&");
//                 query_param_obj = '{';
//                 query_param.forEach(p => {
//                     if (p != "") {
//                         var variable_value = p.split("=");
//                         if (variable_value.length == 2) {
//                             if (variable_value[0] != "" && variable_value[1] != "") {
//                                 var variable = variable_value[0];
//                                 var value = variable_value[1];
//                                 switch (value) {
//                                     case "UtilityId": {
//                                         if (this.utilityId != null && this.utilityId != undefined) {
//                                             query_param_obj = query_param_obj + '"' + variable.toString() + '":' + '"' + this.utilityId.toString() + '"' + ',';
//                                         } else {
//                                             abp.notify.error("Dữ liệu không tồn tại trường " + value + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
//                                             link = "";
//                                         }
//                                         break;
//                                     }
//                                     case userid(value): {
//                                         if (abp.session.userId != null && abp.session.userId != undefined) {
//                                             query_param_obj = query_param_obj + '"' + variable.toString() + '":' + '"' + abp.session.userId.toString() + '"' + ',';
//                                         }
//                                         else {
//                                             abp.notify.error("Dữ liệu không tồn tại trường " + value + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
//                                             link = "";
//                                         }
//                                         break;
//                                     }
//                                     default: {
//                                         var search_value = this.Init_query_params.find(q => q.Varible.toString() == value);
//                                         if (search_value != undefined && search_value != null) {
//                                             query_param_obj = query_param_obj + '"' + variable.toString() + '":' + '"' + search_value.Value.toString() + '"' + ',';
//                                         }
//                                         else {
//                                             abp.notify.error("Dữ liệu không tồn tại trường " + value + " để hoàn thành đường dẫn!", undefined, { "position": "top-end" });
//                                             link = "";
//                                         }
//                                         break;
//                                     }
//                                 }
//                             } else {
//                                 abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
//                                 link = "";
//                             }
//                         } else {
//                             abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
//                             link = "";
//                         }
//                     } else {
//                         abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
//                         link = "";
//                     }
//                 });

//                 query_param_obj = query_param_obj.substring(0, query_param_obj.length - 1) + '}';
//                 if (type == 'REDIRECT') {
//                     this.query_params = query_param_obj;
//                 } else if (type == 'API') {
//                     this.api_query_params = query_param_obj;
//                 }
//                 link = link.replace("?" + query_string, "");
//             } else {
//                 abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
//                 link = "";
//             }
//         } else if (link_split.length > 2) {
//             abp.notify.error("Đường dẫn không hợp lệ", undefined, { "position": "top-end" });
//             link = "";
//         }

//         return link;
//     }

//     loadHinChart(type: any, res: any) {
//         let datasets = [];
//         res.forEach(element => {
//             datasets.push({
//                 data: element.value_1.split(','),
//                 label: element.key_1
//             });
//         });
//         this.chartLabels = res[0].labels.split(',');
//         this.chartData = datasets;
//     }

//     findGetParameter() {
//         const self = this;
//         var parameters = window.location.search.substr(1);
//         self.Init_query_params = [];
//         var tmp = [];
//         if (parameters != "") {
//             parameters.split("&").forEach(function (item) {
//                 tmp = item.split("=");
//                 var paramTestItem = new Object();
//                 paramTestItem['Varible'] = tmp[0];
//                 paramTestItem['Value'] = decodeURIComponent(tmp[1]);
//                 if (tmp[0].toString().toLowerCase() == "userid") {
//                     self.userId_query = Number(decodeURIComponent(tmp[1]));
//                 }
//                 self.Init_query_params.push(paramTestItem);
//             });
//         }
//     }

//     addParamFormData(form_data: string, data: any): string {
//         var list_param = form_data.split(/[<>]/).filter(l => l != "" && form_data.indexOf('<' + l + '>') != -1);
//         var userid = function (text) { return text.toLowerCase() == "userid" && text; };
//         list_param.forEach(ele => {
//             switch (ele) {
//                 case "UtilityId": {
//                     if (this.utilityId != null && this.utilityId != undefined)
//                         form_data = form_data.replace("<UtilityId>", this.utilityId);
//                     break;
//                 }
//                 case userid(ele): {
//                     if (abp.session.userId != null && abp.session.userId != undefined)
//                         form_data = form_data.replace("<" + ele + ">", abp.session.userId.toString());
//                     break;
//                 }
//                 default: {
//                     if (data != undefined) {
//                         if (data[ele] != undefined && data[ele] != null) {
//                             form_data = form_data.replace("<" + ele + ">", '"' + data[ele] + '"');
//                         }
//                     }
//                     else if (this.Init_query_params.length > 0) {
//                         var search_value = this.Init_query_params.find(q => q.Varible.toString() == ele);
//                         if (search_value != undefined && search_value != null) {
//                             form_data = form_data.replace("<" + ele + ">", '"' + search_value.Value + '"');
//                         }
//                     }
//                     else {
//                         abp.notify.error("Dữ liệu không tồn tại trường " + ele + " để hoàn thành chức năng!", undefined, { "position": "top-end" });
//                         form_data = "{}";
//                     }
//                     break;
//                 }
//             }
//         });
//         return form_data;
//     }

//     saveGridData() {

//         var gridInstance = this.data.instance as any;
//         // var editData = gridInstance.getController("editing")._editData;

//         gridInstance.saveEditData();

//         // 

//         // editData.foreach(key => {
//         //     this.viewerService.editData(key.Id, key).subscribe(res => {
//         //         this.data.instance.refresh();
//         //     });
//         // });


//     }

//     importFile(e: any) {
//         const self = this;
//         var param = [];
//         if (self.utilityId != null || self.utilityId != undefined) {
//             param.push({ Varible: 'utilityId', Value: self.utilityId });
//         }
//         if (self.Init_query_params.length > 0) {
//             self.Init_query_params.forEach(element => {
//                 param.push({ Varible: element.Varible, Value: element.Value });
//             });
//         }

//         this.spinnerService.show();

//         var formData: FormData = new FormData();
//         formData.append('query_param', JSON.stringify(param));
//         formData.append('file', e.currentTarget.files[0], e.currentTarget.files[0].name);

//         this.http.post(AppConsts.remoteServiceBaseUrl + '/api/services/app/DRViewer/ImportData?reportId=' + self.currentReport, formData).subscribe((res: any) => {
//             self.spinnerService.hide();
//             if (res['result']['isSucceeded']) {
//                 abp.notify.success(res['result']['message'], undefined, { "position": "top-end" });
//                 setTimeout(() => {
//                     window.location.reload();
//                 }, 500);
//                 // self.data.instance.refresh();
//             } else {
//                 abp.notify.error(res['result']['message'], undefined, { "position": "top-end" });
//             }
//         }, (error: any) => {
//             self.spinnerService.hide();
//             abp.notify.error("Có lỗi xảy ra", undefined, { "position": "top-end" });
//         })
//         e.target.value = '';
//     }

//     downloadTemplate() {
//         const self = this;
//         if (this.linkDownLoadTemplate == '') {
//             if (self.utilityId != null || self.utilityId != undefined) {
//                 if (self.paramTest.find(e => e.Varible == "utilityId" && e.Value == self.utilityId) == undefined) {
//                     self.paramTest.push({ Varible: 'utilityId', Value: self.utilityId });
//                 }
//             }
//             if (self.Init_query_params.length > 0) {
//                 self.Init_query_params.forEach(element => {
//                     if (self.paramTest.find(e => e.Varible == element.Varible && e.Value == element.Value) == undefined) {
//                         self.paramTest.push({ Varible: element.Varible, Value: element.Value });
//                     }
//                 });
//             }

//             self.http.post(AppConsts.fileServerUrl + '/api/v1/Attachment/editortemplate?object_id=' + self.currentReport, self.paramTest).subscribe(res => {
//                 if (res['result']['isSucceeded']) {
//                     self.linkDownLoadTemplate = res['result']['data'];
//                     var link = AppConsts.fileServerUrl + "/" + self.linkDownLoadTemplate;
//                     window.open(link, '_blank');
//                 } else {
//                     abp.notify.error(res['result']['message'], undefined, { "position": "top-end" });
//                 }
//             })
//         } else {
//             var link = AppConsts.fileServerUrl + "/" + this.linkDownLoadTemplate;

//             window.open(link, '_blank');
//         }

//     }

//     loadDefaultfilter() {
//         const self = this;
//         self.viewerService.postDefaultFilterData(self.currentReport, self.Init_query_params).subscribe((res: any) => {
//             if (res.isSucceeded) {
//                 if (res.data != null) self.formData = res.data[0];
//                 self.getLocalStorage();
//             } else {
//                 abp.notify.error(res.Message, "Có lỗi ở cấu hình filter mặc định", { "position": "top-end" });
//             }
//         });
//     }

//     action_call_api_export(e: any, action: any = null) {
//         this.spinnerService.show();
//         const self = this;
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
//         this.http.post(AppConsts.fileServerUrl + '/ExportFile/DRGetExportFile?report_id=' + this.currentReport, self.paramTest, { responseType: 'blob' }).subscribe((response: any) => {
//             let dataType = response.type;
//             let binaryData = [];
//             binaryData.push(response);
//             let downloadLink = document.createElement('a');
//             downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
//             downloadLink.setAttribute('download', self.reportName);
//             document.body.appendChild(downloadLink);
//             downloadLink.click();
//             document.body.removeChild(downloadLink);
//             self.spinnerService.hide();
//         }, error => {
//             self.spinnerService.hide();
//             abp.notify.error("", "Có lỗi xảy ra", { "position": "top-end" });
//         })
//     }

//     onRowValidating(e) {

//         // var brokenRules = e.brokenRules,
//         //     errorText = brokenRules.map(function (rule) {
//         //         return rule.message;
//         //     }).join(", ");

//         // e.errorText = errorText; // show errorText where you want  
//         // debugger;
//         // this.notify.error(errorText, "Lỗi");
//     }

//     onCellPrepared(e) {
//         if (e.rowType == "data" && e.column.dataField == "__change" && this.isCheckEditStatus) {

//             // this.data.instance.cellValue(e.rowIndex, e.column.dataField, 1);
//             // this.data.instance.editCell(e.rowIndex, e.column.dataField);

//             this.listDataChange.push({
//                 rowIndex: e.rowIndex,
//                 dataField: e.column.dataField
//             })

//             if (e.rowIndex == this.data.instance.totalCount() - 1) {
//                 this.isCheckEditStatus = false;
//                 this.listDataChange.forEach(_data => {
//                     this.data.instance.cellValue(_data.rowIndex, _data.dataField, 1);
//                     this.data.instance.editCell(_data.rowIndex, _data.dataField);
//                 })
//                 //this.data.instance.saveEditData();
//             }

//         }
//     }

//     setDataChange() {
//         let total = this.data.instance.totalCount();

//         for (let _i = 0; _i < total; _i++) {
//             this.data.instance.cellValue(_i, "__change", 1);
//             this.data.instance.editCell(_i, "__change");
//         }
//     }

//     reloadCurrentRoute() {
//         let currentUrl = this.router.url;
//         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
//             this.router.navigate([currentUrl]);
//         });
//     }

// }

