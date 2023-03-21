import { Component, Injector, ViewEncapsulation, ViewChild, OnInit, Input } from '@angular/core';
import { DynamicFieldsServiceProxy, RoleServiceProxy ,TenantServiceProxy   , LabelsServiceProxy, LabelDto, DynamicActionsServiceProxy, TenantListDto, RoleListDto, CreateOrEditDynamicActionDto, Comm_booksServiceProxy  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';

import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DxDataGridComponent, DxTreeViewComponent,DxTagBoxComponent ,DxLookupModule ,DxPopupModule, DxFormComponent, DxTextBoxComponent } from 'devextreme-angular';

@Component({
    selector: 'update-incomming-number',
    templateUrl: './update-incomming-number.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class UpdateCurrentIncommingNumberComponent extends AppComponentBase {
    @ViewChild(DxFormComponent, { static: false }) dxForm: DxFormComponent;
    @ViewChild('numTxtBox', { static: true }) numTxtBox: DxTextBoxComponent;
    numVal: any;
    constructor(
        injector: Injector,
        private _commBookServiceProxy: Comm_booksServiceProxy
    ) {
        super(injector);
        

    }
    ngOnInit(){
        
    }

    save(){
        console.log(this.numVal);
        this._commBookServiceProxy.changeCurrentValue(this.numVal).subscribe((res) => {
            this.message.success("Thay đổi thành công");
        });
    }
}