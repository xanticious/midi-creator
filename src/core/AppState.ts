import type { MidiProject, PlaybackState } from "./types.ts";

// ─── AppState Singleton ──────────────────────────────────────────────────────

export function createDefaultProject(): MidiProject {
  return {
    title: "Untitled Project",
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
  private static instance: AppState | undefined;

  project: MidiProject = createDefaultProject();
  playback: PlaybackState = createDefaultPlaybackState();
  /** Raw bytes of the most-recently opened .mid file (parsed in S4). */
  pendingMidiBuffer: ArrayBuffer | null = null;
  pendingMidiFilename: string | null = null;
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

  setPendingMidi(buffer: ArrayBuffer, filename: string): void {
    this.pendingMidiBuffer = buffer;
    this.pendingMidiFilename = filename;
  }

  clearPendingMidi(): void {
    this.pendingMidiBuffer = null;
    this.pendingMidiFilename = null;
  }

  loadProject(project: MidiProject): void {
    this.project = project;
    this.playback = createDefaultPlaybackState();
    this.clearPendingMidi();
    this._dirty = false;
  }

  reset(): void {
    this.project = createDefaultProject();
    this.playback = createDefaultPlaybackState();
    this.clearPendingMidi();
    this._dirty = false;
  }
}

export const appState = AppState.getInstance();
