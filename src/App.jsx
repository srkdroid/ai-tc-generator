import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ProcessSelector from './components/ProcessSelector';
import ContextForm from './components/ContextForm';
import TestCasePreview from './components/TestCasePreview';
import LoadingState from './components/LoadingState';
import ExportPanel from './components/ExportPanel';
import Disclaimer from './components/Disclaimer';
import ApiKeyModal, { getApiKey } from './components/ApiKeyModal';
import DocumentUpload from './components/DocumentUpload';

import { DEMO_CONTEXT, DEMO_TEST_CASES } from './data/demoData';
import { getProcessById } from './data/processes';
import { generateTestCases } from './services/groqService';
import { exportToExcel } from './services/excelExport';
import { exportToAdoCsv } from './services/adoExport';

export default function App() {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  
  // App State
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [inputMode, setInputMode] = useState('manual'); // 'manual' | 'document'
  const [documentText, setDocumentText] = useState('');
  
  const [context, setContext] = useState({
    legalEntityCount: 1,
    hasCustomisations: false,
    customisationDetails: '',
    integrations: [],
    currencies: [],
    multiCountryRollout: false,
    additionalNotes: ''
  });
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [error, setError] = useState(null);
  const [generationProgress, setGenerationProgress] = useState('');

  const handleDemoClick = () => {
    const demoProcess = getProcessById(DEMO_CONTEXT.processId);
    if (demoProcess) {
      setSelectedProcess(demoProcess);
    }
    
    setInputMode('manual');
    setContext({
      legalEntityCount: DEMO_CONTEXT.legalEntityCount,
      hasCustomisations: DEMO_CONTEXT.hasCustomisations,
      customisationDetails: DEMO_CONTEXT.customisationDetails,
      integrations: [...DEMO_CONTEXT.integrations],
      currencies: [...DEMO_CONTEXT.currencies],
      multiCountryRollout: DEMO_CONTEXT.multiCountryRollout,
      additionalNotes: DEMO_CONTEXT.additionalNotes
    });
  };

  const handleGenerate = async () => {
    if (!selectedProcess) return;

    const apiKey = getApiKey();
    if (!apiKey) {
      setIsApiKeyModalOpen(true);
      return;
    }

    if (inputMode === 'document' && !documentText) {
      setError('Please upload a document before generating.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setTestCases([]);
    setGenerationProgress('');

    try {
      const generated = await generateTestCases(
        selectedProcess,
        inputMode === 'manual' ? context : null,
        inputMode === 'document' ? documentText : null,
        apiKey,
        (progress) => setGenerationProgress(progress)
      );
      setTestCases(generated);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportExcel = useCallback(() => {
    exportToExcel(testCases, selectedProcess?.module);
  }, [testCases, selectedProcess]);

  const handleExportCSV = useCallback(() => {
    exportToAdoCsv(testCases, selectedProcess?.module);
  }, [testCases, selectedProcess]);

  const canGenerate = !!selectedProcess && (inputMode === 'manual' || (inputMode === 'document' && !!documentText));

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onDemoClick={handleDemoClick}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        canGenerate={canGenerate}
      />

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-73px)]">
        
        {/* Left Sidebar (Configuration) */}
        <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col gap-6 shrink-0 h-full overflow-hidden">
          <ProcessSelector 
            selectedProcess={selectedProcess}
            onSelectProcess={setSelectedProcess}
          />

          <div className="flex flex-col gap-2">
            <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${inputMode === 'manual' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                onClick={() => setInputMode('manual')}
              >
                Manual Context
              </button>
              <button
                className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${inputMode === 'document' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                onClick={() => setInputMode('document')}
              >
                Upload FDD
              </button>
            </div>

            {inputMode === 'manual' ? (
              <ContextForm 
                context={context}
                onContextChange={setContext}
              />
            ) : (
              <DocumentUpload 
                onDocumentParsed={setDocumentText}
                onClearDocument={() => setDocumentText('')}
              />
            )}
          </div>
        </div>

        {/* Right Main Area (Preview) */}
        <div className="flex-1 card overflow-y-auto relative h-full">
          {error && (
            <div className="m-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-red-600 dark:text-red-400 text-sm">
              <strong className="font-semibold block mb-1">Error Generating Test Cases</strong>
              {error}
            </div>
          )}

          {isGenerating ? (
            <LoadingState />
          ) : (
            <TestCasePreview testCases={testCases} />
          )}

          {!isGenerating && testCases.length > 0 && (
            <ExportPanel 
              testCases={testCases}
              onExportExcel={handleExportExcel}
              onExportCSV={handleExportCSV}
            />
          )}
        </div>

      </main>

      <Disclaimer />

      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
      />
    </div>
  );
}
