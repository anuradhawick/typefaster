import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardLayoutComponent } from './keyboard-layout.component';

describe('KeyboardLayoutComponent', () => {
  let component: KeyboardLayoutComponent;
  let fixture: ComponentFixture<KeyboardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyboardLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default nextKey to null', () => {
    expect(component.nextKey).toBeNull();
  });

  it('should render keyboard rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('.keyboard-row');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('should render both hands', () => {
    const hands = fixture.nativeElement.querySelectorAll('.hand');
    expect(hands.length).toBe(2);
  });

  it('should not mark any key as target when nextKey is null', () => {
    const targetKey = fixture.nativeElement.querySelector('.key-target');
    expect(targetKey).toBeNull();
  });

  it('should not activate any finger when nextKey is null', () => {
    const activeFinger = fixture.nativeElement.querySelector('.finger-active');
    expect(activeFinger).toBeNull();
  });

  it('should highlight the target key for a lowercase letter', () => {
    component.nextKey = 'f';
    fixture.detectChanges();
    const targetKey = fixture.nativeElement.querySelector('.key-target');
    expect(targetKey).toBeTruthy();
    expect(targetKey.textContent.trim()).toBe('F');
  });

  it('should highlight the target key for an uppercase letter', () => {
    component.nextKey = 'F';
    fixture.detectChanges();
    const targetKey = fixture.nativeElement.querySelector('.key-target');
    expect(targetKey).toBeTruthy();
    expect(targetKey.textContent.trim()).toBe('F');
  });

  it('should highlight the target key for a shifted symbol', () => {
    component.nextKey = '!';
    fixture.detectChanges();
    const targetKey = fixture.nativeElement.querySelector('.key-target');
    expect(targetKey).toBeTruthy();
    expect(targetKey.textContent.trim()).toBe('1');
  });

  it('should activate the corresponding finger when nextKey is set', () => {
    component.nextKey = 'f';
    fixture.detectChanges();
    const activeFinger = fixture.nativeElement.querySelector('.finger-active');
    expect(activeFinger).toBeTruthy();
  });

  it('should activate the space-bar finger slot when nextKey is space', () => {
    component.nextKey = ' ';
    fixture.detectChanges();
    const spaceKey = fixture.nativeElement.querySelector('.key-space');
    expect(spaceKey.classList).toContain('key-target');
    const activeFinger = fixture.nativeElement.querySelector('.finger-active');
    expect(activeFinger).toBeTruthy();
  });

  it('should clear target highlight when nextKey is reset to null', () => {
    component.nextKey = 'a';
    fixture.detectChanges();
    component.nextKey = null;
    fixture.detectChanges();
    const targetKey = fixture.nativeElement.querySelector('.key-target');
    expect(targetKey).toBeNull();
  });

  it('should show home-row indicators on home keys', () => {
    const homeKeys = fixture.nativeElement.querySelectorAll('.key-home');
    expect(homeKeys.length).toBe(8); // a s d f j k l ;
  });
});
