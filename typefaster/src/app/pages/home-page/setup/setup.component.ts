import { HttpClient } from '@angular/common/http';
import { Component, inject, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { StorySummaryEntry } from '../../../interfaces/story';
import { TypistConfig } from '../../../interfaces/config';

@Component({
  selector: 'app-setup',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss',
})
export class SetupComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  readonly configCompleted = output<TypistConfig>();
  protected form: FormGroup = this.fb.group({
    story: this.fb.control('1', [Validators.required]),
    case: this.fb.control(true, [Validators.required]),
    special: this.fb.control(false, [Validators.required]),
    randomise: this.fb.control(false, [Validators.required]),
    time: this.fb.control(1, [Validators.min(1), Validators.max(5)]),
  });
  protected stories = toSignal(
    this.http.get<StorySummaryEntry[]>('/assets/stories/summary.json'),
    { initialValue: [] as StorySummaryEntry[] }
  );

  constructor() {
    this.form.controls['story'].valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((story: string | number) => {
        if (story === 'numbers') {
          this.form.controls['case'].disable();
          this.form.controls['special'].disable();
          this.form.controls['randomise'].disable();
        } else {
          this.form.controls['case'].enable();
          this.form.controls['special'].enable();
          this.form.controls['randomise'].enable();
        }
      });
  }
}
