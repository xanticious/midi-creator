// ─── Track List UI (S6–S10) ───────────────────────────────────────────────────
// Renders all tracks and wires up add, remove, rename, instrument, mute, solo.

import type { Track } from '../core/types.ts';
import { appState } from '../core/AppState.ts';
import { createTrack } from '../core/trackHelpers.ts';
import { INSTRUMENT_PRESETS, instrumentLabel } from '../utils/instruments.ts';

const MAX_TRACKS = 16;

// Callback type for requesting a full app remount (used after state changes that
// affect other parts of the shell, e.g. changing the track count).
export type OnTracksChanged = () => void;

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Renders the track list into the `#track-items` container and wires the
 * `+ Add` button found in `root`.  Call this once after mountApp().
 */
export function mountTrackList(
  root: HTMLElement,
  onChange: OnTracksChanged,
): void {
  const addBtn = root.querySelector<HTMLButtonElement>('#btn-add-track');
  if (addBtn) {
    // Remove any previous listener by cloning the button
    const fresh = addBtn.cloneNode(true);
    if (!(fresh instanceof HTMLButtonElement)) return;
    addBtn.parentNode?.replaceChild(fresh, addBtn);
    fresh.addEventListener('click', () => {
      handleAddTrack(root, onChange);
    });
  }
  renderTrackItems(root, onChange);
}

// ─── Rendering ───────────────────────────────────────────────────────────────

function renderTrackItems(root: HTMLElement, onChange: OnTracksChanged): void {
  const container = root.querySelector<HTMLElement>('#track-items');
  if (!container) return;

  const { tracks } = appState.project;
  const addBtn = root.querySelector<HTMLButtonElement>('#btn-add-track');

  // Disable add button once we hit the channel limit
  if (addBtn) {
    addBtn.disabled = tracks.length >= MAX_TRACKS;
    addBtn.title =
      tracks.length >= MAX_TRACKS
        ? 'Maximum 16 tracks (MIDI channel limit)'
        : 'Add new track';
  }

  if (tracks.length === 0) {
    container.innerHTML = `<p class="panel-placeholder">No tracks yet — click + Add</p>`;
    return;
  }

  const isSoloActive = tracks.some((t) => t.soloed);

  container.innerHTML = tracks
    .map((t, i) => buildTrackRow(t, i, isSoloActive))
    .join('');

  bindTrackRowEvents(container, root, onChange);
}

function buildTrackRow(
  track: Track,
  index: number,
  isSoloActive: boolean,
): string {
  const optionsHtml = INSTRUMENT_PRESETS.map(
    (p) =>
      `<option value="${p.program}"${p.program === track.instrument ? ' selected' : ''}>${p.label}</option>`,
  ).join('');

  const mutedClass = track.muted ? ' track-row--muted' : '';
  const soloedClass = track.soloed ? ' track-row--soloed' : '';
  // Dim tracks that are not soloed when any track is soloed
  const dimmedClass = isSoloActive && !track.soloed ? ' track-row--dimmed' : '';

  return `
    <div class="track-row${mutedClass}${soloedClass}${dimmedClass}" data-track-index="${index}">
      <div class="track-row-main">
        <span
          class="track-name"
          data-track-index="${index}"
          title="Double-click to rename"
          tabindex="0"
          role="button"
          aria-label="Track name: ${escHtml(track.name)}"
        >${escHtml(track.name)}</span>
        <div class="track-row-actions">
          <button
            class="btn-icon btn-mute${track.muted ? ' active' : ''}"
            data-track-index="${index}"
            title="${track.muted ? 'Unmute track' : 'Mute track'}"
            aria-pressed="${track.muted}"
          >M</button>
          <button
            class="btn-icon btn-solo${track.soloed ? ' active' : ''}"
            data-track-index="${index}"
            title="${track.soloed ? 'Unsolo track' : 'Solo track'}"
            aria-pressed="${track.soloed}"
          >S</button>
          <button
            class="btn-icon btn-delete-track"
            data-track-index="${index}"
            title="Delete track"
            aria-label="Delete ${escHtml(track.name)}"
          >✕</button>
        </div>
      </div>
      <div class="track-row-instrument">
        <select
          class="instrument-select"
          data-track-index="${index}"
          aria-label="Instrument for ${escHtml(track.name)}"
        >
          ${optionsHtml}
          ${
            INSTRUMENT_PRESETS.every((p) => p.program !== track.instrument)
              ? `<option value="${track.instrument}" selected>${instrumentLabel(track.instrument)}</option>`
              : ''
          }
        </select>
      </div>
    </div>`;
}

