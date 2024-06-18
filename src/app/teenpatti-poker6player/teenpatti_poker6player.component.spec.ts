import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {TeenpattiPoker6PlayerComponent } from './teenpatti_poker6player.component';

describe('TeenpattiPoker6PlayerComponent', () => {
  let component: TeenpattiPoker6PlayerComponent;
  let fixture: ComponentFixture<TeenpattiPoker6PlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeenpattiPoker6PlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeenpattiPoker6PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
