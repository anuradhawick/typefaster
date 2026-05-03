import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
export class NavbarComponent implements OnInit {
  protected ts = inject(ThemeService);
  private cd = inject(ChangeDetectorRef);
  protected isMenuCollapsed = true;
  protected links = [
    { title: 'Home', fragment: 'home', icon: 'house-door' },
    { title: 'Stories', fragment: 'stories', icon: 'bookmark' },
    { title: 'About', fragment: 'about', icon: 'file-person' },
  ];
  protected theme: string;

  ngOnInit(): void {
    this.ts.systemTheme.subscribe(theme => {
      this.theme = theme;
      // because we use SSR for development
      this.cd.detectChanges();
    });
  }
}
