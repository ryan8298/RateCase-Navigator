// ─── Proceedings ─────────────────────────────────────────────────────────────
const PROCEEDINGS = [
  {
    id: 'puc-25-1142',
    docket: 'PUC Docket No. 25-1142',
    shortDocket: 'PUC 25-1142',
    title: 'General Rate Case · Test Year 2025',
    jurisdiction: 'Texas Public Utility Commission',
    utility: 'Mountainside Power & Light',
    status: 'active',
    phase: 'Intervenor Testimony',
    phaseIdx: 3,
    filed: 'January 6, 2026',
    target: 'November 18, 2026',
    targetDate: new Date('2026-11-18'),
    leadCounsel: 'S. Anderson, Partner — Regulatory Group',
    keyDeadline: 'Rebuttal testimony due June 17, 2026',
    openDRs: 18,
    atRiskCommitments: 4,
    color: 'tx',
    phases: ['Filing','Discovery','Direct Testimony','Intervenor Testimony','Rebuttal','Hearings','Briefs','Final Order'],
  },
  {
    id: 'nypsc-24-e-0982',
    docket: 'NYPSC Case No. 24-E-0982',
    shortDocket: 'NYPSC 24-E-0982',
    title: 'Electric Rate Case · Test Year 2024',
    jurisdiction: 'New York Public Service Commission',
    utility: 'Mountainside Power & Light (NY Affiliate)',
    status: 'active',
    phase: 'Direct Testimony',
    phaseIdx: 2,
    filed: 'September 14, 2024',
    target: 'August 30, 2026',
    targetDate: new Date('2026-08-30'),
    leadCounsel: 'T. Nakamura, Senior Counsel',
    keyDeadline: 'Direct testimony due June 3, 2026',
    openDRs: 31,
    atRiskCommitments: 2,
    color: 'ny',
    phases: ['Filing','Discovery','Direct Testimony','Intervenor Testimony','Evidentiary Hearing','Briefs','Final Order'],
  },
  {
    id: 'cpuc-a-25-04-008',
    docket: 'CPUC Application No. A.25-04-008',
    shortDocket: 'CPUC A.25-04-008',
    title: 'General Rate Case · Test Years 2026–2028',
    jurisdiction: 'California Public Utilities Commission',
    utility: 'Mountainside Power & Light (CA Affiliate)',
    status: 'active',
    phase: 'Discovery',
    phaseIdx: 1,
    filed: 'April 1, 2025',
    target: 'March 15, 2027',
    targetDate: new Date('2027-03-15'),
    leadCounsel: 'L. Okafor, Regulatory Counsel',
    keyDeadline: 'Protest period closes July 14, 2025',
    openDRs: 9,
    atRiskCommitments: 0,
    color: 'ca',
    phases: ['Filing','Protest/Reply','Prehearing Conf.','Discovery','Evidentiary Hearing','Proposed Decision','Final Decision'],
  },
  {
    id: 'ferc-er-23-2891',
    docket: 'FERC Docket No. ER23-2891',
    shortDocket: 'FERC ER23-2891',
    title: 'Transmission Rate Filing · Formula Rate',
    jurisdiction: 'Federal Energy Regulatory Commission',
    utility: 'Mountainside Power & Light',
    status: 'closed',
    phase: 'Final Order',
    filed: 'November 3, 2023',
    target: 'Closed June 12, 2024',
    leadCounsel: 'S. Anderson, Partner — Regulatory Group',
    keyDeadline: 'Closed — compliance filing due Oct. 1, 2024',
    openDRs: 0,
    atRiskCommitments: 0,
    color: 'tx',
    phases: [],
  },
  {
    id: 'puc-22-0341',
    docket: 'PUC Docket No. 22-0341',
    shortDocket: 'PUC 22-0341',
    title: 'General Rate Case · Test Year 2021',
    jurisdiction: 'Texas Public Utility Commission',
    utility: 'Mountainside Power & Light',
    status: 'closed',
    phase: 'Final Order',
    filed: 'April 14, 2022',
    target: 'Closed March 8, 2023',
    leadCounsel: 'S. Anderson, Partner — Regulatory Group',
    keyDeadline: 'Closed — Final Order issued March 8, 2023',
    openDRs: 0,
    atRiskCommitments: 0,
    color: 'tx',
    phases: [],
  },
  {
    id: 'nypsc-21-g-0554',
    docket: 'NYPSC Case No. 21-G-0554',
    shortDocket: 'NYPSC 21-G-0554',
    title: 'Gas Rate Case · Test Year 2020',
    jurisdiction: 'New York Public Service Commission',
    utility: 'Mountainside Power & Light (NY Affiliate)',
    status: 'closed',
    phase: 'Final Order',
    filed: 'March 2, 2021',
    target: 'Closed January 19, 2022',
    leadCounsel: 'T. Nakamura, Senior Counsel',
    keyDeadline: 'Closed — all commitments satisfied',
    openDRs: 0,
    atRiskCommitments: 0,
    color: 'ny',
    phases: [],
  },
];

