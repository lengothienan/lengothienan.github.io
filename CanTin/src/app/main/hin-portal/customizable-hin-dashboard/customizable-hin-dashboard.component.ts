import { HIN_DashboardsServiceProxy } from './../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, Input, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DashboardViewConfigurationService } from 'app/shared/common/customizable-dashboard/dashboard-view-configuration.service';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import {
  DashboardCustomizationServiceProxy, DashboardOutput, AddNewPageInput,
  AddNewPageOutput, AddWidgetInput, RenamePageInput, SavePageInput, Page, Widget, WidgetFilterOutput, WidgetOutput
} from '@shared/service-proxies/service-proxies';
import { TabsetComponent } from 'ngx-bootstrap';
import { WidgetViewDefinition, WidgetFilterViewDefinition } from 'app/shared/common/customizable-dashboard/definitions';
import { DashboardCustomizationConst } from 'app/shared/common/customizable-dashboard/DashboardCustomizationConsts';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'customizable-hin-dashboard',
  templateUrl: './customizable-hin-dashboard.component.html',
  styleUrls: ['./customizable-hin-dashboard.component.css'],
  animations: [appModuleAnimation()]
})

export class HinCustomizableDashboardComponent extends AppComponentBase implements OnInit {

  @Input() dashboardName: string;

  @ViewChild('dashboardTabs', { static: false })
  private _dashboardTabs: TabsetComponent;

  loading = true;
  busy = true;
  editModeEnabled = false;

  dashboardDefinition: any;

  dashboardsView: any;
  pagesView: any;

  //gridster options. all gridster needs its options. In our scenario, they are all same.
  options: GridsterConfig[] = [];

  userDashboard: any;

  selectedPage = {
    pageCode: '',
    name: ''
  };

  renamePageInput = '';
  addPageInput = '';

  outputs = {
    onSomething: type => alert(type),
  };

  constructor(injector: Injector,
    private _dashboardViewConfiguration: DashboardViewConfigurationService,
    private _dashboardCustomizationServiceProxy: HIN_DashboardsServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
    this.loading = true;
    //Get mã DashboardCode
    // this._dashboardCustomizationServiceProxy.getDashboardByCurrentUser()
    //   .subscribe(res => {
    //     if (!res.data || res.data.length === 0) {
    //       this.loading = false;
    //       return;
    //     }
    //    var dbcode = res.data.dashboardCode;
    var dbcode = this.dashboardName;
    //Get thông tin chi tiết dashboards -> pages -> widgets
    this._dashboardCustomizationServiceProxy.getHinDashboardDefinition(dbcode)
      .subscribe(res => {
        this.dashboardsView = res.data;
        if (!this.dashboardsView || this.dashboardsView.length === 0) {
          this.loading = false;
          return;
        }

        if (!this.dashboardsView.pages || this.dashboardsView.pages.length === 0) {
          this.loading = false;
          return;
        }
        let savedUserDashboard = this.dashboardsView;
        this.dashboardDefinition = this._dashboardViewConfiguration.WidgetViewDefinitions;
        this.initializeUserDashboardDefinition(savedUserDashboard, this.dashboardDefinition);
        this.initializeUserDashboardFilters();

        //select first page (if user delete all pages server will add default page to userDashboard.)
        this.selectedPage = {
          pageCode: this.userDashboard.pages[0].pageCode,
          name: this.userDashboard.pages[0].name
        };

        this.loading = false;
        this.busy = false;
      })
    //});
  }

  initializeUserDashboardDefinition(savedUserDashboard: any, dashboardDefinitionResult: any) {
    var self = this;
    this.userDashboard = {
      dashboardName: this.dashboardName,
      filters: [],
      pages: savedUserDashboard.pages.map(page => {
        //gridster should has its own options
        this.options.push(this.getGridsterConfig());

        if (!page.widgets) {
          return {
            pageCode: page.pageCode,
            name: page.name,
            widgets: []
          };
        }

        //only use widgets which dashboard definition contains and have view definition
        //(dashboard definition can be changed after users save their dashboard, because it depends on permissions and other stuff)
        page.widgets = page.widgets.filter(w => self.dashboardDefinition.find(d => d.widgetCode === w.widgetCode) && self.getWidgetViewDefinition(w.widgetCode));
        return {
          pageCode: page.pageCode,
          name: page.name,
          widgets: page.widgets.map(widget => {
            return {
              widgetCode: widget.widgetCode,
              //View definitions are stored in the angular side(a component of widget/filter etc.) get view definition and use defined component
              component: this.getWidgetViewDefinition(widget.widgetCode).component,
              inputs: {
                widgetId : widget.id,

                //height width
                widgetHeight: widget.height,
                widgetWidth : widget.width,
                widgetCode: widget.widgetCode,
                widgetName: widget.name
              },
              gridInformation: {
                widgetCode: widget.widgetCode,
                cols: widget.width,
                rows: widget.height,
                x: widget.positionX,
                y: widget.positionY,
              }
            };
          })
        };

      })
    };
  }

  private getWidgetViewDefinition(widgetCode: string): WidgetViewDefinition {
    return this._dashboardViewConfiguration.WidgetViewDefinitions.find(widget => widget.widgetCode === widgetCode);
  }

  private getWidgetFilterViewDefinition(widgetCode: string): WidgetFilterViewDefinition {
    return this._dashboardViewConfiguration.widgetFilterDefinitions.find(filter => filter.id === widgetCode);
  }

  selectPageTab(pageCode: string): void {
    if (!pageCode) {
      this.selectedPage = {
        pageCode: '',
        name: ''
      };

      return;
    }

    this.selectedPage = {
      pageCode: pageCode,
      name: this.userDashboard.pages.find(page => page.pageCode === pageCode).name
    };

    //when tab change gridster should redraw because if a tab is not active gridster think that its height is 0 and do not draw it.
    this.options.forEach(option => {
      if (option.api) {
        option.api.optionsChanged();
      }
    });
  }

  //all pages use gridster and its where they get their options. Changing this will change all gristers.
  private getGridsterConfig(): GridsterConfig {
    return {
      pushItems: true,
      draggable: {
        enabled: this.editModeEnabled
      },
      resizable: {
        enabled: this.editModeEnabled
      },
      fixedRowHeight: 30,
      fixedColWidth: 30,
      // gridType: 'verticalFixed'
      gridType: GridType.VerticalFixed
    };
  }

  moreThanOnePage(): boolean {
    return this.userDashboard && this.userDashboard.pages && this.userDashboard.pages.length > 1;
  }

  //after we load page or add widget initialize needed filter too.
  private initializeUserDashboardFilters(): void {
    let allFilters: WidgetFilterOutput[] = [];

    this.dashboardDefinition
      .filter(widget => widget.filters != null && widget.filters.length > 0)
      .forEach(widget => {
        if (this.userDashboard.pages) {
          this.userDashboard.pages.forEach(page => {
            //if user has this widget in any page
            if (page.widgets.filter(userWidget => userWidget.widgetCode === widget.widgetCode).length !== 0) {
              widget.filters
                .forEach(filter => {
                  if (!allFilters.find(f => f.id === filter.id)) {
                    allFilters.push(filter);
                  }
                });
            }
          });
        }
      });

    this.userDashboard.filters = allFilters.map(filter => {
      let definition = this.getWidgetFilterViewDefinition(filter.id);
      definition['name'] = filter.name;
      return definition;
    });
  }
}
