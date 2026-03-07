// ─── Audio Playback Engine (S11–S16) ─────────────────────────────────────────
// Wraps Tone.js Transport for MIDI playback with play/pause/stop/seek/loop/BPM.

import * as Tone from 'tone';
import type { MidiProject, Track } from '../core/types.ts';
import { appState } from '../core/AppState.ts';
import { INSTRUMENT_PRESETS } from '../utils/instruments.ts';

// Locally-mirrored RecursivePartial (same definition as Tone's internal type)
// so we can type partial synth options without reaching into Tone internals.
type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P];
};

// Map GM program → a Tone.js synth options object (simplified palette).
function synthOptionsForProgram(
  program: number,
): RecursivePartial<Tone.SynthOptions> {
  const percussion = program >= 112;
  if (percussion) {
    return {
      oscillator: { type: 'square' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 },
    };
  }

  const entry = INSTRUMENT_PRESETS.find((p) => p.program === program);
  const cat = entry?.category ?? 'Keys';

  switch (cat) {
    case 'Bass':
      return {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.4, release: 0.3 },
      };
    case 'Strings':
    case 'Choir':
      return {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.3, decay: 0.1, sustain: 0.8, release: 0.8 },
      };
    case 'Brass':
    case 'Woodwind':
      return {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.05, decay: 0.1, sustain: 0.7, release: 0.3 },
      };
    case 'Synth Lead':
      return {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.02, decay: 0.1, sustain: 0.6, release: 0.2 },
      };
    case 'Synth Pad':
      return {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.5, decay: 0.2, sustain: 0.9, release: 1.5 },
      };
    case 'Guitar':
      return {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.3, sustain: 0.2, release: 0.5 },
      };
    default: // Keys / Piano
      return {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.3, sustain: 0.1, release: 0.5 },
      };
  }
}

export type PositionUpdateCallback = (
  bar: number,
  beat: number,
  tick: number,
  elapsed: number,
) => void;

export class PlaybackEngine {
  private synths: Map<string, Tone.PolySynth> = new Map();
  private parts: Tone.Part[] = [];
  private positionInterval: ReturnType<typeof setInterval> | null = null;
  private onPositionUpdate: PositionUpdateCallback | null = null;
  private onStopCallback: (() => void) | null = null;
  private projectRef: MidiProject | null = null;

  // ─── Public API ────────────────────────────────────────────────────────────

  /** S11: Begin or resume playback. */
  async play(project: MidiProject): Promise<void> {
    await Tone.start();

    const t = Tone.getTransport();
    const wasPaused = t.state === 'paused';

    if (!wasPaused) {
      this.clearParts();
      t.bpm.value = project.bpm;
      t.cancel();

      const isSoloActive = project.tracks.some((tr) => tr.soloed);
      for (const track of project.tracks) {
        if (track.muted) continue;
        if (isSoloActive && !track.soloed) continue;
        this.scheduleTrack(track, project.ticksPerQuarterNote, t.bpm.value);
      }

      // S15: Loop toggle
      if (appState.playback.loop) {
        const endTick = this.computeEndTick(project);
        const ppq = project.ticksPerQuarterNote;
        const bpm = t.bpm.value;
        const endSeconds = (endTick / ppq) * (60 / bpm);
        t.loop = true;
        t.loopStart = 0;
        t.loopEnd = endSeconds > 0 ? endSeconds : '1m';
      } else {
        t.loop = false;
      }
    }

    t.start();
    this.projectRef = project;
    appState.playback.isPlaying = true;
    this.startPositionPolling();
  }

  /** S11: Pause playback, keeping playhead position. */
  pause(): void {
    Tone.getTransport().pause();
    appState.playback.isPlaying = false;
    this.stopPositionPolling();
  }

  /** S12: Stop playback and reset playhead to zero. */
  stop(): void {
    const t = Tone.getTransport();
    t.stop();
    t.cancel();
    this.clearParts();
    appState.playback.isPlaying = false;
    appState.playback.currentTick = 0;
    this.stopPositionPolling();
    this.notifyPosition(1, 1, 0, 0);
    this.onStopCallback?.();
  }

  /** S13: Seek to an absolute tick position (works while playing or paused). */
  seek(tick: number, project: MidiProject): void {
    const t = Tone.getTransport();
    const ppq = project.ticksPerQuarterNote;
    const bpm = t.bpm.value;
    const seconds = (tick / ppq) * (60 / bpm);

    const wasPlaying = t.state === 'started';

    t.pause();
    t.cancel();
    this.clearParts();

    const isSoloActive = project.tracks.some((tr) => tr.soloed);
    for (const track of project.tracks) {
      if (track.muted) continue;
      if (isSoloActive && !track.soloed) continue;
      this.scheduleTrackFrom(track, ppq, bpm, tick);
    }

    t.seconds = seconds;

    if (wasPlaying) {
      t.start();
      appState.playback.isPlaying = true;
      this.startPositionPolling();
    } else {
      appState.playback.currentTick = tick;
      const [bar, beat, subdivTick] = this.secondsToBarBeat(seconds, bpm);
      this.notifyPosition(bar, beat, subdivTick, seconds);
    }
  }

