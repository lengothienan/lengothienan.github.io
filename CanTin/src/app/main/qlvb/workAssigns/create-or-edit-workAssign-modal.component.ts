import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { WorkAssignsServiceProxy, CreateOrEditWorkAssignDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditWorkAssignModal',
    templateUrl: './create-or-edit-workAssign-modal.component.html'
})
export class CreateOrEditWorkAssignModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    workAssign: CreateOrEditWorkAssignDto = new CreateOrEditWorkAssignDto();



    constructor(
        injector: Injector,
        private _workAssignsServiceProxy: WorkAssignsServiceProxy
    ) {
        super(injector);
    }

    show(workAssignId?: number): void {

        if (!workAssignId) {
            this.workAssign = new CreateOrEditWorkAssignDto();
            this.workAssign.id = workAssignId;
            this.workAssign.startDate = moment().startOf('day');
            this.workAssign.endDate = moment().startOf('day');

            this.active = true;
            this.modal.show();
        } else {
            this._workAssignsServiceProxy.getWorkAssignForEdit(workAssignId).subscribe(result => {
                this.workAssign = result.workAssign;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._workAssignsServiceProxy.createOrEdit(this.workAssign)
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
