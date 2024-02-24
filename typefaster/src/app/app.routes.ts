import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { StoriesPageComponent } from './pages/stories-page/stories-page.component';
import { StoryPageComponent } from './pages/story-page/story-page.component';
import { TypistPageComponent } from './pages/typist-page/typist-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'about',
    component: AboutPageComponent,
  },
  {
    path: 'stories',
    component: StoriesPageComponent,
  },
  {
    path: 'stories/:id',
    component: StoryPageComponent,
  },
  {
    path: 'typist',
    component: TypistPageComponent,
  },
];
