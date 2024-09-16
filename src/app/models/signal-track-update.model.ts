import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SignalTrackUpdate {
  signalId: string;
  comment: string;
  priority: string;
  targetDate: string;
  status: string;
  reason: any;
  user: string;
  isPt: any;
  isCustom: any;
}
