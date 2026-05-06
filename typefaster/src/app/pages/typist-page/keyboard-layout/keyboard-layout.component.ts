import { Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

type Hand = 'left' | 'right';

interface FingerAssignment {
  hand: Hand;
  finger: number; // 0=pinky, 1=ring, 2=middle, 3=index, 4=thumb
}

export interface KeyDef {
  key: string;
  label: string;
  size: number;
}

export interface FingerSlot {
  finger: number;
  label: string;
  homeKey: string;
}

/** Maps shifted symbols to their base key (e.g. '!' → '1'). */
const SHIFT_MAP: Record<string, string> = {
  '!': '1',
  '@': '2',
  '#': '3',
  $: '4',
  '%': '5',
  '^': '6',
  '&': '7',
  '*': '8',
  '(': '9',
  ')': '0',
  _: '-',
  '+': '=',
  '~': '`',
  '{': '[',
  '}': ']',
  '|': '\\',
  ':': ';',
  '"': "'",
  '<': ',',
  '>': '.',
  '?': '/',
};

/** Maps each typeable key to the hand and finger that presses it. */
const KEY_FINGER_MAP: Record<string, FingerAssignment> = {
  '`': { hand: 'left', finger: 0 },
  '1': { hand: 'left', finger: 0 },
  q: { hand: 'left', finger: 0 },
  a: { hand: 'left', finger: 0 },
  z: { hand: 'left', finger: 0 },
  '2': { hand: 'left', finger: 1 },
  w: { hand: 'left', finger: 1 },
  s: { hand: 'left', finger: 1 },
  x: { hand: 'left', finger: 1 },
  '3': { hand: 'left', finger: 2 },
  e: { hand: 'left', finger: 2 },
  d: { hand: 'left', finger: 2 },
  c: { hand: 'left', finger: 2 },
  '4': { hand: 'left', finger: 3 },
  '5': { hand: 'left', finger: 3 },
  r: { hand: 'left', finger: 3 },
  t: { hand: 'left', finger: 3 },
  f: { hand: 'left', finger: 3 },
  g: { hand: 'left', finger: 3 },
  v: { hand: 'left', finger: 3 },
  b: { hand: 'left', finger: 3 },
  ' ': { hand: 'left', finger: 4 },
  '6': { hand: 'right', finger: 3 },
  '7': { hand: 'right', finger: 3 },
  y: { hand: 'right', finger: 3 },
  u: { hand: 'right', finger: 3 },
  h: { hand: 'right', finger: 3 },
  j: { hand: 'right', finger: 3 },
  n: { hand: 'right', finger: 3 },
  m: { hand: 'right', finger: 3 },
  '8': { hand: 'right', finger: 2 },
  i: { hand: 'right', finger: 2 },
  k: { hand: 'right', finger: 2 },
  ',': { hand: 'right', finger: 2 },
  '9': { hand: 'right', finger: 1 },
  o: { hand: 'right', finger: 1 },
  l: { hand: 'right', finger: 1 },
  '.': { hand: 'right', finger: 1 },
  '0': { hand: 'right', finger: 0 },
  '-': { hand: 'right', finger: 0 },
  '=': { hand: 'right', finger: 0 },
  p: { hand: 'right', finger: 0 },
  '[': { hand: 'right', finger: 0 },
  ']': { hand: 'right', finger: 0 },
  '\\': { hand: 'right', finger: 0 },
  ';': { hand: 'right', finger: 0 },
  "'": { hand: 'right', finger: 0 },
  '/': { hand: 'right', finger: 0 },
};

const KEYBOARD_ROWS: KeyDef[][] = [
  [
    { key: '`', label: '`', size: 1 },
    { key: '1', label: '1', size: 1 },
    { key: '2', label: '2', size: 1 },
    { key: '3', label: '3', size: 1 },
    { key: '4', label: '4', size: 1 },
    { key: '5', label: '5', size: 1 },
    { key: '6', label: '6', size: 1 },
    { key: '7', label: '7', size: 1 },
    { key: '8', label: '8', size: 1 },
    { key: '9', label: '9', size: 1 },
    { key: '0', label: '0', size: 1 },
    { key: '-', label: '-', size: 1 },
    { key: '=', label: '=', size: 1 },
    { key: 'backspace', label: '⌫', size: 2 },
  ],
  [
    { key: 'tab', label: 'Tab', size: 1.5 },
    { key: 'q', label: 'Q', size: 1 },
    { key: 'w', label: 'W', size: 1 },
    { key: 'e', label: 'E', size: 1 },
    { key: 'r', label: 'R', size: 1 },
    { key: 't', label: 'T', size: 1 },
    { key: 'y', label: 'Y', size: 1 },
    { key: 'u', label: 'U', size: 1 },
    { key: 'i', label: 'I', size: 1 },
    { key: 'o', label: 'O', size: 1 },
    { key: 'p', label: 'P', size: 1 },
    { key: '[', label: '[', size: 1 },
    { key: ']', label: ']', size: 1 },
    { key: '\\', label: '\\', size: 1.5 },
  ],
  [
    { key: 'caps', label: 'Caps', size: 1.75 },
    { key: 'a', label: 'A', size: 1 },
    { key: 's', label: 'S', size: 1 },
    { key: 'd', label: 'D', size: 1 },
    { key: 'f', label: 'F', size: 1 },
    { key: 'g', label: 'G', size: 1 },
    { key: 'h', label: 'H', size: 1 },
    { key: 'j', label: 'J', size: 1 },
    { key: 'k', label: 'K', size: 1 },
    { key: 'l', label: 'L', size: 1 },
    { key: ';', label: ';', size: 1 },
    { key: "'", label: "'", size: 1 },
    { key: 'enter', label: '↵ Enter', size: 2.25 },
  ],
  [
    { key: 'shift-l', label: '⇧ Shift', size: 2.25 },
    { key: 'z', label: 'Z', size: 1 },
    { key: 'x', label: 'X', size: 1 },
    { key: 'c', label: 'C', size: 1 },
    { key: 'v', label: 'V', size: 1 },
    { key: 'b', label: 'B', size: 1 },
    { key: 'n', label: 'N', size: 1 },
    { key: 'm', label: 'M', size: 1 },
    { key: ',', label: ',', size: 1 },
    { key: '.', label: '.', size: 1 },
    { key: '/', label: '/', size: 1 },
    { key: 'shift-r', label: '⇧ Shift', size: 2.75 },
  ],
];

/** Left-hand finger slots ordered left-to-right (pinky → thumb). */
const LEFT_FINGER_SLOTS: FingerSlot[] = [
  { finger: 0, label: 'Pinky', homeKey: 'A' },
  { finger: 1, label: 'Ring', homeKey: 'S' },
  { finger: 2, label: 'Middle', homeKey: 'D' },
  { finger: 3, label: 'Index', homeKey: 'F' },
  { finger: 4, label: 'Thumb', homeKey: '⎵' },
];

/** Right-hand finger slots ordered left-to-right (thumb → pinky) to mirror the keyboard. */
const RIGHT_FINGER_SLOTS: FingerSlot[] = [
  { finger: 4, label: 'Thumb', homeKey: '⎵' },
  { finger: 3, label: 'Index', homeKey: 'J' },
  { finger: 2, label: 'Middle', homeKey: 'K' },
  { finger: 1, label: 'Ring', homeKey: 'L' },
  { finger: 0, label: 'Pinky', homeKey: ';' },
];

const HOME_KEYS = new Set(['a', 's', 'd', 'f', 'j', 'k', 'l', ';']);

@Component({
  selector: 'app-keyboard-layout',
  standalone: true,
  imports: [NgClass],
  templateUrl: './keyboard-layout.component.html',
  styleUrl: './keyboard-layout.component.scss',
})
export class KeyboardLayoutComponent {
  /** The next key the user should press, or null when there is no active target. */
  nextKey = input<string | null>(null);

  protected readonly rows = KEYBOARD_ROWS;
  protected readonly leftSlots = LEFT_FINGER_SLOTS;
  protected readonly rightSlots = RIGHT_FINGER_SLOTS;

  /** Normalises the input key to its base key identifier used in KEY_FINGER_MAP. */
  private readonly normalizedKey = computed<string | null>(() => {
    const k = this.nextKey();
    if (!k) return null;
    return SHIFT_MAP[k] ?? k.toLowerCase();
  });

  private readonly activeAssignment = computed<FingerAssignment | null>(() => {
    const k = this.normalizedKey();
    return k ? KEY_FINGER_MAP[k] ?? null : null;
  });

  protected isKeyTarget(keyDef: KeyDef): boolean {
    const nk = this.normalizedKey();
    return !!nk && keyDef.key === nk;
  }

  protected isHomeKey(keyDef: KeyDef): boolean {
    return HOME_KEYS.has(keyDef.key);
  }

  protected keyWidth(size: number): string {
    return `${size * 44}px`;
  }

  protected keyFlex(size: number): string {
    return `${size} 1 0%`;
  }

  protected getKeyClasses(keyDef: KeyDef): Record<string, boolean> {
    const assignment = KEY_FINGER_MAP[keyDef.key];
    const classes: Record<string, boolean> = {
      'key-target': this.isKeyTarget(keyDef),
      'key-home': this.isHomeKey(keyDef),
    };
    if (assignment !== undefined) {
      classes[`finger-${assignment.finger}`] = true;
    }
    return classes;
  }

  protected isFingerActive(hand: Hand, finger: number): boolean {
    const a = this.activeAssignment();
    return !!a && a.hand === hand && a.finger === finger;
  }

  protected isSpaceTarget(): boolean {
    return this.normalizedKey() === ' ';
  }
}
