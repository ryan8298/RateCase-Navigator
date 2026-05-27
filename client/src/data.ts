// ─── Discovery Requests ──────────────────────────────────────────────────────

export interface DR {
  id: string;
  intervener: string;
  topic: string;
  assignedTo: string;
  daysUntilDue: number | 'OVERDUE';
  status: 'Drafting' | 'In Review' | 'Filed' | 'Awaiting SME';
  confidence: number;
  drText: string;
  draftResponse: string;
  relatedDocs: string[];
  commitments: string[];
}

export const discoveryRequests: DR[] = [
  {
    id: 'AG-DR-0089',
    intervener: 'Attorney General',
    topic: 'Cost of Capital',
    assignedTo: 'Sarah Chen',
    daysUntilDue: 2,
    status: 'Drafting',
    confidence: 78,
    drText: 'Please provide all workpapers supporting the utility\'s proposed 10.2% return on equity, including the CAPM analysis, DCF analysis, and comparable earnings studies. Identify each witness who prepared or reviewed this material.',
    draftResponse: 'Mountainside Power & Light responds as follows: The requested workpapers supporting the 10.2% return on equity are attached as Exhibit SC-D-2 through SC-D-7. The CAPM analysis (Exhibit SC-D-2) utilizes a risk-free rate of 4.15% based on 30-year U.S. Treasury yields averaged over the 52-week period ending December 31, 2025...',
    relatedDocs: ['Exhibit SC-D-2: CAPM Analysis', 'Exhibit SC-D-3: DCF Analysis', '2022 Rate Case Cost of Capital Testimony (Docket 22-0418-RC)'],
    commitments: ['Sarah Chen to revise Schedule D-2 by Thursday', 'Finance to provide updated WACC by Friday'],
  },
  {
    id: 'ICC-DR-0034',
    intervener: 'Industrial Customers Coalition',
    topic: 'Demand Forecast',
    assignedTo: 'Marcus Webb',
    daysUntilDue: 5,
    status: 'In Review',
    confidence: 92,
    drText: 'Provide the underlying load forecast model used to support the test year demand projections, including all input assumptions for large industrial customer load growth.',
    draftResponse: 'Mountainside Power & Light provides the requested demand forecast model documentation in the attached Exhibit LF-1. The 10-year load forecast utilizes a hybrid econometric-end-use methodology...',
    relatedDocs: ['Exhibit LF-1: Load Forecast Model', 'Exhibit LF-2: Industrial Customer Survey', 'Econometric Model Documentation'],
    commitments: ['Marcus Webb to verify Q4 industrial load actuals by EOD Thursday'],
  },
  {
    id: 'SC-DR-0012',
    intervener: 'Sierra Club',
    topic: 'Wildfire Mitigation Recovery',
    assignedTo: 'Dana Torres',
    daysUntilDue: 'OVERDUE',
    status: 'Awaiting SME',
    confidence: 45,
    drText: 'Provide documentation of all wildfire mitigation expenditures included in the rate base request, including the prudency review process, independent audit results, and comparison to peer utility programs.',
    draftResponse: 'DRAFT IN PROGRESS — Awaiting SME input from Engineering Operations (wildfire mitigation program data) and Risk Management (prudency documentation). Estimated completion: pending SME availability.',
    relatedDocs: ['2024 Wildfire Mitigation Plan', 'Board-Approved Wildfire Budget Resolution', 'CPUC Precedent: SCE Wildfire Recovery (2024)'],
    commitments: ['Legal to review Sierra Club position by Monday', 'Engineering to provide WMP cost breakdown by Thursday'],
  },
  {
    id: 'PUC-DR-0156',
    intervener: 'PUC Staff',
    topic: 'Rate Base',
    assignedTo: 'James Park',
    daysUntilDue: 8,
    status: 'Drafting',
    confidence: 65,
    drText: 'Identify all plant additions included in the proposed rate base that were not included in the prior rate case (Docket 22-0418-RC) and provide the project authorization documentation for each.',
    draftResponse: 'MPL identifies the following plant additions included in the proposed rate base that were not included in Docket 22-0418-RC: (1) Substation 7 Upgrade — $47.2M, authorized by Board Resolution 2023-14...',
    relatedDocs: ['Rate Base Schedule A-1', 'Capital Project Authorizations 2023-2025', 'Plant Addition Rollforward Workpaper'],
    commitments: ['James Park to reconcile plant additions with accounting records by Friday'],
  },
  {
    id: 'ICC-DR-0041',
    intervener: 'Industrial Customers Coalition',
    topic: 'Rate Design',
    assignedTo: 'Sarah Chen',
    daysUntilDue: 6,
    status: 'In Review',
    confidence: 81,
    drText: 'Provide the cost allocation study supporting the proposed industrial rate class revenue requirement, including all cross-subsidization analysis.',
    draftResponse: 'The cost of service study supporting the industrial rate class revenue allocation is provided in Exhibit RD-3...',
    relatedDocs: ['Exhibit RD-3: Cost Allocation Study', 'Rate Class Comparisons 2022-2025'],
    commitments: ['Rate design team to validate cross-subsidy calculation'],
  },
  {
    id: 'AG-DR-0094',
    intervener: 'Attorney General',
    topic: 'Executive Compensation',
    assignedTo: 'Dana Torres',
    daysUntilDue: 3,
    status: 'Drafting',
    confidence: 70,
    drText: 'Provide all executive compensation data included in O&M expenses, including bonus structures and incentive plan details, for the three most recent fiscal years.',
    draftResponse: 'MPL provides the following executive compensation data for fiscal years 2023, 2024, and 2025...',
    relatedDocs: ['Proxy Statement FY2025', 'HR Compensation Policy Document', 'O&M Expense Workpapers'],
    commitments: ['HR to provide updated compensation tables by Wednesday'],
  },
  {
    id: 'WALMART-DR-0007',
    intervener: 'Walmart Stores',
    topic: 'Demand Charges',
    assignedTo: 'Marcus Webb',
    daysUntilDue: 11,
    status: 'In Review',
    confidence: 88,
    drText: 'Provide the cost justification for the proposed 12% increase in demand charges for the Large Commercial rate class, with specific analysis of load contribution at system peak.',
    draftResponse: 'MPL provides the following cost justification for the proposed demand charge increase...',
    relatedDocs: ['Load Research Study 2025', 'Exhibit RC-7: Demand Charge Analysis'],
    commitments: [],
  },
  {
    id: 'SC-DR-0018',
    intervener: 'Sierra Club',
    topic: 'Wildfire Mitigation Recovery',
    assignedTo: 'Dana Torres',
    daysUntilDue: 14,
    status: 'Filed',
    confidence: 97,
    drText: 'Identify all vegetation management costs included in the wildfire mitigation program for the three-year period 2022-2024.',
    draftResponse: 'Filed — Response submitted March 15, 2026. See Case Management System record CM-2026-0315-001.',
    relatedDocs: ['Vegetation Management Cost Report 2022-2024', 'Exhibit WM-2'],
    commitments: [],
  },
  {
    id: 'PUC-DR-0163',
    intervener: 'PUC Staff',
    topic: 'Depreciation',
    assignedTo: 'James Park',
    daysUntilDue: 9,
    status: 'Drafting',
    confidence: 59,
    drText: 'Provide the depreciation study supporting all proposed depreciation rates, including the assumptions regarding remaining service life for transmission infrastructure.',
    draftResponse: 'The depreciation study is provided in Exhibit D-1. The study was prepared by Pacific Economics Group...',
    relatedDocs: ['Exhibit D-1: Depreciation Study', 'Transmission Asset Age Analysis'],
    commitments: ['Engineering to confirm T-line remaining life estimates'],
  },
  {
    id: 'ICC-DR-0048',
    intervener: 'Industrial Customers Coalition',
    topic: 'O&M Expenses',
    assignedTo: 'Marcus Webb',
    daysUntilDue: 7,
    status: 'Drafting',
    confidence: 72,
    drText: 'Identify all O&M expense increases from the prior rate case and provide justification for each, including inflation adjustments and new program costs.',
    draftResponse: 'MPL identifies the following O&M expense increases from Docket 22-0418-RC...',
    relatedDocs: ['O&M Expense Comparison 2022-2026', 'Exhibit OM-1: O&M Workpapers'],
    commitments: ['Finance to provide normalized O&M actuals by Tuesday'],
  },
  {
    id: 'AG-DR-0101',
    intervener: 'Attorney General',
    topic: 'Affiliated Transactions',
    assignedTo: 'Sarah Chen',
    daysUntilDue: 13,
    status: 'Filed',
    confidence: 100,
    drText: 'Provide all affiliated transaction reports filed with the PUC for calendar years 2023-2025.',
    draftResponse: 'Filed — Response submitted April 2, 2026. All affiliated transaction reports are publicly available on the PUC docket system.',
    relatedDocs: ['AT Reports 2023-2025 (PUC Docket)'],
    commitments: [],
  },
  {
    id: 'WALMART-DR-0011',
    intervener: 'Walmart Stores',
    topic: 'Rate Design',
    assignedTo: 'James Park',
    daysUntilDue: 4,
    status: 'In Review',
    confidence: 83,
    drText: 'Provide the revenue requirement allocation methodology used to determine the Large Commercial class rate increase, with comparison to residential class treatment.',
    draftResponse: 'MPL responds that the revenue requirement allocation follows the embedded cost of service methodology approved by the Commission in prior proceedings...',
    relatedDocs: ['Exhibit RD-1: Revenue Allocation', 'Commission Order No. 22-147 (Prior Case)'],
    commitments: ['Legal to confirm Commission order citation'],
  },
];

