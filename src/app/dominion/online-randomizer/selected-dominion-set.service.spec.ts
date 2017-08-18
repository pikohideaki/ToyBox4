import { TestBed, inject } from '@angular/core/testing';

import { SelectedDominionSetService } from './selected-dominion-set.service';

describe('SelectedDominionSetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectedDominionSetService]
    });
  });

  it('should be created', inject([SelectedDominionSetService], (service: SelectedDominionSetService) => {
    expect(service).toBeTruthy();
  }));
});
