import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeenpattiDragonTigerComponent } from './teenpatti_dragontiger.component';

describe('TeenpattiDragonTigerComponent', () => {
  let component: TeenpattiDragonTigerComponent;
  let fixture: ComponentFixture<TeenpattiDragonTigerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TeenpattiDragonTigerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeenpattiDragonTigerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
