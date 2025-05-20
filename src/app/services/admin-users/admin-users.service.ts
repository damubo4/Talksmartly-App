import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminUsersService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.API_BASE_URL_USERS;

  constructor() {}

  addUsers(data: any) {
    return this.http.post(`${this.apiUrl}/auth/init-register`, data);
  }

  getUsers() {
    return this.http.get(`${this.apiUrl}/auth/users`);
  }

  editUser(id: any, data: any) {
    return this.http.put(`${this.apiUrl}/auth/users/${id}`, data);
  }

  deleteUser(id: any) {
    return this.http.delete(`${this.apiUrl}/auth/users/${id}`);
  }
}
