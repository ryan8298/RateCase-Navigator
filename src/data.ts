export type DRStatus = 'Intake' | 'Classifying' | 'Drafting' | 'In Review' | 'Filed';
export type AlertLevel = 'info' | 'warn' | 'risk';

export interface DR {
  id: string;
  intervener: string;
  topic: string;
  assignedTo: string;
  daysUntilDue: number | 'OVERDUE';
  status: DRStatus;
  confidence: number;
  priority: 'High' | 'Medium' | 'Low';
  drText: string;
  draftResponse: string;
  relatedDocs: { name: string; type: string }[];
  commitments: string[];
  notes: string;
}

export const TEAM_MEMBERS = ['Sarah Chen', 'Marcus Webb', 'Dana Torres', 'James Park', 'Priya Nair', 'Tom Beckett'];

export const initialDRs: DR[] = [
  {
    id: 'AG-DR-0089',
    intervener: 'Attorney General',
    topic: 'Cost of Capital',
    assignedTo: 'Sarah Chen',
    daysUntilDue: 2,
    status: 'Drafting',
    confidence: 78,
    priority: 'High',
    drText: 'Please provide all workpapers supporting the utility\'s proposed 10.2% return on equity, including the CAPM analysis, DCF analysis, and comparable earnings studies. Identify each witness who prepared or reviewed this material.',
    draftResponse: 'Mountainside Power & Light responds as follows:\n\nThe requested workpapers supporting the proposed 10.2% return on equity are attached as Exhibits SC-D-2 through SC-D-7. The CAPM analysis (Exhibit SC-D-2) utilizes a risk-free rate of 4.15% based on 30-year U.S. Treasury yields averaged over the 52-week period ending December 31, 2025.\n\nThe following witnesses prepared or reviewed this material:\n• Dr. Emily Hartley, Expert Witness (Cost of Capital)\n• Sarah Chen, Director of Regulatory Finance\n• Finance Team (WACC calculation review, pending)',
    relatedDocs: [
      { name: 'Exhibit SC-D-2: CAPM Analysis', type: 'xlsx' },
      { name: 'Exhibit SC-D-3: DCF Analysis', type: 'xlsx' },
      { name: '2022 Rate Case Cost of Capital Testimony', type: 'pdf' },
      { name: 'ALJ Ruling 25-0892-RC — Cost of Capital Benchmark', type: 'pdf' },
    ],
    commitments: ['Sarah Chen to revise Schedule D-2 by Thursday', 'Finance team to provide updated WACC by Friday'],
    notes: 'AG used near-identical questioning in 2022. Pattern Detection Agent flagged 8-exhibit reuse package from Docket 22-0418-RC.',
  },
  {
    id: 'ICC-DR-0034',
    intervener: 'Industrial Customers Coalition',
    topic: 'Demand Forecast',
    assignedTo: 'Marcus Webb',
    daysUntilDue: 5,
    status: 'In Review',
    confidence: 92,
    priority: 'Medium',
    drText: 'Provide the underlying load forecast model used to support the test year demand projections, including all input assumptions for large industrial customer load growth.',
    draftResponse: 'Mountainside Power & Light provides the requested demand forecast model documentation in the attached Exhibit LF-1.\n\nThe 10-year load forecast utilizes a hybrid econometric-end-use methodology with the following key assumptions:\n• Base year: 2025 actual consumption\n• Industrial growth rate: 1.8% CAGR (three new data center commitments included)\n• Residential growth: 0.9% CAGR, consistent with census projections\n\nAll underlying model files are provided in Exhibit LF-2.',
    relatedDocs: [
      { name: 'Exhibit LF-1: Load Forecast Model', type: 'xlsx' },
      { name: 'Exhibit LF-2: Industrial Customer Survey', type: 'pdf' },
      { name: 'Econometric Model Documentation v3.2', type: 'pdf' },
    ],
    commitments: ['Marcus Webb to verify Q4 industrial load actuals by EOD Thursday'],
    notes: 'Response substantially complete. Awaiting final Q4 actuals verification from Marcus.',
  },
  {
    id: 'SC-DR-0012',
    intervener: 'Sierra Club',
    topic: 'Wildfire Mitigation Recovery',
    assignedTo: 'Dana Torres',
    daysUntilDue: 'OVERDUE',
    status: 'Drafting',
    confidence: 45,
    priority: 'High',
    drText: 'Provide documentation of all wildfire mitigation expenditures included in the rate base request, including the prudency review process, independent audit results, and comparison to peer utility programs.',
    draftResponse: '*** DRAFT IN PROGRESS — AWAITING SME INPUT ***\n\nMountainside Power & Light responds as follows:\n\nWildfire mitigation expenditures included in the rate base total $284.7M for the test year period. These expenditures were reviewed by [INDEPENDENT AUDITOR — TO BE CONFIRMED BY DANA] and found to be prudently incurred.\n\nPrudency documentation is attached as Exhibit WM-1 through WM-4.\n\n[ENGINEERING OPS: please provide cost breakdown by program category by Thursday]',
    relatedDocs: [
      { name: '2024 Wildfire Mitigation Plan (Board-Approved)', type: 'pdf' },
      { name: 'CPUC Precedent: SCE Wildfire Recovery (2024)', type: 'pdf' },
      { name: 'Internal Counsel Memo — Prudency Standard', type: 'doc' },
    ],
    commitments: ['Legal to review Sierra Club position by Monday', 'Engineering to provide WMP cost breakdown by Thursday', 'Dana Torres to approve SC extension request letter'],
    notes: 'OVERDUE 2 days. Extension request letter drafted by Deadline Risk Agent — awaiting Dana Torres approval in D365 RC-2841.',
  },
  {
    id: 'PUC-DR-0156',
    intervener: 'PUC Staff',
    topic: 'Rate Base',
    assignedTo: 'James Park',
    daysUntilDue: 8,
    status: 'Drafting',
    confidence: 65,
    priority: 'High',
    drText: 'Identify all plant additions included in the proposed rate base that were not included in the prior rate case (Docket 22-0418-RC) and provide the project authorization documentation for each addition.',
    draftResponse: 'MPL identifies the following major plant additions included in the proposed rate base not previously included in Docket 22-0418-RC:\n\n1. Substation 7 Upgrade — $47.2M (Board Resolution 2023-14)\n2. Grid Modernization Phase II — $112.4M (Board Resolution 2024-02)\n3. EV Infrastructure Program — $23.8M (Commission Order 24-0332)\n4. Wildfire Hardening — Segments A–D — $76.1M (Board Resolution 2024-07)\n\nProject authorization documentation is attached as Exhibit RB-4 through RB-8.',
    relatedDocs: [
      { name: 'Rate Base Schedule A-1', type: 'xlsx' },
      { name: 'Capital Project Authorizations 2023–2025', type: 'pdf' },
      { name: 'Plant Addition Rollforward Workpaper', type: 'xlsx' },
    ],
    commitments: ['James Park to reconcile plant additions with accounting records by Friday'],
    notes: 'Response 65% complete. Rate base schedule reconciliation pending.',
  },
  {
    id: 'ICC-DR-0041',
    intervener: 'Industrial Customers Coalition',
    topic: 'Rate Design',
    assignedTo: 'Sarah Chen',
    daysUntilDue: 6,
    status: 'In Review',
    confidence: 81,
    priority: 'Medium',
    drText: 'Provide the cost allocation study supporting the proposed industrial rate class revenue requirement, including all cross-subsidization analysis.',
    draftResponse: 'The cost of service study supporting the industrial rate class revenue allocation is provided in Exhibit RD-3. The study uses the Average and Excess methodology approved by the Commission in Order 22-147.\n\nCross-subsidization analysis is provided in Exhibit RD-4, demonstrating that the proposed industrial rate class revenue requirement represents 24.3% of total revenue, consistent with embedded cost responsibility.',
    relatedDocs: [
      { name: 'Exhibit RD-3: Cost Allocation Study', type: 'xlsx' },
      { name: 'Exhibit RD-4: Cross-Subsidization Analysis', type: 'pdf' },
      { name: 'Commission Order 22-147', type: 'pdf' },
    ],
    commitments: ['Rate design team to validate cross-subsidy calculation'],
    notes: '',
  },
  {
    id: 'AG-DR-0094',
    intervener: 'Attorney General',
    topic: 'Executive Compensation',
    assignedTo: 'Dana Torres',
    daysUntilDue: 3,
    status: 'Drafting',
    confidence: 70,
    priority: 'High',
    drText: 'Provide all executive compensation data included in O&M expenses, including bonus structures and incentive plan details, for the three most recent fiscal years.',
    draftResponse: 'MPL provides the following executive compensation data for fiscal years 2023, 2024, and 2025.\n\nTotal executive compensation included in O&M expense:\n• FY2023: $4.2M (8 executives)\n• FY2024: $4.6M (8 executives)\n• FY2025: $5.1M (9 executives — CEO succession)\n\nDetailed compensation tables are attached as Exhibit EC-1 through EC-3.\n\n[HR: please confirm incentive plan documentation — requested Wed May 27]',
    relatedDocs: [
      { name: 'Proxy Statement FY2025', type: 'pdf' },
      { name: 'HR Compensation Policy Document', type: 'pdf' },
      { name: 'O&M Expense Workpapers — EC Line Items', type: 'xlsx' },
    ],
    commitments: ['HR to provide updated compensation tables by Wednesday'],
    notes: 'Confidence at 70% — HR data still pending. Deadline Risk Agent flagged for escalation.',
  },
  {
    id: 'WALMART-DR-0007',
    intervener: 'Walmart Stores',
    topic: 'Demand Charges',
    assignedTo: 'Marcus Webb',
    daysUntilDue: 11,
    status: 'In Review',
    confidence: 88,
    priority: 'Medium',
    drText: 'Provide the cost justification for the proposed 12% increase in demand charges for the Large Commercial rate class, with specific analysis of load contribution at system peak.',
    draftResponse: 'MPL provides the following cost justification for the proposed demand charge increase for the Large Commercial rate class.\n\nThe 12% increase reflects updated cost-of-service analysis showing that Large Commercial customers contribute 31.4% of system peak demand, up from 28.6% in the prior rate case. The demand charge methodology is consistent with Commission precedent in Order 22-147.\n\nLoad research study documentation is attached as Exhibit RC-7.',
    relatedDocs: [
      { name: 'Load Research Study 2025', type: 'xlsx' },
      { name: 'Exhibit RC-7: Demand Charge Analysis', type: 'pdf' },
    ],
    commitments: [],
    notes: '',
  },
  {
    id: 'SC-DR-0018',
    intervener: 'Sierra Club',
    topic: 'Wildfire Mitigation Recovery',
    assignedTo: 'Dana Torres',
    daysUntilDue: 14,
    status: 'Filed',
    confidence: 97,
    priority: 'Low',
    drText: 'Identify all vegetation management costs included in the wildfire mitigation program for the three-year period 2022–2024.',
    draftResponse: 'Filed March 15, 2026. Vegetation management costs total $47.8M for 2022–2024. Full response in Case Management System CM-2026-0315-001.',
    relatedDocs: [
      { name: 'Vegetation Management Cost Report 2022–2024', type: 'pdf' },
      { name: 'Exhibit WM-2: Veg Management Detail', type: 'xlsx' },
    ],
    commitments: [],
    notes: 'Filed. No further action required.',
  },
  {
    id: 'PUC-DR-0163',
    intervener: 'PUC Staff',
    topic: 'Depreciation',
    assignedTo: 'James Park',
    daysUntilDue: 9,
    status: 'Drafting',
    confidence: 59,
    priority: 'Medium',
    drText: 'Provide the depreciation study supporting all proposed depreciation rates, including the assumptions regarding remaining service life for transmission infrastructure.',
    draftResponse: 'The depreciation study is provided in Exhibit D-1, prepared by Pacific Economics Group.\n\nKey transmission infrastructure assumptions:\n• 230kV transmission lines: 35-year remaining service life (up from 2.8% to 3.1% depreciation rate — see Note 4)\n• Substation equipment: 28-year remaining service life\n• Distribution infrastructure: 38-year weighted average\n\n[Engineering: please confirm T-line remaining life estimates — flagged by Lattice Pattern Detection Agent]',
    relatedDocs: [
      { name: 'Exhibit D-1: Depreciation Study', type: 'pdf' },
      { name: 'Transmission Asset Age Analysis', type: 'xlsx' },
    ],
    commitments: ['Engineering to confirm T-line remaining life estimates'],
    notes: 'Depreciation rate change from 2.8% to 3.1% flagged by Pattern Detection Agent — explanation needed.',
  },
  {
    id: 'ICC-DR-0048',
    intervener: 'Industrial Customers Coalition',
    topic: 'O&M Expenses',
    assignedTo: 'Marcus Webb',
    daysUntilDue: 7,
    status: 'Drafting',
    confidence: 72,
    priority: 'Medium',
    drText: 'Identify all O&M expense increases from the prior rate case and provide justification for each, including inflation adjustments and new program costs.',
    draftResponse: 'MPL identifies the following O&M expense increases from Docket 22-0418-RC:\n\n1. Inflation adjustment: +$12.4M (CPI-based, 2022–2026)\n2. Wildfire Mitigation Program: +$28.7M (new program, Board-authorized)\n3. Cybersecurity Program: +$6.2M (NERC CIP compliance)\n4. Customer Technology Initiative: +$4.8M (AMI maintenance)\n\nNormalized O&M actuals are provided in Exhibit OM-1.\n\n[Finance: please provide normalized O&M actuals — requested Tue]',
    relatedDocs: [
      { name: 'O&M Expense Comparison 2022–2026', type: 'xlsx' },
      { name: 'Exhibit OM-1: O&M Workpapers', type: 'xlsx' },
    ],
    commitments: ['Finance to provide normalized O&M actuals by Tuesday'],
    notes: '',
  },
  {
    id: 'AG-DR-0101',
    intervener: 'Attorney General',
    topic: 'Affiliated Transactions',
    assignedTo: 'Sarah Chen',
    daysUntilDue: 13,
    status: 'Filed',
    confidence: 100,
    priority: 'Low',
    drText: 'Provide all affiliated transaction reports filed with the PUC for calendar years 2023–2025.',
    draftResponse: 'Filed April 2, 2026. All affiliated transaction reports publicly available on PUC docket system. Case Management System CM-2026-0402-003.',
    relatedDocs: [
      { name: 'AT Reports 2023–2025 (PUC Docket)', type: 'pdf' },
    ],
    commitments: [],
    notes: 'Filed. No further action required.',
  },
  {
    id: 'WALMART-DR-0011',
    intervener: 'Walmart Stores',
    topic: 'Rate Design',
    assignedTo: 'James Park',
    daysUntilDue: 4,
    status: 'In Review',
    confidence: 83,
    priority: 'Medium',
    drText: 'Provide the revenue requirement allocation methodology used to determine the Large Commercial class rate increase, with comparison to residential class treatment.',
    draftResponse: 'MPL responds that the revenue requirement allocation follows the embedded cost of service methodology approved by the Commission in Order 22-147.\n\nLarge Commercial allocation: 24.3% of total revenue requirement\nResidential allocation: 41.8% of total revenue requirement\n\nThe differential reflects updated cost-of-service analysis. Full documentation in Exhibit RD-1 through RD-3.\n\n[Legal: confirm Commission Order citation before filing]',
    relatedDocs: [
      { name: 'Exhibit RD-1: Revenue Allocation', type: 'pdf' },
      { name: 'Commission Order No. 22-147', type: 'pdf' },
    ],
    commitments: ['Legal to confirm Commission order citation'],
    notes: '',
  },
];

