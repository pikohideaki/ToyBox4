import { TestBed, inject } from '@angular/core/testing';

import { MySyncGroupService } from './my-sync-group.service';

describe('MySyncGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MySyncGroupService]
    });
  });

  it('should be created', inject([MySyncGroupService], (service: MySyncGroupService) => {
    expect(service).toBeTruthy();
  }));
});
