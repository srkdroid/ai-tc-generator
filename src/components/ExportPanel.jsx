import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FileSpreadsheet, FileDown, CheckCircle, Trash2 } from 'lucide-react';

export default function ExportPanel({ testCases, onExportExcel, onExportCSV, onClear }) {
  const [toastMessage, setToastMessage] = useState('');

  const handleExport = (type) => {
    if (type === 'excel') {
      onExportExcel();
      setToastMessage('Exported to Excel successfully');
    } else {
      onExportCSV();
      setToastMessage('Exported to ADO CSV successfully');
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const isDisabled = !testCases || testCases.length === 0;

  return (
    <>
      <div className="fixed bottom-12 right-8 z-30 flex flex-col items-end gap-3 pointer-events-none">
        
        {!isDisabled && (
          <div className="glass px-4 py-2 rounded-full text-sm font-medium shadow-md animate-slide-up pointer-events-auto">
            {testCases.length} test cases ready for export
          </div>
        )}

        <div className="flex gap-3 pointer-events-auto">
          <button
            onClick={onClear}
            disabled={isDisabled}
            className="btn btn-outline bg-white dark:bg-slate-800 shadow-lg text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20"
            title="Clear Results"
          >
            <Trash2 size={18} />
          </button>

          <button
            onClick={() => handleExport('csv')}
            disabled={isDisabled}
            className="btn btn-primary shadow-lg"
          >
            <FileDown size={18} />
            Export to ADO CSV
          </button>
          
          <button
            onClick={() => handleExport('excel')}
            disabled={isDisabled}
            className="btn btn-success shadow-lg"
          >
            <FileSpreadsheet size={18} />
            Export to Excel
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="toast bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800">
          <CheckCircle className="text-emerald-500" size={18} />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

ExportPanel.propTypes = {
  testCases: PropTypes.array,
  onExportExcel: PropTypes.func.isRequired,
  onExportCSV: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};
