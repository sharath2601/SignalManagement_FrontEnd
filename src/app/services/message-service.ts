import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class MessageService {
  private subject = new Subject<any>();
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  sendMessage(message: any) {
    this.subject.next({signal: message});
  }

  clearMessages() {
    this.subject.next();
  }

  getMessages(): Observable<any> {
    return this.subject.asObservable();
  }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
}
