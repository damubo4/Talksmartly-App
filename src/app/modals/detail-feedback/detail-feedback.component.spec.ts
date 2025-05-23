import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFeedbackComponent } from './detail-feedback.component';

describe('DetailFeedbackComponent', () => {
  let component: DetailFeedbackComponent;
  let fixture: ComponentFixture<DetailFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
