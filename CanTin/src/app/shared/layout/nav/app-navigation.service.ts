import { Injectable } from '@angular/core';
import { AppMenu } from './app-menu';
import { AppMenuItem } from './app-menu-item';
import { MenusServiceProxy, PagedResultDtoOfGetMenusForViewDto, MenuDto, UserServiceProxy, LabelsServiceProxy, DocumentServiceProxy, CounterDto, LabelDto } from '@shared/service-proxies/service-proxies';
import { error } from '@angular/compiler/src/util';
import { TreeDataHelperService } from '@shared/utils/tree-data-helper.service';
import { ArrayToTreeConverterService } from '@shared/utils/array-to-tree-converter.service';
import * as _ from 'lodash';
import { PermissionCheckerService } from 'abp-ng2-module/dist/src/auth/permission-checker.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { debug } from 'console';
@Injectable()
export class AppNavigationService {

    constructor(
        private _arrayToTreeConverterService: ArrayToTreeConverterService,
        private _permissionCheckerService: PermissionCheckerService,
        private _appSessionService: AppSessionService,
        private _menuApp: MenusServiceProxy,
        private _userAppService: UserServiceProxy,
        private _labelAppService: LabelsServiceProxy,
        private _treeDataHelperService: TreeDataHelperService,
        private _documentAppService: DocumentServiceProxy,
        private http: HttpClient
    ) {
    }

    currentUserRole = '';
    child = '';
    labelFather: AppMenuItem[] = [];
    labelFather1: AppMenuItem[] = [];
    labelFather2: AppMenuItem[] = [];
    dataDisplay: any;
    list_label: any;
    selecchildID: any;
    selecchildParenttID: any;
    selecMenuParenttID: any
    labels_: AppMenuItem[] = [];
    labels: AppMenuItem[] = [];
    numberOfDocuments: CounterDto[] = [];
    fullMenu = new AppMenu('LeftMenu', 'LeftMenu', []);
    getUserRole(): string {
        this._userAppService.getRoleNameOfUser(this._appSessionService.userId).subscribe((result: string) => {
            return result;
        });
        return '';
    }

    getFullLabels(id: number): AppMenu {
        // this.getNumberOfDocument();

        this.createMenu(id);
        return this.fullMenu;

    }

    testRealTime(){
        let url = AppConsts.remoteServiceBaseUrl + '/api/services/app/Labels/GetListLabel?menuID=2';

        return this.http.get<LabelDto[]>(url).subscribe(res => {res.map});
    }


    createMenu(id: number) {
        this._labelAppService.getListLabel(id, this._appSessionService.organizationUnitId, this._appSessionService.selfOrganizationUnitId).subscribe(result => {
            this.labelFather1.length = 0;
            let fullLabel = result.parentLabel.concat(result.childLabel);
            for (var i = 0, j = fullLabel.length; i < j; i++){
                let ele = fullLabel[i];
                this.labelFather1.push(new AppMenuItem(ele.name, ele.requiredPermissionName, ele.icon, ele.link, [], ele.id, ele.parent, ele.index, ele.countNum, ele.countOutOfDate, JSON.parse(ele.queryParam),ele.cssFormat, ele.cssIconFormat));
            }

            this.labels_.length = 0;

            this.labels_ = this._arrayToTreeConverterService.createMenu(this.labelFather1,   // ben kia no la 1 cai list
                "parent",
                'id',
                0,
                'items'
            );

            this.fullMenu.items = this.labels_;
        });
    }

    getAllTopMenu(): AppMenu {
        var topMenus = [];

        this._menuApp.getAllTopMenu(this._appSessionService.organizationUnitId).subscribe(result => {
            result.forEach(element => {
                topMenus.push(new AppMenuItem(element.title, element.requiredPermissionName, element.icon, element.link, [], element.id, null, null, null, null, " ", " "," ", element.logoSrc, element.sideBarMenuColor));
            });

            //localStorage.setItem('topMenuSelected', topMenus[0].id);
        });
        return new AppMenu('TopMenu', 'TopMenu', topMenus);
    }

    getAllSideBarMenu(paretnId: number): AppMenu {
        var sideMenu = [];

        this._menuApp.getAllSideBarMenu(paretnId).subscribe(result => {
            result.items.forEach(element => {
                sideMenu.push(new AppMenuItem(element.title, element.requiredPermissionName, element.icon, element.link, [], element.id));
            });
        });
        return new AppMenu('TopMenu', 'TopMenu', sideMenu);
    }

    getMenu(): AppMenu {
        return new AppMenu('MainMenu', 'MainMenu', [

        ]);

    }

    checkChildMenuItemPermission(menuItem): boolean {

        for (let i = 0; i < menuItem.items.length; i++) {
            let subMenuItem = menuItem.items[i];

            if (subMenuItem.permissionName === '' || subMenuItem.permissionName === null || subMenuItem.permissionName && this._permissionCheckerService.isGranted(subMenuItem.permissionName)) {
                return true;
            } else if (subMenuItem.items && subMenuItem.items.length) {
                return this.checkChildMenuItemPermission(subMenuItem);
            }
        }

        return false;
    }

    showMenuItem(menuItem: AppMenuItem): boolean {
        if (menuItem.permissionName === 'Pages.Administration.Tenant.SubscriptionManagement' && this._appSessionService.tenant && !this._appSessionService.tenant.edition) {
            return false;
        }

        let hideMenuItem = false;

        if (menuItem.requiresAuthentication && !this._appSessionService.user) {
            hideMenuItem = true;
        }

        if (menuItem.permissionName && !this._permissionCheckerService.isGranted(menuItem.permissionName)) {
            hideMenuItem = true;
        }

        if (this._appSessionService.tenant || !abp.multiTenancy.ignoreFeatureCheckForHostUsers) {
            if (menuItem.hasFeatureDependency() && !menuItem.featureDependencySatisfied()) {
                hideMenuItem = true;
            }
        }

        if (!hideMenuItem && menuItem.items && menuItem.items.length) {
            return this.checkChildMenuItemPermission(menuItem);
        }

        return !hideMenuItem;
    }

    /**
     * Returns all menu items recursively
     */
    getAllMenuItems(): AppMenuItem[] {
        let menu = this.getMenu();
        let allMenuItems: AppMenuItem[] = [];
        menu.items.forEach(menuItem => {
            // allMenuItems = allMenuItems.concat(this.getAllMenuItemsRecursive(menuItem));
        });

        return allMenuItems;
    }
}
