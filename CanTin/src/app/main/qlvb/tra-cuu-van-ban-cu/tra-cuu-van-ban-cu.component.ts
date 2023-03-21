import { DRViewerServiceProxy } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentServiceProxy, DRReportServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { Component, Injector, ViewChild } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";

@Component({
    selector: 'tracuuvanbancu',
    templateUrl: './tra-cuu-van-ban-cu.component.html',
    //styleUrls: ['./tra-cuu-van-ban-cu.component.less'],
    animations: [appModuleAnimation()]
})
export class ChiTietTraCuuVanBanCuComponent extends AppComponentBase {
    documentOldData: any = [];
    documentId: any;
    reportCode: any;

    constructor(
        injector: Injector,
        private route: Router,
        private _drViewerService: DRViewerServiceProxy,
        private reportService: DRReportServiceProxy,
        private activeRoute: ActivatedRoute) {
        super(injector);
    }

    ngOnInit() {
        this.activeRoute.params.subscribe((para) => {
            this.documentId = para['id'];
            this.reportCode = para['code'];

            this.reportService.getIdByCode(para.code).subscribe((res: any) => {
                    var dataSourceId = res.data[0].dataSourceId;

                    this._drViewerService.traCuuVanBanCuById(this.documentId, dataSourceId).subscribe((res: any) => {
                        if (res.data.length > 0) {
                            this.documentOldData = res.data[0];
                        }
                    })
            });
        })
    }

    back() {
        //window.history.back();
        this.route.navigate(['/app/main/dynamicreport/report/viewer/' + this.reportCode]);
    }
}