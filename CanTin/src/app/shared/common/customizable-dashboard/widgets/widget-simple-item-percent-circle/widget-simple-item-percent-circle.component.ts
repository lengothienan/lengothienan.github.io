import { HIN_DashboardsServiceProxy } from './../../../../../../shared/service-proxies/service-proxies';
import { Component, ElementRef, Injector, OnInit, OnDestroy, OnChanges, Input, ViewChild, ViewEncapsulation, Optional, Inject } from '@angular/core';
import { API_BASE_URL, DRReportServiceProxy, DRReportServiceServiceProxy, DRLookUpServiceProxy, DRViewerServiceProxy, DRFilterServiceProxy, DrDynamicFieldServiceProxy, DRColumnServiceProxy, DRChartServiceProxy, FParameter, DashboardCustomizationServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { WidgetComponentBase } from '../widget-component-base';
import { isNullOrUndefined } from 'util';
import { DxDataGridComponent, DxFormComponent, DxTreeViewComponent, DxChartComponent, DxPieChartComponent } from 'devextreme-angular';
import { FormatService } from '@app/main/dynamic-report/viewer/formatService';
import { ActivatedRoute } from '@angular/router';


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
  selector: 'app-widget-simple-item-percent-circle',
  templateUrl: './widget-simple-item-percent-circle.component.html',
  styleUrls: ['./widget-simple-item-percent-circle.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [FormatService],
})
export class WidgetSimpleItemPercentCircleComponent extends WidgetComponentBase implements OnInit, OnDestroy {

    @Input() public widgetId: any;
    @Input() public widgetHeight: any;
    @Input() public widgetWidth: any;

    @ViewChild('canvas', { static: true }) 
    canvas: ElementRef<HTMLCanvasElement>;
    ctx1 : CanvasRenderingContext2D ;
    ctx2 : CanvasRenderingContext2D ;
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

    // BEGIN : WG DEFAUL CONFIGS
    // wg default
    // content_size: string = "";
    // content_color: string = "";
  
    // value_color: string = "";
    // value_size: string = "";

    // widget
    df_si_pc_widget_formatcss : {};

    // icon
    df_si_pc_icon = "";
    df_si_pc_icon_formatcss: {};
    df_si_pc_frame_icon_formatcss: {};
    
    // title
    df_si_pc_title: string = "";
    df_si_pc_title_formatcss : {};
    
    // value
    df_si_pc_value1: string = "";
    df_si_pc_value2: string = "";
    df_si_pc_value1_formatcss: {};
    df_si_pc_value2_formatcss: {};

    // link
    df_si_pc_link = "#";
    // df_si_pc_content_link : string = "";
    // df_si_pc_link_formatcss : {};
    // df_si_pc_frame_link_formatcss : {};
    // df_si_pc_open_link : string = "";

    // content
    df_si_pc_content1 = "";
    df_si_pc_content2 = "";
    df_si_pc_content1_formatcss : {};
    df_si_pc_content2_formatcss : {};
    
    // percent_content
    df_si_pc_percent_content = "";
    df_si_pc_percent_content_formatcss : {};

    // progress
    df_si_pc_progress = "";
    df_si_pc_progress_bar_formatcss : {};
    df_si_pc_progress_formatcss : {};

    // END : WG DEFAULT CONFIGS

    // BEGIN : WG DETAIL CONFIGS
    // wg detail
    content_size: string = "";
    content_color: string = "";
  
    value_color: string = "";
    value_size: string = "";

    // widget
    si_pc_widget_formatcss : {};

    // icon
    si_pc_icon = "far fa-clone";
    si_pc_icon_formatcss: {};
    si_pc_frame_icon_formatcss: {};
    
    // title
    si_pc_title: string = "";
    si_pc_title_formatcss : {};
    
    // value
    si_pc_value1: string = "";
    si_pc_value2: string = "";
    si_pc_value1_formatcss: {};
    si_pc_value2_formatcss: {};

    // // link
    si_pc_link = "#";
    // si_pc_content_link : string = "";
    // si_pc_link_formatcss : {};
    // si_pc_frame_link_formatcss : {};
    // si_pc_open_link : string = "";

    // content
    si_pc_content1 = "";
    si_pc_content2 = "";
    si_pc_content1_formatcss : {};
    si_pc_content2_formatcss : {};
    
    // percent_content
    si_pc_percent_content = "";
    si_pc_percent_content_formatcss : {};

    // progress
    si_pc_progress = "";
    si_pc_progress_bar_formatcss : {};
    si_pc_progress_formatcss : {};
    
    // END : WG DETAILT CONFIGS

    si_pc_store: string = "";
    df_si_pc_store: string = "";

