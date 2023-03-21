import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { DocumentStatusesServiceProxy, CreateOrEditDocumentStatusDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditDocumentStatusModal',
    templateUrl: './create-or-edit-documentStatus-modal.component.html'
})
export class CreateOrEditDocumentStatusModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    documentStatus: CreateOrEditDocumentStatusDto = new CreateOrEditDocumentStatusDto();



    constructor(
        injector: Injector,
        private _documentStatusesServiceProxy: DocumentStatusesServiceProxy
    ) {
        super(injector);
    }

    show(documentStatusId?: number): void {

        if (!documentStatusId) {
            this.documentStatus = new CreateOrEditDocumentStatusDto();
            this.documentStatus.id = documentStatusId;

            this.active = true;
            this.modal.show();
        } else {
            this._documentStatusesServiceProxy.getDocumentStatusForEdit(documentStatusId).subscribe(result => {
                this.documentStatus = result.documentStatus;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._documentStatusesServiceProxy.createOrEdit(this.documentStatus)
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
