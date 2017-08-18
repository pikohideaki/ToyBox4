import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsPileComponent } from './cards-pile.component';

describe('CardsPileComponent', () => {
  let component: CardsPileComponent;
  let fixture: ComponentFixture<CardsPileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsPileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsPileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
