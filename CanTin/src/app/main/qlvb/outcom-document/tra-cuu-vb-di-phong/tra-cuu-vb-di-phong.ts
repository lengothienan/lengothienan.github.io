import { Component, Injector, ViewEncapsulation, ViewChild, SecurityContext, Input, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Paginator } from 'primeng/components/paginator/paginator';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentServiceProxy, DynamicFieldsServiceProxy, HistoryUploadsServiceProxy, HandlingUser, DocumentHandlingDetailsServiceProxy, CreateOrEditIdoc_starDto, Idoc_starsServiceProxy, GetDocInputForSearchDto, DocumentTypesServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { EventEmitter } from 'events';
import { HttpClient } from '@angular/common/http';
// import { TransferHandleModalComponent } from '../transfer-handle/transfer-handle-modal';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { DatePipe, formatDate, Location } from '@angular/common';
import $ from 'jquery';
import { DxFormComponent, DxDataGridComponent, DxButtonComponent, DxSwitchComponent, DxNumberBoxComponent, DxDateBoxComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { DomSanitizer } from '@angular/platform-browser';
import { DxiGroupComponent, DxoPopupComponent } from 'devextreme-angular/ui/nested';
import { AppSessionService } from '@shared/common/session/app-session.service';
declare const exportHTML: any;

@Component({
    selector: 'traCuuVBDiPhong',
    templateUrl: './tra-cuu-vb-di-phong.html',
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe] ,
    animations: [appModuleAnimation()]

})
export class TraCuuVBDiPhongComponent extends AppComponentBase {
    @ViewChild('documentForm', { static: true }) documentForm: DxFormComponent;
    @ViewChild('gridContainer', { static: true }) gridContainer: DxDataGridComponent;
    // @ViewChild('fromDate', { static: true}) fromDate: DxDateBoxComponent;
    // @ViewChild('toDate', { static: true}) toDate: DxDateBoxComponent;

    documentSearchData: GetDocInputForSearchDto = new GetDocInputForSearchDto();
    data_publisher = [];
    publisherValue: any;

    dataBook = [
        { id: 1, name: 'Sổ thường'},
        { id: 2, name: 'Sổ mật' },
    ];

    initialData: any;
    history_Upload: any;
    popupVisible = false;
    link = '';
    saving = false;
    userID : any;
    fromDateVal: Date;
    toDateVal: Date;
    data_secretLevel = [];
    data_priority = [];
    documentTypeOptions = [];
    constructor(
        injector: Injector,
        private router: Router,
        private _documentAppService: DocumentServiceProxy,
        private _dynamicFieldService: DynamicFieldsServiceProxy,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private ultility: UtilityService,
        private _appSessionService: AppSessionService,
        private _idocStarServiceProxy: Idoc_starsServiceProxy,
        private _documentTypeAppService: DocumentTypesServiceProxy
    ){
        super(injector);
        this.toDateVal = new Date();
        this.fromDateVal = this.addDays(this.toDateVal, -7);
    }

    ngOnInit(){
        // this.search();
        this._documentTypeAppService.getAllDocumentType().subscribe(result => {
            this.documentTypeOptions = result;
            // console.log(result);
        });
        this._dynamicFieldService.getDynamicFieldByModuleId(22, 0).subscribe(result => {
            this.data_publisher = result[0].dataSource;
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
        });
    }

    addDays(val, days: number){
        var date = new Date(val);
        date.setDate(date.getDate()+ days);
        return date;
    }

    search(){
        this.documentSearchData.fromDate = moment(this.fromDateVal).set({hour: 0, minute: 0, second: 0, millisecond: 0});
        this.documentSearchData.toDate = moment(this.toDateVal).set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
        console.log(this.documentSearchData.fromDate, this.documentSearchData.toDate);
        if(this.publisherValue){
            this.documentSearchData.publisher = this.publisherValue;
        }
        this._documentAppService.postListSearchDocument(this.documentSearchData).subscribe(res => {
            this.initialData = res;
            console.log(res);
            this.gridContainer.dataSource = res;
            this.gridContainer.instance.repaint();
            this.gridContainer.instance.refresh();
        });
    }

    viewProcess(event: any) {
        this.router.navigate(['/app/main/qlvb/quytrinhxuly-vb-di/' + event.data.id]);
    }

    // xem lich su upload
    showListHistory(event: any) {
        this._historyUploadsServiceProxy.getList(event.data.id).subscribe(res => {
            this.history_Upload = res;
        });
        this.popupVisible = true;
    }

    // xem file dinh kem
    showDetail(e: any) {
        this.link = AppConsts.remoteServiceBaseUrl + "/" + e.row.data.file;
        window.open(this.link, '_blank');

    }

    // xem chi tiet VB
    viewRow(event: any) {
        this.router.navigate(['/app/main/qlvb/incomming-document/view/' + event.data.id]);
    }

    // gắn sao VB
    instaff(event: any) {
        console.log(event.data.id);
        let data: CreateOrEditIdoc_starDto = new CreateOrEditIdoc_starDto();
        data.userId = this._appSessionService.userId;
        data.documentId = event.data.id;
        if (event.data.star == false) {
            this._idocStarServiceProxy.create_Star(data).pipe(finalize(() => { this.saving = true; }))
                .subscribe(() => {
                    // this.message.success('Gắn sao thành công');
                });
            event.data.star = true;
        }
        else {
            this._idocStarServiceProxy.starDelete(event.data.id, this._appSessionService.userId).subscribe(() => {
                // this.message.success('Bỏ sao thành công');
            });
            event.data.star = false;
        }
    }

    view(e: any){

    }
}