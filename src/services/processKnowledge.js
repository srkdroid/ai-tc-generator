/**
 * D365FO domain knowledge for enriching AI prompts.
 * Maps process IDs to D365FO-specific context, menu paths, edge case hints,
 * and typical GL posting patterns.
 */

const PROCESS_KNOWLEDGE = {
  // ── Accounts Payable ──
  AP_VI_2WAY: {
    menuPath: 'Accounts Payable > Invoices > Vendor invoice',
    matchingPolicy: '2-way match (invoice to purchase order)',
    typicalPostings: [
      'Dr Expense/Inventory account',
      'Cr Vendor payable (AP summary account)'
    ],
    edgeCaseHints: [
      'Price tolerance exceeded between PO and invoice',
      'Charge allocation across multiple lines',
      'Invoice with quantity variance',
      'Duplicate invoice number detection',
      'Vendor on hold status'
    ],
    relatedSetup: ['Matching policy on AP parameters', 'Vendor posting profiles', 'Price tolerance groups']
  },
  AP_VI_3WAY: {
    menuPath: 'Accounts Payable > Invoices > Vendor invoice',
    matchingPolicy: '3-way match (invoice to PO to product receipt)',
    typicalPostings: [
      'Dr Expense/Inventory account',
      'Cr Vendor payable (AP summary account)',
      'Variance accounts for price/quantity differences'
    ],
    edgeCaseHints: [
      'Invoice exceeds PO amount by tolerance percentage',
      'Partial product receipt against full PO',
      'Multi-currency PO vs invoice mismatch',
      'Product receipt reversal after invoice matching',
      'Intercompany vendor invoice',
      'Charges on vendor invoice',
      'Zero-value lines',
      'Negative invoice (credit memo)'
    ],
    relatedSetup: ['3-way matching policy', 'Price tolerance groups', 'Matching policy override workflow']
  },
  AP_PO_RECEIPT: {
    menuPath: 'Accounts Payable > Purchase orders > All purchase orders > Receive > Product receipt',
    typicalPostings: [
      'Dr Purchase expenditure, un-invoiced',
      'Cr Purchase accrual'
    ],
    edgeCaseHints: [
      'Over-receipt beyond tolerance',
      'Under-receipt with remainder',
      'Receipt of service items (no physical receipt)',
      'Receipt against blanket PO',
      'Receipt reversal'
    ],
    relatedSetup: ['Item model groups', 'Product receipt number sequence', 'Warehouse setup']
  },
  AP_PAY_PROC: {
    menuPath: 'Accounts Payable > Payments > Vendor payment journal',
    typicalPostings: [
      'Dr Vendor payable',
      'Cr Bank account'
    ],
    edgeCaseHints: [
      'Payment proposal with multiple vendors',
      'Cash discount taken vs missed',
      'Partial payment against invoice',
      'Payment in different currency than invoice',
      'Payment method (check vs electronic)',
      'Payment hold on vendor'
    ],
    relatedSetup: ['Payment proposal parameters', 'Methods of payment', 'Bank accounts', 'Cash discount setup']
  },
  AP_PAY_JOURNAL: {
    menuPath: 'Accounts Payable > Payments > Vendor payment journal',
    typicalPostings: [
      'Dr Vendor payable',
      'Cr Bank account'
    ],
    edgeCaseHints: [
      'Manual settlement selection',
      'Cross-company payment',
      'Centralized payment processing',
      'Payment reversal'
    ],
    relatedSetup: ['Journal names', 'Settlement priority', 'Centralized payment configuration']
  },
  AP_PREPAY: {
    menuPath: 'Accounts Payable > Invoices > Prepayment invoice / Payments > Vendor payment journal',
    typicalPostings: [
      'Dr Vendor prepayment account',
      'Cr Bank account',
      'Application: Dr Vendor payable, Cr Vendor prepayment'
    ],
    edgeCaseHints: [
      'Prepayment exceeds final invoice amount',
      'Partial prepayment application',
      'Multi-currency prepayment',
      'Prepayment with tax implications'
    ],
    relatedSetup: ['Prepayment posting profiles', 'Prepayment journal names']
  },

  // ── Accounts Receivable ──
  AR_FTI: {
    menuPath: 'Accounts Receivable > Invoices > All free text invoices',
    typicalPostings: [
      'Dr Customer receivable',
      'Cr Revenue account'
    ],
    edgeCaseHints: [
      'Free text invoice with sales tax',
      'Multi-line free text invoice with different dimensions',
      'Credit note (negative free text invoice)',
      'Customer on credit hold',
      'Invoice with project reference'
    ],
    relatedSetup: ['Free text invoice templates', 'Customer posting profiles', 'Sales tax groups']
  },
  AR_SO_INV: {
    menuPath: 'Accounts Receivable > Orders > All sales orders > Invoice',
    typicalPostings: [
      'Dr Customer receivable',
      'Cr Revenue account',
      'Dr COGS, Cr Inventory (if applicable)'
    ],
    edgeCaseHints: [
      'Partial invoicing of sales order',
      'Invoice with trade/cash discounts',
      'Intercompany sales order invoicing',
      'Invoice with charges',
      'Multi-currency sales order'
    ],
    relatedSetup: ['Sales order posting profiles', 'Revenue recognition setup', 'Invoice number sequence']
  },
  AR_CUST_PAY: {
    menuPath: 'Accounts Receivable > Payments > Customer payment journal',
    typicalPostings: [
      'Dr Bank account',
      'Cr Customer receivable'
    ],
    edgeCaseHints: [
      'Overpayment handling',
      'Underpayment with write-off',
      'Cash discount taken/missed',
      'Cross-currency payment',
      'Payment against multiple invoices'
    ],
    relatedSetup: ['Customer payment journal names', 'Cash discount parameters', 'Write-off limits']
  },
  AR_COLLECT: {
    menuPath: 'Credit and collections > Collection letter > Create collection letters',
    typicalPostings: [
      'Dr Customer receivable (fees)',
      'Cr Collection letter fee revenue'
    ],
    edgeCaseHints: [
      'Collection letter sequence escalation',
      'Customer dispute on invoice',
      'Collection letter cancellation',
      'Multi-currency aging'
    ],
    relatedSetup: ['Collection letter sequence', 'Interest codes', 'Aging period definitions']
  },
  AR_CREDIT_MEMO: {
    menuPath: 'Accounts Receivable > Invoices > All free text invoices (credit)',
    typicalPostings: [
      'Dr Revenue account (reversal)',
      'Cr Customer receivable'
    ],
    edgeCaseHints: [
      'Credit memo exceeds original invoice',
      'Partial credit memo',
      'Credit memo with reason code requirement',
      'Return order credit memo'
    ],
    relatedSetup: ['Reason codes', 'Credit memo approval workflow', 'Customer credit limits']
  },
  AR_INTEREST: {
    menuPath: 'Credit and collections > Interest > Create interest notes',
    typicalPostings: [
      'Dr Customer receivable',
      'Cr Interest income'
    ],
    edgeCaseHints: [
      'Grace period calculation',
      'Interest on disputed invoices',
      'Compound interest calculation',
      'Interest waiver process'
    ],
    relatedSetup: ['Interest codes', 'Interest rate setup', 'Customer exception groups']
  },

  // ── General Ledger ──
  GL_MANUAL: {
    menuPath: 'General Ledger > Journal entries > General journals',
    typicalPostings: ['Configurable Dr/Cr based on journal purpose'],
    edgeCaseHints: [
      'Unbalanced journal entry attempt',
      'Journal with financial dimensions validation',
      'Intercompany journal entry',
      'Reversing journal entry',
      'Journal approval workflow'
    ],
    relatedSetup: ['Journal names', 'Journal approval policies', 'Financial dimension sets']
  },
  GL_PERIOD_CLOSE: {
    menuPath: 'General Ledger > Period close > Period close workspace',
    typicalPostings: ['Accrual entries', 'Reclassification entries'],
    edgeCaseHints: [
      'Closing to wrong period',
      'Posting to closed period attempt',
      'Foreign currency revaluation at period end',
      'Subledger reconciliation mismatches'
    ],
    relatedSetup: ['Fiscal calendar', 'Period status', 'Closing sheet templates']
  },
  GL_ALLOCATION: {
    menuPath: 'General Ledger > Allocations > Ledger allocation rules',
    typicalPostings: ['Dr/Cr allocation accounts based on rules'],
    edgeCaseHints: [
      'Allocation basis with zero balance',
      'Circular allocation rules',
      'Allocation across legal entities',
      'Allocation reversal'
    ],
    relatedSetup: ['Allocation rules', 'Allocation basis', 'Financial dimension sets']
  },
  GL_CONSOL: {
    menuPath: 'General Ledger > Consolidations > Consolidate online/with import',
    typicalPostings: ['Elimination entries', 'Currency translation adjustments'],
    edgeCaseHints: [
      'Intercompany elimination mismatches',
      'Currency translation differences',
      'Minority interest calculations',
      'Consolidation with different fiscal calendars'
    ],
    relatedSetup: ['Consolidation groups', 'Elimination rules', 'Translation methods']
  },
  GL_FIN_REPORT: {
    menuPath: 'General Ledger > Inquiries and reports > Financial reports',
    typicalPostings: [],
    edgeCaseHints: [
      'Report with zero-balance accounts',
      'Multi-currency report conversion',
      'Report with dimension filters',
      'Year-over-year comparison accuracy'
    ],
    relatedSetup: ['Financial report designer', 'Row/Column definitions', 'Reporting trees']
  },
  GL_YEAR_END: {
    menuPath: 'General Ledger > Period close > Year end close',
    typicalPostings: [
      'Dr/Cr Income summary (P&L accounts to retained earnings)',
      'Opening balance entries for balance sheet accounts'
    ],
    edgeCaseHints: [
      'Multiple close runs (re-close)',
      'Retained earnings account with dimensions',
      'Year-end close with open transactions',
      'Close with different fiscal year setup per legal entity'
    ],
    relatedSetup: ['Year-end close parameters', 'Retained earnings main account', 'Financial dimension close setup']
  },

  // ── Cash & Bank ──
  CASH_BANK_RECON: {
    menuPath: 'Cash and bank management > Bank statement reconciliation',
    typicalPostings: ['Bank clearing entries', 'Unreconciled transaction adjustments'],
    edgeCaseHints: [
      'Statement with unmatched transactions',
      'Duplicate bank transactions',
      'Foreign currency bank account reconciliation',
      'Statement import format errors'
    ],
    relatedSetup: ['Bank account setup', 'Bank transaction types', 'Reconciliation matching rules']
  },
  CASH_BANK_PAY: {
    menuPath: 'Cash and bank management > Bank payment journal',
    typicalPostings: ['Dr Target account, Cr Source bank account'],
    edgeCaseHints: [
      'Insufficient bank balance',
      'Cross-currency bank transfer',
      'Bank transfer fees',
      'Transfer between legal entities'
    ],
    relatedSetup: ['Bank accounts', 'Methods of payment', 'Payment status workflow']
  },
  CASH_ADV_RECON: {
    menuPath: 'Cash and bank management > Bank statement reconciliation > Advanced bank reconciliation',
    typicalPostings: ['Matching rule postings', 'Auto-generated correction entries'],
    edgeCaseHints: [
      'Complex matching rules with tolerances',
      'Mark as new transactions from statement',
      'Reconciliation worksheet save vs post',
      'Large volume statement processing'
    ],
    relatedSetup: ['Advanced bank reconciliation setup', 'Matching rules', 'Bank statement formats']
  },
  CASH_POSITION: {
    menuPath: 'Cash and bank management > Inquiries > Cash position',
    typicalPostings: [],
    edgeCaseHints: [
      'Cash position with pending transactions',
      'Multi-currency cash position conversion',
      'Cash flow forecast accuracy',
      'Pooled bank account reporting'
    ],
    relatedSetup: ['Cash flow setup', 'Bank account groups', 'Cash position parameters']
  },

  // ── Fixed Assets ──
  FA_ACQUIRE: {
    menuPath: 'Fixed assets > Fixed assets > Fixed assets (list) > Acquisition',
    typicalPostings: [
      'Dr Fixed asset (acquisition account)',
      'Cr Bank/AP/Offset account'
    ],
    edgeCaseHints: [
      'Acquisition via purchase order',
      'Acquisition via free text invoice',
      'Asset with multiple value models/books',
      'Low-value asset threshold',
      'Acquisition in foreign currency'
    ],
    relatedSetup: ['Fixed asset groups', 'Value models/Depreciation books', 'Acquisition posting profiles']
  },
  FA_DEPREC: {
    menuPath: 'Fixed assets > Journal entries > Depreciation proposal',
    typicalPostings: [
      'Dr Depreciation expense',
      'Cr Accumulated depreciation'
    ],
    edgeCaseHints: [
      'Mid-period acquisition depreciation calculation',
      'Depreciation method change mid-life',
      'Suspended depreciation',
      'Bonus depreciation',
      'Asset fully depreciated'
    ],
    relatedSetup: ['Depreciation profiles', 'Depreciation conventions', 'Depreciation run schedule']
  },
  FA_DISPOSE: {
    menuPath: 'Fixed assets > Fixed assets > Disposal',
    typicalPostings: [
      'Dr Bank/AR (proceeds)',
      'Dr Accumulated depreciation',
      'Dr/Cr Gain or Loss on disposal',
      'Cr Fixed asset (acquisition value)'
    ],
    edgeCaseHints: [
      'Disposal with gain',
      'Disposal with loss (scrap)',
      'Partial disposal',
      'Disposal of intercompany asset'
    ],
    relatedSetup: ['Disposal posting profiles', 'Sales tax on asset disposal']
  },
  FA_TRANSFER: {
    menuPath: 'Fixed assets > Fixed assets > Transfer fixed assets',
    typicalPostings: [
      'Dr FA account (target dimensions)',
      'Cr FA account (source dimensions)'
    ],
    edgeCaseHints: [
      'Transfer across legal entities',
      'Transfer with accumulated depreciation',
      'Transfer changing depreciation group',
      'Bulk asset transfer'
    ],
    relatedSetup: ['Transfer rules', 'Intercompany fixed asset transfer setup']
  },
  FA_REVAL: {
    menuPath: 'Fixed assets > Journal entries > Revaluation',
    typicalPostings: [
      'Write-up: Dr FA, Cr Revaluation reserve',
      'Impairment: Dr Impairment loss, Cr FA'
    ],
    edgeCaseHints: [
      'Revaluation exceeding original cost',
      'Impairment reversal',
      'Revaluation impact on depreciation schedule',
      'Group revaluation'
    ],
    relatedSetup: ['Revaluation profiles', 'Impairment indicators']
  },

  // ── Project Accounting ──
  PROJ_EXPENSE: {
    menuPath: 'Project management and accounting > Journals > Expense',
    typicalPostings: [
      'Dr Project cost account',
      'Cr Offset/Bank account'
    ],
    edgeCaseHints: [
      'Expense to fixed-price project vs T&M project',
      'Expense category validation',
      'Expense with sales tax',
      'Intercompany expense posting',
      'Expense exceeding project budget'
    ],
    relatedSetup: ['Project categories', 'Project groups', 'Line properties']
  },
  PROJ_HOUR: {
    menuPath: 'Project management and accounting > Journals > Hour',
    typicalPostings: [
      'Dr Project cost (WIP or expense)',
      'Cr Payroll allocation/Offset'
    ],
    edgeCaseHints: [
      'Hours exceeding project budget',
      'Hours posted to closed project',
      'Timesheet approval workflow',
      'Hours with different cost rates by worker'
    ],
    relatedSetup: ['Cost price setup', 'Hour journal names', 'Project validation rules']
  },
  PROJ_REVENUE: {
    menuPath: 'Project management and accounting > Periodic > Estimates > Post estimates',
    typicalPostings: [
      'Dr Accrued revenue (WIP)',
      'Cr Revenue recognition account'
    ],
    edgeCaseHints: [
      'Revenue recognition on completed-contract method',
      'Percentage-of-completion calculation accuracy',
      'Revenue reversal on estimate adjustment',
      'Multi-element arrangement revenue split'
    ],
    relatedSetup: ['Estimate system setup', 'Revenue recognition rules', 'Completion method']
  },
  PROJ_WIP: {
    menuPath: 'Project management and accounting > Periodic > WIP > Calculate WIP',
    typicalPostings: [
      'Dr WIP account',
      'Cr WIP offset (cost/revenue recognition)'
    ],
    edgeCaseHints: [
      'WIP reversal',
      'WIP on project with no costs',
      'WIP calculation with budget overrun',
      'Multi-funding-source WIP allocation'
    ],
    relatedSetup: ['WIP cost templates', 'Project groups with WIP settings']
  },
  PROJ_INV_PROP: {
    menuPath: 'Project management and accounting > Project invoices > Project invoice proposals',
    typicalPostings: [
      'Dr Customer receivable',
      'Cr Project revenue',
      'Dr WIP reversal accounts'
    ],
    edgeCaseHints: [
      'Invoice proposal with retainage',
      'Milestone billing invoice',
      'Invoice exceeding funding limit',
      'Invoice with advance deduction',
      'Multi-currency project invoice'
    ],
    relatedSetup: ['Invoice proposal parameters', 'Billing rules', 'Funding sources']
  }
};

