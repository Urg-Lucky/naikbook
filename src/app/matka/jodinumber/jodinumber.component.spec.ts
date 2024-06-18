import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JodinumberComponent } from './jodinumber.component';

describe('JodinumberComponent', () => {
  let component: JodinumberComponent;
  let fixture: ComponentFixture<JodinumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JodinumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JodinumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
