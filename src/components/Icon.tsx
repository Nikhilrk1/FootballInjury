import type { CSSProperties } from 'react';

const paths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  chart: <><path d="M4 4v16h17M8 15v-4m5 4V7m5 8v-6"/></>,
  bookmark: <path d="M6 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16l-6-4-6 4Z"/>,
  help: <><circle cx="12" cy="12" r="9"/><path d="M9.6 8.6a2.5 2.5 0 1 1 3.8 2.1c-1 .6-1.4 1.2-1.4 2.3m0 3h.01"/></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,
  arrow: <path d="M4 12h15m-6-6 6 6-6 6"/>,
  back: <path d="M20 12H5m6-6-6 6 6 6"/>,
  chevron: <path d="m8 10 4 4 4-4"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/></>,
  bolt: <path d="m13 2-9 12h7l-1 8 10-12h-7z"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  sliders: <><path d="M4 7h4m4 0h8M4 17h8m4 0h4"/><circle cx="10" cy="7" r="2"/><circle cx="14" cy="17" r="2"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  activity: <path d="M2 12h5l3-8 4 16 3-8h5"/>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/></>,
  file: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zm0 0v6h6M8 13h8m-8 4h5"/></>,
  football: <><path d="M21 3C11 1 1 11 3 21c10 2 20-8 18-18Z"/><path d="m8 16 8-8m-7 3 4 4m-1-7 4 4"/></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/></>,
  sparkles: <><path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6Z"/><path d="M20 2v4m-2-2h4"/></>,
};

export type IconName = keyof typeof paths;
export function Icon({ name, size = 22, className = '', style }: { name: IconName; size?: number; className?: string; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={style}>{paths[name]}</svg>;
}
