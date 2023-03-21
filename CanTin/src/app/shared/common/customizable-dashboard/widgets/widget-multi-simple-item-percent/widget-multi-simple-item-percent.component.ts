import { HIN_DashboardsServiceProxy } from './../../../../../../shared/service-proxies/service-proxies';
import { Component, ElementRef, Injector, OnInit, OnDestroy, Input, ViewChild, ViewEncapsulation, Optional, Inject, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { API_BASE_URL, DRReportServiceProxy, DRReportServiceServiceProxy, DRLookUpServiceProxy, DRViewerServiceProxy, DRFilterServiceProxy, DrDynamicFieldServiceProxy, DRColumnServiceProxy, DRChartServiceProxy, FParameter, DashboardCustomizationServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { WidgetComponentBase } from '../widget-component-base';
import { isNullOrUndefined } from 'util';
import { DxDataGridComponent, DxFormComponent, DxTreeViewComponent, DxChartComponent, DxPieChartModule } from 'devextreme-angular';
import { FormatService } from '@app/main/dynamic-report/viewer/formatService';
import { ActivatedRoute, Router } from '@angular/router';
import { debug } from 'console';
import { DomSanitizer } from '@angular/platform-browser';
import { async } from '@angular/core/testing';

export class DataItem {
    country: string;
    commodity: string;
    total: number;
}



@Component({
    selector: 'widget-multi-simple-item-percent',
    templateUrl: './widget-multi-simple-item-percent.component.html',
    styleUrls: ['./widget-multi-simple-item-percent.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class WidgetMultiSimpleItemPercentComponent extends WidgetComponentBase implements OnInit, OnDestroy, AfterViewInit {
    @Input() public widgetId: any;
    @Input() public widgetHeight: any;
    @Input() public widgetWidth: any;

    @ViewChildren(DxPieChartModule, { read: true }) chartElementRefs: QueryList<DxPieChartModule>;

    chartData = [];
    
    chartData_demo = [
        {
            data: [{
                region: "SValue",
                val: 57
            }, {
                region: "FValue",
                val: 40
            }],
            innerRadius: "0.5",
            labels: ['S', 'F'],
            title: "title 1",
            description: "decripttion 1",
            s_value: "42",
            f_value: "6",
            percent_content: "87.5",
            datasets: [{
                data: [42, 6],

                backgroundColor: [
                    'teal',
                    'red'
                ],
                fill: true,
                borderWidth: 0,
                hoverBorderWidth: 10,
            }]
        },
        {
            data: [{
                region: "SValue",
                val: 20
            },
            {
                region: "SVaaaalue",
                val: 5
            },
            {
                region: "FValue",
                val: 10
            }],
            innerRadius: "0.7",
            labels: ['S', 'F'],
            title: "title 2",
            description: "decripttion 1",
            s_value: "42",
            f_value: "6",
            percent_content: "87.5",
            datasets: [{
                data: [42, 6],

                backgroundColor: [
                    'teal',
                    'red'
                ],
                fill: true,
                borderWidth: 0,
                hoverBorderWidth: 10,
            }]
        },
        {
            data: [{
                region: "SValue",
                val: 30
            }, {
                region: "FValue",
                val: 40
            }],
            innerRadius: "0.8",
            labels: ['S', 'F'],
            title: "title 3",
            description: "decripttion 1",
            s_value: "42",
            f_value: "6",
            percent_content: "87.5",
            datasets: [{
                data: [42, 6],

                backgroundColor: [
                    'teal',
                    'red'
                ],
                fill: true,
                borderWidth: 0,
                hoverBorderWidth: 10,
            }]
        }
    ];
    data = [{
        region: "SValue",
        val: 57
    }, {
        region: "FValue",
        val: 40
    }];
    data_add =
        {
            data: [{
                region: "SValue",
                val: 30
            }, {
                region: "FValue",
                val: 40
            }],
            innerRadius: "0.8",
            labels: ['S', 'F'],
            title: "title 3",
            description: "decripttion 1",
            s_value: "42",
            f_value: "6",
            percent_content: "87.5",
            datasets: [{
                data: [42, 6],

                backgroundColor: [
                    'teal',
                    'red'
                ],
                fill: true,
                borderWidth: 0,
                hoverBorderWidth: 10,
            }]
        };
    charts = [];

    wg_data = [];

    dashboard: any;
    html: any;
    // canvas
    percent = 85;
    percent2 = 15;
    canvas_width = 150;
    canvas_height = 100;
    progress_lineWidth = "";
    progress_lineWidth2 = "";
    progress_color = "";
    progress_color2 = "";

    

    // ------------------------------------BEGIN : WG DEFAUL CONFIGS
    // wg default
    // content_size: string = "";
    // content_color: string = "";

    // value_color: string = "";
    // value_size: string = "";

    // widget
    df_msi_p_widget_formatcss: {};

    // icon
    df_msi_p_icon = "";
    df_msi_p_icon_formatcss: {};
    df_msi_p_frame_icon_formatcss: {};

    // title
    df_msi_p_title: string = "";
    df_msi_p_title_formatcss: {};

    // value
    df_msi_p_value: string = "";
    df_msi_p_value_formatcss: {};

    // link
    df_msi_p_link = "#";
    // df_msi_p_content_link : string = "";
    // df_msi_p_link_formatcss : {};
    // df_msi_p_frame_link_formatcss : {};
    // df_msi_p_open_link : string = "";

    // content
    df_msi_p_content = "";
    df_msi_p_content_formatcss: {};

    // percent_content
    df_msi_p_percent_content = "";
    df_msi_p_percent_content_formatcss: {};

    // progress
    df_msi_p_progress = "";
    df_msi_p_progress_bar_formatcss: {};
    df_msi_p_progress_formatcss: {};
    df_msi_p_store: any;
    df_msi_p_descriptions: any;
    df_msi_p_svalue: any;
    df_msi_p_fvalue: any;
    df_msi_p_frametitle_formatcss: any;
    df_msi_p_item_formatcss = [];
    df_msi_p_description_formatcss: any;
    df_msi_p_svalue_formatcss: any;
    df_msi_p_fvalue_formatcss: any;
    df_msi_p_progressbar_formatcss: any;
    df_msi_p_cutoutPercentage = [];

    palette_cs = ['green', 'red', '#75B5D6', '#B78C9B', '#F2CA84', '#A7CA74'];
    df_msi_p_palette = ['green', 'red', '#75B5D6', '#B78C9B', '#F2CA84', '#A7CA74'];
    msi_p_store: any;
    msi_p_title: any;
    msi_p_content: any;
    msi_p_descriptions: any;
    msi_p_svalue: any;
    msi_p_fvalue: any;
    msi_p_percent_content: any;
    msi_p_progress: any;
    msi_p_widget_formatcss: any;
    msi_p_title_formatcss: any;
    msi_p_frametitle_formatcss: any;
    msi_p_svalue_formatcss: any;
    msi_p_fvalue_formatcss: any;
    msi_p_item_formatcss: any;
    msi_p_content_formatcss: any;
    msi_p_description_formatcss: any;
    msi_p_percent_content_formatcss: any;
    df_msi_p_innerradius: any;
    df_msi_p_progress_size: any;
    msi_p_innerradius: any;
    msi_p_progress_size: any;
    // ------------------------------------END : WG DEFAULT CONFIGS


    constructor(
        private injector: Injector,
        private sanitizer: DomSanitizer,
        private router: Router,
        private _dashboardCustomizationServiceProxy: HIN_DashboardsServiceProxy,
        private dashboardService: DashboardCustomizationServiceProxy) {
        super(injector);
    }
    ngOnInit() {
        // 
        const self = this;


        // GET WIDGET DEFAULT CONFIGS
        this._dashboardCustomizationServiceProxy.getConfigDefaultWidgetsById(this.widgetId).subscribe((res: any) => {
            if (res.data.length > 0) {
                var data = res.data;
                self.df_msi_p_store = data.find(item => item["Key"] == "MSI_P_StoreProcedure").DefaultValue;
                self.df_msi_p_title = data.find(item => item["Key"] == "MSI_P_Title").DefaultValue;

                self.df_msi_p_content = data.find(item => item["Key"] == "MSI_P_Content").DefaultValue;
                self.df_msi_p_descriptions = data.find(item => item["Key"] == "MSI_P_Descriptions").DefaultValue;
                self.df_msi_p_svalue = data.find(item => item["Key"] == "MSI_P_SValue").DefaultValue;
                self.df_msi_p_fvalue = data.find(item => item["Key"] == "MSI_P_FValue").DefaultValue;
                self.df_msi_p_percent_content = data.find(item => item["Key"] == "MSI_P_Percent_Content").DefaultValue;
                self.df_msi_p_progress = data.find(item => item["Key"] == "MSI_P_Progress").DefaultValue;

                // self.df_msi_p_icon = data.find(item => item["Key"] == "MSI_P_Icon").DefaultValue;
                // self.df_msi_p_link = data.find(item => item["Key"] == "MSI_P_Link").DefaultValue;
                this._dashboardCustomizationServiceProxy.dataResultStore(self.df_msi_p_store, []).subscribe((res: any) => {
                    if (res.data.length > 0) {
                        var data = res.data;
                        
                        // self.df_si_pc_title = data[0][self.df_si_pc_title];
                        for (var i = 0; i < data.length; i++) {
                            var temp = data[i]['MSI_P_Content'];

                            self.df_msi_p_svalue = data[i]['MSI_P_SValue'];
                            self.df_msi_p_fvalue = data[i]['MSI_P_FValue'];
                            self.df_msi_p_svalue_formatcss = JSON.parse(data[i]['MSI_P_SValue_FormatCss']);
                            self.df_msi_p_fvalue_formatcss = JSON.parse(data[i]['MSI_P_FValue_FormatCss']);
                            self.df_msi_p_item_formatcss = JSON.parse(data[i]['MSI_P_Item_FormatCss']);
                            self.df_msi_p_content_formatcss = JSON.parse(data[i]['MSI_P_Content_FormatCss']);
                            self.df_msi_p_description_formatcss = JSON.parse(data[i]['MSI_P_Content_FormatCss']);
                            self.df_msi_p_percent_content_formatcss = JSON.parse(data[i]['MSI_P_Percent_Content_FormatCss']);

                            self.df_msi_p_content = data[i]['MSI_P_Content'];
                            self.df_msi_p_descriptions = data[i]['MSI_P_Descriptions'];
                            self.df_msi_p_percent_content = data[i]['MSI_P_Percent_Content'];

                            self.df_msi_p_innerradius = data[i]['MSI_P_InnerRadius'];
                            self.df_msi_p_progress_size = data[i]['MSI_P_Progress_Size'];
                            

                            self.wg_data.push(
                                {
                                    'data': [{
                                        'region': "SValue",
                                        'val': self.df_msi_p_svalue
                                    }, {
                                        'region': "FValue",
                                        'val': self.df_msi_p_fvalue
                                    }],
                                    'innerRadius': self.df_msi_p_innerradius,
                                    'palette' : [ 
                                        self.df_msi_p_svalue_formatcss.color,
                                        self.df_msi_p_fvalue_formatcss.color
                                    ],
                                    'title': self.df_msi_p_content,
                                    'description': self.df_msi_p_descriptions,
                                    's_value':  self.df_msi_p_svalue,
                                    'f_value':  self.df_msi_p_fvalue,
                                    'percent_content': self.df_msi_p_percent_content,
                                    'item_formatcss': self.df_msi_p_item_formatcss,
                                    'content_formatcss': self.df_msi_p_content_formatcss,
                                    'description_formatcss': self.df_msi_p_description_formatcss,
                                    'svalue_formatcss': self.df_msi_p_svalue_formatcss,
                                    'fvalue_formatcss': self.df_msi_p_fvalue_formatcss,
                                    'percent_content_formatcss': self.df_msi_p_percent_content_formatcss,
                                    'progress_size' : self.df_msi_p_progress_size
                                    
                                }
                            );
                        }
                        
                        //self.chartData = self.wg_data;
                    }
                });
                self.df_msi_p_widget_formatcss = JSON.parse(data.find(item => item["Key"] == "MSI_P_Widget_FormatCss").DefaultValue);
                self.df_msi_p_title_formatcss = JSON.parse(data.find(item => item["Key"] == "MSI_P_Title_FormatCss").DefaultValue);
                self.df_msi_p_frametitle_formatcss = JSON.parse(data.find(item => item["Key"] == "MSI_P_FrameTitle_FormatCss").DefaultValue);
            }
        });

        // GET WIDGET DETAIL CONFIGS
        this._dashboardCustomizationServiceProxy.getConfigDetailWidgetsById(this.widgetId).subscribe((res: any) => {
            if (res.data.length > 0) {
                var data = res.data;
                
                if(!data.find(item => item["Key"] == "MSI_P_StoreProcedure").Value){
                    self.msi_p_store = self.df_msi_p_store;
                }else{
                    self.msi_p_store = data.find(item => item["Key"] == "MSI_P_StoreProcedure").Value;
                }

                self.msi_p_title = data.find(item => item["Key"] == "MSI_P_Title").Value;
                if(!self.msi_p_title){
                    self.msi_p_title = self.df_msi_p_title;
                }

                self.msi_p_content = data.find(item => item["Key"] == "MSI_P_Content").Value;
                if(!self.msi_p_content){
                    self.msi_p_content = self.df_msi_p_content;
                }

                self.msi_p_descriptions = data.find(item => item["Key"] == "MSI_P_Descriptions").Value;
                if(!self.msi_p_descriptions){
                    self.msi_p_descriptions = self.df_msi_p_descriptions;
                }

                self.msi_p_svalue = data.find(item => item["Key"] == "MSI_P_SValue").Value;
                if(!self.msi_p_svalue){
                    self.msi_p_svalue = self.df_msi_p_svalue;
                }

                self.msi_p_fvalue = data.find(item => item["Key"] == "MSI_P_FValue").Value;
                if(!self.msi_p_fvalue){
                    self.msi_p_fvalue = self.df_msi_p_fvalue;
                }

                self.msi_p_percent_content = data.find(item => item["Key"] == "MSI_P_Percent_Content").Value;
                if(!self.msi_p_percent_content){
                    self.msi_p_percent_content = self.df_msi_p_percent_content;
                }

                self.msi_p_progress = data.find(item => item["Key"] == "MSI_P_Progress").Value;
                if(!self.msi_p_progress){
                    self.msi_p_progress = self.df_msi_p_progress;
                }

                this._dashboardCustomizationServiceProxy.dataResultStore(self.msi_p_store, []).subscribe((res: any) => {
                    if (res.data.length > 0) {
                        var data = res.data;
                        self.wg_data = [];
                        
                        for (var i = 0; i < data.length; i++) {
                            var temp = data[i]['MSI_P_Content'];

                            self.msi_p_svalue = data[i]['MSI_P_SValue'];
                            if(!self.msi_p_svalue){
                                self.msi_p_svalue = self.df_msi_p_svalue;
                            }

                            self.msi_p_fvalue = data[i]['MSI_P_FValue'];
                            if(!self.msi_p_fvalue){
                                self.msi_p_fvalue = self.df_msi_p_fvalue;
                            }

                            self.msi_p_svalue_formatcss = JSON.parse(data[i]['MSI_P_SValue_FormatCss']);
                            if(!self.msi_p_svalue_formatcss){
                                self.msi_p_svalue_formatcss = self.df_msi_p_svalue_formatcss;
                            }

                            self.msi_p_fvalue_formatcss = JSON.parse(data[i]['MSI_P_FValue_FormatCss']);
                            if(!self.msi_p_fvalue_formatcss){
                                self.msi_p_fvalue_formatcss = self.df_msi_p_fvalue_formatcss;
                            }

                            self.msi_p_item_formatcss = JSON.parse(data[i]['MSI_P_Item_FormatCss']);
                            if(!self.msi_p_item_formatcss){
                                self.msi_p_item_formatcss = self.df_msi_p_item_formatcss;
                            }

                            self.msi_p_content_formatcss = JSON.parse(data[i]['MSI_P_Content_FormatCss']);
                            if(!self.msi_p_content_formatcss){
                                self.msi_p_content_formatcss = self.df_msi_p_content_formatcss;
                            }

                            self.msi_p_description_formatcss = JSON.parse(data[i]['MSI_P_Content_FormatCss']);
                            if(!self.msi_p_description_formatcss){
                                self.msi_p_description_formatcss = self.df_msi_p_description_formatcss;
                            }

                            self.msi_p_percent_content_formatcss = JSON.parse(data[i]['MSI_P_Percent_Content_FormatCss']);
                            if(!self.msi_p_percent_content_formatcss){
                                self.msi_p_percent_content_formatcss = self.df_msi_p_percent_content_formatcss;
                            }
                            
                            self.msi_p_content = data[i]['MSI_P_Content'];
                            if(!self.msi_p_content){
                                self.msi_p_content = self.df_msi_p_content;
                            }

                            self.msi_p_descriptions = data[i]['MSI_P_Descriptions'];
                            if(!self.msi_p_descriptions){
                                self.msi_p_descriptions = self.df_msi_p_descriptions;
                            }

                            self.msi_p_percent_content = data[i]['MSI_P_Percent_Content'];
                            if(!self.msi_p_percent_content){
                                self.msi_p_percent_content = self.df_msi_p_percent_content;
                            }

                            self.msi_p_innerradius = data[i]['MSI_P_InnerRadius'];
                            if(!self.msi_p_innerradius){
                                self.msi_p_innerradius = self.df_msi_p_innerradius;
                            }

                            self.msi_p_progress_size = data[i]['MSI_P_Progress_Size'];
                            if(!self.msi_p_progress_size){
                                self.msi_p_progress_size = self.df_msi_p_progress_size;
                            }

                            self.wg_data.push(
                                {
                                    'data': [{
                                        'region': "SValue",
                                        'val': self.msi_p_svalue
                                    }, {
                                        'region': "FValue",
                                        'val': self.msi_p_fvalue
                                    }],
                                    'innerRadius': self.msi_p_innerradius,
                                    'palette' : [ 
                                        self.msi_p_svalue_formatcss.color,
                                        self.msi_p_fvalue_formatcss.color
                                    ],
                                    'title': self.msi_p_content,
                                    'description': self.msi_p_descriptions,
                                    's_value':  self.msi_p_svalue,
                                    'f_value':  self.msi_p_fvalue,
                                    'percent_content': self.msi_p_percent_content,
                                    'item_formatcss': self.msi_p_item_formatcss,
                                    'content_formatcss': self.msi_p_content_formatcss,
                                    'description_formatcss': self.msi_p_description_formatcss,
                                    'svalue_formatcss': self.msi_p_svalue_formatcss,
                                    'fvalue_formatcss': self.msi_p_fvalue_formatcss,
                                    'percent_content_formatcss': self.msi_p_percent_content_formatcss,
                                    'progress_size' : self.msi_p_progress_size
                                    
                                }
                            );
                        }
                        
                        self.chartData = self.wg_data;
                    }
                });
                self.msi_p_widget_formatcss = data.find(item => item["Key"] == "MSI_P_Widget_FormatCss").Value;
                if(!self.msi_p_widget_formatcss){
                    self.msi_p_widget_formatcss = self.df_msi_p_widget_formatcss;
                }else{
                    self.msi_p_widget_formatcss = JSON.parse(data.find(item => item["Key"] == "MSI_P_Widget_FormatCss").Value);
                }

                self.msi_p_title_formatcss = data.find(item => item["Key"] == "MSI_P_Title_FormatCss").Value;
                if(!self.msi_p_title_formatcss){
                    self.msi_p_title_formatcss = self.df_msi_p_title_formatcss;
                }else{
                    self.msi_p_title_formatcss = JSON.parse(data.find(item => item["Key"] == "MSI_P_Title_FormatCss").Value);
                }

                self.msi_p_frametitle_formatcss = data.find(item => item["Key"] == "MSI_P_FrameTitle_FormatCss").Value;
                if(!self.msi_p_frametitle_formatcss){
                    self.msi_p_frametitle_formatcss = self.df_msi_p_frametitle_formatcss;
                }else{
                    self.msi_p_frametitle_formatcss = JSON.parse(data.find(item => item["Key"] == "MSI_P_FrameTitle_FormatCss").Value);
                }
                self.chartData = self.wg_data;
            }
        });
    }

    ngAfterViewInit() {
    }
}  