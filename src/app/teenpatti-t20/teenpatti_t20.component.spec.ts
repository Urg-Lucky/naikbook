import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {TeenpattiT20Component } from './teenpatti_t20.component';

describe('TeenpattiT20Component', () => {
  let component: TeenpattiT20Component;
  let fixture: ComponentFixture<TeenpattiT20Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeenpattiT20Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeenpattiT20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
