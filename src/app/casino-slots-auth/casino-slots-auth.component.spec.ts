import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoSlotsAuthComponent } from './casino-slots-auth.component';

describe('LobbygameComponent', () => {
  let component: CasinoSlotsAuthComponent;
  let fixture: ComponentFixture<CasinoSlotsAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CasinoSlotsAuthComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoSlotsAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
