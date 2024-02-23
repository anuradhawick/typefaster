import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = 'light';
  constructor() {}

  toggle() {
    if (this.theme === 'light') {
      this.theme = 'dark';
    } else {
      this.theme = 'light';
    }
    (document.body as HTMLElement).setAttribute('data-bs-theme', this.theme);
  }
}
