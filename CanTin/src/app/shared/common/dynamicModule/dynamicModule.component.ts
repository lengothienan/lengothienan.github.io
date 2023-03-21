import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { DynamicValueDto, DynamicFieldsServiceProxy, DynamicTablesServiceProxy} from '@shared/service-proxies/service-proxies';
import { DomSanitizer } from '@angular/platform-browser';
import 'devextreme/integration/jquery';
import * as $ from 'jquery';
import { equal } from 'assert';

@Component({
    selector: 'dynamicModule',
    templateUrl: './dynamicModule.component.html'
})
export class DynamicModuleComponent {
    // @Input() currentId: any;
    @Input() link = '';
    @Input() parameters: any;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    @Output() saveSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
    currentId: any;
    dynamicFields: any;
    formData: DynamicValueDto;
    dynamicData: any;
    objectID: any;
    moduleId: any;
    isSetData = false;
    error = true;
    keyData: any;
    valueData: any;
    searchData: any;
    message:any;
    constructor(private _dynamicFieldService: DynamicFieldsServiceProxy,
                private _sanitizer: DomSanitizer,
                private _dynamicTableService: DynamicTablesServiceProxy
                ) {
    }

    loadDynamicFieldForDynamicCategory(inputId : any){ 
        return new Promise((resolve, reject)=>{
            if (this.error) {
                const self = this;
                // this.href = this.router.url;
                // console.log(this.router.url);
                this.currentId = inputId;              
                self._dynamicFieldService.getDynamicFieldForDynamicCategory(inputId).subscribe((res: any) => {
                    console.log(res);
                    if (res.length > 0 ) {
                        self.isSetData = true;
                        self.dynamicData = res;           
                        var div = '';
                        self.objectID = this.currentId;
                        self.moduleId = res[0].moduleID;
                        res.forEach(function (value, index, array) {
                            div += '<div class="col-sm-6 form-inline" style="padding-right: 0;">';
                            div += '<div class="col-sm-3" style="padding-left:0;">'+value.nameDescription+' :</div>'
                            //comment vì dòng này thêm vào class col sẽ làm element bị thụt vào thêm 1 đoạn nữa
                            //div += '<div class="col-sm-'+value.width+'">'
                            div += '<div class="col-sm-9">';
                            let style = "";
                            if(index > 1 && index % 2 == 1){
                                style += "width: 100%; margin-top: 7px;";
                            }
                            else{
                                style += "width: 100%;";
                            }
                            if(value.typeField == 2){ // input
                                //khi tạo mới dùng store khác, k có trường value Id, comment những dòng dưới để không set value cho input
                                // if(value.valueId != 0){
                                //     div += '<input id="dynamic'+value.name+'" type="text" class="form-control" style="'+ style +'" value="'+value.value+'" >'
                                // }else{
                                    div += '<input id="dynamic'+value.name+'" type="text" class="form-control" style="'+ style +'" >'
                                // }
                            }else if(value.typeField == 3 || value.typeField == 1 || value.typeField == 4){ // combobox,checkbox,datebox
                                div += '<div id="dynamic'+value.name+'" style="'+ style +'"></div>';
                            }

                            div += '</div></div>';
                        });

                        self.dynamicFields = this._sanitizer.bypassSecurityTrustHtml(div);
                    }else{
                        self.isSetData = false;
                        self.dynamicFields = this._sanitizer.bypassSecurityTrustHtml("");
                    }
                    resolve('done');
                });
            } else {
                reject('error');
            }
        }).then((val) => {
                    if(this.isSetData){
                        setTimeout(() => 
                        {
                            this.datebox();
                            this.selectBox();
                            this.checkbox();
                        },500)}
                    },
                (err) => {
                    console.error(err);
                    });
    }

