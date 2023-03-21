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

import { DRFilterServiceProxy, DRFilterDto, DRReportServiceServiceProxy, DRLookUpServiceProxy, DrDynamicFieldServiceProxy, DRDataSourceServiceProxy } from '@shared/service-proxies/service-proxies';


@Component({
    selector: 'appc-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss'],
})
export class AddReportFilterComponent implements OnInit {
    host: any;
    constructor(private router: Router, 
        private activeRoute: ActivatedRoute, 
        private reportFilterSevice: DRFilterServiceProxy,
        private reportServiceService: DRReportServiceServiceProxy,
        private reportLookupService:DRLookUpServiceProxy,
        private dynamicFieldService:DrDynamicFieldServiceProxy,
        private dataSourceService:DRDataSourceServiceProxy) {

        //this.loadDataSourceOption();
        this.loadControlOptions();
        this.loadDataTypeOptions();
        this.loadLevelOptions(true);
        this.loadServiceTypeOptions(true);
        this.loadLookupOptions(true);
        this.loadGroupItemOptions(false);

    }
    currentId: any;
    currentReportId: any;
    page_title: any;
    templateData: DRFilterDto = new DRFilterDto();


    DataSourceOptions: any;
    ControlOptions: any;
    LevelOptions: any;
    ParentComboOptions: any;
    DataTypeOptions: any;
    LookupOptions: any;
    ServiceTypeOptions: any;
    ParentTagBoxOptions:any;
    GroupItemOptions: any;


    level = [];
    dataType = [{
        'key': true,
        'display': 'Danh mục',
    }, {
        'key': false,
        'display': 'Service'
    }];
    ViewData() { }
    ngOnInit() {
        const self = this;
        this.activeRoute.params.subscribe(param => {
            self.currentId = param.id;
            self.currentReportId = param.reportid;
            if (self.currentId !== 'null') {
                self.page_title = 'Cập nhật tiêu chí';
                self.reportFilterSevice.getByID(self.currentId).subscribe((res: any) => {
                    self.templateData = res;
                })
            } else {
                self.page_title = 'Thêm mới tiêu chí';
            }
        });

    }

