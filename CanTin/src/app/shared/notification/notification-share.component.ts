import { Injectable } from "@angular/core";
import { Notification_DataServiceProxy } from "@shared/service-proxies/service-proxies";

@Injectable({
    providedIn: 'root',
})
export class NotificationShare {
    constructor(private _notification_dataService: Notification_DataServiceProxy){

    }

    public createNotification(templateId: number, users: number[], typeNotifications: number[], template: any, link: String){
        
        let data: any = {
            "templateId": templateId,
            "users": users,
            "typeNotifications": typeNotifications,
            "template": template,
            "link": link,
            "objectId": 0
        };

        this._notification_dataService.addNotification_data(data).subscribe(res => {
            abp.notify.success("Gửi thông báo thành công", "Thông báo", {
                "positionClass": "toast-top-right"
            })
        }, error => {
            abp.notify.error(error.message, "Đã xảy ra lỗi", {
                "positionClass": "toast-top-right"
            })
        });
    }
}