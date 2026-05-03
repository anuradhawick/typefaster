import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-word-span',
  standalone: true,
  imports: [],
  templateUrl: './word-span.component.html',
  styleUrl: './word-span.component.scss',
})
export class WordSpanComponent implements AfterViewInit, OnChanges {
  private el = inject(ElementRef);

  @Input({ required: true }) word: string;
  @Input() active: boolean;
  @Input() color: string;
  @Output() lineChanged = new EventEmitter<void>();
  private spanElement: HTMLElement;

  ngOnChanges(): void {
    if (this.spanElement && this.active && this.spanElement.offsetTop > 55) {
      this.lineChanged.emit();
    }
  }

  ngAfterViewInit(): void {
    this.spanElement = this.el.nativeElement.querySelector('span')!;
  }
}
