import { ThemKeHoachComponent } from './qlkh-cv/them-ke-hoach/them-ke-hoach.component';
import { ReportViewPlanComponent } from './dynamic-report/viewer-plan/viewer-plan-component';
import { TemplatesComponent } from './management/templates/templates.component';
import { ReportViewGanttComponent } from './dynamic-report/viewer-gantt/viewer-gantt-component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CA_OutDocumentHandlingDetailsComponent } from './qlvb/cA_OutDocumentHandlingDetails/cA_OutDocumentHandlingDetails.component';
import { CA_OutDocumentHandlingsComponent } from './qlvb/cA_OutDocumentHandlings/cA_OutDocumentHandlings.component';
import { ODocsComponent } from './qlvb/oDocs/oDocs.component';
import { PublishOrgsComponent } from './qlvb/publishOrgs/publishOrgs.component';
import { OrgLevelsComponent } from './qlvb/orgLevels/orgLevels.component';
import { ImpersonatesComponent } from './management/impersonates/impersonates.component';
import { HardDatasourceGroupsComponent } from './qlvb/hardDatasourceGroups/hardDatasourceGroups.component';
import { DynamicCategoryRowIndexesComponent } from './management/dynamicCategoryRowIndexes/dynamicCategoryRowIndexes.component';
import { Comm_Book_SyntaxesComponent } from './qlvb/comm_Book_Syntaxes/comm_Book_Syntaxes.component';
import { Comm_Book_ValuesComponent } from './qlvb/comm_Book_Values/comm_Book_Values.component';
import { Comm_booksComponent } from './qlvb/comm_books/comm_books.component';
import { DynamicDatasourceComponent } from './qlvb/dynamicDatasource/dynamicDatasource.component';
import { DynamicValuesComponent } from './qlvb/dynamicValues/dynamicValues.component';
import { DynamicFieldsComponent } from './qlvb/dynamicFields/dynamicFields.component';
import { SqlStoreParamsComponent } from './management/sqlStoreParams/sqlStoreParams.component';
import { SqlConfigDetailsComponent } from './management/sqlConfigDetails/sqlConfigDetails.component';
import { SqlConfigsComponent } from './management/sqlConfigs/sqlConfigs.component';
import { VanbansComponent } from './qlvb/vanbans/vanbans.component';
import { SchedulesComponent } from './qlvb/schedules/schedules.component';
import { PromulgatedsComponent } from './qlvb/promulgateds/promulgateds.component';
import { ReceiveUnitsComponent } from './qlvb/receiveUnits/receiveUnits.component';
import { TypeHandlesComponent } from './qlvb/typeHandles/typeHandles.component';
import { WorkDetailsComponent } from './qlvb/workDetails/workDetails.component';
import { WordProcessingsComponent } from './qlvb/wordProcessings/wordProcessings.component';
import { WorkAssignsComponent } from './qlvb/workAssigns/workAssigns.component';
import { DocumentTypesComponent } from './qlvb/documentTypes/documentTypes.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ModifySqlConfigDetailsComponent } from './management/sqlConfigDetails/modify-sqlConfigDetails.component';
import { CreateNewIncommingDocumentComponent } from './qlvb/documentReceive/create-document/create-new-incomming-document';

import { ProcessingDocumnetModalComponent } from './qlvb/vanbans/process-document/processing-documnet-modal';
import { DetailIncommingDocumentModalComponent } from './qlvb/documentReceive/detail-document/detail-incomming-document-modal';
import { ViewDetailVanbanComponent } from './qlvb/vanbans/view_detail/view-detail-vanban';
import {StoreDatasourcesComponent} from '@app/main/qlvb/storeDatasources/storeDatasources.component';
import {ReceiveModalComponent} from '@app/main/qlvb/documentReceive/receive/receive-modal.component';
import {HardDatasourcesComponent} from '@app/main/qlvb/hardDatasources/hardDatasources.component';
import {Lich_su_uploadModalComponent} from '@app/main/qlvb/lich_su_upload/lich_su_upload-modal';
import {CommandDatasourcesComponent} from '@app/main/qlvb/commandDatasources/commandDatasources.component';
import {List_document_receviceModal} from '@app/main/qlvb/documentReceive/list_document_recevice/list_document_recevice.modal';
import {ViewMemorize_KeywordsModal} from '@app/main/qlvb/memorize_Keywordses/view-memorize_Keywords-modal';
import {EditGroupDynamicFieldComponent} from '@app/main/qlvb/dynamicFields/edit-groupDynamicField.component';
import {CreateGroupDynamicFieldComponent} from '@app/main/qlvb/dynamicFields/create-groupDynamicField.component';
import {TransferDocumentComponent} from '@app/main/qlvb/documentReceive/transfer-document/transfer-document';
// import {ThongBaoVanBanComponent} from '@app/main/qlvb/documentReceive/HienThi/thong-bao-van-ban';
import {ChuyenvanbandenComponent} from '@app/main/qlvb/documentReceive/chuyenvanban/chuyenvanbanden';
import {CreateOrEditVanbanComponent} from '@app/main/qlvb/vanbans/create_edit_vanban/create-or-edit-vanban';
import { LichCongViecComponent } from './qlvb/lichCongViec/lichCongViec';
import { DocumentStatusesComponent } from './qlvb/documentStatuses/documentStatuses.component';
import { Memorize_KeywordsesComponent } from './qlvb/memorize_Keywordses/memorize_Keywordses';
import { ListAllDynamicFieldComponent } from './qlvb/dynamicFields/list-all-groupDynamicField.component';
import { TextBooksComponent } from './qlvb/textBooks/textBooks';
import { ExecuteLabelSQLComponent } from './qlvb/executeLabelSQL/executeLabelSQL.component';

import { ListAllButtonUIComponent } from '@app/shared/common/buttonUI/list-all-buttonUI';

