import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CreateOrEditIdoc_starDto, DocumentHandlingsServiceProxy, DocumentHandlingDetailsServiceProxy, UserServiceProxy, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DxDataGridComponent, DxSelectBoxComponent, DxRadioGroupComponent } from 'devextreme-angular';
import { SqlConfigHelperService } from '@shared/utils/sql-config-helper.service';
import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { AppConsts } from '@shared/AppConsts';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import $ from 'jquery';
import moment from 'moment';
@Component({
  selector: 'app-vb-phoi-hop-cbcs-chua-xu-ly',
  templateUrl: './vb-phoi-hop-cbcs-chua-xu-ly.component.html',
  styleUrls: ['./vb-phoi-hop-cbcs-chua-xu-ly.component.css'],
  animations: [appModuleAnimation()]
})
export class VbPhoiHopCbcsChuaXuLyComponent extends AppComponentBase implements OnInit {

  @Input() actionID: string;
  // @Output() lbId = new EventEmitter<number>();
  @ViewChild(DxDataGridComponent, { static: false }) gridContainer: DxDataGridComponent;
  // @ViewChild('transferHandleModal', { static: true }) transferHandleModal: TransferHandleModalComponent;
  @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;
  // @ViewChild('createNewIncommingDocument', { static: false }) createNewIncommingDocument: CreateNewIncommingDocumentComponent;
  @ViewChild('gridContainer113', { static: true }) gridContainer113: DxDataGridComponent;
  @ViewChild("BGDSelectBox", { static: false }) BGDSelectBox: DxSelectBoxComponent;
  @ViewChild('buttonUI', { static: true }) buttonUI: ButtonUIComponent;
  @ViewChild('loaiXuLyRadio', { static: true }) loaiXuLyRadio: DxRadioGroupComponent;
  totalCount: number = 0;
  saving = false;
  rawSql: string;
  user_ID: any;
  userID: any;
  header: string;
  selectionChangedBySelectbox: boolean;
  prefix = '';
  dataRowDetail: any;
  initialData: any;
  selectedID: any;
  labelId: number;
  now: Date = new Date();
  historyPopupVisible = false;
  popup_Visible = false; // popup trình BGĐ
  toggleStared = false;
  history_Upload = [];
  rootUrl = '';
  selectedRows = [];
  selectedRowsData: any[] = [];
  data_Row: string;
  link = '';
  allMode: string;
  checkBoxesMode: string;
  selectedItems: any[] = [];
  parameters: any;
  num: number[] = [];
  directions: any;
  director_list = [];
  selected: any; // directorId selected
  currentDate: Date;
  selectedDirector: any;
  numberOfDaysByDocType = 0;
  director: any;
  data_secretLevel = [];
  data_priority = [];
  data_DVXL = [];
  //đơn vi jxử lý của popup cập nhật kết quả giải quyết
  data_DVXL_CNKQGQ = [];
  getLeaderList_PGD = [];
  data_publisher = [];
  previousMainHandlingId: number;
  previousMainHandlingIndex: number;
  printUrl = '';
  popup_handleDocument = false;

  typeHandleDocument = [
    { key: 1, value: "Lưu tham khảo" },
    { key: 2, value: "Báo cáo" },
    { key: 3, value: "Dự họp" }
  ];
  selectedType: any;