// ─── Agent Activity Feed ──────────────────────────────────────────────────────

export interface AgentActivity {
  id: string;
  agentName: string;
  agentIcon: string;
  tags: string[];
  timestamp: string;
  message: string;
  alertLevel?: 'info' | 'warning' | 'risk';
}

export const initialAgentActivities: AgentActivity[] = [
  {
    id: 'a1',
    agentName: 'Discovery Triage Agent',
    agentIcon: '🔍',
    tags: ['document-intelligence', 'semantic-search'],
    timestamp: '09:14:22',
    message: 'AG-DR-0089 received from Attorney General at 09:14. Classified as Cost of Capital — Schedule D evidence. Assigned to Sarah Chen based on topic ownership map. Related precedent filings from 2022 rate case auto-attached (3 documents): CAPM Analysis, DCF Analysis, 2022 Rate Case Cost of Capital Testimony.',
    alertLevel: 'info',
  },
  {
    id: 'a2',
    agentName: 'Commitment Capture Agent',
    agentIcon: '📋',
    tags: ['audit-stream', 'state-sync'],
    timestamp: '09:14:47',
    message: 'Teams meeting transcript ingested: Regulatory Strategy Sync at 08:30. Detected 4 commitments:\n• Sarah Chen to revise Schedule D-2 by Thursday\n• Finance team to provide updated WACC by Friday\n• Legal to review Sierra Club position by next Monday\n• VP Regulatory to brief CEO before Wednesday board call\nAll committed to D365 task records with owners and deadlines.',
    alertLevel: 'info',
  },
  {
    id: 'a3',
    agentName: 'Pattern Detection Agent',
    agentIcon: '🧠',
    tags: ['consensus-voting'],
    timestamp: '09:15:03',
    message: 'Cross-referenced AG-DR-0089 with last rate case (2022, Docket 22-0418-RC). Attorney General used near-identical line of questioning on Cost of Capital. Recommended evidence package from 2022 response (8 exhibits) for reuse — saves estimated 14 hours of drafting. Package queued for Sarah Chen review.',
    alertLevel: 'info',
  },
  {
    id: 'a4',
    agentName: 'Deadline Risk Agent',
    agentIcon: '⚠️',
    tags: ['workflow-orchestration', 'agent-dispatch'],
    timestamp: '09:15:11',
    message: 'RISK ALERT: SC-DR-0012 is overdue by 2 business days. Sierra Club has not been formally notified of delay. PUC procedural rules (Rule 4.3) require notice within 5 business days of due date. Drafted extension request letter — awaiting Dana Torres approval in D365 task RC-2841.',
    alertLevel: 'risk',
  },
];

