import { Injector, Pipe, PipeTransform } from '@angular/core';
import { FeatureCheckerService } from '@abp/features/feature-checker.service';

@Pipe({
    name: 'typeDatasource'
})
export class TypeDatasourcePipe implements PipeTransform {
    value: string;

    transform(type: number): string {
        switch(type){
            case 1:
                this.value = 'Datasource cứng';
                break;
            case 2:
                this.value = 'Datasource theo Store';
                break;
            case 3:
                this.value = 'Datasource theo Command';
                break;
        }
        return this.value;
    }
}
