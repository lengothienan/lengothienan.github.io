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
//     selector: 'appc-add-section-to-cusval',
//     templateUrl: './add-section-to-cusval.component.html',
// })

// export class AddSectionToCusValComponent extends AppComponentBase {
//     formId: any;
//     sectionFieldId: any;
//     sectionDataSource: any;

//     constructor(
//         injector: Injector,
//         private _activatedRoute: ActivatedRoute,
//         private sectionCustomFieldValueService: SectionCustomFieldValueServiceProxy,
//         private router: Router,
//         @Optional() @Inject(API_BASE_URL) baseUrl?: string
//     ) {
//         super(injector);
//     }

//     loadModal() {
//         const self = this;
//         this.sectionDataSource = {
//             load: function (loadOptions: any) {
//                 const promise = new Promise((resolve, reject) => {
//                     self.sectionCustomFieldValueService.getSectionNoneValue(self.formId, self.sectionFieldId).subscribe((res: any) => {
//                         let data = [];
//                         if (res.data.length > 0) {
//                             data = res.data;
//                         }
//                         resolve(data);
//                     });
//                 });
//                 return promise;
//             },
//             key: 'sectionId'
//         };
//     }

//     back() {
//         this.router.navigate(['/app/main/report-template/set-value/' + this.sectionFieldId + '/' + this.formId]);
//     }

//     save() {
//     }

//     choose(sectionId: number) {
//         const self = this;
//         showConfirm('Thêm tiêu chí', 'Tiêu chí này sẽ được thêm vào customfield', () => {
//             self.sectionCustomFieldValueService.addSectionToSectionFieldValue(sectionId, self.sectionFieldId).subscribe(res => {
//                 this.notify.success(this.l('Thêm tiêu chí thành công'));
//                 self.loadModal();
//             });
//         });
//     }

//     ngOnInit() {
//         const self = this;
//         this._activatedRoute.params.subscribe(param => {
//             self.formId = param['formid'];
//             self.sectionFieldId = param['id'];
//             self.loadModal();
//         });
//     }

// }
