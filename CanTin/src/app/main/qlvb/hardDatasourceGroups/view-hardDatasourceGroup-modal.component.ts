import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetHardDatasourceGroupForViewDto, HardDatasourceGroupDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewHardDatasourceGroupModal',
    templateUrl: './view-hardDatasourceGroup-modal.component.html'
})
export class ViewHardDatasourceGroupModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetHardDatasourceGroupForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetHardDatasourceGroupForViewDto();
        this.item.hardDatasourceGroup = new HardDatasourceGroupDto();
    }

    show(item: GetHardDatasourceGroupForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
