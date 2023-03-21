import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { GetDocInputForSearchDto,HistoryUploadsServiceProxy, DocumentServiceProxy, Idoc_starsServiceProxy, CreateOrEditIdoc_starDto, DocumentHandlingDetailDto, DocumentHandlingsServiceProxy, DynamicGridHelperServiceProxy, DynamicFieldsServiceProxy, DirectorOpinionDto, ListDVXL, ApproveDocumentDto, CapNhatInputDto, Comm_booksServiceProxy, PrintReportToLeaderDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { Router, NavigationEnd } from '@angular/router';
import { DxDataGridComponent, DxFormComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { AppConsts } from '@shared/AppConsts';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { AppSessionService } from '@shared/common/session/app-session.service';
import moment from 'moment';
//import { CreateNewIncommingDocumentComponent } from '../documentReceive/create-document/create-new-incomming-document';
import $ from 'jquery';
import { YKienChiDaoComponent } from '@app/main/documentHelper/yKienChiDao.component';

@Component({
    templateUrl: './vb-noi-khac-chua-trinh.component.html',
    animations: [appModuleAnimation()]
})
export class VBNoiKhacChuaTrinhComponent extends AppComponentBase implements OnInit {
    @Input() actionID: string;
    // @Output() lbId = new EventEmitter<number>();
    @ViewChild(DxDataGridComponent, { static: true }) gridContainer: DxDataGridComponent;
    // @ViewChild('transferHandleModal', { static: true }) transferHandleModal: TransferHandleModalComponent;
    @ViewChild('dynamicModule', { static: true }) dynamicModule: DynamicModuleComponent;
    // @ViewChild('createNewIncommingDocument', { static: false }) createNewIncommingDocument: CreateNewIncommingDocumentComponent;
    @ViewChild('gridContainer113', { static: true }) gridContainer113: DxDataGridComponent;
    @ViewChild("BGDSelectBox", { static: false }) BGDSelectBox: DxSelectBoxComponent;
    @ViewChild('buttonUI', { static: true}) buttonUI: ButtonUIComponent;
    @ViewChild('yKienChiDao', { static: false}) yKienChiDao: YKienChiDaoComponent;
    @ViewChild('selectBoxDoi', {static: true}) selectBoxDoi: DxSelectBoxComponent;
    @ViewChild('formReport', {static: true}) formReport: DxFormComponent;
    totalCount: number = 0;
    saving = false;
    rawSql: string;
    user_ID: any;
    userID: any;
    header: string;
    selectionChangedBySelectbox: boolean;
    prefix = '';
    dataRowDetail: any;
    initialData: any;
    selectedID:any;
    labelId: number;
    now: Date = new Date();
    historyPopupVisible = false;
    popup_Visible = false; // popup trình BGĐ
    popup_Visible_detail = false; // popup Cập nhật KQGQ
    toggleStared = false;
    history_Upload = [];
    rootUrl = '';
    selectedRows = [];
    selectedRowsData: any[] = [];
    data_Row: string;
    link = '';
    allMode: string;
    checkBoxesMode: string;
    selectedItems: any[] = [];
    parameters: any;
    num: number[] = [];
    directions: any;
    director_list = [];
    selected: any; // directorId selected
    popup_Visible_bgd: false;
    currentDate: Date;
    selectedDirector: any;
    captain_department = [];
    numberOfDaysByDocType = 0;
    director: any;
    data_DVXL = [];
    //đơn vi jxử lý của popup cập nhật kết quả giải quyết
    data_DVXL_CNKQGQ = [];
    getLeaderList_PGD = [];
    data_publisher = [];
    previousMainHandlingId: number;
    previousMainHandlingIndex: number;
    printUrl = '';
    hasAdvanceFilter = true;
    docId: number;
    popup_FilePhieuTrinh = false;
    dataFilePhieuTrinh: any;
    CHPhong = [];
    DSDoi = [];
    CHDoi1 = [];
    isAutomatic = true;
    chkAutomaticValue = false;
    dataBook = [];
    daVaoSo = false;
    isChooseBook = true;
    isDisableTextBox:any;
    constructor(
        injector: Injector,
        private ultility: UtilityService,
        private _appSessionService: AppSessionService,
        private router: Router,
        private _dynamicGridServiceProxy: DynamicGridHelperServiceProxy,
        private _historyUploadsServiceProxy: HistoryUploadsServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _idocStarServiceProxy: Idoc_starsServiceProxy,
        private _commBookService: Comm_booksServiceProxy,
        private _documentHandlingAppService:DocumentHandlingsServiceProxy) {
        super(injector);
        this.printUrl = AppConsts.remoteServiceBaseUrl + '/ExportFile/GetInCommReportForLeader';
        this.router.routeReuseStrategy.shouldReuseRoute = function(){
            return false;
        }

        this.router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
               // trick the Router into believing it's last link wasn't previously loaded
               this.router.navigated = false;
               // if you need to scroll back to top, here is the right place
               window.scrollTo(0, 0);
            }
        });

        this.link = this.router.url;
        this.user_ID = this._appSessionService.userId;
        this.allMode = 'allPages';
        this.checkBoxesMode = 'onClick';
        this.currentDate = new Date();
    }

    ngOnInit() {
        this.toDateVal = new Date();
        this.fromDateVal = new Date((new Date()).getFullYear(),(new Date()).getMonth(),(new Date()).getDate()-14);
        this.loadDocumentData();
        this.getListDepartment();

        this._documentHandlingAppService.getLeaderList_PGD().subscribe(res  =>{
            this.director_list = res;
            for(var i = 0, len = this.director_list.length; i < len; i++){
                this.director_list[i]["nameWithPosition"] = (this.director_list[i]["position"] != null? (this.director_list[i]["position"] + " - ") : "") + this.director_list[i]["fullName"];
            }
        });

        this._documentHandlingAppService.getLeaderList_PB().subscribe(res  => {
            this.captain_department = res;
        });

        this.loadData();

        this._commBookService.getAllComm_BookByOrgAndType(this.appSession.organizationUnitId, "1").subscribe(res => {
            this.dataBook = res;

        });
        this.yKienChiDao.book=0;
    }

    async loadDocumentData() {
      this.search()
    } 

    loadData(){
        // this._documentAppService.getAllIncommingDocumentToUnit(this.appSession.organizationUnitId).subscribe(res  => {
        //     this.initialData = res;
        //     console.log(res)
        //     this.totalCount = this.initialData.length;
        // });
        this._documentHandlingAppService.getLeaderList_PhongBan(this.appSession.organizationUnitId).subscribe(res => {
            this.CHPhong = res;
            for(var i = 0, len = this.CHPhong.length; i < len; i++){
                this.CHPhong[i]["nameWithPosition"] = this.CHPhong[i]["fullName"] + " - " + this.CHPhong[i]["roleName"];
            }
        });
        this._documentHandlingAppService.getList_Doi(this.appSession.organizationUnitId).subscribe(res => {
            if (res.length > 0) {
                this.DSDoi = res;
            }
        });
        // this._documentHandlingAppService.getLeaderList_Doi1(this.appSession.organizationUnitId).subscribe(res => {
        //     if (res.length > 0) {
        //         this.CHDoi1 = res;
        //         for(var i = 0, len = this.CHDoi1.length; i < len; i++){
        //             this.CHDoi1[i]["nameWithPosition"] = this.CHDoi1[i]["fullName"] + " - " + this.CHDoi1[i]["roleName"];
        //         }
        //     }
        // });
    }


    initFormReport(){
        for(var member in this.dataFilePhieuTrinh) delete this.dataFilePhieuTrinh[member];
    }

    async printReport_popUp(){
        //  this.formReport.instance.resetValues();
        //  this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        for(var i = 0, len = this.selectedRowsData.length; i < len; i++){
            if(this.selectedRowsData[i].DocumentHandlingDetailId !=null){
                await this._documentAppService.seenDocument(this.selectedRowsData[i].DocumentHandlingDetailId)         
                .toPromise().then(res=>{
                     this.selectedRowsData[i].IsSeen=1;
                });
            }else{
                this.selectedRowsData[i].IsSeen=1;
            }
            
        }
        console.log(this.selectedRowsData);
        if(this.selectedRowsData.length > 1){
            let check = false;
            this.selectedRowsData.forEach(ele => {
                if(ele.IncommingNumberDV == null){
                    check = true;
                }
            });
            if(check) {
                this.message.warn("Văn bản chưa cho số chỉ được xử lý từng văn bản");
                return;
            }
        }

        this.initFormReport();
        if(this.selectedRowsData.length > 0){
            console.log(this.selectedRowsData)
            let docData = this.selectedRowsData[0];
            if(docData.IncommingNumberDV != null){
                this.dataFilePhieuTrinh.bookDV = docData.BookDV;
                this.dataFilePhieuTrinh.incommingDateDV = docData.IncommingDateDV;
                this.dataFilePhieuTrinh.incommingNumberDV = docData.IncommingNumberDV;
                this.dataFilePhieuTrinh.processingRecommendedDV = docData.ProcessingRecommendedDV;
                this.daVaoSo = true;
            }
            else{
                this.dataFilePhieuTrinh.incommingDateDV = this.currentDate;
                this.daVaoSo = false;
            }

            // lấy thông tin phiếu trình
            this._documentAppService.getPhieuTrinh(docData.Id).subscribe(res => {
                if(res.code == "200"){
                    
                    this.dataFilePhieuTrinh.chPhong = res.data.chPhongId;
                    this.selectBoxDoi.instance.option('value', res.data.doiPHId);
                    this.dataFilePhieuTrinh.chDoi1 = res.data.doiCTId;
                    this.dataFilePhieuTrinh.processingRecommendedDV = res.data.yKien;

                    this.popup_FilePhieuTrinh = true;
                }else{
                    this.notify.error(res.message);
                }
            });
            

        }

    }

    printReport(){
        debugger
        if(!this.formReport.instance.validate().isValid) return;

        

        this.selectedRowsData.forEach(ele => {

            let data = ele;
            if(data.IncommingNumberDV == null){

                let params = new PrintReportToLeaderDto();
                params.docId = Number.parseInt(data.Id);
                params.bookDV = this.dataFilePhieuTrinh.bookDV;
                params.incommingNumberDV = this.dataFilePhieuTrinh.incommingNumberDV;
                params.incommingDateDV = this.dataFilePhieuTrinh.incommingDateDV;
                // params.processingRecommendedDV = data.ProcessingRecommendedDV;
                this._documentAppService.putDocumentIntoBookDV(params).subscribe(res => {
                    this.print(data);
                });
            }
            else {
                this.print(data);
            }
        });
    }

    print(data){
        const that = this;
        let data1 = this.selectedRowsData.find(e => e.Id == data.Id);
        let leaderName = this.CHPhong.find(x => x["userId"] == this.dataFilePhieuTrinh.chPhong);
        let teamLeaderName = this.CHDoi1.find(x => x["userId"] == this.dataFilePhieuTrinh.chDoi1);
        var url = this.printUrl;
        url = url.split(' ').join('%20');

        // truong hop null
        if(that.dataFilePhieuTrinh.processingRecommendedDV == null) that.dataFilePhieuTrinh.processingRecommendedDV = "";

        $.ajax({
            url: url,
            method: 'POST',
            xhrFields: {
                responseType: 'blob',
            },
            data: {
                documentId: data.Id,
                orgName: this.appSession.orgName,
                orgShortName: this.appSession.orgShortName,
                leaderName: leaderName["nameWithPosition"],
                processingRecommended: this.dataFilePhieuTrinh.processingRecommendedDV,
                position: leaderName['position'],
                team_position:  teamLeaderName.position,
                role: teamLeaderName.roleName,
                teamLeaderName: teamLeaderName.fullName,
                teamName: this.selectBoxDoi.instance.option('displayValue'),
                publisherName: data1['PublisherName'],
                doiChuTri: '',
                doiPhoiHop: '',
                orgId: that.appSession.organizationUnitId
            },
            success: function (data) {

                // update phieu trình
                that._documentAppService.updatePhieuTrinh(data1.Id, that.dataFilePhieuTrinh.chPhong, that.selectBoxDoi.instance.option('value'), that.dataFilePhieuTrinh.chDoi1, that.dataFilePhieuTrinh.processingRecommendedDV).subscribe(res =>{
                    if(res.code == "200"){
                        that.loadDocumentData();
                    }else{
                        that.notify.error(res.message);
                    }
                });
                let d = that.initialData.findIndex(x => x.Id == data1.Id);
                that.initialData[d]["BookDV"] = data1.BookDV;
                that.initialData[d]["IncommingDateDV"] = data1.IncommingDateDV;
                that.initialData[d]["IncommingNumberDV"] = data1.IncommingNumberDV;
                var a = document.createElement('a');
                var url = window.URL.createObjectURL(data);
                a.href = url;
                // var fullTimeStr = current.getHours().toString() + current.getMinutes() + current.getSeconds()
                //     + current.getDate() + (current.getMonth() + 1) + current.getFullYear();

                // if(data1.IncommingNumberDV==null) {
                //     a.download = that.dataFilePhieuTrinh.incommingNumberDV + '.doc'
                // }else{
                //     a.download = that.dataFilePhieuTrinh.incommingNumberDV + '.doc'
                // }

                a.download = data1.IncommingNumberDV==null?that.dataFilePhieuTrinh.incommingNumberDV:data1.IncommingNumberDV + '.doc';
                document.body.append(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

            },
            complete: function(e){
                that.popup_FilePhieuTrinh = false;
            }
        });
    }

    getListDepartment(){
        this._documentAppService.getListPhongBanCATP().subscribe(res =>{
            this.data_DVXL = res;
            for(var i = 0, len = this.data_DVXL.length; i < len; i++){
                this.data_DVXL[i]["mainHandling"] = false;
                this.data_DVXL[i]["coHandling"] = false;
            }
        });
    }

    nhap_moi_vb(){
        this.router.navigate(['/app/main/qlvb/them-vb-phong']);
    }

    getActionID(event) {
        this.actionID = event;
        switch (this.actionID) {
            case 'hasReturn':
                this.return();
                break;
            case 'hasFinish':
                this.has_Finish();
                break;
            case 'transfer_Department':
                this.transfer_PB();
                break;
            case 'add_Transfer_Vice_President':
                this.transfer_PGD();
                break;
            case 'add_Transfer_Department':
                this.transfer_PB();
                break;
            case 'hasSaveAndTransfer':

                break;
            case 'add_Transfer_Organize':
                // chuyen bo sung to
                this.has_Transfer_Nest()
                break;
            case 'hasReport':

                break;
            case 'additional_Transfer_Soldier_officer':
                this.has_Transfer_CBCS();
                break;
            case 'transfer_Soldier_officer':
                // chuyen CBCS
                this.has_Transfer_CBCS();
                break;
            case 'transfer_Organize':
                // chuyển cho Tổ
                this.has_Transfer_Nest();
                break;

            case 'submit_to_the_director':
                if(this.selectedRowsData.length > 1){
                    this.submit_to_the_director();
                }
                else{
                    this.trinhBGD();
                }
                break;
            case 'hasAddNew':
                this.create();
                break;
            case 'transfer_Vice_President':
                this.transfer_PGD();
                break;
            case 'submit_to_the_manager':
                // this.transfer_head_department(); // trình trưởng phòng
                break;
            case 'approve_Multiple':
                if(this.selectedRowsData.length > 1)
                {
                    this.approve_Multiple_Func();
                }

                else{
                    this.approveDocument();
                }
                break;
            default:
                break;
        }
    }


    popup_Visible_detail_XL = false;
    old_DVXL = [];
    data_DVXL_KQXL = [];

    getIncommingNumber(soVB){
        this._documentAppService.getNextIncommingNumber(soVB).subscribe(res => {
            this.dataFilePhieuTrinh.incommingNumberDV = res;
        });
    }

    chkAutomatic(e: any) {
       
        if (e.value == true) { // nút tự động được chọn
            this.getIncommingNumber(this.dataFilePhieuTrinh.bookDV);
            this.isAutomatic = true;

        }else{
            this.isAutomatic = false;
        }
    }

    bookDVChanged = (e) => {
        if(this.daVaoSo == false) {
            if(e.value != null) {
                this.chkAutomaticValue = true;
                this.isChooseBook = false;
                
                if(this.chkAutomaticValue) this.getIncommingNumber(e.value)
                // if(this.isAutomatic) {
                //     this.isDisableTextBox = true;
                // }
            }else{
                this.isChooseBook = true;
            }
        }
    }

    // Xu ly khi double click vào datagrid ở màn hình Chưa duyệt
    startEdit(e) {
        this.processingResult = new DocumentHandlingDetailDto();
        this.currentDate = new Date();
        this.dataRowDetail = e.data ;
        if(this.labelId == 84)
        {
            console.log("a");
            this.popup_Visible_detail = true;

            this.data_DVXL.forEach(x => {
                x["mainHandling"] = false;
                x["coHandling"] = false;
            });
            this._documentHandlingAppService.get_DVXL_ForDocument(this.selectedRowsData[0].Id, this.selectedRowsData[0].UnitId).subscribe((res) => {
                this.old_DVXL = res;
                this.old_DVXL.forEach((ele) => {
                    let index = this.data_DVXL.findIndex(x => x.id == ele.OrganizationId);
                    switch(ele.TypeHandling){
                        case 1:
                            this.data_DVXL[index]["mainHandling"] = true;
                            this.data_DVXL[index]["coHandling"] = false;
                            this.previousMainHandlingId = this.data_DVXL[index].id;
                            break;
                        case 0:
                            this.data_DVXL[index]["mainHandling"] = false;
                            this.data_DVXL[index]["coHandling"] = true;
                            break;
                        default:
                            this.data_DVXL[index]["mainHandling"] = false;
                            this.data_DVXL[index]["coHandling"] = false;
                    }
                });
                // this.gridContainer113.instance.repaint();
            });
            //   this.selectedRowsData[0].processingRecommended;
        }
        else if(this.labelId != 6 && this.labelId != 85)
        {
            let temp = [];
            temp = this.data_DVXL.map(function(x) { return {...x} });
            this._documentHandlingAppService.get_DVXL_ForDocument(this.selectedRowsData[0].Id, this.selectedRowsData[0].UnitId).subscribe((res) => {
                this.old_DVXL = res;
                this.old_DVXL.forEach((ele) => {
                    let index = temp.findIndex(x => x.id == ele.OrganizationId);
                    switch(ele.TypeHandling){
                        case 1:
                            temp[index]["mainHandling"] = true;
                            temp[index]["coHandling"] = false;
                            this.previousMainHandlingId = temp[index].id;
                            break;
                        case 0:
                            temp[index]["mainHandling"] = false;
                            temp[index]["coHandling"] = true;
                            break;
                        default:
                            temp[index]["mainHandling"] = false;
                            temp[index]["coHandling"] = false;
                            break;
                    }
                });
                this.data_DVXL_CNKQGQ = temp.filter(x => x.mainHandling || x.coHandling);
                console.log(this.data_DVXL_CNKQGQ);
                // this.gridContainer113.instance.repaint();
            });
            this.popup_Visible_detail_XL = true;

        }
    }

    onValueChanged (e) {
        // const newValue = e.value;
        this.selectedID =  e.value ;

        // Event handling commands go here
    }
    //Chuyen trang report
    inbaocao(e: any) {

        console.log(e)
        this.router.navigate(['/app/main/qlvb/report/' + e.data.Id]);
        this.historyPopupVisible = true;
    }

    loadCHDoi(e){
        if (e.value != undefined) {
            this._documentHandlingAppService.getListLeader_Doi(e.value).subscribe(res => {
                if (res.length > 0) {
                    this.CHDoi1 = res;
                    for(var i = 0, len = this.CHDoi1.length; i < len; i++){
                        this.CHDoi1[i]["nameWithPosition"] = this.CHDoi1[i]["fullName"] + " - " + this.CHDoi1[i]["roleName"];
                    }
                }
            });
        }
    }

    popUpClass()
    {
        return "popUpClass";
    }

    update_ykien() {
        // return;
        this.spinnerService.show();
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            return;
        }

        else {
            this.saving = true;
            var dvxl = new DirectorOpinionDto();
            dvxl.processingRecommended = this.dataRowDetail.ProcessingRecommended;
            dvxl.listDVXLs = [];
            for(var i = 0, len = this.data_DVXL.length; i < len; i++){
                if(this.data_DVXL[i].mainHandling == true){
                    var temp = new ListDVXL();
                    temp.unitId = this.data_DVXL[i].id;
                    temp.typeHandling = 1;
                    dvxl.listDVXLs.push(temp);
                    // this._documentHandlingDetailServiceProxy.createOrEdit(record).subscribe(()=>{});
                }
                else if(this.data_DVXL[i].coHandling == true){
                    var temp = new ListDVXL();
                    temp.unitId = this.data_DVXL[i].id;
                    temp.typeHandling = 0;
                    dvxl.listDVXLs.push(temp);
                }
            }
            this._documentAppService.changeOpinionOfDirector(this.dataRowDetail.HandlingId, dvxl)
                .pipe(finalize(() => { this.saving = false;
                    this.spinnerService.hide();
                }))
                .subscribe(() => {
                    this.popup_Visible_detail = false;
                    this.gridContainer.instance.repaint();
                    this.router.navigate(['/app/main/qlvb/executeLabelSQL/85']);
                });

        }
    }

    trinhBGD() {
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            return;
        }
        else {
            this.selectedDirector = this.selectedRowsData[0].DirectorId;
        }

        this.popup_Visible = true;
    }

    // submit many documents to director // trình BGĐ
    submit_to_the_director() {
        this.spinnerService.show();
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            return;
        }
        else if (this.selectedRowsData.length > 1){
            let input = [];
            for(var i = 0; i < this.selectedRowsData.length; i++){
                input.push(this.selectedRowsData[i].Id);
            }
            this._documentAppService.multipleSubmitToDirector(input)
            .pipe(finalize(() => { this.spinnerService.hide(); }))
            .subscribe(()=>{
                this.notify.success('Trình thành công');
                this.router.navigate(['/app/main/qlvb/executeLabelSQL/84']);
            });
        }
        else {
            this._documentAppService.submitToDirector(this.selectedRowsData[i].Id, this.selectedRowsData[i].DirectorId)
            .pipe(finalize(() => { this.spinnerService.hide(); }))
            .subscribe(() => {
                this.notify.success('Trình thành công');
                this.router.navigate(['/app/main/qlvb/executeLabelSQL/84']);
            });


        }
    }

    onValueChangedTenant(data: any) {

        this.selected = data.selectedItem;
    }
    // funtion tra ve
    return() {
        window.history.go(-1); return false;
    }
    // chuyen  bo sung can bo chien si
    has_Transfer_Add_CBCS() {
        this.router.navigate(['/app/main/qlvb/transfer-handle-officer']);
    }
    // chuyen can bo chien si
    has_Transfer_CBCS() {
        this.router.navigate(['/app/main/qlvb/transfer-handle-officer']);
    }
    // Chỉnh sửa
    editRow(e: any) {
        if(e.data.DocumentHandlingDetailId== null){
            this.router.navigate(['/app/main/qlvb/them-vb-phong/edit/'+e.data.Id]);
        }else{
            this._documentAppService.seenDocument(e.data.DocumentHandlingDetailId).subscribe(res=>{
                this.router.navigate(['/app/main/qlvb/them-vb-phong/edit/'+e.data.Id]);
                });
        }
       
    }
    deleteRow(e: any) {
        this.message.confirm(
            'Bạn muốn xóa văn bản này? Hành động này không thể phục hồi!',
            this.l('AreYouSure'),
            isConfirmed => {
                if (isConfirmed) {
                    this._documentAppService.delete(e.data.Id).subscribe(() => {
                        this.initialData.splice(e.rowIndex, 1);
                        this.notify.success('Xóa thành công!');
                    }, ()=>{
                        this.notify.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
                    });
                }
            }
        );
    }
    // funtion kết thúc
    has_Finish() {
        if (this.selectedRowsData.length == 0) {
            return;
        }
        for(var i = 0; i < length; i++){
            this._documentAppService.delete(this.selectedRowsData[i].Id).subscribe(() => {
                this.notify.warn('Xóa thành công!');
            });
        }
        this.gridContainer.instance.repaint();
    }
    // funtion thêm mới
    create() {
        this.router.navigate(['/app/main/qlvb/create-new-incomming-document']);
    }
    // funtion chuyển

    // chuyen cho TỔ
    has_Transfer_Nest() {
        this.router.navigate(['/app/main/qlvb/transfer-handle-nest']);
    }


    has_Transfer() {
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            return;
        }
        this.selectedRowsData.forEach(element => {
            this.selectedRows.push({ documentId: element["Id"], parentHandlingId: element["ParentHandlingId"] });
        });
        this.ultility.selectedRows = this.selectedRows;
        switch (this.labelId) {
            case 6:
                this.router.navigate(['/app/main/qlvb/transfer-handle-director']);
                break;
            case 7:
                this.popup_Visible = true;
                this.router.navigate(['/app/main/qlvb/transfer-handle-department']);
                break;
            case 37:
                this.router.navigate(['/app/main/qlvb/transfer-handle-team']);
                break;
            case 34:
                this.router.navigate(['/app/main/qlvb/transfer-handle-team']);
                break;
            default:
                break;
        }
    }

    transfer_PB() {
        this.ultility.selectedRows = [];
        this.getSelectedRowKeys();
        this.router.navigate(['/app/main/qlvb/transfer-deparment']);
    }
    transfer_PGD() {
        this.ultility.selectedRows = [];
        this.getSelectedRowKeys();
        this.router.navigate(['/app/main/qlvb/transfer-handle-director']);
    }
    transfer_PGD_cellTemplate(e: any) {
        this.ultility.selectedRows = [];
        let arr = [];
        arr.push(e.data.Id);
        this.ultility.selectedRows = arr;
        this.router.navigate(['/app/main/qlvb/transfer-handle-director']);
    }


    // cell_template() {
    //     let numbers: any;
    //     this._dynamicAction.getLabelData(this.labelId).subscribe(res => {
    //         this.cell_TemplateData = res;

    //         numbers = this.cell_TemplateData.cellTemplate;
    //         this.num = numbers.split(',').map(x => { return parseInt(x); }).sort((a, b) => { return a - b; });
    //     });
    // }

    selectionChangedHandler() {
        if (!this.selectionChangedBySelectbox) {
            this.prefix = null;
        }

        this.selectionChangedBySelectbox = false;
    }
    columnFields: any[] = [];

    getVanbanDxTable(labelId: number, outdate = false) {
        const that = this;
        this._dynamicGridServiceProxy.getAllDataAndColumnConfigByLabelId(labelId, outdate).subscribe(result => {
            let count = 0;
            that.header = result.getDataAndColumnConfig.title;
            if(result.dynamicActionDto != null || result.dynamicActionDto != undefined){
                that.num = result.dynamicActionDto.cellTemplate.split(',').map(x => { return parseInt(x); }).sort((a, b) => { return a - b; });
            }
            that.initialData = result.getDataAndColumnConfig.listData;
            for(var i = 0, len = that.initialData.length; i < len; i++){
                that.initialData[i]["stt"] = ++count;
                that.initialData[i]["star"] = that.initialData[i]["Star"] == 1? true: false;
            }
            that.gridContainer.instance.repaint();
        });

    }

    viewProcess(event: any) {
        if(event.data.DocumentHandlingDetailId== null){
            this.router.navigate(['/app/main/qlvb/them-vb-phong/view/' + event.data.Id]);
        }else{
            this._documentAppService.seenDocument(event.data.DocumentHandlingDetailId).subscribe(res=>{
            this.router.navigate(['/app/main/qlvb/quytrinhxuly/' + event.data.Id]);
            });
        }
    }

    viewRow(event: any) {
        // sessionStorage.setItem("readOnly", "true");
        if(event.data.DocumentHandlingDetailId== null){
            this.router.navigate(['/app/main/qlvb/them-vb-phong/view/' + event.data.Id]);
        }else{
            this._documentAppService.seenDocument(event.data.DocumentHandlingDetailId).subscribe(res=>{
                this.router.navigate(['/app/main/qlvb/them-vb-phong/view/' + event.data.Id]);
            });
        }
      
    }

    saveToBook() {

    }

    // Lịch sử xử lý văn bản
    showListHistory(event: any) {
        this._historyUploadsServiceProxy.getList(event.data.Id).subscribe(res => {
            this.history_Upload = res;
        });
        this.historyPopupVisible = true;
    }

    getIndexById(id: number) {
        var curData = this.initialData;
        let index = curData.findIndex(x => x.Id == id);
        return index;
    }
    getSelectedRowKeys() {
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        if (this.selectedRowsData.length == 0) {
            return;
        }
        this.selectedRowsData.forEach(element => {
            this.selectedRows.push(element["Id"]);
        });
        this.ultility.selectedRows = this.selectedRows;
    }
    getSelectedRowsData() {
        this.selectedRowsData = this.initialData.instance.getSelectedRowsData();
    }

    getdataRow(e: any) {
        this._historyUploadsServiceProxy.getList(e.data.id).subscribe(res => {
            this.history_Upload = res;
        });

    }

    // xem chi tiet file dinh kem
    showDetail(e: any) {
        this.rootUrl = AppConsts.fileServerUrl ;
        this.link = this.rootUrl + "/" + e.row.data.file;
        window.open(this.link, '_blank');

    }

    // gắn sao văn bản
    instaff(event: any) {
        let data: CreateOrEditIdoc_starDto = new CreateOrEditIdoc_starDto();
        data.userId = this._appSessionService.userId;
        data.documentId = event.data.Id;
        if (event.data.star == false) {
            this._idocStarServiceProxy.create_Star(data).pipe(finalize(() => { this.saving = true; }))
                .subscribe(() => {
                    // this.message.success('Gắn sao thành công');
                });
            event.data.star = true;
        }
        else {
            this._idocStarServiceProxy.starDelete(event.data.Id, this.user_ID).subscribe(() => {
                // this.message.success('Bỏ sao thành công');
            });
            event.data.star = false;
        }
    }

    approveDocument(){
        if(this.selectedRowsData.length == 0){
            this.message.warn('Vui lòng chọn văn bản cần duyệt');
            return;
        }
        this.spinnerService.show();
        this._documentAppService.approveDocument(this.selectedRowsData[0].Id, this.selectedRowsData[0].HandlingId)
        .pipe(finalize(() => { document.getElementById('TopMenu2').click();
            this.spinnerService.hide();
        }))
        .subscribe(() => {
            // this.gridContainer.instance.repaint();
            // this.gridContainer.instance.refresh();
            this.notify.info('Đã duyệt thành công!');
            this.router.navigate(['/app/main/qlvb/executeLabelSQL/85']);
        });
    }

    // duyệt nhiều VB
    approve_Multiple_Func(){
        if(this.selectedRowsData.length == 0){
            this.message.warn('Vui lòng chọn văn bản cần duyệt');
            return;
        }
        this.spinnerService.show();
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();

        let arr = [];
        for(var i = 0, len = this.selectedRowsData.length; i < len; i++){
            let newDto = new ApproveDocumentDto();
            newDto.documentId = this.selectedRowsData[i].Id;
            newDto.documentHandlingId = this.selectedRowsData[i].HandlingId;
            arr.push(newDto);
        }
        this._documentAppService.multiApproveDocument(arr)
            .pipe(finalize(() => { document.getElementById('TopMenu2').click();
                this.spinnerService.hide();
            }))
            .subscribe(() => {
                this.notify.info('Đã duyệt thành công!');
                this.router.navigate(['/app/main/qlvb/executeLabelSQL/85']);
        });

        // this.selectedRowsData.forEach(x => {


        // });
    }

    //cập nhật chỉ đạo
    async cap_nhat_chi_dao(){
        if(this.selectedRowsData.length == 0){
            this.message.warn('Vui lòng chọn văn bản cần cập nhật chỉ đạo');
            return;
        }
        //this.spinnerService.show();
        let arr = [];
        this.selectedRowsData = this.gridContainer.instance.getSelectedRowsData();
        for(var i = 0, len = this.selectedRowsData.length; i < len; i++){
            let newDto = new CapNhatInputDto();
            newDto.documentId = this.selectedRowsData[i].Id;
            newDto.documentHandlingId = this.selectedRowsData[i].HandlingId;
            newDto.attachment = this.selectedRowsData[i].Attachment;
            // let publishDate = this.selectedRowsData[i].PublishDate.split('T').shift();
            //this.selectedRowsData[i].PublishDate.split('T').shift() là ngày nhưng bị sai định dạng
            let publishDate = moment(new Date(this.selectedRowsData[i].PublishDate.split('T').shift())).format('DD-MM-YYYY');
            newDto.kyHieuNoiGui = this.selectedRowsData[i].Number ? this.selectedRowsData[i].Number + '/' + publishDate : publishDate;
            for(var i = 0, len = this.selectedRowsData.length; i < len; i++){
                if(this.selectedRowsData[i].DocumentHandlingDetailId==null){
                    this.selectedRowsData[i].IsSeen=1;
                }else{
                    await this._documentAppService.seenDocument(this.selectedRowsData[i].DocumentHandlingDetailId)         
                    .toPromise().then(res=>{
                         this.selectedRowsData[i].IsSeen=1;
                    });
                }
              
            }
            arr.push(newDto);
        }
        this.yKienChiDao.ykienchidao = this.selectedRowsData[0].ApprovingRecommended;
        this.yKienChiDao.ykiendexuat_BCH_doi = this.selectedRowsData[0].ProcessingRecommendedDV;
        this.yKienChiDao.incommingNumberDV = this.selectedRowsData[0].IncommingNumberDV;
        this.yKienChiDao.book = this.selectedRowsData[0].BookDV;
        this.yKienChiDao.incommingDate = this.selectedRowsData[0].IncommingDateDV;
        this.yKienChiDao.incommingNumber = arr.map(x =>{ return x.kyHieuNoiGui }).join(';');
        this.yKienChiDao.capNhatDto.listDocs = arr;
        //this.yKienChiDao.docId = arr[0].documentId;
        //this.yKienChiDao.documentHandlingId = arr[0].documentHandlingId;
        this.yKienChiDao.show();
    }

    onCheckBoxChanged(e, cell)
    {
        let index = this.data_DVXL.findIndex(x => x.id == cell.data.id);
        //kiểm tra cột vừa thao tác là main hay co
        switch(cell.column.dataField){
            case 'mainHandling':
                //kiểm tra có đvxl chính chưa, nếu có rồi thì bỏ chọn cái trước
                console.log(this.previousMainHandlingId);
                if(this.previousMainHandlingId >= 0){
                    let temp = this.data_DVXL.findIndex(x => x.id == this.previousMainHandlingId);
                    this.data_DVXL[temp]["mainHandling"] = false;
                }

                if(this.data_DVXL[index]["coHandling"] == true){
                    this.data_DVXL[index]["coHandling"] = false;
                }

                this.data_DVXL[index]["mainHandling"] = e.value;

                //giữ id của đơn vị đang nắm chủ trì
                this.previousMainHandlingId = cell.data.id;
                break;
            case 'coHandling':
                if(this.data_DVXL[index]["mainHandling"] == true){
                    this.data_DVXL[index]["mainHandling"] = false;
                }

                this.data_DVXL[index]["coHandling"] = e.value;
        }
        console.log(this.data_DVXL)
    }
    processingResult: DocumentHandlingDetailDto;
    update_KQGQ(){
        this.spinnerService.show();
        this.saving = true;
        this._documentAppService.update_KQGQ(this.selectedRowsData[0].Id, this.selectedRowsData[0].HandlingId,
            this.processingResult.processingRecommended, moment(this.processingResult.processingDate))
            .pipe(finalize(() => {
                this.getVanbanDxTable(this.labelId);
                document.getElementById('TopMenu2').click();
                this.saving = false;
                this.spinnerService.hide();
            }))
            .subscribe(() => { });
        // this.processingResult.processingRecommended = this.dataRowDetail.processingRecommended;
        // this._documentAppService.changeStatusOfDocumentIntoTransfered(this.dataRowDetail.Id, "VBDDGQ").subscribe(() => {

        // });
        // this.initialData.splice(this.initialData.findIndex(x => x.Id == this.dataRowDetail.Id), 1);


        // this.gridContainer.instance.refresh();
        this.popup_Visible_detail_XL = false;

    }

    exportHTML(data: any) {
        $.ajax({
            url: this.printUrl + data.Id,
            method: 'POST',
            xhrFields: {
                responseType: 'blob'
            },
            success: function (data) {
                console.log(data);
                var a = document.createElement('a');
                var url = window.URL.createObjectURL(data);
                a.href = url;
                var current = new Date();
                var fullTimeStr = current.getHours().toString() + current.getMinutes() + current.getSeconds()
                    + current.getDate() + (current.getMonth() + 1) + current.getFullYear();
                a.download = 'MauPhieuTrinh_' + fullTimeStr + '.doc';
                document.body.append(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            }
        });

    }

    capNhat(e: any){
        this.router.navigate(['/app/main/qlvb/them-vb-phong/edit/'+ e.data.Id]);
    }

    onRowPrepared(){

    }

    advanceFilterBtnClick(){
        this.hasAdvanceFilter = !this.hasAdvanceFilter;
        if(!this.hasAdvanceFilter){
            $('advanceFilterDiv').css("display", "none");
        }
        else {
            $('advanceFilterDiv').css("display", "initial");
        }

    }

    popup_chuyenBoSung = false;
    // sửa bổ sung
    editExtra(e: any){
        console.log(e);
        this.router.navigate(['/app/main/qlvb/incomming-document/edit/extra/' + e.Id])
    }

    // chuyển bổ sung
    // transferExtra(e: any){
    //     this.dataRowDetail = e.data ;
    //     this.data_DVXL.forEach(x => {
    //         x["mainHandling"] = false;
    //         x["coHandling"] = false;
    //         x["disabledCT"] = true;
    //         x["disabledPHXL"] = false;
    //     });
    //     this._documentHandlingAppService.get_DVXL_ForDocument(this.selectedRowsData[0].Id, this.selectedRowsData[0].UnitId).subscribe((res) => {
    //         this.old_DVXL = res;
    //         this.old_DVXL.forEach((ele) => {
    //             let index = this.data_DVXL.findIndex(x => x.id == ele.OrganizationId);
    //             if(ele.TypeHandling == 1){
    //                 this.data_DVXL[index]["mainHandling"] = true;
    //                 this.data_DVXL[index]["coHandling"] = false;
    //                 this.data_DVXL[index]["disabledCT"] = true;
    //                 this.data_DVXL[index]["disabledPHXL"] = true;
    //                 this.previousMainHandlingId = this.data_DVXL[index].id;
    //             }
    //             else if(ele.TypeHandling == 0) {
    //                 this.data_DVXL[index]["mainHandling"] = false;
    //                 this.data_DVXL[index]["coHandling"] = true;
    //                 this.data_DVXL[index]["disabledCT"] = true;
    //                 this.data_DVXL[index]["disabledPHXL"] = true;
    //             }
    //             else {
    //                 this.data_DVXL[index]["mainHandling"] = false;
    //                 this.data_DVXL[index]["coHandling"] = false;
    //                 this.data_DVXL[index]["disabledCT"] = true;
    //             }
    //         });

    //     });
    //     this.popup_chuyenBoSung = true;
    // }
    chuyenBoSung(){
        let json = JSON.stringify(this.newSelectedDVXL);
        this.selectedRowsData[0].ProcessingRecommended = this.dataRowDetail.ProcessingRecommended;
        this._documentAppService.extraTransfer(this.selectedRowsData[0].HandlingId, json, this.selectedRowsData[0]).subscribe(() => {
            this.notify.info("Chuyển bổ sung thành công!");
            this.popup_chuyenBoSung = false;
        });
    }
    newSelectedDVXL = [];
    onCheckBoxBoSungChanged(cell)
    {
        let index = this.data_DVXL.findIndex(x => x.id == cell.data.id);
        //kiểm tra cột vừa thao tác là main hay co
        if(cell.column.dataField == 'coHandling'){
            let dvxl = new ListDVXL();
            dvxl.unitId = this.data_DVXL[index].id;
            dvxl.typeHandling = 0;
            this.newSelectedDVXL.push(dvxl);
        }
    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items.unshift({
            location: 'before',
            template: 'totalGroupCount'
        },);
    }

    //update total count
    onContentReady(e){
        this.totalCount = e.component.totalCount();
    }
    numberCellValue(rowData){
        return rowData.Number;
    }
    numberDVCellValue(rowData){
        return rowData.IncommingNumberDV;
    }
    onExporting(e){
        e.component.beginUpdate();
        // e.component.columnOption('DoiPhoiHop', 'visible', true);
        e.component.columnOption('number_incomingdatedv', 'visible', true);
        e.component.columnOption('number_publishdate', 'visible', true);
    }
    onExported(e){  
        // e.component.columnOption('DoiPhoiHop', 'visible', false);
        e.component.columnOption('number_incomingdatedv', 'visible', false);
        e.component.columnOption('number_publishdate', 'visible', false);
        e.component.endUpdate();  
    } 
    fromDateVal: Date= new Date();
    toDateVal: Date= new Date();
    publisherValue: any;
    fromDateOptions: any;
    toDateOptions: any;
    documentSearchData: GetDocInputForSearchDto = new GetDocInputForSearchDto();
    initFromDateOptions(){
        const self = this;
        this.fromDateOptions = {
            format: 'dd/MM/yyyy',
            displayFormat: 'dd/MM/yyyy',
            showClearButton: true,
            value: self.fromDateVal
        }
    }

    initToDateOptions(){
        const self = this;
        this.toDateOptions = {
            format: 'dd/MM/yyyy',
            displayFormat: 'dd/MM/yyyy',
            showClearButton: true,
            value: self.toDateVal
        }
    }
    search() {
        this.documentSearchData.fromDate = moment(this.fromDateVal).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
        this.documentSearchData.toDate = moment(this.toDateVal).set({ hour: 23, minute: 59, second: 59, millisecond: 0 });
        this._documentAppService.getAllIncommingDocumentToUnit(this.documentSearchData.fromDate, this.documentSearchData.toDate, this.appSession.organizationUnitId).subscribe(res => {
            this.initialData = res;
            this.totalCount = this.initialData.length;
        });
    }
}

