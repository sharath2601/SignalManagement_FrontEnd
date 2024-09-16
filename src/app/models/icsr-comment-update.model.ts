import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class IcsrCommentUpdate {
  caseId: string;
  comment: string;
  isPt: any;
}
