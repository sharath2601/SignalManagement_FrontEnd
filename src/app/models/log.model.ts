import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class Log {
  user: string;
  method: string;
  time: string;
  date: string;
  complete_time: string;
  toLocale: string;
}
