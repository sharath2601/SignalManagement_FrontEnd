import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserUpdate {
  id: string;
  isAdmin: string;
  isSafetyGroup: string;
  isManager: string;
  isActive: string;
  email: string;
  userName: string;
  name: string;
}
