import { Component, Injector, ViewChild, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ListOrgLevelInGroup, ListOrgInGroup, ODocsServiceProxy, CreateOrEditGroupReceiverDto, GroupReceiverServiceProxy, PublishOrgsServiceProxy, OrgLevelsServiceProxy, OrganizationUnitServiceProxy, ListResultDtoOfOrganizationUnitDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

import { DxDataGridComponent, DxFormComponent, DxScrollViewComponent, DxTagBoxComponent, DxTreeViewComponent } from 'devextreme-angular';

import { ModalDirective } from 'ngx-bootstrap';
import { forEach } from 'lodash';
import { finalize } from 'rxjs/operators';
import { AnyRecord } from 'dns';

@Component({
  selector: 'groupReceiver',
  templateUrl: './group-receiver.component.html',
  styleUrls: ['./group-receiver.component.css'],
  animations: [appModuleAnimation()]
})
export class GroupReceiverComponent extends AppComponentBase{
  @ViewChild(DxDataGridComponent, { static: true }) gridContainer: DxDataGridComponent;
  @ViewChild('groupReceiverModal', { static: true }) groupReceiverModal: ModalDirective;
  @ViewChild('formBCH', { static: true }) formBCH: DxFormComponent;
  @ViewChild('publisherForm', { static: false }) publisherForm: DxFormComponent;
  @Output() saveSuccessGroup = new EventEmitter<any>();
  @ViewChild(DxTreeViewComponent, { static: false }) treeView;
  @ViewChild('orgLevelTagBox', { static: true }) orgLevelTagBox: DxTagBoxComponent;
  @ViewChild('publishOrgTagBox', { static: true }) publishOrgTagBox: DxTagBoxComponent;
  @ViewChild('scrollView', { static: true }) scrollView: DxScrollViewComponent;
  @Input() typeGroupChild: any;
  documentData: CreateOrEditGroupReceiverDto = new CreateOrEditGroupReceiverDto();
  saving = false;
  selectionChangedBySelectbox: boolean;
  initialData: any;
  orgLevel: any = [];
  isCATP: any = false;
  orgDataSource: any = [];
  groupReceiverSource: any;
  createPopup = false;
  editPopup = false;
  orgLevelSource = [];
  selectedOrgLevels = [];
  publishOrgSource: any;
  data_receiver = [];
  displayReceiverList = [];
  popupTitle: any;
  orgLevelText: any;
  publisherOrgText: any;
  groupNameVal: any;
  orgLevelVal: any;
  publishOrgVal: any;
  editPopupTitle: any;
  countPublishOrgSelected: number = 0;
  constructor(
    injector: Injector,
    private _orgLevelAppService: OrgLevelsServiceProxy,
    private _publishOrgAppService: PublishOrgsServiceProxy,
    private _organizationUnitService: OrganizationUnitServiceProxy,
    private _oDocService: ODocsServiceProxy,
    private _groupReceiverServiceProxy: GroupReceiverServiceProxy,) {
    super(injector);

    this._oDocService.getListOrgLevels().subscribe(res => {
      this.orgLevelSource = res;
    });
  }

  show() {
    this.blockBodyScrolling()
    this.groupReceiverModal.show();
   
  }

  ngOnInit() {
    this.getGroupReceiver();
    this.getPublishOrg();
      this.popupTitle = "Thêm mới nhóm nhận";
      this.editPopupTitle = "Sửa nhóm nhận";
      this.orgLevelText = "Cấp nhận";
      this.publisherOrgText = "Nơi nhận";

  }

  getGroupReceiver(){
    this._groupReceiverServiceProxy.getGroupReceiverByOrgId(this.appSession.organizationUnitId, this.typeGroupChild).subscribe(res => {
      this.initialData = res.data;
    })
  }

  getOrgLevel() {
    this._orgLevelAppService.getAllOrgLevel().subscribe((res) => {
      this.orgLevel = res.filter(e => e.code != "DVTTCATP");
    });
  }


  close() {
    this.unBlockBodyScrolling();
    this.groupReceiverModal.hide();
  }

  showCreatePopup() {
    this.createPopup = true;
  }

  showEditPopup(e) {
    this.editPopup = true
    if(this.gridContainer.instance.getSelectedRowsData()[0].OrgLevelId){
      let orgLevelList: any = this.gridContainer.instance.getSelectedRowsData()[0].OrgLevelId.split(";")
      orgLevelList.forEach(x => {
        this.selectedOrgLevels.push(parseInt(x, 10))
      })
    }
    if(this.gridContainer.instance.getSelectedRowsData()[0].PublishOrgId){
      let publishOrgList: any = this.gridContainer.instance.getSelectedRowsData()[0].PublishOrgId.split(";");
      publishOrgList.forEach(x => {
        this.displayReceiverList.push(parseInt(x, 10))
      })
    }
    this.documentData.name = this.gridContainer.instance.getSelectedRowsData()[0].GroupName;
    this.documentData.id = this.gridContainer.instance.getSelectedRowsData()[0].Id;
    this.countPublishOrgSelected = this.gridContainer.instance.getSelectedRowsData()[0].PublisherCount;
  }
  
  closePopup(){
    this.createPopup = false;
    this.selectedOrgLevels = [];
    this.displayReceiverList = [];
    this.documentData.name = '';
  }
  closeEditPopup(){
    this.editPopup = false;
    this.selectedOrgLevels = [];
    this.displayReceiverList = [];
    this.documentData.name = '';
    this.documentData.id = 0;
  }

  orgLevelValueChanged() {
    this.publishOrgTagBox.dataSource = [];
    this.publishOrgSource = [];
    this.selectedOrgLevels.forEach(f => {
      this.data_receiver.forEach(e => {
        if (f == e.orgLevelId) this.publishOrgSource.push(e);
      })
    });
  }

  blockBodyScrolling() {
    let bodyElement: any = document.getElementsByTagName("body")[0] 
    bodyElement.getElementsByClassName("modal-open")[0]
    bodyElement.style.overflow='hidden';
    bodyElement.style.position='fixed'
  }

  unBlockBodyScrolling(){
    let bodyElement: any = document.getElementsByTagName("body")[0] 
    bodyElement.getElementsByClassName("modal-open")[0]
    bodyElement.style.overflow='auto';
    bodyElement.style.position='static'
  }

  getPublishOrg() {
    this._publishOrgAppService.getPublishOrgByUserLogin(this.appSession.organizationUnitId).subscribe((res) => {
      this.data_receiver = res.data;
      this.orgLevelValueChanged();
    });
  }

  save() {
    this.saving = true;
    this.documentData.listOrgLevelInGroups = [];
    this.orgLevelTagBox.instance.option("selectedItems").forEach(x => {
      let orgLevelId = new ListOrgLevelInGroup();
      orgLevelId.orgLevelId = x.id;
      this.documentData.listOrgLevelInGroups.push(orgLevelId);
    })
    this.documentData.listOrgInGroups = [];
    this.publishOrgTagBox.instance.option("selectedItems").forEach(x => {
      let publishOrg = new ListOrgInGroup();
      publishOrg.publisherOrgId = x.id;
      this.documentData.listOrgInGroups.push(publishOrg);
    })
    this.documentData.type = this.typeGroupChild;
    this._groupReceiverServiceProxy.createOrUpdate(this.documentData)
    .pipe(finalize(() => { this.saving = false;this.closeEditPopup();this.closePopup();this.getGroupReceiver();}))
    .subscribe((res) => {
      if (res<0) {
        this.notify.warn("Tên nhóm đã tồn tại!");
      }else{
        this.notify.success("Thành công!");       
        this.saveSuccessGroup.emit(true);
      }
    })
  }
  onOpenedTagBox(e: any) {
    e.component.content().find('.dx-list-select-all').css('display', 'none');
  }

  orgPublishOrgValueChanged(){
    this.countPublishOrgSelected = this.publishOrgTagBox.instance.option("selectedItems").length;
    console.log(this.countPublishOrgSelected);
  }

  lockScroll(e) {
    e.preventDefault();
}

  delete() {
    const self = this;
    let id:any = this.gridContainer.instance.getSelectedRowsData()[0].Id;
    abp.message.confirm(
        'Bạn có chắc muốn xóa nhóm này? ',
        'Xác nhận',
        isConfirmed => {
            if (isConfirmed) {
                self._groupReceiverServiceProxy.delete(id).subscribe(() => {
                    abp.notify.success('Xóa thành công');
                    self.getGroupReceiver();
                });
            }
        }
    );
}
}
