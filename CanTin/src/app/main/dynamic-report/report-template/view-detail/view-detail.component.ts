// import { id } from '@swimlane/ngx-datatable';
// import { data } from 'jquery';
// import {
//     SwapOrderIdViewModel,
//     ReportFormServiceProxy,
//     SectionServiceProxy,
//     ColumnsServiceProxy,
//     UnitFormServiceProxy,
//     SectionCustomFieldsServiceProxy, 
//     ReportGroupServiceProxy,
//     ReportTypeServiceProxy,
//     ReportFormDto,
//     UnitFormUpdateDto
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
// import { HttpClient, HttpEventType } from '@angular/common/http';


// @Component({
//     selector: 'appc-report-form-detail',
//     templateUrl: './view-detail.component.html',
// })

// export class ReportFormDetailComponent extends AppComponentBase {

//     @ViewChild('sectionDg', { static: false }) sectionDg: DxDataGridComponent;
//     @ViewChild('columnDg', { static: false }) columnDg: DxDataGridComponent;
//     @ViewChild('sectionFieldDg', { static: false }) sectionFieldDg: DxDataGridComponent;
//     @ViewChild('unitDg', { static: false }) unitDg: DxDataGridComponent;

//     currentFormID: any;
//     currentReportType: any;
//     currentTab: number;

//     isSpecial: any;
//     isActive: any;
//     typeID: any;
//     groupID: any;
//     datatype: any;
//     datagroup: any;
//     oldForm: any;
//     obj: any;
//     setvisible: any;
//     searchNameSection: any = '';
//     sectionData1: any;
//     ParentID: any;
//     dataSource: any;

//     // New
//     templateData: ReportFormDto = new ReportFormDto();

//     parentOptions: any;
//     reportGroupOptions: any;
//     reportTypeOptions: any;
//     formTypeOptions: any = {
//         dataSource: [
//             { value: 0, display: 'Bình thường' },
//             { value: 2, display: 'Không tiêu chí' },
//             { value: 3, display: 'Một tiêu chí' }
//         ],
//         valueExpr: 'value',
//         displayExpr: 'display'
//     };

//     // Sections
//     sectionDataSearch: any = {
//         formName: ''
//     };

//     sectionsDataSource: any;

//     // Column
//     columnDataSearch: any = {
//         columnName: ''
//     };
//     columnDataSource: any;

//     // Unit
//     unitDataSearch: any = {
//         name: ''
//     };
//     unitDataSource: any;

//     // Section field
//     customFieldDataSearch: any = {
//         name: ''
//     };
//     sectionFieldDataSource: any;

//     makeReportPopupVisible: any = false;

//     uploadUrl: string;
//     value: any[] = [];

//     constructor(
//         injector: Injector,
//         private _activatedRoute: ActivatedRoute,
//         private reportTemplateService: ReportFormServiceProxy,
//         private sectionService: SectionServiceProxy,
//         private columnService: ColumnsServiceProxy,
//         private unitFormService: UnitFormServiceProxy,
//         private sectionCustomFieldService: SectionCustomFieldsServiceProxy, 
//         private reportGroupService: ReportGroupServiceProxy,
//         private reportTypeService: ReportTypeServiceProxy,
//         private router: Router,
//         private http: HttpClient,
//         @Optional() @Inject(API_BASE_URL) baseUrl?: string
//     ) {
//         super(injector);
//         this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/DemoUiComponents/UploadFile_ReportForm';
//         this.loadParent();
//         this.loadReportGroup();
//         this.loadReportType();
//     }

//     openMakeReportPopup() {
//         this.makeReportPopupVisible = true;
//     }

//     closeMakeReportPopup() {
//         this.makeReportPopupVisible = false;
//     }

//     loadParent() {
//         const self = this;
//         this.parentOptions = {
//             dataSource: {
//                 loadMode: 'raw',
//                 load: function () {
//                     const promise = new Promise((resolve, reject) => {
//                         self.reportTemplateService.searchNonParentForm(this.currentFormID).subscribe((res: any) => {
//                             let data = [];
//                             if (res.data.length > 0)
//                                 data = res.data;
//                             resolve(data);
//                         });
//                     });

