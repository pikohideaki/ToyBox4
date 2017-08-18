import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineRandomizerComponent } from './online-randomizer.component';

describe('RandomizerComponent', () => {
  let component: OnlineRandomizerComponent;
  let fixture: ComponentFixture<OnlineRandomizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineRandomizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineRandomizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
