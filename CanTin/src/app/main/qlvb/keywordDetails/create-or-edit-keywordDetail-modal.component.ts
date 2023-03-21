import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { KeywordDetailsServiceProxy, CreateOrEditKeywordDetailDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditKeywordDetailModal',
    templateUrl: './create-or-edit-keywordDetail-modal.component.html'
})
export class CreateOrEditKeywordDetailModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    keywordDetail: CreateOrEditKeywordDetailDto = new CreateOrEditKeywordDetailDto();



    constructor(
        injector: Injector,
        private _keywordDetailsServiceProxy: KeywordDetailsServiceProxy
    ) {
        super(injector);
    }

    show(keywordDetailId?: number): void {

        if (!keywordDetailId) {
            this.keywordDetail = new CreateOrEditKeywordDetailDto();
            this.keywordDetail.id = keywordDetailId;

            this.active = true;
            this.modal.show();
        } else {
            this._keywordDetailsServiceProxy.getKeywordDetailForEdit(keywordDetailId).subscribe(result => {
                this.keywordDetail = result.keywordDetail;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._keywordDetailsServiceProxy.createOrEdit(this.keywordDetail)
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
