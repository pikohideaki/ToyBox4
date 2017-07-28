import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardImageSizeSliderComponent } from './card-image-size-slider.component';

describe('CardImageSizeSliderComponent', () => {
  let component: CardImageSizeSliderComponent;
  let fixture: ComponentFixture<CardImageSizeSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardImageSizeSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardImageSizeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
