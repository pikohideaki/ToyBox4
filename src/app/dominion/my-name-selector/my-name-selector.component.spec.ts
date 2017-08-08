import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNameSelectorComponent } from './my-name-selector.component';

describe('MyNameSelectorComponent', () => {
  let component: MyNameSelectorComponent;
  let fixture: ComponentFixture<MyNameSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNameSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyNameSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
