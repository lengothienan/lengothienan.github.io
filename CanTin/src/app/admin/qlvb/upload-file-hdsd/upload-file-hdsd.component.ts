import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject,
  Optional,

} from '@angular/core';
import {
  Router, ActivatedRoute,
} from '@angular/router';
import { DxDataGridComponent, DxPopupComponent, DxFormComponent, DxTreeViewComponent, DxChartComponent, DxSelectBoxComponent, DxFileUploaderComponent } from 'devextreme-angular';
import { isNullOrUndefined } from 'util';
import { delay } from 'q';
import {AttachmentServiceProxy,SessionServiceProxy, DRLookUpServiceProxy, DRViewerServiceProxy, DRFilterServiceProxy, DrDynamicFieldServiceProxy, FParameter, DRColumnServiceProxy, DRChartServiceProxy, Attachment } from '@shared/service-proxies/service-proxies';
import { FormatService } from './formatService';
import { AppSessionService } from '@shared/common/session/app-session.service';
import {
  API_BASE_URL,
} from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { confirm,alert } from 'devextreme/ui/dialog'; 
import notify from 'devextreme/ui/notify';
@Component({
  selector: 'app-upload-file-hdsd',
  templateUrl: './upload-file-hdsd.component.html',
  styleUrls: ['./upload-file-hdsd.component.css'],
  providers: [FormatService],
  animations: [appModuleAnimation()]
})
export class UploadFileHdsdComponent implements OnInit {

  @ViewChild('data', { static: true }) data: DxDataGridComponent;
  //@ViewChild(DxPopupComponent) popup: DxPopupComponent;
  @ViewChild('dataGrid', { static: true }) dataGrid: DxDataGridComponent;
  @ViewChild('selectBox', { static: false }) selectBox: DxSelectBoxComponent;
  @ViewChild('fileUploader',{static:true}) fileUploader: DxFileUploaderComponent;
  popupVisible = false;
  filelist: any[];
  value: any = [];
  closeButtonOptions: any;
  uploadfile_: any;
  useUploadmode: any = "use";
  selectTypeForder: any[] = [{
    ID: 1,
    Name: 'HDSD'
  }];
  condition:any[]=['.docx', '.doc','.txt','.xltx','.xlsx','.xls','.ppt','.ppsx','.pptm','.pptx'];
selectTypeFile: any[] = [{
  ID: ".docx",
  Name: '.docx'
},
{ID: ".doc",
Name: '.doc'},{
  ID: ".pdf",
  Name: '.pdf'
},{
  ID: ".txt",
  Name: '.txt'
},{
  ID: ".xltx",
  Name: '.xltx'
},{
  ID: ".xlsx",
  Name: '.xlsx'
},{
  ID: ".ppt",
  Name: '.ppt'
},{
  ID: ".ppsx",
  Name: '.ppsx'
},{
  ID: ".pptm",
  Name: '.pptm'
},{
  ID: ".xls",
  Name: '.xls'
},{
  ID: ".pptx",
  Name: '.pptx'
}];
;
  typeforder: any=0;
  hasDisableFordername: any = true;
  VersionUpload= 1;
  fordername: string = "";
  uploadUrl: string;
  searchtypefile:string;
  searchtypeforder:number;
  constructor(
    public formatService: FormatService,
    private http: HttpClient,
    private _AttachmentServiceProxy: AttachmentServiceProxy,
  ) {
    this.uploadUrl = AppConsts.fileServerUrl + '/fileupload/Upload_file?userId=1';
  }
  showUploadFile() {
    this.popupVisible = true;
    $(".dx-overlay-wrapper").css("width", "1000%");
  }
  ngOnInit() {
    this.loadDataUpload();
  }
  loadDataUpload() {
    var temAttachment = new Attachment();
    temAttachment.diskFileName=this.searchtypefile;
    temAttachment.typeForder= this.searchtypeforder;
    this._AttachmentServiceProxy.getAttachFileBySearch(temAttachment).subscribe(res =>{
      this.filelist=res;
    });
  }
  CloseUploadFile() {
    this.popupVisible = false;
    this.VersionUpload = 1;
    this.value = [];
    //this.fordername = "";
    this.typeforder = 0;
    this.selectBox.instance.reset();
    
  }
  
