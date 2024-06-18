import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {Teenpatti7UpDownComponent } from './teenpatti_7updown.component';

describe('Teenpatti7UpDownComponent', () => {
  let component: Teenpatti7UpDownComponent;
  let fixture: ComponentFixture<Teenpatti7UpDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Teenpatti7UpDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Teenpatti7UpDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
