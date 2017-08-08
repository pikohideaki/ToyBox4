import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DominionOnlineComponent } from './dominion-online.component';

describe('DominionOnlineComponent', () => {
  let component: DominionOnlineComponent;
  let fixture: ComponentFixture<DominionOnlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DominionOnlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DominionOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
