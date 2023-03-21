import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, Input} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { HardDatasourceGroupsServiceProxy, CreateOrEditHardDatasourceGroupDto, HardDatasourcesServiceProxy, DynamicFieldsServiceProxy, CreateOrEditHardDatasourceDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'dataHardDatasourceGroupModal',
    templateUrl: './data-hardDatasourceGroup-modal.component.html'
})
export class DataHardDatasourceGroupModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Input() hardName: string;
    @Input() hardDescription: string;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    dataSource = [];
    hardDatasourceGroup: CreateOrEditHardDatasourceGroupDto = new CreateOrEditHardDatasourceGroupDto();
    editing = true;
    dynamicId: number;

    constructor(
        injector: Injector,
        private _dynamicFieldService: DynamicFieldsServiceProxy,
        private _hardDatasourcesServiceProxy: HardDatasourcesServiceProxy,
        private _hardDatasourceGroupsServiceProxy: HardDatasourceGroupsServiceProxy
    ) {
        super(injector);
    }

    loadData(dynamicId: number){
        this.dynamicId = dynamicId;
        this.editing = true;
        if(this.hardName == 'Publisher'){
            this.editing = false;
        }
        console.log(this.hardName);
        this._hardDatasourcesServiceProxy.getAllByDynamicDatasource(this.dynamicId).subscribe((res)=>{
            this.dataSource = res;
            this.active = true;
            this.modal.show();
        });
    }

    onRowInserting(e: any){
        let data = new CreateOrEditHardDatasourceDto();
        data.dynamicDatasourceId = this.dynamicId;
        data.value = e.data.value;
        data.isActive = e.data.isActive;
        if(e.data.key) data.key = e.data.key;
        if(this.hardName == 'Publisher'){
            this.savepublisher(e.data.value);
            return;
        }
        else{
            this._hardDatasourcesServiceProxy.createOrEdit(data).subscribe(()=>{
                this.notify.info(this.l('SavedSuccessfully'));
            });
        }
    }

    onRowUpdating(e: any){
        let data = new CreateOrEditHardDatasourceDto();
        data.id = e.oldData.id;
        data.dynamicDatasourceId = e.oldData.dynamicDatasourceId;
        data.value = e.newData.value ? e.newData.value : e.oldData.value;
        data.isActive = e.newData.isActive ? e.newData.isActive : e.oldData.isActive;
        data.key = e.newData.key ? e.newData.key : e.oldData.key;
        data.order = e.newData.order ? e.newData.order : e.oldData.order;
        this._hardDatasourcesServiceProxy.createOrEdit(data).subscribe(()=>{

        });
    }

    onRowRemoving(e: any){
        console.log(e);
        this._hardDatasourcesServiceProxy.delete(e.data.id).subscribe();
    }

    //khởi tạo giá trị ban đầu
    onInitNewRow(e: any){
        e.data.isActive = true;
    }

    savepublisher(e: any){
        // this.data_publisher.push({ id: this.data_publisher.length,  name: this.publisherData["name"] });
        // console.log(this.publisherForm.formData.publisherName);
        this._dynamicFieldService.createFieldForPublisher(e).subscribe((res) => {
            this.notify.info(this.l('SavedSuccessfully'));
        });

        // this.publisherSelect.
    }

    show(hardDatasourceGroupId?: number): void {

        if (!hardDatasourceGroupId) {
            this.hardDatasourceGroup = new CreateOrEditHardDatasourceGroupDto();
            this.hardDatasourceGroup.id = hardDatasourceGroupId;

            this.active = true;
            this.modal.show();
        } else {
            this._hardDatasourceGroupsServiceProxy.getHardDatasourceGroupForEdit(hardDatasourceGroupId).subscribe(result => {
                this.hardDatasourceGroup = result.hardDatasourceGroup;
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._hardDatasourceGroupsServiceProxy.createOrEdit(this.hardDatasourceGroup)
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
