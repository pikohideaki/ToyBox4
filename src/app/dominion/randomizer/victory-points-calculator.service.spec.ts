import { TestBed, inject } from '@angular/core/testing';

import { VictoryPointsCalculatorService } from './victory-points-calculator.service';

describe('VictoryPointsCalculatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VictoryPointsCalculatorService]
    });
  });

  it('should be created', inject([VictoryPointsCalculatorService], (service: VictoryPointsCalculatorService) => {
    expect(service).toBeTruthy();
  }));
});
