import { Injectable, afterNextRender, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly userTheme = signal('system');
  systemTheme = new BehaviorSubject('system');

  constructor() {
    afterNextRender({
      mixedReadWrite: () => {
        // restore user choice
        const saved = localStorage.getItem('theme') || 'system';
        this.userTheme.set(saved);
        if (saved !== 'system') {
          (document.body as HTMLElement).setAttribute('data-bs-theme', saved);
        }
        // if user choice is system use it
        this.systemTheme.subscribe(theme => {
          if (this.userTheme() === 'system') {
            (document.body as HTMLElement).setAttribute('data-bs-theme', theme);
          }
        });
        this.watchSystemTheme();
      },
    });
  }

  activate(theme: string) {
    localStorage.setItem('theme', theme);
    this.userTheme.set(theme);
    if (theme !== 'system') {
      (document.body as HTMLElement).setAttribute('data-bs-theme', theme);
    } else {
      const matchDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');
      const t = matchDarkMedia.matches ? 'dark' : 'light';
      (document.body as HTMLElement).setAttribute('data-bs-theme', t);
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
