import type { MidiProject, PlaybackState } from './types.ts';

// ─── AppState Singleton ──────────────────────────────────────────────────────

export function createDefaultProject(): MidiProject {
  return {
    title: 'Untitled Project',
    bpm: 120,
    timeSignature: { numerator: 4, denominator: 4 },
    ticksPerQuarterNote: 480,
    tracks: [],
  };
}

export function createDefaultPlaybackState(): PlaybackState {
  return {
    isPlaying: false,
    currentTick: 0,
    bpm: 120,
    loop: false,
    loopStartTick: 0,
    loopEndTick: 1920,
  };
}

class AppState {
  private static instance: AppState;

  project: MidiProject = createDefaultProject();
  playback: PlaybackState = createDefaultPlaybackState();

  private constructor() {}

  static getInstance(): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }
    return AppState.instance;
  }

  reset(): void {
    this.project = createDefaultProject();
    this.playback = createDefaultPlaybackState();
  }
}

export const appState = AppState.getInstance();
