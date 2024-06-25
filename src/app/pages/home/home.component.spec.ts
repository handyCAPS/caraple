import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ClockService } from '../../shared/services/clock.service';
import { MockComponent, MockProvider } from 'ng-mocks';
import { KeyboardComponent } from '../../shared/components/keyboard/keyboard.component';
import { BoardComponent } from '../../shared/components/board/board.component';
import { ClockComponent } from '../../shared/components/clock/clock.component';
import { ScoreboardComponent } from '../../shared/components/scoreboard/scoreboard.component';
import { GamesService } from '../../shared/services/games.service';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let clockServiceSpy: any;

  beforeEach(async () => {
    clockServiceSpy = jasmine.createSpyObj('SpyClockService', ['setClockTime']);
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        MockComponent(KeyboardComponent),
        MockComponent(BoardComponent),
        MockComponent(ScoreboardComponent),
        MockComponent(ClockComponent),
      ],
      providers: [
        {
          provide: ClockService,
          useValue: clockServiceSpy,
        },
        MockProvider(GamesService, {
          afterGame: () => of()
        })
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
