import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.API_BASE_URL_USERS;

  constructor() {}

  login(data: any) {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  sendEmail(data: any) {
    return this.http.post(`${this.apiUrl}/auth/password-reset/request`, data);
  }

  newPassword(data: any) {
    return this.http.post(`${this.apiUrl}/auth/password-reset/confirm`, data);
  }

  logout() {
    const data = {};
    return this.http.post(`${this.apiUrl}/auth/logout`, data);
  }
}
