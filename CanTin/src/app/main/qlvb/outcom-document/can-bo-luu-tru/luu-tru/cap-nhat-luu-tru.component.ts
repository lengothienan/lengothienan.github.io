import { ODocsServiceProxy, CreateOrEditLinkedDocumentDto, CreateOrEditODocDto, ReceiverDto } from '@shared/service-proxies/service-proxies';
// import { DataSource } from 'devextreme/data/data_source';
import { Comm_bookDto } from '@shared/service-proxies/service-proxies';
import { Component, Injector, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RoutesRecognized } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentsDto, DocumentTypeDto, DocumentTypesServiceProxy, DocumentServiceProxy, PriorityDto, TextBookDto, SessionServiceProxy, DynamicFieldsServiceProxy, HistoryUploadsServiceProxy, DocumentHandlingDetailDto, HandlingUser, DocumentHandlingDetailsServiceProxy, DocumentHandlingsServiceProxy, OrganizationUnitServiceProxy, Comm_booksServiceProxy, LabelDto, ListDVXL, CreateDocumentDto } from '@shared/service-proxies/service-proxies';
import { finalize, filter, pairwise } from 'rxjs/operators';
import * as moment from 'moment';
import { AppConsts } from '@shared/AppConsts';
// import { TransferHandleModalComponent } from '../transfer-handle/transfer-handle-modal';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { DatePipe } from '@angular/common';
import {formatDate} from '@angular/common';
import { DxFormComponent, DxDateBoxComponent, DxSelectBoxComponent, DxTextBoxComponent, DxTreeViewComponent } from 'devextreme-angular';
import { DxiGroupComponent, DxoPopupComponent } from 'devextreme-angular/ui/nested';
import { Location } from '@angular/common';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { Observable } from 'rxjs';
import * as $ from 'jquery';
// import { ReportDocumentModalComponent } from '../../report_document/report-document-modal';
//import * as jsPDF from 'jspdf';
declare const exportHTML: any;

