import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, DocumentHandlingsServiceProxy, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DxDataGridComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { AppConsts } from '@shared/AppConsts';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { CreateOrEditDynamicCategoryModalComponent } from './create-or-edit-dynamicCategory-modal.component';
import { Table } from 'primeng/table';
import * as $ from 'jquery';
@Component({
    templateUrl: './dynamicCategory.component.html',
    styleUrls: ['./dynamicCategory.component.less'],
    animations: [appModuleAnimation()]
})
export class DynamicCategoryComponent extends AppComponentBase implements OnInit {
    @Input() actionID: string;
    // @Output() lbId = new EventEmitter<number>();
    @ViewChild('createOrEditDynamicCategoryModal', { static: true }) createOrEditDynamicCategoryModal: CreateOrEditDynamicCategoryModalComponent;
    @ViewChild('gridContainer', { static: true }) gridContainer: DxDataGridComponent;
    // @ViewChild('transferHandleModal', { static: true }) transferHandleModal: TransferHandleModalComponent;
    @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;

    @ViewChild('buttonUI', { static: true}) buttonUI: ButtonUIComponent;
    @ViewChild('dt', { static: true}) table: Table;
    saving = false;

    header: string;
    selectionChangedBySelectbox: boolean;
    prefix = '';
    dataRowDetail: any;
    initialData: any;
    selectedID:any;
    labelId: number;
    now: Date = new Date();
    historyPopupVisible = false;
    popup_Visible = false; // popup trình BGĐ
    popup_Visible_detail = false; // popup Cập nhật KQGQ
    history_Upload = [];
    rootUrl = '';
    selectedRows = [];
    selectedRowsData: any[] = [];

