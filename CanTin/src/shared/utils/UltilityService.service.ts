import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
//import { UrlConstants } from '../../core/common/url.constants';
//import { AuthenService } from './authen.service';

@Injectable()
export class UtilityService {
  private _router: Router;
  private id: string;
  private content: string;
  private schedule: boolean;
  private selectedRowsData: any[];
  private documentData: any;
  private selectedHandlingId: number;

  constructor(router: Router) {
    this._router = router;
  }

  public set viewSchedule(data: any) {
    this.schedule = data;
  } 

  public get viewSchedule(): any {
    return this.schedule;
  }

  public set selectedRows(data: any[]){
    this.selectedRowsData = data;
  }

  public get selectedRows(){
    return this.selectedRowsData;
  }
  
  public set selectedDocumentData(data: any){
    this.documentData = data;
  }

  public get selectedDocumentData(): any{
    return this.documentData;
  }

  public set handlingId(data: number){
    this.selectedHandlingId = data;
  }

  public get handlingId(){
    return this.selectedHandlingId;
  }
}
