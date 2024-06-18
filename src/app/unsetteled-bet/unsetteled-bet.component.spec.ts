import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsetteledBetComponent } from './unsetteled-bet.component';

describe('UnsetteledBetComponent', () => {
  let component: UnsetteledBetComponent;
  let fixture: ComponentFixture<UnsetteledBetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnsetteledBetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsetteledBetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
