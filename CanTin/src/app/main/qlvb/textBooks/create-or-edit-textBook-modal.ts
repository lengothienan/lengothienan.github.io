import {NgModule, Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { VanbansServiceProxy, CreateOrEditVanbanDto, TextBooksServiceProxy, TextBookDto } from '@shared/service-proxies/service-proxies';
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


@Component({
    selector: 'createOrEditTextBookModal',
    templateUrl: './create-or-edit-textBook-modal.html',
     preserveWhitespaces: true,
     animations: [appModuleAnimation()]
})
export class CreateOrEditTextBookModalComponent extends AppComponentBase implements  OnInit {
  @ViewChild('dataTable', { static: true }) dataTable: Table;
  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
    @Output() public onUploadFinished = new EventEmitter();
    remoteProvider: RemoteFileSystemProvider;
    imageItemToDisplay: any = {};
    popupVisible = false;
    addOperation: any ; 
    uploadUrl: string;
    uploadUrl2: string;
    uploadedFiles: any[] = [];
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    value: any[] = [];
    active = false;
    saving = false;
    nameArr: any[]= [];
    name_Arr: any[]= [];
    textBook :TextBookDto = new TextBookDto;
    _id: number ; 
    newvanban :any ; 
    textbook:any;
    public noiDung: string;
    public  progress : number
    constructor(
        injector: Injector,
        private http: HttpClient,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        protected activeRoute: ActivatedRoute,
        private _sqlConfigHelperService: SqlConfigHelperService,
        private _textBooksServiceProxy: TextBooksServiceProxy
    ) {
        super(injector);
        this.newvanban = {};
        // this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/DemoUiComponents/Upload_file' ;
        //  this.uploadUrl2 = AppConsts.remoteServiceBaseUrl + '/api/services/app/Vanbans/UploadFile';
        // this.uploadUrl = 'http://localhost:22742/Vanbans/UploadFile';
    }


    // showScanModule = false;
    // toggleScanModule() { this.showScanModule = !this.showScanModule;}

    ngOnInit(): void {
  //  
        this.activeRoute.params.subscribe(params => {
          this._id = params['id'];
         
            this._textBooksServiceProxy.getTextBookForView(this._id).subscribe((res) => {
              this.newvanban = res.textBook;
            console.log(this.newvanban)
        })
      
          
     
  })
}

  //   ngOnInit(): void {
     
  // };
    // setName(){
      
 
    //   this.value.forEach((ele)=>{
    //     this.nameArr.push(  ele.name  );       
    //   });
    //   this.vanban.noiDung =  this.nameArr.join(';');
    // }

   

 
    // public upload_File = (files) => {
    //   if (files.length === 0) {
    //     return;
    //   }
      
    //   let fileToUpload = <File>files[0];
    //   const formData = new FormData();
    //   formData.append('files', fileToUpload, fileToUpload.name);
   
  
    //   this.http.post(this.uploadUrl, formData, {reportProgress: true, observe: 'events'})
    //     .subscribe(event => {
    //       if (event.type === HttpEventType.UploadProgress)
    //       {
    //         this.progress = Math.round(100 * event.loaded / event.total);
    //         console.log(this.uploadUrl);
    //       }
    //       else if (event.type === HttpEventType.Response) {
    //         this.notify.success(this.l('Upload thành công'));
    //           this.noiDung= " Upload thành công";
    //           console.log(fileToUpload);
    //           this.vanban.noiDung = fileToUpload.name;
    //         this.onUploadFinished.emit(event.body);

            
    //       }
    //     });
    // }

  //   show(vanbanId?: number): void {

  //     if (!vanbanId) {
  //         this.vanban = new CreateOrEditVanbanDto();
  //         this.vanban.id = vanbanId;
  //         this.vanban.ngayGiaoViec = moment().startOf('day');
  //         this.vanban.hanKetThuc = moment().startOf('day');

  //         this.active = true;
  //         // this.modal.show();
  //     } else {
  //         this._vanbansServiceProxy.getVanbanForEdit(vanbanId).subscribe(result => {
  //             this.vanban = result.vanban;
  //             this.active = true;
  //             // this.modal.show();
  //         });
  //     }
  // }
//   getVanbanDxTable() {
//     // if (this.primengTableHelper.shouldResetPaging(event)) {
//     //     this.paginator.changePage(0);
//     //     return;
//     // }

//     // this.primengTableHelper.showLoadingIndicator();
//     this._vanbansServiceProxy.getAllVanBan().subscribe(result => {
//         this.dataGrid.dataSource = result.listVanBan;
//         this.name_Arr =result.listVanBan;
//         console.log(this.dataGrid.dataSource);
//         //console.log(JSON.parse(result.data));
//         //;
//         //var newCol = {caption: 'Custom Button', visible: true};
//         // var newCol = {caption: 'Custom Button', visible: true, fixed: false, width: null, alignment: null};
//         //var temp = new GridBaseColumn { }
//         // this.dataGrid.columns.push(newCol);
//         this.dataGrid.columns = this._sqlConfigHelperService.generateColumns(result.listColumnConfig, true);
//     });
// }
  save(): void {
    
          this.saving = true;
          this._textBooksServiceProxy.createOrEdit(this.textBook)
           .pipe(finalize(() => { this.saving = false;}))
           .subscribe(() => {
              this.notify.info(this.l('SavedSuccessfully'));
              this.name_Arr.push.apply(this.textBook);
              this.close();
              this.modalSave.emit(this.textBook);
           });
  }


  close(): void {

      this.active = false;
      // this.modal.hide();
  }
}
