import React from 'react';
import PropTypes from 'prop-types';
import { X, Key, Settings, Play, FlaskConical, Wand2, FileText, CheckCircle2 } from 'lucide-react';

export default function UserGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay z-50">
      <div className="modal-content relative flex flex-col p-0">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="text-blue-500" size={24} />
            Quick Start Guide
          </h2>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col gap-8">
          
          <div className="flex gap-4">
            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-lg">
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Set your API Key</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                This application requires a Groq API key to generate test cases. Don't worry, it is stored securely on your local device and never sent anywhere else.
              </p>
              <div className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-700">
                <Settings size={16} className="text-gray-500" />
                <span>Click the <strong>Settings (Gear)</strong> icon in the top right header to paste your key.</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-lg">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Select a Process & Context</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Use the left sidebar to choose what you want to test.
              </p>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex gap-2">
                  <FileText className="text-emerald-500 shrink-0" size={18} />
                  <span><strong>Process Selector:</strong> Browse the catalog or type to search. You can also define a completely Custom Process at the bottom!</span>
                </li>
                <li className="flex gap-2">
                  <FileText className="text-emerald-500 shrink-0" size={18} />
                  <span><strong>Input Mode:</strong> Choose "Manual Context" to fill out a short form about your project, or "Upload FDD" to drag-and-drop a PDF/Word document containing your requirements.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-lg">
              3
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Generate & Export</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Once everything is set, let the AI do the heavy lifting!
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-700">
                  <Wand2 size={16} className="text-blue-500" />
                  <span>Click <strong>Generate Test Cases</strong> in the top right. Watch them stream in!</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-700">
                  <FlaskConical size={16} className="text-purple-500" />
                  <span>No key yet? Just click <strong>Try Demo</strong> to instantly see how it works!</span>
                </div>
              </div>
            </div>
          </div>

        </div>
        
        <div className="border-t border-gray-200 dark:border-slate-700 p-6">
          <button onClick={onClose} className="btn btn-primary w-full py-2.5">
            Got it, let's go!
          </button>
        </div>
      </div>
    </div>
  );
}

UserGuideModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
