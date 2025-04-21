// session-storage.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TitleHeaderService {
  private storageKey = 'titleHeader';
  private variable$ = new BehaviorSubject<string | null>(
    sessionStorage.getItem(this.storageKey)
  );

  getVariable$() {
    return this.variable$.asObservable();
  }

  setVariable(value: string) {
    sessionStorage.setItem(this.storageKey, value);
    this.variable$.next(value); // notificar a los suscriptores
  }

  clearVariable() {
    sessionStorage.removeItem(this.storageKey);
    this.variable$.next(null);
  }
}
