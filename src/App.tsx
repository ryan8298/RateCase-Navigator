import { useState, useEffect, useRef, useCallback } from 'react'
import {
  DR, DRStatus, AgentCard, AuditEntry, Commitment,
  initialDRs, initialAgents, liveAgentFeed, auditLog, initialCommitments,
  TEAM_MEMBERS,
} from './data'

// ─── tiny helpers ────────────────────────────────────────────────────────────
const statusOrder: DRStatus[] = ['Intake', 'Classifying', 'Drafting', 'In Review', 'Filed']

function next(s: DRStatus): DRStatus | null {
  const i = statusOrder.indexOf(s)
  return i < statusOrder.length - 1 ? statusOrder[i + 1] : null
}

function confColor(v: number) {
  return v >= 85 ? 'var(--green)' : v >= 65 ? 'var(--amber)' : 'var(--red)'
}

function dueBadge(d: number | 'OVERDUE') {
  if (d === 'OVERDUE') return <span className="badge badge-red">OVERDUE</span>
  if (d <= 2) return <span className="badge badge-red">{d}d</span>
  if (d <= 5) return <span className="badge badge-amber">{d}d</span>
  return <span className="badge badge-green">{d}d</span>
}

function statusBadge(s: DRStatus) {
  const map: Record<DRStatus, string> = {
    'Intake': 'badge-purple',
    'Classifying': 'badge-blue',
    'Drafting': 'badge-blue',
    'In Review': 'badge-amber',
    'Filed': 'badge-green',
  }
  return <span className={`badge ${map[s]}`}>{s}</span>
}

function fileIcon(type: string) {
  const icons: Record<string, string> = { pdf: '📄', xlsx: '📊', doc: '📝', default: '📎' }
  return icons[type] || icons.default
}

// ─── Toast ───────────────────────────────────────────────────────────────────
interface Toast { id: number; msg: string; type: 'success' | 'info' | 'warn' }
function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' ? '✓' : t.type === 'warn' ? '⚠' : 'ℹ'} {t.msg}
        </div>
      ))}
    </div>
  )
}

// ─── Lattice / RateCase logos ─────────────────────────────────────────────────
function LatticeLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-label="Echelix Lattice">
      <rect width="32" height="32" rx="6" fill="#0f2744"/>
      <g stroke="#38bdf8" strokeWidth="1.4">
        <line x1="8" y1="8" x2="24" y2="8"/><line x1="8" y1="14" x2="24" y2="14"/>
        <line x1="8" y1="20" x2="24" y2="20"/>
        <line x1="8" y1="8" x2="8" y2="24"/><line x1="16" y1="8" x2="16" y2="24"/>
        <line x1="24" y1="8" x2="24" y2="24"/>
      </g>
      {[8,16,24].map(x => [8,14,20].map(y => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#38bdf8" opacity={y===8?1:y===14?.6:.3}/>
      )))}
    </svg>
  )
}

function RCLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="6" fill="#1e3a57"/>
      <path d="M7 8h14M7 13h9M7 18h11" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="21" cy="19" r="3.5" fill="none" stroke="#38bdf8" strokeWidth="1.8"/>
      <path d="M23.5 21.5L25 23" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

// ─── Close button ─────────────────────────────────────────────────────────────
function CloseBtn({ onClick }: { onClick: () => void }) {
  return <button className="close-btn" onClick={onClick} aria-label="Close">✕</button>
}

// ─── ConfBar ──────────────────────────────────────────────────────────────────
function ConfBar({ v }: { v: number }) {
  const c = confColor(v)
  return (
    <div className="conf-bar">
      <div className="conf-track">
        <div className="conf-fill" style={{ width: `${v}%`, background: c }}/>
      </div>
      <span className="conf-pct" style={{ color: c }}>{v}%</span>
    </div>
  )
}

