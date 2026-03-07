# Copilot Instructions for midi-creator

## Project Overview

A browser-based MIDI creator/editor SPA. Vanilla TypeScript + Vite + Tone.js + @tonejs/midi.

## Architecture

- src/core/ Domain models (MidiProject, Track, Note, TimeSignature, etc.)
- src/audio/ Playback engine, Tone.js synth wrappers
- src/ui/ UI views and components (no framework — vanilla DOM)
- src/io/ File I/O (load .mid, save .mid, export .mp3)
- src/midi-input/ Web MIDI API integration for controller input
- src/utils/ Shared helpers (time conversion, music theory utils, etc.)
- design/ Project tracker and dashboard

## Coding Conventions

- All source files are TypeScript (.ts). No .js files in src/.
- Prefer pure functions and immutable data structures in core/.
- UI components are plain classes or functions that return/manipulate HTMLElements.
- No global state except a single AppState singleton in src/core/AppState.ts.
- Use Web MIDI API (navigator.requestMIDIAccess) for controller input.
- Audio: Use Tone.js Sampler or PolySynth for instrument playback.
- MIDI I/O: Use @tonejs/midi (Midi class) for parsing and writing .mid files.
- Export: Use Tone.js Offline rendering to produce audio buffers, then encode to mp3 with lamejs or similar.
- Naming: PascalCase for classes/types, camelCase for functions/variables, SCREAMING_SNAKE for constants.
- Keep each file under 300 lines. Split large components into sub-files.
- Use comments sparingly to explain why, not what. Code should be self-explanatory where possible.

## Key Interfaces (to be expanded in src/core/)

- MidiProject: top-level container (tracks, tempo, timeSignature, title)
- Track: instrument, notes[], channel
- Note: pitch (MIDI number), startTick, durationTicks, velocity
- PlaybackState: isPlaying, currentTick, bpm, loop

## Testing

- Unit tests go in src/\*\*/**tests**/ using Vitest.
- Integration/E2E are manual for now (no Playwright yet).
