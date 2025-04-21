import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAddAdminComponent } from './confirm-add-admin.component';

describe('ConfirmAddAdminComponent', () => {
  let component: ConfirmAddAdminComponent;
  let fixture: ComponentFixture<ConfirmAddAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmAddAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmAddAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
