import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {TeenpattiAndarBaharComponent } from './teenpatti_andarbahar.component';

describe('TeenpattiAndarBaharComponent', () => {
  let component: TeenpattiAndarBaharComponent;
  let fixture: ComponentFixture<TeenpattiAndarBaharComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeenpattiAndarBaharComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeenpattiAndarBaharComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