// ─── Commitments ─────────────────────────────────────────────────────────────
const COMMITMENTS = [
  { id:'RC-0042', text:'The Company will file a quarterly update on its grid modernization spend within 30 days of each quarter end.', source:'J. Patterson direct', cite:'Tr. 247:14–19', dateMade:'Mar. 12, 2026', witness:'J. Patterson', title:'VP Distribution', status:'Open', due:'Apr. 30, 2026', dueRisk:false, context:'Commitment made in response to OPC counsel question regarding regularity of capital expenditure reporting. J. Patterson confirmed the Company would file on a quarterly basis beginning Q1 2026.', relatedDocs:'Direct Testimony of J. Patterson (25-1142-047) · Schedule D-1 (Capital Expenditure Summary)', history:['Mar. 12, 2026 — Commitment created (J. Patterson direct testimony)','Mar. 15, 2026 — Assigned to J. Patterson for tracking'] },
  { id:'RC-0043', text:'The Company will provide a workpaper reconciliation of the $14.2M depreciation reserve adjustment by May 15, 2026.', source:'M. Reyes rebuttal', cite:'Tr. 401:08–22', dateMade:'Apr. 4, 2026', witness:'M. Reyes', title:'Director Regulatory Accounting', status:'At-Risk', due:'May 15, 2026', dueRisk:true, context:'Commitment made during cross-examination by Sierra Club counsel. M. Reyes acknowledged that the workpaper reconciliation had not been pre-filed. Due May 15, 2026 — witness has not yet confirmed readiness.', relatedDocs:'Rebuttal Testimony of M. Reyes (25-1142-088) · Schedule D-7 (Depreciation Reserve Analysis)', history:['Apr. 4, 2026 — Commitment created (M. Reyes rebuttal)','Apr. 28, 2026 — Status changed to At-Risk (due date within 14 days)'] },
  { id:'RC-0044', text:'The Company will report customer count data segmented by rate class in Schedule G-2 of future quarterly filings.', source:'K. Lin direct', cite:'Tr. 188:03–11', dateMade:'Feb. 28, 2026', witness:'K. Lin', title:'Manager Rates & Tariffs', status:'Closed', due:'Feb. 28, 2026', dueRisk:false, context:'Commitment fulfilled. K. Lin confirmed Schedule G-2 updated to include customer count segmentation by rate class, effective Q4 2025 quarterly filing submitted February 28, 2026.', relatedDocs:'Direct Testimony of K. Lin (25-1142-049) · Schedule G-2 (Customer Data)', history:['Feb. 28, 2026 — Commitment created (K. Lin direct testimony)','Feb. 28, 2026 — Marked Closed by K. Lin (Q4 2025 filing submitted)'] },
  { id:'RC-0045', text:'The Company will conduct an independent third-party assessment of cybersecurity controls referenced in Schedule SEC-3 and file the results with the Commission.', source:'S. Whitmore direct', cite:'Tr. 312:21–28', dateMade:'Mar. 18, 2026', witness:'S. Whitmore', title:'Chief Information Security Officer', status:'Open', due:'Sep. 1, 2026', dueRisk:false, context:'Commitment made voluntarily during direct testimony. S. Whitmore stated the Company believes an independent assessment will provide additional assurance to the Commission. Procurement for third-party assessor is underway.', relatedDocs:'Direct Testimony of S. Whitmore (25-1142-051) · Schedule SEC-3', history:['Mar. 18, 2026 — Commitment created (S. Whitmore direct testimony)','Apr. 1, 2026 — RFP issued for third-party assessor'] },
  { id:'RC-0046', text:'The Company will provide a sensitivity analysis of capital structure assumptions across three additional scenarios.', source:'D. Patel rebuttal', cite:'Tr. 489:14–20', dateMade:'Apr. 22, 2026', witness:'D. Patel', title:'VP Treasury', status:'At-Risk', due:'May 30, 2026', dueRisk:true, context:'Commitment made in response to AG expert cross-examination on capital structure and WACC assumptions. AG expert identified three alternative scenarios not addressed in D. Patel\'s direct testimony. Rebuttal section REB-03 still in draft.', relatedDocs:'Rebuttal Testimony of D. Patel (25-1142-089) · Schedule C-1 (Capital Structure)', history:['Apr. 22, 2026 — Commitment created during cross-examination (D. Patel rebuttal)','May 14, 2026 — Status changed to At-Risk (16 days to deadline)'] },
  { id:'RC-0047', text:'The Company will reconcile actual 2025 storm hardening expenditures against the budgeted $87M referenced in Schedule O-4.', source:'R. Cole direct', cite:'Tr. 156:09–18', dateMade:'Feb. 14, 2026', witness:'R. Cole', title:'Director Resilience Planning', status:'Open', due:'Jun. 30, 2026', dueRisk:false, context:'Commitment made during OPC cross-examination regarding discrepancies between the $87M budget in Schedule O-4 and actual reported expenditures.', relatedDocs:'Direct Testimony of R. Cole (25-1142-046) · Schedule O-4 (Storm Hardening Expenditures)', history:['Feb. 14, 2026 — Commitment created (R. Cole direct testimony)','Mar. 2, 2026 — Assigned to R. Cole for reconciliation preparation'] },
  { id:'RC-0048', text:'The Company will provide bench memo response within 14 days of Commission request on rate design alternatives for residential customers.', source:'K. Lin direct', cite:'Tr. 192:07–14', dateMade:'Feb. 28, 2026', witness:'K. Lin', title:'Manager Rates & Tariffs', status:'Closed', due:'Mar. 14, 2026', dueRisk:false, context:'Commitment fulfilled. Commission bench memo request received February 28, 2026. K. Lin filed bench memo response on March 14, 2026, within the 14-day window.', relatedDocs:'Bench Memo Response — K. Lin (25-1142-062)', history:['Feb. 28, 2026 — Commitment created (K. Lin direct testimony)','Mar. 14, 2026 — Marked Closed by K. Lin (bench memo filed)'] },
  { id:'RC-0049', text:'The Company will file an updated load forecast incorporating revised assumptions discussed at the May 8 technical conference.', source:'J. Patterson rebuttal', cite:'Tr. 433:11–25', dateMade:'May 8, 2026', witness:'J. Patterson', title:'VP Distribution', status:'At-Risk', due:'Jun. 1, 2026', dueRisk:true, context:'Commitment made at the May 8 technical conference. J. Patterson acknowledged the demand forecast requires updating to reflect revised economic projections. Due June 1, 2026.', relatedDocs:'Rebuttal Testimony of J. Patterson (25-1142-090) · Schedule D-3 (Load Forecast)', history:['May 8, 2026 — Commitment created at technical conference','May 14, 2026 — Status set to At-Risk (24 days to deadline, draft not started)'] },
];

