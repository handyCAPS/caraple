import { TestBed } from '@angular/core/testing';

import { GamesDbService } from './games-db.service';

describe('GamesDbService', () => {
  let service: GamesDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamesDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
