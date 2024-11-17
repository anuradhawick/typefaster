import { Injectable, afterNextRender } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  userTheme = 'system';
  systemTheme = new BehaviorSubject('system');

  constructor() {
    afterNextRender(
      { mixedReadWrite: () => {
        // restore user choice
        this.userTheme = localStorage.getItem('theme') || 'system';
        if (this.userTheme !== 'system') {
            (document.body as HTMLElement).setAttribute('data-bs-theme', this.userTheme);
        }
        // if user choice is sytem use it
        this.systemTheme.subscribe(theme => {
            if (this.userTheme === 'system') {
                (document.body as HTMLElement).setAttribute('data-bs-theme', theme);
            }
        });
        this.watchSystemTheme();
    } },
      
    );
  }

  activate(theme: string) {
    localStorage.setItem('theme', theme);
    this.userTheme = theme;
    if (this.userTheme !== 'system') {
      (document.body as HTMLElement).setAttribute('data-bs-theme', theme);
    } else {
      const matchDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');
      const theme = matchDarkMedia.matches ? 'dark' : 'light';
      (document.body as HTMLElement).setAttribute('data-bs-theme', theme);
    }
  }

  watchSystemTheme(): void {
    const matchDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const theme = matchDarkMedia.matches ? 'dark' : 'light';
    this.systemTheme.next(theme);

    matchDarkMedia.addEventListener('change', e => {
      const theme = e.matches ? 'dark' : 'light';
      this.systemTheme.next(theme);
    });
  }
}
