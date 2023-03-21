import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { DynamicCategoryRowIndexesServiceProxy, CreateOrEditDynamicCategoryRowIndexDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditDynamicCategoryRowIndexModal',
    templateUrl: './create-or-edit-dynamicCategoryRowIndex-modal.component.html'
})
export class CreateOrEditDynamicCategoryRowIndexModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    dynamicCategoryRowIndex: CreateOrEditDynamicCategoryRowIndexDto = new CreateOrEditDynamicCategoryRowIndexDto();



    constructor(
        injector: Injector,
        private _dynamicCategoryRowIndexesServiceProxy: DynamicCategoryRowIndexesServiceProxy
    ) {
        super(injector);
    }

    show(dynamicCategoryRowIndexId?: number): void {

        if (!dynamicCategoryRowIndexId) {
            this.dynamicCategoryRowIndex = new CreateOrEditDynamicCategoryRowIndexDto();
            this.dynamicCategoryRowIndex.id = dynamicCategoryRowIndexId;

            this.active = true;
            this.modal.show();
        } else {
            this._dynamicCategoryRowIndexesServiceProxy.getDynamicCategoryRowIndexForEdit(dynamicCategoryRowIndexId).subscribe(result => {
                this.dynamicCategoryRowIndex = result.dynamicCategoryRowIndex;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._dynamicCategoryRowIndexesServiceProxy.createOrEdit(this.dynamicCategoryRowIndex)
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
