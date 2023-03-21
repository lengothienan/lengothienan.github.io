import { NgModule, Component, ViewChild, Injector, Output, Optional,EventEmitter, OnInit, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { VanbansServiceProxy, CreateOrEditVanbanDto, DocumentServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxFileManagerModule, DxPopupModule, DxDataGridComponent } from 'devextreme-angular';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';
import { BrowserModule } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { DxTextBoxModule, DxFileUploaderModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { from } from 'rxjs';
import { AppConsts } from '@shared/AppConsts';
 import * as $ from 'jquery';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { SqlConfigHelperService } from '@shared/utils/sql-config-helper.service';
import { formatDate } from '@angular/common';
//import * as jsPDF from 'jspdf'; 
declare const exportHTML: any;

@Component({
    selector: 'reportDocumentModal',
    templateUrl: './report-document-modal.html',
    preserveWhitespaces: true,
    animations: [appModuleAnimation()]
})
export class ReportDocumentModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('content',{ static: true })  content: ElementRef;  
    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
    @Output()    public onUploadFinished = new EventEmitter();
    remoteProvider: RemoteFileSystemProvider;
    imageItemToDisplay: any = {};
    popupVisible = false;
    addOperation: any;
    uploadUrl: string;
    uploadUrl2: string;
    uploadedFiles: any[] = [];
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    value: any[] = [];
    active = false;
    saving = false;
    nameArr: any[] = [];
    day: string;
    month: string;
    year: string;
    name_Arr: any[] = [];
    vanban: CreateOrEditVanbanDto = new CreateOrEditVanbanDto();
    _id: number;
    newvanban: any;
    public noiDung: string;
  
    public progress: number
    date: any;
    constructor(
        injector: Injector,
        private http: HttpClient,
        private router: Router,
        
        private _documentServiceProxy: DocumentServiceProxy,
        private activatedRoute: ActivatedRoute,
        protected activeRoute: ActivatedRoute,
        private _sqlConfigHelperService: SqlConfigHelperService,
        private _vanbansServiceProxy: VanbansServiceProxy
    ) {
        super(injector);
        this.newvanban = {};

        // this.uploadUrl = 'http://localhost:22742/Vanbans/UploadFile';
    }

    exportHTML() {
        exportHTML();
      }
    ngOnInit(): void {

    
        var d = new Date();
        this.activeRoute.params.subscribe(params => {
            this._id = params['id'];
            if (this._id !== undefined) {
                this._documentServiceProxy.getDocumentsForView(this._id).subscribe(res => {
                    this.newvanban = res;
                    console.log(this.newvanban)

                    // console.log(this.newvanban.documents.startDate)
                    // console.log(this.newvanban.documents.startDate._i)
                    // this.date = this.newvanban.documents.startDate._i;
                    // const cValue = formatDate(this.date, 'dd-MM-yyyy', 'en-US');
                    // // d = this.newvanban.documents.startDate._i ;
                    // // var n = d.getDay();
                    // console.log(cValue)
                    // this.day = this.date.getDay();
                    // this.month = this.date.getMonth();
                    // this.year = this.date.getYear();
                    // console.log(this.day)
                    // console.log(this.month)
                    // console.log(this.year)
                })
            }


        });
    };

  
 
    save(): void {

        this.saving = true;
        this._vanbansServiceProxy.createOrEdit(this.vanban)
            .pipe(finalize(() => { this.saving = false; }))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.name_Arr.push.apply(this.vanban);
                this.close();
                this.modalSave.emit(this.vanban);
            });
    };


    
   
    // public SavePDF(): void {  
    //     let content=this.content.nativeElement;  
    //     let doc = new jsPDF();  
    //     let _elementHandlers =  
    //     {  
    //       '#editor':function(element,renderer){  
    //         return true;  
    //       }  
    //     };  
    //     doc.fromHTML(content.innerHTML,15,15,{  
      
    //       'width':190,  
    //       'elementHandlers':_elementHandlers  
    //     });  
      
    //     doc.save('BaoCao.pdf');  
    //   }  


    close(): void {

        this.active = false;
        // this.modal.hide();
    }
}
    