import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetCommandDatasourceForViewDto, CommandDatasourceDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewCommandDatasourceModal',
    templateUrl: './view-commandDatasource-modal.component.html'
})
export class ViewCommandDatasourceModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: CommandDatasourceDto;


    constructor(
        injector: Injector
    ) {
        super(injector);
        this.item = new CommandDatasourceDto();
        // this.item.commandDatasource = new CommandDatasourceDto();
    }

    show(item: CommandDatasourceDto): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
