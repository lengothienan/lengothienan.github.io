import { Component, Injector, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DocumentServiceProxy, DocumentHandlingsServiceProxy, GetUserInRoleDto, ODocsServiceProxy, ListDVXL, CapNhatChiDaoDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DxFormComponent } from 'devextreme-angular';

import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';


@Component({
    selector: 'yKienChiDaoVB',
    templateUrl: './yKienChiDaoVB.component.html',
    animations: [appModuleAnimation()]
})
//ý kiến chỉ đạo cho vb đến từ đội
export class YKienChiDaoVBComponent extends AppComponentBase implements OnInit{
    @ViewChild('yKienChiDaoModal', { static: false }) yKienChiDaoModal: ModalDirective;
    @ViewChild('publisherForm', { static: false }) publisherForm: DxFormComponent;
    @Output() saveSuccess = new EventEmitter<any>();
    @Output() listDVXL_Select = new EventEmitter<ListDVXL[]>();
    //@Input() docId: number;
    saving = false;
    data_department = [];
    data_department_initial = [];
    selectionChangedBySelectbox: boolean;
    phoPhong: GetUserInRoleDto[];
    truongPhong: GetUserInRoleDto[];
    truongPhongVal: number;
    phoPhongVal: number;
    truongPhongObj: any;
    phoPhongObj: any;
    tpComment = '';
    ppComment = '';
    tpDateHandle: Date;
    ppDateHandle: Date;
    doiTruongVal: number;
    phoDoiTruongVal: number;
    doiTruongObj: any;
    phoDoiTruongObj: any;
    dtComment = '';
    pdtComment = '';
    tpName = '';
    ppName = '';
    deadline = '';
    //lưu id của đơn vị chủ trì
    previousMainHandlingId: number;
    old_DVXL = [];
    currentDate = new Date();
    isDirty = false; // có thay đổi ĐVXL
    listDVXL_selected: ListDVXL[] = [];
    documentHandlingId: number;
    docId: number;
    oldChiDao = '';
    capNhatDto: CapNhatChiDaoDto = new CapNhatChiDaoDto();
    incommingNumber = '';
    hideComment = false;
    dtDate: Date = new Date();
    pdtDate: Date = new Date();
    tpDateOptions: any;
    ptpDateOptions: any;
    formData: any;
    currenDate = new Date();
    disabled = false;
    constructor(
        injector: Injector,
        private _oDocsServiceProxy: ODocsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _documentHandlingAppService: DocumentHandlingsServiceProxy) {
        super(injector);
    }
    ngOnInit(): void {
        this.getUserInOrg();
        //this.getTeamInOrg();
    }

    show(){
        //this.getOrgLevel();
        this.getInitial();
        this.yKienChiDaoModal.show();

    }

    getTeamInOrg(){
        this._documentAppService.getListDepartment(this.appSession.organizationUnitId).subscribe(res =>{
            this.data_department_initial = res;
            this.data_department_initial.forEach(x => {
                x["mainHandling"] = false;
                x["coHandling"] = false;
                //this.loaiDV[1].dataSource.push(x);
            });
        });
    }

    setData_department(){
        this.data_department_initial.forEach(x => {
            x["mainHandling"] = false;
            x["coHandling"] = false;
        });
    }

    getUserInOrg(){
        this._oDocsServiceProxy.getUserInRoleByOrg(this.appSession.selfOrganizationUnitId, '').subscribe((res)=>{
            console.log(res);
            this.truongPhong = res.filter(x => x.roleCode == 'DT');
            this.phoPhong = res.filter(x => x.roleCode == 'PDT');
            this.data_department_initial = res.filter(x => x.roleCode == 'CB');
            this.data_department_initial.forEach(x => {
                x["mainHandling"] = false;
                x["coHandling"] = false;
            });
        });
    }

    setChiDaoInitial(){
        this.doiTruongVal = null;
        this.phoDoiTruongVal = null;
        this.dtComment = null;
        this.pdtComment = null;
        this.tpDateHandle = null;
        this.ppDateHandle = null;
    }

    getInitial(){
        this.data_department_initial.forEach(x => {
            x["mainHandling"] = false;
            x["coHandling"] = false;
        });
        this.setChiDaoInitial();
        if(this.capNhatDto.listDocs.length == 1){
            this._documentHandlingAppService.get_DVXL_ForDocument_Dept(this.capNhatDto.listDocs[0].documentId).subscribe((res) => {
                this.old_DVXL = res;

                //let doi = res.filter(x => x['OrganizationId'] !== 0);
                this.phoPhongObj = res.filter(x => x['TypeHandling'] == 0 && x['OrganizationId'] == 0)[0];
                if(this.phoPhongObj){
                    this.ppComment = this.phoPhongObj['ProcessingRecommended'];
                    this.ppName = 'Đ/C ' + this.phoPhongObj['FullName'];
                    this.ppDateHandle = this.phoPhongObj['DateHandle'];
                }
                this.truongPhongObj = res.filter(x => x['TypeHandling'] == 1 && x['OrganizationId'] == 0)[0];
                if(this.truongPhongObj){
                    this.tpComment = this.truongPhongObj['ProcessingRecommended'];
                    this.tpName = 'Đ/C ' + this.truongPhongObj['FullName'];
                    this.tpDateHandle = this.truongPhongObj['DateHandle'];
                }
                this.data_department.length = 0;
                this.data_department = [].concat(this.data_department_initial);

            });
        }
        else if(this.capNhatDto.listDocs.length > 1){
            this.data_department.length = 0; 
            this.data_department = [].concat(this.data_department_initial);
        }
        if(this.incommingNumber.split(';').length > 1){
            this.hideComment = true;
        }
        else{
            this.hideComment = false;
        }
    }

