import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAreaComponent } from './shared-area.component';

describe('SharedAreaComponent', () => {
  let component: SharedAreaComponent;
  let fixture: ComponentFixture<SharedAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
