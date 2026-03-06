import type { Track, Note, MidiProject } from "./types.ts";

// ─── Project Helpers ─────────────────────────────────────────────────────────

export function createEmptyProject(title: string = "Untitled"): MidiProject {
  return {
    title,
    bpm: 120,
    timeSignature: { numerator: 4, denominator: 4 },
    ticksPerQuarterNote: 480,
    tracks: [],
  };
}

// ─── Track Helpers ───────────────────────────────────────────────────────────

let _trackIdCounter = 0;

export function createTrack(overrides: Partial<Track> = {}): Track {
  return {
    id: `track-${++_trackIdCounter}`,
    name: `Track ${_trackIdCounter}`,
    instrument: 0,
    channel: overrides.channel ?? (_trackIdCounter - 1) % 16,
    notes: [],
    muted: false,
    soloed: false,
    ...overrides,
  };
}

export function createNote(overrides: Partial<Note> = {}): Note {
  return {
    pitch: 60,
    startTick: 0,
    durationTicks: 480,
    velocity: 100,
    ...overrides,
  };
}

export function addNoteToTrack(track: Track, note: Note): Track {
  return { ...track, notes: [...track.notes, note] };
}

export function removeNoteFromTrack(track: Track, index: number): Track {
  const notes = track.notes.filter((_, i) => i !== index);
  return { ...track, notes };
}

export function sortNotes(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => a.startTick - b.startTick);
}
