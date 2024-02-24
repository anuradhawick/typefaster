import { AfterRenderPhase, Injectable, afterNextRender } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = new BehaviorSubject('light');
  constructor() {
    afterNextRender(
      () => {
        this.theme.subscribe(theme =>
          (document.body as HTMLElement).setAttribute('data-bs-theme', theme)
        );
        this.watchSystemTheme();
      },
      { phase: AfterRenderPhase.MixedReadWrite }
    );
  }

  toggle(dark: boolean) {
    const theme = dark ? 'dark' : 'light';
    this.theme.next(theme);
  }

  watchSystemTheme(): void {
    const matchDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');
    const theme = matchDarkMedia.matches ? 'dark' : 'light';
    this.theme.next(theme);

    matchDarkMedia.addEventListener('change', e => {
      const theme = e.matches ? 'dark' : 'light';
      this.theme.next(theme);
    });
  }
}
