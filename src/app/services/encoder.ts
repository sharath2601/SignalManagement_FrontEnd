import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Encoder {
  encodeStr(str: any) {
    let sq = JSON.stringify(str);
    sq = sq.replace('[', '');
    sq = sq.replace(']', '');
    sq = sq.replace(/"/g, '');
    sq = sq.replace(/,/g, "'");
    return sq;
  }

  decodeStr(str: any) {
    let dq = str;
    dq = dq.replace(/'/g, ',');
    return dq;
  }

  encodePound(str: string) {
    let q: any = str;
    q = q.replace(/£/g, ', ');
    return q;
  }

  validateComment(item: string) {
    const reg = /^[^\s]+(\s+[^\s]+)*$/;
    const res = reg.test(item);
    return res;
  }

  checkCommentOrNotCrossedLimit(str: string) {
    return str.length > 1000 ? true : false;
  }

  convertToQuarters(year: any) {
    const quarters = [
      { 'id': 0, 'name': 'Q1 ' + year },
      { 'id': 1, 'name': 'Q2 ' + year },
      { 'id': 2, 'name': 'Q3 ' + year },
      { 'id': 3, 'name': 'Q4 ' + year }
    ];
    return quarters;
  }

}
