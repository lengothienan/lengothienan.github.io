import CustomStore from 'devextreme/data/custom_store';
import { DxFormComponent, DxDataGridComponent } from 'devextreme-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanServiceProxy, Plan_AssignDto, PlanDto, PlanAssignServiceProxy, DocumentServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { Component, Injector, ViewChild } from "@angular/core";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppComponentBase } from "@shared/common/app-component-base";
import { OrgLevelsServiceProxy } from "@shared/service-proxies/service-proxies";
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
import { formatDate } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { Theme5ThemeUiSettingsComponent } from '@app/admin/ui-customization/theme5-theme-ui-settings.component';

@Component({
    selector: 'themkehoach',
    templateUrl: './them-ke-hoach.component.html',
    styleUrls: ['./them-ke-hoach.component.less'],
    animations: [appModuleAnimation()]
})
export class ThemKeHoachComponent extends AppComponentBase {

    @ViewChild('assignForm', { static: true }) assignForm: DxFormComponent;
    @ViewChild('assignGrid', { static: true }) assignGrid: DxDataGridComponent;

    showButtonAction: any = true;
    action: any = "THÊM MỚI"
    disableEdit: any = false;
    planId: any;
    assigneeDataSource: any = [];
    sercretOption: any;
    planData: any = new PlanDto();
    assignPopupVisible: any = false;
    leaderOption: any;
    teamOption: any;
    assignData: any = {
        assignUser: [],
        assignTeam: [],
        deadline: null,
        assignContent: ''
    }
    teamdataSource: any;
    leaderDataSource: any;
    i: any = 1;
    uploadUrl: any = "";
    dataDisplay = [];
    currentDate = new Date();
    selectedRows: any = [];
    currentTime: any;
    tepDinhKemSave = '';
    rootUrl: string;
    link = '';
    caption: any = "NỘI DUNG BẢN KẾ HOẠCH";
    captionGrid: any = "Chỉ huy/";
    captionGrid1: any = "Đội thực hiện";
    captionAssign: any = "Chỉ huy phòng";
    captionAssign1: any = "Đội";
    org: any = "CẤP PHÒNG/QUẬN";

    orgLevelId: any = 1;

    constructor(
        injector: Injector,
        private planService: PlanServiceProxy,
        private planAssignService: PlanAssignServiceProxy,
        private route: Router,
        private _documentAppService: DocumentServiceProxy,
        private activeRoute: ActivatedRoute) {
        super(injector);
    }

    ngOnInit() {
        var stage = window.localStorage.getItem('PLANACTION')
        const self = this
        this.planService.getRoleUser().subscribe((result) => {
            if (result == "CB" || result == "DT" || result == "DP") {
                self.captionGrid = "Chỉ huy đội/";
                self.captionGrid1 = "CBCS";
                self.captionAssign = "Chỉ huy đội";
                self.captionAssign1 = "CBCS";
                self.org = "CẤP ĐỘI";
                self.orgLevelId = 2;
            }
        })

        this.initSercretOption();
        this.initLeaderOption();
        this.initTeamOption();
        this.initAssignDataSource();
        this.uploadUrl = AppConsts.fileServerUrl  + '/fileUpload/Upload_file?userId=' + this.appSession.userId;
        this.activeRoute.params.subscribe((para) => {
            this.planId = para['id'];
            if (this.planId == 'null') {
                this.planData.list_Plan_Assigns = [];
                this.disableEdit = false;
            } else {
                this.loadPlan();
            }
            if (stage == 'EDIT') {
                this.disableEdit = false;
                this.action = "SỬA"
            } else if (stage == 'VIEW') {
                if (this.planId != 'null') {
                    this.disableEdit = true;
                    this.showButtonAction = false;
                }
                this.action = "XEM"
            } else if (stage == null || this.planId == 'null') {
                this.disableEdit = false;
                this.action = "THÊM MỚI"
            }
        })
        this.link = this.route.url;
        this.addAssign = this.addAssign.bind(this);

    }

    loadPlan() {
        const self = this
        this.planService.getPlanById(this.planId).subscribe((result) => {
            this.planData = result;
            if (result.attachment != "" && result.attachment != null) {
                var files = result.attachment.split(";")
                files.forEach(e => {
                    self.dataDisplay.push({ tepDinhKem: e })
                })
                self.selectedRows = self.selectedRows.concat(self.dataDisplay)
            }

            this.assignGrid.instance.refresh();
        })
    }