//                     return promise;
//                 },
//                 byKey: function (key, extra) {
//                     const promise = new Promise((resolve, reject) => {
//                         debugger
//                         self.reportTemplateService.getFormByID(key).subscribe((res: any) => {
//                             let data = [];
//                             if (res.data.length > 0)
//                                 data = res.data;
//                             resolve(data);
//                         });
//                     });

//                     return promise;
//                 },
//             },
//             searchEnabled: true,
//             valueExpr: 'id',
//             displayExpr: 'formName',
//             showClearButton: true
//         };
//     }

//     loadReportGroup() {
//         const self = this;
//         this.reportGroupOptions = {
//             dataSource: {
//                 loadMode: 'raw',
//                 load: function () {
//                     const promise = new Promise((resolve, reject) => {
//                         self.reportGroupService.getAll().subscribe((res: any) => {
//                             let data = [];
//                             if (res.isSucceeded)
//                                 data = res.data;
//                             resolve(data);
//                         });
//                     });

//                     return promise;
//                 },
//                 byKey: function (key, extra) {
//                     const promise = new Promise((resolve, reject) => {
//                         self.reportGroupService.getById(key).subscribe((res: any) => {
//                             let data = [];
//                             if (res.isSucceeded)
//                                 data = res.data;
//                             resolve(data);
//                         });
//                     });

//                     return promise;
//                 },
//             },
//             searchEnabled: true,
//             valueExpr: 'id',
//             displayExpr: 'reportGroupName',
//             showClearButton: true
//         };
//     }

//     loadReportType() {
//         const self = this;
//         this.reportTypeOptions = {
//             dataSource: {
//                 loadMode: 'raw',
//                 load: function () {
//                     const promise = new Promise((resolve, reject) => {
//                         self.reportTypeService.getAll().subscribe((res: any) => {
//                             let data = [];
//                             if (res.isSucceeded)
//                                 data = res.data;
//                             resolve(data);
//                         });
//                     });

//                     return promise;
//                 },
//                 byKey: function (key, extra) {
//                     const promise = new Promise((resolve, reject) => {
//                         self.reportTypeService.getById(key).subscribe((res: any) => {
//                             let data = [];
//                             if (res.isSucceeded)
//                                 data = res.data;
//                             resolve(data);
//                         });
//                     });

//                     return promise;
//                 },
//             },
//             searchEnabled: true,
//             valueExpr: 'id',
//             displayExpr: 'reportTypeName',
//             showClearButton: true
//         };
//     }

//     loadSectionDataGrid() {
//         this.sectionDataSearch = retrieveState('STATE_SEARCH_SECTION') || {
//             formName: '',
//             pageSize: 20,
//             pageIndex: 0
//         };

//         const self = this;
//         this.sectionsDataSource = {
//             load: function (loadOptions: any) {
//                 const promise = new Promise((resolve, reject) => {
//                     self.sectionService.getByFormAndName(self.currentFormID || -1, self.sectionDataSearch.formName).subscribe((res: any) => {
//                         let data = [];
//                         if (res.isSucceeded)
//                             data = res.data;
//                         resolve(data);
//                     });
//                 });

//                 return promise;
//             },
//             reorder: function (draggingRowKey, targetRowKey) {
//                 // const promise = new Promise((resolve, reject) => {
//                 //     self.sectionService.reorder(draggingRowKey, targetRowKey).subscribe((res: any) => {
//                 //         resolve(res);
//                 //     });
//                 // });
//                 // return promise;
//             },
//             key: 'id'
//         };
//     }

//     loadColumnDataGrid() {
//         this.columnDataSearch = retrieveState('STATE_SEARCH_COLUMN') || {
//             columnName: '',
//             pageSize: 20,
//             pageIndex: 0
//         };

