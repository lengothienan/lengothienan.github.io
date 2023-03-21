// import {
//     SectionCustomFieldValueServiceProxy, SectionCustomFieldValueDto, ReportFormServiceProxy
// } from './../../../../../shared/service-proxies/service-proxies';
// import { Component, OnInit, EventEmitter, Output, ViewChild, Injector, Input, Inject, Optional, SimpleChanges } from '@angular/core';
// import { appModuleAnimation } from '@shared/animations/routerTransition';
// import { ModalDirective } from 'ngx-bootstrap';
// import { Router, ActivatedRoute } from '@angular/router';
// import { AppComponentBase } from '@shared/common/app-component-base';
// import { API_BASE_URL } from '@shared/service-proxies/service-proxies';
// import { DxDataGridComponent } from 'devextreme-angular';
// import { retrieveState, storeState, showConfirm, clearState } from '@app/shared/util';
// import { AppConsts } from '@shared/AppConsts';
// import { DateService } from '@shared/utils/date.service';


// @Component({
//     selector: 'appc-make-report',
//     templateUrl: './make-report.component.html',
// })

// export class MakeReportComponent extends AppComponentBase {
//     @Input() formId: any;
//     @Input() reportType: any;
//     @Output() makeReportSuccess = new EventEmitter();

//     QUARTERS: any = [];
//     MONTHS: any = [];
//     YEARS: any = [];

//     reportPeriodOptions: any;
//     yearOptions: any;
//     quarterOptions: any;
//     monthOptions: any;
//     currentYear: any = new Date().getFullYear();
//     quarterVisible: any = false;
//     monthVisible: any = false;
//     searchData: any = {};

//     constructor(
//         injector: Injector,
//         private _activatedRoute: ActivatedRoute,
//         private reportService: ReportFormServiceProxy,
//         private dateService: DateService,
//         private router: Router,
//         @Optional() @Inject(API_BASE_URL) baseUrl?: string
//     ) {
//         super(injector);
//         for (let i = 1; i <= 4; i++) {
//             this.QUARTERS.push({ value: i, display: i });
//         }

//         for (let i = 1; i <= 12; i++) {
//             this.MONTHS.push({ value: i, display: i });
//         }

//         let year = this.currentYear;
//         while (year >= 2017) {
//             this.YEARS.push({ value: year, display: year });
//             year--;
//         }

//         this.yearOptions = {
//             items: this.YEARS,
//             value: this.currentYear,
//             displayExpr: 'display',
//             valueExpr: 'value'
//         };

//         this.reportPeriodOptions = {
//             items: this.dateService.getReportPeriodData(),
//             displayExpr: 'display',
//             valueExpr: 'value'
//         };

//         this.quarterOptions = {
//             items: this.QUARTERS,
//             displayExpr: 'display',
//             valueExpr: 'value'
//         };

//         this.monthOptions = {
//             items: this.MONTHS,
//             displayExpr: 'display',
//             valueExpr: 'value'
//         };
//     }

//     ngOnInit(): void {
//     }

//     ngOnChanges(changes: SimpleChanges): void {
//         if (changes.reportType && changes.reportType.currentValue) {
//             this.searchData.kyBaoCao = changes.reportType.currentValue;
//             this.handleReportPeriod(this.searchData.kyBaoCao);
//         }
//     }

//     handleFieldDataChanged($e) {
//         if ($e.dataField === 'kyBaoCao') {
//             this.handleReportPeriod($e.value);
//         }
//     }

//     handleReportPeriod(kyBaoCao) {
//         this.quarterVisible = kyBaoCao === 'qui';
//         this.monthVisible = kyBaoCao === 'thang';
//     }

//     handleSubmitForm($event) {
//         $event.preventDefault();

//         let time = null;

//         if (this.searchData.kyBaoCao === 'thang') {
//             time = this.searchData.month;
//         }

//         if (this.searchData.kyBaoCao === 'qui') {
//             time = this.searchData.quarter;
//         }

//         this.reportService.makeReport(this.formId, time, this.searchData.year).subscribe(res => {
//             this.makeReportSuccess.emit(null);
//             this.notify.success('Tạo báo cáo thành công!');
//         });
//     }

// }
