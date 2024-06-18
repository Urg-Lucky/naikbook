import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeenpattiAaaComponent } from './teenpatti_aaa.component';

describe('TeenpattiAaaComponent', () => {
  let component: TeenpattiAaaComponent;
  let fixture: ComponentFixture<TeenpattiAaaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TeenpattiAaaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeenpattiAaaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
