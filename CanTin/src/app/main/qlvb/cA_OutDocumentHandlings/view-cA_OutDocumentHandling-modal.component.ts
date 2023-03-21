import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetCA_OutDocumentHandlingForViewDto, CA_OutDocumentHandlingDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewCA_OutDocumentHandlingModal',
    templateUrl: './view-cA_OutDocumentHandling-modal.component.html'
})
export class ViewCA_OutDocumentHandlingModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetCA_OutDocumentHandlingForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetCA_OutDocumentHandlingForViewDto();
        this.item.cA_OutDocumentHandling = new CA_OutDocumentHandlingDto();
    }

    show(item: GetCA_OutDocumentHandlingForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