export const liveAgentActivities: AgentActivity[] = [
  {
    id: 'live1',
    agentName: 'Discovery Triage Agent',
    agentIcon: '🔍',
    tags: ['document-intelligence', 'semantic-search'],
    timestamp: '09:17:34',
    message: 'ICC-DR-0048 received from Industrial Customers Coalition at 09:17. Classified as O&M Expenses. Assigned to Marcus Webb. 2 prior rate case responses on same topic auto-linked from AI Search index.',
    alertLevel: 'info',
  },
  {
    id: 'live2',
    agentName: 'Commitment Capture Agent',
    agentIcon: '📋',
    tags: ['audit-stream', 'state-sync'],
    timestamp: '09:19:08',
    message: 'Email thread detected: "RE: Rate Base Reconciliation" between James Park and Accounting. Commitment extracted: James Park confirmed rate base schedule reconciliation to be delivered to PUC Staff by next Monday. Logged as D365 task RC-2849.',
    alertLevel: 'info',
  },
  {
    id: 'live3',
    agentName: 'Pattern Detection Agent',
    agentIcon: '🧠',
    tags: ['consensus-voting'],
    timestamp: '09:21:15',
    message: 'Regulatory intelligence update: PUC Staff issued ALJ ruling on cost-of-capital benchmarking in Docket 25-0892-RC (neighboring utility). Ruling references 4.15% risk-free rate — consistent with MPL\'s AG-DR-0089 position. Flagged as supportive precedent. Sent to Sarah Chen\'s SharePoint folder.',
    alertLevel: 'info',
  },
  {
    id: 'live4',
    agentName: 'Deadline Risk Agent',
    agentIcon: '⚠️',
    tags: ['workflow-orchestration', 'agent-dispatch'],
    timestamp: '09:23:42',
    message: 'Deadline monitor: AG-DR-0094 (Attorney General, Executive Compensation) due in 3 days. Confidence score at 70% — below 80% threshold. Notified Dana Torres via Teams. Suggested priority escalation.',
    alertLevel: 'warning',
  },
  {
    id: 'live5',
    agentName: 'Discovery Triage Agent',
    agentIcon: '🔍',
    tags: ['document-intelligence', 'semantic-search'],
    timestamp: '09:26:11',
    message: 'PUC-DR-0163 (Depreciation) cross-referenced with 2022 depreciation study. Depreciation rate for transmission infrastructure changed from 2.8% to 3.1% — flagged for explanation in response. Engineering notification sent.',
    alertLevel: 'info',
  },
  {
    id: 'live6',
    agentName: 'Commitment Capture Agent',
    agentIcon: '📋',
    tags: ['audit-stream', 'state-sync'],
    timestamp: '09:29:55',
    message: 'SharePoint comment activity detected: Dana Torres commented on Wildfire Mitigation Cost Workpaper requesting clarification from Engineering. Commitment created: Engineering Ops to respond by tomorrow EOD. Logged as D365 task RC-2851.',
    alertLevel: 'info',
  },
];

