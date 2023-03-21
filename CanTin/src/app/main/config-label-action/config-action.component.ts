import { Component, OnInit, EventEmitter, Output, ViewChild, Injector, Input, Inject, Optional } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ModalDirective } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LabelActionServiceProxy,HIN_DashboardsServiceProxy, API_BASE_URL, CreateOrUpdateActionInput } from '@shared/service-proxies/service-proxies';
import { DxFormComponent } from 'devextreme-angular';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
    selector: 'ConfigAction',
    templateUrl: './config-action.component.html'
})

export class ConfigActionComponent extends AppComponentBase {

    @ViewChild('detailForm', {static: true}) detailForm: DxFormComponent;
    
    Name: any = "";
    actionData:any;
    actionId: number;
    addCheck = false;
    editCheck = false;
    nameReadOnly = false;
    codeReadOnly = false;
    iconReadOnly = false;
    descriptionsReadOnly = false;
    isActiveReadOnly = false;
    saveBtnVisible = true;
    currentUserId = this.appSession.userId;

    myFormGroup: FormGroup;
    iconCss = new FormControl();
    fallbackIcon = 'fas fa-user';
    icon:any = 'fas fa-user';

    private baseUrl: string;


    constructor(
        injector: Injector,
        private labelActionService: LabelActionServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private router: Router,
        private activeRoute: ActivatedRoute,
        @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
        super(injector);
        this.baseUrl = baseUrl ? baseUrl : ""
    }

    ngOnInit(){
        const self = this;
        var stage = window.localStorage.getItem('PLANACTION')

        var Id = this._activatedRoute.snapshot.paramMap.get('id');
        const utilitAction = localStorage.getItem("UTILITY_ACTION");
        this.activeRoute.params.subscribe((para) => {
            const Id = para['id'];    
            if (Id != 'null' && Id != "") {
                this.actionId = parseInt(Id);
                this.Name = "Chỉnh sửa Action";
                if(utilitAction == 'VIEW'){
                    this.Name = "Xem chi tiết Action";
                    this.nameReadOnly = true;
                    this.codeReadOnly = true;
                    this.iconReadOnly = true;
                    this.descriptionsReadOnly = true;
                    this.isActiveReadOnly = true;
                    this.saveBtnVisible = false;
                }
                this.labelActionService.getActionById(this.actionId).subscribe((res: any) =>{
                    if(res.code == "Success"){
                        self.actionData = res.data[0];
                        self.iconCss.setValue(res.data[0].icon);
                        self.icon = res.data[0].icon;
                    }
                    else if (res.code == "Error"){
                        self.notify.error(res.message);
                    }
                })    
            
                this.editCheck = true;    
            }else{
                this.Name = "Thêm mới Action";
                this.addCheck = true;
                this.actionData = 
                {
                    name:"",
                    code:"",
                    icon: "",
                    descriptions:"",
                    isDelete:false,
                    isActive:true
                }
                
            }
            if (stage=='EDIT'){
               
            }else if (stage == 'VIEW'){
                
            }else if (stage==null || Id =='null'){
                
            }
        })
        this.myFormGroup = new FormGroup({iconCss: this.iconCss});
    }
    

    save(): void {
        let result = this.detailForm.instance.validate();
        if(result.isValid){
            if(this.addCheck){
                var actionData = new CreateOrUpdateActionInput();
                actionData.id = -1;
                actionData.name = this.actionData.name;
                actionData.code = this.actionData.code;
                actionData.descriptions = this.actionData.descriptions;
                //actionData.icon = this.actionData.icon;
                actionData.icon = this.icon;
                actionData.isDelete = !this.actionData.isActive;

                this.labelActionService.insertOrUpdateAction(actionData).subscribe((res: any) =>{
                    if(res.code == "Success"){
                        this.notify.success(this.l('Successfully'));
                    }
                    else if (res.code == "Error"){
                        this.notify.error(res.message);
                    }
                })

            }else if(this.editCheck){
                if(this.actionId != null){
                    var actionData = new CreateOrUpdateActionInput();
                    actionData.id = this.actionId;
                    actionData.name = this.actionData.name;
                    actionData.code = this.actionData.code;
                    actionData.descriptions = this.actionData.descriptions;
                    //actionData.icon = this.actionData.icon;
                    actionData.icon = this.icon;
                    actionData.isDelete = !this.actionData.isActive;

                    this.labelActionService.insertOrUpdateAction(actionData).subscribe((res: any) =>{
                        if(res.code == "Success"){
                            this.notify.success(this.l('Successfully'));
                        }
                        else if (res.code == "Error"){
                            this.notify.error(res.message);
                        }
                    })
                }
            }
            this.back();
        } 
    }

    back(): void{
        this.router.navigateByUrl( 'app/main/dynamicreport/report/viewer-utility/DSACTION/ACTION'); 
    }

    onIconPickerSelect(icon: string): void {
        this.iconCss.setValue(icon);
        this.icon = icon;
    }
}
