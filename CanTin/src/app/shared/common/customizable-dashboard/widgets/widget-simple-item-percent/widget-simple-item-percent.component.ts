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
  selector: 'app-widget-simple-item-percent',
  templateUrl: './widget-simple-item-percent.component.html',
  styleUrls: ['./widget-simple-item-percent.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [FormatService],
})

export class WidgetSimpleItemPercentComponent extends WidgetComponentBase implements OnInit, OnDestroy {
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
    sip_widget_formatcss : {};

    // icon
    sip_icon = "far fa-clone";
    sip_icon_formatcss: {};
    sip_frame_icon_formatcss: {};
    
    // title
    sip_title: string = "";
    sip_title_formatcss : {};
    
    // value
    sip_value: string = "";
    sip_value_formatcss: {};

    // // link
    sip_link = "#";
    // sip_content_link : string = "";
    // sip_link_formatcss : {};
    // sip_frame_link_formatcss : {};
    // sip_open_link : string = "";

    // content
    sip_content = "";
    sip_content_formatcss : {};
    
    // percent_content
    sip_percent_content = "";
    sip_percent_content_formatcss : {};

    // progress
    sip_progress = "";
    sip_progress_bar_formatcss : {};
    sip_progress_formatcss : {};
    
    // END : WG DETAILT CONFIGS

    // BEGIN : WG DEFAUL CONFIGS
    // wg default
    // content_size: string = "";
    // content_color: string = "";
  
    // value_color: string = "";
    // value_size: string = "";

    // widget
    df_sip_widget_formatcss : {};

    // icon
    df_sip_icon = "";
    df_sip_icon_formatcss: {};
    df_sip_frame_icon_formatcss: {};
    
    // title
    df_sip_title: string = "";
    df_sip_title_formatcss : {};
    
    // value
    df_sip_value: string = "";
    df_sip_value_formatcss: {};

    // link
    df_sip_link = "#";
    // df_sip_content_link : string = "";
    // df_sip_link_formatcss : {};
    // df_sip_frame_link_formatcss : {};
    // df_sip_open_link : string = "";

    // content
    df_sip_content = "";
    df_sip_content_formatcss : {};
    
    // percent_content
    df_sip_percent_content = "";
    df_sip_percent_content_formatcss : {};

    // progress
    df_sip_progress = "";
    df_sip_progress_bar_formatcss : {};
    df_sip_progress_formatcss : {};

    // END : WG DEFAULT CONFIGS

  

    sip_store: string = "";
    df_sip_store: string = "";

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
            // 
            var data = res.data;
            
            self.df_sip_store = data.find(item => item["Key"] == "SIP_StoreProcedure").DefaultValue;
            self.df_sip_title = data.find(item => item["Key"] == "SIP_Title").DefaultValue;
            self.df_sip_value = data.find(item => item["Key"] == "SIP_Value").DefaultValue;
            self.df_sip_content = data.find(item => item["Key"] == "SIP_Content").DefaultValue;
            self.df_sip_percent_content = data.find(item => item["Key"] == "SIP_Percent_Content").DefaultValue;
            self.df_sip_progress = data.find(item => item["Key"] == "SIP_Progress").DefaultValue;
            self.df_sip_icon = data.find(item => item["Key"] == "SIP_Icon").DefaultValue;
            self.df_sip_link = data.find(item => item["Key"] == "SIP_Link").DefaultValue;

            this._dashboardCustomizationServiceProxy.dataResultStore(self.df_sip_store, []).subscribe((res: any) => {
                if (res.data.length > 0) {
                    var data = res.data; 
                    // 
                    self.df_sip_title = data[0][self.df_sip_title];
                    self.df_sip_value = data[0][self.df_sip_value];
                    self.df_sip_content = data[0][self.df_sip_content];
                    self.df_sip_percent_content = data[0][self.df_sip_percent_content];
                    self.df_sip_progress = data[0][self.df_sip_progress];
                    self.df_sip_link = data[0][self.df_sip_link];
                }
            });

            self.df_sip_widget_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_Widget_FormatCss").DefaultValue);

            self.df_sip_icon_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_Icon_FormatCss").DefaultValue);
            self.df_sip_frame_icon_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_Frame_Icon_FormatCss").DefaultValue);

            self.df_sip_title_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_Title_FormatCss").DefaultValue);
            self.df_sip_value_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_Value_FormatCss").DefaultValue);

