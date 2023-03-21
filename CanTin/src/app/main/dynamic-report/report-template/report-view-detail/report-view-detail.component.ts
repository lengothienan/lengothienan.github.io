// import { messages } from './../../../../apps/chat/chat-data';
// import {
//     SectionCustomFieldValueServiceProxy, SectionCustomFieldValueDto, ReportFormServiceProxy, ReportServiceProxy, ReportDetailServiceProxy
// } from './../../../../../shared/service-proxies/service-proxies';
// import { Component, OnInit, EventEmitter, Output, ViewChild, Injector, Input, Inject, Optional, SimpleChanges, SecurityContext } from '@angular/core';
// import { appModuleAnimation } from '@shared/animations/routerTransition';
// import { ModalDirective } from 'ngx-bootstrap';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AppComponentBase } from '@shared/common/app-component-base';
// import { API_BASE_URL } from '@shared/service-proxies/service-proxies';
// import { DxDataGridComponent, DxFileUploaderComponent } from 'devextreme-angular';
// import { retrieveState, storeState, showConfirm, clearState } from '@app/shared/util';
// import { AppConsts } from '@shared/AppConsts';
// import { DateService } from '@shared/utils/date.service';
// import { ReportDetailComponent } from '../../detail/detail-component';
// import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
// import { RF_ReportDetailComponent } from '../rf-report-detail/rf-report-detail.component';


// @Component({
//     selector: 'appc-report-view-detail',
//     templateUrl: './report-view-detail.component.html',
// })

// export class ReportViewDetailComponent extends AppComponentBase {
//     @ViewChild(RF_ReportDetailComponent, { static: false }) reportDetailComponent: RF_ReportDetailComponent;
//     @ViewChild(DxFileUploaderComponent, { static: false }) fileUploader: DxFileUploaderComponent;

//     reportNameHtml: string;
//     currentId: string;
//     private backUrl: string;
//     isRootForm: any;
//     isLock: any;
//     uploadUrl: string;
//     loadingVisible: any = false;

//     constructor(
//         injector: Injector,
//         private _activatedRoute: ActivatedRoute,
//         private reportService: ReportServiceProxy,
//         private reportDetailService: ReportDetailServiceProxy,
//         private router: Router,
//         private _sanitizer: DomSanitizer,
//         @Optional() @Inject(API_BASE_URL) baseUrl?: string
//     ) {
//         super(injector);
//     }

//     ngOnInit() {
//         this._activatedRoute.queryParams.subscribe(p => {
//             this.backUrl = p.backUrl;
//         });

//         this._activatedRoute.params.subscribe(params => {
//             this.currentId = params['id'];

//             this.reportService.getReportById(parseInt(this.currentId)).subscribe(res => {
//                 this.isRootForm = res.data[0].ParentId == 0;
//                 this.isLock = res.data[0].IsLock;

//                 this.initReportTitle(res.data[0]);

//                 this.initUploadUrl();
//             });
//         });
//     }

//     private initUploadUrl() {
//         let unit = this.appSession.organizationUnitId;
//         //this.dataService.get('/api/utility/currentUnit').subscribe((unit: any) => {
//             if (unit) {
//                 let rootUrl = AppConsts.remoteServiceBaseUrl;
//                 this.uploadUrl = rootUrl + '/api/services/app/Report/ImportReport?reportId=' + this.currentId + '&unit=' + unit;
//             }
//         //});
//     }

//     public get htmlProperty(): SafeHtml {
//         return this._sanitizer.sanitize(SecurityContext.HTML, this.reportNameHtml);
//     }

//     initReportTitle(report) {
//         if (report.ReportTypeId == 1) {
//             const d3 = new Date(report.NeedCreate);
//             this.reportNameHtml = report.ReportName + ' ' + d3.getDate().toString() + '/' + (d3.getMonth() + 1).toString() + '/' + d3.getFullYear() + '<br>' + report.UnitName;
//         } else if (report.ReportTypeId == 2) {
//             this.reportNameHtml = report.ReportName + '- Tháng ' + report.TimePeriod + '/' + new Date(report.NeedCreate).getFullYear() + '<br>' + report.UnitName;
//         } else if (report.ReportTypeId == 3) {
//             this.reportNameHtml = report.ReportName + '- Quý ' + report.TimePeriod + ' ' + new Date(report.NeedCreate).getFullYear() + '<br>' + report.UnitName;
//         } else if (report.ReportTypeId == 4) {
//             this.reportNameHtml = report.ReportName + '- 6 tháng ' + (report.TimePeriod == 1 ? 'đầu năm' : 'cuối năm ') + ' ' + new Date(report.NeedCreate).getFullYear() + '<br>' + report.UnitName;
//         } else if (report.ReportTypeId == 5) {
//             this.reportNameHtml = report.ReportName + '- ' + report.TimePeriod + '<br>' + report.UnitName;
//         }
//         this.reportNameHtml = this.reportNameHtml.toUpperCase();
//     }

