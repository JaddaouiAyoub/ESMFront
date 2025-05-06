import { TestBed } from '@angular/core/testing';

import { HistoriqueReceptionService } from './historique-reception.service';

describe('HistoriqueReceptionService', () => {
  let service: HistoriqueReceptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriqueReceptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
