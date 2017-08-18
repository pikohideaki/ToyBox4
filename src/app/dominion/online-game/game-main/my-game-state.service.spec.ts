import { TestBed, inject } from '@angular/core/testing';

import { MyGameStateService } from './my-game-state.service';

describe('MyGameStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyGameStateService]
    });
  });

  it('should be created', inject([MyGameStateService], (service: MyGameStateService) => {
    expect(service).toBeTruthy();
  }));
});
