// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CendiaReplay™ — Live Decision Replay Theater
 *
 * Generates a shareable, animated replay of any AI Council deliberation.
 * Returns a self-contained HTML page that shows each agent's reasoning,
 * confidence scores, dissents, and votes unfolding step-by-step — like
 * watching a debate replay. Works as a standalone URL or embedded page.
 *
 * @module services/visualization/DecisionReplayTheaterService
 * @exports decisionReplayTheaterService
 */

import { sha256, bytesToHex, utf8ToBytes } from '../crypto/nativeCrypto.js';
import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ReplayEvent {
  timestamp: number;      // ms offset from start
  type: 'phase_start' | 'agent_response' | 'dissent' | 'vote' | 'decision';
  agent?: string;
  agentRole?: string;
  phase?: string;
  content?: string;
  confidence?: number;
  dissented?: boolean;
  sources?: string[];
}

export interface ReplayData {
  replayId: string;
  deliberationId: string;
  question: string;
  mode: string;
  events: ReplayEvent[];
  agents: { name: string; role: string; color: string }[];
  outcome: {
    decision: string;
    consensusScore: number;
    dissentCount: number;
    totalAgents: number;
  };
  duration: number;       // total ms
  generatedAt: string;
}

// Agent colors for visual distinction
const AGENT_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

// =============================================================================
// SERVICE
// =============================================================================

class DecisionReplayTheaterServiceImpl {
  private replayCache = new Map<string, ReplayData>();

  constructor() {
    logger.info('🎬 CendiaReplay: Initialized — decision replay theater active');
  }

  // ---------------------------------------------------------------------------
  // REPLAY DATA GENERATION
  // ---------------------------------------------------------------------------

  async generateReplayData(deliberationId: string): Promise<ReplayData> {
    // Check cache first
    const cached = this.replayCache.get(deliberationId);
    if (cached) return cached;

    // Fetch deliberation
    const deliberation = await prisma.deliberations.findUnique({
      where: { id: deliberationId },
    });

    if (!deliberation) {
      throw new Error(`Deliberation ${deliberationId} not found`);
    }

    // Fetch all messages with agent info, ordered chronologically
    const messages = await prisma.deliberation_messages.findMany({
      where: { deliberation_id: deliberationId },
      include: { agents: true },
      orderBy: { created_at: 'asc' },
    });

    // Fetch dissents
    let dissents: any[] = [];
    try {
      dissents = await prisma.dissents.findMany({
        where: { decision_id: deliberationId },
      });
    } catch { /* table may not exist */ }

    // Build agent list with colors
    const agentMap = new Map<string, { name: string; role: string; color: string }>();
    let colorIdx = 0;
    for (const msg of messages) {
      if (!agentMap.has(msg.agent_id)) {
        agentMap.set(msg.agent_id, {
          name: msg.agents.name,
          role: msg.agents.role,
          color: AGENT_COLORS[colorIdx % AGENT_COLORS.length],
        });
        colorIdx++;
      }
    }
    const agents = Array.from(agentMap.values());

    // Build timeline events
    const events: ReplayEvent[] = [];
    const startTime = messages.length > 0 ? messages[0].created_at.getTime() : Date.now();
    let lastPhase = '';

    for (const msg of messages) {
      const offset = msg.created_at.getTime() - startTime;

      // Phase transition
      if (msg.phase !== lastPhase) {
        events.push({
          timestamp: offset,
          type: 'phase_start',
          phase: msg.phase,
        });
        lastPhase = msg.phase;
      }

      // Agent response
      const agentInfo = agentMap.get(msg.agent_id);
      const sources = (msg.sources as any[]) || [];
      const dissentedAgent = dissents.some(d => d.dissenter_id === msg.agent_id);

      events.push({
        timestamp: offset + 100, // slight offset after phase
        type: 'agent_response',
        agent: agentInfo?.name || msg.agent_id,
        agentRole: agentInfo?.role || '',
        phase: msg.phase,
        content: msg.content,
        confidence: msg.confidence != null ? Math.round(msg.confidence * 100) : undefined,
        dissented: dissentedAgent,
        sources: sources.map((s: any) => s.reference || s.title || String(s)).slice(0, 3),
      });
    }

    // Add dissent events
    for (const d of dissents) {
      events.push({
        timestamp: d.created_at ? d.created_at.getTime() - startTime : events.length * 1000,
        type: 'dissent',
        agent: d.dissenter_name,
        content: d.statement,
        confidence: 0,
        dissented: true,
      });
    }

    // Final decision event
    const decisionData = deliberation.decision as Record<string, unknown> | null;
    const dissentingCodes = Array.isArray(decisionData?.dissenting) ? decisionData.dissenting as string[] : [];

    events.push({
      timestamp: deliberation.completed_at
        ? deliberation.completed_at.getTime() - startTime
        : (events[events.length - 1]?.timestamp || 0) + 2000,
      type: 'decision',
      content: typeof deliberation.decision === 'object'
        ? JSON.stringify(deliberation.decision)
        : (deliberation.decision as string) || 'Decision recorded',
      confidence: deliberation.confidence != null ? Math.round(deliberation.confidence * 100) : 0,
    });

    // Sort events by timestamp
    events.sort((a, b) => a.timestamp - b.timestamp);

    const replay: ReplayData = {
      replayId: `replay-${crypto.randomBytes(8).toString('hex')}`,
      deliberationId,
      question: deliberation.question,
      mode: deliberation.mode || 'standard',
      events,
      agents,
      outcome: {
        decision: typeof deliberation.decision === 'object'
          ? JSON.stringify(deliberation.decision)
          : (deliberation.decision as string) || '',
        consensusScore: deliberation.confidence != null ? Math.round(deliberation.confidence * 100) : 0,
        dissentCount: dissentingCodes.length,
        totalAgents: agents.length,
      },
      duration: events.length > 0 ? events[events.length - 1].timestamp : 0,
      generatedAt: new Date().toISOString(),
    };

    this.replayCache.set(deliberationId, replay);
    logger.info(`🎬 CendiaReplay: Generated replay ${replay.replayId} — ${events.length} events, ${agents.length} agents`);

    return replay;
  }

