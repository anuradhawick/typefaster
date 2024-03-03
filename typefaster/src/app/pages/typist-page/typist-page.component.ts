import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ReplaySubject,
  Subject,
  Subscription,
  interval,
  map,
  take,
} from 'rxjs';
import { WordsContainerComponent } from './words-container/words-container.component';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { History } from '../../interfaces/typist';
import { StoryEntry } from '../../interfaces/story';
import { WordsLoaderService } from './services/words-loader.service';

const createCountdown = (seconds: number): ReplaySubject<number> => {
  const countdown$ = new ReplaySubject<number>(1);

  interval(1000)
    .pipe(
      map(i => seconds - (i + 1)),
      take(seconds)
    )
    .subscribe({
      next: value => countdown$.next(value),
      complete: () => countdown$.complete(),
    });

  return countdown$;
};

@Component({
  selector: 'app-typist-page',
  standalone: true,
  imports: [
    WordsContainerComponent,
    FormsModule,
    AsyncPipe,
    DatePipe,
    DecimalPipe,
  ],
  providers: [WordsLoaderService],
  templateUrl: './typist-page.component.html',
  styleUrl: './typist-page.component.scss',
})
export class TypistPageComponent implements OnInit, OnDestroy {
  @ViewChild('wordsContainer') wordsContainer: WordsContainerComponent;
  @ViewChild('input') inputEditor: ElementRef;
  protected story: StoryEntry | null = null;
  protected time: number = 0;
  protected words: string[] = [];
  protected timer: ReplaySubject<number>;
  protected started = false;
  protected ended = false;
  protected summary: History | null = null;
  protected kind: string = 'text';
  private input = new Subject<string>();
  private queryParamsSubscription: Subscription;
  private timerSubscription: Subscription;
  private inputSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private ws: WordsLoaderService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.time = parseInt(params.get('time') as string);
      this.kind = params.get('story') === 'numbers'? 'number': 'text';
      this.ws.load(params).subscribe(([story, words]) => {
        this.story = story;
        this.words = words;
      });
    });

    this.inputSubscription = this.input.subscribe((value: string) => {
      this.wordsContainer.pushWord(value);
    });
  }

  reset() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.wordsContainer.reset();
    this.started = false;
    this.ended = false;
    this.timer = new ReplaySubject();
    (this.inputEditor.nativeElement as HTMLInputElement).value = '';
    this.summary = null;
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.inputSubscription) {
      this.inputSubscription.unsubscribe();
    }
  }

  typing(event: KeyboardEvent) {
    if (!this.started) {
      this.started = true;
      this.timer = createCountdown(this.time * 60);
      this.timerSubscription = this.timer.subscribe({
        complete: () => {
          this.ended = true;
          this.summary = this.wordsContainer.finish();
          console.log(this.summary);
        },
      });
    }
    const str = (event.target as HTMLInputElement).value.trim();
    this.wordsContainer.peekWord(str);
    if (event.code === 'Space' || event.key === 'Enter') {
      this.input.next(str);
      (event.target as HTMLInputElement).value = '';
    }
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
