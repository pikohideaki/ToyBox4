import { TestBed, inject } from '@angular/core/testing';

import { UtilitiesService } from './utilities.service';

describe('MyUtilitiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilitiesService]
    });
  });

  it('should be created', inject([UtilitiesService], (service: UtilitiesService) => {
    expect(service).toBeTruthy();
  }));
});
