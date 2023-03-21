import { Injectable } from "@angular/core";

@Injectable()
export class FormatService {
    formatNumber(value: any): string {
        if (typeof (value) !== 'number') {
            value = parseFloat(value);
        }

        return value.toLocaleString('vi');
    }

    unformatNumber(value: any): string {
        if (!value) {
            return value;
        }

        return value.replace(/[.]/g, '');
    }
}