// ─── DR Detail Drawer ─────────────────────────────────────────────────────────
function DRDrawer({
  dr, drs, onClose, onUpdate, onAdvance, toast
}: {
  dr: DR
  drs: DR[]
  onClose: () => void
  onUpdate: (id: string, patch: Partial<DR>) => void
  onAdvance: (id: string) => void
  toast: (msg: string, type?: Toast['type']) => void
}) {
  const [editingDraft, setEditingDraft] = useState(false)
  const [draft, setDraft] = useState(dr.draftResponse)
  const [notes, setNotes] = useState(dr.notes)
  const [editingNotes, setEditingNotes] = useState(false)
  const nextStatus = next(dr.status)

  // keep draft in sync if dr changes
  useEffect(() => { setDraft(dr.draftResponse); setNotes(dr.notes) }, [dr.id])

  function saveDraft() {
    onUpdate(dr.id, { draftResponse: draft })
    setEditingDraft(false)
    toast('Draft response saved', 'success')
  }

  function saveNotes() {
    onUpdate(dr.id, { notes })
    setEditingNotes(false)
    toast('Notes saved', 'success')
  }

  function handleAdvance() {
    onAdvance(dr.id)
    toast(`${dr.id} advanced to ${nextStatus}`, 'success')
  }

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, color: 'var(--blue)' }}>{dr.id}</span>
                {statusBadge(dr.status)}
                {dueBadge(dr.daysUntilDue)}
                <span className={`badge badge-${dr.priority === 'High' ? 'red' : dr.priority === 'Medium' ? 'amber' : 'gray'}`}>
                  {dr.priority} Priority
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, marginTop: 5 }}>{dr.intervener}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Topic: {dr.topic}</div>
            </div>
            <CloseBtn onClick={onClose} />
          </div>
          {/* Assign + Confidence row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Assigned:</span>
              <select
                className="select-native"
                value={dr.assignedTo}
                onChange={e => { onUpdate(dr.id, { assignedTo: e.target.value }); toast(`Reassigned to ${e.target.value}`, 'info') }}
              >
                {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Confidence:</span>
              <ConfBar v={dr.confidence} />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* Workflow progress */}
          <div className="drawer-section" style={{ background: 'var(--navy-900)' }}>
            <div className="drawer-section-label">WORKFLOW STAGE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {statusOrder.map((s, i) => {
                const current = statusOrder.indexOf(dr.status)
                const done = i < current
                const active = i === current
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < statusOrder.length - 1 ? 1 : 'none' }}>
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '2px 8px',
                    }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700, marginBottom: 4,
                        background: done ? 'var(--green)' : active ? 'var(--blue)' : 'var(--navy-600)',
                        color: done || active ? 'var(--navy-900)' : 'var(--text-muted)',
                        border: `1.5px solid ${done ? 'var(--green)' : active ? 'var(--blue)' : 'var(--navy-500)'}`,
                      }}>
                        {done ? '✓' : i + 1}
                      </div>
                      <div style={{ fontSize: 9, fontWeight: 600, color: done ? 'var(--green)' : active ? 'var(--blue)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>{s}</div>
                    </div>
                    {i < statusOrder.length - 1 && (
                      <div style={{ flex: 1, height: 1, background: done ? 'var(--green)' : 'var(--border)', marginBottom: 20, minWidth: 12 }}/>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Discovery request text */}
          <div className="drawer-section">
            <div className="drawer-section-label">DISCOVERY REQUEST</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, background: 'var(--navy-700)', padding: '10px 12px', borderRadius: 5, borderLeft: '3px solid var(--border)' }}>
              {dr.drText}
            </div>
          </div>

          {/* Draft response */}
          <div className="drawer-section">
            <div className="label-row">
              <div className="drawer-section-label">DRAFT RESPONSE</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'var(--blue)', background: 'rgba(56,189,248,.1)', padding: '1px 6px', borderRadius: 4 }}>AI-assisted</span>
                {!editingDraft && (
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditingDraft(true)}>✏ Edit</button>
                )}
              </div>
            </div>
            {editingDraft ? (
              <>
                <textarea
                  className="draft-box"
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  rows={10}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <button className="btn btn-primary btn-sm" onClick={saveDraft}>Save Draft</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setDraft(dr.draftResponse); setEditingDraft(false) }}>Cancel</button>
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, background: 'var(--navy-700)', padding: '10px 12px', borderRadius: 5, fontFamily: 'var(--mono)', whiteSpace: 'pre-wrap', maxHeight: 180, overflowY: 'auto' }}>
                {draft}
              </div>
            )}
          </div>

          {/* Related docs */}
          <div className="drawer-section">
            <div className="drawer-section-label">RELATED DOCUMENTS — AUTO-PULLED FROM AI SEARCH</div>
            {dr.relatedDocs.map((d, i) => (
              <div key={i} className="doc-item" onClick={() => toast(`Opening ${d.name}…`, 'info')}>
                <span style={{ fontSize: 16 }}>{fileIcon(d.type)}</span>
                <span style={{ flex: 1 }}>{d.name}</span>
                <span className="badge badge-gray" style={{ fontSize: 9 }}>{d.type.toUpperCase()}</span>
                <span style={{ fontSize: 11, color: 'var(--blue)' }}>↗</span>
              </div>
            ))}
          </div>

          {/* Commitments */}
          {dr.commitments.length > 0 && (
            <div className="drawer-section">
              <div className="drawer-section-label">COMMITMENTS FROM THIS DR</div>
              {dr.commitments.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--amber)', flexShrink: 0, marginTop: 2 }}>⚑</span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{c}</span>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          <div className="drawer-section">
            <div className="label-row">
              <div className="drawer-section-label">FILING NOTES</div>
              {!editingNotes && (
                <button className="btn btn-secondary btn-sm" onClick={() => setEditingNotes(true)}>✏ Edit</button>
              )}
            </div>
            {editingNotes ? (
              <>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  style={{ width: '100%', fontSize: 12, lineHeight: 1.6 }}
                  placeholder="Add internal notes…"
                />
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <button className="btn btn-primary btn-sm" onClick={saveNotes}>Save</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setNotes(dr.notes); setEditingNotes(false) }}>Cancel</button>
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: notes ? 'var(--text-secondary)' : 'var(--text-muted)', lineHeight: 1.6, fontStyle: notes ? 'normal' : 'italic' }}>
                {notes || 'No notes yet. Click Edit to add.'}
              </div>
            )}
          </div>

          {/* Purview */}
          <div className="drawer-section" style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
            <div className="purview-dot" />
            Auto-classified by Purview · Confidential · Attorney-client privilege excluded · Retention: 10 years
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, flexWrap: 'wrap', background: 'var(--navy-700)', flexShrink: 0 }}>
          {nextStatus && dr.status !== 'Filed' && (
            <button className="btn btn-primary" onClick={handleAdvance}>
              Advance → {nextStatus}
            </button>
          )}
          {dr.status === 'In Review' && (
            <button className="btn btn-success" onClick={() => { onUpdate(dr.id, { status: 'Filed', confidence: 100 }); toast(`${dr.id} filed successfully`, 'success'); onClose() }}>
              ✓ Mark as Filed
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => toast(`${dr.id} sent for review`, 'info')}>
            Request SME Review
          </button>
          <button className="btn btn-ghost" onClick={() => toast(`${dr.id} exported to PDF`, 'info')}>
            Export PDF
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Stack Modal ──────────────────────────────────────────────────────────────
function StackModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 760, width: '100%' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', fontWeight: 600, marginBottom: 5 }}>ECHELIX LATTICE · ARCHITECTURE</div>
            <div className="modal-title">RateCase Navigator — Lattice Stack</div>
          </div>
          <CloseBtn onClick={onClose} />
        </div>
        <div className="modal-body">
          <div className="field-label" style={{ marginBottom: 10 }}>INPUT SOURCES</div>
          <div className="tag-row" style={{ marginBottom: 20 }}>
            {['Email (Outlook)', 'Microsoft Teams', 'SharePoint', 'Meeting Transcripts', 'PUC Docket Feed'].map(s => (
              <span key={s} style={{ padding: '5px 11px', background: 'var(--navy-700)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, color: 'var(--text-secondary)' }}>{s}</span>
            ))}
          </div>
          <div style={{ textAlign: 'center', color: 'var(--blue)', fontSize: 20, marginBottom: 14 }}>↓</div>
          <div style={{ background: 'var(--navy-900)', border: '1px solid var(--blue)', borderRadius: 8, padding: 18, marginBottom: 14 }}>
            <div className="field-label" style={{ color: 'var(--blue)', marginBottom: 12 }}>ECHELIX LATTICE LAYER</div>
            <div className="two-col" style={{ gap: 10 }}>
              {[
                { name: 'M365 Graph', desc: 'Email, Teams, calendar ingest' },
                { name: 'Form Recognizer', desc: 'Document OCR & extraction' },
                { name: 'AI Search', desc: 'Vector search & RAG index' },
                { name: 'Azure OpenAI', desc: 'GPT-4 classification & drafting' },
                { name: 'Service Bus', desc: '9 agent messaging channels' },
                { name: 'Purview', desc: 'Auto-classification & governance' },
              ].map(c => (
                <div key={c.name} style={{ background: 'var(--navy-700)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--blue)', marginBottom: 3 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center', color: 'var(--blue)', fontSize: 20, marginBottom: 14 }}>↓</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
            {['Discovery Triage Agent', 'Commitment Capture Agent', 'Pattern Detection Agent', 'Deadline Risk Agent'].map(a => (
              <div key={a} style={{ background: 'var(--navy-700)', border: '1px solid var(--blue)', borderRadius: 6, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--blue)' }}>{a}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', color: 'var(--blue)', fontSize: 20, marginBottom: 14 }}>↓</div>
          <div className="field-label" style={{ marginBottom: 10 }}>OUTPUT SYSTEMS</div>
          <div className="tag-row" style={{ marginBottom: 16 }}>
            {['D365 Project Operations', 'SharePoint Knowledge Base', 'Power BI Filing Dashboard'].map(s => (
              <span key={s} style={{ padding: '5px 11px', background: 'var(--navy-700)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, color: 'var(--text-secondary)' }}>{s}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '10px 12px', background: 'var(--navy-900)', border: '1px solid rgba(56,189,248,.2)', borderRadius: 6, fontSize: 11, color: 'var(--text-muted)' }}>
            <div className="purview-dot" />
            All data flows governed by Lattice Purview · Confidential filings restricted · Privileged comms excluded · 10-year retention
          </div>
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--navy-700)', borderRadius: 6, fontSize: 11, color: 'var(--text-muted)', borderLeft: '3px solid var(--blue)' }}>
            Deployed on Lattice in 5 weeks · Zero new Azure provisioning · Reuses M365 connectors and AI Search already in Lattice foundation · Same platform supports 4 other utility workloads
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Executive Brief Modal ─────────────────────────────────────────────────────
function ExecBriefModal({ drs, commitments, onClose }: { drs: DR[]; commitments: Commitment[]; onClose: () => void }) {
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(0)
  const steps = ['Discovery Triage Agent querying open requests…', 'Commitment Capture Agent compiling at-risk items…', 'Pattern Detection Agent reviewing intervener activity…', 'Deadline Risk Agent computing risk flags…', 'Formatting executive brief…']
  useEffect(() => {
    const t = setInterval(() => {
      setStep(s => {
        if (s >= steps.length - 1) { clearInterval(t); setTimeout(() => setLoading(false), 300); return s }
        return s + 1
      })
    }, 360)
    return () => clearInterval(t)
  }, [])

  const open = drs.filter(d => d.status !== 'Filed').length
  const overdue = drs.filter(d => d.daysUntilDue === 'OVERDUE').length
  const atRisk = commitments.filter(c => !c.completed).length

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 660, width: '100%' }} onClick={e => e.stopPropagation()}>
        {loading ? (
          <div style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="live-dot" />
              <span style={{ fontSize: 13, color: 'var(--blue)', fontWeight: 600 }}>Generating Executive Brief</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{steps[step]}</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {steps.map((_, i) => (
                <div key={i} style={{ width: 38, height: 3, borderRadius: 2, background: i <= step ? 'var(--blue)' : 'var(--navy-600)', transition: 'background .3s' }}/>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div>
                <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', fontWeight: 600, marginBottom: 4 }}>MOUNTAINSIDE POWER & LIGHT</div>
                <div className="modal-title">Daily Executive Brief</div>
                <div className="modal-sub">Docket 26-0147-RC · Generated Wednesday, May 27, 2026 · 11:30 AM CDT</div>
              </div>
              <CloseBtn onClick={onClose} />
            </div>
            <div className="modal-body">
              <div className="two-col" style={{ marginBottom: 18, gridTemplateColumns: 'repeat(4,1fr)' }}>
                {[
                  { label: 'Open DRs', val: open.toString(), c: 'var(--amber)' },
                  { label: 'Overdue', val: overdue.toString(), c: 'var(--red)' },
                  { label: 'At-Risk Commits', val: atRisk.toString(), c: 'var(--blue)' },
                  { label: 'Days to Hearing', val: '147', c: 'var(--green)' },
                ].map(k => (
                  <div key={k.label} style={{ background: 'var(--navy-700)', border: '1px solid var(--border)', borderRadius: 7, padding: '12px 14px' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 24, fontWeight: 700, color: k.c }}>{k.val}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{k.label}</div>
                  </div>
                ))}
              </div>
              {[
                { head: 'DISCOVERY — THIS WEEK', items: ['2 new DRs received today (AG-DR-0089, ICC-DR-0048)', '8 responses due this week — AG-DR-0089 critical (2 days, 78% complete)', 'SC-DR-0012 OVERDUE — extension request pending Dana Torres approval', '1 filed this week: SC-DR-0018 (Wildfire Veg Management)'] },
                { head: 'COMMITMENTS AT RISK', items: commitments.filter(c => !c.completed).slice(0, 3).map(c => `${c.desc} — ${c.deadline} (${c.owner})`) },
                { head: 'INTERVENER ACTIVITY', items: ['Sierra Club: 7 of 12 DRs focused on wildfire cost recovery — disallowance strategy building', 'Attorney General: Renewed Cost of Capital pressure — near-identical to 2022 approach', 'ICC: Challenging O&M expense growth and demand charge increase', 'PUC Staff: 4 active DRs — rate base and depreciation focus'] },
                { head: 'RISK FLAGS', items: ['SC-DR-0012 overdue — PUC Rule 4.3 notice requirement triggered', 'Sierra Club pattern indicates organized disallowance challenge on wildfire costs', 'AG-DR-0094 confidence at 70% with 3-day deadline — escalation recommended'], color: 'var(--red)' },
                { head: 'RECOMMENDED ACTIONS', items: ['1. Approve SC-DR-0012 extension request (Dana Torres, D365 RC-2841)', '2. Expedite wildfire prudency exhibit — preempt Sierra Club disallowance argument', '3. Confirm CEO briefing before Wednesday board call (VP Regulatory)'] },
              ].map(section => (
                <div key={section.head} style={{ marginBottom: 16 }}>
                  <div className="field-label" style={{ color: section.color || 'var(--text-muted)', marginBottom: 8 }}>{section.head}</div>
                  {section.items.map((item, i) => (
                    <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>• {item}</div>
                  ))}
                </div>
              ))}
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 16 }}>
                Auto-generated by RateCase Navigator · Updated 4× daily · Powered by Lattice agent consensus
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>Download PDF</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── ROI Modal ────────────────────────────────────────────────────────────────
function ROIModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 620, width: '100%' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', fontWeight: 600, marginBottom: 4 }}>ECHELIX LATTICE · WORKLOAD ROI</div>
            <div className="modal-title">RateCase Navigator — Business Impact</div>
          </div>
          <CloseBtn onClick={onClose} />
        </div>
        <div className="modal-body">
          <div className="two-col" style={{ marginBottom: 20 }}>
            {[
              { label: 'Discovery Response Time', val: '4.2 days avg', sub: 'vs. 9.8 days last rate case', c: 'var(--green)' },
              { label: 'Commitments Tracked', val: '182', sub: 'vs. 47 captured manually (74% lost)', c: 'var(--blue)' },
              { label: 'Missed Deadlines', val: '0', sub: 'vs. 6 last filing — $2.4M in disallowed costs', c: 'var(--green)' },
              { label: 'Filing Cost Reduction', val: '$3.8M', sub: 'per rate case on Lattice', c: 'var(--blue)' },
            ].map(k => (
              <div key={k.label} style={{ background: 'var(--navy-700)', border: '1px solid var(--border)', borderRadius: 8, padding: '16px 18px' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 700, color: k.c, marginBottom: 5 }}>{k.val}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{k.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{k.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--navy-900)', border: '1px solid var(--blue)', borderRadius: 8, padding: '14px 18px', marginBottom: 14 }}>
            <div className="field-label" style={{ color: 'var(--blue)', marginBottom: 10 }}>LATTICE PLATFORM EFFICIENCY</div>
            {['Workload deployed in 5 weeks', 'Zero new Azure provisioning required', 'Reuses existing M365 connectors and AI Search', 'Same platform powers 4 other utility workloads'].map(i => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.9 }}>✓ {i}</div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

// ─── Commitment Source Modal ───────────────────────────────────────────────────
function CommitmentModal({ c, onClose, onComplete }: { c: Commitment; onClose: () => void; onComplete: (id: string) => void }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--blue)', fontWeight: 600, marginBottom: 4 }}>COMMITMENT TRAIL · {c.taskId}</div>
            <div className="modal-title" style={{ fontSize: 14 }}>{c.desc}</div>
          </div>
          <CloseBtn onClick={onClose} />
        </div>
        <div className="modal-body">
          <div className="two-col" style={{ marginBottom: 16 }}>
            {[
              { label: 'Owner', val: c.owner },
              { label: 'Deadline', val: c.deadline, warn: true },
              { label: 'Source', val: c.source },
              { label: 'Last Activity', val: c.lastActivity },
            ].map(f => (
              <div key={f.label} style={{ background: 'var(--navy-700)', borderRadius: 6, padding: '10px 12px' }}>
                <div className="field-label">{f.label}</div>
                <div style={{ fontSize: 13, color: f.warn ? 'var(--red)' : 'var(--text-primary)', fontWeight: f.warn ? 600 : 400, marginTop: 4 }}>{f.val}</div>
              </div>
            ))}
          </div>
          <div className="field-label" style={{ marginBottom: 8 }}>SOURCE EXCERPT — {c.source.toUpperCase()}</div>
          <div style={{ background: 'var(--navy-900)', border: '1px solid var(--border)', borderRadius: 6, padding: '12px 14px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 14 }}>
            <span style={{ background: 'rgba(251,191,36,.12)', color: '#fde68a', padding: '1px 4px', borderRadius: 3 }}>
              "…{c.owner} will ensure {c.desc.toLowerCase()} is complete before the response deadline…"
            </span>
            <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-muted)' }}>Captured by Commitment Capture Agent at {c.lastActivity} · D365 {c.taskId}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
            <div className="purview-dot" />
            Immutable audit record · Purview verified · {c.taskId}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          {!c.completed && (
            <button className="btn btn-success" onClick={() => { onComplete(c.id); onClose() }}>✓ Mark Complete</button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Chat Panel ───────────────────────────────────────────────────────────────
function ChatPanel({ drs, commitments, onClose }: { drs: DR[]; commitments: Commitment[]; onClose: () => void }) {
  const [messages, setMessages] = useState([
    { role: 'agent' as const, content: "Hello — I'm RateCase Navigator. Ask me about deadlines, commitments, intervener activity, or any discovery request in Docket 26-0147-RC." },
    { role: 'user' as const, content: "What's at risk this week?" },
    { role: 'agent' as const, content: `${commitments.filter(c => !c.completed).length} commitments are flagged at-risk. Most critical: SC-DR-0012 (Sierra Club, wildfire recovery) — overdue by 2 days. Dana Torres assigned but no activity since Monday. I've drafted an extension request letter awaiting approval in D365 RC-2841.` },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function respond(q: string): string {
    const ql = q.toLowerCase()
    const open = drs.filter(d => d.status !== 'Filed')
    const overdue = drs.filter(d => d.daysUntilDue === 'OVERDUE')
    const dueThisWeek = drs.filter(d => typeof d.daysUntilDue === 'number' && d.daysUntilDue <= 7)

    if (ql.includes('deadline') || ql.includes("today") || ql.includes('this week') || ql.includes('due'))
      return `${dueThisWeek.length} responses due this week.\n\nMost urgent:\n${dueThisWeek.slice(0,4).map(d => `• ${d.id} — ${d.assignedTo.split(' ')[0]}, ${d.daysUntilDue} days (${d.status}, ${d.confidence}% complete)`).join('\n')}\n\n${overdue.length > 0 ? `⚠ ${overdue[0].id} is OVERDUE.` : ''}`

    if (ql.includes('sierra') || ql.includes('wildfire'))
      return 'Sierra Club has filed 7 of 12 DRs this cycle on wildfire mitigation cost recovery — Pattern Detection Agent flags a disallowance strategy building.\n\nSC-DR-0012 is overdue. Extension request drafted and awaiting Dana Torres approval (D365 RC-2841).\n\nProactive wildfire prudency exhibit (based on 2024 SCE ruling) drafted and available for Dana Torres review.'

    if (ql.includes('commit'))
      return `182 total commitments tracked. ${commitments.filter(c => !c.completed).length} at risk:\n${commitments.filter(c => !c.completed).slice(0,4).map(c => `• ${c.desc} — ${c.deadline} (${c.owner})`).join('\n')}`

    if (ql.includes('exec') || ql.includes('brief') || ql.includes('summary'))
      return 'Click "Executive Brief" in the top nav to generate the full daily brief. It auto-assembles filing status, discovery activity, at-risk commitments, intervener activity, and recommended actions — updated 4× daily.'

    if (ql.includes('attorney general') || ql.includes('ag-dr'))
      return `Attorney General has ${drs.filter(d => d.intervener === 'Attorney General').length} active DRs. Most critical: AG-DR-0089 (Cost of Capital, 2 days, 78% complete — Sarah Chen). Pattern Detection Agent flagged near-identical questioning from 2022 rate case.`

    if (ql.includes('open') || ql.includes('status') || ql.includes('overview'))
      return `${open.length} discovery requests open across all interveners.\n\n${open.filter(d => d.status === 'Drafting').length} drafting · ${open.filter(d => d.status === 'In Review').length} in review · ${overdue.length} overdue\n\nHighest confidence: ${[...open].sort((a,b) => b.confidence - a.confidence)[0]?.id} (${[...open].sort((a,b) => b.confidence - a.confidence)[0]?.confidence}%)\nLowest confidence: ${[...open].sort((a,b) => a.confidence - b.confidence)[0]?.id} (${[...open].sort((a,b) => a.confidence - b.confidence)[0]?.confidence}%)`

    return `Checking filing records for "${q}"...\n\nI can help with: deadlines, open DRs, commitments at risk, intervener activity (Sierra Club, AG, ICC, PUC Staff, Walmart), executive brief, and individual DR status. Try asking about a specific DR number or topic.`
  }

  function send(msg?: string) {
    const q = msg || input
    if (!q.trim()) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { role: 'agent', content: respond(q) }])
    }, 700)
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div className="live-dot" />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Ask RateCase Navigator</span>
        </div>
        <CloseBtn onClick={onClose} />
      </div>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'msg-user' : 'msg-agent'}>{m.content}</div>
        ))}
        {typing && <div className="msg-agent" style={{ color: 'var(--text-muted)' }}>Checking filing records…</div>}
        <div ref={endRef} />
      </div>
      <div className="chat-chips">
        {["Today's deadlines", 'Sierra Club DRs', 'Commitments at risk', 'Open DRs overview', 'Executive brief'].map(chip => (
          <button key={chip} className="chat-chip" onClick={() => send(chip)}>{chip}</button>
        ))}
      </div>
      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about deadlines, DRs, commitments…"
        />
        <button className="chat-send" onClick={() => send()}>➤</button>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [drs, setDRs] = useState<DR[]>(initialDRs)
  const [agents, setAgents] = useState<AgentCard[]>(initialAgents)
  const [commitments, setCommitments] = useState<Commitment[]>(initialCommitments)
  const [activeTab, setActiveTab] = useState<'tracker' | 'audit'>('tracker')
  const [selectedDR, setSelectedDR] = useState<DR | null>(null)
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null)
  const [showStack, setShowStack] = useState(false)
  const [showBrief, setShowBrief] = useState(false)
  const [showROI, setShowROI] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [activeStep, setActiveStep] = useState(2) // "Drafting" step active
  const liveIdx = useRef(0)
  const toastId = useRef(0)
  const actEndRef = useRef<HTMLDivElement>(null)

  // Toast helper
  const toast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = ++toastId.current
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  // Live agent feed — prepend with unique timestamped id to prevent key collisions
  useEffect(() => {
    const t = setInterval(() => {
      const feedItem = liveAgentFeed[liveIdx.current % liveAgentFeed.length]
      const uniqueItem = { ...feedItem, id: `${feedItem.id}-${Date.now()}` }
      setAgents(prev => {
        // Cap at 12 cards to prevent unbounded growth
        const next = [uniqueItem, ...prev]
        return next.slice(0, 12)
      })
      liveIdx.current++
    }, 10000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => { actEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [agents])

  // DR update helpers
  const updateDR = useCallback((id: string, patch: Partial<DR>) => {
    setDRs(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d))
    if (selectedDR?.id === id) setSelectedDR(prev => prev ? { ...prev, ...patch } : prev)
  }, [selectedDR])

  const advanceDR = useCallback((id: string) => {
    setDRs(prev => prev.map(d => {
      if (d.id !== id) return d
      const n = next(d.status)
      return n ? { ...d, status: n } : d
    }))
    if (selectedDR?.id === id) {
      const n = next(selectedDR.status)
      if (n) setSelectedDR(prev => prev ? { ...prev, status: n } : prev)
    }
  }, [selectedDR])

  const completeCommitment = useCallback((id: string) => {
    setCommitments(prev => prev.map(c => c.id === id ? { ...c, completed: true } : c))
    toast('Commitment marked complete', 'success')
  }, [toast])

  // Step counts
  const stepCounts = statusOrder.map(s => drs.filter(d => d.status === s).length)
  const open = drs.filter(d => d.status !== 'Filed').length
  const overdue = drs.filter(d => d.daysUntilDue === 'OVERDUE').length
  const dueWeek = drs.filter(d => typeof d.daysUntilDue === 'number' && d.daysUntilDue <= 7).length
  const atRisk = commitments.filter(c => !c.completed).length

  return (
    <div className="app">
      {/* ── Topbar ──────────────────────────────────────────────────────── */}
      <div className="topbar">
        {/* Lattice platform row */}
        <div className="topbar-lattice">
          <div className="topbar-lattice-left">
            <LatticeLogo />
            <span className="lattice-brand">Echelix Lattice</span>
            <span style={{ color: 'var(--navy-500)', fontSize: 14 }}>|</span>
            <span className="lattice-tenant">Mountainside Power & Light</span>
          </div>

          {/* Workload switcher — single active workload */}
          <div className="topbar-workloads">
            <div className="workload-pill active">RateCase Navigator</div>
          </div>

          <div className="topbar-actions">
            <button className="action-btn" onClick={() => setShowBrief(true)}>Executive Brief</button>
            <button className="action-btn" onClick={() => setShowROI(true)}>ROI</button>
            <button className="action-btn primary" onClick={() => setShowStack(true)}>Stack ↗</button>
          </div>
        </div>

        {/* Docket row */}
        <div className="topbar-docket">
          <div className="docket-title">
            <div className="workload-logo">
              <RCLogo />
              <div>
                <div className="workload-name">RateCase Navigator</div>
                <div className="workload-desc">Agentic rate case and regulatory filing coordination</div>
              </div>
            </div>
          </div>
          <div className="docket-badge">
            <span className="docket-id">Docket 26-0147-RC</span>
            <span className="docket-sep">·</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>General Rate Case</span>
            <span className="docket-sep">·</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Filed: Jan 12, 2026</span>
            <span className="docket-sep">·</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Hearing: Sep 8, 2026</span>
            <span className="docket-sep">·</span>
            <span className="docket-status">Discovery Phase</span>
          </div>
          <div className="hearing-countdown">
            <span className="countdown-num">147</span>
            <span className="countdown-label">days to evidentiary hearing</span>
          </div>
        </div>

        {/* Workflow stepper */}
        <div className="workflow-stepper">
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '.07em', textTransform: 'uppercase', marginRight: 12, flexShrink: 0 }}>RATE CASE PIPELINE</span>
          {(['Intake', 'Classify', 'Draft', 'Review', 'File'] as const).map((label, i) => {
            const s = statusOrder[i]
            const count = stepCounts[i]
            const completed = i < activeStep
            const active = i === activeStep
            return (
              <div key={label} className="step">
                <div
                  className={`step-inner ${active ? 'active' : ''} ${completed ? 'completed' : ''}`}
                  onClick={() => setActiveStep(i)}
                  title={`Filter by ${s}`}
                >
                  <div className="step-num">{completed ? '✓' : i + 1}</div>
                  <div className="step-label">{label}</div>
                  <div className="step-count">{count} DR{count !== 1 ? 's' : ''}</div>
                </div>
                {i < 4 && <span className="step-arrow">›</span>}
              </div>
            )
          })}
        </div>

        {/* KPI bar */}
        <div className="kpi-bar">
          {[
            { icon: '📋', val: open.toString(), label: 'Open Discovery Requests', c: 'var(--amber)' },
            { icon: '⏰', val: dueWeek.toString(), label: 'Response Deadlines This Week', c: 'var(--red)' },
            { icon: '📌', val: commitments.reduce((n, c) => n + (c.completed ? 0 : 1), 0).toString(), label: `At-Risk Commitments`, c: 'var(--blue)' },
            { icon: '📁', val: '3,847', label: 'Filing Documents Indexed', c: 'var(--green)' },
          ].map(k => (
            <div key={k.label} className="kpi-card">
              <span className="kpi-icon">{k.icon}</span>
              <div>
                <div className="kpi-value" style={{ color: k.c }}>{k.val}</div>
                <div className="kpi-label">{k.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main grid ───────────────────────────────────────────────────── */}
      <div className="main-grid">

        {/* ── LEFT: Discovery Tracker (40%) ─────────────────────────── */}
        <div className="panel" style={{ width: '40%', borderRight: '1px solid var(--border)' }}>
          <div className="tab-row">
            <button className={`tab ${activeTab === 'tracker' ? 'active' : ''}`} onClick={() => setActiveTab('tracker')}>
              📋 Discovery Tracker
            </button>
            <button className={`tab ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
              🔒 Audit Trail
            </button>
          </div>

          {activeTab === 'tracker' ? (
            <>
              <div className="dr-table-head">
                <span>DR No.</span>
                <span>Intervener / Topic</span>
                <span>Assigned</span>
                <span>Due</span>
                <span>Status</span>
                <span>Confidence</span>
              </div>
              <div className="panel-body">
                {drs.map(dr => (
                  <div
                    key={dr.id}
                    className={`dr-row ${dr.daysUntilDue === 'OVERDUE' ? 'overdue' : ''} ${selectedDR?.id === dr.id ? 'selected' : ''}`}
                    onClick={() => setSelectedDR(selectedDR?.id === dr.id ? null : dr)}
                  >
                    <div className="dr-id">{dr.id}</div>
                    <div style={{ minWidth: 0 }}>
                      <div className="dr-intervener">{dr.intervener}</div>
                      <div className="dr-topic">{dr.topic}</div>
                    </div>
                    <div className="dr-assign">{dr.assignedTo.split(' ').map(w => w[0]).join('.') + '.'}</div>
                    <div>{dueBadge(dr.daysUntilDue)}</div>
                    <div>{statusBadge(dr.status)}</div>
                    <div><ConfBar v={dr.confidence} /></div>
                  </div>
                ))}
              </div>
              <div className="purview-bar">
                <div className="purview-dot" />
                Auto-classified by Purview · Confidential restricted · Privileged comms excluded · 10-yr retention
              </div>
            </>
          ) : (
            <div className="panel-body">
              <div style={{ padding: '8px 12px', background: 'var(--navy-900)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6, position: 'sticky', top: 0, zIndex: 5 }}>
                <div className="live-dot" />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue)' }}>Immutable audit log — Purview verified</span>
              </div>
              {auditLog.map((e, i) => (
                <div key={i} className="audit-entry">
                  <div className="audit-ts">{e.ts}</div>
                  <div>
                    <div className="audit-msg">{e.msg}</div>
                    {e.hash && (
                      <div className="audit-hash" onClick={() => { navigator.clipboard.writeText(e.hash!); toast('Hash copied to clipboard', 'info') }}>
                        hash: {e.hash} <span className="hash-verified">✓ verified</span>
                        <span style={{ marginLeft: 8, fontSize: 9, color: 'var(--text-muted)' }}>click to copy</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── CENTER: Agent Workbench (35%) ─────────────────────────── */}
        <div className="panel" style={{ width: '35%', borderRight: '1px solid var(--border)' }}>
          <div className="panel-header">
            <div className="panel-title">
              <div className="live-dot" />
              Agent Workbench
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>4 agents active</span>
            </div>
          </div>
          <div className="panel-body">
            <div className="agent-cards">
              {agents.map(a => (
                <div key={a.id} className={`agent-card ${a.level} slide-in`}>
                  <div className="agent-header">
                    <span className="agent-icon">{a.icon}</span>
                    <span className="agent-name">{a.name}</span>
                    <span className="agent-time">{a.time}</span>
                    {a.level === 'risk' && <span className="badge badge-red" style={{ fontSize: 9 }}>RISK</span>}
                    {a.level === 'warn' && <span className="badge badge-amber" style={{ fontSize: 9 }}>ALERT</span>}
                  </div>
                  <div className="agent-tags">
                    {a.tags.map(t => <span key={t} className="agent-tag">{t}</span>)}
                  </div>
                  <div className="agent-body">{a.message}</div>
                  {a.actionLabel && a.actionDRId && (
                    <div className="agent-action">
                      <button
                        className={`btn btn-sm ${a.level === 'risk' ? 'btn-success' : 'btn-primary'}`}
                        onClick={() => {
                          if (a.actionLabel === 'Approve Extension') {
                            updateDR(a.actionDRId!, { status: 'In Review' })
                            toast(`Extension for ${a.actionDRId} approved — Sierra Club notified`, 'success')
                          } else if (a.actionLabel === 'Escalate') {
                            toast(`${a.actionDRId} escalated to VP Regulatory`, 'warn')
                          }
                        }}
                      >
                        {a.actionLabel}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelectedDR(drs.find(d => d.id === a.actionDRId) || null)}>
                        View DR
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div ref={actEndRef} />
          </div>
        </div>

        {/* ── RIGHT: Insight Feed (25%) ──────────────────────────────── */}
        <div className="panel" style={{ width: '25%' }}>
          <div className="panel-body">

            {/* Commitments Dashboard */}
            <div className="section-head" style={{ color: 'var(--text-secondary)' }}>
              COMMITMENTS DASHBOARD
            </div>
            <div className="commit-grid">
              {[
                { label: 'From Email', n: 47 },
                { label: 'From Teams', n: 89 },
                { label: 'From Meetings', n: 34 },
                { label: 'From SharePoint', n: 12 },
              ].map(s => (
                <div key={s.label} className="commit-source">
                  <div className="commit-num">{s.n}</div>
                  <div className="commit-src-label">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="commit-total">
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total active commitments</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 700, color: 'var(--blue)' }}>182</span>
            </div>

            {/* Commitments at risk */}
            <div className="section-head" style={{ color: 'var(--red)' }}>
              <span>COMMITMENTS AT RISK</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{atRisk} open</span>
            </div>
            {commitments.map(c => (
              <div key={c.id} className="risk-row" onClick={() => setSelectedCommitment(c)} style={{ opacity: c.completed ? 0.4 : 1 }}>
                <div className="risk-row-top">
                  <div className="risk-desc" style={{ textDecoration: c.completed ? 'line-through' : 'none' }}>{c.desc}</div>
                  {c.completed
                    ? <span className="badge badge-green" style={{ fontSize: 9, flexShrink: 0 }}>DONE</span>
                    : <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 700, flexShrink: 0 }}>{c.deadline}</span>
                  }
                </div>
                <div className="risk-meta">
                  <span className="risk-owner">{c.owner}</span>
                  <span style={{ color: 'var(--navy-500)' }}>·</span>
                  <span className="risk-time">Last: {c.lastActivity}</span>
                  <span className="risk-task">{c.taskId}</span>
                  {!c.completed && (
                    <button
                      className="btn btn-success btn-sm"
                      style={{ padding: '2px 7px', fontSize: 9, marginLeft: 4 }}
                      onClick={e => { e.stopPropagation(); completeCommitment(c.id) }}
                    >✓</button>
                  )}
                </div>
              </div>
            ))}

            {/* Regulatory Intelligence */}
            <div className="section-head" style={{ color: 'var(--text-secondary)', marginTop: 6 }}>REGULATORY INTELLIGENCE</div>
            <div style={{ padding: '7px 12px', fontSize: 11, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
              Lattice semantic-search · Mountainside-related filings this week
            </div>
            {[
              { tag: 'HIGH RELEVANCE', tagC: 'var(--red)', title: 'Neighboring utility filed wildfire recovery position', sub: 'Related to SC-DR-0012 — view position' },
              { tag: 'PRECEDENT', tagC: 'var(--blue)', title: 'PUC Staff issued ALJ ruling on cost-of-capital benchmarking — Docket 25-0892-RC', sub: 'Supports MPL position on AG-DR-0089' },
              { tag: 'INTELLIGENCE', tagC: 'var(--amber)', title: 'ICC filed similar rate design challenge in neighboring state', sub: 'Opposition strategy preview available' },
            ].map((item, i) => (
              <div key={i} className="intel-item" onClick={() => toast(`Opening: ${item.title}`, 'info')}>
                <span className="badge" style={{ background: `color-mix(in srgb, ${item.tagC} 15%, transparent)`, color: item.tagC, fontSize: 9 }}>{item.tag}</span>
                <div className="intel-title">{item.title}</div>
                <div className="intel-sub">{item.sub}</div>
              </div>
            ))}

            {/* AI Insight */}
            <div className="ai-insight">
              <div className="ai-insight-header">🧠 RateCase Navigator AI Insight</div>
              <div className="ai-insight-body">
                Sierra Club has filed <strong style={{ color: 'var(--red)' }}>7 of 12 DRs</strong> focused on wildfire mitigation cost recovery. Pattern indicates a disallowance argument is building.
                <br /><br />
                Recommend proactive prudency exhibit (precedent: 2024 SCE ruling) — <span style={{ color: 'var(--blue)', cursor: 'pointer' }} onClick={() => toast('Wildfire prudency exhibit drafted and sent to Dana Torres', 'info')}>drafted, click to send to Dana Torres.</span>
              </div>
              <div className="ai-insight-footer">4 agents in consensus · Updated 09:31</div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Chat toggle / panel ──────────────────────────────────────── */}
      {!showChat
        ? <button className="chat-toggle" onClick={() => setShowChat(true)}>💬 Ask RateCase Navigator</button>
        : <ChatPanel drs={drs} commitments={commitments} onClose={() => setShowChat(false)} />
      }

      {/* ── Modals ──────────────────────────────────────────────────── */}
      {selectedDR && (
        <DRDrawer
          dr={selectedDR}
          drs={drs}
          onClose={() => setSelectedDR(null)}
          onUpdate={updateDR}
          onAdvance={advanceDR}
          toast={toast}
        />
      )}
      {selectedCommitment && (
        <CommitmentModal
          c={selectedCommitment}
          onClose={() => setSelectedCommitment(null)}
          onComplete={completeCommitment}
        />
      )}
      {showStack && <StackModal onClose={() => setShowStack(false)} />}
      {showBrief && <ExecBriefModal drs={drs} commitments={commitments} onClose={() => setShowBrief(false)} />}
      {showROI && <ROIModal onClose={() => setShowROI(false)} />}

      <Toasts toasts={toasts} />
    </div>
  )
}
