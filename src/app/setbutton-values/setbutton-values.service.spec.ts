import { TestBed } from '@angular/core/testing';

import { SetbuttonValuesService } from './setbutton-values.service';

describe('SetbuttonValuesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetbuttonValuesService = TestBed.get(SetbuttonValuesService);
    expect(service).toBeTruthy();
  });
});
