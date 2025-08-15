import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisPeceras } from './mis-peceras';

describe('MisPeceras', () => {
  let component: MisPeceras;
  let fixture: ComponentFixture<MisPeceras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisPeceras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisPeceras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