    //get for edit
    loadDynamicFieldForDynamicCategoryForEdit(inputId : any, rowId: number){ 
        return new Promise((resolve, reject)=>{
            if (this.error) {
                const self = this;
                // this.href = this.router.url;
                // console.log(this.router.url);
                this.currentId = inputId;              
                self._dynamicFieldService.getDynamicFieldForDynamicCategoryForEdit(inputId, rowId).subscribe((res: any) => {
                    if (res.length > 0 ) {
                        self.isSetData = true;
                        self.dynamicData = res;
                        console.log(res);           
                        var div = '';
                        self.objectID = this.currentId;
                        self.moduleId = res[0].moduleID;
                        res.forEach(function (value, index, array) {
                            div += '<div class="col-sm-6 form-inline" style="padding-right: 0;">';
                            div += '<div class="col-sm-3" style="padding-left:0;">'+value.nameDescription+' :</div>'
                            //comment vì dòng này thêm vào class col sẽ làm element bị thụt vào thêm 1 đoạn nữa
                            //div += '<div class="col-sm-'+value.width+'">'
                            div += '<div class="col-sm-9">';
                            let style = "";
                            if(index > 1 && index % 2 == 1){
                                style += "width: 100%; margin-top: 7px;";
                            }
                            else{
                                style += "width: 100%;";
                            }
                            if(value.typeField == 2){ // input                                
                                if(value.valueId != 0){
                                    div += '<input id="dynamic'+value.name+'" type="text" class="form-control" style="'+ style +'" value="'+value.value+'" >'
                                }else{
                                    div += '<input id="dynamic'+value.name+'" type="text" class="form-control" style="'+ style +'" >'
                                }
                            }else if(value.typeField == 3 || value.typeField == 1 || value.typeField == 4){ // combobox,checkbox,datebox
                                div += '<div id="dynamic'+value.name+'" style="'+ style +'"></div>';
                            }

                            div += '</div></div>';
                        });

                        self.dynamicFields = this._sanitizer.bypassSecurityTrustHtml(div);
                        console.log(self.dynamicFields);
                    }else{
                        self.isSetData = false;
                        self.dynamicFields = this._sanitizer.bypassSecurityTrustHtml("");
                    }
                    resolve('done');
                });
            } else {
                reject('error');
            }
        }).then((val) => {
                    if(this.isSetData){
                        setTimeout(() => 
                        {
                            this.dateboxForEdit();
                            this.selectBox();
                            this.checkbox();
                        },500)}
                    },
                (err) => {
                    console.error(err);
                    });
    }

    loadDynamicField(inputId : any, link: string){ 
        return new Promise((resolve, reject)=>{
            if (this.error) {
                const self = this;
                // this.href = this.router.url;
                // console.log(this.router.url);
                this.currentId = inputId;              
                self._dynamicFieldService.getDynamicFields(link, inputId).subscribe((res: any) => {                   
                    if (res.length > 0 ) {
                        self.isSetData = true;
                        self.dynamicData = res;            
                        var div = '';
                        self.objectID = this.currentId;
                        self.moduleId = res[0].moduleID;
                        res.forEach(function (value, index, array) {
                            div += '<div class="col-sm-6 form-inline" style="padding-right: 0;">';
                            div += '<div class="col-sm-3" style="padding-left:0;">'+value.nameDescription+' :</div>'
                            //comment vì dòng này thêm vào class col sẽ làm element bị thụt vào thêm 1 đoạn nữa
                            //div += '<div class="col-sm-'+value.width+'">'
                            div += '<div class="col-sm-9">';
                            let style = "";
                            if(index > 1 && index % 2 == 1){
                                style += "width: 100%; margin-top: 7px;";
                            }
                            else{
                                style += "width: 100%;";
                            }
                            if(value.typeField == 2){ // input
                                if(value.valueId != 0){
                                    div += '<input id="dynamic'+value.name+'" type="text" class="form-control" style="'+ style +'" value="'+value.value+'" >'
                                }else{
                                    div += '<input id="dynamic'+value.name+'" type="text" class="form-control" style="'+ style +'" >'
                                }
                            }else if(value.typeField == 3 || value.typeField == 1 || value.typeField == 4){ // combobox,checkbox,datebox
                                div += '<div id="dynamic'+value.name+'" style="'+ style +'"></div>';
                            }

                            div += '</div></div>';
                        });

                        self.dynamicFields = this._sanitizer.bypassSecurityTrustHtml(div);
                        console.log(self.dynamicFields);
                    }else{
                        self.isSetData = false;
                        self.dynamicFields = this._sanitizer.bypassSecurityTrustHtml("");
                    }
                    resolve('done');
                });
            } else {
                reject('error');
            }
        }).then((val) => {
                    if(this.isSetData){
                        setTimeout(() => 
                        {
                            this.datebox();
                            this.selectBox();
                            this.checkbox();
                        },500)}
                    },
                (err) => {
                    console.error(err);
                    });
    }

