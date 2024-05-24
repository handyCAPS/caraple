import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardComponent } from './scoreboard.component';
import { MockProvider } from 'ng-mocks';
import { GamesService } from '../../services/games.service';
import { mockGames } from '../../../testing/mock-data/mock-games';
import { of } from 'rxjs';

describe('ScoreboardComponent', () => {
  let component: ScoreboardComponent;
  let fixture: ComponentFixture<ScoreboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreboardComponent],
      providers: [
        MockProvider(GamesService, {
          subToGames: () => of(mockGames)
        })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
