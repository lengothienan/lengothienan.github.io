import { Injector, Component, ViewEncapsulation, Inject } from '@angular/core';

import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/common/app-component-base';

import { DOCUMENT } from '@angular/common';

@Component({
    templateUrl: './theme5-brand.component.html',
    selector: 'theme5-brand',
    encapsulation: ViewEncapsulation.None
})
export class Theme5BrandComponent extends AppComponentBase {
    imgSrc = '/assets/common/images/app-logo-on-light.png';
    logoId : string;
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    constructor(
        injector: Injector,
        @Inject(DOCUMENT) private document: Document
    ) {
        super(injector);
    }

    clickTopbarToggle(): void {
        this.document.body.classList.toggle('m-topbar--on');
    }

    // ngOnInit(logoSrc : string) {
    //     if(logoSrc){
    //         this.imgSrc = logoSrc;
    //     }
        // if(localStorage.getItem('logo_src')){
        //     this.imgSrc = localStorage.getItem("logo_src");
        // }
        
    // }
    ngOnInit(logoSrc : string){
        if(logoSrc){
            this.imgSrc = logoSrc;
        }else{
            if(localStorage.getItem("logo_src") && localStorage.getItem("logo_src") !== 'null'){
                this.imgSrc = localStorage.getItem("logo_src");
            }else{
                this.imgSrc = '/assets/common/images/app-logo-on-light.png';
            }
        }


        // if(localStorage.getItem("topMenuSelected")){
        //     this.logoId = localStorage.getItem("topMenuSelected");
        //     if(this.logoId){
        //         if(this.logoId == '2'){
        //             this.imgSrc = '/assets/common/images/app-logo-on-dark.png';
        //         }
        //         if(this.logoId == '3'){
        //             this.imgSrc = '/assets/common/images/app-logo-ODoc-on-dark.png';
        //         }
        //     }else{
        //         this.imgSrc = '/assets/common/images/app-logo-on-light.png';
        //     }
        // }else{
        //     this.imgSrc = '/assets/common/images/app-logo-on-light.png';
        // }
        

    }
    
}