    selectBox(){
        this.dynamicData.forEach(obj =>{
            if(obj.typeField == 3){
                this.dataSourceSelectBox(obj.id, this.parameters).then((val) => {setTimeout(() => {
                    var dataSource = [];
                    dataSource.push(val);
                    var id = 'dynamic'+obj.name;
                    $("#"+id).dxSelectBox({
                        items: dataSource[0],
                        valueExpr: "key",
                        displayExpr: "value",
                    });
                    if(obj.value != 0 && obj.value != "")
                    {
                        $("#"+id).dxSelectBox("instance").option("value", obj.value );
                    }
                },500) });
            }
        });
    }

    dataSourceSelectBox(dynamicFieldId : any, parameters: any){
        return new Promise((resolve, reject)=>{
            this._dynamicFieldService.getDataSourceDynamic(dynamicFieldId, this.currentId, parameters).subscribe((res: any) => {
                resolve(res);
            });
        });

    }

    checkbox(){
        this.dynamicData.forEach(obj =>{
            if(obj.typeField == 1){
                var id = 'dynamic'+obj.name;
                var check = false;
                //var check = (obj.value == "true") ? true : false;
                if(obj.value){
                    check = (obj.value == "true"||obj.value == true) ? true : false;
                }
                $("#"+id).dxCheckBox({
                    value: check
                });
            }
        });
    }

    dateboxForEdit(){
        this.dynamicData.forEach(obj => {
            if(obj.typeField == 4){
                console.log(obj.value);
                var id = 'dynamic'+obj.name;
                let x = document.getElementById(id);
                
                ($("#"+id) as any).dxDateBox({
                    displayFormat: "dd/MM/yyyy",
                    type: 'date',
                    value: (obj.value !== '' && obj.value !== null) ? new Date(obj.value) : null
                });
            }
        });
    }

    datebox(){
        this.dynamicData.forEach(obj => {
            if(obj.typeField == 4){
                console.log(obj.value);
                var id = 'dynamic'+obj.name;
                let x = document.getElementById(id);
                ($("#"+id) as any).dxDateBox({
                    dateSerializationFormat: 'yyyy-MM-dd',
                    displayFormat: "dd/MM/yyyy",
                    type: 'date',
                    value: (obj.value !== '' && obj.value !== null) ? new Date(obj.value) : new Date()
                });
            }
        });
    }

    //hàm lưu data cho danh mục động, nếu rowId != null là cập nhật ngược lại tạo mới
    saveDataForDynamicCategory(rowId: number = null): boolean{
        const self = this;
        var objData =[];

        this.dynamicData.forEach(obj =>{
            this.formData = new DynamicValueDto();        
            var id = 'dynamic'+obj.name;
            self.formData.key = obj.name;
            if(obj.typeField == 1)
            {
                if($("#"+id).dxCheckBox('instance').option('value')){
                    self.formData.value = "true";
                }else{
                    self.formData.value = "false";
                }
            }
            else if(obj.typeField == 2){
                self.formData.value = $("#"+id).val().toString();
            }else if(obj.typeField == 3){
                self.formData.value = $("#"+id).dxSelectBox('instance').option('value');
            }else if(obj.typeField == 4){
                self.formData.value = $("#"+id).dxDateBox('instance').option('value').toString();
            }
            self.formData.dynamicFieldId = obj.id;
            self.formData.objectId = self.currentId;
            if(rowId){
                self.formData.id = obj.valueId;
            }
            objData.push(self.formData);
        });

        this._dynamicFieldService.insertUpdateDataForDynamicCategory(objData).subscribe((res: any) => {
            this.saveSuccess.emit(true);
        }, () => {
            this.saveSuccess.emit(false);
        });
        return;
    }

