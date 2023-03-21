import { Component, Injector, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, PriorityDto, TextBookDto, SessionServiceProxy, DynamicFieldsServiceProxy, HistoryUploadsServiceProxy, DocumentHandlingDetailDto, HandlingUser, DocumentHandlingDetailsServiceProxy, DocumentHandlingsServiceProxy, OrganizationUnitServiceProxy, Comm_booksServiceProxy, LabelDto, ListDVXL, CreateDocumentDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
// import { TransferHandleModalComponent } from '../transfer-handle/transfer-handle-modal';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';
import { DxFormComponent, DxDateBoxComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { DxiGroupComponent, DxoPopupComponent } from 'devextreme-angular/ui/nested';
import { Location } from '@angular/common';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { Observable } from 'rxjs';
// import { ReportDocumentModalComponent } from '../../report_document/report-dox`cument-modal';
//import * as jsPDF from 'jspdf';
declare const exportHTML: any;

@Component({
    selector: 'soDenTheoPhong',
    templateUrl: './so-den-theo-phong.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe] ,
    animations: [appModuleAnimation()]

})
export class SoDenTheoPhongComponent extends AppComponentBase {
    @ViewChild('documentForm', {static: true}) documentForm: DxFormComponent;
    @ViewChild('publisherForm', { static: false }) publisherForm: DxFormComponent;
    @ViewChild('anotherInfo', { static: false}) anotherInfo: DxiGroupComponent;
    @ViewChild('content',{ static: true })  content: ElementRef;
    // @Input('editDocumentId') editDocumentId: number;
    @ViewChild('publisherSelect', { static: true }) publisherSelect: DxSelectBoxComponent;
    @ViewChild('bookOfRoomSelect', { static: true }) bookOfRoomSelect: DxSelectBoxComponent;
    documentData: DocumentsDto = new DocumentsDto();
    editDocumentId = 0;
    publisherData: any;
    publisherPopupVisible = false;
    documentTypeOptions: DocumentTypeDto[] = [];
    popupVisible = false;
    priorityOptions: PriorityDto[] = [];
    saving = false;
    nextNumber: string;
    validationGroup: any;
    publisherPopupVisible_report = false;
    uploadUrl: string;
    myDate = new Date();
    currentTime :any ;
    link = '';
    error = true;
    endDate:any;
    incommingDate :any;
    isSetData = false;
    numberOfDaysByDocType = 0;
    listReceive: HandlingUser[] = [];
    dataSource = [];
    //lưu index của đơn vị chủ trì
    previousMainHandlingIndex: number;
    //lưu id của đơn vị chủ trì
    previousMainHandlingId: number;
    old_DVXL = [];
    // loại sổ văn bản
    dataBook = [
        { id: 1, name: 'Sổ thường'  },
        { id: 2, name: 'Sổ mật' },
    ];
    data_range = [];
    data_position = [];
    selectedRows = [];
    data_publisher = [];
    data_commBook = [];
    // cấp gửi
    data_groupAuthor = ['CATP', 'Phòng ban', 'Đội', 'Tổ'];
    data_department = [];
    _id: number;
    data_secretLevel = [];
    data_priority = [];
    leaderDepartmentName: any ;
    captain_department = [
        { userId: 100, nameWithPosition: 'Thiếu tá - Nguyễn Văn A' },
        { userId: 101, nameWithPosition: 'Đại úy - Nguyễn Văn B' },
        { userId: 102, nameWithPosition: 'Đại úy - Nguyễn Văn C' }
    ];
    director_list = [];
    rootUrl : string ;
    deadLineDate: Date;
    value: any[] = [];
    currentDate = new Date();
    nameArr: any[]= [];
    dataDisplay = [];
    tepDinhKemSave = '';
    switchValue = false;
    data_DVXL:any
    textBookOptions: TextBookDto[] = [];
    userId: number;
    signal = "";
    publisherVal: any;
    show = false ;
    chkAutomaticValue = true;
    processingDate: Date;
    bookVal: any;
    secretVal: any;
    priorityVal: any;
    rangeVal: any;
    positionVal: any;
    // isVisible = true;
    label: Observable<LabelDto>;
    labelDto: LabelDto[] = [];
    listDVXL_selected: ListDVXL[] = [];
    dataBookOfRoom = [
        { id: 1, name: 'Sổ 1'},
        { id: 2, name: 'Sổ 2'},
    ];
    incommNumToRoom = '';
    incommDateToRoom: Date = new Date();
    num = [];
    data_team = [
        {displayName: 'Đội 1', shortentCode: 'Đ1', mainHandling: false, coHandling: false, unitId: 1},
        {displayName: 'Đội 2', shortentCode: 'Đ2', mainHandling: false, coHandling: false, unitId: 2},
        {displayName: 'Đội 3', shortentCode: 'Đ3', mainHandling: false, coHandling: false, unitId: 3},
        {displayName: 'Đội 4', shortentCode: 'Đ4', mainHandling: false, coHandling: false, unitId: 4},
        {displayName: 'Đội 5', shortentCode: 'Đ5', mainHandling: false, coHandling: false, unitId: 5}

    ];
    currentUser:any;
    constructor(
        injector: Injector,
        private router: Router,
        protected activeRoute: ActivatedRoute,
        private datePipe: DatePipe,
        private _documentTypeAppService: DocumentTypesServiceProxy,
        private _documentAppService: DocumentServiceProxy,
        private _documentHandlingAppService :DocumentHandlingsServiceProxy,
        // private _priorityAppService: PrioritiesServiceProxy,
        private _dynamicFieldService: DynamicFieldsServiceProxy,
        private _documentHandlingDetailAppService: DocumentHandlingDetailsServiceProxy,
        private _appNavigationService: AppNavigationService,
        private _location: Location    ) {
        super(injector);
        this.userId = this.appSession.userId;
        this.uploadUrl = AppConsts.fileServerUrl  + '/fileupload/Upload_file?userId=' + this.userId ;
        this.bookVal = 1;
    }

    registerEvents(): void {
        const self = this;
        console.log("vô");
        abp.event.on('app.labelSignalR.label', (message) => {
            console.log("không vô luôn");
            //this._appSessionService.init();
            console.log(message);
        });
    }

    back(){
        this._location.back();
    }

    transformDate(date) {
        return this.datePipe.transform(date, 'dd/MM/yyyy'); //whatever format you need.
    }

    resetForm(){
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/app/main/qlvb/create-new-incomming-document']);
    }

    addItem(newItem :string): void {
        this.documentData.attachment += newItem ;
    }

    ngOnInit(){
        //this.registerEvents();
        // console.log(this.activeRoute.params["id"]);
        // this._id = parseInt(this.activeRoute.snapshot.paramMap.get('id'));
        this.activeRoute.params.subscribe(params => {
            this._id = parseInt(params['id']);

        });
        this._documentAppService.getDocumentEditByDocumentId(this._id).subscribe(result => {
            this._documentHandlingAppService.get_DVXL_ForDocument(result.id, result.unitId).subscribe((res) => {
                this.old_DVXL = res;

                this.old_DVXL.forEach((ele) => {
                    let index = this.data_department.findIndex(x => x.id == ele.OrganizationId);
                    if(ele.TypeHandling == 1){
                        this.data_department[index]["mainHandling"] = true;
                        this.data_department[index]["coHandling"] = false;
                        this.previousMainHandlingId = this.data_department[index].id;
                    }
                    else if(ele.TypeHandling == 0) {
                        this.data_department[index]["mainHandling"] = false;
                        this.data_department[index]["coHandling"] = true;
                    }
                    else {
                        this.data_department[index]["mainHandling"] = false;
                        this.data_department[index]["coHandling"] = false;
                    }
                });
            });
            this.documentData = result;

            this.signal = result.number;
            this.numberOfDaysByDocType = result.numberOfDays;
            if(result.attachment){
                this.num = result.attachment.split(';');
                this.num.forEach((ele)=>{
                    this.selectedRows.push({tepDinhKem: ele});
                });
            }
            this.publisherVal = result.publisher.toString();

            this.bookVal = result.book;
            this.nextNumber = result.incommingNumber;
            this.secretVal = result.secretLevel != null ? result.secretLevel.toString(): null;
            this.rangeVal = result.range != null ? result.range.toString() : null;
            this.positionVal = result.position != null ? result.position.toString() : null;
            this.priorityVal = result.priority != null ? result.priority.toString(): null;


            if(result.documentTypeId != null || result.secretLevel != null || result.priority != null || result.range != null || result.signer != null || result.position != null){
                this.switchValue = true;
            }
            this.tepDinhKemSave = this.selectedRows.map(x => x.tepDinhKem.toString()).join(';')
        });

        
        this.currentUser = abp.session.userId;
        console.log(this.currentUser)
 
        
        this._documentAppService.updateSeenStatus(this._id,this.currentUser).subscribe()
        this._documentTypeAppService.getAllDocumentType().subscribe(result => {
            this.signal = result[0].signal;
            this.documentTypeOptions = result;
        });

        this.link = this.router.url;
        this.processingDate = new Date();
        this._documentAppService.getListPhongBanCATP().subscribe(res =>{
            this.data_department = res;

            this.data_department.forEach(x => {
                x["mainHandling"] = false;
                x["coHandling"] = false;
            })
        });

        this.numberOfDaysByDocType = 15;
        this.deadLineDate = this.addDays(this.currentDate, 15);
        this.documentData.incommingDate = moment(this.currentDate);
        this.documentData.numberOfDays = 15;
        this.documentData.deadline = moment(this.deadLineDate);
        this.documentData.book = 1;
        this.getIncommingNumber(1);
        this._dynamicFieldService.getDynamicFieldByModuleId(22, this.editDocumentId).subscribe(result => {
            console.log(result);
            this.data_publisher = result[0].dataSource;
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
            this.data_range = result[3].dataSource;
            this.data_position = result[4].dataSource;
            this.secretVal = result[1].dataSource[0].key;
            this.priorityVal = result[2].dataSource[0].key;
        });
        // this.data_department.forEach(x => {
        //     x["mainHandling"] = false;
        //     x["coHandling"] = false;
        // });

        this._documentHandlingAppService.getLeaderList_PGD().subscribe(res =>{
            this.director_list = res;
            let temp = this.director_list.find(x => {
                return x.userId == this.documentData.directorId;
            })
            console.log(temp);
            for(var i = 0, len = this.director_list.length; i < len; i++){
                this.director_list[i]["nameWithPosition"] = this.director_list[i]["position"] + " - " + this.director_list[i]["fullName"];
            }
            this.documentData["oldProcessingRecommended"] = temp.roleName + " - " + temp.fullName + " :  " + this.documentData.processingRecommended;
        });
        // this._documentHandlingAppService.getLeaderList_PB().subscribe(res => {
        //     this.captain_department = res;
        //     for(var i = 0, len = this.captain_department.length; i < len; i++){
        //         this.captain_department[i]["nameWithPosition"] = this.captain_department[i]["position"] + " - " + this.captain_department[i]["fullName"];
        //     }
        // });
    }

    getIncommingNumber(soVB: number) {
        this._documentAppService.getNextIncommingNumber(soVB).subscribe(res => {
            this.nextNumber = res;
            this.documentData.incommingNumber = this.nextNumber;
        });
    }

    switchMoreInfoValueChanged(e: any){
        if(e.value == true){
            this.switchValue = true;
            this.anotherInfo.instance.visible = true;
        }
        else{
            this.switchValue = false;
            this.anotherInfo.instance.visible = false;
        }
    }

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
        this.value = []
        this.selectedRows = this.selectedRows.concat(this.dataDisplay);
        this.tepDinhKemSave = this.selectedRows.map(x => x.tepDinhKem.toString()).join(';')
    }
    deleteFile(e:any)
    {
        // this.selectedRows.splice(this.selectedRows.indexOf(e.row.data.tepDinhKem), 1);
        this.selectedRows.splice(this.selectedRows.findIndex(x=>x.tepDinhKem===e.data.tepDinhKem), 1);
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

    isValidForm = false;

    checkIncommingNumber(): Promise<any>{
        const promise = new Promise((resolve)=>{
            const self = this;
            if(this.chkAutomaticValue){ // trường hợp tự động
                this.getIncommingNumber(1); // gọi lại hàm lấy số = CurrentValue + 1
                self.error = false;
                resolve(self.error);
            }
            else{
                this._documentAppService.isNumberInBookExisted(this.bookVal, this.nextNumber).subscribe(result => {
                    if(!result){ // chưa tồn tại => lấy số này luôn
                        self.error = false;
                    }
                    resolve(self.error);
                })
            }
        });
        return promise;
    }

    setListDVXL(){
        console.log(this.data_department);
        this.data_department.forEach(receiver => {
            if(receiver.mainHandling == true || receiver.coHandling == true){
                let dvxl = new ListDVXL();
                dvxl.unitId = receiver.id;
                if(receiver.mainHandling == true){

                    dvxl.typeHandling = 1;

                }
                else if(receiver.coHandling == true){
                    dvxl.typeHandling = 0;
                }
                this.listDVXL_selected.push(dvxl);
            }

        });
    }

    save(): void {
        let result = this.documentForm.instance.validate();
        this.setListDVXL();
        const that = this;
        if(result.isValid){
            this.saving = true;
            this.documentData.publishDate = moment(this.documentData.publishDate);
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.action = 1;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
            this.documentData.incommingNumber = this.nextNumber;
            this.documentData.unitId = this.appSession.organizationUnitId;
            this.documentData.publisher = this.publisherSelect.value;
            // this.documentData.listDVXL = this.listDVXL_selected;
            this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;
            if(this.deadLineDate != null){
                this.documentData.deadline = moment(this.deadLineDate);
            }

            // this._documentAppService.createDocument(that.chkAutomaticValue, this.documentData)
            //     .pipe(finalize(() => { this.saving = false;}))
            //     .subscribe((ids) => {
            //         if(ids != ''){
            //             this.notify.success('Thêm mới thành công');
            //             // let arr = ids.split(',');
            //             // let docId = parseInt(arr[0]);
            //             // let handlingId = parseInt(arr[1]);
            //             // that.saveHandlingDetail(docId, handlingId);
            //             this.router.navigate(['/app/main/qlvb/executeLabelSQL/6']);
            //         }
            //         else{
            //             this.message.warn('Số đến bị trùng!');
            //         }
            //     });
            }
        }

    saveAndTransfer(){
        // this.checkIncommingNumber();
        let result = this.documentForm.instance.validate();
        this.setListDVXL();
        if(result.isValid){
            this.saving = true;
            this.documentData.isActive = true;
            this.documentData.status = false;
            this.documentData.action = 3;
            this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
            this.documentData.unitId = this.appSession.organizationUnitId;
            this.documentData.publisher = this.publisherSelect.value;
            this.documentData.incommingNumber = this.nextNumber;
            // this.documentData.listDVXL = this.listDVXL_selected;
            this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
            this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;
            if(this.deadLineDate != null){
                this.documentData.deadline = moment(this.deadLineDate);
            }


            // this._documentAppService.createAndTransferDocument(this.chkAutomaticValue, this.documentData)
            //     .pipe(finalize(() => { this.saving = false;}))
            //     .subscribe((ids) => {
            //         if(ids != ''){
            //             this.notify.success('Thêm mới thành công');
            //             // let arr = ids.split(',');
            //             // let docId = parseInt(arr[0]);
            //             // let handlingId = parseInt(arr[1]);
            //             // this.saveHandlingDetail(docId, handlingId);
            //             this.router.navigate(['/app/main/qlvb/executeLabelSQL/84']);
            //         }
            //         else{
            //             this.message.warn('Số đến bị trùng!');
            //         }
            //     });
        }
    }

    // saveAndCreateNew(){
    //     // this.checkIncommingNumber();
    //     let result = this.documentForm.instance.validate();
    //     this.setListDVXL();
    //     const that = this;
    //     if(result.isValid){
    //         this.saving = true;
    //         this.documentData.isActive = true;
    //         this.documentData.status = false;
    //         this.documentData.action = 1;
    //         this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
    //         this.documentData.unitId = this.appSession.organizationUnitId;
    //         this.documentData.publisher = this.publisherSelect.value;
    //         this.documentData.incommingNumber = this.nextNumber;
    //         this.documentData.secretLevel = this.documentData.secretLevel != null? this.documentData.secretLevel : -1;
    //         this.documentData.priority = this.documentData.priority != null? this.documentData.priority : -1;
    //         this.documentData.listDVXL = this.listDVXL_selected;
    //         if(this.deadLineDate != null){
    //             this.documentData.deadline = moment(this.deadLineDate);
    //         }
    //         this._documentAppService.createDocument(this.chkAutomaticValue, this.documentData)
    //             .pipe(finalize(() => { this.saving = false;}))
    //             .subscribe((ids) => {
    //                 if(ids != ''){
    //                     this.notify.success('Thêm mới thành công');
    //                     // let arr = ids.split(',');
    //                     // let docId = parseInt(arr[0]);
    //                     // let handlingId = parseInt(arr[1]);
    //                     // this.saveHandlingDetail(docId, handlingId);
    //                     that.resetForm();
    //                 }
    //                 else{
    //                     this.message.warn('Số đến bị trùng!');
    //                 }
    //             });
    //     }
    // }



    onRowUpdating(e: any){
        let mainHandling = e.newData["mainHandling"];
        let coHandling = e.newData["coHandling"];
        var oldData = this.data_department.find(x => x.id == e.key.id);
        // var oldData = this.data_department.find(x => x.organizationId == e.key.organizationId);

        if(oldData.mainHandling == false && mainHandling == true){
            oldData.mainHandling = true;
            oldData.coHandling = false;
        }
        else if(oldData.coHandling == false && coHandling == true){
            oldData.mainHandling = false;
            oldData.coHandling = true;
        }
    }

    onRowUpdated(e: any){
        let flag = true;
        if(this.listReceive.length > 0){
            this.listReceive.every(function(element) {
                if(element.userId != e.data.userId && flag){
                    flag = true;
                    return true;
                }
                else{
                    flag = false;
                    return false;
                }
            });
            if(flag){
                this.listReceive.push(e.data);
                // this.listVal.push(e.data.userId);
            }
        }
        else{
            this.listReceive.push(e.data);
            // this.listVal.push(e.data.userId);
        }
    }

    arr_diff (a1, a2) {

        var a = [], diff = [];

        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }

        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }

        for (var k in a) {
            diff.push(k);
        }

        return diff;
    }

    onValueChanged(e: any){
        // this.receiverSelected = this.tagBox.value;
        if(e.value.length < e.previousValue.length){
            this.arr_diff(e.value, e.previousValue).forEach(el => {
                this.dataSource.findIndex(x => x.userId == el);
                let index = this.dataSource.findIndex(x => x.userId == el);
                this.dataSource[index]["mainHandling"] = false;
                this.dataSource[index]["coHandling"] = false;
                this.listReceive.splice(this.listReceive.findIndex(element => element.userId == el), 1);
                // this.listVal.splice(this.listVal.findIndex(x => x == el), 1);
            });
        }
    }

    showPublisherPopup(){
        this.publisherPopupVisible = true;
    }

    savepublisher(){
        // this.data_publisher.push({ id: this.data_publisher.length,  name: this.publisherData["name"] });
        // console.log(this.publisherForm.formData.publisherName);
        this._dynamicFieldService.createFieldForPublisher(this.publisherForm.formData.publisherName).subscribe((res) => {
            this.publisherPopupVisible = false;
            // $('#publisherSelect').dxSelectBox('instance').repaint();
            this.data_publisher = res;
            this.publisherSelect.instance.repaint();
            this.resetForm();
        })

        // this.publisherSelect.
    }

    clearState(items, currentId) {
        for (var i = 0; i < items.length; i++) {
            if (currentId == items[i].id) {
                items[i].mainHandling = true;
                continue;
            }
            items[i].mainHandling = false;
        }
    }

    bookSelectionChange(e: any){
        this.getIncommingNumber(e.value);
    }

    changeIncommingDate(e :any){
        this.deadLineDate = this.addDays(e.value, this.numberOfDaysByDocType);
        // this.documentData.endDate = this.deadLineDate.;
    }

    numberOfDaysChanged(e: any){
        this.deadLineDate = this.addDays(moment(this.documentData.incommingDate).format('YYYY-MM-DD'), e.value);
    }

    addDays(val,days: number){
        var date = new Date(val);
        date.setDate(date.getDate()+ days);
        return date;
    }

    // Danh sách xử lý radio value changed
    onCheckBoxChanged(e, cell)
    {
        let index = this.data_department.findIndex(x => x.id == cell.data.id);
        //kiểm tra cột vừa thao tác là main hay co
        switch(cell.column.dataField){
            case 'mainHandling':
                //kiểm tra có đvxl chính chưa, nếu có rồi thì bỏ chọn cái trước
                if(this.previousMainHandlingId >= 0){
                    let temp = this.data_department.findIndex(x => x.id == this.previousMainHandlingId);
                    this.data_department[temp]["mainHandling"] = false;
                }

                if(this.data_department[index]["coHandling"] == true){
                    this.data_department[index]["coHandling"] = false;
                }

                this.data_department[index]["mainHandling"] = e.value;

                //giữ id của đơn vị đang nắm chủ trì
                this.previousMainHandlingId = cell.data.id;
                break;
            case 'coHandling':
                if(this.data_department[index]["mainHandling"] == true){
                    this.data_department[index]["mainHandling"] = false;
                }

                this.data_department[index]["coHandling"] = e.value;
        }
    }

}
