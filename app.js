/* ============================================================
   RateCase Navigator Enterprise — app.js
   Full router + renders + modals + autonomous behaviors
   ============================================================ */

'use strict';

/* ── State ─────────────────────────────────────────────────── */
let currentSection = 'proceedings';
let currentProceeding = null;
let currentRole = 'director';
let calendarOffset = 0;
let activeReportTab = 'status';
let activeDrFilter = 'all';
let autoDrCounter = 100;
let activityIndex = 0;
let submittedDRs = new Set();
let commitmentStatuses = {};

/* ── Bootstrap ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Seed commitment statuses
  COMMITMENTS.forEach(c => { commitmentStatuses[c.id] = c.status; });

  // Role switcher
  const roleSel = document.getElementById('role-select');
  if (roleSel) {
    roleSel.addEventListener('change', e => {
      currentRole = e.target.value;
      if (currentRole === 'counsel') {
        loadProceeding('puc-25-1142');
        navigate('active');
      } else {
        navigate('proceedings');
      }
    });
  }

  // Nav item clicks (data-section attribute)
  document.querySelectorAll('.nav-item[data-section]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.section));
  });

  // Inner tabs
  document.querySelectorAll('.inner-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.inner-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.inner-tab-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById('itab-' + target);
      if (panel) panel.classList.add('active');
      // Re-render inner panels on activation
      if (target === 'witnesses') renderInnerWitnesses();
    });
  });

  // Report tabs
  document.querySelectorAll('.report-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.report-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeReportTab = tab.dataset.report;
      renderReport(activeReportTab);
    });
  });

  // Discovery filter pills
  document.querySelectorAll('.filter-pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill[data-filter]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeDrFilter = pill.dataset.filter;
      renderDiscovery();
    });
  });

  // Calendar nav
  const prevBtn = document.getElementById('cal-prev');
  const nextBtn = document.getElementById('cal-next');
  if (prevBtn) prevBtn.addEventListener('click', () => { calendarOffset--; renderCalendar(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { calendarOffset++; renderCalendar(); });

  // Modal overlay clicks
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeAllModals();
    });
  });

  // Modal close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeAllModals());
  });

  // Commitment save
  const commitSaveBtn = document.getElementById('commit-status-save');
  if (commitSaveBtn) commitSaveBtn.addEventListener('click', updateCommitmentStatus);

  // DR Submit
  const drSubmitBtn = document.getElementById('dr-submit-btn');
  if (drSubmitBtn) drSubmitBtn.addEventListener('click', submitDRResponse);

  // Initial navigation
  loadProceeding('puc-25-1142');
  navigate('proceedings');

  // Autonomous behaviors
  startAutonomousBehaviors();
});

/* ── Navigation ─────────────────────────────────────────────── */
function navigate(section) {
  currentSection = section;

  document.querySelectorAll('.nav-item[data-section]').forEach(el => {
    el.classList.toggle('active', el.dataset.section === section);
  });

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + section);
  if (target) target.classList.add('active');

  switch (section) {
    case 'proceedings':  renderProceedings(); break;
    case 'active':       renderActiveProceeding(); break;
    case 'discovery':    renderDiscovery(); break;
    case 'commitments':  renderCommitments(); break;
    case 'calendar':     renderCalendar(); break;
    case 'witnesses':    renderWitnesses(); break;
    case 'reports':      renderReport(activeReportTab); break;
  }
}

/* ── Proceedings ────────────────────────────────────────────── */
function renderProceedings() {
  const grid = document.getElementById('proceedings-grid');
  if (!grid) return;
  grid.innerHTML = '';

  PROCEEDINGS.forEach(proc => {
    const isActive = proc.status === 'active';
    const card = document.createElement('div');
    card.className = 'proc-card' + (!isActive ? ' closed' : '');
    const urgentDate = proc.atRiskCommitments > 0;
    card.innerHTML = `
      <div class="proc-card-header">
        <div>
          <div class="proc-docket">${escHtml(proc.docket)}</div>
          <div class="proc-title">${escHtml(proc.title)}</div>
        </div>
        <span class="spill spill-${isActive ? 'active' : 'closed'}">${isActive ? 'Active' : 'Closed'}</span>
      </div>
      <div class="proc-meta">
        <div class="proc-meta-item">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${escHtml(proc.jurisdiction)}
        </div>
        <div class="proc-meta-item">Phase: <strong>${escHtml(proc.phase)}</strong></div>
        <div class="proc-meta-item">Counsel: <strong>${escHtml(proc.leadCounsel.split(',')[0])}</strong></div>
        ${isActive ? `<div class="proc-meta-item">Open DRs: <strong>${proc.openDRs}</strong></div>` : ''}
      </div>
      <div class="proc-footer">
        <div class="proc-deadline ${urgentDate ? 'urgent' : ''}">
          ${urgentDate ? '⚠ ' : ''}${escHtml(proc.keyDeadline)}
        </div>
        <span class="spill spill-${phaseClass(proc.phase)}">${escHtml(proc.phase)}</span>
      </div>
    `;
    card.addEventListener('click', () => {
      loadProceeding(proc.id);
      navigate('active');
    });
    grid.appendChild(card);
  });
}

