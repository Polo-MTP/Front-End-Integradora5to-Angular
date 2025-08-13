import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stadistics } from './stadistics';

describe('Stadistics', () => {
  let component: Stadistics;
  let fixture: ComponentFixture<Stadistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stadistics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stadistics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
