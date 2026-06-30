import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Search, ChevronDown, ChevronRight, FileText, Receipt, BookOpen, Landmark, Building2, FolderKanban } from 'lucide-react';
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
  const [expandedModules, setExpandedModules] = useState({});

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
          <div className="flex flex-col gap-2">
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
