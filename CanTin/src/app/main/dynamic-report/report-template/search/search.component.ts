// import { SwapOrderIdViewModel, ReportFormServiceProxy } from './../../../../../shared/service-proxies/service-proxies';
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
//     selector: 'appc-report-form',
//     templateUrl: './search.component.html',
// })

// export class ReportTemplateComponent extends AppComponentBase {

//     @ViewChild('formDg', { static: false }) formDg: DxDataGridComponent;
//     formDataSource: any;
//     stateSearch: any = "";
//     rootUrl: string;
    
//     constructor(
//         injector: Injector,
//         private _activatedRoute: ActivatedRoute,
//         private reportTemplateService: ReportFormServiceProxy,
//         private router: Router,
//         @Optional() @Inject(API_BASE_URL) baseUrl?: string
//     ) {
//         super(injector);
//     }

//     ngOnInit(){
//         this.init();
//         this.loadDataGrid();
//     }
    
//     createTemplate() {
//         clearState('STATE_SEARCH_SECTION');
//         clearState('STATE_SEARCH_UNIT');
//         clearState('STATE_SEARCH_COLUMN');
//         clearState('STATE_SEARCH_SECTION_FIELD');
//         this.router.navigate(['/app/main/report-template/view-detail/null/1']);
//     }

//     loadDataGrid() {
//         const self = this;
//         this.formDataSource = {
//             load: function (loadOptions: any) {
//                 const promise = new Promise((resolve, reject) => {
//                     self.reportTemplateService.search(self.stateSearch.searchName).subscribe((res: any) => {
//                         resolve(res);
//                     });
//                 });
//                 return promise;
//             },
//             reorder: function (draggingRowKey, targetRowKey) {
//                 const promise = new Promise((resolve, reject) => {
//                     let order = new SwapOrderIdViewModel();
//                     order.sourceKey = draggingRowKey;
//                     order.targetKey = targetRowKey;
//                     self.reportTemplateService.reorder(order).subscribe((res: any) => {
//                         resolve(res);
//                     });
//                 });
//                 return promise;
//             },
//             key: 'id'
//         };
//     }

//     edit(formId: number) {
//         clearState('STATE_SEARCH_SECTION');
//         clearState('STATE_SEARCH_UNIT');
//         clearState('STATE_SEARCH_COLUMN');
//         clearState('STATE_SEARCH_SECTION_FIELD');
//         this.router.navigate(['/app/main/report-template/view-detail/' + formId + '/1']);
//     }

//     disable(id) {
//         this.reportTemplateService.disableForm(id).subscribe((res) => {
//             this.search();
//         });
//     }

//     enable(id) {
//         this.reportTemplateService.enableForm(id).subscribe((res) => {
//             this.search();
//         });
//     }

//     search() {
//         if (this.formDg && this.formDg.instance) {
//             this.formDg.instance.refresh();
//         }
//     }

//     initDragging(e) {
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
//                     self.formDg.instance.refresh();
//                 });
//             }
//         });
//     }

//     onContentReady(e) {
//         this.stateSearch.pageSize = e.component.pageSize();
//         this.stateSearch.pageIndex = e.component.pageIndex();

//         storeState(this.stateSearch);

//         this.initDragging(e);
//     }

//     onRowPrepared_Forms(e) {
//         if (e.rowType != 'data') { return; }

//         $(e.rowElement).addClass('row-draggable').data('row-value', e.key);
//     }

//     // download(id) {
//     //     const self = this;
//     //     this.reportTemplateService.get('api/forms/download/' + id).subscribe((response: any) => {
//     //         self.router.navigate(['/' + response]);
//     //     });
//     // }

//     init() {
//         this.stateSearch = retrieveState() || {
//             searchName: '',
//             pageSize: 20,
//             pageIndex: 0
//         };
//     }

//     delete(formId) {
//         const self = this;
//         showConfirm('Xóa biểu mẫu', 'Biểu mẫu đã xóa không thể khôi phục', () => {
//             self.reportTemplateService.deleteForm(formId).subscribe(() => {
//                 this.notify.success('Xóa biểu mẫu thành công!');
//                 self.search();
//             });
//         });
//     }

//     download(path: any) {
//         this.rootUrl = AppConsts.remoteServiceBaseUrl;
//         let link = this.rootUrl + "/" + path;

//         window.open(link, '_blank');
//     }
// }
