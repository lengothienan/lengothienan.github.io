import { Component, OnInit, EventEmitter, Output, ViewChild, Injector, Input, Inject, Optional } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ModalDirective } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LabelActionServiceProxy, API_BASE_URL, CreateOrUpdateLabelActionInput, DRDataSourceServiceProxy } from '@shared/service-proxies/service-proxies';
import { DxFormComponent } from 'devextreme-angular';
import { ViewerUtilityConfigurationService } from '../dynamic-report/viewer/viewer-utility/viewer-utility-configuration.service';
import DevExpress from 'devextreme';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';

@Component({
    selector: 'ConfigWidgetItemAction',
    templateUrl: './config-widget-item-action.component.html'
})

export class ConfigWidgetItemActionComponent extends AppComponentBase {

    @ViewChild('detailForm', { static: true }) detailForm: DxFormComponent;

    Name: any = "";
    labelActionData: any;
    dataActionName: any;
    dataAction: any;
    dataType: any = [{
        id: "LINK",
        name: "Đường dẫn"
    }, {
        id: "HYPERLINK",
        name: "Hyper Link"
    }, {
        id: "STORE",
        name: "Store"
    }, {
        id: "SHOWCOMPONENT",
        name: "Màn hình"
    }, {
        id: "POPUPFORM",
        name: "Form Popup"
    }];
    labelActionId: number;
    addCheck = false;
    editCheck = false;
    isComponent = false;
    ReadOnly = false;
    isLink = false;
    saveBtnVisible = true;
    currentUserId = this.appSession.userId;
    actionTypeOption: any;
    valueOption: any = {
        editorType: "dxTextBox",
        readOnly: this.ReadOnly
    };
    comeBackLinkOption: any;

    private baseUrl: string;
    fromUngroupedData: DevExpress.data.DataSource;
    DBdataSrc: any;
    isStore = false;


    constructor(
        injector: Injector,
        private labelActionService: LabelActionServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private viewDefinition: ViewerUtilityConfigurationService,
        private configReportService: DRDataSourceServiceProxy,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(injector);
        this.baseUrl = baseUrl ? baseUrl : ""
    }

    ngOnInit() {
        const self = this;
        var stage = window.localStorage.getItem('PLANACTION')

        var Id = this._activatedRoute.snapshot.paramMap.get('id');
        const utilitAction = localStorage.getItem("UTILITY_ACTION");

        this.configReportService.getByName('').subscribe((res: any) => {

            this.DBdataSrc = res;
        });

        this.labelActionService.getActionForLabel().subscribe((res: any) => {
            if (res.code == "Success") {
                self.dataAction = res.data;
            }
            else if (res.code == "Error") {
                self.notify.error(res.message);
            }
        })

        this.labelActionService.getWidgetItem().subscribe((res: any) => {
            if (res.code == "Success") {
                self.dataActionName = res.data;
                // self.fromUngroupedData = new DataSource({
                //     store: new ArrayStore({
                //         data: self.dataActionName,
                //         key: "id"
                //     }),
                //     group: "widgetLayoutId"
                // });

            }
            else if (res.code == "Error") {
                self.notify.error(res.message);
            }
        })


        this.activeRoute.params.subscribe((para) => {
            const Id = para['id'];
            if (Id != 'null' && Id != "") {
                this.labelActionId = parseInt(Id);
                this.Name = "Chỉnh sửa Label Action";
                if (utilitAction == 'VIEW') {
                    this.Name = "Xem chi tiết Label Action";
                    this.ReadOnly = true;
                    this.saveBtnVisible = false;
                }
                // this.labelActionService.getWidgetItemActionById(this.labelActionId).subscribe((res: any) => {
                //     if (res.code == "Success") {
                //         self.labelActionData = res.data[0];
                //     }
                //     else if (res.code == "Error") {
                //         self.notify.error(res.message);
                //     }
                // })

                this.editCheck = true;
            } else {
                this.Name = "Thêm mới Label Action";
                this.addCheck = true;
                this.labelActionData =
                {
                    widgetItemId: "",
                    actionId: null,
                    dataSourceID: 0,
                    value: "",
                    type: null,
                    index: 0,
                    isDelete: false,
                    isActive: true
                }

            }
            if (stage == 'EDIT') {

            } else if (stage == 'VIEW') {

            } else if (stage == null || Id == 'null') {

            }
        })
        this.setUpEditorOption()
    }


