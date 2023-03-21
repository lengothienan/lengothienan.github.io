import { Component, Injector, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DocumentServiceProxy, DocumentHandlingsServiceProxy, GetUserInRoleDto, ODocsServiceProxy, ListDVXL, ApproveDocumentDto, CapNhatChiDaoDto, Comm_booksServiceProxy, PlanDto, PlanServiceProxy, Plan_AssignDto, PlanAssignServiceProxy, PlanAssignReportServiceProxy, Plan_Assign_ReportDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DxFormComponent, DxDataGridComponent } from 'devextreme-angular';

import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import CustomStore from 'devextreme/data/custom_store';

@Component({
    selector: 'ketQuaCongTacDoi',
    templateUrl: './ket-qua-cong-tac-doi.component.html',  
    styleUrls: ['./ket-qua-cong-tac-doi.component.less'],
    animations: [appModuleAnimation()]
})
// Kết quả công tác Phòng
export class KetQuaCongTacDoiComponent extends AppComponentBase implements OnInit{
    @ViewChild('form', { static: true }) form: DxFormComponent;
    @ViewChild('ketQuaCongTacDoiModal', { static: false }) ketQuaCongTacDoiModal: ModalDirective;
    @ViewChild('gridContainerOrg', {static: true}) gridContainerOrg: DxDataGridComponent;
    @Output() saveSuccess = new EventEmitter<any>();
    
    formData: Plan_AssignDto = new Plan_AssignDto();
    planId: number;
    saving = false;
    statusOptions: any;
    status_dataSource = [];
    planAssigns = [];
    store: any;

    constructor(
        injector: Injector,
        private _planAppService: PlanServiceProxy,
        private _planAssignAppService: PlanAssignServiceProxy,
        private _planAssignReportAppService: PlanAssignReportServiceProxy,
        private _activeRoute: ActivatedRoute
    ){
        super(injector);
    }
    ngOnInit(){
        this.initStatusOptions();
    }

    initStatusOptions(){
        this._planAppService.getListEvaluateLevels().subscribe(result => {
            this.status_dataSource = result;
        });
    }

    show(){
        // this.initStatusOptions();
        const self = this;
        this.store = new CustomStore({
            key: "id",
            load: () => {
                const promise = new Promise((resolve) => {
                    resolve(self.formData.list_assign_report);
                });
                return promise;
            },
            insert: (data) => {
                const promise = new Promise((resolve, reject) => {
                    let dto = new Plan_Assign_ReportDto();
                    dto.planAssignId = self.formData.id;
                    dto.dateReport = moment(data.dateReport);
                    dto.contentReport = data.contentReport;
                    dto.note = data.note;
                    dto.isActive = true;
                    dto.isDelete = false;
                    self._planAssignReportAppService.createOrEditPlanAssignReport(dto).subscribe((result) => {
                        self.notify.info("Thêm thành công!");
                        dto.id = result;
                        self.formData.list_assign_report.push(dto);
                        resolve();
                    }, err => {
                        reject(err);
                    });
                });
                return promise;
            },
            update: (key, values) => {
                const promise = new Promise((resolve, reject) => {
                    let flag = false;
                    let dto = new Plan_Assign_ReportDto();
                    dto = self.formData.list_assign_report.find(x => x.id == key);
                    if(values["dateReport"]){
                        dto.dateReport = moment(values["dateReport"]);
                        flag = true;
                    }
                    if(values["contentReport"]){
                        dto.contentReport = values["contentReport"];
                        flag = true;
                    }
                    if(values["note"]){
                        dto.note = values["note"];
                        flag = true;
                    }
                    if(flag){
                        self._planAssignReportAppService.createOrEditPlanAssignReport(dto).subscribe((result) => {
                            self.notify.info("Sửa thành công!");
                            resolve();
                        }, err => {
                            reject(err);
                        });
                    }
                    else {
                        resolve();
                    }
                    
                });
                return promise;
            },
            remove: (key) => {
                const promise = new Promise<void>((resolve, reject) => {
                    self._planAssignReportAppService.deletePlanAssignReport(key).subscribe(() => {
                        self.formData.list_assign_report.splice(self.formData.list_assign_report.findIndex(x => x.id == key), 1);
                        resolve();
                    }, err => {
                        reject();
                    });
                })
                return promise;
            }
        });
        this.ketQuaCongTacDoiModal.show();
    }

    close(){
        this.ketQuaCongTacDoiModal.hide();
        document.getElementById('ketQuaCongTacPhongModal').setAttribute("style", "opacity: 1");
    }

    save(){
        this._planAssignAppService.updateResultOfPlanAssign(this.formData)
        .pipe(finalize(() => {
            this.close();
        })).subscribe(() => {
            this.saveSuccess.emit(null);
            this.notify.info("Cập nhật thành công!");
            this.close();
        }, err => {
            this.message.error("Đã có lỗi xảy ra, vui lòng thử lại!");
        });
    }

    edit(e){
        console.log(e);
    }

    delete(e){

    }

    add(){
        this.gridContainerOrg.instance.addRow();
    }
}
