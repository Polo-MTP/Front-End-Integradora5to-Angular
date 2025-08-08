import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TanksPending } from './tanks-pending';

describe('TanksPending', () => {
  let component: TanksPending;
  let fixture: ComponentFixture<TanksPending>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TanksPending]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TanksPending);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
