import { AppMenuItem } from './app-menu-item';

export class AppMenu {
    subscribe(arg0: (res: any) => void) {
        throw new Error("Method not implemented.");
    }
    name = '';
    displayName = '';
    items: AppMenuItem[];

    constructor(name: string, displayName: string, items: AppMenuItem[]) {
        this.name = name;
        this.displayName = displayName;
        this.items = items;
    }
}
