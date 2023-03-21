import {
    Component,
    OnInit
} from '@angular/core';
import {
    Router, ActivatedRoute,
} from '@angular/router';
import {
    isNullOrUndefined
} from 'util';
import {  DRReportServiceProxy, DRDataSourceServiceProxy, DRReportDTO } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { HttpClient ,HttpEventType} from '@angular/common/http';

@Component({
    selector: 'appc-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
    host: any;
    constructor(private router: Router,
        private activeRoute: ActivatedRoute,
        private reportSevice: DRReportServiceProxy,
        private dataSourceService: DRDataSourceServiceProxy,
        private http: HttpClient,
        ) {

        this.loadSQLTypeOptions();
        this.loadDataSourceOption();
        this.loadDisplayTypeOption();
        this.loadGroupLevelOptions();
        this.loadFormOptions();
        this.loadGetColTypeOptions();
    }
    currentId: any;
    page_title: any;
    button_title: any;
    sectionInfo: any;
    dateBegin: any;
    dateEnd: any;
    templateData: DRReportDTO;

    SQLTypeOptions: any;
    DataSourceOptions: any;
    DisplayTypeOptions: any;
    GroupLevelOptions: any;
    GetColTypeOptions: any;
    FormOptions: any;
    fileServerUrl :any;

    sqlType = [{
        'value': false,
        'display': 'Store',
    }, {
        'value': true,
        'display': 'SqlCommand',
    }];
    displayType = [{
        'value': 0,
        'display': 'Bảng',
    },
     {
        'value': 2,
        'display': 'Biểu đồ cột'
    }, {
        'value': 3,
        'display': 'Biểu đồ tròn'
    }, {
        'value': 4,
        'display': 'Biểu đồ donut'
    }]

    getColType = [{
        'value': 1,
        'display': 'SQL',
    },
    {
        'value': 2,
        'display': 'Biểu mẫu cố định',
    },
    // {
    //     'value': 3,
    //     'display': 'Biểu mẫu thay đổi',
    // }
    ];

    groupLevel = [];
    ViewData() { }
    ngOnInit() {
        this.templateData = new DRReportDTO();
        const self = this;
        this.activeRoute.params.subscribe(param => {
            self.currentId = param.id;
            if (self.currentId !== 'null') {
                self.page_title = 'Cập nhật';
                self.loadFormData(self.currentId);
            } else {
                self.page_title = 'Thêm mới';
            }
        });

        this.fileServerUrl = AppConsts.remoteServiceBaseUrl;


    }
    loadGetColTypeOptions() {
        const self = this;
        this.GetColTypeOptions = {
            dataSource: self.getColType,
            searchEnabled: true,
            valueExpr: 'value',
            displayExpr: 'display',
            showClearButton: true
        };
    }
    loadSQLTypeOptions() {
        const self = this;
        this.SQLTypeOptions = {
            dataSource: self.sqlType,
            searchEnabled: true,
            valueExpr: 'value',
            displayExpr: 'display',
            showClearButton: true
        };
    }
    loadFormOptions() {
        const self = this;
        this.FormOptions = {
            dataSource: [],
            searchEnabled: true,
            valueExpr: 'Id',
            displayExpr: 'FormName',
            showClearButton: true
        }
    }

    loadGroupLevelOptions() {
        const self = this;
        for (var i = 1; i < 10; i++) {
            var obj = new Object();
            obj["value"] = i;
            this.groupLevel.push(obj);
        }
        self.GroupLevelOptions = {
            dataSource: self.groupLevel,
            valueExpr: 'value',
            displayExpr: 'value',
            showClearButton: true
        }
    }

    loadDataSourceOption() {
        const self = this;
        this.DataSourceOptions = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                    const promise = new Promise((resolve, reject) => {
                        var temp;
                        self.dataSourceService.getByName(temp).subscribe((res: any) => {
                            resolve(res);
                        });
                    });

                    return promise;
                },
            },
            searchEnabled: true,
            valueExpr: 'id',
            displayExpr: 'name',
            showClearButton: true
        };
    }

    loadDisplayTypeOption() {
        const self = this;
        this.DisplayTypeOptions = {
            dataSource: self.displayType,
            searchEnabled: true,
            valueExpr: 'value',
            displayExpr: 'display',
            showClearButton: true
        }
    }

    loadFormData(id) {
        const self = this;
        this.reportSevice.getById(id).subscribe((response: any) => {
            var a = new DRReportDTO();
            a = response.data.c;
            a.fileWordId = response.data.fileWordId;
            a.fileExcelId = response.data.fileExcelId;
            this.templateData = a;
        })
    }



    Save() {
        if (this.currentId != 'null') {
            this.reportSevice.update(this.templateData).subscribe(res => {
                    abp.notify.success('Cập nhật  thành công!');
                    this.router.navigate(['/app/main/dynamicreport/']);
            });
        } else {
            this.reportSevice.create(this.templateData).subscribe(res => {
                    abp.notify.success('Thêm mới thành công!');

                    this.router.navigate(['/app/main/dynamicreport/']);
            });
        }

    }
    Reset() { }
    Back() {
        this.router.navigate(['/app/main/dynamicreport/report/viewer-utility/DRP_REPORT/REPORT/']);
    }
    EXCELfileChange(event) {
        const files = event.target.files;

        if (files.length > 0) {
            const formData: FormData = new FormData();
            formData.append('files', files[files.length - 1], files[files.length - 1].name);

            this.http.post(AppConsts.fileServerUrl + '/api/v1/attachment/upload?code=REPORT_TEMPLATE',formData).subscribe(res=>{
                this.templateData.excel = "/" + res['result']['data'][0].filePath + "/" + res['result']['data'][0].fileName;
                this.templateData.fileExcelId = res['result']['data'][0].id;
            })
        }
    }

    WORDfileChange(event) {
        const files = event.target.files;

        if (files.length > 0) {
            const formData: FormData = new FormData();
            formData.append('files', files[files.length - 1], files[files.length - 1].name);

            this.http.post(AppConsts.fileServerUrl + '/api/v1/attachment/upload?code=REPORT_TEMPLATE',formData).subscribe(res=>{
                this.templateData.word = "/" + res['result']['data'][0].filePath + "/" + res['result']['data'][0].fileName;
                this.templateData.fileWordId = res['result']['data'][0].id;
            })
        }
    }

    downloadFile(path: string){
        window.open(path);
    }

    removeTemplateExcel(){
        this.templateData.excel = "";
        this.templateData.fileExcelId = null;
    }

    removeTemplateWord(){
        this.templateData.word = "";
        this.templateData.fileWordId = null;
    }
}
