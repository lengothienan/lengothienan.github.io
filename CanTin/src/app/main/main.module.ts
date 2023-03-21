import { ReportViewPlanComponent } from './dynamic-report/viewer-plan/viewer-plan-component';
import { ReportViewGanttComponent } from './dynamic-report/viewer-gantt/viewer-gantt-component';
import { YKienChiDaoVBComponent } from './qlvb/documentReceive/van-ban-den-tu-cac-doi/yKienChiDaoVB.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TemplatesComponent } from './management/templates/templates.component';
import { ViewTemplateModalComponent } from './management/templates/view-template-modal.component';
import { CreateOrEditTemplateModalComponent } from './management/templates/create-or-edit-template-modal.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { CA_OutDocumentHandlingDetailsComponent } from './qlvb/cA_OutDocumentHandlingDetails/cA_OutDocumentHandlingDetails.component';
import { ViewCA_OutDocumentHandlingDetailModalComponent } from './qlvb/cA_OutDocumentHandlingDetails/view-cA_OutDocumentHandlingDetail-modal.component';
import { CreateOrEditCA_OutDocumentHandlingDetailModalComponent } from './qlvb/cA_OutDocumentHandlingDetails/create-or-edit-cA_OutDocumentHandlingDetail-modal.component';

import { CA_OutDocumentHandlingsComponent } from './qlvb/cA_OutDocumentHandlings/cA_OutDocumentHandlings.component';
import { ViewCA_OutDocumentHandlingModalComponent } from './qlvb/cA_OutDocumentHandlings/view-cA_OutDocumentHandling-modal.component';
import { CreateOrEditCA_OutDocumentHandlingModalComponent } from './qlvb/cA_OutDocumentHandlings/create-or-edit-cA_OutDocumentHandling-modal.component';



import { ODocsComponent } from './qlvb/oDocs/oDocs.component';
import { ViewODocModalComponent } from './qlvb/oDocs/view-oDoc-modal.component';
import { CreateOrEditODocModalComponent } from './qlvb/oDocs/create-or-edit-oDoc-modal.component';

import { PublishOrgsComponent } from './qlvb/publishOrgs/publishOrgs.component';
import { CreateOrEditPublishOrgModalComponent } from './qlvb/publishOrgs/create-or-edit-publishOrg-modal.component';

import { OrgLevelsComponent } from './qlvb/orgLevels/orgLevels.component';
import { CreateOrEditOrgLevelModalComponent } from './qlvb/orgLevels/create-or-edit-orgLevel-modal.component';

import { ImpersonatesComponent } from './management/impersonates/impersonates.component';
import { CreateOrEditImpersonateModalComponent } from './management/impersonates/create-or-edit-impersonate-modal.component';

import { HardDatasourceGroupsComponent } from './qlvb/hardDatasourceGroups/hardDatasourceGroups.component';
import { ViewHardDatasourceGroupModalComponent } from './qlvb/hardDatasourceGroups/view-hardDatasourceGroup-modal.component';
import { CreateOrEditHardDatasourceGroupModalComponent } from './qlvb/hardDatasourceGroups/create-or-edit-hardDatasourceGroup-modal.component';

import { DynamicCategoryRowIndexesComponent } from './management/dynamicCategoryRowIndexes/dynamicCategoryRowIndexes.component';
import { ViewDynamicCategoryRowIndexModalComponent } from './management/dynamicCategoryRowIndexes/view-dynamicCategoryRowIndex-modal.component';
import { CreateOrEditDynamicCategoryRowIndexModalComponent } from './management/dynamicCategoryRowIndexes/create-or-edit-dynamicCategoryRowIndex-modal.component';

import { Comm_Book_SyntaxesComponent } from './qlvb/comm_Book_Syntaxes/comm_Book_Syntaxes.component';
import { ViewComm_Book_SyntaxModalComponent } from './qlvb/comm_Book_Syntaxes/view-comm_Book_Syntax-modal.component';
import { CreateOrEditComm_Book_SyntaxModalComponent } from './qlvb/comm_Book_Syntaxes/create-or-edit-comm_Book_Syntax-modal.component';

import { Comm_Book_ValuesComponent } from './qlvb/comm_Book_Values/comm_Book_Values.component';
import { ViewComm_Book_ValueModalComponent } from './qlvb/comm_Book_Values/view-comm_Book_Value-modal.component';
import { CreateOrEditComm_Book_ValueModalComponent } from './qlvb/comm_Book_Values/create-or-edit-comm_Book_Value-modal.component';

import { Comm_booksComponent } from './qlvb/comm_books/comm_books.component';
import { ViewComm_bookModalComponent } from './qlvb/comm_books/view-comm_book-modal.component';
import { CreateOrEditComm_bookModalComponent } from './qlvb/comm_books/create-or-edit-comm_book-modal.component';

import { StoreDatasourcesComponent } from './qlvb/storeDatasources/storeDatasources.component';
import { ViewStoreDatasourceModalComponent } from './qlvb/storeDatasources/view-storeDatasource-modal.component';
import { CreateOrEditStoreDatasourceModalComponent } from './qlvb/storeDatasources/create-or-edit-storeDatasource-modal.component';

import { HardDatasourcesComponent } from './qlvb/hardDatasources/hardDatasources.component';
import { ViewHardDatasourceModalComponent } from './qlvb/hardDatasources/view-hardDatasource-modal.component';
import { CreateOrEditHardDatasourceModalComponent } from './qlvb/hardDatasources/create-or-edit-hardDatasource-modal.component';

import { CommandDatasourcesComponent } from './qlvb/commandDatasources/commandDatasources.component';
import { ViewCommandDatasourceModalComponent } from './qlvb/commandDatasources/view-commandDatasource-modal.component';
import { CreateOrEditCommandDatasourceModalComponent } from './qlvb/commandDatasources/create-or-edit-commandDatasource-modal.component';

import { DynamicDatasourceComponent } from './qlvb/dynamicDatasource/dynamicDatasource.component';
import { ViewDynamicDatasourceModalComponent } from './qlvb/dynamicDatasource/view-dynamicDatasource-modal.component';
import { CreateOrEditDynamicDatasourceModalComponent } from './qlvb/dynamicDatasource/create-or-edit-dynamicDatasource-modal.component';


import { DynamicValuesComponent } from './qlvb/dynamicValues/dynamicValues.component';
import { ViewDynamicValueModalComponent } from './qlvb/dynamicValues/view-dynamicValue-modal.component';
import { CreateOrEditDynamicValueModalComponent } from './qlvb/dynamicValues/create-or-edit-dynamicValue-modal.component';

import { DynamicFieldsComponent } from './qlvb/dynamicFields/dynamicFields.component';
import { ViewDynamicFieldModalComponent } from './qlvb/dynamicFields/view-dynamicField-modal.component';
import { CreateOrEditDynamicFieldModalComponent } from './qlvb/dynamicFields/create-or-edit-dynamicField-modal.component';

import { SqlStoreParamsComponent } from './management/sqlStoreParams/sqlStoreParams.component';
import { ViewSqlStoreParamModalComponent } from './management/sqlStoreParams/view-sqlStoreParam-modal.component';
import { CreateOrEditSqlStoreParamModalComponent } from './management/sqlStoreParams/create-or-edit-sqlStoreParam-modal.component';

