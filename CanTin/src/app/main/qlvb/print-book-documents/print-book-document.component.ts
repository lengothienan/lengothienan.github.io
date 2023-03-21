import { Component, Injector, ViewEncapsulation, ViewChild, SecurityContext, Input, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, ListResultDtoOfOrganizationUnitDto, PrioritiesServiceProxy, PriorityDto, CreateOrEditDocumentTypeDto, TextBookDto, TextBooksServiceProxy, SessionServiceProxy, DynamicFieldsServiceProxy, DynamicValueDto, HistoryUploadsServiceProxy, DocumentHandlingDetailDto, HandlingUser, DocumentHandlingDetailsServiceProxy, DocumentHandlingsServiceProxy, OrganizationUnitServiceProxy, Comm_booksServiceProxy, OrgLevelsServiceProxy, GetDocInputForSearchDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { EventEmitter } from 'events';
import { HttpClient } from '@angular/common/http';
// import { TransferHandleModalComponent } from '../transfer-handle/transfer-handle-modal';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import $ from 'jquery';
import { DxFormComponent, DxDataGridComponent, DxButtonComponent, DxSwitchComponent, DxNumberBoxComponent, DxDateBoxComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DxiGroupComponent, DxoPopupComponent } from 'devextreme-angular/ui/nested';
import { Location } from '@angular/common';


@Component({
    selector: 'printBookDocument',
    templateUrl: './print-book-document.component.html',
    // styleUrls: ['./create-new-incomming-document.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe],
    animations: [appModuleAnimation()]

})
export class PrintBookDocumentComponent extends AppComponentBase {
    @ViewChild('printDocumentForm', { static: true }) printDocumentForm: DxFormComponent;
    @ViewChild('typeExport', { static: true }) typeExport: DxSelectBoxComponent;
    @ViewChild('gridContainer', { static: true }) gridContainer: DxDataGridComponent;

    totalCount: number = 0;
    gridDiv = true;
    secretCol = true;

    documentSearchData: GetDocInputForSearchDto = new GetDocInputForSearchDto();

    data_typeExport = [
        { key: 1, type: 'Ngày' },
        { key: 2, type: 'Tháng' },
        { key: 3, type: 'Quý' },
        { key: 4, type: 'Năm' }
    ];

    months = [
        { key: 1, value: 'Tháng 1' },
        { key: 2, value: 'Tháng 2' },
        { key: 3, value: 'Tháng 3' },
        { key: 4, value: 'Tháng 4' },
        { key: 5, value: 'Tháng 5' },
        { key: 6, value: 'Tháng 6' },
        { key: 7, value: 'Tháng 7' },
        { key: 8, value: 'Tháng 8' },
        { key: 9, value: 'Tháng 9' },
        { key: 10, value: 'Tháng 10' },
        { key: 11, value: 'Tháng 11' },
        { key: 12, value: 'Tháng 12' },
    ];

    precious = [
        { key: 1, value: 'Quý 1' },
        { key: 2, value: 'Quý 2' },
        { key: 3, value: 'Quý 3' },
        { key: 4, value: 'Quý 4' }
    ];

    years = [
        { key: 2019, value: '2019' },
        { key: 2020, value: '2020' },
    ];

    data_bookType = [];

    data_secretLevel = [];
    isSecretValue = false;
    secretLevelVal = null;

    initialData = [];
    urlExport = '';
    urlGetData = '';
    typeValue: number;
    fromLabel = '';
    toLabel = '';
    data_fromSelect = [];
    data_toSelect = [];
    fromValue: any;
    toValue: any;
    printDocument: any;
    currentDate: Date;
    bookTypeVal = 1;
    orgLevel = [];
    orgLevelId = 0;
    documentTypeOptions = [];
    documentType = 0;
    fromDateVal: Date;
    constructor(
        injector: Injector,
        private router: Router,
        private _dynamicFieldService: DynamicFieldsServiceProxy,
        private _orgLevelAppService: OrgLevelsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _commBookAppService: Comm_booksServiceProxy,
        private _documentTypeAppService: DocumentTypesServiceProxy
    ) {
        super(injector);
        this.currentDate = new Date();
        this.urlExport = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetExcelFile';
        this.urlGetData = AppConsts.remoteServiceBaseUrl + '/api/services/app/Comm_books/PostListSearchComm_book';
        this.fromDateVal = new Date('01/01/' + (new Date()).getFullYear());
    }

    ngOnInit() {
        this._orgLevelAppService.getAllOrgLevel().subscribe((res) => {
            this.orgLevel = res;
        });
        this._commBookAppService.getAllCommBookInDepartment("1", this.appSession.organizationUnitId).subscribe(res => {
            this.data_bookType = res;
        });
        this.typeValue = 1;
        this.bookTypeVal = 1;
        this.fromLabel = 'Từ ngày';
        this.toLabel = 'Đến ngày';
        console.log(this.currentDate);
        $('#toValue').dxDateBox({
            text: 'Từ ngày',
            displayFormat: 'dd/MM/yyyy',
            value: this.currentDate
        });
        $('#fromValue').dxDateBox({
            text: 'Từ ngày',
            displayFormat: 'dd/MM/yyyy',
            value: this.fromDateVal
        });
        this.gridDiv = false;
        this.secretCol = true;
        // this.gridContainer = false;

        this._dynamicFieldService.getDynamicFieldByModuleId(22, 0).subscribe(result => {
            var items = result[1].dataSource;
            var data = [];
            items.forEach(element => {
                if (parseInt(element.key) > 0)
                    data.push(element);
            });
            this.data_secretLevel = data;
        });

        this._documentTypeAppService.getAllDocumentType().subscribe(result => {
            this.documentTypeOptions = result;
        });
    }

    addDays(val, days: number) {
        var date = new Date(val);
        date.setDate(date.getDate() + days);
        return date;
    }

    typeChangedOption(e: any) {
        switch (e.value) {
            case 1:
                this.fromLabel = 'Từ ngày';
                this.toLabel = 'Đến ngày';
                $('#toValueDiv').show();
                $('#firstElement').children()[0].remove();
                var $newdiv1 = $("<div>", { id: 'fromValue' });
                $("#firstElement").append($newdiv1);
                $('#secondElement').children()[0].remove();
                var $newdiv2 = $("<div>", { id: 'toValue' });
                $("#secondElement").append($newdiv2);
                $('#toValue').dxDateBox({
                    text: 'Đến ngày',
                    type: 'date',
                    displayFormat: 'dd/MM/yyyy',
                    value: this.currentDate
                });
                $('#fromValue').dxDateBox({
                    text: 'Từ ngày',
                    type: 'date',
                    displayFormat: 'dd/MM/yyyy',
                    value: this.fromDateVal
                });
                $('#toValueDiv').show();
                break;
            case 2:
                this.fromLabel = 'Chọn tháng';
                this.toLabel = 'Chọn năm';
                $('#toValueDiv').show();
                $('#firstElement').children()[0].remove();
                var $newdiv1 = $("<div>", { id: 'fromValue' });
                $("#firstElement").append($newdiv1);
                $('#secondElement').children()[0].remove();
                var $newdiv2 = $("<div>", { id: 'toValue' });
                $("#secondElement").append($newdiv2);
                $('#fromValue').dxSelectBox({
                    text: 'Tháng',
                    dataSource: this.months,
                    valueExpr: 'key',
                    displayExpr: 'value',
                    value: this.currentDate.getMonth()
                });
                $('#toValue').dxSelectBox({
                    text: 'Năm',
                    valueExpr: 'key',
                    displayExpr: 'value',
                    dataSource: this.years,
                    value: this.currentDate.getFullYear()
                });

                break;
            case 3:
                $('#toValueDiv').show();
                $('#firstElement').children()[0].remove();
                var $newdiv1 = $("<div>", { id: 'fromValue' });
                $("#firstElement").append($newdiv1);
                $('#secondElement').children()[0].remove();
                var $newdiv2 = $("<div>", { id: 'toValue' });
                $("#secondElement").append($newdiv2);
                this.fromLabel = 'Chọn quý';
                this.toLabel = 'Chọn năm';
                $('#fromValue').dxSelectBox({
                    text: 'Quý',
                    dataSource: this.precious,
                    valueExpr: 'key',
                    displayExpr: 'value'
                });
                $('#toValue').dxSelectBox({
                    text: 'Năm',
                    valueExpr: 'key',
                    displayExpr: 'value',
                    dataSource: this.years,
                    value: this.currentDate.getFullYear()
                });

                break;
            case 4:
                $('#firstElement').children()[0].remove();
                var $newdiv1 = $("<div>", { id: 'fromValue' });
                $("#firstElement").append($newdiv1);
                this.fromLabel = 'Chọn năm';
                $('#fromValue').dxSelectBox({
                    text: 'Năm',
                    valueExpr: 'key',
                    displayExpr: 'value',
                    dataSource: this.years,
                    value: this.currentDate.getFullYear()
                });
                $('#toValueDiv').hide();
                break;
        }
    }
    print() {
        var type = this.typeExport.value;
        switch (type) {
            case 1:
                let fd = $('#fromValue').dxDateBox('instance').option('value');
                let td = $('#toValue').dxDateBox('instance').option('value');
                var fromDate = moment(fd);
                var toDate = moment(td);
                if (toDate.diff(fromDate, 'days') >= 0) {
                    this.makeRequest(fromDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD'));
                }
                else {
                    this.makeRequest(toDate.format('YYYY-MM-DD'), fromDate.format('YYYY-MM-DD'));
                }
                break;
            case 2:
                let month = $('#fromValue').dxSelectBox('instance').option('value');
                let year = $('#toValue').dxSelectBox('instance').option('value');
                const startOfMonth = moment(year + '-' + month + '-01').startOf('month').format('YYYY-MM-DD');
                const endOfMonth = moment(year + '-' + month + '-01').endOf('month').format('YYYY-MM-DD');
                this.makeRequest(startOfMonth, endOfMonth);
                break;
            case 3:
                let precious = $('#fromValue').dxSelectBox('instance').option('value');
                let year2 = $('#toValue').dxSelectBox('instance').option('value');
                var start = '';
                var end = '';
                switch (precious) {
                    case 1:
                        start = moment(year2 + '-01-01').startOf('month').format('YYYY-MM-DD');
                        end = moment(year2 + '-03-01').endOf('month').format('YYYY-MM-DD');
                        // console.log(start, end);
                        break;
                    case 2:
                        start = moment(year2 + '-04-01').startOf('month').format('YYYY-MM-DD');
                        end = moment(year2 + '-06-01').endOf('month').format('YYYY-MM-DD');
                        // console.log(start, end);
                        break;
                    case 3:
                        start = moment(year2 + '-07-01').startOf('month').format('YYYY-MM-DD');
                        end = moment(year2 + '-09-01').endOf('month').format('YYYY-MM-DD');
                        // console.log(start, end);
                        break;
                    case 4:
                        start = moment(year2 + '-10-01').startOf('month').format('YYYY-MM-DD');
                        end = moment(year2 + '-12-01').endOf('month').format('YYYY-MM-DD');
                        // console.log(start, end);
                        break;
                }
                this.makeRequest(start, end);
                break;
            case 4:
                let year4 = $('#fromValue').dxSelectBox('instance').option('value');
                let start1 = moment(year4 + '-01-01').startOf('year').format('YYYY-MM-DD');
                let end2 = moment(year4 + '-01-01').endOf('year').format('YYYY-MM-DD');
                this.makeRequest(start1, end2);
                break;
        }
    }

    makeRequest(fromDate: string, toDate: string) {
        // console.log(this.bookTypeVal);
        const self = this;
        this.orgLevelId = this.orgLevelId == null ? 0 : this.orgLevelId;
        if (this.bookTypeVal == 1)
            this.secretLevelVal = this.secretLevelVal == null ? -2 : this.secretLevelVal;
        else
            this.secretLevelVal = this.secretLevelVal == null ? -1 : this.secretLevelVal;
        let fileName = (this.bookTypeVal == 2) ? 'SoVanBanDenMat_' : 'SoVanBanDenThuong_';
        $.ajax({
            url: this.urlExport,
            method: 'POST',
            xhrFields: {
                responseType: 'blob'
            },
            data: {
                FromDate: fromDate,
                ToDate: toDate,
                BookId: this.bookTypeVal,
                OrgLevel: this.orgLevelId,
                SecretLevel: this.secretLevelVal,
                DocumentType: this.documentType,
                UserId: self.appSession.userId
            },
            success: function (data) {
                var a = document.createElement('a');
                var url = window.URL.createObjectURL(data);
                a.href = url;
                var current = new Date();
                var fullTimeStr = current.getHours().toString() + current.getMinutes() + current.getSeconds()
                    + current.getDate() + (current.getMonth() + 1) + current.getFullYear();
                a.download = fileName + fullTimeStr + '.xls';

                document.body.append(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }

        });
    }

    getQuarter(d) {
        d = d || new Date();
        var m = Math.floor(d.getMonth() / 3) + 2;
        return m > 4 ? m - 4 : m;
    }

    showGrid() {
        var type = this.typeExport.value;
        // console.log(type);
        this.gridDiv = true;
        switch (type) {
            case 1:
                let fd = $('#fromValue').dxDateBox('instance').option('value');
                let td = $('#toValue').dxDateBox('instance').option('value');
                var fromDate = moment(fd);
                var toDate = moment(td);
                if (toDate.diff(fromDate, 'days') >= 0) {
                    this.makeRequest2(fromDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD'));
                }
                else {
                    this.makeRequest2(toDate.format('YYYY-MM-DD'), fromDate.format('YYYY-MM-DD'));
                }
                break;
            case 2:
                let month = $('#fromValue').dxSelectBox('instance').option('value');
                let year = $('#toValue').dxSelectBox('instance').option('value');
                const startOfMonth = moment(year + '-' + month + '-01').startOf('month').format('YYYY-MM-DD');
                const endOfMonth = moment(year + '-' + month + '-01').endOf('month').format('YYYY-MM-DD');
                this.makeRequest2(startOfMonth, endOfMonth);
                break;
            case 3:
                let precious = $('#fromValue').dxSelectBox('instance').option('value');
                let year2 = $('#toValue').dxSelectBox('instance').option('value');
                var start = '';
                var end = '';
                switch (precious) {
                    case 1:
                        start = moment(year2 + '-01-01').startOf('month').format('YYYY-MM-DD');
                        end = moment(year2 + '-03-01').endOf('month').format('YYYY-MM-DD');
                        break;
                    case 2:
                        start = moment(year2 + '-04-01').startOf('month').format('YYYY-MM-DD');
                        end = moment(year2 + '-06-01').endOf('month').format('YYYY-MM-DD');
                        break;
                    case 3:
                        start = moment(year2 + '-07-01').startOf('month').format('YYYY-MM-DD');
                        end = moment(year2 + '-09-01').endOf('month').format('YYYY-MM-DD');
                        break;
                    case 4:
                        start = moment(year2 + '-10-01').startOf('month').format('YYYY-MM-DD');
                        end = moment(year2 + '-12-01').endOf('month').format('YYYY-MM-DD');
                        break;
                }
                this.makeRequest2(start, end);
                break;
            case 4:
                let year4 = $('#fromValue').dxSelectBox('instance').option('value');
                let start1 = moment(year4 + '-01-01').startOf('year').format('YYYY-MM-DD');
                let end2 = moment(year4 + '-01-01').endOf('year').format('YYYY-MM-DD');
                this.makeRequest2(start1, end2);
                break;
        }
    }

    makeRequest2(fromDate: string, toDate: string) {
        const self = this;
        self.orgLevelId = self.orgLevelId == null ? 0 : self.orgLevelId;
        if (this.bookTypeVal == 1)
            self.secretLevelVal = self.secretLevelVal == null ? -2 : self.secretLevelVal;
        else
            self.secretLevelVal = self.secretLevelVal == null ? -1 : self.secretLevelVal;
        // console.log('request');
        $.ajax({
            url: this.urlGetData,
            method: 'POST',
            data: {
                FromDate: fromDate,
                ToDate: toDate,
                BookId: self.bookTypeVal,
                OrgLevel: self.orgLevelId,
                SecretLevel: self.secretLevelVal,
                DocumentType: self.documentType,
                UserId: self.appSession.userId
            },
            success: function (data) {
                self.initialData = data.result;
                self.totalCount = self.initialData.length;
            }
        });
        if (this.bookTypeVal == 1) {
            self.secretCol = false;
        } else {
            self.secretCol = true;
        }
    }

    onValueChanged(e) {
        if (!e.value) {
            this.isSecretValue = false;
            this.secretLevelVal = -2;
        }
        else {
            if (e.value == 2) {
                this.isSecretValue = true;
                this.secretLevelVal = -1;
            }
            else {
                this.isSecretValue = false;
                this.secretLevelVal = -2;
            }
        }
    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        },);
    }
}