import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { LabelsServiceProxy, CreateOrEditLabelDto, LabelDto, MenusServiceProxy, MenuDto, StoreDatasourcesServiceProxy, StoreDatasourceDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';


@Component({
    selector: 'createOrEditLabelModal',
    templateUrl: './create-or-edit-label-modal.component.html'
})
export class CreateOrEditLabelModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    codeOptions = [];
    color: any;
    colorData : any;

    label: CreateOrEditLabelDto = new CreateOrEditLabelDto();
    parentOptions: LabelDto[] = [];
    menuOptions: MenuDto[] = [];
    store = [];
    countType = [{id: 1, name: 'Đếm theo UserId'}, {id: 2, name: 'Đếm theo Unit Id'}, {id: 3, name: 'Đếm theo Unit Id (cấp đội, tổ)'}]
    constructor(
        injector: Injector,
        private _storeDatasourcesServiceProxy: StoreDatasourcesServiceProxy,
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
            this.store = res;
        });
    }

    onMenuSelectChanged(){
        this._labelServiceProxy.getAllLabelOfTopMenu(this.label.menuId).subscribe(res => {
            this.parentOptions = res;
        });
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
                this.color = this.label.cssIconFormat;
                debugger
                if(this.color != '' && this.color !== null){
                    this.colorData = JSON.parse(this.color);
                    this.label.cssIconFormat = this.colorData.color;
    
                }else{
                    this.label.cssIconFormat = '#8f999e'
                }
                this.onMenuSelectChanged();
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;
            this.label.cssIconFormat = '{ "color" : "' + this.label.cssIconFormat +'" }';
            this._labelsServiceProxy.createOrEdit(this.label)
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
