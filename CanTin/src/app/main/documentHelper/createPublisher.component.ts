import { Component, Injector, ViewChild, Output, EventEmitter } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { CreateOrEditPublishOrgDto, PublishOrgsServiceProxy, OrgLevelsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

import { DxFormComponent, DxTreeViewComponent } from 'devextreme-angular';

import { ModalDirective } from 'ngx-bootstrap';


@Component({
    selector: 'createPublisher',
    templateUrl: './createPublisher.component.html',
    
    animations: [appModuleAnimation()]
})
export class CreatePublisherComponent extends AppComponentBase {
    @ViewChild('createPublisherModal', { static: true }) createPublisherModal: ModalDirective;
    @ViewChild('publisherForm', { static: false }) publisherForm: DxFormComponent;
    @Output() saveSuccess = new EventEmitter<any>();
    @ViewChild(DxTreeViewComponent, { static: false }) treeView;
    saving = false;

    selectionChangedBySelectbox: boolean;
    prefix = '';
    dataRowDetail: any;
    initialData: any;
    documentExistsVisible = false;
    orgLevel: any;
    private datapublisher_Initial:any;
    datapublisher:any;

    treeDataSource: any;
    treeBoxValue: string;

    constructor(
        injector: Injector,
        private _orgLevelAppService: OrgLevelsServiceProxy,
        private _publishOrgAppService: PublishOrgsServiceProxy) {
        super(injector);
        this._publishOrgAppService.getAllPublishOrg().subscribe((res) => {
            this.datapublisher_Initial = res;
            this.orgLevChanged();
        });
    }

    show(){
        this.getOrgLevel();
        this.publisherForm.formData={};
        this.createPublisherModal.show();
    }

    ngOnInit() {
        this.getOrgLevel();
        
    }

    orgLevChanged = () => {
        const self = this;
        if (self.datapublisher_Initial.length > 0) {
            self.datapublisher = self.datapublisher_Initial.filter(x => x.publishOrg.orgLevelId == self.publisherForm.formData.orgLevelId);
        }
    }

    getOrgLevel(){
        this._orgLevelAppService.getAllOrgLevel().subscribe((res)=>{
            this.orgLevel = res.filter(e => e.code != "DVTTCATP");
        });
    }

    savepublisher(){
        let result = this.publisherForm.instance.validate();
        if(result.isValid){
            let data = new CreateOrEditPublishOrgDto();
            data.name = this.publisherForm.formData.publisherName;
            data.orgLevelId = this.publisherForm.formData.orgLevelId;
            data.isActive = true;
            data.parentId =this.publisherForm.formData.publisher;
            data.org = null;
            if (this.appSession.user.name!='admin'){
                data.publishOrgId = this.appSession.organizationUnitId;
            }
            this._publishOrgAppService.checkPublisherExists(data).subscribe(res => {
                if(res){
                    this.notify.error('Nơi PH đã tồn tại');
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
        this.createPublisherModal.hide();
    }

    syncTreeViewSelection() {
        if (!this.treeView) return;

        if (!this.treeBoxValue) {
            this.treeView.instance.unselectAll();
        } else {
            this.treeView.instance.selectItem(this.treeBoxValue);
        }
    }

    treeView_itemSelectionChanged(e){
        this.publisherForm.formData.publisher = e.node.key;
    }
}