//         const self = this;
//         this.columnDataSource = {
//             load: function (loadOptions: any) {
//                 const promise = new Promise((resolve, reject) => {
//                     self.columnService.getColumnByName(self.currentFormID || -1, self.columnDataSearch.columnName).subscribe((res: any) => {
//                         resolve(res);
//                     });
//                 });

//                 return promise;
//             },
//             reorder: function (draggingRowKey, targetRowKey) {
//                 // const promise = new Promise((resolve, reject) => {
//                 //     self.columnService.reorder(draggingRowKey, targetRowKey).subscribe((res: any) => {
//                 //         resolve(res);
//                 //     });
//                 // });
//                 // return promise;
//             },
//             key: 'id'
//         };
//     }

//     loadSectionFieldDataGrid() {
//         this.customFieldDataSearch = retrieveState('STATE_SEARCH_SECTION_FIELD') || {
//             name: '',
//             pageSize: 20,
//             pageIndex: 0
//         };

//         const self = this;
//         this.sectionFieldDataSource = {
//             load: function (loadOptions: any) {
//                 const promise = new Promise((resolve, reject) => {
//                     self.sectionCustomFieldService.getAll(self.currentFormID || -1, self.customFieldDataSearch.name).subscribe((res: any) => {
//                         if (res.data != null)
//                             resolve(res.data);
//                         else
//                             resolve([]);
//                     });
//                 });

//                 return promise;
//             }
//         };
//     }

//     loadUnitDataGrid() {
//         this.unitDataSearch = retrieveState('STATE_SEARCH_UNIT') || {
//             name: '',
//             pageSize: 20,
//             pageIndex: 0
//         };

//         const self = this;
//         this.unitDataSource = {
//             load: function (loadOptions: any) {
//                 const promise = new Promise((resolve, reject) => {
//                     self.unitFormService.getUnitFormByName(self.currentFormID || -1, self.unitDataSearch.name).subscribe((res: any) => {
//                         if (res.data != null)
//                             resolve(res.data);
//                         else
//                             resolve([]);
//                     });
//                 });

//                 return promise;
//             },
//             key: 'id'
//         };
//     }
//     // End New

//     loadFormData() {
//         this._activatedRoute.params.subscribe(params => {
//             this.currentFormID = params['id'];
//         });
//         if (this.currentFormID && this.currentFormID != 'null' && this.currentFormID != undefined) {
//             this.reportTemplateService.getFormByID(parseInt(this.currentFormID)).subscribe((res: any) => {
//                 if (res.data.length <= 0)
//                     return;
//                 let data = new ReportFormDto;
//                 data.description = res.data[0].Description;
//                 data.displayName = res.data[0].DisplayName;
//                 data.fileName = res.data[0].FileName;
//                 data.formCode = res.data[0].FormCode;
//                 data.formName = res.data[0].FormName;
//                 data.formType = res.data[0].FormType == "" ? null : parseInt(res.data[0].FormType);
//                 data.id = res.data[0].Id == "" ? null : parseInt(res.data[0].Id);
//                 data.isActive = res.data[0].IsActive;
//                 data.isAutoLock = res.data[0].IsAutoLock;
//                 data.isColumnAutoWidth = res.data[0].IsColumnAutoWidth;
//                 data.isCustomForm = res.data[0].IsCustomForm;
//                 data.isDelete = res.data[0].IsDelete;
//                 data.isParent = res.data[0].IsParent;
//                 data.isSpecial = res.data[0].IsSpecial;
//                 data.orderID = res.data[0].OrderID;
//                 data.parentId = res.data[0].ParentId == "" ? null : parseInt(res.data[0].ParentId);
//                 data.pathTemplate = res.data[0].PathTemplate;
//                 data.reportGroupId = res.data[0].ReportGroupId == "" ? null : parseInt(res.data[0].ReportGroupId);
//                 data.reportTypeId = res.data[0].ReportTypeId == "" ? null : parseInt(res.data[0].ReportTypeId);
//                 this.templateData = data;
//                 let reportTypeID = data.reportTypeId;
//                 this.currentReportType = reportTypeID === 2 ? 'thang' :
//                     reportTypeID === 3 ? 'qui' :
//                         reportTypeID === 4 ? '6thang' :
//                             reportTypeID === 5 ? 'nam' : null;
//             });
//         }
//     }

