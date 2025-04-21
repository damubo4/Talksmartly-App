import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private http = inject(HttpClient);

  constructor() {}

  createFeedback(data: any) {
    return this.http.post(
      'https://app-users-talksmartly-academy.fly.dev/v1/feedback/create-feedback',
      data
    );
  }

  getFeedback(initDate: any, endDate: any) {
    return this.http.get(
      `https://app-users-talksmartly-academy.fly.dev/v1/feedback/get-feedback?startDate=${initDate}&endDate=${endDate}`
    );
  }

  getFeedbackById(id: number, initDate: any, endDate: any) {
    return this.http.get(
      `https://app-users-talksmartly-academy.fly.dev/v1/feedback/get-feedback?pageSize=50&studentId=${id}&startDate=${initDate}&endDate=${endDate}`
    );
  }
}
