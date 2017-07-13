import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VictoryPointsCalculatorComponent } from './victory-points-calculator.component';

describe('VictoryPointsCalculatorComponent', () => {
  let component: VictoryPointsCalculatorComponent;
  let fixture: ComponentFixture<VictoryPointsCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VictoryPointsCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VictoryPointsCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
