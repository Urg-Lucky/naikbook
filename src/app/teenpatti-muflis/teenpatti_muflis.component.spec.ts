import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {TeenpattiMuflisComponent } from './teenpatti_muflis.component';

describe('TeenpattiMuflisComponent', () => {
  let component: TeenpattiMuflisComponent;
  let fixture: ComponentFixture<TeenpattiMuflisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeenpattiMuflisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeenpattiMuflisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
