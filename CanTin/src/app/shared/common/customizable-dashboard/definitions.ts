export class WidgetViewDefinition {
    id: string;
    widgetCode: string;
    component: any;
    defaultWidth: number;
    defaultHeight: number;

    constructor(id: string, widgetCode: string, component: any,  defaultWidth: number = 6, defaultHeight: number = 10) {
        this.id = id;
        this.widgetCode = widgetCode;
        this.component = component;
        this.defaultWidth = defaultWidth;
        this.defaultHeight = defaultHeight;
    }
}

export class WidgetFilterViewDefinition {
    id: string;
    widgetCode: string;
    component: any;
    constructor(id: string, widgetCode: string, component: any) {
        this.id = id;
        this.widgetCode = widgetCode;
        this.component = component;
    }
}

