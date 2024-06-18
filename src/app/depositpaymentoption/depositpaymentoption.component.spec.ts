import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositPaymentOptionComponent } from './depositpaymentoption.component';

describe('DepositPaymentOptionComponent', () => {
  let component: DepositPaymentOptionComponent;
  let fixture: ComponentFixture<DepositPaymentOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DepositPaymentOptionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositPaymentOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
