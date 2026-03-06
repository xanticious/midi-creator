import { describe, it, expect } from "vitest";
import { midiToNoteName, noteNameToMidi, ticksToSeconds, secondsToTicks } from "../musicTheory.ts";

describe("midiToNoteName", () => {
  it("converts middle C (60) to C4", () => {
    expect(midiToNoteName(60)).toBe("C4");
  });
  it("converts 69 to A4", () => {
    expect(midiToNoteName(69)).toBe("A4");
  });
  it("converts 0 to C-1", () => {
    expect(midiToNoteName(0)).toBe("C-1");
  });
});

describe("noteNameToMidi", () => {
  it("converts C4 to 60", () => {
    expect(noteNameToMidi("C4")).toBe(60);
  });
  it("roundtrips pitch values", () => {
    for (let i = 0; i <= 127; i++) {
      expect(noteNameToMidi(midiToNoteName(i))).toBe(i);
    }
  });
});

describe("ticksToSeconds / secondsToTicks", () => {
  it("converts 480 ticks at 120bpm/480ppq to 0.5s", () => {
    expect(ticksToSeconds(480, 120, 480)).toBeCloseTo(0.5);
  });
  it("roundtrips cleanly", () => {
    expect(secondsToTicks(ticksToSeconds(960, 120, 480), 120, 480)).toBe(960);
  });
});
