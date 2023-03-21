///<reference path="../node_modules/abp-web-resources/Abp/Framework/scripts/abp.d.ts"/>
///<reference path="../node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.jquery.d.ts"/>
///<reference path="../node_modules/abp-web-resources/Abp/Framework/scripts/libs/abp.signalr.d.ts"/>
///<reference path="../node_modules/moment/moment.d.ts"/>
///<reference path="../node_modules/@types/moment-timezone/index.d.ts"/>

// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;
// declare var $: JQueryStatic;
declare var $: JQuery;
declare var KTOffcanvas: any; // Related to Metronic
declare var KTMenu: any; // Related to Metronic
declare var KTToggle: any; // Related to Metronic
declare var KTUtil: any; // Related to Metronic
declare var KTHeader: any; // Related to Metronic
declare var KTScrolltop: any; // Related to Metronic
declare var StripeCheckout: any;
declare var xlsxParser:xlsxParser;

interface xlsxParser {
    parse(file: any): any;
}

interface JQuery {
    stick_in_parent(option: any): JQuery
    (selector: any): JQuery;
    (selector, selector2): JQuery;
    selectpicker(): JQuery;
    val(selector?: any): any;
    confirm(option?: any): any;
    alert(value?: any): Function;
    ajax(option?: any): Function;
    each(option?: any, callback?: any): any;
    dxSelectBox(): JQuery;
    dxSelectBox(options: 'instance'): any;
    dxSelectBox(options: string): any;
    // tslint:disable-next-line:unified-signatures
    dxSelectBox(options: string, ...params: any[]): any;
    // tslint:disable-next-line:unified-signatures
    dxSelectBox(options: any): JQuery;
    dxDataGrid(): JQuery;
    dxDataGrid(options: 'instance'): any;
    dxDataGrid(options: string): any;
    // tslint:disable-next-line:unified-signatures
    dxDataGrid(options: string, ...params: any[]): any;
    // tslint:disable-next-line:unified-signatures
    dxDataGrid(options: any): JQuery;

    dxDropDownBox(): JQuery;
    dxDropDownBox(options: 'instance'): any;
    dxDropDownBox(options: string): any;
    // tslint:disable-next-line:unified-signatures
    dxDropDownBox(options: string, ...params: any[]): any;
    dxDropDownBox(option: any): JQuery;

    dxTagBox(): JQuery;
    dxTagBox(options: 'instance'): any;
    dxTagBox(options: string): any;
    // tslint:disable-next-line:unified-signatures
    dxTagBox(options: string, ...params: any[]): any;
    dxTagBox(option: any): JQuery

    
    dxScrollable(): JQuery;
    dxScrollable(options: 'instance'): any;
    dxScrollable(options: string): any;
    // tslint:disable-next-line:unified-signatures
    dxScrollable(options: string, ...params: any[]): any;
    dxScrollable(option: any): JQuery

    
    dxTextBox(options: any): any;
    toast(option?: any): any;
    tooltip(option?: any): JQuery;
    popover(option?: any): JQuery;
    metisMenu(option?: any): JQuery;
    slimScroll(option?: any): JQuery;
    collapse(option?: any): JQuery;
    click(option?: any, callback?: any): JQuery;
    fadeOut(option?: any): JQuery;
    addClass(option?: any): JQuery;
    hide(option?: any): JQuery;
    // css(option?: any, callback?: any): JQuery;
    removeClass(option?: any): JQuery;
    ready(option?: any): JQuery;
    on(option?: any, element?: any, callback?: any): JQuery;
    show(option?: any): JQuery;
    hasClass(option?: any): JQuery;
    trigger(option?: any): JQuery;
    slideDown(option?: any): JQuery;
    toggleClass(option?: any, callback?: any): JQuery;
    fadeIn(option?: any): JQuery;
    slideUp(option?: any): JQuery;
    parents(option?: any): JQuery;
    parent(option?: any): JQuery;
    filter(option?: any): JQuery;
    closest(option?: any): JQuery;
    find(option?: any): JQuery;
    children(option?: any): JQuery;
    is(option?: any): JQuery;
    toggle(option?: any): JQuery;
    data(): JQuery;
    when(...option): JQuery;
    done(...option): JQuery;
    then(...option): JQuery;
    gridster(option?: any): any;
    droppable(option?: any): any;
    draggable(option?: any):any

    carousel(option?: any): any;
}

declare namespace abp {
    namespace ui {
        function setBusy(elm?: any, text?: any, optionsOrPromise?: any): void;
    }
}

/**
 * rtl-detect
 */

declare module 'rtl-detect';