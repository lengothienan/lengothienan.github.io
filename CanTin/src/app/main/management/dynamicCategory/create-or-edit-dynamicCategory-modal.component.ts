import { Component, ViewChild, Injector, Output, EventEmitter, Input} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { SqlConfigDetailsServiceProxy, CreateOrEditSqlConfigDetailDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as moment from 'moment';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';


@Component({
    selector: 'createOrEditDynamicCategoryModal',
    templateUrl: './create-or-edit-dynamicCategory-modal.component.html'
})
//component thêm/sửa cho danh mục động
export class CreateOrEditDynamicCategoryModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;
    @Input() labelId: number;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    rowId: number;
    sqlConfigDetail: CreateOrEditSqlConfigDetailDto = new CreateOrEditSqlConfigDetailDto();



    constructor(
        injector: Injector,
        private _sqlConfigDetailsServiceProxy: SqlConfigDetailsServiceProxy
    ) {
        super(injector);
    }

    show(rowId?: number): void {  
        
        this.rowId = rowId;

        if(!rowId){
            this.dynamicModule.loadDynamicFieldForDynamicCategory(this.labelId);           
        }
        else{
            this.dynamicModule.loadDynamicFieldForDynamicCategoryForEdit(this.labelId, rowId);
        }
        this.modal.show();
    }

    checkSaveAndNotify(event: any){
        if(event){
            this.notify.success('Lưu thành công');
            this.modalSave.emit(null);
            //đóng modal
            this.close();           
            return;
        }
        this.notify.error('Đã có lỗi xảy ra');
    }

    save(): void {
            this.saving = true;

            this.dynamicModule.saveDataForDynamicCategory(this.rowId);
            //this.close();
            this.saving = false;
            // this._sqlConfigDetailsServiceProxy.createOrEdit(this.sqlConfigDetail)
            //  .pipe(finalize(() => { this.saving = false;}))
            //  .subscribe(() => {
            //     this.notify.info(this.l('SavedSuccessfully'));
            //     this.close();
            //     this.modalSave.emit(null);
            //  });
    }







    close(): void {

        this.active = false;
        this.modal.hide();
    }
}
