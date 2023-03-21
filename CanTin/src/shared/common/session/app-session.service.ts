import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import { Injectable } from '@angular/core';
import { ApplicationInfoDto, GetCurrentLoginInformationsOutput, SessionServiceProxy, TenantLoginInfoDto, UserLoginInfoDto, UiCustomizationSettingsDto, RoleListDto } from '@shared/service-proxies/service-proxies';

@Injectable()
export class AppSessionService {

    private _user: UserLoginInfoDto;
    private _tenant: TenantLoginInfoDto;
    private _application: ApplicationInfoDto;
    private _theme: UiCustomizationSettingsDto;
    private _role: number;
    private _organizationUnitId: number;
    private _orgName: string;
    private _selfOrganizationUnitId: number;
    private _defaultRoute: string;
    private _orgNameChild: string;
    private _isCATP: boolean;
    private _orgShortName:string;
    private _seflOrgShortName:string;

    constructor(
        private _sessionService: SessionServiceProxy,
        private _abpMultiTenancyService: AbpMultiTenancyService) {
    }

    get application(): ApplicationInfoDto {
        return this._application;
    }

    set application(val: ApplicationInfoDto) {
        this._application = val;
    }

    get user(): UserLoginInfoDto {
        return this._user;
    }

    get userId(): number {
        return this.user ? this.user.id : null;
    }

    get tenant(): TenantLoginInfoDto {
        return this._tenant;
    }

    get roleId(): number {
        return this._role;
    }

    get organizationUnitId(): number {
        return this._organizationUnitId;
    }

    get selfOrganizationUnitId(): number {
        return this._selfOrganizationUnitId;
    }

    get tenancyName(): string {
        return this._tenant ? this.tenant.tenancyName : '';
    }

    get tenantId(): number {
        return this.tenant ? this.tenant.id : null;
    }

    get defaultRoute(): string {
        return this._defaultRoute;
    }
    get orgName(): string {
        return this._orgName;
    }
    get orgNameChild(): string {
        return this._orgNameChild;
    }

    get isCATP(): boolean {
        return this._isCATP;
    }

    get orgShortName():string{
        return this._orgShortName;
    }

    get seftOrgShortName():string{
        return this._seflOrgShortName;
    }

    // getShownLoginName(): string {
    //     const userName = this._user.surname + ' ' + this._user.name;
    //     if (!this._abpMultiTenancyService.isEnabled) {
    //         return userName;
    //     }

    //     return (this._tenant ? this._tenant.tenancyName : '.') + '\\' + userName;
    // }
    getShownLoginName(): string {
        const username = this._user.surname + ' ' + this._user.name;

        if(this._orgNameChild != null){
            return this._orgNameChild + ' - ' + this._orgName + ' / ' + username;
        }
        return this._orgName + '/' + username ;
    }
    get theme(): UiCustomizationSettingsDto {
        return this._theme;
    }

    set theme(val: UiCustomizationSettingsDto) {
        this._theme = val;
    }

    init(): Promise<UiCustomizationSettingsDto> {
        return new Promise<UiCustomizationSettingsDto>((resolve, reject) => {
            this._sessionService.getCurrentLoginInformations().toPromise().then((result: GetCurrentLoginInformationsOutput) => {
                this._application = result.application;
                this._user = result.user;
                this._tenant = result.tenant;
                this._theme = result.theme;
                this._role = result.roleId;
                this._organizationUnitId = result.organizationUnitId;
                this._orgName = result.orgName;
                this._orgNameChild = result.orgNameChild;
                this._selfOrganizationUnitId = result.selfOrganizationUnitId;
                this._defaultRoute = result.defaultRoute;
                this._isCATP = result.isCATP;
                this._orgShortName=result.orgShortName;
                this._seflOrgShortName=result.selfOrgShortName;
                resolve(result.theme);
            }, (err) => {
                reject(err);
            });
        });
    }

    changeTenantIfNeeded(tenantId?: number): boolean {
        if (this.isCurrentTenant(tenantId)) {
            return false;
        }

        abp.multiTenancy.setTenantIdCookie(tenantId);
        location.reload();
        return true;
    }

    private isCurrentTenant(tenantId?: number) {
        let isTenant = tenantId > 0;

        if (!isTenant && !this.tenant) { // this is host
            return true;
        }

        if (!tenantId && this.tenant) {
            return false;
        } else if (tenantId && (!this.tenant || this.tenant.id !== tenantId)) {
            return false;
        }

        return true;
    }
}
