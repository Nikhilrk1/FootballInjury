import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Icon } from './components/Icon';
import type { IconName } from './components/Icon';
import { PlayerPortrait } from './components/PlayerPortrait';
import { players, positions, teams } from './data/players';
import { playerService } from './services/playerService';
import type { Player, Prediction, View } from './types';

const stages = ['Retrieving player data', 'Preparing model inputs', 'Generating your prediction'];

function readSaved(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem('sideline-roster') || '[]');
    return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === 'string' && players.some((p) => p.id === id)) : [];
  } catch { return []; }
}

function readPredictions(): Prediction[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem('sideline-predictions') || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.filter((entry): entry is Prediction => entry && typeof entry.id === 'string' && entry.source === 'demo' && players.some((p) => p.id === entry.playerId) && Number.isFinite(entry.probability) && entry.probability >= 0 && entry.probability <= 100 && ['Lower', 'Moderate', 'Higher'].includes(entry.risk) && typeof entry.timeframe === 'string' && typeof entry.createdAt === 'string' && !Number.isNaN(Date.parse(entry.createdAt)) && Array.isArray(entry.factors) && entry.factors.length === 3 && entry.factors.every((factor: Prediction['factors'][number]) => factor && typeof factor.label === 'string' && typeof factor.description === 'string' && typeof factor.value === 'string' && Number.isFinite(factor.contribution) && factor.contribution >= 0 && factor.contribution <= 100)).slice(0, 30);
  } catch { return []; }
}

