import { Component, Injector, ViewChild, Output, EventEmitter } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrEditPublishOrgDto, PublishOrgsServiceProxy, OrgLevelsServiceProxy, OrganizationUnitServiceProxy, ListResultDtoOfOrganizationUnitDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

import { DxFormComponent, DxTreeViewComponent } from 'devextreme-angular';

import { ModalDirective } from 'ngx-bootstrap';


@Component({
    selector: 'createReceiver',
    templateUrl: './createReceiver.component.html',
    
    animations: [appModuleAnimation()]
})
export class CreateReceiverComponent extends AppComponentBase {
    @ViewChild('createReceiverModal', { static: true }) createReceiverModal: ModalDirective;
    @ViewChild('publisherForm', { static: false }) publisherForm: DxFormComponent;
    @Output() saveSuccess = new EventEmitter<any>();
    @ViewChild(DxTreeViewComponent, { static: false }) treeView;
    saving = false;

    selectionChangedBySelectbox: boolean;
    prefix = '';
    dataRowDetail: any;
    initialData: any;
    documentExistsVisible = false;
    orgLevel: any = [];
    treeDataSource: any;
    treeBoxValue: string;
    private datapublisher_Initial:any;
    datapublisher:any = [];
    isCATP: any = false;
    orgDataSource: any = [];

    constructor(
        injector: Injector,
        private _orgLevelAppService: OrgLevelsServiceProxy,
        private _publishOrgAppService: PublishOrgsServiceProxy,
        private _organizationUnitService: OrganizationUnitServiceProxy) {
        super(injector);
    }

    show(){
        this.getAllPublisher();
        this.getOrgLevel();
        this.getOrganization();
        this.publisherForm.formData={};
        this.createReceiverModal.show();
    }

    ngOnInit() {

    }


    getAllPublisher(){
        this._publishOrgAppService.getAllPublishOrg().subscribe((res) => {
            this.datapublisher_Initial = res;
        });
    }
    
    getOrgLevel(){
        this._orgLevelAppService.getAllOrgLevel().subscribe((res)=>{
            this.orgLevel = res.filter(e => e.code != "DVTTCATP");
        });
    }
    orgLevChanged = (e) =>{
        const self = this;

        if(self.orgLevel == null) return;

        let org = self.orgLevel.find(x => x.id == e.value);
        if(org != null) {
            if(org.code == "DVTTCATP") self.isCATP = true;
            else
                self.isCATP = false;
        }

        self.publisherForm.formData.orgId = null;
        self.publisherForm.formData.publisherName = "";

        if (self.datapublisher_Initial.length > 0) {
            self.datapublisher = self.datapublisher_Initial.filter(x => x.publishOrg.orgLevelId == self.publisherForm.formData.orgLevelId);
        }
    }

    noiNhanChanged = (e) => {
        debugger
        const self = this;
        self.publisherForm.formData.publisherName = e.selectedItem.displayName;
    }

    savepublisher(){
        let result = this.publisherForm.instance.validate();
        if(result.isValid){
            let data = new CreateOrEditPublishOrgDto();
            data.name = this.publisherForm.formData.publisherName;
            data.orgLevelId = this.publisherForm.formData.orgLevelId;
            data.isActive = true;
            data.parentId =this.publisherForm.formData.publisher;
            data.org = this.publisherForm.formData.orgId;

            this._publishOrgAppService.checkPublisherExists(data).subscribe(res => {
                if(res){
                    this.notify.error('Nơi nhận đã tồn tại');
                }
                else{
                    this._publishOrgAppService.createOrEdit(data)
                    //.pipe(finalize(() => { this.publisherPopupVisible = false;}))
                    .subscribe(() => {
                        this.notify.info(this.l('SavedSuccessfully'));
                        this.saveSuccess.emit(null);
                        this.close();
                        //this.publisherSelect.instance.repaint();
                    });
                }
            });
        }
    }

    close(){
        this.createReceiverModal.hide();
    }

    // syncTreeViewSelection() {
    //     if (!this.treeView) return;

    //     if (!this.treeBoxValue) {
    //         this.treeView.instance.unselectAll();
    //     } else {
    //         this.treeView.instance.selectItem(this.treeBoxValue);
    //     }
    // }

    treeView_publisher_itemSelectionChanged(e){
        this.publisherForm.formData.publisher = e.node.key;
    }

    treeView_organization_itemSelectionChanged(e){
        this.publisherForm.formData.orgId = e.node.key;
        this.publisherForm.formData.publisherName = e.node.itemData.displayName;
    }

    getOrganization(){
        this._organizationUnitService.getOrganizationUnitsCATP().subscribe((res) => {
            this.orgDataSource = res.data;
        });
    }
}