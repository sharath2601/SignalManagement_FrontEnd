import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NarrativeCommentUpdate {
  rI: any;
  aer_number: any;
  comment: Comment;
}

class Comment {
  comment: any;
  user: any;
  time_stamp: any;
}
