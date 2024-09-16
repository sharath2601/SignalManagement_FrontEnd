import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TableUpdation {
  rowIndex: any;
  product: any;
  domain: any;
  name: any;
  method: any;
  caseCount: any;
  current_review_period: any;
  short_comment: any;
  previous_short_comment: any;
  statSigComment: Comment;
  result: Result;
  signal_id: any;
  is_pt: any;
  is_valid: any;
  level: any;
  prodFamily: any;
  page: any;
}

class Comment {
  comment: any;
  user: any;
  timeStamp: any;
}

class Result {
  PRR: any;
  PRR_Lower_Bound: any;
  PRR_Upper_Bound: any;
  ChiSquare: any;
}
