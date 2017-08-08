import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInToGameRoomDialogComponent } from './sign-in-to-game-room-dialog.component';

describe('SignInToGameRoomDialogComponent', () => {
  let component: SignInToGameRoomDialogComponent;
  let fixture: ComponentFixture<SignInToGameRoomDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInToGameRoomDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInToGameRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