//     searchSection() {
//         if (this.sectionDg && this.sectionDg.instance) {
//             this.sectionDg.instance.refresh();
//         }
//     }

//     searchColumn() {
//         if (this.columnDg && this.columnDg.instance) {
//             this.columnDg.instance.refresh();
//         }
//     }

//     searchSectionField() {
//         if (this.sectionFieldDg && this.sectionFieldDg.instance) {
//             this.sectionFieldDg.instance.refresh();
//         }
//     }

//     searchUnit() {
//         if (this.unitDg && this.unitDg.instance) {
//             this.unitDg.instance.refresh();
//         }
//     }

//     deleteColumn(columnId: number) {
//         const self = this;
//         showConfirm('Bạn chắc chắn muốn xóa', 'Cột này sẽ không được phục hồi', () => {
//             self.columnService.delete(columnId).subscribe(() => {
//                 this.notify.success('Xóa cột thành công!');
//                 self.searchColumn();
//             });
//         });
//     }

//     addEditSection(id: any) {
//         this.router.navigate(['/app/main/report-template/add-section/' + id + '/' + this.currentFormID]);
//     }

//     deleteSection(sectionId: number) {
//         const self = this;
//         showConfirm('Bạn chắc chắn muốn xóa', 'Cột này sẽ không được phục hồi', () => {
//             self.sectionService.delete(sectionId).subscribe(() => {
//                 this.notify.success('Xóa tiêu chí thành công!');
//                 self.searchSection();
//             });
//         });
//     }

//     addEditColumn(id: any) {
//         this.router.navigate(['/app/main/report-template/add-column/' + id + '/' + this.currentFormID]);
//     }

//     // upload file
//     fileChange(event) {
//         if (event.target.files.length === 0) {
//             return;
//         }
//         const files = event.target.files;
//         let fileToUpload = <File>files[0];
//         const formData = new FormData();
//         formData.append('files', fileToUpload, fileToUpload.name);


//         this.http.post(this.uploadUrl, formData, { reportProgress: true, observe: 'events' })
//             .subscribe(event => {
//                 // if (event.type === HttpEventType.UploadProgress)
//                 // {
//                 //   this.progress = Math.round(100 * event.loaded / event.total);
//                 //   console.log(this.uploadUrl);
//                 // }
//                 // else 
//                 if (event.type === HttpEventType.Response) {
//                     this.templateData.pathTemplate = event.body["data"].filePath2;
//                     this.templateData.fileName = event.body["data"].fileName;
//                     this.notify.success(this.l('Upload thành công'));
//                 }
//             });
//     }

//     public upload_File = (files) => {
//         if (files.length === 0) {
//             return;
//         }

//         let fileToUpload = <File>files[0];
//         const formData = new FormData();
//         formData.append('files', fileToUpload, fileToUpload.name);


//         this.http.post(this.uploadUrl, formData, { reportProgress: true, observe: 'events' })
//             .subscribe(event => {
//                 // if (event.type === HttpEventType.UploadProgress)
//                 // {
//                 //   this.progress = Math.round(100 * event.loaded / event.total);
//                 //   console.log(this.uploadUrl);
//                 // }
//                 // else 
//                 if (event.type === HttpEventType.Response) {
//                     debugger
//                     this.notify.success(this.l('Upload thành công'));
//                 }
//             });
//     }

//     setFullNameFile() {
//         debugger
//         this.value.forEach((ele) => {

//         });
//     }

//     save($event) {
//         $event.preventDefault();

