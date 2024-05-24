import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankPrizeComponent } from './rank-prize.component';

describe('RankPrizeComponent', () => {
  let component: RankPrizeComponent;
  let fixture: ComponentFixture<RankPrizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankPrizeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RankPrizeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('ranking', 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
