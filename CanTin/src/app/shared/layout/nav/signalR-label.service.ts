import { Injectable, Injector, NgZone } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { HubConnection } from '@aspnet/signalr';

@Injectable()
export class SignalRLabelService extends AppComponentBase {

    constructor(
        injector: Injector,
        public _zone: NgZone
    ) {
        super(injector);
    }

    myHub: HubConnection;
    isChatConnected = false;

    configureConnection(connection): void {
        // Set the common hub
        this.myHub = connection;

        // Reconnect if hub disconnects
        connection.onclose(e => {
            this.isChatConnected = false;
            if (e) {
                abp.log.debug('Chat connection closed with error: ' + e);
            } else {
                abp.log.debug('Chat disconnected');
            }

            if (!abp.signalr.autoConnect) {
                return;
            }

            setTimeout(() => {
                connection.start().then(result => {
                    this.isChatConnected = true;
                });
            }, 5000);
        });

        // Register events
        this.registerEvents(connection);
    }

    registerEvents(connection): void {
        console.log("sao k vô");
        connection.on('getLabelRealtime', message => {
            console.log("tội tui dữ");
            console.log(message);
          abp.event.trigger('app.labelSignalR.label', message);
        });
    }

    init(): void {
        this._zone.runOutsideAngular(() => {
            abp.signalr.connect();
            abp.signalr.startConnection(abp.appPath + 'signalr-countNumberHub', connection => {
                console.log('app.chat.connected');
                abp.event.trigger('app.chat.connected');
                this.isChatConnected = true;
                console.log(connection);
                this.configureConnection(connection);
            });
        });
    }
}
