import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { WordProcessingsServiceProxy, CreateOrEditWordProcessingDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditWordProcessingModal',
    templateUrl: './create-or-edit-wordProcessing-modal.component.html'
})
export class CreateOrEditWordProcessingModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    wordProcessing: CreateOrEditWordProcessingDto = new CreateOrEditWordProcessingDto();



    constructor(
        injector: Injector,
        private _wordProcessingsServiceProxy: WordProcessingsServiceProxy
    ) {
        super(injector);
    }

    show(wordProcessingId?: number): void {

        if (!wordProcessingId) {
            this.wordProcessing = new CreateOrEditWordProcessingDto();
            this.wordProcessing.id = wordProcessingId;

            this.active = true;
            this.modal.show();
        } else {
            this._wordProcessingsServiceProxy.getWordProcessingForEdit(wordProcessingId).subscribe(result => {
                this.wordProcessing = result.wordProcessing;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._wordProcessingsServiceProxy.createOrEdit(this.wordProcessing)
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
