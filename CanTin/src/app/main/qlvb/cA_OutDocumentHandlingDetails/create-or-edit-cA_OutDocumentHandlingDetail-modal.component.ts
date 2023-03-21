import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { CA_OutDocumentHandlingDetailsServiceProxy, CreateOrEditCA_OutDocumentHandlingDetailDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditCA_OutDocumentHandlingDetailModal',
    templateUrl: './create-or-edit-cA_OutDocumentHandlingDetail-modal.component.html'
})
export class CreateOrEditCA_OutDocumentHandlingDetailModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    cA_OutDocumentHandlingDetail: CreateOrEditCA_OutDocumentHandlingDetailDto = new CreateOrEditCA_OutDocumentHandlingDetailDto();

            dateHandle: Date;
            processingDate: Date;


    constructor(
        injector: Injector,
        private _cA_OutDocumentHandlingDetailsServiceProxy: CA_OutDocumentHandlingDetailsServiceProxy
    ) {
        super(injector);
    }

    show(cA_OutDocumentHandlingDetailId?: number): void {
this.dateHandle = null;
this.processingDate = null;

        if (!cA_OutDocumentHandlingDetailId) {
            this.cA_OutDocumentHandlingDetail = new CreateOrEditCA_OutDocumentHandlingDetailDto();
            this.cA_OutDocumentHandlingDetail.id = cA_OutDocumentHandlingDetailId;

            this.active = true;
            this.modal.show();
        } else {
            this._cA_OutDocumentHandlingDetailsServiceProxy.getCA_OutDocumentHandlingDetailForEdit(cA_OutDocumentHandlingDetailId).subscribe(result => {
                this.cA_OutDocumentHandlingDetail = result.cA_OutDocumentHandlingDetail;

                if (this.cA_OutDocumentHandlingDetail.dateHandle) {
					this.dateHandle = this.cA_OutDocumentHandlingDetail.dateHandle.toDate();
                }
                if (this.cA_OutDocumentHandlingDetail.processingDate) {
					this.processingDate = this.cA_OutDocumentHandlingDetail.processingDate.toDate();
                }

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
        if (this.dateHandle) {
            if (!this.cA_OutDocumentHandlingDetail.dateHandle) {
                this.cA_OutDocumentHandlingDetail.dateHandle = moment(this.dateHandle).startOf('day');
            }
            else {
                this.cA_OutDocumentHandlingDetail.dateHandle = moment(this.dateHandle);
            }
        }
        else {
            this.cA_OutDocumentHandlingDetail.dateHandle = null;
        }
        if (this.processingDate) {
            if (!this.cA_OutDocumentHandlingDetail.processingDate) {
                this.cA_OutDocumentHandlingDetail.processingDate = moment(this.processingDate).startOf('day');
            }
            else {
                this.cA_OutDocumentHandlingDetail.processingDate = moment(this.processingDate);
            }
        }
        else {
            this.cA_OutDocumentHandlingDetail.processingDate = null;
        }
            this._cA_OutDocumentHandlingDetailsServiceProxy.createOrEdit(this.cA_OutDocumentHandlingDetail)
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
