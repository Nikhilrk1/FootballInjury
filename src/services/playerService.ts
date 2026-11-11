import { players } from '../data/players';
import type { Player, Prediction } from '../types';

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Request canceled', 'AbortError'));
    const onAbort = () => { clearTimeout(timer); reject(new DOMException('Request canceled', 'AbortError')); };
    const timer = setTimeout(() => { signal?.removeEventListener('abort', onAbort); resolve(); }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

/** Replace these methods with backend requests. Keep demo data out of production responses. */
export const playerService = {
  async getPlayer(id: string, signal?: AbortSignal): Promise<Player> {
    await delay(450, signal);
    const player = players.find((entry) => entry.id === id);
    if (!player) throw new Error('We could not find that player. Please choose another.');
    return player;
  },
  async predict(playerId: string, onStage: (stage: number) => void, signal?: AbortSignal): Promise<Prediction> {
    onStage(0);
    const player = await this.getPlayer(playerId, signal);
    await delay(500, signal);
    onStage(1);
    await delay(850, signal);
    onStage(2);
    await delay(900, signal);
    const sample = player.sample;
    return {
      id: crypto.randomUUID(), playerId, probability: sample.probability,
      risk: sample.probability < 25 ? 'Lower' : sample.probability < 40 ? 'Moderate' : 'Higher',
      timeframe: 'Next game', createdAt: new Date().toISOString(), source: 'demo',
      factors: [
        { label: 'Recent workload', value: `${sample.workload}%`, contribution: sample.workload, description: 'An illustrative measure of recent playing intensity.' },
        { label: 'Previous injury events', value: `${sample.priorInjuries} sample events`, contribution: sample.priorInjuries * 24, description: 'Synthetic history for demonstrating the model inputs.' },
        { label: 'Recovery time', value: `${sample.restDays} days`, contribution: (8 - sample.restDays) * 18, description: 'Sample days of rest between games.' },
      ],
    };
  },
};