/**
 * Get domain knowledge for a specific process to enrich the AI prompt.
 * @param {string} processId - Process identifier (e.g., 'AP_VI_3WAY')
 * @returns {object|null} Knowledge object or null if not found
 */
export function getProcessKnowledge(processId) {
  return PROCESS_KNOWLEDGE[processId] || null;
}

/**
 * Build an enriched context string for the AI prompt.
 * @param {string} processId
 * @param {object} processInfo - { name, description, module, bpcSequenceId }
 * @returns {string} Formatted knowledge context
 */
export function buildKnowledgeContext(processId, processInfo) {
  const knowledge = PROCESS_KNOWLEDGE[processId];
  if (!knowledge) return '';

  let context = `\n--- D365FO Process Knowledge ---\n`;
  context += `Process: ${processInfo.name}\n`;
  context += `Module: ${processInfo.module}\n`;
  context += `BPC Sequence ID: ${processInfo.bpcSequenceId}\n`;

  if (knowledge.menuPath) {
    context += `D365FO Menu Path: ${knowledge.menuPath}\n`;
  }

  if (knowledge.matchingPolicy) {
    context += `Matching Policy: ${knowledge.matchingPolicy}\n`;
  }

  if (knowledge.typicalPostings?.length) {
    context += `\nTypical GL Postings:\n`;
    knowledge.typicalPostings.forEach(p => { context += `  • ${p}\n`; });
  }

  if (knowledge.edgeCaseHints?.length) {
    context += `\nEdge Case Scenarios to Cover:\n`;
    knowledge.edgeCaseHints.forEach(e => { context += `  • ${e}\n`; });
  }

  if (knowledge.relatedSetup?.length) {
    context += `\nRelated D365FO Setup:\n`;
    knowledge.relatedSetup.forEach(s => { context += `  • ${s}\n`; });
  }

  context += `--- End Knowledge ---\n`;
  return context;
}
