import { WidgetSimpleItemPercentCircleComponent } from './widgets/widget-simple-item-percent-circle/widget-simple-item-percent-circle.component';
import { WidgetSimpleItemPercentComponent } from './widgets/widget-simple-item-percent/widget-simple-item-percent.component';
import { WidgetSimpleItemComponent } from './widgets/widget-simple-item/widget-simple-item.component';
import { Injectable, OnInit } from '@angular/core';
import { WidgetViewDefinition, WidgetFilterViewDefinition } from './definitions';
import { DashboardCustomizationConst } from './DashboardCustomizationConsts';
import { WidgetGeneralStatsComponent } from './widgets/widget-general-stats/widget-general-stats.component';
import { WidgetDailySalesComponent } from './widgets/widget-daily-sales/widget-daily-sales.component';
import { WidgetProfitShareComponent } from './widgets/widget-profit-share/widget-profit-share.component';
import { WidgetMemberActivityComponent } from './widgets/widget-member-activity/widget-member-activity.component';
import { WidgetRegionalStatsComponent } from './widgets/widget-regional-stats/widget-regional-stats.component';
import { WidgetSalesSummaryComponent } from './widgets/widget-sales-summary/widget-sales-summary.component';
import { WidgetIncomeStatisticsComponent } from './widgets/widget-income-statistics/widget-income-statistics.component';
import { WidgetRecentTenantsComponent } from './widgets/widget-recent-tenants/widget-recent-tenants.component';
import { WidgetEditionStatisticsComponent } from './widgets/widget-edition-statistics/widget-edition-statistics.component';
import { WidgetSubscriptionExpiringTenantsComponent } from './widgets/widget-subscription-expiring-tenants/widget-subscription-expiring-tenants.component';
import { WidgetHostTopStatsComponent } from './widgets/widget-host-top-stats/widget-host-top-stats.component';
import { FilterDateRangePickerComponent } from './filters/filter-date-range-picker/filter-date-range-picker.component';
import { WidgetTopStatsComponent } from './widgets/widget-top-stats/widget-top-stats.component';
import { WidgetDatagridChartViewsComponent } from './widgets/widget-datagrid-chart-views/widget-datagrid-chart-views.component';
import { WidgetMultiSimpleItemComponent } from './widgets/widget-multi-simple-item/widget-multi-simple-item.component';
import { WidgetMultiSimpleItemPercentComponent } from './widgets/widget-multi-simple-item-percent/widget-multi-simple-item-percent.component'

@Injectable({
  providedIn: 'root'
})
export class DashboardViewConfigurationService {
  public WidgetViewDefinitions: WidgetViewDefinition[] = [];
  public widgetFilterDefinitions: WidgetFilterViewDefinition[] = [];

  constructor(
  ) {
    this.initializeConfiguration();
  }

  private initializeConfiguration() {
    let filterDateRangePicker = new WidgetFilterViewDefinition(
      DashboardCustomizationConst.filters.filterDateRangePicker,
      DashboardCustomizationConst.filters.filterDateRangePicker,
      FilterDateRangePickerComponent
    );
     //add your filters here
    this.widgetFilterDefinitions.push(filterDateRangePicker);

    let generalStats = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.tenant.generalStats,
      DashboardCustomizationConst.widgets.tenant.generalStats,
      WidgetGeneralStatsComponent,
      6,
      4
    );