    loadLookupOptions(serviceDisable) {
        const self = this;
        this.LookupOptions = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                    const promise = new Promise((resolve, reject) => {
                        var a;
                        self.reportLookupService.getByName(a).subscribe((res: any) => {
                            resolve(res);
                        });
                    });
                    return promise;
                },

            },
            valueExpr: 'id',
            displayExpr: 'name',
            showClearButton: true,
            searchEnabled: true,
            disabled: serviceDisable,
        }
    }

    loadServiceTypeOptions(serviceDisable) {
        const self = this;
        this.ServiceTypeOptions = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                    const promise = new Promise((resolve, reject) => {
                        var a;
                        self.reportServiceService.getByName(a).subscribe((res: any) => {
                            resolve(res);
                        });
                    });
                    return promise;
                },

            },
            valueExpr: 'id',
            displayExpr: 'name',
            showClearButton: true,
            searchEnabled: true,
            disabled: serviceDisable,
        }
    }

    loadDataTypeOptions() {
        const self = this;
        self.LookupOptions = { disabled: true }
        self.ServiceTypeOptions = { disabled: true }
        this.DataTypeOptions = {
            dataSource: this.dataType,
            valueExpr: 'key',
            displayExpr: 'display',
            placeholder: 'Chọn kiểu dữ liệu',
            onSelectionChanged: function (options) {
                if (options.selectedItem.key == true) {
                    self.LookupOptions = { disabled: false }
                    self.ServiceTypeOptions = { disabled: true }
                } else
                    if (options.selectedItem.key == false) {
                        self.LookupOptions = { disabled: true }
                        self.ServiceTypeOptions = { disabled: false }
                    } else {
                        self.LookupOptions = { disabled: true }
                        self.ServiceTypeOptions = { disabled: true }
                    }
            }
        }
    }

    loadParentComboOptions() {
        const self = this;
        this.ParentComboOptions = {
            dataSource: { 
                loadMode: 'raw',
                load: function () {
                    const promise = new Promise((resolve, reject) => {
                        self.reportFilterSevice.getFilterIsCombobox(self.currentReportId).subscribe((res: any) => {
                            resolve(res.data);
                        });
                    });
                    return promise;
                },
            },
            valueExpr: 'id',
            displayExpr: 'name',
            showClearButton: true,
            searchEnabled: true,
        }
    }

    loadLevelOptions(isDisable) {
        const self = this;
        for (var i = 1; i < 10; i++) {
            var obj = {};
            obj['key'] = i;
            this.level.push(obj);

        }
        this.LevelOptions = {
            dataSource: this.level,
            valueExpr: 'key',
            displayExpr: 'key',
        }
    }

    loadControlOptions() {
        const self = this;
        this.ControlOptions = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                    const promise = new Promise((resolve, reject) => {
                        self.dynamicFieldService.getAll().subscribe((res: any) => {
                            resolve(res.data);
                        });
                    });
                    return promise;
                },
            },
            searchEnabled: true,
            valueExpr: 'id',
            displayExpr: 'name',
            showClearButton: true,
            onSelectionChanged: function (options) {
                if (options.selectedItem.type != 'group') {
                    self.GroupItemOptions = { disabled: false }
                }
                if (options.selectedItem.type == 'dxSelectBox') {
                    //self.LevelOptions = { disabled: false, };
                    self.ParentComboOptions = { disabled: false }
                    self.loadParentComboOptions();
                }else if (options.selectedItem.type == 'dxTagBox') {
                    self.ParentTagBoxOptions = { disabled: false }
                    self.loadParentTagBoxOptions();
                }else if (options.selectedItem.type == 'group') {
                    self.GroupItemOptions = { disabled: true }
                }else {
                    
                    //self.LevelOptions = { disabled: true, };
                    //self.ParentComboOptions = { disabled: true }
                }
            }
        }
    }

    //tagbox
        loadParentTagBoxOptions(){
            const self = this;
            this.ParentTagBoxOptions = {
                dataSource: { 
                    loadMode: 'raw',
                    load: function () {
                        const promise = new Promise((resolve, reject) => {
                            self.reportFilterSevice.getFilterIsTagbox(self.currentReportId).subscribe((res: any) => {
                                resolve(res.data);
                            });
                        });
                        return promise;
                    },
                },
                valueExpr: 'id',
                displayExpr: 'name',
                showClearButton: true,
                searchEnabled: true,
            }
        }
    //

    loadDataSourceOption() {
        const self = this;
        this.DataSourceOptions = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                    const promise = new Promise((resolve, reject) => {
                        var a;
                        self.dataSourceService.getByName(a).subscribe((res: any) => {
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

    loadGroupItemOptions(isDisable) {
        const self = this;
        this.GroupItemOptions = {
            dataSource: {
                loadMode: 'raw',
                load: function () {
                    const promise = new Promise((resolve, reject) => {
                        self.reportFilterSevice.getGroupItemByReportId(self.currentReportId).subscribe((res: any) => {
                            resolve(res.data);
                        });
                    });
                    return promise;
                },
            },
            searchEnabled: true,
            valueExpr: 'id',
            displayExpr: 'name',
            showClearButton: true,
            disabled: isDisable,
        }
    }

    Save($event) {
        $event.preventDefault();
        const self = this;
        this.templateData.reportId = this.currentReportId;
        if (this.currentId != 'null') {
            this.reportFilterSevice.updateFilter(this.currentId, this.templateData).subscribe(res => {
                abp.notify.success('Cập nhật thành công!');
                this.router.navigate(['/app/main/dynamicreport/report/config/' + self.currentReportId + '/1']);
            });
        } else {
            this.reportFilterSevice.createFilter(this.templateData).subscribe(res => {
                if (res != null) {
                    abp.notify.success('Thêm mới thành công!');

                    this.router.navigate(['/app/main/dynamicreport/report/config/' + self.currentReportId + '/1']);
                } else {
                    abp.notify.error('Có lỗi xảy ra trong quá trình xử lý');
                }
            });
        }

    }
    Reset() { }
    Back() {
        this.router.navigate(['/app/main/dynamicreport/report/config/' + this.currentReportId + '/1']);
    }
}
