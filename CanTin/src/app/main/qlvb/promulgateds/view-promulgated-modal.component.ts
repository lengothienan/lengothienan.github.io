import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetPromulgatedForViewDto, PromulgatedDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewPromulgatedModal',
    templateUrl: './view-promulgated-modal.component.html'
})
export class ViewPromulgatedModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetPromulgatedForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetPromulgatedForViewDto();
        this.item.promulgated = new PromulgatedDto();
    }

    show(item: GetPromulgatedForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
