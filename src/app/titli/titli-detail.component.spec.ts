import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitliDetailComponent } from './titli-detail.component';

describe('MatkaDetailComponent', () => {
  let component: TitliDetailComponent;
  let fixture: ComponentFixture<TitliDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitliDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitliDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
