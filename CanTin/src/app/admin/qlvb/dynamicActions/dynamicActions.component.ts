import { Component, Injector, ViewEncapsulation, ViewChild, OnInit, Input } from '@angular/core';
import { DynamicFieldsServiceProxy, RoleServiceProxy ,TenantServiceProxy   , LabelsServiceProxy, LabelDto, DynamicActionsServiceProxy, TenantListDto, RoleListDto, CreateOrEditDynamicActionDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';

import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DxDataGridComponent, DxTreeViewComponent,DxTagBoxComponent ,DxLookupModule ,DxPopupModule } from 'devextreme-angular';

@Component({
    selector: 'dynammicAction',
    templateUrl: './dynamicActions.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class DynamicActionsComponent extends AppComponentBase {

    // @ViewChild('createOrEditDynamicFieldModal', { static: true }) createOrEditDynamicFieldModal: CreateOrEditDynamicFieldModalComponent;
    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
    @Input() labelId: number;
    advancedFiltersAreShown = false;
    selectedItemKeys: any[] = [];
    states = [{id: 1, name: 'Check Box'}, {id: 2, name: 'Text Box'}, {id: 3, name: 'Combobox'}, {id: 4, name: 'Date Box'}];
    dataSource: CreateOrEditDynamicActionDto[] = [];
    labels: LabelDto[] = [];
    selectedLabel: LabelDto;
    labelID: any;
    cellTemplate : any ; 
    selectedRole: RoleListDto;
    selectedTenant: TenantListDto;
    treeBoxValue: string;
    roleid: any ; 
    _items : any;
    tenantid: any ; 
    tenants: TenantListDto [] = [];
    selectedItems: any[] = [];
    roles: RoleListDto [] = [];
    data1 :string ;
    data :any [] = [] ;
    data_hasTransfer = {
        store: {
            type: 'array',
            data: [
                { id: 1, name: 'Chuyển cho ban giám đốc', hasTransfer :'/app/main/qlvb/transfer-handle-director' },
                { id: 2, name: 'Chuyển cho lãnh đạo ' ,hasTransfer :'/app/main/qlvb/transfer-handle-department' },
                // { id: 3, name: 'Chuyển cho đội' ,hasTransfer :'/app/main/qlvb/team' },
                { id: 4, name: 'Không chọn màn hình' ,hasTransfer :'' }
              
                // ...
            ],
            key: "id"
        },
        pageSize: 10,
        paginate: true
    };

    data_position = {
        store: {
            type: 'array',
            data: [
                { id: 1,  position: 'Top Left'  },
                { id: 2,  position: 'Top Right' },
                { id: 3, position: 'Bottom Left'  }, 
                { id: 4,  position: 'Bottom Right'}
                // ...
            ],
            key: "id"
        },
        pageSize: 10,
        paginate: true
    };

    data_celltemplte = {
        store: {
            type: 'array',
            data: [
                { id: 1,  celltemplte: 'Xem'  },
                { id: 2,  celltemplte: 'Vào sổ'},
                { id: 3,  celltemplte: 'Xóa' }, 
                { id: 4,  celltemplte: 'Sửa' },
                { id: 5,  celltemplte: 'Chuyển' },
                { id: 6,  celltemplte: 'Trình trưởng phòng' },
                { id: 7,  celltemplte: 'Chuyển phó giám đốc' },
                { id: 8,  celltemplte: 'Chuyển phòng' },
                { id: 9,  celltemplte: 'Thu hồi' },
                { id: 10, celltemplte: 'Chuyển bổ sung phó giám đốc' },
                { id: 11, celltemplte: 'Chuyển bổ sung phòng' },
                { id: 12, celltemplte: 'Chuyển phó phòng' },
                { id: 13, celltemplte: 'Chuyển đội' },
                { id: 14, celltemplte: 'Chuyển bổ sung phó phòng' },
                { id: 15, celltemplte: 'Chuyển bổ sung đội' },
                { id: 16, celltemplte: 'Chuyển đội phó' },
                { id: 17, celltemplte: 'Chuyển tổ' },
                { id: 18, celltemplte: 'Chuyển bổ sung đội phó' },
                { id: 19, celltemplte: 'Chuyển bổ sung tổ' },
                { id: 20, celltemplte: 'Chuyển Cán bộ chiến sĩ' },
                { id: 21, celltemplte: 'Chuyển bổ sung cán bộ chiến sĩ' },
                { id: 22, celltemplte: 'Lưu văn bản'},
                { id: 23, celltemplte: 'Báo cáo'},
                { id: 24, celltemplte: 'Dự thảo văn bản đi' },
                { id: 25, celltemplte: 'Trình BGĐ' },
                { id: 26, celltemplte: 'Cập nhật KQGQ' },
                { id: 27, celltemplte: 'Sửa (bổ sung)' }
            ],
            key: "id"
        },
        pageSize: 10,
        paginate: true
    };

    dynamicActionData: CreateOrEditDynamicActionDto[] = [];

    oldData: any[] = [];
    //value.typeField == 3 || value.typeField == 1 || value.typeField == 4){ // combobox,checkbox,datebox
    constructor(
        injector: Injector,
     
        private _labelsServiceProxy: LabelsServiceProxy,
        private _roleServiceProxy: RoleServiceProxy,
        private _tenantServiceProxy: TenantServiceProxy,
        private _dynamicActionServiceProxy: DynamicActionsServiceProxy
    ) {
        super(injector);
        this._labelsServiceProxy.getAllForRoleMapper().subscribe(res => {
            this.labels = res;
        });
        this._roleServiceProxy.getAllRoles().subscribe(res => {
            this.roles = res;
        });
        this._tenantServiceProxy.getAllTenant().subscribe(res => {
            this.tenants = res;
        });

    }
    ngOnInit(){
        // this.goToComponentB();
    }
    // goToComponentB(): void {
    //     this._roleServiceProxy.data_labelId = this.labelId;

    //     console.log(this._roleServiceProxy.data_labelId);
       
    // }

    selectionChanged(data: any) {
        this.selectedItemKeys = data.selectedRowKeys;
    }

    //thêm một dòng rỗng
    plusClick(){
        this.dataSource.push(new CreateOrEditDynamicActionDto());
    }

    // checkIfObjectNull(ele: CreateOrEditDynamicActionDto){
    //     //hàm thêm của dxDataGrid tự động thêm trường __KEY__ vào
    //     if(_.isEmpty(ele)){
    //         return ele;
    //     }
    //     if(ele['__KEY__'] && (ele.name || ele.nameDescription || ele.width || ele.typeField))
    //         return ele;
    // }

    // onValueChanged(data: any){
    //     this.selectedMenu = data.selectedItem;
    //     this.dataSource = [];
    //     // this._dynamicActionServiceProxy.getDynamicActionByLabelId(this.selectedMenu.id , this.tenantid,this.roleid).subscribe(res => {
    //         this._dynamicActionServiceProxy.getDynamicActionByLabelId(this.selectedMenu.id ).subscribe(res => {
    //     if(res == null){
    //             this.plusClick();
    //         }
    //         else{
    //             this.dataSource.push(res);
    //             // this.dataGrid.dataSource = data;
    //         }
    //     });
    // }
    addItem( ) {
        this._items = this.labelId ; 
    }

    getItems() {
        return this._items;
        
    }
    onValueChangedcell(data:any)
    {
        this.cellTemplate = data.selectedItem ;
    }
    onValueChangedLabel(data:any)
    {
        
        this.labelId= data.selectedItem.id ; 

    }
    onValueChangedRole(data:any)
    {
     
        this.roleid = data.selectedItem.id ; 

    }
    onValueChangedTenant(data:any)
    {
       
        this.selectedTenant = data.selectedItem ; 
    }
       
    okClick(e: any){
       
        let data = [];
      
        if(this.selectedTenant != undefined || this.selectedTenant != null){
            this._dynamicActionServiceProxy.getAllDynamicActionByLabelId(this.labelId,this.roleid,null).subscribe(result =>{
                if(result == null){
                    this.dataSource.push(new CreateOrEditDynamicActionDto());
                }
                else{
                    this.dataSource.push(result);
                    this.dataGrid.dataSource = data;
                }
            });

        }
        else{
            this._dynamicActionServiceProxy.getAllDynamicActionByLabelId(this.labelId,this.roleid,0).subscribe(result =>{
          
                if(result == null){
                  
                    this.dataSource.push(new CreateOrEditDynamicActionDto());
                }
                else{
                    this.dataSource.push(result);
                    this.dataGrid.dataSource = data;
                }
            });
        }
        
    }

    save(){
        if( this.labelId == null || this.roleid == null){
            this.message.warn('Bạn chưa chọn Module');
            return;
        }
     
        //loại bỏ những dòng trống       
        // this.dataSource = this.dataSource.filter(x => !_.isEmpty(x));

        this.dataSource[0].labelId = this.labelId;
        this.dataSource[0].roleId = this.roleid;
        this.dataSource[0].cellTemplate =  this.selectedItems.map(x => x["id"]).join(',');
        if(this.selectedTenant != undefined || this.selectedTenant != null)
        {
            this.dataSource[0].tenantId = this.selectedTenant.id;
        }
        else
        {

        }
       

        // this.dataSource.map(x => {x.labelId = this.selectedMenu.id});
        // let newData = new CreateOrEditDynamicActionDtoDto();
        // newData.labelId = this.dataGrid.dataSource[0].labelId;
        // newData.isActive = true;
        // newData.hasSave = this.dataGrid.dataSource[0].hasSave;
        // newData.hasAssignWork = this.dataGrid.dataSource[0].hasAssignWork;
        // newData.hasFinish = this.dataGrid.dataSource[0].hasFinish;
        // newData.hasSaveAndTransfer = this.dataGrid.dataSource[0].hasSaveAndTransfer;
        // newData.hasTransfer = this.dataGrid.dataSource[0].hasTransfer;
        // newData.isBack = this.dataGrid.dataSource[0].isBack;
        // newData.isTopPosition = this.dataGrid.dataSource[0].isTopPosition;
        // newData.order = this.dataGrid.dataSource[0].order;
        this._dynamicActionServiceProxy.createOrEdit(this.dataGrid.dataSource[0]).subscribe((next)=>{
            this.message.success('Tạo thành công');
        }, (err)=>{
            this.message.error('Đã có lỗi xảy ra');
        });
    }
}
