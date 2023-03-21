import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
// import { TemplatesComponent } from './management/templates/templates.component';
import { RoleMapperGroupsComponent } from './qlvb/roleMapperGroups/roleMapperGroups.component';
import { DynamicActionsComponent } from './qlvb/dynamicActions/dynamicActions.component';
import { RoleMappersComponent } from './qlvb/roleMappers/roleMappers.component';
import { LabelsComponent } from './management/labels/labels.component';
import { LabelsNewComponent } from './management/labels-new/labels.component';
import { SettingConfigsComponent } from './management/settingConfigs/settingConfigs.component';
import { MenusComponent } from './management/menus/menus.component';

import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { HostDashboardComponent } from './dashboard/host-dashboard.component';
import { DemoUiComponentsComponent } from './demo-ui-components/demo-ui-components.component';
import { EditionsComponent } from './editions/editions.component';
import { InstallComponent } from './install/install.component';
import { LanguageTextsComponent } from './languages/language-texts.component';
import { LanguagesComponent } from './languages/languages.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { OrganizationUnitsComponent } from './organization-units/organization-units.component';
import { RolesComponent } from './roles/roles.component';
import { HostSettingsComponent } from './settings/host-settings.component';
import { TenantSettingsComponent } from './settings/tenant-settings.component';
import { InvoiceComponent } from './subscription-management/invoice/invoice.component';
import { SubscriptionManagementComponent } from './subscription-management/subscription-management.component';
import { TenantsComponent } from './tenants/tenants.component';
import { UiCustomizationComponent } from './ui-customization/ui-customization.component';
import { UsersComponent } from './users/users.component';
import { MenusServiceProxy } from '@shared/service-proxies/service-proxies';
import { UpdateCurrentIncommingNumberComponent } from './qlvb/updateIncommingNumber/update-incomming-number.component';
import { TemplatesAdminComponent } from './management/templates/templates.component';
import { CapnhatvanbanphongComponent } from './qlvb/capnhatvanbanphong/capnhatvanbanphong.component';
import { UploadFileHdsdComponent } from './qlvb/upload-file-hdsd/upload-file-hdsd.component'
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'templates', component: TemplatesAdminComponent },
                    { path: 'qlvb/roleMapperGroups', component: RoleMapperGroupsComponent, data: { permission: 'Pages.Administration.RoleMapperGroups' }  },
                    { path: 'qlvb/dynamicActions', component: DynamicActionsComponent, data: { permission: 'Pages.Administration.DynamicActions' }  },
                    { path: 'roleMappers', component: RoleMappersComponent, data: { permission: 'Pages.Administration.RoleMappers' }  },
                    //{ path: 'dynamicModule', component: DynamicModuleComponent, data: {}},
                    { path: 'labels', component: LabelsComponent, data: { permission: 'Pages.Administration.Labels' }  },
                    { path: 'labels-new', component: LabelsNewComponent, data: { permission: 'Pages.Administration.Labels' } },
                    { path: 'settingConfigs', component: SettingConfigsComponent, data: { permission: 'Pages.Administration.SettingConfigs' }  },
                    { path: 'menus', component: MenusComponent, data: { permission: 'Pages.Administration.Menus' }  },
                    
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Administration.Users' } },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Administration.Roles' } },
                    { path: 'auditLogs', component: AuditLogsComponent, data: { permission: 'Pages.Administration.AuditLogs' } },
                    { path: 'maintenance', component: MaintenanceComponent, data: { permission: 'Pages.Administration.Host.Maintenance' } },
                    { path: 'hostSettings', component: HostSettingsComponent, data: { permission: 'Pages.Administration.Host.Settings' } },
                    { path: 'editions', component: EditionsComponent, data: { permission: 'Pages.Editions' } },
                    { path: 'languages', component: LanguagesComponent, data: { permission: 'Pages.Administration.Languages' } },
                    { path: 'languages/:name/texts', component: LanguageTextsComponent, data: { permission: 'Pages.Administration.Languages.ChangeTexts' } },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' } },
                    { path: 'organization-units', component: OrganizationUnitsComponent, data: { permission: 'Pages.Administration.OrganizationUnits' } },
                    { path: 'subscription-management', component: SubscriptionManagementComponent, data: { permission: 'Pages.Administration.Tenant.SubscriptionManagement' } },
                    { path: 'invoice/:paymentId', component: InvoiceComponent, data: { permission: 'Pages.Administration.Tenant.SubscriptionManagement' } },
                    { path: 'tenantSettings', component: TenantSettingsComponent, data: { permission: 'Pages.Administration.Tenant.Settings' } },
                    { path: 'hostDashboard', component: HostDashboardComponent, data: { permission: 'Pages.Administration.Host.Dashboard' } },
                    { path: 'demo-ui-components', component: DemoUiComponentsComponent, data: { permission: 'Pages.DemoUiComponents' } },
                    { path: 'install', component: InstallComponent },
                    { path: 'ui-customization', component: UiCustomizationComponent },
                    { path: 'update-currentValue', component: UpdateCurrentIncommingNumberComponent },
                    { path: 'qlvb/capnhatsodenphong', component: CapnhatvanbanphongComponent },
                    { path: 'qlvb/upload-file-hdsd', component: UploadFileHdsdComponent }
                    // { path: 'menu', component: MenusServiceProxy, data: {  }}
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule {

    constructor(
        private router: Router
    ) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                window.scroll(0, 0);
            }
        });
    }
}