    saveDynamicValue(): boolean{
        const self = this;
        var objData =[];
        this.dynamicData.forEach(obj =>{
            this.formData = new DynamicValueDto();        
            var id = 'dynamic'+obj.name;
            self.formData.key = obj.name;
            if(obj.typeField == 1)
            {
                if($("#"+id).dxCheckBox('instance').option('value')){
                    self.formData.value = "true";
                }else{
                    self.formData.value = "false";
                }
            }
            else if(obj.typeField == 2){
                self.formData.value = $("#"+id).val().toString();
            }else if(obj.typeField == 3){
                self.formData.value = $("#"+id).dxSelectBox('instance').option('value');
            }else if(obj.typeField == 4){
                self.formData.value = $("#"+id).dxDateBox('instance').option('value').toString();
            }
            self.formData.dynamicFieldId = obj.id;
            self.formData.objectId = self.currentId;
            self.formData.id = obj.valueId;
            //console.log(self.formData);
            objData.push(self.formData);
        });
        this._dynamicFieldService.insertUpdateDynamicFields(objData).subscribe((res: any) => {

        });
        return;
    }

    saveDynamicValueForDocument(documentId: number): boolean{
        const self = this;
        var objData =[];
        this.dynamicData.forEach(obj =>{
            self.formData = new DynamicValueDto();        
            var id = 'dynamic'+obj.name;
            self.formData.key = obj.name;
            if(obj.typeField == 1)
            {
                if($("#"+id).dxCheckBox('instance').option('value')){
                    self.formData.value = "true";
                }else{
                    self.formData.value = "false";
                }
            }
            else if(obj.typeField == 2){
                self.formData.value = $("#"+id).val().toString();
            }else if(obj.typeField == 3){
                self.formData.value = $("#"+id).dxSelectBox('instance').option('value');
            }else if(obj.typeField == 4){
                self.formData.value = $("#"+id).dxDateBox('instance').option('value').toString();
            }
            self.formData.dynamicFieldId = obj.id;
            self.formData.objectId = documentId;
            self.formData.id = obj.valueId;
            //console.log(self.formData);
            objData.push(self.formData);
            console.log(objData);
        });
        this._dynamicFieldService.insertUpdateDynamicFields(objData).subscribe((res: any) => {

        });
        return;
    }

    /*------------------------------------------------------------------------------------------------------*/

    //load field từ dynamicTable    
    loadForDynamicTable(inputId:number){
        return new Promise((resolve, reject)=>{
            if (this.error) {
                const self = this;
                // this.href = this.router.url;
                // console.log(this.router.url);
                this.currentId = inputId;              
                self._dynamicTableService.getFieldsForDynamicForm(inputId).subscribe((res: any) => {
                    if (res.length > 0 ) {
                        self.isSetData = true;
                        self.dynamicData = res;           
                        var div = '';
                        self.objectID = this.currentId;
                        self.moduleId = res[0].moduleID;
                        res.forEach(function (value, index, array) {
                            div += '<div class="col-sm-6 form-inline" style="padding-right: 0;">';
                            div += '<div class="col-sm-3" style="padding-left:0;">'+value.nameDescription+' :</div>'
                            //comment vì dòng này thêm vào class col sẽ làm element bị thụt vào thêm 1 đoạn nữa
                            //div += '<div class="col-sm-'+value.width+'">'
                            div += '<div class="col-sm-9">';
                            let style = "";
                            if(index > 1 && index % 2 == 1){
                                style += "width: 100%; margin-top: 7px;";
                            }
                            else{ 
                                style += "width: 100%;";
                            }
                            if(value.typeField == 2){ // input
                                //khi tạo mới dùng store khác, k có trường value Id, comment những dòng dưới để không set value cho input
                                // if(value.valueId != 0){
                                //     div += '<input id="dynamic'+value.name+'" type="text" class="form-control" style="'+ style +'" value="'+value.value+'" >'
                                // }else{
                                    div += '<input id="dynamic'+value.name+'" type="text" class="form-control" style="'+ style +'" >'
                                // }
                            }else if(value.typeField == 3 || value.typeField == 1 || value.typeField == 4){ // combobox,checkbox,datebox
                                div += '<div id="dynamic'+value.name+'" style="'+ style +'"></div>';
                            }

                            div += '</div></div>';
                        });

                        self.dynamicFields = this._sanitizer.bypassSecurityTrustHtml(div);
                    }else{
                        self.isSetData = false;
                        self.dynamicFields = this._sanitizer.bypassSecurityTrustHtml("");
                    }
                    resolve('done');
                });
            } else {
                reject('error');
            }
        }).then((val) => {
                    if(this.isSetData){
                        setTimeout(() => 
                        {
                            this.dateboxForDynamicTable(1);
                            this.selectBoxForDynamicTable(1);
                            this.checkboxForDynamicTable(1);
                        },500)}
                    },
                (err) => {
                    console.error(err);
                    });
    }

