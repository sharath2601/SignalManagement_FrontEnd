import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Converter {
    convert(str: string) {
        if (str.includes('/')) {
            str = str.replace('/', '__1');
        } else if (str.includes('%')) {
            str = str.replace('%', '__2');
        }

        return str;
    }

    renameObjProp(objArr: any) {
      const iter = objArr.map((ele) => {
        const e = ele.name ? ele.name : ele.Year;
        return e;
      });
      return iter;
    }

    filterYearValues(list: any, year: any) {
      const qs = list.filter((ele) => {
        return ele.Year === year;
      });

      return qs;
    }
}
