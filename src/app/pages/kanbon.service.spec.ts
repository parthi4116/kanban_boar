import { TestBed } from '@angular/core/testing';

import { KanbonService } from './kanbon.service';

describe('KanbonService', () => {
  let service: KanbonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KanbonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
