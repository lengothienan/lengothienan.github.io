import { Component, OnInit, EventEmitter, Output, ViewChild, Injector, Input, Inject, Optional } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ModalDirective } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LabelActionServiceProxy, HIN_DashboardsServiceProxy, API_BASE_URL, CreateOrUpdateActionInput, CreateOrUpdateLabelActionInput, DRDataSourceServiceProxy } from '@shared/service-proxies/service-proxies';
import { DxFormComponent } from 'devextreme-angular';
import { ViewerUtilityConfigurationService } from '../dynamic-report/viewer/viewer-utility/viewer-utility-configuration.service';

@Component({
    selector: 'ConfigLabelAction',
    templateUrl: './config-label-action.component.html'
})

export class ConfigLabelActionComponent extends AppComponentBase {

    @ViewChild('detailForm', { static: true }) detailForm: DxFormComponent;

    Name: any = "";
    labelActionData: any;
    dataActionName: any;
    dataGroup: any;
    dataAction: any;
    dataType: any = [{
        id: "LINK",
        name: "Đường dẫn"
    }, {
        id: "HYPERLINK",
        name: "HyperLink"
    }, {
        id: "STORE",
        name: "Store"
    }, {
        id: "STOREANDREDIRECT",
        name: "Call Store và redirect đường dẫn"
    },
    {
        id: "EXPORTFORM",
        name: "Xuất file form trên report"
    }, {
        id: "SAVEANDREDIRECT",
        name: "Lưu form và redirect đường dẫn"
    }, {
        id: "SAVEFORM",
        name: "Lưu form"
    }, {
        id: "EXPORTFILE",
        name: "Export form file"
    }, {
        id: "SHOWCOMPONENT",
        name: "Màn hình"
    }, {
        id: "POPUPFORM",
        name: "Form Popup"
    }, {
        id: "API",
        name: "API"
    }, {
        id: "API_EXPORT",
        name: "Export file"
    }, {
        id: "IMPORT",
        name: "Import file"
    }, {
        id: "EXPORT_EXCEL",
        name: "Export excel"
    }, {
        id: "WORD",
        name: "Export Word"
    }, {
        id: "EXPORTMULTIPLE_WORD",
        name: "Xuất file hàng loạt"
    }, {
        id: "DIGITALSIGN",
        name: "Ký số"
    }, {
        id: "MULTIPLE_DIGITALSIGN",
        name: "Ký số hàng loạt"
    }, {
        id: "GROUPLABEL",
        name: "Group Label Action"
    }, {
        id: "IMPORT_FILEEXCEL",
        name: "Import File Excel"
    }];

    methodAPI: any = [{
        id: "GET",
        name: "GET"
    }, {
        id: "POST",
        name: "POST"
    }, {
        id: "DELETE",
        name: "DELETE"
    }];

    labelActionId: number;
    addCheck = false;
    editCheck = false;
    ReadOnly = false;
    isLink = false;
    isConfirm = false;
    isStore = false;
    isComponent = false;
    isAPI = false;
    isAPI_Export = false;
    isImport = false;
    isImportExcel = false;
    saveBtnVisible = true;
    currentUserId = this.appSession.userId;
    actionTypeOption: any;
    valueOption: any = {
        editorType: "dxTextBox",
        readOnly: this.ReadOnly
    };
    comeBackLinkOption: any;

    private baseUrl: string;
    DBdataSrc: any;


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

