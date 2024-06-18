import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JodicrossingComponent } from './jodicrossing.component';

describe('JodicrossingComponent', () => {
  let component: JodicrossingComponent;
  let fixture: ComponentFixture<JodicrossingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JodicrossingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JodicrossingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
