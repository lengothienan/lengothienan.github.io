import { MenuDto } from "@shared/service-proxies/service-proxies";

export class AppMenuItem {
    id = 0;
    name = '';
    permissionName = '';
    icon = '';
    route = '';
    items: AppMenuItem[];
    external: boolean;
    requiresAuthentication: boolean;
    featureDependency: any;
    parameters: {};
    numNoti: number;
    rawSql: string;
    cssFormat: string;
    cssIconFormat: string;
    logoSrc: string;
    sideBarMenuColor: string;
    parent: number;
    index: number;
    countOutOfDate: number;
    constructor(
        name: string,
        permissionName: string,
        icon: string,
        route: string,
        items?: AppMenuItem[],
        id?: number,
        parent?: number,
        index?: number,
        numNoti?: number,
        countOutOfDate?: number,
        rawSql?: string,
        cssFormat?: string,
        cssIconFormat?: string,
        logoSrc?: string,
        sideBarMenuColor?: string,
        external?: boolean,
        parameters?: Object,
        featureDependency?: any,
        requiresAuthentication?: boolean
    ) {
        this.name = name;
        this.permissionName = permissionName;
        this.icon = icon;
        this.route = route;
        this.id = id;
        this.parent = parent;
        this.index = index;
        this.numNoti = numNoti;
        this.countOutOfDate = countOutOfDate;
        this.rawSql = rawSql;
        this.cssFormat = cssFormat;
        this.cssIconFormat = cssIconFormat;
        this.logoSrc = logoSrc;
        this.sideBarMenuColor = sideBarMenuColor;
        this.external = external;
        this.parameters = parameters;
        this.featureDependency = featureDependency;

        if (items === undefined) {
            this.items = [];
        } else {
            this.items = items;
        }

        if (this.permissionName) {
            this.requiresAuthentication = true;
        } else {
            this.requiresAuthentication = requiresAuthentication ? requiresAuthentication : false;
        }
    }

    hasFeatureDependency(): boolean {
        return this.featureDependency !== undefined;
    }

    featureDependencySatisfied(): boolean {
        if (this.featureDependency) {
            return this.featureDependency();
        }

        return false;
    }
}
