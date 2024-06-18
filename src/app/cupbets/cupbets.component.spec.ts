import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CupbetsComponent } from './cupbets.component'; 

describe('CupbetsComponent', () => {
  let component: CupbetsComponent;
  let fixture: ComponentFixture<CupbetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CupbetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CupbetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
