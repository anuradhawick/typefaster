import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { StorySummaryEntry } from '../../interfaces/story';

@Component({
  selector: 'app-stories-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './stories-page.component.html',
  styleUrl: './stories-page.component.scss',
})
export class StoriesPageComponent {
  private http = inject(HttpClient);
  protected stories = toSignal(
    this.http.get<StorySummaryEntry[]>('/assets/stories/summary.json'),
    { initialValue: [] as StorySummaryEntry[] }
  );
}
