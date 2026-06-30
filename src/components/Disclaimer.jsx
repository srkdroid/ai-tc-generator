import React, { useState } from 'react';
import { AlertTriangle, Shield, ClipboardCheck, ChevronDown, ChevronRight } from 'lucide-react';

export default function Disclaimer() {
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
      {/* AI Disclaimer Banner - Always Visible */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/30 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-start gap-3 text-sm text-amber-800 dark:text-amber-400">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <strong>AI-generated test cases — validate against your project requirements and D365FO configuration.</strong>
            <span className="opacity-80">This tool is an independent project and is not endorsed by or affiliated with Microsoft Corporation.</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Security Section */}
        <div className="card p-0 overflow-hidden bg-white dark:bg-slate-800">
          <button 
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-colors text-left font-medium text-sm"
            onClick={() => setIsSecurityOpen(!isSecurityOpen)}
          >
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-emerald-500" />
              Your Data & Security
            </div>
            {isSecurityOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          <div className={`collapsible-content ${isSecurityOpen ? 'open' : ''} px-4 pb-4`}>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2 list-none">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                Your API key is transmitted via encrypted header — never in URLs or logs.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                API key is stored locally in your browser with obfuscation — never sent to any server other than Groq's API.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                No user data or generated test cases are stored server-side.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                All processing happens in your browser and via the Groq API.
              </li>
            </ul>
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-700">
              <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">
                Manage your Groq API keys
              </a>
            </div>
          </div>
        </div>

        {/* Compliance Section */}
        <div className="card p-0 overflow-hidden bg-white dark:bg-slate-800">
          <button 
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-colors text-left font-medium text-sm"
            onClick={() => setIsComplianceOpen(!isComplianceOpen)}
          >
            <div className="flex items-center gap-2">
              <ClipboardCheck size={18} className="text-blue-500" />
              Data Sources & Compliance
            </div>
            {isComplianceOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          <div className={`collapsible-content ${isComplianceOpen ? 'open' : ''} px-4 pb-4`}>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2 list-disc pl-4">
              <li>
                Process hierarchy references the Microsoft Dynamics 365 Business Process Catalog from the <a href="https://github.com/microsoft/dynamics365patternspractices" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">dynamics365patternspractices</a> GitHub repository.
              </li>
              <li>Used for reference and retrieval only — not reproduced wholesale.</li>
              <li>Process Sequence IDs from the catalog are used for traceability with Azure DevOps.</li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
}
