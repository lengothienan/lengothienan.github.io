// import { Injectable, OnInit } from '@angular/core';
// import { WidgetPreviewListWidgetItemComponent } from '@app/shared/common/customizable-dashboard/widgets/widget-preview-list-widget-item/widget-preview-list-widget-item.component';
// import { WidgetPreviewRedmineComponent } from '@app/shared/common/customizable-dashboard/widgets/widget-preview-redmine/widget-preview-redmine.component';
// import { WidgetPreviewWidgetItemComponent } from '@app/shared/common/customizable-dashboard/widgets/widget-preview-widget-item/widget-preview-widget-item.component';
// import { WidgetTopStatsComponent } from '@app/shared/common/customizable-dashboard/widgets/widget-top-stats/widget-top-stats.component';
// import { WidgetAsignPopupComponent } from '@app/shared/common/customizable-dashboard/widgets/widget-asign-popup/widget-asign-popup.component';
// import { WidgetUserPermissionsModalComponent } from '@app/admin/users/widget-user-permissions-modal/widget-user-permissions-modal.component';
// import { WidgetLabelUserViewerComponent } from '@app/admin/users/widget-label-user-viewer/widget-label-user-viewer.component';
// import { ViewerLabelRoleComponent } from '@app/admin/roles/viewer-component/viewer-label-role.component';
// import { ViewerUtilityLabelRoleComponent } from '@app/admin/management/viewer-label/viewer-utility-label-role.component';
// import { ConfigRoleMapperGroupComponent } from '@app/admin/qlvb/roleMapperGroups/viewer-component/config-roleMapperGroup-modal.component';
// import { CloneRoleMapperGroupModalComponent } from '@app/admin/qlvb/roleMapperGroups/viewer-component/clone-roleMapperGroup-modal.component';

// export class ComponentEditDefinition {
//     name: string;
//     code: string;
//     component: any;

//     constructor(name: string, code: string, component: any) {
//         this.name = name;
//         this.code = code;
//         this.component = component;
//     }
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class ViewerUtilityConfigurationService {
//   public ComponentViewDefinitions: ComponentEditDefinition[] = [];

//   constructor(
//   ) {
//     this.initializeConfiguration();
//   }

//   private initializeConfiguration() {

//    //Widget tự tạo
//    let widgetDatagridView = new ComponentEditDefinition(
//     "Component Widget Top Stats",
//     "TOPSTATS",
//     WidgetTopStatsComponent
//   );

//   let widgetPreview= new ComponentEditDefinition(
//     "Component Widget Preview Widget Item",
//     "PREVIEW",
//     WidgetPreviewWidgetItemComponent
//   );

//   let widgetPreviewList= new ComponentEditDefinition(
//     "Component Widget Preview List Widget Item",
//     "PREVIEW_LIST",
//     WidgetPreviewListWidgetItemComponent
//   );

//   let widgetPreviewRedmine= new ComponentEditDefinition(
//     "Component Widget Preview Redmine",
//     "PREVIEW_REDMINE",
//     WidgetPreviewRedmineComponent
//   );

//   let widgetAsignPopup= new ComponentEditDefinition(
//     "Component Asignee Task Redmine",
//     "ASIGN_POPUP",
//     WidgetAsignPopupComponent
//   );

//   let widgetUserPermissionModal = new ComponentEditDefinition(
//     "Component User Permission Modal",
//     "USER_PERMISSION_MODAL",
//     WidgetUserPermissionsModalComponent
//   );

//   let widgetLabelUserViewer = new ComponentEditDefinition(
//     "Component Label User Viewer",
//     "LABEL_USER_VIEWER",
//     WidgetLabelUserViewerComponent
//   );

//   let widgetLabelRoleViewer = new ComponentEditDefinition(
//     "Component Label Role Viewer",
//     "LABEL_ROLE_VIEWER",
//     ViewerLabelRoleComponent
//   );

//   let widgetViewerUtilityLabelRole = new ComponentEditDefinition(
//     "Component Viewer Role Label",
//     "ROLE_LABEL_VIEWER",
//     ViewerUtilityLabelRoleComponent
//   );

//   // let widgetConfigRoleMapper = new ComponentViewDefinition(
//   //   "Component Config Role Mapper Group",
//   //   "CONFIG_ROLE_MAPPPER_GROUP",
//   //   ConfigRoleMapperGroupComponent
//   // );
  
//   let wdigetCloneRoleMapperGroup = new ComponentEditDefinition(
//     "Component Clone Role Mapper Group",
//     "CLONE_ROLE_MAPPPER_GROUP",
//     CloneRoleMapperGroupModalComponent
//   );

//    //add your host side component here
//     this.ComponentViewDefinitions.push(widgetDatagridView);
//     this.ComponentViewDefinitions.push(widgetPreview);
//     this.ComponentViewDefinitions.push(widgetPreviewRedmine);
//     this.ComponentViewDefinitions.push(widgetPreviewList);
//     this.ComponentViewDefinitions.push(widgetAsignPopup);
//     this.ComponentViewDefinitions.push(widgetUserPermissionModal);
//     this.ComponentViewDefinitions.push(widgetLabelUserViewer);
//     this.ComponentViewDefinitions.push(widgetLabelRoleViewer);
//     this.ComponentViewDefinitions.push(widgetViewerUtilityLabelRole);
//     //this.ComponentViewDefinitions.push(widgetConfigRoleMapper);
//     this.ComponentViewDefinitions.push(wdigetCloneRoleMapperGroup);
//   }
// }
