import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomListComponent } from './game-room-list.component';

describe('GameRoomListComponent', () => {
  let component: GameRoomListComponent;
  let fixture: ComponentFixture<GameRoomListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameRoomListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