import { ButtonUIComponent } from '@app/shared/common/buttonUI/button-UI';
import { ReportDocumentModalComponent } from './qlvb/report_document/report-document-modal';
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
import { SearchComponent } from './dynamic-report/report/search/search.component';
import { AddComponent } from './dynamic-report/report/add/add.component';
import { ReportFilterComponent } from './dynamic-report/report-filter/search/search.component';
import { AddReportFilterComponent } from './dynamic-report/report-filter/add/add.component';
import { ReportLockupComponent } from './dynamic-report/lockup/lockup-component';
import { ReportServiceComponent } from './dynamic-report/service/service-component';
import { ReportViewComponent } from './dynamic-report/viewer/viewer-component';
import { AddLookupComponent } from './dynamic-report/lockup/add-lookup/add-component';
import { DatasourceComponent } from './dynamic-report/datasource/datasource-component';
import { TraCuuVBDiCaNhanComponent } from './qlvb/outcom-document/tra-cuu-vb-di-ca-nhan/tra-cuu-vb-di-ca-nhan';
import { ThemMoiVBDiNewComponent } from './qlvb/outcom-document/them-moi-vb-di/them-moi-vb-di.component';
import { DanhSachVBDaChoSoComponent } from './qlvb/outcom-document/danh-sach-vb-da-cho-so/danh-sach-vb-da-cho-so.component';
import { DanhSachVBChuyenDaPhatHanhComponent } from './qlvb/outcom-document/danh-sach-vb-chuyen-da-phat-hanh-catp/danh-sach-vb-chuyen-da-phat-hanh.component';
import { DanhSachVBChuaChoSoComponent } from './qlvb/outcom-document/danh-sach-vb-chua-cho-so/danh-sach-vb-chua-cho-so.component';
import { TraCuuVBDiCATPComponent } from './qlvb/outcom-document/tra-cuu-vb-di-catp/tra-cuu-vb-di-catp';
import { ThemMoiVBDenPhongComponent } from './qlvb/documentReceive/truong-phong/them-moi-vb-phong/them-moi-vb-phong.component';
import { SuaVBDenPhongComponent } from './qlvb/documentReceive/truong-phong/them-moi-vb-phong/sua-vb-phong.component';
import { XemVBDenPhongComponent } from './qlvb/documentReceive/truong-phong/them-moi-vb-phong/xem-vb-phong.component';
import { TiepNhanVBDenPhongComponent } from './qlvb/documentReceive/truong-phong/tiep-nhan-vb-den-phong/tiep-nhan-vb-den-phong.component';
import { ChuaPhanCongXuLyPhongComponent } from './qlvb/documentReceive/truong-phong/chua-phan-cong-xu-ly/chua-phan-cong-xu-ly-phong.component';
import { DaPhanCongXuLyPhongComponent } from './qlvb/documentReceive/truong-phong/da-phan-cong-xu-ly/da-phan-cong-xu-ly-phong.component';
import { TraCuuVBPhongComponent } from './qlvb/documentReceive/tra-cuu-vb-phong/tra-cuu-vb-phong.component';
import { ChuaXuLyPhoPhongComponent } from './qlvb/documentReceive/pho-phong/chua-xu-ly/chua-xu-ly-phong.component';
import { DaXuLyPhoPhongComponent } from './qlvb/documentReceive/pho-phong/da-xu-ly/da-xu-ly-phong.component';
import { ChuaLuuTruComponent } from './qlvb/outcom-document/can-bo-luu-tru/chua-luu-tru/chua-luu-tru.component';
import { DaLuuTruComponent } from './qlvb/outcom-document/can-bo-luu-tru/da-luu-tru/da-luu-tru.component';
import { TraCuuVBDiPhongComponent } from './qlvb/outcom-document/tra-cuu-vb-di-phong/tra-cuu-vb-di-phong';
import { ReportDetailComponent } from './dynamic-report/detail/detail-component';
import { EditExtraIDocComponent } from './qlvb/documentReceive/create-document/edit-extra-idoc';
import { CreateOutcommingDocumentComponent } from './qlvb/oDocs/create-outcomming-document';
import { EditOutcommingDocumentComponent } from './qlvb/oDocs/edit-outcomming-document';
import { ViewOutcommingDocumentComponent } from './qlvb/oDocs/view-outcomming-document';
import { LuuTruVanBanDiComponent } from './qlvb/outcom-document/can-bo-luu-tru/luu-tru/cap-nhat-luu-tru.component';
import { CreateDocumentDenPhongComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/create-Document.component';
import { EditDocumentDenPhongComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/sua-vb-phong.component';
import { ViewDocumentDenPhongComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/xem-vb-phong.component';
import { XemVanBanDaChoSoComponent } from './qlvb/outcom-document/xem-vb-da-cho-so/xem-vb-da-cho-so';
import { VBNoiKhacChuaTrinhComponent } from './qlvb/documentReceive/vanthuphong/vb-noi-khac/vb-noi-khac-chua-trinh.component';
import { VBNoiKhacDaTrinhComponent } from './qlvb/documentReceive/vanthuphong/vb-noi-khac/vb-noi-khac-da-trinh.component';
import { VBCATPDenPhongChuaTrinh } from './qlvb/documentReceive/vanthuphong/vb-catp/vb-phong-chua-trinh/vb-phong-chua-trinh.component';
import { TiepNhanTuCATPComponent } from './qlvb/documentReceive/vanthuphong/vb-catp/them-moi-vb-catp/them-moi-vb-catp';
import { XemTiepNhanTuCATPComponent } from './qlvb/documentReceive/vanthuphong/vb-catp/them-moi-vb-catp/xem-vb-catp';
import { DanhSachVBChuaPhucDapComponent } from './qlvb/outcom-document/danh-sach-vb-chua-phuc-dap/danh-sach-vb-chua-phuc-dap';
import { VBCATPDenPhongDaTrinh } from './qlvb/documentReceive/vanthuphong/vb-catp/vb-phong-da-trinh/vb-phong-da-trinh.component';
import { VanBanTheoDoiComponent } from './documentHelper/van-ban-theo-doi/van-ban-theo-doi';
import { VanBanTheoDoiDaXuLyComponent } from './documentHelper/van-ban-theo-doi-da-xu-ly/van-ban-theo-doi-da-xu-ly';
import { VanBanTheoDoiCaNhanComponent } from './documentHelper/danh-sach-theo-doi-ca-nhan/danh-sach-theo-doi-ca-nhan';
import { VanBanTheoBCHComponent } from './documentHelper/danh-sach-theo-bch-doi/danh-sach-theo-bch-doi';
import { EditDocumentDenPhongExtraComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/sua-vb-phong-extra.component';
import { VanBanTheoDoiTruongDaXuLyComponent } from './documentHelper/van-ban-theo-doi-truong-da-xu-ly/van-ban-theo-doi-truong-da-xu-ly';
import { DanhSachVBChuaPhucDapCuaDonViTuCATPComponent } from './qlvb/outcom-document/danh-sach-vb-chua-phuc-dap-cua-don-vi/tu-catp/danh-sach-vb-chua-phuc-dap-cua-donvi-tu-catp';
import { DanhSachVBChuaPhucDapCuaDonViTuDonViKhacComponent } from './qlvb/outcom-document/danh-sach-vb-chua-phuc-dap-cua-don-vi/tu-dv-khac/danh-sach-vb-chua-phuc-dap-cua-donvi-tu-donvi-khac';
import { DanhSachVBDaPhatHanhDonviGuiDonViKhacComponent } from './qlvb/outcom-document/danh-sach-vb-da-phat-hanh-don-vi/don-vi-khac-phat-hanh/don-vi-khac-phat-hanh.component';
import { ThemMoiPhatHanhChuyenVTDonViComponent } from './qlvb/outcom-document/them-moi-vb-phat-hanh-cbcs/chuyen-van-thu-don-vi/chuyen-van-thu-don-vi';
import { DanhSachVBChuaPhucDapCuaDDoiTuCATPComponent } from './qlvb/outcom-document/danh-sach-vb-chua-phuc-dap-cua-doi/tu-catp/danh-sach-vb-chua-phuc-dap-cua-doi-tu-catp';
import { DanhSachVBChuaPhucDapCuaDoiTuDonViKhacComponent } from './qlvb/outcom-document/danh-sach-vb-chua-phuc-dap-cua-doi/tu-don-vi-khac/danh-sach-vb-chua-phuc-dap-cua-doi-tu-donvi-khac';
import { DanhSachVBDiCuaDoiChoPhatHanhComponent } from './qlvb/outcom-document/danh-sach-vb-di-cua-doi-cho-phat-hanh/danh-sach-vb-di-cua-doi-cho-phat-hanh.component';
import { ThemMoiVBDiChuyenVTCATPComponent } from './qlvb/outcom-document/them-moi-vb-phat-hanh-cbcs/chuyen-vtcatp-phat-hanh/chuyen-vtcatp-phat-hanh';

import { HinDashboardComponent } from './hin-portal/hin-dashboard/hin-dashboard.component';
import { ThemMoiVanBanNoiBoComponent } from './qlvb/outcom-document/them-moi-vb-phat-hanh-cbcs/them-moi-vb-noi-bo/them-moi-vb-noi-bo';
import { DanhSachVBDiNoiBoComponent } from './qlvb/outcom-document/danh-sach-vb-di-noi-bo/danh-sach-vb-di-noi-bo';
import { XemVanBanNoiBoComponent } from './qlvb/outcom-document/them-moi-vb-phat-hanh-cbcs/them-moi-vb-noi-bo/xem-vb-noi-bo';
import { EditDocumentDenDoiComponent } from './qlvb/documentReceive/doi-truong/chi-tiet-vb-den-doi/sua-vb-den-doi';
import { ViewDocumentDenDoiComponent } from './qlvb/documentReceive/doi-truong/chi-tiet-vb-den-doi/xem-vb-den-doi';
import { ThemMoiVBDiChuyenThayCATPComponent } from './qlvb/outcom-document/phat-hanh-vb-di (duong tat)/gui-catp/gui-catp.component';
import { ThemMoiVBDiChuyenThayVTDVComponent } from './qlvb/outcom-document/phat-hanh-vb-di (duong tat)/dv-khac/gui-dv-khac.component';
import { CreateDocumentLocalComponent } from './qlvb/documentReceive/doi-truong/them-moi-van-ban-den-noi-bo/create-Document.component';
import { VBDenTuCacDoi_ChuaPhanXuLyComponent } from './qlvb/documentReceive/van-ban-den-tu-cac-doi/chua-phan-xu-ly/chua-phan-xu-ly.component';
import { VBDenTuCacDoi_DaPhanXuLyComponent } from './qlvb/documentReceive/van-ban-den-tu-cac-doi/da-phan-xu-ly/da-phan-xu-ly.component';
import { BaoCaoKetQuaComponent } from './qlkh-cv/popup/bao-cao-ket-qua/bao-cao-ket-qua.component';
import { SuaVbDiComponent } from './qlvb/outcom-document/sua-vb-di/sua-vb-di.component';
import { ChiTietTraCuuVanBanCuComponent } from './qlvb/tra-cuu-van-ban-cu/tra-cuu-van-ban-cu.component';
import { ExecuteLabelSQL_LLComponent } from './qlvb/executeLabelSQL-LazyLoading/executeLabelSQL_LL.component';
import { VBPHCATPDenPhongChuaTrinh } from './qlvb/documentReceive/vanthuphong/vb-catp/vb-phoihop-phong-chua-trinh/vb-phoihop-phong-chua-trinh.component';
import { VBCATPDenPhongPHDaTrinh } from './qlvb/documentReceive/vanthuphong/vb-catp/vb-phong-ph-da-trinh/vb-phong-ph-da-trinh.component';
import { ChuaPhanXuLyPHDoiTruongComponent } from './qlvb/documentReceive/doi-truong/chua-phan-xu-ly-ph-doi-truong/chua-phan-xu-ly-ph-doi-truong.component';
import { DaPhanXuLyPHDoiTruongComponent } from './qlvb/documentReceive/doi-truong/da-phan-xu-ly-ph-doi-truong/da-phan-xu-ly-ph-doi-truong.component';
import { ChuaXuLyPHComponent } from './qlvb/documentReceive/can-bo-chien-si/chua-xu-ly-ph/chua-xu-ly-ph.component';
import { DaXuLyPHComponent } from './qlvb/documentReceive/can-bo-chien-si/da-xu-ly-ph/da-xu-ly-ph.component';
import { ViewDocumentDenDoiPHComponent } from './qlvb/documentReceive/doi-truong/chi-tiet-vb-den-doi/xem-vb-den-doi-ph';
import { ViewDocumentDenPhongPHComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/xem-vb-phong-ph.component';
import { EditDocumentDenPhongPHExtraComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/sua-vb-phong-ph-extra.component';
import { DanhSachVBChuaPhatHanhDonviGuiDonViKhacComponent } from './qlvb/outcom-document/danh-sach-vb-chua-phat-hanh-don-vi/don-vi-khac-phat-hanh/don-vi-khac-phat-hanh.component';
import { VbPhoihopPhongComponent } from './qlvb/documentReceive/vanthuphong/vb-catp/vb-phoihop-phong/vb-phoihop-phong.component';
import { VbPhoihopDoiComponent } from './qlvb/documentReceive/doi-truong/vb-phoihop-doi/vb-phoihop-doi.component';
import { VbPhoihopCbcsComponent } from './qlvb/documentReceive/can-bo-chien-si/vb-phoihop-cbcs/vb-phoihop-cbcs.component';
import { VbPhoiHopDoiChuaPhanXuLyDoiTruongComponent } from './qlvb/documentReceive/doi-truong/vb-phoi-hop-doi-chua-phan-xu-ly-doi-truong/vb-phoi-hop-doi-chua-phan-xu-ly-doi-truong.component';
import { VbPhoiHopDoiDaPhanXuLyDoiTruongComponent } from './qlvb/documentReceive/doi-truong/vb-phoi-hop-doi-da-phan-xu-ly-doi-truong/vb-phoi-hop-doi-da-phan-xu-ly-doi-truong.component';
import { EditDocumentDenDoiPHComponent } from './qlvb/documentReceive/doi-truong/chi-tiet-vb-den-doi/sua-vb-den-doi-ph';
// import { VbPhoiHopDoiDaPhanXuLyDoiTruongComponent } from './qlvb/documentReceive/doi-truong/vb-phoi-hop-doi-da-phan-xu-ly-doi-truong/vb-phoi-hop-doi-da-phan-xu-ly-doi-truong.component';
import { ViewDocumentDenPhongPhoiHopComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/xem-vb-phong-phoi-hop.component';
import { VbPhoiHopPhongDaTrinhComponent } from './qlvb/documentReceive/vanthuphong/vb-phoi-hop-phong/vb-phoi-hop-phong-da-trinh/vb-phoi-hop-phong-da-trinh.component';
import { VbPhoiHopPhongChuaTrinhComponent } from './qlvb/documentReceive/vanthuphong/vb-phoi-hop-phong/vb-phoi-hop-phong-chua-trinh/vb-phoi-hop-phong-chua-trinh.component';
import { ViewDocumentDenDoiPhoiHopComponent } from './qlvb/documentReceive/vanthuphong/them-moi-vb-den/xem-vb-doi-phoi-hop.component';
import {VbPhoiHopCbcsChuaXuLyComponent} from './qlvb/documentReceive/can-bo-chien-si/vb-phoi-hop-cbcs-chua-xu-ly/vb-phoi-hop-cbcs-chua-xu-ly.component'
import {VbPhoiHopCbcsDaXuLyComponent} from './qlvb/documentReceive/can-bo-chien-si/vb-phoi-hop-cbcs-da-xu-ly/vb-phoi-hop-cbcs-da-xu-ly.component';
import { ReportViewUtilityComponent } from './dynamic-report/viewer/viewer-utility/viewer-utility-component';
import { ConfigActionComponent } from './config-label-action/config-action.component';
import { ConfigLabelActionComponent } from './config-label-action/config-label-action.component';
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'management/templates', component: TemplatesComponent, data: { permission: 'Pages.Templates' }  },
                    { path: 'qlvb/vb-phong/edit/:id', component: EditDocumentDenPhongExtraComponent, data: { permision: ''}},
                    { path: 'qlvb/vb-phong/edit-ph/:id', component: EditDocumentDenPhongPHExtraComponent, data: { permision: ''}},
                    { path: 'qlvb/vb-phong/da-trinh', component: VBNoiKhacDaTrinhComponent, data: { permission: ''}},
                    { path: 'qlvb/vb-phong/chua-trinh', component: VBNoiKhacChuaTrinhComponent, data: { permission: ''}},
                    { path: 'qlvb/them-vb-phong/:code/edit/:id', component: EditDocumentDenPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/them-vb-phong/edit/:id', component: EditDocumentDenPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/them-vb-phong/view/:id', component: ViewDocumentDenPhongComponent, data: { permission: ''}}, 
                    { path: 'qlvb/them-vb-phong-phoi-hop/view/:id/:iddochandlingdetail', component: ViewDocumentDenPhongPhoiHopComponent, data: { permission: ''}},
                    { path: 'qlvb/them-vb-doi-phoi-hop/view/:id/:iddochandlingdetail', component: ViewDocumentDenDoiPhoiHopComponent, data: { permission: ''}},
                    { path: 'qlvb/them-vb-phong/view-ph/:id', component: ViewDocumentDenPhongPHComponent, data: { permission: ''}},
                    { path: 'qlvb/them-vb-phong', component: CreateDocumentDenPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/luu-tru/:id', component: LuuTruVanBanDiComponent, data: { permission: ''}},
                    { path: 'qlvb/cA_OutDocumentHandlingDetails', component: CA_OutDocumentHandlingDetailsComponent, data: { permission: 'Pages.CA_OutDocumentHandlingDetails' }  },
                    { path: 'qlvb/cA_OutDocumentHandlings', component: CA_OutDocumentHandlingsComponent, data: { permission: 'Pages.CA_OutDocumentHandlings' }  },
                    { path: 'qlvb/oDocs/edit/:id', component: EditOutcommingDocumentComponent, data: {permission: ''}},
                    { path: 'qlvb/oDocs/view/:id', component: ViewOutcommingDocumentComponent, data: {permission: ''}},
                    { path: 'qlvb/oDocs', component: ODocsComponent, data: { permission: 'Pages.ODocs' }  },
                    { path: 'qlvb/publishOrgs', component: PublishOrgsComponent, data: { permission: 'Pages.PublishOrgs' }  },
                    { path: 'qlvb/orgLevels', component: OrgLevelsComponent, data: { permission: 'Pages.OrgLevels' }  },
                    { path: 'qlvb/hardDatasourceGroups', component: HardDatasourceGroupsComponent, data: { permission: 'Pages.HardDatasourceGroups' }  },
                    { path: 'management/impersonates', component: ImpersonatesComponent, data: { permission: 'Pages.Impersonates' }  },
                    { path: 'management/dynamicCategoryRowIndexes', component: DynamicCategoryRowIndexesComponent, data: { permission: 'Pages.DynamicCategoryRowIndexes' }  },
                    { path: 'qlvb/dynamicCategory/:id', component: DynamicCategoryComponent, data: { permission: '' }  },
                    { path: 'qlvb/comm_Book_Syntaxes', component: Comm_Book_SyntaxesComponent, data: { permission: '' }  },
                    { path: 'qlvb/comm_Book_Values', component: Comm_Book_ValuesComponent, data: { permission: '' }  },
                    { path: 'qlvb/comm_books', component: Comm_booksComponent, data: { permission: '' }  },
                    { path: 'qlvb/dynamicFields/list', component: ListAllDynamicFieldComponent, data: { permission: 'Pages.DynamicFields' }},
                    { path: 'qlvb/storeDatasources', component: StoreDatasourcesComponent, data: { permission: 'Pages.StoreDatasources' }  },
                    { path: 'qlvb/hardDatasources', component: HardDatasourcesComponent, data: { permission: 'Pages.HardDatasources' }  },
                    { path: 'qlvb/datasource/:id', component: HardForDynamicDatasourcesComponent, data: { permission: 'Pages.HardDatasources' }  },
                    { path: 'qlvb/commandDatasources', component: CommandDatasourcesComponent, data: { permission: 'Pages.CommandDatasources' }  },
                    { path: 'qlvb/dynamicFields/edit/:id', component: EditGroupDynamicFieldComponent, data: { permission: 'Pages.DynamicFields' }},
                    { path: 'qlvb/dynamicFields/create', component: CreateGroupDynamicFieldComponent, data: { permission: 'Pages.DynamicFields' }},
                    { path: 'qlvb/vanbans/view_detail_vanban/:id', component: ViewDetailVanbanComponent, data: { permission: '' }  },
                    { path: 'qlvb/vanbans/create_edit_vanban/:id', component: CreateOrEditVanbanComponent, data: { permission: '' }  },
                    { path: 'qlvb/vanbans/create_edit_vanban', component: CreateOrEditVanbanComponent, data: { permission: '' }  },

                    { path: 'qlvb/dynamicDatasource', component: DynamicDatasourceComponent, data: { permission: 'Pages.DynamicDatasource' }  },
                    { path: 'qlvb/quytrinhxuly/:id', component: TransferDocumentComponent, data: { permission: '' }},
                    { path: 'qlvb/quytrinhxuly-vb-di/:id', component: TransferDocumentComponent, data: { permission: '' }},
                    { path: 'qlvb/detail-incomming-document-modal', component: DetailIncommingDocumentModalComponent, data: { permission: '' }  },
                    { path: 'qlvb/process-document', component: ProcessingDocumnetModalComponent, data: { permission: '' }  },
                    // { path: 'qlvb/transfer-handle', component: TransferHandleModalComponent, data: { permission: '' }  },
                    { path: 'qlvb/receive-document/:id', component: ReceiveModalComponent, data: { permission: '' }  },
                    { path: 'qlvb/vanbans/create_edit_vanban/:id', component: CreateOrEditVanbanComponent, data: { permission: '' }  },
                    { path: 'qlvb/vanbans/create_edit_vanban', component: CreateOrEditVanbanComponent, data: { permission: '' }  },
                    { path: 'qlvb/documentStatuses', component: DocumentStatusesComponent, data: { permission: ''}},
                    { path: 'qlvb/dynamicValues', component: DynamicValuesComponent, data: { permission: 'Pages.DynamicValues' }  },
                    { path: 'qlvb/dynamicFields', component: DynamicFieldsComponent, data: { permission: 'Pages.DynamicFields' }  },
                    { path: 'management/sqlStoreParams', component: SqlStoreParamsComponent, data: { permission: 'Pages.SqlStoreParams' }  },
                    { path: 'management/sqlConfigDetails/config/:id', component: ModifySqlConfigDetailsComponent, data: { permission: 'Pages.SqlConfigDetails' }  },
                    { path: 'management/sqlConfigDetails', component: SqlConfigDetailsComponent, data: { permission: 'Pages.SqlConfigDetails' }  },
                    { path: 'management/sqlConfigs', component: SqlConfigsComponent, data: { permission: 'Pages.SqlConfigs' }  },
                    { path: 'qlvb/schedules', component: SchedulesComponent, data: { permission: 'Pages.Schedules' }  },
                    { path: 'qlvb/promulgateds', component: PromulgatedsComponent, data: { permission: 'Pages.Promulgateds' }  },
                    { path: 'qlvb/receiveUnits', component: ReceiveUnitsComponent, data: { permission: 'Pages.ReceiveUnits' }  },
                    { path: 'qlvb/typeHandles', component: TypeHandlesComponent, data: { permission: 'Pages.TypeHandes' }  },

                    { path: 'qlvb/workDetails', component: WorkDetailsComponent, data: { permission: 'Pages.WorkDetails' }  },
                    { path: 'qlvb/wordProcessings', component: WordProcessingsComponent, data: { permission: 'Pages.WordProcessings' }  },
                    { path: 'qlvb/workAssigns', component: WorkAssignsComponent, data: { permission: 'Pages.WorkAssigns' }  },
                    { path: 'qlvb/documentTypes', component: DocumentTypesComponent, data: { permission: 'Pages.DocumentTypes' }  },
                    { path: 'dashboard', component: DashboardComponent, data: { permission: 'Pages.Tenant.Dashboard' } },
                    { path: 'qlvb/create-new-incomming-document', component: CreateNewIncommingDocumentComponent, data: { permission: '' } },
                    { path: 'qlvb/incomming-document/edit/:id', component: EditIncommingDocumentComponent, data: { permission: '' } },
                    { path: 'qlvb/incomming-document/view/:id', component: ViewIncommingDocumentComponent, data: { permission: '' } },
                    { path: 'qlvb/incomming-document/edit/extra/:id', component: EditExtraIDocComponent, data: { permission: '' } },

                    { path: 'qlvb/memorize_Keywordses', component: Memorize_KeywordsesComponent, data: { permission: '' } },
                    { path: 'qlvb/list_document_receviceModal', component:  List_document_receviceModal, data: { permission: '' } },
                    { path: 'qlvb/chuyenvanbanden', component:  ChuyenvanbandenComponent, data: { permission: '' } },
                    { path: 'qlvb/lich_su_upload', component:  Lich_su_uploadModalComponent, data: { permission: '' } },

                    // { path: 'qlvb/quytrinhxuly', component: TransferDocumentComponent, data: { permission: '' }},
                    { path: 'qlvb/view-keyword', component: ViewMemorize_KeywordsModal, data: { permission: '' }},
                    { path: 'qlvb/lichcongviec', component: LichCongViecComponent, data: { permission: '' }},
                    //cho xu ly
                    { path: 'qlvb/textBooks', component: TextBooksComponent, data: { permission: '' } },
                    { path: 'qlvb/executeLabelSQL/:id/:outdate', component: ExecuteLabelSQLComponent, data: { permission: '' } },
                    { path: 'qlvb/executeLabelSQL/:id', component: ExecuteLabelSQLComponent, data: { permission: '' } },
                    { path: 'qlvb/executeLabelSQLNew/:id/:outdate', component: ExecuteLabelSQL_LLComponent, data: { permission: '' }},
                    { path: 'qlvb/executeLabelSQLNew/:id', component: ExecuteLabelSQL_LLComponent, data: { permission: '' }},
                    //luong quan ly
                    { path: 'qlvb/executeLabelSQL/:name/:id', component: ExecuteLabelSQLComponent, data: { permission: '' } },
                      // Chuyển xử lý
                    // Chuyển cho phòng
                    { path: 'qlvb/report', component: ReportDocumentModalComponent, data: { permission: '' } },
                    { path: 'qlvb/report/:id', component: ReportDocumentModalComponent, data: { permission: '' } },
                    { path: 'qlvb/button', component: ButtonUIComponent, data: { permission: '' } },
                   //màn hình thêm động button
                    { path: 'qlvb/buttonUI', component: ListAllButtonUIComponent, data: { permission: '' } },

                    { path: 'qlvb/search-document', component: SearchDocumentComponent, data: { permission: '' } },
                    { path: 'qlvb/print-book', component: PrintBookDocumentComponent, data: {permission: ''}},
                    //  { path: 'qlvb/upload-file', component: UploadFileComponent, data: { permission: '' } },
                    { path: 'qlvb/danh-sach-theo-phong', component: DanhSachTheoPhongComponent, data: {permission: ''}},
                    { path: 'qlvb/so-den-theo-phong/:id', component: SoDenTheoPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/chua-trinh-CH-phong', component: ChuaTrinhChiHuyPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/da-trinh-CH-phong', component: DaTrinhChiHuyPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/chua-phan-xu-ly-truong-phong', component: ChuaPhanCongXuLyPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/da-phan-xu-ly-truong-phong', component: DaPhanCongXuLyPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/chua-phan-xu-ly-doi-truong', component: ChuaPhanXuLyDoiTruongComponent, data: { permission: ''}},
                    { path: 'qlvb/chua-phan-xu-ly-ph-doi-truong', component: ChuaPhanXuLyPHDoiTruongComponent, data: { permission: ''}},
                    { path: 'qlvb/da-phan-xu-ly-doi-truong', component: DaPhanXuLyDoiTruongComponent, data: { permission: ''}},
                    { path: 'qlvb/da-phan-xu-ly-ph-doi-truong', component: DaPhanXuLyPHDoiTruongComponent, data: { permission: ''}},
                    { path: 'qlvb/chua-xu-ly-pho-phong', component: ChuaXuLyPhoPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/da-xu-ly-pho-phong', component: DaXuLyPhoPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/chua-phan-xu-ly-to-truong', component: ChuaPhanXuLyToTruongComponent, data: { permission: ''}},
                    { path: 'qlvb/da-phan-xu-ly-to-truong', component: DaPhanXuLyToTruongComponent, data: { permission: ''}},
                    { path: 'qlvb/view-document/:id', component: ViewDocumentComponent, data: { permission: ''}},
                    { path: 'qlvb/chua-xu-ly', component: ChuaXuLyComponent, data: { permission: ''}},
                    { path: 'qlvb/chua-xu-ly-ph', component: ChuaXuLyPHComponent, data: { permission: ''}},
                    { path: 'qlvb/da-xu-ly', component: DaXuLyComponent, data: { permission: ''}},
                    { path: 'qlvb/da-xu-ly-ph', component: DaXuLyPHComponent, data: { permission: ''}},
                    { path: 'qlvb/them-moi-vb-di-catp', component: CreateOutcommingDocumentComponent, data: { permission: ''}},
                    { path: 'qlvb/them-moi-va-cho-so', component: ThemMoiVaChoSoComponent, data: { permission: ''}},
                    { path: 'qlvb/them-moi-va-cho-so/:id', component: ThemMoiVaChoSoComponent, data: { permission: ''}},
                    { path: 'qlvb/sua-vb-di/:id', component: SuaVbDiComponent },
                    { path: 'qlvb/danh-sach-vb-cho-cho-so', component: DanhSachVBChoChoSoComponent, data: { permission: ''}},
                    { path: 'qlvb/danh-sach-vb-cho-phat-hanh', component: DanhSachVBChoPhatHanhComponent, data: { permission: ''}},
                    { path: 'qlvb/danh-sach-vb-da-phat-hanh', component: DanhSachVBDaPhatHanhComponent, data: { permission: ''}},
                    { path: 'qlvb/danh-sach-vb-du-thao', component: DanhSachVBDuThaoComponent, data: { permission: ''}},
                    { path: 'qlvb/danh-sach-vb-cho-phe-duyet', component: DanhSachVBChoPheDuyetComponent, data: { permission: ''}},
                    { path: 'qlvb/danh-sach-vb-da-phe-duyet', component: DanhSachVBDaPheDuyetComponent, data: { permission: ''}},
                    { path: 'qlvb/tra-cuu-vb-di', component: TraCuuVBDiComponent, data: { permission: ''}},
                    { path: 'qlvb/danh-sach-vb-khong-duyet', component: DanhSachVBKhongDuyetComponent, data: { permission: ''}},

                    { path: 'qlvb/tra-cuu-vb-di-ca-nhan', component: TraCuuVBDiCaNhanComponent, data: { permission: ''}},
                    { path: 'qlvb/them-moi-vb-di-new', component: ThemMoiVBDiNewComponent, data: { permission: ''}},
                    { path: 'qlvb/danh-sach-vb-chua-cho-so', component: DanhSachVBChuaChoSoComponent, data: { permission: ''}},
                    { path: 'qlvb/danh-sach-vb-da-cho-so', component: DanhSachVBDaChoSoComponent, data: { permission: ''}},
                    { path: 'qlvb/danh-sach-vb-da-phat-hanh-catp', component: DanhSachVBDaPhatHanhComponent, data: { permission: ''}},
                    { path: 'qlvb/danh-sach-vb-chuyen-da-phat-hanh', component: DanhSachVBChuyenDaPhatHanhComponent, data: { permission: ''}},
                    { path: 'qlvb/tra-cuu-vb-di-catp', component: TraCuuVBDiCATPComponent, data: { permission: ''}},
                    { path: 'qlvb/danh-sach-vb-khong-duyet', component: DanhSachVBKhongDuyetComponent, data: { permission: ''}},
                    { path: 'qlvb/them-moi-vb-den-phong/:id', component: ThemMoiVBDenPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/sua-vb-den-phong', component: SuaVBDenPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/xem-vb-den-phong/:id', component: XemVBDenPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/tiep-nhan-vb-den-phong', component: TiepNhanVBDenPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/tra-cuu-vb-phong', component: TraCuuVBPhongComponent, data: { permission: ''}},
                    { path: 'qlvb/chua-xu-ly-doi-pho', component: ChuaPhanXuLyDoiPhoComponent, data: { permission: ''}},
                    { path: 'qlvb/da-xu-ly-doi-pho', component: DaPhanXuLyDoiPhoComponent, data: { permission: ''}},
                    { path: 'qlvb/chua-luu-tru', component: ChuaLuuTruComponent, data: { permission: ''}},
                    { path: 'qlvb/da-luu-tru', component: DaLuuTruComponent, data: { permission: ''}},
                    { path: 'qlvb/tra-cuu-vb-di-ca-nhan', component: TraCuuVBDiCaNhanComponent, data: { permission: ''}},
                    { path: 'qlvb/tra-cuu-vb-di-phong', component: TraCuuVBDiPhongComponent, data: { permission: ''}},
                    { path: 'dynamicreport', pathMatch: 'full', redirectTo: 'dynamicreport/report/search' },
                    { path: 'dynamicreport/report/search', component: SearchComponent, },
                    { path: 'dynamicreport/report/add/:id', component: AddComponent, },
                    { path: 'dynamicreport/report/config/:id/:tab', component: ReportFilterComponent },
                    { path: 'dynamicreport/report/addfilter/:reportid/:id', component: AddReportFilterComponent },
                    { path: 'dynamicreport/lookup', component: ReportLockupComponent },
                    { path: 'dynamicreport/service', component: ReportServiceComponent },
                    { path: 'dynamicreport/report/viewer/:code', component: ReportViewComponent },
                    { path: 'dynamicreport/lookup/:id', component: AddLookupComponent },
                    { path: 'dynamicreport/datasource', component: DatasourceComponent },
                    { path: 'dynamicreport/report/detail/:code', component: ReportDetailComponent },
                    { path: 'qlvb/xem-vb-da-cho-so/:id', component: XemVanBanDaChoSoComponent },
                    { path: 'qlvb/danh-sach-vb-tu-catp', component: VBCATPDenPhongChuaTrinh },
                    { path: 'qlvb/danh-sach-vbph-tu-catp', component: VBPHCATPDenPhongChuaTrinh }, // danh sách vb phối chưa trình lãnh đạo P/Q
                    { path: 'qlvb/them-moi-vb-tu-catp/:id', component: TiepNhanTuCATPComponent },
                    { path: 'qlvb/xem-vb-tu-catp', component: XemTiepNhanTuCATPComponent },
                    { path: 'qlvb/danh-sach-chua-phuc-dap-catp', component: DanhSachVBChuaPhucDapComponent },
                    { path: 'qlvb/danh-sach-da-co-chi-dao', component: VBCATPDenPhongDaTrinh }, // văn thư phòng, vb từ catp có chỉ đạo
                   
                   //ph-ph
                    { path: 'qlvb/danh-sach-phoi-hop-da-co-chi-dao', component: VbPhoiHopPhongDaTrinhComponent, data: { permission: ''} }, // văn thư phòng, vb phối hợp từ catp có chỉ đạo
                    { path: 'qlvb/danh-sach-phoi-hop-chua-co-chi-dao', component: VbPhoiHopPhongChuaTrinhComponent, data: { permission: ''} }, // văn thư phòng, vb phối hợp từ catp chưa có chỉ đạo
                    { path: 'qlvb/phoi-hop-da-phan-xu-ly-doi-truong', component: VbPhoiHopDoiDaPhanXuLyDoiTruongComponent, data: { permission: ''} }, // văn thư phòng, vb phối hợp từ catp có chỉ đạo
                    { path: 'qlvb/phoi-hop-chua-phan-xy-ly-doi-truong', component: VbPhoiHopDoiChuaPhanXuLyDoiTruongComponent, data: { permission: ''} }, // văn thư phòng, vb phối hợp từ catp chưa có chỉ đạo
                    { path: 'qlvb/vb-phoi-hop-chua-xu-ly', component: VbPhoiHopCbcsChuaXuLyComponent, data: { permission: ''} }, // văn thư phòng, vb phối hợp từ catp có chỉ đạo
                    { path: 'qlvb/vb-phoi-hop-da-xu-ly', component: VbPhoiHopCbcsDaXuLyComponent, data: { permission: ''} }, // văn thư phòng, vb phối hợp từ catp chưa có chỉ đạo
                    
                    
                    
                    
                    
                    
                          
                    { path: 'qlvb/danh-sach-ph-da-co-chi-dao', component: VBCATPDenPhongPHDaTrinh },
                    { path: 'qlvb/danh-sach-vb-theo-doi-doi/:id', component: VanBanTheoDoiComponent },
                    { path: 'qlvb/danh-sach-vb-theo-doi-doi/:id/:outdate', component: VanBanTheoDoiComponent },
                    { path: 'qlvb/danh-sach-vb-theo-doi-da-xu-ly', component: VanBanTheoDoiDaXuLyComponent },
                    { path: 'qlvb/danh-sach-theo-doi-ca-nhan/:id', component: VanBanTheoDoiCaNhanComponent },
                    { path: 'qlvb/danh-sach-theo-doi-ca-nhan/:id/:outdate', component: VanBanTheoDoiCaNhanComponent },
                    { path: 'qlvb/danh-sach-vb-theo-bch-doi', component: VanBanTheoBCHComponent},
                    { path: 'qlvb/danh-sach-vb-da-xu-ly-doi-truong', component: VanBanTheoDoiTruongDaXuLyComponent},
                    { path: 'qlvb/danh-sach-vb-chua-phuc-dap-cua-donvi-tu-catp', component: DanhSachVBChuaPhucDapCuaDonViTuCATPComponent},
                    { path: 'qlvb/danh-sach-vb-chua-phuc-dap-cua-donvi-tu-donvi-khac', component: DanhSachVBChuaPhucDapCuaDonViTuDonViKhacComponent },
                    { path: 'qlvb/danh-sach-vb-cua-dv-gui-dv-khac-da-cho-so', component: DanhSachVBDaPhatHanhDonviGuiDonViKhacComponent },
                    { path: 'qlvb/danh-sach-vb-cua-dv-gui-dv-khac-chua-ph', component: DanhSachVBChuaPhatHanhDonviGuiDonViKhacComponent },
                    { path: 'qlvb/them-moi-vb-di-doi', component: ThemMoiPhatHanhChuyenVTDonViComponent },

                    { path: 'qlvb/danh-sach-vb-chua-phuc-dap-cua-doi-tu-catp', component: DanhSachVBChuaPhucDapCuaDDoiTuCATPComponent },
                    { path: 'qlvb/danh-sach-vb-chua-phuc-dap-cua-doi-tu-don-vi-khac', component: DanhSachVBChuaPhucDapCuaDoiTuDonViKhacComponent },
                    { path: 'qlvb/danh-sach-vb-di-cua-doi-cho-phat-hanh/:type', component: DanhSachVBDiCuaDoiChoPhatHanhComponent },
                    { path: 'hin-dashboard/:name', component: HinDashboardComponent, data: { permission: '' } },
                    { path: 'qlvb/them-moi-va-chuyen-cho-catp', component: ThemMoiVBDiChuyenVTCATPComponent },
                    { path: 'qlvb/them-moi-vb-noi-bo', component: ThemMoiVanBanNoiBoComponent },
                    { path: 'qlvb/danh-sach-vb-di-noi-bo', component: DanhSachVBDiNoiBoComponent },
                    { path: 'qlvb/xem-vb-di-noi-bo/:id', component: XemVanBanNoiBoComponent },
                    { path: 'qlvb/sua-vb-den-doi/:id', component: EditDocumentDenDoiComponent },
                    { path: 'qlvb/xem-vb-den-doi/:id', component: ViewDocumentDenDoiComponent },
                    { path: 'qlvb/xem-vb-den-doi-phoi-hop/:id', component: ViewDocumentDenDoiPHComponent },
                    { path: 'qlvb/them-moi-vb-thay-catp', component: ThemMoiVBDiChuyenThayCATPComponent },
                    { path: 'qlvb/them-moi-vb-thay-vtdv', component: ThemMoiVBDiChuyenThayVTDVComponent },

                    { path: 'qlvb/them-vb-den-noi-bo', component: CreateDocumentLocalComponent, data: { permission: ''}},

                    { path: 'qlvb/van-ban-den-tu-cac-doi-chua-xu-ly', component: VBDenTuCacDoi_ChuaPhanXuLyComponent},
                    { path: 'qlvb/van-ban-den-tu-cac-doi-da-xu-ly', component: VBDenTuCacDoi_DaPhanXuLyComponent},
                    { path: 'dynamicreport/report/viewer-plan/:code/:labelCode', component: ReportViewPlanComponent },
                    // kế hoạch
                    { path: 'qlkh/bao-cao-ket-qua/:id', component: BaoCaoKetQuaComponent },
                    { path: 'dynamicreport/report/viewer-gantt', component: ReportViewGanttComponent },
                    { path: 'kh/them-ke-hoach/:id', component: ThemKeHoachComponent },

                    { path: 'qlvb/chi-tiet-van-ban-cu/:id/:code', component: ChiTietTraCuuVanBanCuComponent },
                    { path: 'qlvb/vb-phoih,op-phong', component: VbPhoihopPhongComponent },
                    { path: 'qlvb/vb-phoihop-doi', component: VbPhoihopDoiComponent },
                    { path: 'qlvb/vb-phoihop-cbcs', component: VbPhoihopCbcsComponent },

                    { path: 'qlvb/vb-phoi-hop-chua-phan-xu-ly-doi-truong', component: VbPhoiHopDoiChuaPhanXuLyDoiTruongComponent},
                    { path: 'qlvb/vb-phoi-hop-da-phan-xu-ly-doi-truong', component: VbPhoiHopDoiDaPhanXuLyDoiTruongComponent},
                    { path: 'qlvb/sua-vb-den-doi-phoi-hop/:id', component: EditDocumentDenDoiPHComponent },
                    { path: 'dynamicreport/report/viewer-utility/:code/:labelCode/:utilityId', component: ReportViewUtilityComponent },
					{ path: 'dynamicreport/report/viewer-utility/:code/:labelCode', component: ReportViewUtilityComponent },
                    // { path: 'dynamicreport/report/editor-utility/:code/:labelCode/:utilityId', component: ReportEditUtilityComponent },
					// { path: 'dynamicreport/report/editor-utility/:code/:labelCode', component: ReportEditUtilityComponent },
                    { path: 'config-action/:id', component : ConfigActionComponent},
                    { path: 'config-label-action/:id', component : ConfigLabelActionComponent},
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
