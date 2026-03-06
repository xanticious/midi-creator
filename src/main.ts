import './style.css';
import { mountApp } from './ui/AppShell.ts';

const appEl = document.querySelector<HTMLDivElement>('#app');

if (!appEl) {
  throw new Error('Could not find #app mount point.');
}

mountApp(appEl);
