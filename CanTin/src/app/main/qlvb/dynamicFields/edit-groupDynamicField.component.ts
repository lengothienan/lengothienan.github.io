import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFieldsServiceProxy, DynamicFieldDto, CreateOrEditDynamicFieldDto, MenusServiceProxy, GetMenusForViewDto, MenuDto, LabelsServiceProxy, LabelDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditDynamicFieldModalComponent } from './create-or-edit-dynamicField-modal.component';
import { ViewDynamicFieldModalComponent } from './view-dynamicField-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DxDataGridComponent, DxTreeViewComponent } from 'devextreme-angular';
import { Location } from '@angular/common';
import { finalize } from 'rxjs/operators';
@Component({
    templateUrl: './edit-groupDynamicField.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class EditGroupDynamicFieldComponent extends AppComponentBase implements OnInit{
    ngOnInit(): void {
        //this._menuId = Number.parseInt(this.activateRoute.snapshot.paramMap.get('id'));
        
        this._dynamicFieldsServiceProxy.getDynamicFieldByModuleId(this._menuId, 0).subscribe((res) => {
            this.dynamicField = res;
        }, (err => {}), (() => {
            
        }));
    }

    @ViewChild('createOrEditDynamicFieldModal', { static: true }) createOrEditDynamicFieldModal: CreateOrEditDynamicFieldModalComponent;
    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
    labelName = '';
    advancedFiltersAreShown = false;
    selectedItemKeys: any[] = [];
    states = [{id: 1, name: 'Check Box'}, {id: 2, name: 'Text Box'}, {id: 3, name: 'Combobox'}, {id: 4, name: 'Date Box'}];
    dataSource: CreateOrEditDynamicFieldDto[] = [];
    labels: LabelDto[] = [];
    selectedLabel: LabelDto;
    treeBoxValue: string;
    dynamicFieldInitial: DynamicFieldDto[] = [];
    dynamicField: DynamicFieldDto[] = [];
    _menuId: number;
    _menuIdAfter: number;
    saving = false;
    //sau khi chọn một menu trong cbb mới gán vào id này
    needToMapMenu = false;
    //value.typeField == 3 || value.typeField == 1 || value.typeField == 4){ // combobox,checkbox,datebox
    constructor(
        injector: Injector,
        private _location: Location,
        private _activatedRoute: ActivatedRoute,
        private activateRoute: ActivatedRoute,
        private _labelsServiceProxy: LabelsServiceProxy,
        private _dynamicFieldsServiceProxy: DynamicFieldsServiceProxy
    ) {
        super(injector);
        this._menuId = Number.parseInt(this.activateRoute.snapshot.paramMap.get('id'));
        this._labelsServiceProxy.getAllLabelForDynamicField().subscribe(res => {
            this.labels = res;
            this.labelName = res.find(x => x.id == this._menuId).title;
        });
    }

    selectionChanged(data: any) {
        this.selectedItemKeys = data.selectedRowKeys;
    }

    back(){
        this._location.back()
    }


    //thêm một dòng rỗng
    plusClick(){
        let data = new DynamicFieldDto();
        data.moduleId = this._menuId;
        data.tableName = this.labelName;
        this.dynamicField.push(data);
    }

    checkIfObjectNull(ele: CreateOrEditDynamicFieldDto){
        //hàm thêm của dxDataGrid tự động thêm trường __KEY__ vào
        if(_.isEmpty(ele)){
            return ele;
        }
        if(ele['__KEY__'] && (ele.name || ele.nameDescription || ele.width || ele.typeField))
            return ele;
    }

    onValueChanged(data: any){
        this.selectedLabel = data.selectedItem;
        this._menuIdAfter = this.selectedLabel.id;
    }

    onEditingStart(row: any){

    }

    save(){
        this.saving = true;
        this.dynamicField = this.dynamicField.filter(x => !_.isEmpty(x));
        if(this._menuId !== this._menuIdAfter){
            this.dynamicField.map(x => {x.moduleId = this.selectedLabel.id, x.tableName = this.selectedLabel.title});
        }

        this._dynamicFieldsServiceProxy.createDynamicFieldForModule(this.dynamicField).subscribe((next)=>{
            this.message.success('Lưu thành công');
            this._dynamicFieldsServiceProxy.getDynamicFieldByModuleId(this._menuId, 0)
            .pipe(finalize(() => { this.saving = false;}))
            .subscribe((res) => {
                this.dynamicField = res;
                this.dataGrid.instance.repaint();
            }, (err => {}), (() => {
                
            }));
        }, (err)=>{
            this.message.error('Đã có lỗi xảy ra');
        });
    }

    deleteDynamicField(record: any){
        if(record.data.id){
            this._dynamicFieldsServiceProxy.delete(record.data.id).subscribe(() => {});
        }        
    }
}
