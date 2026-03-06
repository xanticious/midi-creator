// ─── Music Theory Utils ───────────────────────────────────────────────────────

export const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
] as const;

/**
 * Convert a MIDI pitch number to a note name string (e.g. 60 → "C4").
 */
export function midiToNoteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  const name = NOTE_NAMES[midi % 12];
  return `${name}${octave}`;
}

/**
 * Convert a note name string to a MIDI pitch number (e.g. "C4" → 60).
 */
export function noteNameToMidi(name: string): number {
  const match = name.match(/^([A-G]#?)(-?\d+)$/);
  if (!match) throw new Error(`Invalid note name: ${name}`);
  const noteIndex = NOTE_NAMES.indexOf(match[1] as (typeof NOTE_NAMES)[number]);
  const octave = parseInt(match[2], 10);
  return (octave + 1) * 12 + noteIndex;
}

/**
 * Convert ticks to seconds given BPM and PPQ.
 */
export function ticksToSeconds(
  ticks: number,
  bpm: number,
  ppq: number,
): number {
  return (ticks / ppq) * (60 / bpm);
}

/**
 * Convert seconds to ticks given BPM and PPQ.
 */
export function secondsToTicks(
  seconds: number,
  bpm: number,
  ppq: number,
): number {
  return Math.round(seconds * (bpm / 60) * ppq);
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
