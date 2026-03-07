// ─── General MIDI Instrument Presets ─────────────────────────────────────────

export interface InstrumentPreset {
  /** General MIDI program number (0-based, 0–127) */
  program: number;
  label: string;
  /** Rough category for grouping */
  category: string;
}

export const INSTRUMENT_PRESETS: InstrumentPreset[] = [
  { program: 0, label: 'Acoustic Piano', category: 'Keys' },
  { program: 4, label: 'Electric Piano', category: 'Keys' },
  { program: 19, label: 'Organ', category: 'Keys' },
  { program: 24, label: 'Acoustic Guitar', category: 'Guitar' },
  { program: 25, label: 'Nylon Guitar', category: 'Guitar' },
  { program: 30, label: 'Distortion Guitar', category: 'Guitar' },
  { program: 32, label: 'Acoustic Bass', category: 'Bass' },
  { program: 33, label: 'Electric Bass', category: 'Bass' },
  { program: 40, label: 'Violin', category: 'Strings' },
  { program: 48, label: 'String Ensemble', category: 'Strings' },
  { program: 52, label: 'Choir Aahs', category: 'Choir' },
  { program: 56, label: 'Trumpet', category: 'Brass' },
  { program: 58, label: 'Trombone', category: 'Brass' },
  { program: 61, label: 'Brass Section', category: 'Brass' },
  { program: 65, label: 'Alto Sax', category: 'Woodwind' },
  { program: 73, label: 'Flute', category: 'Woodwind' },
  { program: 80, label: 'Lead Synth', category: 'Synth Lead' },
  { program: 88, label: 'Pad (New Age)', category: 'Synth Pad' },
  { program: 116, label: 'Taiko Drum', category: 'Percussion' },
];

/** Find the label for a program number, falling back to "Program N". */
export function instrumentLabel(program: number): string {
  return (
    INSTRUMENT_PRESETS.find((p) => p.program === program)?.label ??
    `Program ${program}`
  );
}
