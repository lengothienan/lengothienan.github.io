import { AbpModule } from '@abp/abp.module';
import * as ngCommon from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppLocalizationService } from '@app/shared/common/localization/app-localization.service';
import { AppNavigationService } from '@app/shared/layout/nav/app-navigation.service';
import { CommonModule } from '@shared/common/common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { ModalModule, TabsModule, BsDropdownModule, BsDatepickerModule, BsDatepickerConfig, BsDaterangepickerConfig, TooltipModule, PopoverModule } from 'ngx-bootstrap';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { CommonLookupModalComponent } from './lookup/common-lookup-modal.component';
import { EntityTypeHistoryModalComponent } from './entityHistory/entity-type-history-modal.component';
import { EntityChangeDetailModalComponent } from './entityHistory/entity-change-detail-modal.component';
import { DateRangePickerInitialValueSetterDirective } from './timing/date-range-picker-initial-value.directive';
import { DatePickerInitialValueSetterDirective } from './timing/date-picker-initial-value.directive';
import { DateTimeService } from './timing/date-time.service';
import { TimeZoneComboComponent } from './timing/timezone-combo.component';
import { CustomizableDashboardComponent } from './customizable-dashboard/customizable-dashboard.component';
import { WidgetGeneralStatsComponent } from './customizable-dashboard/widgets/widget-general-stats/widget-general-stats.component';
import { DashboardViewConfigurationService } from './customizable-dashboard/dashboard-view-configuration.service';
import { GridsterModule } from 'angular-gridster2';
// import { WidgetDailySalesComponent } from './customizable-dashboard/widgets/widget-daily-sales/widget-daily-sales.component';
// import { WidgetEditionStatisticsComponent } from './customizable-dashboard/widgets/widget-edition-statistics/widget-edition-statistics.component';
import { WidgetHostTopStatsComponent } from './customizable-dashboard/widgets/widget-host-top-stats/widget-host-top-stats.component';
import { WidgetIncomeStatisticsComponent } from './customizable-dashboard/widgets/widget-income-statistics/widget-income-statistics.component';
import { WidgetMemberActivityComponent } from './customizable-dashboard/widgets/widget-member-activity/widget-member-activity.component';
import { WidgetProfitShareComponent } from './customizable-dashboard/widgets/widget-profit-share/widget-profit-share.component';
import { WidgetRecentTenantsComponent } from './customizable-dashboard/widgets/widget-recent-tenants/widget-recent-tenants.component';
import { WidgetRegionalStatsComponent } from './customizable-dashboard/widgets/widget-regional-stats/widget-regional-stats.component';
import { WidgetSalesSummaryComponent } from './customizable-dashboard/widgets/widget-sales-summary/widget-sales-summary.component';
import { WidgetSubscriptionExpiringTenantsComponent } from './customizable-dashboard/widgets/widget-subscription-expiring-tenants/widget-subscription-expiring-tenants.component';
import { WidgetTopStatsComponent } from './customizable-dashboard/widgets/widget-top-stats/widget-top-stats.component';
import { FilterDateRangePickerComponent } from './customizable-dashboard/filters/filter-date-range-picker/filter-date-range-picker.component';
import { AddWidgetModalComponent } from './customizable-dashboard/add-widget-modal/add-widget-modal.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CountoModule } from 'angular2-counto';
import { DynamicModuleComponent } from './dynamicModule/dynamicModule.component';
// import { DynamicFormComponent } from './dynamicForm/dynamicForm.component';
import { DxiItemModule, DxoLabelModule } from 'devextreme-angular/ui/nested';
import { SignalRLabelService } from '../layout/nav/signalR-label.service';
// import { WidgetDatagridChartViewsComponent } from './customizable-dashboard/widgets/widget-datagrid-chart-views/widget-datagrid-chart-views.component';
import { WidgetMultiSimpleItemComponent } from './customizable-dashboard/widgets/widget-multi-simple-item/widget-multi-simple-item.component'
import { WidgetMultiSimpleItemPercentComponent } from './customizable-dashboard/widgets/widget-multi-simple-item-percent/widget-multi-simple-item-percent.component'
// import { RedmineUserTasksServiceProxy } from '@shared/service-proxies/service-proxies';
// import { WidgetRedmineComponent } from './customizable-dashboard/widgets/widget-redmine/widget-redmine.component'
// import { DemoMaterialModule } from "@app/demo-material-module";
import { ChartsModule, ThemeService } from 'ng2-charts';
import {
    DxTextAreaModule,
    DxMenuModule,
    DxNumberBoxModule,
    DxDataGridModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxProgressBarModule,
    DxPopupModule,
    DxTemplateModule,
    DxDateBoxModule,
    DxHtmlEditorModule,
    DxToolbarModule,
    DxButtonGroupModule,
    DxResizableModule,
    DxFileUploaderModule,
    DxTagBoxModule,
    DxListModule,
    DxScrollViewModule,
    DxTreeViewModule,
    DxContextMenuModule,

    DxPopoverModule,
    DxDropDownBoxModule,
    DxFormModule,
    DxFileManagerModule,
    DxSchedulerModule,
    DxSankeyModule,
    DxTreeListModule,
    DxLookupModule,
    DxGanttModule,
    DxValidationGroupModule,
    DxValidationSummaryModule,
    DxValidatorModule,
    DxSpeedDialActionModule,
    DxDropDownButtonModule,
    DxSwitchModule,
    DxRadioGroupModule,
    DxTabPanelModule,    
    DxChartModule,
    DxPieChartModule
} from 'devextreme-angular';
import { WidgetSimpleItemComponent } from './customizable-dashboard/widgets/widget-simple-item/widget-simple-item.component'
;
import { WidgetSimpleItemPercentComponent } from './customizable-dashboard/widgets/widget-simple-item-percent/widget-simple-item-percent.component'
;
import { WidgetSimpleItemPercentCircleComponent } from './customizable-dashboard/widgets/widget-simple-item-percent-circle/widget-simple-item-percent-circle.component'
// import { WidgetRedmineUserTasksComponent } from './customizable-dashboard/widgets/widget-redmine-user-tasks/widget-redmine-user-tasks.component'
import { DynamicModule } from 'ng-dynamic-component';
// import { WidgetPreviewWidgetItemComponent } from './customizable-dashboard/widgets/widget-preview-widget-item/widget-preview-widget-item.component';

