import { TestBed, inject } from '@angular/core/testing';

import { DominionDatabaseService } from './dominion-database.service';

describe('DatabaseObservablesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DominionDatabaseService]
    });
  });

  it('should be created', inject([DominionDatabaseService], (service: DominionDatabaseService) => {
    expect(service).toBeTruthy();
  }));
});
