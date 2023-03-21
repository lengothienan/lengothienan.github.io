import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { WorkDetailsServiceProxy, CreateOrEditWorkDetailDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditWorkDetailModal',
    templateUrl: './create-or-edit-workDetail-modal.component.html'
})
export class CreateOrEditWorkDetailModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    workDetail: CreateOrEditWorkDetailDto = new CreateOrEditWorkDetailDto();



    constructor(
        injector: Injector,
        private _workDetailsServiceProxy: WorkDetailsServiceProxy
    ) {
        super(injector);
    }

    show(workDetailId?: number): void {

        if (!workDetailId) {
            this.workDetail = new CreateOrEditWorkDetailDto();
            this.workDetail.id = workDetailId;
            this.workDetail.date = moment().startOf('day');

            this.active = true;
            this.modal.show();
        } else {
            this._workDetailsServiceProxy.getWorkDetailForEdit(workDetailId).subscribe(result => {
                this.workDetail = result.workDetail;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._workDetailsServiceProxy.createOrEdit(this.workDetail)
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
