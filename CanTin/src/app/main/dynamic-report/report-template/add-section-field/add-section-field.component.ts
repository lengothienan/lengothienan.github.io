// import {
//     SwapOrderIdViewModel,
//     ReportFormServiceProxy,
//     SectionServiceProxy,
//     ColumnsServiceProxy,
//     ColumnDto,
//     SectionCustomFieldDto,
//     SectionCustomFieldsServiceProxy
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
//     selector: 'appc-add-section-field',
//     templateUrl: './add-section-field.component.html',
// })

// export class AddSectionCustomFieldComponent extends AppComponentBase {
//     customFieldData: SectionCustomFieldDto = new SectionCustomFieldDto();
//     formId: any;
//     sectionFieldId: any;

//     constructor(
//         injector: Injector,
//         private _activatedRoute: ActivatedRoute,
//         private sectionCustomFieldService: SectionCustomFieldsServiceProxy,
//         private router: Router,
//         @Optional() @Inject(API_BASE_URL) baseUrl?: string
//     ) {
//         super(injector);
//     }

//     load() {
//         this.sectionCustomFieldService.getSectionCustomFieldById(this.sectionFieldId).subscribe(res => {
//             if (res.data != null) {
//                 this.customFieldData = res.data[0];
//             }
//         });
//     }

//     back() {
//         this.router.navigate(['/app/main/report-template/view-detail/' + this.formId + '/5']);
//     }

//     save() {
//         this.customFieldData.formId = this.formId;
//         if (this.sectionFieldId == -1) {
//             this.sectionCustomFieldService.create(this.customFieldData).subscribe(res => {
//                 this.notify.success(this.l('Thêm mới custom field thành công'));
//             });
//         } else {
//             this.sectionCustomFieldService.update(this.customFieldData).subscribe(res => {
//                 this.notify.success(this.l('Cập nhật custom field thành công'));
//             });
//         }

//         this.back();
//     }

//     ngOnInit() {
//         this._activatedRoute.params.subscribe(param => {
//             this.formId = param['formid'];
//             this.sectionFieldId = param['id'];
//             if (this.sectionFieldId !== '-1') {
//                 this.load();
//             }
//         });
//     }

// }
