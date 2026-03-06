import './style.css';
import { mountApp } from './ui/AppShell.ts';

function bootstrap(): void {
  const appEl = document.querySelector<HTMLDivElement>('#app');

  if (!appEl) {
    throw new Error('[midi-creator] Could not find #app mount point.');
  }

  try {
    mountApp(appEl);
  } catch (err) {
    console.error('[midi-creator] Failed to mount AppShell:', err);
    appEl.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;
                  font-family:system-ui;color:#e05c5c;background:#0f0f13;flex-direction:column;gap:1rem;">
        <strong>Failed to initialise MIDI Creator</strong>
        <pre style="font-size:0.8rem;color:#888;">${String(err)}</pre>
      </div>`;
  }
}

bootstrap();
