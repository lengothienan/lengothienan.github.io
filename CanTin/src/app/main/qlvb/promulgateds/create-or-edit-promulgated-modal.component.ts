import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { PromulgatedsServiceProxy, CreateOrEditPromulgatedDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditPromulgatedModal',
    templateUrl: './create-or-edit-promulgated-modal.component.html'
})
export class CreateOrEditPromulgatedModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    promulgated: CreateOrEditPromulgatedDto = new CreateOrEditPromulgatedDto();



    constructor(
        injector: Injector,
        private _promulgatedsServiceProxy: PromulgatedsServiceProxy
    ) {
        super(injector);
    }

    show(promulgatedId?: number): void {

        if (!promulgatedId) {
            this.promulgated = new CreateOrEditPromulgatedDto();
            this.promulgated.id = promulgatedId;

            this.active = true;
            this.modal.show();
        } else {
            this._promulgatedsServiceProxy.getPromulgatedForEdit(promulgatedId).subscribe(result => {
                this.promulgated = result.promulgated;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._promulgatedsServiceProxy.createOrEdit(this.promulgated)
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