function App() {
  const [view, setView] = useState<View>('explore');
  const [selected, setSelected] = useState<Player | null>(null);
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState<string>('All players');
  const [team, setTeam] = useState('All teams');
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(readSaved);
  const [history, setHistory] = useState(readPredictions);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [stage, setStage] = useState(0);
  const [profileReady, setProfileReady] = useState(false);
  const [error, setError] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => { try { localStorage.setItem('sideline-roster', JSON.stringify(saved)); } catch { /* The app also works without browser storage. */ } }, [saved]);
  useEffect(() => { try { localStorage.setItem('sideline-predictions', JSON.stringify(history)); } catch { /* Keep this session usable when storage is unavailable. */ } }, [history]);

  useEffect(() => {
    if (view !== 'profile' || !selected) return;
    const controller = new AbortController();
    setProfileReady(false);
    playerService.getPlayer(selected.id, controller.signal).then(() => setProfileReady(true)).catch((cause: Error) => { if (cause.name !== 'AbortError') setError(cause.message); });
    return () => controller.abort();
  }, [view, selected]);

  useEffect(() => {
    if (view !== 'analyzing' || !selected) return;
    const controller = new AbortController();
    playerService.predict(selected.id, setStage, controller.signal).then((result) => {
      setPrediction(result);
      setHistory((current) => [result, ...current].slice(0, 30));
      setView('result');
    }).catch((cause: Error) => { if (cause.name !== 'AbortError') { setError(cause.message); setView('profile'); } });
    return () => controller.abort();
  }, [view, selected]);

  function navigate(next: View) {
    setView(next); setMenuOpen(false); setError('');
    window.scrollTo({ top: 0, behavior: 'instant' });
    requestAnimationFrame(() => mainRef.current?.focus({ preventScroll: true }));
  }

  function toggleSave(id: string) { setSaved((current) => current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]); }
  function resetFilters() { setQuery(''); setPosition('All players'); setTeam('All teams'); setExpanded(false); }
  function reviewPlayer(player: Player) { setSelected(player); setProfileReady(false); navigate('profile'); }
  function openPrediction(result: Prediction) {
    setSelected(players.find((player) => player.id === result.playerId)!); setPrediction(result); navigate('result');
  }

  const filtered = players.filter((player) => (view !== 'roster' || saved.includes(player.id)) && (position === 'All players' || player.position === position) && (team === 'All teams' || player.team === team) && `${player.name} ${player.team} ${player.teamCode}`.toLowerCase().includes(query.trim().toLowerCase()));
  const visible = expanded ? filtered : filtered.slice(0, 6);
  const isFlow = ['profile', 'analyzing', 'result'].includes(view);

  return <div className="app-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <aside className={`sidebar ${menuOpen ? 'mobile-open' : ''}`}>
      <button className="brand" onClick={() => navigate('explore')} aria-label="Sideline home"><span className="brand-symbol"><Icon name="shield" size={27}/></span>sideline<span className="brand-dot">.</span></button>
      <div className="nav-label">YOUR PLAYBOOK</div>
      <nav aria-label="Main navigation">
        {([{ name: 'Explore players', icon: 'grid', target: 'explore' }, { name: 'My predictions', icon: 'chart', target: 'predictions' }, { name: 'My roster', icon: 'bookmark', target: 'roster' }] as { name: string; icon: IconName; target: View }[]).map((item) => <button key={item.target} className={`nav-item ${(view === item.target || (item.target === 'explore' && isFlow)) ? 'active' : ''}`} aria-current={(view === item.target || (item.target === 'explore' && isFlow)) ? 'page' : undefined} onClick={() => { resetFilters(); navigate(item.target); }}><Icon name={item.icon}/><span>{item.name}</span>{item.target === 'roster' && saved.length > 0 && <span className="nav-count">{saved.length}</span>}</button>)}
        <button className="nav-item" onClick={() => { setHelpOpen(true); setMenuOpen(false); }}><Icon name="help"/><span>How it works</span></button>
      </nav>
      <div className="sidebar-promo"><h3>Ahead of the game.</h3><p>A little data. A little insight.<br/>A whole new perspective.</p><button onClick={() => setHelpOpen(true)}>Meet your playbook <Icon name="arrow" size={16}/></button></div>
    </aside>

    <div className="workspace">
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen}><Icon name={menuOpen ? 'close' : 'menu'}/></button>
        <div className="breadcrumb"><span>Your playbook</span><Icon name="chevron" size={14}/><strong>{view === 'roster' ? 'My roster' : view === 'predictions' ? 'My predictions' : 'Explore players'}</strong></div>
        <div className="topbar-actions"><button className="icon-button help-button" onClick={() => setHelpOpen(true)} aria-label="About this project"><Icon name="help" size={20}/></button><div className="avatar" aria-label="Guest user">G</div></div>
      </header>

      <main id="main" ref={mainRef} tabIndex={-1}>
        {error && <div className="error-message" role="alert"><Icon name="info" size={19}/>{error}<button onClick={() => setError('')} aria-label="Dismiss error"><Icon name="close" size={18}/></button></div>}
        {(view === 'explore' || view === 'roster') && <>
          {view === 'explore' ? <section className="hero"><div className="hero-copy"><h1>Know the player.<br/><span>See the bigger picture.</span></h1><p>Explore NFL players and discover what the data<br className="desktop-break"/> can tell us about their injury risk.</p></div></section> : <section className="page-heading"><div className="eyebrow">YOUR PERSONAL LINEUP</div><h1>Keep your favorites close.</h1><p>Your saved players, ready for another look.</p></section>}

          <Stepper current={0}/>
          <section className="explorer" aria-labelledby="explorer-heading">
            <div className="section-heading"><div><h2 id="explorer-heading">{view === 'roster' ? 'Your roster' : 'Who’s on your radar?'} <span className="count-badge">{view === 'roster' ? saved.length : players.length}</span></h2><p>{view === 'roster' ? 'Choose a saved player to explore their profile.' : 'Pick a player. We’ll take it from here.'}</p></div><span className="dataset-label"><span/>2024 roster snapshot</span></div>
            <div className="search-row"><label className="search-input"><Icon name="search" size={20}/><input value={query} onChange={(event) => { setQuery(event.target.value); setExpanded(false); }} placeholder="Search for a player or team…" aria-label="Search players by name or team"/>{query && <button onClick={() => setQuery('')} aria-label="Clear search"><Icon name="close" size={16}/></button>}</label><label className="team-select"><Icon name="sliders" size={18}/><select aria-label="Filter by team" value={team} onChange={(event) => { setTeam(event.target.value); setExpanded(false); }}><option>All teams</option>{teams.map((name) => <option key={name}>{name}</option>)}</select><Icon name="chevron" size={16}/></label></div>
            <div className="filter-row"><div className="position-filters" aria-label="Filter by position">{positions.map((entry) => <button key={entry} aria-pressed={position === entry} className={position === entry ? 'selected' : ''} onClick={() => { setPosition(entry); setExpanded(false); }}>{entry === 'All players' && <Icon name="grid" size={15}/>} {entry}</button>)}</div><span className="result-count">{filtered.length} player{filtered.length === 1 ? '' : 's'}</span></div>
            {filtered.length > 0 ? <div className="player-grid">{visible.map((player) => <article className={`player-card ${selected?.id === player.id ? 'is-selected' : ''}`} key={player.id} style={{ '--team-color': player.color, '--team-tint': player.tint } as CSSProperties}>
              <div className="card-visual"><PlayerPortrait player={player}/><span className="team-tag">{player.teamCode}</span><button className={`save-button ${saved.includes(player.id) ? 'is-saved' : ''}`} onClick={() => toggleSave(player.id)} aria-label={`${saved.includes(player.id) ? 'Remove' : 'Save'} ${player.name}${saved.includes(player.id) ? ' from' : ' to'} roster`} aria-pressed={saved.includes(player.id)}><Icon name="bookmark" size={18}/></button></div>
              <button className="player-card-body" onClick={() => reviewPlayer(player)}><div className="player-title"><h3>{player.name}</h3><span className="position-badge">{player.position}</span></div><p>{player.team}</p><div className="card-bottom"><span>#{player.number} <i/> {positionName(player.position)}</span><span className="card-arrow"><Icon name="arrow" size={17}/></span></div></button>
            </article>)}</div> : <div className="empty-state"><span className="empty-icon"><Icon name={view === 'roster' && saved.length === 0 ? 'bookmark' : 'search'} size={30}/></span><h3>{view === 'roster' && saved.length === 0 ? 'Build your starting lineup.' : 'No players on this play.'}</h3><p>{view === 'roster' && saved.length === 0 ? 'Save a player using the bookmark on their card.' : 'Try another name, position, or team.'}</p><button className="button secondary" onClick={() => { resetFilters(); if (view === 'roster' && saved.length === 0) navigate('explore'); }}>{view === 'roster' && saved.length === 0 ? 'Explore players' : 'Clear filters'}<Icon name="arrow" size={17}/></button></div>}
            {filtered.length > 6 && <div className="load-more"><button className="button secondary" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show fewer players' : `Explore all ${filtered.length} players`}<Icon name="chevron" size={17} className={expanded ? 'rotate' : ''}/></button></div>}
          </section>
          <div className="bottom-note"><span className="note-icon"><Icon name="sparkles" size={23}/></span><div><strong>The game is unpredictable. Your insights don’t have to be.</strong><p>Turn player data into a new way to understand the game.</p></div><button onClick={() => setHelpOpen(true)}>How it works <Icon name="arrow" size={17}/></button></div>
        </>}

        {view === 'profile' && selected && <>
          <button className="back-link" onClick={() => navigate('explore')}><Icon name="back" size={18}/>Back to players</button><Stepper current={1}/>
          <section className="page-heading"><div className="eyebrow">MEET YOUR PLAYER</div><h1>A closer look at {selected.name.split(' ')[0]}.</h1><p>Here’s the sample data going into your prediction.</p></section>
          <div className="profile-layout"><section className="profile-card"><PlayerPortrait key={selected.id} player={selected} large/><div className="profile-identity"><span className="position-badge">{selected.position}</span><h2>{selected.name}</h2><p>{selected.team} <span>· #{selected.number}</span></p><button className="button secondary compact" onClick={() => toggleSave(selected.id)}><Icon name={saved.includes(selected.id) ? 'check' : 'bookmark'} size={17}/>{saved.includes(selected.id) ? 'Saved to roster' : 'Save to roster'}</button></div></section>
          <section className="profile-data"><div className="section-heading"><div><h2>The data behind the play</h2><p>Synthetic inputs for this demo</p></div><span className="soft-badge">Sample profile</span></div><div className={`stats-grid ${!profileReady ? 'loading-stats' : ''}`} aria-busy={!profileReady}><Stat icon="football" label="Games played" value={profileReady ? `${selected.sample.games}` : '—'} detail="Sample season"/><Stat icon="activity" label="Season snaps" value={profileReady ? selected.sample.snaps.toLocaleString() : '—'} detail="Sample total"/><Stat icon="clock" label="Rest between games" value={profileReady ? `${selected.sample.restDays} days` : '—'} detail="Sample recovery window"/><Stat icon="file" label="Previous injury events" value={profileReady ? `${selected.sample.priorInjuries}` : '—'} detail="Synthetic history"/></div><div className="workload"><div><span>Sample workload</span><strong>{selected.sample.workload}%</strong></div><div className="workload-track"><span style={{ width: `${selected.sample.workload}%` }}/></div><p>Illustrative intensity based on sample playing time.</p></div><div className="data-disclaimer"><Icon name="info" size={19}/><p>These inputs are made up for the demo. They do not describe {selected.name}’s actual health or injury history.</p></div><button className="button primary wide" disabled={!profileReady} onClick={() => { setStage(0); navigate('analyzing'); }}>{profileReady ? 'Generate demo prediction' : 'Loading sample profile…'}<Icon name="sparkles" size={19}/></button><p className="button-hint"><Icon name="clock" size={13}/>Your next insight is a few seconds away.</p></section></div>
        </>}

        {view === 'analyzing' && selected && <><Stepper current={2}/><section className="analyzing-panel"><span className="soft-badge">DEMO ANALYSIS</span><h1>A little number crunching.<br/>A whole new perspective.</h1><p>Preparing an illustrative prediction for <strong>{selected.name}</strong>.</p><div className="analysis-stages" role="status" aria-live="polite">{stages.map((label, index) => <div key={label} className={index < stage ? 'complete' : index === stage ? 'in-progress' : ''}><span>{index < stage ? <Icon name="check" size={16}/> : index === stage ? <span className="spinner"/> : index + 1}</span>{label}</div>)}</div><p className="demo-analysis-note">This demo simulates the model workflow using sample data.</p><button className="text-button" onClick={() => navigate('profile')}>Cancel analysis</button></section></>}

        {view === 'result' && selected && prediction && <>
          <button className="back-link" onClick={() => navigate('explore')}><Icon name="back" size={18}/>Explore another player</button><Stepper current={3}/><section className="page-heading"><div className="eyebrow"><Icon name="check" size={16}/> DEMO ANALYSIS COMPLETE</div><h1>Your next insight is in.</h1><p>An illustrative look at {selected.name}’s injury risk.</p></section>
          <div className="results-layout"><section className={`risk-card ${prediction.risk.toLowerCase()}`}><div className="risk-card-heading"><Icon name="shield" size={23}/><span>ILLUSTRATIVE INJURY PROBABILITY</span></div><div className="risk-gauge" style={{ '--risk-value': `${prediction.probability * 3.6}deg` } as CSSProperties}><div><strong>{prediction.probability}<span>%</span></strong><p>{prediction.timeframe}</p></div></div><span className="risk-level">{prediction.risk} sample risk</span><h2>{selected.name}</h2><p>{selected.team} · {selected.position} · #{selected.number}</p><div className="risk-scale"><span>0%</span><i/><span>100%</span></div><div className="risk-caption">A fixed demo value. A real model is not connected.</div></section>
          <section className="factors-card"><div className="section-heading"><div><h2>What goes into the prediction?</h2><p>Example inputs a future model could consider.</p></div></div><div className="factors-list">{prediction.factors.map((factor, index) => <div className="factor" key={factor.label}><div className="factor-title"><span className="factor-icon"><Icon name={(['activity', 'file', 'clock'] as IconName[])[index]}/></span><strong>{factor.label}</strong><span>{factor.value}</span></div><div className="factor-track"><span style={{ width: `${factor.contribution}%` }}/></div><p>{factor.description}</p></div>)}</div><div className="data-disclaimer"><Icon name="info" size={20}/><p>This is a frontend demonstration, not a medical assessment. The percentage and input bars are synthetic; they are not model explanations or real health information.</p></div></section></div>
          <div className="result-actions"><button className="button primary" onClick={() => navigate('explore')}>Explore another player<Icon name="arrow" size={18}/></button><button className="button secondary" onClick={() => downloadReport(selected, prediction)}><Icon name="download" size={18}/>Download demo report</button><span><Icon name="check" size={16}/>Saved to My predictions</span></div>
        </>}

        {view === 'predictions' && <><section className="page-heading"><div className="eyebrow">YOUR INSIGHTS, ALL TOGETHER</div><h1>A playbook of perspectives.</h1><p>Revisit your demo predictions and keep exploring.</p></section>{history.length === 0 ? <div className="empty-state predictions-empty"><h2>Your first insight is waiting.</h2><p>Choose a player and generate a demo prediction to start your playbook.</p><button className="button primary" onClick={() => navigate('explore')}>Find a player<Icon name="arrow" size={18}/></button></div> : <div className="history-list">{history.map((result) => { const player = players.find((entry) => entry.id === result.playerId)!; return <button className="history-item" key={result.id} onClick={() => openPrediction(result)}><span className="history-team" style={{ color: player.color, background: player.tint }}>{player.teamCode}</span><span className="history-name"><strong>{player.name}</strong><span>{player.team} · {player.position}</span></span><span className={`history-risk ${result.risk.toLowerCase()}`}><strong>{result.probability}%</strong><span>{result.risk} sample risk</span></span><span className="history-date">{new Date(result.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}<small>Demo prediction</small></span><Icon name="arrow" size={20}/></button>; })}</div>}</>}

        <footer className="page-footer"><span>Made for the love of the game.</span><span>Sample data. Real curiosity.<i/> <button onClick={() => setHelpOpen(true)}>About this project <Icon name="arrow" size={13}/></button></span></footer>
      </main>
    </div>
    {helpOpen && <HelpDialog onClose={() => setHelpOpen(false)}/>}
  </div>;
}

function Stepper({ current }: { current: number }) {
  return <ol className="stepper" aria-label="Prediction progress">{['Choose a player', 'Review player data', 'Get your prediction'].map((label, index) => <li key={label} className={current > index ? 'done' : current === index ? 'current' : ''} aria-current={current === index ? 'step' : undefined}><span className="step-number">{current > index ? <Icon name="check" size={15}/> : index + 1}</span><span>{label}</span>{index < 2 && <span className="step-line"/>}</li>)}</ol>;
}

function Stat({ icon, label, value, detail }: { icon: IconName; label: string; value: string; detail: string }) {
  return <div className="stat"><span><Icon name={icon} size={18}/>{label}</span><strong>{value}</strong><small>{detail}</small></div>;
}

function HelpDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; if (dialog && !dialog.open) dialog.showModal(); }, []);
  return <dialog ref={ref} className="help-dialog" onClose={onClose} onClick={(event) => { if (event.target === ref.current) { const rect = ref.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }} aria-labelledby="help-title"><button className="dialog-close icon-button" onClick={onClose} aria-label="Close project information"><Icon name="close"/></button><span className="dialog-symbol"><Icon name="football" size={30}/></span><div className="eyebrow">WELCOME TO SIDELINE</div><h2 id="help-title">A smarter look at the game.</h2><p>A machine learning project exploring how football player data could help estimate injury probability.</p><div className="help-steps">{[{ icon: 'search', title: 'Find your player', body: 'Search the sample NFL roster, or filter by team and position.' }, { icon: 'file', title: 'Get to know the data', body: 'Review example workload, playing time, and recovery inputs.' }, { icon: 'sparkles', title: 'Explore a prediction', body: 'Walk through a simulated analysis and see an illustrative result.' }].map((item, index) => <div key={item.title}><span><Icon name={item.icon as IconName} size={22}/></span><div><h3>{index + 1}. {item.title}</h3><p>{item.body}</p></div></div>)}</div><div className="data-disclaimer"><Icon name="info" size={20}/><p>Frontend demo only. No model is connected. All metrics, injury events, and probabilities are synthetic and do not represent the players’ actual health. Saved players and reports stay in this browser.</p></div><p className="source-note">Roster context: <a href="https://www.nfl.com/players/" target="_blank" rel="noreferrer">NFL player directory</a>. Player portraits: ESPN. This is an independent project.</p><button className="button primary wide" onClick={onClose}>Let’s explore<Icon name="arrow" size={18}/></button></dialog>;
}

function positionName(position: Player['position']) { return { QB: 'Quarterback', WR: 'Wide receiver', RB: 'Running back', TE: 'Tight end' }[position]; }
function downloadReport(player: Player, prediction: Prediction) {
  const report = { notice: 'SYNTHETIC FRONTEND DEMO. No ML model is connected. This is not actual player health data or a medical assessment.', player: { id: player.id, name: player.name, team: player.team, position: player.position }, sampleInputs: player.sample, prediction };
  const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = `sideline-${player.id}-demo.json`; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default App;
