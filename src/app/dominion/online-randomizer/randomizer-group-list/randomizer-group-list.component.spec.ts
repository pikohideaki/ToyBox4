import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomizerGroupListComponent } from './randomizer-group-list.component';

describe('RandomizerGroupListComponent', () => {
  let component: RandomizerGroupListComponent;
  let fixture: ComponentFixture<RandomizerGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomizerGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomizerGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