  onChangeUploadFile(e) {
    this.uploadfile_ = e.target.files;
    $(".dx-fileuploader-files-container").css("padding", "0");
    $(".dx-fileuploader-file-container").css("padding", "0");
  }
  
  changeSearchTypeFile(e) {
      this.searchtypefile = e.value;
  }
  changeSearchForder(e){
      this.searchtypeforder = e.value;
  }
  changeforder(e) {
    // if (e.value == 2) {
      //this.hasDisableFordername = false;
      //this.fordername = "";
      // this.typeforder = e.value;
    // } else {
      //this.hasDisableFordername = true;
      //this.fordername = e.component.option("text");
      // this.typeforder = e.value;
    // }
    this.typeforder = e.value;
  }
  GetMessage(message:string,type:string){
    notify({message: message, width: 275,shading: true,
    position: 'top center',
    }, type, 1000);
  }
  onUploaded(e) {
    const files = this.uploadfile_;
   // if (this.value.length < 1 || this.fordername.trim() == "") {
    if (this.value.length < 1 || this.typeforder<1) {
      this.GetMessage("Xin điền thông tin đầy đủ để upload!!!","error");
      return;
    }
    // var valid=true;
    // this.selectTypeForder.forEach(ele=>{
    //   if(ele.Name==this.fordername && this.typeforder==2){
    //     valid=false;
    //     return;
    //   }
    // });
    // if(!valid){
    //   this.GetMessage("Forder này đã tồn tại!!!","warning");
    //   return;
    // }
    if (files.length > 0) {
      var today = new Date();
      var date =  today.getDate().toString()+'-'+(today.getMonth() + 1).toString()+'-'+today.getFullYear().toString() ;
      const formData: FormData = new FormData();
      formData.append('files', files[files.length - 1], files[files.length - 1].name);
      formData.append('filesize',files[files.length - 1].size);
      formData.append('Version', this.VersionUpload.toString());
      //formData.append('fordername', this.fordername.toString());
      //formData.append('fordername', "HDSD");
      formData.append('typeforder', this.typeforder);
      formData.append('createtime', date.toString());
      this.http.post(this.uploadUrl, formData).subscribe(res => {
        if(res){
          formData.append("diskdirectory",res.toString());
          this.http.post(AppConsts.remoteServiceBaseUrl + '/api/services/app/Attachment/InsertAttachFile', formData).subscribe(res =>{
            if (res['result']['data'].success.toString()=="True") {
              this.loadDataUpload();
              this.CloseUploadFile();
              this.GetMessage("Upload thành công!!!","success");
            }else{
              this.GetMessage("Upload thất bại!!!","error");
            }
          })   
        }
        
      })
      // this.http.post(AppConsts.remoteServiceBaseUrl + '/api/services/app/Attachment/InsertAttachFile', formData).subscribe(res => {
        // if (res['result']['data'].success.toString()=="True") {
        //   this.http.post(this.uploadUrl, formData).subscribe(res => {
        //     if (res['result']['data'].success) {
        //       this.loadDataUpload();
        //       this.CloseUploadFile();
        //       this.GetMessage("Upload thành công!!!","success");
        //     }
        //   })
        // }else{
        //   var result = confirm(res['result']['data'].message, "Thông báo");  
        //   result.done(function (dialogResult) {  
        //       if(dialogResult){
        //         // this._AttachmentServiceProxy.deleteAttachFile(res['result']['data'].id).subscribe(res=>{
                 
        //         // })
        //       }
        //   });  
        // }
      // })

    }
  }
 

  IconClickDownload(e) {
    var myWindow = window.open(AppConsts.fileServerUrl+'/' + e.row.data.diskDirectory.toString());
    myWindow.document.close();
    console.log(e.row.data.diskDirectory);
  }
 
  keyDownNumberVersion(e) { 
    const event = e.event;
    const str = event.key || String.fromCharCode(event.which);
    if (/^[.,e]$/.test(str)) {
      event.preventDefault();
      
    }
  }
  UploadFile(e) {
    this.onUploaded(e);
  }
}

// interface data{
//   version:string,
//   createAt:string
// }