export interface AgentCard {
  id: string;
  name: string;
  icon: string;
  tags: string[];
  time: string;
  message: string;
  level: AlertLevel;
  actionLabel?: string;
  actionDRId?: string;
}

export const initialAgents: AgentCard[] = [
  {
    id: 'ag1',
    name: 'Discovery Triage Agent',
    icon: '🔍',
    tags: ['document-intelligence', 'semantic-search'],
    time: '09:14:22',
    level: 'info',
    message: 'AG-DR-0089 received from Attorney General at 09:14. Classified as Cost of Capital — Schedule D evidence. Assigned to Sarah Chen based on topic ownership map.\n\nRelated precedent filings from 2022 rate case auto-attached (3 documents). Estimated drafting time saved: 14 hours.',
  },
  {
    id: 'ag2',
    name: 'Commitment Capture Agent',
    icon: '📋',
    tags: ['audit-stream', 'state-sync'],
    time: '09:14:47',
    level: 'info',
    message: 'Teams meeting transcript ingested: Regulatory Strategy Sync (08:30). Detected 4 commitments:\n• Sarah Chen → revise Schedule D-2 by Thursday\n• Finance team → updated WACC by Friday\n• Legal → review Sierra Club position by Monday\n• VP Regulatory → brief CEO before Wednesday board call\n\nAll logged to D365 with owners and deadlines.',
  },
  {
    id: 'ag3',
    name: 'Pattern Detection Agent',
    icon: '🧠',
    tags: ['consensus-voting'],
    time: '09:15:03',
    level: 'info',
    message: 'Cross-referenced AG-DR-0089 with last rate case (Docket 22-0418-RC). Attorney General used near-identical Cost of Capital questioning.\n\nRecommended evidence package from 2022 response (8 exhibits) queued for Sarah Chen review.',
  },
  {
    id: 'ag4',
    name: 'Deadline Risk Agent',
    icon: '⚠️',
    tags: ['workflow-orchestration', 'agent-dispatch'],
    time: '09:15:11',
    level: 'risk',
    message: 'RISK: SC-DR-0012 overdue by 2 business days. Sierra Club not yet notified of delay. PUC Rule 4.3 requires notice within 5 business days.\n\nExtension request letter drafted — awaiting Dana Torres approval (D365 RC-2841).',
    actionLabel: 'Approve Extension',
    actionDRId: 'SC-DR-0012',
  },
  {
    id: 'ag5',
    name: 'Deadline Risk Agent',
    icon: '⚠️',
    tags: ['workflow-orchestration', 'agent-dispatch'],
    time: '09:23:42',
    level: 'warn',
    message: 'AG-DR-0094 (Executive Compensation) due in 3 days. Confidence at 70% — below 80% threshold. Dana Torres notified via Teams.\n\nPriority escalation to VP Regulatory recommended to unblock HR data delivery.',
    actionLabel: 'Escalate',
    actionDRId: 'AG-DR-0094',
  },
];

