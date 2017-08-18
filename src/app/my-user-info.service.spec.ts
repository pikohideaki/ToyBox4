import { TestBed, inject } from '@angular/core/testing';

import { MyUserInfoService } from './my-user-info.service';

describe('MyUserInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyUserInfoService]
    });
  });

  it('should be created', inject([MyUserInfoService], (service: MyUserInfoService) => {
    expect(service).toBeTruthy();
  }));
});
