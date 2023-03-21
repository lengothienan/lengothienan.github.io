// import {
//     SectionCustomFieldValueServiceProxy, SectionCustomFieldValueDto, ReportFormServiceProxy, ReportServiceProxy, ReportDetailServiceProxy
// } from './../../../../../shared/service-proxies/service-proxies';
// import { Component, OnInit, EventEmitter, Output, ViewChild, Injector, Input, Inject, Optional, SimpleChanges, SecurityContext, OnChanges } from '@angular/core';
// import { appModuleAnimation } from '@shared/animations/routerTransition';
// import { ModalDirective } from 'ngx-bootstrap';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AppComponentBase } from '@shared/common/app-component-base';
// import { API_BASE_URL } from '@shared/service-proxies/service-proxies';
// import { DxDataGridComponent, DxFileUploaderComponent } from 'devextreme-angular';
// import { retrieveState, storeState, showConfirm, clearState } from '@app/shared/util';
// import { AppConsts } from '@shared/AppConsts';
// import { DateService } from '@shared/utils/date.service';

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
// }

// @Component({
//     selector: 'appc-rf-report-detail',
//     templateUrl: './rf-report-detail.component.html',
// })

// export class RF_ReportDetailComponent extends AppComponentBase implements OnInit, OnChanges {
//     @ViewChild('reportDetailDg', { static: false }) reportDetailDg: DxDataGridComponent;

//     @Input() reportId: number;
//     @Input() isAllowEdit: Boolean = true;
//     isColumnAutoWidth: Boolean = false;
//     isValid: any = true;

//     private xmlData: any = '';

//     reportDetailColumns: any[] = [];
//     reportDetailDataSource: any;
//     reportDetails: any = [];

//     constructor(
//         injector: Injector,
//         private _activatedRoute: ActivatedRoute,
//         private reportService: ReportServiceProxy,
//         private reportDetailService: ReportDetailServiceProxy,
//         private dateService: DateService,
//         private router: Router,
//         @Optional() @Inject(API_BASE_URL) baseUrl?: string
//     ) {
//         super(injector);
//         this.loadReportDetailDataSource();
//     }
    
//     ngOnInit() {
//         // this.reportService.getReportById(this.reportId).subscribe(form => {
//         //     this.reportDetailService.getData(this.reportId, 'column').subscribe(res => {
//         //         this.isColumnAutoWidth = form.data[0].IsColumnAutoWidth;
//         //         this.reportDetailColumns = this.flatColumnsToTree(this.configColumns(res.data), '0');

//         //         if (form.data[0].IsCustomForm) {
//         //             this.reportDetailColumns.push({
//         //                 dataField: 'GroupSectionName',
//         //                 caption: 'Nhóm',
//         //                 groupIndex: 0
//         //             });
//         //         }
//         //         this.loadReportDetails(this.reportId);
//         //     });

//         // });
//     }

//     ngOnChanges(changes: SimpleChanges): void {
//         if (changes.reportId && changes.reportId.currentValue) {
//             this.reportService.getReportById(changes.reportId.currentValue).subscribe(form => {
//                 this.reportDetailService.getData(changes.reportId.currentValue, 'column').subscribe(res => {
//                     this.isColumnAutoWidth = form.data[0].IsColumnAutoWidth;
//                     this.reportDetailColumns = this.flatColumnsToTree(this.configColumns(res.data), '0');

//                     if (form.data[0].IsCustomForm) {
//                         this.reportDetailColumns.push({
//                             dataField: 'GroupSectionName',
//                             caption: 'Nhóm',
//                             groupIndex: 0
//                         });
//                     }
//                     this.loadReportDetails(changes.reportId.currentValue);
//                 });

//             });
//         }
//     }

//     onContentReady_ReportDetail($event) {
//         this.xmlData = '';
//     }

//     onRowPrepared_ReportDetail(e) {
//         $(e.rowElement).css({ height: 33 });
//         if (e.rowType != 'header' && e.data.IsParent == 'True') {
//             $(e.rowElement).css('background-color', 'aliceblue');
//         }
//     }

//     onRowUpdating_ReportDetail(e) {
//         let indexID = e.oldData[Object.keys(e.oldData)[0]];
//         let SectionName = e.oldData[Object.keys(e.oldData)[1]];
//         const keyNewData = Object.keys(e.newData);
//         for (let i = 0; i < keyNewData.length; i++) {
//             if (Object.keys(e.oldData).indexOf(keyNewData[i]) == 0) {
//                 indexID = e.newData[keyNewData[i]];
//             } else if (Object.keys(e.oldData).indexOf(keyNewData[i]) == 1) {
//                 SectionName = e.newData[keyNewData[i]];
//             }
//         }

//         keyNewData.forEach(key => {
//             const reportDetail = this.getReportDetail(e.oldData['SectionID'], SectionName);

//             this.xmlData += '<column>';
//             this.xmlData += '<ID>' + reportDetail[key] + '</ID>';
//             this.xmlData += '<SectionID>' + e.oldData['SectionID'] + '</SectionID>';
//             this.xmlData += '<ColumnID>' + key.split('_')[1] + '</ColumnID>';
//             this.xmlData += '<Value>' + e.newData[key] + '</Value>';
//             this.xmlData += '<IndexID>' + indexID + '</IndexID>';
//             this.xmlData += '<SectionName>' + SectionName + '</SectionName>';
//             this.xmlData += '</column>';
//         });
//     }

//     onEditingStart_ReportDetail(e) {
//         if ((e.data.IsParent != 'False' && e.data.IsParent != false) || !this.isAllowEdit) {
//             e.cancel = true;
//         }
//     }

