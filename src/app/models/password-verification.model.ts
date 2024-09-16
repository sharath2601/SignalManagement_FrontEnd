import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PasswordVerification {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
  showPasswordLayout: boolean;
}
