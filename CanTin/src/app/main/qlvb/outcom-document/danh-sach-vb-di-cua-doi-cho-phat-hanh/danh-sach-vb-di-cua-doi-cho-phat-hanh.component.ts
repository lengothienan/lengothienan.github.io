import { appModuleAnimation } from "@shared/animations/routerTransition";
import { Component, OnInit, Injector } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { ODocsServiceProxy } from "@shared/service-proxies/service-proxies";
import { Router, ActivatedRoute } from "@angular/router";
import { UtilityService } from "@shared/utils/UltilityService.service";
import { AppSessionService } from '@shared/common/session/app-session.service';
import $ from 'jquery';
import { finalize } from "rxjs/operators";

@Component({
    templateUrl: './danh-sach-vb-di-cua-doi-cho-phat-hanh.component.html',
    animations: [appModuleAnimation()]
})
export class DanhSachVBDiCuaDoiChoPhatHanhComponent extends AppComponentBase implements OnInit {

    headerText:any="";
    buttonText:any="";
    type:any; // 1=dsvb chuyển văn thử catp phát hành 2= dsvb gửi các đơn vị khác
    constructor(
        injector: Injector,
        private odocService: ODocsServiceProxy,
        private router:Router,
        private _utilityService: UtilityService,
        private activeRouter:ActivatedRoute
    ){
        super(injector);
    }

    initialData:any=[];

    ngOnInit(){
        this.activeRouter.params.subscribe(param=>{
            this.type=param["type"];
            console.log(this.type)
            if(this.type==1){
                this.headerText="Danh sách văn bản chuyển văn thư CATP phát hành";
                this.buttonText="Chuyển";
            }
            else{
                this.headerText="Danh sách văn bản gửi các đơn vị khác";
                this.buttonText="Cho số";
            }
            this.odocService.getAllDocumntWaitingPublishFromDoiToCAPT(this.appSession.selfOrganizationUnitId,this.type)
            .subscribe(res => {
                this.initialData = res.data;
                console.log(res)
            });
        })

    }


    reply(d){
        // this._utilityService.selectedRows = d;
        //this._utilityService.selectedDocumentData =d;
        this.router.navigate(['/app/main/qlvb/them-moi-va-cho-so/'+d.Id]);
    }

    chuyen_VTCATP(d){
        this.odocService.transferODocFromDVToCATP(d.Id, d.HandlingId)
        .pipe(finalize(( )=> {
            // this.router.navigate(['/app/main/qlvb/danh-sach-vb-di-cua-doi-cho-phat-hanh/1']);
            window.location.reload();
        }))
        .subscribe(() => {
            // done
        });
    }
    
}