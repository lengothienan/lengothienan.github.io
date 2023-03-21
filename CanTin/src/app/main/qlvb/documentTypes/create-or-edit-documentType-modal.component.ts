import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { DocumentTypesServiceProxy, CreateOrEditDocumentTypeDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditDocumentTypeModal',
    templateUrl: './create-or-edit-documentType-modal.component.html'
})
export class CreateOrEditDocumentTypeModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    documentType: CreateOrEditDocumentTypeDto = new CreateOrEditDocumentTypeDto();



    constructor(
        injector: Injector,
        private _documentTypesServiceProxy: DocumentTypesServiceProxy
    ) {
        super(injector);
    }

    show(documentTypeId?: number): void {

        if (!documentTypeId) {
            this.documentType = new CreateOrEditDocumentTypeDto();
            this.documentType.id = documentTypeId;

            this.active = true;
            this.modal.show();
        } else {
            this._documentTypesServiceProxy.getDocumentTypeForEdit(documentTypeId).subscribe(result => {
                this.documentType = result.documentType;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._documentTypesServiceProxy.createOrEdit(this.documentType)
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
