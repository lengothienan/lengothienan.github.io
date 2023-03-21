import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetCA_OutDocumentHandlingDetailForViewDto, CA_OutDocumentHandlingDetailDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewCA_OutDocumentHandlingDetailModal',
    templateUrl: './view-cA_OutDocumentHandlingDetail-modal.component.html'
})
export class ViewCA_OutDocumentHandlingDetailModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetCA_OutDocumentHandlingDetailForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetCA_OutDocumentHandlingDetailForViewDto();
        this.item.cA_OutDocumentHandlingDetail = new CA_OutDocumentHandlingDetailDto();
    }

    show(item: GetCA_OutDocumentHandlingDetailForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
