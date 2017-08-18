import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnPlayerAreaComponent } from './turn-player-area.component';

describe('TurnPlayerAreaComponent', () => {
  let component: TurnPlayerAreaComponent;
  let fixture: ComponentFixture<TurnPlayerAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnPlayerAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnPlayerAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