            self.df_sip_content_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_Content_FormatCss").DefaultValue);
            self.df_sip_percent_content_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_PercentContent_FormatCss").DefaultValue);
            self.df_sip_progress_bar_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_ProgressBar_FormatCss").DefaultValue);
            self.df_sip_progress_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_Progress_FormatCss").DefaultValue);

            
            
        }
    });


    this._dashboardCustomizationServiceProxy.getConfigDetailWidgetsById(this.widgetId).subscribe((res: any) => {
      if (res.data.length > 0) {
        
        var data = res.data;
        // 
        if(!data.find(item => item["Key"] == "SIP_StoreProcedure").Value){
            self.sip_store = self.df_sip_store;
        }else{
            self.sip_store = data.find(item => item["Key"] == "SIP_StoreProcedure").Value;
        }

        if(!data.find(item => item["Key"] == "SIP_Title").Value){
            self.sip_title = self.df_sip_title;
        }else{
            self.sip_title = data.find(item => item["Key"] == "SIP_Title").Value;
        }

        if(!data.find(item => item["Key"] == "SIP_Value").Value){
            self.sip_value = self.df_sip_value;
        }else{
            self.sip_value = data.find(item => item["Key"] == "SIP_Value").Value;
        }

        if(!data.find(item => item["Key"] == "SIP_Content").Value){
            self.sip_content = self.df_sip_content;
        }else{
            self.sip_content = data.find(item => item["Key"] == "SIP_Content").Value;
        }

        if(!data.find(item => item["Key"] == "SIP_Percent_Content").Value){
            self.sip_percent_content = self.df_sip_percent_content;
        }else{
            self.sip_percent_content = data.find(item => item["Key"] == "SIP_Percent_Content").Value;
        }

        if(!data.find(item => item["Key"] == "SIP_Progress").Value){
            self.sip_progress = self.df_sip_progress;
        }else{
            self.sip_progress = data.find(item => item["Key"] == "SIP_Progress").Value;
        }

        if(!data.find(item => item["Key"] == "SIP_Icon").Value){
            self.sip_icon = self.df_sip_icon;
        }else{
            self.sip_icon = data.find(item => item["Key"] == "SIP_Icon").Value;
        }

        if(!data.find(item => item["Key"] == "SIP_Link").Value){
            self.sip_link = self.df_sip_link;
        }else{
            self.sip_link = data.find(item => item["Key"] == "SIP_Link").Value;
        }

        
        

        this._dashboardCustomizationServiceProxy.dataResultStore(self.sip_store, []).subscribe((res: any) => {
            if (res.data.length > 0) {
                // 
                var data = res.data; 
                self.sip_title = data[0][self.sip_title];
                self.sip_value = data[0][self.sip_value];
                self.sip_content = data[0][self.sip_content];
                self.sip_percent_content = data[0][self.sip_percent_content];
                self.sip_progress = data[0][self.sip_progress];
                self.sip_link = data[0][self.sip_link];
            }
        });
        
        if(!data.find(item => item["Key"] == "SIP_Widget_FormatCss").Value){
            self.sip_widget_formatcss = self.df_sip_widget_formatcss;
        }else{
            self.sip_widget_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_Widget_FormatCss").Value);
        }

        if(!data.find(item => item["Key"] == "SIP_Icon_FormatCss").Value){
            self.sip_icon_formatcss = self.df_sip_icon_formatcss;
        }else{
            self.sip_icon_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_Icon_FormatCss").Value);
        }

        if(!data.find(item => item["Key"] == "SIP_Frame_Icon_FormatCss").Value){
            self.sip_frame_icon_formatcss = self.df_sip_frame_icon_formatcss;
        }else{
            self.sip_frame_icon_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_Frame_Icon_FormatCss").Value);
        }

        if(!data.find(item => item["Key"] == "SIP_Title_FormatCss").Value){
            self.sip_title_formatcss = self.df_sip_title_formatcss;
        }else{
            self.sip_title_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_Title_FormatCss").Value);
        }

        if(!data.find(item => item["Key"] == "SIP_Value_FormatCss").Value){
            self.sip_value_formatcss = self.df_sip_value_formatcss;
        }else{
            self.sip_value_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_Value_FormatCss").Value);
        }

        if(!data.find(item => item["Key"] == "SIP_Content_FormatCss").Value){
            self.sip_content_formatcss = self.df_sip_content_formatcss;
        }else{
            self.sip_content_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_Content_FormatCss").Value);
        }

        if(!data.find(item => item["Key"] == "SIP_PercentContent_FormatCss").Value){
            self.sip_percent_content_formatcss = self.df_sip_percent_content_formatcss;
        }else{
            self.sip_percent_content_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_PercentContent_FormatCss").Value);
        }

        if(!data.find(item => item["Key"] == "SIP_ProgressBar_FormatCss").Value){
            self.sip_progress_bar_formatcss = self.df_sip_progress_bar_formatcss;
        }else{
            self.sip_progress_bar_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_ProgressBar_FormatCss").Value);
        }

        if(!data.find(item => item["Key"] == "SIP_Progress_FormatCss").Value){
            self.sip_progress_formatcss = self.df_sip_progress_formatcss;
        }else{
            self.sip_progress_formatcss = JSON.parse(data.find(item => item["Key"] == "SIP_Progress_FormatCss").Value);
        }
      }
    });
  }
}
