import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { StorySummaryEntry } from '../../interfaces/story';

@Component({
  selector: 'app-stories-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './stories-page.component.html',
  styleUrl: './stories-page.component.scss',
})
export class StoriesPageComponent implements OnInit {
  private http = inject(HttpClient);
  protected stories: StorySummaryEntry[] = [];

  ngOnInit(): void {
    this.http
      .get<StorySummaryEntry[]>('/assets/stories/summary.json')
      .subscribe(stories => (this.stories = stories));
  }
}
