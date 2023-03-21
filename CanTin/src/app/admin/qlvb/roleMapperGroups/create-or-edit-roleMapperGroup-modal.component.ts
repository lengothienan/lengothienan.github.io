import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { RoleMapperGroupsServiceProxy, CreateOrEditRoleMapperGroupDto, OrganizationUnitServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditRoleMapperGroupModal',
    templateUrl: './create-or-edit-roleMapperGroup-modal.component.html'
})
export class CreateOrEditRoleMapperGroupModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    roleMapperGroup: CreateOrEditRoleMapperGroupDto = new CreateOrEditRoleMapperGroupDto();
    organizationUnits = [];


    constructor(
        injector: Injector,
        private _roleMapperGroupsServiceProxy: RoleMapperGroupsServiceProxy,
        private _organizationUnitServiceProxy: OrganizationUnitServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(){
        this._organizationUnitServiceProxy.getOrganizationUnits().subscribe(result => {
            this.organizationUnits = result.items;
        });
    }

    show(roleMapperGroupId?: number): void {

        if (!roleMapperGroupId) {
            this.roleMapperGroup = new CreateOrEditRoleMapperGroupDto();
            this.roleMapperGroup.id = roleMapperGroupId;

            this.active = true;
            this.modal.show();
        } else {
            this._roleMapperGroupsServiceProxy.getRoleMapperGroupForEdit(roleMapperGroupId).subscribe(result => {
                this.roleMapperGroup = result.roleMapperGroup;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._roleMapperGroupsServiceProxy.createOrEdit(this.roleMapperGroup)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }







    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