import { SqlConfigDetailsComponent } from './management/sqlConfigDetails/sqlConfigDetails.component';
import { ViewSqlConfigDetailModalComponent } from './management/sqlConfigDetails/view-sqlConfigDetail-modal.component';
import { CreateOrEditSqlConfigDetailModalComponent } from './management/sqlConfigDetails/create-or-edit-sqlConfigDetail-modal.component';

import { SqlConfigsComponent } from './management/sqlConfigs/sqlConfigs.component';
import { ViewSqlConfigModalComponent } from './management/sqlConfigs/view-sqlConfig-modal.component';
import { CreateOrEditSqlConfigModalComponent } from './management/sqlConfigs/create-or-edit-sqlConfig-modal.component';

import { VanbansComponent } from './qlvb/vanbans/vanbans.component';
import { FileManagerModalComponent } from './qlvb/vanbans/file-manager-modal.component';
import {  CreateOrEditVanbanComponent } from './qlvb/vanbans/create_edit_vanban/create-or-edit-vanban';



import { SchedulesComponent } from './qlvb/schedules/schedules.component';
import { ViewScheduleModalComponent } from './qlvb/schedules/view-schedule-modal.component';
import { CreateOrEditScheduleModalComponent } from './qlvb/schedules/create-or-edit-schedule-modal.component';

import { PromulgatedsComponent } from './qlvb/promulgateds/promulgateds.component';
import { ViewPromulgatedModalComponent } from './qlvb/promulgateds/view-promulgated-modal.component';
import { CreateOrEditPromulgatedModalComponent } from './qlvb/promulgateds/create-or-edit-promulgated-modal.component';

import { ReceiveUnitsComponent } from './qlvb/receiveUnits/receiveUnits.component';
import { ViewReceiveUnitModalComponent } from './qlvb/receiveUnits/view-receiveUnit-modal.component';
import { CreateOrEditReceiveUnitModalComponent } from './qlvb/receiveUnits/create-or-edit-receiveUnit-modal.component';


import { WorkDetailsComponent } from './qlvb/workDetails/workDetails.component';
import { ViewWorkDetailModalComponent } from './qlvb/workDetails/view-workDetail-modal.component';
import { CreateOrEditWorkDetailModalComponent } from './qlvb/workDetails/create-or-edit-workDetail-modal.component';

import { WordProcessingsComponent } from './qlvb/wordProcessings/wordProcessings.component';
import { ViewWordProcessingModalComponent } from './qlvb/wordProcessings/view-wordProcessing-modal.component';
import { CreateOrEditWordProcessingModalComponent } from './qlvb/wordProcessings/create-or-edit-wordProcessing-modal.component';

import { WorkAssignsComponent } from './qlvb/workAssigns/workAssigns.component';
import { ViewWorkAssignModalComponent } from './qlvb/workAssigns/view-workAssign-modal.component';
import { CreateOrEditWorkAssignModalComponent } from './qlvb/workAssigns/create-or-edit-workAssign-modal.component';

import { DocumentTypesComponent } from './qlvb/documentTypes/documentTypes.component';
import { ViewDocumentTypeModalComponent } from './qlvb/documentTypes/view-documentType-modal.component';
import { CreateOrEditDocumentTypeModalComponent } from './qlvb/documentTypes/create-or-edit-documentType-modal.component';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { EditorModule } from 'primeng/editor'
import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from "primeng/treetable";

import { UtilsModule } from '@shared/utils/utils.module';
import { CountoModule } from 'angular2-counto';
import { ModalModule, TabsModule, TooltipModule, BsDropdownModule, PopoverModule } from 'ngx-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainRoutingModule } from './main-routing.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BsDatepickerModule, BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxBootstrapDatePickerConfigService } from 'assets/ngx-bootstrap/ngx-bootstrap-datepicker-config.service';
import { ModifySqlConfigDetailsComponent } from './management/sqlConfigDetails/modify-sqlConfigDetails.component';
import { CreateNewIncommingDocumentComponent } from './qlvb/documentReceive/create-document/create-new-incomming-document';
import { BrowserModule } from '@angular/platform-browser';
import { VanbanInDayModalComponent } from './qlvb/vanbans/vanban-in-day/vanban-in-day-modal';
import { ReceptionOfTheDayModalComponent } from './qlvb/vanbans/reception-of-the-day/reception-of-the-day-modal';
import { ProcessingDocumnetModalComponent } from './qlvb/vanbans/process-document/processing-documnet-modal';
import { DetailIncommingDocumentModalComponent } from './qlvb/documentReceive/detail-document/detail-incomming-document-modal';
import { ViewDetailVanbanComponent } from './qlvb/vanbans/view_detail/view-detail-vanban';
import { ConfigDatasourceComponent } from './dynamic-report/config-datasource/config-datasource.component';
import { DatasourceNewComponent } from './dynamic-report/datasource-new/datasource-new.component';
import { ReportEditComponent } from './dynamic-report/editor/editor.component';
import {
    DxTextAreaModule,
    DxMenuModule,
    DxNumberBoxModule,
    DxDataGridModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxProgressBarModule,
    DxPopupModule,
    DxTemplateModule,
    DxDateBoxModule,
    DxHtmlEditorModule,
    DxToolbarModule,
    DxButtonGroupModule,
    DxResizableModule,
    DxFileUploaderModule,
    DxTagBoxModule,
    DxListModule,
    DxScrollViewModule,
    DxTreeViewModule,
    DxContextMenuModule,
 
    DxPopoverModule,
    DxDropDownBoxModule,
    DxFormModule,
    DxFileManagerModule,
    DxSchedulerModule,
    DxSankeyModule,
    DxTreeListModule,
    DxLookupModule,
    DxGanttModule,
    DxValidationGroupModule,
    DxValidationSummaryModule,
    DxValidatorModule,
    DxSpeedDialActionModule,
    DxDropDownButtonModule,
    DxSwitchModule,
    DxRadioGroupModule,
    DxTabPanelModule,
    DxChartModule,
    DxPieChartModule,
    DxLoadPanelModule
} from 'devextreme-angular';
import { CreateGroupDynamicFieldComponent } from './qlvb/dynamicFields/create-groupDynamicField.component';
import { EditGroupDynamicFieldComponent } from './qlvb/dynamicFields/edit-groupDynamicField.component';
import { CreateEditMemorize_KeywordsesModal } from './qlvb/memorize_Keywordses/create-edit-memorize_Keywordses-modal';
import {Memorize_KeywordsesComponent} from '@app/main/qlvb/memorize_Keywordses/memorize_Keywordses';
import {ViewMemorize_KeywordsModal} from '@app/main/qlvb/memorize_Keywordses/view-memorize_Keywords-modal';
import {CreateOrEditTextBookModalComponent} from '@app/main/qlvb/textBooks/create-or-edit-textBook-modal';
import {ReceiveModalComponent} from '@app/main/qlvb/documentReceive/receive/receive-modal.component';
import {List_document_receviceModal} from '@app/main/qlvb/documentReceive/list_document_recevice/list_document_recevice.modal';
import {DocumentStatusesComponent} from '@app/main/qlvb/documentStatuses/documentStatuses.component';
import {Lich_su_uploadModalComponent} from '@app/main/qlvb/lich_su_upload/lich_su_upload-modal';

