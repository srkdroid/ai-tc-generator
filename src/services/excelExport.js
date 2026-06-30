import * as XLSX from 'xlsx-js-style';

export function exportToExcel(testCases, processModule) {
  if (!testCases || testCases.length === 0) return;

  const wb = XLSX.utils.book_new();

  // Common Header Style
  const headerStyle = {
    font: { name: 'Inter', sz: 12, bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "1E3A5F" } },
    alignment: { vertical: "top", wrapText: true }
  };

  const cellStyle = (isAlternate) => ({
    font: { name: 'Inter', sz: 10 },
    fill: isAlternate ? { fgColor: { rgb: "F1F5F9" } } : undefined,
    alignment: { vertical: "top", wrapText: true }
  });

  // --- Sheet 1: Test Case Summary ---
  const summaryHeaders = ['Test ID', 'Module', 'Process', 'Priority', 'Effort', 'Preconditions', 'Notes'];
  const summaryData = [
    summaryHeaders.map(h => ({ v: h, s: headerStyle }))
  ];

  testCases.forEach((tc, index) => {
    const isAlt = index % 2 !== 0;
    const style = cellStyle(isAlt);
    
    summaryData.push([
      { v: tc.testID || '', s: style },
      { v: tc.processModule || '', s: style },
      { v: tc.processName || '', s: style },
      { v: tc.priority || '', s: style },
      { v: tc.estimatedEffort || '', s: style },
      { v: tc.preconditions ? tc.preconditions.map(p => '• ' + p).join('\n') : '', s: style },
      { v: tc.notes || '', s: style }
    ]);
  });

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  autoFitColumns(wsSummary, summaryData);
  wsSummary['!views'] = [{ state: 'frozen', ySplit: 1 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Test Case Summary");

  // --- Sheet 2: Detailed Steps ---
  const stepsHeaders = ['Test ID', 'Step #', 'Action', 'Expected Result'];
  const stepsData = [
    stepsHeaders.map(h => ({ v: h, s: headerStyle }))
  ];

  let stepRowIndex = 0;
  testCases.forEach((tc) => {
    if (tc.executionSteps) {
      tc.executionSteps.forEach(step => {
        const isAlt = stepRowIndex % 2 !== 0;
        const style = cellStyle(isAlt);
        stepsData.push([
          { v: tc.testID || '', s: style },
          { v: step.stepNumber || '', s: style },
          { v: step.action || '', s: style },
          { v: step.expectedResult || '', s: style }
        ]);
        stepRowIndex++;
      });
    }
  });

  const wsSteps = XLSX.utils.aoa_to_sheet(stepsData);
  autoFitColumns(wsSteps, stepsData);
  wsSteps['!views'] = [{ state: 'frozen', ySplit: 1 }];
  XLSX.utils.book_append_sheet(wb, wsSteps, "Detailed Steps");

  // --- Sheet 3: Edge Cases ---
  const edgeHeaders = ['Test ID', 'Scenario', 'Action', 'Expected Result'];
  const edgeData = [
    edgeHeaders.map(h => ({ v: h, s: headerStyle }))
  ];

  let edgeRowIndex = 0;
  testCases.forEach((tc) => {
    if (tc.edgeCases) {
      tc.edgeCases.forEach(ec => {
        const isAlt = edgeRowIndex % 2 !== 0;
        const style = cellStyle(isAlt);
        edgeData.push([
          { v: tc.testID || '', s: style },
          { v: ec.scenario || '', s: style },
          { v: ec.action || '', s: style },
          { v: ec.expectedResult || '', s: style }
        ]);
        edgeRowIndex++;
      });
    }
  });

  const wsEdge = XLSX.utils.aoa_to_sheet(edgeData);
  autoFitColumns(wsEdge, edgeData);
  wsEdge['!views'] = [{ state: 'frozen', ySplit: 1 }];
  XLSX.utils.book_append_sheet(wb, wsEdge, "Edge Cases");

  // --- Save File ---
  const dateStr = new Date().toISOString().split('T')[0];
  const safeModule = (processModule || 'Export').replace(/[^a-z0-9]/gi, '_');
  const fileName = `D365_TestCases_${safeModule}_${dateStr}.xlsx`;

  XLSX.writeFile(wb, fileName);
}

function autoFitColumns(ws, data) {
  const colWidths = [];
  data.forEach(row => {
    row.forEach((cell, colIdx) => {
      const val = cell.v ? cell.v.toString() : '';
      const lines = val.split('\n');
      const maxLineLen = Math.max(...lines.map(l => l.length));
      
      if (!colWidths[colIdx]) colWidths[colIdx] = 10;
      colWidths[colIdx] = Math.min(Math.max(colWidths[colIdx], maxLineLen + 2), 60);
    });
  });
  
  ws['!cols'] = colWidths.map(w => ({ wch: w }));
}