// ─── Discovery Requests ───────────────────────────────────────────────────────
const DISCOVERY_REQUESTS = [
  { id:'AG-DR-0089', party:'Attorney General', question:'Please provide all workpapers supporting the cost of capital calculation in Schedule C-1, including the CAPM inputs and comparable company selection criteria.', assigned:'D. Patel', assignedTitle:'VP Treasury', received:'May 1, 2026', due:'May 29, 2026', status:'Drafting', dueRisk:true, proceeding:'PUC 25-1142', draftResponse:'The Company responds as follows:\n\nSchedule C-1, Attachment A hereto, provides all workpapers supporting the cost of capital calculation, including:\n\n1. CAPM Inputs Workpaper (C-1-WP-01): The risk-free rate of 4.15% is based on the 20-year U.S. Treasury yield averaged over the 30-trading-day period ended March 31, 2026, consistent with established Commission practice in prior Texas electric utility rate cases. See Docket No. 22-0341, Final Order ¶ 142.\n\n2. Equity Risk Premium (C-1-WP-02): The equity risk premium of 5.35% is derived from the Duff & Phelps 2026 Valuation Handbook, reflecting historical excess market returns over the 1926–2025 period.\n\n3. Comparable Company Selection (C-1-WP-03): The proxy group of eight vertically integrated electric utilities was selected based on the following criteria: (a) SIC Code 4911 or 4931; (b) market capitalization between $3B and $25B; (c) at least 75% of revenues from regulated operations; and (d) no pending major corporate transactions that would distort capital structure.\n\nAll workpapers are provided in native Excel format as Attachment B.', workpapers:['C-1-WP-01: CAPM Inputs (Excel)','C-1-WP-02: Equity Risk Premium Derivation (Excel)','C-1-WP-03: Proxy Group Selection and Screening (Excel)','C-1 Supporting Documentation (PDF)'] },
  { id:'SC-DR-0034', party:'Sierra Club', question:'Please identify each instance in which the Company deviated from its stated depreciation methodology and explain the reason for the deviation.', assigned:'M. Reyes', assignedTitle:'Director Regulatory Accounting', received:'Apr. 28, 2026', due:'Jun. 5, 2026', status:'Internal Review', dueRisk:false, proceeding:'PUC 25-1142', draftResponse:'The Company responds as follows:\n\nThe Company\'s depreciation methodology is described in Schedule D-7 and the Direct Testimony of M. Reyes. During the test year 2025, the Company applied the straight-line remaining-life methodology consistent with the Commission-approved depreciation study filed in Docket No. 22-0341.\n\nThe Company identified three instances in which the actual depreciation calculation deviated from the stated methodology:\n\n1. Substation Class 353.00 (Substation Equipment): A mid-year correction was applied in Q3 2025 to reflect the early retirement of two 69kV transformers at the Ridgeline substation. The correction reduced the depreciable life by 4 years from the group average. This is consistent with actuarial depreciation practice. See Schedule D-7, Tab 3.\n\n2. Distribution Line Class 364.00: The depreciation rate was updated in January 2025 to reflect revised service life parameters from the updated depreciation study. This revision was applied prospectively as of January 1, 2025, not retroactively.\n\n3. General Plant Class 397.00 (Communication Equipment): Certain software assets within this class were accelerated to a 5-year life consistent with the technology refresh cycle adopted in the Company\'s 2025 Capital Planning process.\n\nIn each case, the deviation was disclosed in the workpapers accompanying Schedule D-7 and was consistent with Commission accounting guidelines and standard depreciation practice.', workpapers:['D-7: Depreciation Reserve Analysis (Excel)','D-7 Supporting Documentation (PDF)','Depreciation Study Update (2025)'] },
  { id:'OPC-DR-0112', party:'Office of Public Counsel', question:'Provide the ten-year capital expenditure forecast by project category, including the specific projects deferred from the prior test year and the reasons for each deferral.', assigned:'J. Patterson', assignedTitle:'VP Distribution', received:'May 5, 2026', due:'Jun. 12, 2026', status:'Drafting', dueRisk:false, proceeding:'PUC 25-1142', draftResponse:'The Company responds as follows:\n\nAttachment A hereto provides the ten-year capital expenditure forecast (2026–2035) disaggregated by the following project categories:\n\n— Transmission (Class 350–359)\n— Distribution (Class 360–374)\n— General Plant (Class 389–399)\n— Information Technology\n— Electric Vehicles / Grid Modernization\n\nProjects Deferred from Prior Test Year (Docket No. 22-0341):\n\nThe following projects identified in the Company\'s prior capital plan were deferred to the current test year:\n\n1. Distribution Automation Phase II ($12.4M): Deferred from 2022–2023 due to supply chain constraints on smart switch procurement. Rescheduled to 2025–2026.\n\n2. Advanced Metering Infrastructure Backhaul Upgrade ($8.7M): Deferred from 2023 due to integration dependencies with the new customer information system. Rescheduled to 2026.\n\n3. Substation Rebuilds — Westfield and Oak Park ($21.1M combined): Deferred one year due to permitting delays associated with local municipal review. Rescheduled to 2025–2026.', workpapers:['D-1: Ten-Year Capital Forecast (Excel)','D-1 Project Detail Schedules (Excel)','D-3: Deferred Project Documentation (PDF)'] },
  { id:'ICC-DR-0041', party:'Industrial Customers Coalition', question:'Please provide the rate design study supporting the proposed residential demand charge, including the load research data underlying the study.', assigned:'K. Lin', assignedTitle:'Manager Rates & Tariffs', received:'Mar. 14, 2026', due:'Apr. 11, 2026', status:'Filed', dueRisk:false, proceeding:'PUC 25-1142', draftResponse:'Filed April 11, 2026. See Docket No. 25-1142, Filing 25-1142-062.', workpapers:['Rate Design Study (25-1142-062)','Load Research Data (25-1142-062-A)'] },
  { id:'TIEC-DR-0018', party:'TX Industrial Energy Consumers', question:'Provide all studies and analyses supporting the proposed transmission cost allocation methodology, including the load flow studies and peak demand data by transmission zone.', assigned:'D. Patel', assignedTitle:'VP Treasury', received:'May 8, 2026', due:'Jun. 5, 2026', status:'Drafting', dueRisk:false, proceeding:'PUC 25-1142', draftResponse:'The Company is preparing a response to this request. Load flow studies referenced in Schedule T-4 are being compiled. Estimated completion: May 30, 2026.', workpapers:['T-4: Transmission Cost Allocation Study (pending)','Zone Peak Demand Data (pending)'] },
  { id:'OPC-DR-0119', party:'Office of Public Counsel', question:'For each commitment made in prior Docket No. 22-0341, confirm whether the commitment has been fulfilled and provide supporting documentation.', assigned:'S. Anderson', assignedTitle:'Lead Regulatory Counsel', received:'May 12, 2026', due:'Jun. 19, 2026', status:'Drafting', dueRisk:false, proceeding:'PUC 25-1142', draftResponse:'The Company is compiling a full response to this request. The compliance matrix for all 89 commitments made in Docket No. 22-0341 is in preparation and will be provided as Attachment A, with supporting documentation filed concurrently.', workpapers:['22-0341 Commitment Compliance Matrix (pending)','Supporting Documentation (pending)'] },
  { id:'NY-AG-DR-0044', party:'NY Department of Public Service Staff', question:'Provide the Company\'s revenue requirement by rate class, including the allocation factors and the basis for each factor.', assigned:'M. Reyes', assignedTitle:'Director Regulatory Accounting', received:'Apr. 22, 2026', due:'May 27, 2026', status:'Internal Review', dueRisk:true, proceeding:'NYPSC 24-E-0982', draftResponse:'The Company\'s revenue requirement by rate class is set forth in Schedule A-1 hereto. The cost allocation methodology is described in the Direct Testimony of M. Reyes filed March 12, 2026.\n\nRevenue Requirement by Rate Class ($ thousands):\n\nSC-1 (Residential): $284,471\nSC-2 (Small Commercial): $112,843\nSC-3 (Large Commercial): $89,204\nSC-4 (Industrial): $67,581\nSC-5 (Lighting): $14,922\nTotal: $569,021\n\nAllocation factors are based on the Company\'s filed cost of service study (Schedule A-2), which employs the Modified Fixed-Variable method for classifying production costs and the Coincident Peak method for allocating transmission costs.', workpapers:['Schedule A-1: Revenue Requirement by Rate Class (Excel)','Schedule A-2: Cost of Service Study (Excel)','M. Reyes Direct Testimony — NY Affiliate'] },
  { id:'CA-DRA-DR-0022', party:'Division of Ratepayer Advocates', question:'Please provide the Company\'s load forecasting methodology and all assumptions underlying the demand forecast for the 2026–2028 test years.', assigned:'J. Patterson', assignedTitle:'VP Distribution', received:'May 14, 2026', due:'Jul. 1, 2026', status:'Drafting', dueRisk:false, proceeding:'CPUC A.25-04-008', draftResponse:'The Company is preparing its response to this request. The load forecasting methodology is described in Schedule LF-1 of the Application. Detailed assumptions will be provided as Attachment A.', workpapers:['Schedule LF-1: Load Forecasting Methodology (Application)','LF-1 Supporting Assumptions (pending)'] },
];

