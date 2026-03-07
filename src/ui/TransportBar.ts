// ─── Transport Bar UI (S11–S16) ───────────────────────────────────────────────
// Play/pause, stop, loop toggle, seek timeline, position display, BPM input.

import { playbackEngine } from '../audio/PlaybackEngine.ts';
import { appState } from '../core/AppState.ts';

// WeakMap keyed by root element so each mount cleans up prior document listeners
const abortControllerMap = new WeakMap<HTMLElement, AbortController>();

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Mounts the full transport bar into the `.transport-controls` and
 * `.timeline-row` elements that already exist in the shell's footer HTML.
 * Must be called after mountApp() populates the DOM.
 */
export function mountTransportBar(root: HTMLElement): void {
  // Abort any document-level listeners registered by a previous mount
  abortControllerMap.get(root)?.abort();
  const abortController = new AbortController();
  abortControllerMap.set(root, abortController);

  renderTransport(root);
  bindTransport(root, abortController.signal);

  // Wire position updates from the engine to the display
  playbackEngine.onPosition((bar, beat, tick, elapsed) => {
    updatePositionDisplay(root, bar, beat, tick, elapsed);
  });

  // Reset play button when the engine auto-stops at end of project
  playbackEngine.onStop(() => {
    updatePlayButton(root, false);
    updatePositionDisplay(root, 1, 1, 0, 0);
    updateTimelineCursor(root, 0);
  });
}

// ─── Render ───────────────────────────────────────────────────────────────────

function renderTransport(root: HTMLElement): void {
  const footer = root.querySelector<HTMLElement>('.transport-bar');
  if (!footer) return;

  const loopActive = appState.playback.loop;
  const bpm = appState.project.bpm;

  footer.innerHTML = `
    <div class="transport-controls">
      <button id="btn-play"  class="btn btn-transport" title="Play / Pause">▶ Play</button>
      <button id="btn-stop"  class="btn btn-transport" title="Stop and reset">■ Stop</button>
      <button id="btn-loop"  class="btn btn-transport${loopActive ? ' btn-transport--active' : ''}"
              title="Toggle loop" aria-pressed="${loopActive}">⟳ Loop</button>
      <label class="meta-field transport-bpm" title="Beats per minute (20–300)">
        BPM:
        <input id="input-bpm-transport" type="number" min="20" max="300"
               class="meta-input meta-input--bpm"
               value="${bpm}" aria-label="Beats per minute" />
      </label>
      <span class="position-display" id="position-display" aria-live="off">
        1:1:000 | 0:00
      </span>
    </div>
    <div class="timeline-row">
      <div class="timeline-bar" id="timeline-bar" title="Click to seek" role="slider"
           aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Playback position">
        <div class="timeline-cursor" id="timeline-cursor"></div>
      </div>
    </div>
    <div class="status-bar">
      <span class="status-indicator" id="midi-status" title="MIDI connection status">
        <span class="status-dot status-dot--offline" id="midi-status-dot"></span>
        MIDI: <span id="midi-status-label">Not connected</span>
      </span>
      <span class="status-divider">|</span>
      <span class="status-text" id="status-text">Ready</span>
      <span class="status-divider">|</span>
      <span class="app-version">v0.0.0</span>
    </div>
  `;
}

// ─── Bind ─────────────────────────────────────────────────────────────────────

