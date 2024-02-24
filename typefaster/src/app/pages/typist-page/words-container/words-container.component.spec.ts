import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsContainerComponent } from './words-container.component';

describe('WordsContainerComponent', () => {
  let component: WordsContainerComponent;
  let fixture: ComponentFixture<WordsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WordsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