        this.labelActionService.getLabelCode().subscribe((res: any) => {
            if (res.code == "Success") {
                self.dataActionName = res.data;
            }
            else if (res.code == "Error") {
                self.notify.error(res.message);
            }
        })
        this.labelActionService.listDataGroupLabel().subscribe((res: any) => {
            self.dataGroup = res;
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
                this.labelActionService.getLabelActionById(this.labelActionId).subscribe((res: any) => {
                    if (res.code == "Success") {
                        self.labelActionData = res.data[0];
                        if (res.data[0].type == 'API') {
                            var obj = JSON.parse(res.data[0].value);
                            self.labelActionData.method = obj.method
                            self.labelActionData.api = obj.api;
                            self.labelActionData.formdata = obj.formdata.replaceAll('`', '"').replaceAll(',', ',\n');
                        }
                        console.log('labelActionData');
                        console.log(self.labelActionData);
                    }
                    else if (res.code == "Error") {
                        self.notify.error(res.message);
                    }
                })

                this.editCheck = true;
            } else {
                this.Name = "Thêm mới Label Action";
                this.addCheck = true;
                this.labelActionData =
                {
                    labelCode: "",
                    actionId: null,
                    value: "",
                    type: null,
                    dataSourceID: 0,
                    index: 0,
                    height: 0,
                    width: 0,
                    isDelete: false,
                    isActive: true,
                    method: "",
                    api: "",
                    formdata: "{}"
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
        if (result.isValid) {
            if (this.addCheck) {
                var labelActionData = new CreateOrUpdateLabelActionInput();
                labelActionData.id = -1;
                labelActionData.labelCode = this.labelActionData.labelCode;
                labelActionData.actionId = this.labelActionData.actionId;
                labelActionData.value = this.labelActionData.value;
                labelActionData.type = this.labelActionData.type;
                labelActionData.index = this.labelActionData.index;
                labelActionData.isDelete = !this.labelActionData.isActive;
                labelActionData.isTop = this.labelActionData.isTop;
                labelActionData.isChooseData = this.labelActionData.isChooseData;
                labelActionData.dataSourceID = this.labelActionData.dataSourceID;
                labelActionData.height = this.labelActionData.height;
                labelActionData.urlImportFile = this.labelActionData.urlImportFile;
                labelActionData.width = this.labelActionData.width;
                labelActionData.fileTypeAccept = this.labelActionData.fileTypeAccept;
                labelActionData.isGroup = this.labelActionData.isGroup;
                labelActionData.idGroup = this.labelActionData.idGroup;
                labelActionData.confirmButtonText = this.labelActionData.confirmButtonText;
                labelActionData.confirmText = this.labelActionData.confirmText;
                labelActionData.confirmTitle = this.labelActionData.confirmTitle;
                labelActionData.isPopupConfirm = this.labelActionData.isPopupConfirm;

                if (this.labelActionData.type == 'API') {
                    labelActionData.value = '{ "method" : "' + this.labelActionData.method + '", "api":"' + this.labelActionData.api + '", "formdata":"' + this.labelActionData.formdata.replaceAll('"', '`').replaceAll('\n', '') + '"}'
                }

                this.labelActionService.insertOrUpdateLabelAction(labelActionData).subscribe((res: any) => {
                    if (res.code == "Success") {
                        this.notify.success(this.l('Successfully'));
                    }
                    else if (res.code == "Error") {
                        this.notify.error(res.message);
                    }
                })

            } else if (this.editCheck) {
                if (this.labelActionId != null) {
                    var labelActionData = new CreateOrUpdateLabelActionInput();
                    labelActionData.id = this.labelActionId;
                    labelActionData.labelCode = this.labelActionData.labelCode;
                    labelActionData.actionId = this.labelActionData.actionId;
                    labelActionData.value = this.labelActionData.value;
                    labelActionData.type = this.labelActionData.type;
                    labelActionData.index = this.labelActionData.index;
                    labelActionData.isDelete = !this.labelActionData.isActive;
                    labelActionData.urlImportFile = this.labelActionData.urlImportFile;
                    labelActionData.isTop = this.labelActionData.isTop;
                    labelActionData.isChooseData = this.labelActionData.isChooseData;
                    labelActionData.dataSourceID = this.labelActionData.dataSourceID;
                    labelActionData.height = this.labelActionData.height;
                    labelActionData.width = this.labelActionData.width;
                    labelActionData.isGroup = this.labelActionData.isGroup;
                    labelActionData.idGroup = this.labelActionData.idGroup;
                    labelActionData.confirmButtonText = this.labelActionData.confirmButtonText;
                    labelActionData.confirmText = this.labelActionData.confirmText;
                    labelActionData.confirmTitle = this.labelActionData.confirmTitle;
                    labelActionData.isPopupConfirm = this.labelActionData.isPopupConfirm;

                    if (this.labelActionData.type == 'API') {
                        labelActionData.value = '{ "method" : "' + this.labelActionData.method + '", "api":"' + this.labelActionData.api + '", "formdata":"' + this.labelActionData.formdata.replaceAll('"', '`').replaceAll('\n', '') + '"}'
                    }

                    this.labelActionService.insertOrUpdateLabelAction(labelActionData).subscribe((res: any) => {
                        if (res.code == "Success") {
                            this.notify.success(this.l('Successfully'));
                        }
                        else if (res.code == "Error") {
                            this.notify.error(res.message);
                        }
                    })
                }
            }
            this.back();
        }
    }

    back(): void {
        this.router.navigateByUrl('/app/main/dynamicreport/report/viewer-utility/DSLABELACT/LABELACTION');
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
                    self.isConfirm = false;
                    self.isLink = false;
                    self.isStore = false;
                    self.isComponent = true;
                    self.isAPI = false;
                    self.isAPI_Export = false;
                    self.isImport = false;
                    self.detailForm.instance.itemOption("value", "editorType", "dxSelectBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly,
                        editorType: "dxSelectBox",
                        dataSource: self.viewDefinition.ComponentViewDefinitions,
                        displayExpr: 'name',
                        valueExpr: 'code',
                        searchEnabled: 'true'
                    }
                }
                else if (e.value == "LINK") {
                    self.isConfirm = false;
                    self.isLink = true;
                    self.isStore = false;
                    self.isImportExcel = false;
                    self.isComponent = false;
                    self.isAPI = false;
                    self.isAPI_Export = false;
                    self.isImport = false;
                    self.detailForm.instance.itemOption("value", "editorType", "dxTextBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly
                    }
                } else if (e.value == "POPUPFORM") {
                    self.isConfirm = false;
                    self.isLink = true;
                    self.isStore = false;
                    self.isComponent = true;
                    self.isAPI = false;
                    self.isAPI_Export = false;
                    self.isImportExcel = false;
                    self.isImport = false;
                    self.detailForm.instance.itemOption("value", "editorType", "dxTextBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly
                    }
                }
                else if (e.value == "HYPERLINK") {
                    self.isConfirm = false;
                    self.isLink = false;
                    self.isStore = false;
                    self.isComponent = false;
                    self.isAPI = false;
                    self.isImportExcel = false;
                    self.isAPI_Export = false;
                    self.isImport = false;
                    self.detailForm.instance.itemOption("value", "editorType", "dxTextBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly
                    }
                } else if (e.value == "STORE") {
                    self.isConfirm = true;
                    self.isLink = false;
                    self.isStore = true;
                    self.isComponent = false;
                    self.isImportExcel = false;
                    self.isAPI = false;
                    self.isAPI_Export = false;
                    self.isImport = false;
                    self.detailForm.instance.itemOption("value", "editorType", "dxTextBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly
                    }
                } else if (e.value == "STOREANDREDIRECT") {
                    self.isConfirm = true;
                    self.isLink = false;
                    self.isStore = true;
                    self.isImportExcel = false;
                    self.isComponent = false;
                    self.isAPI = false;
                    self.isAPI_Export = false;
                    self.isImport = false;
                    self.detailForm.instance.itemOption("value", "editorType", "dxTextBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly
                    }
                } else if (e.value == "API") {
                    self.isConfirm = false;
                    self.isLink = false;
                    self.isStore = false;
                    self.isComponent = false;
                    self.isAPI = true;
                    self.isAPI_Export = false;
                    self.isImportExcel = false;
                    self.isImport = false;
                    self.detailForm.instance.itemOption("value", "editorType", "dxTextBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly
                    }
                } else if (e.value == "API_EXPORT") {
                    self.isConfirm = false;
                    self.isLink = false;
                    self.isStore = false;
                    self.isComponent = false;
                    self.isAPI = false;
                    self.isAPI_Export = true;
                    self.isImportExcel = false;
                    self.isImport = false;
                    self.detailForm.instance.itemOption("value", "editorType", "dxTextBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly
                    }
                } else if (e.value == "IMPORT") {
                    self.isConfirm = false;
                    self.isLink = false;
                    self.isStore = false;
                    self.isComponent = false;
                    self.isAPI = false;
                    self.isImportExcel = false;
                    self.isAPI_Export = false;
                    self.isImport = true;
                    self.detailForm.instance.itemOption("value", "editorType", "dxTextBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly
                    }
                } else if (e.value == "IMPORT_FILEEXCEL") {
                    self.isConfirm = false;
                    self.isLink = false;
                    self.isStore = false;
                    self.isComponent = false;
                    self.isAPI = false;
                    self.isAPI_Export = false;
                    self.isImport = true;
                    self.isImportExcel = true;
                    self.detailForm.instance.itemOption("value", "editorType", "dxTextBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly
                    }
                } else {
                    self.isConfirm = false;
                    self.isImportExcel = false;
                    self.isLink = false;
                    self.isStore = false;
                    self.isComponent = false;
                    self.isAPI = false;
                    self.isAPI_Export = false;
                    self.isImport = false;
                    self.detailForm.instance.itemOption("value", "editorType", "dxTextBox");
                    self.valueOption = {
                        readOnly: self.ReadOnly
                    }
                }
            }
        }
    }
}
