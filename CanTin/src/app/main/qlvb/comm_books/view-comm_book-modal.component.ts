import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { GetComm_bookForViewDto, Comm_bookDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'viewComm_bookModal',
    templateUrl: './view-comm_book-modal.component.html'
})
export class ViewComm_bookModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetComm_bookForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetComm_bookForViewDto();
        this.item.comm_book = new Comm_bookDto();
    }

    show(item: GetComm_bookForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