  constructor(
    injector: Injector,
    private _appSessionService: AppSessionService,
    private router: Router,
    private _dynamicGridServiceProxy: DynamicGridHelperServiceProxy,
    private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
    private _documentAppService: DocumentServiceProxy,
    private _idocStarServiceProxy: Idoc_starsServiceProxy,
    private _utilityService: UtilityService,
    private _dynamicFieldService: DynamicFieldsServiceProxy) {
    super(injector);
    this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetWordFile?documentId=';
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
      }
    });


    this.link = this.router.url;
    this.user_ID = this._appSessionService.userId;
    this.allMode = 'allPages';
    this.checkBoxesMode = 'onClick';

    this.currentDate = new Date();

    this._dynamicFieldService.getDynamicFieldByModuleId(22, 0).subscribe(result => {
      this.data_publisher = result[0].dataSource;
      this.data_secretLevel = result[1].dataSource;
      this.data_priority = result[2].dataSource;
      // this.data_range = result[3].dataSource;
      // this.data_position = result[4].dataSource;
    });
  }

  ngOnInit() {
    this.getListDepartment();

    this.loadData();
    this.selectedType = -1;
  }

  loadData() {
    this._documentAppService.getAllDocumentPhoiHopByUserId(this.appSession.userId).subscribe(res => {
      //console.log(res)
       this.initialData = res;
      this.totalCount = this.initialData.length;
    })
  }

  getListDepartment() {
    this._documentAppService.getListPhongBanCATP().subscribe(res => {
      this.data_DVXL = res;
      for (var i = 0, len = this.data_DVXL.length; i < len; i++) {
        this.data_DVXL[i]["mainHandling"] = false;
        this.data_DVXL[i]["coHandling"] = false;
      }
    });
  }

  getVanbanDxTable(labelId: number) {
    const that = this;
    this._dynamicGridServiceProxy.getAllDataAndColumnConfigByLabelId(labelId, false).subscribe(result => {
      let count = 0;
      that.header = result.getDataAndColumnConfig.title;
      if (result.dynamicActionDto != null || result.dynamicActionDto != undefined) {
        that.num = result.dynamicActionDto.cellTemplate.split(',').map(x => { return parseInt(x); }).sort((a, b) => { return a - b; });
      }
      that.initialData = result.getDataAndColumnConfig.listData;
      for (var i = 0, len = that.initialData.length; i < len; i++) {
        that.initialData[i]["stt"] = ++count;
        that.initialData[i]["star"] = that.initialData[i]["Star"] == 1 ? true : false;

      }
      that.gridContainer.instance.repaint();
    });
  }

  viewProcess(event: any) {
    this._documentAppService.seenDocument(event.data.DocumentHandlingDetailId).subscribe(res=>{
      this.router.navigate(['/app/main/qlvb/quytrinhxuly/' + event.data.Id]);
    });
  }

  showListHistory(event: any) {
    this._historyUploadsServiceProxy.getList(event.data.Id).subscribe(res => {
      this.history_Upload = res;
    });
    this.historyPopupVisible = true;
  }

  // xem chi tiet file dinh kem 
  showDetail(e: any) {
    this.rootUrl = AppConsts.fileServerUrl;
    this.link = this.rootUrl + "/" + e.row.data.file;
    window.open(this.link, '_blank');

  }


  old_DVXL = [];
  data_DVXL_KQXL = [];

  // Xu ly khi double click vào datagrid ở màn hình Chưa duyệt

  edit(e: any) {
    this.router.navigate(['/app/main/qlvb/so-den-theo-phong/' + e.data.Id]);
  }

  view(e: any) {
    this._documentAppService.seenDocument(e.DocumentHandlingDetailId).subscribe(res=>{
    if(e.ParentHandlingDetailId>0){
      this.router.navigate(['/app/main/qlvb/them-vb-doi-phoi-hop/view/' + e.Id+'/'+e.ParentHandlingDetailId]);
  }else{
      this.router.navigate(['/app/main/qlvb/xem-vb-den-doi/' + e.Id]);
  }
});
  }
  ratePopupVisible=false;
  ratingData: any;
  cap_nhat_kqxl(data) {
    // console.log(data)
    this._documentAppService.seenDocument(data.DocumentHandlingDetailId).subscribe(res=>{
      this.loadData();
      this._documentAppService.getVanBanCapNhatTienDoXuLyPH(data.DocumentHandlingDetailId).subscribe((res) => {
          this.ratingData = res.data[0];
          this.ratePopupVisible = true;
      })
  });
  }
  updateRating = (): void => {
      this._documentAppService.capNhatTienDoXuLy(this.ratingData.Id,this.ratingData.ProgressNotes).subscribe(() => {
          this.ratePopupVisible = false;
          this.message.success("Cập nhật tiến độ thành công!!!");
      })
  };

  popUpClass() {
    return 'popUpClass';
  }

  transferTeam() {
    this.popup_Visible = true;
  }

  handleDocument(d) {
    this._documentAppService.seenDocument(d.DocumentHandlingDetailId).subscribe(res=>{
      this.loadData();
      this.selectedDoc = d;
      this.popup_handleDocument = true;
    });
  }

  duThao(e: any) {
    // let dt = this.gridContainer.instance.getSelectedRowsData()[0];
    this._utilityService.selectedDocumentData = e;
    if (e.Book > 0) {
      this.router.navigate(['/app/main/qlvb/them-moi-vb-thay-catp']);
    }
    else if (e.BookDV > 0) {
      this.router.navigate(['/app/main/qlvb/them-moi-vb-thay-vtdv']);
    }
    else {
      this.router.navigate(['/app/main/qlvb/them-moi-vb-noi-bo']);
    }
  }

  exportHTML(data: any) {
    $.ajax({
      url: this.printUrl + data.Id,
      method: 'POST',
      xhrFields: {
        responseType: 'blob'
      },
      success: function (data) {
        console.log(data);
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(data);
        a.href = url;
        var current = new Date();
        var fullTimeStr = current.getHours().toString() + current.getMinutes() + current.getSeconds()
          + current.getDate() + (current.getMonth() + 1) + current.getFullYear();
        a.download = 'MauPhieuTrinh_' + fullTimeStr + '.doc';
        document.body.append(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    });

  }
  selectedDoc:any;
  btnXuLy() {
    if(this.dataRowDetail.ProcessingDate instanceof Date && !isNaN(this.dataRowDetail.ProcessingDate)){
      if(this.selectedType!=-1){
        let documentData = this.selectedDoc;
        this._documentAppService.handleDocument_CBCSPhoiHop(documentData.DocumentHandlingDetailId,  this.selectedType,
          this.dataRowDetail.ProcessingRecommended, moment(this.dataRowDetail.ProcessingDate).utc(true)).subscribe(res => {
            this.popup_handleDocument = false;
            this.notify.info("Xử lý thành công!");
            this.router.navigate(['/app/main/qlvb/vb-phoi-hop-da-xu-ly']);
            
          })
      }else{
        this.popup_handleDocument = false;
        let result = this.message.warn("Vui lòng chọn loại xử lý", "Cảnh báo");
            result.then((dialogResult) => {
                this.popup_handleDocument=true;
            });
      }
    }else{
      this.popup_handleDocument = false;
      let result = this.message.error("Sai định dạng ngày", "Thông báo lỗi");
      result.then((dialogResult) => {
          this.popup_handleDocument=true;
      });
    }
    
  }
  onToolbarPreparing(e) {
    e.toolbarOptions.items.unshift({
      location: 'before',
      template: 'totalGroupCount'
    });
  }

}
