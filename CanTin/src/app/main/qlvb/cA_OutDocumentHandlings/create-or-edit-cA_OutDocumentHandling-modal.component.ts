import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { CA_OutDocumentHandlingsServiceProxy, CreateOrEditCA_OutDocumentHandlingDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditCA_OutDocumentHandlingModal',
    templateUrl: './create-or-edit-cA_OutDocumentHandling-modal.component.html'
})
export class CreateOrEditCA_OutDocumentHandlingModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    cA_OutDocumentHandling: CreateOrEditCA_OutDocumentHandlingDto = new CreateOrEditCA_OutDocumentHandlingDto();

            dateHandle: Date;
            processingDate: Date;


    constructor(
        injector: Injector,
        private _cA_OutDocumentHandlingsServiceProxy: CA_OutDocumentHandlingsServiceProxy
    ) {
        super(injector);
    }

    show(cA_OutDocumentHandlingId?: number): void {
this.dateHandle = null;
this.processingDate = null;

        if (!cA_OutDocumentHandlingId) {
            this.cA_OutDocumentHandling = new CreateOrEditCA_OutDocumentHandlingDto();
            this.cA_OutDocumentHandling.id = cA_OutDocumentHandlingId;

            this.active = true;
            this.modal.show();
        } else {
            this._cA_OutDocumentHandlingsServiceProxy.getCA_OutDocumentHandlingForEdit(cA_OutDocumentHandlingId).subscribe(result => {
                this.cA_OutDocumentHandling = result.cA_OutDocumentHandling;

                if (this.cA_OutDocumentHandling.dateHandle) {
					this.dateHandle = this.cA_OutDocumentHandling.dateHandle.toDate();
                }
                if (this.cA_OutDocumentHandling.processingDate) {
					this.processingDate = this.cA_OutDocumentHandling.processingDate.toDate();
                }

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
        if (this.dateHandle) {
            if (!this.cA_OutDocumentHandling.dateHandle) {
                this.cA_OutDocumentHandling.dateHandle = moment(this.dateHandle).startOf('day');
            }
            else {
                this.cA_OutDocumentHandling.dateHandle = moment(this.dateHandle);
            }
        }
        else {
            this.cA_OutDocumentHandling.dateHandle = null;
        }
        if (this.processingDate) {
            if (!this.cA_OutDocumentHandling.processingDate) {
                this.cA_OutDocumentHandling.processingDate = moment(this.processingDate).startOf('day');
            }
            else {
                this.cA_OutDocumentHandling.processingDate = moment(this.processingDate);
            }
        }
        else {
            this.cA_OutDocumentHandling.processingDate = null;
        }
            this._cA_OutDocumentHandlingsServiceProxy.createOrEdit(this.cA_OutDocumentHandling)
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
