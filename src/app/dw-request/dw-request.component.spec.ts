import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwRequestComponent } from './dw-request.component';

describe('DwRequestComponent', () => {
  let component: DwRequestComponent;
  let fixture: ComponentFixture<DwRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
