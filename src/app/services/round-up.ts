import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RoundUp {
    roundValue(num: any) {
        return Math.round( num * 100 + Number.EPSILON ) / 100;
    }
}
