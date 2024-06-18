import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {Teenpatti32CardsComponent } from './teenpatti_32cards.component';

describe('Teenpatti32CardsComponent', () => {
  let component: Teenpatti32CardsComponent;
  let fixture: ComponentFixture<Teenpatti32CardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Teenpatti32CardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Teenpatti32CardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
