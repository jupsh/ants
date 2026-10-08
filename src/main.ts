import statusMd from '../docs/STATUS.md?raw';
import { renderE1 } from './ui/e1Page';
import { renderE2 } from './ui/e2Page';
import { renderE6 } from './ui/e6Page';
import './ui/style.css';

type Page = { id: string; label: string; render?: (root: HTMLElement) => (() => void) | void };

const PAGES: Page[] = [
  { id: 'e1', label: 'E1 Walking', render: renderE1 },
  { id: 'e2', label: 'E2 Recruit decision', render: renderE2 },
  { id: 'e6', label: 'E6 Food sharing', render: renderE6 },
  { id: 'colony', label: 'Colony (planned)' },
  { id: 'status', label: 'Project status', render: renderStatus },
];

function renderStatus(root: HTMLElement): void {
  root.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'status-doc';
  const pre = document.createElement('pre');
  pre.textContent = statusMd;
  wrap.appendChild(pre);
  root.appendChild(wrap);
}

const app = document.getElementById('app')!;
app.innerHTML = '';
const header = document.createElement('header');
header.className = 'app';
const h1 = document.createElement('h1');
h1.textContent = 'Ant Colony Simulator';
const sub = document.createElement('span');
sub.className = 'sub';
sub.textContent = 'Milestone M1 — Lasius niger reference species';
const nav = document.createElement('nav');
nav.className = 'tabs';
header.append(h1, sub, nav);
const main = document.createElement('main');
app.append(header, main);

let cleanup: (() => void) | void;
function show(id: string): void {
  const page = PAGES.find((p) => p.id === id && p.render) ?? PAGES[0];
  if (cleanup) cleanup();
  for (const b of nav.querySelectorAll('button')) b.setAttribute('aria-current', b.dataset.id === page.id ? 'page' : 'false');
  cleanup = page.render!(main);
  history.replaceState(null, '', `#${page.id}`);
}
for (const p of PAGES) {
  const b = document.createElement('button');
  b.textContent = p.label;
  b.dataset.id = p.id;
  b.disabled = !p.render;
  b.onclick = () => show(p.id);
  nav.appendChild(b);
}
show(location.hash.slice(1) || 'e1');
