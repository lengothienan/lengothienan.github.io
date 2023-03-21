// import {
//     SectionCustomFieldValueServiceProxy, SectionCustomFieldValueDto
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
//     selector: 'appc-set-value-section-field',
//     templateUrl: './set-value.component.html',
// })

// export class SetValueSectionCustomFieldComponent extends AppComponentBase {
//     firstLoad = true;
//     name: any;
//     formId: any;
//     sectionFieldId: any;
//     orderId: any;
//     description: any;
//     source: any;
//     tmp_source: any;
//     closeResult: string;

//     customFieldDataSource: any;
//     @ViewChild('customFieldValueDg', { static: false }) customFieldValueDg: DxDataGridComponent;

//     constructor(
//         injector: Injector,
//         private _activatedRoute: ActivatedRoute,
//         private sectionCustomFieldValueService: SectionCustomFieldValueServiceProxy,
//         private router: Router,
//         @Optional() @Inject(API_BASE_URL) baseUrl?: string
//     ) {
//         super(injector);
//     }

//     load() {
//         const self = this;
//         this.customFieldDataSource = {
//             load: function (loadOptions: any) {
//                 const promise = new Promise((resolve, reject) => {
//                     self.sectionCustomFieldValueService.getBySectionCustomFieldId(self.sectionFieldId).subscribe((res: any) => {
//                         let data = [];
//                         if (res.data.length > 0) {
//                             data = res.data;
//                         }
//                         resolve(data);
//                     });
//                 });
//                 return promise;
//             },
//             update: function (key, values) {
//                 const obj = new SectionCustomFieldValueDto();
//                 obj.id = key;
//                 obj.value = values.value;
//                 self.sectionCustomFieldValueService.update(obj).subscribe(() => {
//                     debugger
//                     //this.notify.success(this.l('Cập nhật giá trị thành công!'));
//                 });
//             },
//             key: 'id'
//         };
//     }

//     back() {
//         this.router.navigate(['/app/main/report-template/view-detail/' + this.formId + '/5']);
//     }

//     save() {
//         if (this.customFieldValueDg && this.customFieldValueDg.instance) {
//             this.customFieldValueDg.instance.saveEditData();
//         }

//         this.notify.success(this.l('Cập nhật giá trị thành công!'));

//         this.back();
//     }

//     add() {
//         this.router.navigate(['/app/main/report-template/add-section-to-cusval/' + this.sectionFieldId + '/' + this.formId]);
//     }

//     ngOnInit() {
//         this._activatedRoute.params.subscribe(param => {
//             this.formId = param['formid'];
//             this.sectionFieldId = param['id'];
//             this.load();
//         });
//     }
// }
