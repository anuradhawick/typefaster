import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { StoryEntry } from '../../interfaces/story';

@Component({
  selector: 'app-story-page',
  standalone: true,
  imports: [NgbCarouselModule],
  templateUrl: './story-page.component.html',
  styleUrl: './story-page.component.scss',
})
export class StoryPageComponent {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  protected story = toSignal(
    this.route.paramMap.pipe(
      switchMap(params =>
        this.http.get<StoryEntry>(`/assets/stories/${params.get('id')}.json`)
      )
    )
  );
}
