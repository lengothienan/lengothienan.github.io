import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { LabelsServiceProxy, CreateOrEditLabelDto, LabelDto, MenusServiceProxy, MenuDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditDynamicLabel',
    templateUrl: './create-or-edit-dynamicLabel.component.html'
})
//component tạo mới danh mục động
export class CreateOrEditDynamicLabelComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    codeOptions = [];

    label: CreateOrEditLabelDto = new CreateOrEditLabelDto();
    parentOptions: LabelDto[] = [];
    menuOptions: MenuDto[] = [];

    constructor(
        injector: Injector,
        private _labelsServiceProxy: LabelsServiceProxy,
        private _menuServiceProxy: MenusServiceProxy,
        private _labelServiceProxy: LabelsServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(){
        // this._labelsServiceProxy.getAllLabels().subscribe(result => {
        //     this.parentOptions = result;
        // });
        this._menuServiceProxy.getAllMenuDto().subscribe(result => {
            this.menuOptions = result;
        });
        this._labelServiceProxy.getAllSqlConfig().subscribe((res) => {
            this.codeOptions = res;
        });
        // this._labelServiceProxy.getAllLabelForCreateOrEdit().subscribe(res => {
        //     this.parentOptions = res;
        // })
    }

    show(labelId?: number): void {

        if (!labelId) {
            this.label = new CreateOrEditLabelDto();
            this.label.id = labelId;

            this.active = true;
            this.modal.show();
        } else {
            this._labelsServiceProxy.getLabelForEdit(labelId).subscribe(result => {
                this.label = result.label;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

			
            this._labelsServiceProxy.createOrEditDynamicLabel(this.label)
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

    onMenuSelectChanged(){
        this._labelServiceProxy.getAllLabelOfTopMenu(this.label.menuId).subscribe(res => {
            this.parentOptions = res;
        });
    }
}
