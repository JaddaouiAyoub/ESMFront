import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionCommandesComponent } from './reception-commandes.component';

describe('ReceptionCommandesComponent', () => {
  let component: ReceptionCommandesComponent;
  let fixture: ComponentFixture<ReceptionCommandesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionCommandesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionCommandesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
