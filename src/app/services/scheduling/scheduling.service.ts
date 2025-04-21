import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SchedulingService {
  private http = inject(HttpClient);

  constructor() {}

  getAvailability(first: any, last: any) {
    return this.http.get(
      `https://app-talksmartly-academy.fly.dev/v1/availability?startDate=${first}&endDate=${last}`
    );
  }

  createScheduleStudent(data: any) {
    return this.http.post(
      'https://app-talksmartly-academy.fly.dev/v1/class/schedule',
      data
    );
  }

  getUsers() {
    return this.http.get(
      'https://app-users-talksmartly-academy.fly.dev/v1/auth/users'
    );
  }

  createClassAdmin(data: any) {
    return this.http.post(
      'https://app-talksmartly-academy.fly.dev/v1/availability/create',
      data
    );
  }

  editClassAdmin(data: any) {
    return this.http.put(
      'https://app-talksmartly-academy.fly.dev/v1/class/update',
      data
    );
  }

  cancelClassStudent(id: any) {
    return this.http.delete(
      `https://app-talksmartly-academy.fly.dev/v1/classes/${id}/cancel`
    );
  }

  createAvailabilityTeacher(data: any) {
    return this.http.post(
      'https://app-talksmartly-academy.fly.dev/v1/availability/create',
      data
    );
  }

  deleteClass(id: any) {
    return this.http.delete(
      `https://app-talksmartly-academy.fly.dev/v1/classes/${id}/delete`
    );
  }
}