// ─── Audit Trail ──────────────────────────────────────────────────────────────

export interface AuditEntry {
  timestamp: string;
  message: string;
  hash?: string;
}

export const auditEntries: AuditEntry[] = [
  { timestamp: '09:14:22', message: 'AG-DR-0089 received via email (Outlook trigger)' },
  { timestamp: '09:14:23', message: 'Discovery Triage Agent: topic classified — Cost of Capital (confidence: 94%)' },
  { timestamp: '09:14:23', message: 'Discovery Triage Agent: assigned to Sarah Chen via topic ownership map' },
  { timestamp: '09:14:24', message: 'Pattern Detection Agent: 2022 precedent (Docket 22-0418-RC) identified — 8 exhibits' },
  { timestamp: '09:14:24', message: 'Assigned to Sarah Chen via D365 task RC-2846 (task created)' },
  { timestamp: '09:14:25', message: 'Sarah Chen notified via Teams (Regulatory Affairs channel)', hash: '7f3a8b2c...' },
  { timestamp: '09:14:25', message: 'Related documents indexed in AI Search — 3 documents, 47 chunks' },
  { timestamp: '09:14:26', message: 'Audit hash computed: 7f3a8b2cd4e19a83f5c6012b9e4d7821 (Purview verified)', hash: '7f3a8b2c...' },
  { timestamp: '09:14:26', message: 'Filing record updated in SharePoint: /Rate Cases/2026-RC/Discovery/AG/' },
  { timestamp: '09:14:26', message: 'D365 deadline set: May 29, 2026 17:00 CT' },
  { timestamp: '09:14:47', message: 'Teams transcript ingested: "Regulatory Strategy Sync" (08:30 meeting)' },
  { timestamp: '09:14:48', message: 'Commitment Capture Agent: 4 commitments extracted from transcript' },
  { timestamp: '09:14:49', message: 'D365 tasks created: RC-2847, RC-2848, RC-2849, RC-2850', hash: 'a4c91f3b...' },
  { timestamp: '09:15:03', message: 'Pattern Detection Agent: AG-DR-0089 cross-reference analysis complete' },
  { timestamp: '09:15:04', message: '8-exhibit package from Docket 22-0418-RC queued for Sarah Chen review' },
  { timestamp: '09:15:11', message: 'Deadline Risk Agent: SC-DR-0012 overdue status confirmed — 2 business days elapsed' },
  { timestamp: '09:15:12', message: 'Extension request letter drafted: EXT-SC-0012-v1.docx (SharePoint staging)' },
  { timestamp: '09:15:12', message: 'Dana Torres notified: approval requested for extension letter', hash: 'b8e47f1a...' },
  { timestamp: '09:15:13', message: 'Audit hash computed: b8e47f1a39c02d85f761a430e59c1847 (Purview verified)' },
  { timestamp: '09:17:34', message: 'ICC-DR-0048 received via email (Outlook trigger)' },
  { timestamp: '09:17:35', message: 'Discovery Triage Agent: topic classified — O&M Expenses (confidence: 91%)' },
  { timestamp: '09:17:35', message: 'Assigned to Marcus Webb via D365 task RC-2852' },
  { timestamp: '09:17:36', message: 'Audit hash computed: c5d83e2f... (Purview verified)', hash: 'c5d83e2f...' },
  { timestamp: '09:19:08', message: 'Email thread detected: "RE: Rate Base Reconciliation" (James Park + Accounting)' },
  { timestamp: '09:19:09', message: 'Commitment Capture Agent: 1 commitment extracted from email thread' },
  { timestamp: '09:19:09', message: 'D365 task RC-2853 created: Rate base reconciliation by Monday', hash: 'd2f91b4c...' },
  { timestamp: '09:21:15', message: 'Regulatory intelligence: ALJ ruling ingested from PUC docket feed (25-0892-RC)' },
  { timestamp: '09:21:16', message: 'Pattern Detection Agent: precedent relevance confirmed for AG-DR-0089' },
  { timestamp: '09:23:42', message: 'Deadline Risk Agent: AG-DR-0094 escalation triggered — confidence below threshold' },
  { timestamp: '09:29:55', message: 'SharePoint comment activity: Dana Torres — Wildfire Mitigation Cost Workpaper' },
  { timestamp: '09:29:56', message: 'Commitment created: Engineering Ops response by tomorrow EOD' },
  { timestamp: '09:29:56', message: 'D365 task RC-2854 created', hash: 'e7c40f2b...' },
];

