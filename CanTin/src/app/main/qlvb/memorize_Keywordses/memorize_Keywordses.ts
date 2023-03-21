import { Component, Injector, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Memorize_KeywordsesServiceProxy, Memorize_KeywordsDto, SqlConfigDetailsServiceProxy  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
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
    templateUrl: './memorize_Keywordses.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class Memorize_KeywordsesComponent extends AppComponentBase implements OnInit{

   
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

    advancedFiltersAreShown = false;
    filterText = '';
    tenGoiNhoFilter = '';
    xuLyChinhFilter = '';
    dongXuLyFilter = '';
    deBietFilter = '';
    maxHead_IDFilter : number;
		maxHead_IDFilterEmpty : number;
		minHead_IDFilter : number;
		minHead_IDFilterEmpty : number;
    full_NameFilter = '';
    prefixFilter = '';
    maxHire_DateFilter : moment.Moment;
		minHire_DateFilter : moment.Moment;
    keyWordFilter = '';
    maxIsActiveFilter : number;
		maxIsActiveFilterEmpty : number;
		minIsActiveFilter : number;
        minIsActiveFilterEmpty : number;
        

    stt = 0;

    columnItems: any = [];

    dataSource: any = {};
    data = [];
    customDataSource: DataSource;
    allMode: string;
    checkBoxesMode: string;
    prefix = '';
    selectedRows: number[];
    selectionChangedBySelectbox: boolean;
    memorize_Keyword :Memorize_KeywordsDto = new Memorize_KeywordsDto;
    columnBuilder = [];
    columnConfig = [];
    columns: any;
    initialData = [];
    textbook: any ; 
    id: any ;
    constructor(
        injector: Injector,
        private _sqlConfigHelperService: SqlConfigHelperService,
        private _sqlConfigDetailsService: SqlConfigDetailsServiceProxy,
        private _memorize_KeywordsesServiceProxy: Memorize_KeywordsesServiceProxy,
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

    showProcess()
    {
        this.router.navigate(['/app/main/qlvb/vanban-InProcess' ]); 
    }
    showView(id:number) 
    {
       this.router.navigate(['/app/main/qlvb/textBooks/view_textbook/'+id ]); 
      
     }
     showCreateOrEdit(id:number) 
     {
        this.router.navigate(['/app/main/qlvb/create-edit-memorize_Keywordses-modal/'+id ]); 
            //   this._textBooksServiceProxy.getTextBookForView(this.id).subscribe((res) => {
            //     this.textbook = res.textBook;
                //  console.log( this.viewvanban)
        
            
        // }); 
     }
     
     showScanModule = false;
     toggleScanModule() { this.showScanModule = !this.showScanModule;} 
     
     formatStatusBar(value) {
         return 'Tình trạng: ' + value * 100 + '%';
     }
 
     
 
     scanDocument():void {
         this.router.navigate(['/app/main/qlvb/vanbans/scan_document']);
         // window.open('/app/main/qlvb/vanbans/scan_document', '_blank');
     }
   
     addNewVanBan() {
         this.router.navigate(['/app/main/qlvb/create-new-incomming-document']);
         // window.open('/app/main/qlvb/vanbans/create_edit_vanban', '_blank');
     }
     addNew(){

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
       console.log(this.prefix)
   }

   selectionChangedHandler() {
       if(!this.selectionChangedBySelectbox) {
           this.prefix=null;
       }
      

       this.selectionChangedBySelectbox=false;
   }



   getVanbanDxTable() {
       this._memorize_KeywordsesServiceProxy.getAllMemorize_Keywordses().subscribe(result => {
          
           this.initialData = result.listMemorize;
           this.dataGrid.dataSource = this.initialData;
          
           this.dataGrid.columns = this._sqlConfigHelperService.generateColumns(result.listColumnConfigMemorize, true);
       });
   }
 

   getMemorize_Keywordses(event?: LazyLoadEvent) {
    if (this.primengTableHelper.shouldResetPaging(event)) {
        this.paginator.changePage(0);
        return;
    }

    this.primengTableHelper.showLoadingIndicator();

    this._memorize_KeywordsesServiceProxy.getAll(
        this.filterText,
        this.tenGoiNhoFilter,
        this.xuLyChinhFilter,
        this.dongXuLyFilter,
        this.deBietFilter,
        this.maxHead_IDFilter == null ? this.maxHead_IDFilterEmpty: this.maxHead_IDFilter,
        this.minHead_IDFilter == null ? this.minHead_IDFilterEmpty: this.minHead_IDFilter,
        this.full_NameFilter,
        this.prefixFilter,
        this.maxHire_DateFilter,
        this.minHire_DateFilter,
        this.keyWordFilter,
        this.maxIsActiveFilter == null ? this.maxIsActiveFilterEmpty: this.maxIsActiveFilter,
        this.minIsActiveFilter == null ? this.minIsActiveFilterEmpty: this.minIsActiveFilter,
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

delete(){
    
}


deleteMemorize_Keywords(memorize_Keywords: Memorize_KeywordsDto): void {
    this.message.confirm(
        '',
        this.l('AreYouSure'),
        (isConfirmed) => {
            if (isConfirmed) {
                this._memorize_KeywordsesServiceProxy.delete(memorize_Keywords.id)
                    .subscribe(() => {
                        this.reloadPage();
                        this.notify.success(this.l('SuccessfullyDeleted'));
                    });
            }
        }
    );
}

exportToExcel(): void {
    this._memorize_KeywordsesServiceProxy.getMemorize_KeywordsesToExcel(
    this.filterText,
        this.tenGoiNhoFilter,
        this.xuLyChinhFilter,
        this.dongXuLyFilter,
        this.deBietFilter,
        this.maxHead_IDFilter == null ? this.maxHead_IDFilterEmpty: this.maxHead_IDFilter,
        this.minHead_IDFilter == null ? this.minHead_IDFilterEmpty: this.minHead_IDFilter,
        this.full_NameFilter,
        this.prefixFilter,
        this.maxHire_DateFilter,
        this.minHire_DateFilter,
        this.keyWordFilter,
        this.maxIsActiveFilter == null ? this.maxIsActiveFilterEmpty: this.maxIsActiveFilter,
        this.minIsActiveFilter == null ? this.minIsActiveFilterEmpty: this.minIsActiveFilter,
    )
    .subscribe(result => {
        this._fileDownloadService.downloadTempFile(result);
     });
}
addMove(){

}


}



    // getTextBooks(event?: LazyLoadEvent) {
    //     if (this.primengTableHelper.shouldResetPaging(event)) {
    //         this.paginator.changePage(0);
    //         return;
    //     }

    //     this.primengTableHelper.showLoadingIndicator();

    //     this._memorize_KeywordsesServiceProxy.getAll(
    //         this.filterText,
    //         this.maxSoDenFilter == null ? this.maxSoDenFilterEmpty: this.maxSoDenFilter,
    //         this.minSoDenFilter == null ? this.minSoDenFilterEmpty: this.minSoDenFilter,
    //         this.maxNgayDenFilter,
    //         this.minNgayDenFilter,
    //         this.soHieuGocFilter,
    //         this.coQuanBanHanhFilter,
    //         this.trichYeuFilter,
    //         this.nguoiChiDaoFilter,
    //         this.nguoi_DonViFilter,
    //         this.fileDinhKemFilter,
    //         this.primengTableHelper.getSorting(this.dataTable),
    //         this.primengTableHelper.getSkipCount(this.paginator, event),
    //         this.primengTableHelper.getMaxResultCount(this.paginator, event)
    //     ).subscribe(result => {
    //         this.primengTableHelper.totalRecordsCount = result.totalCount;
    //         this.primengTableHelper.records = result.items;
    //         this.primengTableHelper.hideLoadingIndicator();
    //     });
    // }

    

   

    // exporttoFileDinhKem(id : number)
    // {
    //     this._textBooksServiceProxy.getTextBookForView(id).subscribe((result) => {
    //         this.textbook.fileDinhKemFilter = result.textBook.fileDinhKem;
           
    //         this._fileDownloadService.downloadTempFile( this.textbook.fileDinhKemFilter );
           
    //     });
    // }
   
    // exportToExcel(): void {
    //     this._memorize_KeywordsesServiceProxy.getTextBooksToExcel(
    //     this.filterText,
    //         this.maxSoDenFilter == null ? this.maxSoDenFilterEmpty: this.maxSoDenFilter,
    //         this.minSoDenFilter == null ? this.minSoDenFilterEmpty: this.minSoDenFilter,
    //         this.maxNgayDenFilter,
    //         this.minNgayDenFilter,
    //         this.soHieuGocFilter,
    //         this.coQuanBanHanhFilter,
    //         this.trichYeuFilter,
    //         this.nguoiChiDaoFilter,
    //         this.nguoi_DonViFilter,
    //         this.fileDinhKemFilter,
    //     )
    //     .subscribe(result => {
    //         this._fileDownloadService.downloadTempFile(result);
    //      });
    // }

