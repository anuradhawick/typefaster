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

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss',
})
export class SetupComponent implements OnInit {
  @Output() start = new EventEmitter<any>();
  protected form: FormGroup;
  protected stories: StorySummaryEntry[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      story: this.fb.control(1, [Validators.required]),
      case: this.fb.control(true, [Validators.required]),
      special: this.fb.control(true, [Validators.required]),
      randomise: this.fb.control(false, [Validators.required]),
      time: this.fb.control(1, [Validators.min(1), Validators.max(5)]),
    });
  }

  ngOnInit(): void {
    this.http
      .get('/assets/stories/summary.json')
      .subscribe(stories => (this.stories = stories as StorySummaryEntry[]));
  }
}
