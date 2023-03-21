import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { HardDatasourceGroupsServiceProxy, CreateOrEditHardDatasourceGroupDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditHardDatasourceGroupModal',
    templateUrl: './create-or-edit-hardDatasourceGroup-modal.component.html'
})
export class CreateOrEditHardDatasourceGroupModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    hardDatasourceGroup: CreateOrEditHardDatasourceGroupDto = new CreateOrEditHardDatasourceGroupDto();



    constructor(
        injector: Injector,
        private _hardDatasourceGroupsServiceProxy: HardDatasourceGroupsServiceProxy
    ) {
        super(injector);
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
