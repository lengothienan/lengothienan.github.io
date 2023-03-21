import { Component, Injector, OnInit, ViewChild } from "@angular/core";
import { AppComponentBase } from "@shared/common/app-component-base";
import { Comm_booksServiceProxy, DocumentServiceProxy } from "@shared/service-proxies/service-proxies";
import { DxFormComponent } from "devextreme-angular";
import CustomStore from "devextreme/data/custom_store";
import { reject } from "lodash";

@Component({
    selector: "app-capnhatvanbanphong",
    templateUrl: "./capnhatvanbanphong.component.html",
    styleUrls: ["./capnhatvanbanphong.component.css"],
})
export class CapnhatvanbanphongComponent
    extends AppComponentBase
    implements OnInit
{
    idvanban: number = null;
    bookDVOptions: any = {};
    vanban: any = {}
    saveBtnOptions: any = {};

    @ViewChild('vanbanden', {static: false}) vanbanden: DxFormComponent;

    constructor(
        injector: Injector,
        private _commBookService: Comm_booksServiceProxy,
        private _documentService: DocumentServiceProxy
    ) {
        super(injector);
    }

    ngOnInit() {
        this.bookDVOptions = {
            valueExpr: "id",
            displayExpr: "name",
            searchEnabled: true,
            placeholder: "Chọn sổ...",
            dataSource: new CustomStore({
                key: "id",
                byKey: (id) => {
                  const promise = new Promise((resolve) => {
                    this._commBookService.getAllCommBookInDepartment("1", this.appSession.organizationUnitId).subscribe(res => {
                                  resolve(res.filter(e => e.id == id));
                              }, (err) => {
                                  reject(err.message);
                              });
                  });
                  return promise;
                },
                load: () => {
                    const promise = new Promise((resolve) => {
                      this._commBookService.getAllCommBookInDepartment("1", this.appSession.organizationUnitId).subscribe(res => {
                                    resolve(res);
                                }, (err) => {
                                    reject(err.message);
                                });
                    });
                    return promise;
                },
            }),
        };

        this.saveBtnOptions = {
          text: "Lưu",
          icon: "save",
          type: "success",
          useSubmitBehavior: true
        }
    }

    TimKiemVanBan(e) {
      e.preventDefault();
      
      this._documentService.getDocumentForEditIncomingNumberDV(this.idvanban).subscribe(res => {
        if(res.code == "200"){
          this.notify.success(res.message);
          this.vanban = res.data;
        }else{
          this.notify.error(res.message);
        }
      });
    }

    CapNhatSoDenPhong(e){
      e.preventDefault();

      this._documentService.updateCommBookDV(this.vanban.id, this.vanban.bookDV, this.vanban.incommingNumberDV).subscribe(res =>{
        if(res.code == "200"){
          this.notify.success(res.message);
        }else{
          this.notify.error(res.message);
        }
      })
    }
}