//         if (this.currentFormID != 'null') {
//             this.reportTemplateService.updateForm(this.templateData).subscribe(res => {
//                 if (res.isSucceeded) {
//                     this.notify.success('Thêm mới biểu mẫu thành công!');
//                     this.router.navigate(['/app/main/report-template/search']);
//                 }
//             });
//         } else {
//             this.reportTemplateService.insertForm(this.templateData).subscribe(res => {
//                 if (res.isSucceeded) {
//                     this.notify.success('Cập nhật biểu mẫu thành công!');

//                     this.router.navigate(['/app/main/report-template/search']);
//                 } else {
//                     this.notify.error('Có lỗi xảy ra trong quá trình xử lý');
//                 }
//             });
//         }
//     }

//     back() {
//         this.router.navigate(['/app/main/report-template/search']);
//     }

//     saveUnitForm() {
//         const obj = new UnitFormUpdateDto();

//         const selectedRows = this.unitDg.instance.getSelectedRowsData();

//         if (!selectedRows) { return; }

//         const listUnit = selectedRows.reduce((acc, currentValue) => {
//             return acc + (acc === '' ? '' : ';') + currentValue.id;
//         }, '');

//         obj.formId = this.currentFormID;
//         obj.units = listUnit;

//         this.unitFormService.update(obj).subscribe(res => {
//             this.notify.success('Lưu thành công');
//         });
//     }

//     addSectionField(id: any) {
//         this.router.navigate(['/app/main/report-template/add-section-field/' + id + '/' + this.currentFormID]);
//     }

//     updateValueSectionField(id: number) {
//         this.router.navigate(['./app/main/report-template/set-value/' + id + '/' + this.currentFormID]);
//     }

//     deleteSectionField(id: number) {
//         const self = this;
//         showConfirm('Bạn có muốn xóa', 'Xóa tiêu chí này sẽ không được phục hồi', () => {
//             self.sectionCustomFieldService.delete(id).subscribe(res => {
//                 this.notify.success('Xóa custom field thành công');
//                 self.searchSectionField();
//             });
//         });
//     }

//     ngOnInit() {
//         this._activatedRoute.params.subscribe(params => {
//             this.currentFormID = params['id'];
//             this.onSelectTab(parseInt(params['tab'], 10));
//         });
//     }

//     onSelectTab(tab) {
//         this.currentTab = tab;

//         this.clearStateSearchTab(tab);

//         switch (tab) {
//             case 1: this.loadFormData(); break;
//             case 2: this.loadSectionDataGrid(); break;
//             case 3: this.loadColumnDataGrid(); break;
//             case 4: this.loadUnitDataGrid(); break;
//             case 5: this.loadSectionFieldDataGrid(); break;
//         }
//     }

//     clearStateSearchTab(tab) {
//         if (tab !== 2) { clearState('STATE_SEARCH_SECTION'); }
//         if (tab !== 3) { clearState('STATE_SEARCH_COLUMN'); }
//         if (tab !== 4) { clearState('STATE_SEARCH_UNIT'); }
//         if (tab !== 5) { clearState('STATE_SEARCH_SECTION_FIELD'); }
//     }

//     onContentReadyUnit(e) {
//         this.unitDataSearch.pageSize = e.component.pageSize();
//         this.unitDataSearch.pageIndex = e.component.pageIndex();

//         storeState(this.unitDataSearch, 'STATE_SEARCH_UNIT');

//         e.component.columnOption('command:select', 'visibleIndex', 999);
//         this.unitFormService.getUnitFormById(this.currentFormID).subscribe(res => {
//             e.component.selectRows(Array.from(res.data, x => x["unitId"]), true);
//         });
//     }

//     initDraggingSection(e) {
//         const self = this;
//         const $gridElement = $(e.element);

//         $gridElement.find('.row-draggable').draggable({
//             helper: 'clone',
//             start: function (event, ui) {
//                 const $originalRow = $(this), $clonedRow = ui.helper;
//                 const $originalRowCells = $originalRow.children(), $clonedRowCells = $clonedRow.children();
//                 for (let i = 0; i < $originalRowCells.length; i++) {
//                     $($clonedRowCells.get(i)).width($($originalRowCells.get(i)).width());
//                 }

