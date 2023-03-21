import { Injector, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { ImpersonationService } from '@app/admin/users/impersonation.service';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { LinkedAccountService } from '@app/shared/layout/linked-account.service';
import { AppConsts } from '@shared/AppConsts';
import { ThemesLayoutBaseComponent } from '@app/shared/layout/themes/themes-layout-base.component';
import { Attachment, AttachmentServiceProxy, ChangeUserLanguageDto, LinkedUserDto, ProfileServiceProxy, UserLinkServiceProxy, UserListDto } from '@shared/service-proxies/service-proxies';
import * as _ from 'lodash';

@Component({
    templateUrl: './topbar.component.html',
    selector: 'topbar',
    encapsulation: ViewEncapsulation.None
})
export class TopBarComponent extends ThemesLayoutBaseComponent implements OnInit {

    isHost = false;
    languages: abp.localization.ILanguageInfo[];
    currentLanguage: abp.localization.ILanguageInfo;
    isImpersonatedLogin = false;
    isMultiTenancyEnabled = false;
    shownLoginName = '';
    tenancyName = '';
    userName = '';
    name = '';
    orgName='';
    orgNameChild='';
    profilePicture = AppConsts.appBaseUrl + '/assets/common/images/default-profile-picture.png';
    defaultLogo = AppConsts.appBaseUrl + '/assets/common/images/app-logo-on-' + this.currentTheme.baseSettings.menu.asideSkin + '.svg';
    recentlyLinkedUsers: LinkedUserDto[];
    unreadChatMessageCount = 0;
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    chatConnected = false;
    isQuickThemeSelectEnabled: boolean = this.setting.getBoolean('App.UserManagement.IsQuickThemeSelectEnabled');

    constructor(
        injector: Injector,
        private _abpSessionService: AbpSessionService,
        private _abpMultiTenancyService: AbpMultiTenancyService,
        private _profileServiceProxy: ProfileServiceProxy,
        private _userLinkServiceProxy: UserLinkServiceProxy,
        private _authService: AppAuthService,
        private _impersonationService: ImpersonationService,
        private _linkedAccountService: LinkedAccountService,
        private _AttachmentServiceProxy: AttachmentServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {

        this.isHost = !this._abpSessionService.tenantId;
        this.isMultiTenancyEnabled = this._abpMultiTenancyService.isEnabled;
        this.languages = _.filter(this.localization.languages, l => (l).isDisabled === false);
        this.currentLanguage = this.localization.currentLanguage;
        this.isImpersonatedLogin = this._abpSessionService.impersonatorUserId > 0;
        this.setCurrentLoginInformations();
        this.getProfilePicture();
        // this.getRecentlyLinkedUsers();

        this.registerToEvents();
    }

    registerToEvents() {
        abp.event.on('profilePictureChanged', () => {
            this.getProfilePicture();
        });

        // abp.event.on('app.chat.unreadMessageCountChanged', messageCount => {
        //     this.unreadChatMessageCount = messageCount;
        // });

        // abp.event.on('app.chat.connected', () => {
        //     this.chatConnected = true;
        // });

        // abp.event.on('app.getRecentlyLinkedUsers', () => {
        //     this.getRecentlyLinkedUsers();
        // });

        // abp.event.on('app.onMySettingsModalSaved', () => {
        //     this.onMySettingsModalSaved();
        // });
    }

    // changeLanguage(languageName: string): void {
    //     const input = new ChangeUserLanguageDto();
    //     input.languageName = languageName;

    //     this._profileServiceProxy.changeLanguage(input).subscribe(() => {
    //         abp.utils.setCookieValue(
    //             'Abp.Localization.CultureName',
    //             languageName,
    //             new Date(new Date().getTime() + 5 * 365 * 86400000), //5 year
    //             abp.appPath
    //         );

    //         window.location.reload();
    //     });
    // }

    // setCurrentLoginInformations(): void {
    //     this.shownLoginName = this.appSession.getShownLoginName();
    //     this.tenancyName = this.appSession.tenancyName;
    //     this.userName = this.appSession.user.userName;
    // }
    setCurrentLoginInformations(): void {
        this.shownLoginName = this.appSession.getShownLoginName();
        this.tenancyName = this.appSession.tenancyName;
        this.userName = this.appSession.user.userName;
        this.name = this.appSession.user.name;
        this.orgName = this.appSession.orgName;
        this.orgNameChild = this.appSession.orgNameChild;
    }

    // getShownUserName(linkedUser: LinkedUserDto): string {
    //     if (!this._abpMultiTenancyService.isEnabled) {
    //         return linkedUser.username;
    //     }

    //     return (linkedUser.tenantId ? linkedUser.tenancyName : '.') + '\\' + linkedUser.username;
    // }
    getShownUserName(user: UserListDto): string {
        return user.name;
    }

    getProfilePicture(): void {
        this._profileServiceProxy.getProfilePicture().subscribe(result => {
            if (result && result.profilePicture) {
                this.profilePicture = 'data:image/jpeg;base64,' + result.profilePicture;
            }
        });
    }

    // getRecentlyLinkedUsers(): void {
    //     this._userLinkServiceProxy.getRecentlyUsedLinkedUsers().subscribe(result => {
    //         this.recentlyLinkedUsers = result.items;
    //     });
    // }


    // showLoginAttempts(): void {
    //     abp.event.trigger('app.show.loginAttemptsModal');
    // }

    // showLinkedAccounts(): void {
    //     abp.event.trigger('app.show.linkedAccountsModal');
    // }

    // changePassword(): void {
    //     abp.event.trigger('app.show.changePasswordModal');
    // }

    // changeProfilePicture(): void {
    //     abp.event.trigger('app.show.changeProfilePictureModal');
    // }

    // changeMySettings(): void {
    //     abp.event.trigger('app.show.mySettingsModal');
    // }

    logout(): void {
        this._authService.logout();
    }
    typeforder:number=1;
    hdsd(): void {
        var temAttachment = new Attachment();
        temAttachment.typeForder= this.typeforder;
        this._AttachmentServiceProxy.getAttachFileBySearch(temAttachment).subscribe(result =>{
            let str="<table class='container'>";
            result.forEach(ele=>{
                str+="<tr><th>"+ele.fileName+"</th><th><button><a href='" +AppConsts.fileServerUrl + "/"+ele.diskDirectory+"'>Tải về</a></button></th></tr>";
            });
            str+="</table>";
            var style="<style>body{background-color:white;color: black;}.container th {font-weight: normal;font-size: 1em; -webkit-box-shadow: 0 2px 2px -2px #0E1119; -moz-box-shadow: 0 2px 2px -2px #0E1119; box-shadow: 0 2px 2px -2px #0E1119;}.container {text-align: left; overflow: hidden; width: 80%;margin: 0 auto; display: table;padding: 0 0 8em 0; }.container td, .container th { padding-bottom: 2%; padding-top: 2%; padding-left:2%;   }.container tr:nth-child(odd) {background-color: white; }.container tr:nth-child(even) {background-color: white;}.container th {background-color: white;}.container td:first-child { color: #FB667A; }.container tr:hover {background-color: #464A52;-webkit-box-shadow: 0 6px 6px -6px #0E1119;-moz-box-shadow: 0 6px 6px -6px #0E1119;box-shadow: 0 6px 6px -6px #0E1119;}.container td:hover {background-color: #FFF842;color: #403E10;font-weight: bold;box-shadow: #7F7C21 -1px 1px, #7F7C21 -2px 2px, #7F7C21 -3px 3px, #7F7C21 -4px 4px, #7F7C21 -5px 5px, #7F7C21 -6px 6px;transform: translate3d(6px, -6px, 0);transition-delay: 0s;transition-duration: 0.4s;transition-property: all;transition-timing-function: line;}@media (max-width: 800px) {.container td:nth-child(4),.container th:nth-child(4) { display: none; }}a{text-decoration: none;color: #ffffff;} button{padding: 8px; color: #ffffff;-webkit-box-align: center;align-items: center;background-color: #5cb85c !important;}</style>";
            var myWindow = window.open("about:blank", "_blank", "left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0");
            myWindow.document.write(str+style);
            myWindow.document.close();
            myWindow.focus();
        });
    }

    // onMySettingsModalSaved(): void {
    //     this.shownLoginName = this.appSession.getShownLoginName();
    // }

    backToMyAccount(): void {
        this._impersonationService.backToImpersonator();
    }

    // switchToLinkedUser(linkedUser: LinkedUserDto): void {
    //     this._linkedAccountService.switchToAccount(linkedUser.id, linkedUser.tenantId);
    // }

    // downloadCollectedData(): void {
    //     this._profileServiceProxy.prepareCollectedData().subscribe(() => {
    //         this.message.success(this.l('GdprDataPrepareStartedNotification'));
    //     });
    // }
}
