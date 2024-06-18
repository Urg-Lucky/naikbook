import { TestBed } from '@angular/core/testing';

import { SportServiceService } from './sport-service.service';

describe('SportServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SportServiceService = TestBed.get(SportServiceService);
    expect(service).toBeTruthy();
  });
});
