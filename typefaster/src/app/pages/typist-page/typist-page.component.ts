import {
  Component,
  DestroyRef,
  OnDestroy,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Subscription, interval, map, take } from 'rxjs';
import { WordsContainerComponent } from './words-container/words-container.component';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { History } from '../../interfaces/typist';
import { StoryEntry } from '../../interfaces/story';
import { WordsLoaderService } from './services/words-loader.service';
import { KeyboardLayoutComponent } from './keyboard-layout/keyboard-layout.component';

@Component({
  selector: 'app-typist-page',
  standalone: true,
  imports: [
    WordsContainerComponent,
    KeyboardLayoutComponent,
    FormsModule,
    DatePipe,
    DecimalPipe,
  ],
  providers: [WordsLoaderService],
  templateUrl: './typist-page.component.html',
  styleUrl: './typist-page.component.scss',
})
export class TypistPageComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private ws = inject(WordsLoaderService);
  private destroyRef = inject(DestroyRef);

  protected wordsContainer =
    viewChild<WordsContainerComponent>('wordsContainer');

  protected story = signal<StoryEntry | null>(null);
  protected time = signal(0);
  protected words = signal<string[]>([]);
  protected kind = signal('text');

  private started = signal(false);
  protected ended = signal(false);
  protected summary = signal<History | null>(null);
  protected word = signal('');
  protected showKeyboard = signal(false);

  /** Current countdown value in seconds; null means the timer hasn't started yet. */
  protected countdown = signal<number | null>(null);

  private timerSubscription: Subscription | null = null;

  /**
   * The next keyboard key the user should press.
   * Returns a space when the current word is fully typed, or null when
   * there is no active session / the game has ended.
   */
  readonly nextKey = computed<string | null>(() => {
    const container = this.wordsContainer();
    if (this.ended() || !container) return null;
    const activeWord = container.activeWord();
    if (activeWord == null) return null;
    if (this.word().length >= activeWord.length) return ' ';
    return activeWord[this.word().length];
  });

  constructor() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const story = params.get('story');
        const parsedTime = Number.parseInt(params.get('time') ?? '', 10);

        this.time.set(Number.isFinite(parsedTime) ? parsedTime : 0);
        this.kind.set(story === 'numbers' ? 'number' : 'text');

        if (!story) {
          this.story.set(null);
          this.words.set([]);
          return;
        }

        this.ws.load(params).subscribe(([storyEntry, words]) => {
          this.story.set(storyEntry);
          this.words.set(words);
        });
      });
  }

  reset() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
    this.wordsContainer()?.reset();
    this.started.set(false);
    this.ended.set(false);
    this.countdown.set(null);
    this.summary.set(null);
    this.word.set('');
    this.showKeyboard.set(false);
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  typing(event: KeyboardEvent) {
    event.preventDefault();
    if (!this.started()) {
      this.started.set(true);
      const totalSeconds = this.time() * 60;
      this.countdown.set(totalSeconds);
      this.timerSubscription = interval(1000)
        .pipe(
          map(i => totalSeconds - (i + 1)),
          take(totalSeconds)
        )
        .subscribe({
          next: value => this.countdown.set(value),
          complete: () => {
            this.ended.set(true);
            const summary = this.wordsContainer()?.finish() ?? null;
            this.summary.set(summary);
            this.showKeyboard.set(false);
          },
        });
    }

    const container = this.wordsContainer();
    if (event.code === 'Space' || event.key === 'Enter') {
      console.log('word:', this.word());
      container?.pushWord(this.word());
      this.word.set('');
    } else if (event.key === 'Backspace') {
      this.word.update(w => w.slice(0, -1));
    } else if (event.key.length === 1) {
      this.word.update(w => w + event.key);
      container?.peekWord(this.word());
    }
  }

  keydown(event: KeyboardEvent) {
    event.preventDefault();
  }

  totalTime(summary: History) {
    return summary.time.reduce((a, b) => a + b, 0);
  }

  correctWords(summary: History) {
    return summary.rendered
      .map((re, ix) => (summary.typed[ix] === re ? 1 : 0))
      .reduce((a: number, b: number) => a + b, 0);
  }
}