// ─── Witnesses ────────────────────────────────────────────────────────────────
const WITNESSES = [
  { id:'patterson', initials:'JP', name:'J. Patterson', title:'VP Distribution Engineering', openItems:4, lastActivity:'May 21, 2026', qualifications:'20 years in electric utility distribution planning and capital investment. P.E. — Texas. Expert in grid modernization, NERC reliability standards, and T&D cost allocation.', testimony:[{section:'DIR-01',title:'Overview & Qualifications',status:'Filed',pct:100},{section:'DIR-04',title:'Capital Expenditure Justification',status:'Filed',pct:100},{section:'REB pending',title:'Rebuttal to OPC grid modernization challenge',status:'Not Started',pct:0}], openCommitments:['RC-0042 (Open)','RC-0049 (At-Risk)'], openDRs:['OPC-DR-0112 (Drafting)','CA-DRA-DR-0022 (Drafting)'] },
  { id:'reyes', initials:'MR', name:'M. Reyes', title:'Director, Regulatory Accounting', openItems:2, lastActivity:'May 19, 2026', qualifications:'15 years in regulatory accounting and financial reporting for investor-owned utilities. CPA, CMA. Expert in depreciation methodology, rate base, and revenue requirement development.', testimony:[{section:'DIR-06',title:'Revenue Requirement Overview',status:'Filed',pct:100},{section:'REB-05',title:'Rebuttal to Sierra Club depreciation challenge',status:'Not Started',pct:5}], openCommitments:['RC-0043 (At-Risk)'], openDRs:['SC-DR-0034 (Internal Review)','NY-AG-DR-0044 (Internal Review)'] },
  { id:'lin', initials:'KL', name:'K. Lin', title:'Manager, Rates & Tariffs', openItems:1, lastActivity:'May 14, 2026', qualifications:'11 years in rate design and tariff administration. Expert in residential rate design, customer class cost allocation, and retail competition frameworks.', testimony:[{section:'DIR-08',title:'Rate Design — Residential',status:'Filed',pct:100},{section:'DIR-09',title:'Rate Design — Commercial & Industrial',status:'Filed',pct:100}], openCommitments:[], openDRs:['OPC bench memo — pending'] },
  { id:'whitmore', initials:'SW', name:'S. Whitmore', title:'Chief Information Security Officer', openItems:3, lastActivity:'May 20, 2026', qualifications:'18 years in utility cybersecurity and grid control systems. CISSP, NERC CIP compliance expert. Board member, Utility ISAC.', testimony:[{section:'DIR-11',title:'Cybersecurity & Grid Controls',status:'Filed',pct:100},{section:'REB pending',title:'Rebuttal to intervenor cybersecurity challenge',status:'Not Started',pct:0}], openCommitments:['RC-0045 (Open)'], openDRs:['2 cybersecurity detail requests (Drafting)'] },
  { id:'patel', initials:'DP', name:'D. Patel', title:'VP Treasury', openItems:2, lastActivity:'May 22, 2026', qualifications:'17 years in utility finance and capital markets. Expert in WACC, capital structure optimization, and rate of return testimony. MBA — Wharton.', testimony:[{section:'DIR-12',title:'Capital Structure & Cost of Capital',status:'Filed',pct:100},{section:'REB-03',title:'Rebuttal to AG Expert Morse',status:'In Draft',pct:35}], openCommitments:['RC-0046 (At-Risk)'], openDRs:['AG-DR-0089 (Drafting)','TIEC-DR-0018 (Drafting)'] },
  { id:'cole', initials:'RC', name:'R. Cole', title:'Director, Resilience Planning', openItems:5, lastActivity:'May 18, 2026', qualifications:'14 years in utility infrastructure resilience and storm response. Expert in grid hardening cost-benefit analysis, FEMA reimbursement, and wildfire mitigation planning.', testimony:[{section:'DIR-09',title:'Storm Hardening & Resilience Investments',status:'Filed',pct:100},{section:'REB-07',title:'Rebuttal to OPC on grid modernization prudence',status:'Not Started',pct:0}], openCommitments:['RC-0047 (Open)'], openDRs:['4 storm hardening detail requests (Various)'] },
  { id:'morgan', initials:'TM', name:'T. Morgan', title:'Director, Environmental Compliance', openItems:1, lastActivity:'May 10, 2026', qualifications:'16 years in environmental regulatory compliance for electric utilities. Expert in air quality permitting, renewable portfolio standards, and ESG disclosure.', testimony:[{section:'DIR-14',title:'Environmental Compliance Costs',status:'Filed',pct:100}], openCommitments:[], openDRs:['1 environmental cost allocation request'] },
  { id:'chen', initials:'XC', name:'X. Chen', title:'VP Information Technology', openItems:2, lastActivity:'May 16, 2026', qualifications:'12 years in utility IT infrastructure. Expert in advanced metering infrastructure, enterprise resource planning, and customer information systems.', testimony:[{section:'DIR-15',title:'IT Capital Program & AMI Deployment',status:'In Draft',pct:60}], openCommitments:['1 IT workpaper commitment'], openDRs:['2 AMI deployment detail requests'] },
];

