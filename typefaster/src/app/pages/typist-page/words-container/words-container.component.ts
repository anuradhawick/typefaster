import { Component, computed, effect, input, signal } from '@angular/core';
import { WordSpanComponent } from '../word-span/word-span.component';
import { History } from '../../../interfaces/typist';

@Component({
  selector: 'app-words-container',
  standalone: true,
  imports: [WordSpanComponent],
  templateUrl: './words-container.component.html',
  styleUrl: './words-container.component.scss',
})
export class WordsContainerComponent {
  words = input.required<string[]>();

  protected renderedWords = signal<string[]>([]);
  protected index = signal(0);

  private typedWords: string[] = [];
  private peek = signal('');
  private wordOffset = 0;
  private readonly windowSize = 50;
  private time: number = -1;
  private history: History = {
    typed: [],
    rendered: [],
    time: [],
  };

  constructor() {
    // Initialise the rendered window whenever the word list changes.
    effect(() => {
      this.renderedWords.set(this.words().slice(0, this.windowSize));
    });
  }

  reset() {
    this.renderedWords.set(this.words().slice(0, this.windowSize));
    this.typedWords = [];
    this.index.set(0);
    this.time = -1;
    this.peek.set('');
    this.wordOffset = 0;
    this.history = {
      typed: [],
      rendered: [],
      time: [],
    };
  }

  pushWord(word: string) {
    this.peek.set('');
    this.typedWords.push(word);
    this.history.time.push(Date.now() - this.time);
    this.history.typed.push(word);
    this.history.rendered.push(this.renderedWords()[this.index()]);
    this.time = Date.now();
    this.index.update(i => i + 1);
  }

  peekWord(word: string) {
    this.peek.set(word);
    if (this.time < 0) {
      this.time = Date.now();
    }
  }

  compare(typed: string, rendered: string, partial = false) {
    if (partial) {
      return rendered.startsWith(typed);
    }
    return typed === rendered;
  }

  evaluateWord(index: number): string {
    const currentIndex = this.index();
    const rendered = this.renderedWords();
    const peek = this.peek();

    if (index < currentIndex) {
      return this.compare(this.typedWords[index], rendered[index])
        ? 'correct'
        : 'wrong';
    }
    if (index > currentIndex) {
      return '';
    }
    if (peek.length > 0) {
      return this.compare(peek, rendered[currentIndex], true) ? '' : 'wrong';
    }
    return '';
  }

  shift(index: number) {
    this.typedWords = [];
    const words = this.words();
    let sliced = words.slice(
      this.wordOffset + index,
      this.wordOffset + index + this.windowSize
    );

    if (sliced.length < this.windowSize) {
      this.wordOffset = 0;
      sliced = [...sliced, ...words.slice(0, this.windowSize - sliced.length)];
    } else {
      this.wordOffset += index;
    }

    this.renderedWords.set(sliced);
    this.index.set(0);
  }

  /** Signal with the current active rendered word, or null when there is none. */
  readonly activeWord = computed<string | null>(() => {
    const words = this.renderedWords();
    const idx = this.index();
    if (!words || idx >= words.length) return null;
    return words[idx];
  });

  finish(): History {
    return this.history;
  }
}
