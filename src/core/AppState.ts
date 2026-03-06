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
  private _dirty: boolean = false;

  private constructor() {}

  static getInstance(): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }
    return AppState.instance;
  }

  isDirty(): boolean {
    return this._dirty;
  }

  markDirty(): void {
    this._dirty = true;
  }

  markClean(): void {
    this._dirty = false;
  }

  loadProject(project: MidiProject): void {
    this.project = project;
    this.playback = createDefaultPlaybackState();
    this._dirty = false;
  }

  reset(): void {
    this.project = createDefaultProject();
    this.playback = createDefaultPlaybackState();
    this._dirty = false;
  }
}

export const appState = AppState.getInstance();