    initAssignDataSource() {
        const self = this;
        this.assigneeDataSource = {
            key: 'id',
            load: function () {
                const promise = new Promise((resolve) => {
                    resolve(self.planData.list_Plan_Assigns);
                });
                return promise;
            },
            update: function (key, values) {
                var idx = self.planData.list_Plan_Assigns.findIndex(x => x.id == key);
                if (!(values.assignContent === null || values.assignContent === undefined)) {
                    self.planData.list_Plan_Assigns[idx].assignContent = values.assignContent;
                }
                if (!(values.deadline === null || values.deadline === undefined)) {
                    self.planData.list_Plan_Assigns[idx].deadline = values.deadline;
                }
                self.planData.list_Plan_Assigns[idx].isEdit = true;
            },
            remove: function (key) {
                var idx = self.planData.list_Plan_Assigns.findIndex(x => x.id == key);
                if (this.planId == 'null') {
                    self.planData.list_Plan_Assigns.splice(idx, 1);
                } else {
                    if (self.planData.list_Plan_Assigns[idx].isInsert == false) {
                        self.planAssignService.setDelete(self.planData.list_Plan_Assigns[idx].id).subscribe(() => {
                            self.loadPlan();
                        })

                    }
                }
            }

        }

    }

    nullDateTime(cellInfo){
        debugger;
        if(cellInfo.valueText == "Invalid date"){
            cellInfo.value = '';
            return "";
        }
        else {
            return cellInfo.valueText;
        }
    }