    //load field cho filter  
    loadForDynamicFilter(inputId:number){
        return new Promise((resolve, reject)=>{
            if (this.error) {
                const self = this;
                // this.href = this.router.url;
                // console.log(this.router.url);
                this.currentId = inputId;              
                self._dynamicTableService.getFieldsForDynamicFilter(inputId).subscribe((res: any) => {
                    if (res.length > 0 ) {
                        self.isSetData = true;
                        self.dynamicData = res;           
                        var div = '';
                        self.objectID = this.currentId;
                        self.moduleId = res[0].moduleID;
                        res.forEach(function (value, index, array) {
                            div += '<div class="col-sm-6 form-inline" style="padding-right: 0;">';
                            div += '<div class="col-sm-3" style="padding-left:0;">'+value.nameDescription+' :</div>'
                            //comment vì dòng này thêm vào class col sẽ làm element bị thụt vào thêm 1 đoạn nữa
                            //div += '<div class="col-sm-'+value.width+'">'
                            div += '<div class="col-sm-9">';
                            let style = "";
                            if(index > 1 && index % 2 == 1){
                                style += "width: 100%; margin-top: 7px;";
                            }
                            else{ 
                                style += "width: 100%;";
                            }
                            if(value.typeField == 2){ // input
                                //khi tạo mới dùng store khác, k có trường value Id, comment những dòng dưới để không set value cho input
                                // if(value.valueId != 0){
                                //     div += '<input id="dynamic'+value.name+'" type="text" class="form-control" style="'+ style +'" value="'+value.value+'" >'
                                // }else{
                                    div += '<input id="dynamic'+value.name+'Filter" type="text" class="form-control" style="'+ style +'" >'
                                // }
                            }else if(value.typeField == 3 || value.typeField == 1 || value.typeField == 4){ // combobox,checkbox,datebox
                                div += '<div id="dynamic'+value.name+'Filter" style="'+ style +'"></div>';
                            }

                            div += '</div></div>';
                        });

                        self.dynamicFields = this._sanitizer.bypassSecurityTrustHtml(div);
                    }else{
                        self.isSetData = false;
                        self.dynamicFields = this._sanitizer.bypassSecurityTrustHtml("");
                    }
                    resolve('done');
                });
            } else {
                reject('error');
            }
        }).then((val) => {
                    if(this.isSetData){
                        setTimeout(() => 
                        {
                            this.dateboxForDynamicTable(2);
                            this.selectBoxForDynamicTable(2);
                            this.checkboxForDynamicTable(2);
                        },500)}
                    },
                (err) => {
                    console.error(err);
                    });
    }


    //load Data for edit
    loadForDynamicTableForEdit(inputId : any, rowId: number){ 
        return new Promise((resolve, reject)=>{
            if (this.error) {
                const self = this;
                this.currentId = inputId; 
                var x: any;
                var i = 0;
                self._dynamicTableService.getDataForDynamicTable(inputId, rowId).subscribe((e: any) => {
                    x = Object.values(e[0]);
                });
                self._dynamicTableService.getFieldsForDynamicForm(inputId).subscribe((res: any) => {             
                    
                    res.forEach(obj => {
                        obj.value = x[i]==null? "":x[i].toString();
                        //obj.value = x[i].toString();
                        i++;
                    });
                    //;
                    console.log(res);
                    if (res.length > 0 ) {
                        self.isSetData = true;
                        self.dynamicData = res;           
                        var div = '';
                        self.objectID = this.currentId;
                        self.moduleId = res[0].moduleID;
                        res.forEach(function (value, index, array) {
                            div += '<div class="col-sm-6 form-inline" style="padding-right: 0;">';
                            div += '<div class="col-sm-3" style="padding-left:0;">'+value.nameDescription+' :</div>'
                            //comment vì dòng này thêm vào class col sẽ làm element bị thụt vào thêm 1 đoạn nữa
                            //div += '<div class="col-sm-'+value.width+'">'
                            div += '<div class="col-sm-9">';
                            let style = "";
                            if(index > 1 && index % 2 == 1){
                                style += "width: 100%; margin-top: 7px;";
                            }
                            else{
                                style += "width: 100%;";
                            }
                            if(value.typeField == 2){ // input                              
                                if(value.valueId != 0){
                                    div += '<input id="dynamic'+value.name+'" type="text" class="form-control" style="'+ style +'" value="'+value.value+'" >'
                                }else{
                                    div += '<input id="dynamic'+value.name+'" type="text" class="form-control" style="'+ style +'" >'
                                }
                            }else if(value.typeField == 3 || value.typeField == 1 || value.typeField == 4){ // combobox,checkbox,datebox
                                div += '<div id="dynamic'+value.name+'" style="'+ style +'"></div>';
                            }

                            div += '</div></div>';

                        });

                        self.dynamicFields = this._sanitizer.bypassSecurityTrustHtml(div);
                    }else{
                        self.isSetData = false;
                        self.dynamicFields = this._sanitizer.bypassSecurityTrustHtml("");
                    }
                    resolve('done');
                });
            } else {
                reject('error');
            }
        }).then((val) => {
                    if(this.isSetData){
                        setTimeout(() => 
                        {
                            this.dateboxForDynamicTableEdit(1);
                            this.selectBoxForDynamicTable(1);
                            this.checkboxForDynamicTable(1);
                        },500)}
                    },
                (err) => {
                    console.error(err);
                    });
    }

