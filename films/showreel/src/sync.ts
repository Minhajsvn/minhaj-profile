// The sound events of the film, computed from the picture code (scripts/export-cues.ts writes
// out/cues.json from this file; it also carries the reading windows the QA scripts use).
//
// This master is silent: it plays muted on the portfolio's homepage and the earshot kit is not
// installed (BRIEF.md). So there are no sound events; the 100 BPM grid still sets every cue.
import { ACT } from './timeline';

export type Kind =
  | 'tick' | 'tock' | 'hit' | 'land' | 'pop' | 'whoosh' | 'riser'
  | 'drop' | 'key' | 'click' | 'snap' | 'swell' | 'bell' | 'suck' | 'text';

export type SoundEvent = {
  f: number;
  kind: Kind;
  weight?: number;
  pan?: number;
  pitch?: number | string;
  apexFrac?: number;
  dur?: number;
  variant?: string;
  id?: string;
};

export default function cues(): SoundEvent[] {
  void ACT;
  return [];
}
