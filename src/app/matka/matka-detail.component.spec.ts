import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatkaDetailComponent } from './matka-detail.component';

describe('MatkaDetailComponent', () => {
  let component: MatkaDetailComponent;
  let fixture: ComponentFixture<MatkaDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatkaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatkaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
