import { TestBed } from '@angular/core/testing';

import { CounterClassesAdminService } from './counter-classes-admin.service';

describe('CounterClassesAdminService', () => {
  let service: CounterClassesAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CounterClassesAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
