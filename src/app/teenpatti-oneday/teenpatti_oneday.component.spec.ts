import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {TeenpattiOneDayComponent } from './teenpatti_oneday.component';

describe('TeenpattiOneDayComponent', () => {
  let component: TeenpattiOneDayComponent;
  let fixture: ComponentFixture<TeenpattiOneDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeenpattiOneDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeenpattiOneDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
