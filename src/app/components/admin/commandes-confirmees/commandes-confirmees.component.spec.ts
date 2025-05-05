import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandesConfirmeesComponent } from './commandes-confirmees.component';

describe('CommandesConfirmeesComponent', () => {
  let component: CommandesConfirmeesComponent;
  let fixture: ComponentFixture<CommandesConfirmeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandesConfirmeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandesConfirmeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
