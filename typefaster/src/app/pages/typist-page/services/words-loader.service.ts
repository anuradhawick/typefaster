import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import { StoryEntry } from '../../../interfaces/story';
import { Observable, map, of } from 'rxjs';

@Injectable()
export class WordsLoaderService {
  constructor(private http: HttpClient) {}

  load(params: ParamMap): Observable<[StoryEntry, string[]]> {
    const story = params.get('story') as string;
    let numbers, caseSensitive, allowSpecial, randomise;
    switch (story) {
      case 'numbers':
        numbers = Array(1000)
          .fill(0)
          .map(() => Math.floor(Math.random() * 10000).toString());
        return of([
          {
            images: [],
            prompt: '',
            title: 'Numbers',
            story: numbers.join(' '),
          } as StoryEntry,
          numbers,
        ]);
      default:
        caseSensitive = params.get('case') === 'true';
        allowSpecial = params.get('special') === 'true';
        randomise = params.get('randomise') === 'true';
        return this.loadStory(story, caseSensitive, allowSpecial, randomise);
    }
  }

  loadStory(
    story: string,
    caseSensitive: boolean,
    allowSpecial: boolean,
    randomise: boolean
  ): Observable<[StoryEntry, string[]]> {
    return this.http.get<StoryEntry>(`/assets/stories/${story}.json`).pipe(
      map((story: StoryEntry) => {
        return [
          this.processStory(story, caseSensitive, allowSpecial, randomise),
          story.story.split(' ') as string[],
        ];
      })
    );
  }

  shuffle(array: string[]) {
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  processStory(
    story: StoryEntry,
    caseSensitive: boolean,
    allowSpecial: boolean,
    randomise: boolean
  ): StoryEntry {
    if (!caseSensitive) {
      story.story = story.story.toLowerCase();
    }
    if (!allowSpecial) {
      story.story = story.story.replaceAll(/[^a-zA-Z\s]/g, '');
    }
    if (randomise) {
      console.log(randomise);
      story.story = this.shuffle(story.story.split(' ')).join(' ');
    }
    return story;
  }
}