export const liveAgentFeed: AgentCard[] = [
  {
    id: 'live1',
    name: 'Discovery Triage Agent',
    icon: '🔍',
    tags: ['document-intelligence', 'semantic-search'],
    time: '09:17:34',
    level: 'info',
    message: 'ICC-DR-0048 received from Industrial Customers Coalition. Classified as O&M Expenses. Assigned to Marcus Webb. 2 prior responses on same topic auto-linked from AI Search.',
  },
  {
    id: 'live2',
    name: 'Commitment Capture Agent',
    icon: '📋',
    tags: ['audit-stream', 'state-sync'],
    time: '09:19:08',
    level: 'info',
    message: 'Email thread "RE: Rate Base Reconciliation" detected. Commitment extracted: James Park confirmed rate base schedule delivery to PUC Staff by Monday. Logged as D365 RC-2849.',
  },
  {
    id: 'live3',
    name: 'Pattern Detection Agent',
    icon: '🧠',
    tags: ['consensus-voting'],
    time: '09:21:15',
    level: 'info',
    message: 'PUC Staff ALJ ruling ingested (Docket 25-0892-RC). 4.15% risk-free rate referenced — consistent with MPL\'s AG-DR-0089 position. Sent to Sarah Chen\'s SharePoint as supportive precedent.',
  },
  {
    id: 'live4',
    name: 'Pattern Detection Agent',
    icon: '🧠',
    tags: ['consensus-voting', 'docket-watch'],
    time: '09:25:18',
    level: 'info',
    message: 'New ALJ ruling ingested: Docket 25-0892-RC — PUC Staff cost-of-capital benchmark set at 4.15% risk-free rate. Directly supports MPL position in AG-DR-0089. Added to Sarah Chen’s SharePoint evidence queue.',
  },
];

