import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import {
  NgbCollapseModule,
  NgbDropdownModule,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
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
  protected ts = inject(ThemeService);
  protected isMenuCollapsed = signal(true);
  protected links = [
    { title: 'Home', fragment: 'home', icon: 'house-door' },
    { title: 'Stories', fragment: 'stories', icon: 'bookmark' },
    { title: 'About', fragment: 'about', icon: 'file-person' },
  ];
}
