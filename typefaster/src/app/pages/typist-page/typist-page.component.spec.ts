import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypistPageComponent } from './typist-page.component';

describe('TypistPageComponent', () => {
  let component: TypistPageComponent;
  let fixture: ComponentFixture<TypistPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypistPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TypistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