    // canvas
    percent = 85;
    percent2 = 15;
    canvas_width = 150;
    canvas_height = 150;
    border_width : number;
    border_height : number;
    border_margin_top : number;
    border_margin_left : number;
    progress_lineWidth = "";
    progress_lineWidth2 = "";
    progress_color = "";
    progress_color2 = "";
    
    ngOnInit() {
        // 
        const self = this;
        // if (self.widgetHeight < self.df_height) {
        //   self.content_fontSize = self.content_fontSize * self.widgetHeight / self.df_height - 1;
        //   self.value_fontSize = self.value_fontSize * self.widgetHeight / self.df_height - 1;
        // }

        // GET WIDGET DEFAULT CONFIGS
        this._dashboardCustomizationServiceProxy.getConfigDefaultWidgetsById(this.widgetId).subscribe((res: any) => {
            if (res.data.length > 0) {
                // 
                var data = res.data;
                
                self.df_si_pc_store = data.find(item => item["Key"] == "SI_PC_StoreProcedure").DefaultValue;
                // self.df_si_pc_title = data.find(item => item["Key"] == "SI_PC_Title").DefaultValue;
                self.df_si_pc_value1 = data.find(item => item["Key"] == "SI_PC_Value1").DefaultValue;
                self.df_si_pc_value2 = data.find(item => item["Key"] == "SI_PC_Value2").DefaultValue;
                self.df_si_pc_content1 = data.find(item => item["Key"] == "SI_PC_Content1").DefaultValue;
                self.df_si_pc_content2 = data.find(item => item["Key"] == "SI_PC_Content2").DefaultValue;
                self.df_si_pc_percent_content = data.find(item => item["Key"] == "SI_PC_Percent_Content").DefaultValue;
                self.df_si_pc_progress = data.find(item => item["Key"] == "SI_PC_Progress").DefaultValue;
                self.df_si_pc_icon = data.find(item => item["Key"] == "SI_PC_Icon").DefaultValue;
                self.df_si_pc_link = data.find(item => item["Key"] == "SI_PC_Link").DefaultValue;

                this._dashboardCustomizationServiceProxy.dataResultStore(self.df_si_pc_store, []).subscribe((res: any) => {
                    if (res.data.length > 0) {
                        var data = res.data; 
                        // 
                        // self.df_si_pc_title = data[0][self.df_si_pc_title];
                        self.df_si_pc_value1 = data[0][self.df_si_pc_value1];
                        self.df_si_pc_value2 = data[0][self.df_si_pc_value2];
                        self.df_si_pc_content1 = data[0][self.df_si_pc_content1];
                        self.df_si_pc_content2 = data[0][self.df_si_pc_content2];
                        self.df_si_pc_percent_content = data[0][self.df_si_pc_percent_content];
                        self.df_si_pc_progress = data[0][self.df_si_pc_progress];
                        self.df_si_pc_link = data[0][self.df_si_pc_link];
                    }
                });

                self.df_si_pc_widget_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Widget_FormatCss").DefaultValue);

                self.df_si_pc_icon_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Icon_FormatCss").DefaultValue);
                self.df_si_pc_frame_icon_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Frame_Icon_FormatCss").DefaultValue);
                self.df_si_pc_percent_content_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Percent_Content_FormatCss").DefaultValue);

                // self.df_si_pc_title_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Title_FormatCss").DefaultValue);
                self.df_si_pc_value1_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Value1_FormatCss").DefaultValue);
                self.df_si_pc_value2_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Value2_FormatCss").DefaultValue);

                self.df_si_pc_content1_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Content1_FormatCss").DefaultValue);
                self.df_si_pc_content2_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Content2_FormatCss").DefaultValue);
                
                self.df_si_pc_progress_bar_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_ProgressBar_FormatCss").DefaultValue);
                self.df_si_pc_progress_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Progress_FormatCss").DefaultValue);

                
                
            }
        });

        this._dashboardCustomizationServiceProxy.getConfigDetailWidgetsById(this.widgetId).subscribe((res: any) => {
            if (res.data.length > 0) {
            
                var data = res.data;
                // 
                if(!data.find(item => item["Key"] == "SI_PC_StoreProcedure").Value){
                    self.si_pc_store = self.df_si_pc_store;
                }else{
                    self.si_pc_store = data.find(item => item["Key"] == "SI_PC_StoreProcedure").Value;
                }
        
                // if(!data.find(item => item["Key"] == "SI_PC_Title").Value){
                //     self.si_pc_title = self.df_si_pc_title;
                // }else{
                //     self.si_pc_title = data.find(item => item["Key"] == "SI_PC_Title").Value;
                // }
        
                if(!data.find(item => item["Key"] == "SI_PC_Value1").Value){
                    self.si_pc_value1 = self.df_si_pc_value1;
                }else{
                    self.si_pc_value1 = data.find(item => item["Key"] == "SI_PC_Value1").Value;
                }

                if(!data.find(item => item["Key"] == "SI_PC_Value2").Value){
                    self.si_pc_value2 = self.df_si_pc_value2;
                }else{
                    self.si_pc_value2 = data.find(item => item["Key"] == "SI_PC_Value2").Value;
                }
        
                if(!data.find(item => item["Key"] == "SI_PC_Content1").Value){
                    self.si_pc_content1 = self.df_si_pc_content1;
                }else{
                    self.si_pc_content1 = data.find(item => item["Key"] == "SI_PC_Content1").Value;
                }

                if(!data.find(item => item["Key"] == "SI_PC_Content2").Value){
                    self.si_pc_content2 = self.df_si_pc_content2;
                }else{
                    self.si_pc_content2 = data.find(item => item["Key"] == "SI_PC_Content2").Value;
                }
        
                if(!data.find(item => item["Key"] == "SI_PC_Percent_Content").Value){
                    self.si_pc_percent_content = self.df_si_pc_percent_content;
                }else{
                    self.si_pc_percent_content = data.find(item => item["Key"] == "SI_PC_Percent_Content").Value;
                }
        
                if(!data.find(item => item["Key"] == "SI_PC_Progress").Value){
                    self.si_pc_progress = self.df_si_pc_progress;
                }else{
                    self.si_pc_progress = data.find(item => item["Key"] == "SI_PC_Progress").Value;
                }
        
                if(!data.find(item => item["Key"] == "SI_PC_Icon").Value){
                    self.si_pc_icon = self.df_si_pc_icon;
                }else{
                    self.si_pc_icon = data.find(item => item["Key"] == "SI_PC_Icon").Value;
                }

                if(!data.find(item => item["Key"] == "SI_PC_Link").Value){
                    self.si_pc_link = self.df_si_pc_link;
                }else{
                    self.si_pc_link = data.find(item => item["Key"] == "SI_PC_Link").Value;
                }
    
            
            
    
                
                

                
            
                if(!data.find(item => item["Key"] == "SI_PC_Widget_FormatCss").Value){
                    self.si_pc_widget_formatcss = self.df_si_pc_widget_formatcss;
                }else{
                    self.si_pc_widget_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Widget_FormatCss").Value);
                }
    
                if(!data.find(item => item["Key"] == "SI_PC_Icon_FormatCss").Value){
                    self.si_pc_icon_formatcss = self.df_si_pc_icon_formatcss;
                }else{
                    self.si_pc_icon_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Icon_FormatCss").Value);
                }
        
                if(!data.find(item => item["Key"] == "SI_PC_Frame_Icon_FormatCss").Value){
                    self.si_pc_frame_icon_formatcss = self.df_si_pc_frame_icon_formatcss;
                }else{
                    self.si_pc_frame_icon_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Frame_Icon_FormatCss").Value);
                }

                if(!data.find(item => item["Key"] == "SI_PC_Percent_Content_FormatCss").Value){
                    self.si_pc_percent_content_formatcss = self.df_si_pc_percent_content_formatcss;
                }else{
                    self.si_pc_percent_content_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Percent_Content_FormatCss").Value);
                }
    
            //   if(!data.find(item => item["Key"] == "SI_PC_Title_FormatCss").Value){
            //       self.si_pc_title_formatcss = self.df_si_pc_title_formatcss;
            //   }else{
            //       self.si_pc_title_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Title_FormatCss").Value);
            //   }
    
                if(!data.find(item => item["Key"] == "SI_PC_Value1_FormatCss").Value){
                    self.si_pc_value1_formatcss = self.df_si_pc_value1_formatcss;
                }else{
                    self.si_pc_value1_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Value1_FormatCss").Value);
                }

                if(!data.find(item => item["Key"] == "SI_PC_Value2_FormatCss").Value){
                    self.si_pc_value2_formatcss = self.df_si_pc_value2_formatcss;
                }else{
                    self.si_pc_value2_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Value2_FormatCss").Value);
                }
    
                if(!data.find(item => item["Key"] == "SI_PC_Content1_FormatCss").Value){
                    self.si_pc_content1_formatcss = self.df_si_pc_content1_formatcss;
                }else{
                    self.si_pc_content1_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Content1_FormatCss").Value);
                }

                if(!data.find(item => item["Key"] == "SI_PC_Content2_FormatCss").Value){
                    self.si_pc_content2_formatcss = self.df_si_pc_content2_formatcss;
                }else{
                    self.si_pc_content2_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Content2_FormatCss").Value);
                }
    
                if(!data.find(item => item["Key"] == "SI_PC_ProgressBar_FormatCss").Value){
                    self.si_pc_progress_bar_formatcss = self.df_si_pc_progress_bar_formatcss;
                }else{
                    self.si_pc_progress_bar_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_ProgressBar_FormatCss").Value);
                }
        
                if(!data.find(item => item["Key"] == "SI_PC_Progress_FormatCss").Value){
                    self.si_pc_progress_formatcss = self.df_si_pc_progress_formatcss;
                }else{
                    self.si_pc_progress_formatcss = JSON.parse(data.find(item => item["Key"] == "SI_PC_Progress_FormatCss").Value);
                }
                
                this._dashboardCustomizationServiceProxy.dataResultStore(self.si_pc_store, []).subscribe((res: any) => {
                    if (res.data.length > 0) {
                        
                        var data = res.data; 
                        // self.si_pc_title = data[0][self.si_pc_title];
                        self.si_pc_value1 = data[0][self.si_pc_value1];
                        self.si_pc_value2 = data[0][self.si_pc_value2];
                        self.si_pc_content1 = data[0][self.si_pc_content1];
                        self.si_pc_content2 = data[0][self.si_pc_content2];
                        self.si_pc_percent_content = data[0][self.si_pc_percent_content];
                        self.si_pc_progress = data[0][self.si_pc_progress];
                        self.si_pc_link = data[0][self.si_pc_link];

                        
                        // canvas
                        self.percent = Number(self.si_pc_progress);
                        self.percent2 = 100 - self.percent;
                        self.progress_lineWidth = self.si_pc_progress_formatcss["lineWidth"];
                        self.progress_lineWidth2 = self.si_pc_progress_bar_formatcss["lineWidth"];
                        self.progress_color = self.si_pc_progress_formatcss["color"];
                        self.progress_color2 = self.si_pc_progress_bar_formatcss["color"];

                        self.canvas_height = Number(self.si_pc_progress_formatcss["height"]);
                        self.canvas_width = Number(self.si_pc_progress_formatcss["width"]);

                        self.DrawCanvas(self.canvas_height,self.canvas_width,self.percent, self.percent2,self.progress_lineWidth,self.progress_color,self.progress_lineWidth2,self.progress_color2);
                    }
                });
                
            }
        });
            
    }
    

