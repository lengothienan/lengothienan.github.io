import { AbpSessionService } from '@abp/session/abp-session.service';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { accountModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SessionServiceProxy, UpdateUserSignInTokenOutput } from '@shared/service-proxies/service-proxies';
import { UrlHelper } from 'shared/helpers/UrlHelper';
import { ExternalLoginProvider, LoginService } from './login.service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { AppConsts } from '@shared/AppConsts';

@Component({
    templateUrl: './login.component.html',
    animations: [accountModuleAnimation()],
    styleUrls: ['./login.component.less']
})
export class LoginComponent extends AppComponentBase implements OnInit {
    @ViewChild('recaptchaRef', { static: false }) recaptchaRef: RecaptchaComponent;

    submitting = false;
    isMultiTenancyEnabled: boolean = this.multiTenancy.isEnabled;
    recaptchaSiteKey: string = AppConsts.recaptchaSiteKey;
    captchaResponse?: string;
    width = window.innerWidth;
    height = window.innerHeight;

    constructor(
        injector: Injector,
        public loginService: LoginService,
        private _router: Router,
        private _sessionService: AbpSessionService,
        private _sessionAppService: SessionServiceProxy
    ) {
        super(injector);
    }

    get multiTenancySideIsTeanant(): boolean {
        return this._sessionService.tenantId > 0;
    }

    get isTenantSelfRegistrationAllowed(): boolean {
        return this.setting.getBoolean('App.TenantManagement.AllowSelfRegistration');
    }

    get isSelfRegistrationAllowed(): boolean {
        if (!this._sessionService.tenantId) {
            return false;
        }

        return this.setting.getBoolean('App.UserManagement.AllowSelfRegistration');
    }

    ngOnInit(): void {
        if (this._sessionService.userId > 0 && UrlHelper.getReturnUrl() && UrlHelper.getSingleSignIn()) {
            this._sessionAppService.updateUserSignInToken()
                .subscribe((result: UpdateUserSignInTokenOutput) => {
                    const initialReturnUrl = UrlHelper.getReturnUrl();
                    const returnUrl = initialReturnUrl + (initialReturnUrl.indexOf('?') >= 0 ? '&' : '?') +
                        'accessToken=' + result.signInToken +
                        '&userId=' + result.encodedUserId +
                        '&tenantId=' + result.encodedTenantId;

                    location.href = returnUrl;
                });
                
              
        }

        let state = UrlHelper.getQueryParametersUsingHash().state;
        if (state && state.indexOf('openIdConnect') >= 0) {
            this.loginService.openIdConnectLoginCallback({});
        }

        this.setCss();
    }

    login(): void {
        if (this.useCaptcha && !this.captchaResponse) {
            this.message.warn(this.l('CaptchaCanNotBeEmpty'));
            return;
        }

        this.spinnerService.show();

        this.submitting = true;
        this.loginService.authenticate(
            () => {
                this.submitting = false;
                this.spinnerService.hide();

                if (this.recaptchaRef) {
                    this.recaptchaRef.reset();
                }
            },
            null,
            this.captchaResponse
        );
    }

    externalLogin(provider: ExternalLoginProvider) {
        this.loginService.externalAuthenticate(provider);
    }

    get useCaptcha(): boolean {
        return this.setting.getBoolean('App.UserManagement.UseCaptchaOnLogin');
    }

    captchaResolved(captchaResponse: string): void {
        this.captchaResponse = captchaResponse;
    }

    onResize(event){
        if (event.target.innerWidth != this.width || event.target.innerHeight != this.height) {
            this.width = event.target.innerWidth;
            this.setCss();
        }
    }

    setCss() {
        var h1 = document.getElementById("main-panel").clientHeight;
        document.getElementById("trongdong-panel").style.height = h1 + "px";
        var h2 = document.getElementById("trongdong-img").clientWidth;
        document.getElementById("trongdong-img").style.height = h2 + "px";
        var h3 = document.getElementById("trongdong-img").clientHeight;
        document.getElementById("trongdong-img").style.marginTop = ((h3 - h1) / 2) * - 1 + "px";
        // document.getElementById("red-skin-img").style.height = h1 + "px";
        document.getElementById("red-footer-img").style.marginTop = (h1 - 40) + "px";
    
        // var w1 = ($(".img-tintuc > img").width() * 2) / 3;
        // $(".img-tintuc > img").height(w1);
    }
    
}
