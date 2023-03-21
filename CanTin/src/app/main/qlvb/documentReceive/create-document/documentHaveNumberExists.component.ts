import { Component, Injector, OnInit, Input, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DocumentServiceProxy, DocumentHandlingsServiceProxy, DynamicGridHelperServiceProxy } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

import { Router, ActivatedRoute } from '@angular/router';
import { DxDataGridComponent, DxSelectBoxComponent } from 'devextreme-angular';

import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { DynamicModuleComponent } from '@app/shared/common/dynamicModule/dynamicModule.component';
import { ModalDirective } from 'ngx-bootstrap';


@Component({
    selector: 'documentHaveNumberExists',
    templateUrl: './documentHaveNumberExists.component.html',
    
    animations: [appModuleAnimation()]
})
export class DocumentHaveNumberExistsComponent extends AppComponentBase implements OnInit {
    @Input() actionID: string;
    // @Output() lbId = new EventEmitter<number>();
    @ViewChild(DxDataGridComponent, { static: true }) gridContainer: DxDataGridComponent;
    // @ViewChild('transferHandleModal', { static: true }) transferHandleModal: TransferHandleModalComponent;
    @Input() Number: string;
    @Input() OrgLevelId: number;
    @Input() Publisher: number;
    @Input() PublishDate: any;
    @ViewChild('gridContainer113', { static: true }) gridContainer113: DxDataGridComponent;


    saving = false;

    selectionChangedBySelectbox: boolean;
    prefix = '';
    dataRowDetail: any;
    initialData: any;
    documentExistsVisible = false;


    constructor(
        injector: Injector,
        private _documentAppService: DocumentServiceProxy,
        private _activatedRoute: ActivatedRoute) {
        super(injector);
    }

    ngOnInit() {
        
    }

    loadData(){
        this.documentExistsVisible = true;
        this._documentAppService.getDocumentExists(this.Number).subscribe(res => {
            this.initialData = res;
        });
    }

    loadDataWithConditition(){
        this.documentExistsVisible = true;
        this._documentAppService.getDocumentExistsWithConditition(this.Number, this.OrgLevelId, this.Publisher, this.PublishDate).subscribe(res => {
            this.initialData = res;
        });
    }

}