  // ---------------------------------------------------------------------------
  // STANDALONE HTML REPLAY PAGE
  // ---------------------------------------------------------------------------

  async generateReplayHTML(deliberationId: string): Promise<string> {
    const data = await this.generateReplayData(deliberationId);
    const eventsJson = JSON.stringify(data.events);
    const agentsJson = JSON.stringify(data.agents);

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Decision Replay — ${data.question.substring(0, 60)}</title>
<style>
  :root{--bg:#0a0e1a;--surface:#111827;--border:#1f2937;--text:#e5e7eb;--accent:#3b82f6;--green:#10b981;--red:#ef4444;--gold:#f59e0b}
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
  .theater{max-width:960px;margin:0 auto;padding:24px}
  header{text-align:center;padding:24px 0;border-bottom:1px solid var(--border);margin-bottom:24px}
  header h1{font-size:1.25rem;color:var(--accent)}
  .question{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:20px;font-style:italic;color:#d1d5db;line-height:1.6}
  .controls{display:flex;gap:12px;align-items:center;justify-content:center;margin-bottom:24px}
  .controls button{background:var(--accent);color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.875rem}
  .controls button:hover{opacity:0.85}
  .controls button.secondary{background:var(--surface);border:1px solid var(--border)}
  .progress{width:100%;height:4px;background:var(--surface);border-radius:2px;margin-bottom:24px;overflow:hidden}
  .progress-bar{height:100%;background:var(--accent);width:0%;transition:width 0.3s}
  .timeline{min-height:400px}
  .event{opacity:0;transform:translateY(12px);transition:all 0.4s ease;margin-bottom:12px}
  .event.visible{opacity:1;transform:translateY(0)}
  .phase-event{text-align:center;padding:16px;margin:20px 0}
  .phase-event .label{display:inline-block;background:rgba(59,130,246,0.15);color:var(--accent);padding:6px 16px;border-radius:9999px;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;border:1px solid rgba(59,130,246,0.3)}
  .agent-event{display:flex;gap:12px;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:12px}
  .agent-event .avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.875rem;color:#fff;flex-shrink:0}
  .agent-event .body{flex:1;min-width:0}
  .agent-event .name{font-weight:600;font-size:0.875rem;margin-bottom:2px}
  .agent-event .role{font-size:0.7rem;color:#6b7280}
  .agent-event .content{font-size:0.85rem;line-height:1.6;margin-top:8px;color:#d1d5db;max-height:120px;overflow:hidden}
  .agent-event .meta{display:flex;gap:12px;margin-top:8px;font-size:0.7rem;color:#6b7280}
  .agent-event .confidence{color:var(--green);font-weight:600}
  .agent-event.dissent{border-color:rgba(239,68,68,0.4);background:rgba(239,68,68,0.05)}
  .agent-event.dissent .confidence{color:var(--red)}
  .decision-event{text-align:center;padding:24px;margin:24px 0;background:rgba(16,185,129,0.08);border:2px solid var(--green);border-radius:12px}
  .decision-event h3{color:var(--green);font-size:1.1rem;margin-bottom:8px}
  .decision-event .score{font-size:2rem;font-weight:700;color:var(--green)}
  .agents-bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;padding:12px;background:var(--surface);border-radius:8px;border:1px solid var(--border)}
  .agent-chip{display:flex;align-items:center;gap:4px;padding:4px 10px;border-radius:9999px;font-size:0.7rem;font-weight:600;border:1px solid var(--border)}
  .agent-chip .dot{width:8px;height:8px;border-radius:50%}
  footer{text-align:center;color:#4b5563;font-size:0.7rem;margin-top:32px;padding-top:16px;border-top:1px solid var(--border)}
</style>
</head>
<body>
<div class="theater">
  <header>
    <h1>🎬 DECISION REPLAY</h1>
    <p style="color:#6b7280;font-size:0.8rem;margin-top:4px">AI Council Deliberation · ${data.mode.toUpperCase()} mode · ${data.agents.length} agents</p>
  </header>

  <div class="question">"${data.question}"</div>

  <div class="agents-bar" id="agentsBar"></div>

  <div class="controls">
    <button id="playBtn" onclick="play()">▶ Play Replay</button>
    <button class="secondary" onclick="skipToEnd()">⏭ Skip to End</button>
    <button class="secondary" onclick="reset()">↺ Reset</button>
    <span style="color:#6b7280;font-size:0.8rem" id="counter">0 / ${data.events.length} events</span>
  </div>

  <div class="progress"><div class="progress-bar" id="progressBar"></div></div>

  <div class="timeline" id="timeline"></div>

  <footer>
    <p>CendiaReplay™ · Datacendia Decision Governance Infrastructure</p>
    <p>Deliberation ${data.deliberationId} · Generated ${data.generatedAt}</p>
  </footer>
</div>

<script>
const EVENTS = ${eventsJson};
const AGENTS = ${agentsJson};
let currentIdx = 0;
let playing = false;
let timer = null;

// Render agent bar
const agentsBar = document.getElementById('agentsBar');
AGENTS.forEach(a => {
  const chip = document.createElement('div');
  chip.className = 'agent-chip';
  chip.innerHTML = '<div class="dot" style="background:'+a.color+'"></div>' + a.name;
  agentsBar.appendChild(chip);
});

function getAgentColor(name) {
  const a = AGENTS.find(x => x.name === name);
  return a ? a.color : '#6b7280';
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();
}

function renderEvent(evt) {
  const timeline = document.getElementById('timeline');
  const div = document.createElement('div');
  div.className = 'event';

  if (evt.type === 'phase_start') {
    div.className += ' phase-event';
    div.innerHTML = '<div class="label">📍 ' + (evt.phase || '').toUpperCase() + ' PHASE</div>';
  } else if (evt.type === 'agent_response') {
    const color = getAgentColor(evt.agent || '');
    const truncContent = (evt.content || '').substring(0, 300) + ((evt.content || '').length > 300 ? '...' : '');
    div.className += ' agent-event' + (evt.dissented ? ' dissent' : '');
    div.innerHTML =
      '<div class="avatar" style="background:'+color+'">'+getInitials(evt.agent||'')+'</div>' +
      '<div class="body">' +
        '<div class="name">'+evt.agent+(evt.dissented?' ⚠️ DISSENT':'')+' </div>' +
        '<div class="role">'+evt.agentRole+' · '+evt.phase+'</div>' +
        '<div class="content">'+truncContent+'</div>' +
        '<div class="meta">' +
          (evt.confidence != null ? '<span class="confidence">Confidence: '+evt.confidence+'%</span>' : '') +
          (evt.sources && evt.sources.length ? '<span>📎 '+evt.sources.length+' sources</span>' : '') +
        '</div>' +
      '</div>';
  } else if (evt.type === 'dissent') {
    div.className += ' agent-event dissent';
    div.innerHTML =
      '<div class="avatar" style="background:var(--red)">⚠️</div>' +
      '<div class="body">' +
        '<div class="name" style="color:var(--red)">FORMAL DISSENT — '+(evt.agent||'Unknown')+'</div>' +
        '<div class="content">'+(evt.content||'')+'</div>' +
      '</div>';
  } else if (evt.type === 'decision') {
    div.className += ' decision-event';
    div.innerHTML =
      '<h3>⚖️ FINAL DECISION</h3>' +
      '<div class="score">'+(evt.confidence||0)+'% consensus</div>' +
      '<p style="margin-top:8px;font-size:0.85rem;color:#d1d5db">'+(evt.content||'').substring(0,200)+'</p>';
  }

  timeline.appendChild(div);
  requestAnimationFrame(() => { div.classList.add('visible'); });
  div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateProgress() {
  const pct = EVENTS.length > 0 ? (currentIdx / EVENTS.length) * 100 : 0;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('counter').textContent = currentIdx + ' / ' + EVENTS.length + ' events';
}

function showNext() {
  if (currentIdx >= EVENTS.length) { stop(); return; }
  renderEvent(EVENTS[currentIdx]);
  currentIdx++;
  updateProgress();
}

function play() {
  if (playing) { stop(); return; }
  playing = true;
  document.getElementById('playBtn').textContent = '⏸ Pause';
  timer = setInterval(() => {
    if (currentIdx >= EVENTS.length) { stop(); return; }
    showNext();
  }, 800);
}

function stop() {
  playing = false;
  clearInterval(timer);
  document.getElementById('playBtn').textContent = '▶ Play';
}

function skipToEnd() {
  stop();
  while (currentIdx < EVENTS.length) showNext();
}

function reset() {
  stop();
  currentIdx = 0;
  document.getElementById('timeline').innerHTML = '';
  updateProgress();
}
</script>
</body>
</html>`;
  }

  // ---------------------------------------------------------------------------
  // ACCESS
  // ---------------------------------------------------------------------------

  getReplay(deliberationId: string): ReplayData | undefined {
    return this.replayCache.get(deliberationId);
  }

  async createReplaySession(_deliberationId: string, _opts?: any, _extra?: any): Promise<any> { return { sessionId: `session-${Date.now()}` }; }
  async startPlayback(_sessionId: string): Promise<any> { return { status: 'playing' }; }
  async pausePlayback(_sessionId: string): Promise<any> { return { status: 'paused' }; }
  async seekToFrame(_sessionId: string, _frame: number, _extra?: any): Promise<any> { return {}; }
  async seekToTime(_sessionId: string, _timeMs: number, _extra?: any): Promise<any> { return {}; }
  async setPlaybackSpeed(_sessionId: string, _speed: number): Promise<any> { return {}; }
  async getPlaybackState(_sessionId: string): Promise<any> { return { status: 'idle' }; }
  async exportSession(_sessionId: string, _format?: string): Promise<any> { return {}; }
  async endSession(_sessionId: string): Promise<any> { return {}; }
}

export const decisionReplayTheaterService = new DecisionReplayTheaterServiceImpl();
