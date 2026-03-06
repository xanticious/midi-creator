// ─── Web MIDI Input ───────────────────────────────────────────────────────────
// Handles MIDI controller input via Web MIDI API.

export type MidiMessageHandler = (
  note: number,
  velocity: number,
  channel: number,
) => void;

export class MidiInputManager {
  private access: MIDIAccess | null = null;
  private onNoteOn: MidiMessageHandler | null = null;
  private onNoteOff: MidiMessageHandler | null = null;

  async init(): Promise<boolean> {
    if (!navigator.requestMIDIAccess) {
      console.warn('Web MIDI API not supported in this browser.');
      return false;
    }
    try {
      this.access = await navigator.requestMIDIAccess();
      this.bindInputs();
      this.access.onstatechange = () => this.bindInputs();
      return true;
    } catch (err) {
      console.error('MIDI access denied:', err);
      return false;
    }
  }

  private bindInputs(): void {
    if (!this.access) return;
    for (const input of this.access.inputs.values()) {
      input.onmidimessage = (event: MIDIMessageEvent) =>
        this.handleMessage(event);
    }
  }

  private handleMessage(event: MIDIMessageEvent): void {
    if (!event.data) return;
    const [status, note, velocity] = Array.from(event.data);
    const type = status & 0xf0;
    const channel = status & 0x0f;

    if (type === 0x90 && velocity > 0) {
      this.onNoteOn?.(note, velocity, channel);
    } else if (type === 0x80 || (type === 0x90 && velocity === 0)) {
      this.onNoteOff?.(note, velocity, channel);
    }
  }

  setNoteOnHandler(handler: MidiMessageHandler): void {
    this.onNoteOn = handler;
  }

  setNoteOffHandler(handler: MidiMessageHandler): void {
    this.onNoteOff = handler;
  }

  dispose(): void {
    if (this.access) {
      for (const input of this.access.inputs.values()) {
        input.onmidimessage = null;
      }
    }
  }
}

export const midiInputManager = new MidiInputManager();
