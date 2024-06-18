import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {TeenpattiMatkaComponent } from './teenpatti_matka.component';

describe('TeenpattiMatkaComponent', () => {
  let component: TeenpattiMatkaComponent;
  let fixture: ComponentFixture<TeenpattiMatkaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeenpattiMatkaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeenpattiMatkaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
