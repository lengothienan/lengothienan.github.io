import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { ReceiveUnitsServiceProxy, CreateOrEditReceiveUnitDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditReceiveUnitModal',
    templateUrl: './create-or-edit-receiveUnit-modal.component.html'
})
export class CreateOrEditReceiveUnitModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    receiveUnit: CreateOrEditReceiveUnitDto = new CreateOrEditReceiveUnitDto();



    constructor(
        injector: Injector,
        private _receiveUnitsServiceProxy: ReceiveUnitsServiceProxy
    ) {
        super(injector);
    }

    show(receiveUnitId?: number): void {

        if (!receiveUnitId) {
            this.receiveUnit = new CreateOrEditReceiveUnitDto();
            this.receiveUnit.id = receiveUnitId;

            this.active = true;
            this.modal.show();
        } else {
            this._receiveUnitsServiceProxy.getReceiveUnitForEdit(receiveUnitId).subscribe(result => {
                this.receiveUnit = result.receiveUnit;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._receiveUnitsServiceProxy.createOrEdit(this.receiveUnit)
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
