// ─── App Shell UI ─────────────────────────────────────────────────────────────

import { playbackEngine } from '../audio/PlaybackEngine.ts';
import { appState } from '../core/AppState.ts';
import { createEmptyProject } from '../core/trackHelpers.ts';
import {
  openFilePicker,
  readFileAsArrayBuffer,
  validateMidiExtension,
} from '../io/fileLoader.ts';
import { loadMidiFile } from '../io/midiFile.ts';
import { mountTrackList } from './TrackList.ts';
import { mountTransportBar } from './TransportBar.ts';

export function mountApp(container: HTMLElement): void {
  const { title, bpm, timeSignature } = appState.project;
  const timeSig = `${timeSignature.numerator}/${timeSignature.denominator}`;

  container.innerHTML = `
    <div class="app-shell">
      <header class="app-header">
        <div class="header-brand">
          <h1 class="app-title">🎹 MIDI Creator</h1>
        </div>
        <div class="header-project-meta">
          <span
            id="project-title"
            class="project-title"
            contenteditable="true"
            spellcheck="false"
            title="Click to rename project"
            aria-label="Project title"
          >${escapeHtml(title)}</span>
          <label class="meta-field" title="Beats per minute (20–300)">
            BPM:
            <input id="input-bpm" type="number" min="20" max="300"
                   class="meta-input meta-input--bpm"
                   value="${bpm}" aria-label="Beats per minute" />
          </label>
          <span class="meta-field" title="Time signature">
            Time: <span id="time-signature" class="meta-value">${timeSig}</span>
          </span>
        </div>
        <nav class="header-controls" aria-label="File actions">
          <button id="btn-new"    class="btn btn-secondary" title="New project">New</button>
          <button id="btn-open"   class="btn btn-secondary" title="Open .mid file">Open</button>
          <button id="btn-save"   class="btn btn-primary"   title="Save as .mid">Save</button>
          <button id="btn-export" class="btn btn-secondary" title="Export audio">Export</button>
        </nav>
      </header>

      <main class="app-main">
        <aside class="track-list" id="track-list" aria-label="Track list">
          <div class="track-list-header">
            <span>Tracks</span>
            <button id="btn-add-track" class="btn btn-small" title="Add new track">+ Add</button>
          </div>
          <div id="track-items">
            <p class="panel-placeholder">No tracks yet — click + Add</p>
          </div>
        </aside>

        <section class="piano-roll" id="piano-roll" aria-label="Piano roll editor">
          <div class="piano-roll-placeholder">
            <p class="placeholder-title">Piano Roll</p>
            <p class="placeholder-hint">Select a track to edit notes here</p>
          </div>
        </section>
      </main>

      <footer class="transport-bar" aria-label="Transport and status">
      </footer>
    </div>
  `;

  bindControls(container);
  mountTrackList(container, () => {
    mountApp(container);
  });
  mountTransportBar(container);
}

function bindControls(container: HTMLElement): void {
  container.querySelector('#btn-new')?.addEventListener('click', () => {
    if (appState.isDirty()) {
      if (!confirm('Discard unsaved changes and create a new project?')) {
        return;
      }
    }
    appState.loadProject(createEmptyProject());
    mountApp(container);
    setStatus(container, 'New project created');
  });

  container.querySelector('#btn-open')?.addEventListener('click', () => {
    openFilePicker()
      .then((result) => {
        if (!result) return; // user cancelled
        try {
          const project = loadMidiFile(result.buffer);
          appState.loadProject(project);
          appState.setPendingMidi(result.buffer, result.filename);
        } catch (parseErr: unknown) {
          const msg =
            parseErr instanceof Error ? parseErr.message : String(parseErr);
          setStatus(
            container,
            `Error: Could not parse "${result.filename}": ${msg}`,
          );
          return;
        }
        mountApp(container);
        setStatus(container, `Opened: ${result.filename}`);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        setStatus(container, `Error: ${msg}`);
      });
  });

  container.querySelector('#btn-save')?.addEventListener('click', () => {
    setStatus(container, 'Save — not yet implemented');
  });

  container.querySelector('#btn-export')?.addEventListener('click', () => {
    setStatus(container, 'Export — not yet implemented');
  });

  // Track add/remove/rename/instrument handled by TrackList module (mountTrackList)

  bindDragAndDrop(container);

  // BPM input — clamp to 20–300, update Tone.Transport, and keep AppState + transport input in sync
  container.querySelector('#input-bpm')?.addEventListener('change', (e) => {
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
    // Sync transport BPM input
    const transportBpm = container.querySelector<HTMLInputElement>('#input-bpm-transport');
    if (transportBpm) transportBpm.value = String(val);
  });

  // Project title inline editing (contenteditable span)
  bindTitleEdit(container);
}

function bindTitleEdit(container: HTMLElement): void {
  const titleEl = container.querySelector<HTMLElement>('#project-title');
  if (!titleEl) return;

  let originalText = titleEl.textContent ?? '';

  titleEl.addEventListener('focus', () => {
    originalText = titleEl.textContent ?? '';
  });

  titleEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      titleEl.blur();
    } else if (e.key === 'Escape') {
      titleEl.textContent = originalText;
      titleEl.blur();
    }
  });

  titleEl.addEventListener('blur', () => {
    const newTitle = titleEl.textContent?.trim() ?? '';
    if (!newTitle) {
      titleEl.textContent = originalText;
      return;
    }
    appState.project.title = newTitle;
    appState.markDirty();
  });
}

function bindDragAndDrop(container: HTMLElement): void {
  const dropTarget =
    container.querySelector<HTMLElement>('.app-main') ?? container;

  dropTarget.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropTarget.classList.add('drag-over');
  });

  dropTarget.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropTarget.classList.remove('drag-over');
  });

  dropTarget.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropTarget.classList.remove('drag-over');

    const file = e.dataTransfer?.files?.[0] ?? null;
    if (!file) return;

    if (!validateMidiExtension(file.name)) {
      setStatus(
        container,
        `Error: Unsupported file type "${file.name}". Please drop a .mid or .midi file.`,
      );
      return;
    }

    readFileAsArrayBuffer(file)
      .then((buffer) => {
        try {
          const project = loadMidiFile(buffer);
          appState.loadProject(project);
          appState.setPendingMidi(buffer, file.name);
        } catch (parseErr: unknown) {
          const msg =
            parseErr instanceof Error ? parseErr.message : String(parseErr);
          setStatus(container, `Error: Could not parse "${file.name}": ${msg}`);
          return;
        }
        mountApp(container);
        setStatus(container, `Opened: ${file.name}`);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        setStatus(container, `Error: ${msg}`);
      });
  });
}

function setStatus(container: HTMLElement, message: string): void {
  const el = container.querySelector<HTMLElement>('#status-text');
  if (el) el.textContent = message;
}
/** Escapes HTML special characters so project titles are safe to embed in innerHTML. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
