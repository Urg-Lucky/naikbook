import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {TeenpattiPassaComponent } from './teenpatti_passa.component';

describe('TeenpattiPassaComponent', () => {
  let component: TeenpattiPassaComponent;
  let fixture: ComponentFixture<TeenpattiPassaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeenpattiPassaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeenpattiPassaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
