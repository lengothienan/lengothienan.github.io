import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VanbansServiceProxy, VanbanDto, ThemeSettingsDto, SqlConfigsServiceProxy, SqlConfigDetailsServiceProxy, TokenAuthServiceProxy  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
// import { CreateOrEditVanbanComponent } from './create_edit_vanban/create-or-edit-vanban';
import { FileManagerModalComponent } from './file-manager-modal.component';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { DxDataGridComponent } from 'devextreme-angular';
import { DxiDataGridColumn } from 'devextreme-angular/ui/nested/base/data-grid-column-dxi';
import { SqlConfigHelperService } from '@shared/utils/sql-config-helper.service';
import DevExpress from 'devextreme';
import { Column } from 'primeng/components/common/shared';
import { DxiColumnModule, DxiColumnComponent } from 'devextreme-angular/ui/nested/devextreme-angular-ui-nested';
//import * as $ from 'JQueryStatic';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxFileUploaderModule } from 'devextreme-angular';


@Component({
    templateUrl: './vanbans.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class VanbansComponent extends AppComponentBase implements OnInit{

    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
    columnItems: any = [];
    advancedFiltersAreShown = false;
    filterText = '';
    tenCongViecFilter = '';
    maxNgayGiaoViecFilter : moment.Moment;
		minNgayGiaoViecFilter : moment.Moment;
    maxHanKetThucFilter : moment.Moment;
		minHanKetThucFilter : moment.Moment;
    nguoiXuLyFilter = '';
    maxTienDoChungFilter : number;
		maxTienDoChungFilterEmpty : number;
		minTienDoChungFilter : number;
		minTienDoChungFilterEmpty : number;
    tinhTrangFilter = '';
    noiDungFilter = '';
    dataSource: any = {};
    data = [];
    name_Arr: any[]= [];
    customDataSource: DataSource;
    allMode: string;
    checkBoxesMode: string;
    prefix = '';
    selectedRows: number[];
    selectionChangedBySelectbox: boolean;
    vanban :VanbanDto = new VanbanDto;
    columnBuilder = [];
    columnConfig = [];
    columns: any;
    _id: any ; 
    vanbanDto : any ;
    initialData = [];
    constructor(
        injector: Injector,
        private _sqlConfigHelperService: SqlConfigHelperService,
        private _sqlConfigDetailsService: SqlConfigDetailsServiceProxy,
        private _vanbansServiceProxy: VanbansServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private router : Router,
        private activatedRoute: ActivatedRoute,
        protected activeRoute: ActivatedRoute,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
        this.allMode = 'allPages';
        this.checkBoxesMode = 'onClick';
        this.selectedRows = [];
    }

     showView(id:number) 
     {
        this.router.navigate(['/app/main/qlvb/vanbans/view_detail_vanban/'+ id ]); 
        console.log(id)
      }
      showCreateOrEdit(id?:number) 
      {
          console.log(id);
          if(!id)
          {
            this.router.navigate(['/app/main/qlvb/vanbans/create_edit_vanban']); 
          }
        else
        {
            //chuyển qua url khác bằng id
            this.router.navigate(['/app/main/qlvb/vanbans/create_edit_vanban/'+ id ]); 
            //lấy id từ url

        }
       
      }
      
    //   onItemDeleted(id: number): void{
    //     this.message.confirm(
    //         '',this.l("AreYouSure"),
    //         (isConfirmed) => {
    //             if (isConfirmed) {
    //                 this._vanbansServiceProxy.delete(id)
    //                     .subscribe(() => {
    //                         this.initialData.splice(id);
                            
    //                        // this.getVanbanDxTable();
    //                         //  this.reloadPage();
    //                         //loai phan tu co Id = id ra khoi mang dataSource
    //                         // this.dataGrid.dataSource.filter()
    //                         this.notify.success(this.l('SuccessfullyDeleted'));
    //                     });
    //             }
    //         }
    //     );
        
    //   }

    ngOnInit(): void {
        this.getVanbanDxTable();
      
    }
    addMoveGiaoViec()
    {
        this.router.navigate(['/app/main/qlvb/updateProgress']);
    }
    return()
    {
        this.router.navigate(['/app/admin/hostDashboard']);
    }
    getSelectedRowKeys () {
        return this.dataGrid.instance.getSelectedRowKeys();
    }
    getSelectedRowsData () {
        this.vanbanDto =this.dataGrid.instance.getSelectedRowsData();

        console.log(this.vanbanDto);
        
    }


    filterSelected(event) {
        this.selectionChangedBySelectbox = true;

        let prefix = event.value;

        if(!prefix)
            return;
        else if(prefix === "All")
            this.selectedRows = this.dataSource.store.map(employee => employee.ID);
        else {
            this.selectedRows = this.dataSource.store.filter(employe => employe.Prefix === prefix).map(employee => employee.ID);
        }

        this.prefix = prefix;
        
    }

    selectionChangedHandler() {
        if(!this.selectionChangedBySelectbox) {
            this.prefix=null;
        }
        // console.log(this.dataGrid.instance.getSelectedRowKeys().subscribe(result => {
        //     this.vanban= result.listVanBan;
        console.log(this.dataGrid.instance.getSelectedRowKeys());
        console.log(this.selectedRows);
        this.selectionChangedBySelectbox=false;
    }

    // getVanbanDxTable() {
    //     this._vanbansServiceProxy.getAllVanBan().subscribe(result => {
    //         console.log(result);
    //         this.dataGrid.dataSource = result.listVanBan;
    //         this.dataGrid.columns = this._sqlConfigHelperService.generateColumns(result.listColumnConfig);
    //         let x = this.dataGrid.columns.filter(x => x["dataField"] == "tienDoChung");
    //         // this.dataGrid.columns.map((value, index) => {
    //         //     if(value["dataField"] == "tienDoChung"){
    //         //         value.cellTemplate == 'progressBarTemplate';
    //         //         console.log(value);
    //         //     }
                
    //         // })
    //         console.log(x);
    //         //x["cellTemplate"] = 'progressBarTemplate';
    //         console.log(this.dataGrid.columns)
    //     });
    // }





    getVanbanDxTable() {
        // if (this.primengTableHelper.shouldResetPaging(event)) {
        //     this.paginator.changePage(0);
        //     return;
        // }

        // this.primengTableHelper.showLoadingIndicator();
        this._vanbansServiceProxy.getAllVanBan().subscribe(result => {
            this.initialData = result.listData;
            this.dataGrid.dataSource = this.initialData;
            // this.name_Arr = result.listVanBan;
            console.log(this.dataGrid.dataSource);
            //console.log(JSON.parse(result.data));
            //;
            //var newCol = {caption: 'Custom Button', visible: true};
            // var newCol = {caption: 'Custom Button', visible: true, fixed: false, width: null, alignment: null};
            //var temp = new GridBaseColumn { }
            // this.dataGrid.columns.push(newCol);
            this.dataGrid.columns = this._sqlConfigHelperService.generateColumns(result.listColumnConfig, true);
        });
       
    }
  


    getVanbans(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._vanbansServiceProxy.getAll(
            this.filterText,
            this.tenCongViecFilter,
            this.maxNgayGiaoViecFilter,
            this.minNgayGiaoViecFilter,
            this.maxHanKetThucFilter,
            this.minHanKetThucFilter,
            this.nguoiXuLyFilter,
            this.maxTienDoChungFilter == null ? this.maxTienDoChungFilterEmpty: this.maxTienDoChungFilter,
            this.minTienDoChungFilter == null ? this.minTienDoChungFilterEmpty: this.minTienDoChungFilter,
            this.tinhTrangFilter,
            this.noiDungFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;           
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

   
    showScanModule = false;
    toggleScanModule() { this.showScanModule = !this.showScanModule;} 
    
    formatStatusBar(value) {
        return 'Tình trạng: ' + value * 100 + '%';
    }

    // reloadPage(): void {
    //     this.paginator.changePage(this.paginator.getPage());
    // }

    scanDocument():void {
        this.router.navigate(['/app/main/qlvb/vanbans/scan_document']);
        // window.open('/app/main/qlvb/vanbans/scan_document', '_blank');
    }
    // createVanban(): void {
       
    //     window.open('/app/main/qlvb/vanbans/create_edit_vanban', '_blank');
    // }
    addNewVanBan()
    {
        this.router.navigate(['/app/main/qlvb/vanbans/create_edit_vanban']);
        // window.open('/app/main/qlvb/vanbans/create_edit_vanban', '_blank');
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

//     addNewVanBan()
// {
//     this.createOrEditVanbanModal.show();
// }

    getIndexById(id: number){
        var curData = this.initialData;
        let index = curData.findIndex(x => x.Id == id);
        return index;
    }

refresh(): void {
    window.location.reload();
}
    deleteVanban(id:number): void
     {
         //viet ham nhan vao id lay ra index
         //xoa tam
        let current = this.initialData;
        let index = this.getIndexById(id);
        current.splice(index,1);
      //  current.splice(index,1);
         //this.dataGrid.dataSource.
        this.message.confirm(
            '',this.l("AreYouSure"),
            (isConfirmed) => {
                if (isConfirmed) {
                    this._vanbansServiceProxy.delete(id)
                        .subscribe(() => {
                        
                            // this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
    }
    

    exportToExcel(): void {
        this._vanbansServiceProxy.getVanbansToExcel(
        this.filterText,
            this.tenCongViecFilter,
            this.maxNgayGiaoViecFilter,
            this.minNgayGiaoViecFilter,
            this.maxHanKetThucFilter,
            this.minHanKetThucFilter,
            this.nguoiXuLyFilter,
            this.maxTienDoChungFilter == null ? this.maxTienDoChungFilterEmpty: this.maxTienDoChungFilter,
            this.minTienDoChungFilter == null ? this.minTienDoChungFilterEmpty: this.minTienDoChungFilter,
            this.tinhTrangFilter,
            this.noiDungFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }
}
