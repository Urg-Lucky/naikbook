import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SportsOuterComponent } from './sports-outer.component';

describe('SportsOuterComponent', () => {
  let component: SportsOuterComponent;
  let fixture: ComponentFixture<SportsOuterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SportsOuterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SportsOuterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