import {ChuyenvanbandenComponent} from '@app/main/qlvb/documentReceive/chuyenvanban/chuyenvanbanden';
// import {ThongBaoVanBanComponent} from '@app/main/qlvb/documentReceive/HienThi/thong-bao-van-ban';
import {ViewDocumentStatusModalComponent} from '@app/main/qlvb/documentStatuses/view-documentStatus-modal.component';
import {CreateOrEditDocumentStatusModalComponent} from '@app/main/qlvb/documentStatuses/create-or-edit-documentStatus-modal.component';
import {TransferDocumentComponent} from '@app/main/qlvb/documentReceive/transfer-document/transfer-document';
import {TypeHandlesComponent} from '@app/main/qlvb/typeHandles/typeHandles.component';
import {ViewTypeHandeModalComponent} from '@app/main/qlvb/typeHandles/view-typeHandle-modal.component';
import {CreateOrEditTypeHandleModalComponent} from '@app/main/qlvb/typeHandles/create-or-edit-typeHandle-modal.component';
import { LichCongViecComponent } from './qlvb/lichCongViec/lichCongViec';
import { ListAllDynamicFieldComponent } from './qlvb/dynamicFields/list-all-groupDynamicField.component';
import { TextBooksComponent } from './qlvb/textBooks/textBooks';
import { ExecuteLabelSQLComponent } from './qlvb/executeLabelSQL/executeLabelSQL.component';
import { ListAllButtonUIComponent } from '@app/shared/common/buttonUI/list-all-buttonUI';

import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { EditButtonUIComponent } from '@app/shared/common/buttonUI/edit-buttonUI';
import { PrioritiesComponent } from './qlvb/priorities/priorities.component';
import { ViewPriorityModalComponent } from './qlvb/priorities/view-priority-modal.component';
import { CreateOrEditPriorityModalComponent } from './qlvb/priorities/create-or-edit-priority-modal.component';
import { KeywordDetailsComponent } from './qlvb/keywordDetails/keywordDetails.component';
import { CreateOrEditKeywordDetailModalComponent } from './qlvb/keywordDetails/create-or-edit-keywordDetail-modal.component';
import { ViewTextBookModalComponent } from './qlvb/textBooks/view-textBook-modal';
import { ReportDocumentModalComponent } from './qlvb/report_document/report-document-modal';

