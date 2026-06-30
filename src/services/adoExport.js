export function exportToAdoCsv(testCases, processModule) {
  if (!testCases || testCases.length === 0) return;

  const headers = ['Work Item Type', 'Title', 'Description', 'Acceptance Criteria', 'Priority', 'Tags'];
  
  const escapeCsv = (str) => {
    if (str == null) return '';
    const stringified = String(str);
    if (stringified.includes(',') || stringified.includes('"') || stringified.includes('\n')) {
      return `"${stringified.replace(/"/g, '""')}"`;
    }
    return stringified;
  };

  const rows = [headers.map(escapeCsv).join(',')];

  testCases.forEach(tc => {
    // Priority mapping
    let priorityNum = '';
    if (tc.priority) {
      if (tc.priority.includes('P1')) priorityNum = '1';
      else if (tc.priority.includes('P2')) priorityNum = '2';
      else if (tc.priority.includes('P3')) priorityNum = '3';
    }

    // Build Description HTML
    let description = '';
    if (tc.preconditions && tc.preconditions.length > 0) {
      description += '<h3>Preconditions</h3><ul>';
      tc.preconditions.forEach(p => { description += `<li>${p}</li>`; });
      description += '</ul>';
    }
    
    if (tc.testData) {
      description += '<h3>Test Data</h3><table border="1"><tbody>';
      for (const [key, value] of Object.entries(tc.testData)) {
        description += `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`;
      }
      description += '</tbody></table>';
    }

    if (tc.executionSteps && tc.executionSteps.length > 0) {
      description += '<h3>Execution Steps</h3><table border="1"><thead><tr><th>Step #</th><th>Action</th><th>Expected Result</th></tr></thead><tbody>';
      tc.executionSteps.forEach(step => {
        description += `<tr><td>${step.stepNumber}</td><td>${step.action}</td><td>${step.expectedResult}</td></tr>`;
      });
      description += '</tbody></table>';
    }

    if (tc.notes) {
      description += `<h3>Notes</h3><p>${tc.notes}</p>`;
    }

    // Build Acceptance Criteria HTML (Edge Cases)
    let acceptanceCriteria = '';
    if (tc.edgeCases && tc.edgeCases.length > 0) {
      acceptanceCriteria += '<h3>Edge Cases / Negative Tests</h3>';
      tc.edgeCases.forEach(ec => {
        acceptanceCriteria += `<h4>${ec.scenario}</h4><p><strong>Action:</strong> ${ec.action}</p><p><strong>Expected:</strong> ${ec.expectedResult}</p>`;
      });
    }

    const row = [
      'Test Case',
      `[${tc.testID}] ${tc.processName}`,
      description,
      acceptanceCriteria,
      priorityNum,
      `${tc.processModule};${tc.priority}`
    ];

    rows.push(row.map(escapeCsv).join(','));
  });

  const csvContent = '\uFEFF' + rows.join('\n'); // Add UTF-8 BOM
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const dateStr = new Date().toISOString().split('T')[0];
  const safeModule = (processModule || 'Export').replace(/[^a-z0-9]/gi, '_');
  const fileName = `D365_TestCases_ADO_${safeModule}_${dateStr}.csv`;

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
