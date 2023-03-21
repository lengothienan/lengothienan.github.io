import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet><ngx-spinner class="spiner_global" bdColor="rgba(238,238,238,0.3)" type="ball-clip-rotate" size="medium" color="#5ba7ea"></ngx-spinner>`
})
export class RootComponent {

}
