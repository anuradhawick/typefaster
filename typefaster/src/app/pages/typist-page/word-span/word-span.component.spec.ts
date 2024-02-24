import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSpanComponent } from './word-span.component';

describe('WordSpanComponent', () => {
  let component: WordSpanComponent;
  let fixture: ComponentFixture<WordSpanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordSpanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WordSpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