import { TreeModule } from 'primeng/tree';
import { EditIncommingDocumentComponent } from './qlvb/documentReceive/create-document/edit-incomming-document';
import { ViewIncommingDocumentComponent } from './qlvb/documentReceive/create-document/view-incomming-document';
import { SearchDocumentComponent } from './qlvb/search-document/search-document.component';
import { PrintBookDocumentComponent } from './qlvb/print-book-documents/print-book-document.component';
import { SoDenTheoPhongComponent } from './qlvb/documentReceive/vanthuphong/so-den-theo-phong/so-den-theo-phong.component';
import { DanhSachTheoPhongComponent } from './qlvb/documentReceive/vanthuphong/danh-sach-theo-phong/danh-sach-theo-phong.component';
import { ChuaTrinhChiHuyPhongComponent } from './qlvb/documentReceive/vanthuphong/chua-trinh-CH-phong/chua-trinh-CH-phong.component';
import { DaTrinhChiHuyPhongComponent } from './qlvb/documentReceive/vanthuphong/da-trinh-CH-phong/da-trinh-CH-phong.component';
import { ChuaPhanXuLyPhongComponent } from './qlvb/documentReceive/chi-huy-phong/chua-phan-xu-ly/chua-phan-xu-ly-phong.component';
import { DaPhanXuLyPhongComponent } from './qlvb/documentReceive/chi-huy-phong/da-phan-xu-ly/da-phan-xu-ly-phong.component';
import { ChuaPhanXuLyDoiTruongComponent } from './qlvb/documentReceive/doi-truong/chua-phan-xu-ly-doi-truong/chua-phan-xu-ly-doi-truong.component';
import { DaPhanXuLyDoiTruongComponent } from './qlvb/documentReceive/doi-truong/da-phan-xu-ly-doi-truong/da-phan-xu-ly-doi-truong.component';
import { ChuaPhanXuLyDoiPhoComponent } from './qlvb/documentReceive/doi-pho/chua-phan-xu-ly-doi-pho/chua-phan-xu-ly-doi-pho.component';
import { DaPhanXuLyDoiPhoComponent } from './qlvb/documentReceive/doi-pho/da-phan-xu-ly-doi-pho/da-phan-xu-ly-doi-truong.component';
import { ChuaPhanXuLyToTruongComponent } from './qlvb/documentReceive/to-truong/chua-phan-xu-ly-to-truong/chua-phan-xu-ly-to-truong.component';
import { DaPhanXuLyToTruongComponent } from './qlvb/documentReceive/to-truong/da-phan-xu-ly-to-truong/da-phan-xu-ly-to-truong.component';
import { DynamicCategoryComponent } from './management/dynamicCategory/dynamicCategory.component';
import { CreateOrEditDynamicCategoryModalComponent } from './management/dynamicCategory/create-or-edit-dynamicCategory-modal.component';
import { ViewDocumentComponent } from './qlvb/documentReceive/view-document/view-document.component';
import { ChuaXuLyComponent } from './qlvb/documentReceive/can-bo-chien-si/chua-xu-ly/chua-xu-ly.component';
import { DaXuLyComponent } from './qlvb/documentReceive/can-bo-chien-si/da-xu-ly/da-xu-ly.component';
import { ThemMoiVBDiComponent } from './qlvb/outcom-document/them-moi-vb-du-thao/them-moi-vb-du-thao.component';
import { ThemMoiVaChoSoComponent } from './qlvb/outcom-document/them-moi-va-cho-so/them-moi-va-cho-so.component';
import { DanhSachVBChoChoSoComponent } from './qlvb/outcom-document/danh-sach-vb-cho-cho-so/danh-sach-vb-cho-cho-so.component';
import { DanhSachVBChoPhatHanhComponent } from './qlvb/outcom-document/danh-sach-vb-cho-phat-hanh/danh-sach-vb-cho-phat-hanh.component';
import { DanhSachVBDuThaoComponent } from './qlvb/outcom-document/danh-sach-vb-du-thao/danh-sach-vb-du-thao.component';
import { HardForDynamicDatasourcesComponent } from './qlvb/hardDatasources/hardForDynamicDatasources.component';
import { DanhSachVBChoPheDuyetComponent } from './qlvb/outcom-document/danh-sach-vb-cho-phe-duyet/danh-sach-vb-cho-phe-duyet.component';
import { DanhSachVBDaPheDuyetComponent } from './qlvb/outcom-document/danh-sach-vb-da-phe-duyet/danh-sach-vb-da-phe-duyet.component';
import { TraCuuVBDiComponent } from './qlvb/outcom-document/tra-cuu-vb-di/tra-cuu-vb-di';
import { DanhSachVBKhongDuyetComponent } from './qlvb/outcom-document/danh-sach-vb-khong-duyet/danh-sach-vb-khong-duyet.component';
import { DanhSachVBDaPhatHanhComponent } from './qlvb/outcom-document/danh-sach-vb-da-phat-hanh/danh-sach-vb-da-phat-hanh.component';
import { DataHardDatasourceGroupModalComponent } from './qlvb/hardDatasourceGroups/data-hardDatasourceGroup-modal.component';
import { TraCuuVBDiCaNhanComponent } from './qlvb/outcom-document/tra-cuu-vb-di-ca-nhan/tra-cuu-vb-di-ca-nhan';
import { ThemMoiVBDiNewComponent } from './qlvb/outcom-document/them-moi-vb-di/them-moi-vb-di.component';
import { DanhSachVBChuyenDaPhatHanhComponent } from './qlvb/outcom-document/danh-sach-vb-chuyen-da-phat-hanh-catp/danh-sach-vb-chuyen-da-phat-hanh.component';
import { DanhSachVBChuaChoSoComponent } from './qlvb/outcom-document/danh-sach-vb-chua-cho-so/danh-sach-vb-chua-cho-so.component';
import { DanhSachVBDaChoSoComponent } from './qlvb/outcom-document/danh-sach-vb-da-cho-so/danh-sach-vb-da-cho-so.component';
import { TraCuuVBDiCATPComponent } from './qlvb/outcom-document/tra-cuu-vb-di-catp/tra-cuu-vb-di-catp';
import { SuaVBDenPhongComponent } from './qlvb/documentReceive/truong-phong/them-moi-vb-phong/sua-vb-phong.component';
import { ThemMoiVBDenPhongComponent } from './qlvb/documentReceive/truong-phong/them-moi-vb-phong/them-moi-vb-phong.component';
import { XemVBDenPhongComponent } from './qlvb/documentReceive/truong-phong/them-moi-vb-phong/xem-vb-phong.component';
import { TiepNhanVBDenPhongComponent } from './qlvb/documentReceive/truong-phong/tiep-nhan-vb-den-phong/tiep-nhan-vb-den-phong.component';
import { ChuaPhanCongXuLyPhongComponent } from './qlvb/documentReceive/truong-phong/chua-phan-cong-xu-ly/chua-phan-cong-xu-ly-phong.component';
import { DaPhanCongXuLyPhongComponent } from './qlvb/documentReceive/truong-phong/da-phan-cong-xu-ly/da-phan-cong-xu-ly-phong.component';
import { TraCuuVBPhongComponent } from './qlvb/documentReceive/tra-cuu-vb-phong/tra-cuu-vb-phong.component';
import {  ChuaXuLyPhoPhongComponent } from './qlvb/documentReceive/pho-phong/chua-xu-ly/chua-xu-ly-phong.component';
import {  DaXuLyPhoPhongComponent } from './qlvb/documentReceive/pho-phong/da-xu-ly/da-xu-ly-phong.component';
import { ChuaLuuTruComponent } from './qlvb/outcom-document/can-bo-luu-tru/chua-luu-tru/chua-luu-tru.component';
import { DaLuuTruComponent } from './qlvb/outcom-document/can-bo-luu-tru/da-luu-tru/da-luu-tru.component';
import { TraCuuVBDiPhongComponent } from './qlvb/outcom-document/tra-cuu-vb-di-phong/tra-cuu-vb-di-phong';
import { SearchComponent } from './dynamic-report/report/search/search.component';
import { AddComponent } from './dynamic-report/report/add/add.component';
import { ReportFilterComponent } from './dynamic-report/report-filter/search/search.component';
import { AddReportFilterComponent } from './dynamic-report/report-filter/add/add.component';
import { ReportLockupComponent } from './dynamic-report/lockup/lockup-component';
import { AddLookupComponent } from './dynamic-report/lockup/add-lookup/add-component';
import { DatasourceComponent } from './dynamic-report/datasource/datasource-component';
import { ReportServiceComponent } from './dynamic-report/service/service-component';
import { ReportViewComponent } from './dynamic-report/viewer/viewer-component';
import { ReportDetailComponent } from './dynamic-report/detail/detail-component';
import { EditExtraIDocComponent } from './qlvb/documentReceive/create-document/edit-extra-idoc';
import { DocumentHaveNumberExistsComponent } from './qlvb/documentReceive/create-document/documentHaveNumberExists.component';
import { CreatePublisherComponent } from './documentHelper/createPublisher.component';
import { CreateOutcommingDocumentComponent } from './qlvb/oDocs/create-outcomming-document';
import { EditOutcommingDocumentComponent } from './qlvb/oDocs/edit-outcomming-document';
import { ViewOutcommingDocumentComponent } from './qlvb/oDocs/view-outcomming-document';
import { SearchResponseDocumentModalComponent } from './qlvb/oDocs/search-response-document/search';
import { LuuTruVanBanDiComponent } from './qlvb/outcom-document/can-bo-luu-tru/luu-tru/cap-nhat-luu-tru.component';
import { CreateDocumentDenPhongComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/create-Document.component';
import { EditDocumentDenPhongComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/sua-vb-phong.component';
import { ViewDocumentDenPhongComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/xem-vb-phong.component';
import { XemVanBanDaChoSoComponent } from './qlvb/outcom-document/xem-vb-da-cho-so/xem-vb-da-cho-so';
import { VBNoiKhacChuaTrinhComponent } from './qlvb/documentReceive/vanthuphong/vb-noi-khac/vb-noi-khac-chua-trinh.component';
import { YKienChiDaoComponent } from './documentHelper/yKienChiDao.component';
import { VBCATPDenPhongChuaTrinh } from './qlvb/documentReceive/vanthuphong/vb-catp/vb-phong-chua-trinh/vb-phong-chua-trinh.component';
import { VBNoiKhacDaTrinhComponent } from './qlvb/documentReceive/vanthuphong/vb-noi-khac/vb-noi-khac-da-trinh.component';
import { TiepNhanTuCATPComponent } from './qlvb/documentReceive/vanthuphong/vb-catp/them-moi-vb-catp/them-moi-vb-catp';
import { XemTiepNhanTuCATPComponent } from './qlvb/documentReceive/vanthuphong/vb-catp/them-moi-vb-catp/xem-vb-catp';
import { CreateReceiverComponent } from './documentHelper/createReceiver.component';
import { YKienChiDaoTeamComponent } from './documentHelper/yKienChiDaoTeam.component';
import { DanhSachVBChuaPhucDapComponent } from './qlvb/outcom-document/danh-sach-vb-chua-phuc-dap/danh-sach-vb-chua-phuc-dap';
import { VBCATPDenPhongDaTrinh } from './qlvb/documentReceive/vanthuphong/vb-catp/vb-phong-da-trinh/vb-phong-da-trinh.component';
import { VanBanTheoDoiComponent } from './documentHelper/van-ban-theo-doi/van-ban-theo-doi';
import { UserExtentionServiceProxy } from '@shared/service-proxies/service-proxies';
import { VanBanTheoDoiDaXuLyComponent } from './documentHelper/van-ban-theo-doi-da-xu-ly/van-ban-theo-doi-da-xu-ly';
import { VanBanTheoDoiCaNhanComponent } from './documentHelper/danh-sach-theo-doi-ca-nhan/danh-sach-theo-doi-ca-nhan';
import { VanBanTheoBCHComponent } from './documentHelper/danh-sach-theo-bch-doi/danh-sach-theo-bch-doi';
import { EditDocumentDenPhongExtraComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/sua-vb-phong-extra.component';
import { VanBanTheoDoiTruongDaXuLyComponent } from './documentHelper/van-ban-theo-doi-truong-da-xu-ly/van-ban-theo-doi-truong-da-xu-ly';
import { DanhSachVBChuaPhucDapCuaDonViTuCATPComponent } from './qlvb/outcom-document/danh-sach-vb-chua-phuc-dap-cua-don-vi/tu-catp/danh-sach-vb-chua-phuc-dap-cua-donvi-tu-catp';
import { DanhSachVBChuaPhucDapCuaDonViTuDonViKhacComponent } from './qlvb/outcom-document/danh-sach-vb-chua-phuc-dap-cua-don-vi/tu-dv-khac/danh-sach-vb-chua-phuc-dap-cua-donvi-tu-donvi-khac';
import { DanhSachVBDaPhatHanhDonviGuiDonViKhacComponent } from './qlvb/outcom-document/danh-sach-vb-da-phat-hanh-don-vi/don-vi-khac-phat-hanh/don-vi-khac-phat-hanh.component';
import { SearchDocumentDonViModalComponent } from './qlvb/outcom-document/them-moi-vb-phat-hanh-cbcs/search-response-document/search';
import { ThemMoiPhatHanhChuyenVTDonViComponent } from './qlvb/outcom-document/them-moi-vb-phat-hanh-cbcs/chuyen-van-thu-don-vi/chuyen-van-thu-don-vi';
import { DanhSachVBChuaPhucDapCuaDDoiTuCATPComponent } from './qlvb/outcom-document/danh-sach-vb-chua-phuc-dap-cua-doi/tu-catp/danh-sach-vb-chua-phuc-dap-cua-doi-tu-catp';
import { DanhSachVBChuaPhucDapCuaDoiTuDonViKhacComponent } from './qlvb/outcom-document/danh-sach-vb-chua-phuc-dap-cua-doi/tu-don-vi-khac/danh-sach-vb-chua-phuc-dap-cua-doi-tu-donvi-khac';
import { DanhSachVBDiCuaDoiChoPhatHanhComponent } from './qlvb/outcom-document/danh-sach-vb-di-cua-doi-cho-phat-hanh/danh-sach-vb-di-cua-doi-cho-phat-hanh.component';
import { ThemMoiVBDiChuyenVTCATPComponent } from './qlvb/outcom-document/them-moi-vb-phat-hanh-cbcs/chuyen-vtcatp-phat-hanh/chuyen-vtcatp-phat-hanh';
import { HinCustomizableDashboardComponent } from './hin-portal/customizable-hin-dashboard/customizable-hin-dashboard.component';
import { HinDashboardComponent } from './hin-portal/hin-dashboard/hin-dashboard.component';
import { AddHinWidgetModalComponent } from './hin-portal/add-widget-modal/add-widget-modal.component';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
// import { WidgetSimpleItemPercentCircleComponent } from '@app/shared/common/customizable-dashboard/widgets/widget-simple-item-percent-circle/widget-simple-item-percent-circle.component';
// import { WidgetSimpleItemPercentComponent } from '@app/shared/common/customizable-dashboard/widgets/widget-simple-item-percent/widget-simple-item-percent.component';
import { ThemMoiVanBanNoiBoComponent } from './qlvb/outcom-document/them-moi-vb-phat-hanh-cbcs/them-moi-vb-noi-bo/them-moi-vb-noi-bo';
import { DanhSachVBDiNoiBoComponent } from './qlvb/outcom-document/danh-sach-vb-di-noi-bo/danh-sach-vb-di-noi-bo';
import { XemVanBanNoiBoComponent } from './qlvb/outcom-document/them-moi-vb-phat-hanh-cbcs/them-moi-vb-noi-bo/xem-vb-noi-bo';
import { EditDocumentDenDoiComponent } from './qlvb/documentReceive/doi-truong/chi-tiet-vb-den-doi/sua-vb-den-doi';
import { ViewDocumentDenDoiComponent } from './qlvb/documentReceive/doi-truong/chi-tiet-vb-den-doi/xem-vb-den-doi';
import { SearchDocumentNoiBoModalComponent } from './documentHelper/search-idoc-noi-bo/search';
import { ThemMoiVBDiChuyenThayCATPComponent } from './qlvb/outcom-document/phat-hanh-vb-di (duong tat)/gui-catp/gui-catp.component';
import { ThemMoiVBDiChuyenThayVTDVComponent } from './qlvb/outcom-document/phat-hanh-vb-di (duong tat)/dv-khac/gui-dv-khac.component';
import { VBDenTuCacDoi_ChuaPhanXuLyComponent } from './qlvb/documentReceive/van-ban-den-tu-cac-doi/chua-phan-xu-ly/chua-phan-xu-ly.component';
import { VBDenTuCacDoi_DaPhanXuLyComponent } from './qlvb/documentReceive/van-ban-den-tu-cac-doi/da-phan-xu-ly/da-phan-xu-ly.component';
import { CreateDocumentLocalComponent } from './qlvb/documentReceive/doi-truong/them-moi-van-ban-den-noi-bo/create-Document.component';
import { KetQuaCongTacPhongComponent } from './qlkh-cv/popup/ket-qua-cong-tac-phong/ket-qua-cong-tac-phong.component';
import { KetQuaCongTacDoiComponent } from './qlkh-cv/popup/ket-qua-cong-tac-doi/ket-qua-cong-tac-doi.component';
import { ChiTietPhanCongNVComponent } from './qlkh-cv/popup/chi-tiet-phan-cong-nv/chi-tiet-phan-cong-nv.component';
import { ThemKeHoachComponent } from './qlkh-cv/them-ke-hoach/them-ke-hoach.component';
import { BaoCaoKetQuaComponent } from './qlkh-cv/popup/bao-cao-ket-qua/bao-cao-ket-qua.component';
import { SuaVbDiComponent } from './qlvb/outcom-document/sua-vb-di/sua-vb-di.component';
import { ChiTietTraCuuVanBanCuComponent } from './qlvb/tra-cuu-van-ban-cu/tra-cuu-van-ban-cu.component';
import { ExecuteLabelSQL_LLComponent } from './qlvb/executeLabelSQL-LazyLoading/executeLabelSQL_LL.component';
import { VBPHCATPDenPhongChuaTrinh } from './qlvb/documentReceive/vanthuphong/vb-catp/vb-phoihop-phong-chua-trinh/vb-phoihop-phong-chua-trinh.component';
import { YKienChiDaoPHComponent } from './documentHelper/yKienChiDaoPH.component';
import { VBCATPDenPhongPHDaTrinh } from './qlvb/documentReceive/vanthuphong/vb-catp/vb-phong-ph-da-trinh/vb-phong-ph-da-trinh.component';
import { ChuaPhanXuLyPHDoiTruongComponent } from './qlvb/documentReceive/doi-truong/chua-phan-xu-ly-ph-doi-truong/chua-phan-xu-ly-ph-doi-truong.component';
import { DaPhanXuLyPHDoiTruongComponent } from './qlvb/documentReceive/doi-truong/da-phan-xu-ly-ph-doi-truong/da-phan-xu-ly-ph-doi-truong.component';
import { YKienChiDaoTeamPHComponent } from './documentHelper/yKienChiDaoTeamPH.component';
import { DaXuLyPHComponent } from './qlvb/documentReceive/can-bo-chien-si/da-xu-ly-ph/da-xu-ly-ph.component';
import { ChuaXuLyPHComponent } from './qlvb/documentReceive/can-bo-chien-si/chua-xu-ly-ph/chua-xu-ly-ph.component';
import { ViewDocumentDenPhongPHComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/xem-vb-phong-ph.component';
import { EditDocumentDenPhongPHExtraComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/sua-vb-phong-ph-extra.component';
import { DanhSachVBChuaPhatHanhDonviGuiDonViKhacComponent } from './qlvb/outcom-document/danh-sach-vb-chua-phat-hanh-don-vi/don-vi-khac-phat-hanh/don-vi-khac-phat-hanh.component';
import { GroupReceiverComponent } from './qlvb/group-receiver/group-receiver.component';
import { VbPhoihopPhongComponent } from './qlvb/documentReceive/vanthuphong/vb-catp/vb-phoihop-phong/vb-phoihop-phong.component';
import { VbPhoihopDoiComponent } from './qlvb/documentReceive/doi-truong/vb-phoihop-doi/vb-phoihop-doi.component';
import { VbPhoihopCbcsComponent } from './qlvb/documentReceive/can-bo-chien-si/vb-phoihop-cbcs/vb-phoihop-cbcs.component';
import { VbPhoiHopDoiChuaPhanXuLyDoiTruongComponent } from './qlvb/documentReceive/doi-truong/vb-phoi-hop-doi-chua-phan-xu-ly-doi-truong/vb-phoi-hop-doi-chua-phan-xu-ly-doi-truong.component'
import { VbPhoiHopDoiDaPhanXuLyDoiTruongComponent } from './qlvb/documentReceive/doi-truong/vb-phoi-hop-doi-da-phan-xu-ly-doi-truong/vb-phoi-hop-doi-da-phan-xu-ly-doi-truong.component'
import { EditDocumentDenDoiPHComponent } from './qlvb/documentReceive/doi-truong/chi-tiet-vb-den-doi/sua-vb-den-doi-ph';
import { ViewDocumentDenDoiPHComponent } from './qlvb/documentReceive/doi-truong/chi-tiet-vb-den-doi/xem-vb-den-doi-ph';
// import { UploadFileComponent } from '@app/admin/management/uploadFile/upload-modal';
// import { ScheduleComponent } from './qlvb/schedule/schedule.component';
import { IconPickerModule } from 'ngx-icon-picker';
import { VbPhoiHopPhongChuaTrinhComponent } from './qlvb/documentReceive/vanthuphong/vb-phoi-hop-phong/vb-phoi-hop-phong-chua-trinh/vb-phoi-hop-phong-chua-trinh.component';
import { VbPhoiHopPhongDaTrinhComponent } from './qlvb/documentReceive/vanthuphong/vb-phoi-hop-phong/vb-phoi-hop-phong-da-trinh/vb-phoi-hop-phong-da-trinh.component';
import {VbPhoiHopCbcsChuaXuLyComponent} from './qlvb/documentReceive/can-bo-chien-si/vb-phoi-hop-cbcs-chua-xu-ly/vb-phoi-hop-cbcs-chua-xu-ly.component'
import {VbPhoiHopCbcsDaXuLyComponent} from './qlvb/documentReceive/can-bo-chien-si/vb-phoi-hop-cbcs-da-xu-ly/vb-phoi-hop-cbcs-da-xu-ly.component'
import { ViewDocumentDenPhongPhoiHopComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/xem-vb-phong-phoi-hop.component';
import { YKienChiDaoPhoiHopComponent} from './documentHelper/yKienChiDaoPhoiHop.component';
import { ViewDocumentDenDoiPhoiHopComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/xem-vb-doi-phoi-hop.component';
import { ReportViewUtilityComponent } from './dynamic-report/viewer/viewer-utility/viewer-utility-component';
import { ConfigActionComponent } from './config-label-action/config-action.component';
import { ConfigLabelActionComponent } from './config-label-action/config-label-action.component';
import { ConfigWidgetItemActionComponent  } from './config-label-action/config-widget-item-action.component';
NgxBootstrapDatePickerConfigService.registerNgxBootstrapDatePickerLocales();

@NgModule({
    imports: [
        DxSwitchModule,
        DxSankeyModule,
        FileUploadModule,
        AutoCompleteModule,
        PaginatorModule,
        EditorModule,
        InputMaskModule,
        TableModule,
        TreeTableModule,
        DxTextAreaModule,
        DxMenuModule,
        DxDataGridModule,
        DxButtonModule,
        DxCheckBoxModule,
        DxSelectBoxModule,
        DxTextBoxModule,
        DxProgressBarModule,
        DxPopupModule,
        DxTemplateModule,
        DxDateBoxModule,
        DxHtmlEditorModule,
        DxToolbarModule,
        DxButtonGroupModule,
        DxResizableModule,
        DxFileUploaderModule,
        DxSpeedDialActionModule,
        DxTagBoxModule,
        DxListModule,
        DxScrollViewModule,
        DxSchedulerModule,
        DxTreeViewModule,
        DxContextMenuModule,
        DxPopoverModule,
        DxDropDownBoxModule,
        DxFormModule,
        DxFileManagerModule,
        DxLookupModule,
        PaginatorModule,
        DxDropDownButtonModule,
        CommonModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        MainRoutingModule,
        TreeModule,
        CountoModule,
        NgxChartsModule,
        DxValidationGroupModule,
        DxValidationSummaryModule,
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        PopoverModule.forRoot(),
        DxTreeListModule,
        DxValidatorModule,
        DxValidationGroupModule,
        DxValidationSummaryModule,
        DxNumberBoxModule,
        DxRadioGroupModule,		DxTabPanelModule,
        DxChartModule,
        DxPieChartModule,
        ReactiveFormsModule,
        GridsterModule,
        DynamicModule.withComponents([HinDashboardComponent]),
        PerfectScrollbarModule,
        DxPieChartModule,
        DxGanttModule,
        DxDropDownBoxModule,
        DxTreeViewModule,
        DxFileManagerModule,
        DxLoadPanelModule,
        IconPickerModule
    ],
    declarations: [
		TemplatesComponent,
		ViewTemplateModalComponent,		
        CreateOrEditTemplateModalComponent,
        VanBanTheoDoiTruongDaXuLyComponent,
        EditDocumentDenPhongExtraComponent,
        EditDocumentDenPhongPHExtraComponent,
        VBCATPDenPhongChuaTrinh,
        VBPHCATPDenPhongChuaTrinh,
        YKienChiDaoTeamComponent,
        YKienChiDaoTeamPHComponent,
        VBNoiKhacDaTrinhComponent,
        YKienChiDaoComponent,
        YKienChiDaoPHComponent,
        VBCATPDenPhongDaTrinh,
        VBCATPDenPhongPHDaTrinh,
        VBNoiKhacChuaTrinhComponent,
        EditDocumentDenPhongComponent,
        ViewDocumentDenPhongComponent,
        ViewDocumentDenPhongPHComponent,
        CreateDocumentDenPhongComponent,
        LuuTruVanBanDiComponent,
		CA_OutDocumentHandlingDetailsComponent,
		ViewCA_OutDocumentHandlingDetailModalComponent,		CreateOrEditCA_OutDocumentHandlingDetailModalComponent,
		CA_OutDocumentHandlingsComponent,
		ViewCA_OutDocumentHandlingModalComponent,		CreateOrEditCA_OutDocumentHandlingModalComponent,
        EditOutcommingDocumentComponent,
        ViewOutcommingDocumentComponent,
        CreateOutcommingDocumentComponent,
		ODocsComponent,
		ViewODocModalComponent,		CreateOrEditODocModalComponent,
        CreatePublisherComponent,
        DocumentHaveNumberExistsComponent,
		PublishOrgsComponent,
		CreateOrEditPublishOrgModalComponent,
		OrgLevelsComponent,
		CreateOrEditOrgLevelModalComponent,
        TraCuuVBDiCATPComponent,
        DanhSachVBChuaChoSoComponent,
        DanhSachVBDaChoSoComponent,
        DanhSachVBChuyenDaPhatHanhComponent,
        ThemMoiVBDiNewComponent,
        TraCuuVBDiCaNhanComponent,
        DataHardDatasourceGroupModalComponent,
        HardDatasourceGroupsComponent,
		ViewHardDatasourceGroupModalComponent,		CreateOrEditHardDatasourceGroupModalComponent,
		ImpersonatesComponent,
		CreateOrEditImpersonateModalComponent,
        HardForDynamicDatasourcesComponent,
		DynamicCategoryRowIndexesComponent,
		ViewDynamicCategoryRowIndexModalComponent,		CreateOrEditDynamicCategoryRowIndexModalComponent,
        DynamicCategoryComponent,
        CreateOrEditDynamicCategoryModalComponent,
		// CA_Comm_booksComponent,
		// ViewCA_Comm_bookModalComponent,		CreateOrEditCA_Comm_bookModalComponent,
		Comm_Book_SyntaxesComponent,
		ViewComm_Book_SyntaxModalComponent,		CreateOrEditComm_Book_SyntaxModalComponent,
		Comm_Book_ValuesComponent,
		ViewComm_Book_ValueModalComponent,		CreateOrEditComm_Book_ValueModalComponent,
		Comm_booksComponent,
		ViewComm_bookModalComponent,		CreateOrEditComm_bookModalComponent,
		StoreDatasourcesComponent,      ListAllDynamicFieldComponent,
		// DocumentHandlingDetailsComponent,
		// CreateOrEditDocumentHandlingDetailModalComponent,
		StoreDatasourcesComponent,
		ViewStoreDatasourceModalComponent,		CreateOrEditStoreDatasourceModalComponent,
		HardDatasourcesComponent,
		ViewHardDatasourceModalComponent,		CreateOrEditHardDatasourceModalComponent,
		CommandDatasourcesComponent,
		ViewCommandDatasourceModalComponent,		CreateOrEditCommandDatasourceModalComponent,
		EditGroupDynamicFieldComponent,
		CreateGroupDynamicFieldComponent,
		DynamicDatasourceComponent,
		ViewDynamicDatasourceModalComponent,		CreateOrEditDynamicDatasourceModalComponent,
		ViewDynamicValueModalComponent,		CreateOrEditDynamicValueModalComponent,
		DynamicValuesComponent,
		ViewDynamicValueModalComponent,		CreateOrEditDynamicValueModalComponent,
		DynamicFieldsComponent,
		ViewDynamicFieldModalComponent,		CreateOrEditDynamicFieldModalComponent,
		SqlStoreParamsComponent,
		ViewSqlStoreParamModalComponent,		CreateOrEditSqlStoreParamModalComponent,
		ModifySqlConfigDetailsComponent,
		SqlConfigDetailsComponent,
		ViewSqlConfigDetailModalComponent,		CreateOrEditSqlConfigDetailModalComponent,
		SqlConfigsComponent,
		ViewSqlConfigModalComponent,		CreateOrEditSqlConfigModalComponent,

		// DocumentHandlingsComponent,
		// ViewDocumentHandlingModalComponent,

		// 	CreateOrEditDocumentHandlingModalComponent,
		VanbansComponent,

		FileManagerModalComponent,
		SchedulesComponent,
		ViewScheduleModalComponent,		CreateOrEditScheduleModalComponent,
		PromulgatedsComponent,
		ViewPromulgatedModalComponent,
		CreateOrEditPromulgatedModalComponent,
		ReceiveUnitsComponent,
		ViewReceiveUnitModalComponent,		CreateOrEditReceiveUnitModalComponent,
		TypeHandlesComponent,
		ViewTypeHandeModalComponent,		CreateOrEditTypeHandleModalComponent,
		// DocumentHandlingDetailsComponent,
		// ViewDocumentHandlingDetailModalComponent,		CreateOrEditDocumentHandlingDetailModalComponent,
		// MemorizeKeywordsComponent,
		// ViewMemorizeKeywordModalComponent,		CreateOrEditMemorizeKeywordModalComponent,
		WorkDetailsComponent,
		ViewWorkDetailModalComponent,		CreateOrEditWorkDetailModalComponent,
		WordProcessingsComponent,
		ViewWordProcessingModalComponent,		CreateOrEditWordProcessingModalComponent,
		WorkAssignsComponent,
		ViewWorkAssignModalComponent,		CreateOrEditWorkAssignModalComponent,
		DocumentTypesComponent,
		ViewDocumentTypeModalComponent,		CreateOrEditDocumentTypeModalComponent,
		// DocumentsesComponent,
		// ViewDocumentsModalComponent,		CreateOrEditDocumentsModalComponent,
		DashboardComponent,
        CreateNewIncommingDocumentComponent,
        EditIncommingDocumentComponent,
        ViewIncommingDocumentComponent,
        EditExtraIDocComponent,
		// ReceiveComponent,
		// UpdateProgressModalComponent ,
		// TransferHandleModalComponent,
		// ReminderListModalComponent,
		// CreateEditReminderListModalComponent,
        // NotSubmittedToLeadershipModalComponent,
		VanbanInDayModalComponent,
		ReceptionOfTheDayModalComponent,
		ProcessingDocumnetModalComponent,
		DetailIncommingDocumentModalComponent,
		CreateOrEditVanbanComponent,
        ConfigDatasourceComponent,
		CreateEditMemorize_KeywordsesModal,
		ViewDetailVanbanComponent,
		Memorize_KeywordsesComponent,
		ViewMemorize_KeywordsModal,
		CreateOrEditTextBookModalComponent,
		ReceiveModalComponent,
		List_document_receviceModal,
		// ThongBaoVanBanComponent,
		ChuyenvanbandenComponent,
        Lich_su_uploadModalComponent,
		DocumentStatusesComponent,
		ViewDocumentStatusModalComponent,
		CreateOrEditDocumentStatusModalComponent,
        TransferDocumentComponent,
        LichCongViecComponent,
        TextBooksComponent,
        ExecuteLabelSQLComponent,
        ExecuteLabelSQL_LLComponent,
        ListAllButtonUIComponent,
        ViewDocumentComponent, ChuaXuLyComponent, ChuaXuLyPHComponent, DaXuLyComponent, DaXuLyPHComponent,
        SoDenTheoPhongComponent, DanhSachTheoPhongComponent, ChuaTrinhChiHuyPhongComponent, DaTrinhChiHuyPhongComponent,
        ChuaPhanXuLyPhongComponent, DaPhanXuLyPhongComponent, ChuaPhanXuLyDoiTruongComponent, ChuaPhanXuLyPHDoiTruongComponent, DaPhanXuLyDoiTruongComponent, DaPhanXuLyPHDoiTruongComponent,
        ChuaPhanXuLyDoiPhoComponent, DaPhanXuLyDoiPhoComponent, ChuaPhanXuLyToTruongComponent, DaPhanXuLyToTruongComponent,
        DanhSachVBChoPheDuyetComponent,DanhSachVBDaPheDuyetComponent,TraCuuVBDiComponent,DanhSachVBKhongDuyetComponent,
        // TransferHandleDirectorModalComponent,
        // TransferHandleDepartmentVanThuModalComponent,
        // UploadFileComponent,
        // TransferHandleDepartmentComponent,
        // transferHandleDiretorComponent,
        // TransferHandleTeamComponent ,
        // TransferHandleDepartmentModalComponent,
        // TransferHandleViceCaptainModal,
        // TransferHandleNestModal,
        // TransferHandleOfficerModal,
        // TransferHandleHeadDepartmentComponent,
        ReportDocumentModalComponent,
        ButtonUIComponent,
        EditButtonUIComponent,
        PrioritiesComponent, ViewPriorityModalComponent, CreateOrEditPriorityModalComponent
        ,KeywordDetailsComponent, CreateOrEditKeywordDetailModalComponent, ViewTextBookModalComponent,
        SearchDocumentComponent, PrintBookDocumentComponent,
        ThemMoiVBDiComponent, ThemMoiVaChoSoComponent, DanhSachVBChoChoSoComponent, DanhSachVBChoPhatHanhComponent, DanhSachVBDuThaoComponent, DanhSachVBDaPhatHanhComponent,
        SuaVBDenPhongComponent, ThemMoiVBDenPhongComponent , XemVBDenPhongComponent, TiepNhanVBDenPhongComponent,
        ChuaPhanCongXuLyPhongComponent, DaPhanCongXuLyPhongComponent,
        TraCuuVBPhongComponent,
        ChuaXuLyPhoPhongComponent, DaXuLyPhoPhongComponent,
        ChuaLuuTruComponent, DaLuuTruComponent,
        TraCuuVBDiPhongComponent,
        // Dynamic report component
        ReportEditComponent,
        DatasourceNewComponent,
        SearchComponent,
        AddComponent,
        ReportFilterComponent,
        AddReportFilterComponent,
        ReportLockupComponent,
        AddLookupComponent,
        DatasourceComponent,
        ReportServiceComponent,
        ReportViewComponent,
        ReportDetailComponent,
        SearchResponseDocumentModalComponent, XemVanBanDaChoSoComponent,
        TiepNhanTuCATPComponent, XemTiepNhanTuCATPComponent, CreateReceiverComponent,
		VanBanTheoDoiComponent,
        DanhSachVBChuaPhucDapComponent, VanBanTheoDoiDaXuLyComponent, VanBanTheoDoiCaNhanComponent, VanBanTheoBCHComponent,
        DanhSachVBChuaPhucDapCuaDonViTuCATPComponent,DanhSachVBChuaPhucDapCuaDonViTuDonViKhacComponent,
        SearchDocumentDonViModalComponent, ThemMoiPhatHanhChuyenVTDonViComponent,
        DanhSachVBDaPhatHanhDonviGuiDonViKhacComponent,
        DanhSachVBChuaPhatHanhDonviGuiDonViKhacComponent,
        DanhSachVBChuaPhucDapCuaDDoiTuCATPComponent,

        DanhSachVBChuaPhucDapCuaDoiTuDonViKhacComponent, ThemMoiVBDiChuyenVTCATPComponent,
        DanhSachVBDiCuaDoiChoPhatHanhComponent,
        DanhSachVBChuaPhucDapCuaDoiTuDonViKhacComponent,
        ReportViewUtilityComponent,

        //Dashboards
        HinDashboardComponent,
        HinCustomizableDashboardComponent,
        AddHinWidgetModalComponent,
        // WidgetSimpleItemPercentCircleComponent,
        // WidgetSimpleItemPercentComponent,
        ThemMoiVanBanNoiBoComponent,
        DanhSachVBDiNoiBoComponent,
        XemVanBanNoiBoComponent,
        EditDocumentDenDoiComponent,
        ViewDocumentDenDoiComponent,
        ViewDocumentDenDoiPHComponent,
        SearchDocumentNoiBoModalComponent,
        ThemMoiVBDiChuyenThayCATPComponent,
        ThemMoiVBDiChuyenThayVTDVComponent,
        CreateDocumentLocalComponent,
        VBDenTuCacDoi_ChuaPhanXuLyComponent,
        VBDenTuCacDoi_DaPhanXuLyComponent,
        YKienChiDaoVBComponent,
        ReportViewPlanComponent,
        ReportViewGanttComponent,
        KetQuaCongTacPhongComponent,
        KetQuaCongTacDoiComponent,
        ChiTietPhanCongNVComponent,
        ThemKeHoachComponent,
        BaoCaoKetQuaComponent,
        SuaVbDiComponent,
        ChiTietTraCuuVanBanCuComponent
,
        GroupReceiverComponent
,
        VbPhoihopPhongComponent
,
        VbPhoihopDoiComponent ,
        VbPhoiHopPhongChuaTrinhComponent ,
        VbPhoiHopPhongDaTrinhComponent ,
        VbPhoihopCbcsComponent,
        VbPhoiHopDoiChuaPhanXuLyDoiTruongComponent,
        VbPhoiHopDoiDaPhanXuLyDoiTruongComponent,
        ViewDocumentDenPhongPhoiHopComponent,
        YKienChiDaoPhoiHopComponent,
        EditDocumentDenDoiPHComponent,
        ViewDocumentDenDoiPhoiHopComponent,
        VbPhoiHopCbcsChuaXuLyComponent,
        VbPhoiHopCbcsDaXuLyComponent,
        ConfigLabelActionComponent,
        ConfigWidgetItemActionComponent,
        ConfigActionComponent
    ],
    providers: [
        UserExtentionServiceProxy,
        { provide: BsDatepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerConfig },
        { provide: BsDaterangepickerConfig, useFactory: NgxBootstrapDatePickerConfigService.getDaterangepickerConfig },
        { provide: BsLocaleService, useFactory: NgxBootstrapDatePickerConfigService.getDatepickerLocale }
    ]
})
export class MainModule { }










