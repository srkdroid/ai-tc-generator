import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Sun, MoonStar, Settings, FlaskConical, Wand2, Sparkles } from 'lucide-react';

export default function Header({ onOpenApiKeyModal, onDemoClick, onGenerate, isGenerating, canGenerate }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="glass sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
          <Sparkles size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">D365 Test Case Generator</h1>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="btn-ghost" title="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <MoonStar size={20} />}
        </button>
        
        <button onClick={onOpenApiKeyModal} className="btn-ghost" title="API Key Settings">
          <Settings size={20} />
        </button>

        <button 
          onClick={onDemoClick} 
          className="btn border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-purple-800/50 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/40 transition-colors"
        >
          <FlaskConical size={16} />
          Try Demo
        </button>

        <button 
          onClick={onGenerate} 
          disabled={!canGenerate || isGenerating}
          className="btn px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:shadow-glow transition-all duration-300 border-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none font-semibold tracking-wide"
        >
          <Wand2 size={16} className={isGenerating ? "animate-pulse" : ""} />
          {isGenerating ? 'Generating...' : 'Generate Test Cases'}
        </button>
      </div>
    </header>
  );
}

Header.propTypes = {
  onOpenApiKeyModal: PropTypes.func.isRequired,
  onDemoClick: PropTypes.func.isRequired,
  onGenerate: PropTypes.func.isRequired,
  isGenerating: PropTypes.bool.isRequired,
  canGenerate: PropTypes.bool.isRequired,
};
