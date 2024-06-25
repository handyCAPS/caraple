import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowWavyComponent } from './arrow-wavy.component';

describe('ArrowWavyComponent', () => {
  let component: ArrowWavyComponent;
  let fixture: ComponentFixture<ArrowWavyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArrowWavyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArrowWavyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
