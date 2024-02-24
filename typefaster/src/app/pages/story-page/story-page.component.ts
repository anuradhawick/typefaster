import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-story-page',
  standalone: true,
  imports: [HttpClientModule, NgbCarouselModule, RouterLink],
  templateUrl: './story-page.component.html',
  styleUrl: './story-page.component.scss',
})
export class StoryPageComponent implements OnInit, OnDestroy {
  protected story: any = null;
  private queryParamsSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const index = params.get('id');
      this.http
        .get(`/assets/stories/${index}.json`)
        .subscribe(story => (this.story = story));
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }
}
