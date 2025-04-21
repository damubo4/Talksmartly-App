import { TestBed } from '@angular/core/testing';

import { PersonalizedService } from './personalized.service';

describe('PersonalizedService', () => {
  let service: PersonalizedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalizedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
