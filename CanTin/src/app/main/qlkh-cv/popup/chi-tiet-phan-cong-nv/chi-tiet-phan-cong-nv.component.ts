import { Component, Injector, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DxFormComponent, DxDataGridComponent } from 'devextreme-angular';
import { ModalDirective } from 'ngx-bootstrap';
import { PlanServiceProxy } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'chiTietPhanCongNV',
    templateUrl: './chi-tiet-phan-cong-nv.component.html',  
    styleUrls: ['./chi-tiet-phan-cong-nv.component.less'],
    animations: [appModuleAnimation()]
})

export class ChiTietPhanCongNVComponent extends AppComponentBase implements OnInit{
    @ViewChild('form', { static: true }) form: DxFormComponent;
    @ViewChild('chiTietPhanCongNVModal', { static: false }) chiTietPhanCongNVModal: ModalDirective;
    @ViewChild('gridContainerOrg', { static: true }) gridContainerOrg: DxDataGridComponent;

    planId: number;
    planAssigns: any;

    ngOnInit(){
        
    }
    constructor(
        injector: Injector,
        private _planAppService: PlanServiceProxy,
        private _activeRoute: ActivatedRoute
    ){
        super(injector);
    }

    show(){        
        this._planAppService.getDetailsPlanAssign(this.planId).subscribe(res => {
            this.planAssigns = res.data;
            // console.log(this.planAssigns);
        })
        this.chiTietPhanCongNVModal.show();
    }
    close(){
        this.chiTietPhanCongNVModal.hide();
    }
}