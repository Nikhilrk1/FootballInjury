import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Player } from '../types';

export function PlayerPortrait({ player, large = false }: { player: Player; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <div className={`player-portrait ${large ? 'large' : ''}`} style={{ '--team-color': player.color, '--team-tint': player.tint } as CSSProperties}>
    <span className="portrait-number" aria-hidden="true">{player.number.toString().padStart(2, '0')}</span>
    <div className="portrait-circle" />
    {!failed ? <img src={`https://a.espncdn.com/i/headshots/nfl/players/full/${player.imageId}.png`} alt="" loading="lazy" onError={() => setFailed(true)} /> : <svg className="jersey-fallback" viewBox="0 0 200 150" aria-hidden="true"><path d="m57 38 24-10c9 10 29 10 38 0l24 10 30 36-25 18-12-13v68H64V79L52 92 27 74Z" fill={player.color}/><path d="m81 28 8 16h22l8-16" fill="white" opacity=".8"/><text x="100" y="109" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="46" fontWeight="800">{player.number}</text></svg>}
  </div>;
}
