import { TestBed } from '@angular/core/testing';

import { WordsLoaderService } from './words-loader.service';

describe('WordsLoaderService', () => {
  let service: WordsLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordsLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
