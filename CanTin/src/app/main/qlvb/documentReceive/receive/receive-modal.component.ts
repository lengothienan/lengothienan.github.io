import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import {  } from '@shared/service-proxies/service-proxies';
// import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
// import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DocumentsDto, DocumentHandlingDetailDto, DocumentTypeDto, DocumentServiceProxy, PriorityDto, DocumentTypesServiceProxy, PrioritiesServiceProxy, DocumentHandlingDto, HistoryUploadsServiceProxy, HistoryUploadDto, DynamicFieldsServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppConsts } from '@shared/AppConsts';
import { DxFormComponent } from 'devextreme-angular';
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from 'jquery';

@Component({
    selector: 'receiveModal',
    templateUrl: './receive-modal.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]

})
export class ReceiveModalComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('dxForm', { static: true }) private detailForm: DxFormComponent;

    saving = false;
    documentData: DocumentsDto;
    tabPanelData: any[] = [];
    listHistoryHandling: DocumentHandlingDto[] = [];
    documentTypeOptions: DocumentTypeDto[] = [];
    // typeReceiveOptions: string[] = [];
    priorityOptions: PriorityDto[] = [];
    _id: number;
    data : any []= [];
    a = AppConsts.remoteServiceBaseUrl;
    historyUpload: any ;
    dynamicFields: any;
    dynamicValues: any;
    dynamicDataSource = [];
    typeField = {
        1: "dxCheckBox",
        2: "dxTextBox",
        3: "dxSelectBox",
        4: "dxDateBox"
    };
    oldDocType: number;
    oldPriority: number;
    oldTypeReceive: string;
    rootUrl = '';
    formItems : any[] = [];
    link: string;
    error = true;
    isSetData = false;
    // historyUpload : HistoryUploadDto = new HistoryUploadDto;

    constructor(
        injector: Injector,
        // private _notifyService: NotifyService,
        // private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _documentTypeAppService: DocumentTypesServiceProxy,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy ,
        private _documentAppService: DocumentServiceProxy,
        private _priorityAppService: PrioritiesServiceProxy,
        private _dynamicFieldAppService: DynamicFieldsServiceProxy,
        private _sanitizer: DomSanitizer
    ) {
        super(injector);
        // this.typeReceiveOptions = ["Giấy", "Mail", "Qua mạng"];
        this._priorityAppService.getAllPriorities().subscribe(res => {
            this.priorityOptions = res;
        });
        this._documentTypeAppService.getAllDocumentType().subscribe(result => {
            this.documentTypeOptions = result;
        });

    }
    showDetail(e:any)
    {
       this.rootUrl = AppConsts.fileServerUrl ;
       this.link = this.rootUrl + "/" + e.row.data.file;
        console.log( this.link)
        window.open(this.link, '_blank');
        
    }
    ngOnInit(){
        // this.getlist() ;
        // this.tabPanelData = [{title: "Xử lý", data: },{}];
        this._activatedRoute.params.subscribe(params => {
            this._id = params['id'];
            console.log(this.formItems);

            this._historyUploadsServiceProxy.getList(this._id).subscribe(res =>{
                this.historyUpload = res ;
            });
            
            this._documentAppService.getDocumentsForView(this._id).subscribe(result => {
                console.log(result);
                this.documentData = result.documents;
                this.oldDocType = result.documents.documentTypeId;
                this.oldPriority = result.documents.priority;
                // this.oldTypeReceive = result.documents.typeReceive;
            });

            this._documentAppService.getAllDocumentDetailByDocumentId(this._id).subscribe((result) => {
             
                this.listHistoryHandling = result;
            });
        }); 
       
        // this._dynamicFieldAppService.getAllDynamicValueByDocumentId(this._id).subscribe(res => {
        //     this.dynamicValues = res;
        //     console.log(res);
        // });

        this.loadDynamicFields();
        
    }

    loadDynamicFields(){
        const self = this;
        return new Promise((resolve, reject) => {
            this._dynamicFieldAppService.getDynamicFieldByModuleId(22, this._id).subscribe(res => {
                var div = '';
                self.isSetData = true;
                self.dynamicValues = res;
                res.forEach(function (value, index, array) {
                    div += '<div class="col-sm-6 form-inline" style="padding-right: 0;">';
                    div += '<div class="col-sm-3" style="padding-left:0;">'+value.nameDescription+' :</div>'
                    //comment vì dòng này thêm vào class col sẽ làm element bị thụt vào thêm 1 đoạn nữa
                    //div += '<div class="col-sm-'+value.width+'">'
                    div += '<div class="col-sm-9">';
                    let style = "";
                    let id = "dynamic" + value.name;
                    if(index > 1 && index % 2 == 1){
                        style += "width: 100%; margin-top: 7px;";
                    }
                    else{
                        style += "width: 100%;";
                    }
                    switch(value.typeField){
                        case 1: // checkbox
                            div += '<div id="dynamic'+value.name+'" style="'+ style +'"></div>';
                            // div += '<dxi-item [label]="{text: \'' + value.nameDescription +'\'} editorType="dxCheckBox" [editorOptions]="{value: ' + value.value.value == "true" + '}></dxi-item>';
                            
                            break;
                        case 2: // textbox
                            if(value.value.value != null){
                                div += '<input id="'+ id +'" type="text" class="form-control" style="'+ style +'" value="'+value.value.value+'" >'
                                // div += '<dxi-item [label]="{text: \'' + value.nameDescription + '\'} editorType="dxTextBox" [editorOptions]={value: \'' + value.value.value +'\'}"></dxi-item>';
                            }else{
                                // div += '<dxi-item [label]="{text: \'' + value.nameDescription + '\'} editorType="dxTextBox"></dxi-item>';
                                div += '<input id="'+ id +'" type="text" class="form-control" style="'+ style +'" >'
                            }
                            break;
                        case 3: //combobox
                            div += '<div id="'+id+'" style="'+ style +'"></div>';
                            // $("#"+id).dxSelectBox({
                            //     dataSource: value.dataSource,
                            //     valueExpr: "key",
                            //     displayExpr: "value",
                            //     value: (value.value.value != "" || value.value.value != null)? value.value.value: ""
                            // });
                            // if(value.value.value != "" || value.value.value != null)
                            // {
                            //     // $("#"+id).dxSelectBox("instance").option("value", value.value.value);
                            //     $("#" + id).dxSelectBox({value: value.value.value});
                            // }
                            break;
                        case 4: //datebox
                            div += '<div id="'+id+'" style="'+ style +'"></div>';
                            // let x = document.getElementById(id);
                            //     ($("#"+id) as any).dxDateBox({
                            //         displayFormat: "dd/MM/yyyy",
                            //         type: 'date',
                            //         value: (value.value.value != '') ? new Date(value.value.value) : new Date()
                            //     });
                            break;
                    }
                    // if(value.typeField == 2){ // input
                    //     if(value.value.value != null){
                    //         div += '<input id="dynamic'+value.name+'" type="text" class="form-control" style="'+ style +'" value="'+value.value.value+'" >'
                    //     }else{
                    //         div += '<input id="dynamic'+value.name+'" type="text" class="form-control" style="'+ style +'" >'
                    //     }
                    // }else if(value.typeField == 3 || value.typeField == 1 || value.typeField == 4){ // combobox,checkbox,datebox
                    //     div += '<div id="dynamic'+value.name+'" style="'+ style +'"></div>';
                    // }
    
                    div += '</div></div>';
                });
                // console.log(div);
                self.dynamicFields = self._sanitizer.bypassSecurityTrustHtml(div);
                    
            });
        }).then((val) => {
            setTimeout(() => {
                this.dynamicValues.forEach((data) => {
                    let id = "dynamic" + data.nameDescription;
                    switch(data.typeField){
                        case 1: // checkbox
                            var check = false;
                            //var check = (obj.value == "true") ? true : false;
                            if(data.value.value){
                                check = (data.value.value == "true") ? true : false;
                            }
                            $("#"+ id).dxCheckBox({
                                value: check
                            });
                            break;
                        case 3: 
                            $("#"+id).dxSelectBox({
                                dataSource: data.dataSource,
                                valueExpr: "key",
                                displayExpr: "value",
                                value: (data.value.value != "" || data.value.value != null)? data.value.value: ""
                            });
                            break;
                        case 4:
                            let x = document.getElementById(id);
                            ($("#"+id) as any).dxDateBox({
                                displayFormat: "dd/MM/yyyy",
                                type: 'date',
                                value: (data.value.value != '') ? new Date(data.value.value) : new Date()
                            });
                            break;
                        default: break;
                    }
                });
            }, 500);
        });
        
    }

    show(documentId: number): void {
        

    }

    save(): void {
        this.saving = true;
        this.documentData.isActive = true;
        // this.documentData.status = "Tiếp nhận";
        // this.documentData.action = 1;
        // this.documentData.startDate = moment($('#startDateFilter').val());

        this._documentAppService.createOrEdit(this.documentData)
            .pipe(finalize(() => { this.saving = false;}))
            .subscribe(() => {
                console.log("success");
                this.notify.info(this.l('SavedSuccessfully'));
            });
            
    }
}