    save(): void {
        let result = this.detailForm.instance.validate();
        // if (result.isValid) {
        //     if (this.addCheck) {
        //         // var labelActionData = new CreateOrUpdateWidgetItemAction();
        //         labelActionData.id = -1;
        //         labelActionData.widgetItemId = this.labelActionData.widgetItemId;
        //         labelActionData.actionId = this.labelActionData.actionId;
        //         labelActionData.dataSourceID = this.labelActionData.dataSourceID;
        //         labelActionData.value = this.labelActionData.value;
        //         labelActionData.type = this.labelActionData.type;
        //         labelActionData.index = this.labelActionData.index;
        //         labelActionData.isDelete = !this.labelActionData.isActive;
        //         labelActionData.width = this.labelActionData.width;
        //         labelActionData.height = this.labelActionData.height;

        //         // this.labelActionService.insertOrUpdateWidgetItemAction(labelActionData).subscribe((res: any) => {
        //         //     if (res.code == "Success") {
        //         //         this.notify.success(this.l('Successfully'));
        //         //     }
        //         //     else if (res.code == "Error") {
        //         //         this.notify.error(res.message);
        //         //     }
        //         // })

        //     } else if (this.editCheck) {
        //         if (this.labelActionId != null) {
        //             // var labelActionData = new CreateOrUpdateWidgetItemAction();
        //             labelActionData.id = this.labelActionId;
        //             labelActionData.widgetItemId = this.labelActionData.widgetItemId;
        //             labelActionData.actionId = this.labelActionData.actionId;
        //             labelActionData.dataSourceID = this.labelActionData.dataSourceID;
        //             labelActionData.value = this.labelActionData.value;
        //             labelActionData.type = this.labelActionData.type;
        //             labelActionData.index = this.labelActionData.index;
        //             labelActionData.isDelete = !this.labelActionData.isActive;
        //             labelActionData.width = this.labelActionData.width;
        //             labelActionData.height = this.labelActionData.height;

        //             // this.labelActionService.insertOrUpdateWidgetItemAction(labelActionData).subscribe((res: any) => {
        //             //     if (res.code == "Success") {
        //             //         this.notify.success(this.l('Successfully'));
        //             //     }
        //             //     else if (res.code == "Error") {
        //             //         this.notify.error(res.message);
        //             //     }
        //             // })
        //         }
        //     }
        //     this.back();
        // }
    }

    back(): void {
        this.router.navigateByUrl('/app/main/dynamicreport/report/viewer-utility/DSWIDGETITEMACT/WIDGETITEMACTION');
    }

    setUpEditorOption() {
        const self = this;
        this.actionTypeOption = {
            dataSource: self.dataType,
            displayExpr: 'name',
            valueExpr: 'id',
            readOnly: self.ReadOnly,
            onValueChanged: function (e) {
                if (e.value == "SHOWCOMPONENT") {
                    self.isLink = false;
                    self.isStore = false;
                    self.isComponent = false;
                    self.detailForm.instance.itemOption("value", "editorType", "dxSelectBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly,
                        editorType: "dxSelectBox",
                        dataSource: self.viewDefinition.ComponentViewDefinitions,
                        displayExpr: 'name',
                        valueExpr: 'code',
                        searchEnabled: 'true'
                    }
                } else if (e.value == "LINK") {
                    self.isLink = true;
                    self.isStore = false;
                    self.isComponent = false;
                    self.detailForm.instance.itemOption("value", "editorType", "dxTextBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly
                    }
                }
                else if (e.value == "HYPERLINK") {
                    self.isLink = false;
                    self.isStore = false;
                    self.isComponent = false;
                    self.detailForm.instance.itemOption("value", "editorType", "dxTextBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly
                    }
                } else if (e.value == "STORE") {
                    self.isLink = false;
                    self.isStore = true;
                    self.isComponent = false;
                    self.detailForm.instance.itemOption("value", "editorType", "dxTextBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly
                    }
                } else {
                    self.isLink = false;
                    self.isStore = false;
                    self.isComponent = true;
                    self.detailForm.instance.itemOption("value", "editorType", "dxTextBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly
                    }
                }
            }
        }
    }
}
