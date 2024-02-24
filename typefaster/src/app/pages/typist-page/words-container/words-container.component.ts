import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { WordSpanComponent } from '../word-span/word-span.component';
import { History } from '../../../interfaces/typist';

@Component({
  selector: 'app-words-container',
  standalone: true,
  imports: [WordSpanComponent],
  templateUrl: './words-container.component.html',
  styleUrl: './words-container.component.scss',
})
export class WordsContainerComponent implements OnChanges {
  @Input({ required: true }) words: string[];
  protected renderedWords: string[] = [];
  protected typedWords: string[] = [];
  protected index = 0;
  protected peek = '';
  private wordOffset = 0;
  private windowSize = 50;
  private time: number = -1;
  private history: History = {
    typed: [],
    rendered: [],
    time: [],
  };

  constructor(private cd: ChangeDetectorRef) {}

  reset() {
    this.renderedWords = this.words.slice(0, this.windowSize);
    this.typedWords = [];
    this.index = 0;
    this.time = -1;
    this.peek = '';
    this.history = {
      typed: [],
      rendered: [],
      time: [],
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.renderedWords = changes['words'].currentValue.slice(
      0,
      this.windowSize
    );
  }

  pushWord(word: string) {
    this.peek = '';
    this.typedWords.push(word);
    this.history.time.push(Date.now() - this.time);
    this.history.typed.push(word);
    this.history.rendered.push(this.renderedWords[this.index]);
    this.time = Date.now();
    this.index++;
  }

  peekWord(word: string) {
    this.peek = word;
    if (this.time < 0) {
      this.time = Date.now();
    }
  }

  evaluateWord(index: number): string {
    // check typed words
    if (index < this.index) {
      if (this.typedWords[index] === this.renderedWords[index]) {
        return 'correct';
      } else {
        return 'wrong';
      }
    }
    // skip future words
    if (index > this.index) {
      return '';
    }
    // if there is a word to take a peek at and it is correct
    if (this.peek.length > 0) {
      if (!this.renderedWords[this.index].startsWith(this.peek)) {
        return 'wrong';
      } else {
        return '';
      }
    }

    return '';
  }

  shift(index: number) {
    this.typedWords = [];
    this.renderedWords = this.words.slice(
      this.wordOffset + index,
      this.wordOffset + index + this.windowSize
    );

    if (this.renderedWords.length < this.windowSize) {
      this.wordOffset = 0;
      this.renderedWords = [
        ...this.renderedWords,
        ...this.words.slice(0, this.windowSize - this.renderedWords.length),
      ];
    } else {
      this.wordOffset += index;
    }
    this.index = 0;
    this.cd.detectChanges();
  }

  finish(): History {
    return this.history;
  }
}
