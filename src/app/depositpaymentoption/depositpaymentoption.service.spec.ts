import { TestBed } from '@angular/core/testing';

import { DepositPaymentOptionService } from './depositpaymentoption.service';

describe('DepositPaymentOptionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DepositPaymentOptionService = TestBed.get(DepositPaymentOptionService);
    expect(service).toBeTruthy();
  });
});
