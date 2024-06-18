import { TestBed } from '@angular/core/testing';

import { SupportRequestService } from './support-request.service';

describe('SupportRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupportRequestService = TestBed.get(SupportRequestService);
    expect(service).toBeTruthy();
  });
});
