import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SignalReport {
  intro: string;
  bg: string;
  pdr: string;
  cdr: string;
  sdr: string;
  ldr: string;
  d: string;
  c: string;
}