//     onContentReady_InputReport(e) {
//         // $(e.component.element()).find('.dx-fileuploader-button').dxButton({ icon: 'fa fa-upload', type: 'success' });
//         $(e.component.element()).find('.dx-fileuploader-button .dx-button-content').prepend($('<i class="align-middle fa fa-upload mr-2">'));
//         $(e.component.element()).find('.dx-fileuploader-button').addClass('dx-button dx-button-success');
//         $(e.component.element()).find('.dx-fileuploader-input-container').hide();
//         $(e.component.element()).find('.dx-fileuploader-wrapper').removeClass('dx-fileuploader-wrapper');
//         $(e.component.element()).find('.dx-fileuploader-container').removeClass('dx-fileuploader-container');
//         $(e.component.element()).find('.dx-fileuploader-input-wrapper').removeClass('dx-fileuploader-input-wrapper');
//     }

//     onProgress_InputReport(e) {
//         this.loadingVisible = true;
//     }

//     onUploaded_InputReport(e) {
//         this.loadingVisible = false;
//         this.notify.success('Import thành công!');
//         this.reportDetailComponent.refresh();
//         e.component.reset();
//     }

//     onUploadError_InputReport(e) {
//         this.loadingVisible = false;
//         const response = JSON.parse(e.request.response);

//         this.notify.error('Import thất bại!');

//         if (response.code === 'ERR_FILE') {
//             window.location.href = 'api/SectionReport/error/' + response.message;
//         }

//         e.component.reset();
//     }

//     save() {
//         try {
//             this.reportDetailComponent.saveEditData();

//             const data = { xmlData: `<root>${this.reportDetailComponent.getXmlData()}</root>` };
//             this.reportDetailService.update(parseInt(this.currentId), data).subscribe((response: any) => {
//                 this.reportDetailComponent.refresh();
//                 this.notify.success('Cập nhật báo cáo thành công!');
//             }, (err) => {
//                 this.notify.error('Cập nhật báo cáo không thành công!');
//             });
//         } catch (error) {
//             this.notify.error('Cập nhật báo cáo không thành công!');
//         }
//     }

//     downloadTemplate() {
//         this.loadingVisible = true;
//         this.reportService.getTemplateByType(parseInt(this.currentId), 'template').subscribe((res: any) => {
//             this.loadingVisible = false;
//             let rootUrl = AppConsts.remoteServiceBaseUrl;
//             if(res.data != null && res.data != undefined){
//             let link = rootUrl + res.data;
//             window.open(link, '_blank');
//             }
//             else{
//                 this.notify.error(res.messages);
//             }
//         }, (err) => {
//             this.notify.error(JSON.parse(err).message);
//             this.loadingVisible = false;
//         });
//     }

//     exportExcel() {
//         this.loadingVisible = true;
//         this.reportService.getTemplateByType(parseInt(this.currentId), 'excel').subscribe((res: any) => {
//             this.loadingVisible = false;
//             let rootUrl = AppConsts.remoteServiceBaseUrl;
//             if(res.data != null && res.data != undefined){
//             let link = rootUrl + res.data;
//             window.open(link, '_blank');
//             }
//             else{
//                 this.notify.error(res.messages);
//             }
//             // const a = document.createElement('a');
//             // document.body.appendChild(a);
//             // a.style.display = 'none';
//             // a.href = window.location.origin + res.data.replace(/"/g, '');
//             // a.download = res.data.split('\\\\')[2].replace(/"/g, '');
//             // a.click();
//         }, (err) => {/*  */
//             this.loadingVisible = false;
//             this.notify.error(JSON.parse(err).message);
//         });
//     }

//     sendReport() {
//         this.reportService.checkInputSection(parseInt(this.currentId)).subscribe(res => {
//             let data = res.data[0];
//             const remain = data.remain.split('/')[0];
//             const total = data.remain.split('/')[1];
//             let message = 'Báo cáo này sẽ không được chỉnh sửa';
//             if (total - remain > 0) {
//                 message = 'Còn ' + (total - remain) + ' mục chưa được nhập? Xác nhận nộp báo cáo?';
//             }

//             const self = this;
//             showConfirm('Xác nhận nộp báo cáo', message, () => {
//                 self.reportService.sendReport(parseInt(self.currentId)).subscribe(res => {
//                     if (res.isSucceeded) {
//                         this.notify.success('Nộp báo cáo thành công!');
//                         window.location.reload();
//                     } else {
//                         this.notify.error('Báo cáo đã được nộp hoặc không tồn tại!');
//                     }
//                 });
//             });
//         });
//     }

//     back() {
//         window.history.back();
//         // this.router.navigate([this.backUrl || '/pages/don-vi/bao-cao/bao-cao-hien-tai']);
//     }

// }
