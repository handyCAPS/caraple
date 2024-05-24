import { TestBed } from '@angular/core/testing';

import { GamesDbService } from './games-db.service';
import { MockProvider } from 'ng-mocks';

describe('GamesDbService', () => {
  let service: GamesDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(GamesDbService)
      ]
    });
    service = TestBed.inject(GamesDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
