import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
export class NavbarComponent implements OnInit {
  protected isMenuCollapsed = true;
  protected links = [
    { title: 'Home', fragment: 'home', icon: 'house-door' },
    { title: 'Stories', fragment: 'stories', icon: 'bookmark' },
    { title: 'About', fragment: 'about', icon: 'file-person' },
  ];
  protected theme: string;

  constructor(
    protected ts: ThemeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.ts.systemTheme.subscribe(theme => {
      this.theme = theme;
      // because we use SSR for development
      this.cd.detectChanges();
    });
  }
}
