import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { UploadCloud, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { extractTextFromFile, MAX_FILE_SIZE } from '../services/documentExtraction';

export default function DocumentUpload({ onDocumentParsed, onClearDocument }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (selectedFile) => {
    setError(null);
    
    if (!selectedFile) return;
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    const isValidType = selectedFile.type === 'application/pdf' || 
                        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                        selectedFile.name.endsWith('.docx');
                        
    if (!isValidType) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const extractedText = await extractTextFromFile(selectedFile);
      onDocumentParsed(extractedText);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to extract text from document.');
      setFile(null);
      onClearDocument();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
    onClearDocument();
  };

  return (
    <div className="card p-4 flex flex-col gap-5 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold">Document Upload</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Upload a Functional Design Document (FDD). The AI will analyze the requirements and auto-generate the corresponding test cases.
      </p>

      {!file ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-4 transition-colors text-center cursor-pointer
            ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-slate-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <UploadCloud size={48} className="text-gray-400 dark:text-gray-500" />
          <div>
            <span className="font-semibold text-blue-500">Click to upload</span> or drag and drop
          </div>
          <span className="text-xs text-gray-500">PDF or Word (DOCX) up to 5MB</span>
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileInput}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="p-4 border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg flex items-start justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-emerald-500" size={24} />
              <div className="flex flex-col">
                <span className="font-semibold text-sm truncate max-w-[200px] sm:max-w-[250px]">{file.name}</span>
                <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
            <button 
              onClick={handleClear}
              className="p-1 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded text-gray-500 hover:text-red-500"
              title="Remove document"
            >
              <X size={18} />
            </button>
          </div>
          
          {isProcessing && (
            <div className="text-sm flex items-center justify-center gap-2 text-blue-500 animate-pulse py-4">
              <UploadCloud className="animate-bounce" size={18} />
              Extracting text from document...
            </div>
          )}
          
          {!isProcessing && !error && (
            <div className="text-sm flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
              <CheckCircle size={18} />
              Document successfully parsed! Ready to generate.
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="text-sm flex items-start gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-900/30">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

DocumentUpload.propTypes = {
  onDocumentParsed: PropTypes.func.isRequired,
  onClearDocument: PropTypes.func.isRequired,
};
