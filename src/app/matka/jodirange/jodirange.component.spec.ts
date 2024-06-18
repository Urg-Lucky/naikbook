import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JodirangeComponent } from './jodirange.component';

describe('JodirangeComponent', () => {
  let component: JodirangeComponent;
  let fixture: ComponentFixture<JodirangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JodirangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JodirangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
