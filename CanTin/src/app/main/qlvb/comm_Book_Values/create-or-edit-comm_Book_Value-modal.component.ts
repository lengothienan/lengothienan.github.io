import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { Comm_Book_ValuesServiceProxy, CreateOrEditComm_Book_ValueDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditComm_Book_ValueModal',
    templateUrl: './create-or-edit-comm_Book_Value-modal.component.html'
})
export class CreateOrEditComm_Book_ValueModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    comm_Book_Value: CreateOrEditComm_Book_ValueDto = new CreateOrEditComm_Book_ValueDto();



    constructor(
        injector: Injector,
        private _comm_Book_ValuesServiceProxy: Comm_Book_ValuesServiceProxy
    ) {
        super(injector);
    }

    show(comm_Book_ValueId?: number): void {

        if (!comm_Book_ValueId) {
            this.comm_Book_Value = new CreateOrEditComm_Book_ValueDto();
            this.comm_Book_Value.id = comm_Book_ValueId;

            this.active = true;
            this.modal.show();
        } else {
            this._comm_Book_ValuesServiceProxy.getComm_Book_ValueForEdit(comm_Book_ValueId).subscribe(result => {
                this.comm_Book_Value = result.comm_Book_Value;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;
            this._comm_Book_ValuesServiceProxy.createOrEdit(this.comm_Book_Value)
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