function bindTransport(root: HTMLElement, signal: AbortSignal): void {
  // Play / Pause (S11)
  root.querySelector('#btn-play')?.addEventListener('click', async () => {
    const btn = root.querySelector<HTMLButtonElement>('#btn-play');
    if (btn) btn.disabled = true;
    try {
      const { project, playback } = appState;
      if (playback.isPlaying) {
        playbackEngine.pause();
        updatePlayButton(root, false);
      } else {
        await playbackEngine.play(project);
        updatePlayButton(root, true);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(root, `Playback error: ${msg}`);
    } finally {
      const btn2 = root.querySelector<HTMLButtonElement>('#btn-play');
      if (btn2) btn2.disabled = false;
    }
  });

  // Stop (S12)
  root.querySelector('#btn-stop')?.addEventListener('click', () => {
    playbackEngine.stop();
    updatePlayButton(root, false);
    updatePositionDisplay(root, 1, 1, 0, 0);
    updateTimelineCursor(root, 0);
  });

  // Loop toggle (S15)
  root.querySelector('#btn-loop')?.addEventListener('click', () => {
    const newVal = !appState.playback.loop;
    playbackEngine.setLoop(newVal, appState.project);
    const btn = root.querySelector<HTMLButtonElement>('#btn-loop');
    if (btn) {
      btn.classList.toggle('btn-transport--active', newVal);
      btn.setAttribute('aria-pressed', String(newVal));
    }
  });

  // BPM transport (S16)
  root
    .querySelector('#input-bpm-transport')
    ?.addEventListener('change', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      let val = parseInt(target.value, 10);
      if (isNaN(val)) {
        target.value = String(appState.project.bpm);
        return;
      }
      val = Math.min(300, Math.max(20, val));
      target.value = String(val);
      playbackEngine.setBpm(val, appState.project);
      appState.markDirty();
      // Sync the header BPM input too
      const headerBpm = root.querySelector<HTMLInputElement>('#input-bpm');
      if (headerBpm) headerBpm.value = String(val);
    });

  // Seek by clicking the timeline (S13)
  bindTimeline(root, signal);
}

// ─── Timeline Seek (S13) ──────────────────────────────────────────────────────

function bindTimeline(root: HTMLElement, signal: AbortSignal): void {
  const bar = root.querySelector<HTMLElement>('#timeline-bar');
  if (!bar) return;

  const doSeek = (e: MouseEvent): void => {
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    const project = appState.project;
    const endTick = computeProjectEndTick(project);
    const seekTick = Math.round(ratio * endTick);
    playbackEngine.seek(seekTick, project);
    updateTimelineCursor(root, ratio);
  };

  let dragging = false;
  bar.addEventListener('mousedown', (e) => {
    dragging = true;
    doSeek(e);
  });
  document.addEventListener('mousemove', (e) => {
    if (dragging) doSeek(e);
  }, { signal });
  document.addEventListener('mouseup', () => {
    dragging = false;
  }, { signal });
}

// ─── Position Display (S14) ───────────────────────────────────────────────────

function updatePositionDisplay(
  root: HTMLElement,
  bar: number,
  beat: number,
  tick: number,
  elapsed: number,
): void {
  const el = root.querySelector<HTMLElement>('#position-display');
  if (!el) return;

  const barStr = String(bar);
  const beatStr = String(beat);
  const tickStr = String(tick).padStart(3, '0');
  const totalSec = Math.round(elapsed);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');
  el.textContent = `${barStr}:${beatStr}:${tickStr} | ${mm}:${ss}`;

  // Update timeline cursor
  const project = appState.project;
  const end = computeProjectEndTick(project);
  if (end > 0) {
    const ratio = Math.min(1, appState.playback.currentTick / end);
    updateTimelineCursor(root, ratio);
  }
}

function updatePlayButton(root: HTMLElement, isPlaying: boolean): void {
  const btn = root.querySelector<HTMLButtonElement>('#btn-play');
  if (!btn) return;
  btn.textContent = isPlaying ? '⏸ Pause' : '▶ Play';
}

function updateTimelineCursor(root: HTMLElement, ratio: number): void {
  const cursor = root.querySelector<HTMLElement>('#timeline-cursor');
  if (cursor) cursor.style.left = `${(ratio * 100).toFixed(2)}%`;
}

function setStatus(root: HTMLElement, msg: string): void {
  const el = root.querySelector<HTMLElement>('#status-text');
  if (el) el.textContent = msg;
}

function computeProjectEndTick(project: {
  tracks: Array<{ notes: Array<{ startTick: number; durationTicks: number }> }>;
}): number {
  let max = 1920; // default 1 bar fallback
  for (const t of project.tracks) {
    for (const n of t.notes) {
      const end = n.startTick + n.durationTicks;
      if (end > max) max = end;
    }
  }
  return max;
}
