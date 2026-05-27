import { useState, useEffect, useRef } from 'react';
import {
  discoveryRequests, DR,
  initialAgentActivities, liveAgentActivities, AgentActivity,
  auditEntries,
  commitmentsAtRisk, Commitment,
  initialChatMessages, ChatMessage,
} from './data';

// ─── Icons ────────────────────────────────────────────────────────────────────
function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H13L13 2z"/>
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/>
    </svg>
  );
}

// ─── Lattice Logo SVG ─────────────────────────────────────────────────────────
function LatticeLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="Echelix Lattice">
      <rect width="32" height="32" rx="6" fill="#0f2744"/>
      <g stroke="#38bdf8" strokeWidth="1.5" opacity="0.9">
        <line x1="8" y1="8" x2="24" y2="8"/>
        <line x1="8" y1="14" x2="24" y2="14"/>
        <line x1="8" y1="20" x2="24" y2="20"/>
        <line x1="8" y1="8" x2="8" y2="24"/>
        <line x1="16" y1="8" x2="16" y2="24"/>
        <line x1="24" y1="8" x2="24" y2="24"/>
      </g>
      <circle cx="8" cy="8" r="2" fill="#38bdf8"/>
      <circle cx="16" cy="8" r="2" fill="#38bdf8"/>
      <circle cx="24" cy="8" r="2" fill="#38bdf8"/>
      <circle cx="8" cy="14" r="2" fill="#38bdf8" opacity="0.6"/>
      <circle cx="16" cy="14" r="2" fill="#38bdf8" opacity="0.6"/>
      <circle cx="24" cy="14" r="2" fill="#38bdf8" opacity="0.6"/>
      <circle cx="8" cy="20" r="2" fill="#38bdf8" opacity="0.3"/>
      <circle cx="16" cy="20" r="2" fill="#38bdf8" opacity="0.3"/>
      <circle cx="24" cy="20" r="2" fill="#38bdf8" opacity="0.3"/>
    </svg>
  );
}

// ─── RateCase Logo ────────────────────────────────────────────────────────────
function RateCaseLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="RateCase Navigator">
      <rect width="24" height="24" rx="5" fill="#1e3a5f"/>
      <path d="M5 7h14M5 11h9M5 15h11" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="19" cy="17" r="3" fill="none" stroke="#38bdf8" strokeWidth="1.5"/>
      <path d="M21.5 19.5L23 21" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Confidence Bar Component ─────────────────────────────────────────────────
