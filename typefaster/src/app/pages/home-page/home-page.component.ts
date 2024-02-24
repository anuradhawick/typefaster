import { Component } from '@angular/core';
import { SetupComponent } from './setup/setup.component';
import { Router, RouterModule } from '@angular/router';
import { TypistConfig } from '../../interfaces/config';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SetupComponent, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  constructor(private router: Router) {}
  configCompleted(config: TypistConfig) {
    this.router.navigate(['/typist'], { queryParams: config });
  }
}
