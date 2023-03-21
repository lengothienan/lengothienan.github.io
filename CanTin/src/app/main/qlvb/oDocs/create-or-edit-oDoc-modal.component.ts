import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { ODocsServiceProxy, CreateOrEditODocDto, SessionServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditODocModal',
    templateUrl: './create-or-edit-oDoc-modal.component.html'
})
export class CreateOrEditODocModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    currentUser:any;
    oDoc: CreateOrEditODocDto = new CreateOrEditODocDto();



    constructor(
        injector: Injector,
        private _oDocsServiceProxy: ODocsServiceProxy
    ) {
        super(injector);
    }

    show(oDocId?: number): void {

        if (!oDocId) {
            this.oDoc = new CreateOrEditODocDto();
            this.oDoc.id = oDocId;
            this.oDoc.publishDate = moment().startOf('day');

            this.active = true;
            this.modal.show();
        } else {
            this._oDocsServiceProxy.getODocForEdit(oDocId).subscribe(result => {
                this.oDoc = result;


                this.active = true;
                this.modal.show();
            });
            this.currentUser = abp.session.userId;
            console.log(this.currentUser)
            this._oDocsServiceProxy.updateSeenStatus(oDocId,this.currentUser).subscribe()
        }
    }

    save(): void {
            this.saving = true;

			
            this._oDocsServiceProxy.createOrEdit(this.oDoc)
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
