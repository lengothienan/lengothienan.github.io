import { HIN_DashboardsServiceProxy } from './../../../../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit, OnDestroy, Input, ViewChild, ViewEncapsulation, Optional, Inject, AfterViewInit } from '@angular/core';
import { API_BASE_URL, DRReportServiceProxy, DRReportServiceServiceProxy, DRLookUpServiceProxy, DRViewerServiceProxy, DRFilterServiceProxy, DrDynamicFieldServiceProxy, DRColumnServiceProxy, DRChartServiceProxy, FParameter, DashboardCustomizationServiceProxy } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { WidgetComponentBase } from '../widget-component-base';
import { isNullOrUndefined } from 'util';
import { DxDataGridComponent, DxFormComponent, DxTreeViewComponent, DxChartComponent } from 'devextreme-angular';
import { FormatService } from '@app/main/dynamic-report/viewer/formatService';
import { ActivatedRoute, Router } from '@angular/router';
import { debug } from 'console';
import { DomSanitizer } from '@angular/platform-browser';
import { async } from '@angular/core/testing';


@Component({
  selector: 'widget-multi-simple-item',
  templateUrl: './widget-multi-simple-item.component.html',
  styleUrls: ['./widget-multi-simple-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})



export class WidgetMultiSimpleItemComponent extends WidgetComponentBase implements OnInit, OnDestroy, AfterViewInit {
  @Input() public widgetId: any;
  @Input() public widgetHeight: any;
  @Input() public widgetWidth: any;
  dashboard: any;
  html: any;
  data: any = [];
  header: any;

  MSI_StoreProcedure:any;
  MSI_Title_FormatCss:any;
  MSI_FrameTitle_FormatCss:any;
  MSI_Widget_FormatCss:any;

  constructor(
    private injector: Injector,
    private sanitizer: DomSanitizer,
    private router: Router,
    private dashboardService: HIN_DashboardsServiceProxy) {
    super(injector);
  }
  ngOnInit() {
  }

  ngAfterViewInit() {
    const self = this;
    document.getElementById('content').style.backgroundColor = '#6997DB';
    document.getElementById('content').style.overflow = 'hidden';
    document.getElementById('content').style.height = '30em';

    this.html = ``;
    this.html +=`<div id="content_MSI_`+this.widgetId+`"></div>`;
    //this.html += `<div class='row'>\n`;
    this.dashboard = "content_MSI_"+this.widgetId;
    this.html = this.sanitizer.bypassSecurityTrustHtml(this.html);
    setTimeout(function () {
      self.parseItem(self.dashboard);
    }, 1000);
  }

  parseItem(dashboard) {
    const self = this;

    self.implementMultiSimpleItem(dashboard);
    // document.getElementById('content').style.backgroundColor = 'white';
    // document.getElementById('content').style.height = 'initial';
    const screen_width = window.screen.availWidth;
    if (screen_width <= 1024) {
      $('.category').css('font-size', '10px');
    } else if (screen_width > 1024 && screen_width <= 1280) {
      $('.category').css('font-size', '11px');
    } else if (screen_width > 1280 && screen_width <= 1366) {
      $('.category').css('font-size', '13px');
    } else if (screen_width > 1366 && screen_width <= 1600) {
      $('.category').css('font-size', '16px');
    } else {
      $('.category').css('font-size', '20px');
    }

  }

  implementMultiSimpleItem(dom) {    
    let html = ``;
    const self = this;
    self.dashboardService.getInfoMultiSimpleItemWidget(self.widgetId).subscribe(res=>{     
      if (res.isSucceeded) {
        res.data.forEach(elm => {
          if(elm.Key == "MSI_StoreProcedure"){
            self.MSI_StoreProcedure = (elm.Value!=null && elm.Value !="") ? elm.Value : elm.DefaultValue ;
          }else if(elm.Key == "MSI_Title_FormatCss"){
            self.MSI_Title_FormatCss = (elm.Value!=null && elm.Value!="") ? elm.Value : elm.DefaultValue;
          }else if(elm.Key == "MSI_FrameTitle_FormatCss"){
            self.MSI_FrameTitle_FormatCss = (elm.Value!=null && elm.Value!="") ? elm.Value : elm.DefaultValue;
          }else if(elm.Key=="MSI_Widget_FormatCss"){
            self.MSI_Widget_FormatCss = (elm.Value!=null && elm.Value!="") ? elm.Value : elm.DefaultValue;
          }
        });
      }
      document.getElementById('content').setAttribute("style", self.MSI_Widget_FormatCss);
      this.dashboardService.dataResultStore(self.MSI_StoreProcedure, []).subscribe(result => {
        if (result.isSucceeded) {
          var open_link ="";
          self.data = result.data;
          self.header = result.data[0].MSI_Title;
          html += `<div class="card-component card-stats"> \n`;
          html += `<div class="header" style="`+self.MSI_FrameTitle_FormatCss+`"> <p style="`+self.MSI_Title_FormatCss+`"> ` + self.header + `</p> </div> \n`;
          html += `<div class='row' style ="margin-top: 10px;"> \n`;
          var i = 0;
          self.data.forEach(element => {
            if(result.data[i].MSI_Open_Link == 1){
              open_link = 'target="_blank"'
            }
            html += `<div class="col-sm-6 col-md-4 col-xl-4"> \n`;
            html += `
            <div class="card no-shadow rm-border bg-transparent widget-chart text-left">
              <div class="icon-wrapper rounded-circle">
                <div class="icon-wrapper-bg opacity-10" 
                style="`+self.data[i].MSI_Frame_Icon_FormatCss+`">    
                  <i class="`+self.data[i].MSI_Icon+`" style="`+self.data[i].MSI_Icon_FormatCss+`">
                  </i>
                </div>  
                
              </div>  
              <div class="widget-chart-content">
                <div class="widget-subheading" style="`+self.data[i].MSI_Content_FormatCss+`" >`+ self.data[i].MSI_Content + `</div>
                <div class="widget-numbers" style ="`+self.data[i].MSI_Value_FormatCss+`">`+ self.data[i].MSI_Value + `</div>
                <div class="widget-description opacity-8 text-focus">
                  <div class="d-inline text-danger pr-1">
                    <a href="`+self.data[i].MSI_Link+`" style="`+self.data[i].MSI_Link_FormatCss+`" `+open_link+` >`+ self.data[i].MSI_Content_Link + `</a>
                  </div>   
                </div>
                <div class="divider m-0 d-md-none d-sm-block">
                </div>
              </div>
            </div>
          </div>`;
            i++;
          });
          html += `</div> \n`;
          html += `</div> \n`;
          const box = document.getElementById(dom);
          box.innerHTML = html;
        }
      
      });
    });  
  }
}