import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import 'dhtmlx-gantt';
import { gantt } from 'dhtmlx-gantt';
import { PlanServiceProxy } from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';


@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'gantt',
    styleUrls: ['./viewer-gantt-component.css'],
    templateUrl: './viewer-gantt-component.html'
})




export class ReportViewGanttComponent implements OnInit {
    @ViewChild('gantt_here', {static: true}) ganttContainer: ElementRef;

    constructor(
        private _planServiceProxy: PlanServiceProxy,
        private activeRouter: ActivatedRoute,
    ) {}
        
    data = [];
    planId : any;
    ngOnInit() {
        debugger
        const self = this;
        // get planId
        self.planId = self.activeRouter.snapshot.queryParams['planId'];
        // get data
        this._planServiceProxy.getListGanttChart_ByPlanId(self.planId).subscribe((res: any) => {
            if (res.data.length > 0) {
                debugger
                self.data = res.data;
                gantt.parse({ 
                    data : self.data
                });
            }
        });

        // gantt.config.xml_date = '%Y-%m-%d %H:%i';
        gantt.config.xml_date = '%d-%m-%Y %H:%i';
        gantt.config.date_grid = "%m/%d/%Y";
        gantt.config.columns = [
            {name: "text", label: "Tên", tree: true, width: 300, resize:true},
            {name: "start_date", label:"Bắt đầu", align: "center", width: 80, resize:true},
            {name: "end_date", label:"Kết thúc", align: "center", width: 80, resize:true},
            // more columns
        ];
        gantt.config.readonly = true;
        gantt.i18n.setLocale({
            date: {
                month_full: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", 
                    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
                month_short: ["T1", "T2","T3", "T4", "T5","T6", "T7", "T8", "T9","T10", "T11", "T12"],
                day_full: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm",
                    "Thứ sáu", "Thứ 7"],
                day_short: ["CN", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7"]
            }
        });
        gantt.init(this.ganttContainer.nativeElement);
    }
}