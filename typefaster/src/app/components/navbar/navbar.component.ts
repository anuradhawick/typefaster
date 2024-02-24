import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import {
  NgbCollapseModule,
  NgbDropdownModule,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    RouterLink,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isMenuCollapsed = true;
  links = [
    { title: 'Home', fragment: 'home' },
    { title: 'Stories', fragment: 'stories' },
    { title: 'About', fragment: 'about' },
  ];
  themeService: ThemeService;

  constructor(ts: ThemeService) {
    this.themeService = ts;
  }
}