    //lưu giá trị field động cho dynamicTable
    saveforDynamicTable(inputId:number){
       
        const self = this;
        var objData =[];
        this.dynamicData.forEach(obj =>{
        
            self.formData = new DynamicValueDto();
            var id = 'dynamic'+ obj.name;
            self.formData.key = obj.name;
            self.formData
            if(obj.typeField == 1)
            {
                if($("#"+id).dxCheckBox('instance').option('value')){
                    self.formData.value = "true";
                }else{
                    self.formData.value = "false";
                }
            }
            else if(obj.typeField == 2){
                self.formData.value = $("#"+id).val().toString();
            }else if(obj.typeField == 3){
                self.formData.value = $("#"+id).dxSelectBox('instance').option('value');
            }else if(obj.typeField == 4){
                self.formData.value = $("#"+id).dxDateBox('instance').option('value').toString();
            }
            self.formData.dynamicFieldId = obj.id;
            self.formData.id = obj.valueId;
            
            objData.push(self.formData);

            
        });
        var sendData = [];
        
        objData.forEach(e => {
            var sendItem = {Key:e.key,Value:e.value};
            sendData.push(sendItem);
            
        });
        this._dynamicTableService.createDynamicTable(inputId,sendData).subscribe((res: any) => {
            this.message = res.message;
            this.saveSuccess.emit(res.status);
        },(err) => {
            this.message = err;
            this.saveSuccess.emit(false);
        });
    }

    //lưu giá trị field động cho dynamicTable
    editforDynamicTable(inputId:number,rowId:number){
       
        const self = this;
        var objData =[];
        this.dynamicData.forEach(obj =>{
        
            self.formData = new DynamicValueDto();
            var id = 'dynamic'+ obj.name;
            self.formData.key = obj.name;
            self.formData
            if(obj.typeField == 1)
            {
                if($("#"+id).dxCheckBox('instance').option('value')){
                    self.formData.value = "true";
                }else{
                    self.formData.value = "false";
                }
            }
            else if(obj.typeField == 2){
                self.formData.value = $("#"+id).val().toString();
            }else if(obj.typeField == 3){
                self.formData.value = $("#"+id).dxSelectBox('instance').option('value');
            }else if(obj.typeField == 4){
                self.formData.value = $("#"+id).dxDateBox('instance').option('value').toString();
            }
            self.formData.dynamicFieldId = obj.id;
            self.formData.id = obj.valueId;
            
            objData.push(self.formData);

            
        });
        var sendData = [];   
        objData.forEach(e => {
            var sendItem = {Key:e.key,Value:e.value};
            sendData.push(sendItem);     
        });
        this._dynamicTableService.editDynamicTable(inputId,rowId,sendData).subscribe((res: any) => {   
            this.message = res.message;
            this.saveSuccess.emit(res.status);
        },(err) => {
            this.message = err;
            this.saveSuccess.emit(false);
        });
    }

