import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { TypeHandesServiceProxy, CreateOrEditTypeHandeDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditTypeHandleModal',
    templateUrl: './create-or-edit-typeHandle-modal.component.html'
})
export class CreateOrEditTypeHandleModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    typeHande: CreateOrEditTypeHandeDto = new CreateOrEditTypeHandeDto();



    constructor(
        injector: Injector,
        private _typeHandlesServiceProxy: TypeHandesServiceProxy
    ) {
        super(injector);
    }

    show(typeHandeId?: number): void {

        if (!typeHandeId) {
            this.typeHande = new CreateOrEditTypeHandeDto();
            this.typeHande.id = typeHandeId;

            this.active = true;
            this.modal.show();
        } else {
            this._typeHandlesServiceProxy.getTypeHandeForEdit(typeHandeId).subscribe(result => {
                this.typeHande = result.typeHande;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._typeHandlesServiceProxy.createOrEdit(this.typeHande)
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
