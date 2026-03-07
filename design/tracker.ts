// ─── Project Tracker ─────────────────────────────────────────────────────────
// Milestones → Epics → Stories for midi-creator.

export type StoryType = 'Feature' | 'Bug' | 'Enhancement';
export type Status = 'Open' | 'In-Progress' | 'Done' | 'Blocked';

export interface Story {
  id: string;
  title: string;
  description: string;
  type: StoryType;
  status: Status;
  epicId: string;
  dependsOnStoryIds: string[];
  acceptanceCriteria: string[];
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  status: Status;
  milestoneId: string;
  dependsOnEpicIds: string[];
  storyIds: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: Status;
  epicIds: string[];
}

// ─── Milestones ──────────────────────────────────────────────────────────────

export const milestones: Milestone[] = [
  {
    id: 'M1',
    title: 'Basic Features',
    description:
      'Core functionality: load and create MIDI files, choose instruments, play back, save .mid, and export .mp3.',
    status: 'Open',
    epicIds: ['E1', 'E2', 'E3', 'E4', 'E5'],
  },
  {
    id: 'M2',
    title: 'Medium Features',
    description:
      'Enhanced experience: grand-staff visualizer during playback and live MIDI controller monitoring.',
    status: 'Open',
    epicIds: ['E6', 'E7'],
  },
  {
    id: 'M3',
    title: 'Advanced Features',
    description:
      'Full editing suite: visual MIDI score editor with piano input and MIDI controller recording.',
    status: 'Open',
    epicIds: ['E8', 'E9', 'E10'],
  },
];

// ─── Epics ───────────────────────────────────────────────────────────────────

export const epics: Epic[] = [
  // ── M1 ──────────────────────────────────────────────────────────────────
  {
    id: 'E1',
    title: 'Project & File Management',
    description:
      'Create new projects from scratch and load existing .mid files from the local filesystem.',
    status: 'Done',
    milestoneId: 'M1',
    dependsOnEpicIds: [],
    storyIds: ['S1', 'S2', 'S3', 'S4', 'S5'],
  },
  {
    id: 'E2',
    title: 'Track & Instrument Setup',
    description:
      'Add, remove, rename, and configure tracks; assign Tone.js instruments to each track.',
    status: 'Done',
    milestoneId: 'M1',
    dependsOnEpicIds: ['E1'],
    storyIds: ['S6', 'S7', 'S8', 'S9', 'S10'],
  },
  {
    id: 'E3',
    title: 'Playback Engine',
    description:
      'Full transport controls — play, pause, stop, seek, loop — backed by Tone.js Transport.',
    status: 'Open',
    milestoneId: 'M1',
    dependsOnEpicIds: ['E1', 'E2'],
    storyIds: ['S11', 'S12', 'S13', 'S14', 'S15', 'S16'],
  },
  {
    id: 'E4',
    title: 'Save MIDI File',
    description:
      'Serialize the current project to a standards-compliant .mid file and offer it as a browser download.',
    status: 'Open',
    milestoneId: 'M1',
    dependsOnEpicIds: ['E1', 'E2'],
    storyIds: ['S17', 'S18', 'S19'],
  },
  {
    id: 'E5',
    title: 'Export MP3',
    description:
      'Render the project to audio offline via Tone.js, encode to MP3 with lamejs, and trigger a download.',
    status: 'Open',
    milestoneId: 'M1',
    dependsOnEpicIds: ['E3'],
    storyIds: ['S20', 'S21', 'S22', 'S23'],
  },
  // ── M2 ──────────────────────────────────────────────────────────────────
  {
    id: 'E6',
    title: 'Grand Staff Visualizer',
    description:
      'Render a live musical grand staff (treble + bass clef) with notes, rests, and an animated playback cursor.',
    status: 'Open',
    milestoneId: 'M2',
    dependsOnEpicIds: ['E3'],
    storyIds: ['S24', 'S25', 'S26', 'S27', 'S28', 'S29'],
  },
  {
    id: 'E7',
    title: 'MIDI Controller Live Monitor',
    description:
      'Connect a MIDI controller via Web MIDI API and route its note events to the Tone.js synth for live audition.',
    status: 'Open',
    milestoneId: 'M2',
    dependsOnEpicIds: ['E2'],
    storyIds: ['S30', 'S31', 'S32', 'S33'],
  },
  // ── M3 ──────────────────────────────────────────────────────────────────
  {
    id: 'E8',
    title: 'Piano Input UI',
    description:
      'On-screen piano keyboard that responds to mouse clicks and computer keyboard mappings, with a duration palette for note entry.',
    status: 'Open',
    milestoneId: 'M3',
    dependsOnEpicIds: ['E2', 'E3'],
    storyIds: ['S34', 'S35', 'S36', 'S37', 'S38'],
  },
  {
    id: 'E9',
    title: 'Visual Score Editor',
    description:
      'Click-to-insert notes on the grand staff, select and edit individual notes (pitch, velocity, duration) with smart propagation helpers.',
    status: 'Open',
    milestoneId: 'M3',
    dependsOnEpicIds: ['E6', 'E8'],
    storyIds: ['S39', 'S40', 'S41', 'S42', 'S43', 'S44', 'S45', 'S46'],
  },
  {
    id: 'E10',
    title: 'MIDI Controller Recording',
    description:
      'Arm a track, capture timestamped MIDI events from a physical controller, quantize, and commit them as notes.',
    status: 'Open',
    milestoneId: 'M3',
    dependsOnEpicIds: ['E7', 'E8'],
    storyIds: ['S47', 'S48', 'S49', 'S50', 'S51'],
  },
];