// ─── Activity Log Events ──────────────────────────────────────────────────────
const ACTIVITY_EVENTS = [
  'New DR received from TIEC — OPC-DR-0128, assigned to R. Cole',
  'M. Reyes uploaded workpaper RC-0043-WP-02 (Depreciation Reserve Reconciliation)',
  'Commitment RC-0044 marked closed by K. Lin',
  'AI draft completed for SC-DR-0034 — awaiting M. Reyes review',
  'Commission Order 25-1142-109 docketed — discovery extension granted',
  'J. Patterson approved discovery response OPC-DR-0108 for filing',
  'New DR received from Sierra Club — SC-DR-0038, assigned to M. Reyes',
  'D. Patel updated REB-03 draft — 35% complete',
  'R. Cole opened storm hardening reconciliation workpaper (RC-0047-WP-01)',
  'Pre-hearing conference scheduled for June 24, 2026 — added to calendar',
  'AI draft completed for TIEC-DR-0018 — assigned to D. Patel for review',
  'S. Whitmore confirmed cybersecurity assessment procurement underway (RC-0045)',
  'New intervenor testimony filed — AG Expert Dr. A. Morse (25-1142-114)',
  'Commission inquiry filed — bench memo on residential rate design (RC-0048)',
  'Filing deadline reminder: REB-03 due in 21 days — D. Patel notified',
];

