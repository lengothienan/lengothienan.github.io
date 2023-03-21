import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetReceiveUnitForViewDto, ReceiveUnitDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewReceiveUnitModal',
    templateUrl: './view-receiveUnit-modal.component.html'
})
export class ViewReceiveUnitModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetReceiveUnitForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetReceiveUnitForViewDto();
        this.item.receiveUnit = new ReceiveUnitDto();
    }

    show(item: GetReceiveUnitForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
