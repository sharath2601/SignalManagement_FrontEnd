import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class User {
  user_name: string;
  password: string;
  token: string;
  roles: any;
}
