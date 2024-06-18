import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitlipopupComponent } from './titlipopup.component';

describe('JodirangeComponent', () => {
  let component: TitlipopupComponent;
  let fixture: ComponentFixture<JodirangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitlipopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitlipopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
