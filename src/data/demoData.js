export const DEMO_CONTEXT = {
  processId: 'AP_VI_3WAY',
  legalEntityCount: 2,
  hasCustomisations: false,
  customisationDetails: '',
  integrations: ['OANDA'],
  currencies: ['USD', 'EUR', 'GBP'],
  multiCountryRollout: false,
  additionalNotes: ''
};

export const DEMO_TEST_CASES = {
  testCases: [
    {
      testID: "AP_VI_001",
      processName: "Vendor invoice posting - 3-way match",
      processModule: "Accounts Payable",
      preconditions: [
        "Vendor master created with payment terms set to Net 30",
        "Purchase order created and approved for GBP 10,000",
        "Product receipt posted against PO",
        "3-way matching policy configured in AP parameters",
        "Price tolerance group assigned to vendor"
      ],
      testData: {
        vendorAccount: "VENDOR001",
        invoiceAmount: 10000,
        invoiceCurrency: "GBP",
        invoiceDate: "2025-06-17",
        lineCount: 1,
        lineDescription: "Office supplies - bulk order",
        purchaseOrder: "PO-2025-001",
        productReceipt: "PR-2025-001"
      },
      executionSteps: [
        {
          stepNumber: 1,
          action: "Navigate to Accounts Payable > Invoices > Vendor invoice",
          expectedResult: "Vendor invoice entry form opens with blank header"
        },
        {
          stepNumber: 2,
          action: "Enter vendor account VENDOR001",
          expectedResult: "System populates vendor name, payment terms (Net 30), currency (GBP) from vendor master"
        },
        {
          stepNumber: 3,
          action: "Enter invoice number INV-2025-001, date 17 Jun 2025, amount GBP 10,000",
          expectedResult: "Invoice header populated; system shows 'Pending 3-way match' status"
        },
        {
          stepNumber: 4,
          action: "Click 'Match to receipt' button and select PO-2025-001",
          expectedResult: "System displays PO line GBP 10,000 with product receipt PR-2025-001; match summary shows 0 variance"
        },
        {
          stepNumber: 5,
          action: "Click 'Post' button",
          expectedResult: "Journal entry posted; GL shows Dr Expense 10,000, Cr Vendor Payable 10,000; Voucher number generated; Invoice status changes to 'Paid'"
        }
      ],
      edgeCases: [
        {
          scenario: "Invoice amount exceeds PO by 5%",
          action: "Post invoice for GBP 10,500 against GBP 10,000 PO",
          expectedResult: "System flags price variance; requires approval; posts to variance account if tolerance exceeded"
        },
        {
          scenario: "Multi-currency mismatch",
          action: "PO in GBP, invoice in USD at spot rate",
          expectedResult: "System requires exchange rate entry; calculates variance in functional currency"
        },
        {
          scenario: "Partial receipt",
          action: "PO GBP 10,000, receipt GBP 7,500, invoice GBP 10,000",
          expectedResult: "System blocks match; message 'Receipt qty does not match invoice qty'"
        }
      ],
      priority: "P1 - Critical path",
      estimatedEffort: "15 minutes",
      notes: "Covers standard 3-way match scenario. Assumes no approval workflows or hold rules."
    },
    {
      testID: "AP_VI_002",
      processName: "Vendor invoice posting - 3-way match (Multi-currency)",
      processModule: "Accounts Payable",
      preconditions: [
        "Vendor master created with EUR as default currency",
        "Purchase order created in EUR for €5,000",
        "Product receipt posted against PO",
        "Exchange rate configured for EUR/USD in Currency exchange rates",
        "Functional currency set to USD for legal entity"
      ],
      testData: {
        vendorAccount: "VENDOR002",
        invoiceAmount: 5000,
        invoiceCurrency: "EUR",
        invoiceDate: "2025-06-17",
        lineCount: 1,
        lineDescription: "IT equipment - server components",
        exchangeRate: 1.0850,
        functionalCurrencyAmount: 5425
      },
      executionSteps: [
        {
          stepNumber: 1,
          action: "Navigate to Accounts Payable > Invoices > Vendor invoice",
          expectedResult: "Vendor invoice entry form opens"
        },
        {
          stepNumber: 2,
          action: "Enter vendor account VENDOR002, verify currency defaults to EUR",
          expectedResult: "System populates EUR as transaction currency; exchange rate auto-populated from rate table"
        },
        {
          stepNumber: 3,
          action: "Enter invoice number INV-2025-002, amount EUR 5,000",
          expectedResult: "System calculates functional currency equivalent USD 5,425.00 at rate 1.0850"
        },
        {
          stepNumber: 4,
          action: "Match to purchase order and product receipt, then post",
          expectedResult: "Journal posted with Dr Expense USD 5,425, Cr Vendor Payable EUR 5,000 (USD 5,425); Exchange rate recorded on voucher"
        }
      ],
      edgeCases: [
        {
          scenario: "Exchange rate change between PO and invoice date",
          action: "PO at rate 1.0800, invoice at rate 1.0850",
          expectedResult: "System calculates exchange rate variance; posts to realized gain/loss account"
        },
        {
          scenario: "Manual exchange rate override",
          action: "Override system rate with custom rate 1.0900",
          expectedResult: "System recalculates functional currency amount; audit trail shows manual override"
        }
      ],
      priority: "P1 - Critical path",
      estimatedEffort: "20 minutes",
      notes: "Tests multi-currency handling with EUR/USD. Requires exchange rate table setup."
    },
    {
      testID: "AP_VI_003",
      processName: "Vendor invoice posting - 3-way match (Intercompany)",
      processModule: "Accounts Payable",
      preconditions: [
        "Two legal entities configured (LE01 and LE02)",
        "Intercompany trading relationship established between LE01 and LE02",
        "Intercompany AP/AR accounts configured in posting profiles",
        "Purchase order created in LE01 referencing LE02 as intercompany vendor"
      ],
      testData: {
        vendorAccount: "IC-VENDOR-LE02",
        invoiceAmount: 25000,
        invoiceCurrency: "USD",
        invoiceDate: "2025-06-17",
        lineCount: 3,
        lineDescription: "Intercompany services - Q2 allocation",
        sourceEntity: "LE01",
        targetEntity: "LE02"
      },
      executionSteps: [
        {
          stepNumber: 1,
          action: "In LE01: Navigate to AP > Invoices > Vendor invoice, select intercompany vendor IC-VENDOR-LE02",
          expectedResult: "System identifies intercompany vendor; shows intercompany indicator on invoice form"
        },
        {
          stepNumber: 2,
          action: "Enter invoice details: USD 25,000 across 3 lines with appropriate categories",
          expectedResult: "Lines populated with intercompany dimensions; due-to/due-from accounts auto-assigned"
        },
        {
          stepNumber: 3,
          action: "Post the intercompany invoice",
          expectedResult: "LE01: Dr Expense 25,000, Cr IC Payable 25,000; LE02: Dr IC Receivable 25,000, Cr Revenue 25,000; Both vouchers cross-referenced"
        }
      ],
      edgeCases: [
        {
          scenario: "Intercompany elimination at consolidation",
          action: "Run consolidation after posting intercompany invoice",
          expectedResult: "Elimination entries generated; IC Payable and IC Receivable net to zero in consolidated view"
        }
      ],
      priority: "P2 - High",
      estimatedEffort: "25 minutes",
      notes: "Tests intercompany posting across 2 legal entities. Requires intercompany setup completion."
    },
    {
      testID: "AP_VI_004",
      processName: "Vendor invoice posting - 3-way match (Negative test: No receipt)",
      processModule: "Accounts Payable",
      preconditions: [
        "Vendor master created",
        "Purchase order created and approved for USD 15,000",
        "Product receipt NOT posted against PO",
        "3-way matching policy active"
      ],
      testData: {
        vendorAccount: "VENDOR003",
        invoiceAmount: 15000,
        invoiceCurrency: "USD",
        invoiceDate: "2025-06-17",
        lineCount: 1,
        lineDescription: "Consulting services - Phase 1"
      },
      executionSteps: [
        {
          stepNumber: 1,
          action: "Navigate to AP > Invoices > Vendor invoice, enter VENDOR003",
          expectedResult: "Vendor invoice form opens"
        },
        {
          stepNumber: 2,
          action: "Enter invoice USD 15,000 and attempt to match to PO",
          expectedResult: "System shows PO line but no product receipt available for matching"
        },
        {
          stepNumber: 3,
          action: "Attempt to post invoice",
          expectedResult: "System blocks posting with error: '3-way match required - product receipt not found for PO line'; Invoice remains in 'Pending' status"
        }
      ],
      edgeCases: [
        {
          scenario: "Override matching policy",
          action: "Manager overrides 3-way match to 2-way match via approval workflow",
          expectedResult: "Invoice posts with override audit trail; Match variance flagged in match history"
        }
      ],
      priority: "P1 - Critical path",
      estimatedEffort: "10 minutes",
      notes: "Negative test - validates that 3-way match policy blocks posting without product receipt."
    },
    {
      testID: "AP_VI_005",
      processName: "Vendor invoice posting - 3-way match (Boundary: Zero amount line)",
      processModule: "Accounts Payable",
      preconditions: [
        "Vendor master created",
        "Purchase order with zero-value line (e.g., free sample item)",
        "Product receipt posted for zero-value line"
      ],
      testData: {
        vendorAccount: "VENDOR001",
        invoiceAmount: 0,
        invoiceCurrency: "USD",
        invoiceDate: "2025-06-17",
        lineCount: 1,
        lineDescription: "Free sample - promotional item"
      },
      executionSteps: [
        {
          stepNumber: 1,
          action: "Create vendor invoice with zero amount line against PO",
          expectedResult: "System accepts zero-value line"
        },
        {
          stepNumber: 2,
          action: "Match to receipt and post",
          expectedResult: "System posts zero-value voucher; GL entries show Dr/Cr of 0.00; Voucher number generated for audit trail"
        }
      ],
      edgeCases: [
        {
          scenario: "Negative invoice amount",
          action: "Enter invoice with amount -500",
          expectedResult: "System treats as credit memo; reverses normal posting direction"
        }
      ],
      priority: "P3 - Edge case",
      estimatedEffort: "10 minutes",
      notes: "Boundary value test - zero amount line processing."
    },
    {
      testID: "AP_VI_006",
      processName: "Vendor invoice posting - 3-way match (OANDA integration)",
      processModule: "Accounts Payable",
      preconditions: [
        "OANDA exchange rate provider configured in Currency exchange rate providers",
        "Automatic exchange rate import job scheduled or manually triggered",
        "Vendor with multi-currency transactions configured"
      ],
      testData: {
        vendorAccount: "VENDOR002",
        invoiceAmount: 8500,
        invoiceCurrency: "GBP",
        invoiceDate: "2025-06-17",
        lineCount: 2,
        lineDescription: "Professional services - cross-border",
        exchangeRateSource: "OANDA"
      },
      executionSteps: [
        {
          stepNumber: 1,
          action: "Navigate to GL > Currencies > Currency exchange rates, verify OANDA rates are imported for today's date",
          expectedResult: "Exchange rates table shows GBP/USD, EUR/USD rates from OANDA with today's date stamp"
        },
        {
          stepNumber: 2,
          action: "Create vendor invoice in GBP, verify exchange rate auto-populates from OANDA import",
          expectedResult: "System uses OANDA-sourced rate; rate source indicator shows 'OANDA' on invoice"
        },
        {
          stepNumber: 3,
          action: "Match to PO and receipt, post invoice",
          expectedResult: "Invoice posted using OANDA exchange rate; functional currency amount calculated correctly; Rate source logged in voucher details"
        }
      ],
      edgeCases: [
        {
          scenario: "OANDA rate import failure",
          action: "Post invoice when OANDA import has not run for today",
          expectedResult: "System uses last available rate with warning; or blocks posting if 'Rate required' policy is strict"
        }
      ],
      priority: "P2 - High",
      estimatedEffort: "15 minutes",
      notes: "Tests integration with OANDA exchange rate provider. Validates rate import and usage in AP posting."
    }
  ]
};