function loadProceeding(id) {
  const proc = PROCEEDINGS.find(p => p.id === id);
  if (!proc) return;
  currentProceeding = proc;

  const el = (eid) => document.getElementById(eid);
  if (el('active-docket'))       el('active-docket').textContent = proc.docket;
  if (el('active-title'))        el('active-title').textContent  = proc.title + ' — ' + proc.utility;
  if (el('active-judge'))        el('active-judge').textContent  = proc.leadCounsel.split(',')[0];
  if (el('active-phase'))        el('active-phase').textContent  = proc.phase;
  if (el('active-court'))        el('active-court').textContent  = proc.jurisdiction.split(' ').slice(0,3).join(' ');
  if (el('active-docket-strip')) el('active-docket-strip').textContent = proc.docket + ' · ' + proc.title;
}

function phaseClass(phase) {
  const map = {
    'Filing': 'brief', 'Discovery': 'discovery', 'Direct Testimony': 'open',
    'Intervenor Testimony': 'hearing', 'Rebuttal': 'brief', 'Hearings': 'hearing',
    'Briefs': 'brief', 'Final Order': 'settled', 'Final order': 'settled',
    'Compliance': 'pending', 'Closed': 'closed'
  };
  return map[phase] || 'open';
}

/* ── Active Proceeding ──────────────────────────────────────── */
function renderActiveProceeding() {
  if (!currentProceeding) loadProceeding('puc-25-1142');
  renderInnerCommitments();
  renderInnerDiscovery();
  renderInnerWitnesses();
  renderRail();
}