// ─── Event Binding ────────────────────────────────────────────────────────────

function bindTrackRowEvents(
  container: HTMLElement,
  root: HTMLElement,
  onChange: OnTracksChanged,
): void {
  // Instrument change
  container
    .querySelectorAll<HTMLSelectElement>('.instrument-select')
    .forEach((sel) => {
      sel.addEventListener('change', () => {
        const idx = parseInt(sel.dataset['trackIndex'] ?? '', 10);
        if (isNaN(idx)) return;
        appState.project.tracks[idx].instrument = parseInt(sel.value, 10);
        appState.markDirty();
        // No full re-render needed — instrument label stays the same
      });
    });

  // Mute toggle
  container.querySelectorAll<HTMLButtonElement>('.btn-mute').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = trackIndex(btn);
      if (idx < 0) return;
      const track = appState.project.tracks[idx];
      if (idx < 0 || idx >= appState.project.tracks.length) return;
      track.muted = !track.muted;
      appState.markDirty();
      renderTrackItems(root, onChange);
    });
  });

  // Solo toggle
  container.querySelectorAll<HTMLButtonElement>('.btn-solo').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = trackIndex(btn);
      if (idx < 0) return;
      const track = appState.project.tracks[idx];
      if (idx < 0 || idx >= appState.project.tracks.length) return;
      const wasSoloed = track.soloed;
      // Clear all solos first, then re-apply
      appState.project.tracks.forEach((t) => (t.soloed = false));
      if (!wasSoloed) track.soloed = true;
      appState.markDirty();
      renderTrackItems(root, onChange);
    });
  });

  // Delete track
  container
    .querySelectorAll<HTMLButtonElement>('.btn-delete-track')
    .forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = trackIndex(btn);
        if (idx < 0) return;
        if (appState.project.tracks.length <= 1) return; // min 1 track enforced
        const name = appState.project.tracks[idx]?.name ?? '';
        if (!name) return;
        if (!confirm(`Delete track "${name}"? This cannot be undone.`)) return;
        appState.project.tracks.splice(idx, 1);
        appState.markDirty();
        renderTrackItems(root, onChange);
        onChange();
      });
    });

  // Rename: double-click (or Enter) on track name
  container
    .querySelectorAll<HTMLSpanElement>('.track-name')
    .forEach((nameEl) => {
      nameEl.addEventListener('dblclick', () => {
        startRename(nameEl, root, onChange);
      });
      nameEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') startRename(nameEl, root, onChange);
      });
    });
}

// ─── Rename (S10) ─────────────────────────────────────────────────────────────

function startRename(
  nameEl: HTMLSpanElement,
  root: HTMLElement,
  onChange: OnTracksChanged,
): void {
  const idx = trackIndex(nameEl);
  if (idx < 0) return;
  const original = nameEl.textContent ?? '';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = original;
  input.className = 'track-name-input';
  input.setAttribute('aria-label', 'Rename track');

  nameEl.replaceWith(input);
  input.select();

  const commit = (): void => {
    const newName = input.value.trim();
    if (!newName) {
      showTrackError(input, 'Track name cannot be empty.');
      return;
    }
    appState.project.tracks[idx].name = newName;
    appState.markDirty();
    renderTrackItems(root, onChange);
  };

  const cancel = (): void => {
    renderTrackItems(root, onChange);
  };

  input.addEventListener('blur', commit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  });
}

function showTrackError(input: HTMLInputElement, message: string): void {
  input.title = message;
  input.classList.add('track-name-input--error');
  input.select();
}

// ─── Add Track (S6) ──────────────────────────────────────────────────────────

function handleAddTrack(root: HTMLElement, onChange: OnTracksChanged): void {
  const tracks = appState.project.tracks;
  if (tracks.length >= MAX_TRACKS) return;

  const n = tracks.length + 1;
  const channel = tracks.length % 16;
  const newTrack = createTrack({ name: `Track ${n}`, channel });
  tracks.push(newTrack);
  appState.markDirty();
  renderTrackItems(root, onChange);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function trackIndex(el: HTMLElement): number {
  const idx = parseInt(el.dataset['trackIndex'] ?? '', 10);
  return isNaN(idx) ? -1 : idx;
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
