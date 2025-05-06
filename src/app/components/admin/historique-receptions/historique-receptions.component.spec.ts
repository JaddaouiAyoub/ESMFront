import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueReceptionsComponent } from './historique-receptions.component';

describe('HistoriqueReceptionsComponent', () => {
  let component: HistoriqueReceptionsComponent;
  let fixture: ComponentFixture<HistoriqueReceptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueReceptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueReceptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
