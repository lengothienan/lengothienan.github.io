import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetDocumentStatusForViewDto, DocumentStatusDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewDocumentStatusModal',
    templateUrl: './view-documentStatus-modal.component.html'
})
export class ViewDocumentStatusModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetDocumentStatusForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetDocumentStatusForViewDto();
        this.item.documentStatus = new DocumentStatusDto();
    }

    show(item: GetDocumentStatusForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