// ─── Commitments at Risk ──────────────────────────────────────────────────────

export interface Commitment {
  id: string;
  description: string;
  owner: string;
  deadline: string;
  source: string;
  lastActivity: string;
  taskId: string;
}

export const commitmentsAtRisk: Commitment[] = [
  {
    id: 'c1',
    description: 'SC-DR-0012 extension request letter — awaiting approval',
    owner: 'Dana Torres',
    deadline: 'TODAY',
    source: 'Meeting transcript',
    lastActivity: 'Mon 08:47',
    taskId: 'RC-2841',
  },
  {
    id: 'c2',
    description: 'Wildfire mitigation cost breakdown from Engineering',
    owner: 'Eng. Operations',
    deadline: 'Tomorrow',
    source: 'SharePoint comment',
    lastActivity: 'Mon 14:22',
    taskId: 'RC-2854',
  },
  {
    id: 'c3',
    description: 'Updated WACC calculation for AG-DR-0089',
    owner: 'Finance Team',
    deadline: 'Fri May 29',
    source: 'Teams meeting',
    lastActivity: 'Tue 09:15',
    taskId: 'RC-2848',
  },
  {
    id: 'c4',
    description: 'HR executive compensation tables for AG-DR-0094',
    owner: 'HR Department',
    deadline: 'Wed May 27',
    source: 'Email thread',
    lastActivity: 'Mon 16:33',
    taskId: 'RC-2855',
  },
  {
    id: 'c5',
    description: 'VP Regulatory briefing to CEO before board call',
    owner: 'VP Regulatory',
    deadline: 'Wed May 27',
    source: 'Teams meeting',
    lastActivity: 'Wed 07:00',
    taskId: 'RC-2850',
  },
];

