import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SchedulingService {
  private http = inject(HttpClient);
  private readonly apiUrlUsers = environment.API_BASE_URL_USERS;
  private readonly apiUrlTS = environment.API_BASE_URL_TS;

  constructor() {}

  getAvailability(first: any, last: any) {
    return this.http.get(
      `${this.apiUrlTS}/availability?startDate=${first}&endDate=${last}`
    );
  }

  createScheduleStudent(data: any) {
    return this.http.post(`${this.apiUrlTS}/class/schedule`, data);
  }

  getUsers() {
    return this.http.get(`${this.apiUrlUsers}/auth/users`);
  }

  createClassAdmin(data: any) {
    return this.http.post(`${this.apiUrlTS}/availability/create`, data);
  }

  editClassAdmin(data: any) {
    return this.http.put(`${this.apiUrlTS}/class/update`, data);
  }

  cancelClassStudent(id: any) {
    return this.http.delete(`${this.apiUrlTS}/classes/${id}/cancel`);
  }

  createAvailabilityTeacher(data: any) {
    return this.http.post(`${this.apiUrlTS}/availability/create`, data);
  }

  deleteClass(id: any) {
    return this.http.delete(`${this.apiUrlTS}/classes/${id}/delete`);
  }
}
