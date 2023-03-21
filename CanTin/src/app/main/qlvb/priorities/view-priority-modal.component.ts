import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetPriorityForViewDto, PriorityDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewPriorityModal',
    templateUrl: './view-priority-modal.component.html'
})
export class ViewPriorityModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetPriorityForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetPriorityForViewDto();
        this.item.priority = new PriorityDto();
    }

    show(item: GetPriorityForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
