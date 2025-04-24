import { TestBed } from '@angular/core/testing';

import { FaceppService } from './facepp.service';

describe('FaceppService', () => {
  let service: FaceppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaceppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
