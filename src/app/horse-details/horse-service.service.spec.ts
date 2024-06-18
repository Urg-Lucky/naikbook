import { TestBed } from '@angular/core/testing';

import { HorseServiceService } from './horse-service.service';

describe('HorseServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HorseServiceService = TestBed.get(HorseServiceService);
    expect(service).toBeTruthy();
  });
});
