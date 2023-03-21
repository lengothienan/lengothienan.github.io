import { Component, ViewChild, Injector, Output, EventEmitter} from '@angular/core';
import { Comm_booksServiceProxy, CreateOrEditComm_bookDto, Comm_Book_SyntaxesServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import moment from 'moment';
import { finalize } from 'rxjs/operators';
import { DxFormComponent } from 'devextreme-angular';

@Component({
    selector: 'createOrEditComm_bookModal',
    templateUrl: './create-or-edit-comm_book-modal.component.html'
})
export class CreateOrEditComm_bookModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @ViewChild('documentForm', {static: false}) documentForm: DxFormComponent; 


    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    comm_book: CreateOrEditComm_bookDto = new CreateOrEditComm_bookDto();

    fromDate: Date;

    beginDateOfYear: Date;

    endDateOfYear: Date;

    listOrganizationUnit = [];
    isDisabled = true;
    currentDate: Date;
    syntaxList = [];
    bookType = [
        {type: '1', name: 'Văn bản đến'},
        {type: '2', name: 'Văn bản đi'},
        {type: '3', name: 'Văn bản dự thảo'}
    ];

    commBookType = [
        {value: 1, name: 'Sổ thường'},
        {value: 2, name: 'Sổ mật'},
        {value: 3, name: 'Khác'}
    ]

    constructor(
        injector: Injector,
        private _comm_booksServiceProxy: Comm_booksServiceProxy,
        private _com_book_syntaxServiceProxy: Comm_Book_SyntaxesServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(){
        this._comm_booksServiceProxy.getAllOrganizationUnitsForAdmin().subscribe(res => {
            this.listOrganizationUnit = res;
            if(res.length > 1){
                this.isDisabled = false;
            }
        });
        this.currentDate = new Date();
        this._com_book_syntaxServiceProxy.getAllCommBookSyntax().subscribe(res => {
            this.syntaxList = res;
        })
    }

    show(comm_bookId?: number): void {
        this.fromDate = null;

        if (!comm_bookId) {
            this.comm_book = new CreateOrEditComm_bookDto();
            this.comm_book.id = comm_bookId;
            this.comm_book.orgId = this.appSession.organizationUnitId;
            this.comm_book.currentRank=0;
            this.comm_book.isActive = true;
            this.active = true;
            this.modal.show();
        } else {
            this._comm_booksServiceProxy.getComm_bookForEdit(comm_bookId).subscribe(result => {
                this.comm_book = result.comm_book;

                if (this.comm_book.fromDate) {
					this.fromDate = this.comm_book.fromDate.toDate();
                }
                if(this.comm_book.toDate){
                    this.fromDate = this.comm_book.toDate.toDate();
                }
                this.active = true;
                this.modal.show();
            });
        }
        // this.bookType = this.comm_book.bookType;
        this.beginDateOfYear = new Date(new Date().getFullYear(), 0, 1);
        this.endDateOfYear = new Date(new Date().getFullYear(), 11, 31);
    }

    save(): void {
        if(!this.documentForm.instance.validate().isValid){
            this.notify.error("Chưa nhập đầy đủ thông tin");
            return;
        }
        this.saving = true;
        // if (this.fromDate) {
        //     if (!this.comm_book.fromDate) {
        //         this.comm_book.fromDate = moment(this.fromDate).startOf('day');
        //     }
        //     else {
        //         this.comm_book.fromDate = moment(this.fromDate);
        //     }
        // }
        // else {
        //     this.comm_book.fromDate = null;
        // }
        if(!this.comm_book.orgId){
            this.comm_book.orgId = this.appSession.organizationUnitId;
        }
        this._comm_booksServiceProxy.createOrEdit(this.comm_book)
             .pipe(finalize(() => { this.saving = false;}))
             .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
             });
    }







    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
