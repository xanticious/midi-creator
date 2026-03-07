// ─── MIDI I/O ─────────────────────────────────────────────────────────────────
// Load and save .mid files using @tonejs/midi.

import { Midi } from "@tonejs/midi";
import type { MidiProject, Track, Note } from "../core/types.ts";
import { createTrack } from "../core/trackHelpers.ts";

export function loadMidiFile(buffer: ArrayBuffer): MidiProject {
  const midi = new Midi(buffer);

  const tracks: Track[] = midi.tracks.map((midiTrack, i) => {
    const notes: Note[] = midiTrack.notes.map((n) => ({
      pitch: n.midi,
      startTick: n.ticks,
      durationTicks: n.durationTicks,
      velocity: Math.round(n.velocity * 127),
    }));
    return createTrack({
      id: `track-${i + 1}`,
      name: midiTrack.name || `Track ${i + 1}`,
      instrument: midiTrack.instrument.number,
      channel: midiTrack.channel ?? i % 16,
      notes,
    });
  });

  return {
    title: "Imported Project",
    bpm: midi.header.tempos[0]?.bpm ?? 120,
    timeSignature: {
      numerator: midi.header.timeSignatures[0]?.timeSignature[0] ?? 4,
      denominator: midi.header.timeSignatures[0]?.timeSignature[1] ?? 4,
    },
    ticksPerQuarterNote: midi.header.ppq,
    tracks,
  };
}

export function saveMidiFile(project: MidiProject): Uint8Array {
  const midi = new Midi();
  midi.header.setTempo(project.bpm);
  midi.header.timeSignatures.push({
    ticks: 0,
    timeSignature: [project.timeSignature.numerator, project.timeSignature.denominator],
  });

  for (const track of project.tracks) {
    const midiTrack = midi.addTrack();
    midiTrack.name = track.name;
    for (const note of track.notes) {
      midiTrack.addNote({
        midi: note.pitch,
        ticks: note.startTick,
        durationTicks: note.durationTicks,
        velocity: note.velocity / 127,
      });
    }
  }

  return midi.toArray();
}

export function downloadMidi(project: MidiProject, filename = "project.mid"): void {
  const bytes = saveMidiFile(project);
  const blob = new Blob([bytes.buffer], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
