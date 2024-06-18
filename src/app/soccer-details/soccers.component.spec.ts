import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {SoccersComponent } from './soccers.component';

describe('SoccersComponent', () => {
  let component: SoccersComponent;
  let fixture: ComponentFixture<SoccersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoccersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoccersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
