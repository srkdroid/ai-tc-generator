export const PROCESS_TREE = [
  {
    id: 'AP',
    name: 'Accounts Payable',
    icon: 'FileText',
    bpcSequencePrefix: '10.11',
    processes: [
      {
        id: 'AP_VI_2WAY',
        name: 'Vendor invoice posting (2-way match)',
        bpcSequenceId: '10.11.10.1',
        description: 'Post vendor invoices with 2-way matching (invoice to PO)',
        keywords: ['vendor invoice', '2-way match', 'purchase order', 'AP invoice']
      },
      {
        id: 'AP_VI_3WAY',
        name: 'Vendor invoice posting (3-way match)',
        bpcSequenceId: '10.11.10.2',
        description: 'Post vendor invoices with 3-way matching (invoice to PO to product receipt)',
        keywords: ['vendor invoice', '3-way match', 'product receipt', 'matching policy']
      },
      {
        id: 'AP_PO_RECEIPT',
        name: 'Purchase order product receipt',
        bpcSequenceId: '10.11.11.1',
        description: 'Post product receipts against purchase orders',
        keywords: ['product receipt', 'purchase order', 'goods receipt', 'packing slip']
      },
      {
        id: 'AP_PAY_PROC',
        name: 'Vendor payment processing',
        bpcSequenceId: '10.11.12.1',
        description: 'Process vendor payments via payment proposal and journal',
        keywords: ['vendor payment', 'payment proposal', 'payment journal', 'AP payment']
      },
      {
        id: 'AP_PAY_JOURNAL',
        name: 'Vendor payment journal',
        bpcSequenceId: '10.11.12.2',
        description: 'Manual vendor payment journal entry and posting',
        keywords: ['payment journal', 'manual payment', 'vendor settlement']
      },
      {
        id: 'AP_PREPAY',
        name: 'Prepayment handling',
        bpcSequenceId: '10.11.13.1',
        description: 'Create and apply vendor prepayments against invoices',
        keywords: ['prepayment', 'advance payment', 'prepayment invoice', 'application']
      }
    ]
  },
  {
    id: 'AR',
    name: 'Accounts Receivable',
    icon: 'Receipt',
    bpcSequencePrefix: '10.12',
    processes: [
      {
        id: 'AR_FTI',
        name: 'Free text invoice',
        bpcSequenceId: '10.12.10.1',
        description: 'Create and post free text invoices for non-order-based billing',
        keywords: ['free text invoice', 'FTI', 'non-order invoice', 'AR invoice']
      },
      {
        id: 'AR_SO_INV',
        name: 'Sales order invoice',
        bpcSequenceId: '10.12.10.2',
        description: 'Post invoices against sales orders',
        keywords: ['sales order', 'sales invoice', 'order invoice', 'billing']
      },
      {
        id: 'AR_CUST_PAY',
        name: 'Customer payment journal',
        bpcSequenceId: '10.12.11.1',
        description: 'Record and settle customer payments via payment journal',
        keywords: ['customer payment', 'payment journal', 'settlement', 'cash receipt']
      },
      {
        id: 'AR_COLLECT',
        name: 'Collection letter processing',
        bpcSequenceId: '10.12.12.1',
        description: 'Generate and process collection letters for overdue invoices',
        keywords: ['collection letter', 'dunning', 'overdue', 'collections']
      },
      {
        id: 'AR_CREDIT_MEMO',
        name: 'Credit memo',
        bpcSequenceId: '10.12.13.1',
        description: 'Create and post credit memos (credit notes) against customer invoices',
        keywords: ['credit memo', 'credit note', 'return', 'adjustment']
      },
      {
        id: 'AR_INTEREST',
        name: 'Interest note',
        bpcSequenceId: '10.12.14.1',
        description: 'Calculate and post interest notes for overdue customer balances',
        keywords: ['interest note', 'interest calculation', 'overdue interest', 'finance charge']
      }
    ]
  },
  {
    id: 'GL',
    name: 'General Ledger',
    icon: 'BookOpen',
    bpcSequencePrefix: '10.10',
    processes: [
      {
        id: 'GL_MANUAL',
        name: 'Manual journal entry',
        bpcSequenceId: '10.10.10.1',
        description: 'Create and post manual general journal entries',
        keywords: ['general journal', 'manual entry', 'journal voucher', 'GL entry']
      },
      {
        id: 'GL_PERIOD_CLOSE',
        name: 'Period close adjustments',
        bpcSequenceId: '10.10.11.1',
        description: 'Process period-end closing entries and adjustments',
        keywords: ['period close', 'closing entries', 'adjustments', 'month-end']
      },
      {
        id: 'GL_ALLOCATION',
        name: 'Allocation journals',
        bpcSequenceId: '10.10.12.1',
        description: 'Configure and run ledger allocation rules and journals',
        keywords: ['allocation', 'cost allocation', 'allocation rules', 'distribution']
      },
      {
        id: 'GL_CONSOL',
        name: 'Consolidation',
        bpcSequenceId: '10.10.13.1',
        description: 'Financial consolidation across legal entities',
        keywords: ['consolidation', 'intercompany', 'elimination', 'group reporting']
      },
      {
        id: 'GL_FIN_REPORT',
        name: 'Financial reporting',
        bpcSequenceId: '10.10.14.1',
        description: 'Generate and validate financial reports (trial balance, P&L, balance sheet)',
        keywords: ['financial reporting', 'trial balance', 'P&L', 'balance sheet', 'financial statements']
      },
      {
        id: 'GL_YEAR_END',
        name: 'Year-end close',
        bpcSequenceId: '10.10.15.1',
        description: 'Execute year-end close process and opening balance transfer',
        keywords: ['year-end close', 'fiscal year', 'opening balances', 'retained earnings']
      }
    ]
  },
  {
    id: 'CASH',
    name: 'Cash & Bank Management',
    icon: 'Landmark',
    bpcSequencePrefix: '10.14',
    processes: [
      {
        id: 'CASH_BANK_RECON',
        name: 'Bank reconciliation',
        bpcSequenceId: '10.14.10.1',
        description: 'Standard bank statement reconciliation',
        keywords: ['bank reconciliation', 'bank statement', 'reconciliation', 'bank matching']
      },
      {
        id: 'CASH_BANK_PAY',
        name: 'Bank payment journal',
        bpcSequenceId: '10.14.11.1',
        description: 'Create and post bank payment journals',
        keywords: ['bank payment', 'payment journal', 'bank transfer', 'wire transfer']
      },
      {
        id: 'CASH_ADV_RECON',
        name: 'Advanced bank reconciliation',
        bpcSequenceId: '10.14.10.2',
        description: 'Advanced bank reconciliation with matching rules and worksheets',
        keywords: ['advanced reconciliation', 'matching rules', 'reconciliation worksheet', 'auto-match']
      },
      {
        id: 'CASH_POSITION',
        name: 'Cash position reporting',
        bpcSequenceId: '10.14.12.1',
        description: 'Review and report on cash position across bank accounts',
        keywords: ['cash position', 'cash flow', 'bank balances', 'liquidity']
      }
    ]
  },
  {
    id: 'FA',
    name: 'Fixed Assets',
    icon: 'Building2',
    bpcSequencePrefix: '10.15',
    processes: [
      {
        id: 'FA_ACQUIRE',
        name: 'Asset acquisition',
        bpcSequenceId: '10.15.10.1',
        description: 'Acquire fixed assets via purchase order or journal',
        keywords: ['asset acquisition', 'capitalize', 'fixed asset purchase', 'asset creation']
      },
      {
        id: 'FA_DEPREC',
        name: 'Depreciation run',
        bpcSequenceId: '10.15.11.1',
        description: 'Execute periodic depreciation proposals and posting',
        keywords: ['depreciation', 'depreciation run', 'depreciation proposal', 'asset depreciation']
      },
      {
        id: 'FA_DISPOSE',
        name: 'Asset disposal',
        bpcSequenceId: '10.15.12.1',
        description: 'Dispose of fixed assets (sale or scrap) with gain/loss calculation',
        keywords: ['asset disposal', 'asset sale', 'scrap', 'gain loss', 'retirement']
      },
      {
        id: 'FA_TRANSFER',
        name: 'Asset transfer',
        bpcSequenceId: '10.15.13.1',
        description: 'Transfer fixed assets between financial dimensions or legal entities',
        keywords: ['asset transfer', 'reclassification', 'dimension change', 'intercompany transfer']
      },
      {
        id: 'FA_REVAL',
        name: 'Revaluation',
        bpcSequenceId: '10.15.14.1',
        description: 'Revalue fixed assets and post adjustment entries',
        keywords: ['revaluation', 'write-up', 'write-down', 'impairment', 'asset revaluation']
      }
    ]
  },
  {
    id: 'PROJ',
    name: 'Project Accounting',
    icon: 'FolderKanban',
    bpcSequencePrefix: '10.16',
    processes: [
      {
        id: 'PROJ_EXPENSE',
        name: 'Expense journal posting',
        bpcSequenceId: '10.16.10.1',
        description: 'Post project expense journals with category and project allocation',
        keywords: ['project expense', 'expense journal', 'cost posting', 'project cost']
      },
      {
        id: 'PROJ_HOUR',
        name: 'Hour journal posting',
        bpcSequenceId: '10.16.10.2',
        description: 'Post hour/time journals against projects',
        keywords: ['hour journal', 'timesheet', 'time posting', 'project hours']
      },
      {
        id: 'PROJ_REVENUE',
        name: 'Revenue recognition',
        bpcSequenceId: '10.16.11.1',
        description: 'Run revenue recognition estimates and post accrued revenue',
        keywords: ['revenue recognition', 'accrued revenue', 'estimate', 'project revenue']
      },
      {
        id: 'PROJ_WIP',
        name: 'WIP calculation',
        bpcSequenceId: '10.16.12.1',
        description: 'Calculate and post work-in-progress (WIP) for projects',
        keywords: ['WIP', 'work in progress', 'WIP calculation', 'project WIP']
      },
      {
        id: 'PROJ_INV_PROP',
        name: 'Project invoice proposal',
        bpcSequenceId: '10.16.13.1',
        description: 'Create and post project invoice proposals for billing',
        keywords: ['invoice proposal', 'project billing', 'project invoice', 'billing proposal']
      }
    ]
  }
];

export const getProcessById = (processId) => {
  for (const module of PROCESS_TREE) {
    const process = module.processes.find(p => p.id === processId);
    if (process) {
      return { ...process, module: module.name, moduleId: module.id };
    }
  }
  return null;
};

export const searchProcesses = (query) => {
  const lowerQuery = query.toLowerCase();
  const results = [];
  for (const module of PROCESS_TREE) {
    for (const process of module.processes) {
      if (
        process.name.toLowerCase().includes(lowerQuery) ||
        process.description.toLowerCase().includes(lowerQuery) ||
        process.keywords.some(k => k.toLowerCase().includes(lowerQuery))
      ) {
        results.push({ ...process, module: module.name, moduleId: module.id });
      }
    }
  }
  return results;
};
