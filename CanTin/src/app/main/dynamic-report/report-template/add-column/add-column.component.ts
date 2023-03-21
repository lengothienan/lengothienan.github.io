// import {
//     SwapOrderIdViewModel,
//     ReportFormServiceProxy,
//     SectionServiceProxy,
//     ColumnsServiceProxy,
//     ColumnDto
// } from './../../../../../shared/service-proxies/service-proxies';
// import { Component, OnInit, EventEmitter, Output, ViewChild, Injector, Input, Inject, Optional } from '@angular/core';
// import { appModuleAnimation } from '@shared/animations/routerTransition';
// import { ModalDirective } from 'ngx-bootstrap';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AppComponentBase } from '@shared/common/app-component-base';
// import { API_BASE_URL } from '@shared/service-proxies/service-proxies';
// import { DxDataGridComponent } from 'devextreme-angular';
// import { retrieveState, storeState, showConfirm, clearState } from '@app/shared/util';
// import { AppConsts } from '@shared/AppConsts';


// @Component({
//     selector: 'appc-add-column',
//     templateUrl: './add-column.component.html',
// })

// export class AddColumnComponent extends AppComponentBase {
//     columnData: ColumnDto = new ColumnDto();

//     parentOptions: any;
//     dataTypeOptions: any;
//     alignmentOptions: any;
//     formulaOptions: any;

//     formId: any;
//     columnID: any;
//     alignmentList: any = [
//         { 'code': 'left', 'name': 'Trái' },
//         { 'code': 'center', 'name': 'Giữa' },
//         { 'code': 'right', 'name': 'Phải' }
//     ];

//     dataTypeList: any = [
//         { 'code': 'string', 'name': 'Chuỗi' },
//         { 'code': 'number', 'name': 'Số dương' },
//         { 'code': 'number_negative', 'name': 'Số âm' },
//         { 'code': 'number_float', 'name': 'Số thập phân' },
//         { 'code': 'date', 'name': 'Thời gian' }
//     ];
//     formulaDataSource: any = ['sum', 'count', 'average'];

//     constructor(
//         injector: Injector,
//         private _activatedRoute: ActivatedRoute,
//         private columnService: ColumnsServiceProxy,
//         private router: Router,
//         @Optional() @Inject(API_BASE_URL) baseUrl?: string
//     ) {
//         super(injector);
//         this.loadParent();
//         this.loadDataType();
//         this.loadAlignment();
//         this.loadFormula();
//     }

//     loadParent() {
//         const self = this;
//         this.parentOptions = {
//             dataSource: {
//                 loadMode: 'raw',
//                 load: function () {
//                     const promise = new Promise((resolve, reject) => {
//                         self.columnService.getParentColumn(self.formId).subscribe(res => {
//                             let data = [];
//                             debugger
//                             if (res.data.length > 0) {
//                                 data = res.data;
//                             }
//                             resolve(data);
//                         });
//                     });
//                     return promise;
//                 },
//                 byKey: function (key, extra) {
//                     if (!key || key === -1 || key === 0) { return; }
//                     const promise = new Promise((resolve, reject) => {
//                         self.columnService.getColumnById(key).subscribe((res: any) => {
//                             if (res.data != undefined)
//                                 resolve(res.data);
//                             else
//                                 resolve([]);
//                         });
//                     });
//                     return promise;
//                 },
//             },
//             searchEnabled: true,
//             valueExpr: 'id',
//             displayExpr: 'columnName',
//             showClearButton: true
//         };
//     }

//     loadDataType() {
//         this.dataTypeOptions = {
//             dataSource: this.dataTypeList,
//             searchEnabled: true,
//             valueExpr: 'code',
//             displayExpr: 'name',
//             showClearButton: true
//         };
//     }

//     loadAlignment() {
//         this.alignmentOptions = {
//             dataSource: this.alignmentList,
//             searchEnabled: true,
//             valueExpr: 'code',
//             displayExpr: 'name',
//             showClearButton: true
//         };
//     }

//     loadFormula() {
//         this.formulaOptions = {
//             items: this.formulaDataSource,
//             showClearButton: true
//         };
//     }

//     load() {
//         if (this.columnID !== '-1') {
//             this.columnService.getColumnById(this.columnID).subscribe(res => {
//                 if (res.data != null) {
//                     this.columnData = res.data;
//                 }
//             });
//         }
//     }

//     back() {
//         this.router.navigate(['/app/main/report-template/view-detail/' + this.formId + '/3']);
//     }

//     save() {
//         this.columnData.formId = this.formId;
//         if (this.columnID == -1) {
//             this.columnService.create(this.columnData).subscribe(res => {
//                 this.notify.success(this.l('Tạo cột thành công'));
//             });
//         } else {
//             this.columnData.id = this.columnID;

//             this.columnService.update(this.columnData).subscribe(res => {
//                 this.notify.success(this.l('Cập nhật cột thành công'));
//             });
//         }

//         this.back();
//     }

//     ngOnInit() {
//         this._activatedRoute.params.subscribe(param => {
//             this.formId = param['formid'];
//             this.columnID = param['id'];
//             this.load();
//         });
//     }

// }
