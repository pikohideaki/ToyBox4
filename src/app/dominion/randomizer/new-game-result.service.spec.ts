import { TestBed, inject } from '@angular/core/testing';

import { NewGameResultService } from './new-game-result.service';

describe('NewGameResultService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewGameResultService]
    });
  });

  it('should be created', inject([NewGameResultService], (service: NewGameResultService) => {
    expect(service).toBeTruthy();
  }));
});