    director: any;
    data_secretLevel = [];
    data_priority = [];
    data_DVXL = [];
    //đơn vi jxử lý của popup cập nhật kết quả giải quyết
    data_DVXL_CNKQGQ = [];
    previousMainHandlingId: number;
    previousMainHandlingIndex: number;
    printUrl = '';
    tableHeader = [];
    queryResult = [];
    constructor(
        injector: Injector,
        private ultility: UtilityService,
        private router: Router,
        private _dynamicGridServiceProxy: DynamicGridHelperServiceProxy,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _documentServiceProxy: DocumentServiceProxy,
        private _documentHandlingAppService:DocumentHandlingsServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _dynamicFieldService: DynamicFieldsServiceProxy) {
        super(injector);
        this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetWordFile?documentId=';
        this.router.routeReuseStrategy.shouldReuseRoute = function(){
            return false;
         }
    
        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
               // trick the Router into believing it's last link wasn't previously loaded
               this.router.navigated = false;
               // if you need to scroll back to top, here is the right place
               window.scrollTo(0, 0);
            }
        });

    }

    onRowUpdated(e: any){
        console.log(e);
    }

    deleteDynamicCategory(rowId: number){
        this._dynamicFieldService.deleteRowForDynamicCategory(rowId, this.labelId).subscribe(()=>{
            this.notify.success('Xóa thành công!');
            this.getQueryResult();
        })
    }

    createDynamicCategory(){
        this.createOrEditDynamicCategoryModal.show();
    }

    ngOnInit() {     
        //this.gridContainer.columns.length = 0; 
        // console.log(this.gridContainer)
        this._activatedRoute.params.subscribe(params => {           
            this.labelId = parseInt(params['id']);
            this._dynamicFieldService.getDynamicFieldForHeaderTable(this.labelId).subscribe(result => {
                //this.tableHeader = this.tableHeader.concat(result);
                this.tableHeader = result;
                this.tableHeader.unshift({caption: '#', cellTemplate: 'dropdown'});
                this.gridContainer.columns = this.tableHeader;
            });
            this.getQueryResult();
        });
    }

    //lấy dữ liệu lên lưới
    getQueryResult(){
        
        this._dynamicFieldService.getDataValueForDynamicCategory(this.labelId).subscribe(result => {
            //let firstRow = result[0];
            //this.tableHeader = Object.getOwnPropertyNames(firstRow);
            this.queryResult = result;  
            
            // this.gridContainer.columns = this.tableHeader;
            
            //this.gridContainer.columns = this.tableHeader;
            console.log(this.gridContainer.columns);
        });
        // $('#gridContainer').dxDataGrid('columns').addColumn({alignment: 'center', cellTemplate: 'dropdown', caption: '#'});
        // console.log(this.gridContainer.columns);
        // console.log($('#gridContainer').dxDataGrid('instance'))
        // this.gridContainer.columns.unshift({alignment: 'center', cellTemplate: 'dropdown', caption: '#'});
    }

    //check trạng thái hàm save và thông báo
    

    // Xu ly khi double click vào datagrid ở màn hình Chưa duyệt
    startEdit(e) {
        this.dataRowDetail = e.data ;
        if(this.labelId == 84) 
        {    
            this.popup_Visible_detail = true;
            
            this.data_DVXL.forEach(x => {
                x["mainHandling"] = false;
                x["coHandling"] = false;
            });
            this._documentHandlingAppService.get_DVXL_ForDocument(this.selectedRowsData[0].Id, this.selectedRowsData[0].UnitId).subscribe((res) => {
             
                // this.gridContainer113.instance.repaint();
            });
            //   this.selectedRowsData[0].processingRecommended;
        }
        else if(this.labelId != 6 && this.labelId != 85)
        {   
            let temp = [];
            temp = this.data_DVXL.map(function(x) { return {...x} });
            this._documentHandlingAppService.get_DVXL_ForDocument(this.selectedRowsData[0].Id, this.selectedRowsData[0].UnitId).subscribe((res) => {
                
                this.data_DVXL_CNKQGQ = temp.filter(x => x.mainHandling || x.coHandling);
                // this.gridContainer113.instance.repaint();
            });
            
        }
    }
   
    onValueChanged (e) {
        this.selectedID =  e.value ; 
    }

    popUpClass()
    {
        return "popUpClass";
    }
    // funtion tra ve
    return() {
        window.history.go(-1); return false;
    }

    // Chỉnh sửa
    editRow(e: any) {
        this.router.navigate(['/app/main/qlvb/incomming-document/edit/'+e.data.Id]);
    }
    deleteRow(e: any) {
        this.message.confirm(
            'Bạn muốn xóa văn bản này? Hành động này không thể phục hồi!',
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._documentServiceProxy.delete(e.data.Id).subscribe(() => {
                        this.initialData.splice(e.rowIndex, 1);
                        this.notify.success('Xóa thành công!');
                    }, ()=>{
                        this.notify.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
                    });
                }
            }
        );
    }

    // funtion thêm mới
    create() {
        this.router.navigate(['/app/main/qlvb/create-new-incomming-document']);
    }

    selectionChangedHandler() {
        if (!this.selectionChangedBySelectbox) {
            this.prefix = null;
        }

        this.selectionChangedBySelectbox = false;
    }
    columnFields: any[] = [];

    getVanbanDxTable(labelId: number) {
        const that = this;
        this._dynamicGridServiceProxy.getAllDataAndColumnConfigByLabelId(labelId, false).subscribe(result => {
            let count = 0;
            that.header = result.getDataAndColumnConfig.title;
            
            that.gridContainer.instance.repaint();
        });
    }

    viewProcess(event: any) {
        this.router.navigate(['/app/main/qlvb/quytrinhxuly/' + event.data.Id]);
    }

    filterSelected(event) {
        this.selectionChangedBySelectbox = true;

        let prefix = event.value;

        if (!prefix)
            return;
        else if (prefix === "All")
            this.selectedRows = this.initialData.store.map(employee => employee.Id);
        else {
            this.selectedRows = this.initialData.store.filter(employe => employe.Prefix === prefix).map(employee => employee.Id);
        }
        this.prefix = prefix;

    }

    viewRow(event: any) {
        // sessionStorage.setItem("readOnly", "true");
        this.router.navigate(['/app/main/qlvb/incomming-document/view/' + event.data.Id]);
    }

    saveToBook() {

    }

    getIndexById(id: number) {
        var curData = this.initialData;
        let index = curData.findIndex(x => x.Id == id);
        return index;
    }
    getSelectedRowKeys() {
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            return;
        }
        this.selectedRowsData.forEach(element => {
            this.selectedRows.push(element["Id"]);
        });
        this.ultility.selectedRows = this.selectedRows;
    }
    getSelectedRowsData() {
        this.selectedRowsData = this.initialData.instance.getSelectedRowsData();
    }

    getdataRow(e: any) {
        this._historyUploadsServiceProxy.getList(e.data.id).subscribe(res => {
            this.history_Upload = res;
        });

    }
    
    onCheckBoxChanged(e, cell)
    {
        let index = this.data_DVXL.findIndex(x => x.id == cell.data.id);
        //kiểm tra cột vừa thao tác là main hay co
        switch(cell.column.dataField){
            case 'mainHandling':
                //kiểm tra có đvxl chính chưa, nếu có rồi thì bỏ chọn cái trước
                if(this.previousMainHandlingId >= 0){               
                    let temp = this.data_DVXL.findIndex(x => x.id == this.previousMainHandlingId);
                    this.data_DVXL[temp]["mainHandling"] = false;
                }
    
                if(this.data_DVXL[index]["coHandling"] == true){
                    this.data_DVXL[index]["coHandling"] = false;
                }
    
                this.data_DVXL[index]["mainHandling"] = e.value;   

                //giữ id của đơn vị đang nắm chủ trì
                this.previousMainHandlingId = cell.data.id;
                break;
            case 'coHandling':
                if(this.data_DVXL[index]["mainHandling"] == true){
                    this.data_DVXL[index]["mainHandling"] = false;
                }
    
                this.data_DVXL[index]["coHandling"] = e.value;
        }
    }
}