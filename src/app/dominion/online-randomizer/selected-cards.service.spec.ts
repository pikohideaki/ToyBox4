import { TestBed, inject } from '@angular/core/testing';

import { SelectedCardsService } from './selected-cards.service';

describe('SelectedCardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectedCardsService]
    });
  });

  it('should be created', inject([SelectedCardsService], (service: SelectedCardsService) => {
    expect(service).toBeTruthy();
  }));
});
