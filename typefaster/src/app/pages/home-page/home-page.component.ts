import { Component } from '@angular/core';
import { SetupComponent } from './setup/setup.component';
import { StoriesComponent } from './stories/stories.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SetupComponent, StoriesComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  start(config: any) {
    console.log(config)
  }
}
