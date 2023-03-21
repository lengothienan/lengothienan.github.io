import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetWorkAssignForViewDto, WorkAssignDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewWorkAssignModal',
    templateUrl: './view-workAssign-modal.component.html'
})
export class ViewWorkAssignModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetWorkAssignForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetWorkAssignForViewDto();
        this.item.workAssign = new WorkAssignDto();
    }

    show(item: GetWorkAssignForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
