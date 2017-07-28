import { TestBed, inject } from '@angular/core/testing';

import { BlackMarketPileShuffledService } from './black-market-pile-shuffled.service';

describe('BlackMarketPileShuffledService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlackMarketPileShuffledService]
    });
  });

  it('should be created', inject([BlackMarketPileShuffledService], (service: BlackMarketPileShuffledService) => {
    expect(service).toBeTruthy();
  }));
});
