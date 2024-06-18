import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {TeenpattiPokerComponent } from './teenpatti_poker.component';

describe('TeenpattiPokerComponent', () => {
  let component: TeenpattiPokerComponent;
  let fixture: ComponentFixture<TeenpattiPokerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeenpattiPokerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeenpattiPokerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