    let dailySales = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.tenant.dailySales,
      DashboardCustomizationConst.widgets.tenant.dailySales,
      WidgetDailySalesComponent,
    );

    let profitShare = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.tenant.profitShare,
      DashboardCustomizationConst.widgets.tenant.profitShare,
      WidgetProfitShareComponent
    );

    let memberActivity = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.tenant.memberActivity,
      DashboardCustomizationConst.widgets.tenant.memberActivity,
      WidgetMemberActivityComponent,
    );

    let regionalStats = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.tenant.regionalStats,
      DashboardCustomizationConst.widgets.tenant.regionalStats,
      WidgetRegionalStatsComponent
    );

    let salesSummary = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.tenant.salesSummary,
      DashboardCustomizationConst.widgets.tenant.salesSummary,
      WidgetSalesSummaryComponent,
    );

    let topStats = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.tenant.topStats,
      DashboardCustomizationConst.widgets.tenant.topStats,
      WidgetTopStatsComponent,
    );
    //add your tenant side widgets here

    let incomeStatistics = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.host.incomeStatistics,
      DashboardCustomizationConst.widgets.host.incomeStatistics,
      WidgetIncomeStatisticsComponent,
    );

    let editionStatistics = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.host.editionStatistics,
      DashboardCustomizationConst.widgets.host.editionStatistics,
      WidgetEditionStatisticsComponent,
    );

    let recentTenants = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.host.recentTenants,
      DashboardCustomizationConst.widgets.host.recentTenants,
      WidgetRecentTenantsComponent,
    );

    let subscriptionExpiringTenants = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.host.subscriptionExpiringTenants,
      DashboardCustomizationConst.widgets.host.subscriptionExpiringTenants,
      WidgetSubscriptionExpiringTenantsComponent
    );

    let hostTopStats = new WidgetViewDefinition(
      DashboardCustomizationConst.widgets.host.topStats,
      DashboardCustomizationConst.widgets.host.topStats,
      WidgetHostTopStatsComponent,
    );

   //Widget tự tạo
   let widgetDatagridView = new WidgetViewDefinition(
    "Widgets_Datagrid_Chart_Views",
    "Widgets_Datagrid_Chart_Views",
    WidgetDatagridChartViewsComponent,
  );

  let widgetmultisimpleitem = new WidgetViewDefinition(
    "Widget_Multi_Simple_Item",
    "Widget_Multi_Simple_Item",
    WidgetMultiSimpleItemComponent
  );

  let widgetmultisimpleitempercent = new WidgetViewDefinition(
    "Widget_Multi_Simple_Item_Percent",
    "Widget_Multi_Simple_Item_Percent",
    WidgetMultiSimpleItemPercentComponent
  );
   
  let widgetSimpleItem = new WidgetViewDefinition(
    "Widget_Simple_Item",
    "Widget_Simple_Item",
    WidgetSimpleItemComponent
  );

  let widgetSimpleItemPercent = new WidgetViewDefinition(
    "Widget_Simple_Item_Percent",
    "Widget_Simple_Item_Percent",
    WidgetSimpleItemPercentComponent
  );

  let widgetSimpleItemPercentCircle = new WidgetViewDefinition(
    "Widget_Simple_Item_Percent_Circle",
    "Widget_Simple_Item_Percent_Circle",
    WidgetSimpleItemPercentCircleComponent
  );

   //add your host side widgets here

    this.WidgetViewDefinitions.push(generalStats);
    this.WidgetViewDefinitions.push(dailySales);
    this.WidgetViewDefinitions.push(profitShare);
    this.WidgetViewDefinitions.push(memberActivity);
    this.WidgetViewDefinitions.push(regionalStats);
    this.WidgetViewDefinitions.push(salesSummary);
    this.WidgetViewDefinitions.push(topStats);
    this.WidgetViewDefinitions.push(incomeStatistics);
    this.WidgetViewDefinitions.push(editionStatistics);
    this.WidgetViewDefinitions.push(recentTenants);
    this.WidgetViewDefinitions.push(subscriptionExpiringTenants);
    this.WidgetViewDefinitions.push(hostTopStats);
    this.WidgetViewDefinitions.push(widgetDatagridView);
    this.WidgetViewDefinitions.push(widgetmultisimpleitem);
    this.WidgetViewDefinitions.push(widgetmultisimpleitempercent);
    this.WidgetViewDefinitions.push(widgetSimpleItem);
    this.WidgetViewDefinitions.push(widgetSimpleItemPercent);
    this.WidgetViewDefinitions.push(widgetSimpleItemPercentCircle);
  }
}