  /** S15: Toggle looping on/off. Re-applies to the transport if project is known. */
  setLoop(enabled: boolean, project?: MidiProject): void {
    appState.playback.loop = enabled;
    const t = Tone.getTransport();
    if (!enabled) {
      t.loop = false;
      return;
    }
    const proj = project ?? this.projectRef;
    if (!proj) return;
    const ppq = proj.ticksPerQuarterNote;
    const bpm = t.bpm.value;
    const endTick = this.computeEndTick(proj);
    const endSec = (endTick / ppq) * (60 / bpm);
    t.loop = true;
    t.loopStart = 0;
    t.loopEnd = endSec > 0 ? endSec : '1m';
  }

  /** S16: Live BPM change — takes effect immediately without stopping. */
  setBpm(bpm: number, project?: MidiProject): void {
    const clamped = Math.min(300, Math.max(20, bpm));
    Tone.getTransport().bpm.value = clamped;
    appState.playback.bpm = clamped;
    if (project) project.bpm = clamped;
  }

  /** Register a callback for position updates (~40 ms). */
  onPosition(cb: PositionUpdateCallback): void {
    this.onPositionUpdate = cb;
  }

  /** Register a callback invoked when playback stops (auto-stop or explicit stop). */
  onStop(cb: () => void): void {
    this.onStopCallback = cb;
  }

  // ─── Scheduling helpers ────────────────────────────────────────────────────

  private scheduleTrack(track: Track, ppq: number, bpm: number): void {
    this.scheduleTrackFrom(track, ppq, bpm, 0);
  }

  private scheduleTrackFrom(
    track: Track,
    ppq: number,
    bpm: number,
    fromTick: number,
  ): void {
    type NoteEvent = { time: number; note: string; dur: string; vel: number };
    const events: NoteEvent[] = [];

    for (const n of track.notes) {
      if (n.startTick + n.durationTicks <= fromTick) continue;
      const adjustedStart = n.startTick - fromTick;
      const startSec = (adjustedStart / ppq) * (60 / bpm);
      const durSec = (n.durationTicks / ppq) * (60 / bpm);
      events.push({
        time: Math.max(0, startSec),
        note: Tone.Frequency(n.pitch, 'midi').toNote(),
        dur: `${durSec}`,
        vel: n.velocity / 127,
      });
    }

    if (events.length === 0) return;

    const synth = new Tone.PolySynth(
      Tone.Synth,
      synthOptionsForProgram(track.instrument) as unknown as Tone.SynthOptions,
    ).toDestination();
    this.synths.set(track.id, synth);

    const part = new Tone.Part<NoteEvent>((time, value) => {
      synth.triggerAttackRelease(value.note, value.dur, time, value.vel);
    }, events);
    part.start(0);
    this.parts.push(part);
  }

  private clearParts(): void {
    this.parts.forEach((p) => {
      p.dispose();
    });
    this.parts = [];
    this.synths.forEach((s) => {
      s.dispose();
    });
    this.synths.clear();
  }

  // ─── Position polling (S14) ────────────────────────────────────────────────

  private startPositionPolling(): void {
    this.stopPositionPolling();
    this.positionInterval = setInterval(() => {
      const t = Tone.getTransport();
      const seconds = t.seconds;
      const bpm = t.bpm.value;
      const ppq = this.projectRef?.ticksPerQuarterNote ?? 480;
      const tick = Math.round(((seconds * bpm) / 60) * ppq);
      appState.playback.currentTick = tick;
      const [bar, beat, subTick] = this.secondsToBarBeat(seconds, bpm);
      this.notifyPosition(bar, beat, subTick, seconds);

      // Auto-stop at end when not looping
      if (!appState.playback.loop) {
        const endTick = this.computeEndTick(this.projectRef!);
        if (endTick > 0 && appState.playback.currentTick >= endTick) {
          this.stop();
        }
      }
    }, 40);
  }

  private stopPositionPolling(): void {
    if (this.positionInterval !== null) {
      clearInterval(this.positionInterval);
      this.positionInterval = null;
    }
  }

  private notifyPosition(
    bar: number,
    beat: number,
    tick: number,
    elapsed: number,
  ): void {
    this.onPositionUpdate?.(bar, beat, tick, elapsed);
  }

  // ─── Maths ─────────────────────────────────────────────────────────────────

  private secondsToBarBeat(
    seconds: number,
    bpm: number,
  ): [number, number, number] {
    const beatsTotal = (seconds * bpm) / 60;
    const beatsPerBar = this.projectRef?.timeSignature.numerator ?? 4;
    const bar = Math.floor(beatsTotal / beatsPerBar) + 1;
    const beat = Math.floor(beatsTotal % beatsPerBar) + 1;
    const ppq = this.projectRef?.ticksPerQuarterNote ?? 480;
    const tick = Math.round((beatsTotal % 1) * ppq);
    return [bar, beat, tick];
  }

  private computeEndTick(project: MidiProject): number {
    let max = 0;
    for (const t of project.tracks) {
      for (const n of t.notes) {
        const end = n.startTick + n.durationTicks;
        if (end > max) max = end;
      }
    }
    return max;
  }
}

export const playbackEngine = new PlaybackEngine();
