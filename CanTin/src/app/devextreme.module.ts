import { NgModule } from "@angular/core";
import { DxFormModule, DxListModule, DxPopupModule, DxTabsModule, DxTextAreaModule, DxValidationGroupModule, DxValidationSummaryModule, DxValidatorModule } from "devextreme-angular";
import { DxiItemModule } from "devextreme-angular/ui/nested";

@NgModule({
    exports: [
        DxListModule,
        DxTabsModule,
        DxTextAreaModule,
        DxFormModule,
        DxPopupModule,
        DxiItemModule,
        DxValidatorModule,
        DxValidationSummaryModule,
        DxValidationGroupModule
    ]
})

export class DemoMaterialModule { }