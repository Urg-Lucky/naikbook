import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {TeenpattiTestComponent } from './teenpatti_test.component';

describe('TeenpattiTestComponent', () => {
  let component: TeenpattiTestComponent;
  let fixture: ComponentFixture<TeenpattiTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeenpattiTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeenpattiTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