export interface AuditEntry { ts: string; msg: string; hash?: string; }
export const auditLog: AuditEntry[] = [
  { ts: '09:14:22', msg: 'AG-DR-0089 received via email (Outlook trigger)' },
  { ts: '09:14:23', msg: 'Discovery Triage Agent: topic classified — Cost of Capital (confidence 94%)' },
  { ts: '09:14:23', msg: 'Assigned to Sarah Chen via D365 task RC-2846' },
  { ts: '09:14:24', msg: 'Pattern Detection Agent: 2022 precedent (Docket 22-0418-RC) identified — 8 exhibits' },
  { ts: '09:14:25', msg: 'Sarah Chen notified via Teams (Regulatory Affairs channel)', hash: '7f3a8b2c...' },
  { ts: '09:14:25', msg: 'Related documents indexed in AI Search — 3 documents, 47 chunks' },
  { ts: '09:14:26', msg: 'Audit hash computed: 7f3a8b2cd4e19a83f5c6012b9e4d7821 (Purview verified)', hash: '7f3a8b2c...' },
  { ts: '09:14:26', msg: 'Filing record updated in SharePoint: /Rate Cases/2026-RC/Discovery/AG/' },
  { ts: '09:14:26', msg: 'D365 deadline set: May 29, 2026 17:00 CT' },
  { ts: '09:14:47', msg: 'Teams transcript ingested: "Regulatory Strategy Sync" (08:30)' },
  { ts: '09:14:48', msg: 'Commitment Capture Agent: 4 commitments extracted' },
  { ts: '09:14:49', msg: 'D365 tasks created: RC-2847, RC-2848, RC-2849, RC-2850', hash: 'a4c91f3b...' },
  { ts: '09:15:03', msg: 'Pattern Detection Agent: AG-DR-0089 cross-reference complete' },
  { ts: '09:15:11', msg: 'Deadline Risk Agent: SC-DR-0012 overdue — 2 business days elapsed' },
  { ts: '09:15:12', msg: 'Extension request letter drafted: EXT-SC-0012-v1.docx' },
  { ts: '09:15:12', msg: 'Dana Torres notified: approval requested for extension letter', hash: 'b8e47f1a...' },
  { ts: '09:15:13', msg: 'Audit hash computed: b8e47f1a39c02d85f761a430e59c1847 (Purview verified)', hash: 'b8e47f1a...' },
  { ts: '09:17:34', msg: 'ICC-DR-0048 received via email (Outlook trigger)' },
  { ts: '09:17:35', msg: 'Discovery Triage Agent: topic classified — O&M Expenses (confidence 91%)' },
  { ts: '09:17:35', msg: 'Assigned to Marcus Webb via D365 task RC-2852' },
  { ts: '09:17:36', msg: 'Audit hash computed: c5d83e2f...  (Purview verified)', hash: 'c5d83e2f...' },
  { ts: '09:19:08', msg: 'Email thread detected: "RE: Rate Base Reconciliation"' },
  { ts: '09:19:09', msg: 'Commitment Capture Agent: 1 commitment extracted from email' },
  { ts: '09:19:09', msg: 'D365 task RC-2853 created: rate base reconciliation by Monday', hash: 'd2f91b4c...' },
  { ts: '09:21:15', msg: 'Regulatory intelligence: ALJ ruling ingested from PUC docket feed' },
  { ts: '09:21:16', msg: 'Pattern Detection Agent: precedent relevance confirmed for AG-DR-0089' },
  { ts: '09:23:42', msg: 'Deadline Risk Agent: AG-DR-0094 escalation triggered (confidence below threshold)' },
  { ts: '09:29:55', msg: 'SharePoint comment activity: Dana Torres — Wildfire Mitigation Cost Workpaper' },
  { ts: '09:29:56', msg: 'Commitment created: Engineering Ops response by tomorrow EOD' },
  { ts: '09:29:56', msg: 'D365 task RC-2854 created', hash: 'e7c40f2b...' },
];

