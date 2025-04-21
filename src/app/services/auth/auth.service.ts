import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  constructor() {}

  login(data: any) {
    return this.http.post(
      'https://app-users-talksmartly-academy.fly.dev/v1/auth/login',
      data
    );
  }

  register(data: any) {
    return this.http.post(
      'https://app-users-talksmartly-academy.fly.dev/v1/auth/register',
      data
    );
  }

  sendEmail(data: any) {
    return this.http.post(
      'https://app-users-talksmartly-academy.fly.dev/v1/auth/password-reset/request',
      data
    );
  }

  newPassword(data: any) {
    return this.http.post(
      'https://app-users-talksmartly-academy.fly.dev/v1/auth/password-reset/confirm',
      data
    );
  }

  logout() {
    const data = {};
    return this.http.post(
      'https://app-users-talksmartly.fly.dev/v1/auth/logout',
      data
    );
  }
}
