import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoSlotsComponent } from './casino-slots.component';

describe('LobbygameComponent', () => {
  let component: CasinoSlotsComponent;
  let fixture: ComponentFixture<CasinoSlotsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CasinoSlotsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