    setListDVXL(){
        this.listDVXL_selected.length = 0;

        if(this.doiTruongVal){
            let dvxl = new ListDVXL();
            dvxl.userId = this.doiTruongVal;
            dvxl.typeHandling = 1;
            dvxl.processRecomend = this.dtComment;
            if(this.dtDate !== null){
                dvxl.dateHandle = moment(this.dtDate);
            } 
            this.listDVXL_selected.push(dvxl);
        }

        if(this.phoDoiTruongVal){
            let dvxl = new ListDVXL();
            dvxl.userId = this.phoDoiTruongVal;
            dvxl.typeHandling = 0;
            dvxl.processRecomend = this.pdtComment;
            if(this.pdtDate !== null){
                dvxl.dateHandle = moment(this.pdtDate);
            } 
            this.listDVXL_selected.push(dvxl);
        }

        for(var i = 0, j = this.data_department.length; i < j; i++){
            if(this.data_department[i].mainHandling == true || this.data_department[i].coHandling == true){
                let dvxl = new ListDVXL();
                dvxl.userId = this.data_department[i].userId;
                dvxl.unitId = this.data_department[i].organizationUnitId;
                dvxl.dateHandle = moment(new Date());
                if(this.data_department[i].mainHandling == true){
                    dvxl.typeHandling = 1;
                }
                else if(this.data_department[i].coHandling == true){
                    dvxl.typeHandling = 0;
                }
                this.listDVXL_selected.push(dvxl);
            }
        }
        this.capNhatDto.listDVXLs = this.listDVXL_selected;
    }

    initTpDateOptions(){
        const that = this;
        let x = new Date();
        this.tpDateOptions = {
            showClearButton: true,
            displayFormat: 'dd/MM/yyyy',
            format: 'dd/MM/yyyy',
            value: '20/10/2020',
            onValueChanged: function(e){

            }
        };
    }

    initPtpDateOptions(){
        const that = this;
        this.ptpDateOptions = {
            showClearButton: true,
            displayFormat: 'dd/MM/yyyy',
            format: 'dd/MM/yyyy',
            value: this.currenDate,
            onValueChanged: function(e){
            }
        };
    }

    onCheckBoxChanged(e, cell)
    {
        let index = this.data_department.findIndex(x => x.userId == cell.data.userId);
        //kiểm tra cột vừa thao tác là main hay co
        switch(cell.column.dataField){
            case 'mainHandling':
                //kiểm tra có đvxl chính chưa, nếu có rồi thì bỏ chọn cái trước
                if(this.previousMainHandlingId >= 0){
                    let temp = this.data_department.findIndex(x => x.userId == this.previousMainHandlingId);
                    this.data_department[temp]["mainHandling"] = false;
                }

                if(this.data_department[index]["coHandling"] == true){
                    this.data_department[index]["coHandling"] = false;
                }

                this.data_department[index]["mainHandling"] = e.value;

                //giữ id của đơn vị đang nắm chủ trì
                this.previousMainHandlingId = cell.data.userId;
                break;
            case 'coHandling':
                if(this.data_department[index]["mainHandling"] == true){
                    this.data_department[index]["mainHandling"] = false;
                }

                this.data_department[index]["coHandling"] = e.value;
        }
    }

    save(){
        debugger
        this.setListDVXL();
        if(!this.capNhatDto.listDVXLs || this.capNhatDto.listDVXLs.filter(x => x.unitId > 0 && x.userId > 0).length == 0){
            this.message.warn('Vui lòng chọn cán bộ xử lý');
            return;
        }

        if (!this.checkPCXL()) {
            this.message.warn('Vui lòng chọn cán bộ chủ trì ');
            return;
        }

        this.disabled = true;
        this._documentAppService.multipleCapNhatChiDaoDoi(this.capNhatDto)
        .pipe(finalize(()=>{
            document.getElementById('TopMenu2').click();
            this.disabled = false;
            this.close();
        }))
        .subscribe(()=>{
            document.getElementById('TopMenu2').click();
            this.saveSuccess.emit(null);
            this.message.success('Cập nhật chỉ đạo thành công');
        })
    }

    close(){
        this.yKienChiDaoModal.hide();
    }

    checkPCXL() {
        debugger
        let hasCoHandling = false;
        let hasMainHandling = false;
        for (let data of this.data_department) {
            if (data.coHandling == true) {
                hasCoHandling = true;
                break;
            }
        }
        if (hasCoHandling) {
            for (let data of this.data_department) {
                if (data.mainHandling == true) {
                    hasMainHandling = true;
                    break;
                }
            }
        }
        if ((hasMainHandling && hasCoHandling) || (!hasMainHandling && !hasCoHandling))
            return true;
        return false;
    }
}