// ─── Testimony Drafts ─────────────────────────────────────────────────────────
const TESTIMONY_DRAFTS = {
  'DIR-01': { title:'Overview and Qualifications — J. Patterson', witness:'J. Patterson', status:'Filed', content:`Q. Please state your name and position.

A. My name is Jason Patterson. I am Vice President of Distribution Engineering for Mountainside Power & Light ("Company" or "MPL"), a position I have held since January 2021. In this capacity, I am responsible for the engineering, design, and capital planning of the Company's distribution system serving approximately 2.4 million customers in the State of Texas.

Q. Please summarize your educational and professional background.

A. I hold a Bachelor of Science degree in Electrical Engineering from Texas A&M University and a Master of Science degree in Power Systems Engineering from the University of Texas at Austin. I am a licensed Professional Engineer in the State of Texas. I have 20 years of experience in electric utility distribution planning, capital investment, and regulatory affairs.

Q. What is the purpose of your testimony in this proceeding?

A. I am filing testimony in support of the Company's Application for a general rate increase. My testimony addresses the Company's distribution capital expenditure program for the test year 2025, including investments in grid modernization, storm hardening, and reliability improvements. I also address the reasonableness and prudence of these expenditures and their proper inclusion in the Company's rate base.` },
  'DIR-04': { title:'Capital Expenditure Justification — J. Patterson', witness:'J. Patterson', status:'Filed', content:`Q. What capital expenditure investments are at issue in this proceeding?

A. The Company's distribution capital expenditures for the test year 2025 totaled $412.3 million, as set forth in Schedule D-1. These investments fall into five primary categories:

(1) Grid Modernization: $148.7 million, including advanced metering infrastructure backhaul upgrades, distribution automation, and smart switching deployments;

(2) Storm Hardening: $87.0 million, including pole replacements, line undergrounding, and flood-hardening of substations in coastal service areas;

(3) Reliability Improvements: $64.2 million, including substation rebuilds at Westfield and Oak Park and conductor replacements on highest-SAIDI feeders;

(4) Load Growth Accommodations: $71.4 million, including new substation construction at the Parkfield Industrial Campus and service extensions for large industrial customers;

(5) Safety and Compliance: $41.0 million, including NERC CIP compliance upgrades and vegetation management program capital investment.

Q. How does the Company demonstrate the prudence of these expenditures?

A. Each project exceeding $5 million is supported by a Project Authorization Request ("PAR"), copies of which are provided in Schedule D-2. Each PAR documents the engineering need, alternatives considered, cost-benefit analysis, and applicable regulatory requirements. The prudence of each project is further supported by the Company's Integrated Grid Plan, filed with the Commission in January 2025.` },
  'REB-03': { title:'Rebuttal to AG Expert Dr. A. Morse — D. Patel', witness:'D. Patel', status:'In Draft', content:`[AI DRAFT — 35% complete — For D. Patel review]

Q. What is the purpose of your rebuttal testimony?

A. I am filing rebuttal testimony to respond to the testimony filed by Dr. Alan Morse on behalf of the Texas Attorney General. Dr. Morse challenges the Company's proposed weighted average cost of capital ("WACC") of 7.84% and recommends instead a WACC of 6.92%. I respectfully disagree with Dr. Morse's conclusions and methodology, for the reasons set forth below.

Q. What are the primary methodological differences between your analysis and Dr. Morse's?

A. Dr. Morse's analysis diverges from the Company's in three material respects:

First, Dr. Morse applies a risk-free rate of 3.65%, based on a 90-day Treasury yield average ending December 31, 2025. The Company uses a 4.15% risk-free rate based on the 20-year Treasury yield averaged over the 30-trading-day period ended March 31, 2026. The 20-year Treasury is the appropriate benchmark for regulated utility equity valuation because it matches the long-duration nature of rate base investments and is the benchmark used by the Commission in prior rate cases. See Docket No. 22-0341, Final Order ¶ 142.

Second, Dr. Morse uses an equity risk premium of 4.60%, derived from a survey of financial practitioners. The Company uses the Duff & Phelps historical ERP of 5.35%, which reflects the long-run historical excess return of equities over risk-free rates and is consistent with standard academic and regulatory practice.

[REMAINING SECTIONS TO BE DRAFTED — Capital structure analysis, beta derivation, DCF cross-check, and Conclusion]` },
  'REB-05': { title:'Rebuttal to Sierra Club — M. Reyes', witness:'M. Reyes', status:'Not Started', content:`[AI DRAFT — PRELIMINARY — For M. Reyes review]

Q. What is the purpose of your rebuttal testimony?

A. I am filing rebuttal testimony to respond to the testimony filed on behalf of the Sierra Club challenging the Company's depreciation methodology and the reasonableness of the $14.2M depreciation reserve adjustment included in the Company's revenue requirement.

Q. Please briefly summarize Sierra Club's challenge.

A. Sierra Club's witness argues that: (1) the Company's depreciation rates are excessive relative to industry benchmarks; (2) the $14.2M depreciation reserve adjustment should be excluded from rate base; and (3) the Company's depreciation study, conducted in 2023, is outdated and should be revised before rates are set.

Q. Do you agree with Sierra Club's characterization?

A. No. Sierra Club's arguments mischaracterize both the Company's methodology and the applicable regulatory standard. I address each argument in turn.

[REMAINDER TO BE DRAFTED]` },
  'REB-07': { title:'Rebuttal to OPC — R. Cole', witness:'R. Cole', status:'Not Started', content:`[AI DRAFT — PRELIMINARY — For R. Cole review]

Q. What is the purpose of your rebuttal testimony?

A. I am filing rebuttal testimony in response to the testimony of the Office of Public Counsel challenging the prudence of the Company's $87M storm hardening program and the proper accounting treatment of storm hardening costs in Schedule O-4.

[REMAINDER TO BE DRAFTED]` },
};

