import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ClipboardList, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

function TestCaseCard({ tc, index }) {
  const [isPrecondOpen, setIsPrecondOpen] = useState(false);
  const [isTestDataOpen, setIsTestDataOpen] = useState(false);
  const [isEdgeCasesOpen, setIsEdgeCasesOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const priorityColor = tc.priority?.includes('P1') 
    ? 'badge-p1' 
    : tc.priority?.includes('P2') ? 'badge-p2' : 'badge-p3';

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(tc, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card flex flex-col overflow-hidden animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
      {/* Header */}
      <div className="p-4 bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-blue">{tc.testID}</span>
            <span className={`badge ${priorityColor}`}>{tc.priority}</span>
            <span className="badge badge-emerald">{tc.estimatedEffort}</span>
          </div>
          <h3 className="font-bold text-lg">{tc.processName}</h3>
          <span className="text-sm text-gray-500">{tc.processModule}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="btn-ghost text-gray-400 hover:text-blue-500"
          title="Copy JSON"
        >
          {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Preconditions */}
        <div className="border border-gray-200 dark:border-slate-700 rounded-md overflow-hidden">
          <button 
            className="w-full flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-semibold"
            onClick={() => setIsPrecondOpen(!isPrecondOpen)}
          >
            Preconditions
            {isPrecondOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <div className={`collapsible-content ${isPrecondOpen ? 'open' : ''} p-3 bg-white dark:bg-slate-900`}>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {tc.preconditions?.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        </div>

        {/* Test Data */}
        <div className="border border-gray-200 dark:border-slate-700 rounded-md overflow-hidden">
          <button 
            className="w-full flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-semibold"
            onClick={() => setIsTestDataOpen(!isTestDataOpen)}
          >
            Test Data
            {isTestDataOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <div className={`collapsible-content ${isTestDataOpen ? 'open' : ''} bg-white dark:bg-slate-900`}>
            <table className="w-full text-sm text-left">
              <tbody>
                {tc.testData && Object.entries(tc.testData).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50 dark:bg-slate-800/50'}>
                    <td className="p-2 border-b border-gray-200 dark:border-slate-700 font-medium text-gray-600 dark:text-gray-400 w-1/3">{key}</td>
                    <td className="p-2 border-b border-gray-200 dark:border-slate-700">{String(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Execution Steps */}
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Execution Steps</h4>
          <div className="border border-gray-200 dark:border-slate-700 rounded-md overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700">
                <tr>
                  <th className="p-2 w-12 font-semibold">#</th>
                  <th className="p-2 w-5/12 font-semibold">Action</th>
                  <th className="p-2 font-semibold">Expected Result</th>
                </tr>
              </thead>
              <tbody>
                {tc.executionSteps?.map((step, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-gray-50 dark:bg-slate-800/50'}>
                    <td className="p-2 border-b border-gray-200 dark:border-slate-700 text-center font-medium">{step.stepNumber}</td>
                    <td className="p-2 border-b border-gray-200 dark:border-slate-700">{step.action}</td>
                    <td className="p-2 border-b border-gray-200 dark:border-slate-700">{step.expectedResult}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edge Cases */}
        {tc.edgeCases && tc.edgeCases.length > 0 && (
          <div className="border border-gray-200 dark:border-slate-700 rounded-md overflow-hidden">
            <button 
              className="w-full flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 text-sm font-semibold"
              onClick={() => setIsEdgeCasesOpen(!isEdgeCasesOpen)}
            >
              Edge Cases & Negative Scenarios
              <div className="flex items-center gap-2">
                <span className="badge badge-amber">{tc.edgeCases.length}</span>
                {isEdgeCasesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </button>
            <div className={`collapsible-content ${isEdgeCasesOpen ? 'open' : ''} p-3 flex flex-col gap-3 bg-white dark:bg-slate-900`}>
              {tc.edgeCases.map((ec, i) => (
                <div key={i} className="p-3 border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10 rounded-md text-sm">
                  <div className="font-semibold text-amber-800 dark:text-amber-400 mb-2">{ec.scenario}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 block">Action</span>
                      {ec.action}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 block">Expected Result</span>
                      {ec.expectedResult}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {tc.notes && (
          <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-md text-sm italic text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700">
            <strong>Notes: </strong>{tc.notes}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestCasePreview({ testCases }) {
  if (!testCases || testCases.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 animate-fade-in">
        <ClipboardList size={64} className="mb-4 opacity-50" />
        <h3 className="text-xl font-medium mb-2">No Test Cases Yet</h3>
        <p className="text-center max-w-md">
          Select a process from the sidebar, configure your context, and click Generate to create AI-powered test cases.
        </p>
      </div>
    );
  }

  const p1Count = testCases.filter(tc => tc.priority?.includes('P1')).length;
  const p2Count = testCases.filter(tc => tc.priority?.includes('P2')).length;
  const p3Count = testCases.filter(tc => tc.priority?.includes('P3')).length;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 pb-24">
      <div className="glass p-4 rounded-lg flex flex-wrap items-center gap-4 sticky top-4 z-10 animate-fade-in shadow-md">
        <div className="font-semibold text-lg flex items-center gap-2">
          <ClipboardList size={20} className="text-blue-500" />
          {testCases.length} Test Cases Generated
        </div>
        <div className="h-6 w-px bg-gray-300 dark:bg-slate-600 hidden sm:block"></div>
        <div className="flex gap-2">
          <span className="badge badge-p1">P1: {p1Count}</span>
          <span className="badge badge-p2">P2: {p2Count}</span>
          <span className="badge badge-p3">P3: {p3Count}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {testCases.map((tc, index) => (
          <TestCaseCard key={tc.testID || index} tc={tc} index={index} />
        ))}
      </div>
    </div>
  );
}

TestCaseCard.propTypes = {
  tc: PropTypes.shape({
    testID: PropTypes.string,
    processName: PropTypes.string,
    processModule: PropTypes.string,
    priority: PropTypes.string,
    estimatedEffort: PropTypes.string,
    preconditions: PropTypes.arrayOf(PropTypes.string),
    testData: PropTypes.object,
    executionSteps: PropTypes.arrayOf(PropTypes.shape({
      stepNumber: PropTypes.number,
      action: PropTypes.string,
      expectedResult: PropTypes.string
    })),
    edgeCases: PropTypes.arrayOf(PropTypes.shape({
      scenario: PropTypes.string,
      action: PropTypes.string,
      expectedResult: PropTypes.string
    })),
    notes: PropTypes.string
  }).isRequired,
  index: PropTypes.number.isRequired,
};

TestCasePreview.propTypes = {
  testCases: PropTypes.array
};
