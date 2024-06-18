import { TestBed } from '@angular/core/testing';

import { WithdrawRequestService } from './withdraw-request.service';

describe('WithdrawRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WithdrawRequestService = TestBed.get(WithdrawRequestService);
    expect(service).toBeTruthy();
  });
});
