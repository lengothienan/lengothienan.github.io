import { Component, ViewChild, Injector, Output, EventEmitter, Input} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { DynamicDatasourceServiceProxy, CreateOrEditDynamicDatasourceDto, MenuDto, MenusServiceProxy, DynamicFieldsServiceProxy, DynamicFieldDto, StoreDatasourceDto, HardDatasourceGroupsServiceProxy, StoreDatasourcesServiceProxy, CommandDatasourcesServiceProxy, CommandDatasourceDto, HardDatasourceGroupDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';

interface TypeDatasource{
    id: number,
    name: string
}
@Component({
    selector: 'createOrEditDynamicDatasourceModal',
    templateUrl: './create-or-edit-dynamicDatasource-modal.component.html'
})

export class CreateOrEditDynamicDatasourceModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    menus: MenuDto[] = [];
    storeDatasource: any = [];
    commandDatasource: any = [];
    hardDatasourceGroup: any = [];
    dynamicDatasource: CreateOrEditDynamicDatasourceDto = new CreateOrEditDynamicDatasourceDto();
    dynamicField: DynamicFieldDto[] = [];
    selectedRow: DynamicFieldDto = new DynamicFieldDto();
    typeDatasource: TypeDatasource[] = [{id: Number(1), name: 'DataSource cứng'}, {id: Number(2), name: 'DataSource theo Store'}, {id: Number(3), name: 'DataSource theo lệnh'}];
    //dataSource = [{id: 1, name: 'DataSource cứng'}, {id: 2, name: 'DataSource theo Store'}, {id: 3, name: 'DataSource theo lệnh'}];
    typeSelected: number;
    datasourceByType: any = [];
    typeVal: any;
    datasourceVal: any;
    dynamicFieldVal: any;
    constructor(
        injector: Injector,
        private _menusServiceProxy: MenusServiceProxy,
        private _dynamicField: DynamicFieldsServiceProxy,
        private _hardDatasourceGroup: HardDatasourceGroupsServiceProxy,
        private _storeDatasource: StoreDatasourcesServiceProxy,
        private _commandDatasource: CommandDatasourcesServiceProxy,
        private _dynamicDatasourceServiceProxy: DynamicDatasourceServiceProxy
    ) {
        super(injector);
        this._dynamicField.getCbbField(undefined).subscribe((res) => {
            this.dynamicField = res;
        });
        this._hardDatasourceGroup.getAllHardDatasourceGroup().subscribe((res) => {
            this.hardDatasourceGroup = res.map(x => {
                return<TypeDatasource>{id: x.id, name: x.code + ' - ' + x.description
            }});
        });
        this._storeDatasource.getAllStoreDatasource().subscribe((res) => {
            this.storeDatasource = res.map(x => {
                return<TypeDatasource>{id: x.id, name: x.nameStore
            }});
        });
        this._commandDatasource.getAllCommandDatasource().subscribe((res) => {
            this.commandDatasource = res.map(x => {
                return<TypeDatasource>{id: x.id, name: x.command
            }});
        });
    }

    onTypeChange(){
        switch(Number(this.dynamicDatasource.type)){
            case 1: 
                this.datasourceByType = this.hardDatasourceGroup;
                break;
            case 2:
                this.datasourceByType = this.storeDatasource;
                break;
            case 3:
                this.datasourceByType = this.commandDatasource;
                break;
            default:
                this.datasourceByType.length = 0;
        }
    }

    getDatasourceSelect(){

    }

    getSelectedRow(){
        this.dynamicDatasource.objectId = this.selectedRow.moduleId;
        this.dynamicDatasource.dynamicFieldId = this.selectedRow.id;
    }

    show(dynamicDatasourceId?: number): void {
        // console.log(dynamicDatasourceId)
        if (!dynamicDatasourceId) {
            this.dynamicDatasource = new CreateOrEditDynamicDatasourceDto();
            this.dynamicDatasource.id = dynamicDatasourceId;
            this.dynamicDatasource.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._dynamicDatasourceServiceProxy.getDynamicDatasourceForEdit(dynamicDatasourceId).subscribe(result => {
                this.dynamicDatasource = result.dynamicDatasource;

                //gọi hàm này để bind vào cbb datasource
                this.onTypeChange();
                //binding vào thẻ select option
                this.selectedRow = this.dynamicField.find(x => x.id == this.dynamicDatasource.dynamicFieldId);
                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;

            this._dynamicDatasourceServiceProxy.createOrEdit(this.dynamicDatasource)
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
