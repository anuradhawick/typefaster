import { HttpClient, HttpClientModule } from '@angular/common/http';
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
import {
  WordsContainerComponent,
} from './words-container/words-container.component';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { History } from '../../interfaces/typist';

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
    HttpClientModule,
    WordsContainerComponent,
    FormsModule,
    AsyncPipe,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './typist-page.component.html',
  styleUrl: './typist-page.component.scss',
})
export class TypistPageComponent implements OnInit, OnDestroy {
  @ViewChild('wordsContainer') wordsContainer: WordsContainerComponent;
  @ViewChild('input') inputEditor: ElementRef;
  protected story: Object | null = null;
  protected case: boolean = false;
  protected special: boolean = false;
  protected randomise: boolean = false;
  protected time: number = 0;
  protected words: string[] = [];
  protected timer: ReplaySubject<number>;
  protected started = false;
  protected ended = false;
  protected summary: History | null = null;
  private input = new Subject<string>();
  private queryParamsSubscription: Subscription;
  private timerSubscription: Subscription;
  private inputSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.case = !!params.get('case');
      this.special = !!params.get('special');
      this.randomise = !!params.get('randomise');
      this.time = 0.1; //parseInt(params.get('time') as any);
      this.http
        .get(`/assets/stories/${params.get('story')}.json`)
        .subscribe((story: any) => {
          this.story = story;
          this.words = (story.story as string).split(' ');
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
    if (event.code === 'Space') {
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
