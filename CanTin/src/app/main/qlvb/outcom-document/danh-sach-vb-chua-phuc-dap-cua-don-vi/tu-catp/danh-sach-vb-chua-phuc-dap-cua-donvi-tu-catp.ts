import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Component, OnInit, Injector } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { ODocsServiceProxy } from "@shared/service-proxies/service-proxies";
import { Router } from "@angular/router";
import { UtilityService } from "@shared/utils/UltilityService.service";
import { AppSessionService } from '@shared/common/session/app-session.service';
import $ from 'jquery';

@Component({
    templateUrl: './danh-sach-vb-chua-phuc-dap-cua-don-vi-tu-catp.html',
    animations: [appModuleAnimation()]
})
export class DanhSachVBChuaPhucDapCuaDonViTuCATPComponent extends AppComponentBase implements OnInit {

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
        
        this.odocService.getDocumentNoneReplyOfCATP(this.appSession.selfOrganizationUnitId).subscribe(res => {
            this.initialData = res.data;
        });
    }


    reply(d){
        this._utilityService.selectedDocumentData = d;
        this.router.navigate(['/app/main/qlvb/them-moi-vb-di-catp']);
    }
    

    numberCellValue(rowData){
        return rowData.Number;
    }
    numberDVCellValue(rowData){
        return rowData.IncommingNumberDV;
    }

    onExporting(e){
        e.component.beginUpdate();
        e.component.columnOption('bgd', 'visible', true);
        // e.component.columnOption('DoiPhoiHop', 'visible', true);
        e.component.columnOption('number_incomingdatedv', 'visible', true);
        e.component.columnOption('number_publishdate', 'visible', true);
    }
    onExported(e){  
        e.component.columnOption('bgd', 'visible', false);
        // e.component.columnOption('DoiPhoiHop', 'visible', false);
        e.component.columnOption('number_incomingdatedv', 'visible', false);
        e.component.columnOption('number_publishdate', 'visible', false);
        e.component.endUpdate();  
    } 
}