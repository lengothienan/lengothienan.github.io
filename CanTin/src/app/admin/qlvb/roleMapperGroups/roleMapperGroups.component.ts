import { DxTreeViewComponent, DxTreeListComponent, DxDataGridComponent } from 'devextreme-angular';
import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoleMapperGroupsServiceProxy, RoleMapperGroupDto, OrganizationUnitServiceProxy, RoleServiceProxy, MenusServiceProxy, LabelsServiceProxy, RoleMapperGroupDataDto, CloneRoleMapperGroupDto, LabelOrder } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditRoleMapperGroupModalComponent } from './create-or-edit-roleMapperGroup-modal.component';
import { ViewRoleMapperGroupModalComponent } from './view-roleMapperGroup-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    templateUrl: './roleMapperGroups.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class RoleMapperGroupsComponent extends AppComponentBase {

    @ViewChild('createOrEditRoleMapperGroupModal', { static: true }) createOrEditRoleMapperGroupModal: CreateOrEditRoleMapperGroupModalComponent;
    @ViewChild('viewRoleMapperGroupModalComponent', { static: true }) viewRoleMapperGroupModal: ViewRoleMapperGroupModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('dataGrid', { static: true }) dataGrid: DxDataGridComponent;

    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    descriptionFilter = '';
    maxOrgIdFilter : number;
		maxOrgIdFilterEmpty : number;
		minOrgIdFilter : number;
		minOrgIdFilterEmpty : number;

    popup_Visible = false;
    clonePopUp_Visible = false;
    formData: any;
    organizationUnitOptions = [];
    roleOptions = [];
    menuOptions = [];
    labelList = [];
    isVisible = false;
    isVisible2 = false;
    popUpHeight = 290;
    popUpWidth = 600;

    selectedRoleMapperGroupId = 0;
    selectedOrgId: number;
                    
    formDataClone: CloneRoleMapperGroupDto = new CloneRoleMapperGroupDto();

    constructor(
        injector: Injector,
        private _roleMapperGroupsServiceProxy: RoleMapperGroupsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _organizationUnitServiceProxy: OrganizationUnitServiceProxy,
        private _roleServiceProxy: RoleServiceProxy,
        private _menuServiceProxy: MenusServiceProxy,
        private _labelServiceProxy: LabelsServiceProxy
    ) {
        super(injector);
    }

    getRoleMapperGroups(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._roleMapperGroupsServiceProxy.getAll(
            this.filterText,
            this.nameFilter,
            this.descriptionFilter,
            this.maxOrgIdFilter == null ? this.maxOrgIdFilterEmpty: this.maxOrgIdFilter,
            this.minOrgIdFilter == null ? this.minOrgIdFilterEmpty: this.minOrgIdFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });

        

    }

    ngOnInit(){
        this._organizationUnitServiceProxy.getOrganizationUnits().subscribe(result => {
            this.organizationUnitOptions = result.items;
        });
        this._roleServiceProxy.getAllRoles().subscribe((res) => {
            this.roleOptions = res;
        });
        this._menuServiceProxy.getAllTopMenuForConfig().subscribe(result => {
            this.menuOptions = result;
            for(var i =0; i < this.menuOptions.length; i++){
                this.menuOptions[i].icon = "";
            }
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createRoleMapperGroup(): void {
        this.createOrEditRoleMapperGroupModal.show();
    }

    deleteRoleMapperGroup(roleMapperGroup: RoleMapperGroupDto): void {
        this.message.confirm(
            '',
            this.l('AreYouSure'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._roleMapperGroupsServiceProxy.delete(roleMapperGroup.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    exportToExcel(): void {
        this._roleMapperGroupsServiceProxy.getRoleMapperGroupsToExcel(
        this.filterText,
            this.nameFilter,
            this.descriptionFilter,
            this.maxOrgIdFilter == null ? this.maxOrgIdFilterEmpty: this.maxOrgIdFilter,
            this.minOrgIdFilter == null ? this.minOrgIdFilterEmpty: this.minOrgIdFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }

    // cấu hình
    configRoleMapperGroup(e: any){
        
        this.selectedRoleMapperGroupId = e.id;
        this.selectedOrgId = e.orgId;
        this.formData.roleId = null;
        this.formData.menuId = null;
        this.labelList.length = 0;
        this.popUpHeight = 290;
        this.popup_Visible = true;
    }

    okClick(){
        const that = this;
        if(this.formData.roleId !== null && this.formData.menuId !== null)
        {
            this._roleMapperGroupsServiceProxy.getListRoleMapperInGroup(this.selectedRoleMapperGroupId, this.formData.roleId, this.formData.menuId).subscribe(result => {
                console.log(result);
                this._labelServiceProxy.getListLabelByMenuId(this.formData.menuId).subscribe(res =>{
                    for(let i = 0, len = res.length; i < len; i++){
                        let x = result.find(x => x.labelId == res[i].id);
                        if(x){
                            res[i]["display"] = true;
                            res[i]["order"]= x.order;
                        }
                        else {
                            res[i]["display"] = false;
                        }
                    }
                    this.labelList = res;
                    console.log(this.labelList);
                    this.labelList.sort(function(a, b) {
                        if(a.display == b.display && a.display == true){
                            return a.order - b.order;
                        }
                        return b.display - a.display;
                    })

                    // for(var i = 0; i < this.labelList.length; i++){
                    //     this.labelList[i].title = this.labelList[i].title + ' - ' + this.labelList[i].id + ' - '+this.labelList[i].parent;
                    // }
                    this.labelList = this.assemble(this.labelList);
                    console.log(this.labelList);
                    that.dataGrid.instance.repaint();
                });
                
            });
            this.isVisible = true;
            this.popUpHeight = 800;
            this.popUpWidth = 1000;
        }
        
    }

    onCheckBoxChanged(e, cell){
        let index = this.labelList.findIndex(x => x.id == cell.data.id);
        this.labelList[index].display = e.value;
    }

    onNumberBoxChanged(e, cell){
        let index = this.labelList.findIndex(x => x.id == cell.data.id);
        this.labelList[index].order = e.value;
    }

    saveClick(){
        let selectedItems = this.labelList.filter(x => {
            return x.display == true;
        });
        let dto = new RoleMapperGroupDataDto();
        dto.menuId = this.formData.menuId;
        dto.roleId = this.formData.roleId;
        dto.roleMapperGroupId = this.selectedRoleMapperGroupId;
        dto.unitId = this.formData.organizationUnitId;
        let labels: LabelOrder[] = [];
        for(let i = 0, len = selectedItems.length; i < len; i++){
            let temp = new LabelOrder();
            console.log()
            temp.labelId = selectedItems[i].id;
            temp.order = selectedItems[i].order;
            labels.push(temp);
        }
        dto.labels = labels;
        this._roleMapperGroupsServiceProxy.saveRoleMapperGroup(dto).subscribe(() => {
            this.popup_Visible = false;
        });
    }

    cloneRoleMapperGroup(e: any){
        this.selectedRoleMapperGroupId = e.id;
        this.clonePopUp_Visible = true;
    }
    cloneSaveClick(){
        console.log(this.formDataClone);
        this.formDataClone.roleMapperGroupId = this.selectedRoleMapperGroupId;
        this._roleMapperGroupsServiceProxy.cloneFromRoleMapperGroup(this.formDataClone).subscribe(() => {
            this.clonePopUp_Visible = false;
            this.getRoleMapperGroups();
        });
    }

    assemble(arr, parentId = 0, results = [], level = 1) {
		arr.forEach(el => {
            debugger
		  if (el.parent === parentId) {
              var space = " ";
              for(var i = 1; i < level ; i++){
                  space += "                ";
                //el.title =  "\\t"+ el.title;
              }
            el.title = space + el.title;
            el.level = level;
			results.push(el);
			this.assemble(arr, el.id, results, level+1);
		  }
		})
		return results;
    }
      
    priceColumn_customizeText (cellInfo) {
        return ".                 " + cellInfo.value + "ádasdsdadasdasdas";
    }
}
