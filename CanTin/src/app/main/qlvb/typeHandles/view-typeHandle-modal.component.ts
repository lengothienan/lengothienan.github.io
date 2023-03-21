import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetTypeHandeForViewDto, TypeHandeDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewTypeHandleModal',
    templateUrl: './view-typeHandle-modal.component.html'
})
export class ViewTypeHandeModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetTypeHandeForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetTypeHandeForViewDto();
        this.item.typeHande = new TypeHandeDto();
    }

    show(item: GetTypeHandeForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
