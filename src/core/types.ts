// ─── Core Domain Types ────────────────────────────────────────────────────────

export interface Note {
  /** MIDI note number (0–127) */
  pitch: number;
  /** Start position in ticks */
  startTick: number;
  /** Duration in ticks */
  durationTicks: number;
  /** Velocity (0–127) */
  velocity: number;
}

export interface TimeSignature {
  numerator: number;
  denominator: number;
}

export interface Track {
  id: string;
  name: string;
  /** General MIDI program number (0–127) */
  instrument: number;
  /** MIDI channel (0–15) */
  channel: number;
  notes: Note[];
  /** Whether this track is muted during playback */
  muted: boolean;
  /** Whether this track is soloed */
  soloed: boolean;
}

export interface MidiProject {
  title: string;
  /** Beats per minute */
  bpm: number;
  timeSignature: TimeSignature;
  /** Ticks per quarter note (PPQ) */
  ticksPerQuarterNote: number;
  tracks: Track[];
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTick: number;
  bpm: number;
  loop: boolean;
  loopStartTick: number;
  loopEndTick: number;
}
