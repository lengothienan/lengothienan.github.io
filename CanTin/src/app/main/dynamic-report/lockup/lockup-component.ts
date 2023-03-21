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
import { DRLookUpDto, DRLookUpServiceProxy } from '@shared/service-proxies/service-proxies';


@Component({
    selector: 'appc-search',
    templateUrl: './lockup-component.html',
    styleUrls: ['./lockup-component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ReportLockupComponent implements OnInit {

    @ViewChild(DxDataGridComponent,{static:true}) dataTable: DxDataGridComponent;
    @ViewChild(DxPopupComponent,{static:true}) popup: DxPopupComponent;
    constructor(
        private configReportService: DRLookUpServiceProxy,
        private router: Router, ) {
    }

    visible: any = false;
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
    addData: DRLookUpDto;
    currentLookupID: any;
    isEdit = false;


    ngOnInit() {
        this.search();
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
        this.isEdit = false;
        this.addData = new DRLookUpDto();
        this.popup.visible = true;
    }
    delete(id: any) {
        this.configReportService.deleteLookup(id).subscribe((res: any) => {
            if (res== 1) {
                abp.notify.success("Thành công");
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
            result = confirm('Cập nhật giá trị này?', 'Xác nhận')
        }
        else {
            result = confirm('Thêm mới giá trị này?', 'Xác nhận')
        }
        result.done(async function (dialogResult) {
            if (dialogResult) {
                if (self.isEdit == false) {
                    await self.configReportService.createLookup(self.addData).subscribe((res: any) => {
                        var id = res;
                        if (!isNullOrUndefined(id)) {
                            abp.notify.success('Thành công');
                            self.search();
                            self.onClose();
                        } else {
                            abp.notify.error('Thất bại');
                            self.onClose();
                        }
                    });;
                }
                else {

                    self.configReportService.updateLookup(self.currentLookupID, self.addData).subscribe((res: any) => {
                        self.onClose();
                        abp.notify.success('Thành công');
                        self.search();
                    });
                }
            }
        });
    }
    config(id: any) {
        this.router.navigate(['./app/main/dynamicreport/lookup/' + id]);
    }
    search() {
        const self = this;
        var param;
            param = self.templateData.name;
        this.dataSource = {
            load: function (loadOptions: any) {
                const promise = new Promise((resolve, reject) => {
                    self.configReportService.getByName(param).subscribe((res: any) => {
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
        this.currentLookupID = id;
        this.isEdit = true;
        this.popup.visible = true;
        this.configReportService.getByID(id).subscribe((res: any) => {
            self.addData = res;
        })
    }
}