// ─── Chat Messages ────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'agent';
  content: string;
}

export const initialChatMessages: ChatMessage[] = [
  {
    role: 'user',
    content: "What's at risk this week?",
  },
  {
    role: 'agent',
    content: '5 commitments are flagged as at-risk. The most critical is SC-DR-0012 (Sierra Club, wildfire recovery) — overdue by 2 days. Dana Torres is assigned but no activity has been logged since Monday. I\'ve drafted an extension request letter and notified Dana via Teams. Approval is pending in D365 task RC-2841.',
  },
  {
    role: 'user',
    content: 'Show me everything related to the wildfire mitigation position',
  },
  {
    role: 'agent',
    content: 'Pulling from AI Search... 47 documents found across SharePoint and the discovery archive. Top items:\n• 2024 Wildfire Mitigation Plan (Board-approved, 312 pages)\n• 3 prior discovery responses on the same topic (Docket 22-0418-RC)\n• CPUC precedent ruling from 2024 (SCE wildfire cost recovery)\n• Internal counsel memo on prudency standard (attorney-client privileged — excluded from indexing per Purview policy)\nWant me to compile the non-privileged materials into a briefing pack for Dana Torres?',
  },
  {
    role: 'user',
    content: "Did anyone commit to anything about the Sierra Club position in this morning's standup?",
  },
  {
    role: 'agent',
    content: 'Yes — in the 08:30 Regulatory Strategy Sync, Legal committed to reviewing Sierra Club\'s filed position by next Monday. Owner: James Park. Captured from Teams transcript at 08:47. Logged in D365 as task RC-2847.\n\nAdditionally, VP Regulatory committed to brief the CEO on Sierra Club\'s emerging disallowance argument before the Wednesday board call. Captured in the same transcript. D365 task RC-2850.',
  },
];
