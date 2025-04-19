import { TestBed } from '@angular/core/testing';

import { ReactsService } from './reacts.service';

describe('ReactsService', () => {
  let service: ReactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
