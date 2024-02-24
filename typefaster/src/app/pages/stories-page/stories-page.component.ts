import { Component, OnInit } from '@angular/core';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stories-page',
  standalone: true,
  imports: [SpinnerComponent, HttpClientModule, RouterLink],
  templateUrl: './stories-page.component.html',
  styleUrl: './stories-page.component.scss',
})
export class StoriesPageComponent implements OnInit {
  protected stories: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get('/assets/stories/summary.json')
      .subscribe((stories: any) => (this.stories = stories));
  }
}
