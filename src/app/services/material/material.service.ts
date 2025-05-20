import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.API_BASE_URL_USERS;

  constructor() {}

  getMaterial() {
    return this.http.get(`${this.apiUrl}/material/study-material`);
  }

  createFile(formData: any) {
    return this.http.post(`${this.apiUrl}/material/study-material`, formData);
  }

  deleteFile(level: any, name: any) {
    return this.http.delete(
      `${this.apiUrl}/material/study-material/${level}/${name}`
    );
  }
}
