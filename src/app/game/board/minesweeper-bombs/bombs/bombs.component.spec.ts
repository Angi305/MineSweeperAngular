import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BombsComponent } from './bombs.component';

describe('BombsComponent', () => {
  let component: BombsComponent;
  let fixture: ComponentFixture<BombsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BombsComponent]
    });
    fixture = TestBed.createComponent(BombsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
