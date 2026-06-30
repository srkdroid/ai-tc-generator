import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Search, ChevronDown, ChevronRight, FileText, Receipt, BookOpen, Landmark, Building2, FolderKanban, PlusCircle, CheckCircle2, Edit2 } from 'lucide-react';
import { PROCESS_TREE, searchProcesses } from '../data/processes';

const iconMap = {
  FileText: <FileText size={18} />,
  Receipt: <Receipt size={18} />,
  BookOpen: <BookOpen size={18} />,
  Landmark: <Landmark size={18} />,
  Building2: <Building2 size={18} />,
  FolderKanban: <FolderKanban size={18} />
};

export default function ProcessSelector({ selectedProcess, onSelectProcess }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState({ custom: false });
  const [customProcess, setCustomProcess] = useState({ name: '', module: 'Custom Module', id: 'custom-process', bpcSequenceId: 'CUSTOM-001' });

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const searchResults = searchQuery ? searchProcesses(searchQuery) : null;

  return (
    <div className="card p-4 flex flex-col gap-4 h-[calc(100vh-160px)] overflow-y-auto">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        Process Selection
      </h2>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input 
          type="text" 
          placeholder="Search processes..." 
          className="input-field pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {selectedProcess && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex flex-col gap-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Currently Selected
            </span>
            {selectedProcess.id === 'custom-process' && (
              <button 
                onClick={() => setExpandedModules(prev => ({ ...prev, custom: true }))}
                className="text-blue-500 hover:text-blue-700 p-1"
                title="Edit Custom Process"
              >
                <Edit2 size={14} />
              </button>
            )}
          </div>
          <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {selectedProcess.name}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge badge-blue text-[10px]">{selectedProcess.bpcSequenceId}</span>
            <span className="text-xs text-gray-500">{selectedProcess.module}</span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-2">
        {searchResults ? (
          <div className="flex flex-col gap-2">
            {searchResults.length === 0 && <p className="text-sm text-gray-500">No processes found.</p>}
            {searchResults.map(process => (
              <button
                key={process.id}
                onClick={() => onSelectProcess(process)}
                className={`flex flex-col items-start p-3 rounded-lg border text-left transition-colors ${
                  selectedProcess?.id === process.id 
                    ? 'bg-blue-500/10 border-blue-500' 
                    : 'border-transparent hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-sm">{process.name}</span>
                  <span className="badge badge-blue">{process.bpcSequenceId}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">{process.module}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 pb-4">
            {PROCESS_TREE.map(module => {
              const isExpanded = expandedModules[module.id] ?? true; // Default expanded
              return (
                <div key={module.id} className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <button 
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex items-center gap-2 font-medium text-sm">
                      {iconMap[module.icon]}
                      {module.name}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <span className="text-xs">{module.processes.length}</span>
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </button>
                  
                  <div className={`collapsible-content ${isExpanded ? 'open' : ''}`}>
                    <div className="p-2 flex flex-col gap-1 bg-white dark:bg-slate-900">
                      {module.processes.map(process => (
                        <button
                          key={process.id}
                          onClick={() => onSelectProcess({...process, module: module.name, moduleId: module.id})}
                          className={`flex flex-col items-start p-2 rounded-md transition-colors ${
                            selectedProcess?.id === process.id 
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                              : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm">{process.name}</span>
                            <span className="text-[10px] opacity-60 font-mono">{process.bpcSequenceId}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Custom Process Accordion */}
            <div className="border border-blue-200 dark:border-blue-900/50 rounded-lg overflow-hidden mt-4">
              <button 
                className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                onClick={() => toggleModule('custom')}
              >
                <div className="flex items-center gap-2 font-medium text-sm text-blue-700 dark:text-blue-300">
                  <PlusCircle size={18} />
                  Add Custom Process
                </div>
                <div className="flex items-center gap-2 text-blue-500">
                  {expandedModules['custom'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              </button>
              
              <div className={`collapsible-content ${expandedModules['custom'] ? 'open' : ''}`}>
                <div className="p-4 flex flex-col gap-3 bg-white dark:bg-slate-900">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Process Name</label>
                    <input 
                      type="text" 
                      className="input-field py-1.5 text-sm" 
                      placeholder="e.g. Advanced Vendor Onboarding"
                      value={customProcess.name}
                      onChange={(e) => {
                        const updated = { ...customProcess, name: e.target.value };
                        setCustomProcess(updated);
                        if (selectedProcess?.id === 'custom-process' || updated.name.length > 2) {
                          onSelectProcess(updated);
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Module / Category</label>
                    <input 
                      type="text" 
                      className="input-field py-1.5 text-sm" 
                      placeholder="e.g. Procurement"
                      value={customProcess.module}
                      onChange={(e) => {
                        const updated = { ...customProcess, module: e.target.value };
                        setCustomProcess(updated);
                        if (selectedProcess?.id === 'custom-process') {
                          onSelectProcess(updated);
                        }
                      }}
                    />
                  </div>
                  <button 
                    onClick={() => {
                      onSelectProcess(customProcess);
                      setExpandedModules(prev => ({ ...prev, custom: false }));
                    }}
                    disabled={!customProcess.name.trim()}
                    className={`btn btn-sm mt-1 flex items-center justify-center gap-2 ${selectedProcess?.id === 'custom-process' ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-none' : 'btn-outline text-blue-600'}`}
                  >
                    {selectedProcess?.id === 'custom-process' ? (
                      <>
                        <CheckCircle2 size={16} />
                        Selected
                      </>
                    ) : 'Use Custom Process'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

ProcessSelector.propTypes = {
  selectedProcess: PropTypes.object,
  onSelectProcess: PropTypes.func.isRequired,
};
