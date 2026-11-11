import type { Player } from '../types';

// A curated 2024 roster snapshot. Every sample input and probability is synthetic.
// No injury history or predicted health status here represents an actual player.
export const players: Player[] = [
  { id: 'mahomes', name: 'Patrick Mahomes', team: 'Kansas City Chiefs', teamCode: 'KC', position: 'QB', number: 15, color: '#bd2638', tint: '#fff0ed', imageId: '3139477', sample: { games: 16, snaps: 1034, workload: 71, priorInjuries: 1, restDays: 7, probability: 18 } },
  { id: 'allen', name: 'Josh Allen', team: 'Buffalo Bills', teamCode: 'BUF', position: 'QB', number: 17, color: '#2456ac', tint: '#edf3ff', imageId: '3918298', sample: { games: 17, snaps: 1096, workload: 86, priorInjuries: 2, restDays: 6, probability: 32 } },
  { id: 'jefferson', name: 'Justin Jefferson', team: 'Minnesota Vikings', teamCode: 'MIN', position: 'WR', number: 18, color: '#6943a2', tint: '#f3edfc', imageId: '4262921', sample: { games: 15, snaps: 926, workload: 77, priorInjuries: 2, restDays: 7, probability: 28 } },
  { id: 'mccaffrey', name: 'Christian McCaffrey', team: 'San Francisco 49ers', teamCode: 'SF', position: 'RB', number: 23, color: '#b43238', tint: '#fff0e9', imageId: '3117251', sample: { games: 14, snaps: 849, workload: 92, priorInjuries: 3, restDays: 5, probability: 47 } },
  { id: 'jackson', name: 'Lamar Jackson', team: 'Baltimore Ravens', teamCode: 'BAL', position: 'QB', number: 8, color: '#5e4194', tint: '#f1edfa', imageId: '3916387', sample: { games: 16, snaps: 1012, workload: 82, priorInjuries: 1, restDays: 7, probability: 24 } },
  { id: 'hurts', name: 'Jalen Hurts', team: 'Philadelphia Eagles', teamCode: 'PHI', position: 'QB', number: 1, color: '#226967', tint: '#e8f4ef', imageId: '4040715', sample: { games: 16, snaps: 1042, workload: 84, priorInjuries: 2, restDays: 6, probability: 30 } },
  { id: 'lamb', name: 'CeeDee Lamb', team: 'Dallas Cowboys', teamCode: 'DAL', position: 'WR', number: 88, color: '#254875', tint: '#edf2f8', imageId: '4241389', sample: { games: 17, snaps: 987, workload: 75, priorInjuries: 1, restDays: 7, probability: 20 } },
  { id: 'kelce', name: 'Travis Kelce', team: 'Kansas City Chiefs', teamCode: 'KC', position: 'TE', number: 87, color: '#bd2638', tint: '#fff0ed', imageId: '15847', sample: { games: 15, snaps: 814, workload: 68, priorInjuries: 2, restDays: 7, probability: 29 } },
  { id: 'burrow', name: 'Joe Burrow', team: 'Cincinnati Bengals', teamCode: 'CIN', position: 'QB', number: 9, color: '#cb592a', tint: '#fff2e8', imageId: '3915511', sample: { games: 15, snaps: 1027, workload: 80, priorInjuries: 3, restDays: 6, probability: 41 } },
  { id: 'barkley', name: 'Saquon Barkley', team: 'Philadelphia Eagles', teamCode: 'PHI', position: 'RB', number: 26, color: '#226967', tint: '#e8f4ef', imageId: '3929630', sample: { games: 16, snaps: 923, workload: 89, priorInjuries: 2, restDays: 7, probability: 36 } },
  { id: 'kittle', name: 'George Kittle', team: 'San Francisco 49ers', teamCode: 'SF', position: 'TE', number: 85, color: '#b43238', tint: '#fff0e9', imageId: '3040151', sample: { games: 15, snaps: 861, workload: 72, priorInjuries: 2, restDays: 7, probability: 27 } },
  { id: 'stbrown', name: 'Amon-Ra St. Brown', team: 'Detroit Lions', teamCode: 'DET', position: 'WR', number: 14, color: '#287ca5', tint: '#ebf6fb', imageId: '4374302', sample: { games: 17, snaps: 1018, workload: 74, priorInjuries: 1, restDays: 7, probability: 19 } },
];

export const positions = ['All players', 'QB', 'RB', 'WR', 'TE'] as const;
export const teams = [...new Set(players.map((player) => player.team))].sort();
