import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetComm_Book_ValueForViewDto, Comm_Book_ValueDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewComm_Book_ValueModal',
    templateUrl: './view-comm_Book_Value-modal.component.html'
})
export class ViewComm_Book_ValueModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetComm_Book_ValueForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetComm_Book_ValueForViewDto();
        this.item.comm_Book_Value = new Comm_Book_ValueDto();
    }

    show(item: GetComm_Book_ValueForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
