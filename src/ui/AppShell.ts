// ─── App Shell UI ─────────────────────────────────────────────────────────────

import { appState } from '../core/AppState.ts';

export function mountApp(container: HTMLElement): void {
  container.innerHTML = `
    <div class="app-shell">
      <header class="app-header">
        <h1 class="app-title">🎹 MIDI Creator</h1>
        <div class="header-controls">
          <button id="btn-new" class="btn btn-secondary">New</button>
          <button id="btn-open" class="btn btn-secondary">Open .mid</button>
          <button id="btn-save" class="btn btn-primary">Save .mid</button>
        </div>
      </header>

      <main class="app-main">
        <aside class="track-list" id="track-list">
          <div class="track-list-header">
            <span>Tracks</span>
            <button id="btn-add-track" class="btn btn-small">+ Add</button>
          </div>
          <div id="track-items"></div>
        </aside>
        <section class="piano-roll" id="piano-roll">
          <div class="piano-roll-placeholder">
            <p>Select a track to edit notes</p>
          </div>
        </section>
      </main>

      <footer class="transport-bar">
        <button id="btn-play" class="btn btn-transport">▶ Play</button>
        <button id="btn-stop" class="btn btn-transport">■ Stop</button>
        <label class="bpm-control">
          BPM: <input id="input-bpm" type="number" min="20" max="300" value="${appState.project.bpm}" />
        </label>
        <span class="status-text" id="status-text">Ready</span>
      </footer>
    </div>
  `;

  bindHeaderControls(container);
}

function bindHeaderControls(container: HTMLElement): void {
  container.querySelector('#btn-new')?.addEventListener('click', () => {
    appState.reset();
    mountApp(container);
  });
}
