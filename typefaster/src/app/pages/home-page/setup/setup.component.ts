import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss',
})
export class SetupComponent {
  @Output() start = new EventEmitter<any>();
  protected form: FormGroup;
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      story: fb.control('', [Validators.required]),
      case: fb.control(true, [Validators.required]),
      special: fb.control(true, [Validators.required]),
      other: fb.control(true, [Validators.required]),
      time: fb.control(1, [Validators.min(1), Validators.max(5)])
    });
  }
}
