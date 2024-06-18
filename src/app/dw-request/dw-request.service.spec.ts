import { TestBed } from '@angular/core/testing';

import { DwRequestService } from './dw-request.service';

describe('DwRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DwRequestService = TestBed.get(DwRequestService);
    expect(service).toBeTruthy();
  });
});