    initSercretOption() {
        const self = this;
        this.sercretOption = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                    const promise = new Promise((resolve, reject) => {
                        self.planService.getSecretLevel().subscribe((res: any) => {
                            resolve(res.data);
                        });
                    });
                    return promise;
                },

            },
            valueExpr: 'Key',
            displayExpr: 'Value',
            showClearButton: true,
            searchEnabled: true,
        }
    }

    initLeaderOption() {
        const self = this;
        this.leaderOption = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                    const promise = new Promise((resolve, reject) => {
                        self.planService.getRoomLeader().subscribe((res: any) => {
                            self.leaderDataSource = res.data;
                            resolve(res.data);
                        });
                    });
                    return promise;
                },

            },
            valueExpr: 'id',
            displayExpr: 'FullName',
            showClearButton: true,
            searchEnabled: true,
        }
    }

    initTeamOption() {
        const self = this;
        this.teamOption = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                    const promise = new Promise((resolve, reject) => {
                        self.planService.getRoomTeam().subscribe((res: any) => {
                            self.teamdataSource = res.data;
                            resolve(res.data);
                        });
                    });
                    return promise;
                },

            },
            valueExpr: 'Id',
            displayExpr: 'DisplayName',
            showClearButton: true,
            searchEnabled: true,
        }
    }
    value: any[] = [];


    setFullNameFile(e: any){
        if(e.value.length == 0) return;

        this.dataDisplay.length = 0;

        let files = [];

        let formData: any = new FormData();
        e.value.forEach(el => formData.append("files", el));
        $.ajax({
            url: this.uploadUrl,
            type: "POST",
            contentType: false,
            processData: false,
            async: false,
            data: formData,
            success: (res) => {
                files = res;
            },
            error: (err) => {
                this.notify.error("Upload file thất bại");
            }
        });

        files.forEach(f => {
            this.dataDisplay.push({ "tepDinhKem": f });
        });
        this.value = [];
        this.selectedRows = this.selectedRows.concat(this.dataDisplay);
        this.tepDinhKemSave = this.selectedRows.map(x => x.tepDinhKem.toString()).join(';')
    }

    save() {
        const self = this;
        //dvxl.dateHandle = moment(this.tpDate).utc(true);
        if(this.planId != 'null'){
            this.saveOrUpdate();
        }
        else {
            this.planService.checkValidNumberPlan(this.planData.numberPlan, this.appSession.selfOrganizationUnitId).subscribe(res => {
                if(!res){
                    self.message.warn("Số kế hoạch đã tồn tại!");
                    return;
                }
                else {
                    this.saveOrUpdate();
                }
            })
        }
    }

    saveOrUpdate(){
        const self = this;
        this.planData.orgId = this.appSession.selfOrganizationUnitId;
        this.planData.orgLevel = self.orgLevelId;
        this.planData.datePlan = moment(this.planData.datePlan).utc(true);
        this.planData.status = 1;

        this.planData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave : null;
        if (this.planId == 'null') {
            this.planData.list_Plan_Assigns.forEach(element => {
                delete element.id;
            });
        } else {
            this.planData.list_Plan_Assigns.forEach(element => {
                if (element.isInsert == true)
                    delete element.id;
            });
        }
        console.log(this.planData)
        this.planService.createOrUpdate(this.planData).subscribe((res) => {
            if (this.planId == 'null')
                abp.notify.success("Thêm mới thành công", "Thông báo");
            else
                abp.notify.success("Cập nhật thành công", "Thông báo");
            window.location.reload();
        })
    }

    back() {
        window.localStorage.removeItem('PLANACTION');
        window.history.back();
    }
    add() {
        this.assignData = {
            assignUser: [],
            assignTeam: [],
            deadline: null,
            assignContent: ''
        }
        this.assignPopupVisible = true;
    }

    addAssign = (): void => {
        const self = this;
        debugger
        if (this.assignData.assignUser.length == 0 && this.assignData.assignTeam.length == 0) {
            this.message.error("Chưa có chỉ huy phòng hoặc đội được chọn!", "Lỗi");

        }
        if (this.assignData.assignUser.length > 0) {
            this.assignData.assignUser.forEach(element => {
                if (this.planData.list_Plan_Assigns.findIndex(p => p.userId == element) < 0) {
                    var assign = new Plan_AssignDto();
                    assign.userId = element;
                    assign.deadline = this.assignData.deadline? moment(this.assignData.deadline).utc(true): null;
                    assign.assignContent = this.assignData.assignContent;
                    assign.id = this.i;
                    assign.isSeen = false;
                    assign.isInsert = true;
                    var idx = this.leaderDataSource.findIndex(x => x.id == element);
                    assign.userFullName = this.leaderDataSource[idx].FullName;
                    this.i++;

                    this.planData.list_Plan_Assigns.push(assign);
                }
            });
        }
        if (this.assignData.assignTeam.length > 0) {
            this.assignData.assignTeam.forEach(element => {
                if (this.planData.list_Plan_Assigns.findIndex(p => p.orgId == element) < 0) {
                    var assign = new Plan_AssignDto();
                    if (this.orgLevelId == 1)
                        assign.orgId = element;
                    else if (this.orgLevelId == 2)
                        assign.userId = element;
                    assign.deadline = this.assignData.deadline? moment(this.assignData.deadline).utc(true): null;
                    assign.assignContent = this.assignData.assignContent;
                    var idx = this.teamdataSource.findIndex(x => x.Id == element);
                    assign.orgName = this.teamdataSource[idx].DisplayName;
                    assign.id = this.i;
                    assign.isSeen = false;
                    assign.isInsert = true;
                    this.i++;
                    this.planData.list_Plan_Assigns.push(assign);
                }
            });
        }
        this.assignGrid.instance.refresh();
        this.assignPopupVisible = false;
    }

    close = (): void => {
        this.assignPopupVisible = false;
    }

    urlExists(url) {
        return fetch(url, {mode: "no-cors"})
          .then(res => true)
          .catch(err => false)
      }
    showDetail(e:any)
    {
        this.rootUrl = AppConsts.fileServerUrl ;
        this.link = this.rootUrl + "/" + e.row.data.tepDinhKem;
        console.log(e.row.data.tepDinhKem.substring(e.row.data.tepDinhKem.indexOf("_")+1,e.row.data.tepDinhKem.length))
        this.urlExists(this.link).then(result => {
            if(result){
                window.open(this.link, '_blank');
            }else{
                var lenghtLink = e.row.data.tepDinhKem.length;
                const withoutLastChunk = e.row.data.tepDinhKem.substring(e.row.data.tepDinhKem.indexOf("_")+1,lenghtLink);
                this.link = this.rootUrl + "/" + withoutLastChunk;
                window.open(this.link, '_blank');
            }
        })
        
    }

    deleteFile(e:any)
    {
        this.selectedRows.splice(this.selectedRows.findIndex(x=>x.tepDinhKem===e.data.tepDinhKem), 1);
        // this.selectedRows.splice(this.selectedRows.indexOf(e.row.data.tepDinhKem), 1);
        this.tepDinhKemSave = this.selectedRows.map(x => {return x.tepDinhKem.toString()}).join(';');

        $.ajax({
            url: AppConsts.fileServerUrl  + `/fileUpload/Delete_file?documentName=${e.data.tepDinhKem}`,
            type: "delete",
            contentType: "application/json",
            success: (res) => {
                this._documentAppService.deleteDocumentFileInServer(e.data.tepDinhKem, 0).subscribe(() => {});
            },
            error: (err) => {

            }
        });
    }
}
