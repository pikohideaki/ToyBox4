import { TestBed, inject } from '@angular/core/testing';

import { GameRoomsService } from './game-rooms.service';

describe('GameRoomsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameRoomsService]
    });
  });

  it('should be created', inject([GameRoomsService], (service: GameRoomsService) => {
    expect(service).toBeTruthy();
  }));
});
