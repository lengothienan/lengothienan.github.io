import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { GetLabelForViewDto, LabelDto, LabelsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewLabelRole',
    templateUrl: './view-label-role.component.html'
})
export class ViewLabelRoleComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    labelList = [];

    item: GetLabelForViewDto;


    constructor(
        injector: Injector,
        private labelService: LabelsServiceProxy,
    ) {
        super(injector);
        this.item = new GetLabelForViewDto();
        this.item.label = new LabelDto();
    }

    show(item: GetLabelForViewDto): void {
        debugger
        // getdata
        this.labelService.getListRoleByLabelID(item.label.id).subscribe((res: any) =>{
        // this.labelService.getListRoleByLabelID(2228).subscribe((res: any) =>{
            debugger
            if(res.code == "SUCCESS"){
                this.labelList = res.data;
                console.log(res.data);
                this.notify.success(this.l('SuccessfullyDeleted'));
            }
            else if (res.code == "ERROR"){
                this.notify.error(res.message);
            }
        })  

        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
