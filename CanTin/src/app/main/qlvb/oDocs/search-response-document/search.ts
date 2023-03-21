import { DxDataGridComponent } from 'devextreme-angular';
import { Component, ViewChild, Injector, Output, EventEmitter, Input, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { ODocsServiceProxy, CreateOrEditODocDto, GetDocInputForSearchDto, DocumentServiceProxy, DynamicFieldsServiceProxy, HistoryUploadsServiceProxy, Idoc_starsServiceProxy, DocumentTypesServiceProxy, OrgLevelsServiceProxy, PublishOrgsServiceProxy, DocumentsDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { AppSessionService } from '@shared/common/session/app-session.service';

@Component({
    selector: 'searchResponseDocumentModal',
    templateUrl: './search.html'
})
export class SearchResponseDocumentModalComponent extends AppComponentBase implements OnInit{

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('gridContainer', { static: true }) gridContainer: DxDataGridComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Input('type') type: number = 0; // 0: CATP, 1: Phòng/Quận/Huyện 
    @Input('isCATP') isCATP: boolean = false; 

    totalCount: number = 0;
    saving = false;
    active = false;
    documentSearchData: GetDocInputForSearchDto = new GetDocInputForSearchDto();
    fromDateOptions: any;
    toDateOptions: any;
    summaryOptions: any;
    orgLevelOptions: any;
    fromDateVal: Date;
    currentDate: Date;
    data_publisher_Initial: any;
    data_publisher = [];
    initialData = [];
    data_secretLevel = [];
    data_priority = [];
    documentTypeOptions: any;
    bookList = [];
    selectedRowsData = [];
    selectedRowsId = [];
    constructor(
        injector: Injector,
        private _documentAppService: DocumentServiceProxy,
        private _dynamicFieldService: DynamicFieldsServiceProxy,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private ultility: UtilityService,
        private _appSessionService: AppSessionService,
        private _idocStarServiceProxy: Idoc_starsServiceProxy,
        private _documentTypeAppService: DocumentTypesServiceProxy,
        private _orgLevelAppService: OrgLevelsServiceProxy,
        private _publishOrgAppService: PublishOrgsServiceProxy
    ){
        super(injector);

    }

    show(): void {
        this.active = true;
        this.initSummaryOptions();
        this.getPublishOrg();
        this.initOrgLevelOptions();
        this.initDocumentTypeOptions();
        this.initFromDateOptions();
        this.initToDateOptions();
        this.search();
        this.modal.show();
        // this._orgLevelsServiceProxy.getOrgLevelForEdit(orgLevelId).subscribe(result => {
        //     this.orgLevel = result.orgLevel;


            
        // });
    }

    ngOnInit(){
        
        this._dynamicFieldService.getDynamicFieldByModuleId(22, 0).subscribe(result => {
            this.data_publisher = result[0].dataSource;
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
        });

        
    }

    initFromDateOptions(){
        this.fromDateOptions = {
            format: 'dd/MM/yyyy',
            displayFormat: 'dd/MM/yyyy',
            showClearButton: true,
            value: new Date('01/01/' + (new Date()).getFullYear())
        }
        this.documentSearchData.fromDate = this.fromDateOptions.value;
    }

    initToDateOptions(){
        this.toDateOptions = {
            format: 'dd/MM/yyyy',
            displayFormat: 'dd/MM/yyyy',
            showClearButton: true,
            value: new Date()
        }
        this.documentSearchData.toDate = this.toDateOptions.value;
    }

    initSummaryOptions(){
        const self = this;
        this.summaryOptions = {
            acceptCustomValue: true,
            searchEnabled: false,
            noDataText: ""
        }
    }

    getPublishOrg(){
        this._publishOrgAppService.getAllPublishOrg().subscribe((res)=>{
            this.data_publisher_Initial = res; })
    }

    initOrgLevelOptions(){
        const that = this;
        this.orgLevelOptions = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                  const promise = new Promise((resolve, reject) => {
                    that._orgLevelAppService.getAllOrgLevel().subscribe(result => {
                        resolve(result);
                    }, err => {
                        reject(err);
                    });
                    
                  });
                  return promise;
                }
                
            },
            valueExpr: 'id',
            displayExpr: 'name', 
            searchEnabled: true, 
            searchExpr: ['name'],
            showClearButton: true,
            onValueChanged: function(e){
                that.data_publisher = that.data_publisher_Initial.filter(x => x.publishOrg.orgLevelId == that.documentSearchData.orgLevel);
            }
        }
    }

    initDocumentTypeOptions(){
        const that = this;
        this.documentTypeOptions = {
            valueExpr: 'id',
            displayExpr: 'typeName',
            searchEnabled: true,
            searchExpr: ['typeName', 'signal'],
            dataSource: {
                loadMode: 'raw',
                load: function () {
                  const promise = new Promise((resolve, reject) => {
                    that._documentTypeAppService.getAllDocumentType().subscribe(result => {
                        resolve(result);
                    }, err => {
                        reject(err);
                    });
                    
                  });
                  return promise;
                }
            }
        }
    }


    search(){
        this.documentSearchData.fromDate = this.documentSearchData.fromDate != null? moment(this.documentSearchData.fromDate).set({hour: 0, minute: 0, second: 0, millisecond: 0}) : null;
        this.documentSearchData.toDate = this.documentSearchData.toDate != null? moment(this.documentSearchData.toDate).set({hour: 23, minute: 59, second: 59, millisecond: 0}): null;
        this.documentSearchData.orgId = this.appSession.organizationUnitId;


        if(this.isCATP){
            this.documentSearchData.orgId = this.appSession.organizationUnitId;
            this._documentAppService.postListSearchDocumentForDonVi(this.documentSearchData).subscribe(res => {
                this.totalCount = res.length;
                this.initialData = res;
                if(this.selectedRowsId.length > 0){
                    for(var i = 0, j = this.selectedRowsId.length; i < j; i++){
                        let index = res.findIndex(x => x.id == this.selectedRowsId[i]);
                        if(index > -1){
                            this.selectedRowsData.push(res[index]);
                        } 
                    }
                }
            });

            return ;
        }

        if(this.type == 0){
            this._documentAppService.postListDocumentProcessedFromCATP(this.documentSearchData).subscribe(res => {
                this.totalCount = res.length;
                this.initialData = res;
                if(this.selectedRowsId.length > 0){
                    for(var i = 0, j = this.selectedRowsId.length; i < j; i++){
                        let index = res.findIndex(x => x.id == this.selectedRowsId[i]);
                        if(index > -1){
                            this.selectedRowsData.push(res[index]);
                        } 
                    }
                }
            });
        }else
        if(this.type == 1){
            this._documentAppService.postListDocumentProcessedFromUnit(this.documentSearchData).subscribe(res => {
                this.totalCount = res.length;
                this.initialData = res;
                if(this.selectedRowsId.length > 0){
                    for(var i = 0, j = this.selectedRowsId.length; i < j; i++){
                        let index = res.findIndex(x => x.id == this.selectedRowsId[i]);
                        if(index > -1){
                            this.selectedRowsData.push(res[index]);
                        } 
                    }
                }
            });
        }
    }
    
    select(){
        this.modalSave.emit(this.selectedRowsData);
        this.close();
    }
    
    close(): void {
        this.active = false;
        this.initialData.length = 0;
        this.modal.hide();
    }
    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        },);
    }
}