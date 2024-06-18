import { TestBed } from '@angular/core/testing';

import { GreyHoundService } from './grey-hound.service';

describe('GreyHoundService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GreyHoundService = TestBed.get(GreyHoundService);
    expect(service).toBeTruthy();
  });
});
