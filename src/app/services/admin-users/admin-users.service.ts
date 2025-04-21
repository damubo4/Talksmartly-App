import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminUsersService {
  private http = inject(HttpClient);

  constructor() {}

  addUsers(data: any) {
    return this.http.post(
      'https://app-users-talksmartly-academy.fly.dev/v1/auth/init-register',
      data
    );
  }

  getUsers() {
    return this.http.get(
      'https://app-users-talksmartly-academy.fly.dev/v1/auth/users'
    );
  }

  editUser(id: any, data: any) {
    return this.http.put(
      `https://app-users-talksmartly-academy.fly.dev/v1/auth/users/${id}`,
      data
    );
  }

  deleteUser(id: any) {
    return this.http.delete(
      `https://app-users-talksmartly-academy.fly.dev/v1/auth/users/${id}`
    );
  }
}
