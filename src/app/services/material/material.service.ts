import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private http = inject(HttpClient);

  constructor() {}

  getMaterial() {
    return this.http.get(
      `https://app-users-talksmartly-academy.fly.dev/v1/material/study-material`
    );
  }

  createFile(formData: any) {
    return this.http.post(
      'https://app-users-talksmartly-academy.fly.dev/v1/material/study-material',
      formData
    );
  }

  deleteFile(level: any, name: any) {
    return this.http.delete(
      `https://app-users-talksmartly-academy.fly.dev/v1/material/study-material/${level}/${name}`
    );
  }
}