// import { WidgetRedmineMiniComponent } from './customizable-dashboard/widgets/widget-redmine-mini/widget-redmine-mini.component';
// import { WidgetPreviewListWidgetItemComponent } from './customizable-dashboard/widgets/widget-preview-list-widget-item/widget-preview-list-widget-item.component';
// import { WidgetAsignPopupComponent } from './customizable-dashboard/widgets/widget-asign-popup/widget-asign-popup.component';
// import { WidgetContactListComponent } from './customizable-dashboard/widgets/widget-contact-list/widget-contact-list.component';

// import { WidgetSlideNewsComponent } from './customizable-dashboard/widgets/widget-slide-news/widget-slide-news.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
// import { HinChartComponent } from '@app/charts/hin-chart/hin-chart.component';
// import { WidgetSimpleItemMultipleComponent } from './customizable-dashboard/widgets/widget-simple-item-multiple/widget-simple-item-multiple.component';
// import { WidgetSimpleItemMultipleHorizontalComponent } from './customizable-dashboard/widgets/widget-simple-item-multiple-horizontal/widget-simple-item-multiple-horizontal.component';
// import { WidgetSimpleTitleComponent } from './customizable-dashboard/widgets/widget-simple-title/widget-simple-title.component';
// import { WidgetSelectBox } from './customizable-dashboard/widgets/widget-selectbox/widget-selectbox.component';
// import { WidgetFilterComponent } from './customizable-dashboard/widgets/widget-filter/widget-filter.component';
// import { WidgetSimpleHtmlItemComponent } from './customizable-dashboard/widgets/widget-simple-html-item/widget-simple-html-item.component';
// import { WidgetPopupFilterComponent } from './customizable-dashboard/widgets/widget-popup-filter/widget-popup-filter.component';
import { DemoMaterialModule } from "@app/demo-material-module";
import { WidgetEditionStatisticsComponent } from './customizable-dashboard/widgets/widget-edition-statistics/widget-edition-statistics.component';
import { WidgetDatagridChartViewsComponent } from './customizable-dashboard/widgets/widget-datagrid-chart-views/widget-datagrid-chart-views.component';
import { WidgetDailySalesComponent } from './customizable-dashboard/widgets/widget-daily-sales/widget-daily-sales.component';
@NgModule({
    imports: [
        DxSwitchModule,
        DxSankeyModule,
        PaginatorModule,
        TableModule,
        TreeTableModule,
        DxTextAreaModule,
        DxMenuModule,
        DxDataGridModule,
        DxButtonModule,
        DxCheckBoxModule,
        DxSelectBoxModule,
        DxTextBoxModule,
        DxProgressBarModule,
        DxPopupModule,
        DxTemplateModule,
        DxDateBoxModule,
        DxHtmlEditorModule,
        DxToolbarModule,
        DxButtonGroupModule,
        DxResizableModule,
        DxFileUploaderModule,
        DxSpeedDialActionModule,
        DxTagBoxModule,
        DxListModule,
        DxScrollViewModule,
        DxSchedulerModule,
        DxTreeViewModule,
        DxContextMenuModule,
        DxPopoverModule,
        DxDropDownBoxModule,
        DxFormModule,
        DxFileManagerModule,
        DxLookupModule,
        PaginatorModule,
        DxDropDownButtonModule,
        ngCommon.CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        UtilsModule,
        AbpModule,
        CommonModule,
        TableModule,
        PaginatorModule,
        GridsterModule,
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxChartsModule,
        BsDatepickerModule.forRoot(),
        PerfectScrollbarModule,
        CountoModule,
        DxiItemModule, DxoLabelModule,
        DxChartModule,
        ChartsModule,
        DxPieChartModule,
        DynamicModule,
        CarouselModule,
        DemoMaterialModule
    ],
    declarations: [
        //CreateButtonUIComponent,
        // DynamicFormComponent,
        DynamicModuleComponent,
        // HinChartComponent,
        TimeZoneComboComponent,
        CommonLookupModalComponent,
        EntityTypeHistoryModalComponent,
        EntityChangeDetailModalComponent,
        DateRangePickerInitialValueSetterDirective,
        DatePickerInitialValueSetterDirective,
        CustomizableDashboardComponent,
        WidgetGeneralStatsComponent,
        WidgetDailySalesComponent,
        WidgetEditionStatisticsComponent,
        WidgetHostTopStatsComponent,
        WidgetIncomeStatisticsComponent,
        WidgetMemberActivityComponent,
        WidgetProfitShareComponent,
        WidgetRecentTenantsComponent,
        WidgetRegionalStatsComponent,
        WidgetSalesSummaryComponent,
        WidgetSubscriptionExpiringTenantsComponent,
        WidgetTopStatsComponent,
        FilterDateRangePickerComponent,
        AddWidgetModalComponent,
        WidgetDatagridChartViewsComponent,
        WidgetMultiSimpleItemComponent,
        WidgetMultiSimpleItemPercentComponent,
        WidgetSimpleItemComponent,
        WidgetSimpleItemPercentComponent,
        WidgetSimpleItemPercentCircleComponent,

    ],
    exports: [
        DynamicModuleComponent,
        TimeZoneComboComponent,
        CommonLookupModalComponent,
        EntityTypeHistoryModalComponent,
        EntityChangeDetailModalComponent,
        DateRangePickerInitialValueSetterDirective,
        DatePickerInitialValueSetterDirective,
        CustomizableDashboardComponent,
        NgxChartsModule
    ],
    providers: [
        // RedmineUserTasksServiceProxy,
        SignalRLabelService,
        DynamicModuleComponent,
        DateTimeService,
        AppLocalizationService,
        AppNavigationService,
        DashboardViewConfigurationService,
        ThemeService,
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig }
    ],

    entryComponents: [
        WidgetGeneralStatsComponent,
        WidgetDailySalesComponent,
        WidgetEditionStatisticsComponent,
        WidgetHostTopStatsComponent,
        WidgetIncomeStatisticsComponent,
        WidgetMemberActivityComponent,
        WidgetProfitShareComponent,
        WidgetRecentTenantsComponent,
        WidgetRegionalStatsComponent,
        WidgetSalesSummaryComponent,
        WidgetSubscriptionExpiringTenantsComponent,
        WidgetTopStatsComponent,
        FilterDateRangePickerComponent,
        WidgetDatagridChartViewsComponent,
        // WidgetRedmineComponent,
        // WidgetContactListComponent,
        // WidgetRedmineMiniComponent,
        
        WidgetMultiSimpleItemComponent,
        WidgetMultiSimpleItemPercentComponent,
        WidgetSimpleItemComponent,
        WidgetSimpleItemPercentComponent,
        WidgetSimpleItemPercentCircleComponent,
    ]
})
export class AppCommonModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AppCommonModule,
            providers: [
                AppAuthService,
                AppRouteGuard
            ]
        };
    }
}
