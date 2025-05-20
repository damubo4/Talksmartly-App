import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private http = inject(HttpClient);
  private readonly apiUrlUsers = environment.API_BASE_URL_USERS;

  constructor() {}

  createFeedback(data: any) {
    return this.http.post(`${this.apiUrlUsers}/feedback/create-feedback`, data);
  }

  getFeedback(initDate: any, endDate: any) {
    return this.http.get(
      `${this.apiUrlUsers}/feedback/get-feedback?startDate=${initDate}&endDate=${endDate}`
    );
  }

  getFeedbackById(id: number, initDate: any, endDate: any) {
    return this.http.get(
      `${this.apiUrlUsers}/feedback/get-feedback?pageSize=50&studentId=${id}&startDate=${initDate}&endDate=${endDate}`
    );
  }
}
