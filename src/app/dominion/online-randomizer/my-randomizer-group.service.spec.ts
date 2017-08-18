import { TestBed, inject } from '@angular/core/testing';

import { MyRandomizerGroupService } from './my-randomizer-group.service';

describe('MyRandomizerGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyRandomizerGroupService]
    });
  });

  it('should be created', inject([MyRandomizerGroupService], (service: MyRandomizerGroupService) => {
    expect(service).toBeTruthy();
  }));
});
