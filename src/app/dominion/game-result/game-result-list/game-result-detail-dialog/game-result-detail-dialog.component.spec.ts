import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameResultDetailDialogComponent } from './game-result-detail-dialog.component';

describe('GameResultDetailDialogComponent', () => {
  let component: GameResultDetailDialogComponent;
  let fixture: ComponentFixture<GameResultDetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameResultDetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameResultDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
