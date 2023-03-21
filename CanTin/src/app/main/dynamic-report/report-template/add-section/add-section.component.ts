// import {
//     SwapOrderIdViewModel,
//     ReportFormServiceProxy,
//     SectionServiceProxy,
//     ReportGroupServiceProxy,
//     ReportTypeServiceProxy,
//     ReportFormDto,
//     SectionsDto
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
//     selector: 'appc-add-section',
//     templateUrl: './add-section.component.html',
// })

// export class AddSectionComponent extends AppComponentBase {
//     sectionData: SectionsDto = new SectionsDto();
//     parentOptions: any;

//     sectionID: any;
//     formId: any;
//     title: any = "Thêm mới tiêu chí";

//     constructor(
//         injector: Injector,
//         private _activatedRoute: ActivatedRoute,
//         private sectionService: SectionServiceProxy,
//         private router: Router,
//         @Optional() @Inject(API_BASE_URL) baseUrl?: string
//     ) {
//         super(injector);
//         this.loadParentSelectBox();
//     }

//     loadParentSelectBox() {
//         const self = this;
//         this.parentOptions = {
//             dataSource: {
//                 loadMode: 'raw',
//                 load: function () {
//                     const promise = new Promise((resolve, reject) => {
//                         self.sectionService.getParentSection(self.formId).subscribe(res => {
//                             let data = [];
//                             if (res.data.length > 0) {
//                                 data = res.data;
//                             }
//                             resolve(data);
//                         });
//                     });

//                     return promise;
//                 },
//                 byKey: function (key, extra) {
//                     const promise = new Promise((resolve, reject) => {
//                         self.sectionService.getSectionById(key).subscribe((res: any) => {
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
//             displayExpr: 'sectionName',
//             showClearButton: true
//         };
//     }

//     loadSection() {
//         this.sectionService.getSectionById(this.sectionID).subscribe(res => {
//             if (res.data != null)
//                 this.sectionData = res.data;
//         });
//     }

//     back() {
//         this.router.navigate(['/app/main/report-template/view-detail/' + this.formId + '/2']);
//     }

//     save() {
//         this.sectionData.formId = this.formId;
//         this.sectionData.parentId = this.sectionData.parentId || 0;
//         if (this.sectionID == -1) {
//             this.sectionService.create(this.sectionData).subscribe(res => {
//                 this.notify.success(this.l('Lưu thành công'));
//             });
//         } else {
//             this.sectionData.id = this.sectionID;
//             this.sectionService.update(this.sectionData).subscribe(res => {
//                 this.notify.success(this.l('Lưu thành công'));
//             });
//         }

//         this.back();
//     }
//     ngOnInit() {
//         const self = this;
//         this._activatedRoute.params.subscribe(param => {
//             self.formId = param['formid'];
//             self.sectionID = param['id'];

//             if (this.sectionID !== '-1') {
//                 self.title = "Chỉnh sửa tiêu chí";
//                 self.loadSection();
//             }
//         });
//     }

// }
