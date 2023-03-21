import { Component, Injector } from '@angular/core';
import { HttpClient ,HttpEventType} from '@angular/common/http';
import { AppConsts } from '@shared/AppConsts';
import { SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { inject } from '@angular/core/testing';
 
@Component({
  selector: 'uploadFile',
  templateUrl: './upload-modal.html'
 
})
export class UploadFileComponent extends AppComponentBase {

   
  fileData :any ;
   userID : number ; 
  uploadUrl: string ;
  

constructor(
    private http: HttpClient,
       injector :Injector,
    private _session: SessionServiceProxy
) {
    super(injector);
    _session.getCurrentLoginInformations().subscribe((res) => {
        this.userID = res.user.id;
        this.uploadUrl = AppConsts.fileServerUrl  + '/FileUpload/Upload_file?userId=' + this.userID ;
    });
   
}
 
  ngOnInit() {

  }
 
  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  }
 
  onSubmit() {
    const formData = new FormData();
    formData.append('file', this.fileData);
    this.http.post( this.uploadUrl, formData, {
        reportProgress: true,
        observe: 'events'   
    })
    .subscribe(events => {
        if(events.type == HttpEventType.UploadProgress) {
            console.log('Upload progress: ', Math.round(events.loaded / events.total * 100) + '%');
        } else if(events.type === HttpEventType.Response) {
            console.log(events);
        }
    })
  }
 
 
}