//                 $originalRow.addClass('bg-selected');
//                 $clonedRow.width($originalRow.width()).addClass('bg-light');
//             },
//             stop: function (event, ui) {
//                 const $originalRow = $(this);
//                 $originalRow.removeClass('bg-selected');
//             }
//         });

//         $gridElement.find('.row-draggable').droppable({
//             over: function (event, ui) {
//                 const $dropRow = $(this);
//                 $dropRow.addClass('bg-droppable');
//             },
//             out: function (event, ui) {
//                 const $dropRow = $(this);
//                 $dropRow.removeClass('bg-droppable');
//             },
//             drop: function (event, ui) {
//                 const draggingRowKey = ui.draggable.data('row-value');
//                 const targetRowKey = $(this).data('row-value');

//                 const dataSource = e.component.option('dataSource');

//                 dataSource.reorder(draggingRowKey, targetRowKey).then(() => {
//                     self.sectionDg.instance.refresh();
//                 });
//             }
//         });
//     }

//     onContentReadySection(e) {
//         this.sectionDataSearch.pageSize = e.component.pageSize();
//         this.sectionDataSearch.pageIndex = e.component.pageIndex();

//         storeState(this.sectionDataSearch, 'STATE_SEARCH_SECTION');

//         this.initDraggingSection(e);
//     }

//     onRowPrepared_Section(e) {
//         if (e.rowType != 'data') { return; }

//         $(e.rowElement).addClass('row-draggable').data('row-value', e.key);
//     }

//     initDraggingColumn(e) {
//         const self = this;
//         const $gridElement = $(e.element);

//         $gridElement.find('.row-draggable').draggable({
//             helper: 'clone',
//             start: function (event, ui) {
//                 const $originalRow = $(this), $clonedRow = ui.helper;
//                 const $originalRowCells = $originalRow.children(), $clonedRowCells = $clonedRow.children();
//                 for (let i = 0; i < $originalRowCells.length; i++) {
//                     $($clonedRowCells.get(i)).width($($originalRowCells.get(i)).width());
//                 }

//                 $originalRow.addClass('bg-selected');
//                 $clonedRow.width($originalRow.width()).addClass('bg-light');
//             },
//             stop: function (event, ui) {
//                 const $originalRow = $(this);
//                 $originalRow.removeClass('bg-selected');
//             }
//         });

//         $gridElement.find('.row-draggable').droppable({
//             over: function (event, ui) {
//                 const $dropRow = $(this);
//                 $dropRow.addClass('bg-droppable');
//             },
//             out: function (event, ui) {
//                 const $dropRow = $(this);
//                 $dropRow.removeClass('bg-droppable');
//             },
//             drop: function (event, ui) {
//                 const draggingRowKey = ui.draggable.data('row-value');
//                 const targetRowKey = $(this).data('row-value');

//                 const dataSource = e.component.option('dataSource');

//                 dataSource.reorder(draggingRowKey, targetRowKey).then(() => {
//                     self.columnDg.instance.refresh();
//                 });
//             }
//         });
//     }

//     onRowPrepared_Column(e) {
//         if (e.rowType != 'data') { return; }

//         $(e.rowElement).addClass('row-draggable').data('row-value', e.key);
//     }

//     onContentReadyColumn(e) {
//         this.columnDataSearch.pageSize = e.component.pageSize();
//         this.columnDataSearch.pageIndex = e.component.pageIndex();

//         storeState(this.columnDataSearch, 'STATE_SEARCH_COLUMN');
//         this.initDraggingColumn(e);
//     }

//     onContentReadyCustomField(e) {
//         this.customFieldDataSearch.pageSize = e.component.pageSize();
//         this.customFieldDataSearch.pageIndex = e.component.pageIndex();

//         storeState(this.customFieldDataSearch, 'STATE_SEARCH_SECTION_FIELD');
//     }
// }
