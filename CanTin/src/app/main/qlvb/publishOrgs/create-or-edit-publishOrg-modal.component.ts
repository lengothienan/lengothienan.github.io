import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { PublishOrgsServiceProxy, CreateOrEditPublishOrgDto, OrgLevelDto, OrgLevelsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditPublishOrgModal',
    templateUrl: './create-or-edit-publishOrg-modal.component.html'
})
export class CreateOrEditPublishOrgModalComponent extends AppComponentBase implements OnInit{

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    publishOrg: CreateOrEditPublishOrgDto = new CreateOrEditPublishOrgDto();
    orgLevel: OrgLevelDto[] = [];


    constructor(
        injector: Injector,
        private _publishOrgsServiceProxy: PublishOrgsServiceProxy,
        private _orgLevelsServiceProxy: OrgLevelsServiceProxy
    ) {
        super(injector);
    }
    ngOnInit(): void {
        this.getOrgLevel();
    }
    // onValueChanged(e){
    //  this.setupidentify(e.value);   
    // }
    // setupidentify(idorglevel){
    //     this.publishOrg.identifyCode="";
    //     this.identifyCode="";
    // }
    identifyCode:string;
    show(publishOrgId?: number): void {
        if (!publishOrgId) {
            this.publishOrg = new CreateOrEditPublishOrgDto();
            this.publishOrg.id = publishOrgId;
            this.publishOrg.isActive = true;
            this.identifyCode="";
            this.active = true;
            this.modal.show();
        } else {
            this._publishOrgsServiceProxy.getPublishOrgForEdit(publishOrgId).subscribe(result => {
                this.publishOrg = result.publishOrg;
                // this.setupidentify(this.publishOrg.orgLevelId);
                this.active = true;
                this.modal.show();
            });
        }
    }

    getOrgLevel(){
        this._orgLevelsServiceProxy.getAllOrgLevel().subscribe(res => {
            this.orgLevel = res;
        });
    }

    save(): void {
            this.saving = true;
			
            this._publishOrgsServiceProxy.createOrEdit(this.publishOrg)
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
