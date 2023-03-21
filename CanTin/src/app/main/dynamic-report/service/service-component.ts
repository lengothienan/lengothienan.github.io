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
import {
    confirm
} from 'devextreme/ui/dialog';
import { isNullOrUndefined } from 'util';
import { DRReportServiceServiceProxy, DRDataSourceServiceProxy, DRServiceDto } from '@shared/service-proxies/service-proxies';


@Component({
    selector: 'appc-search',
    templateUrl: './service-component.html',
    styleUrls: ['./service-component.scss'],
})
export class ReportServiceComponent implements OnInit {
    @ViewChild(DxDataGridComponent,{static:true}) dataTable: DxDataGridComponent;
    @ViewChild(DxPopupComponent,{static:true}) popup: DxPopupComponent;
    constructor(
        private configReportService: DRReportServiceServiceProxy,
        private dataSourceService: DRDataSourceServiceProxy,
        private router: Router, ) {
    }

    visible: any = false;
    dataSource: any;
    reportID: any;
    templateData: any = {
        pageSize: 20,
        pageIndex: 1
    };
    dataSourceOptions: any;
    sqlTypeOptions: any;
    addData: DRServiceDto;
    currentServiceId: any;
    isEdit = false;
    nullvalue: any;
    sqlType = [{
        'value': false,
        'display': 'Store',
    }, {
        'value': true,
        'display': 'SqlCommand',
    }];
    ngOnInit() {
        this.loadDataSourceOptions();
        this.loadSqlTypeOptions();
        this.search()
    }
    search() {
        const self = this;
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
    loadDataSourceOptions() {
        const self = this;
        this.dataSourceOptions = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                    const promise = new Promise((resolve, reject) => {
                        self.dataSourceService.getByName(self.nullvalue).subscribe((res: any) => {
                            resolve(res);
                        });
                    });

                    return promise;
                },
            },
            searchEnabled: true,
            valueExpr: 'id',
            displayExpr: 'name',
            showClearButton: true
        };
    }
    loadSqlTypeOptions() {
        const self = this;
        this.sqlTypeOptions = {
            dataSource: self.sqlType,
            searchEnabled: true,
            valueExpr: 'value',
            displayExpr: 'display',
            showClearButton: true
        };
    }

    onSubmit($event) {
        $event.preventDefault();

        const self = this;
        let result;
        if (this.isEdit == true) {
            result = confirm('Cập nhật Service này?', 'Xác nhận')
        }
        else {
            result = confirm('Thêm mới Service này?', 'Xác nhận')
        }
        result.done(async function (dialogResult) {
            if (dialogResult) {
                var id;
                if (self.isEdit == false) {
                    await self.configReportService.create(self.addData).subscribe((res: any) => {
                        abp.notify.success("Thêm mới thành công");
                        self.search();
                        self.onClose();
                    });;
                }
                else {

                    self.configReportService.update(self.addData).subscribe((res: any) => {
                        self.onClose();
                        abp.notify.success('Thành công');
                        self.search();
                    });
                }
            }
        });

    }
    onClose() {
        this.popup.visible = false;
        this.isEdit = false;
    }
    dismiss() {
        this.templateData.name = "";
        this.search();
    }
    add() {
        this.popup.visible = true;
        this.addData = new DRServiceDto();
        this.isEdit = false;
    }
    delete(id: any) {
        this.configReportService.delete(id).subscribe(() => {
                abp.notify.success("Thành công.");
                this.search();
        })
    }
    detail(id: any) {
        const self = this;
        this.currentServiceId = id;
        this.isEdit = true;
        this.popup.visible = true;
        this.configReportService.getById(id).subscribe((res: any) => {
            self.addData = res;
        })
    }

}

export class ReportService {
    id: number;
    code: string;
    name: string;
    dataSourceId: number;
    isActive: boolean = true;
    isDelete: boolean = false;
    sqlContent: string;
    sqlType: boolean;
    version: string;
    colDisplay: string;
    colValue: string;
    colParent: string;
}