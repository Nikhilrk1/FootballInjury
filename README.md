# Sideline

A responsive React + TypeScript frontend with a friendly, garnet-accented visual style. Built with Vite. No backend or ML model is implemented.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Vite prints the local URL. `npm run build` checks TypeScript and creates the production site in `dist/`. `npm run preview` serves that build locally.

## User flow

1. Search the curated player directory or filter by position and team.
2. Select a player to retrieve and review a sample profile.
3. Generate a demo prediction and follow the simulated analysis stages.
4. View a sample next-game probability and illustrative inputs, or download the clearly labeled JSON demo report.

Players can be bookmarked to My roster. Predictions appear in My predictions. Both persist in this browser using localStorage, with in-memory behavior if storage is unavailable. Reports are limited to the 30 most recent predictions.

## Connect the backend

- `src/services/playerService.ts` is the asynchronous service boundary. Replace `getPlayer(id, signal)` and `predict(playerId, onStage, signal)` with real API requests, preserving cancellation through `AbortSignal`.
- `src/types.ts` defines the player and prediction interfaces. Agree on the outcome definition and time horizon with the backend team before displaying actual model probabilities.
- `src/data/players.ts` contains the temporary directory and synthetic profile inputs. Replace the directory with a backend endpoint when available. The sample roster uses 2024 team affiliations.
- The simulated prediction service returns fixed sample probabilities. Its input bars are illustrative input magnitudes, not computed feature importance. A real model response must supply its own validated probability, risk categories, and explanations.
- In `src/App.tsx`, update the demo badges and explanatory text only when a real model integration is complete. Keep synthetic results separate from production predictions.

No API keys are required. Requests to the mock service support cancellation; errors are shown in the UI. The native help dialog supports Escape, focus containment, and focus return. Navigation, filters, and bookmarks work with a keyboard; the layout supports mobile and reduced-motion preferences.

## Data and assets

**All sample metrics, previous injury events, and probabilities are synthetic. They do not describe a player's actual injury history, health, or risk.** No model is connected. This is not a medical assessment.

The player directory is a curated 2024 roster snapshot; [NFL.com](https://www.nfl.com/players/) provides player context. Optional portraits are loaded from ESPN's public CDN and have a local SVG jersey fallback if unavailable. Nunito is loaded through Google Fonts, with local font fallbacks.