function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 85 ? '#4ade80' : value >= 65 ? '#facc15' : '#f87171';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 48, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 11, color, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{value}%</span>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: DR['status'] }) {
  const map: Record<DR['status'], string> = {
    'Drafting': 'badge-blue',
    'In Review': 'badge-amber',
    'Filed': 'badge-green',
    'Awaiting SME': 'badge-gray',
  };
  return (
    <span className={map[status]} style={{ display: 'inline-block', padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>
      {status}
    </span>
  );
}

// ─── Due Badge ────────────────────────────────────────────────────────────────
function DueBadge({ days }: { days: number | 'OVERDUE' }) {
  if (days === 'OVERDUE') {
    return <span className="badge-red" style={{ display: 'inline-block', padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>OVERDUE</span>;
  }
  const cls = days <= 2 ? 'badge-red' : days <= 5 ? 'badge-amber' : 'badge-green';
  return <span className={cls} style={{ display: 'inline-block', padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 600 }}>{days}d</span>;
}

// ─── Stack Modal ──────────────────────────────────────────────────────────────
function StackModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }} onClick={onClose}>
      <div style={{ background: '#0d1f38', border: '1px solid #1e3a5f', borderRadius: 12, padding: 32, maxWidth: 780, width: '100%', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 600, marginBottom: 6 }}>ECHELIX LATTICE · ARCHITECTURE</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>RateCase Navigator — Lattice Stack</h2>
          </div>
          <button onClick={onClose} style={{ color: '#64748b', padding: 4, borderRadius: 4 }}><XIcon /></button>
        </div>

        {/* Data Sources */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: 10, fontWeight: 600 }}>INPUT SOURCES</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Email (Outlook)', 'Microsoft Teams', 'SharePoint', 'Meeting Transcripts', 'PUC Docket Feed'].map(s => (
              <span key={s} style={{ padding: '5px 10px', background: '#132238', border: '1px solid #1e3a5f', borderRadius: 6, fontSize: 12, color: '#94a3b8' }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ textAlign: 'center', margin: '12px 0', color: '#38bdf8', fontSize: 20 }}>↓</div>

        {/* Lattice Layer */}
        <div style={{ background: '#0a1929', border: '1px solid #38bdf8', borderRadius: 8, padding: 20, marginBottom: 12 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#38bdf8', marginBottom: 12, fontWeight: 600 }}>ECHELIX LATTICE LAYER</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { name: 'M365 Graph', desc: 'Email, Teams, calendar ingest' },
              { name: 'Form Recognizer', desc: 'Document OCR & extraction' },
              { name: 'AI Search', desc: 'Vector search & RAG index' },
              { name: 'Azure OpenAI', desc: 'GPT-4 classification & drafting' },
              { name: 'Service Bus', desc: '9 agent messaging channels' },
              { name: 'Purview', desc: 'Auto-classification & governance' },
            ].map(c => (
              <div key={c.name} style={{ background: '#112036', border: '1px solid #1e3a5f', borderRadius: 6, padding: '10px 12px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#38bdf8', marginBottom: 3 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Agents */}
        <div style={{ textAlign: 'center', margin: '12px 0', color: '#38bdf8', fontSize: 20 }}>↓</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
          {['Discovery Triage Agent', 'Commitment Capture Agent', 'Pattern Detection Agent', 'Deadline Risk Agent'].map(a => (
            <div key={a} style={{ background: '#132238', border: '1px solid #38bdf8', borderRadius: 6, padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#38bdf8' }}>{a}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', margin: '12px 0', color: '#38bdf8', fontSize: 20 }}>↓</div>

        {/* Outputs */}
        <div style={{ marginTop: 4 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', marginBottom: 10, fontWeight: 600 }}>OUTPUT SYSTEMS</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['D365 Project Operations', 'SharePoint Knowledge Base', 'Power BI Filing Dashboard'].map(s => (
              <span key={s} style={{ padding: '5px 10px', background: '#132238', border: '1px solid #1e3a5f', borderRadius: 6, fontSize: 12, color: '#94a3b8' }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Purview note */}
        <div className="purview-badge" style={{ marginTop: 20 }}>
          <ShieldIcon />
          <span>All data flows governed by Lattice Purview · Confidential filings restricted to filing team · Privileged attorney-client communications excluded · Retention: 10 years per PUC requirements</span>
        </div>

        <div style={{ marginTop: 16, padding: '10px 14px', background: '#0f2744', borderRadius: 6, fontSize: 11, color: '#64748b', borderLeft: '3px solid #38bdf8' }}>
          Deployed on Lattice in 5 weeks · Zero new Azure provisioning required · Reuses M365 connectors and AI Search already in Lattice foundation · Same platform supports 4 other utility workloads
        </div>
      </div>
    </div>
  );
}

// ─── Executive Brief Modal ────────────────────────────────────────────────────
function ExecBriefModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const steps = [
    'Discovery Triage Agent querying open requests...',
    'Commitment Capture Agent compiling at-risk items...',
    'Pattern Detection Agent reviewing intervener activity...',
    'Deadline Risk Agent computing risk flags...',
    'Formatting executive brief...',
  ];
  useEffect(() => {
    const t = setInterval(() => {
      setStep(s => {
        if (s >= steps.length - 1) { clearInterval(t); setTimeout(() => setLoading(false), 400); return s; }
        return s + 1;
      });
    }, 380);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }} onClick={onClose}>
      <div style={{ background: '#0d1f38', border: '1px solid #1e3a5f', borderRadius: 12, padding: 32, maxWidth: 680, width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, gap: 16 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="live-dot" />
              <span style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600 }}>Generating Executive Brief</span>
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{steps[step]}</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
              {steps.map((_, i) => (
                <div key={i} style={{ width: 40, height: 3, borderRadius: 2, background: i <= step ? '#38bdf8' : '#1e3a5f', transition: 'background 0.3s' }} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #1e3a5f' }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 600, marginBottom: 4 }}>MOUNTAINSIDE POWER & LIGHT</div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: '0 0 4px' }}>Daily Executive Brief</h2>
                <div style={{ fontSize: 11, color: '#64748b' }}>Docket 26-0147-RC · Generated Wednesday, May 27, 2026 · 11:30 AM CDT</div>
              </div>
              <button onClick={onClose} style={{ color: '#64748b', padding: 4 }}><XIcon /></button>
            </div>

            {/* Filing Status */}
            <section style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: 10 }}>FILING STATUS AT A GLANCE</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {[
                  { label: 'Open DRs', value: '47', color: '#facc15' },
                  { label: 'Due This Week', value: '8', color: '#f87171' },
                  { label: 'Commitments', value: '182', color: '#38bdf8' },
                  { label: 'Days to Hearing', value: '147', color: '#4ade80' },
                ].map(k => (
                  <div key={k.label} style={{ background: '#112036', border: '1px solid #1e3a5f', borderRadius: 6, padding: '12px 14px' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: k.color, fontFamily: 'var(--font-mono)' }}>{k.value}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{k.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Today's activity */}
            <section style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: 10 }}>DISCOVERY — TODAY / THIS WEEK</div>
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>
                <div>• 2 new discovery requests received today (AG-DR-0089, ICC-DR-0048)</div>
                <div>• 8 responses due this week — AG-DR-0089 critical (2 days remaining, 78% complete)</div>
                <div>• SC-DR-0012 OVERDUE — extension request pending Dana Torres approval</div>
                <div>• 1 response filed this week: WALMART-DR-0007 (Demand Charges)</div>
              </div>
            </section>

            {/* Commitments at risk */}
            <section style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f87171', fontWeight: 600, marginBottom: 10 }}>COMMITMENTS AT RISK</div>
              {commitmentsAtRisk.slice(0, 3).map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #1e3a5f', fontSize: 12, color: '#94a3b8' }}>
                  <div>{c.description}</div>
                  <div style={{ textAlign: 'right', minWidth: 80, color: '#f87171' }}>{c.deadline}</div>
                </div>
              ))}
            </section>

            {/* Intervener activity */}
            <section style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: 10 }}>INTERVENER ACTIVITY SUMMARY</div>
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>
                <div>• <span style={{ color: '#38bdf8' }}>Sierra Club:</span> 7 of 12 DRs focused on wildfire cost recovery — disallowance strategy building</div>
                <div>• <span style={{ color: '#38bdf8' }}>Attorney General:</span> Renewed Cost of Capital pressure — near-identical to 2022 approach</div>
                <div>• <span style={{ color: '#38bdf8' }}>ICC:</span> Challenging O&M expense growth; demand charge increase under scrutiny</div>
                <div>• <span style={{ color: '#38bdf8' }}>PUC Staff:</span> 4 active DRs — rate base and depreciation focus</div>
              </div>
            </section>

            {/* Risk flags */}
            <section style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f87171', fontWeight: 600, marginBottom: 10 }}>RISK FLAGS</div>
              <div style={{ padding: '10px 12px', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 6, fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>
                <div>⚠ SC-DR-0012 overdue — PUC Rule 4.3 notice requirement triggered</div>
                <div>⚠ Sierra Club pattern indicates organized disallowance challenge on wildfire costs</div>
                <div>⚠ AG-DR-0094 confidence at 70% with 3-day deadline — escalation recommended</div>
              </div>
            </section>

            {/* Recommended actions */}
            <section>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: 10 }}>RECOMMENDED ACTIONS</div>
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>
                <div>1. Approve SC-DR-0012 extension request letter (Dana Torres, D365 RC-2841)</div>
                <div>2. Expedite wildfire prudency exhibit — preempt Sierra Club disallowance argument</div>
                <div>3. Confirm CEO briefing is scheduled before Wednesday board call (VP Regulatory)</div>
              </div>
            </section>

            <div style={{ marginTop: 20, fontSize: 11, color: '#475569', textAlign: 'center' }}>
              Auto-generated by RateCase Navigator · Updated 4× daily · Powered by Lattice agent consensus
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── ROI Modal ────────────────────────────────────────────────────────────────
function ROIModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }} onClick={onClose}>
      <div style={{ background: '#0d1f38', border: '1px solid #1e3a5f', borderRadius: 12, padding: 32, maxWidth: 660, width: '100%', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 600, marginBottom: 4 }}>ECHELIX LATTICE · WORKLOAD ROI</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>RateCase Navigator — Business Impact</h2>
          </div>
          <button onClick={onClose} style={{ color: '#64748b', padding: 4 }}><XIcon /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Discovery Response Time', value: '4.2 days avg', sub: 'vs. 9.8 days last rate case', color: '#4ade80', improvement: true },
            { label: 'Commitments Tracked', value: '182', sub: 'vs. 47 captured manually last case — 74% were lost', color: '#38bdf8', improvement: true },
            { label: 'Missed Deadlines', value: '0', sub: 'vs. 6 last filing — $2.4M in disallowed costs', color: '#4ade80', improvement: true },
            { label: 'Estimated Filing Cost Reduction', value: '$3.8M', sub: 'per rate case on Lattice', color: '#38bdf8', improvement: true },
          ].map(k => (
            <div key={k.label} style={{ background: '#112036', border: '1px solid #1e3a5f', borderRadius: 8, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>{k.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: k.color, fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#0a1929', border: '1px solid #38bdf8', borderRadius: 8, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 600, marginBottom: 10 }}>LATTICE PLATFORM EFFICIENCY</div>
          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.8 }}>
            <div>✓ Workload deployed on Lattice in <strong style={{ color: '#38bdf8' }}>5 weeks</strong></div>
            <div>✓ <strong style={{ color: '#38bdf8' }}>Zero</strong> new Azure provisioning required</div>
            <div>✓ Reuses M365 connectors and AI Search already in Lattice foundation</div>
            <div>✓ Same platform supports <strong style={{ color: '#38bdf8' }}>4 other utility workloads</strong> (StormCommand, GridGate, EmberShield + RateCase Navigator)</div>
          </div>
        </div>

        <div style={{ padding: '12px 14px', background: '#112036', borderRadius: 6, fontSize: 11, color: '#64748b' }}>
          Figures based on Mountainside Power & Light rate case benchmarks vs. industry average. Cost avoidance calculated at $400K per disallowed cost instance.
        </div>
      </div>
    </div>
  );
}

// ─── DR Detail Drawer ─────────────────────────────────────────────────────────
function DRDrawer({ dr, onClose }: { dr: DR; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 900, display: 'flex', justifyContent: 'flex-end' }} onClick={onClose}>
      <div style={{ width: 520, background: '#0d1f38', borderLeft: '1px solid #1e3a5f', height: '100%', overflowY: 'auto', padding: 0 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e3a5f', background: '#0a1929', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>{dr.id}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{dr.intervener} · {dr.topic}</div>
            </div>
            <button onClick={onClose} style={{ color: '#64748b' }}><XIcon /></button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <StatusBadge status={dr.status} />
            <DueBadge days={dr.daysUntilDue} />
            <ConfidenceBar value={dr.confidence} />
            <span style={{ fontSize: 11, color: '#64748b' }}>Assigned: <span style={{ color: '#94a3b8' }}>{dr.assignedTo}</span></span>
          </div>
        </div>

        <div style={{ padding: '16px 20px' }}>
          {/* Request text */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: 8 }}>DISCOVERY REQUEST</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7, padding: '12px 14px', background: '#112036', borderRadius: 6, borderLeft: '3px solid #1e3a5f' }}>
              {dr.drText}
            </div>
          </div>

          {/* Draft response */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>DRAFT RESPONSE</div>
              <span style={{ fontSize: 10, color: '#38bdf8', padding: '2px 6px', background: 'rgba(56,189,248,0.1)', borderRadius: 4 }}>AI-assisted draft</span>
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7, padding: '12px 14px', background: '#0a1929', borderRadius: 6, border: '1px solid #1e3a5f' }}>
              {dr.draftResponse}
            </div>
          </div>

          {/* Related docs */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: 8 }}>RELATED DOCUMENTS — AUTO-PULLED FROM AI SEARCH</div>
            {dr.relatedDocs.map((doc, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: '#112036', borderRadius: 5, marginBottom: 5, fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}>
                <span style={{ color: '#38bdf8', fontSize: 14 }}>📄</span>
                <span>{doc}</span>
              </div>
            ))}
          </div>

          {/* Commitments */}
          {dr.commitments.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: 8 }}>COMMITMENTS FROM THIS DR</div>
              {dr.commitments.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 10px', background: '#112036', borderRadius: 5, marginBottom: 5, fontSize: 12, color: '#94a3b8' }}>
                  <span style={{ color: '#facc15', flexShrink: 0, marginTop: 1 }}>⚑</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          )}

          {/* Purview badge */}
          <div className="purview-badge">
            <ShieldIcon />
            <span>Auto-classified by Purview · Confidential · Retention: 10 years</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Commitment Source Modal ──────────────────────────────────────────────────
