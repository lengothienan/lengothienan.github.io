import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetRoleMapperGroupForViewDto, RoleMapperGroupDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewRoleMapperGroupModal',
    templateUrl: './view-roleMapperGroup-modal.component.html'
})
export class ViewRoleMapperGroupModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetRoleMapperGroupForViewDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new GetRoleMapperGroupForViewDto();
        this.item.roleMapperGroup = new RoleMapperGroupDto();
    }

    show(item: GetRoleMapperGroupForViewDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