//     onEditorPreparing_ReportDetail(e) {
//         if (e.row.data.IsParent == 'False' || e.row.data.IsParent == false) {
//             if (e.parentType == 'dataRow') {
//                 const rowIndex = e.row.rowIndex;
//                 const datagridInstance = this.reportDetailDg.instance;

//                 // Color row selected
//                 if (this.isAllowEdit) {
//                     $(datagridInstance.getRowElement(rowIndex)).css('background-color', 'rgba(92, 184, 92, 0.5)');
//                 }
//             }
//         } else {
//             e.cancel = true;
//         }
//     }

//     onRowValidating_ReportDetail(e) {
//         if (!e.isValid) {
//             this.isValid = e.isValid;
//         }
//     }

//     onCellPrepared_ReportDetail(e) {
//         if (e.rowType === 'data') {
//             //$(e.cellElement).addClass(e.key.DataType);
//             $(e.cellElement).addClass(jQuery.type(e.key));
//             if (e.data.isParent === 'True') {
//                 $(e.cellElement).on('click', function (args) { return false; });
//             }
//         }
//     }

//     public saveEditData() {
//         if (this.reportDetailDg && this.reportDetailDg.instance && this.isAllowEdit) {
//             this.reportDetailDg.instance.saveEditData();
//         }
//     }

//     public refresh() {
//         if (this.reportDetailDg && this.reportDetailDg.instance) {
//             this.reportDetailDg.instance.refresh();
//             this.loadReportDetails();
//         }
//     }

//     private loadReportDetailDataSource() {
//         const self = this;
//         this.reportDetailDataSource = {
//             load: function (loadOptions: any) {
//                 const promise = new Promise((resolve, reject) => {
//                     self.reportDetailService.getData(self.reportId, 'data').subscribe((res: any) => {
//                         resolve(res);
//                     });
//                 });
//                 return promise;
//             },
//             key:"SectionID",
//             update: function (key, values) {
                
//             },
//         };
//     }

//     private loadReportDetails(reportId?: any) {
//         this.reportDetailService.getReportDetailsByReportId(this.reportId || reportId).subscribe(res => {
//             this.reportDetails = res.data;
//         });
//     }

//     private getReportDetail(sectionId, sectionName?) {
//         return this.reportDetails.find(e => {
//             if (sectionId && sectionId.length > 0) {
//                 return e.SectionID === sectionId;
//             }

//             return e[Object.keys(e)[1]] === sectionName;
//         });
//     }

//     public getXmlData() {
//         if (!this.isValid) {
//             this.isValid = true;
//             throw new Error('Dữ liệu không hợp lệ');
//         }
//         return this.xmlData;
//     }

//     private configColumns(columns: any[]) {
//         const results: DxColumn[] = [];

//         columns.forEach(column => {
//             const newColumn = new DxColumn();
//             newColumn.dataField = `Col_${column.ColumnID}`;
//             newColumn.caption = column.ColumnName;
//             newColumn.visible = !(column.ColumnID === 105 || column.ColumnID === 107);
//             newColumn.alignment = column.Alignment;

//             if (this.isColumnAutoWidth) {
//                 if (column.Width) {
//                     newColumn.minWidth = column.Width;
//                 }

//             } else {
//                 newColumn.fixed = column.isFixed == 'True' || column.isFixed == true;
//                 if (column.Width) {
//                     newColumn.width = column.Width;
//                 }
//             }

//             newColumn.allowEditing = column.isBalance === 'False' || column.IsValue === 'True' || column.IsValue === true;
//             newColumn.id = column.ColumnID;
//             newColumn.parentId = column.ParentID;

//             if (column.DataType && column.DataType.includes('number')) {
//                 newColumn.dataType = 'number';
//                 newColumn.format = this.formatNumber;
//             } else {
//                 newColumn.dataType = column.DataType;
//             }

//             newColumn.isParent = column.isParent;
  
//             if (column.DataType === 'number') {
//                 newColumn.validationRules = [{
//                     type: 'pattern',
//                     pattern: /^(0|([1-9]\d*))$/,
//                     message: 'Phải là một số nguyên dương'
//                 }];
//             } else if (column.DataType === 'number_negative') {
//                 newColumn.validationRules = [{
//                     type: 'pattern',
//                     pattern: /^\d+$/,
//                     message: 'Phải là một số nguyên dương'
//                 }];
//             } else if (column.DataType === 'number_float') {
//                 newColumn.validationRules = [{
//                     type: 'pattern',
//                     pattern: /^[+-]?\d+(\.\d+)?$/,
//                     message: 'Phải là một số nguyên dương'
//                 }];
//             }

//             if (column.OrderID === '2' || column.OrderID === 2) { // Section column
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

//     validateNumberPositive(e) {
//         return !this.isNaturalNumber(e.value);
//     }

//     validateNumberNegative(e) {
//         return !Number.isInteger(e.value);
//     }

//     validateNumberFloat(e) {
//         return !this.isDecimalNumber(e.value);
//     }

//     private isDecimalNumber(value) {
//         const re = /^[-+]?[0-9]+\.[0-9]+$/;
//         const found = value.toString().match(re);
//         return found != null && found != undefined;
//     }

//     private isNaturalNumber(value) {
//         const n1 = Math.abs(value),
//             n2 = parseInt(value, 10);
//         return !isNaN(n1) && n2 === n1 && n1.toString() === value;
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

//     formatNumber(value: any): string {
//         if (typeof (value) !== 'number') {
//             value = parseFloat(value);
//         }

//         return value.toLocaleString('vi');
//     }

//     unformatNumber(value: any): string {
//         if (!value) {
//             return value;
//         }

//         return value.replace(/[.]/g, '');
//     }
// }