function renderInnerCommitments() {
  const tbody = document.getElementById('commitments-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  COMMITMENTS.slice(0, 6).forEach(c => tbody.appendChild(createCommitmentRow(c)));
}

function renderInnerDiscovery() {
  const tbody = document.getElementById('inner-dr-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  DISCOVERY_REQUESTS.slice(0, 5).forEach(dr => tbody.appendChild(createDRRow(dr)));
}

function renderInnerWitnesses() {
  const container = document.getElementById('inner-witness-dir');
  if (!container) return;
  container.innerHTML = '';
  WITNESSES.slice(0, 4).forEach(w => container.appendChild(createWitnessEntry(w)));
}

function renderRail() {
  const railWit = document.getElementById('rail-witnesses');
  if (!railWit) return;
  railWit.innerHTML = '';
  WITNESSES.slice(0, 6).forEach(w => {
    const item = document.createElement('div');
    item.className = 'rail-witness-item';
    item.innerHTML = `
      <div class="witness-avatar">${escHtml(w.initials)}</div>
      <div>
        <div class="witness-name">${escHtml(w.name)}</div>
        <div class="witness-role">${escHtml(w.title)}</div>
      </div>
    `;
    item.addEventListener('click', () => openWitnessModal(w));
    railWit.appendChild(item);
  });
}

/* ── Discovery ──────────────────────────────────────────────── */
function renderDiscovery() {
  const tbody = document.getElementById('discovery-tbody');
  if (!tbody) return;

  let rows = [...DISCOVERY_REQUESTS];
  if (activeDrFilter !== 'all') {
    if (activeDrFilter === 'open')   rows = rows.filter(r => r.status === 'Drafting' || r.status === 'Overdue');
    if (activeDrFilter === 'review') rows = rows.filter(r => r.status === 'Internal Review' || submittedDRs.has(r.id));
    if (activeDrFilter === 'filed')  rows = rows.filter(r => r.status === 'Filed');
    if (activeDrFilter === 'auto')   rows = rows.filter(r => r.autoDrafted);
  }

  tbody.innerHTML = '';
  rows.forEach(dr => tbody.appendChild(createDRRow(dr)));

  const countEl = document.getElementById('dr-count');
  if (countEl) countEl.textContent = rows.length + ' requests';
}

function createDRRow(dr) {
  const status = submittedDRs.has(dr.id) ? 'Internal Review' : dr.status;
  const tr = document.createElement('tr');
  if (dr.dueRisk && status !== 'Filed') tr.classList.add('at-risk');
  if (dr.autoDrafted) tr.classList.add('auto-drafted-row');
  const question = dr.question || '';
  tr.innerHTML = `
    <td>${escHtml(dr.id)}</td>
    <td>${escHtml(question.substring(0, 85))}${question.length > 85 ? '…' : ''}</td>
    <td>${escHtml(dr.party || dr.propoundingParty || '')}</td>
    <td>${escHtml(dr.due || dr.dueDate || '')}</td>
    <td><span class="spill spill-${drStatusClass(status)}">${escHtml(status)}</span></td>
    <td>${escHtml(dr.assigned || dr.assignedTo || '')}</td>
    <td>${dr.autoDrafted ? '<span class="badge-new">AI</span>' : ''}</td>
  `;
  tr.addEventListener('click', () => openDRModal(dr));
  return tr;
}

function drStatusClass(status) {
  const map = {
    'Drafting': 'open', 'Overdue': 'risk', 'Internal Review': 'review',
    'Filed': 'filed', 'Pending': 'pending', 'Open': 'open'
  };
  return map[status] || 'open';
}

/* ── Commitments ────────────────────────────────────────────── */
function renderCommitments() {
  const tbody = document.getElementById('full-commitments-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  COMMITMENTS.forEach(c => tbody.appendChild(createCommitmentRow(c)));

  const counts = { Open:0, 'At-Risk':0, 'At Risk':0, Complete:0, Closed:0, 'Under Review':0, Pending:0 };
  COMMITMENTS.forEach(c => {
    const s = commitmentStatuses[c.id] || c.status;
    if (counts[s] !== undefined) counts[s]++;
  });

  const el = id => document.getElementById(id);
  if (el('stat-open'))     el('stat-open').textContent     = counts['Open'];
  if (el('stat-risk'))     el('stat-risk').textContent     = (counts['At-Risk'] || 0) + (counts['At Risk'] || 0);
  if (el('stat-complete')) el('stat-complete').textContent = (counts['Complete'] || 0) + (counts['Closed'] || 0);
  if (el('stat-review'))   el('stat-review').textContent   = counts['Under Review'];
}

function createCommitmentRow(c) {
  const status = commitmentStatuses[c.id] || c.status;
  const isRisk = status === 'At-Risk' || status === 'At Risk';
  const tr = document.createElement('tr');
  if (isRisk) tr.classList.add('at-risk');
  const textStr = c.text || c.commitment || '';
  tr.innerHTML = `
    <td>${escHtml(textStr.substring(0, 90))}${textStr.length > 90 ? '…' : ''}</td>
    <td style="white-space:nowrap;">${escHtml(c.source ? c.source.replace(' direct','').replace(' rebuttal','') : (c.docket || ''))}</td>
    <td>${escHtml(c.cite || c.category || '')}</td>
    <td><span class="spill spill-${commitStatusClass(status)}">${escHtml(status)}</span></td>
    <td style="white-space:nowrap;">${escHtml(c.due || c.dueDate || '')}</td>
    <td>${escHtml(c.witness || c.responsible || '')}</td>
  `;
  tr.addEventListener('click', () => openCommitmentModal(c));
  return tr;
}

function commitStatusClass(status) {
  const map = {
    'Open': 'open', 'At-Risk': 'risk', 'At Risk': 'risk',
    'Complete': 'complete', 'Closed': 'complete', 'Under Review': 'review', 'Pending': 'pending'
  };
  return map[status] || 'open';
}

/* ── Calendar ───────────────────────────────────────────────── */
function renderCalendar() {
  const grid    = document.getElementById('calendar-grid');
  const labelEl = document.getElementById('cal-month-label');
  if (!grid) return;

  const BASE_YEAR = 2026, BASE_MONTH = 4; // May 2026
  const totalOffset = BASE_MONTH + calendarOffset;
  const year  = BASE_YEAR + Math.floor(totalOffset / 12);
  const month = ((totalOffset % 12) + 12) % 12;

  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  if (labelEl) labelEl.textContent = MONTHS[month] + ' ' + year;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map events to this month
  const dayMap = {};
  FILING_EVENTS.forEach(e => {
    const d = new Date(e.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      if (!dayMap[day]) dayMap[day] = [];
      dayMap[day].push(e);
    }
  });

  grid.innerHTML = '';

  // Day-of-week headers
  ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(d => {
    const h = document.createElement('div');
    h.className = 'cal-day-header';
    h.textContent = d;
    grid.appendChild(h);
  });

  // Leading empty cells
  for (let i = 0; i < firstDay; i++) {
    const e = document.createElement('div');
    e.className = 'cal-day empty';
    grid.appendChild(e);
  }

  // Day cells
  const today = new Date();
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
    const cell = document.createElement('div');
    cell.className = 'cal-day' + (isToday ? ' today' : '');

    const numDiv = document.createElement('div');
    numDiv.className = 'cal-day-num';
    numDiv.textContent = d;
    cell.appendChild(numDiv);

    (dayMap[d] || []).forEach(ev => {
      const evDiv = document.createElement('div');
      evDiv.className = 'cal-event';
      evDiv.innerHTML = `<div class="cal-event-dot ${ev.proc}"></div><div class="cal-event-label">${escHtml(ev.label || ev.title || '')}</div>`;
      evDiv.addEventListener('click', e => { e.stopPropagation(); openFilingModal(ev); });
      cell.appendChild(evDiv);
    });

    grid.appendChild(cell);
  }

  // Trailing empty cells
  const total = firstDay + daysInMonth;
  const rem = total % 7;
  if (rem !== 0) {
    for (let i = 0; i < 7 - rem; i++) {
      const e = document.createElement('div');
      e.className = 'cal-day empty';
      grid.appendChild(e);
    }
  }
}

/* ── Witnesses ──────────────────────────────────────────────── */
function renderWitnesses() {
  const container = document.getElementById('witness-directory-full');
  if (!container) return;
  container.innerHTML = '';
  WITNESSES.forEach(w => container.appendChild(createWitnessEntry(w)));
}

function createWitnessEntry(w) {
  const entry = document.createElement('div');
  entry.className = 'witness-entry';
  entry.dataset.id = w.id;

  // Build testimony sections from the `testimony` array in data.js
  const sections = (w.testimony || []).map(ts => `
    <div class="testimony-section-row" data-tsid="${ts.section}">
      <div class="ts-code">${escHtml(ts.section)}</div>
      <div class="ts-title">${escHtml(ts.title)}</div>
      <div class="ts-progress-wrap">
        <div class="ts-progress-bar">
          <div class="ts-progress-fill ${ts.pct < 40 ? 'risk' : ''}" style="width:${ts.pct}%"></div>
        </div>
        <div class="ts-pct">${ts.pct}%</div>
      </div>
      <span class="spill spill-${ts.pct === 100 ? 'filed' : ts.pct < 40 ? 'risk' : 'open'}">${escHtml(ts.status)}</span>
    </div>
  `).join('');

  entry.innerHTML = `
    <div class="witness-entry-header">
      <div class="witness-avatar-lg">${escHtml(w.initials)}</div>
      <div>
        <div class="witness-entry-name">${escHtml(w.name)}</div>
        <div class="witness-entry-title">${escHtml(w.title)}</div>
      </div>
      <div class="witness-entry-meta">
        <span class="spill spill-open">Company</span>
        <span>${(w.testimony || []).length} sections</span>
        <span class="text-muted">${w.openItems || 0} open items</span>
      </div>
      <svg class="witness-expand-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
    <div class="witness-expand-body">
      <p style="font-size:13px;color:var(--warm-grey);margin-bottom:12px;line-height:1.5;">${escHtml(w.qualifications || '')}</p>
      <div class="testimony-sections">${sections}</div>
    </div>
  `;

  entry.querySelector('.witness-entry-header').addEventListener('click', e => {
    if (e.target.closest('.testimony-section-row')) return;
    entry.classList.toggle('expanded');
  });

  entry.querySelectorAll('.testimony-section-row').forEach(row => {
    row.addEventListener('click', e => {
      e.stopPropagation();
      const ts = (w.testimony || []).find(s => s.section === row.dataset.tsid);
      if (ts) openTestimonyModal(w, ts);
    });
  });

  return entry;
}

/* ── Reports ────────────────────────────────────────────────── */
function renderReport(key) {
  const container = document.getElementById('report-content');
  if (!container) return;

  if (key === 'status') {
    container.innerHTML = `
      <div class="report-section-title">Status Summary Report</div>
      <div class="report-meta">Generated: May 27, 2026 · All Active Proceedings · Prepared by: S. Anderson, Lead Regulatory Counsel</div>
      <div class="report-stats-grid">
        <div class="report-stat-box"><div class="report-stat-val">3</div><div class="report-stat-lbl">Active Proceedings</div></div>
        <div class="report-stat-box"><div class="report-stat-val">58</div><div class="report-stat-lbl">Open Data Requests</div></div>
        <div class="report-stat-box"><div class="report-stat-val" style="color:var(--burgundy);">4</div><div class="report-stat-lbl">At-Risk Commitments</div></div>
        <div class="report-stat-box"><div class="report-stat-val">8</div><div class="report-stat-lbl">Active Witnesses</div></div>
      </div>
      <div class="report-body">
        <p>As of May 27, 2026, Mountainside Power &amp; Light has three active regulatory proceedings before the Texas PUC, New York PSC, and California PUC. The Texas general rate case (PUC Docket No. 25-1142) remains the highest-priority matter, with rebuttal testimony due June 17, 2026 and evidentiary hearings scheduled to begin July 8, 2026.</p>
        <h4>Texas PUC — PUC Docket No. 25-1142</h4>
        <p>The Company filed its Application for a general rate increase on January 6, 2026, requesting a revenue requirement of $569 million. The proceeding is currently in the Intervenor Testimony phase. Four at-risk commitments require immediate attention, including RC-0043 (M. Reyes depreciation reconciliation, due May 15) and RC-0046 (D. Patel capital structure sensitivity, due May 30). Rebuttal sections REB-03, REB-05, and REB-07 are not yet complete; drafting should be accelerated. Eighteen discovery requests remain open.</p>
        <h4>New York PSC — NYPSC Case No. 24-E-0982</h4>
        <p>The Company's New York electric rate case, filed September 14, 2024, is in the Direct Testimony phase. Thirty-one discovery requests are open. Direct testimony is due June 3, 2026. The target final order date is August 30, 2026.</p>
        <h4>California PUC — CPUC Application No. A.25-04-008</h4>
        <p>The California general rate case, filed April 1, 2025, is in the Discovery phase. Nine discovery requests are open. No commitments are at risk at this time. The target final order is March 15, 2027.</p>
      </div>
    `;
  } else if (key === 'aging') {
    const data = REPORT_DATA.aging;
    const sorted = [...data.rows].sort((a,b) => (b.age||0) - (a.age||0));
    container.innerHTML = `
      <div class="report-section-title">${escHtml(data.title)}</div>
      <div class="report-meta">${escHtml(data.subtitle)}</div>
      <div class="report-body"><p>The following table shows all open and in-review discovery responses sorted by age (days since received). Requests older than 30 days are flagged as at-risk.</p></div>
      <table class="data-table" style="margin-top:16px;">
        <thead><tr>
          <th>DR ID</th><th>Party</th><th>Witness</th><th>Received</th><th>Due</th><th>Age (days)</th><th>Status</th>
        </tr></thead>
        <tbody>
          ${sorted.map(r => `<tr ${r.risk ? 'class="at-risk"' : ''}>
            <td>${escHtml(r.id)}</td>
            <td>${escHtml(r.party)}</td>
            <td>${escHtml(r.witness)}</td>
            <td>${escHtml(r.received)}</td>
            <td>${escHtml(r.due)}</td>
            <td style="font-family:var(--font-serif);${r.risk ? 'color:var(--burgundy);font-weight:500;' : ''}">${r.age}</td>
            <td><span class="spill spill-${drStatusClass(r.status)}">${escHtml(r.status)}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    `;
  } else if (key === 'compliance') {
    const data = REPORT_DATA.compliance;
    container.innerHTML = `
      <div class="report-section-title">${escHtml(data.title)}</div>
      <div class="report-meta">${escHtml(data.subtitle)}</div>
      <div class="report-stats-grid">
        <div class="report-stat-box"><div class="report-stat-val">${data.summary.total}</div><div class="report-stat-lbl">Total Commitments</div></div>
        <div class="report-stat-box"><div class="report-stat-val">${data.summary.closed}</div><div class="report-stat-lbl">Closed / Complete</div></div>
        <div class="report-stat-box"><div class="report-stat-val" style="color:var(--burgundy);">${data.summary.atRisk}</div><div class="report-stat-lbl">At Risk</div></div>
        <div class="report-stat-box"><div class="report-stat-val">${data.summary.rate}</div><div class="report-stat-lbl">Closure Rate</div></div>
      </div>
      <div class="report-body"><p>The following table shows commitment compliance broken down by responsible witness. Witnesses with closure rates below 60% are flagged for management attention.</p></div>
      <table class="data-table" style="margin-top:16px;">
        <thead><tr>
          <th>Witness</th><th>Total Commitments</th><th>Closed</th><th>At Risk</th><th>Open</th><th>Closure Rate</th>
        </tr></thead>
        <tbody>
          ${data.byWitness.map(r => `<tr ${parseFloat(r.rate) < 60 ? 'class="at-risk"' : ''}>
            <td>${escHtml(r.witness)}</td>
            <td>${r.total}</td>
            <td>${r.closed}</td>
            <td style="${r.atRisk > 0 ? 'color:var(--burgundy);font-weight:500;' : ''}">${r.atRisk}</td>
            <td>${r.total - r.closed}</td>
            <td><span class="spill spill-${parseFloat(r.rate) === 100 ? 'filed' : parseFloat(r.rate) < 60 ? 'risk' : 'open'}">${r.rate}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    `;
  } else if (key === 'risk') {
    container.innerHTML = `
      <div class="report-section-title">Risk Register</div>
      <div class="report-meta">Generated: May 27, 2026 · PUC Docket 25-1142 · Prepared by: S. Anderson</div>
      <div class="report-body">
        <p>The following risks have been identified as requiring management attention in the current reporting period.</p>
        <h4>High Priority Risks</h4>
        <p><strong>Rebuttal Testimony Deadline (June 17, 2026).</strong> Three rebuttal sections (REB-03, REB-05, REB-07) are not yet substantially complete. REB-03 (D. Patel, cost of capital) is 35% complete. REB-05 and REB-07 have not been started. Failure to timely file rebuttal testimony could result in witness exclusion or adverse Commission inference. Immediate escalation to witness team required.</p>
        <p><strong>At-Risk Commitments — May/June Deadlines.</strong> Four commitments are flagged at-risk: RC-0043 (May 15), RC-0046 (May 30), RC-0049 (June 1), and a capital structure sensitivity analysis. Failure to satisfy these commitments could result in Commission sanctions or adverse findings in the final order.</p>
        <h4>Medium Priority Risks</h4>
        <p><strong>AG Expert Cost of Capital Challenge.</strong> Dr. Morse's proposed WACC of 6.92% is 92 basis points below the Company's 7.84% proposal. If the Commission adopts Dr. Morse's figure, the revenue requirement reduction would be approximately $18.4M annually. Rebuttal testimony (REB-03) must comprehensively address each point of divergence.</p>
        <p><strong>Discovery Response Volume — NYPSC.</strong> Thirty-one open discovery requests in the New York proceeding represent elevated workload risk given the June 3 direct testimony deadline. Counsel should confirm staffing adequacy.</p>
        <h4>Low Priority Risks</h4>
        <p><strong>California Discovery Phase.</strong> Nine open requests in CPUC A.25-04-008 are progressing normally. No near-term deadline concerns. Monitor for acceleration of Commission schedule.</p>
      </div>
    `;
  }
}

/* ── Modal Openers ──────────────────────────────────────────── */
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('open');
}

window.closeAllModals = function() {
  document.querySelectorAll('.modal-overlay.open').forEach(el => el.classList.remove('open'));
};

// Legacy alias
window.closeModal = window.closeAllModals;

function openCommitmentModal(c) {
  const status = commitmentStatuses[c.id] || c.status;
  const el = id => document.getElementById(id);

  const textStr = c.text || c.commitment || '';
  if (el('cmod-commitment')) el('cmod-commitment').textContent = textStr.substring(0, 80) + (textStr.length > 80 ? '…' : '');
  if (el('cmod-docket'))     el('cmod-docket').textContent     = c.source || c.docket || '';
  if (el('cmod-category'))   el('cmod-category').textContent   = c.cite   || c.category || '';
  if (el('cmod-due'))        el('cmod-due').textContent        = c.due    || c.dueDate  || '';
  if (el('cmod-responsible')) el('cmod-responsible').textContent = c.witness || c.responsible || '';

  // Description / context
  const desc = c.context || c.description || textStr;
  if (el('cmod-description')) el('cmod-description').textContent = desc;

  // Status pill
  const pill = el('cmod-status-pill');
  if (pill) { pill.className = 'spill spill-' + commitStatusClass(status); pill.textContent = status; }

  // Status select
  const sel = el('cmod-status-select');
  if (sel) sel.value = status.replace('At-Risk','At Risk');

  // Store ID
  const modal = el('commitment-modal');
  if (modal) modal.dataset.commitId = c.id;

  openModal('commitment-modal-overlay');
}

function updateCommitmentStatus() {
  const modal = document.getElementById('commitment-modal');
  if (!modal) return;
  const id  = modal.dataset.commitId;
  const sel = document.getElementById('cmod-status-select');
  if (!id || !sel) return;
  const newStatus = sel.value;
  commitmentStatuses[id] = newStatus;

  const pill = document.getElementById('cmod-status-pill');
  if (pill) { pill.className = 'spill spill-' + commitStatusClass(newStatus); pill.textContent = newStatus; }

  if (currentSection === 'commitments') renderCommitments();
  if (currentSection === 'active')      renderInnerCommitments();

  closeAllModals();
  pushActivity(`Commitment status updated to <strong>${escHtml(newStatus)}</strong>`, 'navy');
}

function openDRModal(dr) {
  const submitted = submittedDRs.has(dr.id);
  const status    = submitted ? 'Internal Review' : (dr.status || 'Open');

  const el = id => document.getElementById(id);

  if (el('drmod-id'))       el('drmod-id').textContent       = dr.id;
  if (el('drmod-party'))    el('drmod-party').textContent    = dr.party || dr.propoundingParty || '';
  if (el('drmod-due'))      el('drmod-due').textContent      = dr.due || dr.dueDate || '';

  const statusEl = el('drmod-status');
  if (statusEl) { statusEl.className = 'spill spill-' + drStatusClass(status); statusEl.textContent = status; }

  const qEl = el('drmod-question');
  if (qEl) qEl.textContent = dr.question || '';

  const rEl = el('drmod-response');
  if (rEl) rEl.textContent = dr.draftResponse || dr.aiDraft || '';

  // Workpapers
  const wpList = el('drmod-workpapers');
  if (wpList) {
    const wps = dr.workpapers || [];
    wpList.innerHTML = wps.map(wp => `
      <li>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        ${escHtml(wp)}
      </li>
    `).join('');
  }

  // Submit button
  const submitBtn = el('dr-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = submitted;
    submitBtn.style.opacity = submitted ? '0.6' : '';
    submitBtn.textContent = submitted ? '✓ Submitted' : 'Submit for Internal Review';
    submitBtn.dataset.drId = dr.id;
  }

  openModal('dr-modal-overlay');
}

function submitDRResponse() {
  const btn = document.getElementById('dr-submit-btn');
  if (!btn) return;
  const drId = btn.dataset.drId;
  if (!drId) return;

  submittedDRs.add(drId);
  btn.textContent = '✓ Submitted';
  btn.disabled = true;
  btn.style.opacity = '0.6';

  const statusEl = document.getElementById('drmod-status');
  if (statusEl) { statusEl.className = 'spill spill-review'; statusEl.textContent = 'Internal Review'; }

  if (currentSection === 'discovery') renderDiscovery();
  if (currentSection === 'active')    renderInnerDiscovery();

  pushActivity(`DR <strong>${escHtml(drId)}</strong> submitted for internal review`, 'green');
  closeAllModals();
}

function openWitnessModal(w) {
  const el = id => document.getElementById(id);
  if (el('wmod-avatar')) el('wmod-avatar').textContent = w.initials;
  if (el('wmod-name'))   el('wmod-name').textContent   = w.name;
  if (el('wmod-title'))  el('wmod-title').textContent  = w.title;

  const typeEl = el('wmod-type');
  if (typeEl) { typeEl.className = 'spill spill-open'; typeEl.textContent = 'Company Witness'; }

  if (el('wmod-bio')) el('wmod-bio').textContent = w.qualifications || '';

  // Credentials list — compose from qualifications sentences
  const credList = el('wmod-credentials');
  if (credList) {
    const creds = w.qualifications ? w.qualifications.split('. ').filter(s => s.trim().length > 10).slice(0,4) : [];
    credList.innerHTML = creds.map(cr => `<li>${escHtml(cr.trim())}.</li>`).join('');
  }

  // Testimony sections
  const sectList = el('wmod-sections');
  if (sectList) {
    sectList.innerHTML = (w.testimony || []).map(ts => `
      <div class="testimony-section-row" style="cursor:pointer;" data-tsid="${ts.section}">
        <div class="ts-code">${escHtml(ts.section)}</div>
        <div class="ts-title">${escHtml(ts.title)}</div>
        <div class="ts-progress-wrap">
          <div class="ts-progress-bar"><div class="ts-progress-fill ${ts.pct<40?'risk':''}" style="width:${ts.pct}%"></div></div>
          <div class="ts-pct">${ts.pct}%</div>
        </div>
        <span class="spill spill-${ts.pct===100?'filed':ts.pct<40?'risk':'open'}">${escHtml(ts.status)}</span>
      </div>
    `).join('');
    sectList.querySelectorAll('.testimony-section-row').forEach(row => {
      row.addEventListener('click', () => {
        const ts = (w.testimony || []).find(s => s.section === row.dataset.tsid);
        if (ts) { closeAllModals(); openTestimonyModal(w, ts); }
      });
    });
  }

  openModal('witness-modal-overlay');
}

function openTestimonyModal(w, ts) {
  const el = id => document.getElementById(id);

  const sectionLabel = ts.section + ' — ' + ts.title;
  if (el('tmod-section'))  el('tmod-section').textContent  = sectionLabel;
  if (el('tmod-witness'))  el('tmod-witness').textContent  = w.name;

  const statEl = el('tmod-status');
  if (statEl) { statEl.className = 'spill spill-' + (ts.pct===100?'filed':ts.pct<40?'risk':'open'); statEl.textContent = ts.pct + '% complete'; }

  // Draft content from TESTIMONY_DRAFTS if available
  const draftData = TESTIMONY_DRAFTS[ts.section];
  const draftText = draftData ? draftData.content : '[No draft yet — AI drafting in progress for this section]';
  if (el('tmod-draft')) el('tmod-draft').textContent = draftText;

  openModal('testimony-modal-overlay');
}

// Called from testimony table rows in HTML
window.openTestimonyDirect = function(sectionId) {
  const draftData = TESTIMONY_DRAFTS[sectionId];
  if (!draftData) return;
  const el = id => document.getElementById(id);

  if (el('tmod-section'))  el('tmod-section').textContent  = sectionId + ' — ' + draftData.title;
  if (el('tmod-witness'))  el('tmod-witness').textContent  = draftData.witness;

  const pct = draftData.status === 'Filed' ? 100 : draftData.status === 'In Draft' ? 35 : 5;
  const statEl = el('tmod-status');
  if (statEl) { statEl.className = 'spill spill-' + (pct===100?'filed':pct<40?'risk':'open'); statEl.textContent = escHtml(draftData.status); }

  if (el('tmod-draft')) el('tmod-draft').textContent = draftData.content;

  openModal('testimony-modal-overlay');
};

function openFilingModal(ev) {
  const el = id => document.getElementById(id);
  if (el('fmod-title'))       el('fmod-title').textContent       = ev.label || ev.title || '';
  if (el('fmod-date'))        el('fmod-date').textContent        = formatDate(ev.date);
  if (el('fmod-proc'))        el('fmod-proc').textContent        = ev.proc ? ev.proc.toUpperCase() + ' Proceeding' : '';
  if (el('fmod-type'))        el('fmod-type').textContent        = ev.detail ? ev.detail.split('.')[0] : 'Filing Deadline';
  if (el('fmod-description')) el('fmod-description').textContent = ev.detail || '';

  const typePill = el('fmod-type-pill');
  if (typePill) {
    const procClass = { tx: 'hearing', ny: 'open', ca: 'filed', mt: 'pending' };
    typePill.className = 'spill spill-' + (procClass[ev.proc] || 'open');
    typePill.textContent = ev.proc ? ev.proc.toUpperCase() : '';
  }

  openModal('filing-modal-overlay');
}

/* ── Activity Log ───────────────────────────────────────────── */
function pushActivity(text, type) {
  const log = document.getElementById('activity-log');
  if (!log) return;

  const now = new Date();
  const timeStr = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');

  const li = document.createElement('li');
  li.className = 'activity-item';
  li.innerHTML = `
    <div class="activity-time">${timeStr}</div>
    <div class="activity-icon ${type}">${getActivityIconSvg(type)}</div>
    <div class="activity-text">${text}</div>
  `;
  log.insertBefore(li, log.firstChild);
  while (log.children.length > 20) log.removeChild(log.lastChild);
}

function getActivityIconSvg(type) {
  if (type === 'green') return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
  if (type === 'red')   return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>`;
  if (type === 'amber') return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
}

/* ── Autonomous Behaviors ───────────────────────────────────── */
function startAutonomousBehaviors() {
  // Seed initial activity log
  const log = document.getElementById('activity-log');
  if (log) {
    ACTIVITY_EVENTS.slice(0, 7).forEach((text, i) => {
      const minsAgo = (7 - i) * 6;
      const t = new Date(Date.now() - minsAgo * 60000);
      const timeStr = String(t.getHours()).padStart(2,'0') + ':' + String(t.getMinutes()).padStart(2,'0');
      const types = ['green','navy','amber','green','navy','red','green'];
      const li = document.createElement('li');
      li.className = 'activity-item';
      li.innerHTML = `
        <div class="activity-time">${timeStr}</div>
        <div class="activity-icon ${types[i]}">${getActivityIconSvg(types[i])}</div>
        <div class="activity-text">${escHtml(text)}</div>
      `;
      log.appendChild(li);
    });
  }

  // Auto-push activity every 20s
  setInterval(() => {
    const ev = ACTIVITY_EVENTS[activityIndex % ACTIVITY_EVENTS.length];
    activityIndex++;
    const types = ['green','navy','amber','green','red','navy','amber','green'];
    const type = types[activityIndex % types.length];
    pushActivity(escHtml(ev), type);
  }, 20000);

  // Live countdown every 1s
  const TARGET = new Date('2026-11-18T00:00:00');
  updateCountdown(TARGET);
  setInterval(() => updateCountdown(TARGET), 1000);

  // Auto-DR every 45s
  setInterval(() => addAutoDraftedDR(), 45000);
}

function updateCountdown(target) {
  const diff = target - new Date();
  if (diff <= 0) {
    ['metric-countdown','nav-countdown','topbar-countdown-val'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = 'Deadline passed';
    });
    return;
  }
  const days    = Math.floor(diff / 86400000);
  const hours   = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000)  / 60000);
  const seconds = Math.floor((diff % 60000)    / 1000);

  const longStr  = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  const shortStr = `${days}d ${hours}h ${minutes}m`;

  const metricEl = document.getElementById('metric-countdown');
  const navEl    = document.getElementById('nav-countdown');
  const topbarEl = document.getElementById('topbar-countdown-val');

  if (metricEl) metricEl.textContent = longStr;
  if (navEl)    navEl.textContent    = shortStr + ' to final order';
  if (topbarEl) topbarEl.textContent = shortStr + ' · Nov 18, 2026';
}

window.addAutoDraftedDR = function() {
  autoDrCounter++;
  const newDR = {
    id: `MP-DR-${autoDrCounter}`,
    question: `Please describe all costs associated with the proposed infrastructure modernization program allocated to the residential rate class, including any capital expenditures deferred from prior test years and the basis for the deferral decisions.`,
    party: 'Staff',
    assigned: 'R. Brennan',
    due: 'Jun 30, 2026',
    status: 'Drafting',
    dueRisk: false,
    draftResponse: `The Company responds as follows:\n\nAll costs associated with the infrastructure modernization program allocated to the residential rate class are detailed in Exhibit MP-4, Schedule 14. Capital expenditures totaling $47.2 million were incurred during the test year ended December 31, 2025. No amounts were deferred from prior test years without Commission-approved justification.\n\n[Draft generated by AI agent — awaiting R. Brennan review]`,
    workpapers: ['Exhibit MP-4, Sch. 14 (pending)', 'Capital Budget Summary FY2025'],
    autoDrafted: true
  };

  DISCOVERY_REQUESTS.unshift(newDR);
  if (currentSection === 'discovery') renderDiscovery();
  if (currentSection === 'active')    renderInnerDiscovery();

  pushActivity(`AI auto-drafted response to <strong>${escHtml(newDR.id)}</strong> — Staff interrogatory re: infrastructure modernization costs`, 'green');
};

/* ── Helpers ────────────────────────────────────────────────── */
function escHtml(str) {
  return String(str || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
}
