import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    Router, ActivatedRoute,
} from '@angular/router';

import { DxDataGridComponent, DxPopupComponent } from 'devextreme-angular';
import { DRLookUpServiceProxy, DRLookUpDto, DRLookupDetailDto } from '@shared/service-proxies/service-proxies';
import { isNullOrUndefined } from 'util';
import {
    confirm
} from 'devextreme/ui/dialog';


@Component({
    selector: 'appc-add-lookup',
    templateUrl: './add-component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddLookupComponent implements OnInit {
    @ViewChild(DxDataGridComponent,{static:true}) dataTable: DxDataGridComponent;
    @ViewChild(DxPopupComponent,{static:true}) popup: DxPopupComponent;
    constructor(
        private configReportService: DRLookUpServiceProxy,
        private router: Router,
        private activerouter: ActivatedRoute) {
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
    currentLookupID: any;
    dataSourceOptions: any;
    sqlTypeOptions: any;
    addData: DRLookupDetailDto;
    currentLookUpDetailId: any;
    isEdit = false;
    ngOnInit() {
        const self = this;
        this.search();
        this.activerouter.params.subscribe(param => {
            self.currentLookupID = param.id
        })
    }
    onClose() {
        this.popup.visible = false;
    }
    dismiss() {
        this.router.navigate(['/app/main/dynamicreport/lookup']);
    }
    add() {
        this.isEdit = false;
        this.addData = new DRLookupDetailDto();
        this.popup.visible = true;
    }
    delete(id: any) {
        const self =this;
        var result = confirm('Xóa giá trị này?', 'Xác nhận');
        result.done(async function (dialogResult) {
            if (dialogResult) {
                self.configReportService.deleteLookupValue(id).subscribe((res: any) => {
                    
                        abp.notify.success("Thành công");
                        self.search();

                })
            }
        });
    }

    onSubmit($event) {
        $event.preventDefault();

        
        const self = this;

        self.addData.lookupId=self.currentLookupID;
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
                    await self.configReportService.insertDetail(self.addData).subscribe((res: any) => {

                            abp.notify.success("Thành công");
                            self.onClose();
                            self.search();
                    });;
                }
                else {
                    self.addData.id = self.currentLookUpDetailId;
                    self.configReportService.updateLookupDetail(self.addData).subscribe((res: any) => {

                            self.onClose();
                            abp.notify.success("Thành công");
                            self.search();

                    });
                }
            }
        });

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
                    self.configReportService.getDetailLookup(self.currentLookupID, param.name,param.code).subscribe((res: any) => {
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
        this.currentLookUpDetailId = id;
        this.isEdit = true;
        this.popup.visible = true;
        this.configReportService.getDetailLookupValue(id).subscribe((res: any) => {
            self.addData = res;
        })
    }
}

