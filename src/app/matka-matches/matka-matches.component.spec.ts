import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatkaMatchesComponent } from './matka-matches.component';

describe('MatkaMatchesComponent', () => {
  let component: MatkaMatchesComponent;
  let fixture: ComponentFixture<MatkaMatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MatkaMatchesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatkaMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