function CommitmentModal({ commitment, onClose }: { commitment: Commitment; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }} onClick={onClose}>
      <div style={{ background: '#0d1f38', border: '1px solid #1e3a5f', borderRadius: 12, padding: 28, maxWidth: 520, width: '100%' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 600, marginBottom: 4 }}>COMMITMENT TRAIL · {commitment.taskId}</div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>{commitment.description}</h3>
          </div>
          <button onClick={onClose} style={{ color: '#64748b' }}><XIcon /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          <div style={{ padding: '10px 12px', background: '#112036', borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>OWNER</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>{commitment.owner}</div>
          </div>
          <div style={{ padding: '10px 12px', background: '#112036', borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>DEADLINE</div>
            <div style={{ fontSize: 13, color: '#f87171', fontWeight: 600 }}>{commitment.deadline}</div>
          </div>
          <div style={{ padding: '10px 12px', background: '#112036', borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>SOURCE</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>{commitment.source}</div>
          </div>
          <div style={{ padding: '10px 12px', background: '#112036', borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }}>LAST ACTIVITY</div>
            <div style={{ fontSize: 13, color: '#94a3b8' }}>{commitment.lastActivity}</div>
          </div>
        </div>

        {/* Source excerpt */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748b', fontWeight: 600, marginBottom: 8 }}>SOURCE EXCERPT — {commitment.source.toUpperCase()}</div>
          <div style={{ padding: '12px 14px', background: '#0a1929', border: '1px solid #1e3a5f', borderRadius: 6, fontSize: 12, color: '#94a3b8', lineHeight: 1.7 }}>
            <span style={{ background: 'rgba(250,204,21,0.15)', color: '#fde68a', padding: '1px 4px', borderRadius: 3 }}>
              &ldquo;...{commitment.owner} will ensure {commitment.description.toLowerCase()} is complete before the response deadline...&rdquo;
            </span>
            <div style={{ marginTop: 8, fontSize: 10, color: '#475569' }}>Captured by Commitment Capture Agent at {commitment.lastActivity} · D365 task {commitment.taskId} created</div>
          </div>
        </div>

        <div className="purview-badge">
          <ShieldIcon />
          <span>Immutable audit record · Purview verified · {commitment.taskId}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeWorkload] = useState('RateCase Navigator');
  const [activeLeftTab, setActiveLeftTab] = useState<'tracker' | 'audit'>('tracker');
  const [selectedDR, setSelectedDR] = useState<DR | null>(null);
  const [showStack, setShowStack] = useState(false);
  const [showExecBrief, setShowExecBrief] = useState(false);
  const [showROI, setShowROI] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [chatInput, setChatInput] = useState('');
  const [agentActivities, setAgentActivities] = useState<AgentActivity[]>(initialAgentActivities);
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null);
  const activityEndRef = useRef<HTMLDivElement>(null);
  const auditEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const workloads = [
    { name: 'RateCase Navigator', active: true },
    { name: 'StormCommand', active: false },
    { name: 'GridGate', active: false },
    { name: 'EmberShield', active: false },
  ];

  // Live agent feed
  useEffect(() => {
    let idx = 0;
    const t = setInterval(() => {
      if (idx < liveAgentActivities.length) {
        setAgentActivities(prev => [liveAgentActivities[idx], ...prev]);
        idx++;
      }
    }, 9000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    activityEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentActivities]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    const q = chatInput.toLowerCase();
    setChatInput('');
    setTimeout(() => {
      let response = 'I\'m analyzing the rate case docket. Based on current filing status, I recommend reviewing the open discovery requests and checking the commitment dashboard for at-risk items.';
      if (q.includes('deadline') || q.includes('today')) {
        response = '8 responses are due this week. Most urgent: AG-DR-0089 (2 days, 78% complete — Sarah Chen), AG-DR-0094 (3 days, 70% complete — Dana Torres), WALMART-DR-0011 (4 days, 83% — James Park). SC-DR-0012 is already overdue.';
      } else if (q.includes('sierra') || q.includes('wildfire')) {
        response = 'Sierra Club has filed 7 of 12 discovery requests on wildfire mitigation cost recovery. Pattern indicates they\'re building a disallowance argument. SC-DR-0012 is overdue. I\'ve drafted a wildfire prudency exhibit based on the 2024 SCE precedent — available for Dana Torres review.';
      } else if (q.includes('commit')) {
        response = '182 total commitments tracked across the filing team. 5 are at risk. Top priority: SC-DR-0012 extension approval (Dana Torres, TODAY), followed by wildfire cost breakdown from Engineering (tomorrow). All captured from email, Teams, and meeting transcripts.';
      } else if (q.includes('exec') || q.includes('brief')) {
        response = 'Generating executive brief... The daily brief covers filing status, discovery activity, at-risk commitments, intervener activity summary, and recommended actions. Click "Executive Brief" in the top nav for the full formatted brief.';
      }
      setChatMessages(prev => [...prev, { role: 'agent', content: response }]);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#071526', overflow: 'hidden', fontFamily: 'var(--font-body)' }}>

      {/* ── TOP BAR ──────────────────────────────────────────────────────── */}
      <header style={{ background: '#0a1929', borderBottom: '1px solid #1e3a5f', flexShrink: 0 }}>
        {/* Lattice platform header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 16px', borderBottom: '1px solid #0d2540' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LatticeLogo size={26} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#38bdf8' }}>ECHELIX LATTICE</span>
            <span style={{ color: '#1e3a5f', fontSize: 14 }}>|</span>
            <span style={{ fontSize: 11, color: '#64748b' }}>Mountainside Power & Light</span>
          </div>
          {/* Workload switcher */}
          <div style={{ display: 'flex', gap: 4 }}>
            {workloads.map(w => (
              <button key={w.name} data-testid={`workload-${w.name.replace(/\s+/g, '-').toLowerCase()}`} style={{
                padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: w.active ? 600 : 400,
                background: w.active ? 'rgba(56,189,248,0.12)' : 'transparent',
                color: w.active ? '#38bdf8' : '#475569',
                border: w.active ? '1px solid rgba(56,189,248,0.3)' : '1px solid transparent',
                cursor: w.active ? 'default' : 'pointer',
              }}>
                {w.name}
                {!w.active && <span style={{ marginLeft: 4, color: '#334155', fontSize: 9 }}>↗</span>}
              </button>
            ))}
          </div>
          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button data-testid="btn-exec-brief" onClick={() => setShowExecBrief(true)} style={{ padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: 'transparent', color: '#94a3b8', border: '1px solid #1e3a5f', cursor: 'pointer' }}>Executive Brief</button>
            <button data-testid="btn-roi" onClick={() => setShowROI(true)} style={{ padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: 'transparent', color: '#94a3b8', border: '1px solid #1e3a5f', cursor: 'pointer' }}>ROI</button>
            <button data-testid="btn-stack" onClick={() => setShowStack(true)} style={{ padding: '4px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)', cursor: 'pointer' }}>Stack ↗</button>
          </div>
        </div>

        {/* Workload header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderBottom: '1px solid #0d2540' }}>
          <RateCaseLogo />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0', lineHeight: 1 }}>RateCase Navigator</div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Agentic rate case and regulatory filing coordination</div>
          </div>
          <div style={{ flex: 1 }} />
          {/* Docket banner */}
          <div style={{ padding: '5px 12px', background: '#0f2744', border: '1px solid #1e3a5f', borderRadius: 6, fontSize: 11 }}>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>Docket 26-0147-RC</span>
            <span style={{ color: '#475569', margin: '0 6px' }}>·</span>
            <span style={{ color: '#94a3b8' }}>General Rate Case</span>
            <span style={{ color: '#475569', margin: '0 6px' }}>·</span>
            <span style={{ color: '#64748b' }}>Filed: Jan 12, 2026</span>
            <span style={{ color: '#475569', margin: '0 6px' }}>·</span>
            <span style={{ color: '#64748b' }}>Hearing: Sep 8, 2026</span>
            <span style={{ color: '#475569', margin: '0 6px' }}>·</span>
            <span style={{ color: '#facc15', fontWeight: 600 }}>Discovery Phase</span>
          </div>
          {/* Countdown */}
          <div style={{ padding: '5px 12px', background: '#0f2744', border: '1px solid #f87171', borderRadius: 6, fontSize: 11, textAlign: 'center' }}>
            <span style={{ color: '#f87171', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 14 }}>147</span>
            <span style={{ color: '#64748b', marginLeft: 5 }}>days to evidentiary hearing</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'flex', gap: 0, borderTop: '0' }}>
          {[
            { label: 'Open Discovery Requests', value: '47', color: '#facc15', icon: '📋' },
            { label: 'Response Deadlines This Week', value: '8', color: '#f87171', icon: '⏰' },
            { label: 'Commitments Tracked', value: '212', color: '#38bdf8', icon: '📌' },
            { label: 'Filing Documents Indexed', value: '3,847', color: '#4ade80', icon: '📁' },
          ].map((k, i) => (
            <div key={k.label} data-testid={`kpi-${i}`} style={{
              flex: 1, padding: '10px 16px', borderRight: i < 3 ? '1px solid #0d2540' : 'none',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 16 }}>{k.icon}</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: k.color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{k.label}</div>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <main style={{ display: 'flex', flex: 1, overflow: 'hidden', gap: 0 }}>

        {/* ── LEFT PANEL: Discovery Tracker (40%) ──────────────────────── */}
        <aside style={{ width: '40%', borderRight: '1px solid #1e3a5f', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #1e3a5f', flexShrink: 0 }}>
            {(['tracker', 'audit'] as const).map(tab => (
              <button key={tab} data-testid={`tab-${tab}`} onClick={() => setActiveLeftTab(tab)} style={{
                flex: 1, padding: '9px', fontSize: 11, fontWeight: 600,
                color: activeLeftTab === tab ? '#38bdf8' : '#475569',
                background: activeLeftTab === tab ? '#0a1929' : 'transparent',
                borderBottom: activeLeftTab === tab ? '2px solid #38bdf8' : '2px solid transparent',
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>
                {tab === 'tracker' ? '📋 Discovery Tracker' : '🔒 Audit Trail'}
              </button>
            ))}
          </div>

          {activeLeftTab === 'tracker' ? (
            <>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 80px 60px 72px 70px', gap: 0, padding: '5px 10px', borderBottom: '1px solid #1e3a5f', flexShrink: 0 }}>
                {['DR No.', 'Intervener / Topic', 'Assigned', 'Due', 'Status', 'Lattice AI'].map(h => (
                  <div key={h} style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#475569', padding: '0 4px' }}>{h}</div>
                ))}
              </div>
              {/* Scrollable rows */}
              <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
                {discoveryRequests.map(dr => (
                  <div
                    key={dr.id}
                    data-testid={`dr-row-${dr.id}`}
                    className={`dr-row${dr.daysUntilDue === 'OVERDUE' ? ' overdue' : ''}${selectedDR?.id === dr.id ? ' selected' : ''}`}
                    onClick={() => setSelectedDR(selectedDR?.id === dr.id ? null : dr)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '90px 1fr 80px 60px 72px 70px',
                      padding: '8px 10px',
                      borderBottom: '1px solid #0d2540',
                      alignItems: 'center',
                      gap: 0,
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#38bdf8', fontFamily: 'var(--font-mono)', padding: '0 4px' }}>{dr.id}</div>
                    <div style={{ padding: '0 4px', minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dr.intervener}</div>
                      <div style={{ fontSize: 10, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dr.topic}</div>
                    </div>
                    <div style={{ fontSize: 10, color: '#64748b', padding: '0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dr.assignedTo.split(' ')[0]} {dr.assignedTo.split(' ')[1]?.[0]}.</div>
                    <div style={{ padding: '0 4px' }}><DueBadge days={dr.daysUntilDue} /></div>
                    <div style={{ padding: '0 4px' }}><StatusBadge status={dr.status} /></div>
                    <div style={{ padding: '0 4px' }}><ConfidenceBar value={dr.confidence} /></div>
                  </div>
                ))}
              </div>
              {/* Purview banner */}
              <div className="purview-badge" style={{ margin: 8, borderRadius: 4, flexShrink: 0, fontSize: 10 }}>
                <ShieldIcon />
                <span>Auto-classified · Confidential filings restricted · Privileged comms excluded · 10-yr retention</span>
              </div>
            </>
          ) : (
            /* Audit Trail */
            <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
              <div style={{ padding: '8px 12px', background: '#0a1929', borderBottom: '1px solid #1e3a5f', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#38bdf8', flexShrink: 0 }}>
                <div className="live-dot" />
                <span style={{ fontWeight: 600 }}>Immutable audit log — Purview verified</span>
              </div>
              {auditEntries.map((entry, i) => (
                <div key={i} style={{ padding: '7px 12px', borderBottom: '1px solid #0d2540', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 10, color: '#38bdf8', fontFamily: 'var(--font-mono)', flexShrink: 0, marginTop: 1 }}>{entry.timestamp}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5 }}>{entry.message}</div>
                    {entry.hash && (
                      <div className="audit-hash" style={{ marginTop: 2 }}>
                        <span style={{ color: '#334155' }}>hash: </span>
                        {entry.hash}
                        <span style={{ marginLeft: 6, color: '#4ade80', fontSize: 9 }}>✓ verified</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={auditEndRef} />
            </div>
          )}
        </aside>

        {/* ── CENTER PANEL: Agent Workbench (35%) ──────────────────────── */}
        <section style={{ width: '35%', borderRight: '1px solid #1e3a5f', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #1e3a5f', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="live-dot" />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#38bdf8' }}>AGENT WORKBENCH</span>
            <span style={{ fontSize: 10, color: '#475569', marginLeft: 4 }}>4 agents active · Docket 26-0147-RC</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: '0' }}>
            {agentActivities.map((activity) => (
              <div key={activity.id} className="agent-entry" style={{
                padding: '12px 14px',
                borderBottom: '1px solid #0d2540',
                background: activity.alertLevel === 'risk' ? 'rgba(248,113,113,0.04)' : activity.alertLevel === 'warning' ? 'rgba(250,204,21,0.03)' : 'transparent',
              }}>
                {/* Agent header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 13 }}>{activity.agentIcon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#e2e8f0' }}>{activity.agentName}</span>
                  <span style={{ fontSize: 10, color: '#475569', fontFamily: 'var(--font-mono)' }}>{activity.timestamp}</span>
                  {activity.alertLevel === 'risk' && (
                    <span style={{ padding: '1px 5px', background: 'rgba(248,113,113,0.15)', color: '#f87171', borderRadius: 3, fontSize: 9, fontWeight: 700 }}>RISK</span>
                  )}
                  {activity.alertLevel === 'warning' && (
                    <span style={{ padding: '1px 5px', background: 'rgba(250,204,21,0.15)', color: '#facc15', borderRadius: 3, fontSize: 9, fontWeight: 700 }}>ALERT</span>
                  )}
                </div>
                {/* Tags */}
                <div style={{ display: 'flex', gap: 5, marginBottom: 8, flexWrap: 'wrap' }}>
                  {activity.tags.map(t => (
                    <span key={t} className="agent-tag"><BoltIcon />{t}</span>
                  ))}
                </div>
                {/* Message */}
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                  {activity.message}
                </div>
              </div>
            ))}
            <div ref={activityEndRef} />
          </div>
        </section>

        {/* ── RIGHT PANEL: Insight Feed (25%) ──────────────────────────── */}
        <aside style={{ width: '25%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>

            {/* Commitments Dashboard */}
            <div>
              <div className="section-header">COMMITMENTS DASHBOARD</div>
              <div style={{ padding: '10px 12px', borderBottom: '1px solid #1e3a5f' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                  {[
                    { label: 'From Email', count: 47 },
                    { label: 'From Teams', count: 89 },
                    { label: 'From Meetings', count: 34 },
                    { label: 'From SharePoint', count: 12 },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '8px 10px', background: '#112036', borderRadius: 5 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{s.count}</div>
                      <div style={{ fontSize: 10, color: '#475569', marginTop: 1 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #1e3a5f' }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>Total active commitments</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>182</span>
                </div>
              </div>

              {/* At-risk commitments */}
              <div className="section-header" style={{ color: '#f87171' }}>COMMITMENTS AT RISK</div>
              {commitmentsAtRisk.map(c => (
                <div key={c.id} className="risk-row" data-testid={`commitment-risk-${c.id}`} onClick={() => setSelectedCommitment(c)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4, flex: 1 }}>{c.description}</div>
                    <span style={{ fontSize: 10, color: '#f87171', fontWeight: 700, flexShrink: 0 }}>{c.deadline}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: '#475569' }}>{c.owner}</span>
                    <span style={{ color: '#1e3a5f' }}>·</span>
                    <span style={{ fontSize: 10, color: '#334155' }}>Last: {c.lastActivity}</span>
                    <span style={{ fontSize: 10, color: '#38bdf8', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>{c.taskId}</span>
                    <ChevronRightIcon />
                  </div>
                </div>
              ))}
            </div>

            {/* Regulatory Intelligence */}
            <div>
              <div className="section-header" style={{ marginTop: 4 }}>REGULATORY INTELLIGENCE</div>
              <div style={{ padding: '10px 12px', borderBottom: '1px solid #1e3a5f', fontSize: 11, color: '#64748b', marginBottom: 2 }}>
                Lattice semantic-search monitoring · Mountainside-related filings this week
              </div>
              {[
                { title: 'Neighboring utility filed wildfire recovery position', relevance: 'Related to SC-DR-0012', color: '#f87171', tag: 'HIGH RELEVANCE' },
                { title: 'PUC Staff issued ALJ ruling on cost-of-capital benchmarking — Docket 25-0892-RC', relevance: 'Relevant precedent for AG-DR-0089', color: '#38bdf8', tag: 'PRECEDENT' },
                { title: 'Industrial Customers Coalition filed similar challenge in neighboring state', relevance: 'Opposition strategy preview available', color: '#facc15', tag: 'INTELLIGENCE' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '10px 12px', borderBottom: '1px solid #0d2540', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                    <span style={{ padding: '1px 5px', background: `${item.color}22`, color: item.color, borderRadius: 3, fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{item.tag}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 10, color: '#475569' }}>{item.relevance}</div>
                </div>
              ))}
            </div>

            {/* AI Insight */}
            <div>
              <div className="section-header" style={{ marginTop: 4, color: '#38bdf8' }}>AI INSIGHT</div>
              <div style={{ margin: '8px 12px 12px', padding: '12px', background: '#0a1929', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.05em', marginBottom: 8 }}>RateCase Navigator AI Insight</div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.7 }}>
                  Sierra Club has filed <strong style={{ color: '#f87171' }}>7 of their 12 discovery requests</strong> this cycle focused on wildfire mitigation cost recovery. Pattern indicates they're building a disallowance argument.
                  <br /><br />
                  Recommend proactive exhibit on wildfire prudency review (precedent: 2024 SCE rate case ruling) — <span style={{ color: '#38bdf8', cursor: 'pointer' }}>drafted and available for Dana Torres review.</span>
                </div>
                <div style={{ marginTop: 10, fontSize: 10, color: '#334155' }}>Powered by Lattice consensus-voting agent · 4 agents in agreement</div>
              </div>
            </div>

          </div>
        </aside>
      </main>

      {/* ── CHAT PANEL ───────────────────────────────────────────────────── */}
      {/* Chat toggle button */}
      {!showChat && (
        <button data-testid="btn-chat-open" onClick={() => setShowChat(true)} style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 800,
          padding: '10px 16px', borderRadius: 24, fontSize: 12, fontWeight: 600,
          background: '#38bdf8', color: '#071526', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 16px rgba(56,189,248,0.3)',
        }}>
          💬 Ask RateCase Navigator
        </button>
      )}

      {showChat && (
        <div style={{
          position: 'fixed', bottom: 16, right: 16, zIndex: 800,
          width: 380, background: '#0d1f38', border: '1px solid #1e3a5f', borderRadius: 12,
          display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          maxHeight: '55vh',
        }}>
          {/* Chat header */}
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div className="live-dot" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>Ask RateCase Navigator</span>
            </div>
            <button onClick={() => setShowChat(false)} style={{ color: '#64748b' }}><XIcon /></button>
          </div>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div className={msg.role === 'user' ? 'chat-user' : 'chat-agent'} style={{ maxWidth: '85%', padding: '8px 11px', fontSize: 11, color: '#94a3b8', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          {/* Quick reply chips */}
          <div style={{ padding: '6px 10px', borderTop: '1px solid #0d2540', display: 'flex', gap: 5, flexWrap: 'wrap', flexShrink: 0 }}>
            {["Today's deadlines", 'Intervener activity', 'Executive brief', 'At-risk commitments'].map(chip => (
              <button key={chip} data-testid={`chat-chip-${chip.replace(/\s+/g, '-').toLowerCase()}`} onClick={() => { setChatInput(chip); }} style={{
                padding: '3px 8px', borderRadius: 12, fontSize: 10, background: '#112036',
                color: '#64748b', border: '1px solid #1e3a5f', cursor: 'pointer',
              }}>{chip}</button>
            ))}
          </div>
          {/* Input */}
          <div style={{ padding: '8px 10px', borderTop: '1px solid #1e3a5f', display: 'flex', gap: 6, flexShrink: 0 }}>
            <input
              data-testid="chat-input"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleChatSend()}
              placeholder="Ask about deadlines, commitments, interveners..."
              style={{
                flex: 1, padding: '7px 10px', background: '#112036', border: '1px solid #1e3a5f',
                borderRadius: 6, fontSize: 11, color: '#94a3b8', outline: 'none',
                fontFamily: 'var(--font-body)',
              }}
            />
            <button data-testid="chat-send" onClick={handleChatSend} style={{
              padding: '7px 10px', background: '#38bdf8', color: '#071526',
              borderRadius: 6, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}><SendIcon /></button>
          </div>
        </div>
      )}

      {/* ── MODALS ───────────────────────────────────────────────────────── */}
      {selectedDR && <DRDrawer dr={selectedDR} onClose={() => setSelectedDR(null)} />}
      {showStack && <StackModal onClose={() => setShowStack(false)} />}
      {showExecBrief && <ExecBriefModal onClose={() => setShowExecBrief(false)} />}
      {showROI && <ROIModal onClose={() => setShowROI(false)} />}
      {selectedCommitment && <CommitmentModal commitment={selectedCommitment} onClose={() => setSelectedCommitment(null)} />}
    </div>
  );
}
