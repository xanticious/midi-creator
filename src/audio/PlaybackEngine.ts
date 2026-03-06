// ─── Audio Playback Engine ───────────────────────────────────────────────────
// Wraps Tone.js for MIDI playback.

import * as Tone from "tone";
import type { MidiProject, Track } from "../core/types.ts";
import { appState } from "../core/AppState.ts";

export class PlaybackEngine {
  private synths: Map<string, Tone.PolySynth> = new Map();
  private parts: Tone.Part[] = [];

  async start(project: MidiProject): Promise<void> {
    await Tone.start();
    this.stop();

    Tone.getTransport().bpm.value = project.bpm;

    for (const track of project.tracks) {
      if (track.muted) continue;
      this.scheduleTrack(track, project.ticksPerQuarterNote);
    }

    Tone.getTransport().start();
    appState.playback.isPlaying = true;
  }

  stop(): void {
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
    this.parts.forEach((p) => p.dispose());
    this.parts = [];
    this.synths.forEach((s) => s.dispose());
    this.synths.clear();
    appState.playback.isPlaying = false;
    appState.playback.currentTick = 0;
  }

  private scheduleTrack(track: Track, ppq: number): void {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.synths.set(track.id, synth);

    const bpm = Tone.getTransport().bpm.value;
    const events: Array<[Tone.Unit.Time, { note: string; duration: string; velocity: number }]> =
      track.notes.map((n) => {
        const startSeconds = (n.startTick / ppq) * (60 / bpm);
        const durSeconds = (n.durationTicks / ppq) * (60 / bpm);
        return [
          startSeconds,
          {
            note: Tone.Frequency(n.pitch, "midi").toNote(),
            duration: `${durSeconds}`,
            velocity: n.velocity / 127,
          },
        ];
      });

    const part = new Tone.Part((time, value) => {
      synth.triggerAttackRelease(value.note, value.duration, time, value.velocity);
    }, events);

    part.start(0);
    this.parts.push(part);
  }

  setBpm(bpm: number): void {
    Tone.getTransport().bpm.value = bpm;
    appState.playback.bpm = bpm;
  }
}

export const playbackEngine = new PlaybackEngine();
