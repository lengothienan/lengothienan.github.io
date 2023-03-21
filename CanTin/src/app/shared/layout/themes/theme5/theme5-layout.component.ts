import { Injector, ElementRef, Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { UrlHelper } from '@shared/helpers/UrlHelper';
import { LayoutRefService } from '@metronic/app/core/_base/layout/services/layout-ref.service';
import { AppConsts } from '@shared/AppConsts';
import { OffcanvasOptions } from '@metronic/app/core/_base/layout/directives/offcanvas.directive';
import { SideBarMenuComponent } from '../../nav/side-bar-menu.component';
import { Theme5BrandComponent } from './theme5-brand.component';
import { TopBarMenuComponent } from '../../nav/top-bar-menu.component';
import { AppMenuItem } from '../../nav/app-menu-item';


@Component({
    templateUrl: './theme5-layout.component.html',
    selector: 'theme5-layout',
    animations: [appModuleAnimation()]
})
export class Theme5LayoutComponent extends ThemesLayoutBaseComponent implements OnInit, AfterViewInit {
    @ViewChild(SideBarMenuComponent, { static: false }) sideBar: SideBarMenuComponent
    @ViewChild(TopBarMenuComponent, { static: false }) topBarMenu: TopBarMenuComponent
    @ViewChild(Theme5BrandComponent, { static: false }) theme5brand: Theme5BrandComponent
    @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;
    topId: string;
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    luu_maMau: string;
    logoSrc: string;
    menuItem : AppMenuItem[] = [];

    currentUserId = this.appSession.userId;
    currentUser = this.appSession.user.userName;
    currentUser2 = this.appSession;
    maLogo: string = '/assets/common/images/app-logo-on-light.png';
    
    menuCanvasOptions: OffcanvasOptions = {
        baseClass: 'kt-aside',
        overlay: true,
        closeBy: 'kt_aside_close_btn',
        toggleBy: {
            target: 'kt_aside_desktop_toggler',
            state: 'kt-header-desktop__toolbar-toggler--active'
        }
    };

    constructor(
        injector: Injector,
        private layoutRefService: LayoutRefService
    ) {
        super(injector);
    }

    getTopId(id: string){
        // var customCss = "red";
        // var label = "label";
        this.topId = id;
        console.log(id);
        // this.caMenuItems = this.topBarMenu.menu;
        this.sideBar.ngOnInit(this.topId);
        // this.theme5brand.ngOnInit();
        
        if(this.topBarMenu.menu.items.length > 0){
            this.menuItem = this.topBarMenu.menu.items;
            for(var i = 0; i < this.menuItem.length; i++){
                if(this.menuItem[i].id.toString() == id ){
                    this.luu_maMau = this.menuItem[i].sideBarMenuColor;
                    localStorage.setItem("sb_color", this.luu_maMau);

                    this.logoSrc  = this.menuItem[i].logoSrc;
                    localStorage.setItem("logo_src" , this.logoSrc);
                }
            }
        }
        // if(id == '2'){
        //     this.luu_maMau = '#e3f6f9';
        // }
        // if(id == '3'){
        //     this.luu_maMau = '#e0f9d3';
        // }
        this.theme5brand.ngOnInit(this.logoSrc);
        document.getElementById('kt_aside_menu_wrapper').style.backgroundColor = this.luu_maMau;
    }

    ngOnInit() {
        this.installationMode = UrlHelper.isInstallUrl(location.href);
        if(localStorage.getItem("topMenuSelected") !== undefined){
            let maMau = localStorage.getItem("topMenuSelected");
            if(maMau == '2'){
                this.luu_maMau = '#e3f6f9';
            }
            if(maMau == '3'){
                this.luu_maMau = '#e0f9d3';
            }
            document.getElementById('kt_aside_menu_wrapper').style.backgroundColor = this.luu_maMau;
        }
        else {
            document.getElementById('kt_aside_menu_wrapper').style.backgroundColor = '#e3f6f9';
        }
    }

    ngAfterViewInit(): void {
        //
        this.layoutRefService.addElement('header', this.ktHeader.nativeElement);
    }

    // getMaMau(e): void{
    //     if(e == '2'){
    //         this.luu_maMau = '#e3f6f9';
    //     }else{
    //         if(localStorage.getItem("sb_color") && localStorage.getItem("logo_src")){
    //             sd_color = localStorage.getItem("sb_color");
    //             logoSrc = localStorage.getItem("logo_src");
    //         }
            
    //     }
    //     if(e == '3'){
    //         this.luu_maMau = '#e0f9d3';
    //     }
    //     // document.getElementById('kt_aside_menu_wrapper').style = '';
    //     document.getElementById('kt_aside_menu_wrapper').style.backgroundColor = this.luu_maMau;
    //     //this.getTopId(localStorage.getItem("topMenuSelected"));
    //     //this.sideBar.ngOnInit(localStorage.getItem("topMenuSelected"));
    //     this.theme5brand.ngOnInit(localStorage.getItem("topMenuSelected"));
        
    // }

    getMaMau(e){
        console.log(e)
    }

    // getMaLogo(e): void{
    //     if(e == '2'){
    //         this.luu_maMau = '#e3f6f9';
    //     }
    //     if(e == '3'){
    //         this.luu_maMau = '#e0f9d3';
    //     }
    //     // document.getElementById('kt_aside_menu_wrapper').style = '';
    //     document.getElementById('kt_aside_menu_wrapper').style.backgroundColor = this.luu_maMau;
        
    // }

    getMaMau2(e): void{
        this.luu_maMau = e;
        if(e == '2'){
            this.luu_maMau = '#e3f6f9';
        }
        if(e == '3'){
            this.luu_maMau = '#e0f9d3';
        }
        // document.getElementById('kt_aside_menu_wrapper').style = '';
        // this.theme5brand.getMaLogo(e);
    }
}
