import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGameGroupComponent } from './add-game-group.component';

describe('AddGameGroupComponent', () => {
  let component: AddGameGroupComponent;
  let fixture: ComponentFixture<AddGameGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGameGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGameGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
