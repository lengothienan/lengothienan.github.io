import { HIN_DashboardsServiceProxy } from './../../../../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit, OnDestroy, Input, ViewChild, ViewEncapsulation, Optional, Inject } from '@angular/core';
import { API_BASE_URL, DRReportServiceProxy, DRReportServiceServiceProxy, DRLookUpServiceProxy, DRViewerServiceProxy, DRFilterServiceProxy, DrDynamicFieldServiceProxy, DRColumnServiceProxy, DRChartServiceProxy, FParameter, DashboardCustomizationServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { WidgetComponentBase } from '../widget-component-base';
import { isNullOrUndefined } from 'util';
import { DxDataGridComponent, DxFormComponent, DxTreeViewComponent, DxChartComponent, DxPieChartComponent } from 'devextreme-angular';
import { FormatService } from '@app/main/dynamic-report/viewer/formatService';
import { ActivatedRoute } from '@angular/router';
import { SelectEditionComponent } from '@account/register/select-edition.component';

export interface IColumn {
    alignment: string;
    allowEditing: boolean;
    caption: string;
    columns: IColumn[];
    dataField: string;
    dataType: string;
    fixed: boolean;
    format: any;
    visible: boolean;
    width: string;
    parentId: string;
    id: string;
    isParent: any;
    cellTemplate: any;
    groupIndex: any;
    minWidth: any;
}

export class DxColumn implements IColumn {
    alignment: string;
    allowEditing: boolean;
    caption: string;
    columns: DxColumn[];
    cellTemplate: any;
    dataField: string;
    dataType: string;
    fixed: boolean;
    format: any;
    visible: boolean;
    width: string;
    parentId: string;
    id: string;
    isParent: any;
    groupIndex: any;
    minWidth: any;
    editorOptions: any;
    validationRules: any[];
    sortOrder: any;
    orderId: any;
    parentCode: any;
    encodeHtml: any;
}

@Component({
  selector: 'app-widget-simple-item',
  templateUrl: './widget-simple-item.component.html',
  styleUrls: ['./widget-simple-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [FormatService],
})

export class WidgetSimpleItemComponent extends WidgetComponentBase implements OnInit, OnDestroy {
    @Input() public widgetId: any;
    @Input() public widgetHeight: any;
    @Input() public widgetWidth: any;

    @ViewChild('data', { static: true }) data: DxDataGridComponent;
    @ViewChild('form', { static: true }) form: DxFormComponent;
    @ViewChild(DxTreeViewComponent, { static: true }) treview: DxTreeViewComponent;
    @ViewChild('barchart', { static: true }) barchart: DxChartComponent;
    @ViewChild('piechart', {static: true}) piechart: DxPieChartComponent;

    constructor(
        injector: Injector,
        private reportService: DRReportServiceProxy,
        private serviceService: DRReportServiceServiceProxy,
        private lookupService: DRLookUpServiceProxy,
        private viewerService: DRViewerServiceProxy,
        private filterService: DRFilterServiceProxy,
        private dynamicFieldService: DrDynamicFieldServiceProxy,
        private columnService: DRColumnServiceProxy,
        public formatService: FormatService,
        private activeRouter: ActivatedRoute,
        private chartService: DRChartServiceProxy,
        private _dashboardCustomizationServiceProxy: HIN_DashboardsServiceProxy,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        super(injector);
        this.baseUrl = baseUrl ? baseUrl : "";
    }
    private baseUrl: string;
    currentReport: any;
    formId: any;
    listItem: any;
    sqlContent: any;
    reportName: any;
    formData: any = [];
    column: any;
    dataSourceTest3: any = [];
    pageSize: any = 50;
    pageIndex: any = 0;
    paramTest: any = [];
    sumary: any = {};

    ReportOptions: any;
    listParentCode: any = [];
    curentControlData: any;
    isDynamicCol: any;
    typeget: any;
    isColumnAutoWidth: any;
    visible: any = false;
    displayType: any;  // =0 table =1 form =2 biểu đồ cột(barchart) =3 biểu đồ tròn(piechart)
    pieChartDataSource: any = [];
    seriesField: any;
    ArgumentField: any;
    ValueField: any;
    barChartDataSource: any = [];
    columnLink = [];

    size = { width: 500, height: 500 }
    curentreportid: any;

    formCol: any = 4;
    test = false;
    existForm = false;
    resolveOverlappingTypes = ["shift", "hide", "none"];

    // BEGIN : WG DETAIL CONFIGS
    // wg detail
    content_size: string = "";
    content_color: string = "";
  
    value_color: string = "";
    value_size: string = "";

    // widget
    si_widget_formatcss : {};

    // icon
    si_icon = "far fa-clone";
    si_icon_formatcss: {};
    si_frame_icon_formatcss: {};
    
    // title
    si_title: string = "";
    si_title_formatcss : {};
    
    // value
    si_value: string = "";
    si_value_formatcss: {};

    // link
    si_link = "#";
    si_content_link : string = "";
    si_link_formatcss : {};
    si_frame_link_formatcss : {};
    si_open_link : string = "";
    // END : WG DETAILT CONFIGS

    // BEGIN : WG DEFAUL CONFIGS
    // wg default
    // content_size: string = "";
    // content_color: string = "";
  
    // value_color: string = "";
    // value_size: string = "";

    // widget
    df_si_widget_formatcss : {};

    // icon
    df_si_icon = "";
    df_si_icon_formatcss: {};
    df_si_frame_icon_formatcss: {};
    
    // title
    df_si_title: string = "";
    df_si_title_formatcss : {};
    
    // value
    df_si_value: string = "";
    df_si_value_formatcss: {};

    // link
    df_si_link = "#";
    df_si_content_link : string = "";
    df_si_link_formatcss : {};
    df_si_frame_link_formatcss : {};
    df_si_open_link : string = "";
    
    // END : WG DEFAULT CONFIGS

  

    si_store: string = "";
    df_si_store: string = "";

    dataField: string = "";

    id: number;
    df_height = 5;
    height: number;
    content_fontSize = 20;
    value_fontSize = 40;

    bg_purple = {
        "background": "linear-gradient(60deg, #ab47bc, #8e24aa)",
        "box-shadow": "0 12px 20px -10px rgba(156, 39, 176, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(156, 39, 176, 0.2)"
    };
    bg_blue = {
        "background": "linear-gradient(60deg, #26c6da, #00acc1)",
        "box-shadow": "0 12px 20px -10px rgba(0, 188, 212, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(0, 188, 212, 0.2)"

    };

    bg_red = {
        "background": "linear-gradient(60deg, #ef5350, #e53935)",
        "box-shadow": "0 12px 20px -10px rgba(244, 67, 54, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2)"
    };

    bgs_green = {
        "background-color": "#5cb85c"
    }

    bgs_blue = {
        "background-color": "#4c75a3"
    }
    // background-color: #f9f9fc background wg color

    

    ngOnInit() {
    // 
    const self = this;
    if (self.widgetHeight < self.df_height) {
      self.content_fontSize = self.content_fontSize * self.widgetHeight / self.df_height - 1;
      self.value_fontSize = self.value_fontSize * self.widgetHeight / self.df_height - 1;
    }

    // GET WIDGET DEFAULT CONFIGS
    this._dashboardCustomizationServiceProxy.getConfigDefaultWidgetsById(this.widgetId).subscribe((res: any) => {
        if (res.data.length > 0) {
            
            var data = res.data;
            
            self.df_si_store = data.find(item => item["Key"] == "SI_StoreProcedure").DefaultValue;
            self.df_si_title = data.find(item => item["Key"] == "SI_Title").DefaultValue;
            self.df_si_value = data.find(item => item["Key"] == "SI_Value").DefaultValue;
            self.df_si_link = data.find(item => item["Key"] == "SI_Link").DefaultValue;
            self.df_si_open_link = data.find(item => item["Key"] == "SI_Open_Link").DefaultValue;
            self.df_si_icon = data.find(item => item["Key"] == "SI_Icon").DefaultValue;
            self.df_si_content_link = data.find(item => item["Key"] == "SI_Content_Link").DefaultValue;

            this._dashboardCustomizationServiceProxy.dataResultStore(self.df_si_store, []).subscribe((res: any) => {
                if (res.data.length > 0) {
                    var data = res.data; 
                    // 
                    self.df_si_title = data[0][self.df_si_title];
                    self.df_si_value = data[0][self.df_si_value];
                    self.df_si_link = data[0][self.df_si_link];
                    self.df_si_content_link = data[0][self.df_si_content_link];
                }
            });

            self.df_si_widget_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Widget_FormatCss").DefaultValue);

            self.df_si_icon_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Icon_FormatCss").DefaultValue);
            self.df_si_frame_icon_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Frame_Icon_FormatCss").DefaultValue);

            self.df_si_title_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Title_FormatCss").DefaultValue);
            self.df_si_value_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Value_FormatCss").DefaultValue);

            self.df_si_link_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Link_FormatCss").DefaultValue);
            self.df_si_frame_link_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Frame_Link_FormatCss").DefaultValue);
            
            
        }
    });


    this._dashboardCustomizationServiceProxy.getConfigDetailWidgetsById(this.widgetId).subscribe((res: any) => {
      if (res.data.length > 0) {
        
        var data = res.data;
        
        // self.si_store = data.find(item => item["Key"] == "SI_StoreProcedure").Value;
        // self.si_title = data.find(item => item["Key"] == "SI_Title").Value;
        // self.si_value = data.find(item => item["Key"] == "SI_Value").Value;
        // self.si_link = data.find(item => item["Key"] == "SI_Link").Value;
        // self.si_icon = data.find(item => item["Key"] == "SI_Icon").Value;
        // self.si_content_link = data.find(item => item["Key"] == "SI_Content_Link").Value;

        if(!data.find(item => item["Key"] == "SI_StoreProcedure").Value){
            self.si_store = self.df_si_store;
        }else{
            self.si_store = data.find(item => item["Key"] == "SI_StoreProcedure").Value;
        }

        if(!data.find(item => item["Key"] == "SI_Title").Value){
            self.si_title = self.df_si_title;
        }else{
            self.si_title = data.find(item => item["Key"] == "SI_Title").Value;
        }

        if(!data.find(item => item["Key"] == "SI_Value").Value){
            self.si_value = self.df_si_value;
        }else{
            self.si_value = data.find(item => item["Key"] == "SI_Value").Value;
        }

        if(!data.find(item => item["Key"] == "SI_Link").Value){
            self.si_link = self.df_si_link;
        }else{
            self.si_link = data.find(item => item["Key"] == "SI_Link").Value;
        }

        if(!data.find(item => item["Key"] == "SI_Open_Link").Value){
            self.si_open_link = self.df_si_open_link;
        }else{
            self.si_open_link = data.find(item => item["Key"] == "SI_Open_Link").Value;
        }
        if(self.si_open_link == "0"){
            self.si_open_link = "_self";
        }else{
            self.si_open_link = "_blank";
        }

        if(!data.find(item => item["Key"] == "SI_Icon").Value){
            self.si_icon = self.df_si_icon;
        }else{
            self.si_icon = data.find(item => item["Key"] == "SI_Icon").Value;
        }

        if(!data.find(item => item["Key"] == "SI_Content_Link").Value){
            self.si_content_link = self.df_si_content_link;
        }else{
            self.si_content_link = data.find(item => item["Key"] == "SI_Content_Link").Value;
        }
        

        this._dashboardCustomizationServiceProxy.dataResultStore(self.si_store, []).subscribe((res: any) => {
            if (res.data.length > 0) {
                // 
                var data = res.data; 
                self.si_title = data[0][self.si_title];
                self.si_value = data[0][self.si_value];
                self.si_link = data[0][self.si_link];
                self.si_content_link = data[0][self.si_content_link];
            }
        });
        
        // self.si_widget_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Widget_FormatCss").Value);
        // self.si_icon_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Icon_FormatCss").Value);
        // self.si_frame_icon_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Frame_Icon_FormatCss").Value);
        // self.si_title_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Title_FormatCss").Value);
        // self.si_value_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Value_FormatCss").Value);
        // self.si_link_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Link_FormatCss").Value);
        // self.si_frame_link_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Frame_Link_FormatCss").Value);

        if(!data.find(item => item["Key"] == "SI_Widget_FormatCss").Value){
            self.si_widget_formatcss = self.df_si_widget_formatcss;
        }else{
            self.si_widget_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Widget_FormatCss").Value);
        }

        if(!data.find(item => item["Key"] == "SI_Icon_FormatCss").Value){
            self.si_icon_formatcss = self.df_si_icon_formatcss;
        }else{
            self.si_icon_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Icon_FormatCss").Value);
        }

        if(!data.find(item => item["Key"] == "SI_Frame_Icon_FormatCss").Value){
            self.si_frame_icon_formatcss = self.df_si_frame_icon_formatcss;
        }else{
            self.si_frame_icon_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Frame_Icon_FormatCss").Value);
        }

        if(!data.find(item => item["Key"] == "SI_Title_FormatCss").Value){
            self.si_title_formatcss = self.df_si_title_formatcss;
        }else{
            self.si_title_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Title_FormatCss").Value);
        }

        if(!data.find(item => item["Key"] == "SI_Value_FormatCss").Value){
            self.si_value_formatcss = self.df_si_value_formatcss;
        }else{
            self.si_value_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Value_FormatCss").Value);
        }

        if(!data.find(item => item["Key"] == "SI_Link_FormatCss").Value){
            self.si_link_formatcss = self.df_si_link_formatcss;
        }else{
            self.si_link_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Link_FormatCss").Value);
        }

        if(!data.find(item => item["Key"] == "SI_Frame_Link_FormatCss").Value){
            self.si_frame_link_formatcss = self.df_si_frame_link_formatcss;
        }else{
            self.si_frame_link_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_Frame_Link_FormatCss").Value);
        }
      }
    });
  }
}
