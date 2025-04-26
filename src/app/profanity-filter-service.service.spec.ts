import { TestBed } from '@angular/core/testing';

import { ProfanityFilterServiceService } from './services/FeedbackService/profanity-filter-service.service';

describe('ProfanityFilterServiceService', () => {
  let service: ProfanityFilterServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfanityFilterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