// ─── Filing Calendar Data ─────────────────────────────────────────────────────
const FILING_EVENTS = [
  // May 2026
  { date:'2026-05-15', label:'RC-0043 Depreciation Reconciliation Due', proc:'tx', detail:'Workpaper reconciliation of $14.2M depreciation reserve adjustment. Responsible: M. Reyes. Status: At-Risk.', attorneys:'M. Reyes, S. Anderson', docs:['RC-0043 Workpaper (pending)'] },
  { date:'2026-05-27', label:'NY-AG-DR-0044 Response Due', proc:'ny', detail:'Revenue requirement by rate class response. NYPSC 24-E-0982. Assigned: M. Reyes.', attorneys:'M. Reyes, T. Nakamura', docs:['Schedule A-1 (draft ready)'] },
  { date:'2026-05-29', label:'AG-DR-0089 Response Due', proc:'tx', detail:'Cost of capital workpapers. PUC 25-1142. Assigned: D. Patel.', attorneys:'D. Patel, S. Anderson', docs:['C-1 Workpapers (drafting)'] },
  { date:'2026-05-30', label:'RC-0046 Capital Structure Sensitivity Due', proc:'tx', detail:'Sensitivity analysis across 3 additional capital structure scenarios. Responsible: D. Patel. Status: At-Risk.', attorneys:'D. Patel, S. Anderson', docs:['C-1 Sensitivity Analysis (pending)'] },
  // June 2026
  { date:'2026-06-01', label:'RC-0049 Load Forecast Update Due', proc:'tx', detail:'Updated load forecast incorporating May 8 technical conference assumptions. Responsible: J. Patterson.', attorneys:'J. Patterson, S. Anderson', docs:['Schedule D-3 Update (pending)'] },
  { date:'2026-06-03', label:'NY Direct Testimony Due', proc:'ny', detail:'All Company direct testimony, NYPSC 24-E-0982. Witnesses: M. Reyes, X. Chen, T. Morgan.', attorneys:'T. Nakamura, S. Anderson', docs:['NY Direct Testimony Package (drafting)'] },
  { date:'2026-06-05', label:'SC-DR-0034 Response Due', proc:'tx', detail:'Depreciation methodology deviation response. PUC 25-1142. Assigned: M. Reyes.', attorneys:'M. Reyes, S. Anderson', docs:['Response Draft (Internal Review)'] },
  { date:'2026-06-12', label:'OPC-DR-0112 Response Due', proc:'tx', detail:'Ten-year capital expenditure forecast. PUC 25-1142. Assigned: J. Patterson.', attorneys:'J. Patterson, S. Anderson', docs:['D-1 Ten-Year Forecast (drafting)'] },
  { date:'2026-06-17', label:'PUC 25-1142 Rebuttal Testimony Due', proc:'tx', detail:'All Company rebuttal testimony, PUC 25-1142. Witnesses: D. Patel (REB-03), M. Reyes (REB-05), R. Cole (REB-07).', attorneys:'S. Anderson, all rebuttal witnesses', docs:['REB-03 (In Draft — 35%)','REB-05 (Not Started)','REB-07 (Not Started)'] },
  { date:'2026-06-24', label:'Pre-Hearing Conference', proc:'tx', detail:'Pre-hearing conference, PUC Docket 25-1142. Location: William B. Travis Building, Austin, TX.', attorneys:'S. Anderson, all witnesses', docs:['Witness List (pending)','Exhibit List (pending)'] },
  { date:'2026-06-30', label:'RC-0047 Storm Hardening Reconciliation Due', proc:'tx', detail:'Reconcile 2025 storm hardening vs. $87M budget in Schedule O-4. Responsible: R. Cole.', attorneys:'R. Cole, S. Anderson', docs:['O-4 Reconciliation (pending)'] },
  // July 2026
  { date:'2026-07-01', label:'CA-DRA-DR-0022 Response Due', proc:'ca', detail:'Load forecasting methodology response. CPUC A.25-04-008. Assigned: J. Patterson.', attorneys:'L. Okafor, J. Patterson', docs:['LF-1 Supporting Assumptions (pending)'] },
  { date:'2026-07-08', label:'PUC 25-1142 Evidentiary Hearing Begins', proc:'tx', detail:'Evidentiary hearing commences, PUC Docket 25-1142. Estimated 5 hearing days. Location: TBD.', attorneys:'S. Anderson, all witnesses', docs:['Prefiled Exhibits (pending)','Witness Schedules (pending)'] },
  { date:'2026-07-14', label:'NY Intervenor Testimony Due', proc:'ny', detail:'Intervenor testimony deadline, NYPSC 24-E-0982.', attorneys:'T. Nakamura', docs:[] },
  // August 2026
  { date:'2026-08-07', label:'PUC 25-1142 Initial Briefs Due', proc:'tx', detail:'Initial briefs, PUC Docket 25-1142. Page limit: 150 pages per party.', attorneys:'S. Anderson', docs:['Initial Brief (drafting)'] },
  { date:'2026-08-21', label:'PUC 25-1142 Reply Briefs Due', proc:'tx', detail:'Reply briefs, PUC Docket 25-1142. Page limit: 75 pages per party.', attorneys:'S. Anderson', docs:['Reply Brief (pending)'] },
  { date:'2026-08-30', label:'NYPSC Final Order Target', proc:'ny', detail:'Target final order date, NYPSC 24-E-0982. Subject to Commission scheduling.', attorneys:'T. Nakamura', docs:[] },
];

