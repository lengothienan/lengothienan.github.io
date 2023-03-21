
import { HostDashboardServiceProxy, TopStatsData } from '@shared/service-proxies/service-proxies';
import { WidgetComponentBase } from '@app/shared/common/customizable-dashboard/widgets/widget-component-base';
import { Component, Injector, ViewEncapsulation, ViewChild, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HistoryUploadsServiceProxy, HistoryUploadDto  } from '@shared/service-proxies/service-proxies';
import { NotifyService } from '@abp/notify/notify.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { Table } from 'primeng/components/table/table';
import { Paginator } from 'primeng/components/paginator/paginator';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { FileDownloadService } from '@shared/utils/file-download.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { SqlConfigHelperService } from '@shared/utils/sql-config-helper.service';
import DataSource from 'devextreme/data/data_source';
import { DxDataGridComponent } from 'devextreme-angular';
import { ModalDirective } from 'ngx-bootstrap';
import {Appointment, Service} from './app.service';
import {DxSchedulerModule} from 'devextreme-angular';


@Component({
  selector: 'lichCongViec',
  templateUrl: './lichCongViec.html',
  providers: [Service]
 
})
export class LichCongViecComponent extends WidgetComponentBase implements OnInit, OnDestroy {

  selectedDateRange: moment.Moment[] = [moment().add(-7, 'days').startOf('day'), moment().endOf('day')];
  loading = true;
  topStatsData: TopStatsData;
  appointmentsData: Appointment[];
  currentDate: Date = new Date(2017, 4, 25);
  constructor(
    injector: Injector,
    service: Service,
    private _hostDashboardServiceProxy: HostDashboardServiceProxy) {

    super(injector);
    this.appointmentsData = service.getAppointments();
  }
 

  
  ngOnInit(): void {
    this.subDateRangeFilter();
    this.runDelayed(this.loadHostTopStatsData);
  }

  loadHostTopStatsData = () => {
    this._hostDashboardServiceProxy.getTopStatsData(this.selectedDateRange[0], this.selectedDateRange[1]).subscribe((data) => {
      this.topStatsData = data;
      this.loading = false;
    });
  }

  onDateRangeFilterChange = (dateRange) => {
    if (!dateRange || dateRange.length !== 2 || (this.selectedDateRange[0] === dateRange[0] && this.selectedDateRange[1] === dateRange[1])) {
      return;
    }

    this.selectedDateRange[0] = dateRange[0];
    this.selectedDateRange[1] = dateRange[1];
    this.runDelayed(this.loadHostTopStatsData);
  }

  subDateRangeFilter() {
    abp.event.on('app.dashboardFilters.dateRangePicker.onDateChange', this.onDateRangeFilterChange);
  }

  unSubDateRangeFilter() {
    abp.event.off('app.dashboardFilters.dateRangePicker.onDateChange', this.onDateRangeFilterChange);
  }

  ngOnDestroy(): void {
    this.unSubDateRangeFilter();
  }
}
