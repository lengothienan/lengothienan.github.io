import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { ImpersonatesServiceProxy, CreateOrEditImpersonateDto, UserServiceProxy, OrganizationUnitServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { DxSelectBoxComponent } from 'devextreme-angular';

@Component({
    selector: 'createOrEditImpersonateModal',
    templateUrl: './create-or-edit-impersonate-modal.component.html'
})
export class CreateOrEditImpersonateModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('impersonatedSelectBox', { static: true }) impersonatedSelectBox: DxSelectBoxComponent;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    impersonate: CreateOrEditImpersonateDto = new CreateOrEditImpersonateDto();

    startDate: Date;

    listUsers = [];
    currentUser = this.appSession.user.name;
    currentDate: Date;
    organizationUnits = [];
    selectedUnitId = 0;
    impersonatedSelectedUnitId = 0;
    selectedUser: any;
    isActiveChkb = true;
    listImpersonatedUsers = [];
    currentUserId = this.appSession.userId;

    constructor(
        injector: Injector,
        private _impersonatesServiceProxy: ImpersonatesServiceProxy,
        private _userServiceProxy: UserServiceProxy,
        private _organizationUnitServiceProxy: OrganizationUnitServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(){
        // this._userServiceProxy.getUsers(
        //     "",
        //     this.permissionFilterTreeModal.getSelectedPermissions(),
        //     this.role !== '' ? parseInt(this.role) : undefined,
        //     this.onlyLockedUsers,
        //     this.primengTableHelper.getSorting(this.dataTable),
        //     this.primengTableHelper.getMaxResultCount(this.paginator, event),
        //     this.primengTableHelper.getSkipCount(this.paginator, event)
        // ).pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator())).subscribe(result => {
        //     this.primengTableHelper.totalRecordsCount = result.totalCount;
        //     this.primengTableHelper.records = result.items;
        //     this.primengTableHelper.hideLoadingIndicator();
        // });
        // console.log(this.appSession.organizationUnitId);
        this._organizationUnitServiceProxy.getOrganizationUnits().subscribe(result => {
            this.organizationUnits = result.items;
            this.selectedUnitId = this.appSession.organizationUnitId;
        });

        this.currentDate = new Date();
    }

    show(impersonateId?: number): void {
        if (!impersonateId) {
            this.impersonate = new CreateOrEditImpersonateDto();
            this.impersonate.id = impersonateId;

            this.active = true;
            this.modal.show();
        } 
        else {
            this._impersonatesServiceProxy.getImpersonateForEdit(impersonateId).subscribe(result => {
                this.impersonate = result.impersonate;
                this.selectedUnitId = result.organizationOfUser;
                this.currentUserId = result.impersonate.userId;
                this.impersonatedSelectedUnitId = result.organizationOfImpersonatedUser;
                this.selectedUser = result.impersonate.impersonateUserId;
                console.log(result)
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
        this.saving = true;
        this.impersonate.userId = this.currentUserId;
        this.impersonate.userName = this.listUsers.find(x => x.id == this.currentUserId).userName;
        this.impersonate.isActive = this.isActiveChkb;
        this.impersonate.impersonateUserId = this.selectedUser;
        this.impersonate.impersonateUserName = this.listImpersonatedUsers.find(x => x.id == this.selectedUser).userName;
        this._impersonatesServiceProxy.createOrEdit(this.impersonate)
        .pipe(finalize(() => { this.saving = false;}))
        .subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.close();
            this.modalSave.emit(null);
        });
    }

    onSelectionChanged(e: any){
        this._organizationUnitServiceProxy.getOrganizationUnitUsers(e.selectedItem.id, "", 1000, 0).subscribe(res => {
            this.listImpersonatedUsers = res.items;
            res.items.forEach(x => {
                x["fullName"] = x.surname + " " + x.name;
            });
        })
    }

    onSelectionChangedImpersonated(e: any){
        this._organizationUnitServiceProxy.getOrganizationUnitUsers(e.selectedItem.id, "", 1000, 0).subscribe(res => {
            this.listUsers = res.items;
            res.items.forEach(x => {
                x["fullName"] = x.surname + " " + x.name;
            });
        })
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
