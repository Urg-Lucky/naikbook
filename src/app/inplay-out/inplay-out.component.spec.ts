import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InplayOutComponent } from './inplay-out.component';

describe('InplayOutComponent', () => {
  let component: InplayOutComponent;
  let fixture: ComponentFixture<InplayOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InplayOutComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InplayOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
