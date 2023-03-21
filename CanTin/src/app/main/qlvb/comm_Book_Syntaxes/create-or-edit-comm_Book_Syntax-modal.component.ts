import { Comm_booksServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { Component, ViewChild, Injector, Output, EventEmitter, OnInit} from '@angular/core';
import { Comm_Book_SyntaxesServiceProxy, CreateOrEditComm_Book_SyntaxDto, OrganizationUnitServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
// import * as moment from '@app/main/qlvb/comm_Book_Syntaxes/node_modules/moment';

@Component({
    selector: 'createOrEditComm_Book_SyntaxModal',
    templateUrl: './create-or-edit-comm_Book_Syntax-modal.component.html'
})
export class CreateOrEditComm_Book_SyntaxModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    comm_Book_Syntax: CreateOrEditComm_Book_SyntaxDto = new CreateOrEditComm_Book_SyntaxDto();
    listOrganizationUnit = [];
    isHidden = false;

    constructor(
        injector: Injector,
        private _comm_Book_SyntaxesServiceProxy: Comm_Book_SyntaxesServiceProxy,
        private _comm_booksServiceProxy: Comm_booksServiceProxy
    ) {
        super(injector);
    }

    // ngOnInit(){
    //     this._comm_booksServiceProxy.getAllOrganizationUnitsForAdmin().subscribe(res => {
    //         this.listOrganizationUnit = res;
    //         if(res.length > 0){
    //             this.isHidden = true;
    //         }
    //     });
    // }

    show(comm_Book_SyntaxId?: number): void {
        if (!comm_Book_SyntaxId) {
            this.comm_Book_Syntax = new CreateOrEditComm_Book_SyntaxDto();
            this.comm_Book_Syntax.id = comm_Book_SyntaxId;

            this.active = true;
            this.modal.show();
        } else {
            this._comm_Book_SyntaxesServiceProxy.getComm_Book_SyntaxForEdit(comm_Book_SyntaxId).subscribe(result => {
                this.comm_Book_Syntax = result.comm_Book_Syntax;


                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
            this.saving = true;
            console.log(this.comm_Book_Syntax);
			
            this._comm_Book_SyntaxesServiceProxy.createOrEdit(this.comm_Book_Syntax)
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
