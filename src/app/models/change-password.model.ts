import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
