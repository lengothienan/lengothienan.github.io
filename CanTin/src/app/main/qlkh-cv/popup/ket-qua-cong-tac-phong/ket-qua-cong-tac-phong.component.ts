import { Component, Injector, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DocumentServiceProxy, DocumentHandlingsServiceProxy, GetUserInRoleDto, ODocsServiceProxy, ListDVXL, ApproveDocumentDto, CapNhatChiDaoDto, Comm_booksServiceProxy, PlanDto, PlanServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DxFormComponent, DxDataGridComponent } from 'devextreme-angular';

import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { KetQuaCongTacDoiComponent } from '../ket-qua-cong-tac-doi/ket-qua-cong-tac-doi.component';


@Component({
    selector: 'ketQuaCongTacPhong',
    templateUrl: './ket-qua-cong-tac-phong.component.html',  
    styleUrls: ['./ket-qua-cong-tac-phong.component.less'],
    animations: [appModuleAnimation()]
})
// Kết quả công tác Phòng
export class KetQuaCongTacPhongComponent extends AppComponentBase implements OnInit{
    @ViewChild('form', { static: true }) form: DxFormComponent;
    @ViewChild('ketQuaCongTacPhongModal', { static: false }) ketQuaCongTacPhongModal: ModalDirective;
    @ViewChild('gridContainerOrg', { static: true }) gridContainerOrg: DxDataGridComponent;
    @ViewChild('ketQuaCongTacDoi', { static: false }) ketQuaCongTacDoi: KetQuaCongTacDoiComponent;
    @Output() saveSuccess = new EventEmitter<any>();
    
    formData: PlanDto = new PlanDto();
    planId: number;
    saving = false;
    statusOptions: any;
    status_dataSource = [
        {type: 1, name: 'Đang thực hiện'}, 
        {type: 2, name: 'Đã hoàn thành'},
        {type: 3, name: 'Tạm ngưng'},
        {type: 4, name: 'Hủy bỏ'}
    ];

    planAssigns = [];

    constructor(
        injector: Injector,
        private _planAppService: PlanServiceProxy,
        private _activeRoute: ActivatedRoute
    ){
        super(injector);
    }
    ngOnInit(){
        this.initStatusOptions();
    }

    initStatusOptions(){
        const self = this;
        this.statusOptions = {
            valueExpr: 'id',
            displayExpr: 'name',
            dataSource: self.status_dataSource
        }
    }

    show(){
        this._planAppService.getListPlanAssign(this.planId).subscribe(result => {
            this.formData = result;
            console.log(result);
            this.planAssigns = result.list_Plan_Assigns;
        });
        this.ketQuaCongTacPhongModal.show();
    }

    close(){
        this.ketQuaCongTacPhongModal.hide();
    }

    save(){
        console.log(this.formData.status)
        this._planAppService.updateStatusOfPlan(this.planId, this.formData.status)
        .pipe(finalize(() => {
            this.close();
        }))
        .subscribe(res => {
            this.saveSuccess.emit(null);
            this.notify.info("Cập nhật thành công!");
            this.close();
            
        }, err => {
            this.message.error("Đã có lỗi xảy ra. Vui lòng thử lại!", "Lỗi");
        })
    }

    edit(e){
        this.ketQuaCongTacDoi.formData = e.data;
        this.ketQuaCongTacDoi.show();
        document.getElementById('ketQuaCongTacPhongModal').setAttribute("style", "opacity: 0.1");
        
    }
}
