import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {TeenpattiHiLowComponent } from './teenpatti_hilow.component';

describe('TeenpattiHiLowComponent', () => {
  let component: TeenpattiHiLowComponent;
  let fixture: ComponentFixture<TeenpattiHiLowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeenpattiHiLowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeenpattiHiLowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
