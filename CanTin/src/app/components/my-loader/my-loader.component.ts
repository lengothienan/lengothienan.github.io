// my-loader.component.ts
import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-my-loader',
  templateUrl: './my-loader.component.html',
  styleUrls: ['./my-loader.component.css']
})
export class MyLoaderComponent extends AppComponentBase implements OnInit {

  loading: boolean;

  constructor(injector: Injector, private loaderService: LoaderService) {
    super(injector);
    
    this.loaderService.isLoading.subscribe((v) => {
      // this.loading = v;
      if(v) this.spinnerService.show();
      else
        this.spinnerService.hide();
    });

  }
  ngOnInit() {
  }

}