    //search 
    searchForDynamicTable(inputId:number){
        const self = this;
        var objData =[];
        this.dynamicData.forEach(obj =>{
        
            self.formData = new DynamicValueDto();
            var id = 'dynamic'+ obj.name+'Filter';
            self.formData.key = obj.name;
            self.formData
            if(obj.typeField == 1)
            {
                if($("#"+id).dxCheckBox('instance').option('value')){
                    self.formData.value = "true";
                }else{
                    self.formData.value = "false";
                }
            }
            else if(obj.typeField == 2){
                self.formData.value = $("#"+id).val().toString();
            }else if(obj.typeField == 3){
                self.formData.value = $("#"+id).dxSelectBox('instance').option('value');
            }else if(obj.typeField == 4){
                self.formData.value = $("#"+id).dxDateBox('instance').option('value').toString();
            }
            self.formData.dynamicFieldId = obj.id;
            self.formData.id = obj.valueId;
            
            objData.push(self.formData);

            
        });
        var sendData = [];   
        objData.forEach(e => {
            var sendItem = {Key:e.key,Value:e.value};
            sendData.push(sendItem);     
        });
        this._dynamicTableService.searchData(inputId,sendData).subscribe((res: any) => {   
            this.searchData = res.data;
            this.message = res.message;
            this.saveSuccess.emit(res.status);
        },(err) => {
            this.message = err
            this.saveSuccess.emit(false);
        });
    }

    resetFilter(){
        this.dynamicData.forEach(obj =>{
            var id = 'dynamic'+ obj.name+'Filter';
            if(obj.typeField == 1)
            {
                $("#"+id).dxCheckBox({
                    value: true
                });
            }
            else if(obj.typeField == 2){
                $("#"+id).val("");
            }else if(obj.typeField == 3){
                $("#"+id).dxSelectBox("instance").option("value", null );
            }else if(obj.typeField == 4){
                ($("#"+id) as any).dxDateBox({
                    displayFormat: "dd/MM/yyyy",
                    type: 'date',
                    value: null
                });
            }          
        });
    }

    dateboxForDynamicTable(type: number){
        this.dynamicData.forEach(obj => {
            if(obj.typeField == 4){
                console.log(obj.value);
                var id = type == 1?'dynamic'+obj.name:'dynamic'+obj.name+'Filter';
                let x = document.getElementById(id);
                ($("#"+id) as any).dxDateBox({
                    dateSerializationFormat: 'yyyy-MM-dd',
                    displayFormat: "dd/MM/yyyy",
                    type: 'date',
                    value: (obj.value !== '' && obj.value !== null) ? new Date(obj.value) : new Date()
                });
            }
        });
    }

    dateboxForDynamicTableEdit(type: number){
        this.dynamicData.forEach(obj => {
            if(obj.typeField == 4){
                console.log(obj.value);
                var id = type == 1?'dynamic'+obj.name:'dynamic'+obj.name+'Filter';
                let x = document.getElementById(id);
                
                ($("#"+id) as any).dxDateBox({
                    displayFormat: "dd/MM/yyyy",
                    type: 'date',
                    value: (obj.value !== '' && obj.value !== null) ? new Date(obj.value) : null
                });
            }
        });
    }

    selectBoxForDynamicTable(type: number){
        this.dynamicData.forEach(obj =>{
            if(obj.typeField == 3){
                this.dataSourceSelectBox(obj.id, this.parameters).then((val) => {setTimeout(() => {
                    var dataSource = [];
                    dataSource.push(val);
                    var id = type == 1?'dynamic'+obj.name:'dynamic'+obj.name+'Filter';
                    $("#"+id).dxSelectBox({
                        items: dataSource[0],
                        valueExpr: "key",
                        displayExpr: "value",
                    });
                    if(obj.value != 0 && obj.value != "")
                    {
                        $("#"+id).dxSelectBox("instance").option("value", obj.value );
                    }
                },500) });
            }
        });
    }

    checkboxForDynamicTable(type: number){
        this.dynamicData.forEach(obj =>{
            if(obj.typeField == 1){
                var id = type == 1?'dynamic'+obj.name:'dynamic'+obj.name+'Filter';
                var check = true;
                //var check = (obj.value == "true") ? true : false;
                if(obj.value){
                    check = (obj.value == "true"||obj.value == true) ? true : false;
                }
                $("#"+id).dxCheckBox({
                    value: check
                });
            }
        });
    }

    ngOnInit() {
        //this.loadDynamicField(10);
    }

}
