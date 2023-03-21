import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TextBooksServiceProxy, TextBookDto, SqlConfigDetailsServiceProxy  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { CreateOrEditTextBookModalComponent } from './create-or-edit-textBook-modal';
import { ViewTextBookModalComponent } from './view-textBook-modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { SqlConfigHelperService } from '@shared/utils/sql-config-helper.service';
import DataSource from 'devextreme/data/data_source';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
    selector: 'textBooks',
    templateUrl: './textBooks.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class TextBooksComponent extends AppComponentBase implements OnInit{

   
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

    advancedFiltersAreShown = false;
    filterText = '';
    maxSoDenFilter : number;
		maxSoDenFilterEmpty : number;
		minSoDenFilter : number;
		minSoDenFilterEmpty : number;
    maxNgayDenFilter : moment.Moment;
		minNgayDenFilter : moment.Moment;
    soHieuGocFilter = '';
    coQuanBanHanhFilter = '';
    trichYeuFilter = '';
    nguoiChiDaoFilter = '';
    nguoi_DonViFilter = '';
    fileDinhKemFilter = '';

    columnItems: any = [];

    dataSource: any = {};
    data = [];
    customDataSource: DataSource;
    allMode: string;
    checkBoxesMode: string;
    prefix = '';
    selectedRows: number[];
    selectionChangedBySelectbox: boolean;
    textBook :TextBookDto = new TextBookDto;
    columnBuilder = [];
    columnConfig = [];
    columns: any;
    initialData = [];
    constructor(
        injector: Injector,
        private _sqlConfigHelperService: SqlConfigHelperService,
        private _sqlConfigDetailsService: SqlConfigDetailsServiceProxy,
        private _textBooksServiceProxy: TextBooksServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private router : Router,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
        this.allMode = 'allPages';
        this.checkBoxesMode = 'onClick';
        this.selectedRows = [];
    }

    showViewTextBook(id:number) 
    {
       this.router.navigate(['/app/main/qlvb/view-textBook-modal/' + id ]); 
      
     }
     showCreateOrEdit(id:number) 
     {
        
          //chuyển qua url khác bằng id
          this.router.navigate(['/app/main/qlvb/create-or-edit-textBook-modal/'+id]); 
          //lấy id từ url

      
     }
     
     showScanModule = false;
     toggleScanModule() { this.showScanModule = !this.showScanModule;} 
     
     formatStatusBar(value) {
         return 'Tình trạng: ' + value * 100 + '%';
     }
 
     deleteVanban(){
         
     }
 
     scanDocument():void {
         this.router.navigate(['/app/main/qlvb/vanbans/scan_document']);
         // window.open('/app/main/qlvb/vanbans/scan_document', '_blank');
     }
   
     addNewVanBan() {
         this.router.navigate(['/app/main/qlvb/create-new-incomming-document']);
         // window.open('/app/main/qlvb/vanbans/create_edit_vanban', '_blank');
     }
 
   ngOnInit(): void {
       this.getVanbanDxTable();
       //this.getConfigColumn();
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
       return this.dataGrid.instance.getSelectedRowsData();
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

       this.selectionChangedBySelectbox=false;
   }



   getVanbanDxTable() {
       this._textBooksServiceProxy.getAllTextBook().subscribe(result => {
          
           this.initialData = result.listTextBook;
           this.dataGrid.dataSource = this.initialData;
           console.log(this.dataGrid.dataSource)
           
           this.dataGrid.columns = this._sqlConfigHelperService.generateColumns(result.listColumnConfigTextBook, true);
       });
   }
 




    getTextBooks(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            return;
        }

        this.primengTableHelper.showLoadingIndicator();

        this._textBooksServiceProxy.getAll(
            this.filterText,
            this.maxSoDenFilter == null ? this.maxSoDenFilterEmpty: this.maxSoDenFilter,
            this.minSoDenFilter == null ? this.minSoDenFilterEmpty: this.minSoDenFilter,
            this.maxNgayDenFilter,
            this.minNgayDenFilter,
            this.soHieuGocFilter,
            this.coQuanBanHanhFilter,
            this.trichYeuFilter,
            this.nguoiChiDaoFilter,
            this.nguoi_DonViFilter,
            this.fileDinhKemFilter,
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getSkipCount(this.paginator, event),
            this.primengTableHelper.getMaxResultCount(this.paginator, event)
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }
    getIndexById(id: number){
        var curData = this.initialData;
        let index = curData.findIndex(x => x.Id == id);
        return index;
    }


    deleteTextBook(id:number): void {
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
                     this._textBooksServiceProxy.delete(id)
                         .subscribe(() => {
                         
                             // this.notify.success(this.l('SuccessfullyDeleted'));
                         });
                 }
             }
         );
    }

    exportToExcel(): void {
        this._textBooksServiceProxy.getTextBooksToExcel(
        this.filterText,
            this.maxSoDenFilter == null ? this.maxSoDenFilterEmpty: this.maxSoDenFilter,
            this.minSoDenFilter == null ? this.minSoDenFilterEmpty: this.minSoDenFilter,
            this.maxNgayDenFilter,
            this.minNgayDenFilter,
            this.soHieuGocFilter,
            this.coQuanBanHanhFilter,
            this.trichYeuFilter,
            this.nguoiChiDaoFilter,
            this.nguoi_DonViFilter,
            this.fileDinhKemFilter,
        )
        .subscribe(result => {
            this._fileDownloadService.downloadTempFile(result);
         });
    }
    showView(e: any){

    }
}
