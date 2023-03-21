import { Component, Injector, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelsServiceProxy, LabelDto, MenuDto, CreateOrEditLabelDto, MenusServiceProxy, GetLabelForViewDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditLabelModalComponent } from '../labels/create-or-edit-label-modal.component';
import { ViewLabelModalComponent } from '../labels/view-label-modal.component';
import { ViewLabelRoleComponent } from '../labels/view-label-role.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { CreateOrEditDynamicLabelComponent } from '../labels/create-or-edit-dynamicLabel.component';
import { CreateOrEditLabelFromHardDatasourceComponent } from '../labels/create-or-edit-labelFromHardDatasource.component';
import { TreeNode } from 'primeng/api';

@Component({
    templateUrl: './labels.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class LabelsNewComponent extends AppComponentBase {
    @ViewChild('createOrEditLabelFromHardDatasource', { static: true }) createOrEditLabelFromHardDatasource: CreateOrEditLabelFromHardDatasourceComponent;
    @ViewChild('createOrEditDynamicLabel', { static: true }) createOrEditDynamicLabel: CreateOrEditDynamicLabelComponent;
    @ViewChild('createOrEditLabelModal', { static: true }) createOrEditLabelModal: CreateOrEditLabelModalComponent;
    @ViewChild('viewLabelModalComponent', { static: true }) viewLabelModal: ViewLabelModalComponent;
    @ViewChild('viewLabelRoleComponent', { static: true }) viewLabelRole: ViewLabelModalComponent;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @Output() onClick = new EventEmitter();
    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    titleFilter = '';
    descriptionFilter = '';
    iconFilter = '';
    linkFilter = '';
    maxParentFilter : number;
		maxParentFilterEmpty : number;
		minParentFilter : number;
		minParentFilterEmpty : number;
    maxIndexFilter : number;
		maxIndexFilterEmpty : number;
		minIndexFilter : number;
		minIndexFilterEmpty : number;
    requiredPermissionNameFilter = '';
    sqlStringFilter = '';

    menuOptions: MenuDto[] = [];
    label: CreateOrEditLabelDto = new CreateOrEditLabelDto();
    parentOptions: LabelDto[] = [];
    treeNodeData : TreeNode[];
    treeData :GetLabelForViewDto[] = [];
    dataTemp : [];
    frozenCols: any[];
    treeIndex : any;


    constructor(
        injector: Injector,
        private _labelsServiceProxy: LabelsServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _menuServiceProxy: MenusServiceProxy,
        private router: Router
    ) {
        super(injector);
    }
    ngOnInit(){
        const self = this;
        this.treeIndex = 0;
        this.frozenCols = [
            { field: 'name', header: 'Name' }
        ];
        this._menuServiceProxy.getAllMenuDto().subscribe(result => {
            this.menuOptions = result;
            debugger
            this._labelsServiceProxy.getAll(
                this.filterText,
                this.nameFilter,
                this.titleFilter,
                this.descriptionFilter,
                this.iconFilter,
                this.linkFilter,
                this.maxParentFilter == null ? this.maxParentFilterEmpty: this.maxParentFilter,
                this.minParentFilter == null ? this.minParentFilterEmpty: this.minParentFilter,
                this.maxIndexFilter == null ? this.maxIndexFilterEmpty: this.maxIndexFilter,
                this.minIndexFilter == null ? this.minIndexFilterEmpty: this.minIndexFilter,
                this.requiredPermissionNameFilter,
                this.sqlStringFilter,
                undefined,
                undefined,
                undefined,
                undefined,
                1000
                // "50",50,50
                // this.primengTableHelper.getSorting(this.dataTable),
                // this.primengTableHelper.getSkipCount(this.paginator, event),
                // this.primengTableHelper.getMaxResultCount(this.paginator, event)
            ).subscribe(result => {
                debugger
                for(var i = 0; i < result.items.length; i++){
                    var temp = self.menuOptions.find(x => x.id == result.items[i].label.menuId);
                    if(temp != null || temp != undefined){
                        result.items[i].label.menuName = temp.name;
                        
                    }
                }
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                console.log(result.items);

                // this.treeNodeData.push(<TreeNode> result.items[0].label)
                // console.log(this.treeNodeData);
                this.primengTableHelper.hideLoadingIndicator();
                const data = result.items;
                this.treeData = result.items;
                this.getDataByParentId(this.treeData, 0);
                console.log(this.getDataByParentId(this.treeData, 0));
                this.treeData = result.items;
                this.treeData = result.items;
                this.getDataByParentId(this.treeData, 0);
                this.dataTemp = this.getDataByParentId(this.treeData, 0);
                console.log(this.getDataByParentId(this.treeData, 0));
                this.treeIndex++;
            });
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    createLabel(): void {
        this.createOrEditLabelModal.show();
    }

    createDynamicLabel(): void {
        this.createOrEditDynamicLabel.show();
    }

    createLabelFromHardDatasource(): void {
        this.createOrEditLabelFromHardDatasource.show();
    }

    deleteLabel(label: LabelDto): void {
        this.message.confirm(
            '', this.l('Are You Sure?'),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._labelsServiceProxy.delete(label.id)
                        .subscribe(() => {
                            this.reloadPage();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }

    navigateToDynamicModule(){
        this.router.navigate(['/app/main/qlvb/dynamicFields/create']);
    }
	// trieuvnh - 090920 - search menu, parent
    onMenuSelectChanged(){
        if(!this.label.menuId){
            return 0;
        }else{
            this._labelsServiceProxy.getAllLabelOfTopMenu(this.label.menuId).subscribe(res => {
                this.parentOptions = res;
                this.label.parent = -1;
            });
        }
        
    }

    search(){
        debugger
        // this.treeIndex = 0;
        if(!this.label.menuId){
            return 0;
        }
        if(!this.label.parent){
            return 0;
        }

        console.log(this.label);
        const self = this;
            
            this.primengTableHelper.showLoadingIndicator();
            this._labelsServiceProxy.getAll(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
               
                self.label.menuId.toString() == "-1" ? undefined : self.label.menuId,
                undefined,
                
                undefined,
                undefined,
                1000
                
            ).subscribe(result => {
                for(var i = 0; i < result.items.length; i++){
                    var temp = self.menuOptions.find(x => x.id == result.items[i].label.menuId);
                    if(temp != null || temp != undefined){
                        result.items[i].label.menuName = temp.name;
                    }
                }
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                console.log(result.items);
                this.primengTableHelper.hideLoadingIndicator();
                this.treeData = result.items;
                this.treeData = result.items;
                this.getDataByParentId(this.treeData, null);
                this.dataTemp = this.getDataByParentId(this.treeData, null);
                console.log(this.getDataByParentId(this.treeData, null));
                this.treeIndex++;
                for(var i =0; i< this.dataTemp.length; i++){
                    console.log(this.dataTemp[i]);
                }
            });
    }
    getDataByParentId(data, parent) {
        debugger
        var result = [];
        if(parent == null || parent == ''){
            result = data
          .filter(d => d.label.parent === null || d.label.parent === 0);
        }else{
            result = data
          .filter(d => d.label.parent === parent);
        }
        // const result = data
        //   .filter(d => d.label.parent === parent);
  
        if (!result && !result.length) {
          return null;
        }
        debugger
        this.treeIndex++;
        return result.map(({ label }) => 
          ({ data : {label, 'treeIndex' :this.treeIndex }  , children: this.getDataByParentId(data, label.id) }))
      }
}