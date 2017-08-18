import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPlayerAreaComponent } from './other-player-area.component';

describe('OtherPlayerAreaComponent', () => {
  let component: OtherPlayerAreaComponent;
  let fixture: ComponentFixture<OtherPlayerAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherPlayerAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherPlayerAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
