import { Component, ViewChild, Injector, Output, EventEmitter, Input} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { HardDatasourcesServiceProxy, CreateOrEditHardDatasourceDto, DynamicFieldDto, DynamicFieldsServiceProxy, DynamicDatasourceServiceProxy, DynamicDatasourceDto, GetDynamicDatasourceForViewDto, HardDatasourceGroupsServiceProxy, HardDatasourceGroupDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditHardDatasourceModal',
    templateUrl: './create-or-edit-hardDatasource-modal.component.html'
})
export class CreateOrEditHardDatasourceModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    dynamicDatasource: HardDatasourceGroupDto[] = [];
    hardDatasource: CreateOrEditHardDatasourceDto = new CreateOrEditHardDatasourceDto();



    constructor(
        injector: Injector,
        private _hardDatasourceGroupsServiceProxy: HardDatasourceGroupsServiceProxy,
        private _dynamicDatasourceServiceProxy: DynamicDatasourceServiceProxy,
        private _hardDatasourcesServiceProxy: HardDatasourcesServiceProxy
    ) {
        super(injector);
        this._hardDatasourceGroupsServiceProxy.getAllHardDatasourceGroup().subscribe((res) => {
            
            this.dynamicDatasource = res;
        });
    }

    show(hardDatasourceId?: number, dynamicDatasourceId?: number): void {
        if (!hardDatasourceId) {
            this.hardDatasource = new CreateOrEditHardDatasourceDto();
            this.hardDatasource.dynamicDatasourceId = dynamicDatasourceId ? dynamicDatasourceId : null;
            this.hardDatasource.id = hardDatasourceId;
            this.hardDatasource.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._hardDatasourcesServiceProxy.getHardDatasourceForEdit(hardDatasourceId).subscribe(result => {
                this.hardDatasource = result.hardDatasource;

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._hardDatasourcesServiceProxy.createOrEdit(this.hardDatasource)
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