// ─── Report Data ──────────────────────────────────────────────────────────────
const REPORT_DATA = {
  aging: {
    title: 'Discovery Response Aging Report',
    subtitle: 'As of May 27, 2026 — PUC 25-1142, NYPSC 24-E-0982, CPUC A.25-04-008',
    rows: [
      { id:'AG-DR-0089', party:'Attorney General', witness:'D. Patel', received:'May 1, 2026', due:'May 29, 2026', age:26, status:'Drafting', risk:true },
      { id:'SC-DR-0034', party:'Sierra Club', witness:'M. Reyes', received:'Apr. 28, 2026', due:'Jun. 5, 2026', age:29, status:'Internal Review', risk:false },
      { id:'NY-AG-DR-0044', party:'DPS Staff (NY)', witness:'M. Reyes', received:'Apr. 22, 2026', due:'May 27, 2026', age:35, status:'Internal Review', risk:true },
      { id:'OPC-DR-0112', party:'Office of Public Counsel', witness:'J. Patterson', received:'May 5, 2026', due:'Jun. 12, 2026', age:22, status:'Drafting', risk:false },
      { id:'TIEC-DR-0018', party:'TX Indust. Energy Consumers', witness:'D. Patel', received:'May 8, 2026', due:'Jun. 5, 2026', age:19, status:'Drafting', risk:false },
      { id:'OPC-DR-0119', party:'Office of Public Counsel', witness:'S. Anderson', received:'May 12, 2026', due:'Jun. 19, 2026', age:15, status:'Drafting', risk:false },
      { id:'CA-DRA-DR-0022', party:'Div. of Ratepayer Advocates', witness:'J. Patterson', received:'May 14, 2026', due:'Jul. 1, 2026', age:13, status:'Drafting', risk:false },
    ]
  },
  compliance: {
    title: 'Commitment Compliance Rate Report',
    subtitle: 'As of May 27, 2026 — All Active Proceedings',
    summary: { total:247, open:183, atRisk:4, closed:60, rate:'24.3%' },
    byWitness: [
      { witness:'K. Lin', total:22, closed:22, atRisk:0, rate:'100%' },
      { witness:'J. Patterson', total:48, closed:31, atRisk:2, rate:'64.6%' },
      { witness:'M. Reyes', total:39, closed:24, atRisk:1, rate:'61.5%' },
      { witness:'S. Whitmore', total:18, closed:11, atRisk:0, rate:'61.1%' },
      { witness:'D. Patel', total:35, closed:21, atRisk:2, rate:'60.0%' },
      { witness:'R. Cole', total:29, closed:16, atRisk:1, rate:'55.2%' },
    ]
  },
};
