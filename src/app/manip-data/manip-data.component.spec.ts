import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManipDataComponent } from './manip-data.component';

describe('ManipDataComponent', () => {
  let component: ManipDataComponent;
  let fixture: ComponentFixture<ManipDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManipDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManipDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
