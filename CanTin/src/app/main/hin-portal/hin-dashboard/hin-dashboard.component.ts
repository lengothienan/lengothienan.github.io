import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DashboardCustomizationConst } from '@app/shared/common/customizable-dashboard/DashboardCustomizationConsts';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './hin-dashboard.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class HinDashboardComponent extends AppComponentBase {
    dashboardName = this._activatedRoute.snapshot.queryParams['name'];
    editExtention = false;

    constructor(injector: Injector, private _activatedRoute: ActivatedRoute,) {
        super(injector);
        this.dashboardName = this._activatedRoute.snapshot.paramMap.get('name');
    }
}
