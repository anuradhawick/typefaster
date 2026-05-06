import {
  AfterViewInit,
  afterNextRender,
  Component,
  ElementRef,
  Injector,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-word-span',
  standalone: true,
  imports: [],
  templateUrl: './word-span.component.html',
  styleUrl: './word-span.component.scss',
})
export class WordSpanComponent implements AfterViewInit {
  private el = inject(ElementRef);
  private injector = inject(Injector);

  word = input.required<string>();
  active = input<boolean>(false);
  color = input<string>('');
  lineChanged = output<void>();

  private spanElement: HTMLElement;

  constructor() {
    effect(() => {
      const active = this.active();
      this.word(); // track word changes so we re-check position after shifts
      if (!this.spanElement || !active) {
        return;
      }
      afterNextRender(
        {
          read: () => {
            if (this.spanElement.offsetTop > 55) {
              this.lineChanged.emit();
            }
          },
        },
        { injector: this.injector }
      );
    });
  }

  ngAfterViewInit(): void {
    this.spanElement = this.el.nativeElement.querySelector('span')!;
  }
}