export interface Commitment { id: string; desc: string; owner: string; deadline: string; source: string; lastActivity: string; taskId: string; completed: boolean; }
export const initialCommitments: Commitment[] = [
  { id: 'c1', desc: 'SC-DR-0012 extension request letter approval', owner: 'Dana Torres', deadline: 'TODAY', source: 'Meeting transcript', lastActivity: 'Mon 08:47', taskId: 'RC-2841', completed: false },
  { id: 'c2', desc: 'Wildfire mitigation cost breakdown from Engineering', owner: 'Eng. Operations', deadline: 'Tomorrow', source: 'SharePoint comment', lastActivity: 'Mon 14:22', taskId: 'RC-2854', completed: false },
  { id: 'c3', desc: 'Updated WACC calculation for AG-DR-0089', owner: 'Finance Team', deadline: 'Fri May 29', source: 'Teams meeting', lastActivity: 'Tue 09:15', taskId: 'RC-2848', completed: false },
  { id: 'c4', desc: 'HR executive compensation tables for AG-DR-0094', owner: 'HR Department', deadline: 'Wed May 27', source: 'Email thread', lastActivity: 'Mon 16:33', taskId: 'RC-2855', completed: false },
  { id: 'c5', desc: 'VP Regulatory brief to CEO before board call', owner: 'VP Regulatory', deadline: 'Wed May 27', source: 'Teams meeting', lastActivity: 'Wed 07:00', taskId: 'RC-2850', completed: false },
];
