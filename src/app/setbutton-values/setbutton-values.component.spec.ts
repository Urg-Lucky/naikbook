import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetbuttonValuesComponent } from './setbutton-values.component';

describe('SetbuttonValuesComponent', () => {
  let component: SetbuttonValuesComponent;
  let fixture: ComponentFixture<SetbuttonValuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SetbuttonValuesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetbuttonValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
