import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    Router,
} from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { DRReportServiceProxy, SearchInput } from '@shared/service-proxies/service-proxies';




@Component({
    selector: 'appc-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {
    @ViewChild('reportDg',{static:true}) reportDg: DxDataGridComponent;

    searchData: SearchInput;
    DataSource: any;
    parentOptions: any;
    dataSource: any;
    key: any;
    modalAdd: any;

    constructor(
        private configReportService: DRReportServiceProxy,
        private router: Router) {
        this.searchData =new SearchInput();
        this.initDataSource();
    }

    ngOnInit() {
        this.reset();
        this.search();

    }


    search() {
        if (this.reportDg && this.reportDg.instance) {
            this.reportDg.instance.refresh();
        }
    }

    add() {
        this.router.navigate(['/app/main/dynamicreport/report/add/null']);
    }

    detail(id) {
        this.router.navigate(['/app/main/dynamicreport/report/add/' + id]);
    }

    setFilter(id) {
        this.router.navigate(['/app/main/dynamicreport/report/config/' + id + '/1']);
    }

    delete(id) {
        const self = this;
        abp.message.confirm(
            'Bạn có chắc muốn xóa báo cáo này? ',
            'Xác nhận',
            isConfirmed => {
                if (isConfirmed) {
                    self.configReportService.delete(id).subscribe(() => {
                        abp.notify.success('Xóa thành công');
                        self.search();
                    });
                }
            }
        );
    }

    copy(id){
        const self = this;
        abp.message.confirm(
            'Sao chép báo cáo này? ',
            'Xác nhận',
            isConfirmed => {
                if (isConfirmed) {
                    self.configReportService.copyReport(id).subscribe((res:any) => {
                        if(res.isSucceeded){
                            abp.notify.success('Sao chép thành công');
                            self.search();
                        }else{
                            abp.notify.error(res.message);
                        }
                        
                    });
                }
            }
        );
    }

    reset() {
        this.searchData = new SearchInput();
        this.search();
    }
    initDataSource() {

        const self = this;
        this.DataSource = {
            load: function () {
                const promise = new Promise((resolve) => {
                    self.configReportService.search(self.searchData).subscribe((res: any) => {
                        resolve(res);
                    });
                });
                return promise;
            },
        };
    }

    onContentReady_UnitGroup() { }
    onRowPrepared_UnitGroup() { }
    unitGroupData: any;
}
