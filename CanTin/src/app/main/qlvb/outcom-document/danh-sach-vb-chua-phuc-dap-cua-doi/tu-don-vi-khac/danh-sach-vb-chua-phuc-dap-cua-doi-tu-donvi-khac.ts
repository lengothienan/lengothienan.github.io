import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Component, OnInit, Injector, ViewChild } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { ODocsServiceProxy } from "@shared/service-proxies/service-proxies";
import { Router } from "@angular/router";
import { UtilityService } from "@shared/utils/UltilityService.service";
import { AppSessionService } from '@shared/common/session/app-session.service';
import $ from 'jquery';
import { DxDataGridComponent } from "devextreme-angular";

@Component({
    templateUrl: './danh-sach-vb-chua-phuc-dap-cua-doi-tu-donvi-khac.html',
    animations: [appModuleAnimation()]
})
export class DanhSachVBChuaPhucDapCuaDoiTuDonViKhacComponent extends AppComponentBase implements OnInit {

    @ViewChild('gridContainer', {static: true}) gridContainer: DxDataGridComponent;

    constructor(
        injector: Injector,
        private odocService: ODocsServiceProxy,
        private router:Router,
        private _utilityService: UtilityService
    ){
        super(injector);
    }

    initialData:any=[];
    

    ngOnInit(){
        this.odocService.getDocumentNoneReplyFromOtherOrgOfDoi(this.appSession.selfOrganizationUnitId).subscribe(res => {
            this.initialData = res.data;
        });
    }


    reply(d){
        this._utilityService.selectedDocumentData = d;
        this.router.navigate(['/app/main/qlvb/them-moi-vb-di-doi']);
    }

}