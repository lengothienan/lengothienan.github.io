import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Component, OnInit, Injector } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { ODocsServiceProxy } from "@shared/service-proxies/service-proxies";
import { Router } from "@angular/router";
import { UtilityService } from "@shared/utils/UltilityService.service";
import { AppSessionService } from '@shared/common/session/app-session.service';
import $ from 'jquery';

@Component({
    templateUrl: './danh-sach-vb-chua-phuc-dap-cua-doi-tu-catp.html',
    animations: [appModuleAnimation()]
})
export class DanhSachVBChuaPhucDapCuaDDoiTuCATPComponent extends AppComponentBase implements OnInit {

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
        console.log(this.appSession);
        this.odocService.getDocumentNoneReplyFromCATPOfDoi(this.appSession.selfOrganizationUnitId).subscribe(res => {

            this.initialData = res.data;
        });
    }


    reply(d){
        this._utilityService.selectedDocumentData = d;
        this.router.navigate(['/app/main/qlvb/them-moi-va-chuyen-cho-catp']);
    }

    onExporting(e){
        debugger
        e.component.beginUpdate();
        e.component.columnOption('NumberPublishDateExport', 'visible', true);
        e.component.columnOption('IncommingNumberDateExport', 'visible', true);
        e.component.columnOption('Deadline', 'visible', true);    
        e.component.columnOption('DirectorProcessExport', 'visible', true);
    }
    onExported(e){  
        e.component.columnOption('NumberPublishDateExport', 'visible', false);
        e.component.columnOption('IncommingNumberDateExport', 'visible', false);
        e.component.columnOption('Deadline', 'visible', false);
        e.component.columnOption('DirectorProcessExport', 'visible', false);
        e.component.endUpdate();  
    }
    
}