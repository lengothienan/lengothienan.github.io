import {NgModule, Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { VanbansServiceProxy, CreateOrEditVanbanDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxFileManagerModule, DxPopupModule } from 'devextreme-angular';
import RemoteFileSystemProvider from 'devextreme/file_management/remote_provider';
import { BrowserModule } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { DxTextBoxModule, DxFileUploaderModule, DxButtonModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { from } from 'rxjs';
import { AppConsts } from '@shared/AppConsts';


@Component({
    selector: 'fileManagerModal',
    templateUrl: './file-manager-modal.component.html',
     preserveWhitespaces: true
})
export class FileManagerModalComponent extends AppComponentBase implements  OnInit {
    @ViewChild('fileManagerModal', { static: true }) modal: ModalDirective;
    @Output() public onUploadFinished = new EventEmitter();
    remoteProvider: RemoteFileSystemProvider;
    imageItemToDisplay: any = {};
    popupVisible = false;
    addOperation: any ; 
    uploadUrl: string;
 
    uploadedFiles: any[] = [];
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    vanban: CreateOrEditVanbanDto = new CreateOrEditVanbanDto();

    public noiDung: string;
    public  progress : number
    constructor(
        injector: Injector,
        private http: HttpClient,
        private _vanbansServiceProxy: VanbansServiceProxy
    ) {
        super(injector);
       // this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/api/services/app/Vanbans/UploadFile';
        this.uploadUrl = AppConsts.remoteServiceBaseUrl + '/api/file-manager-file-system-images';

        this.remoteProvider = new RemoteFileSystemProvider({
          endpointUrl: AppConsts.remoteServiceBaseUrl + '/api/file-manager-file-system-images'
      });
    }
   
   
    displayImagePopup(e) {
      this.imageItemToDisplay = e.fileItem;
      this.popupVisible = true;
  }

    ngOnInit() {
    }
   
    public uploadFile = (files) => {
      if (files.length === 0) {
        return;
      }
   
      let fileToUpload = <File>files[0];
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
   
      this.http.post(this.uploadUrl, formData, {reportProgress: true, observe: 'events'})
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round(100 * event.loaded / event.total);
          else if (event.type === HttpEventType.Response) {
            this.notify.success(this.l('Upload thành công'));
              this.noiDung= " Upload thành công";
              this.vanban.noiDung = fileToUpload.name;
            this.onUploadFinished.emit(event.body);
          }
        });
    }

    show(vanbanId?: number): void {

        if (!vanbanId) {
            this.vanban = new CreateOrEditVanbanDto();
            this.vanban.id = vanbanId;
            this.vanban.ngayGiaoViec = moment().startOf('day');
            this.vanban.hanKetThuc = moment().startOf('day');

            this.active = true;
            this.modal.show();
        } else {
            this._vanbansServiceProxy.getVanbanForEdit(vanbanId).subscribe(result => {
                this.vanban = result.vanban;
                this.active = true;
                this.modal.show();
            });
        }
    }
  
    showScanModule = false;
    toggleScanModule() { this.showScanModule = !this.showScanModule;} 

    save(): void {
            this.saving = true;
            this._vanbansServiceProxy.createOrEdit(this.vanban)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }

    close(): void {

        this.active = false;
        this.modal.hide();
    }
}