@Component({
    selector: 'capNhatLuuTru',
    templateUrl: './cap-nhat-luu-tru.component.html',
    styleUrls: ['./cap-nhat-luu-tru.component.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe] ,
    animations: [appModuleAnimation()]

})
export class LuuTruVanBanDiComponent extends AppComponentBase {
    @ViewChild('documentForm', {static: true}) documentForm: DxFormComponent;
    @ViewChild('publisherForm', { static: false }) publisherForm: DxFormComponent;
    @ViewChild('anotherInfo', { static: false}) anotherInfo: DxiGroupComponent;
    @ViewChild('content',{ static: true })  content: ElementRef;
    @ViewChild('hanXyLy', { static: true}) hanXyLy: DxDateBoxComponent;
    @ViewChild('incommingDateField', { static: true}) incommingDateField: DxDateBoxComponent;
    @ViewChild('deadlineDateBox', { static: true}) deadlineDateBox: DxDateBoxComponent;
    // @Input('editDocumentId') editDocumentId: number;
    @ViewChild('publisherSelect', { static: true }) publisherSelect: DxSelectBoxComponent;
    @ViewChild('bookSelect', { static: true}) bookSelect: DxSelectBoxComponent;
    @ViewChild('documentTypeSelect', { static: true}) documentTypeSelect: DxSelectBoxComponent;
    @ViewChild('maDuThaoTxtBx', { static: true}) maDuThaoTxtBx: DxTextBoxComponent;
    @ViewChild('treeView', { static: true }) treeView: DxTreeViewComponent;

    documentData: CreateOrEditODocDto = new CreateOrEditODocDto();
    editDocumentId = 0;
    publisherData: any;
    publisherPopupVisible = false;
    documentTypeDataSource: DocumentTypeDto[] = [];
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
    dataBook: Comm_bookDto[] = [];
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
    captain_department = [];
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
    maDuThaoDisabled = true;
    isNumberDisabled = false;
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
    receiverPopupVisible = false;
    buttonVisible = false;
    followingTypes = [
        {type: 1, name: 'Không theo dõi hồi báo'},
        {type: 2, name: 'Theo dõi hồi báo'}
    ];
    followingTypeValue = 1;
    data_receiver = [
        {id: 1, displayName: 'Đơn vị trung ương', selected: true},
        {id: 2, displayName: 'Thành ủy'},
        {id: 3, displayName: 'Ủy ban nhân dân thành phố'},
        {id: 4, displayName: 'Ban tuyên giáo thành ủy'},
    ];
    selectedReceivers = [];
    currentSyntax: string;
    currentNumberInBook: string;
    currentNumber = "";
    oldNumber = "";
    soKyHieu: string;
    chkAutomaticNumberValue = false;
    oldDocType = "";
    currentDocType = "";
    selectedDocType = "";
    oldSelectedDocType = "";
    selectedBookVal: any;

    oldRangeVal = "";
    currentRangeVal = "";
    selectedRangeVal = "";
    documentTypeOptions: any;
    rangeOptions: any;
    draftNumBerOptions: any;
    isDraftNumberDisabled = false;
    chi_huy = [];
    editorList: any;
    isReadOnlyForm = false;
    leaderType = [
        {id: 1, name: 'Ban Giám Đốc CATP'}, {id: 2, name: 'Chỉ huy Phòng'}
    ];
    leaderTypeVal: number;
    nguoi_ky = [];
    leaderIdVal : any;
    linkDocumentVal: any;
    linkedDocOptions: any;
    selectedResponseDocs = [];
    displayReceiverList = [];
    selectedLinkedDocuments = [];
    arr: ReceiverDto[] = [];
    isDirty = false;
    num = [];
    orgLevelSource = [];
    selectedOrgLevels = [];
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
        private _commBookServiceProxy: Comm_booksServiceProxy,
        private _oDocServiceProxy: ODocsServiceProxy,
        private _location: Location    ) {
        super(injector);
        this.userId = this.appSession.userId;
        this.uploadUrl = AppConsts.fileServerUrl  + '/fileupload/Upload_file?userId=' + this.userId ;

        this.bookVal = 1;
        this.router.events
            .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
            .subscribe((events: RoutesRecognized[]) => {
                if(events[0].urlAfterRedirects.includes('danh-sach-vb-cho-cho-so')){
                    this.buttonVisible = true;
                }
            // console.log('previous url', events[0].urlAfterRedirects);
            // console.log('current url', events[1].urlAfterRedirects);
            });
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
        const that = this;
        this._dynamicFieldService.getDynamicFieldByModuleId(22, this.editDocumentId).subscribe(result => {
            this.data_publisher = result[0].dataSource;
            this.data_secretLevel = result[1].dataSource;
            this.data_priority = result[2].dataSource;
            this.data_range = result[3].dataSource;
            this.data_position = result[4].dataSource;
            this.secretVal = result[1].dataSource[0].key;
            this.priorityVal = result[2].dataSource[0].key;
        });
        const Id = this.activeRoute.snapshot.paramMap.get('id');
        if(Id != null || Id != undefined){
            this._oDocServiceProxy.getODocForEdit(parseInt(Id)).subscribe(res => {
                console.log(res);
                this.documentData = res;
                this.leaderTypeVal = this.documentData.leaderType;
                this.leaderIdVal = this.documentData.leaderId;
                this.secretVal = res.secretLevel != null ? res.secretLevel.toString() : null;
                this.rangeVal = res.range != null ? res.range.toString() : null;
                this.priorityVal = res.priority != null ? res.priority.toString() : null;
                this.linkDocumentVal = this.documentData.linkedDocNumber;
                that.isReadOnlyForm = true;
                this.selectedOrgLevels = res.orgLevels.split(';');
                if(res.attachment){
                    that.num = res.attachment.split(';');
                    that.num.forEach((ele)=>{
                        that.selectedRows.push({tepDinhKem: ele});
                        that.tepDinhKemSave = that.selectedRows.join(';');
                    });
                }
            });
            this.currentUser = abp.session.userId;
            console.log(this.currentUser)
            this._oDocServiceProxy.updateSeenStatus(parseInt(Id),this.currentUser).subscribe()
        }
        this._oDocServiceProxy.getReceiversByDocId(parseInt(Id)).subscribe(res => {
            // that.selectedReceivers = res;
            let count = 0;
            res.forEach(x => {
                ++count;
                that.selectedReceivers.push({text: x.Name, id: count, itemData: {id: count, index: x.ReceicerId, name: x.Name, isLocal: x.IsLocal}});
                that.displayReceiverList.push(x.ReceicerId);
                let item = new ReceiverDto();
                item.id = x.ReceicerId;
                item.isLocal = x.IsLocal;
                item.name = x.Name;
                item.index = count;
                that.arr.push(item);
            });
            that.publisherSelect.disabled = true;
            this.documentData.receiverId = that.arr;
        });
        this._oDocServiceProxy.getListLinkedDocumentByODocId(parseInt(Id)).subscribe(result => {
            this.selectedResponseDocs = result.map(x => {return {id: x.linkedDocId, incommingNumber: x.linkedDocNumber}});
            this.selectedLinkedDocuments = result.map(x => {return x.linkedDocId});
        });


        this.initNumberOptions();
        this.initDocumentTypeOptions();
        //this.initDraftNumBerChkBoxOptions();
        this.getUserInDept();
        this.getLeaderInDept();
        this.radio_nguoi_ky();
        this._oDocServiceProxy.getListOrgLevels().subscribe(res => {
            console.log(res);
            this.orgLevelSource = res;
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
        // this.getIncommingNumber();


        this._documentHandlingAppService.getLeaderList_PGD().subscribe(res =>{
            this.director_list = res;
            for(var i = 0, len = this.director_list.length; i < len; i++){
                this.director_list[i]["nameWithPosition"] = this.director_list[i]["position"] + " - " + this.director_list[i]["fullName"];
            }
        });
        this._documentHandlingAppService.getLeaderList_PB().subscribe(res => {
            this.captain_department = res;
            for(var i = 0, len = this.captain_department.length; i < len; i++){
                this.captain_department[i]["nameWithPosition"] = this.captain_department[i]["position"] + " - " + this.captain_department[i]["fullName"];
            }
            this.radio_nguoi_ky();
        });
    }

    numberOptions: any;
    bookOptions: any;



    initNumberOptions() {
        const self = this;
        this.numberOptions = {
            onValueChanged: function (e) {
                self.isNumberDisabled = !self.isNumberDisabled;
                if(e.value == true){ // nút tự động được chọn
                    let curBook = self.dataBook.find(x => x.id == self.documentData.book);
                    self.currentSyntax = curBook.syntax;
                    if(self.currentSyntax.includes("{currentValue}")){
                        self.soKyHieu = self.currentSyntax.replace("{currentValue}", self.currentNumberInBook);
                    }
                    if(self.currentSyntax.includes("{documentType}")){
                        if(!self.documentData.documentTypeId){
                            self.chkAutomaticNumberValue = false;
                            self.notify.warn("Chọn Loại VB");
                            self.soKyHieu = "";
                            return;
                        }
                        let selectedDocType = self.documentTypeDataSource.find(x => x.id == self.documentData.documentTypeId).signal;
                        console.log(selectedDocType);
                        self.soKyHieu = self.soKyHieu.replace("{documentType}", selectedDocType);
                    }
                    if(self.currentSyntax.includes("{range}")){ // lĩnh vực
                        if(!self.documentData.range){
                            self.chkAutomaticNumberValue = false;
                            self.notify.warn("Chọn Lĩnh vực");
                            self.soKyHieu = "";
                            return;
                        }

                        self.soKyHieu = self.soKyHieu.replace("{range}", self.data_range.find(x => x.key == self.documentData.range).value);
                    }
                    if(self.currentSyntax.includes("{publisher}")){
                        self.soKyHieu = self.soKyHieu.replace("{publisher}", self.data_department.find(x => x.id == self.documentData.orgEditor).shortentCode);
                    }

                }
                console.log(self.soKyHieu);
                self.documentData.number = self.soKyHieu;
            }
        };
    }

    initDocumentTypeOptions(){
        const self = this;
        this.documentTypeOptions = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                  const promise = new Promise((resolve, reject) => {
                    self._documentTypeAppService.getAllDocumentType().subscribe(result => {
                        self.signal = result[0].signal;
                        self.documentTypeDataSource = result;
                        resolve(result);
                    }, err => {
                        reject(err);
                    });
                  });
                  return promise;
                }
            },
            valueExpr: 'id',
            displayExpr: 'typeName',
            searchEnabled: true,
            searchExpr: ['typeName', 'signal'],
            showClearButton: true,
            readOnly: self.isReadOnlyForm,
            disabled: self.isReadOnlyForm
            // onValueChanged: function(e) {

            // }
        };
    }

    initRangeOptions(){
        const self = this;
        this.rangeOptions = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                    console.log(self.data_range)
                    return self.data_range;
                }
            },
            valueExpr: 'key',
            displayExpr: 'value',
            searchEnabled: true,
            searchExpr: 'value',
            showClearButton: true,
            readOnly: self.isReadOnlyForm
        }
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
    diff_fileDinhKem = [];
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

    // checkIncommingNumber(): Promise<any>{
    //     const promise = new Promise((resolve)=>{
    //         const self = this;
    //         if(this.chkAutomaticValue){ // trường hợp tự động
    //             this.getIncommingNumber(1); // gọi lại hàm lấy số = CurrentValue + 1
    //             self.error = false;
    //             resolve(self.error);
    //         }
    //         else{
    //             this._documentAppService.isNumberInBookExisted(this.bookVal, this.nextNumber).subscribe(result => {
    //                 if(!result){ // chưa tồn tại => lấy số này luôn
    //                     self.error = false;
    //                 }
    //                 resolve(self.error);
    //             })
    //         }
    //     });
    //     return promise;
    // }

    chkAutomatic(e: any){
        this.maDuThaoDisabled = !this.maDuThaoDisabled;
        console.log(this.maDuThaoDisabled)
        $('#maDuThaoTxtBx').dxTextBox({ readOnly: this.maDuThaoDisabled });
        if(e.value == true){ // nút tự động được chọn
            // this.getIncommingNumber(this.bookVal);
        }
    }

    save(): void {
        //let result = this.documentForm.instance.validate();
        //const that = this;
        //if(result.isValid){
            this.saving = true;
            if(this.tepDinhKemSave.length == 0){
                this.message.warn('Vui lòng đính kèm file trước khi lưu trữ');
                this.saving = false;
                return;
            }
            else{
                // this.documentData.attachment = this.tepDinhKemSave !== '' ? this.tepDinhKemSave: null;
                if(this.isDirty){
                    let file = this.diff_fileDinhKem.map(x => x.name).join(';');

                    this._oDocServiceProxy.capNhatFileVaLuuTru(this.documentData.id, file)
                    .pipe(finalize(() => { this.saving = false;}))
                    .subscribe(() => {
                        this.message.success('Văn Bản đã được lưu trữ thành công!');
                        this.router.navigate(['/app/main/qlvb/da-luu-tru']);
                    });

                }
                else {
                    this._oDocServiceProxy.capNhatFileVaLuuTru(this.documentData.id, '')
                    .pipe(finalize(() => { this.saving = false;}))
                    .subscribe(() => {
                        this.message.success('Văn Bản đã được lưu trữ thành công!');
                        this.router.navigate(['/app/main/qlvb/da-luu-tru']);
                    });
                }

            }
    }

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

    // bookSelectionChange(e: any){
    //     this.getIncommingNumber();
    // }

    changeIncommingDate(e :any){
        if(this.numberOfDaysByDocType == null)
        {
            this.deadLineDate = null;
        }
        else {
            this.deadLineDate = this.addDays(e.value, this.numberOfDaysByDocType);
        }
        // this.documentData.endDate = this.deadLineDate.;
    }

    numberOfDaysChanged(e: any){
        //this.deadLineDate = this.addDays(moment(this.documentData.incommingDate).format('YYYY-MM-DD'), e.value);
        if(this.numberOfDaysByDocType == null){
            this.deadLineDate = null;
        }
        else{
        //this.deadLineDate = this.addDays(moment(this.documentData.incommingDate).format('YYYY-MM-DD'), e.value);
        }
    }

    // initDraftNumBerChkBoxOptions(){
    //     const that = this;
    //     this.draftNumBerChkBoxOptions = {
    //         value: true,
    //         disabled: that.isDraftNumberDisabled,
    //         onValueChanged: function(e){
    //             if(e.value == true){
    //                 this._oDocServiceProxy.getDraftNumberOfCommBook().subscribe(res => {
    //                     this.documentData.draftNumber = res;
    //                 });
    //             }

    //         }
    //     }
    // }

    // getIncommingNumber() {
    //     this._oDocServiceProxy.getDraftNumberOfCommBook().subscribe(res => {
    //         this.documentData.draftNumber = res;
    //     })
    // }

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

    getUserInDept(){
        this._oDocServiceProxy.getUserInRoleByOrg(this.appSession.organizationUnitId, '').subscribe(res => {
            this.editorList = res;
            for(var i = 0, len = this.editorList.length; i < len; i++){
                if(this.editorList[i]["position"]){
                    this.editorList[i]["nameWithPosition"] = this.editorList[i]["position"] + " - " + this.editorList[i]["fullName"];
                }
                else{
                    this.editorList[i]["nameWithPosition"] = this.editorList[i]["fullName"];
                }
            }
        })
    }

    getLeaderInDept(){
        this._oDocServiceProxy.getLeaderInDepartment(this.appSession.organizationUnitId).subscribe(res => {
            this.chi_huy = res;
            for(var i = 0, len = this.chi_huy.length; i < len; i++){
                this.chi_huy[i]["nameWithPosition"] = this.chi_huy[i]["position"] + " - " + this.chi_huy[i]["fullName"];
            }
        });
    }

    saveAndPublish(){

    }

    reloadPage(){
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
    }

    selectReplyDocument(){
        this.router.navigate(['/app/main/qlvb/search-document']);
    }

    showSearchPopUp(){
        this.receiverPopupVisible = true;
    }

    onSelectionChanged(e: any){
        this.data_receiver.forEach(x => {
            if(x["selected"] == true && _.includes(this.selectedReceivers, {id: x.id, displayName: x.displayName}) == false){
                console.log(x);
                this.selectedReceivers.push({id: x.id, displayName: x.displayName});
            }
            else if(x["selected"] == false){
                this.selectedReceivers.slice(this.selectedReceivers.findIndex(a => a.id == x.id), 1);
            }
        });
        console.log(this.selectedReceivers);
    }

    radio_nguoi_ky(){
        console.log(this.leaderTypeVal)
        if(this.leaderTypeVal == 1){
            this.nguoi_ky =  this.captain_department;
        }
        else if(this.leaderTypeVal == 2){
            this.nguoi_ky = this.chi_huy;
        }
        // console.log(e);
    }

    getResponseDocuments(list: DocumentsDto[]){
        console.log(list);
        //lưu id
        let listId = [];
        //lưu number
        let listNumber = [];
        if(list.length > 0){
            this.documentData.linkedDocumentList = [];
            this.selectedResponseDocs = list;
            list.forEach(x => {
                listId.push(x.id);
                listNumber.push(x.incommingNumber);
                let temp = new CreateOrEditLinkedDocumentDto();
                temp.linkedDocId = x.id;
                temp.linkedDocNumber = x.incommingNumber;
                this.documentData.linkedDocumentList.push(temp);
            });
        }
        this.linkDocumentVal = listNumber.join(';');
        // this.documentData.linkedDocument = listId.join(';');
    }


    initLinkedDocOptions(){
        const that = this;
        this.linkedDocOptions = {
            acceptCustomValue: true,
            searchEnabled: false,
            noDataText: "",
            valueExpr: 'id',
            displayExpr: 'number',
            dataSource: that.selectedResponseDocs,
            onValueChanged: function(e){
                console.log(e);
            }
        }
    }

}