// ─── Stories ─────────────────────────────────────────────────────────────────

export const stories: Story[] = [
  // ── E1: Project & File Management ──────────────────────────────────────
  {
    id: 'S1',
    title: 'Bootstrap app shell',
    description:
      'Initialize AppShell, top-level layout, and routing stubs so the SPA has a working skeleton.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E1',
    dependsOnStoryIds: [],
    acceptanceCriteria: [
      'App loads in browser without console errors.',
      'AppShell renders a header, main content area, and footer placeholder.',
      'Vite HMR hot-reloads changes without full page refresh.',
      'TypeScript compilation reports zero errors on `tsc --noEmit`.',
    ],
  },
  {
    id: 'S2',
    title: 'Create new empty MIDI project',
    description:
      'Provide a "New Project" action that initialises a fresh MidiProject with default BPM and time signature.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E1',
    dependsOnStoryIds: ['S1'],
    acceptanceCriteria: [
      'Clicking "New Project" creates a MidiProject with title "Untitled", BPM 120, and 4/4 time signature.',
      'The project has zero tracks by default.',
      'AppState reflects the new project immediately.',
      'If an existing project has unsaved changes, the user is prompted to confirm before discarding.',
    ],
  },
  {
    id: 'S3',
    title: 'Open .mid file via file-picker',
    description:
      'Add a file-input element (or drag-and-drop zone) that accepts .mid files and reads them as ArrayBuffer.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E1',
    dependsOnStoryIds: ['S1'],
    acceptanceCriteria: [
      'A "Open File" button opens the native OS file-picker filtered to .mid/.midi.',
      'Selected file is read as ArrayBuffer with no console errors.',
      'Drag-and-drop of a .mid file onto the app also triggers the load flow.',
      'If the file has an unsupported extension, an error message is displayed.',
    ],
  },
  {
    id: 'S4',
    title: 'Parse .mid file with @tonejs/midi',
    description:
      'Pass the loaded ArrayBuffer to the Midi class and map tracks/notes into MidiProject domain objects.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E1',
    dependsOnStoryIds: ['S3'],
    acceptanceCriteria: [
      'A valid .mid file is parsed into a MidiProject with the correct number of tracks.',
      'Each Track contains the correct set of Note objects (pitch, startTick, durationTicks, velocity).',
      'Project BPM and time signature are read from the file header.',
      'A malformed .mid file shows an error notification instead of crashing.',
    ],
  },
  {
    id: 'S5',
    title: 'Display project metadata in the header',
    description:
      'Show project title, BPM, and time signature in the app header with inline-edit capability for title and BPM.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E1',
    dependsOnStoryIds: ['S2', 'S4'],
    acceptanceCriteria: [
      'Header shows project title, current BPM, and time signature.',
      'Title can be edited by clicking on it; change persists in AppState.',
      'BPM can be edited via a number input; value is clamped to 20–300.',
      'Changes are reflected immediately without requiring a save.',
    ],
  },

  // ── E2: Track & Instrument Setup ────────────────────────────────────────
  {
    id: 'S6',
    title: 'Add a new track',
    description:
      'Provide an "Add Track" button that appends a new empty Track to the current project.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E2',
    dependsOnStoryIds: ['S2'],
    acceptanceCriteria: [
      'Clicking "Add Track" appends a Track with a default name ("Track N") and no notes.',
      ,
      'The new track appears immediately in the track list UI.',
      'AppState.project.tracks includes the new track.',
      'A project can have up to 16 tracks (MIDI channel limit); beyond that the button is disabled.',
    ],
  },
  {
    id: 'S7',
    title: 'Remove a track',
    description:
      'Allow the user to delete a track from the project with a confirmation prompt.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E2',
    dependsOnStoryIds: ['S6'],
    acceptanceCriteria: [
      'Each track row has a "Delete" button.',
      'Clicking "Delete" shows a confirmation dialog.',
      'Confirming removes the track from AppState and the UI.',
      'The last track cannot be deleted (minimum one track enforced).',
    ],
  },
  {
    id: 'S8',
    title: 'Select instrument for a track',
    description:
      'Provide a dropdown of available Tone.js instruments (PolySynth presets) for each track.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E2',
    dependsOnStoryIds: ['S6'],
    acceptanceCriteria: [
      'Each track row has an instrument selector dropdown.',
      'At least 6 distinct instrument presets are available (e.g. Piano, Strings, Brass, Bass, Lead, Pad).',
      'Selecting an instrument updates Track.instrument in AppState.',
      'During playback, the track uses the newly selected instrument immediately.',
    ],
  },
  {
    id: 'S9',
    title: 'Render track list UI',
    description:
      'Build the TrackList component that displays all tracks with their name, instrument, and mute/solo controls.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E2',
    dependsOnStoryIds: ['S6', 'S8'],
    acceptanceCriteria: [
      'All tracks in AppState are rendered in order.',
      'Each track row shows: track name, instrument selector, mute toggle, solo toggle.',
      'Muting a track silences it during playback without removing it.',
      'Solo-ing a track mutes all other tracks during playback.',
    ],
  },
  {
    id: 'S10',
    title: 'Rename a track',
    description:
      'Allow inline editing of the track name directly in the track list.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E2',
    dependsOnStoryIds: ['S9'],
    acceptanceCriteria: [
      'Double-clicking a track name makes it editable in-place.',
      'Pressing Enter or blurring the input commits the new name.',
      'Pressing Escape cancels the edit and restores the original name.',
      'Track name cannot be empty; shows validation error if submitted blank.',
    ],
  },

  // ── E3: Playback Engine ──────────────────────────────────────────────────
  {
    id: 'S11',
    title: 'Implement play and pause',
    description:
      'Wire the Play/Pause button to Tone.Transport.start() / pause() and schedule all track notes.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E3',
    dependsOnStoryIds: ['S9'],
    acceptanceCriteria: [
      'Clicking Play begins audio playback from the current playhead position.',
      'Clicking Pause halts playback and the playhead stays at the current position.',
      'Clicking Play again resumes from the paused position.',
      'All tracks with notes scheduled in Tone.Transport produce audible output.',
    ],
  },
  {
    id: 'S12',
    title: 'Implement stop / reset',
    description:
      'Stop button halts playback and resets the playhead to the beginning.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E3',
    dependsOnStoryIds: ['S11'],
    acceptanceCriteria: [
      'Clicking Stop calls Tone.Transport.stop() and resets position to 0.',
      'The playhead UI indicator returns to bar 1, beat 1.',
      'All scheduled Tone.js parts are cancelled to avoid stale events.',
      'The Play button re-activates after Stop.',
    ],
  },
  {
    id: 'S13',
    title: 'Implement timeline seek',
    description:
      'Render a horizontal timeline bar; clicking or dragging it seeks playback to that position.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E3',
    dependsOnStoryIds: ['S12'],
    acceptanceCriteria: [
      'A timeline bar is visible below the transport controls.',
      'Clicking a position on the timeline seeks the playhead to that bar/beat.',
      'Seeking while paused updates the playhead without starting playback.',
      'Seeking while playing restarts playback from the new position without audio glitches.',
    ],
  },
  {
    id: 'S14',
    title: 'Display current playback position',
    description:
      'Show a real-time readout of bar:beat:tick and elapsed time (mm:ss) updated during playback.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E3',
    dependsOnStoryIds: ['S11'],
    acceptanceCriteria: [
      'Position display shows bar, beat, and tick (e.g. "3:2:048").',
      'Elapsed time shows mm:ss format.',
      'Display updates at least every 50 ms during playback.',
      'Display resets to "1:1:000 | 0:00" on Stop.',
    ],
  },
  {
    id: 'S15',
    title: 'Implement loop toggle',
    description:
      'Add a Loop button that causes playback to loop back to the start when it ends.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E3',
    dependsOnStoryIds: ['S11'],
    acceptanceCriteria: [
      'A Loop toggle button is visible in the transport bar.',
      'When Loop is on, Tone.Transport loops and playback restarts automatically at the end.',
      'When Loop is off, playback stops at the end of the last note.',
      'The loop state is visually indicated on the button.',
    ],
  },
  {
    id: 'S16',
    title: 'BPM control in transport',
    description:
      'Wire the BPM input from the header to Tone.Transport.bpm so changes take effect immediately.',
    type: 'Feature',
    status: 'Done',
    epicId: 'E3',
    dependsOnStoryIds: ['S5', 'S11'],
    acceptanceCriteria: [
      'Changing the BPM field updates Tone.Transport.bpm.value in real time.',
      'BPM change during playback takes effect without stopping playback.',
      'Value is clamped to 20–300.',
      'AppState.project.tempo is kept in sync with the transport BPM.',
    ],
  },

  // ── E4: Save MIDI File ───────────────────────────────────────────────────
  {
    id: 'S17',
    title: 'Serialize MidiProject to @tonejs/midi Midi object',
    description:
      'Implement a function in src/io/midiFile.ts that converts the current AppState project into a Midi instance.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E4',
    dependsOnStoryIds: ['S4'],
    acceptanceCriteria: [
      'Function accepts a MidiProject and returns a Midi instance.',
      'All tracks, notes (pitch, startTick, durationTicks, velocity), BPM, and time signature are present in the output.',
      'Instrument channel assignments are encoded in the MIDI track headers.',
      'A round-trip (serialize → parse) produces an equivalent MidiProject.',
    ],
  },
  {
    id: 'S18',
    title: 'Download .mid file from browser',
    description:
      'Trigger a browser download of the serialized .mid file when the user clicks "Save".',
    type: 'Feature',
    status: 'Open',
    epicId: 'E4',
    dependsOnStoryIds: ['S17'],
    acceptanceCriteria: [
      'Clicking "Save .mid" triggers a file download in the browser.',
      'Downloaded file has a .mid extension and the project title as the filename.',
      'The downloaded file can be re-loaded into the app and round-trips correctly.',
      'Standard MIDI players (e.g. GarageBand, Windows Media Player) can open the file.',
    ],
  },
  {
    id: 'S19',
    title: 'Persist instrument and channel metadata in .mid',
    description:
      'Encode the chosen instrument as a General MIDI program-change event so external players use the right sound.',
    type: 'Enhancement',
    status: 'Open',
    epicId: 'E4',
    dependsOnStoryIds: ['S17'],
    acceptanceCriteria: [
      "Each track's MIDI channel matches its index (or explicit assignment).",
      'A General MIDI program-change event is written at tick 0 for each track.',
      'Percussion tracks are assigned channel 10.',
      'Re-loading the saved file restores the correct instrument selection in the UI.',
    ],
  },

  // ── E5: Export MP3 ───────────────────────────────────────────────────────
  {
    id: 'S20',
    title: 'Render audio offline with Tone.js',
    description:
      'Use Tone.Offline to render the full project to an AudioBuffer without real-time playback.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E5',
    dependsOnStoryIds: ['S11'],
    acceptanceCriteria: [
      'Tone.Offline renders all scheduled notes for all tracks.',
      'Output AudioBuffer sample rate matches browser default (typically 44100 Hz).',
      'Rendering does not block the main thread (runs asynchronously).',
      'Function rejects with a descriptive error if the project has no notes.',
    ],
  },
  {
    id: 'S21',
    title: 'Encode AudioBuffer to MP3 via lamejs',
    description:
      'Convert the rendered AudioBuffer Float32 samples to a Uint8Array MP3 blob using lamejs.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E5',
    dependsOnStoryIds: ['S20'],
    acceptanceCriteria: [
      'lamejs (or equivalent) is added as a dependency and types are available.',
      'Stereo and mono AudioBuffers are both handled correctly.',
      'Output is a valid Blob with MIME type "audio/mpeg".',
      'Encoding a 1-minute stereo buffer completes in under 10 seconds on a modern machine.',
    ],
  },
  {
    id: 'S22',
    title: 'Download .mp3 file from browser',
    description:
      'Trigger a browser download of the encoded MP3 blob when the user clicks "Export MP3".',
    type: 'Feature',
    status: 'Open',
    epicId: 'E5',
    dependsOnStoryIds: ['S21'],
    acceptanceCriteria: [
      'Clicking "Export .mp3" triggers a file download.',
      'The filename uses the project title with a .mp3 extension.',
      'The exported file plays correctly in standard media players.',
      'The download is triggered only after encoding is fully complete.',
    ],
  },
  {
    id: 'S23',
    title: 'Export progress indicator',
    description:
      'Show a progress bar or spinner during the offline render + encode pipeline.',
    type: 'Enhancement',
    status: 'Open',
    epicId: 'E5',
    dependsOnStoryIds: ['S20', 'S21'],
    acceptanceCriteria: [
      'A progress indicator is visible from the moment Export is clicked until the download starts.',
      'The indicator distinguishes "Rendering audio…" from "Encoding MP3…" stages.',
      'The Export button is disabled while export is in progress.',
      'If an error occurs, the indicator is hidden and an error message is displayed.',
    ],
  },

  // ── E6: Grand Staff Visualizer ───────────────────────────────────────────
  {
    id: 'S24',
    title: 'Render static treble and bass clef staves',
    description:
      'Draw a grand staff (treble + bass) using SVG or Canvas with correct proportions and clef symbols.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E6',
    dependsOnStoryIds: ['S1'],
    acceptanceCriteria: [
      'Both treble and bass clef staves are rendered with 5 lines each.',
      'Correct clef symbols are drawn at the left margin.',
      'The staff reflows or scales gracefully when the browser window is resized.',
      'No overlapping elements or rendering artifacts at default zoom.',
    ],
  },
  {
    id: 'S25',
    title: 'Map MIDI note numbers to staff positions',
    description:
      'Implement a utility that converts a MIDI note number (0–127) to the correct line/space on the treble or bass staff.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E6',
    dependsOnStoryIds: ['S24'],
    acceptanceCriteria: [
      'Middle C (MIDI 60) maps to first ledger line below treble clef.',
      'All notes C3–B5 map to correct positions on treble staff (with ledger lines).',
      'All notes C2–B3 map to correct positions on bass staff (with ledger lines).',
      'Function has unit tests covering at least 10 representative pitches.',
    ],
  },
  {
    id: 'S26',
    title: 'Render note heads on the staff',
    description:
      'Draw filled note heads (open for half/whole, filled for quarter and shorter) at the correct staff positions and horizontal tick offsets.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E6',
    dependsOnStoryIds: ['S25'],
    acceptanceCriteria: [
      'Note heads appear at the correct pitch position (line or space).',
      'Note heads are horizontally positioned proportionally to their startTick.',
      'Whole and half notes use open note heads; quarter and shorter use filled.',
      'Stems are drawn on the correct side (up for notes below middle line, down otherwise).',
    ],
  },
  {
    id: 'S27',
    title: 'Render rests on the staff',
    description:
      'Draw appropriate rest symbols (whole, half, quarter, eighth) in bars where no notes are present.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E6',
    dependsOnStoryIds: ['S25'],
    acceptanceCriteria: [
      'A whole rest is shown for a completely empty bar.',
      'Partial rests fill the notated silence between notes within a bar.',
      'Rest symbols are visually distinct from note heads.',
      'Rest positions do not collide with note heads in the same bar.',
    ],
  },
  {
    id: 'S28',
    title: 'Animate green playback cursor',
    description:
      'Draw a vertical green line on the staff that moves from left to right in sync with Tone.Transport position.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E6',
    dependsOnStoryIds: ['S24', 'S26'],
    acceptanceCriteria: [
      'A green vertical line is visible on the staff during playback.',
      'The line position corresponds to the current Tone.Transport tick.',
      'Movement is smooth (no visible jumping) at 60 fps.',
      'The line returns to the left margin when Stop is pressed.',
    ],
  },
  {
    id: 'S29',
    title: 'Auto-scroll staff to follow playback',
    description:
      'Scroll the staff view horizontally so the playback cursor stays visible in the centre of the viewport.',
    type: 'Enhancement',
    status: 'Open',
    epicId: 'E6',
    dependsOnStoryIds: ['S28'],
    acceptanceCriteria: [
      'The staff scrolls automatically so the cursor stays within the visible area.',
      'Scrolling is smooth and does not cause layout thrashing.',
      'User can manually scroll and the auto-scroll resumes after 2 seconds of inactivity.',
      'Scrolling works for projects longer than the visible staff width.',
    ],
  },

  // ── E7: MIDI Controller Live Monitor ────────────────────────────────────
  {
    id: 'S30',
    title: 'Request Web MIDI access and enumerate devices',
    description:
      'Call navigator.requestMIDIAccess() on startup (or user action) and list available MIDI input devices.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E7',
    dependsOnStoryIds: ['S1'],
    acceptanceCriteria: [
      'navigator.requestMIDIAccess() is called with sysex: false.',
      'Available MIDI input ports are collected into an array of device descriptors.',
      'If the browser does not support Web MIDI, a graceful fallback message is shown.',
      'If permission is denied, an error notification is displayed without crashing.',
    ],
  },
  {
    id: 'S31',
    title: 'Display connected MIDI input devices',
    description:
      'Show a list of detected MIDI input devices in the settings panel with connect/disconnect toggles.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E7',
    dependsOnStoryIds: ['S30'],
    acceptanceCriteria: [
      'All detected MIDI input devices are listed by name.',
      'Each device shows a status indicator (connected / disconnected).',
      'The list updates automatically when a device is plugged in or unplugged (MIDIConnectionEvent).',
      'Selecting a device activates it as the primary input source.',
    ],
  },
  {
    id: 'S32',
    title: 'Route MIDI note events to synth for live audition',
    description:
      'Forward note-on and note-off messages from the active MIDI device to the Tone.js synth for the selected track.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E7',
    dependsOnStoryIds: ['S30', 'S31'],
    acceptanceCriteria: [
      "Pressing a key on the MIDI controller produces audible output through the app's synth.",
      'Note-off messages stop the note without cutting off early.',
      'MIDI velocity (aftertouch) maps to Tone.js synth velocity.',
      "The active track's instrument is used for audition (not a fixed default).",
    ],
  },
  {
    id: 'S33',
    title: 'Display active notes from controller input',
    description:
      'Highlight currently pressed notes on an indicator strip (e.g. mini piano roll) in real time.',
    type: 'Enhancement',
    status: 'Open',
    epicId: 'E7',
    dependsOnStoryIds: ['S32'],
    acceptanceCriteria: [
      'A mini piano keyboard or note name display is visible in the MIDI input panel.',
      'Keys light up while held and un-light on note-off.',
      'Multiple simultaneous notes are highlighted correctly (chords).',
      'The highlight resets if MIDI connection is lost.',
    ],
  },

  // ── E8: Piano Input UI ───────────────────────────────────────────────────
  {
    id: 'S34',
    title: 'Render on-screen piano keyboard',
    description:
      'Draw a full-width SVG/HTML piano keyboard spanning at least 3 octaves (C3–B5) with correct white and black key proportions.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E8',
    dependsOnStoryIds: ['S1'],
    acceptanceCriteria: [
      'White and black keys are rendered with correct relative proportions.',
      'At least 3 octaves (C3–B5, 36 keys) are visible by default.',
      'The keyboard is horizontally scrollable to reach all 10 MIDI octaves.',
      'Key labels (C4, etc.) are shown on C keys.',
    ],
  },
  {
    id: 'S35',
    title: 'Trigger notes via mouse clicks on piano keys',
    description:
      "Mouse-down on a piano key plays the note; mouse-up stops it, using the current track's instrument.",
    type: 'Feature',
    status: 'Open',
    epicId: 'E8',
    dependsOnStoryIds: ['S34'],
    acceptanceCriteria: [
      'Pressing a key down triggers note-on via Tone.js.',
      'Releasing the key triggers note-off.',
      'Multiple keys can be held simultaneously (polyphonic).',
      'The clicked key visually depresses while held.',
    ],
  },
  {
    id: 'S36',
    title: 'Map computer keyboard to piano keys',
    description:
      'Map the two rows of letter keys (qwerty…, asdf…) to consecutive piano keys starting at C4, with Z/X to shift the octave.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E8',
    dependsOnStoryIds: ['S34'],
    acceptanceCriteria: [
      'Keys A–K (and nearby) produce consecutive piano notes starting from C4.',
      'Z shifts the base octave down; X shifts it up.',
      'Currently active keyboard-to-note mapping is shown as a tooltip overlay on the piano.',
      'Key events are not captured when a text input is focused.',
    ],
  },
  {
    id: 'S37',
    title: 'Duration palette (num-pad style)',
    description:
      'Render a row of duration toggle buttons (whole, half, quarter, eighth, sixteenth) so the user can select note length before entry.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E8',
    dependsOnStoryIds: ['S34'],
    acceptanceCriteria: [
      'Duration buttons are displayed above or beside the piano.',
      'Number keys 1–6 select durations (1=whole … 6=sixteenth) matching num-pad convention.',
      'The selected duration is highlighted.',
      'Dotted note modifier (. key) adds a dot to the selected duration.',
    ],
  },
  {
    id: 'S38',
    title: 'Insert note at cursor position in active track',
    description:
      'When the user presses a piano key while in "Insert" mode, add a Note at the current cursor position with the selected duration, then advance the cursor.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E8',
    dependsOnStoryIds: ['S35', 'S37'],
    acceptanceCriteria: [
      'A note is appended to the active track at the current cursor tick.',
      'Note duration in ticks matches the selected duration palette value.',
      "The cursor advances by the note's duration after insertion.",
      'The newly inserted note is immediately visible on the grand staff (if visualizer is rendered).',
    ],
  },

  // ── E9: Visual Score Editor ──────────────────────────────────────────────
  {
    id: 'S39',
    title: 'Click on staff to insert a note',
    description:
      'When in "Insert" mode, clicking on the grand staff inserts a note at the clicked pitch and horizontal position.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E9',
    dependsOnStoryIds: ['S24', 'S26'],
    acceptanceCriteria: [
      'Clicking a staff line or space inserts a note at the corresponding MIDI pitch.',
      'Horizontal click position maps to the nearest beat/tick position.',
      'The inserted note uses the current duration palette selection.',
      'The note is visible immediately without requiring a full re-render.',
    ],
  },
  {
    id: 'S40',
    title: 'Select an existing note',
    description:
      'Clicking an existing note head in the visualizer selects it and highlights it for editing.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E9',
    dependsOnStoryIds: ['S39'],
    acceptanceCriteria: [
      'Clicking a note head visually highlights it (e.g. turns blue).',
      "The note's pitch, velocity, and duration are shown in an inspector panel.",
      'Only one note is selected at a time; clicking another deselects the previous one.',
      'Pressing Escape deselects the current note.',
    ],
  },
  {
    id: 'S41',
    title: 'Edit selected note pitch',
    description:
      'Allow the user to change the pitch of the selected note via the inspector panel or arrow keys.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E9',
    dependsOnStoryIds: ['S40'],
    acceptanceCriteria: [
      'Up/Down arrow keys move the selected note up/down by one semitone.',
      'Shift+Up/Down moves by one octave.',
      'The staff re-renders the note at its new pitch immediately.',
      'The Note.pitch value in AppState is updated correctly.',
    ],
  },
  {
    id: 'S42',
    title: 'Edit selected note velocity',
    description:
      'Provide a velocity slider (0–127) in the inspector panel for the selected note.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E9',
    dependsOnStoryIds: ['S40'],
    acceptanceCriteria: [
      'Inspector panel shows a slider labelled "Velocity" (0–127).',
      'Dragging the slider updates Note.velocity in AppState.',
      'Note head shading/opacity reflects velocity (louder = darker).',
      'Value is displayed numerically beside the slider.',
    ],
  },
  {
    id: 'S43',
    title: 'Prompt to propagate velocity change to subsequent notes',
    description:
      "After changing a note's velocity, ask the user whether to apply the same velocity to all following notes in the track.",
    type: 'Feature',
    status: 'Open',
    epicId: 'E9',
    dependsOnStoryIds: ['S42'],
    acceptanceCriteria: [
      'A modal or inline prompt appears after committing a velocity change.',
      'Choosing "Yes" updates all subsequent notes\' velocity to the same value.',
      'Choosing "No" only updates the selected note.',
      'The dialog can be permanently dismissed via a "Don\'t ask again" checkbox.',
    ],
  },
  {
    id: 'S44',
    title: 'Edit selected note duration',
    description:
      'Allow the user to change the duration of the selected note using the duration palette or an inspector selector.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E9',
    dependsOnStoryIds: ['S40'],
    acceptanceCriteria: [
      "Duration palette keys (1–6) update the selected note's duration while a note is selected.",
      'Inspector panel shows a duration dropdown matching the palette options.',
      'Note head symbol updates visually (open vs filled) on duration change.',
      'Note.durationTicks in AppState is updated to match the new duration.',
    ],
  },
  {
    id: 'S45',
    title: 'Prompt to push following notes on duration change',
    description:
      'After lengthening or shortening a note, offer to shift all subsequent notes in the track by the duration delta.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E9',
    dependsOnStoryIds: ['S44'],
    acceptanceCriteria: [
      'A prompt appears when duration is changed: "Shift following notes by [delta]?"',
      'Choosing "Yes" adjusts startTick of all subsequent notes by the signed delta ticks.',
      'Choosing "No" only changes the selected note\'s duration (may cause overlap).',
      'Negative shifts (shortening) that would result in negative ticks are clamped to 0.',
    ],
  },
  {
    id: 'S46',
    title: 'Delete selected note',
    description:
      'Allow the user to delete the currently selected note via the Delete key or a trash icon.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E9',
    dependsOnStoryIds: ['S40'],
    acceptanceCriteria: [
      'Pressing Delete/Backspace while a note is selected removes it from the track.',
      'A trash icon in the inspector panel also triggers deletion.',
      'The note disappears from the staff immediately.',
      'Deletion can be undone via Ctrl+Z (basic undo stack).',
    ],
  },

  // ── E10: MIDI Controller Recording ──────────────────────────────────────
  {
    id: 'S47',
    title: 'Arm a track for recording',
    description:
      'Add a Record-arm toggle to each track row; only the armed track captures incoming MIDI events.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E10',
    dependsOnStoryIds: ['S9'],
    acceptanceCriteria: [
      'Each track row has a record-arm button (red circle icon).',
      'Only one track can be armed at a time; arming a new track disarms the previous.',
      'Armed track is visually highlighted.',
      'Arming requires a MIDI input device to be selected; otherwise the button is disabled.',
    ],
  },
  {
    id: 'S48',
    title: 'Capture timestamped note events during recording',
    description:
      'When recording is active, store each note-on/note-off event with its Tone.Transport timestamp.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E10',
    dependsOnStoryIds: ['S47', 'S30'],
    acceptanceCriteria: [
      'Note-on events are stored with pitch, velocity, and Transport tick timestamp.',
      'Note-off events are matched to their note-on to compute durationTicks.',
      'Simultaneous (chord) note-on events are all captured.',
      'Events are captured with sub-10 ms timestamp resolution.',
    ],
  },
  {
    id: 'S49',
    title: 'Quantize recorded notes to grid',
    description:
      'After recording, snap note startTick and durationTicks to the nearest subdivision (default: 1/16th note).',
    type: 'Feature',
    status: 'Open',
    epicId: 'E10',
    dependsOnStoryIds: ['S48'],
    acceptanceCriteria: [
      'Quantization grid can be set to 1/4, 1/8, or 1/16 note before recording.',
      'After recording stops, all captured notes are snapped to the nearest grid tick.',
      'Quantization strength can be 100% (full snap) or 50% (half-pull).',
      'A preview of the quantized notes is shown before committing.',
    ],
  },
  {
    id: 'S50',
    title: 'Stop recording and commit notes to track',
    description:
      'Pressing Stop during recording ends capture, applies quantization, and appends the notes to the armed track.',
    type: 'Feature',
    status: 'Open',
    epicId: 'E10',
    dependsOnStoryIds: ['S49'],
    acceptanceCriteria: [
      'Pressing Stop (or a dedicated Stop Recording button) ends the recording session.',
      "Committed notes appear in the track's note array in AppState.",
      'The track is automatically disarmed after commit.',
      'The newly recorded notes are visible on the grand staff immediately.',
    ],
  },
  {
    id: 'S51',
    title: 'Recording indicator in UI',
    description:
      'Display a clear visual indicator (flashing red dot + elapsed time) while recording is active.',
    type: 'Enhancement',
    status: 'Open',
    epicId: 'E10',
    dependsOnStoryIds: ['S47'],
    acceptanceCriteria: [
      'A flashing red dot and "REC" label are visible in the transport bar during recording.',
      'An elapsed recording time counter (mm:ss) increments during capture.',
      'The indicator disappears immediately when recording stops.',
      'The indicator is also shown on the armed track row.',
    ],
  },
];
