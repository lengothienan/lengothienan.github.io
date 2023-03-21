import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { OrgLevelsServiceProxy, CreateOrEditOrgLevelDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditOrgLevelModal',
    templateUrl: './create-or-edit-orgLevel-modal.component.html'
})
export class CreateOrEditOrgLevelModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    orgLevel: CreateOrEditOrgLevelDto = new CreateOrEditOrgLevelDto();



    constructor(
        injector: Injector,
        private _orgLevelsServiceProxy: OrgLevelsServiceProxy
    ) {
        super(injector);
    }

    show(orgLevelId?: number): void {

        if (!orgLevelId) {
            this.orgLevel = new CreateOrEditOrgLevelDto();
            this.orgLevel.id = orgLevelId;
            this.orgLevel.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._orgLevelsServiceProxy.getOrgLevelForEdit(orgLevelId).subscribe(result => {
                this.orgLevel = result.orgLevel;
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;
            this._orgLevelsServiceProxy.createOrEdit(this.orgLevel)
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
