import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    Router,
} from '@angular/router';
import { DxDataGridComponent, DxPopupComponent } from 'devextreme-angular';
import { isNullOrUndefined } from 'util';
import {
    confirm
} from 'devextreme/ui/dialog';
import { DRDataSourceServiceProxy, DRDataSourceDto, DRDataSourceDetailDto } from '@shared/service-proxies/service-proxies';


@Component({
    selector: 'appc-search',
    templateUrl: './datasource-component.html',
    encapsulation: ViewEncapsulation.None
})
export class DatasourceComponent implements OnInit {

    @ViewChild(DxDataGridComponent,{static:true}) dataTable: DxDataGridComponent;
    @ViewChild('popup',{static:true}) popup: DxPopupComponent;
    @ViewChild('popupDetail',{static:true}) popupDetail: DxPopupComponent;
    constructor(
        private configReportService: DRDataSourceServiceProxy,
        private router: Router, ) {
        this.loadSqlTypeOptions();
    }


    dataSource: any;
    reportID: any;
    templateData: any = {
        name: '',
        code: '',
        pageSize: 20,
        pageIndex: 1
    };
    dataSourceOptions: any;
    sqlTypeOptions: any;
    addData: DRDataSourceDto;
    addDataDetail: DRDataSourceDetailDto;
    currentServiceId: any;
    isEdit = false;
    ngOnInit() {
        this.search();
        this.popup.visible = false;
        this.popupDetail.visible = false;
    }
    onClose() {
        this.popup.visible = false;
        this.popupDetail.visible = false;
        this.isEdit = false;
    }
    dismiss() {
        this.templateData.name = "";
        this.search();
    }
    add() {
        this.isEdit = false;
        this.addData = new DRDataSourceDto();
        this.popup.visible = true;
    }
    sqlType = [{
        'value': 'SQL',

    }, {
        'value': 'MySql',

    }];
    loadSqlTypeOptions() {
        const self = this;
        this.sqlTypeOptions = {
            dataSource: self.sqlType,
            valueExpr: 'value',
            displayExpr: 'value',
            showClearButton: true
        }
    }


    delete(id: any) {
        this.configReportService.deleteDataSource(id).subscribe((res: any) => {
            if (res == 1) {
                abp.notify.success("Thành công.");
                this.search();
            } else {
                abp.notify.error("Thất bại");
            }
        })
    }

    onSubmit($event) {
        $event.preventDefault();

        const self = this;
        let result;
        if (this.isEdit == true) {
            result = confirm('Cập nhật DataSource này?', 'Xác nhận')
        }
        else {
            result = confirm('Thêm mới DataSource này?', 'Xác nhận')
        }
        result.done(async function (dialogResult) {
            if (dialogResult) {
                if (self.isEdit == false) {
                    await self.configReportService.createDataSource(self.addData).subscribe((res: any) => {
                        var id = res;
                        if (!isNullOrUndefined(id)) {
                            abp.notify.success("Thành công.");
                            self.onClose();
                            self.search();
                        } else {
                            abp.notify.error("Thất bại");
                            self.onClose();
                        }
                    });;
                }
                else {

                    self.configReportService.updateDataSource(self.currentServiceId, self.addData).subscribe((res: any) => {
                            
                            abp.notify.success("Thành công.");
                            self.search();
                            self.onClose();
                    });
                }
            }
        });
    }
    onSubmitDetail($event) {
        $event.preventDefault();
        const self = this;
        let result;
        result = confirm('Bạn muốn cập nhật?', 'Xác nhận');

        result.done(async function (dialogResult) {
            if (dialogResult) {
                await self.configReportService.updateDataSourceDetail(self.addDataDetail).subscribe(() => {
                        abp.notify.success("Thành công.");
                        self.search();
                        self.onClose();
                        
                });
            }
        });

    }
    config(id: any) {
        const self = this;
        this.popupDetail.visible = true;
        this.configReportService.getDetailDataSource(id).subscribe((res: any) => {
            self.addDataDetail = res;
        })
    }
    search() {
        const self = this;
        var param;
        if (self.templateData.name == '')
            param = 'null';
        else
            param = self.templateData.name;
        this.dataSource = {
            load: function (loadOptions: any) {
                const promise = new Promise((resolve, reject) => {
                    self.configReportService.getByName(self.templateData.name).subscribe((res: any) => {
                        resolve(res);
                    });
                });
                return promise;
            },
            key: 'id'
        }
    }
    detail(id: any) {
        const self = this;
        this.currentServiceId = id;
        this.isEdit = true;
        this.popup.visible = true;
        this.configReportService.getByID(id).subscribe((res: any) => {
            self.addData = res;
        })
    }
}

