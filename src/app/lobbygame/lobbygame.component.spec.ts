import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbygameComponent } from './lobbygame.component';

describe('LobbygameComponent', () => {
  let component: LobbygameComponent;
  let fixture: ComponentFixture<LobbygameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbygameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbygameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
