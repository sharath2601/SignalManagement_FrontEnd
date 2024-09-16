import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Pagination {
  TOTALPAGES: any;
  REMAININGITEMS: any;
  STARTPAGE: any = 1;
  ENDPAGE: any;

  remainingItemsExist(totalCount: any, pageCount: any) {
    if (totalCount % pageCount !== 0) {
      return true;
    }
    return false;
  }

  getTotalPageCount(totalCount: any, pageCount: any) {
    this.TOTALPAGES = Math.trunc(totalCount / pageCount);
    return this.TOTALPAGES;
  }

  getRemainingItems(totalCount: any, pageCount: any) {
    this.REMAININGITEMS = Math.trunc(totalCount % pageCount);
    return this.REMAININGITEMS;
  }

  getEndPage(totalCount: any, pageCount: any) {
    const isexists = this.remainingItemsExist(totalCount, pageCount);
    if (isexists) {
      return this.ENDPAGE = this.getTotalPageCount(totalCount, pageCount) + 1;
    } else {
      return this.ENDPAGE = this.getTotalPageCount(totalCount, pageCount);
    }
  }
}
