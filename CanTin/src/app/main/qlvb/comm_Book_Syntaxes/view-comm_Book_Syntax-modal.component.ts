import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { GetComm_Book_SyntaxForViewDto, Comm_Book_SyntaxDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
    selector: 'viewComm_Book_SyntaxModal',
    templateUrl: './view-comm_Book_Syntax-modal.component.html'
})
export class ViewComm_Book_SyntaxModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetComm_Book_SyntaxForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetComm_Book_SyntaxForViewDto();
        this.item.comm_Book_Syntax = new Comm_Book_SyntaxDto();
    }

    show(item: GetComm_Book_SyntaxForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
