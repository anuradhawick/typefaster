import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StorySummaryEntry } from '../../../interfaces/story';
import { TypistConfig } from '../../../interfaces/config';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss',
})
export class SetupComponent implements OnInit {
  @Output() configCompleted = new EventEmitter<TypistConfig>();
  protected form: FormGroup;
  protected stories: StorySummaryEntry[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      story: this.fb.control('1', [Validators.required]),
      case: this.fb.control(true, [Validators.required]),
      special: this.fb.control(false, [Validators.required]),
      randomise: this.fb.control(false, [Validators.required]),
      time: this.fb.control(1, [Validators.min(1), Validators.max(5)]),
    });
  }

  ngOnInit(): void {
    this.form.controls['story'].valueChanges.subscribe(
      (story: string | number) => {
        if (story === 'numbers') {
          this.form.controls['case'].disable();
          this.form.controls['special'].disable();
          this.form.controls['randomise'].disable();
        } else {
          this.form.controls['case'].enable();
          this.form.controls['special'].enable();
          this.form.controls['randomise'].enable();
        }
      }
    );
    this.http
      .get<StorySummaryEntry[]>('/assets/stories/summary.json')
      .subscribe(stories => (this.stories = stories));
  }
}