    DrawCanvas(height: number, width: number, percent: number, percent2: number, lineWidth: string, color: string, lineWidth2: string, color2: string){
        // var canvas = document.getElementById('myCanvas');
        // var context = canvas.getContext('2d');
        // var x = this.canvas.nativeElement.width / 2;
        this.border_width = width*0.54;
        this.border_height = height*0.33;
        this.border_margin_top = width*0.41;
        this.border_margin_left = -width*0.77;
        var x = width / 2;
        // var y = this.canvas.nativeElement.height / 2;
        var y = height / 2;
        
        
        this.ctx1 = this.canvas.nativeElement.getContext('2d');
        this.canvas.nativeElement.height = height;
        this.canvas.nativeElement.width = width;
        // var percent = 85;
        var radius = x - 10;
        var startAngle = -0.5 * Math.PI;
        var endAngle = (1.5 * percent / 100) * Math.PI;
        var counterClockwise = false;

        this.ctx1.beginPath();
        this.ctx1.arc(x, y, radius, startAngle, endAngle, counterClockwise);
        // this.ctx1.lineWidth = 7;
        this.ctx1.lineWidth = Number(lineWidth);

        // line color
        // this.ctx1.strokeStyle = '#4c7cf3';
        this.ctx1.strokeStyle = color;
        this.ctx1.stroke();

        // var canvas2 = document.getElementById('myCanvas');
        // var context2 = canvas2.getContext('2d');
        // var percent2 = 15;
        this.ctx2 = this.canvas.nativeElement.getContext('2d');  
        var x2 = x;
        var y2 = y;
        var radius2 = x - 10;
        var startAngle2 = (1.5 - 1.5 * percent2 / 100) * Math.PI;
        var endAngle2 = -0.5 * Math.PI;
        var counterClockwise2 = false;

        this.ctx2.beginPath();
        this.ctx2.arc(x2, y2, radius2, startAngle2, endAngle2, counterClockwise2);
        // this.ctx2.lineWidth = 6;
        this.ctx2.lineWidth = Number(lineWidth2);

        // line color
        // this.ctx2.strokeStyle = '#8A98AC';
        this.ctx2.strokeStyle = color2;
        this.ctx2.stroke();
    }

}
