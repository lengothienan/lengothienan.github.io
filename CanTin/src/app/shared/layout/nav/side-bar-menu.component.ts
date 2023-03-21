import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { EventEmitter, Injector, ElementRef, Component, OnInit, ViewEncapsulation, Inject, Renderer2, ChangeDetectionStrategy, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AppMenu } from './app-menu';
import { AppNavigationService } from './app-navigation.service';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

import { MenuOptions } from '@metronic/app/core/_base/layout/directives/menu.directive';
import { CounterDto, LabelsServiceProxy } from '@shared/service-proxies/service-proxies';
import { UtilityService } from '@shared/utils/UltilityService.service';
import { AppMenuItem } from './app-menu-item';
import { TreeNode } from 'primeng/api';
import { ArrayToTreeConverterService } from '@shared/utils/array-to-tree-converter.service';
import { Observable } from 'rxjs';
import { Theme5BrandComponent } from '../themes/theme5/theme5-brand.component';

@Component({
    templateUrl: './side-bar-menu.component.html',
    selector: 'side-bar-menu',
     encapsulation: ViewEncapsulation.None,
     changeDetection: ChangeDetectionStrategy.Default
})
export class SideBarMenuComponent extends AppComponentBase implements OnInit {
    @Output() maMau : EventEmitter<string> = new EventEmitter<string>();

    
    @ViewChild(Theme5BrandComponent, { static: false }) theme5brand: Theme5BrandComponent;
    
    df_color = "black";
    df_fSize = "";
    df_fFamily = "";

    
    empty: string = "";
    titleVb : string;
    currentUserId = this.appSession.userId;

    menu: AppMenu = null;
//no dang bi gi vay bao, bất đồng bộ
    currentRouteUrl = '';
    insideTm: any;
    selectedOu: TreeNode;
    listLabel:any;
    outsideTm: any;
    labels: AppMenuItem[] = [];
    numberOfDocuments: CounterDto[] = [];
    appMenu: Observable<AppMenu>;
    rawSql: string;
    numberOfDoc: CounterDto[] = [];
    maMauSideBarMenu : string ;

    menuOptions: MenuOptions = {
        // vertical scroll
        scroll: null,

        // submenu setup
        submenu: {
            desktop: {
                default: 'dropdown',
                state: {
                    body: 'kt-aside--minimize',
                    mode: 'dropdown'
                }
            },
            tablet: 'accordion', // menu set to accordion in tablet mode
            mobile: 'accordion' // menu set to accordion in mobile mode
        },

        // accordion setup
        accordion: {
            expandAll: false // allow having multiple expanded accordions in the menu
        }
    };

    constructor(
        injector: Injector,
        private el: ElementRef,
        private _arrayToTreeConverterService : ArrayToTreeConverterService,
        private route: ActivatedRoute,
        private router: Router,
        public permission: PermissionCheckerService,
        private _appNavigationService: AppNavigationService,
        private ultility: UtilityService,
        private _labelAppService: LabelsServiceProxy,
        @Inject(DOCUMENT) private document: Document,
        private render: Renderer2) {
        super(injector);


    }

    ngOnInit(id: string = "2") {
        if(localStorage.getItem("topMenuSelected") != null){

            id = localStorage.getItem("topMenuSelected");
        }
        this.menu = this._appNavigationService.getFullLabels(parseInt(id));
        this.currentRouteUrl = this.router.url.split(/[?#]/)[0];
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(event => this.currentRouteUrl = this.router.url.split(/[?#]/)[0]);
    }

    showMenuItem(menuItem): boolean {
        return this._appNavigationService.showMenuItem(menuItem);
    }

    event(e: any){
        let x = e.id;
    }

    isMenuItemIsActive(item): boolean {
        if (item.items.length) {
            return this.isMenuRootItemIsActive(item);
        }

        if (!item.route) {
            return false;
        }

        // dashboard
        if (item.route !== '/' && this.currentRouteUrl.startsWith(item.route)) {
            return true;
        }

        return this.currentRouteUrl.replace(/\/$/, '') === item.route.replace(/\/$/, '');
    }

    isMenuRootItemIsActive(item): boolean {
        let result = false;

        for (const subItem of item.items) {
            result = this.isMenuItemIsActive(subItem);
            if (result) {
                return true;
            }
        }

        return false;
    }

    /**
	 * Use for fixed left aside menu, to show menu on mouseenter event.
	 * @param e Event
	 */
    mouseEnter(e: any) {
        if (!this.currentTheme.baseSettings.menu.allowAsideMinimizing) {
            return;
        }

        // check if the left aside menu is fixed
        if (document.body.classList.contains('kt-aside--fixed')) {
            if (this.outsideTm) {
                clearTimeout(this.outsideTm);
                this.outsideTm = null;
            }

            this.insideTm = setTimeout(() => {
                // if the left aside menu is minimized
                if (document.body.classList.contains('kt-aside--minimize') && KTUtil.isInResponsiveRange('desktop')) {
                    // show the left aside menu
                    this.render.removeClass(document.body, 'kt-aside--minimize');
                    this.render.addClass(document.body, 'kt-aside--minimize-hover');
                }
            }, 50);
        }
    }

    /**
     * Use for fixed left aside menu, to show menu on mouseenter event.
     * @param e Event
     */
    mouseLeave(e: Event) {
        if (!this.currentTheme.baseSettings.menu.allowAsideMinimizing) {
            return;
        }

        if (document.body.classList.contains('kt-aside--fixed')) {
            if (this.insideTm) {
                clearTimeout(this.insideTm);
                this.insideTm = null;
            }

            this.outsideTm = setTimeout(() => {
                // if the left aside menu is expand
                if (document.body.classList.contains('kt-aside--minimize-hover') && KTUtil.isInResponsiveRange('desktop')) {
                    // hide back the left aside menu
                    this.render.removeClass(document.body, 'kt-aside--minimize-hover');
                    this.render.addClass(document.body, 'kt-aside--minimize');
                }
            }, 100);
        }
    }

    /**
     * Use for fixed left aside menu, to show menu on mouseenter event.
     * @param e Event
     */
    // mouseClick(e: Event, item: any){
        
    //     // console.log(item.departmentOrTeam)
    //     // if(item.departmentOrTeam == true){
    //     //     console.log(true);
    //     //     this.router.navigate(['/app/main/qlvb/danh-sach-vb-theo-doi-doi/' + item.id]);
    //     // }
    //     // else if(item.rawSql != undefined || item.rawSql != null){
    //     //     this.router.navigate(['/app/main/qlvb/executeLabelSQL/' + item.id]);
    //     // }
    // }

    checkIcon(o): object{
        if(o != null && o != undefined && o != "") return JSON.parse(o);
        return {"color": "black"};
    }
}
