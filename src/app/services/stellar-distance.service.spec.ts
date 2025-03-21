import { TestBed } from '@angular/core/testing';

import { StellarDistanceService } from './stellar-distance.service';

describe('StellarDistanceService', () => {
  let service: StellarDistanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StellarDistanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
